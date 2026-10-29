//! Read-only fixed-file bundle loading for M5.4 diagnostics.
//!
//! All directory and input descriptors remain held until the caller finishes
//! semantic validation and calls [`Bundle::revalidate`]. Input paths never become
//! commands, extraction destinations or journal roots. The two archives are
//! hashed in bounded chunks and are never retained in memory or decompressed.
//! Named inputs are first probed with `O_PATH|O_NOFOLLOW`, which invokes no
//! device-open callback. Only an admitted regular inode is reopened for reading
//! through its held, kernel-owned `/proc/self/fd/<decimal-fd>` reference. Both
//! handles remain held; no caller-supplied proc path or process command exists.
//! Root-sealed mode requires EUID0; explicit fixture mode always uses the calling
//! UID, including when that UID happens to be root.

use sha2::{Digest, Sha256};
use std::collections::BTreeSet;
use std::ffi::{CStr, CString, OsStr};
use std::fmt;
use std::fs::{File, Metadata};
use std::io::Read;
use std::os::fd::{AsRawFd, FromRawFd};
use std::os::unix::ffi::OsStrExt;
use std::os::unix::fs::MetadataExt;
use std::path::{Component, Path, PathBuf};

const KIB: u64 = 1024;
const GIB: u64 = 1024 * 1024 * 1024;
const CHUNK: usize = 64 * 1024;

struct FileSpec {
    name: &'static str,
    limit: u64,
    archive: bool,
    nonempty: bool,
}

static FILES: [FileSpec; 21] = [
    FileSpec {
        name: "admission.json",
        limit: 16 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "adoption-plan.json",
        limit: 16 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "installed-binding.json",
        limit: 4 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "artifact.zip",
        limit: GIB,
        archive: true,
        nonempty: false,
    },
    FileSpec {
        name: "image.tar",
        limit: GIB,
        archive: true,
        nonempty: false,
    },
    FileSpec {
        name: "manifest.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "image-proof.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "recovery-proof.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "source-qualification.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "governance-qualification.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "artifact-qualification.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "compatibility-qualification.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "manual-projection.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "observation.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "assessment.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "authority-transition.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: false,
    },
    FileSpec {
        name: "manual-installed.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: true,
    },
    FileSpec {
        name: "manual-operation.state",
        limit: 64 * KIB,
        archive: false,
        nonempty: true,
    },
    FileSpec {
        name: "terminal-receipt.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: true,
    },
    FileSpec {
        name: "policy.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: true,
    },
    FileSpec {
        name: "inventory.json",
        limit: 64 * KIB,
        archive: false,
        nonempty: true,
    },
];

/// Trust labeling is explicit; fixture mode never upgrades itself under root.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum TrustMode {
    RootSealed,
    Fixture,
}

/// Bounded static errors deliberately omit input names, paths and byte payloads.
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum BundleError {
    RootRequired,
    InvalidPath,
    UnsafeAncestry,
    UnsafeDirectory,
    UnexpectedFiles,
    UnsafeFile,
    Limit,
    Changed,
    Io,
    UnknownFile,
    ArchiveBytesUnavailable,
}

impl fmt::Display for BundleError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(match self {
            Self::RootRequired => "root-sealed bundle requires root",
            Self::InvalidPath => "bundle path rejected",
            Self::UnsafeAncestry => "bundle ancestry rejected",
            Self::UnsafeDirectory => "bundle directory rejected",
            Self::UnexpectedFiles => "bundle fixed-file set rejected",
            Self::UnsafeFile => "bundle input admission rejected",
            Self::Limit => "bundle input bound exceeded",
            Self::Changed => "bundle input identity or metadata changed",
            Self::Io => "bundle read failed",
            Self::UnknownFile => "unknown bundle input",
            Self::ArchiveBytesUnavailable => "archive bytes are not retained",
        })
    }
}

impl std::error::Error for BundleError {}
type Result<T> = std::result::Result<T, BundleError>;

#[derive(Clone, Copy, Eq, PartialEq)]
struct Fingerprint {
    device: u64,
    inode: u64,
    mode: u32,
    uid: u32,
    gid: u32,
    links: u64,
    size: u64,
    modified_seconds: i64,
    modified_nanoseconds: i64,
    changed_seconds: i64,
    changed_nanoseconds: i64,
}

impl Fingerprint {
    fn of(metadata: &Metadata) -> Self {
        Self {
            device: metadata.dev(),
            inode: metadata.ino(),
            mode: metadata.mode(),
            uid: metadata.uid(),
            gid: metadata.gid(),
            links: metadata.nlink(),
            size: metadata.len(),
            modified_seconds: metadata.mtime(),
            modified_nanoseconds: metadata.mtime_nsec(),
            changed_seconds: metadata.ctime(),
            changed_nanoseconds: metadata.ctime_nsec(),
        }
    }

