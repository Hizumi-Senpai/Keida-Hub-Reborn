//! Independent issue43 expectations through the real Rust/PostgreSQL HTTP caller.
//! The tile document never replaces the retained three-panel layout contract.
use super::*;
use sqlx::Executor;

const PATH: &str = "/api/workspace/tiles";
const TILES_CONTRACT: &str = "reborn-tiles-v1";

fn request(server: &Server, actor: &Session, method: Method) -> RequestBuilder {
    workspace_request(server, actor, method, PATH)
        .header("x-reborn-tiles-contract", TILES_CONTRACT)
}

fn owner_defaults() -> Value {
    json!([
        {"id":"games","size":"wide"},
        {"id":"jellyfin","size":"normal"},
        {"id":"requests","size":"normal"},
        {"id":"downloads","size":"wide"},
        {"id":"services","size":"wide"}
    ])
}

fn member_defaults() -> Value {
    json!([{"id":"games","size":"wide"},{"id":"services","size":"wide"}])
}

fn no_cookie(response: &Response) {
    assert!(response.headers().get_all("set-cookie").iter().next().is_none());
}

async fn list(server: &Server, actor: &Session) -> Value {
    let response = request(server, actor, Method::GET).send().await.unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_no_store(&response);
    no_cookie(&response);
    let text = response.text().await.unwrap();
    assert!(text.len() < 4096);
    assert_private_text(&text, &[&actor.cookie, &actor.csrf, OWNER_PASSWORD, MEMBER_PASSWORD]);
    let value: Value = serde_json::from_str(&text).unwrap();
    assert_eq!(value.as_object().unwrap().len(), 9);
    assert_eq!(value["product"], PRODUCT);
    assert_eq!(value["contract"], "reborn-workspace-v1");
    assert_eq!(value["tiles_contract"], TILES_CONTRACT);
    assert_eq!(value["schema"], 1);
    assert_eq!(value["account"], actor.account);
    assert_eq!(value["session_generation"], "0");
    for row in value["catalog"].as_array().unwrap() {
        assert_eq!(row.as_object().unwrap().len(), 2);
        assert!(row["id"].is_string() && row["label"].is_string());
    }
    value
}

async fn save(server: &Server, actor: &Session, base: &str, tiles: &Value) -> Response {
    request(server, actor, Method::PUT)
        .json(&json!({"base_revision":base,"tiles":tiles}))
        .send()
        .await
        .unwrap()
}

fn account_id(actor: &Session) -> i64 {
    actor.account["id"].as_str().unwrap().parse().unwrap()
}

async fn rows(fixture: &Fixture) -> i64 {
    sqlx::query_scalar("SELECT count(*) FROM dashboard_tiles")
        .fetch_one(&mut fixture.connect().await)
        .await
        .unwrap()
}

