use hmac::{Hmac, KeyInit, Mac};
use reqwest::{Client, Method, RequestBuilder, Response, StatusCode};
use serde_json::{Value, json};
use sha2::Sha256;
use sqlx::{Connection, PgConnection, Row};
use std::{
    collections::BTreeMap,
    fs::{self, DirBuilder, File},
    net::TcpListener,
    os::unix::fs::{DirBuilderExt, PermissionsExt},
    path::PathBuf,
    process::{Child, Command, Output, Stdio},
    sync::atomic::{AtomicU64, Ordering},
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};
use url::Url;

const BINARY: &str = env!("CARGO_BIN_EXE_keida-hub-reborn");
const ORIGIN: &str = "https://reborn.example";
const PRODUCT: &str = "keida-hub-reborn";
const CONTRACT: &str = "reborn-account-v1";
const SESSION: &str = "__Host-keida-reborn-session";
const FORM: &str = "__Host-keida-reborn-form";
const OWNER_PASSWORD: &str = "Native owner fixture password 71!";
const MEMBER_PASSWORD: &str = "Native member fixture password 82!";
static COUNTER: AtomicU64 = AtomicU64::new(0);

fn unique() -> String {
    format!(
        "{}_{:x}_{:x}",
        std::process::id(),
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("fixture clock")
            .as_nanos(),
        COUNTER.fetch_add(1, Ordering::Relaxed)
    )
}

fn owned_name(name: &str) {
    assert!(name.starts_with("keida_reborn_test_") && name.len() <= 63);
    assert!(
        name.bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || byte == b'_')
    );
}

struct Fixture {
    admin: String,
    database: String,
    name: String,
    directory: PathBuf,
    key: PathBuf,
}

impl Fixture {
    async fn new() -> Self {
        let admin = std::env::var("REBORN_TEST_DATABASE_URL")
            .expect("REBORN_TEST_DATABASE_URL must provision a local disposable PostgreSQL fixture; account HTTP contracts never skip");
        let mut url = Url::parse(&admin).expect("parse local administrator URL");
        assert!(matches!(url.scheme(), "postgres" | "postgresql"));
        assert!(matches!(
            url.host_str(),
            Some("127.0.0.1" | "localhost" | "[::1]" | "::1")
        ));
        let name = format!("keida_reborn_test_{}", unique());
        owned_name(&name);
        let mut connection = PgConnection::connect(&admin)
            .await
            .expect("connect disposable administrator");
        // Audited identifier: generated here, fixed prefix, ASCII alphanumeric/
        // underscore only, PostgreSQL length bound. External text never enters SQL.
        sqlx::raw_sql(sqlx::AssertSqlSafe(format!("CREATE DATABASE \"{name}\"")))
            .execute(&mut connection)
            .await
            .expect("create owned account database");
        url.set_path(&format!("/{name}"));
        let directory = std::env::temp_dir().join(format!("keida-reborn-account-{}", unique()));
        assert!(directory.is_absolute());
        DirBuilder::new()
            .mode(0o700)
            .create(&directory)
            .expect("create private fixture directory");
        let fixture = Self {
            admin,
            database: url.to_string(),
            name,
            key: directory.join("instance.key"),
            directory,
        };
        let migrated = completed(
            fixture
                .command(&["migrate"], false)
                .spawn()
                .expect("start explicit migration"),
        )
        .await;
        assert!(
            migrated.status.success(),
            "explicit fixture migration failed"
        );
        let initialized = completed(
            fixture
                .command(
                    &["init-key", fixture.key.to_str().expect("private key path")],
                    false,
                )
                .spawn()
                .expect("start explicit key creation"),
        )
        .await;
        assert!(
            initialized.status.success(),
            "explicit fixture key creation failed"
        );
        assert!(initialized.stdout.is_empty() && initialized.stderr.is_empty());
        assert_eq!(
            fs::metadata(&fixture.key)
                .expect("key metadata")
                .permissions()
                .mode()
                & 0o777,
            0o600
        );
        fixture
    }

    fn command(&self, arguments: &[&str], auth: bool) -> Command {
        let mut command = Command::new(BINARY);
        command
            .args(arguments)
            .env("DATABASE_URL", &self.database)
            .env("REBORN_PUBLIC_ORIGIN", ORIGIN)
            .env("REBORN_BIND", "127.0.0.1:8788")
            .env("REBORN_DB_MAX_CONNECTIONS", "5")
            .env_remove("REBORN_INSTANCE_KEY_FILE")
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());
        if auth {
            command.env("REBORN_INSTANCE_KEY_FILE", &self.key);
        }
        command
    }

    async fn prepare(&self) -> String {
        let output = self.directory.join(format!("setup-{}", unique()));
        let result = completed(
            self.command(
                &[
                    "prepare-owner",
                    output.to_str().expect("private setup path"),
                ],
                true,
            )
            .spawn()
            .expect("start deliberate private preparation"),
        )
        .await;
        assert!(result.status.success(), "fixture owner preparation failed");
        assert!(result.stdout.is_empty() && result.stderr.is_empty());
        let token = fs::read_to_string(&output).expect("read owned setup secret");
        assert!(canonical_token(&token));
        assert_eq!(
            fs::metadata(output)
                .expect("setup metadata")
                .permissions()
                .mode()
                & 0o777,
            0o600
        );
        token
    }

    async fn connect(&self) -> PgConnection {
        PgConnection::connect(&self.database)
            .await
            .expect("connect owned account fixture")
    }
}

