#[path = "postgres_contracts/discord.rs"]
mod discord;
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
    assert_eq!(metadata[0].get::<i32, _>("schema_version"), 12);
    for statement in [
        "UPDATE reborn_schema SET singleton = FALSE",
        "UPDATE reborn_schema SET product = 'keida-hub-rewrite'",
        "UPDATE reborn_schema SET schema_version = 13",
    ] {
        assert_constraint(&mut connection, statement, "23514").await;
    }
    assert_constraint(&mut connection, "INSERT INTO reborn_schema (singleton,product,schema_version) VALUES (TRUE,'keida-hub-reborn',12)", "23505").await;

    let ledger_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM _sqlx_migrations")
        .fetch_one(&mut connection)
        .await
        .expect("migration ledger count");
    assert_eq!(ledger_count, 12);
    assert_migrated(completed(database.migrate()).await);
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM _sqlx_migrations")
            .fetch_one(&mut connection)
            .await
            .expect("repeated ledger count"),
        ledger_count
    );

    // Restore fixture bytes after each fault; acceptance requires rejecting the fault, not trusting a copied result.
    for version in [1_i64, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] {
        let checksum: Vec<u8> =
            sqlx::query_scalar("SELECT checksum FROM _sqlx_migrations WHERE version = $1")
                .bind(version)
                .fetch_one(&mut connection)
                .await
                .expect("saved fixture checksum");
        sqlx::query(
            "UPDATE _sqlx_migrations SET checksum = decode('00', 'hex') WHERE version = $1",
        )
        .bind(version)
        .execute(&mut connection)
        .await
        .expect("introduce checksum mismatch");
        server.readiness(false).await;
        sqlx::query("UPDATE _sqlx_migrations SET checksum = $1 WHERE version = $2")
            .bind(checksum)
            .bind(version)
            .execute(&mut connection)
            .await
            .expect("restore fixture checksum");
        server.readiness(true).await;

        sqlx::query("UPDATE _sqlx_migrations SET success = FALSE WHERE version = $1")
            .bind(version)
            .execute(&mut connection)
            .await
            .expect("introduce incomplete migration");
        server.readiness(false).await;
        sqlx::query("UPDATE _sqlx_migrations SET success = TRUE WHERE version = $1")
            .bind(version)
            .execute(&mut connection)
            .await
            .expect("restore migration completion");
        server.readiness(true).await;
    }

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
    connection.execute("INSERT INTO reborn_schema (singleton,product,schema_version) VALUES (TRUE,'keida-hub-reborn',12)").await.expect("restore singleton fixture row");
    server.readiness(true).await;
}

#[tokio::test]
async fn concurrent_migration_commands_leave_all_complete_migrations_and_valid_metadata() {
    let database = Database::create().await;
    let first = database.migrate();
    let second = database.migrate();
    let (first, second) = tokio::join!(completed(first), completed(second));
    assert_migrated(first);
    assert_migrated(second);
    let mut connection = database.connect().await;
    let row = sqlx::query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE success AND version IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)) AS completed FROM _sqlx_migrations")
        .fetch_one(&mut connection).await.expect("inspect concurrent ledger");
    assert_eq!(row.get::<i64, _>("total"), 12);
    assert_eq!(row.get::<i64, _>("completed"), 12);
    let server = Server::start(&database).await;
    server.readiness(true).await;
}

#[tokio::test]
async fn actual_schema_one_upgrades_through_auth_to_workspace_without_losing_existing_data() {
    let database = Database::create().await;
    let mut connection = database.connect().await;
    // Resolve the real versioned migration source. Restrict SQLx's actual
    // migrator to the already accepted first migration; do not synthesize its
    // SQL, checksum or ledger row in the fixture.
    let source = sqlx::migrate!("../../migrations");
    let accepted_first = source
        .iter()
        .find(|migration| migration.version == 1)
        .expect("accepted migration0001 remains in the actual source")
        .clone();
    let prior = sqlx::migrate::Migrator::with_migrations(vec![accepted_first.clone()]);
    prior
        .run(&mut connection)
        .await
        .expect("install the real accepted schema one");
    let before =
        sqlx::query("SELECT product, schema_version FROM reborn_schema WHERE singleton = TRUE")
            .fetch_one(&mut connection)
            .await
            .expect("inspect actual prior metadata");
    assert_eq!(before.get::<String, _>("product"), "keida-hub-reborn");
    assert_eq!(before.get::<i32, _>("schema_version"), 1);
    let prior_rows =
        sqlx::query("SELECT version, checksum, success FROM _sqlx_migrations ORDER BY version")
            .fetch_all(&mut connection)
            .await
            .expect("inspect actual prior ledger");
    assert_eq!(prior_rows.len(), 1);
    assert_eq!(prior_rows[0].get::<i64, _>("version"), 1);
    assert!(prior_rows[0].get::<bool, _>("success"));
    assert_eq!(
        prior_rows[0].get::<Vec<u8>, _>("checksum"),
        accepted_first.checksum.as_ref()
    );
    let absent: Option<String> = sqlx::query_scalar("SELECT to_regclass('users')::text")
        .fetch_one(&mut connection)
        .await
        .expect("prior schema has no auth accounts");
    assert!(absent.is_none());

    connection
        .execute(
            "CREATE TABLE upgrade_fixture_sentinel (id bigint PRIMARY KEY, retained text NOT NULL)",
        )
        .await
        .expect("create owned unrelated pre-upgrade fixture");
    sqlx::query("INSERT INTO upgrade_fixture_sentinel (id, retained) VALUES ($1, $2)")
        .bind(101_i64)
        .bind("accepted-before-auth")
        .execute(&mut connection)
        .await
        .expect("save pre-upgrade sentinel");
    let server = Server::start(&database).await;
    server.readiness(false).await;
    assert_migrated(completed(database.migrate()).await);
    server.readiness(true).await;

    let after =
        sqlx::query("SELECT product, schema_version FROM reborn_schema WHERE singleton = TRUE")
            .fetch_one(&mut connection)
            .await
            .expect("inspect upgraded metadata");
    assert_eq!(after.get::<String, _>("product"), "keida-hub-reborn");
    assert_eq!(after.get::<i32, _>("schema_version"), 12);
    let ledger =
        sqlx::query("SELECT version, checksum, success FROM _sqlx_migrations ORDER BY version")
            .fetch_all(&mut connection)
            .await
            .expect("inspect upgraded ledger");
    assert_eq!(ledger.len(), 12);
    assert_eq!(ledger[0].get::<i64, _>("version"), 1);
    assert_eq!(ledger[1].get::<i64, _>("version"), 2);
    assert_eq!(ledger[2].get::<i64, _>("version"), 3);
    assert_eq!(ledger[3].get::<i64, _>("version"), 4);
    assert!(ledger.iter().all(|row| row.get::<bool, _>("success")));
    assert_eq!(
        ledger[0].get::<Vec<u8>, _>("checksum"),
        prior_rows[0].get::<Vec<u8>, _>("checksum")
    );
    let counts = sqlx::query("SELECT (SELECT COUNT(*) FROM users) AS users, (SELECT COUNT(*) FROM sessions) AS sessions, (SELECT COUNT(*) FROM auth_throttles) AS throttles")
        .fetch_one(&mut connection)
        .await
        .expect("inspect fresh auth rows after upgrade");
    assert_eq!(counts.get::<i64, _>("users"), 0);
    assert_eq!(counts.get::<i64, _>("sessions"), 0);
    assert_eq!(counts.get::<i64, _>("throttles"), 66);
    let sentinel = sqlx::query("SELECT id, retained FROM upgrade_fixture_sentinel")
        .fetch_all(&mut connection)
        .await
        .expect("read preserved pre-upgrade data");
    assert_eq!(sentinel.len(), 1);
    assert_eq!(sentinel[0].get::<i64, _>("id"), 101);
    assert_eq!(
        sentinel[0].get::<String, _>("retained"),
        "accepted-before-auth"
    );
}

