//! Concrete private queue/transfer observations. No provider management authority.
use reqwest::{Client, header};
use serde::{Deserialize, Serialize};
use serde_json::value::RawValue;
use sha2::{Digest, Sha256};
use std::{
    collections::{BTreeMap, BTreeSet},
    sync::Arc,
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};
use tokio::sync::{Mutex, Semaphore};
use url::Url;
use zeroize::{Zeroize, Zeroizing};

const PAGE: u32 = 12;
const LAST_OFFSET: u32 = 48;
const BODY_LIMIT: usize = 262144;
const SAFE_INTEGER: u64 = 9_007_199_254_740_991;
const MAX_TOTAL: u64 = 1_000_000_000;
type ProviderResult<T> = Result<T, &'static str>;
type Raw = Box<RawValue>;

#[derive(Clone, Copy, Debug, Eq, PartialEq, Ord, PartialOrd)]
pub enum Provider {
    Sonarr,
    Radarr,
    Qbittorrent,
}
impl Provider {
    pub fn parse(value: &str) -> Option<Self> {
        match value {
            "sonarr" => Some(Self::Sonarr),
            "radarr" => Some(Self::Radarr),
            "qbittorrent" => Some(Self::Qbittorrent),
            _ => None,
        }
    }
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Sonarr => "sonarr",
            Self::Radarr => "radarr",
            Self::Qbittorrent => "qbittorrent",
        }
    }
    pub fn profile(self) -> &'static str {
        match self {
            Self::Sonarr => "sonarr-v3",
            Self::Radarr => "radarr-v3",
            Self::Qbittorrent => "qbittorrent-v2-key",
        }
    }
    fn index(self) -> usize {
        match self {
            Self::Sonarr => 0,
            Self::Radarr => 1,
            Self::Qbittorrent => 2,
        }
    }
}

// No Debug or Clone: one shared enrollment owns the zeroizing secret.
#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Enrollment {
    pub endpoint: String,
    pub token: String,
    pub ca_pem: String,
    pub profile: String,
    pub acknowledge_broad_access: bool,
}
impl Drop for Enrollment {
    fn drop(&mut self) {
        self.token.zeroize();
    }
}
impl Enrollment {
    pub fn validate(&self, provider: Provider) -> ProviderResult<()> {
        let endpoint = Url::parse(&self.endpoint).map_err(|_| "invalid_configuration")?;
        // Inspect raw syntax too: URL normalization must not admit a supplied
        // subpath such as /a/.. or a backslash as a supposedly root-only origin.
        let raw_origin = self
            .endpoint
            .get(..8)
            .is_some_and(|prefix| prefix.eq_ignore_ascii_case("https://"))
            && self
                .endpoint
                .get(8..)
                .is_some_and(|rest| rest.find('/').is_none_or(|at| &rest[at..] == "/"));
        if endpoint.scheme() != "https"
            || endpoint.host_str().is_none()
            || endpoint.path() != "/"
            || !endpoint.username().is_empty()
            || endpoint.password().is_some()
            || endpoint.query().is_some()
            || endpoint.fragment().is_some()
            || !raw_origin
            || self.endpoint.contains('\\')
            || self.endpoint.len() > 512
            || !self.endpoint.bytes().all(|byte| byte.is_ascii_graphic())
            || self.token.is_empty()
            || self.token.len() > 8192
            || !self.token.bytes().all(|byte| byte.is_ascii_graphic())
            || self.ca_pem.len() > 8192
            || self.profile != provider.profile()
            || !self.acknowledge_broad_access
        {
            return Err("invalid_configuration");
        }
        if !self.ca_pem.is_empty() {
            use tokio_rustls::rustls::{
                RootCertStore,
                pki_types::{CertificateDer, pem::PemObject},
            };
            let pem = self.ca_pem.trim();
            if !pem.starts_with("-----BEGIN CERTIFICATE-----")
                || !pem.ends_with("-----END CERTIFICATE-----")
                || pem.contains("PRIVATE KEY")
            {
                return Err("invalid_configuration");
            }
            let mut certificates = CertificateDer::pem_slice_iter(self.ca_pem.as_bytes());
            let certificate = certificates
                .next()
                .ok_or("invalid_configuration")?
                .map_err(|_| "invalid_configuration")?;
            if certificates.next().is_some() {
                return Err("invalid_configuration");
            }
            RootCertStore::empty()
                .add(certificate)
                .map_err(|_| "invalid_configuration")?;
        }
        self.client(provider).map(|_| ())
    }

    fn client(&self, provider: Provider) -> ProviderResult<Client> {
        let value = Zeroizing::new(match provider {
            Provider::Qbittorrent => format!("Bearer {}", self.token),
            Provider::Sonarr | Provider::Radarr => self.token.clone(),
        });
        let mut auth =
            header::HeaderValue::from_str(&value).map_err(|_| "invalid_configuration")?;
        auth.set_sensitive(true);
        let mut headers = header::HeaderMap::new();
        headers.insert(
            match provider {
                Provider::Qbittorrent => header::AUTHORIZATION,
                Provider::Sonarr | Provider::Radarr => header::HeaderName::from_static("x-api-key"),
            },
            auth,
        );
        if provider != Provider::Qbittorrent {
            headers.insert(
                header::ACCEPT,
                header::HeaderValue::from_static("application/json"),
            );
        }
        let mut builder = Client::builder()
            .https_only(true)
            .no_proxy()
            .redirect(reqwest::redirect::Policy::none())
            .connect_timeout(Duration::from_millis(600))
            .timeout(Duration::from_millis(1500))
            .default_headers(headers)
            .pool_max_idle_per_host(0);
        if !self.ca_pem.is_empty() {
            builder = builder.add_root_certificate(
                reqwest::Certificate::from_pem(self.ca_pem.as_bytes())
                    .map_err(|_| "invalid_configuration")?,
            );
        }
        builder.build().map_err(|_| "invalid_configuration")
    }
}

