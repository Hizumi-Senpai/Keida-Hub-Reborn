//! Fixed Linux appliance observation. This module never grants a capability to a caller.
use serde::Serialize;
use std::{
    fs::File,
    io::Read,
    os::{
        fd::{AsRawFd, FromRawFd},
        unix::fs::MetadataExt,
    },
};

#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
struct Identity {
    device: u64,
    inode: u64,
    mount_id: u64,
    uid: u32,
    gid: u32,
    mode: u32,
    links: u64,
    size: u64,
    modified_seconds: i64,
    modified_nanoseconds: i64,
    changed_seconds: i64,
    changed_nanoseconds: i64,
}
fn mount_id(f: &File) -> Result<u64, ()> {
    // SAFETY: statx is a plain kernel output structure, initialized before use.
    let mut st: libc::statx = unsafe { std::mem::zeroed() };
    // SAFETY: the held descriptor, empty C string and output pointer are valid.
    // Mount IDs are current-boot observations, never persistent identity.
    if unsafe {
        libc::statx(
            f.as_raw_fd(),
            c"".as_ptr(),
            libc::AT_EMPTY_PATH | libc::AT_NO_AUTOMOUNT,
            libc::STATX_MNT_ID,
            &mut st,
        )
    } != 0
        || st.stx_mask & libc::STATX_MNT_ID == 0
        || st.stx_mnt_id == 0
    {
        return Err(());
    }
    Ok(st.stx_mnt_id)
}
fn identity(f: &File) -> Result<Identity, ()> {
    let m = f.metadata().map_err(|_| ())?;
    Ok(Identity {
        device: m.dev(),
        inode: m.ino(),
        mount_id: mount_id(f)?,
        uid: m.uid(),
        gid: m.gid(),
        mode: m.mode(),
        links: m.nlink(),
        size: m.len(),
        modified_seconds: m.mtime(),
        modified_nanoseconds: m.mtime_nsec(),
        changed_seconds: m.ctime(),
        changed_nanoseconds: m.ctime_nsec(),
    })
}
fn owned(fd: i32) -> Result<File, ()> {
    if fd < 0 {
        return Err(());
    }
    // SAFETY: every caller passes a newly returned descriptor exactly once.
    Ok(unsafe { File::from_raw_fd(fd) })
}
fn at(parent: &File, name: &std::ffi::CStr) -> Result<File, ()> {
    // SAFETY: borrowed parent and C string remain live through openat.
    owned(unsafe {
        libc::openat(
            parent.as_raw_fd(),
            name.as_ptr(),
            libc::O_PATH | libc::O_NOFOLLOW | libc::O_CLOEXEC,
        )
    })
}
fn directory(f: &File, uid: u32, gid: u32, mode: u32) -> Result<(), ()> {
    let i = identity(f)?;
    if i.mode & libc::S_IFMT != libc::S_IFDIR
        || i.uid != uid
        || i.gid != gid
        || i.mode & 0o7777 != mode
    {
        return Err(());
    }
    Ok(())
}
fn regular(f: &File, uid: u32, gid: u32, mode: u32) -> Result<(), ()> {
    let i = identity(f)?;
    if i.mode != libc::S_IFREG | mode || i.uid != uid || i.gid != gid || i.links != 1 {
        return Err(());
    }
    Ok(())
}
fn same(a: &File, b: &File) -> Result<(), ()> {
    if identity(a)? != identity(b)? {
        Err(())
    } else {
        Ok(())
    }
}
fn readable_directory(f: &File) -> Result<File, ()> {
    // Open only an already admitted directory, not an unchecked leaf.
    let before = identity(f)?;
    if before.mode & libc::S_IFMT != libc::S_IFDIR {
        return Err(());
    }
    // SAFETY: live directory descriptor, static component and read-only flags.
    let r = owned(unsafe {
        libc::openat(
            f.as_raw_fd(),
            c".".as_ptr(),
            libc::O_RDONLY | libc::O_DIRECTORY | libc::O_NOFOLLOW | libc::O_CLOEXEC,
        )
    })?;
    if identity(f)? != before || identity(&r)? != before {
        return Err(());
    }
    Ok(r)
}
#[repr(C)]
struct Handle {
    bytes: u32,
    kind: i32,
    data: [u8; 20],
}
#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
struct OpaqueHandle {
    handle_type: i32,
    handle_bytes: u32,
    handle_hex: String,
    mount_id: i32,
}
fn capture(f: &File) -> Result<(Handle, i32), ()> {
    let mut h = Handle {
        bytes: 20,
        kind: 0,
        data: [0; 20],
    };
    let mut mount = 0;
    // SAFETY: handle header advertises exactly the allocated trailing capacity.
    // AT_EMPTY_PATH captures the held object, without resolving a candidate path.
    let rc = unsafe {
        libc::name_to_handle_at(
            f.as_raw_fd(),
            c"".as_ptr(),
            (&mut h as *mut Handle).cast(),
            &mut mount,
            libc::AT_EMPTY_PATH,
        )
    };
    if rc != 0 || h.bytes != 20 || h.kind != 77 || mount <= 0 {
        return Err(());
    }
    Ok((h, mount))
}
fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}
fn handle(f: &File, mount: &File) -> Result<OpaqueHandle, ()> {
    let (mut h, m) = capture(f)?;
    if mount_id(f)? != m as u64 || mount_id(mount)? != m as u64 {
        return Err(());
    }
    // SAFETY: fixed valid handle capacity, borrowed mount descriptor. O_PATH
    // obtains metadata only; no rejected special file is read-opened.
    let reopened = owned(unsafe {
        libc::open_by_handle_at(
            mount.as_raw_fd(),
            (&mut h as *mut Handle).cast(),
            libc::O_PATH | libc::O_NOFOLLOW | libc::O_CLOEXEC,
        )
    })?;
    same(f, &reopened)?;
    let (again, again_mount) = capture(&reopened)?;
    if again.data != h.data || again_mount != m {
        return Err(());
    }
    Ok(OpaqueHandle {
        handle_type: h.kind,
        handle_bytes: h.bytes,
        handle_hex: hex(&h.data),
        mount_id: m,
    })
}
#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
struct Btrfs {
    filesystem_uuid: String,
    subvolume_uuid: String,
    subvolume_id: u64,
}
fn uuid(b: &[u8]) -> Result<String, ()> {
    if b.len() != 16 || b.iter().all(|x| *x == 0) {
        return Err(());
    }
    let s = hex(b);
    Ok(format!(
        "{}-{}-{}-{}-{}",
        &s[..8],
        &s[8..12],
        &s[12..16],
        &s[16..20],
        &s[20..]
    ))
}
fn filesystem(f: &File) -> Result<Btrfs, ()> {
    let r = readable_directory(f)?;
    // SAFETY: initialized statfs structure and valid descriptor.
    let mut st: libc::statfs = unsafe { std::mem::zeroed() };
    if unsafe { libc::fstatfs(r.as_raw_fd(), &mut st) } != 0 || st.f_type != 0x9123683e {
        return Err(());
    }
    // Linux x86_64 UAPI: FS_INFO is 1024 bytes; GET_SUBVOL_INFO is 504 bytes.
    // Buffers are u64-aligned and zero-initialized, including all input flags.
    let mut fs = [0u64; 128];
    let mut sub = [0u64; 63];
    // SAFETY: ioctl payloads have the exact UAPI size and alignment.
    if unsafe { libc::ioctl(r.as_raw_fd(), 0x8400941fu64, fs.as_mut_ptr()) } != 0
        || unsafe { libc::ioctl(r.as_raw_fd(), 0x81f8943cu64, sub.as_mut_ptr()) } != 0
    {
        return Err(());
    }
    // SAFETY: byte views stay within the initialized arrays and share their lifetime.
    let fb = unsafe { std::slice::from_raw_parts(fs.as_ptr().cast::<u8>(), 1024) };
    let sb = unsafe { std::slice::from_raw_parts(sub.as_ptr().cast::<u8>(), 504) };
    if sub[0] == 0 {
        return Err(());
    }
    Ok(Btrfs {
        filesystem_uuid: uuid(&fb[16..32])?,
        subvolume_uuid: uuid(&sb[296..312])?,
        subvolume_id: sub[0],
    })
}
#[derive(Clone, Debug, PartialEq, Eq, Serialize)]
struct BootFilesystem {
    filesystem_type: i64,
    volume_id: String,
    mount_id: u64,
}
fn fat(f: &File) -> Result<BootFilesystem, ()> {
    let r = readable_directory(f)?;
    // SAFETY: zeroed statfs is a plain kernel output structure.
    let mut st: libc::statfs = unsafe { std::mem::zeroed() };
    // SAFETY: valid borrowed descriptor and writable full statfs structure.
    if unsafe { libc::fstatfs(r.as_raw_fd(), &mut st) } != 0 || st.f_type != 0x4d44 {
        return Err(());
    }
    // Linux FAT_IOCTL_GET_VOLUME_ID (_IOR('r', 0x13, u32)), metadata only.
    let mut volume: u32 = 0;
    // SAFETY: the ioctl receives a full writable u32 through a live FAT descriptor.
    if unsafe { libc::ioctl(r.as_raw_fd(), 0x80047213u64, &mut volume) } != 0 {
        return Err(());
    }
    Ok(BootFilesystem {
        filesystem_type: st.f_type,
        volume_id: format!("{:04X}-{:04X}", volume >> 16, volume & 0xffff),
        mount_id: mount_id(&r)?,
    })
}
fn absent(parent: &File, name: &std::ffi::CStr) -> Result<bool, ()> {
    match at(parent, name) {
        Ok(_) => Ok(false),
        Err(()) => {
            if std::io::Error::last_os_error().raw_os_error() == Some(libc::ENOENT) {
                Ok(true)
            } else {
                Err(())
            }
        }
    }
}
fn bounded_boot_id() -> Result<String, ()> {
    let mut s = String::new();
    File::open("/proc/sys/kernel/random/boot_id")
        .map_err(|_| ())?
        .take(38)
        .read_to_string(&mut s)
        .map_err(|_| ())?;
    let v = s.strip_suffix('\n').ok_or(())?;
    if v.len() != 36
        || !v.bytes().enumerate().all(|(i, b)| {
            if [8, 13, 18, 23].contains(&i) {
                b == b'-'
            } else {
                b.is_ascii_digit() || (b'a'..=b'f').contains(&b)
            }
        })
    {
        return Err(());
    }
    Ok(v.to_owned())
}
fn boottime() -> Result<u64, ()> {
    let mut t = libc::timespec {
        tv_sec: 0,
        tv_nsec: 0,
    };
    // SAFETY: t is a valid writable timespec, CLOCK_BOOTTIME is observation only.
    if unsafe { libc::clock_gettime(libc::CLOCK_BOOTTIME, &mut t) } != 0
        || t.tv_sec < 0
        || !(0..1_000_000_000).contains(&t.tv_nsec)
    {
        return Err(());
    }
    (t.tv_sec as u64)
        .checked_mul(1_000_000_000)
        .and_then(|s| s.checked_add(t.tv_nsec as u64))
        .filter(|x| *x > 0)
        .ok_or(())
}
#[derive(Serialize)]
pub(super) struct Report {
    format: u8,
    product: &'static str,
    profile: &'static str,
    boot_id: String,
    observed_boottime_ns: u64,
    boot_filesystem: BootFilesystem,
    boot_metadata: Identity,
    boot_config_metadata: Identity,
    filesystem: Btrfs,
    objects: Vec<Observation>,
    boot_anchor_present: bool,
    state_namespace_present: bool,
    effects_authorized: bool,
    adoption_performed: bool,
    execution_ready: bool,
    writer_lock_acquired: bool,
}
#[derive(Serialize)]
struct Observation {
    path: &'static str,
    metadata: Identity,
    handle: OpaqueHandle,
}

