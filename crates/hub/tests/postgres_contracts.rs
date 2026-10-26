use reqwest::{Client, StatusCode, Url};
use serde_json::Value;
use sqlx::{Connection, Executor, PgConnection, Row};
use std::{
    net::TcpListener,
    process::{Child, Command, Output, Stdio},
    sync::atomic::{AtomicU64, Ordering},
    time::{Duration, Instant, SystemTime, UNIX_EPOCH},
};

const BINARY: &str = env!("CARGO_BIN_EXE_keida-hub-reborn");
static DATABASE_COUNTER: AtomicU64 = AtomicU64::new(0);

struct Database {
    admin_url: String,
    url: String,
    name: String,
}

impl Database {
    async fn create() -> Self {
        let admin_url = std::env::var("REBORN_TEST_DATABASE_URL")
            .expect("REBORN_TEST_DATABASE_URL must name an explicitly provisioned local disposable PostgreSQL fixture; database contracts never skip");
        let mut parsed = Url::parse(&admin_url).expect("parse local fixture URL");
        assert!(matches!(parsed.scheme(), "postgres" | "postgresql"));
        assert!(
            matches!(
                parsed.host_str(),
                Some("127.0.0.1" | "localhost" | "[::1]" | "::1")
            ),
            "database contracts permit only the local disposable fixture"
        );
        let unique = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .expect("fixture clock")
            .as_nanos();
        let name = format!(
            "keida_reborn_test_{}_{unique:x}_{:x}",
            std::process::id(),
            DATABASE_COUNTER.fetch_add(1, Ordering::Relaxed)
        );
        assert!(name.starts_with("keida_reborn_test_") && name.len() <= 63);
        assert!(
            name.bytes()
                .all(|byte| byte.is_ascii_alphanumeric() || byte == b'_')
        );
        let mut admin = PgConnection::connect(&admin_url)
            .await
            .expect("connect to disposable fixture administrator");
        let create_statement = format!("CREATE DATABASE \"{name}\"");
        // Audited identifier: fixed test prefix plus process/time/counter numbers,
        // checked above for ASCII alphanumerics/underscore and PostgreSQL's length bound.
        // No fixture URL or other external text enters this SQL statement.
        sqlx::raw_sql(sqlx::AssertSqlSafe(create_statement))
            .execute(&mut admin)
            .await
            .expect("create owned disposable database");
        parsed.set_path(&format!("/{name}"));
        Self {
            admin_url,
            url: parsed.to_string(),
            name,
        }
    }

    async fn connect(&self) -> PgConnection {
        PgConnection::connect(&self.url)
            .await
            .expect("connect to owned test database")
    }

    fn migrate(&self) -> Child {
        command(&self.url, "migrate")
            .spawn()
            .expect("start admitted migration command")
    }
}

impl Drop for Database {
    fn drop(&mut self) {
        let admin_url = self.admin_url.clone();
        let name = self.name.clone();
        assert!(name.starts_with("keida_reborn_test_") && name.len() <= 63);
        assert!(
            name.bytes()
                .all(|byte| byte.is_ascii_alphanumeric() || byte == b'_')
        );
        // Cleanup owns only the freshly generated database, never the supplied fixture itself.
        let result = std::thread::spawn(move || {
            let runtime = tokio::runtime::Builder::new_current_thread().enable_all().build().map_err(|_| ())?;
            runtime.block_on(async move {
                let mut admin = PgConnection::connect(&admin_url).await.map_err(|_| ())?;
                sqlx::query("SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()")
                    .bind(&name).execute(&mut admin).await.map_err(|_| ())?;
                let drop_statement = format!("DROP DATABASE \"{name}\"");
                // Audited as above: only the validated generated identifier enters SQL.
                sqlx::raw_sql(sqlx::AssertSqlSafe(drop_statement)).execute(&mut admin).await.map_err(|_| ())?;
                Ok::<(), ()>(())
            })
        }).join();
        if !matches!(result, Ok(Ok(()))) {
            eprintln!("owned disposable database cleanup failed");
        }
    }
}