    fn ancestry_eq(self, other: Self) -> bool {
        self.device == other.device
            && self.inode == other.inode
            && self.mode == other.mode
            && self.uid == other.uid
            && self.gid == other.gid
    }
}

struct DirectoryPin {
    file: File,
    before: Fingerprint,
}

struct Input {
    spec: &'static FileSpec,
    pin: File,
    file: File,
    before: Fingerprint,
    bytes: Option<Vec<u8>>,
    digest: String,
    len: u64,
}

/// A fixed21-file read snapshot with every input descriptor retained.
pub struct Bundle {
    path: PathBuf,
    mode: TrustMode,
    uid: u32,
    directories: Vec<DirectoryPin>,
    inputs: Vec<Input>,
}

impl fmt::Debug for Bundle {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter
            .debug_struct("Bundle")
            .field("mode", &self.mode)
            .field("input_count", &self.inputs.len())
            .finish_non_exhaustive()
    }
}

fn component(name: &OsStr) -> Result<CString> {
    let bytes = name.as_bytes();
    if bytes.is_empty() || bytes == b"." || bytes == b".." || bytes.contains(&b'/') {
        return Err(BundleError::InvalidPath);
    }
    CString::new(bytes).map_err(|_| BundleError::InvalidPath)
}

fn opened_descriptor(descriptor: i32) -> Result<File> {
    if descriptor < 0 {
        return Err(BundleError::Io);
    }
    // SAFETY: each successful open/openat result is fresh and transferred once.
    Ok(unsafe { File::from_raw_fd(descriptor) })
}

fn open_child(parent: &File, name: &OsStr, directory: bool) -> Result<File> {
    let name = component(name)?;
    let flags = libc::O_CLOEXEC
        | libc::O_NOFOLLOW
        | if directory {
            libc::O_RDONLY | libc::O_DIRECTORY | libc::O_NONBLOCK
        } else {
            libc::O_PATH
        };
    // SAFETY: parent remains held and the CString is valid through openat.
    opened_descriptor(unsafe { libc::openat(parent.as_raw_fd(), name.as_ptr(), flags) })
}

fn metadata(file: &File) -> Result<Metadata> {
    file.metadata().map_err(|_| BundleError::Io)
}

fn read_handle(pin: &File, expected: Fingerprint, spec: &FileSpec, uid: u32) -> Result<File> {
    let before = metadata(pin)?;
    admitted_input(&before, spec, uid)?;
    if Fingerprint::of(&before) != expected {
        return Err(BundleError::Changed);
    }
    let handle =
        CString::new(format!("/proc/self/fd/{}", pin.as_raw_fd())).map_err(|_| BundleError::Io)?;
    // SAFETY: this path is constructed only from our held O_PATH descriptor.
    // Following this kernel FD reference reopens the already admitted regular
    // inode, not a mutable bundle pathname; device nodes were refused earlier.
    let file = opened_descriptor(unsafe {
        libc::open(
            handle.as_ptr(),
            libc::O_RDONLY | libc::O_CLOEXEC | libc::O_NONBLOCK,
        )
    })?;
    let current = metadata(&file)?;
    admitted_input(&current, spec, uid)?;
    if Fingerprint::of(&current) != expected || Fingerprint::of(&metadata(pin)?) != expected {
        return Err(BundleError::Changed);
    }
    Ok(file)
}

fn safe_ancestor(metadata: &Metadata, uid: u32) -> Result<()> {
    let mode = metadata.mode() & 0o7777;
    let trusted_temporary = metadata.uid() == 0 && mode & 0o1000 != 0;
    if !metadata.is_dir()
        || (metadata.uid() != 0 && metadata.uid() != uid)
        || (mode & 0o022 != 0 && !trusted_temporary)
    {
        return Err(BundleError::UnsafeAncestry);
    }
    Ok(())
}

fn private_root(metadata: &Metadata, uid: u32) -> Result<()> {
    if !metadata.is_dir() || metadata.uid() != uid || metadata.mode() & 0o7777 != 0o700 {
        return Err(BundleError::UnsafeDirectory);
    }
    Ok(())
}