pub(super) fn probe() -> Result<Report, ()> {
    if !cfg!(all(target_os = "linux", target_arch = "x86_64")) {
        return Err(());
    }
    // SAFETY: geteuid is a side-effect-free identity query.
    if unsafe { libc::geteuid() } != 0 {
        return Err(());
    }
    let start = boottime()?;
    let boot_id = bounded_boot_id()?;
    // SAFETY: static absolute root with metadata-only, nofollow flags.
    let root = owned(unsafe {
        libc::open(
            c"/".as_ptr(),
            libc::O_PATH | libc::O_DIRECTORY | libc::O_NOFOLLOW | libc::O_CLOEXEC,
        )
    })?;
    directory(&root, 0, 0, 0o755)?;
    let mnt = at(&root, c"mnt")?;
    directory(&mnt, 0, 0, 0o755)?;
    let cache = at(&mnt, c"cache")?;
    directory(&cache, 99, 100, 0o777)?;
    let appdata = at(&cache, c"appdata")?;
    directory(&appdata, 99, 100, 0o777)?;
    let app = at(&appdata, c"keida-hub-reborn")?;
    directory(&app, 0, 0, 0o700)?;
    let lock = at(&app, c"operation.lock")?;
    regular(&lock, 0, 0, 0o600)?;
    let boot = at(&root, c"boot")?;
    directory(&boot, 0, 0, 0o700)?;
    let config = at(&boot, c"config")?;
    directory(&config, 0, 0, 0o700)?;
    let boot_filesystem = fat(&boot)?;
    if fat(&config)? != boot_filesystem {
        return Err(());
    }
    let before: Vec<_> = [&root, &mnt, &cache, &appdata, &app, &lock, &boot, &config]
        .into_iter()
        .map(identity)
        .collect::<Result<_, _>>()?;
    let fs = filesystem(&cache)?;
    for f in [&appdata, &app] {
        if filesystem(f)? != fs {
            return Err(());
        }
    }
    let anchor = absent(&config, c"keida-hub-reborn-updater")?;
    let state = absent(&app, c"updater")?;
    let mut objects = Vec::new();
    for (path, f) in [
        ("/mnt/cache", &cache),
        ("/mnt/cache/appdata", &appdata),
        ("/mnt/cache/appdata/keida-hub-reborn", &app),
        ("/mnt/cache/appdata/keida-hub-reborn/operation.lock", &lock),
    ] {
        objects.push(Observation {
            path,
            metadata: identity(f)?,
            handle: handle(f, &readable_directory(&cache)?)?,
        });
    }
    for (parent, name, held) in [
        (&root, c"mnt", &mnt),
        (&mnt, c"cache", &cache),
        (&cache, c"appdata", &appdata),
        (&appdata, c"keida-hub-reborn", &app),
        (&app, c"operation.lock", &lock),
        (&root, c"boot", &boot),
        (&boot, c"config", &config),
    ] {
        same(&at(parent, name)?, held)?;
    }
    for (o, f) in objects.iter().zip([&cache, &appdata, &app, &lock]) {
        if handle(f, &readable_directory(&cache)?)? != o.handle {
            return Err(());
        }
    }
    for f in [&appdata, &app] {
        if filesystem(f)? != fs {
            return Err(());
        }
    }
    if fat(&boot)? != boot_filesystem || fat(&config)? != boot_filesystem {
        return Err(());
    }
    let after: Vec<_> = [&root, &mnt, &cache, &appdata, &app, &lock, &boot, &config]
        .into_iter()
        .map(identity)
        .collect::<Result<_, _>>()?;
    if before != after
        || filesystem(&cache)? != fs
        || absent(&config, c"keida-hub-reborn-updater")? != anchor
        || absent(&app, c"updater")? != state
        || bounded_boot_id()? != boot_id
        || boottime()?.checked_sub(start).ok_or(())? > 2_000_000_000
    {
        return Err(());
    }
    Ok(Report {
        format: 1,
        product: "keida-hub-reborn",
        profile: "unraid-read-only-namespace-probe-v1",
        boot_id,
        observed_boottime_ns: start,
        boot_filesystem,
        boot_metadata: identity(&boot)?,
        boot_config_metadata: identity(&config)?,
        filesystem: fs,
        objects,
        boot_anchor_present: !anchor,
        state_namespace_present: !state,
        effects_authorized: false,
        adoption_performed: false,
        execution_ready: false,
        writer_lock_acquired: false,
    })
}

#[cfg(test)]
#[path = "namespace_os_contracts.rs"]
mod contracts;
