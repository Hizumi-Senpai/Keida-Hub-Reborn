//! Strict, byte-bound updater request and installed-binding parsing.
//!
//! Parsing proves only that the supplied bytes match the frozen local protocol
//! and launch digest. It does not admit a publisher, authorize effects, adopt an
//! installation, or execute a command. Validated values have no public mutable
//! fields, and canonical encodings are derived only from those validated values.

use chrono::{NaiveDate, NaiveTime};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{error::Error, fmt};

pub const REQUEST_MAX_BYTES: usize = 16_384;
pub const INSTALLED_BINDING_MAX_BYTES: usize = 4_096;
const PRODUCT: &str = "keida-hub-reborn";

/// A bounded reason without including untrusted request content.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ProtocolError {
    RequestTooLarge,
    InstalledBindingTooLarge,
    InvalidExpectedHash,
    HashMismatch,
    InvalidJson,
    InvalidField,
    InvalidCommandFields,
    NonCanonical,
}

impl ProtocolError {
    pub fn code(self) -> &'static str {
        match self {
            Self::RequestTooLarge => "request_too_large",
            Self::InstalledBindingTooLarge => "installed_binding_too_large",
            Self::InvalidExpectedHash => "invalid_expected_hash",
            Self::HashMismatch => "hash_mismatch",
            Self::InvalidJson => "invalid_json",
            Self::InvalidField => "invalid_field",
            Self::InvalidCommandFields => "invalid_command_fields",
            Self::NonCanonical => "noncanonical_bytes",
        }
    }
}

impl fmt::Display for ProtocolError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(self.code())
    }
}

impl Error for ProtocolError {}

/// SHA256 of the exact supplied bytes, encoded as 64 lowercase hex digits.
pub fn sha256(bytes: &[u8]) -> String {
    Sha256::digest(bytes)
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}

fn hex(value: &str, length: usize) -> bool {
    value.len() == length
        && value
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

fn checked_hash(bytes: &[u8], expected_sha256: &str) -> Result<(), ProtocolError> {
    if !hex(expected_sha256, 64) {
        return Err(ProtocolError::InvalidExpectedHash);
    }
    if sha256(bytes) != expected_sha256 {
        return Err(ProtocolError::HashMismatch);
    }
    Ok(())
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct RawRequest {
    format: u64,
    product: String,
    installation_id: String,
    command: String,
    operation_id: Option<String>,
    plan_id: Option<String>,
    expected_generation: Option<u64>,
    expected_installed_sha256: Option<String>,
    policy_sha256: Option<String>,
    inventory_sha256: Option<String>,
    admission_sha256: Option<String>,
    prepared_receipt_sha256: Option<String>,
    expected_request_sha256: Option<String>,
}

/// A validated prepare request, which is not an authorization to prepare.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct PrepareRequest {
    plan_id: String,
    expected_generation: u64,
    expected_installed_sha256: String,
    policy_sha256: String,
    inventory_sha256: String,
    admission_sha256: String,
}

impl PrepareRequest {
    pub fn plan_id(&self) -> &str {
        &self.plan_id
    }

    pub fn expected_generation(&self) -> u64 {
        self.expected_generation
    }

    pub fn expected_installed_sha256(&self) -> &str {
        &self.expected_installed_sha256
    }

    pub fn policy_sha256(&self) -> &str {
        &self.policy_sha256
    }

    pub fn inventory_sha256(&self) -> &str {
        &self.inventory_sha256
    }

    pub fn admission_sha256(&self) -> &str {
        &self.admission_sha256
    }
}

/// A validated apply/rollback shape. Admission and effects remain separate.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct EffectRequest {
    operation_id: String,
    expected_generation: u64,
    expected_installed_sha256: String,
    policy_sha256: String,
    inventory_sha256: String,
    prepared_receipt_sha256: String,
}

impl EffectRequest {
    pub fn operation_id(&self) -> &str {
        &self.operation_id
    }

    pub fn expected_generation(&self) -> u64 {
        self.expected_generation
    }

    pub fn expected_installed_sha256(&self) -> &str {
        &self.expected_installed_sha256
    }

    pub fn policy_sha256(&self) -> &str {
        &self.policy_sha256
    }

    pub fn inventory_sha256(&self) -> &str {
        &self.inventory_sha256
    }