impl Drop for Fixture {
    fn drop(&mut self) {
        let admin = self.admin.clone();
        let name = self.name.clone();
        owned_name(&name);
        let result = std::thread::spawn(move || {
            let runtime = tokio::runtime::Builder::new_current_thread().enable_all().build().map_err(|_| ())?;
            runtime.block_on(async move {
                let mut connection = PgConnection::connect(&admin).await.map_err(|_| ())?;
                sqlx::query("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()")
                    .bind(&name).execute(&mut connection).await.map_err(|_| ())?;
                // Same generated-identifier audit: remove only the database created above.
                sqlx::raw_sql(sqlx::AssertSqlSafe(format!("DROP DATABASE \"{name}\"")))
                    .execute(&mut connection).await.map_err(|_| ())?;
                Ok::<(), ()>(())
            })
        }).join();
        if !matches!(result, Ok(Ok(()))) {
            eprintln!("owned account database cleanup failed");
        }
        if fs::remove_dir_all(&self.directory).is_err() {
            eprintln!("owned private account fixture cleanup failed");
        }
    }
}

async fn completed(mut child: Child) -> Output {
    tokio::task::spawn_blocking(move || {
        let deadline = Instant::now() + Duration::from_secs(15);
        loop {
            if child.try_wait().expect("inspect fixture CLI").is_some() {
                return child
                    .wait_with_output()
                    .expect("collect fixture CLI output");
            }
            if Instant::now() >= deadline {
                let _ = child.kill();
                let _ = child.wait();
                panic!("fixture CLI deadline exceeded");
            }
            std::thread::sleep(Duration::from_millis(10));
        }
    })
    .await
    .expect("fixture CLI waiter")
}

struct Server {
    child: Child,
    origin: String,
    stdout: PathBuf,
    stderr: PathBuf,
}

impl Server {
    async fn start(fixture: &Fixture, auth: bool) -> Self {
        let port = TcpListener::bind(("127.0.0.1", 0))
            .expect("reserve fixture HTTP port")
            .local_addr()
            .expect("fixture socket address")
            .port();
        let stdout = fixture.directory.join(format!("stdout-{}", unique()));
        let stderr = fixture.directory.join(format!("stderr-{}", unique()));
        let mut command = fixture.command(&["serve"], auth);
        command
            .env("REBORN_BIND", format!("127.0.0.1:{port}"))
            .stdout(Stdio::from(
                File::create_new(&stdout).expect("private stdout capture"),
            ))
            .stderr(Stdio::from(
                File::create_new(&stderr).expect("private stderr capture"),
            ));
        let mut server = Self {
            child: command.spawn().expect("start account fixture service"),
            origin: format!("http://127.0.0.1:{port}"),
            stdout,
            stderr,
        };
        let client = client();
        let deadline = Instant::now() + Duration::from_secs(5);
        loop {
            if let Ok(response) = client
                .get(format!("{}/api/health", server.origin))
                .send()
                .await
            {
                assert_eq!(response.status(), StatusCode::OK);
                return server;
            }
            assert!(
                server
                    .child
                    .try_wait()
                    .expect("inspect fixture service")
                    .is_none(),
                "account fixture exited before listening"
            );
            assert!(
                Instant::now() < deadline,
                "account fixture listener deadline exceeded"
            );
            tokio::time::sleep(Duration::from_millis(20)).await;
        }
    }

    fn actor(&self) -> Actor {
        Actor {
            client: client(),
            origin: self.origin.clone(),
            cookies: BTreeMap::new(),
        }
    }

    fn private_logs(&self, secrets: &[&str]) {
        for path in [&self.stdout, &self.stderr] {
            private_text(
                &fs::read_to_string(path).expect("read fixture output"),
                secrets,
            );
        }
    }
}

impl Drop for Server {
    fn drop(&mut self) {
        let _ = self.child.kill();
        let _ = self.child.wait();
    }
}

fn client() -> Client {
    Client::builder()
        .timeout(Duration::from_secs(4))
        .redirect(reqwest::redirect::Policy::none())
        .build()
        .expect("native HTTP client")
}

#[derive(Clone)]
struct Actor {
    client: Client,
    origin: String,
    cookies: BTreeMap<String, String>,
}

impl Actor {
    fn request(&self, method: Method, path: &str) -> RequestBuilder {
        let request = self
            .client
            .request(method, format!("{}{path}", self.origin));
        if self.cookies.is_empty() {
            request
        } else {
            request.header(
                "Cookie",
                self.cookies
                    .iter()
                    .map(|(name, value)| format!("{name}={value}"))
                    .collect::<Vec<_>>()
                    .join("; "),
            )
        }
    }

    fn capture(&mut self, response: &Response) {
        for value in response.headers().get_all("set-cookie") {
            let raw = value.to_str().expect("ASCII cookie response");
            let parts: Vec<_> = raw.split(';').map(str::trim).collect();
            let (name, value) = parts[0].split_once('=').expect("cookie pair");
            if !matches!(name, SESSION | FORM) {
                continue;
            }
            for attribute in ["Secure", "HttpOnly", "SameSite=Strict", "Path=/"] {
                assert!(
                    parts
                        .iter()
                        .any(|part| part.eq_ignore_ascii_case(attribute)),
                    "cookie security attribute omitted"
                );
            }
            assert!(
                !parts
                    .iter()
                    .any(|part| part.to_ascii_lowercase().starts_with("domain="))
            );
            if value.is_empty() {
                assert!(
                    parts
                        .iter()
                        .any(|part| part.eq_ignore_ascii_case("Max-Age=0"))
                );
                self.cookies.remove(name);
            } else {
                self.cookies.insert(name.to_owned(), value.to_owned());
            }
        }
    }

