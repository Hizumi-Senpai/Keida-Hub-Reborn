//! Genuine PostgreSQL migration, constraint and runtime-role boundaries.
use super::*;

const LOCAL_USERS: &str = "INSERT INTO users (username,password_phc,role) VALUES ('discord_fixture_one','$argon2id$v=19$m=19456,t=2,p=1$opaque-database-fixture','member'),('discord_fixture_two','$argon2id$v=19$m=19456,t=2,p=1$opaque-database-fixture','member')";
type LinkState = (i64, i64, Option<String>, Option<String>, Option<i64>);

#[tokio::test]
async fn discord_schema_twelve_enforces_unsigned_identity_and_consistent_nullable_tuple() {
    let database = Database::create().await;
    assert_migrated(completed(database.migrate()).await);
    let mut db = database.connect().await;
    db.execute(LOCAL_USERS).await.unwrap();
    db.execute("INSERT INTO discord_links (account_id) VALUES (1),(2)")
        .await
        .unwrap();
    let application: (i64, Option<Vec<u8>>) =
        sqlx::query_as("SELECT revision,sealed FROM discord_application WHERE singleton=TRUE")
            .fetch_one(&mut db)
            .await
            .unwrap();
    assert_eq!(application, (0, None));
    let links: Vec<LinkState> = sqlx::query_as(
        "SELECT revision,flow_generation,discord_id,display_name,verified_at FROM discord_links ORDER BY account_id",
    )
    .fetch_all(&mut db)
    .await
    .unwrap();
    assert_eq!(links, vec![(0, 0, None, None, None); 2]);
    for statement in [
        "UPDATE discord_application SET revision=-1",
        "UPDATE discord_application SET sealed=decode(repeat('ab',80),'hex')",
        "UPDATE discord_application SET revision=1,sealed=decode(repeat('ab',61),'hex')",
        "UPDATE discord_application SET revision=1,sealed=decode(repeat('ab',1086),'hex')",
        "INSERT INTO discord_application (singleton) VALUES (FALSE)",
        "UPDATE discord_links SET revision=-1 WHERE account_id=1",
        "UPDATE discord_links SET flow_generation=-1 WHERE account_id=1",
        "UPDATE discord_links SET display_name='partial tuple' WHERE account_id=1",
        "UPDATE discord_links SET verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET discord_id='1' WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='1',display_name='fixture',verified_at=0 WHERE account_id=1",
        "UPDATE discord_links SET revision=0,flow_generation=1,discord_id='1',display_name='fixture',verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=0,discord_id='1',display_name='fixture',verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='0',display_name='fixture',verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='01',display_name='fixture',verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='-1',display_name='fixture',verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='1e3',display_name='fixture',verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='not numeric',display_name='fixture',verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='18446744073709551616',display_name='fixture',verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='999999999999999999999',display_name='fixture',verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='1',display_name='',verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='1',display_name=U&' \\00A0\\3000',verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='1',display_name=U&'direction\\202Eoverride',verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='1',display_name=repeat('a',81),verified_at=1 WHERE account_id=1",
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='1',display_name=E'line\\nbreak',verified_at=1 WHERE account_id=1",
    ] {
        assert_constraint(&mut db, statement, "23514").await;
    }
    db.execute("UPDATE discord_application SET revision=1,sealed=decode(repeat('ab',1085),'hex')")
        .await
        .unwrap();
    db.execute("UPDATE discord_links SET revision=1,flow_generation=1,discord_id='18446744073709551615',display_name=repeat('🐈',80),verified_at=1 WHERE account_id=1")
        .await
        .unwrap();
    assert_constraint(
        &mut db,
        "UPDATE discord_links SET revision=1,flow_generation=1,discord_id='18446744073709551615',display_name='collision',verified_at=1 WHERE account_id=2",
        "23505",
    )
    .await;
    db.execute("UPDATE discord_links SET revision=2,flow_generation=2,discord_id=NULL,display_name=NULL,verified_at=NULL WHERE account_id=1")
        .await
        .unwrap();
    db.execute("UPDATE discord_links SET revision=1,flow_generation=1,discord_id='18446744073709551615',display_name='relinked separately',verified_at=1 WHERE account_id=2")
        .await
        .unwrap();
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM discord_links")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        2
    );
}

