//! Literal queue contracts frozen before inspecting the implementation.
use super::*;
use reborn_crafty_fixture::queues as q;
use sqlx::Executor;

const PROVIDERS: [(&str, &str, &str); 3] = [
    ("sonarr", "sonarr-v3", "Queued series"),
    ("radarr", "radarr-v3", "Queued movie"),
    ("qbittorrent", "qbittorrent-v2-key", "Fixture transfer"),
];

fn connection(provider: &q::Queues, profile: &str) -> Value {
    json!({"endpoint":format!("{}/",provider.origin),"token":q::TOKEN,
        "ca_pem":provider.ca,"profile":profile,"acknowledge_broad_access":true})
}

fn request(server: &Server, actor: &Session, method: Method, path: &str) -> RequestBuilder {
    workspace_request(server, actor, method, path)
}

async fn put(
    server: &Server,
    actor: &Session,
    name: &str,
    revision: i64,
    value: Value,
) -> Response {
    request(
        server,
        actor,
        Method::PUT,
        &format!("/api/owner/queues/{name}"),
    )
    .json(&json!({"base_revision":revision.to_string(),"connection":value}))
    .send()
    .await
    .unwrap()
}

async fn enroll(
    server: &Server,
    actor: &Session,
    name: &str,
    profile: &str,
    revision: i64,
    value: Value,
) {
    let response = put(server, actor, name, revision, value.clone()).await;
    assert_eq!(response.status(), StatusCode::OK);
    assert_no_store(&response);
    let text = response.text().await.unwrap();
    assert_private_text(&text, &[q::TOKEN, &actor.cookie, &actor.csrf]);
    assert_eq!(
        serde_json::from_str::<Value>(&text).unwrap(),
        json!({"revision":(revision+1).to_string(),"configured":!value.is_null(),"profile":profile})
    );
}

async fn read(server: &Server, actor: &Session, name: &str, suffix: &str) -> Response {
    request(
        server,
        actor,
        Method::GET,
        &format!("/api/workspace/queues/{name}{suffix}"),
    )
    .send()
    .await
    .unwrap()
}

fn keys(value: &Value, expected: &[&str]) {
    let actual: std::collections::BTreeSet<_> = value
        .as_object()
        .unwrap()
        .keys()
        .map(String::as_str)
        .collect();
    assert_eq!(actual, expected.iter().copied().collect());
}

fn private(value: &Value, provider: &q::Queues, actor: &Session) {
    assert_private_text(
        &value.to_string(),
        &[
            q::TOKEN,
            &provider.origin,
            &provider.ca,
            &actor.cookie,
            &actor.csrf,
            "PRIVATE_QUEUE_",
            "/private/queue-",
            "queue-private.invalid",
            "private-queue-email@example.invalid",
            "198.51.100.88",
            "magnet:",
            "-----BEGIN CERTIFICATE-----",
        ],
    );
}

async fn observation(
    server: &Server,
    actor: &Session,
    provider: &q::Queues,
    name: &str,
    offset: u32,
) -> Value {
    let deadline = Instant::now() + Duration::from_secs(7);
    loop {
        let response = read(server, actor, name, &format!("?offset={offset}")).await;
        assert_eq!(response.status(), StatusCode::OK);
        assert_no_store(&response);
        let value: Value = response.json().await.unwrap();
        keys(
            &value,
            &[
                "product",
                "contract",
                "schema",
                "account",
                "session_generation",
                "provider",
                "observation",
            ],
        );
        assert_eq!(value["product"], PRODUCT);
        assert_eq!(value["contract"], "reborn-workspace-v1");
        assert_eq!(value["schema"], 1);
        assert_eq!(value["account"], actor.account);
        assert!(value["session_generation"].as_str().is_some());
        assert_eq!(value["provider"], name);
        keys(
            &value["observation"],
            &[
                "revision",
                "configured",
                "profile",
                "checked_at",
                "freshness",
                "error",
                "complete",
                "offset",
                "next_offset",
                "total",
                "truncated",
                "items",
            ],
        );
        private(&value, provider, actor);
        for item in value["observation"]["items"].as_array().unwrap() {
            keys(
                item,
                &[
                    "id",
                    "title",
                    "status",
                    "import_state",
                    "warning",
                    "progress_basis_points",
                    "size_bytes",
                    "download_bytes_per_second",
                    "upload_bytes_per_second",
                ],
            );
            let id = item["id"].as_str().unwrap();
            assert_eq!(id.len(), 64);
            assert!(
                id.bytes()
                    .all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b))
            );
            assert!(!id.contains("0000000000000000000000000000000000000001"));
        }
        if value["observation"]["error"] != "checking" {
            return value["observation"].clone();
        }
        assert!(
            Instant::now() < deadline,
            "queue collection never reached its bounded result"
        );
        tokio::time::sleep(Duration::from_millis(20)).await;
    }
}