    async fn send(&mut self, request: RequestBuilder) -> Response {
        let response = request.send().await.expect("native HTTP response");
        self.capture(&response);
        response
    }

    async fn get(&mut self, path: &str) -> Response {
        self.send(self.request(Method::GET, path)).await
    }

    async fn page(&mut self, path: &str, status: StatusCode, secrets: &[&str]) -> String {
        let response = self.get(path).await;
        html(response, status, secrets).await
    }

    async fn post(&mut self, path: &str, fields: &[(String, String)]) -> Response {
        let request = self
            .request(Method::POST, path)
            .header("Origin", ORIGIN)
            .header("Content-Type", "application/x-www-form-urlencoded")
            .body(encoded(fields));
        self.send(request).await
    }

    async fn api_session(&mut self, status: StatusCode) -> Value {
        let request = self
            .request(Method::GET, "/api/auth/session")
            .header("X-Reborn-Product", PRODUCT)
            .header("X-Reborn-Contract", "reborn-auth-v1");
        let response = self.send(request).await;
        assert_eq!(response.status(), status);
        no_store(&response);
        response.json().await.expect("session API JSON")
    }

    async fn api_login(&mut self, username: &str, password: &str) -> Value {
        let response = self.get("/api/auth/form").await;
        assert_eq!(response.status(), StatusCode::OK);
        let form: Value = response.json().await.expect("API anonymous challenge");
        let request = self
            .request(Method::POST, "/api/auth/login")
            .header("Origin", ORIGIN)
            .header("X-Reborn-Product", PRODUCT)
            .header("X-Reborn-Contract", "reborn-auth-v1")
            .header(
                "X-CSRF-Token",
                form["csrf_token"].as_str().expect("API CSRF"),
            )
            .json(&json!({"username":username,"password":password}));
        let response = self.send(request).await;
        assert_eq!(response.status(), StatusCode::OK);
        response.json().await.expect("API sign-in result")
    }
}

fn canonical_token(value: &str) -> bool {
    value.len() == 64
        && value
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

fn encoded(fields: &[(String, String)]) -> String {
    url::form_urlencoded::Serializer::new(String::new())
        .extend_pairs(
            fields
                .iter()
                .map(|(name, value)| (name.as_str(), value.as_str())),
        )
        .finish()
}

fn private_text(text: &str, secrets: &[&str]) {
    for secret in secrets {
        assert!(!secret.is_empty());
        assert!(
            !text.contains(secret),
            "private fixture value escaped its intended boundary"
        );
    }
    assert!(!text.contains("$argon2"));
    assert!(!text.contains("postgresql://"));
}

fn no_store(response: &Response) {
    assert_eq!(
        response
            .headers()
            .get("cache-control")
            .expect("no-store header"),
        "no-store"
    );
}

fn page_csp(response: &Response) {
    let policy = response
        .headers()
        .get("content-security-policy")
        .expect("account CSP")
        .to_str()
        .expect("ASCII CSP");
    let directives: Vec<_> = policy.split(';').map(str::trim).collect();
    for directive in [
        "default-src 'none'",
        "base-uri 'none'",
        "frame-ancestors 'none'",
        "form-action 'self'",
        "script-src 'self'",
        "style-src 'self'",
        "connect-src 'self'",
    ] {
        assert!(
            directives.contains(&directive),
            "account CSP omitted a frozen boundary"
        );
    }
    assert!(!policy.contains("'unsafe-inline'") && !policy.contains("'unsafe-eval'"));
}

async fn html(response: Response, status: StatusCode, secrets: &[&str]) -> String {
    assert_eq!(response.status(), status);
    no_store(&response);
    page_csp(&response);
    assert!(
        response
            .headers()
            .get("content-type")
            .expect("HTML media type")
            .to_str()
            .expect("ASCII media type")
            .starts_with("text/html")
    );
    let text = response.text().await.expect("native HTML document");
    private_text(&text, secrets);
    for tag in tags(&text, "input") {
        if matches!(
            attribute(tag, "name").as_deref(),
            Some("password" | "setup_secret")
        ) {
            assert!(
                attribute(tag, "value").unwrap_or_default().is_empty(),
                "rendered credential control retained a value"
            );
        }
    }
    if !status.is_success() {
        assert!(
            text.contains("role=\"alert\"") || text.contains("role='alert'"),
            "rejection omitted its accessible error summary"
        );
    }
    text
}

// Tiny extraction primitives inspect real response markup, not template source.
// Browser DOM/interaction verification belongs to the separate browser driver.
fn tags<'a>(html: &'a str, name: &str) -> Vec<&'a str> {
    let needle = format!("<{name}");
    html.match_indices(&needle)
        .filter_map(|(start, _)| {
            let rest = &html[start + needle.len()..];
            if !rest
                .starts_with(|character: char| character.is_ascii_whitespace() || character == '>')
            {
                return None;
            }
            html[start..]
                .find('>')
                .map(|end| &html[start + 1..start + end])
        })
        .collect()
}