    pub fn prepared_receipt_sha256(&self) -> &str {
        &self.prepared_receipt_sha256
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
enum Command {
    Inspect,
    Status(String),
    Prepare(PrepareRequest),
    Apply(EffectRequest),
    Reconcile {
        operation_id: String,
        expected_request_sha256: String,
    },
    Rollback(EffectRequest),
}

/// Exactly one validated, canonical request. It grants no execution authority.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Request {
    installation_id: String,
    command: Command,
}

impl Request {
    pub fn command(&self) -> &'static str {
        match &self.command {
            Command::Inspect => "inspect",
            Command::Status(_) => "status",
            Command::Prepare(_) => "prepare",
            Command::Apply(_) => "apply",
            Command::Reconcile { .. } => "reconcile",
            Command::Rollback(_) => "rollback",
        }
    }

    pub fn installation_id(&self) -> &str {
        &self.installation_id
    }

    /// `status/current` has no operation ID; the literal is not an ID alias.
    pub fn operation_id(&self) -> Option<&str> {
        match &self.command {
            Command::Status(operation_id) if operation_id != "current" => Some(operation_id),
            Command::Apply(effect) | Command::Rollback(effect) => Some(effect.operation_id()),
            Command::Reconcile { operation_id, .. } => Some(operation_id),
            _ => None,
        }
    }

    pub fn plan_id(&self) -> Option<&str> {
        self.prepare().map(PrepareRequest::plan_id)
    }

    pub fn prepare(&self) -> Option<&PrepareRequest> {
        match &self.command {
            Command::Prepare(prepare) => Some(prepare),
            _ => None,
        }
    }

    pub fn effect(&self) -> Option<&EffectRequest> {
        match &self.command {
            Command::Apply(effect) | Command::Rollback(effect) => Some(effect),
            _ => None,
        }
    }

    pub fn expected_generation(&self) -> Option<u64> {
        match &self.command {
            Command::Prepare(prepare) => Some(prepare.expected_generation()),
            Command::Apply(effect) | Command::Rollback(effect) => {
                Some(effect.expected_generation())
            }
            _ => None,
        }
    }

    pub fn policy_sha256(&self) -> Option<&str> {
        match &self.command {
            Command::Prepare(prepare) => Some(prepare.policy_sha256()),
            Command::Apply(effect) | Command::Rollback(effect) => Some(effect.policy_sha256()),
            _ => None,
        }
    }

    pub fn expected_request_sha256(&self) -> Option<&str> {
        match &self.command {
            Command::Reconcile {
                expected_request_sha256,
                ..
            } => Some(expected_request_sha256),
            _ => None,
        }
    }

    pub fn canonical_bytes(&self) -> Vec<u8> {
        let mut encoded = format!(
            "{{\"format\":1,\"product\":\"{PRODUCT}\",\"installation_id\":\"{}\",\"command\":\"{}\"",
            self.installation_id,
            self.command()
        );
        match &self.command {
            Command::Inspect => {}
            Command::Status(operation_id) => {
                encoded.push_str(&format!(",\"operation_id\":\"{operation_id}\""));
            }
            Command::Prepare(prepare) => encoded.push_str(&format!(
                ",\"plan_id\":\"{}\",\"expected_generation\":{},\"expected_installed_sha256\":\"{}\",\"policy_sha256\":\"{}\",\"inventory_sha256\":\"{}\",\"admission_sha256\":\"{}\"",
                prepare.plan_id,
                prepare.expected_generation,
                prepare.expected_installed_sha256,
                prepare.policy_sha256,
                prepare.inventory_sha256,
                prepare.admission_sha256
            )),
            Command::Apply(effect) | Command::Rollback(effect) => encoded.push_str(&format!(
                ",\"operation_id\":\"{}\",\"expected_generation\":{},\"expected_installed_sha256\":\"{}\",\"policy_sha256\":\"{}\",\"inventory_sha256\":\"{}\",\"prepared_receipt_sha256\":\"{}\"",
                effect.operation_id,
                effect.expected_generation,
                effect.expected_installed_sha256,
                effect.policy_sha256,
                effect.inventory_sha256,
                effect.prepared_receipt_sha256
            )),
            Command::Reconcile {
                operation_id,
                expected_request_sha256,
            } => encoded.push_str(&format!(
                ",\"operation_id\":\"{operation_id}\",\"expected_request_sha256\":\"{expected_request_sha256}\""
            )),
        }
        encoded.push('}');
        encoded.into_bytes()
    }
}

