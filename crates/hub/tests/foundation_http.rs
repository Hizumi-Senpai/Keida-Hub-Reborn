use reqwest::{Client, StatusCode};
use serde_json::Value;
use std::{
    net::TcpListener,
    process::{Child, Command, Output, Stdio},
    time::{Duration, Instant},
};

const BINARY: &str = env!("CARGO_BIN_EXE_keida-hub-reborn");
const PASSWORD_MARKER: &str = "fixture-password-must-not-appear";

fn unused_port() -> u16 {
    TcpListener::bind(("127.0.0.1", 0))
        .expect("reserve loopback test port")
        .local_addr()
        .expect("loopback socket address")
        .port()
}

fn configured_command() -> Command {
    let mut command = Command::new(BINARY);
    command
        .arg("serve")
        .env("REBORN_BIND", format!("127.0.0.1:{}", unused_port()))
        .env("REBORN_PUBLIC_ORIGIN", "https://reborn.example")
        .env("REBORN_DB_MAX_CONNECTIONS", "5")
        .env(
            "DATABASE_URL",
            format!(
                "postgresql://fixture:{PASSWORD_MARKER}@127.0.0.1:{}/keida_reborn_test_unavailable",
                unused_port()
            ),
        )
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    command
}

fn output_with_deadline(mut child: Child) -> Output {
    let deadline = Instant::now() + Duration::from_secs(5);
    loop {
        if child
            .try_wait()
            .expect("inspect application exit")
            .is_some()
        {
            return child
                .wait_with_output()
                .expect("collect application output");
        }
        if Instant::now() >= deadline {
            let _ = child.kill();
            let _ = child.wait();
            panic!("invalid configuration did not stop the application before its deadline");
        }
        std::thread::sleep(Duration::from_millis(10));
    }
}

fn assert_rejected(mut command: Command, field: &str) {
    let output = output_with_deadline(command.spawn().expect("start invalid configuration"));
    assert_eq!(output.status.code(), Some(2));
    let stdout = String::from_utf8_lossy(&output.stdout);
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(
        stdout.trim().is_empty(),
        "configuration failure wrote public output"
    );
    assert!(stderr.contains("configuration rejected:"));
    assert!(
        stderr.contains(field),
        "configuration failure omitted its field"
    );
    assert!(
        !stderr.contains(PASSWORD_MARKER),
        "credential leaked into diagnostics"
    );
    assert!(
        !stderr.contains("postgresql://"),
        "database URL leaked into diagnostics"
    );
}

#[test]
fn invalid_configuration_is_rejected_without_disclosing_credentials() {
    for origin in [
        "http://reborn.example",
        "https://user:fixture-password-must-not-appear@reborn.example",
        "https://reborn.example/private",
        "https://reborn.example?secret=fixture-password-must-not-appear",
        "https://reborn.example#fixture-password-must-not-appear",
        "not-an-origin",
    ] {
        let mut command = configured_command();
        command.env("REBORN_PUBLIC_ORIGIN", origin);
        assert_rejected(command, "REBORN_PUBLIC_ORIGIN");
    }
    let mut command = configured_command();
    command.env_remove("REBORN_PUBLIC_ORIGIN");
    assert_rejected(command, "REBORN_PUBLIC_ORIGIN");

    for size in ["0", "17", "-1", "many"] {
        let mut command = configured_command();
        command.env("REBORN_DB_MAX_CONNECTIONS", size);
        assert_rejected(command, "REBORN_DB_MAX_CONNECTIONS");
    }
    for database_url in [
        "sqlite://fixture-password-must-not-appear",
        "postgresql://fixture:fixture-password-must-not-appear@127.0.0.1:bad/fixture",
        "postgresql://fixture:fixture-password-must-not-appear@127.0.0.1/",
    ] {
        let mut command = configured_command();
        command.env("DATABASE_URL", database_url);
        assert_rejected(command, "DATABASE_URL");
    }
    let mut command = configured_command();
    command.env_remove("DATABASE_URL");
    assert_rejected(command, "DATABASE_URL");

    let mut command = configured_command();
    command.env("REBORN_BIND", "fixture-password-must-not-appear");
    assert_rejected(command, "REBORN_BIND");
}

