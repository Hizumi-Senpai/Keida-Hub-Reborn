//! Independent schema13 data-preservation and ordinary-role authority contracts.
use super::*;
use std::collections::BTreeSet;

fn canonical_v4(value: &str) -> bool {
    value.len() == 36
        && value.bytes().enumerate().all(|(index, byte)| {
            if [8, 13, 18, 23].contains(&index) {
                byte == b'-'
            } else {
                byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte)
            }
        })
        && value.as_bytes()[14] == b'4'
        && matches!(value.as_bytes()[19], b'8' | b'9' | b'a' | b'b')
}

async fn legacy_snapshot(db: &mut PgConnection) -> Vec<Value> {
    let mut values = Vec::new();
    // Fixed accepted schema12 allowlist: preserve every old column and omit
    // only the new random selector during the cross-schema comparison.
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
        "discord_application",
        "discord_links",
    ] {
        let projection = if table == "sessions" {
            "to_jsonb(t)-'public_ref'"
        } else {
            "to_jsonb(t)"
        };
        let statement = format!(
            "SELECT coalesce(jsonb_agg({projection} ORDER BY ({projection})::text),'[]'::jsonb) FROM {table} t"
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
        let statement = format!("SELECT jsonb_build_array(last_value,is_called) FROM {sequence}");
        values.push(
            sqlx::query_scalar(sqlx::AssertSqlSafe(statement.as_str()))
                .fetch_one(&mut *db)
                .await
                .unwrap(),
        );
    }
    values
}

