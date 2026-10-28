//! Independent expectations for issue27's bounded personal-session authority.
//! All accounts, bearers and database changes belong to disposable fixtures.
use super::*;
use std::collections::BTreeSet;

const LIST: &str = "/api/workspace/sessions";
const REVOKE: &str = "/api/workspace/sessions/revoke";
const ABSENT_ID: &str = "00000000-0000-4000-8000-000000000000";

fn keys(value: &Value, expected: &[&str]) {
    assert_eq!(
        value
            .as_object()
            .expect("closed object")
            .keys()
            .map(String::as_str)
            .collect::<BTreeSet<_>>(),
        expected.iter().copied().collect::<BTreeSet<_>>()
    );
}

fn canonical_id(value: &str) -> bool {
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

fn seconds(value: &Value) -> i64 {
    let text = value.as_str().expect("canonical decimal seconds");
    let parsed: i64 = text.parse().expect("bounded integer seconds");
    assert!(parsed >= 0);
    assert_eq!(text, parsed.to_string());
    parsed
}

fn verifier(actor: &Session) -> Vec<u8> {
    Sha256::digest(actor.cookie.split_once('=').unwrap().1.as_bytes()).to_vec()
}

fn no_auth_cookies(response: &Response) {
    assert!(
        response
            .headers()
            .get_all("set-cookie")
            .iter()
            .next()
            .is_none(),
        "personal-session reads/actions must not touch authentication cookies"
    );
}

fn check_list(value: &Value, actor: &Session, mutation: bool) {
    let mut expected = vec![
        "product",
        "contract",
        "schema",
        "account",
        "session_generation",
        "checked_at",
        "sessions",
    ];
    if mutation {
        expected.push("result");
        assert_eq!(value["result"], "signed_out");
    }
    keys(value, &expected);
    assert_eq!(value["product"], PRODUCT);
    assert_eq!(value["contract"], "reborn-workspace-v1");
    assert_eq!(value["schema"], 1);
    assert_eq!(value["account"], actor.account);
    seconds(&value["session_generation"]);
    let checked = seconds(&value["checked_at"]);
    let rows = value["sessions"]
        .as_array()
        .expect("complete session array");
    assert!(!rows.is_empty() && rows.len() <= 32);
    let mut ids = BTreeSet::new();
    let mut previous: Option<(i64, String)> = None;
    let mut current = 0;
    for row in rows {
        keys(row, &["id", "created_at", "expires_at", "current"]);
        let id = row["id"].as_str().expect("nonbearer selector");
        assert!(canonical_id(id));
        assert!(ids.insert(id));
        let created = seconds(&row["created_at"]);
        let expires = seconds(&row["expires_at"]);
        assert!(created <= checked && expires > checked && expires > created);
        let order = (created, id.to_owned());
        if let Some(previous) = previous {
            assert!(previous > order, "list is not in its frozen stable order");
        }
        previous = Some(order);
        current += usize::from(row["current"].as_bool().expect("current flag"));
    }
    assert_eq!(current, 1, "acting session must occur exactly once");
    assert_private_text(&value.to_string(), &[&actor.cookie, &actor.csrf]);
    for forbidden in [
        "verifier",
        "password_phc",
        "key_id",
        "csrf_token",
        "last_used",
        "user_agent",
        "ip_address",
        "device_name",
    ] {
        assert!(!value.to_string().contains(forbidden));
    }
}

async fn list(server: &Server, actor: &Session) -> Value {
    let response = workspace_request(server, actor, Method::GET, LIST)
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_no_store(&response);
    no_auth_cookies(&response);
    let value = response.json().await.unwrap();
    check_list(&value, actor, false);
    value
}

fn current_id(value: &Value) -> String {
    value["sessions"]
        .as_array()
        .unwrap()
        .iter()
        .find(|row| row["current"] == true)
        .unwrap()["id"]
        .as_str()
        .unwrap()
        .to_owned()
}

async fn revoke(server: &Server, actor: &Session, id: &str) -> Response {
    workspace_request(server, actor, Method::POST, REVOKE)
        .json(&json!({"session_id":id}))
        .send()
        .await
        .unwrap()
}

async fn conflict(server: &Server, actor: &Session, id: &str) {
    let response = revoke(server, actor, id).await;
    no_auth_cookies(&response);
    assert_eq!(
        error(
            response,
            StatusCode::CONFLICT,
            &[&actor.cookie, &actor.csrf]
        )
        .await,
        json!({"error":"conflict"})
    );
}

async fn wait_for_lock(observer: &mut PgConnection, pattern: &str) {
    let deadline = Instant::now() + Duration::from_millis(1500);
    loop {
        let waiting: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE datname=current_database() AND pid<>pg_backend_pid() AND wait_event_type='Lock' AND query LIKE $1)",
        )
        .bind(pattern)
        .fetch_one(&mut *observer)
        .await
        .unwrap();
        if waiting {
            return;
        }
        assert!(
            Instant::now() < deadline,
            "request never reached the contended lock"
        );
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
}