#[tokio::test]
async fn tile_defaults_and_saved_arrangements_are_private_durable_and_independent() {
    let fixture = Fixture::new().await;
    let (server, owner, setup) = claimed(&fixture).await;
    let member = notification_member(&server, &owner, "tile_personal_member").await;
    let owner_view = list(&server, &owner).await;
    let member_view = list(&server, &member).await;
    assert_eq!(owner_view["defaults"], owner_defaults());
    assert_eq!(member_view["defaults"], member_defaults());
    assert_eq!(owner_view["layout"], json!({"revision":"0","tiles":owner_defaults()}));
    assert_eq!(member_view["layout"], json!({"revision":"0","tiles":member_defaults()}));
    assert_eq!(
        owner_view["catalog"].as_array().unwrap().iter().map(|v| v["id"].as_str().unwrap()).collect::<Vec<_>>(),
        ["games", "jellyfin", "requests", "downloads", "services", "note"]
    );
    assert_eq!(
        member_view["catalog"].as_array().unwrap().iter().map(|v| v["id"].as_str().unwrap()).collect::<Vec<_>>(),
        ["games", "services", "note"]
    );
    assert_eq!(rows(&fixture).await, 0, "GET defaults must not write a row");

    let legacy = home_panels(["pins", "note", "connections"], Some("note"));
    assert_eq!(save_home_layout(&server, &owner, "0", &legacy).await.status(), StatusCode::OK);
    let note = workspace_request(&server, &owner, Method::PUT, "/api/workspace/note")
        .json(&json!({"base_revision":"0","body":"A private draft-independent note"}))
        .send().await.unwrap();
    assert_eq!(note.status(), StatusCode::OK);
    let before = note.json::<Value>().await.unwrap();
    let before_history = history(&server, &owner, "").await;
    let selected = json!([{"id":"requests","size":"wide"},{"id":"games","size":"normal"}]);
    let response = save(&server, &owner, "0", &selected).await;
    assert_eq!(response.status(), StatusCode::OK);
    assert_no_store(&response);
    no_cookie(&response);
    let saved: Value = response.json().await.unwrap();
    assert_eq!(saved["layout"], json!({"revision":"1","tiles":selected}));
    assert_eq!(saved["defaults"], owner_defaults());
    assert_eq!(list(&server, &member).await["layout"], member_view["layout"]);
    let member_selected = json!([{"id":"note","size":"normal"}]);
    assert_eq!(save(&server, &member, "0", &member_selected).await.status(), StatusCode::OK);
    let after = workspace_json(&server, &owner, "/api/workspace/snapshot").await;
    assert_eq!(after["note"], before["note"]);
    assert_eq!(after["layout"], before["layout"]);
    assert_eq!(after["directory"], before["directory"]);
    assert_eq!(history(&server, &owner, "").await, before_history);
    assert_eq!(inbox(&server, &owner).await["groups"], json!([]));
    server.assert_logs_private(&[&setup, &owner.cookie, &member.cookie, OWNER_PASSWORD, MEMBER_PASSWORD]);
    drop(server);
    let restarted = Server::start(&fixture, Some(&fixture.key_file)).await;
    assert_eq!(list(&restarted, &owner).await["layout"], saved["layout"]);
    assert_eq!(list(&restarted, &member).await["layout"], json!({"revision":"1","tiles":member_selected}));
}

#[tokio::test]
async fn tile_admission_and_closed_layout_shape_reject_without_persistence() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let member = notification_member(&server, &owner, "tile_admission_member").await;
    let selected = json!([{"id":"games","size":"normal"}]);
    for bad in [
        json!({"base_revision":"0","tiles":[]}),
        json!({"base_revision":"0","tiles":[{"id":"games","size":"normal"},{"id":"games","size":"wide"}]}),
        json!({"base_revision":"0","tiles":[{"id":"unknown","size":"normal"}]}),
        json!({"base_revision":"0","tiles":[{"id":"note","size":"huge"}]}),
        json!({"base_revision":"0","tiles":[{"id":"games","size":"normal","url":"https://example.test"}]}),
        json!({"base_revision":"0","tiles":selected,"account_id":owner.account["id"]}),
        json!({"base_revision":"00","tiles":selected}),
        json!({"base_revision":"-1","tiles":selected}),
        json!({"base_revision":"9223372036854775808","tiles":selected}),
        json!({"tiles":selected}),
        json!({"base_revision":"0","tiles":null}),
        json!({"base_revision":"0","tiles":vec![json!({"id":"note","size":"normal"});7]}),
    ] {
        error(request(&server, &member, Method::PUT).json(&bad).send().await.unwrap(), StatusCode::BAD_REQUEST, &[&member.cookie]).await;
    }
    for id in ["jellyfin", "requests", "downloads"] {
        error(save(&server, &member, "0", &json!([{"id":id,"size":"normal"}])).await, StatusCode::BAD_REQUEST, &[]).await;
    }
    for (contract, expected) in [
        (None, StatusCode::UPGRADE_REQUIRED),
        (Some("reborn-tiles-v2"), StatusCode::UPGRADE_REQUIRED),
    ] {
        let mut builder = workspace_request(&server, &member, Method::PUT, PATH);
        if let Some(contract) = contract { builder = builder.header("x-reborn-tiles-contract", contract); }
        error(builder.json(&json!({"base_revision":"0","tiles":selected})).send().await.unwrap(), expected, &[]).await;
    }
    error(request(&server, &member, Method::GET).header("x-reborn-tiles-contract", TILES_CONTRACT).send().await.unwrap(), StatusCode::UPGRADE_REQUIRED, &[]).await;
    error(request(&server, &member, Method::PUT).header("Origin", "https://other.example").json(&json!({"base_revision":"0","tiles":selected})).send().await.unwrap(), StatusCode::FORBIDDEN, &[]).await;
    let response = server.client.get(server.url(PATH))
        .header("x-reborn-product", PRODUCT).header("x-reborn-contract", "reborn-workspace-v1")
        .header("x-reborn-tiles-contract", TILES_CONTRACT).header("x-csrf-token", &member.csrf)
        .send().await.unwrap();
    error(response, StatusCode::UNAUTHORIZED, &[]).await;
    error(request(&server, &member, Method::PUT).header("x-csrf-token", "invalid").json(&json!({"base_revision":"0","tiles":selected})).send().await.unwrap(), StatusCode::FORBIDDEN, &[]).await;
    assert_eq!(rows(&fixture).await, 0);
    assert_eq!(list(&server, &member).await["layout"]["revision"], "0");
}

