//! Independent M5.4 fixture subjects and outcomes, frozen before peer admission
//! implementation inspection. All archive/provenance/host records are fictional.
//! Passing these checks establishes local diagnostic agreement, never adoption,
//! publisher authentication, fresh host truth or an actual update.

use reborn_host_updater::{
    bundle_fs::{Bundle, TrustMode},
    check_bundle,
};
use serde_json::{Value, json};
use sha2::{Digest, Sha256};
use std::{
    collections::{BTreeMap, VecDeque},
    fs::{self, DirBuilder, File, OpenOptions},
    io::Write,
    os::{
        fd::{AsRawFd, FromRawFd},
        unix::fs::{DirBuilderExt, MetadataExt, OpenOptionsExt, PermissionsExt, symlink},
    },
    path::{Path, PathBuf},
    process::{Command, Output, Stdio},
    sync::atomic::{AtomicU64, Ordering},
    time::{Duration, Instant},
};

const PROFILE: &str = "manual-installed-adoption-v1";
const INSTALLATION: &str = "0123456789abcdef0123456789abcdef";
const COMMIT: &str = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const TREE: &str = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const IMAGE: &str = "sha256:cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc";
const PRIOR_IMAGE: &str = "sha256:dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd";
const PG_IMAGE: &str = "sha256:eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const APP: &str = "1111111111111111111111111111111111111111111111111111111111111111";
const PRIOR: &str = "2222222222222222222222222222222222222222222222222222222222222222";
const POSTGRES: &str = "3333333333333333333333333333333333333333333333333333333333333333";
const NETWORK: &str = "4444444444444444444444444444444444444444444444444444444444444444";
const BINARY: &str = "5555555555555555555555555555555555555555555555555555555555555555";
const PUBLISHER_EXECUTION: &str =
    "6666666666666666666666666666666666666666666666666666666666666666";
const OBSERVER_EXECUTION: &str = "7777777777777777777777777777777777777777777777777777777777777777";
const REVIEW_EXECUTION: &str = "8888888888888888888888888888888888888888888888888888888888888888";
const RECEIPT: &str = "9999999999999999999999999999999999999999999999999999999999999999";
const BOOT: &str = "01234567-89ab-4cde-8123-456789abcdef";
const APP_BIRTH: &str = "2026-01-02T03:04:05.123456789Z";
const PG_BIRTH: &str = "2026-01-01T01:02:03.000000001Z";
const REPOSITORY: &str = "Hizumi-Senpai/Keida-Hub-Reborn";
const WORKFLOW: &str = ".github/workflows/foundation.yml";
const PRIVATE_MARKER: &str = "fixture-private-payload-do-not-echo";
const MAX_ARCHIVE: u64 = 1_073_741_824;
type Files = BTreeMap<&'static str, Vec<u8>>;
static NEXT: AtomicU64 = AtomicU64::new(0);