struct Server {
    child: Child,
    origin: String,
    client: Client,
}

impl Server {
    async fn start(relabel: bool) -> Self {
        let port = unused_port();
        let mut command = configured_command();
        command.env("REBORN_BIND", format!("127.0.0.1:{port}"));
        if relabel {
            command
                .env("REBORN_VERSION", "999.9.9")
                .env("REBORN_SOURCE_SHA", "f".repeat(40))
                .env("REBORN_COMMIT", "f".repeat(40))
                .env("REBORN_TREE", "e".repeat(40))
                .env("GIT_SHA", "f".repeat(40));
            for prefix in ["REBORN_BUILD", "REBORN_COMPILED"] {
                for (field, value) in [
                    ("PRODUCT", "fixture-other-product"),
                    ("VERSION", "999.9.9"),
                    ("COMMIT", "ffffffffffffffffffffffffffffffffffffffff"),
                    ("TREE", "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"),
                    ("ORDINAL", "999"),
                    ("CHANNEL", "accepted"),
                    ("CONTRACT", "fixture-other-contract"),
                    ("PACKAGE_VERSION", "999.9.9"),
                ] {
                    command.env(format!("{prefix}_{field}"), value);
                }
            }
        }
        let mut server = Self {
            child: command.spawn().expect("start HTTP application"),
            origin: format!("http://127.0.0.1:{port}"),
            client: Client::builder()
                .timeout(Duration::from_secs(4))
                .redirect(reqwest::redirect::Policy::none())
                .build()
                .expect("build HTTP client"),
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
                    .expect("inspect application")
                    .is_none(),
                "application exited before HTTP readiness"
            );
            assert!(Instant::now() < deadline, "HTTP listener startup timed out");
            tokio::time::sleep(Duration::from_millis(20)).await;
        }
    }

    fn url(&self, path: &str) -> String {
        format!("{}{path}", self.origin)
    }

    async fn json(&self, path: &str, expected_status: StatusCode) -> Value {
        let response = self
            .client
            .get(self.url(path))
            .send()
            .await
            .expect("HTTP response");
        assert_eq!(response.status(), expected_status);
        assert_eq!(
            response
                .headers()
                .get("cache-control")
                .expect("no-store header"),
            "no-store"
        );
        assert!(
            response.headers().get("set-cookie").is_none(),
            "public foundation route issued a session"
        );
        let body = response.text().await.expect("HTTP body");
        assert!(
            !body.contains(PASSWORD_MARKER),
            "credential leaked into HTTP response"
        );
        assert!(
            !body.contains("postgresql://"),
            "database URL leaked into HTTP response"
        );
        serde_json::from_str(&body).expect("JSON HTTP body")
    }
}

impl Drop for Server {
    fn drop(&mut self) {
        let _ = self.child.kill();
        let _ = self.child.wait();
    }
}