#[tokio::test]
async fn discord_runtime_role_cannot_erase_tombstones_or_move_rows_or_edit_fixed_enrollment() {
    let database = Database::create().await;
    assert_migrated(completed(database.migrate()).await);
    let role = RuntimeRole {
        name: format!(
            "keida_reborn_discord_role_{}_{:x}",
            std::process::id(),
            DATABASE_COUNTER.fetch_add(1, Ordering::Relaxed)
        ),
        url: database.url.clone(),
    };
    assert!(role.name.len() <= 63);
    assert!(
        role.name
            .bytes()
            .all(|b| b.is_ascii_alphanumeric() || b == b'_')
    );
    let mut db = database.connect().await;
    db.execute(LOCAL_USERS).await.unwrap();
    // Only the generated, length-bounded ASCII identifier enters these strings.
    sqlx::raw_sql(sqlx::AssertSqlSafe(format!(
        "CREATE ROLE \"{}\" NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE",
        role.name
    )))
    .execute(&mut db)
    .await
    .unwrap();
    sqlx::raw_sql(sqlx::AssertSqlSafe(
        include_str!("../../../../deploy/runtime-grants.sql").replace("reborn_app", &role.name),
    ))
    .execute(&mut db)
    .await
    .unwrap();
    sqlx::raw_sql(sqlx::AssertSqlSafe(format!("SET ROLE \"{}\"", role.name)))
        .execute(&mut db)
        .await
        .unwrap();
    db.execute(
        "INSERT INTO discord_links (account_id) VALUES (1) ON CONFLICT (account_id) DO NOTHING",
    )
    .await
    .unwrap();
    db.execute(
        "INSERT INTO discord_links (account_id) VALUES (1) ON CONFLICT (account_id) DO NOTHING",
    )
    .await
    .unwrap();
    db.execute("UPDATE discord_application SET revision=1,sealed=decode(repeat('ab',80),'hex')")
        .await
        .unwrap();
    db.execute("UPDATE discord_application SET revision=2,sealed=NULL")
        .await
        .unwrap();
    db.execute("UPDATE discord_links SET revision=1,flow_generation=1,discord_id='1',display_name='runtime fixture',verified_at=1 WHERE account_id=1")
        .await
        .unwrap();
    db.execute("UPDATE discord_links SET revision=2,flow_generation=2,discord_id=NULL,display_name=NULL,verified_at=NULL WHERE account_id=1")
        .await
        .unwrap();
    for statement in [
        "INSERT INTO discord_application (singleton) VALUES (TRUE)",
        "DELETE FROM discord_application",
        "UPDATE discord_application SET singleton=singleton",
        "INSERT INTO discord_links (account_id,revision) VALUES (2,0)",
        "DELETE FROM discord_links WHERE account_id=1",
        "UPDATE discord_links SET account_id=account_id WHERE account_id=1",
        "ALTER TABLE discord_links ADD COLUMN unauthorized text",
        "ALTER TABLE discord_application ADD COLUMN unauthorized text",
        "UPDATE _sqlx_migrations SET checksum=decode('00','hex') WHERE version=12",
        "DELETE FROM _sqlx_migrations WHERE version=12",
        "UPDATE reborn_schema SET schema_version=12",
    ] {
        assert_constraint(&mut db, statement, "42501").await;
    }
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT revision FROM discord_application")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        2
    );
    let link: (i64, i64, Option<String>) =
        sqlx::query_as("SELECT revision,flow_generation,discord_id FROM discord_links")
            .fetch_one(&mut db)
            .await
            .unwrap();
    assert_eq!(link, (2, 2, None));
}

