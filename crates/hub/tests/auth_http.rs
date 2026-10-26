use hmac::{Hmac, KeyInit, Mac};
use reqwest::{Client, Method, RequestBuilder, Response, StatusCode, Url};
use serde_json::{Value, json};
use sha2::{Digest, Sha256};
use sqlx::{Connection, PgConnection, Row};
use std::{
    fs::{self, DirBuilder, File},
    net::TcpListener,
    os::unix::fs::{DirBuilderExt, PermissionsExt},
    path::{Path, PathBuf},
    process::{Child, Command, Output, Stdio},
    sync::atomic::{AtomicU64, Ordering},
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};

const BINARY: &str = env!("CARGO_BIN_EXE_keida-hub-reborn");
const ORIGIN: &str = "https://reborn.example";
const PRODUCT: &str = "keida-hub-reborn";
const CONTRACT: &str = "reborn-auth-v1";
const FORM_COOKIE: &str = "__Host-keida-reborn-form";
const SESSION_COOKIE: &str = "__Host-keida-reborn-session";
const OWNER_PASSWORD: &str = "Owner fixture passphrase 91!";
const MEMBER_PASSWORD: &str = "Member fixture passphrase 73!";
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

fn valid_owned_name(name: &str) {
    assert!(name.starts_with("keida_reborn_test_") && name.len() <= 63);
    assert!(
        name.bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || byte == b'_')
    );
}

struct Fixture {
    admin_url: String,
    database_url: String,
    name: String,
    directory: PathBuf,
    key_file: PathBuf,
}

impl Fixture {
    async fn new() -> Self {
        let admin_url = std::env::var("REBORN_TEST_DATABASE_URL").expect(
            "REBORN_TEST_DATABASE_URL must name an explicitly provisioned local disposable PostgreSQL fixture; auth contracts never skip",
        );
        let mut parsed = Url::parse(&admin_url).expect("parse fixture administrator URL");
        assert!(matches!(parsed.scheme(), "postgres" | "postgresql"));
        assert!(matches!(
            parsed.host_str(),
            Some("127.0.0.1" | "localhost" | "[::1]" | "::1")
        ));
        let name = format!("keida_reborn_test_{}", unique());
        valid_owned_name(&name);
        let mut connection = PgConnection::connect(&admin_url)
            .await
            .expect("connect disposable fixture administrator");
        // Audited dynamic SQL: the identifier is generated here, is length-limited
        // and contains only ASCII alphanumerics/underscore. No external URL text is SQL.
        sqlx::raw_sql(sqlx::AssertSqlSafe(format!("CREATE DATABASE \"{name}\"")))
            .execute(&mut connection)
            .await
            .expect("create owned auth fixture database");
        parsed.set_path(&format!("/{name}"));
        let directory = std::env::temp_dir().join(format!("keida-reborn-auth-{}", unique()));
        assert!(directory.is_absolute());
        DirBuilder::new()
            .mode(0o700)
            .create(&directory)
            .expect("create private fixture directory");
        let key_file = directory.join("instance.key");
        let fixture = Self {
            admin_url,
            database_url: parsed.to_string(),
            name,
            directory,
            key_file,
        };
        let output = completed(
            fixture
                .command(&["migrate"], None)
                .spawn()
                .expect("start migrations"),
        )
        .await;
        assert!(output.status.success(), "explicit migration failed");
        fixture
    }

    fn command(&self, arguments: &[&str], key_file: Option<&Path>) -> Command {
        let mut command = Command::new(BINARY);
        command
            .args(arguments)
            .env("DATABASE_URL", &self.database_url)
            .env("REBORN_BIND", "127.0.0.1:8788")
            .env("REBORN_DB_MAX_CONNECTIONS", "5")
            .env("REBORN_PUBLIC_ORIGIN", ORIGIN)
            .env_remove("REBORN_INSTANCE_KEY_FILE")
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());
        if let Some(path) = key_file {
            command.env("REBORN_INSTANCE_KEY_FILE", path);
        }
        command
    }

    async fn init_key_at(&self, path: &Path) {
        let path_text = path.to_str().expect("ASCII fixture path");
        let output = completed(
            self.command(&["init-key", path_text], None)
                .spawn()
                .expect("start explicit private key creation"),
        )
        .await;
        assert!(output.status.success(), "private key creation failed");
        assert!(output.stdout.is_empty(), "key CLI wrote public output");
        assert!(
            output.stderr.is_empty(),
            "key CLI wrote diagnostics on success"
        );
        let metadata = fs::symlink_metadata(path).expect("private key metadata");
        assert!(metadata.is_file() && !metadata.file_type().is_symlink());
        assert_eq!(metadata.permissions().mode() & 0o777, 0o600);
        assert_eq!(fs::read(path).expect("read fixture key").len(), 32);
    }

    async fn init_key(&self) {
        self.init_key_at(&self.key_file).await;
    }

    async fn prepare_at(&self, path: &Path) -> Output {
        completed(
            self.command(
                &[
                    "prepare-owner",
                    path.to_str().expect("ASCII fixture setup path"),
                ],
                Some(&self.key_file),
            )
            .spawn()
            .expect("start private owner preparation"),
        )
        .await
    }

    async fn prepare(&self) -> String {
        let path = self.directory.join(format!("setup-{}.token", unique()));
        let output = self.prepare_at(&path).await;
        assert!(output.status.success(), "private owner preparation failed");
        assert!(
            output.stdout.is_empty(),
            "preparation CLI wrote public output"
        );
        assert!(
            output.stderr.is_empty(),
            "preparation CLI wrote diagnostics on success"
        );
        let metadata = fs::symlink_metadata(&path).expect("setup file metadata");
        assert!(metadata.is_file() && !metadata.file_type().is_symlink());
        assert_eq!(metadata.permissions().mode() & 0o777, 0o600);
        let contents = fs::read_to_string(path).expect("read private fixture setup token");
        assert_eq!(
            contents.len(),
            64,
            "setup file must contain exactly one canonical token"
        );
        let secret = contents;
        assert!(canonical_token(&secret));
        secret
    }

    async fn connect(&self) -> PgConnection {
        PgConnection::connect(&self.database_url)
            .await
            .expect("connect owned auth fixture")
    }
}

impl Drop for Fixture {
    fn drop(&mut self) {
        let name = self.name.clone();
        valid_owned_name(&name);
        let admin_url = self.admin_url.clone();
        let result = std::thread::spawn(move || {
            let runtime = tokio::runtime::Builder::new_current_thread().enable_all().build().map_err(|_| ())?;
            runtime.block_on(async move {
                let mut connection = PgConnection::connect(&admin_url).await.map_err(|_| ())?;
                sqlx::query("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()")
                    .bind(&name).execute(&mut connection).await.map_err(|_| ())?;
                // Same generated-identifier audit as creation; only this owned DB is removed.
                sqlx::raw_sql(sqlx::AssertSqlSafe(format!("DROP DATABASE \"{name}\"")))
                    .execute(&mut connection).await.map_err(|_| ())?;
                Ok::<(), ()>(())
            })
        }).join();
        if !matches!(result, Ok(Ok(()))) {
            eprintln!("owned auth fixture database cleanup failed");
        }
        if fs::remove_dir_all(&self.directory).is_err() {
            eprintln!("owned private auth fixture cleanup failed");
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
                panic!("fixture CLI exceeded bounded deadline");
            }
            std::thread::sleep(Duration::from_millis(10));
        }
    })
    .await
    .expect("fixture CLI waiter")
}

