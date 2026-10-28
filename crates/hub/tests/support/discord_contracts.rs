//! Independent HTTP expectations for issue25's fixed identify/link contract.
//! All OAuth IO goes to an owned synthetic TLS service, never real Discord.
use super::*;
use reborn_crafty_fixture::discord as d;

const PUBLIC_ORIGIN: &str = "https://reborn.test";
const FLOW: &str = "__Host-keida-reborn-discord-flow";
const RETURN: &str = "__Host-keida-reborn-discord-return";
const STATUS: &str = "/api/workspace/discord";
const APPLICATION: &str = "/api/owner/discord/application";

async fn start_server(fixture: &Fixture, provider: &d::Discord) -> Server {
    let listener = TcpListener::bind(("127.0.0.1", 0)).unwrap();
    let port = listener.local_addr().unwrap().port();
    drop(listener);
    let stdout = fixture
        .directory
        .join(format!("discord-stdout-{}", unique()));
    let stderr = fixture
        .directory
        .join(format!("discord-stderr-{}", unique()));
    let mut invocation = fixture.command(&["serve"], Some(&fixture.key_file));
    invocation
        .env("REBORN_PUBLIC_ORIGIN", PUBLIC_ORIGIN)
        .env("REBORN_BIND", format!("127.0.0.1:{port}"))
        .env(
            "REBORN_DISCORD_FIXTURE_SOCKET",
            provider.address.to_string(),
        )
        .env("REBORN_DISCORD_FIXTURE_CA_FILE", &provider.ca_path)
        .stdout(Stdio::from(File::create_new(&stdout).unwrap()))
        .stderr(Stdio::from(File::create_new(&stderr).unwrap()));
    let mut server = Server {
        child: invocation.spawn().unwrap(),
        origin: format!("http://127.0.0.1:{port}"),
        client: Client::builder()
            .timeout(Duration::from_secs(5))
            .no_proxy()
            .redirect(reqwest::redirect::Policy::none())
            .build()
            .unwrap(),
        stdout,
        stderr,
    };
    let deadline = Instant::now() + Duration::from_secs(5);
    loop {
        if let Ok(response) = server.client.get(server.url("/api/health")).send().await {
            assert_eq!(response.status(), StatusCode::OK);
            return server;
        }
        assert!(
            server.child.try_wait().unwrap().is_none(),
            "Discord HTTP fixture exited before listening"
        );
        assert!(
            Instant::now() < deadline,
            "Discord HTTP fixture listener deadline"
        );
        tokio::time::sleep(Duration::from_millis(20)).await;
    }
}

fn request(server: &Server, actor: &Session, method: Method, path: &str) -> RequestBuilder {
    server
        .client
        .request(method, server.url(path))
        .header("Cookie", &actor.cookie)
        .header("X-Reborn-Product", PRODUCT)
        .header("X-Reborn-Contract", "reborn-workspace-v1")
        .header("X-CSRF-Token", &actor.csrf)
        .header("Origin", PUBLIC_ORIGIN)
}

fn auth_request(server: &Server, actor: &Session, path: &str) -> RequestBuilder {
    server
        .client
        .post(server.url(path))
        .header("Cookie", &actor.cookie)
        .header("X-Reborn-Product", PRODUCT)
        .header("X-Reborn-Contract", CONTRACT)
        .header("X-CSRF-Token", &actor.csrf)
        .header("Origin", PUBLIC_ORIGIN)
}

async fn claimed_discord(fixture: &Fixture, provider: &d::Discord) -> (Server, Session, String) {
    fixture.init_key().await;
    let setup = fixture.prepare().await;
    let server = start_server(fixture, provider).await;
    let form = server.form(true).await;
    let response = server
        .client
        .post(server.url("/api/auth/claim"))
        .header("Cookie", &form.cookie)
        .header("Origin", PUBLIC_ORIGIN)
        .header("X-Reborn-Product", PRODUCT)
        .header("X-Reborn-Contract", CONTRACT)
        .header("X-CSRF-Token", &form.csrf)
        .json(&json!({"setup_secret":setup,"username":"keida_owner","password":OWNER_PASSWORD}))
        .send()
        .await
        .unwrap();
    let owner = Session::from_response(response, StatusCode::CREATED).await;
    (server, owner, setup)
}

async fn member(server: &Server, owner: &Session) -> Session {
    let response = auth_request(server, owner, "/api/owner/members")
        .json(&json!({"username":"discord_member","password":MEMBER_PASSWORD}))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::CREATED);
    login(server, "discord_member", MEMBER_PASSWORD).await
}

async fn login(server: &Server, username: &str, password: &str) -> Session {
    let form = server.form(false).await;
    let response = server
        .client
        .post(server.url("/api/auth/login"))
        .header("Cookie", &form.cookie)
        .header("Origin", PUBLIC_ORIGIN)
        .header("X-Reborn-Product", PRODUCT)
        .header("X-Reborn-Contract", CONTRACT)
        .header("X-CSRF-Token", &form.csrf)
        .json(&json!({"username":username,"password":password}))
        .send()
        .await
        .unwrap();
    Session::from_response(response, StatusCode::OK).await
}

fn no_auth_cookies(response: &Response) {
    for value in response.headers().get_all("set-cookie") {
        let value = value.to_str().unwrap();
        assert!(!value.starts_with(&format!("{SESSION_COOKIE}=")));
        assert!(!value.starts_with(&format!("{FORM_COOKIE}=")));
    }
}

fn native_private(response: &Response) {
    assert_no_store(response);
    no_auth_cookies(response);
    assert_eq!(
        response.headers().get("referrer-policy").unwrap(),
        "no-referrer"
    );
    let policy = response
        .headers()
        .get("content-security-policy")
        .unwrap()
        .to_str()
        .unwrap();
    assert!(policy.contains("frame-ancestors 'none'"));
    assert!(policy.contains("default-src 'none'"));
    assert!(
        !policy.contains("https://discord.com"),
        "native CSP unnecessarily widened"
    );
}

