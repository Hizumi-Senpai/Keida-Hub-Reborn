//! Concrete owner-only Jellyfin/Seerr GET observations. Never a remote action owner.
use reqwest::{Client, header};
use serde::{Deserialize, Serialize, de::DeserializeOwned};
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
const MAX_TOTAL: u64 = 1_000_000_000;
type ProviderResult<T> = Result<T, &'static str>;

#[derive(Clone, Copy, Debug, Eq, PartialEq, Ord, PartialOrd)]
pub enum Provider {
    Jellyfin,
    Seerr,
}
impl Provider {
    pub fn parse(value: &str) -> Option<Self> {
        match value {
            "jellyfin" => Some(Self::Jellyfin),
            "seerr" => Some(Self::Seerr),
            _ => None,
        }
    }
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Jellyfin => "jellyfin",
            Self::Seerr => "seerr",
        }
    }
    fn index(self) -> usize {
        match self {
            Self::Jellyfin => 0,
            Self::Seerr => 1,
        }
    }
}

// Deliberately no Debug/Clone: callers share one zeroizing enrolled secret.
#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Enrollment {
    pub endpoint: String,
    pub token: String,
    pub ca_pem: String,
    pub library_id: Option<String>,
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
        if endpoint.scheme() != "https"
            || endpoint.host_str().is_none()
            || endpoint.path() != "/"
            || !endpoint.username().is_empty()
            || endpoint.password().is_some()
            || endpoint.query().is_some()
            || endpoint.fragment().is_some()
            || self.endpoint.len() > 512
            || !self.endpoint.bytes().all(|b| b.is_ascii_graphic())
            || self.token.is_empty()
            || self.token.len() > 8192
            || !self
                .token
                .bytes()
                .all(|b| b.is_ascii_graphic() && !b"\"\\,".contains(&b))
            || self.ca_pem.len() > 8192
            || !self.acknowledge_broad_access
            || match provider {
                Provider::Jellyfin => !self.library_id.as_deref().is_some_and(library_id),
                Provider::Seerr => self.library_id.is_some(),
            }
        {
            return Err("invalid_configuration");
        }
        if !self.ca_pem.is_empty() {
            use tokio_rustls::rustls::{
                RootCertStore,
                pki_types::{CertificateDer, pem::PemObject},
            };
            if !self
                .ca_pem
                .trim()
                .starts_with("-----BEGIN CERTIFICATE-----")
                || !self.ca_pem.trim().ends_with("-----END CERTIFICATE-----")
                || self.ca_pem.contains("PRIVATE KEY")
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
            Provider::Jellyfin => format!("MediaBrowser Token=\"{}\"", self.token),
            Provider::Seerr => self.token.clone(),
        });
        let mut auth =
            header::HeaderValue::from_str(&value).map_err(|_| "invalid_configuration")?;
        auth.set_sensitive(true);
        let mut headers = header::HeaderMap::new();
        headers.insert(
            match provider {
                Provider::Jellyfin => header::AUTHORIZATION,
                Provider::Seerr => header::HeaderName::from_static("x-api-key"),
            },
            auth,
        );
        let mut builder = Client::builder()
            .https_only(true)
            .no_proxy()
            .redirect(reqwest::redirect::Policy::none())
            .connect_timeout(Duration::from_millis(600))
            .timeout(Duration::from_millis(1500))
            .default_headers(headers)
            .pool_max_idle_per_host(0);
        if !self.ca_pem.is_empty() {
            let certificate = reqwest::Certificate::from_pem(self.ca_pem.as_bytes())
                .map_err(|_| "invalid_configuration")?;
            builder = builder.add_root_certificate(certificate);
        }
        builder.build().map_err(|_| "invalid_configuration")
    }
}

fn library_id(value: &str) -> bool {
    (value.len() == 32
        && value
            .bytes()
            .all(|b| b.is_ascii_hexdigit() && !b.is_ascii_uppercase()))
        || (value.len() == 36
            && value.bytes().enumerate().all(|(i, b)| {
                if [8, 13, 18, 23].contains(&i) {
                    b == b'-'
                } else {
                    b.is_ascii_hexdigit() && !b.is_ascii_uppercase()
                }
            }))
}
fn display(value: &str) -> bool {
    !value.trim().is_empty() && value.len() <= 240 && !value.chars().any(char::is_control)
}
fn stable_id(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 128
        && value
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b"_-".contains(&b))
}
fn opaque_id(provider: Provider, value: &str) -> String {
    let mut hash = Sha256::new();
    hash.update(provider.as_str().as_bytes());
    hash.update(b"\0");
    hash.update(value.as_bytes());
    hash.finalize().iter().map(|b| format!("{b:02x}")).collect()
}
fn now() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|v| v.as_secs() as i64)
        .unwrap_or(0)
}