fn assert_calls(provider: &q::Queues, name: &str, offsets: &[u32]) {
    let calls = provider.requests();
    assert_eq!(
        calls.len(),
        offsets.len() * 2,
        "each page requires exactly one probe and one queue GET"
    );
    for (pair, offset) in calls.as_chunks::<2>().0.iter().zip(offsets) {
        assert_eq!(pair[0].0, "GET");
        assert_eq!(pair[1].0, "GET");
        let probe = if name == "qbittorrent" {
            "/api/v2/app/version"
        } else {
            "/api/v3/system/status"
        };
        assert_eq!(pair[0].1, probe);
        let uri = Url::parse(&format!("https://fixture.invalid{}", pair[1].1)).unwrap();
        let actual: std::collections::BTreeMap<_, _> = uri.query_pairs().into_owned().collect();
        let expected: std::collections::BTreeMap<String, String> = if name == "qbittorrent" {
            assert_eq!(uri.path(), "/api/v2/torrents/info");
            [
                ("filter", "all".to_string()),
                ("sort", "added_on".into()),
                ("reverse", "true".into()),
                ("limit", "13".into()),
                ("offset", offset.to_string()),
            ]
            .into_iter()
            .map(|(k, v)| (k.into(), v))
            .collect()
        } else {
            assert_eq!(uri.path(), "/api/v3/queue");
            let mut fields: std::collections::BTreeMap<String, String> = [
                ("page", (offset / 12 + 1).to_string()),
                ("pageSize", "12".into()),
                ("sortKey", "added".into()),
                ("sortDirection", "descending".into()),
            ]
            .into_iter()
            .map(|(k, v)| (k.into(), v))
            .collect();
            for key in if name == "sonarr" {
                &[
                    "includeUnknownSeriesItems",
                    "includeSeries",
                    "includeEpisode",
                ][..]
            } else {
                &["includeUnknownMovieItems", "includeMovie"][..]
            } {
                fields.insert((*key).into(), "false".into());
            }
            fields
        };
        assert_eq!(actual, expected);
    }
}

