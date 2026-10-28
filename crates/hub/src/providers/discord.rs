//! The fixed Discord identify profile. Tokens never become application state.
use reqwest::{Client as HttpClient, RequestBuilder, header};
use serde::{Deserialize, Deserializer, Serialize};
use sha2::{Digest, Sha256};
use std::{env, fs::File, io::Read, net::SocketAddr, path::PathBuf, sync::Arc, time::Duration};
use tokio::{sync::Semaphore, time::Instant};
use url::{Host, Url};
use zeroize::{Zeroize, Zeroizing};

pub const PROFILE: &str = "discord-identify-v1";
const AUTHORIZE: &str = "https://discord.com/oauth2/authorize";
const TOKEN: &str = "https://discord.com/api/oauth2/token";
const USER: &str = "https://discord.com/api/v10/users/@me";
const REVOKE: &str = "https://discord.com/api/oauth2/token/revoke";
const CALLBACK_PATH: &str = "/account/discord/callback";
const TOKEN_LIMIT: usize = 16 * 1024;
const USER_LIMIT: usize = 32 * 1024;
const CA_LIMIT: usize = 8192;
const MAX_EXPIRY: u64 = 31_536_000;
type ProviderResult<T> = Result<T, &'static str>;

// No Debug or Clone: one enrollment owns its zeroizing credential.
#[derive(Serialize)]
pub struct Enrollment {
    pub client_id: String,
    pub client_secret: String,
    pub callback_logging_reviewed: bool,
}

impl<'de> Deserialize<'de> for Enrollment {
    fn deserialize<D: Deserializer<'de>>(deserializer: D) -> Result<Self, D::Error> {
        #[derive(Deserialize)]
        #[serde(deny_unknown_fields)]
        struct Wire {
            client_id: String,
            #[serde(deserialize_with = "secret")]
            client_secret: Zeroizing<String>,
            callback_logging_reviewed: bool,
        }
        let mut wire = Wire::deserialize(deserializer)?;
        Ok(Self {
            client_id: wire.client_id,
            client_secret: std::mem::take(&mut *wire.client_secret),
            callback_logging_reviewed: wire.callback_logging_reviewed,
        })
    }
}

impl Drop for Enrollment {
    fn drop(&mut self) {
        self.client_secret.zeroize();
    }
}

impl Enrollment {
    pub fn validate(&self) -> ProviderResult<()> {
        if !canonical_id(&self.client_id)
            || !(1..=256).contains(&self.client_secret.len())
            || !self
                .client_secret
                .bytes()
                .all(|byte| byte.is_ascii_graphic())
            || !self.callback_logging_reviewed
        {
            return Err("invalid_configuration");
        }
        Ok(())
    }
}

pub fn canonical_id(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 20
        && !value.starts_with('0')
        && value.bytes().all(|byte| byte.is_ascii_digit())
        && value.parse::<u64>().is_ok_and(|id| id > 0)
}

fn valid_state(state: &str) -> bool {
    state.len() == 64
        && state
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

fn valid_verifier(verifier: &str) -> bool {
    (43..=128).contains(&verifier.len())
        && verifier
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'-' | b'.' | b'_' | b'~'))
}

pub fn pkce_challenge(verifier: &str) -> ProviderResult<String> {
    if !valid_verifier(verifier) {
        return Err("invalid_response");
    }
    const ALPHABET: &[u8; 64] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    let digest = Sha256::digest(verifier.as_bytes());
    let mut encoded = String::with_capacity(43);
    for chunk in digest.chunks(3) {
        let bits = (u32::from(chunk[0]) << 16)
            | (u32::from(*chunk.get(1).unwrap_or(&0)) << 8)
            | u32::from(*chunk.get(2).unwrap_or(&0));
        encoded.push(char::from(ALPHABET[((bits >> 18) & 63) as usize]));
        encoded.push(char::from(ALPHABET[((bits >> 12) & 63) as usize]));
        if chunk.len() >= 2 {
            encoded.push(char::from(ALPHABET[((bits >> 6) & 63) as usize]));
        }
        if chunk.len() == 3 {
            encoded.push(char::from(ALPHABET[(bits & 63) as usize]));
        }
    }
    Ok(encoded)
}