fn canonical_token(value: &str) -> bool {
    value.len() == 64
        && value
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

fn assert_private_text(text: &str, secrets: &[&str]) {
    assert!(!text.contains("$argon2"), "password hash escaped its store");
    assert!(
        !text.contains("postgresql://"),
        "database URL escaped its configuration"
    );
    for secret in secrets {
        assert!(!secret.is_empty());
        assert!(
            !text.contains(secret),
            "fixture credential escaped its intended boundary"
        );
        for prefix in ["__Host-keida-reborn-form=", "__Host-keida-reborn-session="] {
            if let Some(value) = secret.strip_prefix(prefix) {
                assert!(
                    !text.contains(value),
                    "raw fixture cookie escaped its intended boundary"
                );
            }
        }
    }
}

struct Server {
    child: Child,
    origin: String,
    client: Client,
    stdout: PathBuf,
    stderr: PathBuf,
}

impl Server {
    async fn start(fixture: &Fixture, key_file: Option<&Path>) -> Self {
        let port = TcpListener::bind(("127.0.0.1", 0))
            .expect("reserve auth fixture HTTP port")
            .local_addr()
            .expect("auth fixture socket address")
            .port();
        let stdout = fixture.directory.join(format!("stdout-{}", unique()));
        let stderr = fixture.directory.join(format!("stderr-{}", unique()));
        let mut invocation = fixture.command(&["serve"], key_file);
        invocation
            .env("REBORN_BIND", format!("127.0.0.1:{port}"))
            .stdout(Stdio::from(
                File::create_new(&stdout).expect("private stdout capture"),
            ))
            .stderr(Stdio::from(
                File::create_new(&stderr).expect("private stderr capture"),
            ));
        let mut server = Self {
            child: invocation.spawn().expect("start auth HTTP fixture"),
            origin: format!("http://127.0.0.1:{port}"),
            client: Client::builder()
                .timeout(Duration::from_secs(4))
                .redirect(reqwest::redirect::Policy::none())
                .build()
                .expect("auth fixture HTTP client"),
            stdout,
            stderr,
        };
        let deadline = Instant::now() + Duration::from_secs(5);
        loop {
            if let Ok(response) = server.client.get(server.url("/api/health")).send().await {
                assert_eq!(response.status(), StatusCode::OK);
                return server;
            }
            assert!(
                server
                    .child
                    .try_wait()
                    .expect("inspect auth fixture server")
                    .is_none(),
                "auth fixture exited before listening"
            );
            assert!(
                Instant::now() < deadline,
                "auth fixture listener deadline exceeded"
            );
            tokio::time::sleep(Duration::from_millis(20)).await;
        }
    }

    fn url(&self, path: &str) -> String {
        format!("{}{path}", self.origin)
    }

    fn admitted(&self, method: Method, path: &str) -> RequestBuilder {
        let request = self
            .client
            .request(method.clone(), self.url(path))
            .header("X-Reborn-Product", PRODUCT)
            .header("X-Reborn-Contract", CONTRACT);
        if method == Method::POST {
            request.header("Origin", ORIGIN)
        } else {
            request
        }
    }

    async fn form(&self, setup_available: bool) -> Form {
        let response = self
            .client
            .get(self.url("/api/auth/form"))
            .send()
            .await
            .expect("anonymous form response");
        assert_eq!(response.status(), StatusCode::OK);
        assert_no_store(&response);
        let cookie = cookie(&response, FORM_COOKIE, true);
        let value: Value = response.json().await.expect("anonymous form JSON");
        assert_eq!(value["contract"], CONTRACT);
        assert_eq!(value["setup_available"], setup_available);
        assert_eq!(value.as_object().expect("form object").len(), 3);
        let csrf = value["csrf_token"]
            .as_str()
            .expect("anonymous CSRF token")
            .to_owned();
        assert!(canonical_token(&csrf));
        Form { cookie, csrf }
    }

    async fn claim(&self, form: &Form, secret: &str, username: &str, password: &str) -> Response {
        self.admitted(Method::POST, "/api/auth/claim")
            .header("Cookie", &form.cookie)
            .header("X-CSRF-Token", &form.csrf)
            .json(&json!({"setup_secret":secret,"username":username,"password":password}))
            .send()
            .await
            .expect("claim response")
    }

    async fn login_response(&self, username: &str, password: &str) -> Response {
        let form = self.form(false).await;
        self.admitted(Method::POST, "/api/auth/login")
            .header("Cookie", &form.cookie)
            .header("X-CSRF-Token", &form.csrf)
            .json(&json!({"username":username,"password":password}))
            .send()
            .await
            .expect("login response")
    }

    async fn login(&self, username: &str, password: &str) -> Session {
        Session::from_response(
            self.login_response(username, password).await,
            StatusCode::OK,
        )
        .await
    }

    fn authorized(&self, method: Method, path: &str, session: &Session) -> RequestBuilder {
        self.admitted(method, path)
            .header("Cookie", &session.cookie)
            .header("X-CSRF-Token", &session.csrf)
    }

    async fn session_status(&self, session: &Session, status: StatusCode) -> Response {
        let response = self
            .authorized(Method::GET, "/api/auth/session", session)
            .send()
            .await
            .expect("session response");
        assert_eq!(response.status(), status);
        assert_no_store(&response);
        response
    }

    fn assert_logs_private(&self, secrets: &[&str]) {
        for path in [&self.stdout, &self.stderr] {
            let text = fs::read_to_string(path).expect("read private output capture");
            assert_private_text(&text, secrets);
        }
    }
}

impl Drop for Server {
    fn drop(&mut self) {
        let _ = self.child.kill();
        let _ = self.child.wait();
    }
}

fn assert_no_store(response: &Response) {
    assert_eq!(
        response
            .headers()
            .get("cache-control")
            .expect("auth no-store header"),
        "no-store"
    );
}

fn cookie(response: &Response, name: &str, fresh: bool) -> String {
    let prefix = format!("{name}=");
    let headers: Vec<_> = response
        .headers()
        .get_all("set-cookie")
        .iter()
        .map(|value| value.to_str().expect("ASCII Set-Cookie"))
        .filter(|value| value.starts_with(&prefix))
        .collect();
    assert_eq!(headers.len(), 1, "expected one relevant Set-Cookie");
    let raw = headers[0];
    let attributes: Vec<_> = raw.split(';').map(str::trim).collect();
    assert!(
        attributes
            .iter()
            .any(|value| value.eq_ignore_ascii_case("Secure"))
    );
    assert!(
        attributes
            .iter()
            .any(|value| value.eq_ignore_ascii_case("HttpOnly"))
    );
    assert!(
        attributes
            .iter()
            .any(|value| value.eq_ignore_ascii_case("SameSite=Strict"))
    );
    assert!(
        attributes
            .iter()
            .any(|value| value.eq_ignore_ascii_case("Path=/"))
    );
    assert!(
        !attributes
            .iter()
            .any(|value| value.to_ascii_lowercase().starts_with("domain="))
    );
    let pair = attributes[0].to_owned();
    if fresh {
        let value = pair.strip_prefix(&prefix).expect("relevant cookie prefix");
        assert!(!value.is_empty());
        if name == SESSION_COOKIE {
            assert!(canonical_token(value));
        }
    } else {
        assert!(
            attributes
                .iter()
                .any(|value| value.eq_ignore_ascii_case("Max-Age=0")),
            "logout omitted cookie expiry"
        );
    }
    pair
}

struct Form {
    cookie: String,
    csrf: String,
}

struct Session {
    cookie: String,
    csrf: String,
    account: Value,
}

impl Session {
    async fn from_response(response: Response, status: StatusCode) -> Self {
        assert_eq!(response.status(), status);
        assert_no_store(&response);
        let session_cookie = cookie(&response, SESSION_COOKIE, true);
        let _ = cookie(&response, FORM_COOKIE, false);
        let body = response
            .text()
            .await
            .expect("successful authentication body");
        assert_private_text(&body, &[OWNER_PASSWORD, MEMBER_PASSWORD, &session_cookie]);
        let value: Value = serde_json::from_str(&body).expect("successful authentication JSON");
        assert_eq!(value.as_object().expect("authentication object").len(), 2);
        let account = value["account"].clone();
        let id = account["id"].as_str().expect("decimal-string account ID");
        assert!(!id.is_empty() && id.bytes().all(|byte| byte.is_ascii_digit()));
        assert!(matches!(account["role"].as_str(), Some("owner" | "member")));
        assert_eq!(account.as_object().expect("public account object").len(), 3);
        let csrf = value["csrf_token"]
            .as_str()
            .expect("authenticated CSRF token")
            .to_owned();
        assert!(canonical_token(&csrf));
        Self {
            cookie: session_cookie,
            csrf,
            account,
        }
    }
}

async fn claimed(fixture: &Fixture) -> (Server, Session, String) {
    fixture.init_key().await;
    let secret = fixture.prepare().await;
    let server = Server::start(fixture, Some(&fixture.key_file)).await;
    let form = server.form(true).await;
    let session = Session::from_response(
        server
            .claim(&form, &secret, "  Keida_Owner  ", OWNER_PASSWORD)
            .await,
        StatusCode::CREATED,
    )
    .await;
    assert_eq!(session.account["username"], "keida_owner");
    assert_eq!(session.account["role"], "owner");
    (server, session, secret)
}

async fn error(response: Response, expected: StatusCode, secrets: &[&str]) -> Value {
    assert_eq!(response.status(), expected);
    assert_no_store(&response);
    let body = response.text().await.expect("sanitized rejection body");
    assert_private_text(&body, secrets);
    let value: Value = serde_json::from_str(&body).expect("sanitized rejection JSON");
    assert_eq!(value.as_object().expect("rejection object").len(), 1);
    assert!(value["error"].is_string());
    value
}

fn lowercase_hex(bytes: &[u8]) -> String {
    bytes.iter().map(|byte| format!("{byte:02x}")).collect()
}

fn protocol_mac(key: &[u8], domain: &[u8], value: &str) -> String {
    let mut mac = <Hmac<Sha256> as KeyInit>::new_from_slice(key).expect("fixture MAC key");
    mac.update(domain);
    mac.update(value.as_bytes());
    lowercase_hex(&mac.finalize().into_bytes())
}

fn signed_form_at(key: &[u8], issued: u64) -> Form {
    // Independently constructed from the frozen wire contract, not a production helper.
    let unsigned = format!("v1.{issued}.{}", "a".repeat(64));
    let signature = protocol_mac(key, b"reborn/form-cookie/v1\0", &unsigned);
    let value = format!("{unsigned}.{signature}");
    Form {
        csrf: protocol_mac(key, b"reborn/form-csrf/v1\0", &value),
        cookie: format!("{FORM_COOKIE}={value}"),
    }
}

async fn reset_fixture_throttle_windows(fixture: &Fixture) {
    let mut connection = fixture.connect().await;
    sqlx::query("UPDATE auth_throttles SET window_start = 0, attempts = 0")
        .execute(&mut connection)
        .await
        .expect("expire owned fixture throttle windows");
}

#[tokio::test]
async fn private_cli_key_files_never_overwrite_and_binding_refuses_a_different_key() {
    let fixture = Fixture::new().await;
    let absent = Server::start(&fixture, None).await;
    assert_eq!(
        absent
            .client
            .get(absent.url("/api/auth/form"))
            .send()
            .await
            .expect("disabled auth response")
            .status(),
        StatusCode::NOT_FOUND
    );
    drop(absent);
    fixture.init_key().await;
    let original = fs::read(&fixture.key_file).expect("read original fixture key");
    let output = completed(
        fixture
            .command(
                &["init-key", fixture.key_file.to_str().expect("key path")],
                None,
            )
            .spawn()
            .expect("repeat init-key"),
    )
    .await;
    assert_eq!(output.status.code(), Some(2));
    assert!(
        fs::read(&fixture.key_file).expect("read preserved fixture key") == original,
        "init-key replaced an existing key"
    );
    let server = Server::start(&fixture, Some(&fixture.key_file)).await;
    error(
        server
            .client
            .get(server.url("/api/auth/form"))
            .send()
            .await
            .expect("unbound auth response"),
        StatusCode::SERVICE_UNAVAILABLE,
        &[],
    )
    .await;
    let setup = fixture.prepare().await;
    let _ = server.form(true).await;
    let conflict = fixture
        .prepare_at(&fixture.directory.join("active-conflict.token"))
        .await;
    assert_eq!(conflict.status.code(), Some(2));
    assert_private_text(&String::from_utf8_lossy(&conflict.stderr), &[&setup]);

    let other_key = fixture.directory.join("other-instance.key");
    fixture.init_key_at(&other_key).await;
    let mismatched = Server::start(&fixture, Some(&other_key)).await;
    error(
        mismatched
            .client
            .get(mismatched.url("/api/auth/form"))
            .send()
            .await
            .expect("mismatched key response"),
        StatusCode::SERVICE_UNAVAILABLE,
        &[&setup],
    )
    .await;
    assert_eq!(
        mismatched
            .client
            .get(mismatched.url("/api/health"))
            .send()
            .await
            .expect("mismatched key liveness")
            .status(),
        StatusCode::OK
    );

    let malformed = fixture.directory.join("malformed.key");
    fs::write(&malformed, b"fixture-malformed-key").expect("malformed private key fixture");
    fs::set_permissions(&malformed, fs::Permissions::from_mode(0o600))
        .expect("private malformed key permissions");
    let unsafe_key = fixture.directory.join("unsafe.key");
    fs::write(&unsafe_key, &original).expect("unsafe key fixture");
    fs::set_permissions(&unsafe_key, fs::Permissions::from_mode(0o644))
        .expect("unsafe key permissions fixture");
    for path in [
        &malformed,
        &unsafe_key,
        &fixture.directory.join("missing.key"),
    ] {
        let output = completed(
            fixture
                .command(&["serve"], Some(path))
                .spawn()
                .expect("start invalid key fixture"),
        )
        .await;
        assert_eq!(output.status.code(), Some(2));
        assert!(output.stdout.is_empty());
        let diagnostics = String::from_utf8_lossy(&output.stderr);
        assert_private_text(
            &diagnostics,
            &[
                &setup,
                "fixture-malformed-key",
                path.to_str().expect("private path"),
            ],
        );
    }
    server.assert_logs_private(&[&setup]);
    mismatched.assert_logs_private(&[&setup]);
}

#[tokio::test]
async fn concurrent_claims_create_one_owner_and_login_persists_across_restart() {
    let fixture = Fixture::new().await;
    fixture.init_key().await;
    let secret = fixture.prepare().await;
    let server = Server::start(&fixture, Some(&fixture.key_file)).await;
    let first_form = server.form(true).await;
    let second_form = server.form(true).await;
    let (first, second) = tokio::join!(
        server.claim(&first_form, &secret, "first_owner", OWNER_PASSWORD),
        server.claim(&second_form, &secret, "second_owner", OWNER_PASSWORD),
    );
    let (winner, loser, username) = if first.status() == StatusCode::CREATED {
        (first, second, "first_owner")
    } else {
        (second, first, "second_owner")
    };
    let session = Session::from_response(winner, StatusCode::CREATED).await;
    error(loser, StatusCode::CONFLICT, &[&secret, OWNER_PASSWORD]).await;
    assert_eq!(session.account["username"], username);
    let form = server.form(false).await;
    error(
        server
            .claim(&form, &secret, "third_owner", OWNER_PASSWORD)
            .await,
        StatusCode::CONFLICT,
        &[&secret, OWNER_PASSWORD],
    )
    .await;
    let conflict = fixture
        .prepare_at(&fixture.directory.join("cannot-reset-owner.token"))
        .await;
    assert_eq!(conflict.status.code(), Some(2));
    let wrong = error(
        server
            .login_response(username, "incorrect fixture password")
            .await,
        StatusCode::UNAUTHORIZED,
        &[OWNER_PASSWORD],
    )
    .await;
    let unknown = error(
        server
            .login_response("unknown_user", "incorrect fixture password")
            .await,
        StatusCode::UNAUTHORIZED,
        &[OWNER_PASSWORD],
    )
    .await;
    assert!(
        wrong == unknown,
        "known and unknown login failures have different public shapes"
    );
    server.assert_logs_private(&[&secret, OWNER_PASSWORD, &session.cookie]);
    drop(server);
    let restarted = Server::start(&fixture, Some(&fixture.key_file)).await;
    let response = restarted.session_status(&session, StatusCode::OK).await;
    let body: Value = response.json().await.expect("restored session JSON");
    assert_eq!(body["account"], session.account);
    let generation = body["session_generation"]
        .as_str()
        .expect("decimal-string session generation");
    assert!(!generation.is_empty() && generation.bytes().all(|byte| byte.is_ascii_digit()));
    let new_session = restarted.login(username, OWNER_PASSWORD).await;
    assert!(
        new_session.cookie != session.cookie,
        "login reused an opaque session token"
    );
    assert!(
        new_session.csrf != session.csrf,
        "login reused session CSRF"
    );
    restarted.assert_logs_private(&[
        &secret,
        OWNER_PASSWORD,
        &session.cookie,
        &new_session.cookie,
    ]);
}

#[tokio::test]
async fn contract_origin_csrf_cookie_and_body_rejections_precede_claim_effects() {
    let fixture = Fixture::new().await;
    fixture.init_key().await;
    let secret = fixture.prepare().await;
    let server = Server::start(&fixture, Some(&fixture.key_file)).await;
    let form = server.form(true).await;
    let other_form = server.form(true).await;
    for case in 0..17 {
        let mut request = server.admitted(Method::POST, "/api/auth/claim")
            .header("Cookie", &form.cookie)
            .header("X-CSRF-Token", &form.csrf)
            .json(&json!({"setup_secret":secret,"username":"admitted_owner","password":OWNER_PASSWORD}))
            .build().expect("build rejected claim fixture");
        let headers = request.headers_mut();
        let expected = match case {
            0 => {
                headers.remove("X-Reborn-Product");
                StatusCode::UPGRADE_REQUIRED
            }
            1 => {
                headers.insert(
                    "X-Reborn-Product",
                    "another-product".parse().expect("header"),
                );
                StatusCode::UPGRADE_REQUIRED
            }
            2 => {
                headers.append("X-Reborn-Product", PRODUCT.parse().expect("header"));
                StatusCode::UPGRADE_REQUIRED
            }
            3 => {
                headers.remove("X-Reborn-Contract");
                StatusCode::UPGRADE_REQUIRED
            }
            4 => {
                headers.insert(
                    "X-Reborn-Contract",
                    "another-contract".parse().expect("header"),
                );
                StatusCode::UPGRADE_REQUIRED
            }
            5 => {
                headers.append("X-Reborn-Contract", CONTRACT.parse().expect("header"));
                StatusCode::UPGRADE_REQUIRED
            }
            6 => {
                headers.remove("Origin");
                StatusCode::FORBIDDEN
            }
            7 => {
                headers.insert(
                    "Origin",
                    "https://untrusted.example".parse().expect("header"),
                );
                StatusCode::FORBIDDEN
            }
            8 => {
                headers.insert("Origin", "null".parse().expect("header"));
                StatusCode::FORBIDDEN
            }
            9 => {
                headers.append("Origin", ORIGIN.parse().expect("header"));
                StatusCode::FORBIDDEN
            }
            10 => {
                headers.remove("X-CSRF-Token");
                StatusCode::FORBIDDEN
            }
            11 => {
                headers.insert("X-CSRF-Token", other_form.csrf.parse().expect("header"));
                StatusCode::FORBIDDEN
            }
            12 => {
                headers.append("X-CSRF-Token", form.csrf.parse().expect("header"));
                StatusCode::FORBIDDEN
            }
            13 => {
                headers.remove("Cookie");
                StatusCode::FORBIDDEN
            }
            14 => {
                headers.insert(
                    "Cookie",
                    format!("{}; {}", form.cookie, form.cookie)
                        .parse()
                        .expect("header"),
                );
                StatusCode::FORBIDDEN
            }
            15 => {
                headers.append("Cookie", form.cookie.parse().expect("header"));
                StatusCode::FORBIDDEN
            }
            16 => {
                headers.insert(
                    "Cookie",
                    format!("{FORM_COOKIE}=not-canonical")
                        .parse()
                        .expect("header"),
                );
                StatusCode::FORBIDDEN
            }
            _ => unreachable!(),
        };
        error(
            server
                .client
                .execute(request)
                .await
                .expect("rejected claim response"),
            expected,
            &[&secret, OWNER_PASSWORD, &form.cookie],
        )
        .await;
    }
    let unknown_field = server.admitted(Method::POST, "/api/auth/claim")
        .header("Cookie", &form.cookie).header("X-CSRF-Token", &form.csrf)
        .json(&json!({"setup_secret":secret,"username":"admitted_owner","password":OWNER_PASSWORD,"role":"owner"}))
        .send().await.expect("unknown-field response");
    error(
        unknown_field,
        StatusCode::BAD_REQUEST,
        &[&secret, OWNER_PASSWORD],
    )
    .await;
    let oversized = server
        .admitted(Method::POST, "/api/auth/claim")
        .header("Cookie", &form.cookie)
        .header("X-CSRF-Token", &form.csrf)
        .header("Content-Type", "application/json")
        .body(" ".repeat(8193))
        .send()
        .await
        .expect("oversized-body response");
    error(oversized, StatusCode::PAYLOAD_TOO_LARGE, &[&secret]).await;
    let mut connection = fixture.connect().await;
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM users")
            .fetch_one(&mut connection)
            .await
            .expect("count pre-admission accounts"),
        0
    );
    let accepted = server
        .admitted(Method::POST, "/api/auth/claim")
        .header(
            "Cookie",
            format!("unrelated_preference=ok; {}", form.cookie),
        )
        .header("X-CSRF-Token", &form.csrf)
        .json(&json!({"setup_secret":secret,"username":"admitted_owner","password":OWNER_PASSWORD}))
        .send()
        .await
        .expect("properly admitted claim");
    let owner = Session::from_response(accepted, StatusCode::CREATED).await;
    let response = server
        .client
        .get(server.url("/api/auth/session"))
        .header("Cookie", &owner.cookie)
        .send()
        .await
        .expect("unqualified protected GET");
    error(response, StatusCode::UPGRADE_REQUIRED, &[&owner.cookie]).await;
    for cookie_value in [
        format!("{}; {}", owner.cookie, owner.cookie),
        format!("{SESSION_COOKIE}={}", "A".repeat(64)),
    ] {
        let response = server
            .admitted(Method::GET, "/api/auth/session")
            .header("Cookie", cookie_value)
            .send()
            .await
            .expect("ambiguous session response");
        error(response, StatusCode::UNAUTHORIZED, &[&owner.cookie]).await;
    }
    let response = server
        .admitted(Method::GET, "/api/auth/session")
        .header("Cookie", &owner.cookie)
        .header("Cookie", &owner.cookie)
        .send()
        .await
        .expect("multiple Cookie header response");
    error(response, StatusCode::UNAUTHORIZED, &[&owner.cookie]).await;
    let _ = server.session_status(&owner, StatusCode::OK).await;
    server.assert_logs_private(&[&secret, OWNER_PASSWORD, &owner.cookie, &form.cookie]);
}