#[tokio::test]
async fn queues_owner_boundary_strict_enrollment_cas_and_encryption_do_not_contact_providers() {
    let fixture = Fixture::new().await;
    let (server, owner, secret) = claimed(&fixture).await;
    let member = notification_member(&server, &owner, "queue_member").await;
    let provider = q::Queues::start("sonarr").await.unwrap();
    for (name, profile, _) in PROVIDERS {
        let response = request(
            &server,
            &owner,
            Method::GET,
            &format!("/api/owner/queues/{name}"),
        )
        .send()
        .await
        .unwrap();
        assert_no_store(&response);
        assert_eq!(
            response.json::<Value>().await.unwrap(),
            json!({"revision":"0","configured":false,"profile":profile})
        );
        let absent = observation(&server, &owner, &provider, name, 0).await;
        assert_eq!(absent["configured"], false);
        assert_eq!(absent["complete"], false);
        assert_eq!(absent["freshness"], "unknown");
        assert!(absent["checked_at"].is_null());
        assert!(absent["total"].is_null());
        assert_eq!(absent["items"], json!([]));
        for method in [Method::GET, Method::PUT] {
            let req = request(
                &server,
                &member,
                method,
                &format!("/api/owner/queues/{name}"),
            );
            error(
                req.json(&json!({"untrusted":"invalid"}))
                    .send()
                    .await
                    .unwrap(),
                StatusCode::FORBIDDEN,
                &[q::TOKEN],
            )
            .await;
        }
        error(
            read(&server, &member, name, "?offset=malicious").await,
            StatusCode::FORBIDDEN,
            &[q::TOKEN],
        )
        .await;
    }
    let no_binding = error(
        server
            .client
            .get(server.url("/api/workspace/queues/sonarr"))
            .header("X-Reborn-Product", PRODUCT)
            .header("X-Reborn-Contract", "reborn-workspace-v1")
            .send()
            .await
            .unwrap(),
        StatusCode::FORBIDDEN,
        &[q::TOKEN],
    )
    .await;
    assert_eq!(no_binding["error"], "csrf_rejected");
    let token = "a9".repeat(32);
    let csrf = protocol_mac(
        &fs::read(&fixture.key_file).unwrap(),
        b"reborn/session-csrf/v1\0",
        &token,
    );
    let unknown = error(
        server
            .client
            .get(server.url("/api/workspace/queues/sonarr"))
            .header("X-Reborn-Product", PRODUCT)
            .header("X-Reborn-Contract", "reborn-workspace-v1")
            .header("Cookie", format!("{SESSION_COOKIE}={token}"))
            .header("X-CSRF-Token", csrf)
            .send()
            .await
            .unwrap(),
        StatusCode::UNAUTHORIZED,
        &[q::TOKEN],
    )
    .await;
    assert_eq!(unknown["error"], "invalid_session");
    for body in [
        json!({"base_revision":"0"}),
        json!({"base_revision":"00","connection":null}),
        json!({"base_revision":"+0","connection":null}),
        json!({"base_revision":"9223372036854775808","connection":null}),
        json!({"base_revision":"0","connection":null,"extra":true}),
    ] {
        error(
            request(&server, &owner, Method::PUT, "/api/owner/queues/sonarr")
                .json(&body)
                .send()
                .await
                .unwrap(),
            StatusCode::BAD_REQUEST,
            &[q::TOKEN],
        )
        .await;
    }
    for (field, value) in [
        ("endpoint", json!("http://localhost/")),
        ("endpoint", json!("https://localhost/path")),
        ("endpoint", json!("https://localhost/?query=1")),
        ("token", json!("bad\r\nheader")),
        ("ca_pem", json!("not a certificate")),
        ("profile", json!("radarr-v3")),
        ("acknowledge_broad_access", json!(false)),
        ("extra", json!(true)),
    ] {
        let mut value_connection = connection(&provider, "sonarr-v3");
        value_connection[field] = value;
        error(
            put(&server, &owner, "sonarr", 0, value_connection).await,
            StatusCode::BAD_REQUEST,
            &[q::TOKEN],
        )
        .await;
    }
    for (header, value, status) in [
        (
            "X-Reborn-Contract",
            "unsupported",
            StatusCode::UPGRADE_REQUIRED,
        ),
        (
            "X-Reborn-Product",
            "another-product",
            StatusCode::UPGRADE_REQUIRED,
        ),
        ("Origin", "https://elsewhere.invalid", StatusCode::FORBIDDEN),
        ("X-CSRF-Token", "wrong", StatusCode::FORBIDDEN),
    ] {
        error(
            request(&server, &owner, Method::PUT, "/api/owner/queues/sonarr")
                .header(header, value)
                .json(&json!({"base_revision":"0","connection":connection(&provider,"sonarr-v3")}))
                .send()
                .await
                .unwrap(),
            status,
            &[q::TOKEN],
        )
        .await;
    }
    error(
        read(&server, &owner, "other", "").await,
        StatusCode::BAD_REQUEST,
        &[q::TOKEN],
    )
    .await;
    let a = put(
        &server,
        &owner,
        "sonarr",
        0,
        connection(&provider, "sonarr-v3"),
    );
    let b = put(
        &server,
        &owner,
        "sonarr",
        0,
        connection(&provider, "sonarr-v3"),
    );
    let (a, b) = tokio::join!(a, b);
    let statuses = [a.status(), b.status()];
    assert_eq!(statuses.iter().filter(|s| **s == StatusCode::OK).count(), 1);
    assert_eq!(
        statuses
            .iter()
            .filter(|s| **s == StatusCode::CONFLICT)
            .count(),
        1
    );
    let mut db = fixture.connect().await;
    let sealed: Vec<u8> =
        sqlx::query_scalar("SELECT sealed FROM queue_connections WHERE provider='sonarr'")
            .fetch_one(&mut db)
            .await
            .unwrap();
    assert_eq!(
        sealed[0], 3,
        "queue enrollment must use its distinct envelope version"
    );
    for text in [q::TOKEN, &provider.origin, &provider.ca] {
        assert!(!sealed.windows(text.len()).any(|w| w == text.as_bytes()));
    }
    for path in [
        "/api/workspace/snapshot",
        "/api/workspace/guide",
        "/api/owner/queues/sonarr",
    ] {
        assert_eq!(
            request(&server, &owner, Method::GET, path)
                .send()
                .await
                .unwrap()
                .status(),
            StatusCode::OK
        );
    }
    assert_eq!(
        request(&server, &owner, Method::PUT, "/api/workspace/note")
            .json(&json!({"base_revision":"0","body":"Ordinary queue-independent note"}))
            .send()
            .await
            .unwrap()
            .status(),
        StatusCode::OK
    );
    assert_eq!(sqlx::query_scalar::<_,i64>("SELECT count(*) FROM activity_events WHERE kind IN ('connection_saved','connection_removed')").fetch_one(&mut db).await.unwrap(),0);
    let notifications: i64 = sqlx::query_scalar("SELECT count(*) FROM notification_groups")
        .fetch_one(&mut db)
        .await
        .unwrap();
    assert_eq!(
        notifications, 0,
        "queue enrollment emitted a shared notification"
    );
    let unread = put(&server, &owner, "sonarr", 1, Value::Null).await;
    assert_eq!(unread.status(), StatusCode::OK);
    drop(unread);
    error(
        put(&server, &owner, "sonarr", 1, Value::Null).await,
        StatusCode::CONFLICT,
        &[q::TOKEN],
    )
    .await;
    let status: Value = request(&server, &owner, Method::GET, "/api/owner/queues/sonarr")
        .send()
        .await
        .unwrap()
        .json()
        .await
        .unwrap();
    assert_eq!(
        status,
        json!({"revision":"2","configured":false,"profile":"sonarr-v3"})
    );
    assert!(
        provider.requests().is_empty(),
        "status, enrollment, ordinary workspace and removal contacted provider"
    );
    server.assert_logs_private(&[q::TOKEN, &secret, &owner.cookie, &provider.origin]);
}