#[tokio::test]
async fn personal_sessions_are_private_and_targeted_signout_preserves_unrelated_access() {
    let fixture = Fixture::new().await;
    let (server, actor, setup) = claimed(&fixture).await;
    let target = server.login("keida_owner", OWNER_PASSWORD).await;
    let third = server.login("keida_owner", OWNER_PASSWORD).await;
    let member = notification_member(&server, &actor, "sessions_member").await;
    let target_id = current_id(&list(&server, &target).await);
    let member_id = current_id(&list(&server, &member).await);
    let before = list(&server, &actor).await;
    assert_eq!(before["sessions"].as_array().unwrap().len(), 3);
    assert_eq!(
        list(&server, &member).await["sessions"]
            .as_array()
            .unwrap()
            .len(),
        1
    );
    assert!(!before.to_string().contains(&member_id));
    let mut db = fixture.connect().await;
    sqlx::query("INSERT INTO discord_links(account_id,revision,flow_generation,discord_id,display_name,verified_at) VALUES($1,7,9,'18446744073709551615','Private accepted identity',123)")
        .bind(actor.account["id"].as_str().unwrap().parse::<i64>().unwrap())
        .execute(&mut db).await.unwrap();
    let untouched: Value = sqlx::query_scalar("SELECT jsonb_build_object('users',(SELECT jsonb_agg(u ORDER BY id) FROM users u),'application',(SELECT jsonb_agg(a) FROM discord_application a),'links',(SELECT jsonb_agg(l ORDER BY account_id) FROM discord_links l),'auth',(SELECT jsonb_agg(a) FROM auth_state a))")
        .fetch_one(&mut db).await.unwrap();
    let all_verifiers: Vec<String> =
        sqlx::query_scalar("SELECT encode(verifier,'hex') FROM sessions")
            .fetch_all(&mut db)
            .await
            .unwrap();
    for private in all_verifiers {
        assert!(!before.to_string().contains(&private));
    }
    let response = revoke(&server, &actor, &target_id).await;
    assert_eq!(response.status(), StatusCode::OK);
    assert_no_store(&response);
    no_auth_cookies(&response);
    let after: Value = response.json().await.unwrap();
    check_list(&after, &actor, true);
    assert_eq!(after["session_generation"], before["session_generation"]);
    assert_eq!(after["sessions"].as_array().unwrap().len(), 2);
    assert!(!after.to_string().contains(&target_id));
    assert_eq!(
        sqlx::query_scalar::<_, Value>("SELECT jsonb_build_object('users',(SELECT jsonb_agg(u ORDER BY id) FROM users u),'application',(SELECT jsonb_agg(a) FROM discord_application a),'links',(SELECT jsonb_agg(l ORDER BY account_id) FROM discord_links l),'auth',(SELECT jsonb_agg(a) FROM auth_state a))")
            .fetch_one(&mut db).await.unwrap(),
        untouched
    );
    for (session, status) in [
        (&actor, StatusCode::OK),
        (&third, StatusCode::OK),
        (&member, StatusCode::OK),
        (&target, StatusCode::UNAUTHORIZED),
    ] {
        let _ = server.session_status(session, status).await;
    }
    for endpoint in [LIST, "/api/workspace/snapshot", "/api/workspace/discord"] {
        error(
            workspace_request(&server, &target, Method::GET, endpoint)
                .send()
                .await
                .unwrap(),
            StatusCode::UNAUTHORIZED,
            &[&target.cookie, &target.csrf],
        )
        .await;
    }
    let unchanged_sessions: Value =
        sqlx::query_scalar("SELECT jsonb_agg(s ORDER BY verifier) FROM sessions s")
            .fetch_one(&mut db)
            .await
            .unwrap();
    let actor_id = current_id(&after);
    for id in [
        target_id.as_str(),
        member_id.as_str(),
        actor_id.as_str(),
        ABSENT_ID,
    ] {
        conflict(&server, &actor, id).await;
    }
    assert_eq!(
        sqlx::query_scalar::<_, Value>("SELECT jsonb_agg(s ORDER BY verifier) FROM sessions s")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        unchanged_sessions
    );
    // Native Account retains a public entrypoint and no SSR session rows.
    let account = server
        .client
        .get(server.url("/account"))
        .header("Cookie", &actor.cookie)
        .send()
        .await
        .unwrap();
    assert_eq!(account.status(), StatusCode::OK);
    let html = account.text().await.unwrap();
    assert!(html.contains("/workspace#sessions"));
    for row in after["sessions"].as_array().unwrap() {
        assert!(!html.contains(row["id"].as_str().unwrap()));
    }
    let response = server
        .client
        .post(server.url("/account/sign-out"))
        .header("Cookie", &actor.cookie)
        .header("Origin", ORIGIN)
        .header("content-type", "application/x-www-form-urlencoded")
        .body(format!(
            "product=keida-hub-reborn&contract=reborn-account-v1&csrf_token={}",
            actor.csrf
        ))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::SEE_OTHER);
    let _ = cookie(&response, SESSION_COOKIE, false);
    let _ = server
        .session_status(&actor, StatusCode::UNAUTHORIZED)
        .await;
    let _ = server.session_status(&third, StatusCode::OK).await;
    server.assert_logs_private(&[
        &setup,
        &actor.cookie,
        &target.cookie,
        &third.cookie,
        &member.cookie,
    ]);
}