#[tokio::test]
async fn owner_member_boundaries_logout_disable_and_generation_revocation_are_durable() {
    let fixture = Fixture::new().await;
    let (server, owner, setup) = claimed(&fixture).await;
    let extra_owner_session = server.login("KEIDA_OWNER", OWNER_PASSWORD).await;
    let response = server
        .authorized(Method::POST, "/api/owner/members", &owner)
        .json(&json!({"username":"  Friend_User  ","password":MEMBER_PASSWORD}))
        .send()
        .await
        .expect("create member response");
    assert_eq!(response.status(), StatusCode::CREATED);
    assert_no_store(&response);
    let body = response.text().await.expect("public member result");
    assert_private_text(&body, &[OWNER_PASSWORD, MEMBER_PASSWORD, &owner.cookie]);
    let created: Value = serde_json::from_str(&body).expect("created member JSON");
    assert_eq!(created.as_object().expect("member result object").len(), 1);
    assert_eq!(created["account"]["username"], "friend_user");
    assert_eq!(created["account"]["role"], "member");
    let member_id = created["account"]["id"]
        .as_str()
        .expect("member ID")
        .to_owned();
    assert!(member_id.bytes().all(|byte| byte.is_ascii_digit()));
    let member = server.login("friend_user", MEMBER_PASSWORD).await;
    assert_eq!(member.account, created["account"]);

    let response = server
        .authorized(Method::GET, "/api/owner/members", &owner)
        .send()
        .await
        .expect("owner member listing");
    assert_eq!(response.status(), StatusCode::OK);
    let listed: Value = response.json().await.expect("member listing JSON");
    assert_eq!(listed["truncated"], false);
    assert!(
        listed["members"]
            .as_array()
            .expect("public member rows")
            .iter()
            .any(|row| row == &member.account)
    );
    for (method, path) in [
        (Method::GET, "/api/owner/members".to_owned()),
        (Method::POST, "/api/owner/members".to_owned()),
        (
            Method::POST,
            format!("/api/owner/members/{member_id}/revoke"),
        ),
    ] {
        let response = server
            .authorized(method, &path, &member)
            .json(&json!({"username":"unauthorized_friend","password":MEMBER_PASSWORD}))
            .send()
            .await
            .expect("member authorization denial");
        error(
            response,
            StatusCode::FORBIDDEN,
            &[MEMBER_PASSWORD, &member.cookie],
        )
        .await;
    }
    let response = server
        .authorized(Method::POST, "/api/owner/members", &owner)
        .json(&json!({"username":"friend_user","password":MEMBER_PASSWORD}))
        .send()
        .await
        .expect("duplicate member response");
    error(response, StatusCode::CONFLICT, &[MEMBER_PASSWORD]).await;
    let response = server
        .authorized(Method::POST, "/api/owner/members", &owner)
        .json(&json!({"username":"cannot_promote","password":MEMBER_PASSWORD,"role":"owner"}))
        .send()
        .await
        .expect("unsupported promotion response");
    error(response, StatusCode::BAD_REQUEST, &[MEMBER_PASSWORD]).await;

    let response = server
        .admitted(Method::POST, "/api/auth/logout")
        .header("Cookie", &owner.cookie)
        .header("X-CSRF-Token", &extra_owner_session.csrf)
        .send()
        .await
        .expect("cross-session CSRF response");
    error(response, StatusCode::FORBIDDEN, &[&owner.cookie]).await;
    let _ = server.session_status(&owner, StatusCode::OK).await;

    let response = server
        .authorized(Method::POST, "/api/auth/logout", &member)
        .send()
        .await
        .expect("member logout");
    assert_eq!(response.status(), StatusCode::NO_CONTENT);
    let _ = cookie(&response, SESSION_COOKIE, false);
    let _ = server
        .session_status(&member, StatusCode::UNAUTHORIZED)
        .await;
    let member_again = server.login("friend_user", MEMBER_PASSWORD).await;
    let revoke_path = format!("/api/owner/members/{member_id}/revoke");
    for _ in 0..2 {
        let response = server
            .authorized(Method::POST, &revoke_path, &owner)
            .send()
            .await
            .expect("owner disables member");
        assert_eq!(response.status(), StatusCode::NO_CONTENT);
    }
    let _ = server
        .session_status(&member_again, StatusCode::UNAUTHORIZED)
        .await;
    let disabled = error(
        server.login_response("friend_user", MEMBER_PASSWORD).await,
        StatusCode::UNAUTHORIZED,
        &[MEMBER_PASSWORD],
    )
    .await;
    let unknown = error(
        server
            .login_response("unknown_friend", MEMBER_PASSWORD)
            .await,
        StatusCode::UNAUTHORIZED,
        &[MEMBER_PASSWORD],
    )
    .await;
    assert!(
        disabled == unknown,
        "disabled account disclosed a distinct failure"
    );
    let response = server
        .authorized(Method::POST, "/api/auth/revoke-all", &owner)
        .send()
        .await
        .expect("revoke account generation");
    assert_eq!(response.status(), StatusCode::NO_CONTENT);
    let _ = cookie(&response, SESSION_COOKIE, false);
    let _ = server
        .session_status(&owner, StatusCode::UNAUTHORIZED)
        .await;
    let _ = server
        .session_status(&extra_owner_session, StatusCode::UNAUTHORIZED)
        .await;
    let recovered = server.login("keida_owner", OWNER_PASSWORD).await;
    let _ = server.session_status(&recovered, StatusCode::OK).await;
    let other_device = server.login("keida_owner", OWNER_PASSWORD).await;
    let response = server
        .authorized(Method::POST, "/api/owner/members", &recovered)
        .json(&json!({"username":"switch_friend","password":MEMBER_PASSWORD}))
        .send()
        .await
        .expect("create account-switch member");
    assert_eq!(response.status(), StatusCode::CREATED);
    let switch_form = server.form(false).await;
    let response = server
        .admitted(Method::POST, "/api/auth/login")
        .header(
            "Cookie",
            format!("{}; {}", switch_form.cookie, recovered.cookie),
        )
        .header("X-CSRF-Token", &switch_form.csrf)
        .json(&json!({"username":"switch_friend","password":"incorrect fixture password"}))
        .send()
        .await
        .expect("failed account-switch login");
    error(
        response,
        StatusCode::UNAUTHORIZED,
        &[&recovered.cookie, MEMBER_PASSWORD],
    )
    .await;
    let _ = server.session_status(&recovered, StatusCode::OK).await;
    let switch_form = server.form(false).await;
    let response = server
        .admitted(Method::POST, "/api/auth/login")
        .header(
            "Cookie",
            format!("{}; {}", switch_form.cookie, recovered.cookie),
        )
        .header("X-CSRF-Token", &switch_form.csrf)
        .json(&json!({"username":"switch_friend","password":MEMBER_PASSWORD}))
        .send()
        .await
        .expect("successful account-switch login");
    let switched = Session::from_response(response, StatusCode::OK).await;
    assert_eq!(switched.account["username"], "switch_friend");
    let _ = server.session_status(&switched, StatusCode::OK).await;
    let _ = server
        .session_status(&recovered, StatusCode::UNAUTHORIZED)
        .await;
    let _ = server.session_status(&other_device, StatusCode::OK).await;
    let response = server
        .authorized(Method::GET, "/api/owner/members", &switched)
        .send()
        .await
        .expect("switched member authorization");
    error(response, StatusCode::FORBIDDEN, &[&switched.cookie]).await;
    let mut connection = fixture.connect().await;
    let generation: i64 =
        sqlx::query_scalar("SELECT generation FROM users WHERE username = 'keida_owner'")
            .fetch_one(&mut connection)
            .await
            .expect("read durable generation");
    assert!(generation > 0);
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM users WHERE role = 'owner'")
            .fetch_one(&mut connection)
            .await
            .expect("owner uniqueness"),
        1
    );
    server.assert_logs_private(&[
        &setup,
        OWNER_PASSWORD,
        MEMBER_PASSWORD,
        &owner.cookie,
        &member.cookie,
    ]);
    drop(server);
    let restarted = Server::start(&fixture, Some(&fixture.key_file)).await;
    let _ = restarted
        .session_status(&other_device, StatusCode::OK)
        .await;
    let _ = restarted.session_status(&switched, StatusCode::OK).await;
    let _ = restarted
        .session_status(&recovered, StatusCode::UNAUTHORIZED)
        .await;
    let _ = restarted
        .session_status(&owner, StatusCode::UNAUTHORIZED)
        .await;
}