#[tokio::test]
async fn queues_real_tls_probes_id_zero_allowlists_and_qbit_wanted_bytes_are_literal() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let mut first_ids = Vec::new();
    for (name, profile, title) in PROVIDERS {
        let provider = q::Queues::start(name).await.unwrap();
        enroll(
            &server,
            &owner,
            name,
            profile,
            0,
            connection(&provider, profile),
        )
        .await;
        let value = observation(&server, &owner, &provider, name, 0).await;
        assert_eq!(value["revision"], "1");
        assert_eq!(value["profile"], profile);
        assert_eq!(value["freshness"], "fresh");
        assert!(value["checked_at"].as_u64().is_some());
        assert!(value["error"].is_null());
        assert_eq!(value["offset"], 0);
        assert!(value["next_offset"].is_null());
        assert_eq!(value["truncated"], false);
        assert_eq!(value["items"].as_array().unwrap().len(), 2);
        let row = &value["items"][0];
        assert_eq!(row["title"], title);
        assert_eq!(row["size_bytes"], 1000);
        assert_eq!(row["progress_basis_points"], 2500);
        assert_eq!(row["warning"], false);
        first_ids.push(row["id"].as_str().unwrap().to_string());
        if name == "qbittorrent" {
            assert_eq!(row["status"], "checkingDL");
            assert!(row["import_state"].is_null());
            assert_eq!(row["download_bytes_per_second"], 128);
            assert_eq!(row["upload_bytes_per_second"], 0);
            assert_eq!(value["complete"], false);
            assert!(value["total"].is_null());
            assert_eq!(value["items"][1]["status"], "metaDL");
            assert_eq!(value["items"][1]["title"], "Metadata pending");
            assert!(value["items"][1]["size_bytes"].is_null());
            assert!(value["items"][1]["progress_basis_points"].is_null());
        } else {
            assert_eq!(row["status"], "downloading");
            assert_eq!(row["import_state"], "downloading");
            assert!(row["download_bytes_per_second"].is_null());
            assert!(row["upload_bytes_per_second"].is_null());
            assert_eq!(value["complete"], true);
            assert_eq!(value["total"], 2);
            assert_eq!(value["items"][1]["status"], "delay");
            assert_eq!(value["items"][1]["import_state"], "importPending");
            assert_eq!(value["items"][1]["size_bytes"], 0);
            assert!(value["items"][1]["progress_basis_points"].is_null());
        }
        let again = observation(&server, &owner, &provider, name, 0).await;
        assert_eq!(again, value);
        assert_calls(&provider, name, &[0]);
        for suffix in [
            "?offset=01",
            "?offset=+0",
            "?offset=-1",
            "?offset=1",
            "?offset=60",
            "?offset=0&offset=12",
            "?offset=0&token=secret",
        ] {
            error(
                read(&server, &owner, name, suffix).await,
                StatusCode::BAD_REQUEST,
                &[q::TOKEN],
            )
            .await;
        }
        assert_calls(&provider, name, &[0]);
        enroll(
            &server,
            &owner,
            name,
            profile,
            1,
            connection(&provider, profile),
        )
        .await;
        assert_ne!(
            observation(&server, &owner, &provider, name, 0).await["items"][0]["id"],
            row["id"],
            "public ID must be revision scoped"
        );
        provider.mode(q::WARNINGS);
        enroll(
            &server,
            &owner,
            name,
            profile,
            2,
            connection(&provider, profile),
        )
        .await;
        let warned = observation(&server, &owner, &provider, name, 0).await;
        assert_eq!(warned["complete"], true);
        assert_eq!(
            warned["items"][0]["status"],
            if name == "qbittorrent" {
                "error"
            } else {
                "warning"
            }
        );
        assert_eq!(
            warned["items"][1]["status"],
            if name == "qbittorrent" {
                "missingFiles"
            } else {
                "failed"
            }
        );
        for item in warned["items"].as_array().unwrap() {
            assert_eq!(item["warning"], true);
        }
    }
    assert_ne!(
        first_ids[0], first_ids[1],
        "same raw Arr ID zero must be provider scoped"
    );
}

#[tokio::test]
async fn queues_pages_exact_totals_lookahead_and_sixty_item_window_are_independent() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    for (name, profile, _) in PROVIDERS {
        let provider = q::Queues::start(name).await.unwrap();
        provider.mode(q::MANY);
        enroll(
            &server,
            &owner,
            name,
            profile,
            0,
            connection(&provider, profile),
        )
        .await;
        let mut ids = std::collections::BTreeSet::new();
        for (offset, count, next) in [(0, 12, Some(12)), (12, 12, Some(24)), (24, 2, None)] {
            let page = observation(&server, &owner, &provider, name, offset).await;
            assert_eq!(page["items"].as_array().unwrap().len(), count);
            assert_eq!(page["offset"], offset);
            assert_eq!(page["next_offset"], json!(next));
            assert_eq!(page["complete"], true);
            assert_eq!(page["truncated"], false);
            assert_eq!(
                page["total"],
                if name == "qbittorrent" {
                    Value::Null
                } else {
                    json!(26)
                }
            );
            for row in page["items"].as_array().unwrap() {
                assert_eq!(row["progress_basis_points"], 2500);
                assert!(ids.insert(row["id"].as_str().unwrap().to_string()));
            }
        }
        assert_eq!(ids.len(), 26);
        assert_calls(&provider, name, &[0, 12, 24]);
        provider.mode(q::TRUNCATED);
        enroll(
            &server,
            &owner,
            name,
            profile,
            1,
            connection(&provider, profile),
        )
        .await;
        for offset in [0, 12, 24, 36, 48] {
            let page = observation(&server, &owner, &provider, name, offset).await;
            assert_eq!(page["items"].as_array().unwrap().len(), 12);
            assert_eq!(page["complete"], true);
            assert_eq!(
                page["total"],
                if name == "qbittorrent" {
                    Value::Null
                } else {
                    json!(70)
                }
            );
            assert_eq!(page["truncated"], name != "qbittorrent" || offset == 48);
            assert_eq!(
                page["next_offset"],
                if offset == 48 {
                    Value::Null
                } else {
                    json!(offset + 12)
                }
            );
        }
        let calls = provider.requests().len();
        for offset in [0, 12, 24, 36, 48] {
            let _ = observation(&server, &owner, &provider, name, offset).await;
        }
        assert_eq!(
            provider.requests().len(),
            calls,
            "five bounded pages should be cached independently"
        );
    }
}