fn field<T>(value: Option<T>) -> Result<T, ProtocolError> {
    value.ok_or(ProtocolError::InvalidCommandFields)
}

fn valid_generation_and_hashes(generation: u64, hashes: &[&str]) -> bool {
    generation > 0 && hashes.iter().all(|hash| hex(hash, 64))
}

/// Check the exact canonical request bytes and launch binding before any caller
/// considers policy, publisher, inventory, lock, journal or host admission.
pub fn parse_request(bytes: &[u8], expected_sha256: &str) -> Result<Request, ProtocolError> {
    if bytes.len() > REQUEST_MAX_BYTES {
        return Err(ProtocolError::RequestTooLarge);
    }
    checked_hash(bytes, expected_sha256)?;
    let raw: RawRequest = serde_json::from_slice(bytes).map_err(|_| ProtocolError::InvalidJson)?;
    if raw.format != 1 || raw.product != PRODUCT || !hex(&raw.installation_id, 32) {
        return Err(ProtocolError::InvalidField);
    }
    let has_generation_fields = raw.expected_generation.is_some()
        || raw.expected_installed_sha256.is_some()
        || raw.policy_sha256.is_some()
        || raw.inventory_sha256.is_some();
    let command = match raw.command.as_str() {
        "inspect"
            if raw.operation_id.is_none()
                && raw.plan_id.is_none()
                && !has_generation_fields
                && raw.admission_sha256.is_none()
                && raw.prepared_receipt_sha256.is_none()
                && raw.expected_request_sha256.is_none() =>
        {
            Command::Inspect
        }
        "status"
            if raw.plan_id.is_none()
                && !has_generation_fields
                && raw.admission_sha256.is_none()
                && raw.prepared_receipt_sha256.is_none()
                && raw.expected_request_sha256.is_none() =>
        {
            let operation_id = field(raw.operation_id)?;
            if operation_id != "current" && !hex(&operation_id, 32) {
                return Err(ProtocolError::InvalidField);
            }
            Command::Status(operation_id)
        }
        "prepare"
            if raw.operation_id.is_none()
                && raw.prepared_receipt_sha256.is_none()
                && raw.expected_request_sha256.is_none() =>
        {
            let prepare = PrepareRequest {
                plan_id: field(raw.plan_id)?,
                expected_generation: field(raw.expected_generation)?,
                expected_installed_sha256: field(raw.expected_installed_sha256)?,
                policy_sha256: field(raw.policy_sha256)?,
                inventory_sha256: field(raw.inventory_sha256)?,
                admission_sha256: field(raw.admission_sha256)?,
            };
            if !hex(&prepare.plan_id, 32)
                || !valid_generation_and_hashes(
                    prepare.expected_generation,
                    &[
                        &prepare.expected_installed_sha256,
                        &prepare.policy_sha256,
                        &prepare.inventory_sha256,
                        &prepare.admission_sha256,
                    ],
                )
            {
                return Err(ProtocolError::InvalidField);
            }
            Command::Prepare(prepare)
        }
        "apply" | "rollback"
            if raw.plan_id.is_none()
                && raw.admission_sha256.is_none()
                && raw.expected_request_sha256.is_none() =>
        {
            let effect = EffectRequest {
                operation_id: field(raw.operation_id)?,
                expected_generation: field(raw.expected_generation)?,
                expected_installed_sha256: field(raw.expected_installed_sha256)?,
                policy_sha256: field(raw.policy_sha256)?,
                inventory_sha256: field(raw.inventory_sha256)?,
                prepared_receipt_sha256: field(raw.prepared_receipt_sha256)?,
            };
            if !hex(&effect.operation_id, 32)
                || !valid_generation_and_hashes(
                    effect.expected_generation,
                    &[
                        &effect.expected_installed_sha256,
                        &effect.policy_sha256,
                        &effect.inventory_sha256,
                        &effect.prepared_receipt_sha256,
                    ],
                )
            {
                return Err(ProtocolError::InvalidField);
            }
            if raw.command == "apply" {
                Command::Apply(effect)
            } else {
                Command::Rollback(effect)
            }
        }
        "reconcile"
            if raw.plan_id.is_none()
                && !has_generation_fields
                && raw.admission_sha256.is_none()
                && raw.prepared_receipt_sha256.is_none() =>
        {
            let operation_id = field(raw.operation_id)?;
            let expected_request_sha256 = field(raw.expected_request_sha256)?;
            if !hex(&operation_id, 32) || !hex(&expected_request_sha256, 64) {
                return Err(ProtocolError::InvalidField);
            }
            Command::Reconcile {
                operation_id,
                expected_request_sha256,
            }
        }
        _ => return Err(ProtocolError::InvalidCommandFields),
    };
    let request = Request {
        installation_id: raw.installation_id,
        command,
    };
    if bytes != request.canonical_bytes() {
        return Err(ProtocolError::NonCanonical);
    }
    Ok(request)
}