fn private_json(value: &Value, actor: &Session) {
    assert_private_text(
        &value.to_string(),
        &[
            d::CLIENT_ID,
            d::CLIENT_SECRET,
            "fictional-discord-access-token",
            "PRIVATE_DISCORD_EMAIL",
            "PRIVATE_DISCORD_AVATAR",
            "PRIVATE_DISCORD_LOCALE",
            &actor.cookie,
            &actor.csrf,
        ],
    );
}

async fn status(server: &Server, actor: &Session, capabilities: &[&str]) -> Value {
    let mut cookies = vec![actor.cookie.as_str()];
    cookies.extend_from_slice(capabilities);
    let response = server
        .client
        .get(server.url(STATUS))
        .header("Cookie", cookies.join("; "))
        .header("X-Reborn-Product", PRODUCT)
        .header("X-Reborn-Contract", "reborn-workspace-v1")
        .header("X-CSRF-Token", &actor.csrf)
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_no_store(&response);
    let value: Value = response.json().await.unwrap();
    assert_eq!(value["product"], PRODUCT);
    assert_eq!(value["contract"], "reborn-workspace-v1");
    assert_eq!(value["schema"], 1);
    assert_eq!(value["account"], actor.account);
    assert_eq!(value["application"]["profile"], "discord-identify-v1");
    assert_eq!(
        value["application"]["callback_uri"],
        format!("{PUBLIC_ORIGIN}/account/discord/callback")
    );
    private_json(&value, actor);
    value
}

fn bases(value: &Value, application: bool) -> Value {
    let mut bases = json!({
        "base_revision":value["link"]["revision"],
        "base_flow_generation":value["link"]["flow_generation"],
    });
    if application {
        bases["base_application_revision"] = value["application"]["revision"].clone();
    }
    bases
}

async fn enroll(server: &Server, actor: &Session, revision: &str, application: Value) -> Value {
    let response = request(server, actor, Method::PUT, APPLICATION)
        .json(&json!({"base_revision":revision,"application":application}))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_no_store(&response);
    let value: Value = response.json().await.unwrap();
    private_json(&value, actor);
    value
}

fn application() -> Value {
    json!({"client_id":d::CLIENT_ID,"client_secret":d::CLIENT_SECRET,"callback_logging_reviewed":true})
}

struct Flow {
    flow: String,
    returned: String,
    callback: String,
    snapshot: Value,
}

async fn begin(server: &Server, actor: &Session) -> (String, String) {
    let current = status(server, actor, &[]).await;
    let fields = [
        ("product", PRODUCT),
        ("contract", "reborn-discord-link-v1"),
        ("csrf_token", actor.csrf.as_str()),
        (
            "base_revision",
            current["link"]["revision"].as_str().unwrap(),
        ),
        (
            "base_flow_generation",
            current["link"]["flow_generation"].as_str().unwrap(),
        ),
        (
            "base_application_revision",
            current["application"]["revision"].as_str().unwrap(),
        ),
    ];
    let encoded = url::form_urlencoded::Serializer::new(String::new())
        .extend_pairs(fields)
        .finish();
    let response = server
        .client
        .post(server.url("/account/discord/start"))
        .header("Cookie", &actor.cookie)
        .header("Origin", PUBLIC_ORIGIN)
        .header("Content-Type", "application/x-www-form-urlencoded")
        .body(encoded)
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::SEE_OTHER);
    native_private(&response);
    assert_eq!(
        response.headers().get("location").unwrap(),
        "/account/discord/authorize"
    );
    let flow = cookie(&response, FLOW, true);
    let _ = cookie(&response, RETURN, false);
    assert!(
        response.headers().get_all("set-cookie").iter().any(|v| v
            .to_str()
            .unwrap()
            .starts_with(&flow)
            && v.to_str().unwrap().contains("Max-Age=600"))
    );
    let response = server
        .client
        .get(server.url("/account/discord/authorize"))
        .header("Cookie", format!("{}; {flow}", actor.cookie))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    native_private(&response);
    let html = response.text().await.unwrap();
    assert!(!html.contains(d::ID));
    assert!(!html.contains(d::DISPLAY));
    assert!(html.contains("discord-authorize"));
    let start = html
        .find("https://discord.com/oauth2/authorize?")
        .expect("fixed Discord authorization anchor");
    let end = html[start..].find('"').unwrap() + start;
    let authorize = html[start..end]
        .replace("&amp;", "&")
        .replace("&#x3d;", "=")
        .replace("&#x2f;", "/");
    let parsed = Url::parse(&authorize).unwrap();
    let parameters: std::collections::BTreeMap<_, _> = parsed.query_pairs().collect();
    assert_eq!(parameters.len(), 8);
    assert_eq!(
        parameters.get("scope").map(|v| v.as_ref()),
        Some("identify")
    );
    assert_eq!(
        parameters.get("prompt").map(|v| v.as_ref()),
        Some("consent")
    );
    assert_eq!(
        parameters.get("code_challenge_method").map(|v| v.as_ref()),
        Some("S256")
    );
    assert!(!parameters.contains_key("client_secret"));
    (flow, authorize)
}

fn callback_path(callback: &str) -> String {
    let url = Url::parse(callback).unwrap();
    assert_eq!(url.origin().ascii_serialization(), PUBLIC_ORIGIN);
    format!("{}?{}", url.path(), url.query().unwrap())
}

async fn capture_callback(server: &Server, callback: &str) -> String {
    // Deliberately cookie-less: a real cross-site navigation lacks Strict auth.
    let response = server
        .client
        .get(server.url(&callback_path(callback)))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::SEE_OTHER);
    native_private(&response);
    assert_eq!(
        response.headers().get("location").unwrap(),
        "/account/discord/return"
    );
    let returned = cookie(&response, RETURN, true);
    let body = response.text().await.unwrap();
    assert!(!body.contains(d::ID) && !body.contains(d::DISPLAY));
    assert!(!body.contains("fictional-discord-code-"));
    let response = server
        .client
        .get(server.url("/account/discord/return"))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    native_private(&response);
    let body = response.text().await.unwrap();
    assert!(body.contains("/workspace#identity"));
    assert!(!body.contains(d::ID) && !body.contains(d::DISPLAY));
    assert!(!body.contains("fictional-discord-code-"));
    returned
}