#[tokio::test]
async fn schema_two_upgrade_preserves_real_account_session_and_accepted_migration_checksums() {
    let database = Database::create().await;
    let mut connection = database.connect().await;
    let source = sqlx::migrate!("../../migrations");
    let previous: Vec<_> = source.iter().filter(|m| m.version <= 2).cloned().collect();
    assert_eq!(previous.len(), 2);
    sqlx::migrate::Migrator::with_migrations(previous.clone())
        .run(&mut connection)
        .await
        .expect("actual prior schema two");
    connection.execute("INSERT INTO users (username,password_phc,role,generation) VALUES ('upgrade_owner','$argon2id$v=19$m=19456,t=2,p=1$fictional-fixture-not-used-for-login','owner',7)").await.expect("prior account fixture");
    connection.execute("UPDATE auth_state SET key_id=decode(repeat('ab',32),'hex'), owner_id=(SELECT id FROM users WHERE username='upgrade_owner') WHERE singleton=TRUE").await.expect("prior bound owner");
    connection.execute("INSERT INTO sessions (verifier,account_id,generation,created_at,expires_at) SELECT decode(repeat('cd',32),'hex'),id,generation,100,200 FROM users").await.expect("prior session fixture");
    let before = sqlx::query("SELECT id,username,password_phc,role,generation FROM users")
        .fetch_one(&mut connection)
        .await
        .expect("prior user");
    assert_migrated(completed(database.migrate()).await);
    let after = sqlx::query("SELECT id,username,password_phc,role,generation FROM users")
        .fetch_one(&mut connection)
        .await
        .expect("retained user");
    for field in ["username", "password_phc", "role"] {
        assert_eq!(
            before.get::<String, _>(field),
            after.get::<String, _>(field)
        );
    }
    for field in ["id", "generation"] {
        assert_eq!(before.get::<i64, _>(field), after.get::<i64, _>(field));
    }
    let session = sqlx::query(
        "SELECT generation,created_at,expires_at,encode(verifier,'hex') AS verifier FROM sessions",
    )
    .fetch_one(&mut connection)
    .await
    .expect("retained session");
    assert_eq!(session.get::<i64, _>("generation"), 7);
    assert_eq!(session.get::<i64, _>("created_at"), 100);
    assert_eq!(session.get::<i64, _>("expires_at"), 200);
    assert_eq!(session.get::<String, _>("verifier"), "cd".repeat(32));
    for migration in previous {
        let checksum: Vec<u8> =
            sqlx::query_scalar("SELECT checksum FROM _sqlx_migrations WHERE version=$1")
                .bind(migration.version)
                .fetch_one(&mut connection)
                .await
                .expect("retained accepted checksum");
        assert_eq!(checksum, migration.checksum.as_ref());
    }
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM workspace_notes")
            .fetch_one(&mut connection)
            .await
            .expect("no invented notes"),
        0
    );
    assert_eq!(
        sqlx::query_scalar::<_, i32>("SELECT schema_version FROM reborn_schema")
            .fetch_one(&mut connection)
            .await
            .expect("current schema"),
        12
    );
}

#[tokio::test]
async fn schema_three_upgrade_preserves_saved_notes_auth_and_every_prior_migration_checksum() {
    let database = Database::create().await;
    let mut connection = database.connect().await;
    let source = sqlx::migrate!("../../migrations");
    let prior: Vec<_> = source.iter().filter(|m| m.version <= 3).cloned().collect();
    assert_eq!(prior.len(), 3);
    sqlx::migrate::Migrator::with_migrations(prior.clone())
        .run(&mut connection)
        .await
        .expect("actual accepted schema three");
    connection.execute("INSERT INTO users (username,password_phc,role,generation) VALUES ('previous_workspace_owner','$argon2id$v=19$m=19456,t=2,p=1$nonlogin-fixture','owner',9)").await.expect("prior auth row");
    connection.execute("INSERT INTO workspace_notes (account_id,body,revision) SELECT id,'A real pre-connection saved note 海',21 FROM users").await.expect("prior accepted workspace data");
    assert_migrated(completed(database.migrate()).await);
    let row=sqlx::query("SELECT u.username,u.generation,n.body,n.revision FROM users u JOIN workspace_notes n ON n.account_id=u.id").fetch_one(&mut connection).await.expect("retained account and note");
    assert_eq!(row.get::<String, _>("username"), "previous_workspace_owner");
    assert_eq!(row.get::<i64, _>("generation"), 9);
    assert_eq!(
        row.get::<String, _>("body"),
        "A real pre-connection saved note 海"
    );
    assert_eq!(row.get::<i64, _>("revision"), 21);
    let new = sqlx::query("SELECT revision,sealed FROM crafty_connection")
        .fetch_one(&mut connection)
        .await
        .expect("no inherited connection");
    assert_eq!(new.get::<i64, _>("revision"), 0);
    assert!(new.get::<Option<Vec<u8>>, _>("sealed").is_none());
    for migration in prior {
        let checksum: Vec<u8> =
            sqlx::query_scalar("SELECT checksum FROM _sqlx_migrations WHERE version=$1")
                .bind(migration.version)
                .fetch_one(&mut connection)
                .await
                .expect("accepted migration unchanged");
        assert_eq!(checksum, migration.checksum.as_ref());
    }
    assert_constraint(
        &mut connection,
        "UPDATE crafty_connection SET revision=-1",
        "23514",
    )
    .await;
    assert_constraint(
        &mut connection,
        "UPDATE crafty_connection SET sealed=decode('00','hex')",
        "23514",
    )
    .await;
}