#[derive(Clone, Serialize)]
pub struct Item {
    pub id: String,
    pub title: Option<String>,
    pub status: &'static str,
    pub import_state: Option<&'static str>,
    pub warning: Option<bool>,
    pub progress_basis_points: Option<u16>,
    pub size_bytes: Option<u64>,
    pub download_bytes_per_second: Option<u64>,
    pub upload_bytes_per_second: Option<u64>,
}

#[derive(Clone, Serialize)]
pub struct Observation {
    pub revision: String,
    pub configured: bool,
    pub profile: &'static str,
    pub checked_at: Option<i64>,
    pub freshness: &'static str,
    pub error: Option<&'static str>,
    pub complete: bool,
    pub offset: u32,
    pub next_offset: Option<u32>,
    pub total: Option<u64>,
    pub truncated: bool,
    pub items: Vec<Item>,
}

pub fn empty(provider: Provider, revision: i64, offset: u32) -> Observation {
    Observation {
        revision: revision.to_string(),
        configured: false,
        profile: provider.profile(),
        checked_at: None,
        freshness: "unknown",
        error: None,
        complete: false,
        offset,
        next_offset: None,
        total: None,
        truncated: false,
        items: Vec::new(),
    }
}

pub fn unavailable(provider: Provider, revision: i64, offset: u32) -> Observation {
    Observation {
        configured: true,
        error: Some("unavailable"),
        ..empty(provider, revision, offset)
    }
}

fn checking(provider: Provider, revision: i64, offset: u32) -> Observation {
    Observation {
        error: Some("checking"),
        ..unavailable(provider, revision, offset)
    }
}

fn failure(provider: Provider, revision: i64, offset: u32, error: &'static str) -> Observation {
    Observation {
        checked_at: now(),
        error: Some(error),
        ..unavailable(provider, revision, offset)
    }
}

fn observed(provider: Provider, revision: i64, offset: u32) -> Observation {
    let checked_at = now();
    Observation {
        checked_at,
        freshness: if checked_at.is_some() {
            "fresh"
        } else {
            "unknown"
        },
        error: None,
        complete: true,
        ..unavailable(provider, revision, offset)
    }
}

fn unix_seconds(time: SystemTime) -> Option<i64> {
    time.duration_since(UNIX_EPOCH)
        .ok()
        .and_then(|duration| i64::try_from(duration.as_secs()).ok())
}
fn now() -> Option<i64> {
    unix_seconds(SystemTime::now())
}

fn age(value: &mut Observation, current: Option<i64>) {
    if !matches!(value.freshness, "fresh" | "stale") {
        return;
    }
    let elapsed = value
        .checked_at
        .filter(|checked| *checked >= 0)
        .zip(current.filter(|current| *current >= 0))
        .and_then(|(checked, current)| current.checked_sub(checked));
    value.freshness = match elapsed {
        Some(seconds) if (0..=90).contains(&seconds) => "fresh",
        Some(seconds) if seconds > 90 => "stale",
        _ => "unknown",
    };
}

fn endpoint(config: &Enrollment, path: &str) -> ProviderResult<Url> {
    Url::parse(&config.endpoint)
        .and_then(|base| base.join(path))
        .map_err(|_| "unavailable")
}

async fn get(
    client: &Client,
    url: Url,
    limit: usize,
    deadline: tokio::time::Instant,
) -> ProviderResult<Vec<u8>> {
    if tokio::time::Instant::now() >= deadline {
        return Err("timeout");
    }
    tokio::time::timeout_at(deadline, async {
        let transport = |error: reqwest::Error| {
            if error.is_timeout() {
                "timeout"
            } else {
                "transport"
            }
        };
        let mut response = client.get(url).send().await.map_err(transport)?;
        match response.status().as_u16() {
            401 | 403 => return Err("denied"),
            429 => return Err("rate_limited"),
            404 | 405 => return Err("unsupported_profile"),
            _ if !response.status().is_success() => return Err("provider_error"),
            _ => {}
        }
        if response
            .content_length()
            .is_some_and(|size| size > limit as u64)
        {
            return Err("oversized");
        }
        let mut body = Vec::new();
        while let Some(chunk) = response.chunk().await.map_err(transport)? {
            if body
                .len()
                .checked_add(chunk.len())
                .is_none_or(|size| size > limit)
            {
                return Err("oversized");
            }
            body.extend_from_slice(&chunk);
        }
        Ok(body)
    })
    .await
    .map_err(|_| "timeout")?
}