async fn flow(server: &Server, actor: &Session, provider: &d::Discord) -> Flow {
    let (flow, authorize) = begin(server, actor).await;
    let callback = provider.authorization_callback(&authorize).unwrap();
    let returned = capture_callback(server, &callback).await;
    let snapshot = status(server, actor, &[&flow, &returned]).await;
    Flow {
        flow,
        returned,
        callback,
        snapshot,
    }
}

fn mutation(
    server: &Server,
    actor: &Session,
    action: &str,
    current: &Value,
    capabilities: &[&str],
) -> RequestBuilder {
    let mut cookies = vec![actor.cookie.as_str()];
    cookies.extend_from_slice(capabilities);
    server
        .client
        .post(server.url(&format!("/api/workspace/discord/{action}")))
        .header("Cookie", cookies.join("; "))
        .header("Origin", PUBLIC_ORIGIN)
        .header("X-Reborn-Product", PRODUCT)
        .header("X-Reborn-Contract", "reborn-workspace-v1")
        .header("X-CSRF-Token", &actor.csrf)
        .json(&bases(current, matches!(action, "review" | "confirm")))
}

async fn reviewed(server: &Server, actor: &Session, flow: &Flow) -> Value {
    let response = mutation(
        server,
        actor,
        "review",
        &flow.snapshot,
        &[&flow.flow, &flow.returned],
    )
    .send()
    .await
    .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_no_store(&response);
    let value: Value = response.json().await.unwrap();
    private_json(&value, actor);
    assert_eq!(value["attempt"]["phase"], "review_ready");
    assert_eq!(
        value["attempt"]["candidate"],
        json!({"id":d::ID,"display_name":d::DISPLAY})
    );
    assert!(
        value["link"]["identity"].is_null(),
        "review implicitly linked an account"
    );
    value
}

#[tokio::test]
async fn discord_link_requires_cookie_bridge_review_and_separate_confirmation_then_unlinks_locally()
{
    let fixture = Fixture::new().await;
    let provider = d::Discord::start().await.unwrap();
    let (server, owner, setup) = claimed_discord(&fixture, &provider).await;
    let initial = status(&server, &owner, &[]).await;
    assert_eq!(initial["application"]["configured"], false);
    assert!(initial["link"]["identity"].is_null());
    enroll(&server, &owner, "0", application()).await;
    let flow = flow(&server, &owner, &provider).await;
    assert_eq!(flow.snapshot["attempt"]["phase"], "ready_to_review");
    assert!(
        provider.requests().is_empty(),
        "cookie-less callback performed OAuth IO"
    );
    for capabilities in [
        vec![],
        vec![flow.flow.as_str()],
        vec![flow.returned.as_str()],
    ] {
        error(
            mutation(&server, &owner, "review", &flow.snapshot, &capabilities)
                .send()
                .await
                .unwrap(),
            StatusCode::FORBIDDEN,
            &[d::CLIENT_SECRET],
        )
        .await;
    }
    assert!(
        provider.requests().is_empty(),
        "missing bridge capability reached Discord"
    );
    let candidate = reviewed(&server, &owner, &flow).await;
    assert_eq!(candidate["attempt"]["cleanup"], "acknowledged");
    assert_eq!(
        provider.requests(),
        vec![
            ("POST".to_owned(), "/api/oauth2/token".to_owned()),
            ("GET".to_owned(), "/api/v10/users/@me".to_owned()),
            ("POST".to_owned(), "/api/oauth2/token/revoke".to_owned())
        ]
    );
    let response = mutation(
        &server,
        &owner,
        "confirm",
        &candidate,
        &[&flow.flow, &flow.returned],
    )
    .send()
    .await
    .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    let linked: Value = response.json().await.unwrap();
    assert_eq!(linked["link"]["identity"]["id"], d::ID);
    assert_eq!(linked["link"]["identity"]["display_name"], d::DISPLAY);
    assert!(
        linked["link"]["identity"]["verified_at"]
            .as_str()
            .unwrap()
            .parse::<u64>()
            .unwrap()
            > 0
    );
    assert_eq!(linked["account"], owner.account);
    let calls = provider.requests();
    error(
        mutation(
            &server,
            &owner,
            "confirm",
            &candidate,
            &[&flow.flow, &flow.returned],
        )
        .send()
        .await
        .unwrap(),
        StatusCode::CONFLICT,
        &[d::CLIENT_SECRET],
    )
    .await;
    let removed = enroll(
        &server,
        &owner,
        linked["application"]["revision"].as_str().unwrap(),
        Value::Null,
    )
    .await;
    assert_eq!(
        removed["link"], linked["link"],
        "removing enrollment erased an accepted identity"
    );
    let response = mutation(&server, &owner, "unlink", &removed, &[])
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    let unlinked: Value = response.json().await.unwrap();
    assert!(unlinked["link"]["identity"].is_null());
    assert_ne!(unlinked["link"]["revision"], linked["link"]["revision"]);
    assert_eq!(
        provider.requests(),
        calls,
        "local unlink performed provider IO"
    );
    let _ = server.session_status(&owner, StatusCode::OK).await;
    server.assert_logs_private(&[
        &setup,
        d::CLIENT_SECRET,
        "fictional-discord-access-token",
        &owner.cookie,
        &owner.csrf,
    ]);
    assert_eq!(provider.invalid_requests(), 0);
}

