//! Synthetic Discord TLS/OAuth service. It never forwards a request to Discord.
//! Only bounded method/path observations leave the fixture; codes and PKCE
//! material stay in its bounded disposable memory.
use super::*;
use axum::body::{Body, to_bytes};
use axum::http::{Method, header};
use axum::response::Html;
use sha2::{Digest, Sha256};
use std::collections::BTreeMap;
use url::Url;

pub const CLIENT_ID: &str = "123456789012345678";
pub const CLIENT_SECRET: &str = "fictional-discord-application-secret";
pub const ID: &str = "18446744073709551615";
pub const DISPLAY: &str = "Fixture Discord Identity";
const ACCESS: &str = "fictional-discord-access-token";
pub const NORMAL: u8 = 0;
pub const DENIED: u8 = 1;
pub const WRONG_ISSUER: u8 = 2;
pub const TOKEN_DENIED: u8 = 3;
pub const MALFORMED_USER: u8 = 4;
pub const HOLD_USER: u8 = 5;
pub const REVOKE_FAILED: u8 = 6;
pub const DUPLICATE_USER: u8 = 7;
pub const WRONG_SCOPE: u8 = 8;
pub const REDIRECT_TOKEN: u8 = 9;
pub const TOKEN_LARGE: u8 = 10;
pub const USER_LARGE: u8 = 11;
pub const TOKEN_CHUNKED: u8 = 12;
pub const USER_CHUNKED: u8 = 13;
pub const REVOKE_TIMEOUT: u8 = 14;
pub const HOLD_TOKEN: u8 = 15;
pub const USER_TIMEOUT: u8 = 16;

struct Code {
    challenge: String,
    redirect: String,
}
struct DiscordData {
    mode: AtomicU8,
    codes: Mutex<BTreeMap<String, Code>>,
    serial: AtomicU64,
    requests: Mutex<Vec<(String, String)>>,
    invalid: AtomicU64,
    entered: Notify,
    release: Notify,
}
pub struct Discord {
    /// The connection address; the HTTP/TLS authority remains discord.com.
    pub address: SocketAddr,
    pub ca: String,
    pub ca_path: PathBuf,
    root: PathBuf,
    data: Arc<DiscordData>,
    task: JoinHandle<()>,
}