fn origin_url(origin: &str) -> ProviderResult<Url> {
    let parsed = Url::parse(origin).map_err(|_| "invalid_configuration")?;
    let canonical = parsed.origin().ascii_serialization();
    if origin.len() > 512
        || !origin.bytes().all(|byte| byte.is_ascii_graphic())
        || (origin != canonical && origin != format!("{canonical}/"))
        || parsed.scheme() != "https"
        || parsed.host().is_none()
        || !parsed.username().is_empty()
        || parsed.password().is_some()
        || parsed.path() != "/"
        || parsed.query().is_some()
        || parsed.fragment().is_some()
    {
        return Err("invalid_configuration");
    }
    Ok(parsed)
}

fn valid_callback(callback_uri: &str) -> bool {
    let Ok(callback) = Url::parse(callback_uri) else {
        return false;
    };
    let origin = callback.origin().ascii_serialization();
    origin_url(&origin).is_ok() && callback_uri == format!("{origin}{CALLBACK_PATH}")
}

pub fn authorize_url(
    client_id: &str,
    callback_uri: &str,
    state: &str,
    verifier: &str,
) -> ProviderResult<String> {
    if !canonical_id(client_id) || !valid_callback(callback_uri) || !valid_state(state) {
        return Err("invalid_response");
    }
    let challenge = pkce_challenge(verifier)?;
    let mut url = Url::parse(AUTHORIZE).map_err(|_| "unavailable")?;
    url.query_pairs_mut()
        .append_pair("client_id", client_id)
        .append_pair("redirect_uri", callback_uri)
        .append_pair("response_type", "code")
        .append_pair("scope", "identify")
        .append_pair("prompt", "consent")
        .append_pair("state", state)
        .append_pair("code_challenge_method", "S256")
        .append_pair("code_challenge", &challenge);
    Ok(url.into())
}

fn fixture_socket(origin: &str, socket: &str) -> ProviderResult<SocketAddr> {
    let parsed = origin_url(origin)?;
    let allowed_origin = match parsed.host() {
        Some(Host::Ipv4(ip)) => ip.is_loopback(),
        Some(Host::Ipv6(ip)) => ip.is_loopback(),
        Some(Host::Domain(name)) => name == "localhost" || name.ends_with(".test"),
        None => false,
    };
    let socket = socket
        .parse::<SocketAddr>()
        .map_err(|_| "invalid_configuration")?;
    if !allowed_origin || !socket.ip().is_loopback() || socket.port() == 0 {
        return Err("invalid_configuration");
    }
    Ok(socket)
}

fn fixture_ca(path: PathBuf) -> ProviderResult<reqwest::Certificate> {
    use tokio_rustls::rustls::{
        RootCertStore,
        pki_types::{CertificateDer, pem::PemObject},
    };
    let file = File::open(path).map_err(|_| "invalid_configuration")?;
    let metadata = file.metadata().map_err(|_| "invalid_configuration")?;
    if !metadata.is_file() || metadata.len() == 0 || metadata.len() > CA_LIMIT as u64 {
        return Err("invalid_configuration");
    }
    let mut pem = Vec::new();
    file.take(CA_LIMIT as u64 + 1)
        .read_to_end(&mut pem)
        .map_err(|_| "invalid_configuration")?;
    if pem.len() > CA_LIMIT {
        return Err("invalid_configuration");
    }
    let text = std::str::from_utf8(&pem).map_err(|_| "invalid_configuration")?;
    if !text.trim().starts_with("-----BEGIN CERTIFICATE-----")
        || !text.trim().ends_with("-----END CERTIFICATE-----")
        || text.contains("PRIVATE KEY")
    {
        return Err("invalid_configuration");
    }
    let mut certificates = CertificateDer::pem_slice_iter(&pem);
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
    reqwest::Certificate::from_pem(&pem).map_err(|_| "invalid_configuration")
}

pub struct Client {
    http: HttpClient,
    callback_uri: String,
    permits: Arc<Semaphore>,
}

pub struct ReviewResult {
    pub id: String,
    pub display_name: String,
    pub cleanup: &'static str,
}

#[derive(Deserialize)]
struct TokenResponse {
    #[serde(deserialize_with = "secret")]
    access_token: Zeroizing<String>,
    token_type: String,
    expires_in: u64,
    scope: String,
    #[serde(default, deserialize_with = "optional_secret")]
    refresh_token: Option<Zeroizing<String>>,
}