#[tokio::test]
async fn discord_callback_parser_rejects_duplicates_wrong_issuer_and_bounds_without_auth_cookie_damage()
 {
    let fixture = Fixture::new().await;
    let provider = d::Discord::start().await.unwrap();
    let (server, owner, _) = claimed_discord(&fixture, &provider).await;
    enroll(&server, &owner, "0", application()).await;
    let (_, authorize) = begin(&server, &owner).await;
    let callback = provider.authorization_callback(&authorize).unwrap();
    let parsed = Url::parse(&callback).unwrap();
    let values: std::collections::BTreeMap<_, _> = parsed.query_pairs().collect();
    let state = values.get("state").unwrap();
    let code = values.get("code").unwrap();
    let issuer = "iss=https%3A%2F%2Fdiscord.com";
    let valid = format!("state={state}&code={code}&{issuer}");
    let queries = vec![
        String::new(),
        format!("state={state}&code={code}"),
        format!("state={state}&code={code}&iss=https%3A%2F%2Fdiscord.com%2F"),
        format!("state={state}&code={code}&iss=https%3A%2F%2Fwrong.invalid"),
        format!("{valid}&state={state}"),
        format!("{valid}&iss=https%3A%2F%2Fdiscord.com"),
        format!("{valid}&code=second"),
        format!("{valid}&error=access_denied"),
        format!("state={state}&{issuer}"),
        format!("state={state}&code=&{issuer}"),
        format!("state={state}&code=%ZZ&{issuer}"),
        format!("state={state}&code=%00&{issuer}"),
        format!("state={state}&code={}&{issuer}", "x".repeat(1025)),
        format!("state={state}&code={code}&{issuer}&unexpected=value"),
        format!(
            "state={state}&code={code}&{issuer}&error_description={}",
            "x".repeat(4096)
        ),
        format!("state={}&code={code}&{issuer}", "a".repeat(63)),
        format!("state={}&code={code}&{issuer}", "A".repeat(64)),
        format!("state={}&code={code}&{issuer}", "0".repeat(64)),
    ];
    for query in queries {
        let response = server
            .client
            .get(server.url(&format!("/account/discord/callback?{query}")))
            .send()
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::BAD_REQUEST);
        native_private(&response);
        assert!(
            response
                .headers()
                .get_all("set-cookie")
                .iter()
                .next()
                .is_none()
        );
        let body = response.text().await.unwrap();
        assert!(!body.contains(state.as_ref()));
        assert!(!body.contains(code.as_ref()));
        assert!(!body.contains(d::ID));
    }
    let response = server
        .client
        .head(server.url(&callback_path(&callback)))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::METHOD_NOT_ALLOWED);
    native_private(&response);
    assert!(
        response
            .headers()
            .get_all("set-cookie")
            .iter()
            .next()
            .is_none()
    );
    let returned = capture_callback(&server, &callback).await;
    assert!(returned.starts_with(RETURN));
    let response = server
        .client
        .get(server.url(&callback_path(&callback)))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::CONFLICT);
    native_private(&response);
    assert!(
        response
            .headers()
            .get_all("set-cookie")
            .iter()
            .next()
            .is_none()
    );
    assert!(provider.requests().is_empty());
    let _ = server.session_status(&owner, StatusCode::OK).await;
}

#[tokio::test]
async fn discord_application_enrollment_is_owner_only_strict_cas_and_encrypted() {
    let fixture = Fixture::new().await;
    let provider = d::Discord::start().await.unwrap();
    let (server, owner, _) = claimed_discord(&fixture, &provider).await;
    let member = member(&server, &owner).await;
    for path in [STATUS, APPLICATION] {
        let response = server
            .client
            .get(server.url(path))
            .header("X-Reborn-Product", PRODUCT)
            .header("X-Reborn-Contract", "reborn-workspace-v1")
            .header("X-CSRF-Token", "a".repeat(64))
            .send()
            .await
            .unwrap();
        error(response, StatusCode::UNAUTHORIZED, &[d::CLIENT_SECRET]).await;
    }
    error(
        request(&server, &member, Method::GET, APPLICATION)
            .send()
            .await
            .unwrap(),
        StatusCode::FORBIDDEN,
        &[d::CLIENT_SECRET],
    )
    .await;
    error(
        request(&server, &member, Method::PUT, APPLICATION)
            .json(&json!({"base_revision":"0","application":application()}))
            .send()
            .await
            .unwrap(),
        StatusCode::FORBIDDEN,
        &[d::CLIENT_SECRET],
    )
    .await;
    let before = status(&server, &owner, &[]).await;
    let invalid = vec![
        json!({"client_id":"0","client_secret":d::CLIENT_SECRET,"callback_logging_reviewed":true}),
        json!({"client_id":"01","client_secret":d::CLIENT_SECRET,"callback_logging_reviewed":true}),
        json!({"client_id":"18446744073709551616","client_secret":d::CLIENT_SECRET,"callback_logging_reviewed":true}),
        json!({"client_id":d::CLIENT_ID,"client_secret":"","callback_logging_reviewed":true}),
        json!({"client_id":d::CLIENT_ID,"client_secret":"x".repeat(257),"callback_logging_reviewed":true}),
        json!({"client_id":d::CLIENT_ID,"client_secret":"line\nbreak","callback_logging_reviewed":true}),
        json!({"client_id":d::CLIENT_ID,"client_secret":d::CLIENT_SECRET,"callback_logging_reviewed":false}),
        json!({"client_id":d::CLIENT_ID,"client_secret":d::CLIENT_SECRET,"callback_logging_reviewed":true,"endpoint":"https://private.invalid/"}),
    ];
    for application in invalid {
        error(
            request(&server, &owner, Method::PUT, APPLICATION)
                .json(&json!({"base_revision":"0","application":application}))
                .send()
                .await
                .unwrap(),
            StatusCode::BAD_REQUEST,
            &[d::CLIENT_SECRET],
        )
        .await;
    }
    for raw in [
        r#"{"base_revision":"0","base_revision":"0","application":null}"#,
        r#"{"base_revision":0,"application":null}"#,
        r#"{"base_revision":"00","application":null}"#,
        r#"{"base_revision":"0","application":null,"extra":true}"#,
    ] {
        error(
            request(&server, &owner, Method::PUT, APPLICATION)
                .header("Content-Type", "application/json")
                .body(raw)
                .send()
                .await
                .unwrap(),
            StatusCode::BAD_REQUEST,
            &[d::CLIENT_SECRET],
        )
        .await;
    }
    assert_eq!(status(&server, &owner, &[]).await, before);
    let configured = enroll(&server, &owner, "0", application()).await;
    assert_eq!(configured["application"]["revision"], "1");
    assert_eq!(configured["application"]["configured"], true);
    error(
        request(&server, &owner, Method::PUT, APPLICATION)
            .json(&json!({"base_revision":"0","application":null}))
            .send()
            .await
            .unwrap(),
        StatusCode::CONFLICT,
        &[d::CLIENT_SECRET],
    )
    .await;
    let mut db = fixture.connect().await;
    let sealed: Vec<u8> =
        sqlx::query_scalar("SELECT sealed FROM discord_application WHERE singleton=TRUE")
            .fetch_one(&mut db)
            .await
            .unwrap();
    assert_eq!(sealed[0], 4);
    assert!(!String::from_utf8_lossy(&sealed).contains(d::CLIENT_SECRET));
    assert!(
        provider.requests().is_empty(),
        "enrollment or status reached Discord"
    );
    let public_member = status(&server, &member, &[]).await;
    assert_eq!(public_member["application"]["configured"], true);
    assert!(public_member["link"]["identity"].is_null());
}

