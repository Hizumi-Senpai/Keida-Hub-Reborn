//! Read-only validation of a sealed installed-state adoption proposal.
//!
//! These records describe the current artifact and a future generation origin.
//! They neither parse the complete historical manual record nor inspect a host,
//! acquire its operation lock, repair journals, or perform an authority handover.

use crate::{admission::CurrentArtifact, bundle_fs::Bundle, protocol};
use chrono::{NaiveDate, NaiveTime};
use serde::{Deserialize, Serialize, de::DeserializeOwned};

const PRODUCT: &str = "keida-hub-reborn";
const PROFILE: &str = "manual-installed-adoption-v1";
const RECORD_MAX: usize = 65_536;
const PLAN_MAX: usize = 16_384;
const ASSESSMENT_AGE_NS: u64 = 60_000_000_000;

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

fn boot_id(value: &str) -> bool {
    value.len() == 36
        && value.bytes().enumerate().all(|(index, byte)| {
            if matches!(index, 8 | 13 | 18 | 23) {
                byte == b'-'
            } else {
                byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte)
            }
        })
}

// The same frozen Docker-birth grammar as InstalledBinding, also applied to the
// independently supplied PostgreSQL birth. No wall clock is consulted.
fn container_timestamp(value: &str) -> bool {
    let bytes = value.as_bytes();
    if bytes.len() != 30
        || bytes[4] != b'-'
        || bytes[7] != b'-'
        || bytes[10] != b'T'
        || bytes[13] != b':'
        || bytes[16] != b':'
        || bytes[19] != b'.'
        || bytes[29] != b'Z'
        || bytes.iter().enumerate().any(|(index, byte)| {
            !matches!(index, 4 | 7 | 10 | 13 | 16 | 19 | 29) && !byte.is_ascii_digit()
        })
    {
        return false;
    }
    let parse = |start: usize, end: usize| value[start..end].parse::<u32>().ok();
    let (Some(year), Some(month), Some(day), Some(hour), Some(minute), Some(second), Some(nanos)) = (
        parse(0, 4),
        parse(5, 7),
        parse(8, 10),
        parse(11, 13),
        parse(14, 16),
        parse(17, 19),
        parse(20, 29),
    ) else {
        return false;
    };
    NaiveDate::from_ymd_opt(year as i32, month, day).is_some()
        && second < 60
        && NaiveTime::from_hms_nano_opt(hour, minute, second, nanos).is_some()
}

fn canonical<T: DeserializeOwned + Serialize>(bytes: &[u8], max: usize) -> Result<T, ()> {
    if bytes.is_empty() || bytes.len() > max || !bytes.is_ascii() || bytes.contains(&b'\\') {
        return Err(());
    }
    let record: T = serde_json::from_slice(bytes).map_err(|_| ())?;
    if serde_json::to_vec(&record).map_err(|_| ())? != bytes {
        return Err(());
    }
    Ok(record)
}

fn header(format: u64, product: &str, profile: &str, installation: &str, id: &str) -> bool {
    format == 1
        && product == PRODUCT
        && profile == PROFILE
        && hex(installation, 32)
        && installation == id
}

fn authorities(current: &str, adopted: &str, unresolved: &str) -> bool {
    current == "manual-installed-json" && adopted == "absent" && unresolved == "none"
}