#[tokio::test]
async fn tile_compare_and_save_reconciles_unread_winner_and_preserves_failed_writes() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let a = json!([{"id":"games","size":"normal"}]);
    let b = json!([{"id":"downloads","size":"wide"},{"id":"note","size":"normal"}]);
    let (ar, br) = tokio::join!(save(&server, &owner, "0", &a), save(&server, &owner, "0", &b));
    let expected = match (ar.status(), br.status()) {
        (StatusCode::OK, StatusCode::CONFLICT) => a,
        (StatusCode::CONFLICT, StatusCode::OK) => b,
        statuses => panic!("same-base tile writes failed to serialize: {statuses:?}"),
    };
    drop(ar);
    drop(br);
    let retained = list(&server, &owner).await["layout"].clone();
    assert_eq!(retained, json!({"revision":"1","tiles":expected}));
    error(save(&server, &owner, "0", &owner_defaults()).await, StatusCode::CONFLICT, &[]).await;
    let mut db = fixture.connect().await;
    db.execute("ALTER TABLE dashboard_tiles ADD CONSTRAINT fixture_reject_tile_save CHECK (revision < 0) NOT VALID").await.unwrap();
    error(save(&server, &owner, "1", &owner_defaults()).await, StatusCode::SERVICE_UNAVAILABLE, &[]).await;
    db.execute("ALTER TABLE dashboard_tiles DROP CONSTRAINT fixture_reject_tile_save").await.unwrap();
    assert_eq!(list(&server, &owner).await["layout"], retained);
    sqlx::query("UPDATE dashboard_tiles SET revision = $1 WHERE account_id = $2")
        .bind(i64::MAX).bind(account_id(&owner)).execute(&mut db).await.unwrap();
    error(save(&server, &owner, &i64::MAX.to_string(), &owner_defaults()).await, StatusCode::SERVICE_UNAVAILABLE, &[]).await;
    assert_eq!(list(&server, &owner).await["layout"]["tiles"], retained["tiles"]);
    assert_eq!(history(&server, &owner, "").await["entries"], json!([]));
}