#[tokio::test]
async fn queues_lossless_numeric_lexemes_metadata_and_verification_progress_remain_distinct() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    for (name, profile, _) in PROVIDERS {
        let provider = q::Queues::start(name).await.unwrap();
        provider.mode(q::PRECISION);
        enroll(
            &server,
            &owner,
            name,
            profile,
            0,
            connection(&provider, profile),
        )
        .await;
        let value = observation(&server, &owner, &provider, name, 0).await;
        assert!(value["error"].is_null());
        assert_eq!(value["complete"], false);
        let rows = value["items"].as_array().unwrap();
        assert_eq!(rows.len(), 8);
        assert_eq!(rows[0]["size_bytes"], json!(9007199254740991u64));
        assert_eq!(rows[0]["progress_basis_points"], 10000);
        assert_eq!(rows[1]["size_bytes"], 1000);
        assert_eq!(rows[1]["progress_basis_points"], 2500);
        for index in [2, 3, 4, 6, 7] {
            assert!(
                rows[index]["size_bytes"].is_null(),
                "lossy or invalid size at row {index}"
            );
            assert!(rows[index]["progress_basis_points"].is_null());
        }
        assert_eq!(rows[5]["size_bytes"], 1000);
        assert!(
            rows[5]["progress_basis_points"].is_null(),
            "out-of-range completed/remaining was clamped"
        );
        if name == "qbittorrent" {
            provider.mode(q::CHECKING_PROGRESS);
            assert_eq!(
                rows[0]["download_bytes_per_second"],
                json!(9007199254740991u64)
            );
            assert_eq!(rows[1]["download_bytes_per_second"], 1000);
            assert_eq!(rows[5]["download_bytes_per_second"], 1000);
            for index in [2, 3, 4, 6, 7] {
                assert!(rows[index]["download_bytes_per_second"].is_null());
            }
            enroll(
                &server,
                &owner,
                name,
                profile,
                1,
                connection(&provider, profile),
            )
            .await;
            let value = observation(&server, &owner, &provider, name, 0).await;
            assert_eq!(value["complete"], true);
            assert_eq!(value["items"][0]["status"], "stoppedDL");
            assert_eq!(value["items"][1]["status"], "moving");
            for row in value["items"].as_array().unwrap() {
                assert_eq!(
                    row["progress_basis_points"], 2500,
                    "raw verification progress 0.9 leaked into wanted-content progress"
                );
            }
            provider.mode(q::QBIT52);
            enroll(
                &server,
                &owner,
                name,
                profile,
                2,
                connection(&provider, profile),
            )
            .await;
            assert!(observation(&server, &owner, &provider, name, 0).await["error"].is_null());
            provider.mode(q::ZERO_METADATA);
            enroll(
                &server,
                &owner,
                name,
                profile,
                3,
                connection(&provider, profile),
            )
            .await;
            let zero = observation(&server, &owner, &provider, name, 0).await;
            assert_eq!(
                zero["complete"], true,
                "known zero-size metadata is not missing metadata"
            );
            for row in zero["items"].as_array().unwrap() {
                assert_eq!(row["size_bytes"], 0);
                assert!(row["progress_basis_points"].is_null());
            }
        }
    }
}