#[tokio::test]
async fn schema_four_upgrade_preserves_installed_notes_sessions_and_sealed_connection() {
    let database = Database::create().await;
    let mut db = database.connect().await;
    let source = sqlx::migrate!("../../migrations");
    let prior: Vec<_> = source.iter().filter(|m| m.version <= 4).cloned().collect();
    assert_eq!(prior.len(), 4);
    sqlx::migrate::Migrator::with_migrations(prior.clone())
        .run(&mut db)
        .await
        .expect("actual installed schema four");
    db.execute("INSERT INTO users (username,password_phc,role,generation) VALUES ('installed_owner','$argon2id$v=19$m=19456,t=2,p=1$nonlogin-fixture','owner',9)").await.unwrap();
    db.execute("INSERT INTO workspace_notes (account_id,body,revision) SELECT id,'An installed saved note 海',23 FROM users").await.unwrap();
    db.execute("INSERT INTO sessions (verifier,account_id,generation,created_at,expires_at) SELECT decode(repeat('ab',32),'hex'),id,9,100,200 FROM users").await.unwrap();
    db.execute("UPDATE crafty_connection SET revision=7, sealed=decode(repeat('cd',100),'hex')")
        .await
        .unwrap();
    assert_migrated(completed(database.migrate()).await);
    let row = sqlx::query("SELECT u.username,u.generation,n.body,n.revision,s.created_at,s.expires_at,encode(s.verifier,'hex') AS verifier FROM users u JOIN workspace_notes n ON n.account_id=u.id JOIN sessions s ON s.account_id=u.id").fetch_one(&mut db).await.unwrap();
    assert_eq!(row.get::<String, _>("body"), "An installed saved note 海");
    assert_eq!(row.get::<i64, _>("revision"), 23);
    assert_eq!(row.get::<i64, _>("generation"), 9);
    assert_eq!(row.get::<i64, _>("created_at"), 100);
    assert_eq!(row.get::<i64, _>("expires_at"), 200);
    assert_eq!(row.get::<String, _>("verifier"), "ab".repeat(32));
    let sealed =
        sqlx::query("SELECT revision,encode(sealed,'hex') AS sealed FROM crafty_connection")
            .fetch_one(&mut db)
            .await
            .unwrap();
    assert_eq!(sealed.get::<i64, _>("revision"), 7);
    assert_eq!(sealed.get::<String, _>("sealed"), "cd".repeat(100));
    for migration in prior {
        let checksum: Vec<u8> =
            sqlx::query_scalar("SELECT checksum FROM _sqlx_migrations WHERE version=$1")
                .bind(migration.version)
                .fetch_one(&mut db)
                .await
                .unwrap();
        assert_eq!(checksum, migration.checksum.as_ref());
    }
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT revision FROM directory_state")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        0
    );
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM directory_services")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        0
    );
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM directory_pins")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        0
    );
    assert_constraint(&mut db, "UPDATE directory_state SET revision=-1", "23514").await;
    assert_constraint(&mut db,"INSERT INTO directory_pins (account_id,revision,ids) SELECT id,1,ARRAY[NULL]::bigint[] FROM users","23514").await;
}

#[tokio::test]
async fn schema_five_upgrade_keeps_directory_pins_and_all_prior_data_without_backfilling_activity()
{
    let database = Database::create().await;
    let mut db = database.connect().await;
    let source = sqlx::migrate!("../../migrations");
    let prior: Vec<_> = source.iter().filter(|m| m.version <= 5).cloned().collect();
    assert_eq!(prior.len(), 5);
    sqlx::migrate::Migrator::with_migrations(prior.clone())
        .run(&mut db)
        .await
        .unwrap();
    db.execute("INSERT INTO users (username,password_phc,role,generation) VALUES ('installed_owner','$argon2id$v=19$m=19456,t=2,p=1$nonlogin-fixture','owner',9)").await.unwrap();
    db.execute("INSERT INTO workspace_notes SELECT id,'An installed note',23 FROM users")
        .await
        .unwrap();
    db.execute("INSERT INTO sessions (verifier,account_id,generation,created_at,expires_at) SELECT decode(repeat('ab',32),'hex'),id,9,100,200 FROM users").await.unwrap();
    db.execute("UPDATE crafty_connection SET revision=7,sealed=decode(repeat('cd',100),'hex')")
        .await
        .unwrap();
    db.execute("INSERT INTO directory_services (name,category,description,url) VALUES ('Installed service','Home','Retained','https://example.test/')").await.unwrap();
    db.execute("UPDATE directory_state SET revision=3")
        .await
        .unwrap();
    db.execute("INSERT INTO directory_pins SELECT id,4,ARRAY[1]::bigint[] FROM users")
        .await
        .unwrap();
    let before: Value = sqlx::query_scalar("SELECT jsonb_build_object('users',(SELECT jsonb_agg(u) FROM users u),'notes',(SELECT jsonb_agg(n) FROM workspace_notes n),'sessions',(SELECT jsonb_agg(s) FROM sessions s),'connection',(SELECT jsonb_agg(c) FROM crafty_connection c),'services',(SELECT jsonb_agg(d) FROM directory_services d),'pins',(SELECT jsonb_agg(p) FROM directory_pins p))").fetch_one(&mut db).await.unwrap();
    assert_migrated(completed(database.migrate()).await);
    let after: Value = sqlx::query_scalar("SELECT jsonb_build_object('users',(SELECT jsonb_agg(u) FROM users u),'notes',(SELECT jsonb_agg(n) FROM workspace_notes n),'sessions',(SELECT jsonb_agg(s) FROM sessions s),'connection',(SELECT jsonb_agg(c) FROM crafty_connection c),'services',(SELECT jsonb_agg(d) FROM directory_services d),'pins',(SELECT jsonb_agg(p) FROM directory_pins p))").fetch_one(&mut db).await.unwrap();
    assert_eq!(before, after);
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM activity_events")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        0
    );
    for migration in prior {
        let checksum: Vec<u8> =
            sqlx::query_scalar("SELECT checksum FROM _sqlx_migrations WHERE version=$1")
                .bind(migration.version)
                .fetch_one(&mut db)
                .await
                .unwrap();
        assert_eq!(checksum, migration.checksum.as_ref());
    }
    assert_constraint(&mut db, "INSERT INTO activity_events (account_id,kind,revision,occurred_at) SELECT id,'untrusted payload',1,100 FROM users", "23514").await;
    assert_constraint(&mut db, "INSERT INTO activity_events (account_id,kind,revision,occurred_at) SELECT id,'note_saved',0,100 FROM users", "23514").await;
}

#[tokio::test]
async fn schema_six_upgrade_preserves_activity_sequences_and_prior_data_without_notification_backfill()
 {
    let database = Database::create().await;
    let mut db = database.connect().await;
    let source = sqlx::migrate!("../../migrations");
    let prior: Vec<_> = source.iter().filter(|m| m.version <= 6).cloned().collect();
    sqlx::migrate::Migrator::with_migrations(prior.clone())
        .run(&mut db)
        .await
        .unwrap();
    db.execute("INSERT INTO users (username,password_phc,role,generation) VALUES ('installed_owner','$argon2id$v=19$m=19456,t=2,p=1$nonlogin-fixture','owner',9)").await.unwrap();
    db.execute("INSERT INTO workspace_notes SELECT id,'Installed note',23 FROM users")
        .await
        .unwrap();
    db.execute("INSERT INTO activity_events (account_id,kind,revision,occurred_at) SELECT id,'note_saved',23,100 FROM users").await.unwrap();
    let fingerprint = "SELECT jsonb_build_object('users',(SELECT jsonb_agg(u) FROM users u),'notes',(SELECT jsonb_agg(n) FROM workspace_notes n),'activity',(SELECT jsonb_agg(a) FROM activity_events a),'activity_sequence',(SELECT last_value FROM activity_events_id_seq),'user_sequence',(SELECT last_value FROM users_id_seq))";
    let before: Value = sqlx::query_scalar(fingerprint)
        .fetch_one(&mut db)
        .await
        .unwrap();
    assert_migrated(completed(database.migrate()).await);
    let after: Value = sqlx::query_scalar(fingerprint)
        .fetch_one(&mut db)
        .await
        .unwrap();
    assert_eq!(before, after);
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM notification_groups")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        0
    );
    for m in prior {
        let checksum: Vec<u8> =
            sqlx::query_scalar("SELECT checksum FROM _sqlx_migrations WHERE version=$1")
                .bind(m.version)
                .fetch_one(&mut db)
                .await
                .unwrap();
        assert_eq!(checksum, m.checksum.as_ref());
    }
    assert_constraint(
        &mut db,
        "INSERT INTO notification_groups SELECT id,'services',1,2,'service_added',1,100 FROM users",
        "23514",
    )
    .await;
    assert_constraint(&mut db,"INSERT INTO notification_groups SELECT id,'services',1,0,'connection_saved',1,100 FROM users","23514").await;
}