#[tokio::test]
async fn personal_session_http_admission_and_selector_language_fail_closed() {
    let fixture = Fixture::new().await;
    let (server, actor, _) = claimed(&fixture).await;
    let other = server.login("keida_owner", OWNER_PASSWORD).await;
    let target = current_id(&list(&server, &other).await);
    let mut db = fixture.connect().await;
    let before: Value = sqlx::query_scalar("SELECT jsonb_agg(s ORDER BY verifier) FROM sessions s")
        .fetch_one(&mut db)
        .await
        .unwrap();
    let invalid = [
        Value::Null,
        json!({}),
        json!({"session_id":7}),
        json!({"session_id":target,"extra":true}),
        json!({"session_id":""}),
        json!({"session_id":"AAAAAAAA-0000-4000-8000-000000000000"}),
        json!({"session_id":target.replace('-', "")}),
        json!({"session_id":format!("{{{target}}}")}),
        json!({"session_id":format!(" {target}")}),
        json!({"session_id":"00000000-0000-1000-8000-000000000000"}),
        json!({"session_id":"00000000-0000-4000-7000-000000000000"}),
        json!({"session_id":"00000000-0000-4000-8000-00000000000g"}),
    ];
    for body in invalid {
        let response = workspace_request(&server, &actor, Method::POST, REVOKE)
            .json(&body)
            .send()
            .await
            .unwrap();
        no_auth_cookies(&response);
        assert_eq!(
            error(response, StatusCode::BAD_REQUEST, &[&actor.cookie]).await,
            json!({"error":"invalid_request"})
        );
    }
    for raw in [
        "not-json".to_owned(),
        format!("{{\"session_id\":\"{target}\",\"session_id\":\"{target}\"}}"),
        "[]".to_owned(),
    ] {
        let response = workspace_request(&server, &actor, Method::POST, REVOKE)
            .header("content-type", "application/json")
            .body(raw)
            .send()
            .await
            .unwrap();
        no_auth_cookies(&response);
        error(response, StatusCode::BAD_REQUEST, &[&actor.cookie]).await;
    }
    for (header, value, wanted, code) in [
        (
            "X-Reborn-Product",
            "other-product",
            StatusCode::UPGRADE_REQUIRED,
            "upgrade_required",
        ),
        (
            "X-Reborn-Contract",
            CONTRACT,
            StatusCode::UPGRADE_REQUIRED,
            "upgrade_required",
        ),
        (
            "Origin",
            "https://foreign.invalid",
            StatusCode::FORBIDDEN,
            "origin_rejected",
        ),
        (
            "X-CSRF-Token",
            "wrong-token",
            StatusCode::FORBIDDEN,
            "csrf_rejected",
        ),
    ] {
        let mut request = workspace_request(&server, &actor, Method::POST, REVOKE)
            .json(&json!({"session_id":target}))
            .build()
            .unwrap();
        request.headers_mut().insert(
            reqwest::header::HeaderName::from_bytes(header.as_bytes()).unwrap(),
            reqwest::header::HeaderValue::from_bytes(value.as_bytes()).unwrap(),
        );
        let response = server.client.execute(request).await.unwrap();
        no_auth_cookies(&response);
        assert_eq!(
            error(response, wanted, &[&actor.cookie]).await,
            json!({"error":code})
        );
    }
    for name in ["origin", "x-csrf-token"] {
        let mut request = workspace_request(&server, &actor, Method::POST, REVOKE)
            .json(&json!({"session_id":target}))
            .build()
            .unwrap();
        request.headers_mut().remove(name);
        let response = server.client.execute(request).await.unwrap();
        no_auth_cookies(&response);
        error(response, StatusCode::FORBIDDEN, &[&actor.cookie]).await;
    }
    let response = server
        .client
        .get(server.url(LIST))
        .header("X-Reborn-Product", PRODUCT)
        .header("X-Reborn-Contract", "reborn-workspace-v1")
        .header("X-CSRF-Token", "0".repeat(64))
        .send()
        .await
        .unwrap();
    no_auth_cookies(&response);
    error(response, StatusCode::UNAUTHORIZED, &[]).await;
    let checksum: Vec<u8> =
        sqlx::query_scalar("SELECT checksum FROM _sqlx_migrations WHERE version=13")
            .fetch_one(&mut db)
            .await
            .unwrap();
    sqlx::query("UPDATE _sqlx_migrations SET checksum=decode('00','hex') WHERE version=13")
        .execute(&mut db)
        .await
        .unwrap();
    for method in [Method::GET, Method::POST] {
        let response = workspace_request(
            &server,
            &actor,
            method.clone(),
            if method == Method::GET { LIST } else { REVOKE },
        )
        .json(&json!({"session_id":target}))
        .send()
        .await
        .unwrap();
        no_auth_cookies(&response);
        error(response, StatusCode::SERVICE_UNAVAILABLE, &[&actor.cookie]).await;
    }
    sqlx::query("UPDATE _sqlx_migrations SET checksum=$1 WHERE version=13")
        .bind(checksum)
        .execute(&mut db)
        .await
        .unwrap();
    assert_eq!(
        sqlx::query_scalar::<_, Value>("SELECT jsonb_agg(s ORDER BY verifier) FROM sessions s")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        before
    );
    assert_eq!(
        list(&server, &actor).await["sessions"]
            .as_array()
            .unwrap()
            .len(),
        2
    );
}