/// Lossless whole JSON numbers, with bounded syntax and explicit safe-wire range.
/// Strip only mathematically cancellable zeroes before checked u128 arithmetic.
fn number(raw: &str, max: u64) -> Option<u64> {
    let bytes = raw.as_bytes();
    if bytes.is_empty() || bytes.len() > 64 {
        return None;
    }
    let mut at = 0;
    let mut digits = Vec::with_capacity(bytes.len());
    match bytes.first()? {
        b'0' => {
            digits.push(b'0');
            at += 1;
            if bytes.get(at).is_some_and(u8::is_ascii_digit) {
                return None;
            }
        }
        b'1'..=b'9' => {
            while let Some(byte) = bytes.get(at).filter(|byte| byte.is_ascii_digit()) {
                digits.push(*byte);
                at += 1;
            }
        }
        _ => return None,
    }
    let mut fractional = 0_i32;
    if bytes.get(at) == Some(&b'.') {
        at += 1;
        let begin = at;
        while let Some(byte) = bytes.get(at).filter(|byte| byte.is_ascii_digit()) {
            digits.push(*byte);
            fractional += 1;
            at += 1;
        }
        if at == begin {
            return None;
        }
    }
    let mut exponent = 0_i32;
    if matches!(bytes.get(at), Some(b'e' | b'E')) {
        at += 1;
        let negative = bytes.get(at) == Some(&b'-');
        if matches!(bytes.get(at), Some(b'+' | b'-')) {
            at += 1;
        }
        let begin = at;
        while let Some(byte) = bytes.get(at).filter(|byte| byte.is_ascii_digit()) {
            exponent = exponent
                .checked_mul(10)?
                .checked_add(i32::from(*byte - b'0'))?;
            if exponent > 32 {
                return None;
            }
            at += 1;
        }
        if at == begin {
            return None;
        }
        if negative {
            exponent = -exponent;
        }
    }
    if at != bytes.len() {
        return None;
    }
    let Some(first) = digits.iter().position(|byte| *byte != b'0') else {
        return Some(0);
    };
    let mut significant = &digits[first..];
    let shift = exponent - fractional;
    if shift < 0 {
        let removed = usize::try_from(-shift).ok()?;
        if removed > significant.len()
            || !significant[significant.len() - removed..]
                .iter()
                .all(|byte| *byte == b'0')
        {
            return None;
        }
        significant = &significant[..significant.len() - removed];
    }
    let mut value = significant.iter().try_fold(0_u128, |value, byte| {
        value.checked_mul(10)?.checked_add(u128::from(*byte - b'0'))
    })?;
    for _ in 0..shift.max(0) {
        value = value.checked_mul(10)?;
    }
    if value <= u128::from(max) {
        u64::try_from(value).ok()
    } else {
        None
    }
}

fn whole(raw: Option<&RawValue>, max: u64) -> Option<u64> {
    number(raw?.get(), max)
}
fn text(raw: Option<&RawValue>) -> Option<String> {
    serde_json::from_str(raw?.get()).ok()
}
fn title(raw: Option<&RawValue>) -> Option<String> {
    text(raw).filter(|text| {
        !text.trim().is_empty() && text.len() <= 240 && !text.chars().any(char::is_control)
    })
}
fn flag(raw: Option<&RawValue>) -> Option<bool> {
    serde_json::from_str(raw?.get()).ok()
}
fn opaque_id(provider: Provider, revision: i64, raw: &str) -> String {
    let mut hash = Sha256::new();
    hash.update(b"reborn-queue-item-v1\0");
    hash.update(provider.as_str().as_bytes());
    hash.update(b"\0");
    hash.update(provider.profile().as_bytes());
    hash.update(b"\0");
    hash.update(revision.to_be_bytes());
    hash.update(b"\0");
    hash.update(raw.as_bytes());
    hash.finalize()
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}
fn progress(size: Option<u64>, completed: Option<u64>, complete: &mut bool) -> Option<u16> {
    match (size, completed) {
        (Some(size), Some(completed)) if completed <= size => {
            if size == 0 {
                None
            } else {
                let value = u128::from(completed).checked_mul(10000)? / u128::from(size);
                u16::try_from(value).ok()
            }
        }
        _ => {
            *complete = false;
            None
        }
    }
}

