//! Concrete GET-only Crafty v2 observation. Never a game/lifecycle authority.
use chrono::{DateTime, NaiveDateTime, TimeZone};
use chrono_tz::Tz;
use reqwest::{Client, header};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::{
    collections::BTreeSet,
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};
use tokio::sync::{Mutex, Semaphore};
use url::Url;
use zeroize::Zeroize;

#[derive(Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Enrollment {
    pub endpoint: String,
    pub token: String,
    pub ca_pem: String,
    pub timezone: String,
    pub servers: Vec<Selected>,
}
impl Drop for Enrollment {
    fn drop(&mut self) {
        self.token.zeroize();
    }
}
#[derive(Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Selected {
    pub id: String,
    pub name: String,
    pub join: String,
}
pub fn uuid(value: &str) -> bool {
    value.len() == 36
        && value.bytes().enumerate().all(|(i, b)| {
            if [8, 13, 18, 23].contains(&i) {
                b == b'-'
            } else {
                b.is_ascii_digit() || (b'a'..=b'f').contains(&b)
            }
        })
}
fn display(value: &str, limit: usize) -> bool {
    !value.trim().is_empty() && value.len() <= limit && !value.chars().any(char::is_control)
}
impl Enrollment {
    pub fn validate(&self) -> Result<(), &'static str> {
        let url = Url::parse(&self.endpoint).map_err(|_| "invalid_configuration")?;
        if url.scheme() != "https"
            || url.host_str().is_none()
            || url.path() != "/"
            || !url.username().is_empty()
            || url.password().is_some()
            || url.query().is_some()
            || url.fragment().is_some()
            || self.endpoint.len() > 512
            || self.token.is_empty()
            || self.token.len() > 8192
            || !self.token.bytes().all(|b| b.is_ascii_graphic())
            || self.ca_pem.len() > 8192
            || self.timezone.parse::<Tz>().is_err()
            || !(1..=8).contains(&self.servers.len())
        {
            return Err("invalid_configuration");
        }
        let mut ids = BTreeSet::new();
        for s in &self.servers {
            if !uuid(&s.id)
                || !ids.insert(&s.id)
                || !display(&s.name, 80)
                || s.join.len() > 253
                || (!s.join.is_empty()
                    && (!s
                        .join
                        .bytes()
                        .all(|b| b.is_ascii_alphanumeric() || b".-:".contains(&b))
                        || s.join.starts_with('.')
                        || s.join.contains("..")))
            {
                return Err("invalid_configuration");
            }
        }
        self.client().map(|_| ())
    }
    fn client(&self) -> Result<Client, &'static str> {
        let mut auth = header::HeaderValue::from_str(&format!("Bearer {}", self.token))
            .map_err(|_| "invalid_configuration")?;
        auth.set_sensitive(true);
        let mut headers = header::HeaderMap::new();
        headers.insert(header::AUTHORIZATION, auth);
        let mut builder = Client::builder()
            .https_only(true)
            .no_proxy()
            .redirect(reqwest::redirect::Policy::none())
            .connect_timeout(Duration::from_millis(600))
            .timeout(Duration::from_millis(1500))
            .default_headers(headers)
            .pool_max_idle_per_host(0);
        if !self.ca_pem.is_empty() {
            let ca = reqwest::Certificate::from_pem(self.ca_pem.as_bytes())
                .map_err(|_| "invalid_configuration")?;
            builder = builder.add_root_certificate(ca);
        }
        builder.build().map_err(|_| "invalid_configuration")
    }
}

