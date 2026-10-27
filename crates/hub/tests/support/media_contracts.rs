//! HTTP expectations are independent of the shared fictional provider payloads.
use super::*;
use reborn_crafty_fixture::media as m;
use sqlx::Executor;

fn enrollment(provider: &m::Media, name: &str) -> Value {
    json!({"endpoint":format!("{}/",provider.origin),"token":m::TOKEN,"ca_pem":provider.ca,
        "library_id":if name=="jellyfin"{Some(m::LIBRARY_ID)}else{None},"acknowledge_broad_access":true})
}

fn request(server: &Server, owner: &Session, method: Method, path: &str) -> RequestBuilder {
    workspace_request(server, owner, method, path)
}

async fn put(
    server: &Server,
    actor: &Session,
    name: &str,
    base: i64,
    connection: Value,
) -> Response {
    request(
        server,
        actor,
        Method::PUT,
        &format!("/api/owner/media/{name}"),
    )
    .json(&json!({"base_revision":base.to_string(),"connection":connection}))
    .send()
    .await
    .unwrap()
}

async fn enroll(server: &Server, owner: &Session, name: &str, base: i64, connection: Value) {
    let response = put(server, owner, name, base, connection.clone()).await;
    assert_eq!(response.status(), StatusCode::OK);
    assert_no_store(&response);
    let text = response.text().await.unwrap();
    assert_private_text(&text, &[m::TOKEN, &owner.cookie, &owner.csrf]);
    assert_eq!(
        serde_json::from_str::<Value>(&text).unwrap(),
        json!({"revision":(base+1).to_string(),"configured":!connection.is_null()})
    );
}

fn private(value: &Value, provider: &m::Media, actor: &Session) {
    let body = value.to_string();
    assert_private_text(
        &body,
        &[
            m::TOKEN,
            &provider.origin,
            &provider.ca,
            &actor.cookie,
            &actor.csrf,
            "PRIVATE_MEDIA_",
            "PRIVATE_REQUESTER",
            "PRIVATE_MODIFIER",
            "PRIVATE_PROFILE_ID",
            "PRIVATE_WATCH_",
            "PRIVATE_PAUSED_",
            "PRIVATE_IDLE_USER",
            "private-media-email@example.invalid",
            "/private/media-fixture-path",
            "198.51.100.77",
            "media-private.invalid",
            "-----BEGIN CERTIFICATE-----",
            "00000000000000000000000000000001",
        ],
    );
}

async fn read(server: &Server, actor: &Session, name: &str, suffix: &str) -> Response {
    request(
        server,
        actor,
        Method::GET,
        &format!("/api/workspace/media/{name}{suffix}"),
    )
    .send()
    .await
    .unwrap()
}

async fn observation(
    server: &Server,
    actor: &Session,
    provider: &m::Media,
    name: &str,
    offset: u32,
) -> Value {
    let deadline = Instant::now() + Duration::from_secs(7);
    loop {
        let response = read(server, actor, name, &format!("?offset={offset}")).await;
        assert_eq!(response.status(), StatusCode::OK);
        assert_no_store(&response);
        let value: Value = response.json().await.unwrap();
        assert_eq!(value["product"], PRODUCT);
        assert_eq!(value["contract"], "reborn-workspace-v1");
        assert_eq!(value["schema"], 1);
        assert_eq!(value["account"], actor.account);
        assert!(value["session_generation"].as_str().is_some());
        assert_eq!(value["provider"], name);
        private(&value, provider, actor);
        if value["observation"]["error"] != "checking" {
            return value["observation"].clone();
        }
        assert!(
            Instant::now() < deadline,
            "media collection never reached a bounded result"
        );
        tokio::time::sleep(Duration::from_millis(20)).await;
    }
}

