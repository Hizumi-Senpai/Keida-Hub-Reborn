//! Independent M5.3 expectations frozen from issue33 and M5_HOST_UPDATER.md
//! before inspecting implementation. These prove protocol/diagnostic behavior,
//! not admission authority or a host update.

use reborn_host_updater::protocol::{parse_installed_binding, parse_request, sha256};
use sha2::{Digest, Sha256};
use std::{
    fs::{self, DirBuilder, OpenOptions},
    io::Write,
    os::unix::fs::{DirBuilderExt, OpenOptionsExt, PermissionsExt, symlink},
    path::PathBuf,
    process::Command,
    sync::atomic::{AtomicU64, Ordering},
};

const INSTALLATION: &str = "0123456789abcdef0123456789abcdef";
const OPERATION: &str = "11111111111111111111111111111111";
const INSPECT: &str = r#"{"format":1,"product":"keida-hub-reborn","installation_id":"0123456789abcdef0123456789abcdef","command":"inspect"}"#;
const STATUS_CURRENT: &str = r#"{"format":1,"product":"keida-hub-reborn","installation_id":"0123456789abcdef0123456789abcdef","command":"status","operation_id":"current"}"#;
const STATUS_OPERATION: &str = r#"{"format":1,"product":"keida-hub-reborn","installation_id":"0123456789abcdef0123456789abcdef","command":"status","operation_id":"11111111111111111111111111111111"}"#;
const PREPARE: &str = r#"{"format":1,"product":"keida-hub-reborn","installation_id":"0123456789abcdef0123456789abcdef","command":"prepare","plan_id":"22222222222222222222222222222222","expected_generation":7,"expected_installed_sha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","policy_sha256":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","inventory_sha256":"cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc","admission_sha256":"dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"}"#;
const APPLY: &str = r#"{"format":1,"product":"keida-hub-reborn","installation_id":"0123456789abcdef0123456789abcdef","command":"apply","operation_id":"11111111111111111111111111111111","expected_generation":7,"expected_installed_sha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","policy_sha256":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","inventory_sha256":"cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc","prepared_receipt_sha256":"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"}"#;
const RECONCILE: &str = r#"{"format":1,"product":"keida-hub-reborn","installation_id":"0123456789abcdef0123456789abcdef","command":"reconcile","operation_id":"11111111111111111111111111111111","expected_request_sha256":"ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"}"#;
const ROLLBACK: &str = r#"{"format":1,"product":"keida-hub-reborn","installation_id":"0123456789abcdef0123456789abcdef","command":"rollback","operation_id":"11111111111111111111111111111111","expected_generation":7,"expected_installed_sha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","policy_sha256":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb","inventory_sha256":"cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc","prepared_receipt_sha256":"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"}"#;
const INSTALLED: &str = r#"{"format":1,"product":"keida-hub-reborn","installation_id":"0123456789abcdef0123456789abcdef","generation":7,"version":"0.1.18","ordinal":18,"commit":"697699187aca6780d8ba7b199dc2ba90b033bd67","tree":"bef1ea4021485466a22fedf4afc6559f3fb7e5bf","channel":"accepted","image_id":"sha256:74231723bfcb2bd52363d848a53c3d62cf6c70e90cc7a590fb75b7ca9a655f0d","manifest_sha256":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","binary_sha256":"731de10e82bf6e3c7ae598162a3d823b4bba71c6c6b3d22ff3c71f893e3ce032","database_schema":13,"workspace_contract":"reborn-workspace-v1","container_id":"6b0ce717744813abea65cfa36ce6aca8dafa117c60b72ddb3a1ea36c41cfe3f9","container_started_at":"2026-10-28T21:18:09.639816887Z"}"#;

fn independent_hash(bytes: &[u8]) -> String {
    Sha256::digest(bytes)
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}

fn replace(source: &str, old: &str, new: &str) -> String {
    assert!(source.contains(old), "fixture edit must change bytes");
    source.replacen(old, new, 1)
}

fn refused_request(bytes: &[u8]) {
    assert!(
        parse_request(bytes, &independent_hash(bytes)).is_err(),
        "noncanonical/invalid request accepted: {:?}",
        String::from_utf8_lossy(bytes)
    );
}

fn refused_installed(bytes: &[u8]) {
    assert!(
        parse_installed_binding(bytes, &independent_hash(bytes)).is_err(),
        "noncanonical/invalid installed binding accepted: {:?}",
        String::from_utf8_lossy(bytes)
    );
}