fn secret<'de, D: Deserializer<'de>>(deserializer: D) -> Result<Zeroizing<String>, D::Error> {
    String::deserialize(deserializer).map(Zeroizing::new)
}

fn optional_secret<'de, D: Deserializer<'de>>(
    deserializer: D,
) -> Result<Option<Zeroizing<String>>, D::Error> {
    Option::<String>::deserialize(deserializer).map(|value| value.map(Zeroizing::new))
}

impl TokenResponse {
    fn validate(&self) -> ProviderResult<()> {
        if !self.token_type.eq_ignore_ascii_case("Bearer")
            || self.scope != "identify"
            || !(1..=MAX_EXPIRY).contains(&self.expires_in)
            || !valid_token(&self.access_token)
            || self
                .refresh_token
                .as_ref()
                .is_some_and(|token| !valid_token(token))
        {
            return Err("invalid_response");
        }
        Ok(())
    }
}

fn valid_token(token: &str) -> bool {
    (1..=8192).contains(&token.len()) && token.bytes().all(|byte| byte.is_ascii_graphic())
}

#[derive(Deserialize)]
struct UserResponse {
    id: String,
    username: String,
    global_name: Option<String>,
}

impl UserResponse {
    fn identity(self) -> ProviderResult<(String, String)> {
        let display = match self.global_name {
            Some(name) if !name.is_empty() => name,
            _ => self.username,
        };
        // Labels remain plain text; JSON/HTML consumers must escape them. Reject
        // controls and directional formatting rather than hiding suspicious data.
        if !canonical_id(&self.id)
            || display.trim().is_empty()
            || display.len() > 320
            || display.chars().count() > 80
            || display.chars().any(|character| {
                character.is_control()
                    || matches!(character, '\u{061c}' | '\u{200e}' | '\u{200f}' | '\u{202a}'..='\u{202e}' | '\u{2066}'..='\u{2069}')
            })
        {
            return Err("invalid_response");
        }
        Ok((self.id, display))
    }
}

impl Client {
    /// Test transport is deliberately process configuration, never enrollment.
    /// Both overrides must be present, valid and restricted before any IO occurs.
    pub fn load(public_origin: &str) -> ProviderResult<Self> {
        let fixture = match (
            env::var_os("REBORN_DISCORD_FIXTURE_SOCKET"),
            env::var_os("REBORN_DISCORD_FIXTURE_CA_FILE"),
        ) {
            (None, None) => None,
            (Some(socket), Some(path)) => Some((socket, PathBuf::from(path))),
            _ => return Err("invalid_configuration"),
        };
        Self::configured(
            public_origin,
            fixture
                .as_ref()
                .map(|(socket, path)| {
                    socket
                        .to_str()
                        .map(|socket| (socket, path.clone()))
                        .ok_or("invalid_configuration")
                })
                .transpose()?,
        )
    }

    fn configured(public_origin: &str, fixture: Option<(&str, PathBuf)>) -> ProviderResult<Self> {
        let origin = origin_url(public_origin)?.origin().ascii_serialization();
        let mut builder = HttpClient::builder()
            .https_only(true)
            .no_proxy()
            .redirect(reqwest::redirect::Policy::none())
            .retry(reqwest::retry::never())
            .connect_timeout(Duration::from_millis(500))
            .timeout(Duration::from_millis(1200))
            .pool_max_idle_per_host(0)
            .default_headers(header::HeaderMap::from_iter([(
                header::ACCEPT,
                header::HeaderValue::from_static("application/json"),
            )]));
        if let Some((socket, path)) = fixture {
            let socket = fixture_socket(&origin, socket)?;
            let certificate = fixture_ca(path)?;
            // Fixed URLs have no explicit port. Reqwest's DNS override
            // selects this socket while retaining discord.com for TLS/SNI.
            builder = builder
                .resolve("discord.com", socket)
                .tls_certs_only([certificate]);
        }
        Ok(Self {
            http: builder.build().map_err(|_| "invalid_configuration")?,
            callback_uri: format!("{origin}{CALLBACK_PATH}"),
            permits: Arc::new(Semaphore::new(8)),
        })
    }