fn digest(bytes: &[u8]) -> String {
    Sha256::digest(bytes)
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}
fn q(value: &str) -> String {
    serde_json::to_string(value).expect("fixture string")
}
fn n(value: u64) -> String {
    value.to_string()
}
fn object(fields: &[(&str, String)]) -> Vec<u8> {
    format!(
        "{{{}}}",
        fields
            .iter()
            .map(|(key, value)| format!("{}:{value}", q(key)))
            .collect::<Vec<_>>()
            .join(",")
    )
    .into_bytes()
}
fn h(files: &Files, name: &str) -> String {
    q(&digest(files.get(name).expect("fixture leaf")))
}
fn paths() -> Vec<String> {
    (1..=24)
        .map(|number| {
            format!(
                "/assets/workspace/{number:064x}.{}",
                if number % 2 == 0 { "css" } else { "js" }
            )
        })
        .collect()
}
fn step_record(number: u64) -> String {
    String::from_utf8(object(&[
        ("number", n(number)),
        ("name", q(&format!("fixture required step {number}"))),
        ("conclusion", q("success")),
    ]))
    .expect("step JSON")
}
fn fixture_files() -> Files {
    fixture_files_with_archives(
        b"fictional ZIP bytes; no extraction or provenance authentication\n",
        b"fictional original CI tar bytes; no Docker image inspection\n",
    )
}
fn fixture_files_with_archives(zip_bytes: &[u8], tar_bytes: &[u8]) -> Files {
    let mut files = Files::new();
    for (name, body) in [
        ("artifact.zip", zip_bytes),
        ("image.tar", tar_bytes),
        (
            "manual-installed.json",
            b"opaque fictional manual-installed bytes\0\xff; fixture-private-payload-do-not-echo"
                .as_slice(),
        ),
        (
            "manual-operation.state",
            b"opaque fictional terminal state\0\xfe".as_slice(),
        ),
        (
            "terminal-receipt.json",
            b"opaque fictional receipt\0\xfd".as_slice(),
        ),
        (
            "policy.json",
            b"opaque reviewed policy fixture\0\xfc".as_slice(),
        ),
        (
            "inventory.json",
            b"opaque reviewed protected-owner inventory fixture\0\xfb".as_slice(),
        ),
    ] {
        files.insert(name, body.to_vec());
    }
    let asset_paths = paths();
    let asset_hashes: Vec<_> = (1..=24).map(|number| format!("{number:064x}")).collect();
    let archive = digest(&files["image.tar"]);
    let zip = digest(&files["artifact.zip"]);
    let size = files["artifact.zip"].len() as u64;
    files.insert(
        "manifest.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            ("version", q("0.1.18")),
            ("ordinal", n(18)),
            ("commit", q(COMMIT)),
            ("tree", q(TREE)),
            ("channel", q("accepted")),
            ("contract", q("reborn-workspace-v1")),
            ("database_schema", n(13)),
            ("binary_sha256", q(BINARY)),
            ("image_id", q(IMAGE)),
            ("archive_sha256", q(&archive)),
            ("qualification_execution_sha256", q(PUBLISHER_EXECUTION)),
            ("ci_run", n(1001)),
            (
                "assets",
                serde_json::to_string(&asset_hashes).expect("asset digest literals"),
            ),
        ]),
    );
    let identity = object(&[
        ("product", q("keida-hub-reborn")),
        ("version", q("0.1.18")),
        ("commit", q(COMMIT)),
        ("tree", q(TREE)),
        ("ordinal", n(18)),
        ("channel", q("accepted")),
        ("contract", q("reborn-auth-v1")),
        ("package_version", q("0.1.0")),
    ]);
    files.insert(
        "image-proof.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            (
                "identity",
                String::from_utf8(identity).expect("identity JSON"),
            ),
            ("database_schema", n(13)),
            ("workspace_contract", q("reborn-workspace-v1")),
            (
                "assets",
                serde_json::to_string(&asset_paths).expect("asset paths"),
            ),
            ("image_id", q(IMAGE)),
            ("binary_sha256", q(BINARY)),
            ("archive_sha256", q(&archive)),
        ]),
    );
    files.insert(
        "recovery-proof.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            ("image_id", q(IMAGE)),
            ("database_schema", n(13)),
            ("fresh_private_claim", "true".into()),
            (
                "restored_native_session_note_and_encrypted_connection",
                "true".into(),
            ),
            ("restored_directory_and_personal_pins", "true".into()),
            ("restored_activity_and_newer_entries", "true".into()),
            ("restored_notifications_and_read_state", "true".into()),
            ("restored_personal_layout_and_newer_edits", "true".into()),
            (
                "restored_provider_observations_and_newer_samples",
                "true".into(),
            ),
            ("restored_media_connections_and_observations", "true".into()),
            ("restored_queue_connections_and_observations", "true".into()),
            ("restored_discord_application_and_links", "true".into()),
            ("restored_discord_newer_identity_writes", "true".into()),
            (
                "discarded_unfinished_discord_attempts_on_restart",
                "true".into(),
            ),
            (
                "restored_session_selectors_and_targeted_revocation",
                "true".into(),
            ),
            (
                "preserved_newer_sessions_and_unrelated_access",
                "true".into(),
            ),
            ("failed_candidate_preserved_newer_writes", "true".into()),
            ("automatic_old_backup_restore", "false".into()),
            ("dump_sha256", q(RECEIPT)),
            ("separate_postgresql_instance", "true".into()),
            ("runtime_role_cannot_migrate", "true".into()),
            ("fixture_only", "true".into()),
        ]),
    );
    files.insert(
        "source-qualification.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            ("version", q("0.1.18")),
            ("ordinal", n(18)),
            ("commit", q(COMMIT)),
            ("tree", q(TREE)),
            ("channel", q("accepted")),
            ("auth_contract", q("reborn-auth-v1")),
            ("anchor", q("c06c3a03a3be17c4293e77b57fa3063ec65c8ad8")),
            ("qualified_main_sha", q(COMMIT)),
            ("execution_sha256", q(REVIEW_EXECUTION)),
        ]),
    );
    files.insert(
        "governance-qualification.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            ("repository", q(REPOSITORY)),
            ("qualified_main_sha", q(COMMIT)),
            ("workflow", q(WORKFLOW)),
            ("policy_sha256", h(&files, "policy.json")),
            ("governance_receipt_sha256", q(RECEIPT)),
            ("execution_sha256", q(REVIEW_EXECUTION)),
        ]),
    );
    let steps = (1..=20)
        .chain([38, 39, 40, 41])
        .map(step_record)
        .collect::<Vec<_>>()
        .join(",");
    files.insert(
        "artifact-qualification.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            ("repository", q(REPOSITORY)),
            ("ci_run", n(1001)),
            ("ci_attempt", n(1)),
            ("head_sha", q(COMMIT)),
            ("head_branch", q("main")),
            ("event", q("push")),
            ("workflow", q(WORKFLOW)),
            ("conclusion", q("success")),
            ("required_job", q("Rust 1.99.1 / PostgreSQL 16")),
            ("required_steps", format!("[{steps}]")),
            ("artifact_id", n(2001)),
            ("artifact_size", n(size)),
            ("artifact_zip_sha256", q(&zip)),
            ("archive_sha256", q(&archive)),
            ("image_proof_sha256", h(&files, "image-proof.json")),
            ("recovery_proof_sha256", h(&files, "recovery-proof.json")),
            ("publication_execution_sha256", q(PUBLISHER_EXECUTION)),
            ("download_execution_sha256", q(REVIEW_EXECUTION)),
        ]),
    );
    files.insert(
        "compatibility-qualification.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            ("profile", q("manual-installed-schema13-current-data-v1")),
            ("installed_manifest_sha256", h(&files, "manifest.json")),
            ("installed_image_id", q(IMAGE)),
            ("rollback_image_id", q(PRIOR_IMAGE)),
            ("database_schema", n(13)),
            ("workspace_contract", q("reborn-workspace-v1")),
            ("compatibility_receipt_sha256", q(RECEIPT)),
            ("final_recovery_index_sha256", q(RECEIPT)),
            ("execution_sha256", q(REVIEW_EXECUTION)),
        ]),
    );
    let mut projection = object(&[
        ("format", n(1)),
        ("product", q("keida-hub-reborn")),
        ("version", q("0.1.18")),
        ("ordinal", n(18)),
        ("channel", q("accepted")),
        ("commit", q(COMMIT)),
        ("tree", q(TREE)),
        ("contract", q("reborn-workspace-v1")),
        ("database_schema", n(13)),
        ("binary_sha256", q(BINARY)),
        ("image_id", q(IMAGE)),
        ("archive_sha256", q(&archive)),
        ("ci_run", n(1001)),
        ("container_id", q(APP)),
        ("retained_prior_container_id", q(PRIOR)),
    ]);
    projection.push(b'\n');
    files.insert("manual-projection.json", projection);
    files.insert(
        "installed-binding.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            ("installation_id", q(INSTALLATION)),
            ("generation", n(1)),
            ("version", q("0.1.18")),
            ("ordinal", n(18)),
            ("commit", q(COMMIT)),
            ("tree", q(TREE)),
            ("channel", q("accepted")),
            ("image_id", q(IMAGE)),
            ("manifest_sha256", h(&files, "manifest.json")),
            ("binary_sha256", q(BINARY)),
            ("database_schema", n(13)),
            ("workspace_contract", q("reborn-workspace-v1")),
            ("container_id", q(APP)),
            ("container_started_at", q(APP_BIRTH)),
        ]),
    );
    files.insert(
        "observation.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            ("profile", q(PROFILE)),
            ("installation_id", q(INSTALLATION)),
            ("observer_execution_sha256", q(OBSERVER_EXECUTION)),
            ("boot_id", q(BOOT)),
            ("observed_boottime_ns", n(10_000_000_000)),
            ("app_container_id", q(APP)),
            ("app_started_at", q(APP_BIRTH)),
            ("app_image_id", q(IMAGE)),
            ("retained_prior_container_id", q(PRIOR)),
            ("retained_prior_image_id", q(PRIOR_IMAGE)),
            ("postgres_container_id", q(POSTGRES)),
            ("postgres_started_at", q(PG_BIRTH)),
            ("postgres_image_id", q(PG_IMAGE)),
            ("network_id", q(NETWORK)),
            ("lock_device", n(40)),
            ("lock_inode", n(42)),
            ("lock_claim", q("held-during-observation")),
            (
                "manual_installed_sha256",
                h(&files, "manual-installed.json"),
            ),
            ("manual_state_sha256", h(&files, "manual-operation.state")),
            (
                "terminal_receipt_sha256",
                h(&files, "terminal-receipt.json"),
            ),
            (
                "manual_projection_sha256",
                h(&files, "manual-projection.json"),
            ),
            (
                "installed_binding_sha256",
                h(&files, "installed-binding.json"),
            ),
            ("policy_sha256", h(&files, "policy.json")),
            ("inventory_sha256", h(&files, "inventory.json")),
            ("current_authority", q("manual-installed-json")),
            ("adopted_authority", q("absent")),
            ("unresolved_work", q("none")),
        ]),
    );
    files.insert(
        "assessment.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            ("profile", q(PROFILE)),
            ("installation_id", q(INSTALLATION)),
            ("observation_sha256", h(&files, "observation.json")),
            ("assessment_execution_sha256", q(REVIEW_EXECUTION)),
            ("boot_id", q(BOOT)),
            ("assessed_boottime_ns", n(70_000_000_000)),
            ("expected_observer_execution_sha256", q(OBSERVER_EXECUTION)),
            (
                "expected_installed_binding_sha256",
                h(&files, "installed-binding.json"),
            ),
            ("expected_postgres_container_id", q(POSTGRES)),
            ("expected_postgres_started_at", q(PG_BIRTH)),
            ("expected_postgres_image_id", q(PG_IMAGE)),
            ("expected_network_id", q(NETWORK)),
            ("expected_lock_device", n(40)),
            ("expected_lock_inode", n(42)),
            ("policy_sha256", h(&files, "policy.json")),
            ("inventory_sha256", h(&files, "inventory.json")),
            ("current_authority", q("manual-installed-json")),
            ("adopted_authority", q("absent")),
            ("unresolved_work", q("none")),
        ]),
    );
    files.insert(
        "authority-transition.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            ("profile", q(PROFILE)),
            ("installation_id", q(INSTALLATION)),
            ("state", q("proposed")),
            ("from_authority", q("manual-installed-json")),
            ("to_authority", q("single-installed-binding")),
            (
                "manual_installed_sha256",
                h(&files, "manual-installed.json"),
            ),
            ("manual_state_sha256", h(&files, "manual-operation.state")),
            (
                "terminal_receipt_sha256",
                h(&files, "terminal-receipt.json"),
            ),
            (
                "installed_binding_sha256",
                h(&files, "installed-binding.json"),
            ),
            ("origin_generation", n(1)),
            ("policy_sha256", h(&files, "policy.json")),
            ("inventory_sha256", h(&files, "inventory.json")),
            ("observation_sha256", h(&files, "observation.json")),
            ("assessment_sha256", h(&files, "assessment.json")),
            ("handover", q("required-before-effects")),
            ("adoption_performed", "false".into()),
        ]),
    );
    files.insert(
        "admission.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            ("profile", q(PROFILE)),
            ("installation_id", q(INSTALLATION)),
            ("policy_sha256", h(&files, "policy.json")),
            ("inventory_sha256", h(&files, "inventory.json")),
            ("version", q("0.1.18")),
            ("ordinal", n(18)),
            ("commit", q(COMMIT)),
            ("tree", q(TREE)),
            ("channel", q("accepted")),
            ("platform", q("linux/amd64")),
            ("database_schema", n(13)),
            ("workspace_contract", q("reborn-workspace-v1")),
            ("manifest_sha256", h(&files, "manifest.json")),
            ("archive_sha256", q(&archive)),
            ("image_id", q(IMAGE)),
            ("binary_sha256", q(BINARY)),
            ("qualification_execution_sha256", q(PUBLISHER_EXECUTION)),
            ("ci_run", n(1001)),
            ("ci_attempt", n(1)),
            ("repository", q(REPOSITORY)),
            ("workflow", q(WORKFLOW)),
            ("artifact_id", n(2001)),
            ("artifact_size", n(size)),
            ("artifact_zip_sha256", q(&zip)),
            (
                "assets",
                serde_json::to_string(&asset_paths).expect("asset path literals"),
            ),
            ("image_proof_sha256", h(&files, "image-proof.json")),
            ("recovery_proof_sha256", h(&files, "recovery-proof.json")),
            (
                "source_qualification_sha256",
                h(&files, "source-qualification.json"),
            ),
            (
                "governance_qualification_sha256",
                h(&files, "governance-qualification.json"),
            ),
            (
                "artifact_qualification_sha256",
                h(&files, "artifact-qualification.json"),
            ),
            (
                "compatibility_qualification_sha256",
                h(&files, "compatibility-qualification.json"),
            ),
        ]),
    );
    files.insert(
        "adoption-plan.json",
        object(&[
            ("format", n(1)),
            ("product", q("keida-hub-reborn")),
            ("profile", q(PROFILE)),
            ("installation_id", q(INSTALLATION)),
            ("envelope_sha256", h(&files, "admission.json")),
            (
                "manual_installed_sha256",
                h(&files, "manual-installed.json"),
            ),
            ("manual_state_sha256", h(&files, "manual-operation.state")),
            (
                "terminal_receipt_sha256",
                h(&files, "terminal-receipt.json"),
            ),
            (
                "manual_projection_sha256",
                h(&files, "manual-projection.json"),
            ),
            (
                "installed_binding_sha256",
                h(&files, "installed-binding.json"),
            ),
            ("policy_sha256", h(&files, "policy.json")),
            ("inventory_sha256", h(&files, "inventory.json")),
            ("observation_sha256", h(&files, "observation.json")),
            ("assessment_sha256", h(&files, "assessment.json")),
            ("transition_sha256", h(&files, "authority-transition.json")),
            ("origin_generation", n(1)),
        ]),
    );
    assert_eq!(files.len(), 21);
    files
}