#[tokio::test]
async fn queues_empty_partial_page_moved_and_transport_failures_never_become_zero_success() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    for (name, profile, _) in PROVIDERS {
        let provider = q::Queues::start(name).await.unwrap();
        let mut revision = 0;
        for (mode, expected) in [
            (q::EMPTY, None),
            (q::MISSING, None),
            (q::DENIED, Some("denied")),
            (q::MALFORMED, Some("malformed")),
            (q::DUPLICATE, Some("malformed")),
            (q::DUPLICATE_ID, Some("malformed")),
            (q::HTML, Some("malformed")),
            (q::LARGE, Some("oversized")),
            (q::CHUNKED, Some("oversized")),
            (q::REDIRECT, Some("provider_error")),
            (q::TIMEOUT, Some("timeout")),
            (q::RATE_LIMITED, Some("rate_limited")),
            (q::SERVER_ERROR, Some("provider_error")),
            (q::NOT_FOUND, Some("unsupported_profile")),
            (q::METHOD_NOT_ALLOWED, Some("unsupported_profile")),
            (q::UNSUPPORTED, Some("unsupported_profile")),
            // Arr expects typed JSON, so HTML is malformed JSON. qBit's
            // version endpoint is plaintext: HTML fails its closed profile gate.
            (
                q::VERSION_MALFORMED,
                Some(if name == "qbittorrent" {
                    "unsupported_profile"
                } else {
                    "malformed"
                }),
            ),
            (q::OVERSIZED_ROWS, Some("malformed")),
        ] {
            provider.mode(mode);
            let before = provider.requests().len();
            enroll(
                &server,
                &owner,
                name,
                profile,
                revision,
                connection(&provider, profile),
            )
            .await;
            revision += 1;
            let value = observation(&server, &owner, &provider, name, 0).await;
            if let Some(expected) = expected {
                assert_eq!(value["error"], expected, "provider={name}, mode={mode}");
                assert_eq!(value["complete"], false);
                assert!(value["total"].is_null());
                assert!(value["next_offset"].is_null());
                assert_eq!(value["items"], json!([]));
                assert_ne!(value["freshness"], "fresh", "error marked as fresh success");
            } else if mode == q::EMPTY {
                assert_eq!(value["complete"], true);
                assert!(value["error"].is_null());
                assert_eq!(value["items"], json!([]));
                assert_eq!(
                    value["total"],
                    if name == "qbittorrent" {
                        Value::Null
                    } else {
                        json!(0)
                    }
                );
            } else {
                assert_eq!(value["complete"], false);
                assert!(value["error"].is_null());
                assert_eq!(value["items"].as_array().unwrap().len(), 2);
                assert!(value["items"][0]["title"].is_null());
                assert!(value["items"][0]["size_bytes"].is_null());
                assert!(value["items"][0]["progress_basis_points"].is_null());
                assert_eq!(value["items"][0]["status"], "unknown");
                assert!(value["items"][0]["warning"].is_null());
            }
            let delta = provider.requests().len() - before;
            if mode == q::UNSUPPORTED || mode == q::VERSION_MALFORMED {
                assert_eq!(delta, 1, "unrecognized version must stop before queue GET");
            }
            if mode == q::RATE_LIMITED {
                assert_eq!(delta, 2, "429 caused a hidden retry");
            }
        }
        if name != "qbittorrent" {
            for (mode, expected) in [
                (q::PAGE_MOVED, "page_moved"),
                (q::BAD_PAGE, "malformed"),
                (q::NULL_RECORDS, "malformed"),
                (q::SHORT_PAGE, "malformed"),
                (q::DUPLICATE_VERSION, "malformed"),
            ] {
                provider.mode(mode);
                enroll(
                    &server,
                    &owner,
                    name,
                    profile,
                    revision,
                    connection(&provider, profile),
                )
                .await;
                revision += 1;
                let value = observation(&server, &owner, &provider, name, 0).await;
                assert_eq!(value["error"], expected);
                assert_eq!(value["items"], json!([]));
                assert!(value["total"].is_null());
                assert!(value["next_offset"].is_null());
            }
        } else {
            provider.mode(q::VERSION_LARGE);
            enroll(
                &server,
                &owner,
                name,
                profile,
                revision,
                connection(&provider, profile),
            )
            .await;
            revision += 1;
            assert_eq!(
                observation(&server, &owner, &provider, name, 0).await["error"],
                "oversized"
            );
        }
        provider.mode(q::NORMAL);
        let mut no_ca = connection(&provider, profile);
        no_ca["ca_pem"] = json!("");
        enroll(&server, &owner, name, profile, revision, no_ca).await;
        assert_eq!(
            observation(&server, &owner, &provider, name, 0).await["error"],
            "transport"
        );
        assert!(
            provider
                .requests()
                .iter()
                .all(|(method, _)| method == "GET")
        );
    }
}

#[tokio::test]
async fn queues_independent_flights_and_post_io_revision_session_key_generation_guards_discard_obsolete_results()
 {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let held = q::Queues::start("sonarr").await.unwrap();
    held.mode(q::HOLD);
    let healthy = q::Queues::start("radarr").await.unwrap();
    healthy.mode(q::MANY);
    enroll(
        &server,
        &owner,
        "sonarr",
        "sonarr-v3",
        0,
        connection(&held, "sonarr-v3"),
    )
    .await;
    enroll(
        &server,
        &owner,
        "radarr",
        "radarr-v3",
        0,
        connection(&healthy, "radarr-v3"),
    )
    .await;
    let started = Instant::now();
    let checking: Value = read(&server, &owner, "sonarr", "")
        .await
        .json()
        .await
        .unwrap();
    assert_eq!(checking["observation"]["error"], "checking");
    assert!(started.elapsed() < Duration::from_secs(1));
    tokio::time::timeout(Duration::from_secs(2), held.wait_entered())
        .await
        .unwrap();
    assert_eq!(
        observation(&server, &owner, &healthy, "radarr", 0).await["items"]
            .as_array()
            .unwrap()
            .len(),
        12
    );
    for _ in 0..8 {
        let _ = read(&server, &owner, "sonarr", "").await;
    }
    assert_eq!(
        held.requests().len(),
        2,
        "same-provider checking reads duplicated a flight"
    );
    let mut db = fixture.connect().await;
    assert!(!sqlx::query_scalar::<_,bool>("SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE datname=current_database() AND state LIKE 'idle in transaction%')").fetch_one(&mut db).await.unwrap(),"provider IO held an authority transaction");
    enroll(&server, &owner, "sonarr", "sonarr-v3", 1, Value::Null).await;
    held.mode(q::NORMAL);
    held.release();
    let removed = observation(&server, &owner, &held, "sonarr", 0).await;
    assert_eq!(removed["revision"], "2");
    assert_eq!(removed["configured"], false);
    assert_eq!(removed["items"], json!([]));
    // Re-use a real held queue response to cross the session-generation boundary.
    held.mode(q::HOLD);
    enroll(
        &server,
        &owner,
        "sonarr",
        "sonarr-v3",
        2,
        connection(&held, "sonarr-v3"),
    )
    .await;
    let _ = read(&server, &owner, "sonarr", "").await;
    tokio::time::timeout(Duration::from_secs(2), held.wait_entered())
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
    held.mode(q::NORMAL);
    held.release();
    error(
        read(&server, &owner, "sonarr", "").await,
        StatusCode::UNAUTHORIZED,
        &[q::TOKEN],
    )
    .await;
    let fresh = server.login("keida_owner", OWNER_PASSWORD).await;
    let current = observation(&server, &fresh, &held, "sonarr", 0).await;
    assert_eq!(current["revision"], "3");
    let old_key: Vec<u8> = sqlx::query_scalar("SELECT key_id FROM auth_state")
        .fetch_one(&mut db)
        .await
        .unwrap();
    db.execute("UPDATE auth_state SET key_id=decode(repeat('a5',32),'hex')")
        .await
        .unwrap();
    error(
        read(&server, &fresh, "sonarr", "").await,
        StatusCode::SERVICE_UNAVAILABLE,
        &[q::TOKEN],
    )
    .await;
    sqlx::query("UPDATE auth_state SET key_id=$1")
        .bind(old_key)
        .execute(&mut db)
        .await
        .unwrap();
    db.execute("UPDATE users SET active=FALSE WHERE username='keida_owner'")
        .await
        .unwrap();
    error(
        read(&server, &fresh, "sonarr", "").await,
        StatusCode::UNAUTHORIZED,
        &[q::TOKEN],
    )
    .await;
}