    pub async fn review(
        &self,
        app: &Enrollment,
        code: &str,
        verifier: &str,
        callback_uri: &str,
    ) -> ProviderResult<ReviewResult> {
        app.validate().map_err(|_| "invalid_response")?;
        if callback_uri != self.callback_uri
            || !(1..=1024).contains(&code.len())
            || !code.bytes().all(|byte| byte.is_ascii_graphic())
            || !valid_verifier(verifier)
        {
            return Err("invalid_response");
        }
        let _permit = self.permits.try_acquire().map_err(|_| "unavailable")?;
        let deadline = Instant::now() + Duration::from_secs(3);
        let token = self.exchange(app, code, verifier, deadline).await?;
        let identity = self.identity(&token.access_token, deadline).await;
        // Exactly one best-effort revocation, including a failed identity read.
        // Discord revokes the whole authorization; no refresh capability is kept.
        let cleanup = if self
            .revoke(app, &token.access_token, deadline)
            .await
            .is_ok()
        {
            "acknowledged"
        } else {
            "unconfirmed"
        };
        let (id, display_name) = identity?;
        Ok(ReviewResult {
            id,
            display_name,
            cleanup,
        })
    }

    async fn exchange(
        &self,
        app: &Enrollment,
        code: &str,
        verifier: &str,
        deadline: Instant,
    ) -> ProviderResult<TokenResponse> {
        let form = Zeroizing::new(
            url::form_urlencoded::Serializer::new(String::new())
                .append_pair("grant_type", "authorization_code")
                .append_pair("client_id", &app.client_id)
                .append_pair("client_secret", &app.client_secret)
                .append_pair("code", code)
                .append_pair("code_verifier", verifier)
                .append_pair("redirect_uri", &self.callback_uri)
                .finish(),
        );
        let body = request_body(
            self.http
                .post(TOKEN)
                .header(header::CONTENT_TYPE, "application/x-www-form-urlencoded")
                .body(secret_body(form)),
            TOKEN_LIMIT,
            deadline,
        )
        .await?;
        let token: TokenResponse = serde_json::from_slice(&body).map_err(|_| "invalid_response")?;
        token.validate()?;
        Ok(token)
    }

    async fn identity(&self, token: &str, deadline: Instant) -> ProviderResult<(String, String)> {
        let value = Zeroizing::new(format!("Bearer {token}"));
        let mut authorization =
            header::HeaderValue::from_str(&value).map_err(|_| "invalid_response")?;
        authorization.set_sensitive(true);
        let body = request_body(
            self.http
                .get(USER)
                .header(header::AUTHORIZATION, authorization),
            USER_LIMIT,
            deadline,
        )
        .await?;
        serde_json::from_slice::<UserResponse>(&body)
            .map_err(|_| "invalid_response")?
            .identity()
    }

    async fn revoke(&self, app: &Enrollment, token: &str, deadline: Instant) -> ProviderResult<()> {
        let form = Zeroizing::new(
            url::form_urlencoded::Serializer::new(String::new())
                .append_pair("client_id", &app.client_id)
                .append_pair("client_secret", &app.client_secret)
                .append_pair("token", token)
                .append_pair("token_type_hint", "access_token")
                .finish(),
        );
        request_body(
            self.http
                .post(REVOKE)
                .header(header::CONTENT_TYPE, "application/x-www-form-urlencoded")
                .body(secret_body(form)),
            TOKEN_LIMIT,
            deadline,
        )
        .await
        .map(|_| ())
    }
}

fn secret_body(mut form: Zeroizing<String>) -> axum::body::Bytes {
    // Bytes retains this owner through every clone until the transport releases
    // the body. Moving the String allocation avoids an ordinary secret copy.
    axum::body::Bytes::from_owner(Zeroizing::new(std::mem::take(&mut *form).into_bytes()))
}