fn attribute(tag: &str, wanted: &str) -> Option<String> {
    let bytes = tag.as_bytes();
    let mut cursor = 0;
    while cursor < bytes.len() && !bytes[cursor].is_ascii_whitespace() {
        cursor += 1;
    }
    while cursor < bytes.len() {
        while cursor < bytes.len() && (bytes[cursor].is_ascii_whitespace() || bytes[cursor] == b'/')
        {
            cursor += 1;
        }
        let start = cursor;
        while cursor < bytes.len()
            && !bytes[cursor].is_ascii_whitespace()
            && !matches!(bytes[cursor], b'=' | b'/')
        {
            cursor += 1;
        }
        if cursor == start {
            break;
        }
        let name = &tag[start..cursor];
        while cursor < bytes.len() && bytes[cursor].is_ascii_whitespace() {
            cursor += 1;
        }
        let mut value = "";
        if cursor < bytes.len() && bytes[cursor] == b'=' {
            cursor += 1;
            while cursor < bytes.len() && bytes[cursor].is_ascii_whitespace() {
                cursor += 1;
            }
            if cursor < bytes.len() && matches!(bytes[cursor], b'\'' | b'"') {
                let quote = bytes[cursor];
                cursor += 1;
                let start = cursor;
                while cursor < bytes.len() && bytes[cursor] != quote {
                    cursor += 1;
                }
                value = &tag[start..cursor];
                if cursor < bytes.len() {
                    cursor += 1;
                }
            } else {
                let start = cursor;
                while cursor < bytes.len() && !bytes[cursor].is_ascii_whitespace() {
                    cursor += 1;
                }
                value = &tag[start..cursor];
            }
        }
        if name.eq_ignore_ascii_case(wanted) {
            return Some(value.to_owned());
        }
    }
    None
}

fn form_fields(page: &str, action: &str) -> Vec<(String, String)> {
    let opening = tags(page, "form")
        .into_iter()
        .find(|tag| attribute(tag, "action").as_deref() == Some(action))
        .expect("native form with fixed local action");
    assert!(attribute(opening, "method").is_some_and(|value| value.eq_ignore_ascii_case("post")));
    let position = page.find(opening).expect("form opening position") + opening.len();
    let body = &page[position..];
    let body = &body[..body.find("</form>").expect("closed native form")];
    let mut fields = Vec::new();
    for name in ["product", "contract", "csrf_token"] {
        let matches: Vec<_> = tags(body, "input")
            .into_iter()
            .filter(|tag| attribute(tag, "name").as_deref() == Some(name))
            .collect();
        assert_eq!(matches.len(), 1, "one native hidden field required");
        assert!(
            attribute(matches[0], "type").is_some_and(|value| value.eq_ignore_ascii_case("hidden"))
        );
        fields.push((
            name.to_owned(),
            attribute(matches[0], "value").expect("hidden value"),
        ));
    }
    assert!(fields[0].1 == PRODUCT && fields[1].1 == CONTRACT);
    assert!(canonical_token(&fields[2].1));
    fields
}

fn credentials(
    mut fields: Vec<(String, String)>,
    username: &str,
    password: &str,
    setup: Option<&str>,
) -> Vec<(String, String)> {
    fields.push(("username".into(), username.into()));
    fields.push(("password".into(), password.into()));
    if let Some(setup) = setup {
        fields.push(("setup_secret".into(), setup.into()));
    }
    fields
}

fn redirected(response: &Response, destination: &str) {
    assert_eq!(response.status(), StatusCode::SEE_OTHER);
    no_store(response);
    assert_eq!(
        response
            .headers()
            .get("location")
            .expect("fixed redirect location"),
        destination
    );
}

async fn claim(fixture: &Fixture, server: &Server, secret: &str) -> Actor {
    let mut actor = server.actor();
    let page = actor
        .page("/account/claim", StatusCode::OK, &[secret])
        .await;
    let fields = credentials(
        form_fields(&page, "/account/claim"),
        " Native_Owner ",
        OWNER_PASSWORD,
        Some(secret),
    );
    let response = actor.post("/account/claim", &fields).await;
    redirected(&response, "/account");
    assert!(
        actor
            .cookies
            .get(SESSION)
            .is_some_and(|value| canonical_token(value))
    );
    assert!(!actor.cookies.contains_key(FORM));
    let public = actor.api_session(StatusCode::OK).await;
    assert_eq!(public["account"]["username"], "native_owner");
    let mut connection = fixture.connect().await;
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM users WHERE role = 'owner'")
            .fetch_one(&mut connection)
            .await
            .expect("one claimed owner"),
        1
    );
    actor
}

fn private_account_document(page: &str) {
    assert!(
        !page.contains("native_owner") && !page.contains("native_member"),
        "HTML embedded private account identity"
    );
    for field in ["\"username\"", "\"account_id\"", "\"session_generation\""] {
        assert!(
            !page.contains(field),
            "HTML serialized private account state"
        );
    }
    for selector in [
        "data-account-page",
        "data-private-account",
        "data-account-name",
        "data-account-role",
        "data-account-status",
    ] {
        assert!(page.contains(selector), "account lifecycle hook missing");
    }
    for selector in ["data-account-name", "data-account-role"] {
        let start = page.find(selector).expect("empty identity hook");
        let tail = &page[start..];
        let tail = &tail[tail.find('>').expect("identity opening end") + 1..];
        assert!(
            tail[..tail.find('<').expect("identity closing tag")]
                .trim()
                .is_empty(),
            "private identity hook was populated before a probe"
        );
    }
    let marker = page
        .find("data-private-account")
        .expect("private identity panel");
    let opening = &page[..marker];
    let opening = &page[opening.rfind('<').expect("private panel opening") + 1..];
    let opening = &opening[..opening.find('>').expect("private panel tag end")];
    assert!(
        attribute(opening, "hidden").is_some(),
        "identity panel was initially visible"
    );
}

