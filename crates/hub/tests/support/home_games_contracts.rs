//! Real HTTP/PG plus literal TCP expectations, independent of the status client.
use super::*;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

async fn games(actor: &Actor, binding: &str, status: StatusCode) -> Value {
    let response = workspace_request(actor, Method::GET, "/api/workspace/games", binding)
        .send().await.expect("game read response");
    assert_eq!(response.status(), status);
    no_store(&response);
    let body = response.text().await.expect("bounded game response");
    private_text(&body, &[reborn_crafty_fixture::TOKEN, "BEGIN CERTIFICATE", "127.0.0.1", "server_id"]);
    serde_json::from_str(&body).expect("game response JSON")
}

#[tokio::test]
async fn home_games_status_only_cache_and_final_authority_reject_obsolete_results() {
    use reborn_crafty_fixture as c;
    let fixture = Fixture::new().await;
    let secret = fixture.prepare().await;
    let listener = tokio::net::TcpListener::bind("127.0.0.1:0").await.expect("private gateway");
    let routes = fixture.directory.join("game-routes.json");
    fs::write(&routes, json!({"format":1,"endpoint":listener.local_addr().unwrap().to_string(),
        "routes":[{"server_id":c::ID,"hostname":"play.example","public_port":25570}]}).to_string()).unwrap();
    fs::set_permissions(&routes, fs::Permissions::from_mode(0o600)).unwrap();
    let server = Server::start(&fixture, true).await;
    let mut owner = claim(&fixture, &server, &secret).await;
    let binding = workspace_binding(&mut owner).await;
    let denied = owner.request(Method::GET, "/api/workspace/games").send().await.unwrap();
    assert_eq!(denied.status(), StatusCode::UPGRADE_REQUIRED);
    games(&server.actor(), &binding, StatusCode::UNAUTHORIZED).await;
    games(&owner, "wrong", StatusCode::FORBIDDEN).await;
    assert!(tokio::time::timeout(Duration::from_millis(30), listener.accept()).await.is_err());

    let provider = c::Crafty::start().await.expect("enrollment reference fixture");
    let mut config = dedicated_connection(&provider);
    config["servers"][0]["join"] = json!("");
    replace_connection(&owner, &binding, "0", config.clone(), StatusCode::OK).await;
    let (entered_tx, mut entered_rx) = tokio::sync::mpsc::channel(3);
    let release = std::sync::Arc::new(tokio::sync::Notify::new());
    let gate = release.clone();
    let wire = tokio::spawn(async move {
        for _ in 0..3 {
            let (mut stream, _) = tokio::time::timeout(Duration::from_secs(4), listener.accept()).await.unwrap().unwrap();
            let expected = b"\x13\x00\xff\x05\x0cplay.example\x63\xe2\x01\x01\x00";
            let mut request = vec![0; expected.len()];
            stream.read_exact(&mut request).await.unwrap();
            assert_eq!(&request, expected, "only handshake state1 plus one status request");
            entered_tx.send(()).await.unwrap();
            gate.notified().await;
            let raw = r#"{"version":{"name":"Sleeping • Join to wake","protocol":767},"players":{"online":0,"max":20}}"#;
            assert!(raw.len() < 128);
            let body_size = raw.len() + 2;
            assert!(body_size < 128);
            let mut reply = vec![body_size as u8, 0, raw.len() as u8];
            reply.extend(raw.as_bytes());
            stream.write_all(&reply).await.unwrap();
            let mut extra = [0];
            assert_eq!(tokio::time::timeout(Duration::from_secs(1), stream.read(&mut extra)).await.unwrap().unwrap(), 0, "no extra or login packet");
        }
    });
    let reader = owner.clone(); let bound = binding.clone();
    let read = tokio::spawn(async move { games(&reader, &bound, StatusCode::OK).await });
    tokio::time::timeout(Duration::from_secs(2), entered_rx.recv()).await.unwrap().unwrap();
    release.notify_one();
    let observed = read.await.unwrap();
    assert_eq!(observed["revision"], "1");
    assert_eq!(observed["account"]["role"], "owner");
    assert_eq!(observed["servers"][0]["join"], "play.example:25570");
    assert_eq!(observed["servers"][0]["gateway"]["state"], "sleeping");
    assert_eq!(observed["servers"][0]["gateway"]["players"], Value::Null);
    assert_eq!(observed["servers"][0]["gateway"]["capacity"], Value::Null);
    assert_eq!(games(&owner, &binding, StatusCode::OK).await["servers"], observed["servers"], "cache reuses original sample");
    assert!(entered_rx.try_recv().is_err(), "cache sends no new TCP request");
    assert!(provider.requests().is_empty(), "Home gateway read never contacts Crafty");

    replace_connection(&owner, &binding, "1", config.clone(), StatusCode::OK).await;
    let reader = owner.clone(); let bound = binding.clone();
    let read = tokio::spawn(async move { games(&reader, &bound, StatusCode::CONFLICT).await });
    tokio::time::timeout(Duration::from_secs(2), entered_rx.recv()).await.unwrap().unwrap();
    let at = Instant::now();
    replace_connection(&owner, &binding, "2", Value::Null, StatusCode::OK).await;
    assert!(at.elapsed() < Duration::from_secs(1), "game IO cannot hold DB authority");
    release.notify_one();
    assert_eq!(read.await.unwrap(), json!({"error":"conflict"}));

    replace_connection(&owner, &binding, "3", config, StatusCode::OK).await;
    let auth = owner.api_session(StatusCode::OK).await;
    let reader = owner.clone(); let bound = binding.clone();
    let read = tokio::spawn(async move { games(&reader, &bound, StatusCode::UNAUTHORIZED).await });
    tokio::time::timeout(Duration::from_secs(2), entered_rx.recv()).await.unwrap().unwrap();
    let revoked = owner.request(Method::POST, "/api/auth/revoke-all")
        .header("Origin", ORIGIN).header("X-Reborn-Product", PRODUCT).header("X-Reborn-Contract", "reborn-auth-v1")
        .header("X-CSRF-Token", auth["csrf_token"].as_str().unwrap()).send().await.unwrap();
    assert_eq!(revoked.status(), StatusCode::NO_CONTENT);
    release.notify_one();
    assert_eq!(read.await.unwrap(), json!({"error":"invalid_session"}));
    wire.await.unwrap();
}