fn command(database_url: &str, operation: &str) -> Command {
    let mut command = Command::new(BINARY);
    command
        .arg(operation)
        .env("DATABASE_URL", database_url)
        .env("REBORN_PUBLIC_ORIGIN", "https://reborn.example")
        .env("REBORN_DB_MAX_CONNECTIONS", "5")
        .env("REBORN_BIND", "127.0.0.1:8788")
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    command
}

async fn completed(mut child: Child) -> Output {
    tokio::task::spawn_blocking(move || {
        let deadline = Instant::now() + Duration::from_secs(15);
        loop {
            if child
                .try_wait()
                .expect("inspect migration process")
                .is_some()
            {
                return child.wait_with_output().expect("collect migration output");
            }
            if Instant::now() >= deadline {
                let _ = child.kill();
                let _ = child.wait();
                panic!("migration exceeded its bounded test deadline");
            }
            std::thread::sleep(Duration::from_millis(10));
        }
    })
    .await
    .expect("migration waiter")
}

fn assert_migrated(output: Output) {
    assert_eq!(output.status.code(), Some(0), "migration command failed");
}

struct Server {
    child: Child,
    origin: String,
    client: Client,
}

impl Server {
    async fn start(database: &Database) -> Self {
        let port = TcpListener::bind(("127.0.0.1", 0))
            .expect("reserve HTTP test port")
            .local_addr()
            .expect("HTTP test address")
            .port();
        let mut invocation = command(&database.url, "serve");
        invocation.env("REBORN_BIND", format!("127.0.0.1:{port}"));
        let mut server = Self {
            child: invocation.spawn().expect("start foundation server"),
            origin: format!("http://127.0.0.1:{port}"),
            client: Client::builder()
                .timeout(Duration::from_secs(4))
                .build()
                .expect("HTTP test client"),
        };
        let deadline = Instant::now() + Duration::from_secs(5);
        loop {
            if let Ok(response) = server
                .client
                .get(format!("{}/api/health", server.origin))
                .send()
                .await
            {
                assert_eq!(response.status(), StatusCode::OK);
                return server;
            }
            assert!(
                server.child.try_wait().expect("inspect server").is_none(),
                "server exited before listening"
            );
            assert!(
                Instant::now() < deadline,
                "server failed to listen before deadline"
            );
            tokio::time::sleep(Duration::from_millis(20)).await;
        }
    }

    async fn readiness(&self, ready: bool) {
        let response = self
            .client
            .get(format!("{}/api/ready", self.origin))
            .send()
            .await
            .expect("readiness response");
        assert_eq!(
            response.status(),
            if ready {
                StatusCode::OK
            } else {
                StatusCode::SERVICE_UNAVAILABLE
            }
        );
        assert_eq!(
            response
                .headers()
                .get("cache-control")
                .expect("readiness no-store"),
            "no-store"
        );
        let body: Value = response.json().await.expect("readiness JSON");
        assert_eq!(
            body,
            serde_json::json!({"status": if ready {"ready"} else {"not_ready"}})
        );
        let live = self
            .client
            .get(format!("{}/api/health", self.origin))
            .send()
            .await
            .expect("liveness during schema test");
        assert_eq!(live.status(), StatusCode::OK);
    }
}

impl Drop for Server {
    fn drop(&mut self) {
        let _ = self.child.kill();
        let _ = self.child.wait();
    }
}

async fn assert_constraint(connection: &mut PgConnection, statement: &'static str, sqlstate: &str) {
    let error = connection
        .execute(statement)
        .await
        .expect_err("database accepted invalid durable metadata");
    assert_eq!(
        error
            .as_database_error()
            .and_then(|error| error.code())
            .as_deref(),
        Some(sqlstate)
    );
}