fn signed_expired_form(key: &[u8]) -> (String, String) {
    fn mac(key: &[u8], domain: &[u8], value: &str) -> String {
        let mut mac =
            <Hmac<Sha256> as KeyInit>::new_from_slice(key).expect("owned fixture HMAC key");
        mac.update(domain);
        mac.update(value.as_bytes());
        mac.finalize()
            .into_bytes()
            .iter()
            .map(|byte| format!("{byte:02x}"))
            .collect()
    }
    let issued = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("fixture clock")
        .as_secs()
        .saturating_sub(601);
    let unsigned = format!("v1.{issued}.{}", "a".repeat(64));
    let cookie = format!(
        "{unsigned}.{}",
        mac(key, b"reborn/form-cookie/v1\0", &unsigned)
    );
    let csrf = mac(key, b"reborn/form-csrf/v1\0", &cookie);
    (cookie, csrf)
}

#[tokio::test]
async fn native_claim_account_sign_out_and_exact_assets_use_their_own_transport() {
    let fixture = Fixture::new().await;
    let setup = fixture.prepare().await;
    let server = Server::start(&fixture, true).await;
    let mut actor = claim(&fixture, &server, &setup).await;
    let page = actor
        .page("/account", StatusCode::OK, &[&setup, OWNER_PASSWORD])
        .await;
    private_account_document(&page);
    let logout = form_fields(&page, "/account/sign-out");
    let _ = form_fields(&page, "/account/sign-out-all");
    let response = actor.send(actor.request(Method::HEAD, "/account")).await;
    assert_eq!(response.status(), StatusCode::OK);
    no_store(&response);
    page_csp(&response);
    assert!(
        response
            .bytes()
            .await
            .expect("empty account HEAD")
            .is_empty()
    );

    let mut assets = Vec::new();
    for tag in tags(&page, "link") {
        if attribute(tag, "rel").as_deref() == Some("stylesheet") {
            assets.push(attribute(tag, "href").expect("stylesheet URL"));
        }
    }
    for tag in tags(&page, "script") {
        assets.push(attribute(tag, "src").expect("only external account scripts"));
    }
    assert!(
        !assets.is_empty(),
        "account page did not reference compiled resources"
    );
    for asset in assets {
        assert!(asset.starts_with('/') && !asset.starts_with("//") && !asset.contains('?'));
        let response = actor.get(&asset).await;
        assert_eq!(response.status(), StatusCode::OK);
        let cache = response
            .headers()
            .get("cache-control")
            .expect("immutable exact asset cache")
            .to_str()
            .expect("ASCII cache header");
        assert!(
            cache.contains("immutable")
                && cache.contains("max-age=")
                && !cache.contains("no-store")
        );
        assert!(
            !response
                .headers()
                .get("content-type")
                .expect("asset media type")
                .to_str()
                .expect("ASCII asset type")
                .starts_with("text/html")
        );
    }
    let response = actor.get("/account/assets/not-an-actual-file.js").await;
    assert_eq!(response.status(), StatusCode::NOT_FOUND);
    no_store(&response);
    let response = actor
        .send(actor.request(Method::GET, "/api/auth/session"))
        .await;
    assert_eq!(response.status(), StatusCode::UPGRADE_REQUIRED);
    let response = actor.get("/api/health").await;
    let csp = response
        .headers()
        .get("content-security-policy")
        .expect("public API CSP")
        .to_str()
        .expect("ASCII API CSP");
    assert!(csp.contains("default-src 'none'"));
    assert!(!csp.contains("script-src 'self'") && !csp.contains("connect-src 'self'"));

    let response = actor.post("/account/sign-out", &logout).await;
    redirected(&response, "/account/sign-in");
    assert!(!actor.cookies.contains_key(SESSION));
    let response = actor.get("/account").await;
    redirected(&response, "/account/sign-in");
    server.private_logs(&[&setup, OWNER_PASSWORD]);
}