#[tokio::test]
async fn media_enrollment_is_owner_only_canonical_encrypted_and_has_no_secret_readback() {
    let fixture = Fixture::new().await;
    let (server, owner, secret) = claimed(&fixture).await;
    let member = notification_member(&server, &owner, "media_member").await;
    let provider = m::Media::start().await.unwrap();
    for name in ["jellyfin", "seerr"] {
        let status = request(
            &server,
            &owner,
            Method::GET,
            &format!("/api/owner/media/{name}"),
        )
        .send()
        .await
        .unwrap();
        assert_no_store(&status);
        assert_eq!(
            status.json::<Value>().await.unwrap(),
            json!({"revision":"0","configured":false})
        );
        let unconfigured = observation(&server, &owner, &provider, name, 0).await;
        assert_eq!(unconfigured["configured"], false);
        assert_eq!(unconfigured["items"], json!([]));
        assert!(unconfigured["checked_at"].is_null());
        error(
            request(
                &server,
                &member,
                Method::GET,
                &format!("/api/owner/media/{name}"),
            )
            .send()
            .await
            .unwrap(),
            StatusCode::FORBIDDEN,
            &[m::TOKEN],
        )
        .await;
        error(
            read(&server, &member, name, "").await,
            StatusCode::FORBIDDEN,
            &[m::TOKEN],
        )
        .await;
        error(
            put(&server, &member, name, 0, json!({"untrusted":"invalid"})).await,
            StatusCode::FORBIDDEN,
            &[m::TOKEN],
        )
        .await;
        error(
            server
                .client
                .get(server.url(&format!("/api/workspace/media/{name}")))
                .header("X-Reborn-Product", PRODUCT)
                .header("X-Reborn-Contract", "reborn-workspace-v1")
                .send()
                .await
                .unwrap(),
            StatusCode::UNAUTHORIZED,
            &[m::TOKEN],
        )
        .await;
    }
    for body in [
        json!({"base_revision":"0"}),
        json!({"base_revision":"00","connection":null}),
        json!({"base_revision":"+0","connection":null}),
        json!({"base_revision":"9223372036854775808","connection":null}),
        json!({"base_revision":"0","connection":null,"provider":"seerr"}),
    ] {
        error(
            request(&server, &owner, Method::PUT, "/api/owner/media/jellyfin")
                .json(&body)
                .send()
                .await
                .unwrap(),
            StatusCode::BAD_REQUEST,
            &[m::TOKEN],
        )
        .await;
    }
    for (field, bad) in [
        ("endpoint", json!("http://localhost/")),
        ("token", json!("bad\r\nheader")),
        ("ca_pem", json!("not a certificate")),
        ("library_id", Value::Null),
        ("acknowledge_broad_access", json!(false)),
    ] {
        let mut config = enrollment(&provider, "jellyfin");
        config[field] = bad;
        error(
            put(&server, &owner, "jellyfin", 0, config).await,
            StatusCode::BAD_REQUEST,
            &[m::TOKEN],
        )
        .await;
    }
    let mut config = enrollment(&provider, "seerr");
    config["library_id"] = json!(m::LIBRARY_ID);
    error(
        put(&server, &owner, "seerr", 0, config).await,
        StatusCode::BAD_REQUEST,
        &[m::TOKEN],
    )
    .await;
    let base = json!({"base_revision":"0","connection":enrollment(&provider,"jellyfin")});
    for (header, value, expected) in [
        (
            "X-Reborn-Contract",
            "other-contract",
            StatusCode::UPGRADE_REQUIRED,
        ),
        ("X-CSRF-Token", "wrong", StatusCode::FORBIDDEN),
        ("Origin", "https://other.example", StatusCode::FORBIDDEN),
    ] {
        error(
            request(&server, &owner, Method::PUT, "/api/owner/media/jellyfin")
                .header(header, value)
                .json(&base)
                .send()
                .await
                .unwrap(),
            expected,
            &[m::TOKEN],
        )
        .await;
    }
    enroll(
        &server,
        &owner,
        "jellyfin",
        0,
        enrollment(&provider, "jellyfin"),
    )
    .await;
    enroll(&server, &owner, "seerr", 0, enrollment(&provider, "seerr")).await;
    error(
        put(&server, &owner, "jellyfin", 0, Value::Null).await,
        StatusCode::CONFLICT,
        &[m::TOKEN],
    )
    .await;
    let mut db = fixture.connect().await;
    let rows =
        sqlx::query("SELECT provider,revision,sealed FROM media_connections ORDER BY provider")
            .fetch_all(&mut db)
            .await
            .unwrap();
    assert_eq!(rows.len(), 2);
    for row in rows {
        assert_eq!(row.get::<i64, _>("revision"), 1);
        let bytes: Vec<u8> = row.get("sealed");
        assert!(bytes.len() > 60);
        assert!(
            !bytes
                .windows(m::TOKEN.len())
                .any(|w| w == m::TOKEN.as_bytes())
        );
    }
    assert_eq!(sqlx::query_scalar::<_,i64>("SELECT count(*) FROM activity_events WHERE kind IN ('connection_saved','connection_removed')").fetch_one(&mut db).await.unwrap(),0,"media enrollment was mislabeled as Crafty activity");
    assert_eq!(
        sqlx::query_scalar::<_, i64>("SELECT count(*) FROM notification_groups")
            .fetch_one(&mut db)
            .await
            .unwrap(),
        0,
        "owner-only media emitted a shared notice"
    );
    assert!(
        provider.requests().is_empty(),
        "enrollment or status must not probe provider"
    );
    for suffix in [
        "?offset=01",
        "?offset=-1",
        "?offset=1",
        "?offset=60",
        "?offset=0&offset=12",
        "?offset=0&token=secret",
        "?provider=seerr",
    ] {
        error(
            read(&server, &owner, "jellyfin", suffix).await,
            StatusCode::BAD_REQUEST,
            &[m::TOKEN],
        )
        .await;
    }
    error(
        read(&server, &owner, "other", "").await,
        StatusCode::BAD_REQUEST,
        &[m::TOKEN],
    )
    .await;
    server.assert_logs_private(&[
        &secret,
        m::TOKEN,
        &provider.origin,
        &owner.cookie,
        &member.cookie,
    ]);
}