fn open_ancestry(path: &Path, uid: u32) -> Result<Vec<DirectoryPin>> {
    if !path.is_absolute()
        || path
            .as_os_str()
            .as_bytes()
            .split(|byte| *byte == b'/')
            .any(|part| part == b"." || part == b"..")
    {
        return Err(BundleError::InvalidPath);
    }
    let root_name = CString::new("/").map_err(|_| BundleError::Io)?;
    // SAFETY: root_name is valid, flags open only the namespace root directory.
    let root = opened_descriptor(unsafe {
        libc::open(
            root_name.as_ptr(),
            libc::O_RDONLY | libc::O_DIRECTORY | libc::O_NOFOLLOW | libc::O_CLOEXEC,
        )
    })?;
    let root_metadata = metadata(&root)?;
    safe_ancestor(&root_metadata, uid)?;
    let mut directories = vec![DirectoryPin {
        file: root,
        before: Fingerprint::of(&root_metadata),
    }];
    for part in path.components() {
        let Component::Normal(name) = part else {
            if part == Component::RootDir {
                continue;
            }
            return Err(BundleError::InvalidPath);
        };
        let parent = &directories.last().ok_or(BundleError::InvalidPath)?.file;
        let child = open_child(parent, name, true)?;
        let child_metadata = metadata(&child)?;
        safe_ancestor(&child_metadata, uid)?;
        directories.push(DirectoryPin {
            file: child,
            before: Fingerprint::of(&child_metadata),
        });
    }
    private_root(
        &metadata(&directories.last().ok_or(BundleError::InvalidPath)?.file)?,
        uid,
    )?;
    Ok(directories)
}

struct DirectoryStream(*mut libc::DIR);

impl Drop for DirectoryStream {
    fn drop(&mut self) {
        // SAFETY: fdopendir ownership is retained exactly once until this drop.
        unsafe { libc::closedir(self.0) };
    }
}

fn fixed_names(root: &File) -> Result<()> {
    let dot = CString::new(".").map_err(|_| BundleError::Io)?;
    // Open a new file description so concurrent enumerations do not share offset.
    // SAFETY: fixed dot is a valid directory-relative name in the held root.
    let descriptor = unsafe {
        libc::openat(
            root.as_raw_fd(),
            dot.as_ptr(),
            libc::O_RDONLY | libc::O_DIRECTORY | libc::O_NOFOLLOW | libc::O_CLOEXEC,
        )
    };
    if descriptor < 0 {
        return Err(BundleError::Io);
    }
    // SAFETY: descriptor is fresh; fdopendir owns it on success only.
    let stream = unsafe { libc::fdopendir(descriptor) };
    if stream.is_null() {
        // SAFETY: fdopendir failed and did not consume descriptor.
        unsafe { libc::close(descriptor) };
        return Err(BundleError::Io);
    }
    let stream = DirectoryStream(stream);
    let mut names = BTreeSet::new();
    loop {
        // SAFETY: this thread's errno storage and valid DIR live through readdir.
        let entry = unsafe {
            *libc::__errno_location() = 0;
            libc::readdir(stream.0)
        };
        if entry.is_null() {
            // SAFETY: reading this thread's errno requires no external pointer.
            if unsafe { *libc::__errno_location() } != 0 {
                return Err(BundleError::Io);
            }
            break;
        }
        // SAFETY: readdir returned a live entry with a NUL-terminated d_name.
        let name = unsafe { CStr::from_ptr((*entry).d_name.as_ptr()) }.to_bytes();
        if matches!(name, b"." | b"..") {
            continue;
        }
        if names.len() == FILES.len()
            || !FILES.iter().any(|spec| spec.name.as_bytes() == name)
            || !names.insert(name.to_vec())
        {
            return Err(BundleError::UnexpectedFiles);
        }
    }
    if names.len() != FILES.len() {
        return Err(BundleError::UnexpectedFiles);
    }
    Ok(())
}

fn admitted_input(metadata: &Metadata, spec: &FileSpec, uid: u32) -> Result<()> {
    if !metadata.is_file()
        || metadata.uid() != uid
        || metadata.mode() & 0o7777 != 0o400
        || metadata.nlink() != 1
    {
        return Err(BundleError::UnsafeFile);
    }
    if metadata.len() > spec.limit || (spec.nonempty && metadata.len() == 0) {
        return Err(BundleError::Limit);
    }
    Ok(())
}

fn read_input(input: &mut Input, uid: u32) -> Result<()> {
    let before = metadata(&input.file)?;
    admitted_input(&before, input.spec, uid)?;
    if Fingerprint::of(&before) != input.before {
        return Err(BundleError::Changed);
    }
    let mut digest = Sha256::new();
    let mut count = 0u64;
    let mut chunk = [0u8; CHUNK];
    let mut bytes = (!input.spec.archive).then(Vec::new);
    loop {
        let size = match input.file.read(&mut chunk) {
            Ok(size) => size,
            Err(error) if error.kind() == std::io::ErrorKind::Interrupted => continue,
            Err(_) => return Err(BundleError::Io),
        };
        if size == 0 {
            break;
        }
        count = count.checked_add(size as u64).ok_or(BundleError::Limit)?;
        if count > input.spec.limit {
            return Err(BundleError::Limit);
        }
        digest.update(&chunk[..size]);
        if let Some(bytes) = &mut bytes {
            bytes.extend_from_slice(&chunk[..size]);
        }
    }
    let after = metadata(&input.file)?;
    admitted_input(&after, input.spec, uid)?;
    if Fingerprint::of(&after) != input.before || count != input.before.size {
        return Err(BundleError::Changed);
    }
    input.bytes = bytes;
    input.digest = digest
        .finalize()
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect();
    input.len = count;
    Ok(())
}