#[tokio::test]
async fn readiness_requires_the_exact_migrated_schema_without_migrating_on_reads() {
    let database = Database::create().await;
    let mut connection = database.connect().await;
    let server = Server::start(&database).await;
    server.readiness(false).await;
    let absent: Option<String> = sqlx::query_scalar("SELECT to_regclass('reborn_schema')::text")
        .fetch_one(&mut connection)
        .await
        .expect("inspect absent schema");
    assert!(
        absent.is_none(),
        "serve or readiness silently ran a migration"
    );
    assert_migrated(completed(database.migrate()).await);
    server.readiness(true).await;

    let metadata = sqlx::query("SELECT singleton, product, schema_version FROM reborn_schema")
        .fetch_all(&mut connection)
        .await
        .expect("read durable metadata");
    assert_eq!(metadata.len(), 1);
    assert!(metadata[0].get::<bool, _>("singleton"));
    assert_eq!(metadata[0].get::<String, _>("product"), "keida-hub-reborn");
    assert_eq!(metadata[0].get::<i32, _>("schema_version"), 1);
    for statement in [
        "UPDATE reborn_schema SET singleton = FALSE",
        "UPDATE reborn_schema SET product = 'keida-hub-rewrite'",
        "UPDATE reborn_schema SET schema_version = 2",
    ] {
        assert_constraint(&mut connection, statement, "23514").await;
    }
    assert_constraint(&mut connection, "INSERT INTO reborn_schema (singleton,product,schema_version) VALUES (TRUE,'keida-hub-reborn',1)", "23505").await;

    let ledger_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM _sqlx_migrations")
        .fetch_one(&mut connection)
        .await
        .expect("migration ledger count");
    assert_eq!(ledger_count, 1);
    assert_migrated(completed(database.migrate()).await);
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM _sqlx_migrations")
            .fetch_one(&mut connection)
            .await
            .expect("repeated ledger count"),
        ledger_count
    );

    // Restore fixture bytes after each fault; acceptance requires rejecting the fault, not trusting a copied result.
    let checksum: Vec<u8> =
        sqlx::query_scalar("SELECT checksum FROM _sqlx_migrations WHERE version = 1")
            .fetch_one(&mut connection)
            .await
            .expect("saved fixture checksum");
    connection
        .execute("UPDATE _sqlx_migrations SET checksum = decode('00', 'hex') WHERE version = 1")
        .await
        .expect("introduce checksum mismatch");
    server.readiness(false).await;
    sqlx::query("UPDATE _sqlx_migrations SET checksum = $1 WHERE version = 1")
        .bind(checksum)
        .execute(&mut connection)
        .await
        .expect("restore fixture checksum");
    server.readiness(true).await;

    connection
        .execute("UPDATE _sqlx_migrations SET success = FALSE WHERE version = 1")
        .await
        .expect("introduce incomplete migration");
    server.readiness(false).await;
    connection
        .execute("UPDATE _sqlx_migrations SET success = TRUE WHERE version = 1")
        .await
        .expect("restore migration completion");
    server.readiness(true).await;

    connection.execute("INSERT INTO _sqlx_migrations (version, description, success, checksum, execution_time) VALUES (999, 'future-fixture', TRUE, decode('00','hex'), 0)").await.expect("introduce unsupported future schema");
    server.readiness(false).await;
    connection
        .execute("DELETE FROM _sqlx_migrations WHERE version = 999")
        .await
        .expect("remove owned future fixture");
    server.readiness(true).await;

    connection
        .execute("DELETE FROM reborn_schema")
        .await
        .expect("remove singleton fixture row");
    server.readiness(false).await;
    connection.execute("INSERT INTO reborn_schema (singleton,product,schema_version) VALUES (TRUE,'keida-hub-reborn',1)").await.expect("restore singleton fixture row");
    server.readiness(true).await;
}

#[tokio::test]
async fn concurrent_migration_commands_leave_one_complete_migration_and_valid_metadata() {
    let database = Database::create().await;
    let first = database.migrate();
    let second = database.migrate();
    let (first, second) = tokio::join!(completed(first), completed(second));
    assert_migrated(first);
    assert_migrated(second);
    let mut connection = database.connect().await;
    let row = sqlx::query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE success AND version = 1) AS completed FROM _sqlx_migrations")
        .fetch_one(&mut connection).await.expect("inspect concurrent ledger");
    assert_eq!(row.get::<i64, _>("total"), 1);
    assert_eq!(row.get::<i64, _>("completed"), 1);
    let server = Server::start(&database).await;
    server.readiness(true).await;
}