#[tokio::test]
async fn queues_ciphertexts_reject_cross_provider_media_and_revision_replay_before_io() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let provider = q::Queues::start("sonarr").await.unwrap();
    for (name, profile, _) in PROVIDERS {
        enroll(
            &server,
            &owner,
            name,
            profile,
            0,
            connection(&provider, profile),
        )
        .await;
    }
    let mut db = fixture.connect().await;
    let sonarr: Vec<u8> =
        sqlx::query_scalar("SELECT sealed FROM queue_connections WHERE provider='sonarr'")
            .fetch_one(&mut db)
            .await
            .unwrap();
    let radarr: Vec<u8> =
        sqlx::query_scalar("SELECT sealed FROM queue_connections WHERE provider='radarr'")
            .fetch_one(&mut db)
            .await
            .unwrap();
    sqlx::query("UPDATE queue_connections SET sealed=$1 WHERE provider='sonarr'")
        .bind(&radarr)
        .execute(&mut db)
        .await
        .unwrap();
    sqlx::query("UPDATE queue_connections SET sealed=$1 WHERE provider='radarr'")
        .bind(&sonarr)
        .execute(&mut db)
        .await
        .unwrap();
    for name in ["sonarr", "radarr"] {
        assert_eq!(
            observation(&server, &owner, &provider, name, 0).await["error"],
            "unavailable"
        );
    }
    sqlx::query("UPDATE queue_connections SET revision=2,sealed=$1 WHERE provider='sonarr'")
        .bind(&sonarr)
        .execute(&mut db)
        .await
        .unwrap();
    assert_eq!(
        observation(&server, &owner, &provider, "sonarr", 0).await["error"],
        "unavailable"
    );
    sqlx::query("UPDATE media_connections SET revision=1,sealed=$1 WHERE provider='jellyfin'")
        .bind(&sonarr)
        .execute(&mut db)
        .await
        .unwrap();
    let media: Value = request(
        &server,
        &owner,
        Method::GET,
        "/api/workspace/media/jellyfin",
    )
    .send()
    .await
    .unwrap()
    .json()
    .await
    .unwrap();
    assert_eq!(media["observation"]["error"], "unavailable");
    assert!(
        provider.requests().is_empty(),
        "wrong-domain ciphertext escaped to provider IO"
    );
}

#[tokio::test]
async fn queues_expired_page_keeps_original_age_while_refresh_is_checking() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let provider = q::Queues::start("radarr").await.unwrap();
    enroll(
        &server,
        &owner,
        "radarr",
        "radarr-v3",
        0,
        connection(&provider, "radarr-v3"),
    )
    .await;
    let old = observation(&server, &owner, &provider, "radarr", 0).await;
    provider.mode(q::HOLD);
    tokio::time::sleep(Duration::from_secs(61)).await;
    let checking: Value = read(&server, &owner, "radarr", "")
        .await
        .json()
        .await
        .unwrap();
    let checking = &checking["observation"];
    assert_eq!(checking["error"], "checking");
    assert_eq!(checking["complete"], false);
    assert_eq!(
        checking["checked_at"], old["checked_at"],
        "demand refresh falsely freshened old data"
    );
    tokio::time::timeout(Duration::from_secs(2), provider.wait_entered())
        .await
        .unwrap();
    assert_eq!(provider.requests().len(), 4);
    provider.release();
}