#[test]
fn sha256_matches_published_known_vectors() {
    assert_eq!(
        sha256(b""),
        "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
    assert_eq!(
        sha256(b"abc"),
        "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
}

#[test]
fn all_commands_preserve_their_literal_canonical_bytes_and_selectors() {
    for (literal, command, operation, plan) in [
        (INSPECT, "inspect", None, None),
        (STATUS_CURRENT, "status", None, None),
        (STATUS_OPERATION, "status", Some(OPERATION), None),
        (
            PREPARE,
            "prepare",
            None,
            Some("22222222222222222222222222222222"),
        ),
        (APPLY, "apply", Some(OPERATION), None),
        (RECONCILE, "reconcile", Some(OPERATION), None),
        (ROLLBACK, "rollback", Some(OPERATION), None),
    ] {
        let request = parse_request(literal.as_bytes(), &independent_hash(literal.as_bytes()))
            .expect("frozen canonical command");
        assert_eq!(request.command(), command);
        assert_eq!(request.installation_id(), INSTALLATION);
        assert_eq!(request.operation_id(), operation);
        assert_eq!(request.plan_id(), plan);
        assert_eq!(request.canonical_bytes(), literal.as_bytes());
    }
}

#[test]
fn hash_binding_is_checked_without_normalizing_the_expected_digest() {
    for digest in [
        "".to_owned(),
        "0".repeat(63),
        "0".repeat(64),
        "0".repeat(65),
        independent_hash(INSPECT.as_bytes()).to_uppercase(),
        format!("{}\n", independent_hash(INSPECT.as_bytes())),
    ] {
        assert!(parse_request(INSPECT.as_bytes(), &digest).is_err());
        assert!(parse_installed_binding(INSTALLED.as_bytes(), &digest).is_err());
    }
    assert!(parse_request(APPLY.as_bytes(), &independent_hash(ROLLBACK.as_bytes())).is_err());
    assert!(
        parse_installed_binding(
            INSTALLED.as_bytes(),
            &independent_hash(INSTALLED.as_bytes()).to_uppercase()
        )
        .is_err()
    );
}

#[test]
fn json_and_canonical_encoding_ambiguity_is_rejected_with_a_matching_hash() {
    let cases = [
        format!(" {INSPECT}"),
        format!("{INSPECT}\n"),
        replace(INSPECT, "{\"format\":1,", "{\"format\":1,\"format\":1,"),
        replace(INSPECT, "{\"format\":1,", "{\"format\":1,\"format\":2,"),
        replace(INSPECT, "{\"format\":1,", "{\"format\":1,\"unexpected\":0,"),
        replace(
            INSPECT,
            "\"format\":1,\"product\":\"keida-hub-reborn\"",
            "\"product\":\"keida-hub-reborn\",\"format\":1",
        ),
        replace(INSPECT, "\"format\":1", "\"format\": 1"),
        replace(INSPECT, "inspect", "\\u0069nspect"),
        replace(INSPECT, "keida-hub-reborn", "keida-hub-rébørn"),
        replace(INSPECT, "\"format\":1", "\"format\":1.0"),
        replace(INSPECT, "\"format\":1", "\"format\":1e0"),
        replace(INSPECT, "\"format\":1", "\"format\":+1"),
        replace(INSPECT, "\"format\":1", "\"format\":01"),
        replace(INSPECT, "\"format\":1", "\"format\":true"),
        replace(INSPECT, "\"format\":1", "\"format\":\"1\""),
        replace(INSPECT, "\"format\":1", "\"format\":null"),
        format!("[{INSPECT}]"),
        format!("{INSPECT}{INSPECT}"),
        "null".to_owned(),
        "{}".to_owned(),
        INSPECT[..INSPECT.len() - 1].to_owned(),
    ];
    for bytes in cases {
        refused_request(bytes.as_bytes());
    }
    refused_request(&[0xff, 0xfe]);
    refused_request(&vec![b'a'; 16_385]);
}

#[test]
fn command_fields_are_closed_typed_and_required() {
    for (source, old, new) in [
        (INSPECT, "\"format\":1", "\"format\":2"),
        (INSPECT, "keida-hub-reborn", "keida-hub-rewrite"),
        (INSPECT, "inspect", "install"),
        (INSPECT, INSTALLATION, "0123456789ABCDEF0123456789abcdef"),
        (INSPECT, INSTALLATION, "0123456789abcdef0123456789abcde"),
        (INSPECT, INSTALLATION, "../0123456789abcdef0123456789ab"),
        (STATUS_CURRENT, "current", "CURRENT"),
        (STATUS_CURRENT, "current", ""),
        (
            STATUS_OPERATION,
            OPERATION,
            "1111111111111111111111111111111g",
        ),
        (
            APPLY,
            "\"expected_generation\":7",
            "\"expected_generation\":0",
        ),
        (
            APPLY,
            "\"expected_generation\":7",
            "\"expected_generation\":-7",
        ),
        (
            APPLY,
            "\"expected_generation\":7",
            "\"expected_generation\":7.0",
        ),
        (
            APPLY,
            "\"expected_generation\":7",
            "\"expected_generation\":7e0",
        ),
        (
            APPLY,
            "\"expected_generation\":7",
            "\"expected_generation\":18446744073709551616",
        ),
        (APPLY, "\"expected_generation\":7,", ""),
        (APPLY, "prepared_receipt_sha256", "admission_sha256"),
        (PREPARE, "plan_id", "operation_id"),
        (
            RECONCILE,
            "expected_request_sha256",
            "prepared_receipt_sha256",
        ),
        (
            APPLY,
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        ),
        (
            APPLY,
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        ),
    ] {
        refused_request(replace(source, old, new).as_bytes());
    }
    for source in [INSPECT, STATUS_CURRENT, PREPARE, APPLY, RECONCILE, ROLLBACK] {
        let with_url = format!(
            "{},\"url\":\"https://example.invalid/image\"}}",
            &source[..source.len() - 1]
        );
        refused_request(with_url.as_bytes());
    }
    let maximum = replace(
        APPLY,
        "\"expected_generation\":7",
        "\"expected_generation\":18446744073709551615",
    );
    assert!(parse_request(maximum.as_bytes(), &independent_hash(maximum.as_bytes())).is_ok());
}

#[test]
fn installed_binding_is_literal_canonical_and_identity_coherent() {
    let binding = parse_installed_binding(
        INSTALLED.as_bytes(),
        &independent_hash(INSTALLED.as_bytes()),
    )
    .expect("frozen canonical installed binding");
    assert_eq!(binding.canonical_bytes(), INSTALLED.as_bytes());
    let leap_day = replace(
        INSTALLED,
        "2026-10-28T21:18:09.639816887Z",
        "2024-02-29T00:00:00.000000000Z",
    );
    assert!(
        parse_installed_binding(leap_day.as_bytes(), &independent_hash(leap_day.as_bytes()))
            .is_ok()
    );
    for (old, new) in [
        ("\"format\":1", "\"format\":2"),
        ("\"generation\":7", "\"generation\":0"),
        ("\"generation\":7", "\"generation\":18446744073709551616"),
        ("\"ordinal\":18", "\"ordinal\":17"),
        ("\"ordinal\":18", "\"ordinal\":0"),
        ("0.1.18", "0.1.018"),
        ("0.1.18", "0.1.18-preview.697699187aca"),
        ("accepted", "development"),
        ("\"database_schema\":13", "\"database_schema\":12"),
        ("reborn-workspace-v1", "reborn-workspace-v2"),
        (
            "697699187aca6780d8ba7b199dc2ba90b033bd67",
            "697699187aca6780d8ba7b199dc2ba90b033bd6G",
        ),
        ("sha256:74231723", "sha512:74231723"),
        (
            "2026-10-28T21:18:09.639816887Z",
            "2026-02-29T21:18:09.639816887Z",
        ),
        (
            "2026-10-28T21:18:09.639816887Z",
            "2026-10-28T24:18:09.639816887Z",
        ),
        (
            "2026-10-28T21:18:09.639816887Z",
            "2026-10-28T21:18:60.639816887Z",
        ),
        (
            "2026-10-28T21:18:09.639816887Z",
            "2026-10-28T21:18:09.63981688Z",
        ),
        (
            "2026-10-28T21:18:09.639816887Z",
            "2026-10-28T21:18:09.6398168870Z",
        ),
        (
            "2026-10-28T21:18:09.639816887Z",
            "2026-10-28T21:18:09.639816887+00:00",
        ),
        (
            "2026-10-28T21:18:09.639816887Z",
            "2026-10-28t21:18:09.639816887z",
        ),
        ("\"container_id\":", "\"public_cid\":"),
    ] {
        refused_installed(replace(INSTALLED, old, new).as_bytes());
    }
    refused_installed(format!("{INSTALLED}\n").as_bytes());
    refused_installed(replace(INSTALLED, "\"format\":1,", "\"format\":1,\"format\":1,").as_bytes());
    refused_installed(&vec![b'a'; 4_097]);
}

static NEXT: AtomicU64 = AtomicU64::new(0);
struct PrivateFixture(PathBuf);
impl PrivateFixture {
    fn new() -> Self {
        let path = std::env::temp_dir().join(format!(
            "reborn-updater-cli-contract-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        DirBuilder::new()
            .mode(0o700)
            .create(&path)
            .expect("new private fixture");
        Self(path)
    }

    fn request(&self, name: &str, bytes: &[u8]) -> PathBuf {
        let path = self.0.join(name);
        let mut file = OpenOptions::new()
            .write(true)
            .create_new(true)
            .mode(0o400)
            .open(&path)
            .expect("create request fixture");
        file.write_all(bytes).expect("fixture bytes");
        file.sync_all().expect("fixture fsync");
        path
    }
}
impl Drop for PrivateFixture {
    fn drop(&mut self) {
        fs::remove_dir_all(&self.0).expect("remove only owned fixture");
    }
}

#[test]
fn cli_checks_request_without_authorizing_or_performing_the_named_operation() {
    let fixture = PrivateFixture::new();
    let path = fixture.request("apply.json", APPLY.as_bytes());
    let before = fs::read_dir(&fixture.0).expect("fixture entries").count();
    let output = Command::new(env!("CARGO_BIN_EXE_reborn-host-updater"))
        .args([
            "check-request",
            path.to_str().expect("ASCII fixture"),
            &independent_hash(APPLY.as_bytes()),
        ])
        .output()
        .expect("run actual diagnostic CLI");
    assert!(output.status.success(), "{:?}", output.stderr);
    let response: serde_json::Value =
        serde_json::from_slice(&output.stdout).expect("sanitized JSON");
    assert_eq!(
        response,
        serde_json::json!({
            "format":1,
            "product":"keida-hub-reborn",
            "command":"apply",
            "request_sha256": independent_hash(APPLY.as_bytes()),
            "effects_authorized":false
        })
    );
    assert_eq!(
        fs::read_dir(&fixture.0).expect("fixture entries").count(),
        before
    );
    assert_eq!(fs::read(path).expect("request unchanged"), APPLY.as_bytes());
}

#[test]
fn cli_refuses_effect_commands_and_unsafe_request_files() {
    let fixture = PrivateFixture::new();
    let path = fixture.request("inspect.json", INSPECT.as_bytes());
    let digest = independent_hash(INSPECT.as_bytes());
    for command in [
        "apply",
        "prepare",
        "rollback",
        "reconcile",
        "install",
        "uninstall",
    ] {
        let output = Command::new(env!("CARGO_BIN_EXE_reborn-host-updater"))
            .args([command, path.to_str().expect("ASCII"), &digest])
            .output()
            .expect("actual CLI command refusal");
        assert_eq!(output.status.code(), Some(2));
    }
    let link = fixture.0.join("symlink.json");
    symlink(&path, &link).expect("fixture symlink");
    let hardlink = fixture.0.join("hardlink.json");
    fs::hard_link(&path, &hardlink).expect("fixture hardlink");
    for unsafe_path in [&link, &hardlink, &path] {
        let output = Command::new(env!("CARGO_BIN_EXE_reborn-host-updater"))
            .args([
                "check-request",
                unsafe_path.to_str().expect("ASCII"),
                &digest,
            ])
            .output()
            .expect("actual CLI unsafe-file refusal");
        assert_eq!(output.status.code(), Some(2));
    }
    fs::remove_file(&hardlink).expect("remove only owned hardlink");
    fs::set_permissions(&path, fs::Permissions::from_mode(0o600)).expect("wrong request mode");
    let output = Command::new(env!("CARGO_BIN_EXE_reborn-host-updater"))
        .args(["check-request", path.to_str().expect("ASCII"), &digest])
        .output()
        .expect("actual CLI wrong-mode refusal");
    assert_eq!(output.status.code(), Some(2));
    assert!(!fixture.0.join("operations").exists());
}