#[tokio::test]
async fn schema_seven_upgrade_retains_notification_reads_and_all_existing_state_without_layout_backfill()
 {
    let database = Database::create().await;
    let mut db = database.connect().await;
    let source = sqlx::migrate!("../../migrations");
    let prior: Vec<_> = source.iter().filter(|m| m.version <= 7).cloned().collect();
    assert_eq!(prior.len(), 7);
    sqlx::migrate::Migrator::with_migrations(prior.clone())
        .run(&mut db)
        .await
        .unwrap();
    db.execute("INSERT INTO users (username,password_phc,role,generation) VALUES ('retained_owner','$argon2id$v=19$m=19456,t=2,p=1$nonlogin-fixture','owner',9)").await.unwrap();
    db.execute("UPDATE auth_state SET owner_id=1,key_id=decode(repeat('ab',32),'hex')")
        .await
        .unwrap();
    db.execute("INSERT INTO workspace_notes SELECT id,'Installed note 海',23 FROM users")
        .await
        .unwrap();
    db.execute("INSERT INTO sessions (verifier,account_id,generation,created_at,expires_at) SELECT decode(repeat('cd',32),'hex'),id,9,100,200 FROM users").await.unwrap();
    db.execute("UPDATE crafty_connection SET revision=7,sealed=decode(repeat('ef',100),'hex')")
        .await
        .unwrap();
    db.execute("INSERT INTO directory_services (name,category,description,url) VALUES ('Retained service','Home','Saved','https://example.test/')").await.unwrap();
    db.execute("UPDATE directory_state SET revision=3")
        .await
        .unwrap();
    db.execute("INSERT INTO directory_pins SELECT id,4,ARRAY[1]::bigint[] FROM users")
        .await
        .unwrap();
    db.execute("INSERT INTO activity_events (account_id,kind,revision,occurred_at) SELECT id,'note_saved',23,100 FROM users").await.unwrap();
    db.execute("INSERT INTO notification_groups SELECT id,'services',5,3,'service_updated',8,101 FROM users").await.unwrap();
    let fingerprint = "SELECT jsonb_build_object('users',(SELECT jsonb_agg(u) FROM users u),'sessions',(SELECT jsonb_agg(s) FROM sessions s),'auth',(SELECT jsonb_agg(a) FROM auth_state a),'throttles',(SELECT jsonb_agg(t ORDER BY scope) FROM auth_throttles t),'notes',(SELECT jsonb_agg(n) FROM workspace_notes n),'connection',(SELECT jsonb_agg(c) FROM crafty_connection c),'directory_state',(SELECT jsonb_agg(d) FROM directory_state d),'services',(SELECT jsonb_agg(d) FROM directory_services d),'pins',(SELECT jsonb_agg(p) FROM directory_pins p),'activity',(SELECT jsonb_agg(a) FROM activity_events a),'notifications',(SELECT jsonb_agg(g) FROM notification_groups g),'user_seq',(SELECT last_value FROM users_id_seq),'service_seq',(SELECT last_value FROM directory_services_id_seq),'activity_seq',(SELECT last_value FROM activity_events_id_seq))";
    let before: Value = sqlx::query_scalar(fingerprint)
        .fetch_one(&mut db)
        .await
        .unwrap();
    assert_migrated(completed(database.migrate()).await);
    let after: Value = sqlx::query_scalar(fingerprint)
        .fetch_one(&mut db)
        .await
        .unwrap();
    assert_eq!(before, after);
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM dashboard_layouts")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        0
    );
    for migration in prior {
        let checksum: Vec<u8> =
            sqlx::query_scalar("SELECT checksum FROM _sqlx_migrations WHERE version=$1")
                .bind(migration.version)
                .fetch_one(&mut db)
                .await
                .unwrap();
        assert_eq!(checksum, migration.checksum.as_ref());
    }
    for statement in [
        "INSERT INTO dashboard_layouts SELECT id,1,ARRAY[]::text[],TRUE,TRUE,TRUE FROM users",
        "INSERT INTO dashboard_layouts SELECT id,1,ARRAY['note','note','pins'],TRUE,TRUE,TRUE FROM users",
        "INSERT INTO dashboard_layouts SELECT id,1,ARRAY['note','connections','unknown'],TRUE,TRUE,TRUE FROM users",
        "INSERT INTO dashboard_layouts SELECT id,1,ARRAY['note',NULL,'pins'],TRUE,TRUE,TRUE FROM users",
        "INSERT INTO dashboard_layouts SELECT id,1,ARRAY[['note','connections','pins']],TRUE,TRUE,TRUE FROM users",
        "INSERT INTO dashboard_layouts SELECT id,1,'[0:2]={note,connections,pins}'::text[],TRUE,TRUE,TRUE FROM users",
    ] {
        assert_constraint(&mut db, statement, "23514").await;
    }
    assert_constraint(&mut db,"INSERT INTO dashboard_layouts SELECT id,0,ARRAY['note','connections','pins'],TRUE,TRUE,TRUE FROM users","23514").await;
    assert_constraint(&mut db,"INSERT INTO dashboard_layouts SELECT id,1,ARRAY['note','connections','pins'],FALSE,FALSE,FALSE FROM users","23514").await;
    db.execute("INSERT INTO dashboard_layouts SELECT id,1,ARRAY['pins','note','connections'],TRUE,FALSE,TRUE FROM users").await.unwrap();
    assert_constraint(&mut db,"INSERT INTO dashboard_layouts SELECT id,2,ARRAY['note','connections','pins'],TRUE,TRUE,TRUE FROM users","23505").await;
}

