//! Independent schema13→14 preservation for the additive personal tile table.
use super::*;

async fn schema_thirteen_data(db: &mut PgConnection) -> Vec<Value> {
    let mut snapshot = Vec::new();
    // Fixed schema13 relations: every column is compared, including public_ref.
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
        // Only this fixed fixture allowlist supplies identifiers.
        let sql = format!(
            "SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY to_jsonb(t)::text),'[]'::jsonb) FROM {table} t"
        );
        snapshot.push(
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
        snapshot.push(
            sqlx::query_scalar(sqlx::AssertSqlSafe(sql.as_str()))
                .fetch_one(&mut *db)
                .await
                .unwrap(),
        );
    }
    snapshot
}

async fn old_ledger(db: &mut PgConnection) -> Value {
    sqlx::query_scalar(
        "SELECT jsonb_agg(to_jsonb(m) ORDER BY version) FROM _sqlx_migrations m WHERE version<=13",
    )
    .fetch_one(db)
    .await
    .unwrap()
}

#[tokio::test]
async fn schema_thirteen_to_fourteen_adds_empty_tiles_and_preserves_all_prior_records() {
    let database = Database::create().await;
    let mut db = database.connect().await;
    let source = sqlx::migrate!("../../migrations");
    let prior = source
        .iter()
        .filter(|m| m.version <= 13)
        .cloned()
        .collect::<Vec<_>>();
    assert_eq!(prior.len(), 13);
    sqlx::migrate::Migrator::with_migrations(prior.clone())
        .run(&mut db)
        .await
        .unwrap();
    assert_eq!(
        sqlx::query_scalar::<_, i32>("SELECT schema_version FROM reborn_schema")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        13
    );

    // Opaque owned-fixture bytes are intentionally not valid provider secrets.
    // Populate each relation so absence cannot masquerade as preservation.
    for sql in [
        "INSERT INTO users(username,password_phc,role,generation) VALUES('tile_upgrade_owner','$argon2id$v=19$m=19456,t=2,p=1$opaque-tile-upgrade-not-for-login','owner',2),('tile_upgrade_member','$argon2id$v=19$m=19456,t=2,p=1$opaque-tile-upgrade-not-for-login','member',4)",
        "UPDATE auth_state SET owner_id=1,key_id=decode(repeat('a7',32),'hex')",
        "UPDATE auth_throttles SET window_start=800,attempts=2 WHERE scope=1",
        "INSERT INTO sessions(verifier,account_id,generation,created_at,expires_at,revoked,public_ref) VALUES(decode(repeat('a8',32),'hex'),1,2,700,1700,FALSE,'00000000-0000-4000-8000-000000000001'),(decode(repeat('b8',32),'hex'),2,4,701,1701,TRUE,'00000000-0000-4000-8000-000000000002')",
        "INSERT INTO workspace_notes VALUES(1,'Owner note before tiles 海',3),(2,'Member note before tiles',8)",
        "UPDATE crafty_connection SET revision=4,sealed=decode(repeat('c7',100),'hex')",
        "UPDATE directory_state SET revision=5",
        "INSERT INTO directory_services(name,category,description,url) VALUES('Tile upgrade service','Home','Saved public shortcut','https://tiles.example.invalid/')",
        "INSERT INTO directory_pins VALUES(2,6,ARRAY[1]::bigint[])",
        "INSERT INTO activity_events(account_id,kind,revision,occurred_at) VALUES(1,'note_saved',3,800)",
        "INSERT INTO notification_groups VALUES(2,'services',9,4,'service_updated',5,801)",
        "INSERT INTO dashboard_layouts VALUES(1,7,ARRAY['pins','connections','note'],FALSE,TRUE,TRUE),(2,9,ARRAY['connections','note','pins'],TRUE,FALSE,TRUE)",
        "INSERT INTO provider_observations(sample_id,connection_revision,checked_at,complete,error) VALUES(decode(repeat('e7',16),'hex'),4,802,FALSE,'unavailable')",
        "INSERT INTO provider_server_observations(batch_id,ordinal,name,state,players,capacity,collected_at,provider_at,freshness,error) VALUES(1,1,'Tile upgrade known zero','running',0,20,802,801,'fresh',NULL)",
        "UPDATE media_connections SET revision=10,sealed=decode(repeat('d7',100),'hex') WHERE provider='jellyfin'",
        "UPDATE media_connections SET revision=11,sealed=decode(repeat('d8',100),'hex') WHERE provider='seerr'",
        "UPDATE queue_connections SET revision=12,sealed=decode(repeat('f7',100),'hex') WHERE provider='sonarr'",
        "UPDATE queue_connections SET revision=13,sealed=decode(repeat('f8',100),'hex') WHERE provider='radarr'",
        "UPDATE queue_connections SET revision=14,sealed=NULL WHERE provider='qbittorrent'",
        "UPDATE discord_application SET revision=15,sealed=decode(repeat('b7',100),'hex')",
        "INSERT INTO discord_links(account_id,revision,flow_generation,discord_id,display_name,verified_at) VALUES(1,16,3,'987654321098765432','Tile upgrade identity',803),(2,17,4,NULL,NULL,NULL)",
        "SELECT setval('users_id_seq',41,FALSE)",
        "SELECT setval('directory_services_id_seq',61,TRUE)",
        "SELECT setval('activity_events_id_seq',81,FALSE)",
        "SELECT setval('provider_observations_id_seq',101,TRUE)",
    ] {
        db.execute(sql).await.unwrap();
    }
    let before = schema_thirteen_data(&mut db).await;
    assert_eq!(before.len(), 22);
    let ledger = old_ledger(&mut db).await;
    assert_eq!(ledger.as_array().unwrap().len(), 13);
    assert_migrated(completed(database.migrate()).await);
    assert_eq!(
        sqlx::query_scalar::<_, i32>("SELECT schema_version FROM reborn_schema")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        14
    );
    assert_eq!(schema_thirteen_data(&mut db).await, before);
    assert_eq!(old_ledger(&mut db).await, ledger);
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM dashboard_tiles")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        0
    );
    for migration in prior {
        let checksum = sqlx::query_scalar::<_, Vec<u8>>(
            "SELECT checksum FROM _sqlx_migrations WHERE version=$1",
        )
        .bind(migration.version)
        .fetch_one(&mut db)
        .await
        .unwrap();
        assert_eq!(checksum, migration.checksum.as_ref());
    }
    assert_migrated(completed(database.migrate()).await);
    assert_eq!(schema_thirteen_data(&mut db).await, before);
    assert_eq!(old_ledger(&mut db).await, ledger);
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM dashboard_tiles")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        0
    );

    db.execute("INSERT INTO dashboard_tiles(account_id,revision,tile_order,tile_sizes) VALUES(1,1,ARRAY['games','services'],ARRAY['normal','wide'])").await.unwrap();
    let tiles_before: Value =
        sqlx::query_scalar("SELECT to_jsonb(t) FROM dashboard_tiles t WHERE account_id=1")
            .fetch_one(&mut db)
            .await
            .unwrap();
    assert_migrated(completed(database.migrate()).await);
    assert_eq!(schema_thirteen_data(&mut db).await, before);
    assert_eq!(old_ledger(&mut db).await, ledger);
    assert_eq!(
        sqlx::query_scalar::<_, Value>(
            "SELECT to_jsonb(t) FROM dashboard_tiles t WHERE account_id=1"
        )
        .fetch_one(&mut db)
        .await
        .unwrap(),
        tiles_before
    );
}