#[tokio::test]
async fn signed_form_expiry_at_rest_verifiers_and_session_expiry_fail_closed() {
    let fixture = Fixture::new().await;
    fixture.init_key().await;
    let secret = fixture.prepare().await;
    let key = fs::read(&fixture.key_file).expect("read owned fixture signing key");
    let mut connection = fixture.connect().await;
    let preparation =
        sqlx::query("SELECT setup_hash, key_id FROM auth_state WHERE singleton = TRUE")
            .fetch_one(&mut connection)
            .await
            .expect("read private preparation verifiers");
    let setup_hash: Vec<u8> = preparation.get("setup_hash");
    let key_id: Vec<u8> = preparation.get("key_id");
    assert!(
        setup_hash.as_slice() == Sha256::digest(secret.as_bytes()).as_slice(),
        "setup verifier is not the frozen ASCII-token digest"
    );
    assert!(setup_hash.len() == 32 && key_id.len() == 32);
    assert!(
        key_id != key,
        "key binding stored the reusable instance key"
    );
    let server = Server::start(&fixture, Some(&fixture.key_file)).await;
    let now = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("fixture clock")
        .as_secs();
    for issued in [now.saturating_sub(601), now + 60] {
        let expired_or_future = signed_form_at(&key, issued);
        error(
            server
                .claim(
                    &expired_or_future,
                    &secret,
                    "time_checked_owner",
                    OWNER_PASSWORD,
                )
                .await,
            StatusCode::FORBIDDEN,
            &[&secret, OWNER_PASSWORD, &expired_or_future.cookie],
        )
        .await;
    }
    let fresh = server.form(true).await;
    error(
        server
            .claim(
                &fresh,
                &"0".repeat(64),
                "time_checked_owner",
                OWNER_PASSWORD,
            )
            .await,
        StatusCode::FORBIDDEN,
        &[&secret, OWNER_PASSWORD],
    )
    .await;
    let session = Session::from_response(
        server
            .claim(&fresh, &secret, "time_checked_owner", OWNER_PASSWORD)
            .await,
        StatusCode::CREATED,
    )
    .await;
    let (_, session_value) = session
        .cookie
        .split_once('=')
        .expect("session cookie value");
    let verifier = Sha256::digest(session_value.as_bytes()).to_vec();
    let row = sqlx::query("SELECT password_phc FROM users WHERE username = 'time_checked_owner'")
        .fetch_one(&mut connection)
        .await
        .expect("read private password verifier");
    let phc: String = row.get("password_phc");
    assert!(
        phc.starts_with("$argon2id$v=19$m=19456,t=2,p=1$"),
        "password verifier does not use the frozen Argon2id profile"
    );
    assert!(!phc.contains(OWNER_PASSWORD));
    let stored = sqlx::query(
        "SELECT verifier, expires_at - created_at AS lifetime FROM sessions WHERE account_id = $1",
    )
    .bind(
        session.account["id"]
            .as_str()
            .expect("account ID")
            .parse::<i64>()
            .expect("numeric account ID"),
    )
    .fetch_all(&mut connection)
    .await
    .expect("read private session verifiers");
    assert_eq!(stored.len(), 1);
    assert!(
        stored[0].get::<Vec<u8>, _>("verifier") == verifier,
        "session store contains a different verifier"
    );
    assert_eq!(stored[0].get::<i64, _>("lifetime"), 12 * 60 * 60);
    let consumed: Option<Vec<u8>> =
        sqlx::query_scalar("SELECT setup_hash FROM auth_state WHERE singleton = TRUE")
            .fetch_one(&mut connection)
            .await
            .expect("read consumed preparation");
    assert!(
        consumed.is_none(),
        "owner claim retained an active setup verifier"
    );
    let response = server.session_status(&session, StatusCode::OK).await;
    let public = response.text().await.expect("public session snapshot");
    assert_private_text(
        &public,
        &[
            &secret,
            OWNER_PASSWORD,
            &session.cookie,
            &phc,
            &lowercase_hex(&verifier),
            &lowercase_hex(&setup_hash),
            &lowercase_hex(&key),
        ],
    );
    sqlx::query("UPDATE sessions SET created_at = EXTRACT(EPOCH FROM clock_timestamp())::BIGINT - 2, expires_at = EXTRACT(EPOCH FROM clock_timestamp())::BIGINT - 1 WHERE verifier = $1")
        .bind(&verifier).execute(&mut connection).await.expect("expire only owned fixture session");
    let response = server
        .session_status(&session, StatusCode::UNAUTHORIZED)
        .await;
    let _ = cookie(&response, SESSION_COOKIE, false);
    let recovered = server.login("time_checked_owner", OWNER_PASSWORD).await;
    let _ = server.session_status(&recovered, StatusCode::OK).await;
    server.assert_logs_private(&[
        &secret,
        OWNER_PASSWORD,
        &session.cookie,
        &phc,
        &lowercase_hex(&verifier),
        &lowercase_hex(&key),
    ]);
}