#[tokio::test]
async fn media_real_https_pages_counts_cache_privacy_and_restored_enrollment_are_useful() {
    let fixture = Fixture::new().await;
    let (server, owner, secret) = claimed(&fixture).await;
    let provider = m::Media::start().await.unwrap();
    for name in ["jellyfin", "seerr"] {
        enroll(&server, &owner, name, 0, enrollment(&provider, name)).await;
    }
    let jellyfin = observation(&server, &owner, &provider, "jellyfin", 0).await;
    assert_eq!(jellyfin["complete"], true);
    assert_eq!(jellyfin["freshness"], "fresh");
    assert_eq!(jellyfin["items"].as_array().unwrap().len(), 12);
    assert_eq!(jellyfin["total"], 26);
    assert_eq!(jellyfin["next_offset"], 12);
    assert_eq!(jellyfin["items"][0]["title"], "Fixture movie");
    assert_eq!(jellyfin["items"][1]["title"], "Fixture series");
    assert_eq!(
        jellyfin["playback"],
        json!({"playing":1,"paused":1,"error":null})
    );
    for row in jellyfin["items"].as_array().unwrap() {
        assert!(canonical_token(row["id"].as_str().unwrap()));
        assert!(row["request_status"].is_null());
    }
    let requests = provider.requests();
    assert_eq!(requests.len(), 2);
    assert_eq!(
        observation(&server, &owner, &provider, "jellyfin", 0).await,
        jellyfin
    );
    assert_eq!(
        provider.requests(),
        requests,
        "cached read recollected the provider"
    );
    let seerr = observation(&server, &owner, &provider, "seerr", 0).await;
    assert_eq!(seerr["complete"], true);
    assert_eq!(seerr["items"][0]["title"], "Requested movie");
    assert_eq!(seerr["items"][0]["request_status"], "pending");
    assert_eq!(seerr["items"][1]["title"], "Requested series");
    assert_eq!(seerr["items"][1]["request_status"], "completed");
    assert!(seerr["playback"].is_null());
    let end = observation(&server, &owner, &provider, "jellyfin", 24).await;
    assert_eq!(end["items"].as_array().unwrap().len(), 2);
    assert!(end["next_offset"].is_null());
    assert_eq!(end["truncated"], false);
    for (method, path) in provider.requests() {
        assert_eq!(method, "GET");
        assert!(
            path.starts_with("/Items?")
                || path == "/Sessions?activeWithinSeconds=120"
                || path.starts_with("/api/v1/request?")
                || path.starts_with("/api/v1/movie/")
                || path.starts_with("/api/v1/tv/")
        );
        assert!(!path.contains(m::TOKEN));
    }
    server.assert_logs_private(&[m::TOKEN, &secret, &owner.cookie, &provider.origin]);
    drop(server);
    let server = Server::start(&fixture, Some(&fixture.key_file)).await;
    let restored = observation(&server, &owner, &provider, "seerr", 0).await;
    assert_eq!(restored["items"][0]["title"], "Requested movie");
    assert_eq!(restored["revision"], "1");
    enroll(&server, &owner, "seerr", 1, Value::Null).await;
    let removed = observation(&server, &owner, &provider, "seerr", 0).await;
    assert_eq!(removed["revision"], "2");
    assert_eq!(removed["configured"], false);
    assert_eq!(removed["items"], json!([]));
    enroll(&server, &owner, "seerr", 2, enrollment(&provider, "seerr")).await;
    assert_eq!(
        observation(&server, &owner, &provider, "seerr", 0).await["revision"],
        "3"
    );
    provider.mode(m::MANY);
    enroll(
        &server,
        &owner,
        "jellyfin",
        1,
        enrollment(&provider, "jellyfin"),
    )
    .await;
    let bounded = observation(&server, &owner, &provider, "jellyfin", 48).await;
    assert_eq!(bounded["total"], 80);
    assert_eq!(bounded["items"].as_array().unwrap().len(), 12);
    assert!(bounded["next_offset"].is_null());
    assert_eq!(bounded["truncated"], true);
}