#[derive(Clone, Serialize)]
pub struct Server {
    pub name: String,
    pub join: String,
    pub state: &'static str,
    pub players: Option<u64>,
    pub capacity: Option<u64>,
    pub collected_at: Option<i64>,
    pub provider_at: Option<i64>,
    pub freshness: &'static str,
    pub error: Option<&'static str>,
}
#[derive(Clone, Serialize)]
pub struct Overview {
    pub revision: String,
    pub configured: bool,
    pub checked_at: Option<i64>,
    pub error: Option<&'static str>,
    pub servers: Vec<Server>,
}
pub fn now() -> i64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|v| v.as_secs() as i64)
        .unwrap_or(0)
}
fn unknown(s: &Selected, error: &'static str) -> Server {
    Server {
        name: s.name.clone(),
        join: s.join.clone(),
        state: "unknown",
        players: None,
        capacity: None,
        collected_at: None,
        provider_at: None,
        freshness: "unknown",
        error: Some(error),
    }
}
pub fn empty(revision: i64) -> Overview {
    Overview {
        revision: revision.to_string(),
        configured: false,
        checked_at: None,
        error: None,
        servers: Vec::new(),
    }
}
pub fn unavailable(revision: i64) -> Overview {
    Overview {
        configured: true,
        error: Some("unavailable"),
        ..empty(revision)
    }
}
fn fresh(provider: Option<i64>, at: i64) -> &'static str {
    match provider {
        Some(t) if t > at + 5 => "unknown",
        Some(t) if at.saturating_sub(t) <= 90 => "fresh",
        Some(_) => "stale",
        None => "unknown",
    }
}
fn timestamp(value: &Value, timezone: Tz) -> Option<i64> {
    let value = value.as_str()?;
    if value.len() > 48 {
        return None;
    }
    if let Ok(d) = DateTime::parse_from_rfc3339(value) {
        return (d.timestamp() >= 0).then_some(d.timestamp());
    }
    [
        "%Y-%m-%d %H:%M:%S%.f",
        "%Y-%m-%dT%H:%M:%S%.f",
        "%Y/%m/%d, %H:%M:%S",
    ]
    .iter()
    .find_map(|fmt| {
        let d = NaiveDateTime::parse_from_str(value, fmt).ok()?;
        timezone
            .from_local_datetime(&d)
            .single()
            .map(|v| v.timestamp())
            .filter(|v| *v >= 0)
    })
}
fn normalized(s: &Selected, body: &Value, at: i64, timezone: Tz) -> Server {
    let mut row = unknown(s, "malformed");
    let Some(data) = body
        .get("data")
        .filter(|_| body.get("status").and_then(Value::as_str) == Some("ok"))
        .and_then(Value::as_object)
    else {
        return row;
    };
    row.state = match data.get("running").and_then(Value::as_bool) {
        Some(true) => "running",
        Some(false) => "stopped",
        None => "unknown",
    };
    let ping = data
        .get("int_ping_results")
        .is_some_and(|v| v == true || v == "True");
    if ping {
        row.players = data
            .get("online")
            .and_then(Value::as_u64)
            .filter(|v| *v <= 1_000_000);
        row.capacity = data
            .get("max")
            .and_then(Value::as_u64)
            .filter(|v| *v <= 1_000_000);
    }
    row.provider_at = data.get("created").and_then(|v| timestamp(v, timezone));
    row.collected_at = Some(at);
    row.freshness = fresh(row.provider_at, at);
    row.error = if row.state == "unknown" {
        Some("malformed")
    } else {
        None
    };
    row
}
#[derive(Deserialize, Serialize)]
struct Envelope<T> {
    status: String,
    data: T,
}
#[derive(Deserialize, Serialize)]
struct Discovered {
    server_id: String,
}
#[derive(Deserialize, Serialize)]
struct Stats {
    running: Option<bool>,
    online: Option<u64>,
    max: Option<u64>,
    created: Option<String>,
    int_ping_results: Option<Value>,
}
// Typed envelope/fields reject duplicate known keys before Value normalization.
async fn get<T: serde::de::DeserializeOwned + Serialize>(
    client: &Client,
    base: &str,
    path: &str,
) -> Result<Value, &'static str> {
    let mut response = client
        .get(format!("{}{path}", base.trim_end_matches('/')))
        .send()
        .await
        .map_err(|e| {
            if e.is_timeout() {
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
    if response.content_length().is_some_and(|v| v > 262144) {
        return Err("oversized");
    }
    let mut bytes = Vec::new();
    while let Some(chunk) = response.chunk().await.map_err(|_| "transport")? {
        if bytes.len() + chunk.len() > 262144 {
            return Err("oversized");
        }
        bytes.extend_from_slice(&chunk);
    }
    let envelope: Envelope<T> = serde_json::from_slice(&bytes).map_err(|_| "malformed")?;
    if envelope.status != "ok" {
        return Err("provider_error");
    }
    serde_json::to_value(envelope).map_err(|_| "malformed")
}
async fn collect(config: &Enrollment, revision: i64) -> Overview {
    let at = now();
    let mut out = Overview {
        revision: revision.to_string(),
        configured: true,
        checked_at: Some(at),
        error: None,
        servers: config
            .servers
            .iter()
            .map(|s| unknown(s, "unavailable"))
            .collect(),
    };
    let run = async {
        let client = config.client()?;
        let body = get::<Vec<Discovered>>(&client, &config.endpoint, "/api/v2/servers").await?;
        let list = body
            .get("data")
            .filter(|_| body.get("status").and_then(Value::as_str) == Some("ok"))
            .and_then(Value::as_array)
            .ok_or("malformed")?;
        if list.len() > 256 {
            return Err("oversized");
        }
        let ids: BTreeSet<&str> = list
            .iter()
            .filter_map(|s| s.get("server_id").and_then(Value::as_str))
            .collect();
        if ids.len() != list.len() || ids.iter().any(|id| !uuid(id)) {
            return Err("malformed");
        }
        let timezone = config
            .timezone
            .parse::<Tz>()
            .map_err(|_| "invalid_configuration")?;
        for (i, s) in config.servers.iter().enumerate() {
            if !ids.contains(s.id.as_str()) {
                out.servers[i] = unknown(s, "not_discovered");
                continue;
            }
            out.servers[i] = match get::<Stats>(
                &client,
                &config.endpoint,
                &format!("/api/v2/servers/{}/stats", s.id),
            )
            .await
            {
                Ok(data) => normalized(s, &data, now(), timezone),
                Err(e) => unknown(s, e),
            };
        }
        Ok::<(), &'static str>(())
    };
    out.error = match tokio::time::timeout(Duration::from_secs(2), run).await {
        Ok(Ok(())) => None,
        Ok(Err(e)) => Some(e),
        Err(_) => Some("timeout"),
    };
    out
}

struct Cached {
    revision: i64,
    at: Instant,
    value: Overview,
}
pub struct Observer {
    cache: Mutex<Option<Cached>>,
    flight: Semaphore,
}
impl Observer {
    pub fn new() -> Self {
        Self {
            cache: Mutex::new(None),
            flight: Semaphore::new(1),
        }
    }
    pub async fn observe(&self, config: &Enrollment, revision: i64) -> Overview {
        {
            let cached = self.cache.lock().await;
            if let Some(c) = cached
                .as_ref()
                .filter(|c| c.revision == revision && c.at.elapsed() < Duration::from_secs(15))
            {
                let mut out = c.value.clone();
                for s in &mut out.servers {
                    s.freshness = fresh(s.provider_at, now());
                }
                return out;
            }
        }
        let Ok(_permit) = self.flight.try_acquire() else {
            return Overview {
                configured: true,
                error: Some("checking"),
                ..empty(revision)
            };
        };
        // Another waiter may have completed between cache inspection and permit.
        {
            let cached = self.cache.lock().await;
            if let Some(c) = cached
                .as_ref()
                .filter(|c| c.revision == revision && c.at.elapsed() < Duration::from_secs(15))
            {
                return c.value.clone();
            }
        }
        let out = collect(config, revision).await;
        *self.cache.lock().await = Some(Cached {
            revision,
            at: Instant::now(),
            value: out.clone(),
        });
        out
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    #[test]
    fn valid_zero_missing_ping_stale_and_ambiguous_local_clock_remain_distinct() {
        let s = Selected {
            id: "12345678-1234-1234-1234-123456789abc".into(),
            name: "Reviewed name".into(),
            join: "play.example:25565".into(),
        };
        let at = DateTime::parse_from_rfc3339("2026-10-26T17:00:00Z")
            .unwrap()
            .timestamp();
        let make = |online, created| json!({"status":"ok","data":{"running":true,"online":online,"int_ping_results":true,"created":created}});
        let zero = normalized(
            &s,
            &make(json!(0), json!("2026-10-26T17:00:00Z")),
            at,
            chrono_tz::UTC,
        );
        assert_eq!(zero.players, Some(0));
        assert_eq!(zero.freshness, "fresh");
        let missing = normalized(&s, &make(Value::Null, Value::Null), at, chrono_tz::UTC);
        assert_eq!(missing.players, None);
        assert_eq!(missing.freshness, "unknown");
        let bad = normalized(
            &s,
            &make(json!(false), json!("2026-10-26 16:00:00")),
            at,
            chrono_tz::UTC,
        );
        assert_eq!(bad.players, None);
        assert_eq!(bad.freshness, "stale");
        let ambiguous = timestamp(&json!("2026-11-01 01:30:00"), chrono_tz::America::Chicago);
        assert_eq!(ambiguous, None);
        assert_eq!(
            timestamp(&json!("2026/10/26, 12:00:00"), chrono_tz::America::Chicago),
            Some(at)
        );
        let ping = normalized(
            &s,
            &json!({"status":"ok","data":{"running":true,"online":0,"int_ping_results":false}}),
            at,
            chrono_tz::UTC,
        );
        assert_eq!(ping.players, None);
    }
}