#[tokio::test]
async fn queue_fixture_oversize_stream_is_actual_chunked_without_declared_length() {
    let provider = q::Queues::start("sonarr").await.unwrap();
    provider.mode(q::CHUNKED);
    let client = Client::builder()
        .no_proxy()
        .redirect(reqwest::redirect::Policy::none())
        .add_root_certificate(reqwest::Certificate::from_pem(provider.ca.as_bytes()).unwrap())
        .build()
        .unwrap();
    let response=client.get(format!("{}/api/v3/queue?page=1&pageSize=12&sortKey=added&sortDirection=descending&includeUnknownSeriesItems=false&includeSeries=false&includeEpisode=false",provider.origin))
        .header("X-Api-Key",q::TOKEN).header("Accept","application/json").send().await.unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert!(response.headers().get("content-length").is_none());
    assert_eq!(
        response.headers().get("transfer-encoding").unwrap(),
        "chunked"
    );
    assert_eq!(response.bytes().await.unwrap().len(), 262145);
}

#[tokio::test]
async fn queue_enrollment_waiting_on_authority_lock_rechecks_session_generation_before_commit() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let provider = q::Queues::start("sonarr").await.unwrap();
    enroll(
        &server,
        &owner,
        "sonarr",
        "sonarr-v3",
        0,
        connection(&provider, "sonarr-v3"),
    )
    .await;
    let mut connection = fixture.connect().await;
    let mut transaction = connection.begin().await.unwrap();
    let _: bool =
        sqlx::query_scalar("SELECT singleton FROM auth_state WHERE singleton=TRUE FOR UPDATE")
            .fetch_one(&mut *transaction)
            .await
            .unwrap();
    let mutation = request(&server, &owner, Method::PUT, "/api/owner/queues/sonarr")
        .json(&json!({"base_revision":"1","connection":null}))
        .build()
        .unwrap();
    let client = server.client.clone();
    let waiting = tokio::spawn(async move { client.execute(mutation).await.unwrap() });
    let mut monitor = fixture.connect().await;
    let deadline = Instant::now() + Duration::from_millis(2500);
    loop {
        let blocked:bool=sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE datname=current_database() AND wait_event_type='Lock' AND query LIKE '%FOR UPDATE%')").fetch_one(&mut monitor).await.unwrap();
        if blocked {
            break;
        }
        assert!(
            Instant::now() < deadline,
            "queue mutation did not reach authority lock"
        );
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
    transaction
        .execute("UPDATE users SET generation=generation+1 WHERE username='keida_owner'")
        .await
        .unwrap();
    transaction.commit().await.unwrap();
    error(
        waiting.await.unwrap(),
        StatusCode::UNAUTHORIZED,
        &[q::TOKEN],
    )
    .await;
    let retained: (i64, bool) = sqlx::query_as(
        "SELECT revision,sealed IS NOT NULL FROM queue_connections WHERE provider='sonarr'",
    )
    .fetch_one(&mut monitor)
    .await
    .unwrap();
    assert_eq!(
        retained,
        (1, true),
        "obsolete owner committed a queue removal after the authority lock wait"
    );
    assert!(provider.requests().is_empty());
}

#[tokio::test]
async fn queues_capability_guide_preserves_old_catalogs_and_private_note() {
    let fixture = Fixture::new().await;
    let (server, owner, _) = claimed(&fixture).await;
    let note = "Owner-authored private note stays separate from the roadmap";
    assert_eq!(
        request(&server, &owner, Method::PUT, "/api/workspace/note")
            .json(&json!({"base_revision":"0","body":note}))
            .send()
            .await
            .unwrap()
            .status(),
        StatusCode::OK
    );
    let snapshot = workspace_json(&server, &owner, "/api/workspace/snapshot").await;
    for (capability, count) in [(None, 1), (Some("media-v1"), 3), (Some("queues-v1"), 6)] {
        let mut builder = request(&server, &owner, Method::GET, "/api/workspace/guide");
        if let Some(capability) = capability {
            builder = builder.header("X-Reborn-Guide", capability);
        }
        let response = builder.send().await.unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        assert_no_store(&response);
        let guide: Value = response.json().await.unwrap();
        assert_eq!(guide["account"], owner.account);
        let catalog = guide["catalog"].as_array().unwrap();
        assert_eq!(catalog.len(), 7);
        assert_eq!(
            catalog
                .iter()
                .filter(|entry| entry["status"] == "available")
                .count(),
            count
        );
        for id in ["sonarr", "radarr", "qbittorrent"] {
            assert_eq!(
                catalog.iter().find(|entry| entry["id"] == id).unwrap()["status"],
                if capability == Some("queues-v1") {
                    "available"
                } else {
                    "planned"
                }
            );
        }
        assert!(!guide.to_string().contains(note));
    }
    for builder in [
        request(&server, &owner, Method::GET, "/api/workspace/guide")
            .header("X-Reborn-Guide", "unknown"),
        request(&server, &owner, Method::GET, "/api/workspace/guide")
            .header("X-Reborn-Guide", "queues-v1")
            .header("X-Reborn-Guide", "queues-v1"),
    ] {
        error(
            builder.send().await.unwrap(),
            StatusCode::UPGRADE_REQUIRED,
            &[note],
        )
        .await;
    }
    assert_eq!(
        workspace_json(&server, &owner, "/api/workspace/snapshot").await,
        snapshot
    );
}