#[tokio::test]
async fn schema_eight_upgrade_preserves_all_prior_relations_sequences_and_immutable_migrations() {
    let database = Database::create().await;
    let mut db = database.connect().await;
    let source = sqlx::migrate!("../../migrations");
    let prior: Vec<_> = source.iter().filter(|m| m.version <= 8).cloned().collect();
    assert_eq!(prior.len(), 8);
    sqlx::migrate::Migrator::with_migrations(prior.clone())
        .run(&mut db)
        .await
        .expect("real accepted schema8");
    db.execute("INSERT INTO users (username,password_phc,role,generation) VALUES ('schema8_owner','$argon2id$v=19$m=19456,t=2,p=1$nonlogin-fixture','owner',9)").await.unwrap();
    db.execute("UPDATE auth_state SET owner_id=1,key_id=decode(repeat('ab',32),'hex')")
        .await
        .unwrap();
    db.execute("UPDATE auth_throttles SET window_start=123,attempts=2 WHERE scope=1")
        .await
        .unwrap();
    db.execute("INSERT INTO workspace_notes SELECT id,'Preserved private note 海',23 FROM users")
        .await
        .unwrap();
    db.execute("INSERT INTO sessions (verifier,account_id,generation,created_at,expires_at) SELECT decode(repeat('cd',32),'hex'),id,9,100,200 FROM users").await.unwrap();
    db.execute("UPDATE crafty_connection SET revision=7,sealed=decode(repeat('ef',100),'hex')")
        .await
        .unwrap();
    db.execute("INSERT INTO directory_services (name,category,description,url) VALUES ('Retained service','Home','Saved','https://example.test/')").await.unwrap();
    db.execute("UPDATE directory_state SET revision=3")
        .await
        .unwrap();
    db.execute("INSERT INTO directory_pins SELECT id,4,ARRAY[1]::bigint[] FROM users")
        .await
        .unwrap();
    db.execute("INSERT INTO activity_events (account_id,kind,revision,occurred_at) SELECT id,'note_saved',23,100 FROM users").await.unwrap();
    db.execute("INSERT INTO notification_groups SELECT id,'services',5,3,'service_updated',8,101 FROM users").await.unwrap();
    db.execute("INSERT INTO dashboard_layouts SELECT id,6,ARRAY['pins','note','connections'],FALSE,TRUE,TRUE FROM users").await.unwrap();
    for statement in [
        "SELECT setval('users_id_seq',31,FALSE)",
        "SELECT setval('directory_services_id_seq',57,TRUE)",
        "SELECT setval('activity_events_id_seq',103,FALSE)",
    ] {
        db.execute(statement).await.unwrap();
    }
    let fingerprint = "SELECT jsonb_build_object('users',(SELECT jsonb_agg(u ORDER BY id) FROM users u),'sessions',(SELECT jsonb_agg(s ORDER BY verifier) FROM sessions s),'auth',(SELECT jsonb_agg(a) FROM auth_state a),'throttles',(SELECT jsonb_agg(t ORDER BY scope) FROM auth_throttles t),'notes',(SELECT jsonb_agg(n ORDER BY account_id) FROM workspace_notes n),'connection',(SELECT jsonb_agg(c) FROM crafty_connection c),'directory_state',(SELECT jsonb_agg(d) FROM directory_state d),'services',(SELECT jsonb_agg(d ORDER BY id) FROM directory_services d),'pins',(SELECT jsonb_agg(p ORDER BY account_id) FROM directory_pins p),'activity',(SELECT jsonb_agg(a ORDER BY id) FROM activity_events a),'notifications',(SELECT jsonb_agg(g ORDER BY account_id,category) FROM notification_groups g),'layouts',(SELECT jsonb_agg(l ORDER BY account_id) FROM dashboard_layouts l),'user_seq',(SELECT jsonb_build_object('value',last_value,'called',is_called) FROM users_id_seq),'service_seq',(SELECT jsonb_build_object('value',last_value,'called',is_called) FROM directory_services_id_seq),'activity_seq',(SELECT jsonb_build_object('value',last_value,'called',is_called) FROM activity_events_id_seq))";
    let before: Value = sqlx::query_scalar(fingerprint)
        .fetch_one(&mut db)
        .await
        .unwrap();
    assert_migrated(completed(database.migrate()).await);
    let after: Value = sqlx::query_scalar(fingerprint)
        .fetch_one(&mut db)
        .await
        .unwrap();
    assert_eq!(
        before, after,
        "schema9 changed accepted data or sequence state"
    );
    for migration in prior {
        let checksum: Vec<u8> =
            sqlx::query_scalar("SELECT checksum FROM _sqlx_migrations WHERE version=$1")
                .bind(migration.version)
                .fetch_one(&mut db)
                .await
                .unwrap();
        assert_eq!(checksum, migration.checksum.as_ref());
    }
    for table in ["provider_observations", "provider_server_observations"] {
        let count: i64 = if table == "provider_observations" {
            sqlx::query_scalar("SELECT count(*) FROM provider_observations")
                .fetch_one(&mut db)
                .await
                .unwrap()
        } else {
            sqlx::query_scalar("SELECT count(*) FROM provider_server_observations")
                .fetch_one(&mut db)
                .await
                .unwrap()
        };
        assert_eq!(count, 0, "migration invented provider history");
    }
    for statement in [
        "INSERT INTO provider_observations (sample_id,connection_revision,checked_at,complete) VALUES (decode('ab','hex'),1,60,FALSE)",
        "INSERT INTO provider_observations (sample_id,connection_revision,checked_at,complete) VALUES (decode(repeat('ab',16),'hex'),0,60,FALSE)",
        "INSERT INTO provider_observations (sample_id,connection_revision,checked_at,complete) VALUES (decode(repeat('ab',16),'hex'),1,-1,FALSE)",
        "INSERT INTO provider_observations (sample_id,connection_revision,checked_at,complete,error) VALUES (decode(repeat('ab',16),'hex'),1,60,FALSE,'raw stack trace')",
    ] {
        assert_constraint(&mut db, statement, "23514").await;
    }
    db.execute("INSERT INTO provider_observations (sample_id,connection_revision,checked_at,complete,error) VALUES (decode(repeat('ab',16),'hex'),1,60,FALSE,'unavailable')").await.unwrap();
    assert_constraint(&mut db, "INSERT INTO provider_observations (sample_id,connection_revision,checked_at,complete) VALUES (decode(repeat('cd',16),'hex'),1,119,FALSE)", "23505").await;
    assert_constraint(&mut db, "INSERT INTO provider_observations (sample_id,connection_revision,checked_at,complete) VALUES (decode(repeat('ab',16),'hex'),1,120,FALSE)", "23505").await;
    for statement in [
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,freshness) SELECT min(id),0,'Reviewed','unknown','unknown' FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,freshness) SELECT min(id),9,'Reviewed','unknown','unknown' FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,freshness) SELECT min(id),1,'   ','unknown','unknown' FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,freshness) SELECT min(id),1,E'unsafe\nname','unknown','unknown' FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,freshness) SELECT min(id),1,repeat('海',27),'unknown','unknown' FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,freshness) SELECT min(id),1,'Reviewed','ready','fresh' FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,players,freshness) SELECT min(id),1,'Reviewed','running',-1,'fresh' FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,capacity,freshness) SELECT min(id),1,'Reviewed','running',1000001,'fresh' FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,collected_at,freshness) SELECT min(id),1,'Reviewed','running',-1,'fresh' FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,provider_at,freshness) SELECT min(id),1,'Reviewed','running',-1,'fresh' FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,freshness) SELECT min(id),1,'Reviewed','unknown','live' FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,freshness,error) SELECT min(id),1,'Reviewed','unknown','unknown','private raw failure' FROM provider_observations",
    ] {
        assert_constraint(&mut db, statement, "23514").await;
    }
    db.execute("INSERT INTO provider_server_observations (batch_id,ordinal,name,state,players,capacity,collected_at,provider_at,freshness,error) SELECT min(id),1,'Valid zero','running',0,20,60,59,'fresh',NULL FROM provider_observations").await.unwrap();
    db.execute("INSERT INTO provider_server_observations (batch_id,ordinal,name,state,players,capacity,collected_at,provider_at,freshness,error) SELECT min(id),2,'Unknown remains null','unknown',NULL,NULL,NULL,NULL,'unknown','unavailable' FROM provider_observations").await.unwrap();
    let rows =
        sqlx::query("SELECT players,capacity FROM provider_server_observations ORDER BY ordinal")
            .fetch_all(&mut db)
            .await
            .unwrap();
    assert_eq!(rows[0].get::<Option<i64>, _>("players"), Some(0));
    assert_eq!(rows[1].get::<Option<i64>, _>("players"), None);
    db.execute("DELETE FROM provider_observations")
        .await
        .unwrap();
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM provider_server_observations")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        0,
        "retention must remove child samples with their batch"
    );
}