impl Bundle {
    pub fn open(path: &Path, mode: TrustMode) -> Result<Self> {
        // SAFETY: geteuid has no pointer arguments or external side effects.
        let uid = unsafe { libc::geteuid() };
        if mode == TrustMode::RootSealed && uid != 0 {
            return Err(BundleError::RootRequired);
        }
        let directories = open_ancestry(path, uid)?;
        let root = &directories.last().ok_or(BundleError::InvalidPath)?.file;
        fixed_names(root)?;
        let mut inputs = Vec::with_capacity(FILES.len());
        for spec in &FILES {
            let pin = open_child(root, OsStr::new(spec.name), false)?;
            let before = metadata(&pin)?;
            admitted_input(&before, spec, uid)?;
            let before = Fingerprint::of(&before);
            let file = read_handle(&pin, before, spec, uid)?;
            inputs.push(Input {
                spec,
                pin,
                file,
                before,
                bytes: None,
                digest: String::new(),
                len: 0,
            });
        }
        let mut bundle = Self {
            path: path.to_path_buf(),
            mode,
            uid,
            directories,
            inputs,
        };
        bundle.revalidate()?;
        for input in &mut bundle.inputs {
            read_input(input, uid)?;
        }
        bundle.revalidate()?;
        Ok(bundle)
    }

    fn input(&self, name: &str) -> Result<&Input> {
        self.inputs
            .iter()
            .find(|input| input.spec.name == name)
            .ok_or(BundleError::UnknownFile)
    }

    pub fn bytes(&self, name: &str) -> Result<&[u8]> {
        self.input(name)?
            .bytes
            .as_deref()
            .ok_or(BundleError::ArchiveBytesUnavailable)
    }

    pub fn digest(&self, name: &str) -> Result<&str> {
        Ok(&self.input(name)?.digest)
    }

    pub fn len(&self, name: &str) -> Result<u64> {
        Ok(self.input(name)?.len)
    }

    pub fn revalidate(&self) -> Result<()> {
        // SAFETY: geteuid has no pointer arguments or external side effects.
        let current_uid = unsafe { libc::geteuid() };
        if current_uid != self.uid || (self.mode == TrustMode::RootSealed && current_uid != 0) {
            return Err(BundleError::RootRequired);
        }
        let root_index = self
            .directories
            .len()
            .checked_sub(1)
            .ok_or(BundleError::InvalidPath)?;
        for (index, directory) in self.directories.iter().enumerate() {
            let current = metadata(&directory.file)?;
            safe_ancestor(&current, self.uid)?;
            let current = Fingerprint::of(&current);
            if !directory.before.ancestry_eq(current)
                || (index == root_index && directory.before != current)
            {
                return Err(BundleError::Changed);
            }
        }
        self.revalidate_path()?;
        let root = &self.directories[root_index].file;
        private_root(&metadata(root)?, self.uid)?;
        fixed_names(root)?;
        for input in &self.inputs {
            let pin = metadata(&input.pin)?;
            admitted_input(&pin, input.spec, self.uid)?;
            let held = metadata(&input.file)?;
            admitted_input(&held, input.spec, self.uid)?;
            if Fingerprint::of(&pin) != input.before || Fingerprint::of(&held) != input.before {
                return Err(BundleError::Changed);
            }
            let named = open_child(root, OsStr::new(input.spec.name), false)?;
            let named = metadata(&named)?;
            admitted_input(&named, input.spec, self.uid)?;
            if Fingerprint::of(&named) != input.before {
                return Err(BundleError::Changed);
            }
        }
        fixed_names(root)?;
        self.revalidate_path()?;
        if Fingerprint::of(&metadata(root)?) != self.directories[root_index].before {
            return Err(BundleError::Changed);
        }
        Ok(())
    }

    fn revalidate_path(&self) -> Result<()> {
        let current = open_ancestry(&self.path, self.uid)?;
        if current.len() != self.directories.len() {
            return Err(BundleError::Changed);
        }
        let root_index = self.directories.len() - 1;
        for (index, (current, held)) in current.iter().zip(&self.directories).enumerate() {
            if !current.before.ancestry_eq(held.before)
                || (index == root_index && current.before != held.before)
            {
                return Err(BundleError::Changed);
            }
        }
        Ok(())
    }
}