#[tokio::test]
async fn schema_eleven_upgrade_preserves_sixteen_relations_four_sequences_and_eleven_ledger_rows() {
    let database = Database::create().await;
    let mut db = database.connect().await;
    let source = sqlx::migrate!("../../migrations");
    let prior: Vec<_> = source.iter().filter(|m| m.version <= 11).cloned().collect();
    assert_eq!(prior.len(), 11);
    sqlx::migrate::Migrator::with_migrations(prior.clone())
        .run(&mut db)
        .await
        .unwrap();
    assert_eq!(
        sqlx::query_scalar::<_, i32>("SELECT schema_version FROM reborn_schema")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        11
    );
    assert!(!sqlx::query_scalar::<_, bool>("SELECT EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename IN ('discord_application','discord_links'))")
        .fetch_one(&mut db).await.unwrap());
    for statement in [
        "INSERT INTO users (username,password_phc,role,generation) VALUES ('discord_upgrade_owner','$argon2id$v=19$m=19456,t=2,p=1$opaque-retained-phc','owner',13)",
        "UPDATE auth_state SET owner_id=1,key_id=decode(repeat('d3',32),'hex')",
        "UPDATE auth_throttles SET window_start=601,attempts=3 WHERE scope=1",
        "INSERT INTO sessions (verifier,account_id,generation,created_at,expires_at) SELECT decode(repeat('e7',32),'hex'),id,13,600,1000 FROM users",
        "INSERT INTO workspace_notes SELECT id,'Schema11 accepted private note survives 海',31 FROM users",
        "UPDATE crafty_connection SET revision=11,sealed=decode(repeat('de',100),'hex')",
        "INSERT INTO directory_services (name,category,description,url) VALUES ('Retained schema11 service','Home','Private retained description','https://retained.example.invalid/')",
        "UPDATE directory_state SET revision=9",
        "INSERT INTO directory_pins SELECT id,10,ARRAY[1]::bigint[] FROM users",
        "INSERT INTO activity_events (account_id,kind,revision,occurred_at) SELECT id,'note_saved',31,601 FROM users",
        "INSERT INTO notification_groups SELECT id,'services',11,6,'service_updated',14,602 FROM users",
        "INSERT INTO dashboard_layouts SELECT id,12,ARRAY['connections','pins','note'],TRUE,FALSE,TRUE FROM users",
        "INSERT INTO provider_observations (sample_id,connection_revision,checked_at,complete,error) VALUES (decode(repeat('b9',16),'hex'),11,640,FALSE,'unavailable')",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,players,capacity,collected_at,provider_at,freshness,error) SELECT id,1,'Retained observed zero','running',0,30,640,639,'fresh',NULL FROM provider_observations",
        "INSERT INTO provider_server_observations (batch_id,ordinal,name,state,freshness,error) SELECT id,2,'Retained unknown','unknown','unknown','unavailable' FROM provider_observations",
        "UPDATE media_connections SET revision=15,sealed=decode(repeat('f1',100),'hex') WHERE provider='jellyfin'",
        "UPDATE media_connections SET revision=8,sealed=NULL WHERE provider='seerr'",
        "UPDATE queue_connections SET revision=19,sealed=decode(repeat('ac',100),'hex') WHERE provider='sonarr'",
        "UPDATE queue_connections SET revision=20,sealed=decode(repeat('bd',100),'hex') WHERE provider='radarr'",
        "UPDATE queue_connections SET revision=21,sealed=NULL WHERE provider='qbittorrent'",
        "SELECT setval('users_id_seq',39,FALSE)",
        "SELECT setval('directory_services_id_seq',63,TRUE)",
        "SELECT setval('activity_events_id_seq',111,FALSE)",
        "SELECT setval('provider_observations_id_seq',153,TRUE)",
    ] {
        db.execute(statement).await.unwrap();
    }
    async fn snapshot(db: &mut PgConnection) -> Vec<Value> {
        let mut values = Vec::new();
        // Literal, explicit schema11 domain allowlist; no user identifier enters
        // this audited SQL. Snapshot both sequence value and is_called.
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
            "queue_connections",
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
    assert_eq!(before.len(), 20);
    let ledger: Vec<(i64, Vec<u8>, bool)> =
        sqlx::query_as("SELECT version,checksum,success FROM _sqlx_migrations ORDER BY version")
            .fetch_all(&mut db)
            .await
            .unwrap();
    assert_eq!(ledger.len(), 11);
    assert_migrated(completed(database.migrate()).await);
    assert_eq!(snapshot(&mut db).await, before);
    let after: Vec<(i64, Vec<u8>, bool)> = sqlx::query_as(
        "SELECT version,checksum,success FROM _sqlx_migrations WHERE version<=11 ORDER BY version",
    )
    .fetch_all(&mut db)
    .await
    .unwrap();
    assert_eq!(after, ledger);
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
        sqlx::query_scalar::<_, i32>("SELECT schema_version FROM reborn_schema")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        12
    );
    assert_eq!(
        sqlx::query_as::<_, (i64, Option<Vec<u8>>)>(
            "SELECT revision,sealed FROM discord_application WHERE singleton=TRUE"
        )
        .fetch_one(&mut db)
        .await
        .unwrap(),
        (0, None)
    );
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM discord_links")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        0,
        "migration invented identities"
    );
}