#[tokio::test]
async fn strict_native_decoding_and_admission_reject_before_owner_claim_effects() {
    let fixture = Fixture::new().await;
    let setup = fixture.prepare().await;
    let server = Server::start(&fixture, true).await;
    let mut actor = server.actor();
    for case in 0..19 {
        let page = actor
            .page("/account/claim", StatusCode::OK, &[&setup])
            .await;
        let mut fields = credentials(
            form_fields(&page, "/account/claim"),
            "native_owner",
            OWNER_PASSWORD,
            Some(&setup),
        );
        let mut origin = Some(ORIGIN);
        let mut media = "application/x-www-form-urlencoded";
        let mut duplicate_origin = false;
        let mut duplicate_media = false;
        let mut suffix = "";
        let expected = match case {
            0 => {
                fields.push(("product".into(), PRODUCT.into()));
                StatusCode::BAD_REQUEST
            }
            1 => {
                fields.push(("unknown_field".into(), "unused".into()));
                StatusCode::BAD_REQUEST
            }
            2 => {
                fields.push(("username".into(), "other_owner".into()));
                StatusCode::BAD_REQUEST
            }
            3 => {
                fields.retain(|(name, _)| name != "password");
                suffix = "&password=Native%GGinvalid%20password%20fixture";
                StatusCode::BAD_REQUEST
            }
            4 => {
                fields.retain(|(name, _)| name != "password");
                suffix = "&password=Native+invalid+fixture+password%";
                StatusCode::BAD_REQUEST
            }
            5 => {
                fields.retain(|(name, _)| name != "password");
                suffix = "&password=Native+fixture+invalid+password%FF";
                StatusCode::BAD_REQUEST
            }
            6 => {
                media = "application/json";
                StatusCode::BAD_REQUEST
            }
            7 => {
                duplicate_media = true;
                StatusCode::BAD_REQUEST
            }
            8 => {
                fields.retain(|(name, _)| name != "product");
                StatusCode::UPGRADE_REQUIRED
            }
            9 => {
                fields
                    .iter_mut()
                    .find(|(name, _)| name == "contract")
                    .expect("contract field")
                    .1 = "wrong-contract".into();
                StatusCode::UPGRADE_REQUIRED
            }
            10 => {
                origin = None;
                StatusCode::FORBIDDEN
            }
            11 => {
                origin = Some("https://untrusted.example");
                StatusCode::FORBIDDEN
            }
            12 => {
                duplicate_origin = true;
                StatusCode::FORBIDDEN
            }
            13 => {
                fields
                    .iter_mut()
                    .find(|(name, _)| name == "csrf_token")
                    .expect("CSRF field")
                    .1 = "0".repeat(64);
                StatusCode::FORBIDDEN
            }
            14 => {
                fields.push(("csrf_token".into(), "0".repeat(64)));
                StatusCode::BAD_REQUEST
            }
            15 => {
                fields
                    .iter_mut()
                    .find(|(name, _)| name == "password")
                    .expect("password field")
                    .1 = "a".repeat(14);
                StatusCode::BAD_REQUEST
            }
            16 => {
                suffix = "&pr%6Fduct=keida-hub-reborn";
                StatusCode::BAD_REQUEST
            }
            17 => {
                fields
                    .iter_mut()
                    .find(|(name, _)| name == "username")
                    .expect("username field")
                    .1 = "\"><img id=\"reborn-xss-probe\" src=x onerror=alert(1)>".into();
                StatusCode::BAD_REQUEST
            }
            18 => {
                fields.retain(|(name, _)| name != "csrf_token");
                StatusCode::FORBIDDEN
            }
            _ => unreachable!(),
        };
        let mut request = actor
            .request(Method::POST, "/account/claim")
            .header("Content-Type", media)
            .body(format!("{}{suffix}", encoded(&fields)));
        if let Some(origin) = origin {
            request = request.header("Origin", origin);
        }
        if duplicate_origin {
            request = request.header("Origin", ORIGIN);
        }
        if duplicate_media {
            request = request.header("Content-Type", media);
        }
        let response = actor.send(request).await;
        let rejection = html(response, expected, &[&setup, OWNER_PASSWORD]).await;
        assert!(
            !rejection.contains("<img id=\"reborn-xss-probe\""),
            "untrusted username became executable markup"
        );
    }
    let page = actor
        .page("/account/claim", StatusCode::OK, &[&setup])
        .await;
    let fields = credentials(
        form_fields(&page, "/account/claim"),
        "native_owner",
        OWNER_PASSWORD,
        Some(&setup),
    );
    let request = actor
        .request(Method::POST, "/account/claim")
        .header("Origin", ORIGIN)
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body("x".repeat(8193));
    let _ = html(
        actor.send(request).await,
        StatusCode::PAYLOAD_TOO_LARGE,
        &[&setup],
    )
    .await;
    let mut connection = fixture.connect().await;
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM users")
            .fetch_one(&mut connection)
            .await
            .expect("no owner from rejected forms"),
        0
    );
    // The latest rejection may replace the anonymous challenge; use a fresh document.
    let page = actor
        .page("/account/claim", StatusCode::OK, &[&setup])
        .await;
    let mut final_fields = credentials(
        form_fields(&page, "/account/claim"),
        "native_owner",
        OWNER_PASSWORD,
        Some(&setup),
    );
    assert_eq!(fields.len(), final_fields.len());
    let request = actor
        .request(Method::POST, "/account/claim")
        .header("Origin", ORIGIN)
        .header(
            "Content-Type",
            "application/x-www-form-urlencoded; charset=utf-8",
        )
        .body(encoded(&final_fields));
    let response = actor.send(request).await;
    redirected(&response, "/account");
    final_fields.clear();
    server.private_logs(&[&setup, OWNER_PASSWORD]);
}