#[derive(Deserialize)]
struct ArrVersion {
    version: Option<Raw>,
}
fn arr_version(body: &[u8], provider: Provider) -> ProviderResult<()> {
    let version: ArrVersion = serde_json::from_slice(body).map_err(|_| "malformed")?;
    let version = text(version.version.as_deref()).ok_or("unsupported_profile")?;
    if version.len() > 64 || !version.is_ascii() {
        return Err("unsupported_profile");
    }
    let parts: Option<Vec<u32>> = version
        .split('.')
        .map(|part| {
            if part.is_empty() || !part.bytes().all(|byte| byte.is_ascii_digit()) {
                return None;
            }
            part.parse::<u32>()
                .ok()
                .filter(|number| *number <= i32::MAX as u32)
        })
        .collect();
    let expected = match provider {
        Provider::Sonarr => 4,
        Provider::Radarr => 6,
        Provider::Qbittorrent => return Err("unsupported_profile"),
    };
    match parts {
        Some(parts) if parts.len() == 4 && parts[0] == expected => Ok(()),
        _ => Err("unsupported_profile"),
    }
}
fn qbit_version(body: &[u8]) -> ProviderResult<()> {
    if body.len() > 64 {
        return Err("oversized");
    }
    let version = std::str::from_utf8(body).map_err(|_| "unsupported_profile")?;
    let version = version.trim_matches(|ch| matches!(ch, ' ' | '\t' | '\r' | '\n'));
    let patch = version
        .strip_prefix("v5.2.")
        .or_else(|| version.strip_prefix("v5.3."))
        .ok_or("unsupported_profile")?;
    if patch.is_empty()
        || patch.len() > 6
        || !patch.bytes().all(|byte| byte.is_ascii_digit())
        || (patch.len() > 1 && patch.starts_with('0'))
        || patch
            .parse::<u32>()
            .ok()
            .is_none_or(|number| number > 999999)
    {
        return Err("unsupported_profile");
    }
    Ok(())
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ArrPage {
    page: Raw,
    page_size: Raw,
    sort_key: String,
    sort_direction: String,
    total_records: Raw,
    records: Vec<ArrRow>,
}
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct ArrRow {
    id: Option<Raw>,
    title: Option<Raw>,
    status: Option<Raw>,
    tracked_download_state: Option<Raw>,
    tracked_download_status: Option<Raw>,
    size: Option<Raw>,
    #[serde(rename = "sizeleft")]
    size_left: Option<Raw>,
}
fn arr_status(value: Option<&str>) -> &'static str {
    match value {
        Some("queued") => "queued",
        Some("paused") => "paused",
        Some("downloading") => "downloading",
        Some("completed") => "completed",
        Some("failed") => "failed",
        Some("warning") => "warning",
        Some("delay") => "delay",
        Some("downloadClientUnavailable") => "downloadClientUnavailable",
        Some("fallback") => "fallback",
        _ => "unknown",
    }
}
fn import_state(raw: Option<&RawValue>) -> Option<&'static str> {
    let value = raw?;
    if value.get() == "null" {
        return None;
    }
    Some(match text(Some(value)).as_deref() {
        Some("downloading") => "downloading",
        Some("importBlocked") => "importBlocked",
        Some("importPending") => "importPending",
        Some("importing") => "importing",
        Some("imported") => "imported",
        Some("failedPending") => "failedPending",
        Some("failed") => "failed",
        Some("ignored") => "ignored",
        _ => "unknown",
    })
}
fn arr_page(
    body: &[u8],
    provider: Provider,
    revision: i64,
    offset: u32,
) -> ProviderResult<Observation> {
    let page: ArrPage = serde_json::from_slice(body).map_err(|_| "malformed")?;
    let number = whole(Some(&page.page), i32::MAX as u64).ok_or("malformed")?;
    let total = whole(Some(&page.total_records), MAX_TOTAL).ok_or("malformed")?;
    if number == 0
        || whole(Some(&page.page_size), PAGE as u64) != Some(PAGE as u64)
        || page.sort_key != "added"
        || page.sort_direction != "descending"
        || page.records.len() > PAGE as usize
    {
        return Err("malformed");
    }
    let mut identities = Vec::with_capacity(page.records.len());
    let mut seen = BTreeSet::new();
    for row in &page.records {
        let id = whole(row.id.as_deref(), i32::MAX as u64).ok_or("malformed")?;
        if !seen.insert(id) {
            return Err("malformed");
        }
        identities.push(id);
    }
    if number != u64::from(offset / PAGE + 1) {
        return Err("page_moved");
    }
    let expected = total.saturating_sub(u64::from(offset)).min(u64::from(PAGE));
    if page.records.len() as u64 != expected {
        return Err("malformed");
    }
    let mut out = observed(provider, revision, offset);
    for (row, id) in page.records.into_iter().zip(identities) {
        let title = title(row.title.as_deref());
        let state = text(row.status.as_deref());
        let status = arr_status(state.as_deref());
        let import_state = import_state(row.tracked_download_state.as_deref());
        let severity = text(row.tracked_download_status.as_deref());
        let warning = match severity.as_deref() {
            Some("ok") => Some(false),
            Some("warning" | "error") => Some(true),
            _ => None,
        };
        let size = whole(row.size.as_deref(), SAFE_INTEGER);
        let left = whole(row.size_left.as_deref(), SAFE_INTEGER);
        let completed = match (size, left) {
            (Some(size), Some(left)) => size.checked_sub(left),
            _ => None,
        };
        let progress = progress(size, completed, &mut out.complete);
        out.complete &= title.is_some()
            && status != "unknown"
            && import_state.is_some_and(|state| state != "unknown")
            && warning.is_some();
        out.items.push(Item {
            id: opaque_id(provider, revision, &id.to_string()),
            title,
            status,
            import_state,
            warning,
            progress_basis_points: progress,
            size_bytes: size,
            download_bytes_per_second: None,
            upload_bytes_per_second: None,
        });
    }
    out.total = Some(total);
    out.next_offset =
        (offset < LAST_OFFSET && u64::from(offset + PAGE) < total).then_some(offset + PAGE);
    out.truncated = total > u64::from(LAST_OFFSET + PAGE);
    Ok(out)
}