#[tokio::test]
async fn expiry_while_claim_waits_for_the_serialization_lock_rolls_back_account_and_session() {
    let fixture = Fixture::new().await;
    fixture.init_key().await;
    let secret = fixture.prepare().await;
    let server = Server::start(&fixture, Some(&fixture.key_file)).await;
    let form = server.form(true).await;
    let mut locking_connection = fixture.connect().await;
    let mut transaction = locking_connection
        .begin()
        .await
        .expect("hold owned auth serialization transaction");
    let _: bool =
        sqlx::query_scalar("SELECT singleton FROM auth_state WHERE singleton = TRUE FOR UPDATE")
            .fetch_one(&mut *transaction)
            .await
            .expect("hold auth singleton row lock");
    let request = server.admitted(Method::POST, "/api/auth/claim")
        .header("Cookie", &form.cookie).header("X-CSRF-Token", &form.csrf)
        .json(&json!({"setup_secret":secret,"username":"expired_waiting_owner","password":OWNER_PASSWORD}))
        .build().expect("build waiting claim");
    let client = server.client.clone();
    let waiting = tokio::spawn(async move {
        client
            .execute(request)
            .await
            .expect("waiting claim HTTP response")
    });
    let mut observer = fixture.connect().await;
    let deadline = Instant::now() + Duration::from_millis(2500);
    loop {
        let blocked: bool = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE datname = current_database() AND wait_event_type = 'Lock' AND pid <> pg_backend_pid())")
            .fetch_one(&mut observer).await.expect("observe owned waiting claim");
        if blocked {
            break;
        }
        assert!(
            Instant::now() < deadline,
            "claim did not reach the held serialization lock"
        );
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
    sqlx::query("UPDATE auth_state SET setup_expires_at = EXTRACT(EPOCH FROM clock_timestamp())::BIGINT - 1 WHERE singleton = TRUE")
        .execute(&mut *transaction).await.expect("expire setup while claim is blocked");
    transaction
        .commit()
        .await
        .expect("release serialization lock with expired setup");
    error(
        waiting.await.expect("waiting claim task"),
        StatusCode::FORBIDDEN,
        &[&secret, OWNER_PASSWORD],
    )
    .await;
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM users")
            .fetch_one(&mut observer)
            .await
            .expect("count accounts after expired claim"),
        0
    );
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM sessions")
            .fetch_one(&mut observer)
            .await
            .expect("count sessions after expired claim"),
        0
    );
    let renewed = fixture.prepare().await;
    let renewed_form = server.form(true).await;
    let _ = Session::from_response(
        server
            .claim(&renewed_form, &renewed, "renewed_owner", OWNER_PASSWORD)
            .await,
        StatusCode::CREATED,
    )
    .await;
    server.assert_logs_private(&[&secret, &renewed, OWNER_PASSWORD]);
}