#[tokio::test]
async fn private_preparation_expired_challenges_and_expired_sessions_have_deliberate_recovery() {
    let fixture = Fixture::new().await;
    let server = Server::start(&fixture, true).await;
    let mut actor = server.actor();
    let unavailable = actor
        .page("/account/claim", StatusCode::SERVICE_UNAVAILABLE, &[])
        .await;
    assert!(tags(&unavailable, "form").is_empty());
    let setup = fixture.prepare().await;
    let page = actor
        .page("/account/claim", StatusCode::OK, &[&setup])
        .await;
    let mut fields = credentials(
        form_fields(&page, "/account/claim"),
        "native_owner",
        OWNER_PASSWORD,
        Some(&setup),
    );
    let (expired_cookie, expired_csrf) =
        signed_expired_form(&fs::read(&fixture.key).expect("owned signing key"));
    actor.cookies.insert(FORM.into(), expired_cookie);
    fields
        .iter_mut()
        .find(|(name, _)| name == "csrf_token")
        .expect("CSRF field")
        .1 = expired_csrf;
    let rejected = html(
        actor.post("/account/claim", &fields).await,
        StatusCode::FORBIDDEN,
        &[&setup, OWNER_PASSWORD],
    )
    .await;
    let _ = form_fields(&rejected, "/account/claim");
    let mut connection = fixture.connect().await;
    sqlx::query("UPDATE auth_state SET setup_expires_at = 0 WHERE singleton = TRUE")
        .execute(&mut connection)
        .await
        .expect("expire owned setup fixture");
    let expired = actor
        .page("/account/claim", StatusCode::FORBIDDEN, &[&setup])
        .await;
    assert!(expired.contains("/account/sign-in"));
    let renewed = fixture.prepare().await;
    let mut actor = claim(&fixture, &server, &renewed).await;
    let owned = actor
        .page("/account/claim", StatusCode::CONFLICT, &[&setup, &renewed])
        .await;
    assert!(owned.contains("/account/sign-in"));
    let page = actor
        .page("/account", StatusCode::OK, &[&renewed, OWNER_PASSWORD])
        .await;
    let logout = form_fields(&page, "/account/sign-out");
    let mut stale_post = actor.clone();
    sqlx::query("UPDATE sessions SET created_at = floor(extract(epoch FROM clock_timestamp()))::BIGINT - 2, expires_at = floor(extract(epoch FROM clock_timestamp()))::BIGINT - 1")
        .execute(&mut connection).await.expect("expire only owned session fixtures");
    let response = actor.get("/account").await;
    redirected(&response, "/account/sign-in");
    assert!(!actor.cookies.contains_key(SESSION));
    let response = stale_post.post("/account/sign-out", &logout).await;
    redirected(&response, "/account/sign-in");
    assert!(!stale_post.cookies.contains_key(SESSION));
    server.private_logs(&[&setup, &renewed, OWNER_PASSWORD]);
}

#[tokio::test]
async fn failed_native_login_preserves_old_account_and_success_switches_only_the_presented_device()
{
    let fixture = Fixture::new().await;
    let setup = fixture.prepare().await;
    let server = Server::start(&fixture, true).await;
    let mut actor = claim(&fixture, &server, &setup).await;
    let mut old_device = actor.clone();
    let mut other_device = server.actor();
    let _ = other_device.api_login("native_owner", OWNER_PASSWORD).await;
    let snapshot = actor.api_session(StatusCode::OK).await;
    let request = actor
        .request(Method::POST, "/api/owner/members")
        .header("Origin", ORIGIN)
        .header("X-Reborn-Product", PRODUCT)
        .header("X-Reborn-Contract", "reborn-auth-v1")
        .header(
            "X-CSRF-Token",
            snapshot["csrf_token"].as_str().expect("owner API CSRF"),
        )
        .json(&json!({"username":"native_member","password":MEMBER_PASSWORD}));
    let response = actor.send(request).await;
    assert_eq!(response.status(), StatusCode::CREATED);
    let page = actor
        .page("/account/sign-in", StatusCode::OK, &[OWNER_PASSWORD])
        .await;
    let fields = credentials(
        form_fields(&page, "/account/sign-in"),
        "native_member",
        "incorrect native fixture password",
        None,
    );
    let rejected = html(
        actor.post("/account/sign-in", &fields).await,
        StatusCode::UNAUTHORIZED,
        &[
            OWNER_PASSWORD,
            MEMBER_PASSWORD,
            "incorrect native fixture password",
        ],
    )
    .await;
    let _ = form_fields(&rejected, "/account/sign-in");
    assert_eq!(
        actor.api_session(StatusCode::OK).await["account"]["username"],
        "native_owner"
    );
    let page = actor
        .page("/account/sign-in", StatusCode::OK, &[OWNER_PASSWORD])
        .await;
    let fields = credentials(
        form_fields(&page, "/account/sign-in"),
        "native_member",
        MEMBER_PASSWORD,
        None,
    );
    let response = actor
        .post("/account/sign-in?next=https://untrusted.example", &fields)
        .await;
    redirected(&response, "/account");
    assert_eq!(
        actor.api_session(StatusCode::OK).await["account"]["username"],
        "native_member"
    );
    assert_eq!(
        other_device.api_session(StatusCode::OK).await["account"]["username"],
        "native_owner"
    );
    let response = old_device.get("/account").await;
    redirected(&response, "/account/sign-in");
    assert!(!old_device.cookies.contains_key(SESSION));
    let page = actor
        .page(
            "/account",
            StatusCode::OK,
            &[OWNER_PASSWORD, MEMBER_PASSWORD],
        )
        .await;
    private_account_document(&page);
    let logout_all = form_fields(&page, "/account/sign-out-all");
    let response = actor.post("/account/sign-out-all", &logout_all).await;
    redirected(&response, "/account/sign-in");
    assert!(!actor.cookies.contains_key(SESSION));
    assert_eq!(
        other_device.api_session(StatusCode::OK).await["account"]["role"],
        "owner"
    );
    server.private_logs(&[&setup, OWNER_PASSWORD, MEMBER_PASSWORD]);
}