struct RuntimeRole {
    name: String,
    url: String,
}
impl Drop for RuntimeRole {
    fn drop(&mut self) {
        let name = self.name.clone();
        let url = self.url.clone();
        let result = std::thread::spawn(move || {
            let runtime = tokio::runtime::Builder::new_current_thread()
                .enable_all()
                .build()
                .map_err(|_| ())?;
            runtime.block_on(async move {
                let mut db = PgConnection::connect(&url).await.map_err(|_| ())?;
                // Owned, generated ASCII identifier; this role has no authority outside its fixture.
                sqlx::raw_sql(sqlx::AssertSqlSafe(format!(
                    "DROP OWNED BY \"{name}\"; DROP ROLE \"{name}\""
                )))
                .execute(&mut db)
                .await
                .map_err(|_| ())?;
                Ok::<(), ()>(())
            })
        })
        .join();
        if !matches!(result, Ok(Ok(()))) {
            eprintln!("owned runtime role cleanup failed");
        }
    }
}

#[tokio::test]
async fn actual_runtime_grants_allow_observation_retention_without_rewrite_or_unrelated_deletion() {
    let database = Database::create().await;
    assert_migrated(completed(database.migrate()).await);
    let role = RuntimeRole {
        name: format!(
            "keida_reborn_role_{}_{:x}",
            std::process::id(),
            DATABASE_COUNTER.fetch_add(1, Ordering::Relaxed)
        ),
        url: database.url.clone(),
    };
    assert!(
        role.name.len() <= 63
            && role
                .name
                .bytes()
                .all(|b| b.is_ascii_alphanumeric() || b == b'_')
    );
    let mut db = database.connect().await;
    // These audited dynamic identifiers come only from the checked fixture name.
    sqlx::raw_sql(sqlx::AssertSqlSafe(format!(
        "CREATE ROLE \"{}\" NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE",
        role.name
    )))
    .execute(&mut db)
    .await
    .unwrap();
    sqlx::raw_sql(sqlx::AssertSqlSafe(
        include_str!("../../../deploy/runtime-grants.sql").replace("reborn_app", &role.name),
    ))
    .execute(&mut db)
    .await
    .unwrap();
    sqlx::raw_sql(sqlx::AssertSqlSafe(format!("SET ROLE \"{}\"", role.name)))
        .execute(&mut db)
        .await
        .unwrap();
    db.execute("INSERT INTO provider_observations (sample_id,connection_revision,checked_at,complete,error) VALUES (decode(repeat('ab',16),'hex'),1,60,FALSE,'unavailable')").await.unwrap();
    db.execute("INSERT INTO provider_server_observations (batch_id,ordinal,name,state,freshness,error) SELECT id,1,'Runtime fixture','unknown','unknown','unavailable' FROM provider_observations").await.unwrap();
    for statement in [
        "UPDATE provider_observations SET complete=TRUE",
        "UPDATE provider_server_observations SET players=0",
        "DELETE FROM provider_server_observations",
        "DELETE FROM activity_events",
        "UPDATE activity_events SET revision=1",
        "DELETE FROM notification_groups",
        "DELETE FROM dashboard_layouts",
        "UPDATE reborn_schema SET schema_version=9",
        "UPDATE _sqlx_migrations SET checksum=decode('00','hex')",
        "CREATE TABLE unauthorized_runtime_table (id int)",
        "INSERT INTO media_connections (provider,revision) VALUES ('jellyfin',0)",
        "DELETE FROM media_connections",
        "UPDATE media_connections SET provider=provider",
    ] {
        assert_constraint(&mut db, statement, "42501").await;
    }
    assert_eq!(
        sqlx::query_scalar::<_, i64>(
            "SELECT count(*) FROM media_connections WHERE revision=0 AND sealed IS NULL"
        )
        .fetch_one(&mut db)
        .await
        .unwrap(),
        2
    );
    db.execute("UPDATE media_connections SET revision=1,sealed=decode(repeat('ad',100),'hex') WHERE provider='jellyfin'").await.unwrap();
    db.execute("UPDATE media_connections SET revision=2,sealed=NULL WHERE provider='jellyfin'")
        .await
        .unwrap();
    db.execute("DELETE FROM provider_observations")
        .await
        .unwrap();
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM provider_server_observations")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        0
    );
    db.execute("RESET ROLE").await.unwrap();
}

