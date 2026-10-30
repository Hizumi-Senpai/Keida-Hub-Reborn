//! Independent CLI expectations frozen in issue41 comment6502602267.
//! These refusal tests do not qualify the actual root/Btrfs positive path.
use std::process::{Command, Output};

fn refused(output: Output) {
    assert_eq!(output.status.code(), Some(2));
    assert!(output.stdout.is_empty(), "refusal leaked partial stdout");
    assert_eq!(
        output.stderr, b"namespace probe refused; no effects authorized\n",
        "namespace refusal must be fixed and secret-free"
    );
}

#[test]
fn namespace_rejects_every_argument_override_without_echoing_input() {
    for extra in [
        vec!["--fixture"],
        vec!["--root", "/tmp/private-namespace-marker"],
        vec!["/mnt/cache/appdata/keida-hub-reborn"],
        vec!["9"],
        vec!["{\"handle_type\":77}"],
        vec!["https://private-namespace-marker.invalid"],
        vec!["--"],
        vec!["--help"],
    ] {
        refused(
            Command::new(env!("CARGO_BIN_EXE_reborn-host-updater"))
                .arg("probe-namespace")
                .args(extra)
                .output()
                .expect("execute actual diagnostic binary"),
        );
    }
}

#[cfg(unix)]
#[test]
fn namespace_nonroot_refuses_without_claiming_host_support() {
    use std::os::unix::{fs::PermissionsExt, process::CommandExt};
    // This fixture owns only its temporary executable. It changes no host UID,
    // app permission or filesystem namespace and supplies no alternate probe root.
    let scope = std::env::temp_dir().join(format!("reborn-namespace-cli-{}", std::process::id()));
    std::fs::create_dir(&scope).expect("exclusive temporary fixture");
    std::fs::set_permissions(&scope, std::fs::Permissions::from_mode(0o755)).unwrap();
    let executable = scope.join("probe");
    std::fs::copy(env!("CARGO_BIN_EXE_reborn-host-updater"), &executable).unwrap();
    std::fs::set_permissions(&executable, std::fs::Permissions::from_mode(0o555)).unwrap();
    let mut command = Command::new(&executable);
    command.arg("probe-namespace");
    // SAFETY: geteuid takes no arguments and observes the test process only.
    if unsafe { libc::geteuid() } == 0 {
        command.gid(65534).uid(65534);
    }
    let output = command.output().expect("execute actual nonroot CLI");
    std::fs::remove_file(&executable).unwrap();
    std::fs::remove_dir(&scope).unwrap();
    refused(output);
}