#[tokio::test]
async fn schema_twelve_upgrade_preserves_eighteen_relations_and_backfills_independent_session_ids()
{
    let database = Database::create().await;
    let mut db = database.connect().await;
    let source = sqlx::migrate!("../../migrations");
    let prior: Vec<_> = source.iter().filter(|m| m.version <= 12).cloned().collect();
    assert_eq!(prior.len(), 12);
    sqlx::migrate::Migrator::with_migrations(prior.clone())
        .run(&mut db)
        .await
        .unwrap();
    assert_eq!(
        sqlx::query_scalar::<_, i32>("SELECT schema_version FROM reborn_schema")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        12
    );
    for statement in [
        "INSERT INTO users(username,password_phc,role,generation) VALUES('session_upgrade_owner','$argon2id$v=19$m=19456,t=2,p=1$opaque-session-fixture-not-for-login','owner',11),('session_upgrade_member','$argon2id$v=19$m=19456,t=2,p=1$opaque-session-fixture-not-for-login','member',3)",
        "UPDATE auth_state SET owner_id=1,key_id=decode(repeat('d3',32),'hex')",
        "UPDATE auth_throttles SET window_start=601,attempts=3 WHERE scope=1",
        "INSERT INTO sessions(verifier,account_id,generation,created_at,expires_at,revoked) VALUES(decode(repeat('a1',32),'hex'),1,11,600,1000,FALSE),(decode(repeat('b2',32),'hex'),1,11,700,1100,TRUE),(decode(repeat('c3',32),'hex'),2,3,800,1200,FALSE)",
        "INSERT INTO workspace_notes VALUES(1,'Private schema12 note survives 海',31)",
        "UPDATE crafty_connection SET revision=11,sealed=decode(repeat('de',100),'hex')",
        "INSERT INTO directory_services(name,category,description,url) VALUES('Retained session-era service','Home','Private retained description','https://retained.example.invalid/')",
        "UPDATE directory_state SET revision=9",
        "INSERT INTO directory_pins VALUES(1,10,ARRAY[1]::bigint[])",
        "INSERT INTO activity_events(account_id,kind,revision,occurred_at) VALUES(1,'note_saved',31,601)",
        "INSERT INTO notification_groups VALUES(1,'services',11,6,'service_updated',14,602)",
        "INSERT INTO dashboard_layouts VALUES(1,12,ARRAY['connections','pins','note'],TRUE,FALSE,TRUE)",
        "INSERT INTO provider_observations(sample_id,connection_revision,checked_at,complete,error) VALUES(decode(repeat('b9',16),'hex'),11,640,FALSE,'unavailable')",
        "INSERT INTO provider_server_observations(batch_id,ordinal,name,state,players,capacity,collected_at,provider_at,freshness,error) VALUES(1,1,'Retained observed zero','running',0,30,640,639,'fresh',NULL)",
        "UPDATE media_connections SET revision=15,sealed=decode(repeat('f1',100),'hex') WHERE provider='jellyfin'",
        "UPDATE media_connections SET revision=8,sealed=NULL WHERE provider='seerr'",
        "UPDATE queue_connections SET revision=19,sealed=decode(repeat('ac',100),'hex') WHERE provider='sonarr'",
        "UPDATE queue_connections SET revision=20,sealed=decode(repeat('bd',100),'hex') WHERE provider='radarr'",
        "UPDATE queue_connections SET revision=21,sealed=NULL WHERE provider='qbittorrent'",
        "UPDATE discord_application SET revision=9,sealed=decode(repeat('e4',100),'hex')",
        "INSERT INTO discord_links(account_id,revision,flow_generation,discord_id,display_name,verified_at) VALUES(1,7,8,'18446744073709551615','Retained accepted identity',601),(2,9,10,NULL,NULL,NULL)",
        "SELECT setval('users_id_seq',39,FALSE)",
        "SELECT setval('directory_services_id_seq',63,TRUE)",
        "SELECT setval('activity_events_id_seq',111,FALSE)",
        "SELECT setval('provider_observations_id_seq',153,TRUE)",
    ] {
        db.execute(statement).await.unwrap();
    }
    let before = legacy_snapshot(&mut db).await;
    assert_eq!(before.len(), 22);
    let ledger: Vec<(i64, Vec<u8>, bool)> =
        sqlx::query_as("SELECT version,checksum,success FROM _sqlx_migrations ORDER BY version")
            .fetch_all(&mut db)
            .await
            .unwrap();
    assert_eq!(ledger.len(), 12);
    assert_migrated(completed(database.migrate()).await);
    assert_eq!(legacy_snapshot(&mut db).await, before);
    assert_eq!(
        sqlx::query_scalar::<_, i32>("SELECT schema_version FROM reborn_schema")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        14
    );
    let after_ledger: Vec<(i64, Vec<u8>, bool)> = sqlx::query_as(
        "SELECT version,checksum,success FROM _sqlx_migrations WHERE version<=12 ORDER BY version",
    )
    .fetch_all(&mut db)
    .await
    .unwrap();
    assert_eq!(after_ledger, ledger);
    for migration in prior {
        assert_eq!(
            sqlx::query_scalar::<_, Vec<u8>>(
                "SELECT checksum FROM _sqlx_migrations WHERE version=$1"
            )
            .bind(migration.version)
            .fetch_one(&mut db)
            .await
            .unwrap(),
            migration.checksum.as_ref()
        );
    }
    let refs: Vec<(String, String)> = sqlx::query_as(
        "SELECT encode(verifier,'hex'),public_ref::text FROM sessions ORDER BY verifier",
    )
    .fetch_all(&mut db)
    .await
    .unwrap();
    assert_eq!(refs.len(), 3);
    assert_eq!(
        refs.iter().map(|(_, id)| id).collect::<BTreeSet<_>>().len(),
        3
    );
    for (verifier, id) in &refs {
        assert!(canonical_v4(id));
        assert!(!verifier.contains(id));
    }
    assert_migrated(completed(database.migrate()).await);
    assert_eq!(
        sqlx::query_as::<_, (String, String)>(
            "SELECT encode(verifier,'hex'),public_ref::text FROM sessions ORDER BY verifier"
        )
        .fetch_all(&mut db)
        .await
        .unwrap(),
        refs,
        "a migration retry replaced existing public references"
    );
    assert_constraint(&mut db, "UPDATE sessions SET public_ref=NULL", "23502").await;
    assert_constraint(
        &mut db,
        "INSERT INTO sessions(verifier,account_id,generation,created_at,expires_at,public_ref) SELECT decode(repeat('dd',32),'hex'),1,11,900,1300,public_ref FROM sessions LIMIT 1",
        "23505",
    )
    .await;
    let added: String = sqlx::query_scalar(
        "INSERT INTO sessions(verifier,account_id,generation,created_at,expires_at) VALUES(decode(repeat('dd',32),'hex'),1,11,900,1300) RETURNING public_ref::text",
    )
    .fetch_one(&mut db)
    .await
    .unwrap();
    assert!(canonical_v4(&added));
    assert!(refs.iter().all(|(_, id)| id != &added));
}