#[tokio::test]
async fn media_empty_unknown_partial_and_all_bounded_transport_failures_remain_distinct() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let provider = m::Media::start().await.unwrap();
    let mut revision = 0;
    for (mode, expected) in [
        (m::EMPTY, None),
        (m::MISSING, None),
        (m::DENIED, Some("denied")),
        (m::MALFORMED, Some("malformed")),
        (m::DUPLICATE, Some("malformed")),
        (m::LARGE, Some("oversized")),
        (m::CHUNKED, Some("oversized")),
        (m::REDIRECT, Some("provider_error")),
        (m::TIMEOUT, Some("timeout")),
    ] {
        provider.mode(mode);
        enroll(
            &server,
            &owner,
            "jellyfin",
            revision,
            enrollment(&provider, "jellyfin"),
        )
        .await;
        revision += 1;
        let value = observation(&server, &owner, &provider, "jellyfin", 0).await;
        if let Some(error) = expected {
            assert_eq!(value["error"], error);
            assert_eq!(value["complete"], false);
            assert!(value["total"].is_null());
            assert!(value["playback"]["playing"].is_null());
            assert!(value["playback"]["paused"].is_null());
        } else if mode == m::EMPTY {
            assert_eq!(value["complete"], true);
            assert_eq!(value["total"], 0);
            assert_eq!(value["items"], json!([]));
            assert_eq!(
                value["playback"],
                json!({"playing":0,"paused":0,"error":null})
            );
        } else {
            assert_eq!(value["complete"], false);
            assert!(value["items"][0]["title"].is_null());
            assert!(value["playback"]["playing"].is_null());
            assert!(value["playback"]["paused"].is_null());
        }
    }
    provider.mode(m::TOO_MANY_SESSIONS);
    enroll(
        &server,
        &owner,
        "jellyfin",
        revision,
        enrollment(&provider, "jellyfin"),
    )
    .await;
    revision += 1;
    let value = observation(&server, &owner, &provider, "jellyfin", 0).await;
    assert_eq!(value["complete"], false);
    assert!(value["playback"]["playing"].is_null());
    assert!(value["playback"]["paused"].is_null());
    provider.mode(m::NORMAL);
    let mut tls = enrollment(&provider, "jellyfin");
    tls["ca_pem"] = json!("");
    enroll(&server, &owner, "jellyfin", revision, tls).await;
    assert_eq!(
        observation(&server, &owner, &provider, "jellyfin", 0).await["error"],
        "transport"
    );
    for (base, mode, error) in [
        (0, m::DETAIL_FAILED, "provider_error"),
        (1, m::MISSING, "malformed"),
    ] {
        provider.mode(mode);
        enroll(
            &server,
            &owner,
            "seerr",
            base,
            enrollment(&provider, "seerr"),
        )
        .await;
        let partial = observation(&server, &owner, &provider, "seerr", 0).await;
        assert_eq!(partial["complete"], false);
        assert_eq!(partial["items"].as_array().unwrap().len(), 12);
        assert_eq!(partial["items"][0]["request_status"], "pending");
        assert!(partial["items"][0]["title"].is_null());
        assert_eq!(partial["items"][0]["detail_error"], error);
    }
    assert!(
        provider
            .requests()
            .iter()
            .all(|(method, _)| method == "GET")
    );
}