#[tokio::test]
async fn tile_sql_constraints_reject_invalid_arrays_and_preserve_the_legacy_layout() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let mut db = fixture.connect().await;
    for (order, sizes, revision) in [
        ("{}", "{}", 1_i64),
        ("{games,games}", "{normal,wide}", 1),
        ("{unknown}", "{normal}", 1),
        ("{games}", "{huge}", 1),
        ("{games,note}", "{normal}", 1),
        ("{games,NULL}", "{normal,normal}", 1),
        ("{games}", "{NULL}", 1),
        ("[0:0]={games}", "{normal}", 1),
        ("{games}", "[0:0]={normal}", 1),
        ("{{games,note}}", "{{normal,normal}}", 1),
        ("{games}", "{normal}", 0),
    ] {
        let result = sqlx::query("INSERT INTO dashboard_tiles (account_id, revision, tile_order, tile_sizes) VALUES ($1,$2,$3::text::text[],$4::text::text[])")
            .bind(account_id(&owner)).bind(revision).bind(order).bind(sizes).execute(&mut db).await;
        assert!(matches!(result, Err(sqlx::Error::Database(ref error)) if error.code().as_deref() == Some("23514")), "invalid persisted tile document was accepted: {order}/{sizes}/{revision}");
    }
    assert_eq!(rows(&fixture).await, 0);
    assert_eq!(home_layout(&server, &owner).await, json!({"revision":"0","panels":home_panels(["note","connections","pins"],None)}));
}

#[tokio::test]
async fn tile_role_changes_filter_private_selections_without_rewriting_saved_data() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let selected = json!([{"id":"jellyfin","size":"wide"},{"id":"requests","size":"normal"}]);
    assert_eq!(save(&server, &owner, "0", &selected).await.status(), StatusCode::OK);
    let mut db = fixture.connect().await;
    let mut tx = db.begin().await.unwrap();
    sqlx::query("UPDATE auth_state SET owner_id = NULL WHERE singleton = TRUE").execute(&mut *tx).await.unwrap();
    sqlx::query("UPDATE users SET role = 'member' WHERE id = $1").bind(account_id(&owner)).execute(&mut *tx).await.unwrap();
    tx.commit().await.unwrap();
    let response = request(&server, &owner, Method::GET).send().await.unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    no_cookie(&response);
    let value: Value = response.json().await.unwrap();
    assert_eq!(value["account"]["role"], "member");
    assert_eq!(value["defaults"], member_defaults());
    assert_eq!(value["layout"], json!({"revision":"1","tiles":member_defaults()}));
    assert_eq!(value["catalog"].as_array().unwrap().iter().map(|v|v["id"].as_str().unwrap()).collect::<Vec<_>>(), ["games","services","note"]);
    let retained: Vec<String> = sqlx::query_scalar("SELECT tile_order FROM dashboard_tiles WHERE account_id = $1").bind(account_id(&owner)).fetch_one(&mut db).await.unwrap();
    assert_eq!(retained, ["jellyfin", "requests"]);
    error(save(&server, &owner, "1", &selected).await, StatusCode::BAD_REQUEST, &[]).await;
    assert_eq!(save(&server, &owner, "1", &member_defaults()).await.status(), StatusCode::OK);
}

#[tokio::test]
async fn tile_save_rechecks_revocation_after_waiting_for_current_authority() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let member = notification_member(&server, &owner, "tile_recheck_member").await;
    let mut locking = fixture.connect().await;
    let mut tx = locking.begin().await.unwrap();
    sqlx::query("SELECT singleton FROM auth_state WHERE singleton = TRUE FOR UPDATE").fetch_one(&mut *tx).await.unwrap();
    let pending = request(&server, &member, Method::PUT).json(&json!({"base_revision":"0","tiles":member_defaults()})).build().unwrap();
    let client = server.client.clone();
    let waiting = tokio::spawn(async move { client.execute(pending).await.unwrap() });
    let mut observer = fixture.connect().await;
    let deadline = Instant::now() + Duration::from_millis(2500);
    loop {
        let blocked: bool = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE datname = current_database() AND wait_event_type = 'Lock' AND query LIKE 'SELECT key_id, setup_hash,%FOR UPDATE%')").fetch_one(&mut observer).await.unwrap();
        if blocked { break; }
        assert!(Instant::now() < deadline, "tile save never reached the shared authority lock");
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
    sqlx::query("UPDATE sessions SET revoked = TRUE WHERE account_id = $1").bind(account_id(&member)).execute(&mut *tx).await.unwrap();
    tx.commit().await.unwrap();
    error(waiting.await.unwrap(), StatusCode::UNAUTHORIZED, &[&member.cookie, &member.csrf]).await;
    assert_eq!(rows(&fixture).await, 0);
}