#[tokio::test]
async fn personal_session_list_is_complete_at_32_and_rejects_overflow_without_truncating() {
    let fixture = Fixture::new().await;
    let (server, actor, _) = claimed(&fixture).await;
    let mut db = fixture.connect().await;
    let account = actor.account["id"]
        .as_str()
        .unwrap()
        .parse::<i64>()
        .unwrap();
    let now: i64 =
        sqlx::query_scalar("SELECT floor(extract(epoch FROM clock_timestamp()))::bigint")
            .fetch_one(&mut db)
            .await
            .unwrap();
    for index in 1_u8..=31 {
        sqlx::query("INSERT INTO sessions(verifier,account_id,generation,created_at,expires_at) VALUES($1,$2,0,$3,$4)")
            .bind(vec![index;32]).bind(account).bind(now - i64::from(index)).bind(now+600)
            .execute(&mut db).await.unwrap();
    }
    // All three inactive forms are deliberately retained until the next login.
    for (byte, generation, expires, revoked) in [
        (51_u8, 0, now + 600, true),
        (52, 0, now - 1, false),
        (53, 1, now + 600, false),
    ] {
        sqlx::query("INSERT INTO sessions(verifier,account_id,generation,created_at,expires_at,revoked) VALUES($1,$2,$3,0,$4,$5)")
            .bind(vec![byte;32]).bind(account).bind(generation).bind(expires).bind(revoked)
            .execute(&mut db).await.unwrap();
    }
    let bounded = list(&server, &actor).await;
    assert_eq!(bounded["sessions"].as_array().unwrap().len(), 32);
    let hidden: Vec<String> = sqlx::query_scalar(
        "SELECT public_ref::text FROM sessions WHERE generation<>0 OR revoked OR expires_at<=$1",
    )
    .bind(now)
    .fetch_all(&mut db)
    .await
    .unwrap();
    for id in hidden {
        assert!(!bounded.to_string().contains(&id));
        conflict(&server, &actor, &id).await;
    }
    let before: Value = sqlx::query_scalar("SELECT jsonb_agg(s ORDER BY verifier) FROM sessions s")
        .fetch_one(&mut db)
        .await
        .unwrap();
    sqlx::query("INSERT INTO sessions(verifier,account_id,generation,created_at,expires_at) VALUES($1,$2,0,$3,$4)")
        .bind(vec![54_u8;32]).bind(account).bind(now).bind(now+600).execute(&mut db).await.unwrap();
    let response = workspace_request(&server, &actor, Method::GET, LIST)
        .send()
        .await
        .unwrap();
    no_auth_cookies(&response);
    assert_eq!(
        error(response, StatusCode::SERVICE_UNAVAILABLE, &[&actor.cookie]).await,
        json!({"error":"unavailable"})
    );
    sqlx::query("DELETE FROM sessions WHERE verifier=$1")
        .bind(vec![54_u8; 32])
        .execute(&mut db)
        .await
        .unwrap();
    assert_eq!(
        sqlx::query_scalar::<_, Value>("SELECT jsonb_agg(s ORDER BY verifier) FROM sessions s")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        before
    );
    assert_eq!(
        list(&server, &actor).await["sessions"]
            .as_array()
            .unwrap()
            .len(),
        32
    );
}