fn set_field(files: &mut Files, file: &'static str, key: &str, replacement: Value) {
    set_raw_field(
        files,
        file,
        key,
        &serde_json::to_string(&replacement).expect("replacement field"),
    );
}
fn set_raw_field(files: &mut Files, file: &'static str, key: &str, replacement: &str) {
    let bytes = files.get(file).expect("record");
    let parsed: BTreeMap<String, Box<serde_json::value::RawValue>> =
        serde_json::from_slice(bytes).expect("fixture JSON");
    let old = parsed.get(key).expect("known fixture field");
    let old = format!("{}:{}", q(key), old.get());
    let new = format!("{}:{replacement}", q(key));
    let text = std::str::from_utf8(bytes).expect("record UTF8");
    assert!(
        text.contains(&old),
        "field replacement must preserve the published literal encoding: {file}/{key}"
    );
    files.insert(file, text.replacen(&old, &new, 1).into_bytes());
}

fn replace_text(files: &mut Files, file: &'static str, old: &str, new: &str) {
    let text = std::str::from_utf8(files.get(file).expect("record")).expect("record UTF8");
    assert!(
        text.contains(old),
        "negative fixture must actually change {file}"
    );
    files.insert(file, text.replacen(old, new, 1).into_bytes());
}

// Only hash-reference parents are resealed. A malformed subject field is never
// silently corrected, sorted, deduplicated or copied from parser output.
fn parents(file: &str) -> &'static [(&'static str, &'static str)] {
    match file {
        "manifest.json" => &[
            ("admission.json", "manifest_sha256"),
            ("installed-binding.json", "manifest_sha256"),
            (
                "compatibility-qualification.json",
                "installed_manifest_sha256",
            ),
        ],
        "image-proof.json" => &[
            ("admission.json", "image_proof_sha256"),
            ("artifact-qualification.json", "image_proof_sha256"),
        ],
        "recovery-proof.json" => &[
            ("admission.json", "recovery_proof_sha256"),
            ("artifact-qualification.json", "recovery_proof_sha256"),
        ],
        "source-qualification.json" => &[("admission.json", "source_qualification_sha256")],
        "governance-qualification.json" => &[("admission.json", "governance_qualification_sha256")],
        "artifact-qualification.json" => &[("admission.json", "artifact_qualification_sha256")],
        "compatibility-qualification.json" => {
            &[("admission.json", "compatibility_qualification_sha256")]
        }
        "installed-binding.json" => &[
            ("observation.json", "installed_binding_sha256"),
            ("assessment.json", "expected_installed_binding_sha256"),
            ("authority-transition.json", "installed_binding_sha256"),
            ("adoption-plan.json", "installed_binding_sha256"),
        ],
        "manual-projection.json" => &[
            ("observation.json", "manual_projection_sha256"),
            ("adoption-plan.json", "manual_projection_sha256"),
        ],
        "manual-installed.json" => &[
            ("observation.json", "manual_installed_sha256"),
            ("authority-transition.json", "manual_installed_sha256"),
            ("adoption-plan.json", "manual_installed_sha256"),
        ],
        "manual-operation.state" => &[
            ("observation.json", "manual_state_sha256"),
            ("authority-transition.json", "manual_state_sha256"),
            ("adoption-plan.json", "manual_state_sha256"),
        ],
        "terminal-receipt.json" => &[
            ("observation.json", "terminal_receipt_sha256"),
            ("authority-transition.json", "terminal_receipt_sha256"),
            ("adoption-plan.json", "terminal_receipt_sha256"),
        ],
        "policy.json" => &[
            ("admission.json", "policy_sha256"),
            ("governance-qualification.json", "policy_sha256"),
            ("observation.json", "policy_sha256"),
            ("assessment.json", "policy_sha256"),
            ("authority-transition.json", "policy_sha256"),
            ("adoption-plan.json", "policy_sha256"),
        ],
        "inventory.json" => &[
            ("admission.json", "inventory_sha256"),
            ("observation.json", "inventory_sha256"),
            ("assessment.json", "inventory_sha256"),
            ("authority-transition.json", "inventory_sha256"),
            ("adoption-plan.json", "inventory_sha256"),
        ],
        "observation.json" => &[
            ("assessment.json", "observation_sha256"),
            ("authority-transition.json", "observation_sha256"),
            ("adoption-plan.json", "observation_sha256"),
        ],
        "assessment.json" => &[
            ("authority-transition.json", "assessment_sha256"),
            ("adoption-plan.json", "assessment_sha256"),
        ],
        "authority-transition.json" => &[("adoption-plan.json", "transition_sha256")],
        "admission.json" => &[("adoption-plan.json", "envelope_sha256")],
        _ => &[],
    }
}
fn reseal_parents(files: &mut Files, changed: &'static str) {
    let mut queue = VecDeque::from([changed]);
    let mut work = 0;
    while let Some(file) = queue.pop_front() {
        work += 1;
        assert!(
            work < 256,
            "fixture hash graph must stay acyclic and bounded"
        );
        let hash = digest(files.get(file).expect("changed fixture record"));
        for (parent, key) in parents(file) {
            let value: Value = serde_json::from_slice(&files[parent]).expect("parent JSON");
            if value[*key] != hash {
                set_field(files, parent, key, json!(hash));
                queue.push_back(parent);
            }
        }
    }
}