async fn request_body(
    request: RequestBuilder,
    limit: usize,
    deadline: Instant,
) -> ProviderResult<Zeroizing<Vec<u8>>> {
    if Instant::now() >= deadline {
        return Err("timeout");
    }
    tokio::time::timeout_at(deadline, async {
        let mut response = request.send().await.map_err(transport_error)?;
        match response.status().as_u16() {
            200 => {}
            401 | 403 => return Err("denied"),
            _ => return Err("provider_error"),
        }
        if response
            .content_length()
            .is_some_and(|length| length > limit as u64)
        {
            return Err("invalid_response");
        }
        let mut body = Zeroizing::new(Vec::new());
        while let Some(chunk) = response.chunk().await.map_err(transport_error)? {
            if chunk.len() > limit.saturating_sub(body.len()) {
                return Err("invalid_response");
            }
            body.extend_from_slice(&chunk);
        }
        Ok(body)
    })
    .await
    .map_err(|_| "timeout")?
}

fn transport_error(error: reqwest::Error) -> &'static str {
    if error.is_timeout() {
        "timeout"
    } else {
        "transport"
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::BTreeMap;

    #[test]
    fn canonical_ids_preserve_full_u64_without_number_coercion() {
        for id in ["1", "9007199254740993", "18446744073709551615"] {
            assert!(canonical_id(id));
        }
        for id in [
            "",
            "0",
            "01",
            "+1",
            "1.0",
            "1e3",
            "18446744073709551616",
            "١",
        ] {
            assert!(!canonical_id(id));
        }
    }

    #[test]
    fn rfc7636_s256_vector_and_fixed_authorization_surface() {
        let verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
        assert_eq!(
            pkce_challenge(verifier),
            Ok("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM".into())
        );
        let state = "a".repeat(64);
        let callback = "https://hub.test/account/discord/callback";
        let url = Url::parse(&authorize_url("1", callback, &state, verifier).unwrap()).unwrap();
        assert_eq!(url.origin().ascii_serialization(), "https://discord.com");
        assert_eq!(url.path(), "/oauth2/authorize");
        let pairs: BTreeMap<_, _> = url.query_pairs().into_owned().collect();
        assert_eq!(pairs.len(), 8);
        assert_eq!(pairs["scope"], "identify");
        assert_eq!(pairs["prompt"], "consent");
        assert_eq!(pairs["response_type"], "code");
        assert_eq!(pairs["code_challenge_method"], "S256");
        assert_eq!(pairs["redirect_uri"], callback);
        assert_eq!(pairs["state"], state);
        assert!(!url.as_str().contains(verifier));
        assert!(authorize_url("01", callback, &state, verifier).is_err());
        assert!(
            authorize_url(
                "1",
                "https://hub.test/account/discord/callback?x=1",
                &state,
                verifier
            )
            .is_err()
        );
        assert!(authorize_url("1", callback, &"A".repeat(64), verifier).is_err());
        assert!(pkce_challenge(&"!".repeat(43)).is_err());
    }

    #[test]
    fn enrollment_admits_only_explicit_bounded_credentials() {
        let mut app = Enrollment {
            client_id: "1".into(),
            client_secret: "secret".into(),
            callback_logging_reviewed: true,
        };
        assert!(app.validate().is_ok());
        app.callback_logging_reviewed = false;
        assert!(app.validate().is_err());
        app.callback_logging_reviewed = true;
        for secret in [String::new(), "a".repeat(257), "a b".into(), "a\nb".into()] {
            app.client_secret = secret;
            assert!(app.validate().is_err());
        }
        assert!(serde_json::from_str::<Enrollment>(
            r#"{"client_id":"1","client_secret":"secret","callback_logging_reviewed":true,"endpoint":"https://other.test"}"#
        ).is_err());
    }

    #[test]
    fn fixture_transport_cannot_override_real_origin_or_non_loopback_socket() {
        for origin in [
            "https://127.0.0.1:8443",
            "https://[::1]",
            "https://localhost",
            "https://hub.test",
        ] {
            assert!(fixture_socket(origin, "127.0.0.1:9443").is_ok());
        }
        for origin in [
            "https://rewrite.keida.me",
            "https://test",
            "https://hub.test.example",
            "http://127.0.0.1",
            "https://127.0.0.1/path",
            "https://user@hub.test",
        ] {
            assert!(fixture_socket(origin, "127.0.0.1:9443").is_err());
        }
        for socket in [
            "192.168.1.1:9443",
            "0.0.0.0:9443",
            "127.0.0.1:0",
            "localhost:9443",
        ] {
            assert!(fixture_socket("https://hub.test", socket).is_err());
        }
    }

    #[test]
    fn token_requires_exact_scope_bearer_bounded_expiry_and_no_duplicates() {
        let json = r#"{"access_token":"access","token_type":"Bearer","expires_in":600,"scope":"identify","refresh_token":"refresh","ignored":{"email":"discarded"}}"#;
        assert!(
            serde_json::from_str::<TokenResponse>(json)
                .unwrap()
                .validate()
                .is_ok()
        );
        for (from, to) in [
            ("Bearer", "Basic"),
            ("identify", "identify email"),
            ("600", "0"),
            ("600", "31536001"),
        ] {
            assert!(
                serde_json::from_str::<TokenResponse>(&json.replace(from, to))
                    .unwrap()
                    .validate()
                    .is_err()
            );
        }
        assert!(
            serde_json::from_str::<TokenResponse>(&json.replace(
                "\"scope\":\"identify\"",
                "\"scope\":\"identify\",\"scope\":\"identify\""
            ))
            .is_err()
        );
        assert!(serde_json::from_str::<TokenResponse>(&json.replace("600", "1.0")).is_err());
    }

    #[test]
    fn user_labels_are_bounded_plain_text_and_never_id_authority() {
        let user = |label: String| UserResponse {
            id: "18446744073709551615".into(),
            username: "fallback".into(),
            global_name: Some(label),
        };
        assert_eq!(
            user("<b>name</b>".into()).identity().unwrap().1,
            "<b>name</b>"
        );
        assert_eq!(user(String::new()).identity().unwrap().1, "fallback");
        assert!(user("😀".repeat(80)).identity().is_ok());
        for label in [
            "a".repeat(81),
            " \u{a0}\u{3000}".into(),
            "bad\nname".into(),
            "bad\u{202e}name".into(),
        ] {
            assert!(user(label).identity().is_err());
        }
        let mut invalid_id = user("name".into());
        invalid_id.id = "01".into();
        assert!(invalid_id.identity().is_err());
    }

    #[tokio::test]
    async fn fixed_https_profile_checks_pkce_scope_identity_and_once_only_cleanup() {
        use reborn_crafty_fixture::discord as fixture;
        let discord = fixture::Discord::start().await.unwrap();
        let origin = "https://hub.test";
        let callback = format!("{origin}{CALLBACK_PATH}");
        let client = Client::configured(
            origin,
            Some((&discord.address.to_string(), discord.ca_path.clone())),
        )
        .unwrap();
        assert!(
            Client::configured(
                "https://rewrite.keida.me",
                Some((&discord.address.to_string(), discord.ca_path.clone())),
            )
            .is_err()
        );
        let app = Enrollment {
            client_id: fixture::CLIENT_ID.into(),
            client_secret: fixture::CLIENT_SECRET.into(),
            callback_logging_reviewed: true,
        };
        let verifier = "a".repeat(64);
        for (mode, expected, calls) in [
            (fixture::NORMAL, Ok("acknowledged"), 3),
            (fixture::REVOKE_FAILED, Ok("unconfirmed"), 3),
            (fixture::WRONG_SCOPE, Err("invalid_response"), 1),
            (fixture::MALFORMED_USER, Err("invalid_response"), 3),
            (fixture::DUPLICATE_USER, Err("invalid_response"), 3),
            (fixture::REDIRECT_TOKEN, Err("provider_error"), 1),
            (fixture::TOKEN_LARGE, Err("invalid_response"), 1),
            (fixture::TOKEN_CHUNKED, Err("invalid_response"), 1),
            (fixture::USER_LARGE, Err("invalid_response"), 3),
            (fixture::USER_CHUNKED, Err("invalid_response"), 3),
            (fixture::USER_TIMEOUT, Err("timeout"), 3),
            (fixture::REVOKE_TIMEOUT, Ok("unconfirmed"), 3),
        ] {
            discord.mode(mode);
            let authorize =
                authorize_url(&app.client_id, &callback, &"b".repeat(64), &verifier).unwrap();
            let returned =
                Url::parse(&discord.authorization_callback(&authorize).unwrap()).unwrap();
            let code = returned
                .query_pairs()
                .find(|(name, _)| name == "code")
                .unwrap()
                .1
                .into_owned();
            let before = discord.requests().len();
            let started = Instant::now();
            let result = client.review(&app, &code, &verifier, &callback).await;
            if matches!(mode, fixture::USER_TIMEOUT | fixture::REVOKE_TIMEOUT) {
                let elapsed = started.elapsed();
                assert!(elapsed >= Duration::from_millis(900));
                assert!(elapsed < Duration::from_millis(3500));
            }
            match (result, expected) {
                (Ok(result), Ok(cleanup)) => {
                    assert_eq!(result.id, fixture::ID);
                    assert_eq!(result.display_name, fixture::DISPLAY);
                    assert_eq!(result.cleanup, cleanup);
                }
                (Err(actual), Err(expected)) => assert_eq!(actual, expected),
                _ => panic!("unexpected closed Discord review result"),
            }
            let records = discord.requests();
            let records = &records[before..];
            assert_eq!(records.len(), calls);
            assert_eq!(records[0], ("POST".into(), "/api/oauth2/token".into()));
            if calls == 3 {
                assert_eq!(records[1], ("GET".into(), "/api/v10/users/@me".into()));
                assert_eq!(
                    records[2],
                    ("POST".into(), "/api/oauth2/token/revoke".into())
                );
            }
        }
        assert_eq!(discord.invalid_requests(), 0);
    }

    #[tokio::test]
    async fn fixture_socket_override_still_requires_the_correct_tls_ca() {
        use reborn_crafty_fixture::discord as fixture;
        let discord = fixture::Discord::start().await.unwrap();
        let unrelated = fixture::Discord::start().await.unwrap();
        let origin = "https://127.0.0.1:8443";
        let callback = format!("{origin}{CALLBACK_PATH}");
        let client = Client::configured(
            origin,
            Some((&discord.address.to_string(), unrelated.ca_path.clone())),
        )
        .unwrap();
        let app = Enrollment {
            client_id: fixture::CLIENT_ID.into(),
            client_secret: fixture::CLIENT_SECRET.into(),
            callback_logging_reviewed: true,
        };
        let result = client
            .review(&app, "code", &"a".repeat(64), &callback)
            .await;
        assert!(matches!(result, Err("transport")));
        assert!(discord.requests().is_empty());
        assert!(unrelated.requests().is_empty());
    }

    #[tokio::test]
    async fn eight_exchange_limit_fails_closed_and_cancellation_releases_capacity() {
        use reborn_crafty_fixture::discord as fixture;
        let discord = fixture::Discord::start().await.unwrap();
        discord.mode(fixture::HOLD_TOKEN);
        let callback = "https://hub.test/account/discord/callback";
        let client = Arc::new(
            Client::configured(
                "https://hub.test",
                Some((&discord.address.to_string(), discord.ca_path.clone())),
            )
            .unwrap(),
        );
        let app = Arc::new(Enrollment {
            client_id: fixture::CLIENT_ID.into(),
            client_secret: fixture::CLIENT_SECRET.into(),
            callback_logging_reviewed: true,
        });
        let verifier = "a".repeat(64);
        let mut tasks = Vec::new();
        for _ in 0..8 {
            let authorization =
                authorize_url(&app.client_id, callback, &"b".repeat(64), &verifier).unwrap();
            let returned =
                Url::parse(&discord.authorization_callback(&authorization).unwrap()).unwrap();
            let code = returned
                .query_pairs()
                .find(|(name, _)| name == "code")
                .unwrap()
                .1
                .into_owned();
            let client = client.clone();
            let app = app.clone();
            let verifier = verifier.clone();
            tasks.push(tokio::spawn(async move {
                client.review(&app, &code, &verifier, callback).await
            }));
        }
        tokio::time::timeout(Duration::from_secs(1), async {
            while client.permits.available_permits() != 0 {
                tokio::task::yield_now().await;
            }
        })
        .await
        .unwrap();
        let before = discord.requests().len();
        assert!(matches!(
            client.review(&app, "unused", &verifier, callback).await,
            Err("unavailable")
        ));
        assert_eq!(discord.requests().len(), before);
        for task in &tasks {
            task.abort();
        }
        for task in tasks {
            assert!(matches!(task.await, Err(error) if error.is_cancelled()));
        }
        assert_eq!(client.permits.available_permits(), 8);
        assert_eq!(discord.invalid_requests(), 0);
    }
}
