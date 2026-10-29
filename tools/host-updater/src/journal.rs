//! Private operation-journal storage, without host execution authority.
//!
//! Existing private `root` and permanent operation-lock files are required. The
//! lock is never created, removed or replaced. All dependent filesystem access
//! uses held directory descriptors; replacing a root or lock pathname refuses
//! the next API operation. Same-UID ownership is used so isolated fixtures can
//! exercise the real implementation without requiring host root.
//!
//! `operations/<id>/request.json` and `events/<020-sequence>.json` are immutable
//! 0400 files. Event JSON fields are `format,operation_id,request_sha256,sequence,
//! previous_sha256,event`; event zero is `{"phase":"accepted"}` with a zero
//! previous hash. Each later canonical event hashes the previous event bytes.
//! `status.json` is an atomic 0400 projection with `format,status,
//! last_event_sha256`. Its missing or older *valid* projection is repairable from
//! the complete journal; malformed, future or conflicting projections refuse.
//! Crash-left `status-<32hex>.pending` projections are retained as nonauthority.
//!
//! Adjacent phases are accepted -> preparing -> prepared -> fencing -> backed_up
//! -> replacing -> checking. Rejected/no_change are pre-fence outcomes;
//! succeeded/rolled_back_current_data require checking. Failed_safe/uncertain may
//! terminate any phase. A terminal record is immutable. Uncertain remains an
//! unresolved admission barrier. These are storage transitions, not evidence that
//! a host action happened or an installed generation was adopted.

use crate::protocol::{parse_request, sha256};
use serde::{Deserialize, Serialize};
use std::ffi::{CString, OsStr};
use std::fmt;
use std::fs::{self, File};
use std::io::{Read, Write};
use std::os::fd::{AsRawFd, FromRawFd};
use std::os::unix::ffi::OsStrExt;
use std::os::unix::fs::{MetadataExt, PermissionsExt};
use std::path::{Component, Path, PathBuf};
use std::sync::Mutex;

const MAX_OPERATIONS: usize = 1024;
const MAX_EVENTS: usize = 4096;
const MAX_PENDING: usize = 16;
const MAX_RECORD: usize = 4096;
const MAX_REQUEST: usize = 16_384;
const ZERO_HASH: &str = "0000000000000000000000000000000000000000000000000000000000000000";

/// Sanitized storage errors. No private pathname or request content is emitted.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum JournalError {
    InvalidPath,
    UnsafeFile,
    Busy,
    LockChanged,
    InvalidRequest,
    Conflict,
    Unresolved,
    Corrupt,
    Limit,
    Io,
}

impl fmt::Display for JournalError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.write_str(match self {
            Self::InvalidPath => "journal path rejected",
            Self::UnsafeFile => "journal ownership or file admission rejected",
            Self::Busy => "operation lock busy",
            Self::LockChanged => "permanent operation lock or root identity changed",
            Self::InvalidRequest => "effect request rejected",
            Self::Conflict => "journal request or sequence conflict",
            Self::Unresolved => "earlier operation remains unresolved",
            Self::Corrupt => "journal evidence incomplete or conflicting",
            Self::Limit => "journal bound exceeded",
            Self::Io => "journal filesystem operation failed",
        })
    }
}

impl std::error::Error for JournalError {}
type Result<T> = std::result::Result<T, JournalError>;

#[derive(Clone, Copy, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum Phase {
    Accepted,
    Preparing,
    Prepared,
    Fencing,
    BackedUp,
    Replacing,
    Checking,
}

#[derive(Clone, Copy, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum Disposition {
    Rejected,
    NoChange,
    FailedSafe,
    Succeeded,
    RolledBackCurrentData,
    Uncertain,
}

#[derive(Clone, Copy, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum Event {
    Phase(Phase),
    Terminal(Disposition),
}