#[tokio::test]
async fn liveness_is_database_independent_identity_is_compiled_and_private_routes_are_closed() {
    let server = Server::start(false).await;
    let health = server.json("/api/health", StatusCode::OK).await;
    assert_eq!(health["status"], "ok");
    let identity = server.json("/version", StatusCode::OK).await;
    assert_eq!(health["identity"], identity);
    assert_eq!(identity["product"], "keida-hub-reborn");
    for field in [
        "version",
        "commit",
        "tree",
        "channel",
        "contract",
        "package_version",
    ] {
        assert!(
            identity.get(field).is_some(),
            "compiled identity omitted {field}"
        );
    }
    assert!(identity.get("ordinal").is_some());
    // The actual CI caller supplies these records from the history tool. Compare
    // its input to real HTTP output so missing compile injection cannot pass.
    for (field, suffix) in [
        ("product", "PRODUCT"),
        ("version", "VERSION"),
        ("commit", "COMMIT"),
        ("tree", "TREE"),
        ("channel", "CHANNEL"),
        ("contract", "CONTRACT"),
    ] {
        let expected = std::env::var(format!("REBORN_BUILD_{suffix}"));
        if std::env::var("GITHUB_ACTIONS").as_deref() == Ok("true") {
            assert!(
                expected.is_ok(),
                "CI did not supply compiled identity input"
            );
        }
        if let Ok(expected) = expected {
            assert_eq!(
                identity[field], expected,
                "HTTP identity differs from build caller"
            );
        }
    }
    if let Ok(ordinal) = std::env::var("REBORN_BUILD_ORDINAL") {
        let expected = if ordinal.is_empty() {
            Value::Null
        } else {
            serde_json::json!(ordinal.parse::<u64>().expect("build caller ordinal"))
        };
        assert_eq!(identity["ordinal"], expected);
    }

    let relabeled = Server::start(true).await;
    assert_eq!(
        relabeled.json("/version", StatusCode::OK).await,
        identity,
        "runtime environment relabeled the compiled binary"
    );

    assert_eq!(
        server
            .json("/api/ready", StatusCode::SERVICE_UNAVAILABLE)
            .await,
        serde_json::json!({"status":"not_ready"})
    );
    assert_eq!(server.json("/api/health", StatusCode::OK).await, health);

    for path in [
        "/",
        "/login",
        "/setup",
        "/api/setup",
        "/api/me",
        "/api/workspace",
        "/api/servers",
        "/api/admin",
    ] {
        for method in [reqwest::Method::GET, reqwest::Method::POST] {
            let response = server
                .client
                .request(method, server.url(path))
                .send()
                .await
                .expect("closed route response");
            assert_eq!(
                response.status(),
                StatusCode::NOT_FOUND,
                "unfinished private route {path} became reachable"
            );
            assert!(response.headers().get("set-cookie").is_none());
        }
    }
    for path in ["/api/health", "/version", "/api/ready"] {
        let response = server
            .client
            .post(server.url(path))
            .send()
            .await
            .expect("read-only route response");
        assert_eq!(response.status(), StatusCode::METHOD_NOT_ALLOWED);
    }
}

#[tokio::test]
async fn sigterm_finishes_with_a_held_incomplete_http_connection() {
    use std::io::{Read, Write};

    let mut server = Server::start(false).await;
    let address = server
        .origin
        .strip_prefix("http://")
        .expect("loopback HTTP fixture")
        .parse()
        .expect("loopback socket address");
    let mut held = std::net::TcpStream::connect_timeout(&address, Duration::from_secs(2))
        .expect("open held HTTP connection");
    held.set_read_timeout(Some(Duration::from_millis(200)))
        .expect("bound incomplete-response inspection");
    held.write_all(b"GET /api/health HTTP/1.1\r\nHost: reborn.example\r\nX-Held: ")
        .expect("send deliberately incomplete request headers");
    let mut byte = [0];
    let incomplete = held
        .read(&mut byte)
        .expect_err("incomplete headers unexpectedly completed a response");
    assert!(matches!(
        incomplete.kind(),
        std::io::ErrorKind::WouldBlock | std::io::ErrorKind::TimedOut
    ));
    assert_eq!(
        server.json("/api/health", StatusCode::OK).await["status"],
        "ok",
        "held connection disrupted liveness before shutdown"
    );

    // Signal only this test's directly spawned child, retaining the incomplete
    // connection until that process reaches its honest terminal outcome.
    let signaled = Command::new("kill")
        .args(["-TERM", &server.child.id().to_string()])
        .status()
        .expect("signal owned HTTP fixture");
    assert!(signaled.success());
    let deadline = Instant::now() + Duration::from_secs(7);
    let status = loop {
        if let Some(status) = server.child.try_wait().expect("inspect signaled fixture") {
            break status;
        }
        assert!(
            Instant::now() < deadline,
            "SIGTERM did not finish within the bounded drain window"
        );
        tokio::time::sleep(Duration::from_millis(20)).await;
    };
    let mut stderr = String::new();
    server
        .child
        .stderr
        .take()
        .expect("fixture diagnostics")
        .read_to_string(&mut stderr)
        .expect("collect terminal diagnostics");
    match status.code() {
        Some(0) => assert!(stderr.trim().is_empty()),
        Some(2) => assert!(stderr.contains("shutdown deadline exceeded")),
        _ => panic!("signaled fixture did not report a graceful or bounded-drain outcome"),
    }
    assert!(!stderr.contains(PASSWORD_MARKER));
    drop(held);
}