#[tokio::test]
async fn discord_new_start_replaces_pending_state_and_stale_capabilities_cannot_review() {
    let fixture = Fixture::new().await;
    let provider = d::Discord::start().await.unwrap();
    let (server, owner, _) = claimed_discord(&fixture, &provider).await;
    enroll(&server, &owner, "0", application()).await;
    let (first_flow, first_authorize) = begin(&server, &owner).await;
    let first_callback = provider.authorization_callback(&first_authorize).unwrap();
    let (second_flow, second_authorize) = begin(&server, &owner).await;
    assert_ne!(first_flow, second_flow);
    assert_ne!(first_authorize, second_authorize);
    let response = server
        .client
        .get(server.url(&callback_path(&first_callback)))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    native_private(&response);
    assert!(
        response
            .headers()
            .get_all("set-cookie")
            .iter()
            .next()
            .is_none()
    );
    let second_callback = provider.authorization_callback(&second_authorize).unwrap();
    let returned = capture_callback(&server, &second_callback).await;
    let snapshot = status(&server, &owner, &[&second_flow, &returned]).await;
    error(
        mutation(
            &server,
            &owner,
            "review",
            &snapshot,
            &[&first_flow, &returned],
        )
        .send()
        .await
        .unwrap(),
        StatusCode::CONFLICT,
        &[d::CLIENT_SECRET],
    )
    .await;
    let wrong_return = format!("{RETURN}={}", "f".repeat(64));
    error(
        mutation(
            &server,
            &owner,
            "review",
            &snapshot,
            &[&second_flow, &wrong_return],
        )
        .send()
        .await
        .unwrap(),
        StatusCode::CONFLICT,
        &[d::CLIENT_SECRET],
    )
    .await;
    assert!(provider.requests().is_empty());
    let flow = Flow {
        flow: second_flow,
        returned,
        callback: second_callback,
        snapshot,
    };
    let candidate = reviewed(&server, &owner, &flow).await;
    let calls = provider.requests();
    error(
        mutation(
            &server,
            &owner,
            "review",
            &candidate,
            &[&flow.flow, &flow.returned],
        )
        .send()
        .await
        .unwrap(),
        StatusCode::CONFLICT,
        &[d::CLIENT_SECRET],
    )
    .await;
    assert_eq!(
        provider.requests(),
        calls,
        "a duplicate review replayed an authorization code"
    );
}

#[tokio::test]
async fn discord_cancel_and_local_unlink_during_provider_io_block_late_candidate_disclosure() {
    for action in ["cancel", "unlink"] {
        let fixture = Fixture::new().await;
        let provider = d::Discord::start().await.unwrap();
        let (server, owner, _) = claimed_discord(&fixture, &provider).await;
        enroll(&server, &owner, "0", application()).await;
        let flow = flow(&server, &owner, &provider).await;
        provider.mode(d::HOLD_USER);
        let review = mutation(
            &server,
            &owner,
            "review",
            &flow.snapshot,
            &[&flow.flow, &flow.returned],
        );
        let task = tokio::spawn(async move { review.send().await.unwrap() });
        tokio::time::timeout(Duration::from_secs(2), provider.wait_entered())
            .await
            .expect("provider user read entered");
        let response = mutation(&server, &owner, action, &flow.snapshot, &[])
            .send()
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        provider.release();
        let response = task.await.unwrap();
        error(response, StatusCode::CONFLICT, &[d::CLIENT_SECRET]).await;
        let current = status(&server, &owner, &[&flow.flow, &flow.returned]).await;
        assert!(current["link"]["identity"].is_null());
        assert!(current["attempt"]["candidate"].is_null());
        assert_ne!(
            current["link"]["flow_generation"],
            flow.snapshot["link"]["flow_generation"]
        );
        assert_eq!(provider.invalid_requests(), 0);
    }
}

#[tokio::test]
async fn discord_application_logout_revocation_and_key_changes_during_io_recheck_current_authority()
{
    for change in ["application", "logout", "revocation", "key"] {
        let fixture = Fixture::new().await;
        let provider = d::Discord::start().await.unwrap();
        let (server, owner, _) = claimed_discord(&fixture, &provider).await;
        enroll(&server, &owner, "0", application()).await;
        let flow = flow(&server, &owner, &provider).await;
        provider.mode(d::HOLD_USER);
        let review = mutation(
            &server,
            &owner,
            "review",
            &flow.snapshot,
            &[&flow.flow, &flow.returned],
        );
        let task = tokio::spawn(async move { review.send().await.unwrap() });
        tokio::time::timeout(Duration::from_secs(2), provider.wait_entered())
            .await
            .expect("provider user read entered");
        let expected = match change {
            "application" => {
                enroll(&server, &owner, "1", Value::Null).await;
                StatusCode::CONFLICT
            }
            "logout" => {
                let response = auth_request(&server, &owner, "/api/auth/logout")
                    .send()
                    .await
                    .unwrap();
                assert_eq!(response.status(), StatusCode::OK);
                StatusCode::UNAUTHORIZED
            }
            "revocation" => {
                let response = auth_request(&server, &owner, "/api/auth/revoke-all")
                    .send()
                    .await
                    .unwrap();
                assert_eq!(response.status(), StatusCode::OK);
                StatusCode::UNAUTHORIZED
            }
            "key" => {
                sqlx::query("UPDATE auth_state SET key_id=$1 WHERE singleton=TRUE")
                    .bind(vec![0x99_u8; 32])
                    .execute(&mut fixture.connect().await)
                    .await
                    .unwrap();
                StatusCode::SERVICE_UNAVAILABLE
            }
            _ => unreachable!(),
        };
        provider.release();
        error(
            task.await.unwrap(),
            expected,
            &[d::CLIENT_SECRET, d::DISPLAY],
        )
        .await;
        let mut db = fixture.connect().await;
        assert_eq!(
            sqlx::query_scalar::<_, i64>(
                "SELECT count(*) FROM discord_links WHERE discord_id IS NOT NULL"
            )
            .fetch_one(&mut db)
            .await
            .unwrap(),
            0
        );
        assert_eq!(provider.invalid_requests(), 0);
    }
}