#[tokio::test]
async fn native_schema_fence_and_head_preserve_authority_until_matching_schema_returns() {
    let fixture = Fixture::new().await;
    let setup = fixture.prepare().await;
    let server = Server::start(&fixture, true).await;
    let mut actor = claim(&fixture, &server, &setup).await;
    let page = actor
        .page("/account/sign-in", StatusCode::OK, &[OWNER_PASSWORD])
        .await;
    let fields = credentials(
        form_fields(&page, "/account/sign-in"),
        "native_owner",
        OWNER_PASSWORD,
        None,
    );
    let mut connection = fixture.connect().await;
    let row = sqlx::query("SELECT (SELECT COUNT(*) FROM users) AS users,(SELECT COUNT(*) FROM sessions) AS sessions,generation,(SELECT COALESCE(SUM(attempts),0)::BIGINT FROM auth_throttles) AS attempts FROM users WHERE username='native_owner'")
        .fetch_one(&mut connection).await.expect("baseline owned auth state");
    let before = (
        row.get::<i64, _>("users"),
        row.get::<i64, _>("sessions"),
        row.get::<i64, _>("generation"),
        row.get::<i64, _>("attempts"),
    );
    sqlx::query("INSERT INTO _sqlx_migrations (version,description,success,checksum,execution_time) VALUES (999,'owned-native-page-future',TRUE,decode('00','hex'),0)")
        .execute(&mut connection).await.expect("stage only owned future-schema fixture");
    for path in ["/account", "/account/claim", "/account/sign-in"] {
        let page = actor
            .page(
                path,
                StatusCode::SERVICE_UNAVAILABLE,
                &[&setup, OWNER_PASSWORD],
            )
            .await;
        assert!(tags(&page, "form").is_empty());
        let response = actor.send(actor.request(Method::HEAD, path)).await;
        assert_eq!(response.status(), StatusCode::SERVICE_UNAVAILABLE);
        no_store(&response);
        page_csp(&response);
        assert!(
            response
                .bytes()
                .await
                .expect("empty schema-fenced HEAD")
                .is_empty()
        );
    }
    let _ = html(
        actor.post("/account/sign-in", &fields).await,
        StatusCode::SERVICE_UNAVAILABLE,
        &[OWNER_PASSWORD],
    )
    .await;
    let mut wrong_contract = fields.clone();
    wrong_contract
        .iter_mut()
        .find(|(name, _)| name == "contract")
        .expect("contract field")
        .1 = "obsolete-contract".into();
    let rejected = html(
        actor.post("/account/sign-in", &wrong_contract).await,
        StatusCode::UPGRADE_REQUIRED,
        &[OWNER_PASSWORD],
    )
    .await;
    assert!(tags(&rejected, "form").is_empty());
    let request = actor
        .request(Method::POST, "/account/sign-in")
        .header("Origin", "https://untrusted.example")
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(encoded(&fields));
    let rejected = html(
        actor.send(request).await,
        StatusCode::FORBIDDEN,
        &[OWNER_PASSWORD],
    )
    .await;
    assert!(tags(&rejected, "form").is_empty());
    let mut malformed = fields.clone();
    malformed.retain(|(name, _)| name != "password");
    let request = actor
        .request(Method::POST, "/account/sign-in")
        .header("Origin", ORIGIN)
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(format!(
            "{}&password=Native%GGinvalid+fixture+password",
            encoded(&malformed)
        ));
    let rejected = html(
        actor.send(request).await,
        StatusCode::BAD_REQUEST,
        &[OWNER_PASSWORD],
    )
    .await;
    assert!(tags(&rejected, "form").is_empty());
    let mut missing_csrf = fields.clone();
    missing_csrf.retain(|(name, _)| name != "csrf_token");
    let rejected = html(
        actor.post("/account/sign-in", &missing_csrf).await,
        StatusCode::SERVICE_UNAVAILABLE,
        &[OWNER_PASSWORD],
    )
    .await;
    assert!(tags(&rejected, "form").is_empty());
    let row = sqlx::query("SELECT (SELECT COUNT(*) FROM users) AS users,(SELECT COUNT(*) FROM sessions) AS sessions,generation,(SELECT COALESCE(SUM(attempts),0)::BIGINT FROM auth_throttles) AS attempts FROM users WHERE username='native_owner'")
        .fetch_one(&mut connection).await.expect("unchanged owned auth state");
    let after = (
        row.get::<i64, _>("users"),
        row.get::<i64, _>("sessions"),
        row.get::<i64, _>("generation"),
        row.get::<i64, _>("attempts"),
    );
    assert_eq!(before, after);
    sqlx::query("DELETE FROM _sqlx_migrations WHERE version = 999")
        .execute(&mut connection)
        .await
        .expect("remove only owned future-schema fixture");
    let page = actor
        .page("/account", StatusCode::OK, &[OWNER_PASSWORD])
        .await;
    private_account_document(&page);
    assert_eq!(
        actor.api_session(StatusCode::OK).await["account"]["username"],
        "native_owner"
    );
    let disabled = Server::start(&fixture, false).await;
    let mut visitor = disabled.actor();
    for path in ["/account", "/account/claim", "/account/sign-in"] {
        let response = visitor.get(path).await;
        assert_eq!(response.status(), StatusCode::NOT_FOUND);
        no_store(&response);
    }
    server.private_logs(&[&setup, OWNER_PASSWORD]);
}