#[tokio::test]
async fn schema_nine_upgrade_preserves_fourteen_relations_four_sequences_and_all_prior_migrations()
{
    let database = Database::create().await;
    let mut db = database.connect().await;
    let source = sqlx::migrate!("../../migrations");
    let prior: Vec<_> = source.iter().filter(|m| m.version <= 9).cloned().collect();
    assert_eq!(prior.len(), 9);
    sqlx::migrate::Migrator::with_migrations(prior.clone())
        .run(&mut db)
        .await
        .unwrap();
    db.execute("INSERT INTO users (username,password_phc,role,generation) VALUES ('schema9_owner','$argon2id$v=19$m=19456,t=2,p=1$nonlogin-fixture','owner',9)").await.unwrap();
    db.execute("UPDATE auth_state SET owner_id=1,key_id=decode(repeat('ab',32),'hex')")
        .await
        .unwrap();
    db.execute("UPDATE auth_throttles SET window_start=123,attempts=2 WHERE scope=1")
        .await
        .unwrap();
    db.execute("INSERT INTO workspace_notes SELECT id,'All accepted private data survives 海',23 FROM users").await.unwrap();
    db.execute("INSERT INTO sessions (verifier,account_id,generation,created_at,expires_at) SELECT decode(repeat('cd',32),'hex'),id,9,100,200 FROM users").await.unwrap();
    db.execute("UPDATE crafty_connection SET revision=7,sealed=decode(repeat('ef',100),'hex')")
        .await
        .unwrap();
    db.execute("INSERT INTO directory_services (name,category,description,url) VALUES ('Retained service','Home','Saved','https://example.test/')").await.unwrap();
    db.execute("UPDATE directory_state SET revision=3")
        .await
        .unwrap();
    db.execute("INSERT INTO directory_pins SELECT id,4,ARRAY[1]::bigint[] FROM users")
        .await
        .unwrap();
    db.execute("INSERT INTO activity_events (account_id,kind,revision,occurred_at) SELECT id,'note_saved',23,100 FROM users").await.unwrap();
    db.execute("INSERT INTO notification_groups SELECT id,'services',5,3,'service_updated',8,101 FROM users").await.unwrap();
    db.execute("INSERT INTO dashboard_layouts SELECT id,6,ARRAY['pins','note','connections'],FALSE,TRUE,TRUE FROM users").await.unwrap();
    db.execute("INSERT INTO provider_observations (sample_id,connection_revision,checked_at,complete,error) VALUES (decode(repeat('ab',16),'hex'),7,120,FALSE,'unavailable')").await.unwrap();
    db.execute("INSERT INTO provider_server_observations (batch_id,ordinal,name,state,players,capacity,collected_at,provider_at,freshness,error) SELECT id,1,'Preserved zero','running',0,20,120,119,'fresh',NULL FROM provider_observations").await.unwrap();
    db.execute("INSERT INTO provider_server_observations (batch_id,ordinal,name,state,freshness,error) SELECT id,2,'Preserved unknown','unknown','unknown','unavailable' FROM provider_observations").await.unwrap();
    for statement in [
        "SELECT setval('users_id_seq',31,FALSE)",
        "SELECT setval('directory_services_id_seq',57,TRUE)",
        "SELECT setval('activity_events_id_seq',103,FALSE)",
        "SELECT setval('provider_observations_id_seq',147,FALSE)",
    ] {
        db.execute(statement).await.unwrap();
    }
    async fn retained(db: &mut PgConnection) -> Vec<Value> {
        let mut result = Vec::new();
        // Closed authored identifiers, never input; every accepted prior relation
        // and sequence is included independently of the new migration output.
        for table in [
            "users",
            "sessions",
            "auth_state",
            "auth_throttles",
            "workspace_notes",
            "crafty_connection",
            "directory_state",
            "directory_services",
            "directory_pins",
            "activity_events",
            "notification_groups",
            "dashboard_layouts",
            "provider_observations",
            "provider_server_observations",
        ] {
            let sql = format!(
                "SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY to_jsonb(t)::text),'[]'::jsonb) FROM {table} t"
            );
            result.push(
                sqlx::query_scalar(sqlx::AssertSqlSafe(sql.as_str()))
                    .fetch_one(&mut *db)
                    .await
                    .unwrap(),
            );
        }
        for sequence in [
            "users_id_seq",
            "directory_services_id_seq",
            "activity_events_id_seq",
            "provider_observations_id_seq",
        ] {
            let sql = format!("SELECT jsonb_build_array(last_value,is_called) FROM {sequence}");
            result.push(
                sqlx::query_scalar(sqlx::AssertSqlSafe(sql.as_str()))
                    .fetch_one(&mut *db)
                    .await
                    .unwrap(),
            );
        }
        result
    }
    let before = retained(&mut db).await;
    assert_eq!(before.len(), 18);
    assert_migrated(completed(database.migrate()).await);
    assert_eq!(
        retained(&mut db).await,
        before,
        "schema10 changed accepted data or sequence state"
    );
    for migration in prior {
        let checksum: Vec<u8> =
            sqlx::query_scalar("SELECT checksum FROM _sqlx_migrations WHERE version=$1")
                .bind(migration.version)
                .fetch_one(&mut db)
                .await
                .unwrap();
        assert_eq!(checksum, migration.checksum.as_ref());
    }
    let rows =
        sqlx::query("SELECT provider,revision,sealed FROM media_connections ORDER BY provider")
            .fetch_all(&mut db)
            .await
            .unwrap();
    assert_eq!(rows.len(), 2);
    assert_eq!(rows[0].get::<String, _>("provider"), "jellyfin");
    assert_eq!(rows[1].get::<String, _>("provider"), "seerr");
    for row in rows {
        assert_eq!(row.get::<i64, _>("revision"), 0);
        assert!(row.get::<Option<Vec<u8>>, _>("sealed").is_none());
    }
    for statement in [
        "INSERT INTO media_connections VALUES ('other',0,NULL)",
        "UPDATE media_connections SET revision=-1 WHERE provider='jellyfin'",
        "UPDATE media_connections SET sealed=decode(repeat('ab',100),'hex') WHERE provider='jellyfin'",
        "UPDATE media_connections SET revision=1,sealed=decode('ab','hex') WHERE provider='jellyfin'",
        "UPDATE media_connections SET revision=1,sealed=decode(repeat('ab',30101),'hex') WHERE provider='jellyfin'",
    ] {
        assert_constraint(&mut db, statement, "23514").await;
    }
}

#[tokio::test]
async fn queues_actual_runtime_role_can_only_read_and_update_the_three_fixed_connections() {
    let database = Database::create().await;
    assert_migrated(completed(database.migrate()).await);
    let role = RuntimeRole {
        name: format!(
            "keida_reborn_queue_role_{}_{:x}",
            std::process::id(),
            DATABASE_COUNTER.fetch_add(1, Ordering::Relaxed)
        ),
        url: database.url.clone(),
    };
    assert!(
        role.name.len() <= 63
            && role
                .name
                .bytes()
                .all(|b| b.is_ascii_alphanumeric() || b == b'_')
    );
    let mut db = database.connect().await;
    // Only the generated and checked fixture identifier enters dynamic SQL.
    sqlx::raw_sql(sqlx::AssertSqlSafe(format!(
        "CREATE ROLE \"{}\" NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE",
        role.name
    )))
    .execute(&mut db)
    .await
    .unwrap();
    sqlx::raw_sql(sqlx::AssertSqlSafe(
        include_str!("../../../deploy/runtime-grants.sql").replace("reborn_app", &role.name),
    ))
    .execute(&mut db)
    .await
    .unwrap();
    sqlx::raw_sql(sqlx::AssertSqlSafe(format!("SET ROLE \"{}\"", role.name)))
        .execute(&mut db)
        .await
        .unwrap();
    let rows =
        sqlx::query("SELECT provider,revision,sealed FROM queue_connections ORDER BY provider")
            .fetch_all(&mut db)
            .await
            .unwrap();
    assert_eq!(rows.len(), 3);
    assert_eq!(
        rows.iter()
            .map(|r| r.get::<String, _>("provider"))
            .collect::<Vec<_>>(),
        ["qbittorrent", "radarr", "sonarr"]
    );
    for row in rows {
        assert_eq!(row.get::<i64, _>("revision"), 0);
        assert!(row.get::<Option<Vec<u8>>, _>("sealed").is_none());
    }
    db.execute("UPDATE queue_connections SET revision=1,sealed=decode(repeat('ad',100),'hex') WHERE provider='sonarr'").await.unwrap();
    db.execute("UPDATE queue_connections SET revision=2,sealed=NULL WHERE provider='sonarr'")
        .await
        .unwrap();
    assert_eq!(
        sqlx::query_scalar::<_, i64>(
            "SELECT revision FROM queue_connections WHERE provider='sonarr'"
        )
        .fetch_one(&mut db)
        .await
        .unwrap(),
        2
    );
    for statement in [
        "INSERT INTO queue_connections (provider,revision) VALUES ('sonarr',0)",
        "DELETE FROM queue_connections WHERE provider='radarr'",
        "UPDATE queue_connections SET provider=provider WHERE provider='sonarr'",
        "ALTER TABLE queue_connections ADD COLUMN unauthorized_runtime_column text",
        "CREATE TABLE unauthorized_queue_runtime_table (id int)",
        "UPDATE _sqlx_migrations SET checksum=decode('00','hex') WHERE version=11",
        "DELETE FROM _sqlx_migrations WHERE version=11",
        "UPDATE reborn_schema SET schema_version=12",
    ] {
        assert_constraint(&mut db, statement, "42501").await;
    }
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM queue_connections")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        3
    );
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM media_connections")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        2
    );
    db.execute("RESET ROLE").await.unwrap();
    for statement in [
        "INSERT INTO queue_connections VALUES ('other',0,NULL)",
        "UPDATE queue_connections SET revision=-1 WHERE provider='radarr'",
        "UPDATE queue_connections SET revision=0,sealed=decode(repeat('ab',100),'hex') WHERE provider='radarr'",
        "UPDATE queue_connections SET revision=1,sealed=decode('ab','hex') WHERE provider='radarr'",
        "UPDATE queue_connections SET revision=1,sealed=decode(repeat('ab',30101),'hex') WHERE provider='radarr'",
    ] {
        assert_constraint(&mut db, statement, "23514").await;
    }
}