#[tokio::test]
async fn discord_identity_collision_is_generic_and_other_accounts_never_inherit_candidates() {
    let fixture = Fixture::new().await;
    let provider = d::Discord::start().await.unwrap();
    let (server, owner, _) = claimed_discord(&fixture, &provider).await;
    enroll(&server, &owner, "0", application()).await;
    let member = member(&server, &owner).await;
    let owner_flow = flow(&server, &owner, &provider).await;
    let owner_candidate = reviewed(&server, &owner, &owner_flow).await;
    let other = status(&server, &member, &[&owner_flow.flow, &owner_flow.returned]).await;
    assert!(other["attempt"]["candidate"].is_null());
    assert!(other["link"]["identity"].is_null());
    let member_flow = flow(&server, &member, &provider).await;
    let member_candidate = reviewed(&server, &member, &member_flow).await;
    let first = mutation(
        &server,
        &owner,
        "confirm",
        &owner_candidate,
        &[&owner_flow.flow, &owner_flow.returned],
    );
    let second = mutation(
        &server,
        &member,
        "confirm",
        &member_candidate,
        &[&member_flow.flow, &member_flow.returned],
    );
    let (first, second) = tokio::join!(first.send(), second.send());
    let first = first.unwrap();
    let second = second.unwrap();
    assert_eq!(
        usize::from(first.status() == StatusCode::OK)
            + usize::from(second.status() == StatusCode::OK),
        1
    );
    let collision = if first.status() == StatusCode::CONFLICT {
        first
    } else {
        second
    };
    error(
        collision,
        StatusCode::CONFLICT,
        &[
            "keida_owner",
            "discord_member",
            d::ID,
            d::DISPLAY,
            d::CLIENT_SECRET,
        ],
    )
    .await;
    let mut db = fixture.connect().await;
    assert_eq!(
        sqlx::query_scalar::<_, i64>(
            "SELECT count(*) FROM discord_links WHERE discord_id IS NOT NULL"
        )
        .fetch_one(&mut db)
        .await
        .unwrap(),
        1
    );
    assert_eq!(provider.invalid_requests(), 0);
}

#[tokio::test]
async fn discord_denial_and_partial_provider_errors_never_link_or_replay_codes_and_cleanup_is_honest()
 {
    for mode in [
        d::DENIED,
        d::TOKEN_DENIED,
        d::MALFORMED_USER,
        d::DUPLICATE_USER,
        d::WRONG_SCOPE,
        d::REDIRECT_TOKEN,
        d::REVOKE_FAILED,
    ] {
        let fixture = Fixture::new().await;
        let provider = d::Discord::start().await.unwrap();
        let (server, owner, _) = claimed_discord(&fixture, &provider).await;
        enroll(&server, &owner, "0", application()).await;
        provider.mode(mode);
        let flow = flow(&server, &owner, &provider).await;
        if mode == d::DENIED {
            assert_eq!(flow.snapshot["attempt"]["phase"], "failed");
            assert_eq!(flow.snapshot["attempt"]["error"], "denied");
            assert!(flow.snapshot["attempt"]["candidate"].is_null());
            assert!(provider.requests().is_empty());
            continue;
        }
        let response = mutation(
            &server,
            &owner,
            "review",
            &flow.snapshot,
            &[&flow.flow, &flow.returned],
        )
        .send()
        .await
        .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        let value: Value = response.json().await.unwrap();
        private_json(&value, &owner);
        assert!(value["link"]["identity"].is_null());
        if mode == d::REVOKE_FAILED {
            assert_eq!(value["attempt"]["phase"], "review_ready");
            assert_eq!(value["attempt"]["cleanup"], "unconfirmed");
            assert_eq!(value["attempt"]["candidate"]["id"], d::ID);
        } else {
            assert_eq!(value["attempt"]["phase"], "failed");
            assert!(value["attempt"]["candidate"].is_null());
            assert!(value["attempt"]["error"].is_string());
        }
        let requests = provider.requests();
        assert_eq!(
            requests
                .iter()
                .filter(|(_, path)| path == "/api/oauth2/token")
                .count(),
            1
        );
        error(
            mutation(
                &server,
                &owner,
                "review",
                &value,
                &[&flow.flow, &flow.returned],
            )
            .send()
            .await
            .unwrap(),
            StatusCode::CONFLICT,
            &[d::CLIENT_SECRET],
        )
        .await;
        assert_eq!(
            provider.requests(),
            requests,
            "failed/uncertain review replayed an authorization code"
        );
        assert_eq!(provider.invalid_requests(), 0);
    }
}