#[derive(Clone, Serialize)]
pub struct Item {
    pub id: String,
    pub title: Option<String>,
    pub kind: &'static str,
    pub year: Option<u16>,
    pub request_status: Option<&'static str>,
    pub detail_error: Option<&'static str>,
}
#[derive(Clone, Serialize)]
pub struct Playback {
    pub playing: Option<u16>,
    pub paused: Option<u16>,
    pub error: Option<&'static str>,
}
#[derive(Clone, Serialize)]
pub struct Observation {
    pub revision: String,
    pub configured: bool,
    pub checked_at: Option<i64>,
    pub freshness: &'static str,
    pub error: Option<&'static str>,
    pub complete: bool,
    pub offset: u32,
    pub next_offset: Option<u32>,
    pub total: Option<u64>,
    pub truncated: bool,
    pub items: Vec<Item>,
    pub playback: Option<Playback>,
}
pub fn empty(revision: i64, offset: u32) -> Observation {
    Observation {
        revision: revision.to_string(),
        configured: false,
        checked_at: None,
        freshness: "unknown",
        error: None,
        complete: false,
        offset,
        next_offset: None,
        total: None,
        truncated: false,
        items: Vec::new(),
        playback: None,
    }
}
pub fn unavailable(revision: i64, offset: u32) -> Observation {
    Observation {
        configured: true,
        error: Some("unavailable"),
        ..empty(revision, offset)
    }
}
fn checking(revision: i64, offset: u32) -> Observation {
    Observation {
        error: Some("checking"),
        ..unavailable(revision, offset)
    }
}
fn failure(revision: i64, offset: u32, error: &'static str) -> Observation {
    Observation {
        checked_at: Some(now()),
        error: Some(error),
        ..unavailable(revision, offset)
    }
}