#[tokio::test]
async fn actual_runtime_grants_retire_broad_session_privileges_and_keep_auth_lifecycle_working() {
    let database = Database::create().await;
    assert_migrated(completed(database.migrate()).await);
    let role = RuntimeRole {
        name: format!(
            "keida_reborn_session_role_{}_{:x}",
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
    db.execute("INSERT INTO users(username,password_phc,role) VALUES('session_runtime_fixture','$argon2id$v=19$m=19456,t=2,p=1$opaque-session-fixture-not-for-login','member')")
        .await.unwrap();
    // The generated role identifier is fixed-prefix, ASCII and length-bounded.
    sqlx::raw_sql(sqlx::AssertSqlSafe(format!(
        "CREATE ROLE \"{}\" NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE; GRANT SELECT,INSERT,UPDATE,DELETE ON sessions TO \"{}\"",
        role.name, role.name
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
    let id: String = sqlx::query_scalar("INSERT INTO sessions(verifier,account_id,generation,created_at,expires_at) VALUES(decode(repeat('e1',32),'hex'),1,0,600,1200) RETURNING public_ref::text")
        .fetch_one(&mut db).await.unwrap();
    assert!(canonical_v4(&id));
    let permissions: (bool, bool, bool, bool) = sqlx::query_as(
        "SELECT has_table_privilege(current_user,'sessions','UPDATE'),has_column_privilege(current_user,'sessions','revoked','UPDATE'),has_column_privilege(current_user,'sessions','public_ref','UPDATE'),has_column_privilege(current_user,'sessions','public_ref','INSERT')",
    ).fetch_one(&mut db).await.unwrap();
    assert_eq!(permissions, (false, true, false, false));
    let lockable: String = sqlx::query_scalar(
        "SELECT s.public_ref::text FROM sessions s JOIN users u ON u.id=s.account_id WHERE s.public_ref=$1::text::uuid FOR UPDATE OF u,s",
    )
    .bind(&id)
    .fetch_one(&mut db)
    .await
    .unwrap();
    assert_eq!(
        lockable, id,
        "narrow grants broke the auth row-lock boundary"
    );
    db.execute("UPDATE sessions SET revoked=TRUE WHERE account_id=1")
        .await
        .unwrap();
    assert!(
        sqlx::query_scalar::<_, bool>(
            "SELECT revoked FROM sessions WHERE public_ref=$1::text::uuid"
        )
        .bind(&id)
        .fetch_one(&mut db)
        .await
        .unwrap()
    );
    for statement in [
        "UPDATE sessions SET public_ref=public_ref WHERE FALSE",
        "UPDATE sessions SET verifier=verifier WHERE FALSE",
        "UPDATE sessions SET account_id=account_id WHERE FALSE",
        "UPDATE sessions SET generation=generation WHERE FALSE",
        "UPDATE sessions SET created_at=created_at WHERE FALSE",
        "UPDATE sessions SET expires_at=expires_at WHERE FALSE",
        "INSERT INTO sessions(verifier,account_id,generation,created_at,expires_at,public_ref) VALUES(decode(repeat('e2',32),'hex'),1,0,600,1200,'00000000-0000-4000-8000-000000000000')",
        "INSERT INTO sessions(verifier,account_id,generation,created_at,expires_at,revoked) VALUES(decode(repeat('e2',32),'hex'),1,0,600,1200,FALSE)",
        "ALTER TABLE sessions ADD COLUMN unauthorized_session_column text",
        "UPDATE _sqlx_migrations SET success=success WHERE version=13",
        "UPDATE reborn_schema SET schema_version=13",
    ] {
        assert_constraint(&mut db, statement, "42501").await;
    }
    assert_eq!(
        sqlx::query_scalar::<_, String>("SELECT public_ref::text FROM sessions")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        id
    );
    let removed = db
        .execute("DELETE FROM sessions WHERE revoked=TRUE")
        .await
        .unwrap();
    assert_eq!(removed.rows_affected(), 1);
}