/// A validated source/artifact/container binding, with the exact documented
/// serialization field order. It does not prove these identities are installed.
#[derive(Clone, Debug, Deserialize, Serialize, PartialEq, Eq)]
#[serde(deny_unknown_fields)]
struct BindingFields {
    format: u64,
    product: String,
    installation_id: String,
    generation: u64,
    version: String,
    ordinal: u64,
    commit: String,
    tree: String,
    channel: String,
    image_id: String,
    manifest_sha256: String,
    binary_sha256: String,
    database_schema: u64,
    workspace_contract: String,
    container_id: String,
    container_started_at: String,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct InstalledBinding {
    fields: BindingFields,
}

impl InstalledBinding {
    pub fn installation_id(&self) -> &str {
        &self.fields.installation_id
    }

    pub fn generation(&self) -> u64 {
        self.fields.generation
    }

    pub fn version(&self) -> &str {
        &self.fields.version
    }

    pub fn ordinal(&self) -> u64 {
        self.fields.ordinal
    }

    pub fn commit(&self) -> &str {
        &self.fields.commit
    }

    pub fn tree(&self) -> &str {
        &self.fields.tree
    }

    pub fn image_id(&self) -> &str {
        &self.fields.image_id
    }

    pub fn manifest_sha256(&self) -> &str {
        &self.fields.manifest_sha256
    }

    pub fn binary_sha256(&self) -> &str {
        &self.fields.binary_sha256
    }

    pub fn container_id(&self) -> &str {
        &self.fields.container_id
    }

    pub fn container_started_at(&self) -> &str {
        &self.fields.container_started_at
    }

    pub fn canonical_bytes(&self) -> Vec<u8> {
        // Serialization of these scalar fields cannot fail. Semantic admission
        // remains in parse_installed_binding, never in serde's shape parser.
        serde_json::to_vec(&self.fields).expect("binding scalar serialization is infallible")
    }
}

fn canonical_container_timestamp(value: &str) -> bool {
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

/// Parse the exact new installed-binding protocol, not an older manual
/// installed.json record or a claim that host inventory was observed.
pub fn parse_installed_binding(
    bytes: &[u8],
    expected_sha256: &str,
) -> Result<InstalledBinding, ProtocolError> {
    if bytes.len() > INSTALLED_BINDING_MAX_BYTES {
        return Err(ProtocolError::InstalledBindingTooLarge);
    }
    checked_hash(bytes, expected_sha256)?;
    let fields: BindingFields =
        serde_json::from_slice(bytes).map_err(|_| ProtocolError::InvalidJson)?;
    if fields.format != 1
        || fields.product != PRODUCT
        || !hex(&fields.installation_id, 32)
        || fields.generation == 0
        || fields.ordinal == 0
        || fields.version != format!("0.1.{}", fields.ordinal)
        || !hex(&fields.commit, 40)
        || !hex(&fields.tree, 40)
        || fields.channel != "accepted"
        || !fields
            .image_id
            .strip_prefix("sha256:")
            .is_some_and(|digest| hex(digest, 64))
        || !hex(&fields.manifest_sha256, 64)
        || !hex(&fields.binary_sha256, 64)
        || fields.database_schema != 13
        || fields.workspace_contract != "reborn-workspace-v1"
        || !hex(&fields.container_id, 64)
        || !canonical_container_timestamp(&fields.container_started_at)
    {
        return Err(ProtocolError::InvalidField);
    }
    let binding = InstalledBinding { fields };
    if bytes != binding.canonical_bytes() {
        return Err(ProtocolError::NonCanonical);
    }
    Ok(binding)
}