fn fields(raw: &str) -> Option<BTreeMap<String, String>> {
    if raw.len() > 8192 {
        return None;
    }
    let mut values = BTreeMap::new();
    for (key, value) in url::form_urlencoded::parse(raw.as_bytes()) {
        if values
            .insert(key.into_owned(), value.into_owned())
            .is_some()
        {
            return None;
        }
    }
    Some(values)
}
fn challenge(verifier: &str) -> String {
    const TABLE: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    let digest = Sha256::digest(verifier.as_bytes());
    let mut out = String::with_capacity(43);
    for chunk in digest.chunks(3) {
        out.push(TABLE[(chunk[0] >> 2) as usize] as char);
        out.push(
            TABLE[(((chunk[0] & 3) << 4) | (chunk.get(1).copied().unwrap_or(0) >> 4)) as usize]
                as char,
        );
        if let Some(second) = chunk.get(1) {
            out.push(
                TABLE[(((second & 15) << 2) | (chunk.get(2).copied().unwrap_or(0) >> 6)) as usize]
                    as char,
            );
        }
        if let Some(third) = chunk.get(2) {
            out.push(TABLE[(third & 63) as usize] as char);
        }
    }
    out
}
fn bad(data: &DiscordData) -> Response {
    data.invalid.fetch_add(1, Ordering::SeqCst);
    StatusCode::BAD_REQUEST.into_response()
}
fn redirect(value: &str) -> bool {
    Url::parse(value).is_ok_and(|url| {
        url.scheme() == "https"
            && url.host_str().is_some_and(|host| {
                matches!(host, "127.0.0.1" | "localhost" | "::1" | "[::1]")
                    || host.ends_with(".test")
            })
            && url.path() == "/account/discord/callback"
            && url.username().is_empty()
            && url.password().is_none()
            && url.query().is_none()
            && url.fragment().is_none()
    })
}
fn issue_callback(data: &DiscordData, raw: &str) -> Option<String> {
    let mode = data.mode.load(Ordering::SeqCst);
    let values = fields(raw)?;
    if values.len() != 8
        || values.get("client_id").map(String::as_str) != Some(CLIENT_ID)
        || values.get("response_type").map(String::as_str) != Some("code")
        || values.get("scope").map(String::as_str) != Some("identify")
        || values.get("prompt").map(String::as_str) != Some("consent")
        || values.get("code_challenge_method").map(String::as_str) != Some("S256")
        || !values.get("state").is_some_and(|v| {
            v.len() == 64
                && v.bytes()
                    .all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b))
        })
        || !values.get("code_challenge").is_some_and(|v| {
            v.len() == 43
                && v.bytes()
                    .all(|b| b.is_ascii_alphanumeric() || b == b'-' || b == b'_')
        })
        || !values.get("redirect_uri").is_some_and(|v| redirect(v))
    {
        return None;
    }
    let redirect = values
        .get("redirect_uri")
        .expect("validated redirect")
        .clone();
    let code = format!(
        "fictional-discord-code-{}",
        data.serial.fetch_add(1, Ordering::SeqCst)
    );
    let mut callback = Url::parse(&redirect).expect("validated callback");
    callback
        .query_pairs_mut()
        .append_pair("state", values.get("state").expect("validated state"))
        .append_pair(
            "iss",
            if mode == WRONG_ISSUER {
                "https://wrong-issuer.invalid"
            } else {
                "https://discord.com"
            },
        );
    if mode == DENIED {
        callback
            .query_pairs_mut()
            .append_pair("error", "access_denied");
    } else {
        callback.query_pairs_mut().append_pair("code", &code);
        let mut codes = data.codes.lock().expect("fictional Discord codes");
        if codes.len() >= 64 {
            return None;
        }
        codes.insert(
            code,
            Code {
                challenge: values
                    .get("code_challenge")
                    .expect("validated challenge")
                    .clone(),
                redirect,
            },
        );
    }
    Some(callback.into())
}
async fn handler(State(data): State<Arc<DiscordData>>, request: Request) -> Response {
    let path = request.uri().path().to_owned();
    {
        let mut records = data.requests.lock().expect("fictional Discord records");
        if records.len() >= 128 {
            return bad(&data);
        }
        records.push((request.method().to_string(), path.clone()));
    }
    if [
        "x-csrf-token",
        "x-reborn-product",
        "x-reborn-contract",
        "cookie",
    ]
    .iter()
    .any(|name| request.headers().contains_key(*name))
    {
        return bad(&data);
    }
    let mode = data.mode.load(Ordering::SeqCst);
    if path == "/oauth2/authorize" {
        if request.method() != Method::GET || request.headers().contains_key(header::REFERER) {
            return bad(&data);
        }
        let Some(callback) = issue_callback(&data, request.uri().query().unwrap_or("")) else {
            return bad(&data);
        };
        let target = callback
            .as_str()
            .replace('&', "&amp;")
            .replace('"', "&quot;");
        return (
            [("cache-control", "no-store"), ("referrer-policy", "no-referrer"), ("content-security-policy", "default-src 'none'; frame-ancestors 'none'; form-action 'none'; base-uri 'none'")],
            Html(format!("<!doctype html><html lang=\"en\"><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Fictional Discord consent</title><h1>Fictional Discord consent</h1><p>No real Discord request is made.</p><a id=\"discord-fixture-consent\" href=\"{target}\">Return this fictional authorization</a></html>")),
        ).into_response();
    }
    if request.uri().query().is_some() || request.headers().contains_key(header::REFERER) {
        return bad(&data);
    }
    if path == "/api/v10/users/@me" {
        if request.method() != Method::GET
            || request
                .headers()
                .get(header::AUTHORIZATION)
                .and_then(|v| v.to_str().ok())
                != Some(&format!("Bearer {ACCESS}"))
        {
            return bad(&data);
        }
        if mode == USER_LARGE || mode == USER_CHUNKED {
            let body = Body::from(vec![b'x'; 32769]);
            return Response::new(if mode == USER_CHUNKED {
                Body::from_stream(body.into_data_stream())
            } else {
                body
            });
        }
        if mode == USER_TIMEOUT {
            tokio::time::sleep(Duration::from_secs(2)).await;
        }
        if mode == HOLD_USER {
            data.entered.notify_one();
            let _ = tokio::time::timeout(Duration::from_secs(8), data.release.notified()).await;
        }
        if mode == MALFORMED_USER {
            return ([("content-type", "application/json")], "{malformed").into_response();
        }
        if mode == DUPLICATE_USER {
            return ([("content-type","application/json")], format!(r#"{{"id":"{ID}","id":"123","username":"fixture_discord","global_name":"{DISPLAY}"}}"# )).into_response();
        }
        return Json(json!({"id":ID,"username":"fixture_discord","global_name":DISPLAY,"email":"PRIVATE_DISCORD_EMAIL@example.invalid","avatar":"PRIVATE_DISCORD_AVATAR","locale":"PRIVATE_DISCORD_LOCALE"})).into_response();
    }
    if !matches!(
        path.as_str(),
        "/api/oauth2/token" | "/api/oauth2/token/revoke"
    ) || request.method() != Method::POST
    {
        return bad(&data);
    }
    if request
        .headers()
        .get(header::CONTENT_TYPE)
        .and_then(|v| v.to_str().ok())
        != Some("application/x-www-form-urlencoded")
        || request.headers().contains_key(header::AUTHORIZATION)
    {
        return bad(&data);
    }
    let Ok(body) = to_bytes(request.into_body(), 8192).await else {
        return bad(&data);
    };
    let Ok(body) = std::str::from_utf8(&body) else {
        return bad(&data);
    };
    let Some(values) = fields(body) else {
        return bad(&data);
    };
    if values.get("client_id").map(String::as_str) != Some(CLIENT_ID)
        || values.get("client_secret").map(String::as_str) != Some(CLIENT_SECRET)
    {
        return bad(&data);
    }
    if path == "/api/oauth2/token/revoke" {
        if !(values.len() == 3
            || (values.len() == 4
                && values.get("token_type_hint").map(String::as_str) == Some("access_token")))
            || values.get("token").map(String::as_str) != Some(ACCESS)
        {
            return bad(&data);
        }
        if mode == REVOKE_TIMEOUT {
            tokio::time::sleep(Duration::from_secs(2)).await;
        }
        return if mode == REVOKE_FAILED {
            StatusCode::SERVICE_UNAVAILABLE
        } else {
            StatusCode::OK
        }
        .into_response();
    }
    if values.len() != 6
        || values.get("grant_type").map(String::as_str) != Some("authorization_code")
    {
        return bad(&data);
    }
    let Some(code) = values.get("code") else {
        return bad(&data);
    };
    let Some(issued) = data
        .codes
        .lock()
        .expect("fictional Discord codes")
        .remove(code)
    else {
        return bad(&data);
    };
    if values.get("redirect_uri") != Some(&issued.redirect)
        || !values.get("code_verifier").is_some_and(|v| {
            (43..=128).contains(&v.len())
                && v.bytes()
                    .all(|b| b.is_ascii_alphanumeric() || matches!(b, b'-' | b'.' | b'_' | b'~'))
                && challenge(v) == issued.challenge
        })
    {
        return bad(&data);
    }
    if mode == HOLD_TOKEN {
        data.entered.notify_one();
        let _ = tokio::time::timeout(Duration::from_secs(8), data.release.notified()).await;
    }
    if mode == TOKEN_LARGE || mode == TOKEN_CHUNKED {
        let body = Body::from(vec![b'x'; 16385]);
        return Response::new(if mode == TOKEN_CHUNKED {
            Body::from_stream(body.into_data_stream())
        } else {
            body
        });
    }
    if mode == TOKEN_DENIED {
        return StatusCode::BAD_REQUEST.into_response();
    }
    if mode == REDIRECT_TOKEN {
        return (
            StatusCode::FOUND,
            [("location", "https://never-follow-discord.invalid/")],
        )
            .into_response();
    }
    Json(json!({"access_token":ACCESS,"refresh_token":"fictional-discord-refresh-token","token_type":"Bearer","expires_in":3600,"scope":if mode==WRONG_SCOPE {"identify email"}else{"identify"}})).into_response()
}

impl Discord {
    pub async fn start() -> Result<Self, &'static str> {
        let root = std::env::temp_dir().join(format!(
            "reborn-discord-fixture-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        fs::DirBuilder::new()
            .mode(0o700)
            .create(&root)
            .map_err(|_| "Discord fixture private directory")?;
        let make = |args: &[&str]| -> Result<(), &'static str> {
            if Command::new("openssl")
                .current_dir(&root)
                .args(args)
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .status()
                .map_err(|_| "Discord fixture openssl prerequisite")?
                .success()
            {
                Ok(())
            } else {
                Err("Discord fixture certificate generation")
            }
        };
        make(&[
            "req",
            "-x509",
            "-newkey",
            "rsa:2048",
            "-nodes",
            "-days",
            "1",
            "-subj",
            "/CN=Disposable Discord Fixture CA",
            "-keyout",
            "ca.key",
            "-out",
            "ca.pem",
            "-addext",
            "basicConstraints=critical,CA:TRUE",
        ])?;
        make(&[
            "req",
            "-newkey",
            "rsa:2048",
            "-nodes",
            "-subj",
            "/CN=discord.com",
            "-keyout",
            "leaf.key",
            "-out",
            "leaf.csr",
            "-addext",
            "subjectAltName=DNS:discord.com",
            "-addext",
            "basicConstraints=critical,CA:FALSE",
        ])?;
        make(&[
            "x509",
            "-req",
            "-in",
            "leaf.csr",
            "-CA",
            "ca.pem",
            "-CAkey",
            "ca.key",
            "-CAcreateserial",
            "-out",
            "leaf.pem",
            "-days",
            "1",
            "-copy_extensions",
            "copy",
        ])?;
        for entry in fs::read_dir(&root).map_err(|_| "Discord fixture private files")? {
            fs::set_permissions(
                entry.map_err(|_| "Discord fixture file")?.path(),
                fs::Permissions::from_mode(0o600),
            )
            .map_err(|_| "Discord fixture file permissions")?;
        }
        let certificates = CertificateDer::pem_file_iter(root.join("leaf.pem"))
            .map_err(|_| "Discord fixture cert")?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|_| "Discord fixture certificate decode")?;
        let key = PrivateKeyDer::from_pem_file(root.join("leaf.key"))
            .map_err(|_| "Discord fixture key")?;
        let tls = rustls::ServerConfig::builder_with_provider(Arc::new(
            rustls::crypto::ring::default_provider(),
        ))
        .with_safe_default_protocol_versions()
        .map_err(|_| "Discord fixture TLS protocols")?
        .with_no_client_auth()
        .with_single_cert(certificates, key)
        .map_err(|_| "Discord fixture TLS configuration")?;
        let tcp = TcpListener::bind("127.0.0.1:0")
            .await
            .map_err(|_| "Discord fixture listener")?;
        let address = tcp.local_addr().map_err(|_| "Discord fixture address")?;
        let ca_path = root.join("ca.pem");
        let ca = fs::read_to_string(&ca_path).map_err(|_| "Discord fixture CA")?;
        let data = Arc::new(DiscordData {
            mode: AtomicU8::new(NORMAL),
            codes: Mutex::new(BTreeMap::new()),
            serial: AtomicU64::new(0),
            requests: Mutex::new(Vec::new()),
            invalid: AtomicU64::new(0),
            entered: Notify::new(),
            release: Notify::new(),
        });
        let router = Router::new().fallback(handler).with_state(data.clone());
        let task = tokio::spawn(async move {
            let _ = axum::serve(
                Listener {
                    tcp,
                    tls: TlsAcceptor::from(Arc::new(tls)),
                },
                router,
            )
            .await;
        });
        Ok(Self {
            address,
            ca,
            ca_path,
            root,
            data,
            task,
        })
    }
    /// Issue a synthetic callback for nonbrowser recovery/HTTP callers. This
    /// validates the identical fixed authorization profile but performs no IO.
    pub fn authorization_callback(&self, authorization_url: &str) -> Result<String, &'static str> {
        let url = Url::parse(authorization_url).map_err(|_| "fictional authorization URL")?;
        if url.scheme() != "https"
            || url.host_str() != Some("discord.com")
            || url.port().is_some()
            || url.path() != "/oauth2/authorize"
            || !url.username().is_empty()
            || url.password().is_some()
            || url.fragment().is_some()
        {
            return Err("fictional authorization profile");
        }
        issue_callback(&self.data, url.query().unwrap_or(""))
            .ok_or("fictional authorization parameters")
    }
    pub fn mode(&self, mode: u8) {
        self.data.mode.store(mode, Ordering::SeqCst)
    }
    pub fn requests(&self) -> Vec<(String, String)> {
        self.data
            .requests
            .lock()
            .expect("fictional Discord records")
            .clone()
    }
    pub fn invalid_requests(&self) -> u64 {
        self.data.invalid.load(Ordering::SeqCst)
    }
    pub async fn wait_entered(&self) {
        self.data.entered.notified().await
    }
    pub fn release(&self) {
        self.data.release.notify_one()
    }
}
impl Drop for Discord {
    fn drop(&mut self) {
        self.task.abort();
        let _ = fs::remove_dir_all(&self.root);
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn synthetic_fixture_checks_the_rfc7636_s256_vector() {
        assert_eq!(
            super::challenge("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"),
            "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"
        );
    }
}