#[tokio::test]
async fn discord_restart_discards_unfinished_codes_but_retains_enrollment_and_requires_new_flow() {
    let fixture = Fixture::new().await;
    let provider = d::Discord::start().await.unwrap();
    let (server, owner, _) = claimed_discord(&fixture, &provider).await;
    enroll(&server, &owner, "0", application()).await;
    let pending = flow(&server, &owner, &provider).await;
    assert!(provider.requests().is_empty());
    drop(server);
    let server = start_server(&fixture, &provider).await;
    let current = status(&server, &owner, &[&pending.flow, &pending.returned]).await;
    assert_eq!(current["application"]["configured"], true);
    assert!(current["attempt"]["candidate"].is_null());
    error(
        mutation(
            &server,
            &owner,
            "review",
            &current,
            &[&pending.flow, &pending.returned],
        )
        .send()
        .await
        .unwrap(),
        StatusCode::CONFLICT,
        &[d::CLIENT_SECRET],
    )
    .await;
    assert!(
        provider.requests().is_empty(),
        "restart replayed a previous process's code"
    );
    let response = server
        .client
        .get(server.url(&callback_path(&pending.callback)))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    no_auth_cookies(&response);
    let fresh = flow(&server, &owner, &provider).await;
    assert_ne!(fresh.flow, pending.flow);
    let candidate = reviewed(&server, &owner, &fresh).await;
    let response = mutation(
        &server,
        &owner,
        "confirm",
        &candidate,
        &[&fresh.flow, &fresh.returned],
    )
    .send()
    .await
    .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    let accepted: Value = response.json().await.unwrap();
    let requests = provider.requests();
    drop(server);
    let server = start_server(&fixture, &provider).await;
    let restarted = status(&server, &owner, &[]).await;
    assert_eq!(restarted["link"], accepted["link"]);
    assert_eq!(restarted["application"], accepted["application"]);
    assert_eq!(
        provider.requests(),
        requests,
        "restart reverified an accepted identity"
    );
    assert_eq!(provider.invalid_requests(), 0);
}

#[tokio::test]
async fn discord_native_and_json_mutations_require_exact_origin_csrf_contract_and_closed_fields() {
    let fixture = Fixture::new().await;
    let provider = d::Discord::start().await.unwrap();
    let (server, owner, _) = claimed_discord(&fixture, &provider).await;
    enroll(&server, &owner, "0", application()).await;
    let initial = status(&server, &owner, &[]).await;
    for (origin, csrf, product, contract, extra, expected) in [
        (
            "https://wrong.test",
            owner.csrf.as_str(),
            PRODUCT,
            "reborn-discord-link-v1",
            "",
            StatusCode::FORBIDDEN,
        ),
        (
            PUBLIC_ORIGIN,
            "wrong",
            PRODUCT,
            "reborn-discord-link-v1",
            "",
            StatusCode::FORBIDDEN,
        ),
        (
            PUBLIC_ORIGIN,
            owner.csrf.as_str(),
            "wrong-product",
            "reborn-discord-link-v1",
            "",
            StatusCode::UPGRADE_REQUIRED,
        ),
        (
            PUBLIC_ORIGIN,
            owner.csrf.as_str(),
            PRODUCT,
            "wrong-contract",
            "",
            StatusCode::UPGRADE_REQUIRED,
        ),
        (
            PUBLIC_ORIGIN,
            owner.csrf.as_str(),
            PRODUCT,
            "reborn-discord-link-v1",
            "&product=keida-hub-reborn",
            StatusCode::BAD_REQUEST,
        ),
        (
            PUBLIC_ORIGIN,
            owner.csrf.as_str(),
            PRODUCT,
            "reborn-discord-link-v1",
            "&unexpected=value",
            StatusCode::BAD_REQUEST,
        ),
    ] {
        let encoded = url::form_urlencoded::Serializer::new(String::new())
            .extend_pairs([
                ("product", product),
                ("contract", contract),
                ("csrf_token", csrf),
                ("base_revision", "0"),
                ("base_flow_generation", "0"),
                ("base_application_revision", "1"),
            ])
            .finish();
        let response = server
            .client
            .post(server.url("/account/discord/start"))
            .header("Cookie", &owner.cookie)
            .header("Origin", origin)
            .header("Content-Type", "application/x-www-form-urlencoded")
            .body(format!("{encoded}{extra}"))
            .send()
            .await
            .unwrap();
        assert_eq!(response.status(), expected);
        native_private(&response);
    }
    assert_eq!(status(&server, &owner, &[]).await, initial);
    assert!(provider.requests().is_empty());
    let flow = flow(&server, &owner, &provider).await;
    for (origin, csrf, contract, expected) in [
        (
            "https://wrong.test",
            owner.csrf.as_str(),
            "reborn-workspace-v1",
            StatusCode::FORBIDDEN,
        ),
        (
            PUBLIC_ORIGIN,
            "wrong",
            "reborn-workspace-v1",
            StatusCode::FORBIDDEN,
        ),
        (
            PUBLIC_ORIGIN,
            owner.csrf.as_str(),
            "wrong-contract",
            StatusCode::UPGRADE_REQUIRED,
        ),
    ] {
        let response = server
            .client
            .post(server.url("/api/workspace/discord/review"))
            .header(
                "Cookie",
                format!("{}; {}; {}", owner.cookie, flow.flow, flow.returned),
            )
            .header("Origin", origin)
            .header("X-Reborn-Product", PRODUCT)
            .header("X-Reborn-Contract", contract)
            .header("X-CSRF-Token", csrf)
            .json(&bases(&flow.snapshot, true))
            .send()
            .await
            .unwrap();
        error(response, expected, &[d::CLIENT_SECRET]).await;
    }
    let mut submitted_identity = bases(&flow.snapshot, true);
    submitted_identity["discord_id"] = json!(d::ID);
    error(
        request(
            &server,
            &owner,
            Method::POST,
            "/api/workspace/discord/review",
        )
        .json(&submitted_identity)
        .send()
        .await
        .unwrap(),
        StatusCode::BAD_REQUEST,
        &[d::CLIENT_SECRET],
    )
    .await;
    let duplicate = format!(
        r#"{{"base_revision":"{}","base_revision":"{}","base_flow_generation":"{}","base_application_revision":"{}"}}"#,
        flow.snapshot["link"]["revision"].as_str().unwrap(),
        flow.snapshot["link"]["revision"].as_str().unwrap(),
        flow.snapshot["link"]["flow_generation"].as_str().unwrap(),
        flow.snapshot["application"]["revision"].as_str().unwrap(),
    );
    error(
        request(
            &server,
            &owner,
            Method::POST,
            "/api/workspace/discord/review",
        )
        .header("Content-Type", "application/json")
        .body(duplicate)
        .send()
        .await
        .unwrap(),
        StatusCode::BAD_REQUEST,
        &[d::CLIENT_SECRET],
    )
    .await;
    assert!(
        provider.requests().is_empty(),
        "invalid admission consumed the code or contacted Discord"
    );
    let _ = reviewed(&server, &owner, &flow).await;
}