async fn get<T: DeserializeOwned>(
    client: &Client,
    url: Url,
    deadline: tokio::time::Instant,
) -> ProviderResult<T> {
    if tokio::time::Instant::now() >= deadline {
        return Err("timeout");
    }
    tokio::time::timeout_at(deadline, async {
        let mut response = client.get(url).send().await.map_err(|error| {
            if error.is_timeout() {
                "timeout"
            } else {
                "transport"
            }
        })?;
        if matches!(response.status().as_u16(), 401 | 403) {
            return Err("denied");
        }
        if !response.status().is_success() {
            return Err("provider_error");
        }
        if response
            .content_length()
            .is_some_and(|size| size > BODY_LIMIT as u64)
        {
            return Err("oversized");
        }
        let mut body = Vec::new();
        while let Some(chunk) = response.chunk().await.map_err(|error| {
            if error.is_timeout() {
                "timeout"
            } else {
                "transport"
            }
        })? {
            if body.len() + chunk.len() > BODY_LIMIT {
                return Err("oversized");
            }
            body.extend_from_slice(&chunk);
        }
        // Typed known fields reject duplicates; unknown private fields are
        // ignored rather than forwarded into a generic browser payload.
        serde_json::from_slice(&body).map_err(|_| "malformed")
    })
    .await
    .map_err(|_| "timeout")?
}
fn endpoint(config: &Enrollment, path: &str) -> ProviderResult<Url> {
    Url::parse(&config.endpoint)
        .and_then(|base| base.join(path))
        .map_err(|_| "invalid_configuration")
}
fn pagination(out: &mut Observation, rows: usize, total: u64) {
    out.total = Some(total);
    let next = out.offset + PAGE;
    let has_more = u64::from(out.offset) + (rows as u64) < total;
    out.next_offset = (has_more && next <= LAST_OFFSET).then_some(next);
    out.truncated = has_more && next > LAST_OFFSET;
    if rows < PAGE as usize && has_more {
        // An unexpectedly short page cannot silently skip unseen rows.
        out.complete = false;
        out.error = Some("malformed");
        out.next_offset = None;
        out.truncated = true;
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "PascalCase")]
struct JellyfinPage {
    items: Vec<JellyfinItem>,
    total_record_count: u64,
    start_index: u32,
}
#[derive(Deserialize)]
#[serde(rename_all = "PascalCase")]
struct JellyfinItem {
    id: String,
    name: Option<String>,
    #[serde(rename = "Type")]
    kind: String,
    production_year: Option<u16>,
}
#[derive(Deserialize)]
#[serde(rename_all = "PascalCase")]
struct Session {
    now_playing_item: Option<PlayingItem>,
    play_state: Option<PlayState>,
}
#[derive(Deserialize)]
#[serde(rename_all = "PascalCase")]
struct PlayingItem {
    id: String,
}
#[derive(Deserialize)]
#[serde(rename_all = "PascalCase")]
struct PlayState {
    is_paused: Option<bool>,
}
fn playback(rows: Vec<Session>) -> ProviderResult<Playback> {
    if rows.len() > 256 {
        return Err("oversized");
    }
    let (mut playing, mut paused) = (0, 0);
    for row in rows {
        if let Some(item) = row.now_playing_item {
            if !stable_id(&item.id) {
                return Err("malformed");
            }
            match row.play_state.and_then(|state| state.is_paused) {
                Some(false) => playing += 1,
                Some(true) => paused += 1,
                None => return Err("malformed"),
            }
        }
    }
    Ok(Playback {
        playing: Some(playing),
        paused: Some(paused),
        error: None,
    })
}
async fn jellyfin(
    config: &Enrollment,
    client: &Client,
    revision: i64,
    offset: u32,
    deadline: tokio::time::Instant,
) -> Observation {
    let mut url = match endpoint(config, "/Items") {
        Ok(url) => url,
        Err(error) => return failure(revision, offset, error),
    };
    url.query_pairs_mut().extend_pairs([
        ("parentId", config.library_id.as_deref().unwrap_or("")),
        ("recursive", "true"),
        ("includeItemTypes", "Movie,Series"),
        ("startIndex", &offset.to_string()),
        ("limit", "12"),
        ("enableUserData", "false"),
        ("enableImages", "false"),
        ("enableTotalRecordCount", "true"),
        ("sortBy", "SortName"),
        ("sortOrder", "Ascending"),
    ]);
    let sessions_url = match endpoint(config, "/Sessions?activeWithinSeconds=120") {
        Ok(url) => url,
        Err(error) => return failure(revision, offset, error),
    };
    let (page, sessions) = tokio::join!(
        get::<JellyfinPage>(client, url, deadline),
        get::<Vec<Session>>(client, sessions_url, deadline)
    );
    let mut out = Observation {
        checked_at: Some(now()),
        freshness: "fresh",
        complete: true,
        ..unavailable(revision, offset)
    };
    out.error = None;
    out.playback = Some(match sessions.and_then(playback) {
        Ok(playback) => playback,
        Err(error) => {
            out.complete = false;
            Playback {
                playing: None,
                paused: None,
                error: Some(error),
            }
        }
    });
    let page = match page {
        Ok(page)
            if page.items.len() <= PAGE as usize
                && page.total_record_count <= MAX_TOTAL
                && page.start_index == offset
                && (page.items.is_empty()
                    || page.total_record_count >= u64::from(offset) + page.items.len() as u64) =>
        {
            page
        }
        Ok(_) => {
            out.error = Some("malformed");
            out.complete = false;
            if out
                .playback
                .as_ref()
                .is_none_or(|value| value.error.is_some())
            {
                out.freshness = "unknown";
            }
            return out;
        }
        Err(error) => {
            out.error = Some(error);
            out.complete = false;
            if out
                .playback
                .as_ref()
                .is_none_or(|value| value.error.is_some())
            {
                out.freshness = "unknown";
            }
            return out;
        }
    };
    let row_count = page.items.len();
    let mut seen = BTreeSet::new();
    for item in page.items {
        let kind = match item.kind.as_str() {
            "Movie" => "movie",
            "Series" => "series",
            _ => {
                out.complete = false;
                out.error = Some("malformed");
                continue;
            }
        };
        if !stable_id(&item.id) || !seen.insert(item.id.clone()) {
            out.complete = false;
            out.error = Some("malformed");
            continue;
        }
        let title = item.name.filter(|name| display(name));
        let year = item
            .production_year
            .filter(|year| (1..=9999).contains(year));
        let detail_error = title.is_none().then_some("malformed");
        out.complete &= detail_error.is_none();
        out.items.push(Item {
            id: opaque_id(Provider::Jellyfin, &item.id),
            title,
            kind,
            year,
            request_status: None,
            detail_error,
        });
    }
    pagination(&mut out, row_count, page.total_record_count);
    out
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct SeerrPage {
    page_info: PageInfo,
    results: Vec<Request>,
}
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct PageInfo {
    pages: u64,
    page_size: u32,
    results: u64,
    page: u64,
}
#[derive(Deserialize)]
struct Request {
    id: u64,
    status: u64,
    #[serde(rename = "type")]
    kind: String,
    media: RequestMedia,
}
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct RequestMedia {
    tmdb_id: u64,
    media_type: String,
}
#[derive(Deserialize)]
struct MovieDetail {
    title: Option<String>,
}
#[derive(Deserialize)]
struct SeriesDetail {
    name: Option<String>,
}
fn request_status(status: u64) -> &'static str {
    match status {
        1 => "pending",
        2 => "approved",
        3 => "declined",
        4 => "failed",
        5 => "completed",
        _ => "unknown",
    }
}
async fn detail(
    client: &Client,
    config: &Enrollment,
    kind: &'static str,
    tmdb: u64,
    deadline: tokio::time::Instant,
) -> ProviderResult<String> {
    let url = endpoint(config, &format!("/api/v1/{kind}/{tmdb}"))?;
    let value = if kind == "movie" {
        get::<MovieDetail>(client, url, deadline).await?.title
    } else {
        get::<SeriesDetail>(client, url, deadline).await?.name
    };
    value.filter(|title| display(title)).ok_or("malformed")
}
async fn seerr(
    config: Arc<Enrollment>,
    client: Client,
    revision: i64,
    offset: u32,
    deadline: tokio::time::Instant,
) -> Observation {
    let mut url = match endpoint(&config, "/api/v1/request") {
        Ok(url) => url,
        Err(error) => return failure(revision, offset, error),
    };
    url.query_pairs_mut().extend_pairs([
        ("take", "12"),
        ("skip", &offset.to_string()),
        ("filter", "all"),
        ("sort", "added"),
        ("sortDirection", "desc"),
        ("mediaType", "all"),
    ]);
    let page = match get::<SeerrPage>(&client, url, deadline).await {
        Ok(page)
            if page.results.len() <= PAGE as usize
                && page.page_info.results <= MAX_TOTAL
                && page.page_info.page_size == PAGE
                && page.page_info.page == u64::from(offset / PAGE) + 1
                && page.page_info.pages == page.page_info.results.div_ceil(u64::from(PAGE))
                && (page.results.is_empty()
                    || page.page_info.results >= u64::from(offset) + page.results.len() as u64) =>
        {
            page
        }
        Ok(_) => return failure(revision, offset, "malformed"),
        Err(error) => return failure(revision, offset, error),
    };
    let row_count = page.results.len();
    let mut out = Observation {
        checked_at: Some(now()),
        freshness: "fresh",
        complete: true,
        error: None,
        ..unavailable(revision, offset)
    };
    let mut seen = BTreeSet::new();
    let mut titles = BTreeMap::<(&'static str, u64), ProviderResult<String>>::new();
    let mut pending = Vec::new();
    for row in page.results {
        let (kind, path_kind) = match (row.kind.as_str(), row.media.media_type.as_str()) {
            ("movie", "movie") => ("movie", "movie"),
            ("tv", "tv") => ("series", "tv"),
            _ => {
                out.complete = false;
                out.error = Some("malformed");
                continue;
            }
        };
        if row.id == 0
            || row.id > i64::MAX as u64
            || row.media.tmdb_id == 0
            || row.media.tmdb_id > MAX_TOTAL
            || !seen.insert(row.id)
        {
            out.complete = false;
            out.error = Some("malformed");
            continue;
        }
        let status = request_status(row.status);
        out.complete &= status != "unknown";
        out.items.push(Item {
            id: opaque_id(Provider::Seerr, &row.id.to_string()),
            title: None,
            kind,
            year: None,
            request_status: Some(status),
            detail_error: Some("unavailable"),
        });
        let key = (path_kind, row.media.tmdb_id);
        pending.push(key);
        titles.entry(key).or_insert(Err("unavailable"));
    }
    // At most12 same-provider detail GETs, in batches of at most3. Shared
    // absolute deadline bounds even slow/hung enrichment; no direct TMDB IO.
    let keys: Vec<_> = titles.keys().copied().collect();
    for batch in keys.chunks(3) {
        let mut tasks = tokio::task::JoinSet::new();
        for &(kind, id) in batch {
            let config = config.clone();
            let client = client.clone();
            tasks.spawn(async move {
                (
                    (kind, id),
                    detail(&client, &config, kind, id, deadline).await,
                )
            });
        }
        while let Some(value) = tasks.join_next().await {
            if let Ok((key, result)) = value {
                titles.insert(key, result);
            }
        }
    }
    for (item, key) in out.items.iter_mut().zip(pending) {
        match titles.get(&key).cloned().unwrap_or(Err("unavailable")) {
            Ok(title) => {
                item.title = Some(title);
                item.detail_error = None;
            }
            Err(error) => {
                item.detail_error = Some(error);
                out.complete = false;
            }
        }
    }
    pagination(&mut out, row_count, page.page_info.results);
    out
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
pub struct Observer {
    cache: Mutex<[ProviderCache; 2]>,
    flights: [Arc<Semaphore>; 2],
}
impl Default for Observer {
    fn default() -> Self {
        Self::new()
    }
}
impl Observer {
    pub fn new() -> Self {
        Self {
            cache: Mutex::new([ProviderCache::default(), ProviderCache::default()]),
            flights: [Arc::new(Semaphore::new(1)), Arc::new(Semaphore::new(1))],
        }
    }
    pub async fn observe(
        self: &Arc<Self>,
        provider: Provider,
        config: Arc<Enrollment>,
        revision: i64,
        offset: u32,
    ) -> Observation {
        if revision <= 0 || offset > LAST_OFFSET || !offset.is_multiple_of(PAGE) {
            return unavailable(revision, offset);
        }
        let mut cache = self.cache.lock().await;
        let state = &mut cache[provider.index()];
        if revision < state.revision {
            return checking(revision, offset);
        }
        if revision > state.revision {
            state.revision = revision;
            state.pages.clear();
        }
        let existing = state.pages.get(&offset).map(|cached| {
            let mut value = cached.value.clone();
            if value.freshness == "fresh" && cached.at.elapsed() > Duration::from_secs(90) {
                value.freshness = "stale";
            }
            (cached.at.elapsed(), value)
        });
        if let Some((age, value)) = &existing
            && *age < Duration::from_secs(60)
        {
            return value.clone();
        }
        let Ok(permit) = self.flights[provider.index()].clone().try_acquire_owned() else {
            return existing
                .map(|(_, value)| value)
                .unwrap_or_else(|| checking(revision, offset));
        };
        drop(cache);
        let observer = self.clone();
        tokio::spawn(async move {
            let _permit = permit;
            let deadline = tokio::time::Instant::now() + Duration::from_secs(4);
            let value = if config.validate(provider).is_err() {
                failure(revision, offset, "invalid_configuration")
            } else {
                match config.client(provider) {
                    Ok(client) => match provider {
                        Provider::Jellyfin => {
                            jellyfin(&config, &client, revision, offset, deadline).await
                        }
                        Provider::Seerr => seerr(config, client, revision, offset, deadline).await,
                    },
                    Err(error) => failure(revision, offset, error),
                }
            };
            let mut cache = observer.cache.lock().await;
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
        existing
            .map(|(_, value)| value)
            .unwrap_or_else(|| checking(revision, offset))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn enrollment(provider: Provider) -> Enrollment {
        Enrollment {
            endpoint: "https://provider.example/".into(),
            token: "fictional-dedicated-media-token".into(),
            ca_pem: String::new(),
            library_id: (provider == Provider::Jellyfin).then(|| "ab".repeat(16)),
            acknowledge_broad_access: true,
        }
    }
    #[test]
    fn enrollment_is_closed_explicit_origin_bound_and_rejects_header_injection() {
        assert!(Provider::parse("jellyfin") == Some(Provider::Jellyfin));
        for value in ["Jellyfin", "crafty", "seerr/other", ""] {
            assert!(Provider::parse(value).is_none());
        }
        for provider in [Provider::Jellyfin, Provider::Seerr] {
            let mut config = enrollment(provider);
            assert!(config.validate(provider).is_ok());
            config.acknowledge_broad_access = false;
            assert!(config.validate(provider).is_err());
            config.acknowledge_broad_access = true;
            for token in [
                "bad\r\nheader",
                "quoted\"token",
                "slash\\token",
                "comma,token",
                "",
            ] {
                config.token = token.into();
                assert!(config.validate(provider).is_err());
            }
            config.token = "fictional-key".into();
            for endpoint in [
                "http://provider.example/",
                "https://user@provider.example/",
                "https://provider.example/path",
                "https://provider.example/?token=x",
                "https://provider.example/#fragment",
                "https://provider.example/\n",
            ] {
                config.endpoint = endpoint.into();
                assert!(config.validate(provider).is_err());
            }
            config.endpoint = "https://provider.example/".into();
            config.ca_pem = "not a certificate".into();
            assert!(config.validate(provider).is_err());
        }
        assert!(
            enrollment(Provider::Jellyfin)
                .validate(Provider::Seerr)
                .is_err()
        );
        assert!(
            enrollment(Provider::Seerr)
                .validate(Provider::Jellyfin)
                .is_err()
        );
    }
    #[test]
    fn playback_zero_and_missing_pause_stay_distinct_and_private_fields_drop() {
        let empty: Vec<Session> = serde_json::from_str("[]").unwrap();
        let zero = playback(empty).unwrap();
        assert_eq!((zero.playing, zero.paused), (Some(0), Some(0)));
        let rows = serde_json::from_str(r#"[{"UserName":"private-canary","RemoteEndPoint":"private-address","NowPlayingItem":{"Id":"a","Name":"private-watch-title"},"PlayState":{"IsPaused":false}},{"NowPlayingItem":{"Id":"b"},"PlayState":{"IsPaused":true}}]"#).unwrap();
        let counts = playback(rows).unwrap();
        assert_eq!((counts.playing, counts.paused), (Some(1), Some(1)));
        assert!(!serde_json::to_string(&counts).unwrap().contains("private"));
        let missing =
            serde_json::from_str(r#"[{"NowPlayingItem":{"Id":"a"},"PlayState":{}}]"#).unwrap();
        assert!(matches!(playback(missing), Err("malformed")));
    }
    #[test]
    fn typed_known_duplicate_fields_and_missing_page_fields_are_rejected() {
        for body in [
            r#"{"Items":[],"Items":[],"TotalRecordCount":0,"StartIndex":0}"#,
            r#"{"Items":[],"TotalRecordCount":0,"StartIndex":0,"StartIndex":0}"#,
            r#"{"Items":[],"TotalRecordCount":0}"#,
        ] {
            assert!(serde_json::from_str::<JellyfinPage>(body).is_err());
        }
        assert!(serde_json::from_str::<MovieDetail>(r#"{"title":null,"title":"second"}"#).is_err());
        assert!(
            serde_json::from_str::<Session>(
                r#"{"NowPlayingItem":null,"NowPlayingItem":{"Id":"a"}}"#
            )
            .is_err()
        );
        assert!(serde_json::from_str::<Request>(r#"{"id":1,"status":1,"status":2,"type":"movie","media":{"tmdbId":1,"mediaType":"movie"}}"#).is_err());
    }
    #[test]
    fn opaque_identity_and_bounded_pagination_do_not_invent_exhaustive_results() {
        let id = opaque_id(Provider::Jellyfin, "provider-item-id");
        assert_eq!(id.len(), 64);
        assert!(
            id.bytes()
                .all(|b| b.is_ascii_hexdigit() && !b.is_ascii_uppercase())
        );
        assert_ne!(id, opaque_id(Provider::Seerr, "provider-item-id"));
        let mut page = empty(1, 0);
        pagination(&mut page, 12, 26);
        assert_eq!(page.next_offset, Some(12));
        page.offset = 48;
        pagination(&mut page, 12, 100);
        assert!(page.truncated && page.next_offset.is_none());
        page.offset = 0;
        pagination(&mut page, 2, 26);
        assert!(page.truncated && page.next_offset.is_none() && page.error == Some("malformed"));
        assert_eq!(request_status(6), "unknown");
    }
}
