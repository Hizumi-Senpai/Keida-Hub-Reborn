//! Read-only request/bundle diagnostics, with no host command dispatcher.
use std::{
    ffi::CString,
    fs::File,
    io::Read,
    os::{fd::FromRawFd, unix::fs::MetadataExt},
    path::{Component, Path},
};

fn open_at(parent: &File, name: &std::ffi::OsStr, directory: bool) -> Result<File, ()> {
    use std::os::{fd::AsRawFd, unix::ffi::OsStrExt};
    let name = CString::new(name.as_bytes()).map_err(|_| ())?;
    let flags = libc::O_RDONLY
        | libc::O_NOFOLLOW
        | libc::O_CLOEXEC
        | libc::O_NONBLOCK
        | if directory { libc::O_DIRECTORY } else { 0 };
    // SAFETY: the valid borrowed descriptor and NUL-terminated component remain
    // live during openat; ownership of a successful new descriptor moves once.
    let descriptor = unsafe { libc::openat(parent.as_raw_fd(), name.as_ptr(), flags) };
    if descriptor < 0 {
        return Err(());
    }
    // SAFETY: descriptor is newly allocated by openat and has a single owner.
    Ok(unsafe { File::from_raw_fd(descriptor) })
}

fn request_bytes(path: &Path) -> Result<Vec<u8>, ()> {
    if !path.is_absolute() {
        return Err(());
    }
    let components: Vec<_> = path.components().collect();
    if components.len() < 3 || !matches!(components.first(), Some(Component::RootDir)) {
        return Err(());
    }
    // SAFETY: geteuid has no pointer arguments or side effects.
    let uid = unsafe { libc::geteuid() };
    let mut parent = File::open("/").map_err(|_| ())?;
    for component in &components[1..components.len() - 1] {
        let Component::Normal(name) = component else {
            return Err(());
        };
        let next = open_at(&parent, name, true)?;
        let meta = next.metadata().map_err(|_| ())?;
        let mode = meta.mode() & 0o7777;
        // Root-owned sticky temporary roots are acceptable ancestors; the
        // immediate request directory must still be owned and private below.
        let trusted_temporary = meta.uid() == 0 && mode & 0o1000 != 0;
        if !meta.is_dir()
            || (meta.uid() != 0 && meta.uid() != uid)
            || (mode & 0o022 != 0 && !trusted_temporary)
        {
            return Err(());
        }
        parent = next;
    }
    let meta = parent.metadata().map_err(|_| ())?;
    if meta.uid() != uid || meta.mode() & 0o7777 != 0o700 {
        return Err(());
    }
    let Some(Component::Normal(name)) = components.last() else {
        return Err(());
    };
    let file = open_at(&parent, name, false)?;
    let meta = file.metadata().map_err(|_| ())?;
    if !meta.is_file()
        || meta.uid() != uid
        || meta.mode() & 0o7777 != 0o400
        || meta.nlink() != 1
        || meta.len() > 16_384
    {
        return Err(());
    }
    let mut bytes = Vec::new();
    file.take(16_385).read_to_end(&mut bytes).map_err(|_| ())?;
    if bytes.len() > 16_384 {
        return Err(());
    }
    Ok(bytes)
}

fn run() -> Result<(), ()> {
    let args: Vec<_> = std::env::args_os().collect();
    if args.get(1).is_some_and(|v| v == "check-bundle") {
        let mode = match args.len() {
            5 => reborn_host_updater::bundle_fs::TrustMode::RootSealed,
            6 if args[5] == "--fixture" => reborn_host_updater::bundle_fs::TrustMode::Fixture,
            _ => return Err(()),
        };
        let report = reborn_host_updater::check_bundle(
            Path::new(&args[2]),
            args[3].to_str().ok_or(())?,
            args[4].to_str().ok_or(())?,
            mode,
        )
        .map_err(|_| ())?;
        println!("{}", serde_json::to_string(&report).map_err(|_| ())?);
        return Ok(());
    }
    if args.len() != 4 || args[1] != "check-request" {
        return Err(());
    }
    let expected_hash = args[3].to_str().ok_or(())?;
    let bytes = request_bytes(Path::new(&args[2]))?;
    let request =
        reborn_host_updater::protocol::parse_request(&bytes, expected_hash).map_err(|_| ())?;
    let output = serde_json::json!({
        "format": 1,
        "product": "keida-hub-reborn",
        "command": request.command(),
        "request_sha256": expected_hash,
        "effects_authorized": false
    });
    println!("{output}");
    Ok(())
}

fn main() -> std::process::ExitCode {
    match run() {
        Ok(()) => std::process::ExitCode::SUCCESS,
        Err(()) => {
            if std::env::args_os().nth(1).is_some_and(|v| v == "check-bundle") {
                eprintln!("bundle check refused; no effects authorized");
            } else {
                eprintln!("request check refused; no effects authorized");
            }
            std::process::ExitCode::from(2)
        }
    }
}