#[tokio::test]
async fn media_background_flights_are_independent_and_held_old_enrollment_is_never_disclosed() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let held = m::Media::start().await.unwrap();
    held.mode(m::HOLD);
    let healthy = m::Media::start().await.unwrap();
    enroll(
        &server,
        &owner,
        "jellyfin",
        0,
        enrollment(&held, "jellyfin"),
    )
    .await;
    enroll(&server, &owner, "seerr", 0, enrollment(&healthy, "seerr")).await;
    let started = Instant::now();
    let checking: Value = read(&server, &owner, "jellyfin", "")
        .await
        .json()
        .await
        .unwrap();
    assert_eq!(checking["observation"]["error"], "checking");
    assert!(
        started.elapsed() < Duration::from_secs(1),
        "demand read blocked on provider IO"
    );
    tokio::time::timeout(Duration::from_secs(2), held.entered())
        .await
        .unwrap();
    let seerr = observation(&server, &owner, &healthy, "seerr", 0).await;
    assert_eq!(seerr["items"][0]["title"], "Requested movie");
    let mut db = fixture.connect().await;
    assert!(!sqlx::query_scalar::<_,bool>("SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE datname=current_database() AND state LIKE 'idle in transaction%')").fetch_one(&mut db).await.unwrap(),"media IO retained an authority transaction");
    for _ in 0..8 {
        let _ = read(&server, &owner, "jellyfin", "").await;
    }
    assert!(
        (1..=2).contains(&held.requests().len()),
        "concurrent checking requests duplicated the two-call provider flight"
    );
    enroll(&server, &owner, "jellyfin", 1, Value::Null).await;
    held.mode(m::NORMAL);
    held.release();
    let current = observation(&server, &owner, &held, "jellyfin", 0).await;
    assert_eq!(current["configured"], false);
    assert_eq!(current["revision"], "2");
    assert_eq!(current["items"], json!([]));
    enroll(
        &server,
        &owner,
        "jellyfin",
        2,
        enrollment(&healthy, "jellyfin"),
    )
    .await;
    let current = observation(&server, &owner, &healthy, "jellyfin", 0).await;
    assert_eq!(current["revision"], "3");
    assert_eq!(current["items"][0]["title"], "Fixture movie");
}

#[tokio::test]
async fn media_rechecks_revoked_owner_key_and_provider_bound_ciphertext_before_disclosure() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let provider = m::Media::start().await.unwrap();
    for name in ["jellyfin", "seerr"] {
        enroll(&server, &owner, name, 0, enrollment(&provider, name)).await;
    }
    let mut db = fixture.connect().await;
    let jellyfin: Vec<u8> =
        sqlx::query_scalar("SELECT sealed FROM media_connections WHERE provider='jellyfin'")
            .fetch_one(&mut db)
            .await
            .unwrap();
    let seerr: Vec<u8> =
        sqlx::query_scalar("SELECT sealed FROM media_connections WHERE provider='seerr'")
            .fetch_one(&mut db)
            .await
            .unwrap();
    sqlx::query("UPDATE media_connections SET sealed=$1 WHERE provider='jellyfin'")
        .bind(&seerr)
        .execute(&mut db)
        .await
        .unwrap();
    sqlx::query("UPDATE media_connections SET sealed=$1 WHERE provider='seerr'")
        .bind(&jellyfin)
        .execute(&mut db)
        .await
        .unwrap();
    for name in ["jellyfin", "seerr"] {
        assert_eq!(
            observation(&server, &owner, &provider, name, 0).await["error"],
            "unavailable"
        );
    }
    assert!(
        provider.requests().is_empty(),
        "cross-provider ciphertext was interpreted as valid enrollment"
    );
    sqlx::query("UPDATE media_connections SET sealed=$1 WHERE provider='jellyfin'")
        .bind(&jellyfin)
        .execute(&mut db)
        .await
        .unwrap();
    sqlx::query("UPDATE media_connections SET sealed=$1 WHERE provider='seerr'")
        .bind(&seerr)
        .execute(&mut db)
        .await
        .unwrap();
    provider.mode(m::HOLD);
    let _ = read(&server, &owner, "jellyfin", "").await;
    tokio::time::timeout(Duration::from_secs(2), provider.entered())
        .await
        .unwrap();
    assert_eq!(
        server
            .authorized(Method::POST, "/api/auth/revoke-all", &owner)
            .send()
            .await
            .unwrap()
            .status(),
        StatusCode::NO_CONTENT
    );
    provider.mode(m::NORMAL);
    provider.release();
    error(
        read(&server, &owner, "jellyfin", "").await,
        StatusCode::UNAUTHORIZED,
        &[m::TOKEN],
    )
    .await;
    let fresh = server.login("keida_owner", OWNER_PASSWORD).await;
    let old_key: Vec<u8> = sqlx::query_scalar("SELECT key_id FROM auth_state")
        .fetch_one(&mut db)
        .await
        .unwrap();
    db.execute("UPDATE auth_state SET key_id=decode(repeat('a5',32),'hex')")
        .await
        .unwrap();
    error(
        read(&server, &fresh, "jellyfin", "").await,
        StatusCode::SERVICE_UNAVAILABLE,
        &[m::TOKEN],
    )
    .await;
    sqlx::query("UPDATE auth_state SET key_id=$1")
        .bind(old_key)
        .execute(&mut db)
        .await
        .unwrap();
    db.execute("UPDATE users SET role='member' WHERE username='keida_owner'")
        .await
        .unwrap();
    error(
        read(&server, &fresh, "jellyfin", "").await,
        StatusCode::FORBIDDEN,
        &[m::TOKEN],
    )
    .await;
}