#[tokio::test]
async fn durable_throttle_windows_bound_known_unknown_and_setup_attempts_without_row_growth() {
    let fixture = Fixture::new().await;
    let (server, owner, setup) = claimed(&fixture).await;
    let mut connection = fixture.connect().await;
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM auth_throttles")
            .fetch_one(&mut connection)
            .await
            .expect("fixed throttle row count"),
        66
    );
    for _ in 0..5 {
        error(
            server
                .login_response("unknown_throttle_user", "wrong fixture passphrase")
                .await,
            StatusCode::UNAUTHORIZED,
            &[OWNER_PASSWORD],
        )
        .await;
    }
    error(
        server
            .login_response("unknown_throttle_user", "wrong fixture passphrase")
            .await,
        StatusCode::TOO_MANY_REQUESTS,
        &[OWNER_PASSWORD],
    )
    .await;
    drop(server);
    let server = Server::start(&fixture, Some(&fixture.key_file)).await;
    error(
        server
            .login_response("unknown_throttle_user", "wrong fixture passphrase")
            .await,
        StatusCode::TOO_MANY_REQUESTS,
        &[OWNER_PASSWORD],
    )
    .await;
    // Owned-fixture time seam: expire windows, then seed the documented global
    // boundary to isolate it from the independent per-name bucket limit.
    reset_fixture_throttle_windows(&fixture).await;
    sqlx::query("UPDATE auth_throttles SET window_start = EXTRACT(EPOCH FROM clock_timestamp())::BIGINT, attempts = 19 WHERE scope = 1")
        .execute(&mut connection).await.expect("seed owned global throttle boundary");
    error(
        server
            .login_response("global_boundary_user", "wrong fixture passphrase")
            .await,
        StatusCode::UNAUTHORIZED,
        &[OWNER_PASSWORD],
    )
    .await;
    error(
        server
            .login_response("another_global_user", "wrong fixture passphrase")
            .await,
        StatusCode::TOO_MANY_REQUESTS,
        &[OWNER_PASSWORD],
    )
    .await;
    for index in 0..25 {
        error(
            server
                .login_response(
                    &format!("unique_denied_{index}"),
                    "wrong fixture passphrase",
                )
                .await,
            StatusCode::TOO_MANY_REQUESTS,
            &[OWNER_PASSWORD],
        )
        .await;
    }
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM auth_throttles")
            .fetch_one(&mut connection)
            .await
            .expect("bounded rows after arbitrary names"),
        66
    );
    reset_fixture_throttle_windows(&fixture).await;
    let recovered = server.login("keida_owner", OWNER_PASSWORD).await;
    let _ = server.session_status(&recovered, StatusCode::OK).await;
    server.assert_logs_private(&[&setup, OWNER_PASSWORD, &owner.cookie]);

    let setup_fixture = Fixture::new().await;
    setup_fixture.init_key().await;
    let setup_secret = setup_fixture.prepare().await;
    let setup_server = Server::start(&setup_fixture, Some(&setup_fixture.key_file)).await;
    let form = setup_server.form(true).await;
    let mut setup_connection = setup_fixture.connect().await;
    sqlx::query("UPDATE auth_throttles SET window_start = EXTRACT(EPOCH FROM clock_timestamp())::BIGINT, attempts = 4 WHERE scope = 0")
        .execute(&mut setup_connection).await.expect("seed owned setup throttle boundary");
    error(
        setup_server
            .claim(&form, &"0".repeat(64), "not_claimed", OWNER_PASSWORD)
            .await,
        StatusCode::FORBIDDEN,
        &[&setup_secret],
    )
    .await;
    error(
        setup_server
            .claim(&form, &setup_secret, "not_claimed", OWNER_PASSWORD)
            .await,
        StatusCode::TOO_MANY_REQUESTS,
        &[&setup_secret],
    )
    .await;
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM users")
            .fetch_one(&mut setup_connection)
            .await
            .expect("throttle prevented ownership"),
        0
    );
    reset_fixture_throttle_windows(&setup_fixture).await;
    let _ = Session::from_response(
        setup_server
            .claim(&form, &setup_secret, "after_window_owner", OWNER_PASSWORD)
            .await,
        StatusCode::CREATED,
    )
    .await;
}

#[tokio::test]
async fn concurrent_login_and_revoke_all_cannot_authorize_an_obsolete_generation() {
    let fixture = Fixture::new().await;
    let (server, original, setup) = claimed(&fixture).await;
    let form = server.form(false).await;
    let login = server
        .admitted(Method::POST, "/api/auth/login")
        .header("Cookie", &form.cookie)
        .header("X-CSRF-Token", &form.csrf)
        .json(&json!({"username":"keida_owner","password":OWNER_PASSWORD}));
    let revoke = server.authorized(Method::POST, "/api/auth/revoke-all", &original);
    let (login, revoke) = tokio::join!(login.send(), revoke.send());
    let login = login.expect("concurrent login response");
    let revoke = revoke.expect("concurrent revoke-all response");
    assert_eq!(revoke.status(), StatusCode::NO_CONTENT);
    let _ = server
        .session_status(&original, StatusCode::UNAUTHORIZED)
        .await;
    let mut connection = fixture.connect().await;
    if login.status() == StatusCode::OK {
        let racing = Session::from_response(login, StatusCode::OK).await;
        let (_, value) = racing
            .cookie
            .split_once('=')
            .expect("racing session cookie");
        let verifier = Sha256::digest(value.as_bytes()).to_vec();
        let row = sqlx::query("SELECT s.generation AS issued_generation, u.generation AS current_generation, s.revoked FROM sessions s JOIN users u ON u.id = s.account_id WHERE s.verifier = $1")
            .bind(verifier).fetch_one(&mut connection).await.expect("inspect racing session authority");
        let issued: i64 = row.get("issued_generation");
        let current: i64 = row.get("current_generation");
        assert!(
            issued <= current,
            "session issued a future account generation"
        );
        let expected = if row.get::<bool, _>("revoked") || issued != current {
            StatusCode::UNAUTHORIZED
        } else {
            StatusCode::OK
        };
        let _ = server.session_status(&racing, expected).await;
    } else {
        error(login, StatusCode::UNAUTHORIZED, &[OWNER_PASSWORD]).await;
    }
    let (_, original_value) = original
        .cookie
        .split_once('=')
        .expect("original session cookie");
    let old_verifier = Sha256::digest(original_value.as_bytes()).to_vec();
    // Owned-fixture fault: clear only the redundant revoked flag. The obsolete
    // generation must independently remain insufficient authority.
    sqlx::query("UPDATE sessions SET revoked = FALSE WHERE verifier = $1")
        .bind(old_verifier)
        .execute(&mut connection)
        .await
        .expect("exercise obsolete generation fixture");
    let _ = server
        .session_status(&original, StatusCode::UNAUTHORIZED)
        .await;
    let fresh = server.login("keida_owner", OWNER_PASSWORD).await;
    let response = server.session_status(&fresh, StatusCode::OK).await;
    let public: Value = response
        .json()
        .await
        .expect("current session generation snapshot");
    let current: i64 =
        sqlx::query_scalar("SELECT generation FROM users WHERE username = 'keida_owner'")
            .fetch_one(&mut connection)
            .await
            .expect("current account generation");
    assert!(
        public["session_generation"]
            .as_str()
            .expect("decimal-string session generation")
            == current.to_string()
    );
    server.assert_logs_private(&[&setup, OWNER_PASSWORD, &original.cookie, &fresh.cookie]);
}