#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Status {
    pub operation_id: String,
    pub request_sha256: String,
    pub sequence: u64,
    pub phase: Phase,
    pub disposition: Option<Disposition>,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Admission {
    pub operation_id: String,
    pub request_sha256: String,
    pub status: Status,
    pub reused: bool,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct Record {
    format: u32,
    operation_id: String,
    request_sha256: String,
    sequence: u64,
    previous_sha256: String,
    event: Event,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct Projection {
    format: u32,
    status: Status,
    last_event_sha256: String,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
struct Identity {
    device: u64,
    inode: u64,
}

fn identity(file: &File) -> Result<Identity> {
    let m = file.metadata().map_err(|_| JournalError::Io)?;
    Ok(Identity {
        device: m.dev(),
        inode: m.ino(),
    })
}

fn c_name(name: &OsStr) -> Result<CString> {
    let bytes = name.as_bytes();
    if bytes.is_empty() || bytes == b"." || bytes == b".." || bytes.contains(&b'/') {
        return Err(JournalError::InvalidPath);
    }
    CString::new(bytes).map_err(|_| JournalError::InvalidPath)
}

fn open_at(parent: &File, name: &OsStr, flags: i32, mode: u32) -> Result<File> {
    let name = c_name(name)?;
    // SAFETY: the CString is NUL-terminated and parent remains held for this call.
    let fd = unsafe {
        libc::openat(
            parent.as_raw_fd(),
            name.as_ptr(),
            flags | libc::O_NOFOLLOW | libc::O_CLOEXEC | libc::O_NONBLOCK,
            mode as libc::mode_t,
        )
    };
    if fd < 0 {
        return Err(JournalError::UnsafeFile);
    }
    // SAFETY: successful openat returned a fresh uniquely owned descriptor.
    Ok(unsafe { File::from_raw_fd(fd) })
}

fn private_dir(file: &File, uid: u32) -> Result<()> {
    let m = file.metadata().map_err(|_| JournalError::Io)?;
    if !m.is_dir() || m.uid() != uid || m.mode() & 0o7777 != 0o700 {
        return Err(JournalError::UnsafeFile);
    }
    Ok(())
}

fn admitted_file(file: &File, uid: u32, mode: u32, max: usize) -> Result<()> {
    let m = file.metadata().map_err(|_| JournalError::Io)?;
    if !m.is_file()
        || m.uid() != uid
        || m.mode() & 0o7777 != mode
        || m.nlink() != 1
        || m.len() > max as u64
    {
        return Err(JournalError::UnsafeFile);
    }
    Ok(())
}

fn absolute_dir(path: &Path, uid: u32) -> Result<File> {
    if !path.is_absolute()
        || path
            .as_os_str()
            .as_bytes()
            .split(|c| *c == b'/')
            .any(|c| c == b"." || c == b"..")
    {
        return Err(JournalError::InvalidPath);
    }
    let mut dir = File::open("/").map_err(|_| JournalError::Io)?;
    for component in path.components() {
        let Component::Normal(name) = component else {
            if component == Component::RootDir {
                continue;
            }
            return Err(JournalError::InvalidPath);
        };
        dir = open_at(&dir, name, libc::O_RDONLY | libc::O_DIRECTORY, 0)?;
        let m = dir.metadata().map_err(|_| JournalError::Io)?;
        let trusted_sticky = m.uid() == 0 && m.mode() & libc::S_ISVTX != 0;
        if !m.is_dir()
            || (m.uid() != uid && m.uid() != 0)
            || (m.mode() & 0o022 != 0 && !trusted_sticky)
        {
            return Err(JournalError::UnsafeFile);
        }
    }
    Ok(dir)
}

fn child_dir(parent: &File, name: &str, uid: u32) -> Result<File> {
    let dir = open_at(
        parent,
        OsStr::new(name),
        libc::O_RDONLY | libc::O_DIRECTORY,
        0,
    )?;
    private_dir(&dir, uid)?;
    Ok(dir)
}

fn mkdir_new(parent: &File, name: &str, uid: u32) -> Result<File> {
    let name_c = c_name(OsStr::new(name))?;
    // SAFETY: parent is a held directory and name_c is a single valid component.
    if unsafe { libc::mkdirat(parent.as_raw_fd(), name_c.as_ptr(), 0o700) } != 0 {
        return Err(JournalError::Conflict);
    }
    let dir = open_at(
        parent,
        OsStr::new(name),
        libc::O_RDONLY | libc::O_DIRECTORY,
        0,
    )?;
    dir.set_permissions(fs::Permissions::from_mode(0o700))
        .map_err(|_| JournalError::Io)?;
    private_dir(&dir, uid)?;
    parent.sync_all().map_err(|_| JournalError::Io)?;
    Ok(dir)
}

fn exists(parent: &File, name: &str) -> Result<bool> {
    let name = c_name(OsStr::new(name))?;
    let mut stat = std::mem::MaybeUninit::<libc::stat>::uninit();
    // SAFETY: stat points to writable storage; name and parent live through call.
    let result = unsafe {
        libc::fstatat(
            parent.as_raw_fd(),
            name.as_ptr(),
            stat.as_mut_ptr(),
            libc::AT_SYMLINK_NOFOLLOW,
        )
    };
    if result == 0 {
        return Ok(true);
    }
    if std::io::Error::last_os_error().raw_os_error() == Some(libc::ENOENT) {
        Ok(false)
    } else {
        Err(JournalError::Io)
    }
}

fn names(dir: &File, max: usize) -> Result<Vec<String>> {
    // The proc path resolves only this already-held descriptor, never a caller path.
    let entries = fs::read_dir(format!("/proc/self/fd/{}", dir.as_raw_fd()))
        .map_err(|_| JournalError::Io)?;
    let mut result = Vec::new();
    for entry in entries {
        if result.len() == max {
            return Err(JournalError::Limit);
        }
        let name = entry
            .map_err(|_| JournalError::Io)?
            .file_name()
            .into_string()
            .map_err(|_| JournalError::Corrupt)?;
        result.push(name);
    }
    result.sort();
    Ok(result)
}

fn read_file(parent: &File, name: &str, uid: u32, mode: u32, max: usize) -> Result<Vec<u8>> {
    let mut file = open_at(parent, OsStr::new(name), libc::O_RDONLY, 0)?;
    admitted_file(&file, uid, mode, max)?;
    let before = identity(&file)?;
    let mut bytes = Vec::new();
    (&mut file)
        .take((max + 1) as u64)
        .read_to_end(&mut bytes)
        .map_err(|_| JournalError::Io)?;
    admitted_file(&file, uid, mode, max)?;
    if bytes.len() > max || identity(&file)? != before {
        return Err(JournalError::Corrupt);
    }
    Ok(bytes)
}

fn write_new(parent: &File, name: &str, bytes: &[u8], uid: u32) -> Result<()> {
    let mut file = open_at(
        parent,
        OsStr::new(name),
        libc::O_WRONLY | libc::O_CREAT | libc::O_EXCL,
        0o600,
    )?;
    file.write_all(bytes).map_err(|_| JournalError::Io)?;
    file.set_permissions(fs::Permissions::from_mode(0o400))
        .map_err(|_| JournalError::Io)?;
    admitted_file(&file, uid, 0o400, bytes.len())?;
    file.sync_all().map_err(|_| JournalError::Io)?;
    parent.sync_all().map_err(|_| JournalError::Io)
}

fn valid_hex(value: &str, length: usize) -> bool {
    value.len() == length
        && value
            .bytes()
            .all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b))
}

fn next(status: &Status, event: Event) -> Result<Status> {
    if status.disposition.is_some() {
        return Err(JournalError::Conflict);
    }
    let mut result = status.clone();
    result.sequence = result.sequence.checked_add(1).ok_or(JournalError::Limit)?;
    match event {
        Event::Phase(phase) => {
            let allowed = matches!(
                (status.phase, phase),
                (Phase::Accepted, Phase::Preparing)
                    | (Phase::Preparing, Phase::Prepared)
                    | (Phase::Prepared, Phase::Fencing)
                    | (Phase::Fencing, Phase::BackedUp)
                    | (Phase::BackedUp, Phase::Replacing)
                    | (Phase::Replacing, Phase::Checking)
            );
            if !allowed {
                return Err(JournalError::Conflict);
            }
            result.phase = phase;
        }
        Event::Terminal(disposition) => {
            let pre_fence = matches!(
                status.phase,
                Phase::Accepted | Phase::Preparing | Phase::Prepared
            );
            let allowed = match disposition {
                Disposition::Rejected | Disposition::NoChange => pre_fence,
                Disposition::Succeeded | Disposition::RolledBackCurrentData => {
                    status.phase == Phase::Checking
                }
                Disposition::FailedSafe | Disposition::Uncertain => true,
            };
            if !allowed {
                return Err(JournalError::Conflict);
            }
            result.disposition = Some(disposition);
        }
    }
    Ok(result)
}

struct Loaded {
    status: Status,
    hash: String,
    history: Vec<(Status, String)>,
}

/// One holder of the existing permanent operation lock. No host effects exist.
pub struct Journal {
    root_path: PathBuf,
    root: File,
    operations: File,
    lock_path: PathBuf,
    lock: File,
    uid: u32,
    gate: Mutex<()>,
}

impl Journal {
    pub fn open(root: &Path, operation_lock: &Path) -> Result<Self> {
        // SAFETY: geteuid takes no arguments and has no memory-safety preconditions.
        let uid = unsafe { libc::geteuid() };
        let root_file = absolute_dir(root, uid)?;
        private_dir(&root_file, uid)?;
        let lock_parent = operation_lock.parent().ok_or(JournalError::InvalidPath)?;
        let lock_name = operation_lock.file_name().ok_or(JournalError::InvalidPath)?;
        let lock_parent = absolute_dir(lock_parent, uid)?;
        let lock = open_at(&lock_parent, lock_name, libc::O_RDWR, 0)?;
        admitted_file(&lock, uid, 0o600, MAX_RECORD)?;
        // SAFETY: lock is held, valid and exclusively owned by this instance.
        if unsafe { libc::flock(lock.as_raw_fd(), libc::LOCK_EX | libc::LOCK_NB) } != 0 {
            return Err(if matches!(
                std::io::Error::last_os_error().raw_os_error(),
                Some(libc::EWOULDBLOCK)
            ) {
                JournalError::Busy
            } else {
                JournalError::Io
            });
        }
        let reopened = open_at(&lock_parent, lock_name, libc::O_RDWR, 0)?;
        admitted_file(&reopened, uid, 0o600, MAX_RECORD)?;
        if identity(&reopened)? != identity(&lock)? {
            return Err(JournalError::LockChanged);
        }
        let operations = if exists(&root_file, "operations")? {
            child_dir(&root_file, "operations", uid)?
        } else {
            mkdir_new(&root_file, "operations", uid)?
        };
        let journal = Self {
            root_path: root.to_path_buf(),
            root: root_file,
            operations,
            lock_path: operation_lock.to_path_buf(),
            lock,
            uid,
            gate: Mutex::new(()),
        };
        journal.validate_base()?;
        Ok(journal)
    }

    fn validate_base(&self) -> Result<()> {
        private_dir(&self.root, self.uid)?;
        private_dir(&self.operations, self.uid)?;
        admitted_file(&self.lock, self.uid, 0o600, MAX_RECORD)?;
        let root = absolute_dir(&self.root_path, self.uid)?;
        private_dir(&root, self.uid)?;
        if identity(&root)? != identity(&self.root)? {
            return Err(JournalError::LockChanged);
        }
        let operations = child_dir(&root, "operations", self.uid)?;
        if identity(&operations)? != identity(&self.operations)? {
            return Err(JournalError::LockChanged);
        }
        let parent = self.lock_path.parent().ok_or(JournalError::InvalidPath)?;
        let name = self
            .lock_path
            .file_name()
            .ok_or(JournalError::InvalidPath)?;
        let parent = absolute_dir(parent, self.uid)?;
        let lock = open_at(&parent, name, libc::O_RDWR, 0)?;
        admitted_file(&lock, self.uid, 0o600, MAX_RECORD)?;
        if identity(&lock)? != identity(&self.lock)? {
            return Err(JournalError::LockChanged);
        }
        Ok(())
    }

    fn operation(&self, operation_id: &str) -> Result<File> {
        if !valid_hex(operation_id, 32) {
            return Err(JournalError::InvalidRequest);
        }
        child_dir(&self.operations, operation_id, self.uid)
    }

    fn validate_operation(&self, operation_id: &str, operation: &File) -> Result<()> {
        self.validate_base()?;
        let current = self.operation(operation_id)?;
        if identity(&current)? != identity(operation)? {
            return Err(JournalError::LockChanged);
        }
        Ok(())
    }

    fn validate_entries(&self, operation: &File) -> Result<usize> {
        let mut pending = 0usize;
        for name in names(operation, MAX_PENDING + 3)? {
            if matches!(name.as_str(), "request.json" | "events" | "status.json") {
                continue;
            }
            if name
                .strip_prefix("status-")
                .and_then(|v| v.strip_suffix(".pending"))
                .is_some_and(|v| valid_hex(v, 32))
            {
                pending += 1;
                let file = open_at(operation, OsStr::new(&name), libc::O_RDONLY, 0)?;
                let mode = file.metadata().map_err(|_| JournalError::Io)?.mode() & 0o7777;
                if !matches!(mode, 0o400 | 0o600) {
                    return Err(JournalError::UnsafeFile);
                }
                admitted_file(&file, self.uid, mode, MAX_RECORD)?;
            } else {
                return Err(JournalError::Corrupt);
            }
        }
        if pending > MAX_PENDING {
            return Err(JournalError::Limit);
        }
        Ok(pending)
    }

    fn load(&self, operation_id: &str, operation: &File) -> Result<Loaded> {
        self.validate_entries(operation)?;
        let request = read_file(operation, "request.json", self.uid, 0o400, MAX_REQUEST)?;
        let request_hash = sha256(&request);
        let parsed = parse_request(&request, &request_hash).map_err(|_| JournalError::Corrupt)?;
        if !matches!(parsed.command(), "apply" | "rollback")
            || parsed.operation_id() != Some(operation_id)
        {
            return Err(JournalError::Corrupt);
        }
        let events = child_dir(operation, "events", self.uid)?;
        let event_names = names(&events, MAX_EVENTS)?;
        if event_names.is_empty() {
            return Err(JournalError::Corrupt);
        }
        let mut history = Vec::new();
        let mut previous = ZERO_HASH.to_owned();
        let mut status = Status {
            operation_id: operation_id.to_owned(),
            request_sha256: request_hash.clone(),
            sequence: 0,
            phase: Phase::Accepted,
            disposition: None,
        };
        for (index, name) in event_names.iter().enumerate() {
            if *name != format!("{index:020}.json") {
                return Err(JournalError::Corrupt);
            }
            let bytes = read_file(&events, name, self.uid, 0o400, MAX_RECORD)?;
            let record: Record =
                serde_json::from_slice(&bytes).map_err(|_| JournalError::Corrupt)?;
            if serde_json::to_vec(&record).map_err(|_| JournalError::Corrupt)? != bytes
                || record.format != 1
                || record.operation_id != operation_id
                || record.request_sha256 != request_hash
                || record.sequence != index as u64
                || record.previous_sha256 != previous
            {
                return Err(JournalError::Corrupt);
            }
            if index == 0 {
                if record.event != Event::Phase(Phase::Accepted) {
                    return Err(JournalError::Corrupt);
                }
            } else {
                status = next(&status, record.event).map_err(|_| JournalError::Corrupt)?;
            }
            previous = sha256(&bytes);
            history.push((status.clone(), previous.clone()));
        }
        Ok(Loaded {
            status,
            hash: previous,
            history,
        })
    }

    fn write_projection(&self, operation_id: &str, operation: &File, loaded: &Loaded) -> Result<()> {
        self.validate_operation(operation_id, operation)?;
        if self.validate_entries(operation)? >= MAX_PENDING {
            return Err(JournalError::Limit);
        }
        let mut nonce = [0u8; 16];
        getrandom::fill(&mut nonce).map_err(|_| JournalError::Io)?;
        let nonce: String = nonce.iter().map(|b| format!("{b:02x}")).collect();
        let pending = format!("status-{nonce}.pending");
        let projection = Projection {
            format: 1,
            status: loaded.status.clone(),
            last_event_sha256: loaded.hash.clone(),
        };
        let bytes = serde_json::to_vec(&projection).map_err(|_| JournalError::Io)?;
        if bytes.len() > MAX_RECORD {
            return Err(JournalError::Limit);
        }
        write_new(operation, &pending, &bytes, self.uid)?;
        self.validate_operation(operation_id, operation)?;
        let pending = c_name(OsStr::new(&pending))?;
        let target = c_name(OsStr::new("status.json"))?;
        // SAFETY: both names are valid single components in the held private dir.
        if unsafe {
            libc::renameat(
                operation.as_raw_fd(),
                pending.as_ptr(),
                operation.as_raw_fd(),
                target.as_ptr(),
            )
        } != 0
        {
            return Err(JournalError::Io);
        }
        operation.sync_all().map_err(|_| JournalError::Io)
    }

    fn repair_projection(&self, operation_id: &str, operation: &File, loaded: &Loaded) -> Result<()> {
        if !exists(operation, "status.json")? {
            return self.write_projection(operation_id, operation, loaded);
        }
        let bytes = read_file(operation, "status.json", self.uid, 0o400, MAX_RECORD)?;
        let projection: Projection =
            serde_json::from_slice(&bytes).map_err(|_| JournalError::Corrupt)?;
        if serde_json::to_vec(&projection).map_err(|_| JournalError::Corrupt)? != bytes
            || projection.format != 1
            || !valid_hex(&projection.last_event_sha256, 64)
        {
            return Err(JournalError::Corrupt);
        }
        let index = usize::try_from(projection.status.sequence).map_err(|_| JournalError::Corrupt)?;
        let Some((expected_status, expected_hash)) = loaded.history.get(index) else {
            return Err(JournalError::Corrupt);
        };
        if &projection.status != expected_status || &projection.last_event_sha256 != expected_hash {
            return Err(JournalError::Corrupt);
        }
        if projection.status.sequence != loaded.status.sequence {
            self.write_projection(operation_id, operation, loaded)?;
        }
        Ok(())
    }

    fn other_operations_resolved(&self, selected_id: &str, installation_id: &str) -> Result<()> {
        for operation_id in names(&self.operations, MAX_OPERATIONS)? {
            if !valid_hex(&operation_id, 32) {
                return Err(JournalError::Corrupt);
            }
            if operation_id == selected_id {
                continue;
            }
            let operation = self.operation(&operation_id)?;
            let loaded = self.load(&operation_id, &operation)?;
            self.repair_projection(&operation_id, &operation, &loaded)?;
            let request_bytes =
                read_file(&operation, "request.json", self.uid, 0o400, MAX_REQUEST)?;
            let request = parse_request(&request_bytes, &loaded.status.request_sha256)
                .map_err(|_| JournalError::Corrupt)?;
            if request.installation_id() != installation_id {
                return Err(JournalError::Conflict);
            }
            if loaded.status.disposition.is_none()
                || loaded.status.disposition == Some(Disposition::Uncertain)
            {
                return Err(JournalError::Unresolved);
            }
        }
        Ok(())
    }

    pub fn admit(&self, request_bytes: &[u8], expected_sha256: &str) -> Result<Admission> {
        let _gate = self.gate.lock().map_err(|_| JournalError::Corrupt)?;
        self.validate_base()?;
        let request =
            parse_request(request_bytes, expected_sha256).map_err(|_| JournalError::InvalidRequest)?;
        if !matches!(request.command(), "apply" | "rollback") {
            return Err(JournalError::InvalidRequest);
        }
        let operation_id = request.operation_id().ok_or(JournalError::InvalidRequest)?;
        let operation_names = names(&self.operations, MAX_OPERATIONS)?;
        let mut matched = None;
        let mut unresolved = false;
        for name in &operation_names {
            if !valid_hex(name, 32) {
                return Err(JournalError::Corrupt);
            }
            let operation = self.operation(name)?;
            let loaded = self.load(name, &operation)?;
            self.repair_projection(name, &operation, &loaded)?;
            let prior_bytes = read_file(&operation, "request.json", self.uid, 0o400, MAX_REQUEST)?;
            let prior_request = parse_request(&prior_bytes, &loaded.status.request_sha256)
                .map_err(|_| JournalError::Corrupt)?;
            if prior_request.installation_id() != request.installation_id() {
                return Err(JournalError::Conflict);
            }
            if name == operation_id {
                if prior_bytes != request_bytes || loaded.status.request_sha256 != expected_sha256 {
                    return Err(JournalError::Conflict);
                }
                matched = Some(loaded.status);
            } else if loaded.status.disposition.is_none()
                || loaded.status.disposition == Some(Disposition::Uncertain)
            {
                unresolved = true;
            }
        }
        if let Some(status) = matched {
            return Ok(Admission {
                operation_id: operation_id.to_owned(),
                request_sha256: expected_sha256.to_owned(),
                status,
                reused: true,
            });
        }
        if unresolved {
            return Err(JournalError::Unresolved);
        }
        if operation_names.len() == MAX_OPERATIONS {
            return Err(JournalError::Limit);
        }
        self.validate_base()?;
        let operation = mkdir_new(&self.operations, operation_id, self.uid)?;
        write_new(&operation, "request.json", request_bytes, self.uid)?;
        let events = mkdir_new(&operation, "events", self.uid)?;
        let record = Record {
            format: 1,
            operation_id: operation_id.to_owned(),
            request_sha256: expected_sha256.to_owned(),
            sequence: 0,
            previous_sha256: ZERO_HASH.to_owned(),
            event: Event::Phase(Phase::Accepted),
        };
        let bytes = serde_json::to_vec(&record).map_err(|_| JournalError::Io)?;
        write_new(&events, "00000000000000000000.json", &bytes, self.uid)?;
        let loaded = self.load(operation_id, &operation)?;
        self.write_projection(operation_id, &operation, &loaded)?;
        Ok(Admission {
            operation_id: operation_id.to_owned(),
            request_sha256: expected_sha256.to_owned(),
            status: loaded.status,
            reused: false,
        })
    }

    pub fn read_status(&self, operation_id: &str) -> Result<Status> {
        let _gate = self.gate.lock().map_err(|_| JournalError::Corrupt)?;
        self.validate_base()?;
        let operation = self.operation(operation_id)?;
        let loaded = self.load(operation_id, &operation)?;
        self.repair_projection(operation_id, &operation, &loaded)?;
        Ok(loaded.status)
    }

    pub fn append(&self, operation_id: &str, expected_sequence: u64, event: Event) -> Result<Status> {
        let _gate = self.gate.lock().map_err(|_| JournalError::Corrupt)?;
        self.validate_base()?;
        let operation = self.operation(operation_id)?;
        let loaded = self.load(operation_id, &operation)?;
        self.repair_projection(operation_id, &operation, &loaded)?;
        let request_bytes = read_file(&operation, "request.json", self.uid, 0o400, MAX_REQUEST)?;
        let request = parse_request(&request_bytes, &loaded.status.request_sha256)
            .map_err(|_| JournalError::Corrupt)?;
        self.other_operations_resolved(operation_id, request.installation_id())?;
        if loaded.status.sequence != expected_sequence {
            return Err(JournalError::Conflict);
        }
        if loaded.history.len() == MAX_EVENTS {
            return Err(JournalError::Limit);
        }
        let status = next(&loaded.status, event)?;
        let record = Record {
            format: 1,
            operation_id: operation_id.to_owned(),
            request_sha256: status.request_sha256.clone(),
            sequence: status.sequence,
            previous_sha256: loaded.hash,
            event,
        };
        let bytes = serde_json::to_vec(&record).map_err(|_| JournalError::Io)?;
        if bytes.len() > MAX_RECORD {
            return Err(JournalError::Limit);
        }
        self.validate_operation(operation_id, &operation)?;
        let events = child_dir(&operation, "events", self.uid)?;
        write_new(
            &events,
            &format!("{:020}.json", status.sequence),
            &bytes,
            self.uid,
        )?;
        let loaded = self.load(operation_id, &operation)?;
        self.write_projection(operation_id, &operation, &loaded)?;
        Ok(loaded.status)
    }
}