#[tokio::test]
async fn acting_session_expiry_while_waiting_for_target_lock_rolls_back_targeted_signout() {
    let fixture = Fixture::new().await;
    let (server, actor, _) = claimed(&fixture).await;
    let target = server.login("keida_owner", OWNER_PASSWORD).await;
    let id = current_id(&list(&server, &target).await);
    let mut observer = fixture.connect().await;
    let expires: i64 = sqlx::query_scalar("UPDATE sessions SET created_at=0,expires_at=floor(extract(epoch FROM clock_timestamp()))::bigint+2 WHERE verifier=$1 RETURNING expires_at")
        .bind(verifier(&actor)).fetch_one(&mut observer).await.unwrap();
    let mut connection = fixture.connect().await;
    let mut tx = connection.begin().await.unwrap();
    let _: String = sqlx::query_scalar(
        "SELECT public_ref::text FROM sessions WHERE public_ref=$1::text::uuid FOR UPDATE",
    )
    .bind(&id)
    .fetch_one(&mut *tx)
    .await
    .unwrap();
    let request = workspace_request(&server, &actor, Method::POST, REVOKE)
        .json(&json!({"session_id":id}))
        .build()
        .unwrap();
    let client = server.client.clone();
    let waiting = tokio::spawn(async move { client.execute(request).await.unwrap() });
    wait_for_lock(&mut observer, "%public_ref%FOR UPDATE%").await;
    let deadline = Instant::now() + Duration::from_secs(3);
    loop {
        let now: i64 =
            sqlx::query_scalar("SELECT floor(extract(epoch FROM clock_timestamp()))::bigint")
                .fetch_one(&mut observer)
                .await
                .unwrap();
        if now >= expires {
            break;
        }
        assert!(Instant::now() < deadline, "fixture expiry deadline");
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
    tx.commit().await.unwrap();
    let response = waiting.await.unwrap();
    no_auth_cookies(&response);
    assert_eq!(
        error(response, StatusCode::UNAUTHORIZED, &[&actor.cookie]).await,
        json!({"error":"invalid_session"})
    );
    assert!(
        !sqlx::query_scalar::<_, bool>(
            "SELECT revoked FROM sessions WHERE public_ref=$1::text::uuid"
        )
        .bind(&id)
        .fetch_one(&mut observer)
        .await
        .unwrap()
    );
    let _ = server.session_status(&target, StatusCode::OK).await;
}

#[tokio::test]
async fn queued_targeted_signout_rechecks_key_actor_generation_activation_and_revocation() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    for (index, change) in ["revoked", "generation", "inactive", "key"]
        .into_iter()
        .enumerate()
    {
        // Different synthetic usernames can share the keyed login bucket.
        // Each race gets a fresh owned-fixture throttle window, not a lucky hash.
        reset_fixture_throttle_windows(&fixture).await;
        let username = format!("sessions_lock_member_{index}");
        let actor = notification_member(&server, &owner, &username).await;
        let target = server.login(&username, MEMBER_PASSWORD).await;
        let id = current_id(&list(&server, &target).await);
        let account = actor.account["id"]
            .as_str()
            .unwrap()
            .parse::<i64>()
            .unwrap();
        let mut connection = fixture.connect().await;
        let mut tx = connection.begin().await.unwrap();
        let _: bool =
            sqlx::query_scalar("SELECT singleton FROM auth_state WHERE singleton=TRUE FOR UPDATE")
                .fetch_one(&mut *tx)
                .await
                .unwrap();
        let old_key: Option<Vec<u8>> =
            sqlx::query_scalar("SELECT key_id FROM auth_state WHERE singleton=TRUE")
                .fetch_one(&mut *tx)
                .await
                .unwrap();
        let request = workspace_request(&server, &actor, Method::POST, REVOKE)
            .json(&json!({"session_id":id}))
            .build()
            .unwrap();
        let client = server.client.clone();
        let waiting = tokio::spawn(async move { client.execute(request).await.unwrap() });
        let mut observer = fixture.connect().await;
        wait_for_lock(&mut observer, "SELECT key_id, setup_hash,%FOR UPDATE%").await;
        match change {
            "revoked" => {
                sqlx::query("UPDATE sessions SET revoked=TRUE WHERE verifier=$1")
                    .bind(verifier(&actor))
                    .execute(&mut *tx)
                    .await
                    .unwrap();
            }
            "generation" => {
                sqlx::query("UPDATE users SET generation=generation+1 WHERE id=$1")
                    .bind(account)
                    .execute(&mut *tx)
                    .await
                    .unwrap();
            }
            "inactive" => {
                sqlx::query("UPDATE users SET active=FALSE WHERE id=$1")
                    .bind(account)
                    .execute(&mut *tx)
                    .await
                    .unwrap();
            }
            "key" => {
                sqlx::query("UPDATE auth_state SET key_id=$1 WHERE singleton=TRUE")
                    .bind(vec![73_u8; 32])
                    .execute(&mut *tx)
                    .await
                    .unwrap();
            }
            _ => unreachable!(),
        }
        tx.commit().await.unwrap();
        let response = waiting.await.unwrap();
        no_auth_cookies(&response);
        error(
            response,
            if change == "key" {
                StatusCode::SERVICE_UNAVAILABLE
            } else {
                StatusCode::UNAUTHORIZED
            },
            &[&actor.cookie],
        )
        .await;
        if change == "key" {
            sqlx::query("UPDATE auth_state SET key_id=$1 WHERE singleton=TRUE")
                .bind(old_key)
                .execute(&mut observer)
                .await
                .unwrap();
        }
        assert!(
            !sqlx::query_scalar::<_, bool>(
                "SELECT revoked FROM sessions WHERE public_ref=$1::text::uuid"
            )
            .bind(&id)
            .fetch_one(&mut observer)
            .await
            .unwrap()
        );
    }
    let _ = server.session_status(&owner, StatusCode::OK).await;
}

