//! Actual disposable filesystem expectations; no production path override.
use super::*;
use std::{
    ffi::CString,
    os::unix::{
        fs::{PermissionsExt, symlink},
        net::UnixListener,
    },
    path::{Path, PathBuf},
};

struct Fixture(PathBuf);
impl Fixture {
    fn new() -> Self {
        let mut nonce = [0u8; 12];
        getrandom::fill(&mut nonce).unwrap();
        let p = std::env::temp_dir().join(format!(
            "reborn-namespace-{}-{}",
            std::process::id(),
            hex(&nonce)
        ));
        std::fs::create_dir(&p).unwrap();
        std::fs::set_permissions(&p, std::fs::Permissions::from_mode(0o700)).unwrap();
        Self(p)
    }
    fn held(&self) -> File {
        path(&self.0)
    }
}
impl Drop for Fixture {
    fn drop(&mut self) {
        std::fs::remove_dir_all(&self.0).unwrap();
    }
}
fn path(p: &Path) -> File {
    use std::os::unix::ffi::OsStrExt;
    let p = CString::new(p.as_os_str().as_bytes()).unwrap();
    // SAFETY: valid C pathname, metadata-only nofollow open, owned once.
    owned(unsafe {
        libc::open(
            p.as_ptr(),
            libc::O_PATH | libc::O_NOFOLLOW | libc::O_CLOEXEC,
        )
    })
    .unwrap()
}

#[test]
fn held_parent_survives_rename_but_substituted_name_never_matches() {
    let f = Fixture::new();
    let original = f.0.join("parent");
    std::fs::create_dir(&original).unwrap();
    std::fs::write(original.join("marker"), b"original").unwrap();
    let held = at(&f.held(), c"parent").unwrap();
    let marker = at(&held, c"marker").unwrap();
    std::fs::rename(&original, f.0.join("retained")).unwrap();
    std::fs::create_dir(&original).unwrap();
    std::fs::write(original.join("marker"), b"substitute").unwrap();
    assert!(same(&held, &at(&f.held(), c"parent").unwrap()).is_err());
    assert!(
        same(
            &marker,
            &at(&at(&f.held(), c"parent").unwrap(), c"marker").unwrap()
        )
        .is_err()
    );
    same(&held, &at(&f.held(), c"retained").unwrap()).unwrap();
    same(&marker, &at(&held, c"marker").unwrap()).unwrap();
}

#[test]
fn special_files_remain_metadata_only_and_never_receive_a_directory_read_open() {
    use std::os::unix::ffi::OsStrExt;
    let f = Fixture::new();
    std::fs::write(f.0.join("regular"), b"retained").unwrap();
    symlink("regular", f.0.join("symlink")).unwrap();
    let fifo = CString::new(f.0.join("fifo").as_os_str().as_bytes()).unwrap();
    // SAFETY: the new FIFO exists only inside this owned disposable fixture.
    assert_eq!(unsafe { libc::mkfifo(fifo.as_ptr(), 0o600) }, 0);
    // A UNIX socket pathname is limited to sun_path's 108 bytes. Bind through
    // the held private fixture directory so long audit ancestry stays on the
    // actual tested filesystem without exceeding that kernel pathname limit.
    let socket_parent = f.held();
    let _socket = UnixListener::bind(format!(
        "/proc/self/fd/{}/socket",
        socket_parent.as_raw_fd()
    ))
    .unwrap();
    for name in [c"regular", c"symlink", c"fifo", c"socket"] {
        let held = at(&f.held(), name).unwrap();
        // SAFETY: F_GETFL only queries this live descriptor's flags.
        assert_ne!(
            unsafe { libc::fcntl(held.as_raw_fd(), libc::F_GETFL) } & libc::O_PATH,
            0
        );
        assert!(readable_directory(&held).is_err());
        assert!(filesystem(&held).is_err());
        assert!(fat(&held).is_err());
    }
    assert_eq!(std::fs::read(f.0.join("regular")).unwrap(), b"retained");
}

#[test]
fn lock_admission_refuses_hardlinks_symlinks_and_replacement_without_repair() {
    let f = Fixture::new();
    let p = f.0.join("lock");
    std::fs::write(&p, b"original").unwrap();
    std::fs::set_permissions(&p, std::fs::Permissions::from_mode(0o600)).unwrap();
    let held = at(&f.held(), c"lock").unwrap();
    let original = identity(&held).unwrap();
    regular(&held, original.uid, original.gid, 0o600).unwrap();
    std::fs::hard_link(&p, f.0.join("alias")).unwrap();
    assert!(regular(&held, original.uid, original.gid, 0o600).is_err());
    std::fs::rename(&p, f.0.join("retained")).unwrap();
    symlink("retained", &p).unwrap();
    let named = at(&f.held(), c"lock").unwrap();
    assert!(same(&held, &named).is_err());
    assert!(regular(&named, original.uid, original.gid, 0o600).is_err());
    assert_eq!(std::fs::read(f.0.join("retained")).unwrap(), b"original");
    assert_eq!(std::fs::read_link(&p).unwrap(), PathBuf::from("retained"));
}

#[test]
fn mode_owner_and_leaf_metadata_changes_refuse_the_original_admission() {
    let f = Fixture::new();
    let held = f.held();
    let i = identity(&held).unwrap();
    directory(&held, i.uid, i.gid, 0o700).unwrap();
    assert!(directory(&held, i.uid.wrapping_add(1), i.gid, 0o700).is_err());
    assert!(directory(&held, i.uid, i.gid.wrapping_add(1), 0o700).is_err());
    std::fs::set_permissions(&f.0, std::fs::Permissions::from_mode(0o500)).unwrap();
    assert!(directory(&held, i.uid, i.gid, 0o700).is_err());
    assert_ne!(identity(&held).unwrap(), i);
    std::fs::set_permissions(&f.0, std::fs::Permissions::from_mode(0o700)).unwrap();
    std::fs::write(f.0.join("leaf"), b"x").unwrap();
    let leaf = at(&held, c"leaf").unwrap();
    let before = identity(&leaf).unwrap();
    std::fs::write(f.0.join("leaf"), b"xx").unwrap();
    assert_ne!(identity(&leaf).unwrap(), before);
}

#[test]
fn missing_is_distinct_from_present_symlink_and_non_directory_error() {
    let f = Fixture::new();
    assert!(absent(&f.held(), c"missing").unwrap());
    symlink("missing", f.0.join("dangling")).unwrap();
    assert!(!absent(&f.held(), c"dangling").unwrap());
    std::fs::write(f.0.join("leaf"), b"retained").unwrap();
    assert!(absent(&at(&f.held(), c"leaf").unwrap(), c"child").is_err());
}

#[test]
fn tmpfs_is_an_explicit_unsupported_filesystem_not_an_empty_success() {
    let shared = path(Path::new("/dev/shm"));
    // SAFETY: initialized output and valid descriptor; verify fixture type first.
    let mut st: libc::statfs = unsafe { std::mem::zeroed() };
    assert_eq!(unsafe { libc::fstatfs(shared.as_raw_fd(), &mut st) }, 0);
    assert_eq!(st.f_type, 0x01021994);
    assert!(filesystem(&shared).is_err());
    assert!(fat(&shared).is_err());
    assert!(handle(&shared, &shared).is_err());
}
