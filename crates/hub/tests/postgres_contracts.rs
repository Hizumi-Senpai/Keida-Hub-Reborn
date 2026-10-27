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
    assert_eq!(metadata[0].get::<i32, _>("schema_version"), 6);
    for statement in [
        "UPDATE reborn_schema SET singleton = FALSE",
        "UPDATE reborn_schema SET product = 'keida-hub-rewrite'",
        "UPDATE reborn_schema SET schema_version = 6",
    ] {
        assert_constraint(&mut connection, statement, "23514").await;
    }
    assert_constraint(&mut connection, "INSERT INTO reborn_schema (singleton,product,schema_version) VALUES (TRUE,'keida-hub-reborn',6)", "23505").await;

    let ledger_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM _sqlx_migrations")
        .fetch_one(&mut connection)
        .await
        .expect("migration ledger count");
    assert_eq!(ledger_count, 6);
    assert_migrated(completed(database.migrate()).await);
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM _sqlx_migrations")
            .fetch_one(&mut connection)
            .await
            .expect("repeated ledger count"),
        ledger_count
    );

    // Restore fixture bytes after each fault; acceptance requires rejecting the fault, not trusting a copied result.
    for version in [1_i64, 2, 3, 4, 5, 6] {
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
    connection.execute("INSERT INTO reborn_schema (singleton,product,schema_version) VALUES (TRUE,'keida-hub-reborn',6)").await.expect("restore singleton fixture row");
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
    let row = sqlx::query("SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE success AND version IN (1, 2, 3, 4, 5, 6)) AS completed FROM _sqlx_migrations")
        .fetch_one(&mut connection).await.expect("inspect concurrent ledger");
    assert_eq!(row.get::<i64, _>("total"), 6);
    assert_eq!(row.get::<i64, _>("completed"), 6);
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
    assert_eq!(after.get::<i32, _>("schema_version"), 6);
    let ledger =
        sqlx::query("SELECT version, checksum, success FROM _sqlx_migrations ORDER BY version")
            .fetch_all(&mut connection)
            .await
            .expect("inspect upgraded ledger");
    assert_eq!(ledger.len(), 6);
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
        5
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