#[tokio::test]
async fn concurrent_new_login_survives_targeted_signout_without_generation_change() {
    let fixture = Fixture::new().await;
    let (server, actor, _) = claimed(&fixture).await;
    let target = server.login("keida_owner", OWNER_PASSWORD).await;
    let target_id = current_id(&list(&server, &target).await);
    let form = server.form(false).await;
    let login = server
        .admitted(Method::POST, "/api/auth/login")
        .header("Cookie", &form.cookie)
        .header("X-CSRF-Token", &form.csrf)
        .json(&json!({"username":"keida_owner","password":OWNER_PASSWORD}))
        .build()
        .unwrap();
    let mut connection = fixture.connect().await;
    let mut tx = connection.begin().await.unwrap();
    let _: String = sqlx::query_scalar(
        "SELECT public_ref::text FROM sessions WHERE public_ref=$1::text::uuid FOR UPDATE",
    )
    .bind(&target_id)
    .fetch_one(&mut *tx)
    .await
    .unwrap();
    let request = workspace_request(&server, &actor, Method::POST, REVOKE)
        .json(&json!({"session_id":target_id}))
        .build()
        .unwrap();
    let client = server.client.clone();
    let revoking = tokio::spawn(async move { client.execute(request).await.unwrap() });
    let mut observer = fixture.connect().await;
    wait_for_lock(&mut observer, "%public_ref%FOR UPDATE%").await;
    let client = server.client.clone();
    let logging_in = tokio::spawn(async move { client.execute(login).await.unwrap() });
    wait_for_lock(&mut observer, "SELECT key_id, setup_hash,%FOR UPDATE%").await;
    tx.commit().await.unwrap();
    let response = revoking.await.unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    no_auth_cookies(&response);
    let signed_in = Session::from_response(logging_in.await.unwrap(), StatusCode::OK).await;
    let current = list(&server, &actor).await;
    assert_eq!(current["session_generation"], "0");
    assert_eq!(current["sessions"].as_array().unwrap().len(), 2);
    assert!(!current.to_string().contains(&target_id));
    let _ = server.session_status(&signed_in, StatusCode::OK).await;
    let _ = server.session_status(&actor, StatusCode::OK).await;
    let _ = server
        .session_status(&target, StatusCode::UNAUTHORIZED)
        .await;
}