struct Fixture {
    base: PathBuf,
    directory: PathBuf,
    files: Files,
}
impl Fixture {
    fn new(files: Files) -> Self {
        let base = std::env::temp_dir().join(format!(
            "reborn-admission-contract-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        DirBuilder::new()
            .mode(0o700)
            .create(&base)
            .expect("new owned fixture root");
        let directory = base.join("bundle");
        DirBuilder::new()
            .mode(0o700)
            .create(&directory)
            .expect("private bundle");
        for (name, bytes) in &files {
            write_new(&directory.join(name), bytes, 0o400);
        }
        let production = base.join("pseudo-production");
        DirBuilder::new()
            .mode(0o700)
            .create(&production)
            .expect("owned pseudo-production fixture");
        for name in ["installed.json", "operation.state", "journal-evidence.json"] {
            write_new(&production.join(name), PRIVATE_MARKER.as_bytes(), 0o400);
        }
        Self {
            base,
            directory,
            files,
        }
    }
    fn envelope(&self) -> String {
        digest(&self.files["admission.json"])
    }
    fn plan(&self) -> String {
        digest(&self.files["adoption-plan.json"])
    }
    fn check(&self) -> bool {
        check_bundle(
            &self.directory,
            &self.envelope(),
            &self.plan(),
            TrustMode::Fixture,
        )
        .is_ok()
    }
    fn cli(&self, fixture_mode: bool) -> Output {
        let mut command = Command::new(env!("CARGO_BIN_EXE_reborn-host-updater"));
        command
            .arg("check-bundle")
            .arg(&self.directory)
            .arg(self.envelope())
            .arg(self.plan());
        if fixture_mode {
            command.arg("--fixture");
        }
        bounded_output(command)
    }
}
impl Drop for Fixture {
    fn drop(&mut self) {
        fs::remove_dir_all(&self.base).expect("remove only owned admission fixture");
    }
}

fn write_new(path: &Path, bytes: &[u8], mode: u32) {
    let mut file = OpenOptions::new()
        .write(true)
        .create_new(true)
        .mode(mode)
        .open(path)
        .expect("new fixture input");
    file.write_all(bytes).expect("fixture bytes");
    file.sync_all().expect("fixture fsync");
}
fn overwrite(path: &Path, bytes: &[u8]) {
    fs::set_permissions(path, fs::Permissions::from_mode(0o600))
        .expect("enable owned fixture mutation");
    fs::write(path, bytes).expect("mutate only owned fixture");
    fs::set_permissions(path, fs::Permissions::from_mode(0o400)).expect("restore sealed mode");
}

// Native bounded waiting uses the exact child pidfd, not a polling loop or an
// untracked PID that might be reused. No unrelated process is signalled.
fn bounded_output(mut command: Command) -> Output {
    let mut child = command
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .expect("actual diagnostic CLI");
    // SAFETY: pidfd_open accepts the ID of this unreaped owned child and flags0.
    let fd = unsafe { libc::syscall(libc::SYS_pidfd_open, child.id(), 0) };
    if fd < 0 {
        let _ = child.kill();
        let _ = child.wait();
        panic!("Linux pidfd fixture unavailable");
    }
    // SAFETY: pidfd_open returned a new uniquely owned descriptor.
    let pidfd = unsafe { File::from_raw_fd(fd as i32) };
    let deadline = Instant::now() + Duration::from_secs(8);
    loop {
        let remaining = deadline.saturating_duration_since(Instant::now());
        let timeout = i32::try_from(remaining.as_millis()).unwrap_or(8_000);
        let mut descriptor = libc::pollfd {
            fd: pidfd.as_raw_fd(),
            events: libc::POLLIN,
            revents: 0,
        };
        // SAFETY: descriptor points to one initialized writable pollfd.
        let result = unsafe { libc::poll(&mut descriptor, 1, timeout) };
        if result > 0 {
            break;
        }
        if result < 0
            && std::io::Error::last_os_error().kind() == std::io::ErrorKind::Interrupted
            && Instant::now() < deadline
        {
            continue;
        }
        let _ = child.kill();
        let _ = child.wait();
        panic!("diagnostic CLI exceeded its bounded fixture wait");
    }
    child
        .wait_with_output()
        .expect("reap exact diagnostic child")
}

#[derive(Debug, Eq, PartialEq)]
struct Evidence {
    kind: &'static str,
    mode: u32,
    uid: u32,
    gid: u32,
    device: u64,
    inode: u64,
    links: u64,
    mtime: (i64, i64),
    ctime: (i64, i64),
    bytes: Vec<u8>,
}
fn snapshot(path: &Path) -> BTreeMap<PathBuf, Evidence> {
    let mut result = BTreeMap::new();
    fn visit(base: &Path, path: &Path, output: &mut BTreeMap<PathBuf, Evidence>) {
        for item in fs::read_dir(path).expect("owned snapshot directory") {
            let path = item.expect("snapshot entry").path();
            let metadata = fs::symlink_metadata(&path).expect("snapshot metadata");
            let (kind, bytes) = if metadata.is_dir() {
                ("directory", Vec::new())
            } else if metadata.is_file() {
                ("file", fs::read(&path).expect("snapshot bytes"))
            } else if metadata.file_type().is_symlink() {
                (
                    "symlink",
                    fs::read_link(&path)
                        .expect("snapshot symlink")
                        .as_os_str()
                        .as_encoded_bytes()
                        .to_vec(),
                )
            } else {
                ("special", Vec::new())
            };
            output.insert(
                path.strip_prefix(base)
                    .expect("owned relative path")
                    .to_path_buf(),
                Evidence {
                    kind,
                    mode: metadata.mode(),
                    uid: metadata.uid(),
                    gid: metadata.gid(),
                    device: metadata.dev(),
                    inode: metadata.ino(),
                    links: metadata.nlink(),
                    mtime: (metadata.mtime(), metadata.mtime_nsec()),
                    ctime: (metadata.ctime(), metadata.ctime_nsec()),
                    bytes,
                },
            );
            if metadata.is_dir() {
                visit(base, &path, output);
            }
        }
    }
    visit(path, path, &mut result);
    result
}
fn expect_refused(files: Files) {
    let fixture = Fixture::new(files);
    let before = snapshot(&fixture.base);
    assert!(
        !fixture.check(),
        "invalid fixture accepted by actual checker"
    );
    let output = fixture.cli(true);
    assert_eq!(output.status.code(), Some(2));
    assert!(output.stdout.is_empty());
    assert_eq!(
        String::from_utf8(output.stderr)
            .expect("sanitized error")
            .trim(),
        "bundle check refused; no effects authorized"
    );
    assert_eq!(
        snapshot(&fixture.base),
        before,
        "diagnostic refusal changed evidence"
    );
}

#[test]
fn complete_fictional_bundle_is_diagnostic_only_and_opaque_evidence_is_not_reinterpreted() {
    assert_complete_fixture(fixture_files());
    let zip: Vec<u8> = (0..130 * 1024).map(|index| (index % 251) as u8).collect();
    let tar: Vec<u8> = (0..200 * 1024).map(|index| ((index % 241) as u8) ^ 0xa5).collect();
    assert_complete_fixture(fixture_files_with_archives(&zip, &tar));
}

fn assert_complete_fixture(files: Files) {
    let fixture = Fixture::new(files);
    let before = snapshot(&fixture.base);
    assert!(
        fixture.check(),
        "complete independently constructed fictional bundle"
    );
    let output = fixture.cli(true);
    assert!(output.status.success(), "{:?}", output.stderr);
    let report: Value = serde_json::from_slice(&output.stdout).expect("diagnostic JSON");
    assert_eq!(
        report,
        json!({"format":1,"product":"keida-hub-reborn","profile":PROFILE,"trust_basis":"same-uid-fixture","envelope_sha256":fixture.envelope(),"adoption_plan_sha256":fixture.plan(),"archive_rehashed":true,"zip_rehashed":true,"proposed_generation":1,"manual_authority_retained":true,"effects_authorized":false,"adoption_performed":false,"execution_ready":false})
    );
    assert!(!String::from_utf8_lossy(&output.stdout).contains(PRIVATE_MARKER));
    assert!(
        !String::from_utf8_lossy(&output.stdout)
            .contains(fixture.base.to_str().expect("fixture path"))
    );
    assert_eq!(snapshot(&fixture.base), before);
    let bundle = Bundle::open(&fixture.directory, TrustMode::Fixture)
        .expect("actual held descriptor bundle");
    assert_eq!(
        bundle.digest("artifact.zip").expect("ZIP digest"),
        digest(&fixture.files["artifact.zip"])
    );
    assert_eq!(
        bundle.digest("image.tar").expect("tar digest"),
        digest(&fixture.files["image.tar"])
    );
    assert_eq!(
        bundle.len("artifact.zip").expect("ZIP length"),
        fixture.files["artifact.zip"].len() as u64
    );
    assert_eq!(
        bundle.len("image.tar").expect("tar length"),
        fixture.files["image.tar"].len() as u64
    );
    assert!(
        bundle.bytes("artifact.zip").is_err(),
        "streamed ZIP must not be buffered as JSON"
    );
    assert!(
        bundle.bytes("image.tar").is_err(),
        "streamed tar must not be buffered as JSON"
    );
    assert_eq!(
        bundle
            .bytes("admission.json")
            .expect("small bounded record"),
        fixture.files["admission.json"].as_slice()
    );
    assert!(bundle.bytes("../pseudo-production/installed.json").is_err());
}

#[test]
fn explicit_fixture_mode_cannot_silently_claim_root_trust() {
    let fixture = Fixture::new(fixture_files());
    let explicit: Value =
        serde_json::from_slice(&fixture.cli(true).stdout).expect("explicit fixture output");
    assert_eq!(explicit["trust_basis"], "same-uid-fixture");
    let output = fixture.cli(false);
    // SAFETY: geteuid takes no arguments or memory pointers.
    if unsafe { libc::geteuid() } == 0 {
        assert!(output.status.success());
        let report: Value = serde_json::from_slice(&output.stdout).expect("root diagnostic report");
        assert_eq!(report["trust_basis"], "root-sealed-core-admission");
        assert_eq!(report["effects_authorized"], false);
        assert_eq!(report["adoption_performed"], false);
        assert_eq!(report["execution_ready"], false);
    } else {
        assert_eq!(output.status.code(), Some(2));
    }
}

#[test]
fn every_envelope_subject_and_file_reference_is_checked_after_resealing_its_parent() {
    let cases = [
        ("product", json!("keida-hub-rewrite")),
        ("profile", json!("future-target-v1")),
        ("installation_id", json!("fedcba9876543210fedcba9876543210")),
        ("policy_sha256", json!(RECEIPT)),
        ("inventory_sha256", json!(RECEIPT)),
        ("version", json!("0.1.19")),
        ("ordinal", json!(19)),
        ("commit", json!("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb")),
        ("tree", json!(COMMIT)),
        ("channel", json!("preview")),
        ("platform", json!("linux/arm64")),
        ("database_schema", json!(12)),
        ("workspace_contract", json!("reborn-auth-v1")),
        ("manifest_sha256", json!(RECEIPT)),
        ("archive_sha256", json!(RECEIPT)),
        ("image_id", json!(PRIOR_IMAGE)),
        ("binary_sha256", json!(RECEIPT)),
        ("qualification_execution_sha256", json!(REVIEW_EXECUTION)),
        ("ci_run", json!(1002)),
        ("ci_attempt", json!(2)),
        ("repository", json!("Hizumi-Senpai/Keida-Hub")),
        ("workflow", json!(".github/workflows/other.yml")),
        ("artifact_id", json!(2002)),
        ("artifact_size", json!(999)),
        ("artifact_zip_sha256", json!(RECEIPT)),
        ("image_proof_sha256", json!(RECEIPT)),
        ("recovery_proof_sha256", json!(RECEIPT)),
        ("source_qualification_sha256", json!(RECEIPT)),
        ("governance_qualification_sha256", json!(RECEIPT)),
        ("artifact_qualification_sha256", json!(RECEIPT)),
        ("compatibility_qualification_sha256", json!(RECEIPT)),
    ];
    for (key, value) in cases {
        let mut files = fixture_files();
        set_field(&mut files, "admission.json", key, value);
        reseal_parents(&mut files, "admission.json");
        expect_refused(files);
    }
}

#[test]
fn every_new_record_requires_its_canonical_encoding_even_when_hash_references_match() {
    for file in [
        "admission.json",
        "adoption-plan.json",
        "source-qualification.json",
        "governance-qualification.json",
        "artifact-qualification.json",
        "compatibility-qualification.json",
        "observation.json",
        "assessment.json",
        "authority-transition.json",
        "installed-binding.json",
    ] {
        for form in 0..5 {
            let mut files = fixture_files();
            match form {
                0 => {
                    files.get_mut(file).expect("record").push(b'\n');
                }
                1 => replace_text(
                    &mut files,
                    file,
                    "\"format\":1",
                    "\"format\":1,\"format\":1",
                ),
                2 => replace_text(
                    &mut files,
                    file,
                    "\"format\":1",
                    "\"format\":1,\"unknown\":0",
                ),
                3 => replace_text(
                    &mut files,
                    file,
                    "\"format\":1,\"product\":\"keida-hub-reborn\"",
                    "\"product\":\"keida-hub-reborn\",\"format\":1",
                ),
                4 => replace_text(&mut files, file, "\"format\":1", "\"format\":1e0"),
                _ => unreachable!(),
            }
            reseal_parents(&mut files, file);
            expect_refused(files);
        }
    }
}

#[test]
fn producer_formatting_is_preserved_but_duplicate_unknown_or_mismatched_proofs_refuse() {
    for file in ["manifest.json", "image-proof.json", "recovery-proof.json"] {
        let mut files = fixture_files();
        let value: Value = serde_json::from_slice(&files[file]).expect("producer JSON");
        files.insert(
            file,
            serde_json::to_vec_pretty(&value).expect("bound original formatting"),
        );
        reseal_parents(&mut files, file);
        assert!(
            Fixture::new(files).check(),
            "valid original producer formatting refused"
        );
        for key in [
            "\"format\":1,\"format\":1",
            "\"format\":1,\"unrecognized\":true",
        ] {
            let mut files = fixture_files();
            replace_text(&mut files, file, "\"format\":1", key);
            reseal_parents(&mut files, file);
            expect_refused(files);
        }
    }
    for (file, old, new) in [
        (
            "image-proof.json",
            "\"contract\":\"reborn-auth-v1\"",
            "\"contract\":\"reborn-workspace-v1\"",
        ),
        (
            "image-proof.json",
            "\"package_version\":\"0.1.0\"",
            "\"package_version\":\"0.1.18\"",
        ),
        (
            "image-proof.json",
            "\"database_schema\":13",
            "\"database_schema\":12",
        ),
        (
            "manifest.json",
            "\"contract\":\"reborn-workspace-v1\"",
            "\"contract\":\"reborn-auth-v1\"",
        ),
        ("manifest.json", "\"ci_run\":1001", "\"ci_run\":1002"),
        (
            "recovery-proof.json",
            "\"fixture_only\":true",
            "\"fixture_only\":false",
        ),
        (
            "recovery-proof.json",
            "\"automatic_old_backup_restore\":false",
            "\"automatic_old_backup_restore\":true",
        ),
    ] {
        let mut files = fixture_files();
        replace_text(&mut files, file, old, new);
        reseal_parents(&mut files, file);
        expect_refused(files);
    }
    let source = fixture_files();
    let recovery: Value =
        serde_json::from_slice(&source["recovery-proof.json"]).expect("recovery shape");
    for (key, value) in recovery.as_object().expect("proof object") {
        if value == &json!(true) {
            let mut files = fixture_files();
            set_field(&mut files, "recovery-proof.json", key, json!(false));
            reseal_parents(&mut files, "recovery-proof.json");
            expect_refused(files);
        }
    }
}

#[test]
fn assets_are_unique_ordered_paths_with_matching_manifest_digests_and_no_normalization() {
    for file in ["admission.json", "image-proof.json"] {
        for mutation in 0..5 {
            let mut assets = paths();
            match mutation {
                0 => assets.swap(0, 1),
                1 => assets[1] = assets[0].clone(),
                2 => {
                    assets.pop();
                }
                3 => assets[0] = assets[0].replace(".js", ".wasm"),
                4 => assets[0].push_str("?revision=1"),
                _ => unreachable!(),
            }
            let mut files = fixture_files();
            set_field(&mut files, file, "assets", json!(assets));
            reseal_parents(&mut files, file);
            expect_refused(files);
        }
    }
    let mut files = fixture_files();
    let mut hashes: Vec<_> = (1..=24).map(|number| format!("{number:064x}")).collect();
    hashes.swap(0, 1);
    set_field(&mut files, "manifest.json", "assets", json!(hashes));
    reseal_parents(&mut files, "manifest.json");
    expect_refused(files);
}

#[test]
fn sealed_ci_artifact_source_governance_and_actual_compatibility_records_must_agree() {
    for (file, key, bad) in [
        (
            "source-qualification.json",
            "qualified_main_sha",
            json!(TREE),
        ),
        (
            "source-qualification.json",
            "auth_contract",
            json!("reborn-workspace-v1"),
        ),
        ("source-qualification.json", "anchor", json!(COMMIT)),
        (
            "governance-qualification.json",
            "qualified_main_sha",
            json!(TREE),
        ),
        (
            "governance-qualification.json",
            "policy_sha256",
            json!(RECEIPT),
        ),
        ("artifact-qualification.json", "head_sha", json!(TREE)),
        ("artifact-qualification.json", "ci_run", json!(1002)),
        ("artifact-qualification.json", "ci_attempt", json!(2)),
        (
            "artifact-qualification.json",
            "head_branch",
            json!("preview"),
        ),
        (
            "artifact-qualification.json",
            "event",
            json!("pull_request"),
        ),
        (
            "artifact-qualification.json",
            "conclusion",
            json!("failure"),
        ),
        (
            "artifact-qualification.json",
            "required_job",
            json!("some passing job"),
        ),
        ("artifact-qualification.json", "artifact_id", json!(2002)),
        ("artifact-qualification.json", "artifact_size", json!(1)),
        (
            "artifact-qualification.json",
            "artifact_zip_sha256",
            json!(RECEIPT),
        ),
        (
            "artifact-qualification.json",
            "archive_sha256",
            json!(RECEIPT),
        ),
        (
            "artifact-qualification.json",
            "publication_execution_sha256",
            json!(REVIEW_EXECUTION),
        ),
        (
            "compatibility-qualification.json",
            "profile",
            json!("same-image-ci-fixture"),
        ),
        (
            "compatibility-qualification.json",
            "installed_image_id",
            json!(PRIOR_IMAGE),
        ),
        (
            "compatibility-qualification.json",
            "rollback_image_id",
            json!(IMAGE),
        ),
        (
            "compatibility-qualification.json",
            "database_schema",
            json!(12),
        ),
    ] {
        let mut files = fixture_files();
        set_field(&mut files, file, key, bad);
        reseal_parents(&mut files, file);
        expect_refused(files);
    }
    for (old, new) in [
        ("\"number\":1", "\"number\":2"),
        ("\"name\":\"fixture required step 1\"", "\"name\":\"\""),
        (
            "\"name\":\"fixture required step 1\"",
            "\"name\":\"invalid\\ncontrol\"",
        ),
        ("\"conclusion\":\"success\"", "\"conclusion\":\"skipped\""),
        (
            "{\"number\":1,\"name\":\"fixture required step 1\",\"conclusion\":\"success\"}",
            "{\"number\":1,\"name\":\"fixture required step 1\",\"conclusion\":\"skipped\"}",
        ),
    ] {
        let mut files = fixture_files();
        replace_text(&mut files, "artifact-qualification.json", old, new);
        reseal_parents(&mut files, "artifact-qualification.json");
        expect_refused(files);
    }
}

#[test]
fn sealed_age_is_context_bound_including_exact_sixty_second_and_future_boundaries() {
    let base = fixture_files();
    assert!(Fixture::new(base).check());
    for (observed, assessed, accepts) in [
        (1_u64, 1_u64, true),
        (10_000_000_000, 70_000_000_000, true),
        (10_000_000_000, 70_000_000_001, false),
        (70_000_000_001, 70_000_000_000, false),
        (0, 1, false),
    ] {
        let mut files = fixture_files();
        set_field(
            &mut files,
            "observation.json",
            "observed_boottime_ns",
            json!(observed),
        );
        reseal_parents(&mut files, "observation.json");
        set_field(
            &mut files,
            "assessment.json",
            "assessed_boottime_ns",
            json!(assessed),
        );
        reseal_parents(&mut files, "assessment.json");
        if accepts {
            assert!(Fixture::new(files).check(), "valid sealed age refused");
        } else {
            expect_refused(files);
        }
    }
}

#[test]
fn the_sealed_ci_record_requires_all_twenty_four_steps_in_the_exact_declared_order() {
    for mutation in 0..4 {
        let mut numbers: Vec<u64> = (1..=20).chain([38, 39, 40, 41]).collect();
        match mutation {
            0 => {
                numbers.pop();
            }
            1 => numbers.push(42),
            2 => numbers.swap(0, 1),
            3 => numbers[23] = 40,
            _ => unreachable!(),
        }
        let steps = format!(
            "[{}]",
            numbers
                .into_iter()
                .map(step_record)
                .collect::<Vec<_>>()
                .join(",")
        );
        let mut files = fixture_files();
        set_raw_field(
            &mut files,
            "artifact-qualification.json",
            "required_steps",
            &steps,
        );
        reseal_parents(&mut files, "artifact-qualification.json");
        expect_refused(files);
    }
}

#[test]
fn host_identity_lock_inventory_and_authority_disagreement_never_becomes_adoption() {
    for (file, key, bad) in [
        ("installed-binding.json", "generation", json!(18)),
        ("installed-binding.json", "container_id", json!(PRIOR)),
        ("manual-projection.json", "container_id", json!(PRIOR)),
        (
            "manual-projection.json",
            "retained_prior_container_id",
            json!(APP),
        ),
        (
            "observation.json",
            "boot_id",
            json!("01234567-89AB-4cde-8123-456789abcdef"),
        ),
        ("observation.json", "app_started_at", json!(PG_BIRTH)),
        ("observation.json", "app_container_id", json!(PRIOR)),
        (
            "observation.json",
            "retained_prior_container_id",
            json!(APP),
        ),
        ("observation.json", "retained_prior_image_id", json!(IMAGE)),
        ("observation.json", "postgres_container_id", json!(APP)),
        ("observation.json", "network_id", json!(RECEIPT)),
        ("observation.json", "lock_device", json!(0)),
        ("observation.json", "lock_inode", json!(43)),
        ("observation.json", "lock_claim", json!("held-now")),
        ("observation.json", "unresolved_work", json!("unknown")),
        (
            "assessment.json",
            "boot_id",
            json!("fedcba98-7654-4321-8123-456789abcdef"),
        ),
        (
            "assessment.json",
            "expected_postgres_container_id",
            json!(PRIOR),
        ),
        (
            "assessment.json",
            "expected_postgres_started_at",
            json!(APP_BIRTH),
        ),
        (
            "assessment.json",
            "expected_postgres_image_id",
            json!(IMAGE),
        ),
        ("assessment.json", "expected_network_id", json!(RECEIPT)),
        ("assessment.json", "expected_lock_device", json!(41)),
        ("assessment.json", "expected_lock_inode", json!(43)),
        (
            "assessment.json",
            "expected_observer_execution_sha256",
            json!(REVIEW_EXECUTION),
        ),
        ("assessment.json", "adopted_authority", json!("present")),
        ("authority-transition.json", "state", json!("adopted")),
        (
            "authority-transition.json",
            "from_authority",
            json!("two-installed-selectors"),
        ),
        (
            "authority-transition.json",
            "to_authority",
            json!("manual-installed-json"),
        ),
        ("authority-transition.json", "origin_generation", json!(18)),
        ("authority-transition.json", "handover", json!("completed")),
        (
            "authority-transition.json",
            "adoption_performed",
            json!(true),
        ),
        ("adoption-plan.json", "origin_generation", json!(18)),
        (
            "adoption-plan.json",
            "manual_installed_sha256",
            json!(RECEIPT),
        ),
    ] {
        let mut files = fixture_files();
        set_field(&mut files, file, key, bad);
        reseal_parents(&mut files, file);
        expect_refused(files);
    }
}

#[test]
fn projection_requires_the_explicit_export_shape_and_single_lf() {
    for mutation in 0..4 {
        let mut files = fixture_files();
        match mutation {
            0 => {
                files
                    .get_mut("manual-projection.json")
                    .expect("projection")
                    .pop();
            }
            1 => files
                .get_mut("manual-projection.json")
                .expect("projection")
                .push(b'\n'),
            2 => replace_text(
                &mut files,
                "manual-projection.json",
                "\"container_id\":",
                "\"public_cid\":",
            ),
            3 => replace_text(
                &mut files,
                "manual-projection.json",
                "\"format\":1",
                "\"format\": 1",
            ),
            _ => unreachable!(),
        }
        reseal_parents(&mut files, "manual-projection.json");
        expect_refused(files);
    }
}

#[test]
fn missing_extra_and_tampered_fixed_files_refuse_without_repairs_or_selector_changes() {
    for name in fixture_files().keys().copied().collect::<Vec<_>>() {
        let fixture = Fixture::new(fixture_files());
        fs::remove_file(fixture.directory.join(name)).expect("remove only fixture input");
        let before = snapshot(&fixture.base);
        assert!(!fixture.check(), "missing {name} accepted");
        assert_eq!(fixture.cli(true).status.code(), Some(2));
        assert_eq!(snapshot(&fixture.base), before);
    }
    for name in [
        "manual-installed.json",
        "manual-operation.state",
        "terminal-receipt.json",
        "policy.json",
        "inventory.json",
        "artifact.zip",
        "image.tar",
    ] {
        let fixture = Fixture::new(fixture_files());
        overwrite(&fixture.directory.join(name), b"unsealed changed raw bytes");
        assert!(!fixture.check(), "unsealed changed {name} accepted");
        assert_eq!(fixture.cli(true).status.code(), Some(2));
    }
    let fixture = Fixture::new(fixture_files());
    write_new(
        &fixture.directory.join("extra.json"),
        b"not admitted",
        0o400,
    );
    assert!(!fixture.check());
    assert_eq!(fixture.cli(true).status.code(), Some(2));
}

#[test]
fn external_top_hashes_and_cross_bundle_plan_substitution_are_not_self_asserted() {
    let fixture = Fixture::new(fixture_files());
    for (env, plan) in [
        ("0".repeat(64), fixture.plan()),
        (fixture.envelope(), "0".repeat(64)),
        (fixture.envelope().to_uppercase(), fixture.plan()),
        (fixture.envelope(), "f".repeat(63)),
    ] {
        assert!(check_bundle(&fixture.directory, &env, &plan, TrustMode::Fixture).is_err());
    }
    let mut files = fixture_files();
    files.insert("policy.json", b"different sealed policy".to_vec());
    reseal_parents(&mut files, "policy.json");
    let other_plan = files["adoption-plan.json"].clone();
    overwrite(&fixture.directory.join("adoption-plan.json"), &other_plan);
    assert!(
        check_bundle(
            &fixture.directory,
            &fixture.envelope(),
            &digest(&other_plan),
            TrustMode::Fixture
        )
        .is_err()
    );
}

#[test]
fn unsafe_file_kinds_modes_links_and_recursive_paths_are_refused_without_following_them() {
    for mutation in 0..6 {
        let fixture = Fixture::new(fixture_files());
        let path = fixture.directory.join("manual-installed.json");
        let external = fixture.base.join("external-evidence");
        write_new(&external, PRIVATE_MARKER.as_bytes(), 0o400);
        match mutation {
            0 => fs::set_permissions(&path, fs::Permissions::from_mode(0o600))
                .expect("unsealed mode"),
            1 => {
                fs::remove_file(&path).expect("remove input");
                symlink(&external, &path).expect("input symlink");
            }
            2 => {
                fs::hard_link(&path, fixture.base.join("hardlinked-input"))
                    .expect("input hardlink");
            }
            3 => {
                fs::remove_file(&path).expect("remove input");
                DirBuilder::new()
                    .mode(0o700)
                    .create(&path)
                    .expect("directory cannot replace file");
            }
            4 => {
                fs::remove_file(&path).expect("remove input");
                let name = std::ffi::CString::new(path.as_os_str().as_encoded_bytes())
                    .expect("fixture path");
                // SAFETY: name is a valid NUL-terminated owned fixture pathname.
                assert_eq!(unsafe { libc::mkfifo(name.as_ptr(), 0o400) }, 0);
            }
            5 => fs::set_permissions(&fixture.directory, fs::Permissions::from_mode(0o755))
                .expect("unsafe bundle mode"),
            _ => unreachable!(),
        }
        let output = fixture.cli(true);
        assert_eq!(output.status.code(), Some(2));
        assert_eq!(
            fs::read(external).expect("outside input untouched"),
            PRIVATE_MARKER.as_bytes()
        );
        assert!(
            !fixture
                .base
                .join("pseudo-production")
                .join("new-selector.json")
                .exists()
        );
    }
    let fixture = Fixture::new(fixture_files());
    let alias = fixture.base.join("bundle-alias");
    symlink(&fixture.directory, &alias).expect("root symlink");
    assert!(Bundle::open(&alias, TrustMode::Fixture).is_err());
    DirBuilder::new()
        .mode(0o700)
        .create(fixture.directory.join("recursive"))
        .expect("extra recursive directory");
    assert_eq!(fixture.cli(true).status.code(), Some(2));
}

#[test]
fn held_descriptors_detect_file_and_root_substitution_without_writing_the_replacement() {
    let fixture = Fixture::new(fixture_files());
    let bundle =
        Bundle::open(&fixture.directory, TrustMode::Fixture).expect("held input descriptors");
    let original = fixture.directory.join("policy.json");
    let moved = fixture.base.join("original-policy");
    fs::rename(&original, &moved).expect("move only fixture input");
    write_new(&original, &fixture.files["policy.json"], 0o400);
    assert!(bundle.revalidate().is_err());
    assert_eq!(
        fs::read(&moved).expect("old evidence"),
        fixture.files["policy.json"]
    );
    let fixture = Fixture::new(fixture_files());
    let bundle =
        Bundle::open(&fixture.directory, TrustMode::Fixture).expect("held root descriptor");
    let moved = fixture.base.join("original-bundle");
    fs::rename(&fixture.directory, &moved).expect("replace only fixture root");
    DirBuilder::new()
        .mode(0o700)
        .create(&fixture.directory)
        .expect("new empty replacement");
    assert!(bundle.revalidate().is_err());
    assert_eq!(
        fs::read_dir(&fixture.directory)
            .expect("replacement stays empty")
            .count(),
        0
    );
    assert_eq!(
        fs::read_dir(moved)
            .expect("original retained inputs")
            .count(),
        21
    );
}

#[test]
fn archive_and_record_byte_limits_fail_closed_without_allocating_or_extracting_archives() {
    for name in ["artifact.zip", "image.tar"] {
        let fixture = Fixture::new(fixture_files());
        let path = fixture.directory.join(name);
        fs::set_permissions(&path, fs::Permissions::from_mode(0o600))
            .expect("enable sparse fixture");
        let file = OpenOptions::new()
            .write(true)
            .open(&path)
            .expect("owned sparse file");
        file.set_len(MAX_ARCHIVE + 1)
            .expect("sparse over-limit length");
        fs::set_permissions(&path, fs::Permissions::from_mode(0o400))
            .expect("reseal sparse fixture");
        assert_eq!(fixture.cli(true).status.code(), Some(2));
        assert_eq!(
            fs::metadata(path).expect("sparse evidence retained").len(),
            MAX_ARCHIVE + 1
        );
    }
    for (name, limit) in [
        ("admission.json", 16_384),
        ("adoption-plan.json", 16_384),
        ("installed-binding.json", 4_096),
        ("source-qualification.json", 65_536),
        ("manual-installed.json", 65_536),
    ] {
        let fixture = Fixture::new(fixture_files());
        overwrite(&fixture.directory.join(name), &vec![b'x'; limit + 1]);
        assert_eq!(fixture.cli(true).status.code(), Some(2));
    }
    for name in [
        "manual-installed.json",
        "manual-operation.state",
        "terminal-receipt.json",
        "policy.json",
        "inventory.json",
    ] {
        let mut files = fixture_files();
        files.insert(name, Vec::new());
        reseal_parents(&mut files, name);
        expect_refused(files);
    }
}