fn digest_matches(bundle: &Bundle, name: &str, expected: &str) -> Result<bool, ()> {
    Ok(hex(expected, 64) && bundle.digest(name).map_err(|_| ())? == expected)
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct ManualProjection {
    format: u64,
    product: String,
    version: String,
    ordinal: u64,
    channel: String,
    commit: String,
    tree: String,
    contract: String,
    database_schema: u64,
    binary_sha256: String,
    image_id: String,
    archive_sha256: String,
    ci_run: u64,
    container_id: String,
    retained_prior_container_id: String,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct Observation {
    format: u64,
    product: String,
    profile: String,
    installation_id: String,
    observer_execution_sha256: String,
    boot_id: String,
    observed_boottime_ns: u64,
    app_container_id: String,
    app_started_at: String,
    app_image_id: String,
    retained_prior_container_id: String,
    retained_prior_image_id: String,
    postgres_container_id: String,
    postgres_started_at: String,
    postgres_image_id: String,
    network_id: String,
    lock_device: u64,
    lock_inode: u64,
    lock_claim: String,
    manual_installed_sha256: String,
    manual_state_sha256: String,
    terminal_receipt_sha256: String,
    manual_projection_sha256: String,
    installed_binding_sha256: String,
    policy_sha256: String,
    inventory_sha256: String,
    current_authority: String,
    adopted_authority: String,
    unresolved_work: String,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct Assessment {
    format: u64,
    product: String,
    profile: String,
    installation_id: String,
    observation_sha256: String,
    assessment_execution_sha256: String,
    boot_id: String,
    assessed_boottime_ns: u64,
    expected_observer_execution_sha256: String,
    expected_installed_binding_sha256: String,
    expected_postgres_container_id: String,
    expected_postgres_started_at: String,
    expected_postgres_image_id: String,
    expected_network_id: String,
    expected_lock_device: u64,
    expected_lock_inode: u64,
    policy_sha256: String,
    inventory_sha256: String,
    current_authority: String,
    adopted_authority: String,
    unresolved_work: String,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct Transition {
    format: u64,
    product: String,
    profile: String,
    installation_id: String,
    state: String,
    from_authority: String,
    to_authority: String,
    manual_installed_sha256: String,
    manual_state_sha256: String,
    terminal_receipt_sha256: String,
    installed_binding_sha256: String,
    origin_generation: u64,
    policy_sha256: String,
    inventory_sha256: String,
    observation_sha256: String,
    assessment_sha256: String,
    handover: String,
    adoption_performed: bool,
}

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
struct Plan {
    format: u64,
    product: String,
    profile: String,
    installation_id: String,
    envelope_sha256: String,
    manual_installed_sha256: String,
    manual_state_sha256: String,
    terminal_receipt_sha256: String,
    manual_projection_sha256: String,
    installed_binding_sha256: String,
    policy_sha256: String,
    inventory_sha256: String,
    observation_sha256: String,
    assessment_sha256: String,
    transition_sha256: String,
    origin_generation: u64,
}

fn projected_current(
    projection: &ManualProjection,
    binding: &protocol::InstalledBinding,
    artifact: &CurrentArtifact,
) -> bool {
    projection.format == 1
        && projection.product == PRODUCT
        && projection.version == artifact.version
        && projection.ordinal == artifact.ordinal
        && projection.channel == "accepted"
        && projection.commit == artifact.commit
        && projection.tree == artifact.tree
        && projection.contract == "reborn-workspace-v1"
        && projection.database_schema == 13
        && projection.binary_sha256 == artifact.binary_sha256
        && projection.image_id == artifact.image_id
        && projection.archive_sha256 == artifact.archive_sha256
        && projection.ci_run == artifact.ci_run
        && projection.container_id == binding.container_id()
        && hex(&projection.retained_prior_container_id, 64)
        && binding.installation_id() == artifact.installation_id
        && binding.generation() == 1
        && binding.version() == artifact.version
        && binding.ordinal() == artifact.ordinal
        && binding.commit() == artifact.commit
        && binding.tree() == artifact.tree
        && binding.image_id() == artifact.image_id
        && binding.manifest_sha256() == artifact.manifest_sha256
        && binding.binary_sha256() == artifact.binary_sha256
}

fn observed_current(
    observation: &Observation,
    projection: &ManualProjection,
    binding: &protocol::InstalledBinding,
    artifact: &CurrentArtifact,
) -> bool {
    header(
        observation.format,
        &observation.product,
        &observation.profile,
        &observation.installation_id,
        &artifact.installation_id,
    ) && hex(&observation.observer_execution_sha256, 64)
        && boot_id(&observation.boot_id)
        && observation.observed_boottime_ns > 0
        && observation.app_container_id == binding.container_id()
        && observation.app_started_at == binding.container_started_at()
        && observation.app_image_id == artifact.image_id
        && observation.retained_prior_container_id == projection.retained_prior_container_id
        && observation.retained_prior_image_id == artifact.rollback_image_id
        && image_id(&observation.retained_prior_image_id)
        && observation.retained_prior_image_id != observation.app_image_id
        && hex(&observation.postgres_container_id, 64)
        && observation.postgres_container_id != observation.app_container_id
        && observation.postgres_container_id != observation.retained_prior_container_id
        && observation.app_container_id != observation.retained_prior_container_id
        && container_timestamp(&observation.postgres_started_at)
        && image_id(&observation.postgres_image_id)
        && hex(&observation.network_id, 64)
        && observation.lock_device > 0
        && observation.lock_inode > 0
        && observation.lock_claim == "held-during-observation"
        && observation.policy_sha256 == artifact.policy_sha256
        && observation.inventory_sha256 == artifact.inventory_sha256
        && authorities(
            &observation.current_authority,
            &observation.adopted_authority,
            &observation.unresolved_work,
        )
}

fn assessed_observation(assessment: &Assessment, observation: &Observation) -> bool {
    header(
        assessment.format,
        &assessment.product,
        &assessment.profile,
        &assessment.installation_id,
        &observation.installation_id,
    ) && hex(&assessment.assessment_execution_sha256, 64)
        && assessment.boot_id == observation.boot_id
        && assessment.assessed_boottime_ns > 0
        && assessment
            .assessed_boottime_ns
            .checked_sub(observation.observed_boottime_ns)
            .is_some_and(|age| age <= ASSESSMENT_AGE_NS)
        && assessment.expected_observer_execution_sha256 == observation.observer_execution_sha256
        && assessment.expected_installed_binding_sha256 == observation.installed_binding_sha256
        && assessment.expected_postgres_container_id == observation.postgres_container_id
        && assessment.expected_postgres_started_at == observation.postgres_started_at
        && assessment.expected_postgres_image_id == observation.postgres_image_id
        && assessment.expected_network_id == observation.network_id
        && assessment.expected_lock_device == observation.lock_device
        && assessment.expected_lock_inode == observation.lock_inode
        && assessment.policy_sha256 == observation.policy_sha256
        && assessment.inventory_sha256 == observation.inventory_sha256
        && authorities(
            &assessment.current_authority,
            &assessment.adopted_authority,
            &assessment.unresolved_work,
        )
}

pub(crate) fn validate(
    bundle: &Bundle,
    artifact: &CurrentArtifact,
    envelope_sha256: &str,
    plan_sha256: &str,
) -> Result<(), ()> {
    if !digest_matches(bundle, "admission.json", envelope_sha256)?
        || !digest_matches(bundle, "adoption-plan.json", plan_sha256)?
    {
        return Err(());
    }
    // Opaque leaves are independently hash-bound. They are never deserialized,
    // interpreted as current host truth, or used to open production state.
    for name in [
        "manual-installed.json",
        "manual-operation.state",
        "terminal-receipt.json",
        "policy.json",
        "inventory.json",
    ] {
        if bundle.bytes(name).map_err(|_| ())?.is_empty() {
            return Err(());
        }
    }
    let plan: Plan = canonical(bundle.bytes("adoption-plan.json").map_err(|_| ())?, PLAN_MAX)?;
    if !header(
        plan.format,
        &plan.product,
        &plan.profile,
        &plan.installation_id,
        &artifact.installation_id,
    ) || plan.envelope_sha256 != envelope_sha256
        || plan.origin_generation != 1
        || plan.policy_sha256 != artifact.policy_sha256
        || plan.inventory_sha256 != artifact.inventory_sha256
    {
        return Err(());
    }
    for (name, expected) in [
        ("manual-installed.json", &plan.manual_installed_sha256),
        ("manual-operation.state", &plan.manual_state_sha256),
        ("terminal-receipt.json", &plan.terminal_receipt_sha256),
        ("manual-projection.json", &plan.manual_projection_sha256),
        ("installed-binding.json", &plan.installed_binding_sha256),
        ("policy.json", &plan.policy_sha256),
        ("inventory.json", &plan.inventory_sha256),
        ("observation.json", &plan.observation_sha256),
        ("assessment.json", &plan.assessment_sha256),
        ("authority-transition.json", &plan.transition_sha256),
    ] {
        if !digest_matches(bundle, name, expected)? {
            return Err(());
        }
    }
    let projection_bytes = bundle.bytes("manual-projection.json").map_err(|_| ())?;
    if projection_bytes.len() > RECORD_MAX {
        return Err(());
    }
    let projection: ManualProjection = canonical(
        projection_bytes.strip_suffix(b"\n").ok_or(())?,
        RECORD_MAX,
    )?;
    let binding = protocol::parse_installed_binding(
        bundle.bytes("installed-binding.json").map_err(|_| ())?,
        &plan.installed_binding_sha256,
    )
    .map_err(|_| ())?;
    if !projected_current(&projection, &binding, artifact) {
        return Err(());
    }
    let observation: Observation = canonical(
        bundle.bytes("observation.json").map_err(|_| ())?,
        RECORD_MAX,
    )?;
    if !observed_current(&observation, &projection, &binding, artifact) {
        return Err(());
    }
    for (name, expected) in [
        ("manual-installed.json", &observation.manual_installed_sha256),
        ("manual-operation.state", &observation.manual_state_sha256),
        ("terminal-receipt.json", &observation.terminal_receipt_sha256),
        ("manual-projection.json", &observation.manual_projection_sha256),
        ("installed-binding.json", &observation.installed_binding_sha256),
    ] {
        if !digest_matches(bundle, name, expected)? {
            return Err(());
        }
    }
    let assessment: Assessment = canonical(
        bundle.bytes("assessment.json").map_err(|_| ())?,
        RECORD_MAX,
    )?;
    if !assessed_observation(&assessment, &observation)
        || !digest_matches(bundle, "observation.json", &assessment.observation_sha256)?
    {
        return Err(());
    }
    let transition: Transition = canonical(
        bundle.bytes("authority-transition.json").map_err(|_| ())?,
        RECORD_MAX,
    )?;
    if !header(
        transition.format,
        &transition.product,
        &transition.profile,
        &transition.installation_id,
        &artifact.installation_id,
    ) || transition.state != "proposed"
        || transition.from_authority != "manual-installed-json"
        || transition.to_authority != "single-installed-binding"
        || transition.origin_generation != 1
        || transition.policy_sha256 != plan.policy_sha256
        || transition.inventory_sha256 != plan.inventory_sha256
        || transition.handover != "required-before-effects"
        || transition.adoption_performed
    {
        return Err(());
    }
    for (name, expected) in [
        ("manual-installed.json", &transition.manual_installed_sha256),
        ("manual-operation.state", &transition.manual_state_sha256),
        ("terminal-receipt.json", &transition.terminal_receipt_sha256),
        ("installed-binding.json", &transition.installed_binding_sha256),
        ("observation.json", &transition.observation_sha256),
        ("assessment.json", &transition.assessment_sha256),
    ] {
        if !digest_matches(bundle, name, expected)? {
            return Err(());
        }
    }
    Ok(())
}