#[tokio::test]
async fn thirty_two_session_http_cap_requires_rotation_and_preserves_other_devices() {
    let fixture = Fixture::new().await;
    let (server, owner, setup) = claimed(&fixture).await;
    let account_id = owner.account["id"]
        .as_str()
        .expect("owner ID")
        .parse::<i64>()
        .expect("numeric owner ID");
    let mut connection = fixture.connect().await;
    let key = fs::read(&fixture.key_file).expect("fixture CSRF signing key");
    let mut other_device = None;
    for index in 1..=31 {
        let token = format!("{:064x}", 5000 + index);
        let verifier = Sha256::digest(token.as_bytes()).to_vec();
        sqlx::query("INSERT INTO sessions (verifier,account_id,generation,created_at,expires_at) SELECT $1,id,generation,floor(extract(epoch FROM clock_timestamp()))::BIGINT,floor(extract(epoch FROM clock_timestamp()))::BIGINT + 43200 FROM users WHERE id = $2")
            .bind(verifier).bind(account_id).execute(&mut connection).await.expect("seed valid owned session records");
        if index == 1 {
            other_device = Some(Session {
                cookie: format!("{SESSION_COOKIE}={token}"),
                csrf: protocol_mac(&key, b"reborn/session-csrf/v1\0", &token),
                account: owner.account.clone(),
            });
        }
    }
    let other_device = other_device.expect("independent device fixture");
    assert_eq!(
        sqlx::query_scalar::<_, i64>(
            "SELECT COUNT(*) FROM sessions WHERE account_id = $1 AND revoked = FALSE"
        )
        .bind(account_id)
        .fetch_one(&mut connection)
        .await
        .expect("full session fixture"),
        32
    );
    let _ = server.session_status(&other_device, StatusCode::OK).await;
    error(
        server.login_response("keida_owner", OWNER_PASSWORD).await,
        StatusCode::TOO_MANY_REQUESTS,
        &[OWNER_PASSWORD, &owner.cookie],
    )
    .await;
    let _ = server.session_status(&owner, StatusCode::OK).await;
    let form = server.form(false).await;
    let response = server
        .admitted(Method::POST, "/api/auth/login")
        .header("Cookie", format!("{}; {}", form.cookie, owner.cookie))
        .header("X-CSRF-Token", &form.csrf)
        .json(&json!({"username":"keida_owner","password":OWNER_PASSWORD}))
        .send()
        .await
        .expect("rotation at HTTP session cap");
    let rotated = Session::from_response(response, StatusCode::OK).await;
    assert!(rotated.cookie != owner.cookie);
    let _ = server
        .session_status(&owner, StatusCode::UNAUTHORIZED)
        .await;
    let _ = server.session_status(&rotated, StatusCode::OK).await;
    let _ = server.session_status(&other_device, StatusCode::OK).await;
    assert_eq!(sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM sessions s JOIN users u ON u.id = s.account_id WHERE u.id = $1 AND s.revoked = FALSE AND s.generation = u.generation AND s.expires_at > floor(extract(epoch FROM clock_timestamp()))::BIGINT")
        .bind(account_id).fetch_one(&mut connection).await.expect("active count after HTTP rotation"), 32);
    server.assert_logs_private(&[
        &setup,
        OWNER_PASSWORD,
        &owner.cookie,
        &rotated.cookie,
        &other_device.cookie,
    ]);
}

#[tokio::test]
async fn unread_claim_response_after_observed_commit_recovers_by_deliberate_fresh_login() {
    use std::io::Write;

    let fixture = Fixture::new().await;
    fixture.init_key().await;
    let secret = fixture.prepare().await;
    let server = Server::start(&fixture, Some(&fixture.key_file)).await;
    let form = server.form(true).await;
    let address = server
        .origin
        .strip_prefix("http://")
        .expect("loopback HTTP fixture")
        .parse::<std::net::SocketAddr>()
        .expect("loopback socket address");
    let mut socket = std::net::TcpStream::connect_timeout(&address, Duration::from_secs(2))
        .expect("raw response-loss fixture connection");
    socket
        .set_write_timeout(Some(Duration::from_secs(1)))
        .expect("bounded fixture write");
    let body = serde_json::to_string(
        &json!({"setup_secret":secret,"username":"lost_reply_owner","password":OWNER_PASSWORD}),
    )
    .expect("encode raw claim body");
    let request = format!(
        "POST /api/auth/claim HTTP/1.1\r\nHost: {address}\r\nOrigin: {ORIGIN}\r\nX-Reborn-Product: {PRODUCT}\r\nX-Reborn-Contract: {CONTRACT}\r\nX-CSRF-Token: {}\r\nCookie: {}\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: keep-alive\r\n\r\n{body}",
        form.csrf,
        form.cookie,
        body.len(),
    );
    socket
        .write_all(request.as_bytes())
        .expect("send raw claim without reading its response");
    socket.flush().expect("flush complete raw request");
    let mut connection = fixture.connect().await;
    let deadline = Instant::now() + Duration::from_secs(3);
    let owner_id = loop {
        let owner_id: Option<i64> =
            sqlx::query_scalar("SELECT owner_id FROM auth_state WHERE singleton = TRUE")
                .fetch_one(&mut connection)
                .await
                .expect("observe only owned claim commit");
        if let Some(owner_id) = owner_id {
            break owner_id;
        }
        assert!(
            Instant::now() < deadline,
            "claim commit was not observed before the recovery deadline"
        );
        tokio::time::sleep(Duration::from_millis(10)).await;
    };
    // Commit has been observed independently. Discarding an unread response here
    // tests recovery from response loss, not cancellation during database commit.
    drop(socket);
    let fresh_form = server.form(false).await;
    error(
        server
            .claim(&fresh_form, &secret, "lost_reply_owner", OWNER_PASSWORD)
            .await,
        StatusCode::CONFLICT,
        &[&secret, OWNER_PASSWORD],
    )
    .await;
    let recovered = server.login("lost_reply_owner", OWNER_PASSWORD).await;
    assert!(
        recovered.account["id"]
            .as_str()
            .expect("recovered owner ID")
            == owner_id.to_string()
    );
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM users WHERE role = 'owner'")
            .fetch_one(&mut connection)
            .await
            .expect("one owner after lost response"),
        1
    );
    let _ = server.session_status(&recovered, StatusCode::OK).await;
    server.assert_logs_private(&[&secret, OWNER_PASSWORD, &form.cookie, &recovered.cookie]);
}

async fn auth_durable_snapshot(
    connection: &mut PgConnection,
    account_id: i64,
) -> (i64, i64, i64, i64) {
    let row = sqlx::query("SELECT (SELECT COUNT(*) FROM users) AS users, (SELECT COUNT(*) FROM sessions) AS sessions, u.generation, (SELECT COALESCE(SUM(attempts), 0)::BIGINT FROM auth_throttles) AS attempts FROM users u WHERE u.id = $1")
        .bind(account_id).fetch_one(connection).await.expect("snapshot owned durable auth state");
    (
        row.get("users"),
        row.get("sessions"),
        row.get("generation"),
        row.get("attempts"),
    )
}