#[derive(Deserialize)]
struct QbitRow {
    hash: Option<Raw>,
    name: Option<Raw>,
    state: Option<Raw>,
    has_metadata: Option<Raw>,
    size: Option<Raw>,
    completed: Option<Raw>,
    dlspeed: Option<Raw>,
    upspeed: Option<Raw>,
}
fn qbit_status(value: Option<&str>) -> &'static str {
    match value {
        Some("error") => "error",
        Some("missingFiles") => "missingFiles",
        Some("uploading") => "uploading",
        Some("stoppedUP") => "stoppedUP",
        Some("queuedUP") => "queuedUP",
        Some("stalledUP") => "stalledUP",
        Some("checkingUP") => "checkingUP",
        Some("forcedUP") => "forcedUP",
        Some("downloading") => "downloading",
        Some("metaDL") => "metaDL",
        Some("forcedMetaDL") => "forcedMetaDL",
        Some("stoppedDL") => "stoppedDL",
        Some("queuedDL") => "queuedDL",
        Some("stalledDL") => "stalledDL",
        Some("checkingDL") => "checkingDL",
        Some("forcedDL") => "forcedDL",
        Some("checkingResumeData") => "checkingResumeData",
        Some("moving") => "moving",
        _ => "unknown",
    }
}
fn qbit_page(body: &[u8], revision: i64, offset: u32) -> ProviderResult<Observation> {
    let rows: Vec<QbitRow> = serde_json::from_slice(body).map_err(|_| "malformed")?;
    if rows.len() > PAGE as usize + 1 {
        return Err("malformed");
    }
    let count = rows.len();
    let mut identities = Vec::with_capacity(count);
    let mut seen = BTreeSet::new();
    for row in &rows {
        let id = text(row.hash.as_deref()).ok_or("malformed")?;
        if id.len() != 40
            || !id
                .bytes()
                .all(|byte| byte.is_ascii_hexdigit() && !byte.is_ascii_uppercase())
            || !seen.insert(id.clone())
        {
            return Err("malformed");
        }
        identities.push(id);
    }
    let mut out = observed(Provider::Qbittorrent, revision, offset);
    for (row, id) in rows.into_iter().zip(identities) {
        let title = title(row.name.as_deref());
        let state = text(row.state.as_deref());
        let status = qbit_status(state.as_deref());
        let warning = match status {
            "unknown" => None,
            "error" | "missingFiles" => Some(true),
            _ => Some(false),
        };
        let metadata = flag(row.has_metadata.as_deref()) == Some(true);
        let size = if metadata {
            whole(row.size.as_deref(), SAFE_INTEGER)
        } else {
            None
        };
        let completed = if metadata {
            whole(row.completed.as_deref(), SAFE_INTEGER)
        } else {
            None
        };
        let progress = progress(size, completed, &mut out.complete);
        let download = whole(row.dlspeed.as_deref(), SAFE_INTEGER);
        let upload = whole(row.upspeed.as_deref(), SAFE_INTEGER);
        out.complete &= metadata
            && title.is_some()
            && warning.is_some()
            && download.is_some()
            && upload.is_some();
        if out.items.len() < PAGE as usize {
            out.items.push(Item {
                id: opaque_id(Provider::Qbittorrent, revision, &id),
                title,
                status,
                import_state: None,
                warning,
                progress_basis_points: progress,
                size_bytes: size,
                download_bytes_per_second: download,
                upload_bytes_per_second: upload,
            });
        }
    }
    let lookahead = count > PAGE as usize;
    out.next_offset = (lookahead && offset < LAST_OFFSET).then_some(offset + PAGE);
    out.truncated = lookahead && offset == LAST_OFFSET;
    Ok(out)
}

async fn collect(
    config: &Enrollment,
    provider: Provider,
    revision: i64,
    offset: u32,
    deadline: tokio::time::Instant,
) -> ProviderResult<Observation> {
    if config.profile != provider.profile() {
        return Err("unsupported_profile");
    }
    config.validate(provider).map_err(|_| "unavailable")?;
    let client = config.client(provider).map_err(|_| "unavailable")?;
    let mut url;
    match provider {
        Provider::Sonarr | Provider::Radarr => {
            let version = get(
                &client,
                endpoint(config, "/api/v3/system/status")?,
                BODY_LIMIT,
                deadline,
            )
            .await?;
            arr_version(&version, provider)?;
            url = endpoint(config, "/api/v3/queue")?;
            url.query_pairs_mut().extend_pairs([
                ("page", (offset / PAGE + 1).to_string()),
                ("pageSize", PAGE.to_string()),
                ("sortKey", "added".into()),
                ("sortDirection", "descending".into()),
            ]);
            if provider == Provider::Sonarr {
                url.query_pairs_mut().extend_pairs([
                    ("includeUnknownSeriesItems", "false"),
                    ("includeSeries", "false"),
                    ("includeEpisode", "false"),
                ]);
            } else {
                url.query_pairs_mut().extend_pairs([
                    ("includeUnknownMovieItems", "false"),
                    ("includeMovie", "false"),
                ]);
            }
            let body = get(&client, url, BODY_LIMIT, deadline).await?;
            let result = arr_page(&body, provider, revision, offset)?;
            if tokio::time::Instant::now() >= deadline {
                return Err("timeout");
            }
            Ok(result)
        }
        Provider::Qbittorrent => {
            let version = get(
                &client,
                endpoint(config, "/api/v2/app/version")?,
                64,
                deadline,
            )
            .await?;
            qbit_version(&version)?;
            url = endpoint(config, "/api/v2/torrents/info")?;
            url.query_pairs_mut().extend_pairs([
                ("filter", "all"),
                ("sort", "added_on"),
                ("reverse", "true"),
                ("limit", "13"),
                ("offset", &offset.to_string()),
            ]);
            let body = get(&client, url, BODY_LIMIT, deadline).await?;
            let result = qbit_page(&body, revision, offset)?;
            if tokio::time::Instant::now() >= deadline {
                return Err("timeout");
            }
            Ok(result)
        }
    }
}