#[tokio::test]
async fn media_concurrent_cas_and_unread_removal_reconcile_without_replaying_credentials() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let provider = m::Media::start().await.unwrap();
    let first = put(
        &server,
        &owner,
        "jellyfin",
        0,
        enrollment(&provider, "jellyfin"),
    );
    let second = put(
        &server,
        &owner,
        "jellyfin",
        0,
        enrollment(&provider, "jellyfin"),
    );
    let (a, b) = tokio::join!(first, second);
    let statuses = [a.status(), b.status()];
    assert_eq!(statuses.iter().filter(|s| **s == StatusCode::OK).count(), 1);
    assert_eq!(
        statuses
            .iter()
            .filter(|s| **s == StatusCode::CONFLICT)
            .count(),
        1
    );
    drop((a, b));
    let unread = put(&server, &owner, "jellyfin", 1, Value::Null).await;
    assert_eq!(unread.status(), StatusCode::OK);
    drop(unread);
    let status: Value = request(&server, &owner, Method::GET, "/api/owner/media/jellyfin")
        .send()
        .await
        .unwrap()
        .json()
        .await
        .unwrap();
    assert_eq!(status, json!({"revision":"2","configured":false}));
    error(
        put(&server, &owner, "jellyfin", 1, Value::Null).await,
        StatusCode::CONFLICT,
        &[m::TOKEN],
    )
    .await;
    assert!(
        provider.requests().is_empty(),
        "enrollment reconciliation performed provider IO"
    );
}

#[tokio::test]
async fn media_pending_enrollment_rechecks_session_authority_after_the_lock_wait() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let provider = m::Media::start().await.unwrap();
    enroll(
        &server,
        &owner,
        "jellyfin",
        0,
        enrollment(&provider, "jellyfin"),
    )
    .await;
    let mut db = fixture.connect().await;
    let mut tx = db.begin().await.unwrap();
    let _: bool =
        sqlx::query_scalar("SELECT singleton FROM auth_state WHERE singleton=TRUE FOR UPDATE")
            .fetch_one(&mut *tx)
            .await
            .unwrap();
    let request = request(&server, &owner, Method::PUT, "/api/owner/media/jellyfin")
        .json(&json!({"base_revision":"1","connection":null}))
        .build()
        .unwrap();
    let client = server.client.clone();
    let waiting = tokio::spawn(async move { client.execute(request).await.unwrap() });
    let mut observer = fixture.connect().await;
    let deadline = Instant::now() + Duration::from_millis(2500);
    loop {
        let blocked:bool=sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE datname=current_database() AND wait_event_type='Lock' AND query LIKE 'SELECT key_id, setup_hash,%FOR UPDATE%')").fetch_one(&mut observer).await.unwrap();
        if blocked {
            break;
        }
        assert!(
            Instant::now() < deadline,
            "media save never reached authority lock"
        );
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
    tx.execute("UPDATE users SET generation=generation+1 WHERE username='keida_owner'")
        .await
        .unwrap();
    tx.commit().await.unwrap();
    error(
        waiting.await.unwrap(),
        StatusCode::UNAUTHORIZED,
        &[m::TOKEN],
    )
    .await;
    assert_eq!(
        sqlx::query_scalar::<_, i64>(
            "SELECT revision FROM media_connections WHERE provider='jellyfin'"
        )
        .fetch_one(&mut observer)
        .await
        .unwrap(),
        1,
        "obsolete pending removal committed"
    );
    assert!(
        sqlx::query_scalar::<_, bool>(
            "SELECT sealed IS NOT NULL FROM media_connections WHERE provider='jellyfin'"
        )
        .fetch_one(&mut observer)
        .await
        .unwrap()
    );
}