#[tokio::test]
async fn discord_attempt_is_bound_to_the_initiating_session_even_for_the_same_local_account() {
    let fixture = Fixture::new().await;
    let provider = d::Discord::start().await.unwrap();
    let (server, owner, _) = claimed_discord(&fixture, &provider).await;
    enroll(&server, &owner, "0", application()).await;
    let flow = flow(&server, &owner, &provider).await;
    let another_session = login(&server, "keida_owner", OWNER_PASSWORD).await;
    assert_eq!(another_session.account, owner.account);
    assert_ne!(another_session.cookie, owner.cookie);
    let other = status(&server, &another_session, &[&flow.flow, &flow.returned]).await;
    assert!(other["attempt"]["candidate"].is_null());
    error(
        mutation(
            &server,
            &another_session,
            "review",
            &flow.snapshot,
            &[&flow.flow, &flow.returned],
        )
        .send()
        .await
        .unwrap(),
        StatusCode::CONFLICT,
        &[d::CLIENT_SECRET],
    )
    .await;
    assert!(
        provider.requests().is_empty(),
        "a different same-account session consumed the code"
    );
    let candidate = reviewed(&server, &owner, &flow).await;
    let other = status(&server, &another_session, &[&flow.flow, &flow.returned]).await;
    assert!(other["attempt"]["candidate"].is_null());
    error(
        mutation(
            &server,
            &another_session,
            "confirm",
            &candidate,
            &[&flow.flow, &flow.returned],
        )
        .send()
        .await
        .unwrap(),
        StatusCode::CONFLICT,
        &[d::CLIENT_SECRET],
    )
    .await;
    let response = mutation(
        &server,
        &owner,
        "confirm",
        &candidate,
        &[&flow.flow, &flow.returned],
    )
    .send()
    .await
    .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(provider.invalid_requests(), 0);
}

#[tokio::test]
async fn identity_guide_profile_describes_bounded_linking_without_private_state_or_acceptance_claims()
 {
    let fixture = Fixture::new().await;
    let provider = d::Discord::start().await.unwrap();
    let (server, owner, _) = claimed_discord(&fixture, &provider).await;
    let member = member(&server, &owner).await;
    let note = "Private Discord guide fixture note must stay private";
    let response = request(&server, &owner, Method::PUT, "/api/workspace/note")
        .json(&json!({"base_revision":"0","body":note}))
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    enroll(&server, &owner, "0", application()).await;
    let flow = flow(&server, &owner, &provider).await;
    let candidate = reviewed(&server, &owner, &flow).await;
    let calls = provider.requests();
    let mut owner_guide: Option<Value> = None;
    for actor in [&owner, &member] {
        let response = request(&server, actor, Method::GET, "/api/workspace/guide")
            .header("X-Reborn-Guide", "identity-v1")
            .send()
            .await
            .unwrap();
        assert_eq!(response.status(), StatusCode::OK);
        assert_no_store(&response);
        let value: Value = response.json().await.unwrap();
        assert_eq!(value["account"], actor.account);
        assert_eq!(value["contract"], "reborn-workspace-v1");
        private_json(&value, actor);
        assert_private_text(&value.to_string(), &[note, d::ID, d::DISPLAY]);
        let catalog = value["catalog"].as_array().unwrap();
        assert_eq!(catalog.len(), 7);
        assert_eq!(
            catalog
                .iter()
                .filter(|entry| entry["status"] == "available")
                .count(),
            6
        );
        let discord = catalog
            .iter()
            .find(|entry| entry["id"] == "discord")
            .unwrap();
        assert_eq!(discord["status"], "planned");
        let capabilities = discord["capabilities"].to_string().to_ascii_lowercase();
        assert!(capabilities.contains("identity") && capabilities.contains("unlink"));
        let milestone = value["roadmap"]["milestones"]
            .as_array()
            .unwrap()
            .iter()
            .find(|milestone| milestone["id"] == "M4")
            .unwrap();
        assert!(
            milestone["status"]
                .as_str()
                .unwrap()
                .starts_with("In progress")
        );
        assert!(
            milestone["delivered"]
                .to_string()
                .to_ascii_lowercase()
                .contains("link")
        );
        let remaining = milestone["remaining"].to_string().to_ascii_lowercase();
        assert!(
            remaining.contains("real")
                && remaining.contains("enrollment")
                && remaining.contains("privacy")
        );
        if let Some(previous) = &owner_guide {
            assert_eq!(value["catalog"], previous["catalog"]);
            assert_eq!(value["roadmap"], previous["roadmap"]);
        } else {
            owner_guide = Some(value);
        }
    }
    for profile in ["identity-v2", "identity-v1,identity-v1"] {
        error(
            request(&server, &owner, Method::GET, "/api/workspace/guide")
                .header("X-Reborn-Guide", profile)
                .send()
                .await
                .unwrap(),
            StatusCode::UPGRADE_REQUIRED,
            &[note, d::DISPLAY],
        )
        .await;
    }
    error(
        request(&server, &owner, Method::GET, "/api/workspace/guide")
            .header("X-Reborn-Guide", "identity-v1")
            .header("X-Reborn-Guide", "identity-v1")
            .send()
            .await
            .unwrap(),
        StatusCode::UPGRADE_REQUIRED,
        &[note, d::DISPLAY],
    )
    .await;
    assert_eq!(
        status(&server, &owner, &[&flow.flow, &flow.returned]).await,
        candidate
    );
    let response = request(&server, &owner, Method::GET, "/api/workspace/snapshot")
        .send()
        .await
        .unwrap();
    assert_eq!(response.status(), StatusCode::OK);
    assert_eq!(
        response.json::<Value>().await.unwrap()["note"]["body"],
        note
    );
    assert_eq!(provider.requests(), calls, "guide reads reached Discord");
}
