//! Agreement checks for a sealed, already-installed artifact bundle.
//!
//! This diagnostic trusts CORE's root-sealed review statements; it does not
//! authenticate historical GitHub activity, inspect a Docker image, extract an
//! archive, adopt an installation, or authorize effects. Existing producer proofs
//! retain their exact raw bytes. Only the new records have canonical encoding.

use crate::bundle_fs::Bundle;
use serde::{Deserialize, Serialize, de::DeserializeOwned};
use std::collections::BTreeSet;

const PRODUCT: &str = "keida-hub-reborn";
const PROFILE: &str = "manual-installed-adoption-v1";
const REPOSITORY: &str = "Hizumi-Senpai/Keida-Hub-Reborn";
const WORKFLOW: &str = ".github/workflows/foundation.yml";
const WORKSPACE: &str = "reborn-workspace-v1";
const AUTH: &str = "reborn-auth-v1";
const ANCHOR: &str = "c06c3a03a3be17c4293e77b57fa3063ec65c8ad8";
const MAX_ARCHIVE: u64 = 1_073_741_824;

/// Locally agreed current artifact values for the separate adoption diagnostic.
/// These fields are not an installed selector or execution capability.
pub(crate) struct CurrentArtifact {
    pub installation_id: String,
    pub policy_sha256: String,
    pub inventory_sha256: String,
    pub version: String,
    pub ordinal: u64,
    pub commit: String,
    pub tree: String,
    pub image_id: String,
    pub manifest_sha256: String,
    pub binary_sha256: String,
    pub archive_sha256: String,
    pub ci_run: u64,
    pub rollback_image_id: String,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct Admission {
    format: u64,
    product: String,
    profile: String,
    installation_id: String,
    policy_sha256: String,
    inventory_sha256: String,
    version: String,
    ordinal: u64,
    commit: String,
    tree: String,
    channel: String,
    platform: String,
    database_schema: u64,
    workspace_contract: String,
    manifest_sha256: String,
    archive_sha256: String,
    image_id: String,
    binary_sha256: String,
    qualification_execution_sha256: String,
    ci_run: u64,
    ci_attempt: u64,
    repository: String,
    workflow: String,
    artifact_id: u64,
    artifact_size: u64,
    artifact_zip_sha256: String,
    assets: Vec<String>,
    image_proof_sha256: String,
    recovery_proof_sha256: String,
    source_qualification_sha256: String,
    governance_qualification_sha256: String,
    artifact_qualification_sha256: String,
    compatibility_qualification_sha256: String,
}

// Legacy producer shapes are closed and typed, but deliberately not required to
// use this declaration order or canonical whitespace/escaping in their raw files.
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Manifest {
    format: u32,
    product: String,
    version: String,
    ordinal: u64,
    commit: String,
    tree: String,
    channel: String,
    contract: String,
    database_schema: u32,
    binary_sha256: String,
    image_id: String,
    archive_sha256: String,
    qualification_execution_sha256: String,
    ci_run: u64,
    assets: Vec<String>,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct ImageProof {
    format: u32,
    product: String,
    identity: ImageIdentity,
    database_schema: u32,
    workspace_contract: String,
    assets: Vec<String>,
    image_id: String,
    binary_sha256: String,
    archive_sha256: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct ImageIdentity {
    product: String,
    version: String,
    commit: String,
    tree: String,
    ordinal: u64,
    channel: String,
    contract: String,
    package_version: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct RecoveryProof {
    format: u32,
    product: String,
    image_id: String,
    database_schema: u32,
    fresh_private_claim: bool,
    restored_native_session_note_and_encrypted_connection: bool,
    restored_directory_and_personal_pins: bool,
    restored_activity_and_newer_entries: bool,
    restored_notifications_and_read_state: bool,
    restored_personal_layout_and_newer_edits: bool,
    restored_provider_observations_and_newer_samples: bool,
    restored_media_connections_and_observations: bool,
    restored_queue_connections_and_observations: bool,
    restored_discord_application_and_links: bool,
    restored_discord_newer_identity_writes: bool,
    discarded_unfinished_discord_attempts_on_restart: bool,
    restored_session_selectors_and_targeted_revocation: bool,
    preserved_newer_sessions_and_unrelated_access: bool,
    failed_candidate_preserved_newer_writes: bool,
    automatic_old_backup_restore: bool,
    dump_sha256: String,
    separate_postgresql_instance: bool,
    runtime_role_cannot_migrate: bool,
    fixture_only: bool,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct SourceQualification {
    format: u64,
    product: String,
    version: String,
    ordinal: u64,
    commit: String,
    tree: String,
    channel: String,
    auth_contract: String,
    anchor: String,
    qualified_main_sha: String,
    execution_sha256: String,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct GovernanceQualification {
    format: u64,
    product: String,
    repository: String,
    qualified_main_sha: String,
    workflow: String,
    policy_sha256: String,
    governance_receipt_sha256: String,
    execution_sha256: String,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct ArtifactQualification {
    format: u64,
    product: String,
    repository: String,
    ci_run: u64,
    ci_attempt: u64,
    head_sha: String,
    head_branch: String,
    event: String,
    workflow: String,
    conclusion: String,
    required_job: String,
    required_steps: Vec<QualifiedStep>,
    artifact_id: u64,
    artifact_size: u64,
    artifact_zip_sha256: String,
    archive_sha256: String,
    image_proof_sha256: String,
    recovery_proof_sha256: String,
    publication_execution_sha256: String,
    download_execution_sha256: String,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct QualifiedStep {
    number: u64,
    name: String,
    conclusion: String,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct CompatibilityQualification {
    format: u64,
    product: String,
    profile: String,
    installed_manifest_sha256: String,
    installed_image_id: String,
    rollback_image_id: String,
    database_schema: u64,
    workspace_contract: String,
    compatibility_receipt_sha256: String,
    final_recovery_index_sha256: String,
    execution_sha256: String,
}

fn hex(value: &str, length: usize) -> bool {
    value.len() == length
        && value
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

fn image_id(value: &str) -> bool {
    value
        .strip_prefix("sha256:")
        .is_some_and(|digest| hex(digest, 64))
}

fn header(format: u64, product: &str) -> bool {
    format == 1 && product == PRODUCT
}

fn raw_record<T: DeserializeOwned>(bundle: &Bundle, name: &str) -> Result<T, ()> {
    serde_json::from_slice(bundle.bytes(name).map_err(|_| ())?).map_err(|_| ())
}

fn new_record<T: DeserializeOwned + Serialize>(bundle: &Bundle, name: &str) -> Result<T, ()> {
    let bytes = bundle.bytes(name).map_err(|_| ())?;
    if !bytes.is_ascii() || bytes.contains(&b'\\') {
        return Err(());
    }
    let record: T = serde_json::from_slice(bytes).map_err(|_| ())?;
    if serde_json::to_vec(&record).map_err(|_| ())? != bytes {
        return Err(());
    }
    Ok(record)
}

fn reference(bundle: &Bundle, name: &str, expected_sha256: &str) -> Result<(), ()> {
    if !hex(expected_sha256, 64) || bundle.digest(name).map_err(|_| ())? != expected_sha256 {
        return Err(());
    }
    Ok(())
}

/// Validate exactly24 unique ordered full asset paths, returning their digests
/// without sorting/deduplicating either sequence.
fn asset_digests(paths: &[String]) -> Result<Vec<&str>, ()> {
    if paths.len() != 24 {
        return Err(());
    }
    let mut seen = BTreeSet::new();
    let mut digests = Vec::with_capacity(24);
    for path in paths {
        if !seen.insert(path.as_str()) {
            return Err(());
        }
        let rest = path.strip_prefix("/assets/workspace/").ok_or(())?;
        let (digest, extension) = rest.split_once('.').ok_or(())?;
        if !hex(digest, 64) || !matches!(extension, "js" | "css") {
            return Err(());
        }
        digests.push(digest);
    }
    Ok(digests)
}

fn validate_admission(bundle: &Bundle, admission: &Admission) -> Result<(), ()> {
    if !header(admission.format, &admission.product)
        || admission.profile != PROFILE
        || !hex(&admission.installation_id, 32)
        || admission.ordinal == 0
        || admission.version != format!("0.1.{}", admission.ordinal)
        || !hex(&admission.commit, 40)
        || !hex(&admission.tree, 40)
        || admission.channel != "accepted"
        || admission.platform != "linux/amd64"
        || admission.database_schema != 13
        || admission.workspace_contract != WORKSPACE
        || !image_id(&admission.image_id)
        || !hex(&admission.binary_sha256, 64)
        || !hex(&admission.qualification_execution_sha256, 64)
        || admission.ci_run == 0
        || admission.ci_attempt == 0
        || admission.repository != REPOSITORY
        || admission.workflow != WORKFLOW
        || admission.artifact_id == 0
        || admission.artifact_size == 0
        || admission.artifact_size > MAX_ARCHIVE
        || admission.artifact_size != bundle.len("artifact.zip").map_err(|_| ())?
    {
        return Err(());
    }
    for (name, digest) in [
        ("policy.json", &admission.policy_sha256),
        ("inventory.json", &admission.inventory_sha256),
        ("manifest.json", &admission.manifest_sha256),
        ("image.tar", &admission.archive_sha256),
        ("artifact.zip", &admission.artifact_zip_sha256),
        ("image-proof.json", &admission.image_proof_sha256),
        ("recovery-proof.json", &admission.recovery_proof_sha256),
        (
            "source-qualification.json",
            &admission.source_qualification_sha256,
        ),
        (
            "governance-qualification.json",
            &admission.governance_qualification_sha256,
        ),
        (
            "artifact-qualification.json",
            &admission.artifact_qualification_sha256,
        ),
        (
            "compatibility-qualification.json",
            &admission.compatibility_qualification_sha256,
        ),
    ] {
        reference(bundle, name, digest)?;
    }
    if bundle.bytes("policy.json").map_err(|_| ())?.is_empty()
        || bundle.bytes("inventory.json").map_err(|_| ())?.is_empty()
    {
        return Err(());
    }
    asset_digests(&admission.assets)?;
    Ok(())
}

fn validate_manifest(admission: &Admission, manifest: &Manifest) -> Result<(), ()> {
    let hashes: BTreeSet<_> = manifest.assets.iter().collect();
    if manifest.format != 1
        || manifest.product != PRODUCT
        || manifest.version != admission.version
        || manifest.ordinal != admission.ordinal
        || manifest.commit != admission.commit
        || manifest.tree != admission.tree
        || manifest.channel != admission.channel
        || manifest.contract != WORKSPACE
        || manifest.database_schema != 13
        || manifest.binary_sha256 != admission.binary_sha256
        || manifest.image_id != admission.image_id
        || manifest.archive_sha256 != admission.archive_sha256
        || manifest.qualification_execution_sha256 != admission.qualification_execution_sha256
        || manifest.ci_run != admission.ci_run
        || manifest.assets.len() != 24
        || hashes.len() != 24
        || manifest.assets.iter().any(|digest| !hex(digest, 64))
    {
        return Err(());
    }
    Ok(())
}

fn validate_image(
    admission: &Admission,
    manifest: &Manifest,
    proof: &ImageProof,
) -> Result<(), ()> {
    let identity = &proof.identity;
    if proof.format != 1
        || proof.product != PRODUCT
        || identity.product != PRODUCT
        || identity.version != admission.version
        || identity.commit != admission.commit
        || identity.tree != admission.tree
        || identity.ordinal != admission.ordinal
        || identity.channel != admission.channel
        || identity.contract != AUTH
        || identity.package_version != "0.1.0"
        || proof.database_schema != 13
        || proof.workspace_contract != WORKSPACE
        || proof.assets != admission.assets
        || proof.image_id != admission.image_id
        || proof.binary_sha256 != admission.binary_sha256
        || proof.archive_sha256 != admission.archive_sha256
    {
        return Err(());
    }
    let digests = asset_digests(&proof.assets)?;
    if digests
        .iter()
        .zip(&manifest.assets)
        .any(|(path_digest, manifest_digest)| *path_digest != manifest_digest.as_str())
    {
        return Err(());
    }
    Ok(())
}

fn validate_recovery(admission: &Admission, proof: &RecoveryProof) -> Result<(), ()> {
    if proof.format != 1
        || proof.product != PRODUCT
        || proof.image_id != admission.image_id
        || proof.database_schema != 13
        || !hex(&proof.dump_sha256, 64)
        || proof.automatic_old_backup_restore
        || [
            proof.fresh_private_claim,
            proof.restored_native_session_note_and_encrypted_connection,
            proof.restored_directory_and_personal_pins,
            proof.restored_activity_and_newer_entries,
            proof.restored_notifications_and_read_state,
            proof.restored_personal_layout_and_newer_edits,
            proof.restored_provider_observations_and_newer_samples,
            proof.restored_media_connections_and_observations,
            proof.restored_queue_connections_and_observations,
            proof.restored_discord_application_and_links,
            proof.restored_discord_newer_identity_writes,
            proof.discarded_unfinished_discord_attempts_on_restart,
            proof.restored_session_selectors_and_targeted_revocation,
            proof.preserved_newer_sessions_and_unrelated_access,
            proof.failed_candidate_preserved_newer_writes,
            proof.separate_postgresql_instance,
            proof.runtime_role_cannot_migrate,
            proof.fixture_only,
        ]
        .iter()
        .any(|flag| !*flag)
    {
        return Err(());
    }
    Ok(())
}

fn validate_source(admission: &Admission, source: &SourceQualification) -> Result<(), ()> {
    if !header(source.format, &source.product)
        || source.version != admission.version
        || source.ordinal != admission.ordinal
        || source.commit != admission.commit
        || source.tree != admission.tree
        || source.channel != admission.channel
        || source.auth_contract != AUTH
        || source.anchor != ANCHOR
        || source.qualified_main_sha != admission.commit
        || !hex(&source.execution_sha256, 64)
    {
        return Err(());
    }
    Ok(())
}

fn validate_governance(
    admission: &Admission,
    governance: &GovernanceQualification,
) -> Result<(), ()> {
    if !header(governance.format, &governance.product)
        || governance.repository != REPOSITORY
        || governance.qualified_main_sha != admission.commit
        || governance.workflow != WORKFLOW
        || governance.policy_sha256 != admission.policy_sha256
        || !hex(&governance.governance_receipt_sha256, 64)
        || !hex(&governance.execution_sha256, 64)
    {
        return Err(());
    }
    Ok(())
}

fn validate_artifact(admission: &Admission, artifact: &ArtifactQualification) -> Result<(), ()> {
    if !header(artifact.format, &artifact.product)
        || artifact.repository != REPOSITORY
        || artifact.ci_run != admission.ci_run
        || artifact.ci_attempt != admission.ci_attempt
        || artifact.head_sha != admission.commit
        || artifact.head_branch != "main"
        || artifact.event != "push"
        || artifact.workflow != WORKFLOW
        || artifact.conclusion != "success"
        || artifact.required_job != "Rust 1.99.1 / PostgreSQL 16"
        || artifact.required_steps.len() != 24
        || artifact.artifact_id != admission.artifact_id
        || artifact.artifact_size != admission.artifact_size
        || artifact.artifact_zip_sha256 != admission.artifact_zip_sha256
        || artifact.archive_sha256 != admission.archive_sha256
        || artifact.image_proof_sha256 != admission.image_proof_sha256
        || artifact.recovery_proof_sha256 != admission.recovery_proof_sha256
        || artifact.publication_execution_sha256 != admission.qualification_execution_sha256
        || !hex(&artifact.download_execution_sha256, 64)
    {
        return Err(());
    }
    for (step, number) in artifact
        .required_steps
        .iter()
        .zip((1..=20).chain([38, 39, 40, 41]))
    {
        if step.number != number
            || step.name.is_empty()
            || step.name.len() > 256
            || !step.name.is_ascii()
            || step.name.bytes().any(|byte| byte.is_ascii_control())
            || step.conclusion != "success"
        {
            return Err(());
        }
    }
    Ok(())
}

fn validate_compatibility(
    admission: &Admission,
    compatibility: &CompatibilityQualification,
) -> Result<(), ()> {
    if !header(compatibility.format, &compatibility.product)
        || compatibility.profile != "manual-installed-schema13-current-data-v1"
        || compatibility.installed_manifest_sha256 != admission.manifest_sha256
        || compatibility.installed_image_id != admission.image_id
        || !image_id(&compatibility.rollback_image_id)
        || compatibility.rollback_image_id == admission.image_id
        || compatibility.database_schema != 13
        || compatibility.workspace_contract != WORKSPACE
        || !hex(&compatibility.compatibility_receipt_sha256, 64)
        || !hex(&compatibility.final_recovery_index_sha256, 64)
        || !hex(&compatibility.execution_sha256, 64)
    {
        return Err(());
    }
    Ok(())
}

/// Validate local byte/statement agreement for the fixed current-artifact bundle.
/// No caller may treat success as independent publisher authentication or host
/// adoption; the root caller still performs the final held-descriptor recheck.
pub(crate) fn validate(
    bundle: &Bundle,
    envelope_sha256: &str,
    plan_sha256: &str,
) -> Result<(), ()> {
    // Bind both external roots before using their dependent statements.
    reference(bundle, "admission.json", envelope_sha256)?;
    reference(bundle, "adoption-plan.json", plan_sha256)?;
    let admission: Admission = new_record(bundle, "admission.json")?;
    validate_admission(bundle, &admission)?;

    let manifest: Manifest = raw_record(bundle, "manifest.json")?;
    let image: ImageProof = raw_record(bundle, "image-proof.json")?;
    let recovery: RecoveryProof = raw_record(bundle, "recovery-proof.json")?;
    validate_manifest(&admission, &manifest)?;
    validate_image(&admission, &manifest, &image)?;
    validate_recovery(&admission, &recovery)?;

    let source: SourceQualification = new_record(bundle, "source-qualification.json")?;
    let governance: GovernanceQualification = new_record(bundle, "governance-qualification.json")?;
    let artifact: ArtifactQualification = new_record(bundle, "artifact-qualification.json")?;
    let compatibility: CompatibilityQualification =
        new_record(bundle, "compatibility-qualification.json")?;
    validate_source(&admission, &source)?;
    validate_governance(&admission, &governance)?;
    validate_artifact(&admission, &artifact)?;
    validate_compatibility(&admission, &compatibility)?;

    let current = CurrentArtifact {
        installation_id: admission.installation_id,
        policy_sha256: admission.policy_sha256,
        inventory_sha256: admission.inventory_sha256,
        version: admission.version,
        ordinal: admission.ordinal,
        commit: admission.commit,
        tree: admission.tree,
        image_id: admission.image_id,
        manifest_sha256: admission.manifest_sha256,
        binary_sha256: admission.binary_sha256,
        archive_sha256: admission.archive_sha256,
        ci_run: admission.ci_run,
        rollback_image_id: compatibility.rollback_image_id,
    };
    crate::adoption::validate(bundle, &current, envelope_sha256, plan_sha256)
}