#[tokio::test]
async fn schema_drift_fences_live_auth_effects_and_restoration_preserves_existing_authority() {
    let fixture = Fixture::new().await;
    let (server, owner, setup) = claimed(&fixture).await;
    let normal_head = server
        .client
        .head(server.url("/api/auth/form"))
        .send()
        .await
        .expect("normal anonymous HEAD form");
    assert_eq!(normal_head.status(), StatusCode::OK);
    assert_no_store(&normal_head);
    let _ = cookie(&normal_head, FORM_COOKIE, true);
    assert!(
        normal_head
            .bytes()
            .await
            .expect("empty normal HEAD body")
            .is_empty()
    );
    let owner_id = owner.account["id"]
        .as_str()
        .expect("owner ID")
        .parse::<i64>()
        .expect("numeric owner ID");
    let form = server.form(false).await;
    let key_before = fs::read(&fixture.key_file).expect("read unchanged fixture key");
    let mut connection = fixture.connect().await;
    let before = auth_durable_snapshot(&mut connection, owner_id).await;
    sqlx::query("INSERT INTO _sqlx_migrations (version,description,success,checksum,execution_time) VALUES (999,'owned-future-auth-fixture',TRUE,decode('00','hex'),0)")
        .execute(&mut connection).await.expect("stage owned future schema after startup");

    let response = server
        .client
        .get(server.url("/api/health"))
        .send()
        .await
        .expect("liveness during schema drift");
    assert_eq!(response.status(), StatusCode::OK);
    assert_no_store(&response);
    let response = server
        .client
        .get(server.url("/api/ready"))
        .send()
        .await
        .expect("readiness during schema drift");
    assert_eq!(response.status(), StatusCode::SERVICE_UNAVAILABLE);
    assert_no_store(&response);
    assert!(
        response.json::<Value>().await.expect("unready schema JSON")
            == json!({"status":"not_ready"})
    );

    for path in ["/api/auth/form", "/api/auth/session", "/api/owner/members"] {
        let request = if path == "/api/auth/form" {
            server.client.head(server.url(path))
        } else {
            server.authorized(Method::HEAD, path, &owner)
        };
        let response = request.send().await.expect("HEAD under exact-schema fence");
        assert_eq!(response.status(), StatusCode::SERVICE_UNAVAILABLE);
        assert_no_store(&response);
        assert!(
            response.headers().get("set-cookie").is_none(),
            "schema-fenced HEAD issued a cookie"
        );
        assert!(
            response
                .bytes()
                .await
                .expect("empty fenced HEAD body")
                .is_empty()
        );
    }
    for path in ["/api/auth/session", "/api/owner/members"] {
        let response = server
            .client
            .head(server.url(path))
            .header("Cookie", &owner.cookie)
            .send()
            .await
            .expect("unqualified protected HEAD under drift");
        assert_eq!(response.status(), StatusCode::UPGRADE_REQUIRED);
        assert_no_store(&response);
        assert!(response.headers().get("set-cookie").is_none());
        assert!(
            response
                .bytes()
                .await
                .expect("empty unqualified HEAD body")
                .is_empty()
        );
    }

    let response = server
        .client
        .get(server.url("/api/auth/form"))
        .send()
        .await
        .expect("form under schema fence");
    error(response, StatusCode::SERVICE_UNAVAILABLE, &[&setup]).await;
    let response = server
        .session_status(&owner, StatusCode::SERVICE_UNAVAILABLE)
        .await;
    error(response, StatusCode::SERVICE_UNAVAILABLE, &[&owner.cookie]).await;
    let response = server
        .admitted(Method::POST, "/api/auth/login")
        .header("Cookie", &form.cookie)
        .header("X-CSRF-Token", &form.csrf)
        .json(&json!({"username":"keida_owner","password":OWNER_PASSWORD}))
        .send()
        .await
        .expect("login under schema fence");
    error(
        response,
        StatusCode::SERVICE_UNAVAILABLE,
        &[OWNER_PASSWORD, &form.cookie],
    )
    .await;
    let response = server
        .authorized(Method::POST, "/api/owner/members", &owner)
        .json(&json!({"username":"schema_blocked_member","password":MEMBER_PASSWORD}))
        .send()
        .await
        .expect("member creation under schema fence");
    error(
        response,
        StatusCode::SERVICE_UNAVAILABLE,
        &[MEMBER_PASSWORD, &owner.cookie],
    )
    .await;
    let response = server
        .authorized(Method::POST, "/api/auth/revoke-all", &owner)
        .send()
        .await
        .expect("revocation under schema fence");
    error(response, StatusCode::SERVICE_UNAVAILABLE, &[&owner.cookie]).await;

    // Admission precedence remains meaningful even when the data schema is fenced.
    let response = server
        .client
        .get(server.url("/api/auth/session"))
        .header("Cookie", &owner.cookie)
        .send()
        .await
        .expect("unqualified fenced session");
    error(response, StatusCode::UPGRADE_REQUIRED, &[&owner.cookie]).await;
    let response = server
        .client
        .post(server.url("/api/auth/revoke-all"))
        .header("X-Reborn-Product", PRODUCT)
        .header("X-Reborn-Contract", CONTRACT)
        .header("Origin", "https://untrusted.example")
        .header("Cookie", &owner.cookie)
        .header("X-CSRF-Token", &owner.csrf)
        .send()
        .await
        .expect("wrong-origin fenced mutation");
    error(response, StatusCode::FORBIDDEN, &[&owner.cookie]).await;
    assert_eq!(
        auth_durable_snapshot(&mut connection, owner_id).await,
        before,
        "schema-fenced requests changed durable auth state"
    );

    sqlx::query("DELETE FROM _sqlx_migrations WHERE version = 999")
        .execute(&mut connection)
        .await
        .expect("restore only owned future-ledger fixture");
    let _ = server.session_status(&owner, StatusCode::OK).await;
    let _ = server.form(false).await;
    let response = server
        .client
        .get(server.url("/api/ready"))
        .send()
        .await
        .expect("restored schema readiness");
    assert_eq!(response.status(), StatusCode::OK);
    assert!(
        fs::read(&fixture.key_file).expect("read preserved key") == key_before,
        "schema recovery replaced the instance key"
    );
    let response = server
        .authorized(Method::POST, "/api/owner/members", &owner)
        .json(&json!({"username":"schema_recovered_member","password":MEMBER_PASSWORD}))
        .send()
        .await
        .expect("normal operation after schema restoration");
    assert_eq!(response.status(), StatusCode::CREATED);
    let created: Value = response.json().await.expect("restored member result");
    let member_id = created["account"]["id"]
        .as_str()
        .expect("member ID")
        .parse::<i64>()
        .expect("numeric member ID");
    let rejection = sqlx::query("UPDATE auth_state SET owner_id = $1 WHERE singleton = TRUE")
        .bind(member_id)
        .execute(&mut connection)
        .await
        .expect_err("composite owner reference accepted a member");
    assert_eq!(
        rejection
            .as_database_error()
            .and_then(|error| error.code())
            .as_deref(),
        Some("23503")
    );
    let preserved: Option<i64> =
        sqlx::query_scalar("SELECT owner_id FROM auth_state WHERE singleton = TRUE")
            .fetch_one(&mut connection)
            .await
            .expect("preserved true owner reference");
    assert_eq!(preserved, Some(owner_id));
    let _ = server.session_status(&owner, StatusCode::OK).await;
    server.assert_logs_private(&[
        &setup,
        OWNER_PASSWORD,
        MEMBER_PASSWORD,
        &owner.cookie,
        &form.cookie,
    ]);
}

#[tokio::test]
async fn password_scalar_boundaries_and_no_unicode_normalization_are_real_http_contracts() {
    let fixture = Fixture::new().await;
    fixture.init_key().await;
    let secret = fixture.prepare().await;
    let server = Server::start(&fixture, Some(&fixture.key_file)).await;
    let form = server.form(true).await;
    for password in ["a".repeat(14), "é".repeat(6)] {
        error(
            server
                .claim(&form, &secret, "unicode_owner", &password)
                .await,
            StatusCode::BAD_REQUEST,
            &[&secret, &password],
        )
        .await;
    }
    let password = "é".repeat(15);
    let owner = Session::from_response(
        server
            .claim(&form, &secret, "unicode_owner", &password)
            .await,
        StatusCode::CREATED,
    )
    .await;
    let incorrect_normalization = "e\u{301}".repeat(15);
    error(
        server
            .login_response("unicode_owner", &incorrect_normalization)
            .await,
        StatusCode::UNAUTHORIZED,
        &[&password, &incorrect_normalization],
    )
    .await;
    let verified = server.login("unicode_owner", &password).await;
    let _ = server.session_status(&verified, StatusCode::OK).await;
    for invalid_password in ["x".repeat(14), "é".repeat(129)] {
        let response = server
            .authorized(Method::POST, "/api/owner/members", &owner)
            .json(&json!({"username":"invalid_password_member","password":invalid_password}))
            .send()
            .await
            .expect("invalid member password boundary");
        error(response, StatusCode::BAD_REQUEST, &[&invalid_password]).await;
    }
    let maximum = "🦀".repeat(128);
    assert_eq!(maximum.len(), 512);
    let response = server
        .authorized(Method::POST, "/api/owner/members", &owner)
        .json(&json!({"username":"maximum_password_member","password":maximum}))
        .send()
        .await
        .expect("maximum member password boundary");
    assert_eq!(response.status(), StatusCode::CREATED);
    let member = server.login("maximum_password_member", &maximum).await;
    assert_eq!(member.account["role"], "member");
    server.assert_logs_private(&[&secret, &password, &maximum, &owner.cookie, &member.cookie]);
}