struct Cached {
    at: Instant,
    value: Observation,
}
#[derive(Default)]
struct ProviderCache {
    revision: i64,
    pages: BTreeMap<u32, Cached>,
}
struct Inner {
    cache: Mutex<[ProviderCache; 3]>,
    flights: [Arc<Semaphore>; 3],
}
pub struct Observer {
    inner: Arc<Inner>,
}
impl Default for Observer {
    fn default() -> Self {
        Self::new()
    }
}
impl Observer {
    pub fn new() -> Self {
        Self {
            inner: Arc::new(Inner {
                cache: Mutex::new(std::array::from_fn(|_| ProviderCache::default())),
                flights: std::array::from_fn(|_| Arc::new(Semaphore::new(1))),
            }),
        }
    }
    pub async fn observe(
        &self,
        provider: Provider,
        config: Arc<Enrollment>,
        revision: i64,
        offset: u32,
    ) -> Observation {
        if config.profile != provider.profile() {
            return failure(provider, revision, offset, "unsupported_profile");
        }
        if revision <= 0 || offset > LAST_OFFSET || !offset.is_multiple_of(PAGE) {
            return unavailable(provider, revision, offset);
        }
        let mut cache = self.inner.cache.lock().await;
        let state = &mut cache[provider.index()];
        if revision < state.revision {
            return checking(provider, revision, offset);
        }
        if revision > state.revision {
            state.revision = revision;
            state.pages.clear();
        }
        let existing = state.pages.get(&offset).map(|cached| {
            let mut value = cached.value.clone();
            age(&mut value, now());
            (cached.at.elapsed(), value)
        });
        if let Some((age, value)) = &existing
            && *age < Duration::from_secs(60)
        {
            return value.clone();
        }
        let pending = || {
            existing.as_ref().map_or_else(
                || checking(provider, revision, offset),
                |(_, value)| Observation {
                    error: Some("checking"),
                    complete: false,
                    ..value.clone()
                },
            )
        };
        let Ok(permit) = self.inner.flights[provider.index()]
            .clone()
            .try_acquire_owned()
        else {
            return pending();
        };
        drop(cache);
        let inner = self.inner.clone();
        tokio::spawn(async move {
            let _permit = permit;
            let deadline = tokio::time::Instant::now() + Duration::from_secs(4);
            let result = tokio::time::timeout_at(
                deadline,
                collect(&config, provider, revision, offset, deadline),
            )
            .await
            .unwrap_or(Err("timeout"));
            let value = result.unwrap_or_else(|error| failure(provider, revision, offset, error));
            let mut cache = inner.cache.lock().await;
            let state = &mut cache[provider.index()];
            if state.revision == revision {
                state.pages.insert(
                    offset,
                    Cached {
                        at: Instant::now(),
                        value,
                    },
                );
            }
        });
        pending()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn config(provider: Provider) -> Enrollment {
        Enrollment {
            endpoint: "https://provider.example/".into(),
            token: "fictional-key".into(),
            ca_pem: String::new(),
            profile: provider.profile().into(),
            acknowledge_broad_access: true,
        }
    }
    #[test]
    fn enrolled_profiles_and_headers_are_closed_and_explicit() {
        for provider in [Provider::Sonarr, Provider::Radarr, Provider::Qbittorrent] {
            assert_eq!(Provider::parse(provider.as_str()), Some(provider));
            let mut value = config(provider);
            assert!(value.validate(provider).is_ok());
            value.acknowledge_broad_access = false;
            assert!(value.validate(provider).is_err());
            value.acknowledge_broad_access = true;
            value.profile.push_str("-other");
            assert!(value.validate(provider).is_err());
        }
        for name in ["Sonarr", "sonarr-v5", "crafty", "qbittorrent/other", ""] {
            assert!(Provider::parse(name).is_none());
        }
        let mut value = config(Provider::Sonarr);
        for endpoint in [
            "http://provider.example/",
            "https://user@provider.example/",
            "https://provider.example/path",
            "https://provider.example/a/..",
            "https://provider.example/?key=x",
            "https://provider.example/#x",
            "https:\\provider.example",
            "https://provider.example/\n",
        ] {
            value.endpoint = endpoint.into();
            assert!(value.validate(Provider::Sonarr).is_err(), "{endpoint}");
        }
        value.endpoint = "https://provider.example/".into();
        for token in ["", "has space", "injected\r\nheader", "nonasciié"] {
            value.token = token.into();
            assert!(value.validate(Provider::Sonarr).is_err());
        }
        value.token = "graphic\"token,\\allowed".into();
        assert!(value.validate(Provider::Sonarr).is_ok());
        value.ca_pem = "not a certificate".into();
        assert!(value.validate(Provider::Sonarr).is_err());
    }
    #[test]
    fn whole_numeric_lexemes_are_lossless_bounded_and_do_not_round() {
        for (raw, expected) in [
            ("0", 0),
            ("1.0000", 1),
            ("1e3", 1000),
            ("0.001e3", 1),
            ("1000e-3", 1),
            ("9.007199254740991e15", SAFE_INTEGER),
            ("9007199254740991", SAFE_INTEGER),
            ("0e-32", 0),
            (
                "1e0000000000000000000000000000000000000000000000000000000000000",
                1,
            ),
        ] {
            assert_eq!(number(raw, SAFE_INTEGER), Some(expected), "{raw}");
        }
        let padded = format!("1.{}", "0".repeat(62));
        assert_eq!(padded.len(), 64);
        assert_eq!(number(&padded, SAFE_INTEGER), Some(1));
        let scaled = format!("9007199254740991{}e-32", "0".repeat(32));
        assert_eq!(number(&scaled, SAFE_INTEGER), Some(SAFE_INTEGER));
        for raw in [
            "-0",
            "-1",
            "+1",
            "00",
            "01",
            "1.",
            ".1",
            "1.5",
            "1e-1",
            "1e33",
            "0e-33",
            "1e",
            "NaN",
            "null",
            "true",
            "\"1\"",
            "[1]",
            "9007199254740992",
            "9007199254740990.5",
            " 1",
            "1 ",
            "1e999999999999999999999999",
        ] {
            assert_eq!(number(raw, SAFE_INTEGER), None, "{raw}");
        }
        assert_eq!(number(&format!("1.{}", "0".repeat(63)), SAFE_INTEGER), None);
        assert_eq!(number("13", 12), None);
        let mut complete = true;
        assert_eq!(
            progress(Some(SAFE_INTEGER), Some(SAFE_INTEGER - 1), &mut complete),
            Some(9999)
        );
        assert!(complete);
    }
    #[test]
    fn version_admission_is_typed_closed_and_discards_private_metadata() {
        assert!(
            arr_version(
                br#"{"version":"4.0.20.3014","appData":"private-canary"}"#,
                Provider::Sonarr
            )
            .is_ok()
        );
        assert!(arr_version(br#"{"version":"6.4.4.10685"}"#, Provider::Radarr).is_ok());
        for body in [
            br#"{"version":"5.0.0.1"}"#.as_slice(),
            br#"{"version":"4.0.0.2147483648"}"#,
            br#"{"version":null}"#,
            br#"{"version":4}"#,
            br#"{"version":"4.0.0"}"#,
            br#"{"version":"4.0.0.1-beta"}"#,
            br#"[]"#,
        ] {
            assert!(arr_version(body, Provider::Sonarr).is_err());
        }
        assert_eq!(
            arr_version(
                br#"{"version":"4.0.0.1","version":"4.0.0.1"}"#,
                Provider::Sonarr
            ),
            Err("malformed")
        );
        for body in [b"v5.2.0".as_slice(), b"v5.3.999999", b" v5.3.0\n"] {
            assert!(qbit_version(body).is_ok());
        }
        for body in [
            b"v5.1.9".as_slice(),
            b"v5.4.0",
            b"v5.3.00",
            b"v5.3.1000000",
            b"v5.3.0rc1",
            b"\"v5.3.0\"",
            b"<html>",
            b"5.3.0",
            b"v5.3.-1",
        ] {
            assert!(qbit_version(body).is_err());
        }
    }
    fn arr(body: &str, offset: u32) -> ProviderResult<Observation> {
        arr_page(body.as_bytes(), Provider::Sonarr, 7, offset)
    }
    #[test]
    fn arr_zero_id_pending_rows_precision_and_page_movement_are_honest() {
        let body = r#"{"page":1,"pageSize":12,"sortKey":"added","sortDirection":"descending","totalRecords":2,"records":[{"id":0,"title":"Series","status":"downloading","trackedDownloadState":"downloading","trackedDownloadStatus":"ok","size":1e3,"sizeleft":750.0,"outputPath":"private-canary"},{"id":2,"title":"Delayed","status":"delay","trackedDownloadState":"importPending","trackedDownloadStatus":"warning","size":0,"sizeleft":0}]}"#;
        let page = arr(body, 0).unwrap();
        assert!(page.complete);
        assert_eq!(page.total, Some(2));
        assert_eq!(page.items[0].progress_basis_points, Some(2500));
        assert_eq!(page.items[0].size_bytes, Some(1000));
        assert_eq!(page.items[1].progress_basis_points, None);
        assert_eq!(page.items[1].size_bytes, Some(0));
        assert_eq!(page.items[1].warning, Some(true));
        assert_eq!(page.items[0].download_bytes_per_second, None);
        assert!(
            !serde_json::to_string(&page)
                .unwrap()
                .contains("private-canary")
        );
        assert!(matches!(arr(body, 12), Err("page_moved")));
        let duplicate = body.replace("\"id\":2", "\"id\":0");
        assert!(matches!(arr(&duplicate, 0), Err("malformed")));
        let inconsistent = body.replace("\"totalRecords\":2", "\"totalRecords\":3");
        assert!(matches!(arr(&inconsistent, 0), Err("malformed")));
        let fractional = body.replace("\"sizeleft\":750.0", "\"sizeleft\":750.5");
        let page = arr(&fractional, 0).unwrap();
        assert!(!page.complete && page.items[0].progress_basis_points.is_none());
        assert_eq!(page.items[0].size_bytes, Some(1000));
        let duplicate_field = body.replace("\"size\":1e3", "\"size\":1e3,\"size\":1000");
        assert!(matches!(arr(&duplicate_field, 0), Err("malformed")));
    }
    fn qrow(id: u32) -> String {
        format!(
            r#"{{"hash":"{id:040x}","name":"Transfer {id}","state":"checkingDL","has_metadata":true,"size":1000,"completed":250,"progress":0.9,"dlspeed":0,"upspeed":100,"save_path":"private-canary"}}"#
        )
    }
    #[test]
    fn qbit_completion_uses_selected_bytes_not_masked_check_progress_or_false_metadata() {
        let row = qrow(1).replace("checkingDL", "stoppedDL");
        let body = format!("[{row}]");
        let page = qbit_page(body.as_bytes(), 7, 0).unwrap();
        assert!(page.complete);
        assert_eq!(page.items[0].progress_basis_points, Some(2500));
        assert_eq!(page.items[0].download_bytes_per_second, Some(0));
        assert_eq!(page.total, None);
        assert!(
            !serde_json::to_string(&page)
                .unwrap()
                .contains("private-canary")
        );
        let no_metadata = body.replace("\"has_metadata\":true", "\"has_metadata\":false");
        let page = qbit_page(no_metadata.as_bytes(), 7, 0).unwrap();
        assert!(!page.complete);
        assert!(
            page.items[0].size_bytes.is_none() && page.items[0].progress_basis_points.is_none()
        );
        let zero = body.replace(
            "\"size\":1000,\"completed\":250",
            "\"size\":0,\"completed\":0",
        );
        let page = qbit_page(zero.as_bytes(), 7, 0).unwrap();
        assert!(page.complete && page.items[0].progress_basis_points.is_none());
        let future = body.replace("stoppedDL", "futureState");
        let page = qbit_page(future.as_bytes(), 7, 0).unwrap();
        assert!(!page.complete && page.items[0].warning.is_none());
        assert_eq!(page.items[0].status, "unknown");
        let absent = body.replace(",\"dlspeed\":0", "");
        let page = qbit_page(absent.as_bytes(), 7, 0).unwrap();
        assert!(!page.complete && page.items[0].download_bytes_per_second.is_none());
    }
    #[test]
    fn lookahead_duplicate_identity_and_scope_do_not_invent_totals_or_cross_scope_ids() {
        let rows: Vec<_> = (1..=13).map(qrow).collect();
        let body = format!("[{}]", rows.join(","));
        let first = qbit_page(body.as_bytes(), 7, 0).unwrap();
        assert_eq!(first.items.len(), 12);
        assert_eq!(first.next_offset, Some(12));
        assert_eq!(first.total, None);
        assert!(!first.truncated);
        let last = qbit_page(body.as_bytes(), 7, 48).unwrap();
        assert!(last.truncated && last.next_offset.is_none());
        let duplicate_lookahead = format!("[{},{}]", rows[..12].join(","), rows[0]);
        assert!(matches!(
            qbit_page(duplicate_lookahead.as_bytes(), 7, 0),
            Err("malformed")
        ));
        assert!(qbit_page(b"[]", 7, 12).unwrap().items.is_empty());
        let id = opaque_id(Provider::Sonarr, 7, "0");
        assert_eq!(id.len(), 64);
        assert_ne!(id, opaque_id(Provider::Radarr, 7, "0"));
        assert_ne!(id, opaque_id(Provider::Sonarr, 8, "0"));
        assert_ne!(id, opaque_id(Provider::Sonarr, 7, "1"));
    }
    #[test]
    fn collection_aging_never_freshens_a_held_sample_or_future_clock() {
        let mut value = observed(Provider::Sonarr, 1, 0);
        value.checked_at = Some(100);
        age(&mut value, Some(190));
        assert_eq!(value.freshness, "fresh");
        age(&mut value, Some(191));
        assert_eq!(value.freshness, "stale");
        assert_eq!(value.checked_at, Some(100));
        age(&mut value, Some(99));
        assert_eq!(value.freshness, "unknown");
        value.freshness = "fresh";
        age(&mut value, None);
        assert_eq!(value.freshness, "unknown");
        assert_eq!(value.checked_at, Some(100));
        value.freshness = "fresh";
        value.checked_at = None;
        age(&mut value, Some(100));
        assert_eq!(value.freshness, "unknown");
        assert_eq!(unix_seconds(UNIX_EPOCH), Some(0));
        assert_eq!(unix_seconds(UNIX_EPOCH + Duration::from_secs(1)), Some(1));
        assert_eq!(unix_seconds(UNIX_EPOCH - Duration::from_secs(1)), None);
        let empty = empty(Provider::Qbittorrent, 0, 0);
        assert!(!empty.configured && empty.total.is_none() && empty.checked_at.is_none());
    }
}
