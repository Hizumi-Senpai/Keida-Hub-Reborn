//! Read-only reconnect admission through the real Rust/PostgreSQL HTTP caller.
use super::*;
const ACCESS: &str = "/api/workspace/access";

fn no_cookie(response: &Response) {
    assert!(
        response
            .headers()
            .get_all("set-cookie")
            .iter()
            .next()
            .is_none()
    );
}
async fn data(fixture: &Fixture) -> Vec<Value> {
    let mut db = fixture.connect().await;
    let mut result = Vec::new();
    // Fixed fixture-only relation allowlist; compare every durable domain row.
    for table in [
        "reborn_schema",
        "users",
        "auth_state",
        "sessions",
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
        let sql = format!(
            "SELECT COALESCE(jsonb_agg(to_jsonb(t) ORDER BY to_jsonb(t)::text), '[]'::jsonb) FROM {table} t"
        );
        result.push(
            sqlx::query_scalar(sqlx::AssertSqlSafe(sql.as_str()))
                .fetch_one(&mut db)
                .await
                .unwrap(),
        );
    }
    result
}
async fn access(server: &Server, actor: &Session) -> Response {
    workspace_request(server, actor, Method::GET, ACCESS)
        .send()
        .await
        .unwrap()
}
#[tokio::test]
async fn refresh_probe_is_small_private_scoped_and_durable_read_only() {
    let fixture = Fixture::new().await;
    let (server, owner, setup) = claimed(&fixture).await;
    let member = notification_member(&server, &owner, "refresh_member").await;
    let before = data(&fixture).await;
    let health: Value = server
        .client
        .get(server.url("/api/health"))
        .send()
        .await
        .unwrap()
        .json()
        .await
        .unwrap();
    for actor in [&owner, &member] {
        let response = access(&server, actor).await;
        assert_eq!(response.status(), StatusCode::OK);
        assert_no_store(&response);
        no_cookie(&response);
        let text = response.text().await.unwrap();
        assert!(text.len() < 2048);
        assert_private_text(
            &text,
            &[
                &setup,
                &owner.cookie,
                &owner.csrf,
                &member.cookie,
                &member.csrf,
                OWNER_PASSWORD,
                MEMBER_PASSWORD,
            ],
        );
        let value: Value = serde_json::from_str(&text).unwrap();
        assert_eq!(value.as_object().unwrap().len(), 6);
        assert_eq!(value["product"], PRODUCT);
        assert_eq!(value["contract"], "reborn-workspace-v1");
        assert_eq!(value["schema"], 1);
        assert_eq!(value["account"], actor.account);
        assert_eq!(value["session_generation"], "0");
        assert_eq!(value["identity"], health["identity"]);
        for field in [
            "note",
            "crafty",
            "directory",
            "sessions",
            "public_ref",
            "password",
            "csrf_token",
            "token",
            "key_id",
        ] {
            assert!(value.get(field).is_none());
        }
    }
    assert_eq!(before, data(&fixture).await);
}
#[tokio::test]
async fn refresh_probe_refuses_ambiguous_and_unsupported_admission_without_cookie_effects() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let before = data(&fixture).await;
    for (cookie, product, contract, csrf, expected) in [
        (
            owner.cookie.clone(),
            PRODUCT,
            "reborn-workspace-v2",
            owner.csrf.as_str(),
            StatusCode::UPGRADE_REQUIRED,
        ),
        (
            owner.cookie.clone(),
            "keida-hub-rewrite",
            "reborn-workspace-v1",
            owner.csrf.as_str(),
            StatusCode::UPGRADE_REQUIRED,
        ),
        (
            owner.cookie.clone(),
            PRODUCT,
            "reborn-workspace-v1",
            "invalid-binding",
            StatusCode::FORBIDDEN,
        ),
        (
            String::new(),
            PRODUCT,
            "reborn-workspace-v1",
            owner.csrf.as_str(),
            StatusCode::UNAUTHORIZED,
        ),
        (
            format!("{}; {}", owner.cookie, owner.cookie),
            PRODUCT,
            "reborn-workspace-v1",
            owner.csrf.as_str(),
            StatusCode::UNAUTHORIZED,
        ),
    ] {
        let response = server
            .client
            .get(server.url(ACCESS))
            .header("Cookie", cookie)
            .header("X-Reborn-Product", product)
            .header("X-Reborn-Contract", contract)
            .header("X-CSRF-Token", csrf)
            .send()
            .await
            .unwrap();
        no_cookie(&response);
        error(response, expected, &[&owner.cookie]).await;
    }
    for method in [Method::POST, Method::PUT, Method::DELETE] {
        let response = workspace_request(&server, &owner, method, ACCESS)
            .send()
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::METHOD_NOT_ALLOWED);
        no_cookie(&response);
    }
    assert_eq!(before, data(&fixture).await);
}
#[tokio::test]
async fn refresh_probe_rechecks_revocation_generation_activation_expiry_and_instance_key() {
    for change in [
        "UPDATE sessions SET revoked=TRUE",
        "UPDATE users SET generation=generation+1",
        "UPDATE users SET active=FALSE",
        "UPDATE sessions SET created_at=0,expires_at=1",
        "UPDATE auth_state SET key_id=decode(repeat('ab',32),'hex')",
    ] {
        let fixture = Fixture::new().await;
        let (server, owner, _) = claimed(&fixture).await;
        let mut db = fixture.connect().await;
        sqlx::raw_sql(change).execute(&mut db).await.unwrap();
        let before = data(&fixture).await;
        let response = access(&server, &owner).await;
        no_cookie(&response);
        let expected = if change.contains("key_id") {
            StatusCode::SERVICE_UNAVAILABLE
        } else {
            StatusCode::UNAUTHORIZED
        };
        error(response, expected, &[&owner.cookie, &owner.csrf]).await;
        assert_eq!(before, data(&fixture).await);
    }
}
#[tokio::test]
async fn refresh_probe_refuses_unready_schema_without_durable_or_cookie_effects() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let mut db = fixture.connect().await;
    sqlx::query("UPDATE _sqlx_migrations SET success=FALSE WHERE version=13")
        .execute(&mut db)
        .await
        .unwrap();
    let before = data(&fixture).await;
    let response = access(&server, &owner).await;
    no_cookie(&response);
    error(response, StatusCode::SERVICE_UNAVAILABLE, &[&owner.cookie]).await;
    assert_eq!(before, data(&fixture).await);
}