#[tokio::test]
async fn schema_ten_upgrade_preserves_fifteen_relations_four_sequences_and_ten_migration_checksums()
{
    let database = Database::create().await;
    let mut db = database.connect().await;
    let source = sqlx::migrate!("../../migrations");
    let prior: Vec<_> = source
        .iter()
        .filter(|migration| migration.version <= 10)
        .cloned()
        .collect();
    assert_eq!(prior.len(), 10);
    sqlx::migrate::Migrator::with_migrations(prior.clone())
        .run(&mut db)
        .await
        .unwrap();
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT schema_version::bigint FROM reborn_schema")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        10
    );
    assert!(!sqlx::query_scalar::<_,bool>("SELECT EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='queue_connections')").fetch_one(&mut db).await.unwrap());
    // Every accepted schema10 relation receives distinctive data; ciphertext is
    // opaque here because this contract checks migration byte preservation.
    for statement in [
        "INSERT INTO users (username,password_phc,role,generation) VALUES ('queue_upgrade_owner','$argon2id$v=19$m=19456,t=2,p=1$opaque-retained-phc','owner',11)",
        "UPDATE auth_state SET owner_id=1,key_id=decode(repeat('b3',32),'hex')",
        "UPDATE auth_throttles SET window_start=501,attempts=3 WHERE scope=1",
        "INSERT INTO sessions (verifier,account_id,generation,created_at,expires_at) SELECT decode(repeat('c7',32),'hex'),id,11,500,900 FROM users",
        "INSERT INTO workspace_notes SELECT id,'Schema10 accepted private note survives 海',29 FROM users",
        "UPDATE crafty_connection SET revision=9,sealed=decode(repeat('de',100),'hex')",
        "INSERT INTO directory_services (name,category,description,url) VALUES ('Retained schema10 service','Home','Private retained description','https://retained.example.invalid/')",
        "UPDATE directory_state SET revision=7",
        "INSERT INTO directory_pins SELECT id,8,ARRAY[1]::bigint[] FROM users",
        "INSERT INTO activity_events (account_id,kind,revision,occurred_at) SELECT id,'note_saved',29,501 FROM users",
        "INSERT INTO notification_groups SELECT id,'services',9,4,'service_updated',12,502 FROM users",
        "INSERT INTO dashboard_layouts SELECT id,10,ARRAY['connections','pins','note'],TRUE,FALSE,TRUE FROM users",
        "INSERT INTO provider_observations (sample_id,connection_revision,checked_at,complete,error) VALUES (decode(repeat('a9',16),'hex'),9,540,FALSE,'unavailable')",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,players,capacity,collected_at,provider_at,freshness,error) SELECT id,1,'Retained observed zero','running',0,30,540,539,'fresh',NULL FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,freshness,error) SELECT id,2,'Retained unknown','unknown','unknown','unavailable' FROM provider_observations",
        "UPDATE media_connections SET revision=13,sealed=decode(repeat('f1',100),'hex') WHERE provider='jellyfin'",
        "UPDATE media_connections SET revision=6,sealed=NULL WHERE provider='seerr'",
        "SELECT setval('users_id_seq',37,FALSE)",
        "SELECT setval('directory_services_id_seq',61,TRUE)",
        "SELECT setval('activity_events_id_seq',109,FALSE)",
        "SELECT setval('provider_observations_id_seq',151,TRUE)",
    ] {
        db.execute(statement).await.unwrap();
    }
    async fn snapshot(db: &mut PgConnection) -> Vec<Value> {
        let mut values = Vec::new();
        // This explicit pre-existing allowlist is independent of the new schema.
        for table in [
            "users",
            "sessions",
            "auth_state",
            "auth_throttles",
            "workspace_notes",
            "crafty_connection",
            "directory_state",
            "directory_services",
            "directory_pins",
            "activity_events",
            "notification_groups",
            "dashboard_layouts",
            "provider_observations",
            "provider_server_observations",
            "media_connections",
        ] {
            let statement = format!(
                "SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY to_jsonb(t)::text),'[]'::jsonb) FROM {table} t"
            );
            values.push(
                sqlx::query_scalar(sqlx::AssertSqlSafe(statement.as_str()))
                    .fetch_one(&mut *db)
                    .await
                    .unwrap(),
            );
        }
        for sequence in [
            "users_id_seq",
            "directory_services_id_seq",
            "activity_events_id_seq",
            "provider_observations_id_seq",
        ] {
            let statement =
                format!("SELECT jsonb_build_array(last_value,is_called) FROM {sequence}");
            values.push(
                sqlx::query_scalar(sqlx::AssertSqlSafe(statement.as_str()))
                    .fetch_one(&mut *db)
                    .await
                    .unwrap(),
            );
        }
        values
    }
    let before = snapshot(&mut db).await;
    assert_eq!(before.len(), 19);
    let migration_rows: Vec<(i64, Vec<u8>, bool)> =
        sqlx::query_as("SELECT version,checksum,success FROM _sqlx_migrations ORDER BY version")
            .fetch_all(&mut db)
            .await
            .unwrap();
    assert_eq!(migration_rows.len(), 10);
    assert_migrated(completed(database.migrate()).await);
    assert_eq!(
        snapshot(&mut db).await,
        before,
        "subsequent migrations changed accepted schema10 data or sequence state"
    );
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT schema_version::bigint FROM reborn_schema")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        12
    );
    let after: Vec<(i64, Vec<u8>, bool)> = sqlx::query_as(
        "SELECT version,checksum,success FROM _sqlx_migrations WHERE version<=10 ORDER BY version",
    )
    .fetch_all(&mut db)
    .await
    .unwrap();
    assert_eq!(
        after, migration_rows,
        "queue migration rewrote a prior ledger row"
    );
    for migration in prior {
        let checksum: Vec<u8> =
            sqlx::query_scalar("SELECT checksum FROM _sqlx_migrations WHERE version=$1")
                .bind(migration.version)
                .fetch_one(&mut db)
                .await
                .unwrap();
        assert_eq!(checksum, migration.checksum.as_ref());
    }
    let rows =
        sqlx::query("SELECT provider,revision,sealed FROM queue_connections ORDER BY provider")
            .fetch_all(&mut db)
            .await
            .unwrap();
    assert_eq!(rows.len(), 3);
    assert_eq!(
        rows.iter()
            .map(|r| r.get::<String, _>("provider"))
            .collect::<Vec<_>>(),
        ["qbittorrent", "radarr", "sonarr"]
    );
    for row in rows {
        assert_eq!(row.get::<i64, _>("revision"), 0);
        assert!(row.get::<Option<Vec<u8>>, _>("sealed").is_none());
    }
}
