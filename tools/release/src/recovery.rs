//! Isolated packaged install/restore/failed-candidate rehearsal; never live data.
use crate::{Result, directory, hash, hex};
use reqwest::{Client, Response};
use serde_json::{Value, json};
use std::{
    fs,
    net::TcpListener,
    os::unix::fs::{DirBuilderExt, MetadataExt, PermissionsExt},
    path::{Path, PathBuf},
    process::{Command, Stdio},
    time::Duration,
};
const PG: &str = "postgres:16.15-bookworm@sha256:d81f7b51697014367236d07ec58b54153fc28f828b72bf247fe5c7487520bcb0";
const ORIGIN: &str = "https://recovery.reborn.example";
fn docker(args: &[&str]) -> Result<Vec<u8>> {
    let o = Command::new("docker")
        .args(args)
        .stderr(Stdio::null())
        .output()
        .map_err(|_| "recovery Docker caller unavailable")?;
    if !o.status.success() || o.stdout.len() > 262144 {
        return Err("recovery Docker operation failed");
    }
    Ok(o.stdout)
}
struct Scope {
    root: PathBuf,
    containers: Vec<String>,
}
impl Drop for Scope {
    fn drop(&mut self) {
        for c in self.containers.iter().rev() {
            if let Ok(id) = fs::read_to_string(self.root.join(format!("{c}.cid"))) {
                let id = id.trim();
                if crate::digest(id, 64) {
                    let _ = docker(&["rm", "--force", id]);
                }
            }
        }
        let _ = fs::remove_dir_all(&self.root);
    }
}
fn private(path: &Path) -> Result<()> {
    fs::DirBuilder::new()
        .mode(0o700)
        .create(path)
        .map_err(|_| "recovery private directory failed")
}
fn port() -> Result<u16> {
    let listener =
        TcpListener::bind("127.0.0.1:0").map_err(|_| "recovery loopback reservation failed")?;
    listener
        .local_addr()
        .map(|a| a.port())
        .map_err(|_| "recovery loopback address failed")
}
fn app_args(
    image: &str,
    name: &str,
    root: &Path,
    port: u16,
    dsn: &Path,
    user: &str,
) -> Vec<String> {
    let mut args = [
        "run",
        "--name",
        name,
        "--cidfile",
        &root
            .parent()
            .expect("owned recovery parent")
            .join(format!("{name}.cid"))
            .to_string_lossy(),
        "--network",
        "host",
        "--user",
        user,
        "--read-only",
        "--cap-drop",
        "ALL",
        "--security-opt",
        "no-new-privileges",
        "--memory",
        "256m",
        "--pids-limit",
        "64",
        "--cpus",
        "1",
        "--tmpfs",
        "/tmp:rw,noexec,nosuid,size=16m",
        "--mount",
        &format!("type=bind,src={},dst={}", root.display(), root.display()),
        "-e",
        &format!("DATABASE_URL_FILE={}", dsn.display()),
        "-e",
        &format!(
            "REBORN_INSTANCE_KEY_FILE={}",
            root.join("instance.key").display()
        ),
        "-e",
        &format!("REBORN_BIND=127.0.0.1:{port}"),
        "-e",
        &format!("REBORN_PUBLIC_ORIGIN={ORIGIN}"),
        image,
    ]
    .map(str::to_owned)
    .to_vec();
    if !dsn.starts_with(root) {
        let parent = dsn.parent().expect("private DSN parent");
        let at = args.len() - 1;
        args.splice(
            at..at,
            [
                "--mount".into(),
                format!(
                    "type=bind,src={},dst={},readonly",
                    parent.display(),
                    parent.display()
                ),
            ],
        );
    }
    args
}
fn invoke(mut args: Vec<String>, tail: &[&str]) -> Result<Vec<u8>> {
    args.extend(tail.iter().map(|s| s.to_string()));
    docker(&args.iter().map(String::as_str).collect::<Vec<_>>())
}
fn cookie(response: &Response, name: &str) -> Result<String> {
    response
        .headers()
        .get_all("set-cookie")
        .iter()
        .filter_map(|h| h.to_str().ok())
        .filter_map(|h| h.split(';').next())
        .find_map(|s| {
            s.strip_prefix(&format!("{name}="))
                .filter(|v| !v.is_empty())
                .map(|v| format!("{name}={v}"))
        })
        .ok_or("recovery native cookie absent")
}
async fn value(response: Response, status: u16) -> Result<Value> {
    if response.status().as_u16() != status {
        return Err("recovery HTTP outcome mismatch");
    }
    response
        .json()
        .await
        .map_err(|_| "recovery response rejected")
}
fn admitted(
    client: &Client,
    origin: &str,
    path: &str,
    method: reqwest::Method,
    session: &str,
    binding: &str,
    contract: &str,
) -> reqwest::RequestBuilder {
    client
        .request(method, format!("{origin}{path}"))
        .header("Cookie", session)
        .header("Origin", ORIGIN)
        .header("X-Reborn-Product", "keida-hub-reborn")
        .header("X-Reborn-Contract", contract)
        .header("X-CSRF-Token", binding)
}
async fn save_layout(
    client: &Client,
    origin: &str,
    session: &str,
    binding: &str,
    base_revision: &str,
    panels: &Value,
) -> Result<Value> {
    value(
        admitted(
            client,
            origin,
            "/api/workspace/layout",
            reqwest::Method::PUT,
            session,
            binding,
            "reborn-workspace-v1",
        )
        .json(&json!({"base_revision":base_revision,"panels":panels}))
        .send()
        .await
        .map_err(|_| "packaged personal layout save failed")?,
        200,
    )
    .await
}
async fn observation_page(
    client: &Client,
    origin: &str,
    session: &str,
    binding: &str,
) -> Result<Value> {
    let response = admitted(
        client,
        origin,
        "/api/workspace/observations",
        reqwest::Method::GET,
        session,
        binding,
        "reborn-workspace-v1",
    )
    .send()
    .await
    .map_err(|_| "packaged observation history read failed")?;
    if !response
        .headers()
        .get("cache-control")
        .and_then(|v| v.to_str().ok())
        .is_some_and(|v| v.contains("no-store"))
    {
        return Err("observation history admitted browser caching");
    }
    let page = value(response, 200).await?;
    if page["product"] != "keida-hub-reborn"
        || page["contract"] != "reborn-workspace-v1"
        || page["schema"] != 1
    {
        return Err("observation history contract differs");
    }
    Ok(page)
}

async fn enroll_media(
    client: &Client,
    origin: &str,
    session: &str,
    binding: &str,
    provider: &str,
    base_revision: &str,
    fixture: &reborn_crafty_fixture::media::Media,
) -> Result<Value> {
    let library = match provider {
        "jellyfin" => json!(reborn_crafty_fixture::media::LIBRARY_ID),
        "seerr" => Value::Null,
        _ => return Err("recovery media provider rejected"),
    };
    value(
        admitted(
            client,
            origin,
            &format!("/api/owner/media/{provider}"),
            reqwest::Method::PUT,
            session,
            binding,
            "reborn-workspace-v1",
        )
        .json(&json!({"base_revision":base_revision,"connection":{
            "endpoint":fixture.origin,"token":reborn_crafty_fixture::media::TOKEN,
            "ca_pem":fixture.ca,"library_id":library,"acknowledge_broad_access":true
        }}))
        .send()
        .await
        .map_err(|_| "packaged encrypted media enrollment failed")?,
        200,
    )
    .await
}

async fn media_status(
    client: &Client,
    origin: &str,
    session: &str,
    binding: &str,
    provider: &str,
) -> Result<Value> {
    value(
        admitted(
            client,
            origin,
            &format!("/api/owner/media/{provider}"),
            reqwest::Method::GET,
            session,
            binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "packaged media enrollment status failed")?,
        200,
    )
    .await
}

async fn media_page(
    client: &Client,
    origin: &str,
    session: &str,
    binding: &str,
    provider: &str,
) -> Result<Value> {
    let deadline = tokio::time::Instant::now() + Duration::from_secs(8);
    loop {
        let response = admitted(
            client,
            origin,
            &format!("/api/workspace/media/{provider}?offset=0"),
            reqwest::Method::GET,
            session,
            binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "packaged media observation read failed")?;
        if !response
            .headers()
            .get("cache-control")
            .and_then(|v| v.to_str().ok())
            .is_some_and(|v| v.contains("no-store"))
        {
            return Err("media observation admitted browser caching");
        }
        let page = value(response, 200).await?;
        if page["product"] != "keida-hub-reborn"
            || page["contract"] != "reborn-workspace-v1"
            || page["schema"] != 1
            || page["provider"] != provider
            || page["account"]["role"] != "owner"
            || page["account"]["username"] != "recovery_owner"
        {
            return Err("packaged media authority envelope differs");
        }
        if page["observation"]["error"] != "checking" {
            return Ok(page);
        }
        if tokio::time::Instant::now() >= deadline {
            return Err("packaged demand media observation deadline");
        }
        tokio::time::sleep(Duration::from_millis(25)).await;
    }
}

fn assert_media(
    page: &Value,
    provider: &str,
    revision: &str,
    empty: bool,
    fixture: &reborn_crafty_fixture::media::Media,
) -> Result<()> {
    let observation = &page["observation"];
    let items = observation["items"]
        .as_array()
        .ok_or("packaged media item rows absent")?;
    if observation["revision"] != revision
        || observation["configured"] != true
        || observation["complete"] != true
        || !observation["error"].is_null()
        || observation["freshness"] != "fresh"
        || observation["checked_at"]
            .as_u64()
            .filter(|at| *at > 0)
            .is_none()
        || observation["offset"] != 0
        || observation["total"] != if empty { 0 } else { 26 }
        || items.len() != if empty { 0 } else { 12 }
    {
        return Err("packaged media observation differs from actual TLS fixture");
    }
    if empty {
        if !observation["next_offset"].is_null() || observation["truncated"] != false {
            return Err("packaged valid empty media page differs");
        }
    } else if observation["next_offset"] != 12
        || items
            .iter()
            .any(|row| !row["id"].as_str().is_some_and(|id| crate::digest(id, 64)))
    {
        return Err("packaged bounded media page or private row identity differs");
    }
    match provider {
        "jellyfin" => {
            if observation["playback"]["playing"] != if empty { 0 } else { 1 }
                || observation["playback"]["paused"] != if empty { 0 } else { 1 }
                || !observation["playback"]["error"].is_null()
                || (!empty
                    && (items[0]["title"] != "Fixture movie"
                        || items[0]["kind"] != "movie"
                        || items[0]["year"] != 2024
                        || items[1]["title"] != "Fixture series"
                        || items[1]["kind"] != "series"
                        || items[1]["year"] != 2025))
            {
                return Err("packaged Jellyfin library or counts-only playback differs");
            }
        }
        "seerr" => {
            if !observation["playback"].is_null()
                || (!empty
                    && (items[0]["title"] != "Requested movie"
                        || items[0]["request_status"] != "pending"
                        || items[1]["title"] != "Requested series"
                        || items[1]["request_status"] != "completed"))
            {
                return Err("packaged Seerr request status/title observation differs");
            }
        }
        _ => return Err("recovery media provider rejected"),
    }
    let encoded = serde_json::to_string(page).map_err(|_| "media proof encoding failed")?;
    if [
        reborn_crafty_fixture::media::TOKEN,
        reborn_crafty_fixture::media::LIBRARY_ID,
        fixture.origin.as_str(),
        fixture.ca.as_str(),
        "BEGIN CERTIFICATE",
        "ca_pem",
        "library_id",
        "RemoteEndPoint",
        "DeviceId",
        "DeviceName",
        "UserId",
        "UserName",
        "requestedBy",
        "PRIVATE_",
        "/private/media-fixture-path",
        "private-media-email@example.invalid",
    ]
    .iter()
    .any(|value| encoded.contains(value))
    {
        return Err("packaged media response disclosed non-allowlisted provider fields");
    }
    Ok(())
}

async fn member_media_denied(
    client: &Client,
    origin: &str,
    session: &str,
    binding: &str,
) -> Result<()> {
    for provider in ["jellyfin", "seerr"] {
        for path in [
            format!("/api/workspace/media/{provider}?offset=0"),
            format!("/api/owner/media/{provider}"),
        ] {
            let response = admitted(
                client,
                origin,
                &path,
                reqwest::Method::GET,
                session,
                binding,
                "reborn-workspace-v1",
            )
            .send()
            .await
            .map_err(|_| "packaged member media boundary read failed")?;
            if response.status().as_u16() != 403 {
                return Err("packaged private owner media admitted a member");
            }
        }
    }
    Ok(())
}

fn runtime_denied(pg: &str, database: &str, sql: &str) -> Result<()> {
    let output = Command::new("docker")
        .args([
            "exec",
            pg,
            "psql",
            "-X",
            "-U",
            "reborn_app",
            "-d",
            database,
            "-v",
            "ON_ERROR_STOP=1",
            "-v",
            "VERBOSITY=sqlstate",
            "-c",
            sql,
        ])
        .output()
        .map_err(|_| "runtime privilege check caller unavailable")?;
    if output.status.success()
        || output.stderr.len() > 1024
        || !output.stderr.windows(5).any(|bytes| bytes == b"42501")
    {
        return Err("runtime database privilege denial was not established");
    }
    Ok(())
}
async fn wait(client: &Client, origin: &str) -> Result<()> {
    let deadline = tokio::time::Instant::now() + Duration::from_secs(12);
    loop {
        if let Ok(r) = client.get(format!("{origin}/api/ready")).send().await
            && r.status().is_success()
        {
            return Ok(());
        }
        if tokio::time::Instant::now() >= deadline {
            return Err("packaged readiness deadline");
        }
        tokio::time::sleep(Duration::from_millis(100)).await;
    }
}
async fn start_pg(pg: &str, database: &str, root: &Path) -> Result<String> {
    docker(&[
        "run",
        "-d",
        "--name",
        pg,
        "--cidfile",
        &root.join(format!("{pg}.cid")).to_string_lossy(),
        "--label",
        "keida.reborn.fixture=recovery",
        "--memory",
        "768m",
        "--cpus",
        "1",
        "--pids-limit",
        "256",
        "--tmpfs",
        "/var/lib/postgresql/data:rw,size=512m",
        "-p",
        "127.0.0.1::5432",
        "-e",
        "POSTGRES_USER=reborn_fixture",
        "-e",
        "POSTGRES_PASSWORD=disposable-recovery-only",
        "-e",
        &format!("POSTGRES_DB={database}"),
        PG,
    ])?;
    let pg_info: Value = serde_json::from_slice(&docker(&["inspect", pg])?)
        .map_err(|_| "recovery PostgreSQL inspection rejected")?;
    let pg_port = pg_info[0]["NetworkSettings"]["Ports"]["5432/tcp"][0]["HostPort"]
        .as_str()
        .ok_or("private PostgreSQL port missing")?
        .to_owned();
    let mut ready = false;
    for _ in 0..100 {
        // The entrypoint's temporary initialization server uses only a Unix
        // socket. TCP becomes available after initialization has finished.
        if docker(&[
            "exec",
            pg,
            "pg_isready",
            "-h",
            "127.0.0.1",
            "-U",
            "reborn_fixture",
            "-d",
            database,
        ])
        .is_ok()
        {
            ready = true;
            break;
        }
        tokio::time::sleep(Duration::from_millis(100)).await;
    }
    if !ready {
        return Err("isolated PostgreSQL readiness failed");
    }
    Ok(pg_port)
}
pub(super) async fn rehearse(image: &str, out: &Path) -> Result<()> {
    directory(out)?;
    if !image
        .strip_prefix("sha256:")
        .is_some_and(|h| crate::digest(h, 64))
    {
        return Err("exact recovery image required");
    }
    let mut random = [0u8; 12];
    getrandom::fill(&mut random).map_err(|_| "recovery identity unavailable")?;
    let nonce = hex(&random);
    let root = std::env::temp_dir().join(format!("reborn-recovery-{nonce}"));
    private(&root)?;
    let mut scope = Scope {
        root,
        containers: Vec::new(),
    };
    let app_root = scope.root.join("app");
    private(&app_root)?;
    let restored_root = scope.root.join("restored");
    private(&restored_root)?;
    let owner = fs::metadata("/proc/self").map_err(|_| "recovery UID unavailable")?;
    let uid = owner.uid();
    let user = format!("{uid}:{}", owner.gid());
    let pg = format!("reborn-recovery-pg-{nonce}");
    scope.containers.push(pg.clone());
    let pg_port = start_pg(&pg, "first", &scope.root).await?;
    bootstrap_roles(&pg, "first")?;
    let dsn = format!("postgresql://reborn_app:disposable-app-only@127.0.0.1:{pg_port}/first");
    crate::write(&app_root.join("database.url"), dsn.as_bytes(), false)?;
    let migration_root = scope.root.join("migrator");
    private(&migration_root)?;
    let migration_file = migration_root.join("database.url");
    crate::write(
        &migration_file,
        format!("postgresql://reborn_migrator:disposable-migrator-only@127.0.0.1:{pg_port}/first")
            .as_bytes(),
        false,
    )?;
    let app_dsn = app_root.join("database.url");
    for (n, tail) in [
        ("migrate", vec!["migrate".to_string()]),
        (
            "key",
            vec![
                "init-key".to_string(),
                app_root.join("instance.key").to_string_lossy().into_owned(),
            ],
        ),
        (
            "owner",
            vec![
                "prepare-owner".to_string(),
                app_root.join("setup.token").to_string_lossy().into_owned(),
            ],
        ),
    ] {
        let name = format!("reborn-recovery-{n}-{nonce}");
        scope.containers.push(name.clone());
        invoke(
            app_args(
                image,
                &name,
                &app_root,
                port()?,
                if n == "migrate" {
                    &migration_file
                } else {
                    &app_dsn
                },
                &user,
            ),
            &tail.iter().map(String::as_str).collect::<Vec<_>>(),
        )?;
        if n == "migrate" {
            psql(
                &pg,
                "first",
                include_str!("../../../deploy/runtime-grants.sql"),
            )?;
        }
    }
    let first = format!("reborn-recovery-first-{nonce}");
    scope.containers.push(first.clone());
    let first_port = port()?;
    let mut args = app_args(
        image,
        &first,
        &app_root,
        first_port,
        &app_root.join("database.url"),
        &user,
    );
    args.insert(1, "-d".into());
    invoke(args, &["serve"])?;
    let origin = format!("http://127.0.0.1:{first_port}");
    let client = Client::builder()
        .no_proxy()
        .redirect(reqwest::redirect::Policy::none())
        .timeout(Duration::from_secs(5))
        .build()
        .map_err(|_| "recovery client unavailable")?;
    wait(&client, &origin).await?;
    let form_response = client
        .get(format!("{origin}/api/auth/form"))
        .send()
        .await
        .map_err(|_| "packaged form failed")?;
    let form_cookie = cookie(&form_response, "__Host-keida-reborn-form")?;
    let form = value(form_response, 200).await?;
    let setup = fs::read_to_string(app_root.join("setup.token"))
        .map_err(|_| "private setup unavailable")?;
    let password = format!("Fixture-private-{nonce}-password");
    let response = admitted(
        &client,
        &origin,
        "/api/auth/claim",
        reqwest::Method::POST,
        &form_cookie,
        form["csrf_token"]
            .as_str()
            .ok_or("private form binding missing")?,
        "reborn-auth-v1",
    )
    .json(&json!({"setup_secret":setup,"username":"recovery_owner","password":password}))
    .send()
    .await
    .map_err(|_| "packaged atomic owner claim failed")?;
    let session = cookie(&response, "__Host-keida-reborn-session")?;
    let claimed = value(response, 201).await?;
    let binding = claimed["csrf_token"]
        .as_str()
        .ok_or("packaged session binding missing")?;
    let member_password = format!("Private-notification-member-{nonce}");
    value(
        admitted(
            &client,
            &origin,
            "/api/owner/members",
            reqwest::Method::POST,
            &session,
            binding,
            "reborn-auth-v1",
        )
        .json(&json!({"username":"recovery_member","password":member_password}))
        .send()
        .await
        .map_err(|_| "recovery member enrollment failed")?,
        201,
    )
    .await?;
    let form_response = client
        .get(format!("{origin}/api/auth/form"))
        .header("X-Reborn-Product", "keida-hub-reborn")
        .header("X-Reborn-Contract", "reborn-auth-v1")
        .send()
        .await
        .map_err(|_| "member form failed")?;
    let member_form_cookie = cookie(&form_response, "__Host-keida-reborn-form")?;
    let member_form = value(form_response, 200).await?;
    let response = admitted(
        &client,
        &origin,
        "/api/auth/login",
        reqwest::Method::POST,
        &member_form_cookie,
        member_form["csrf_token"]
            .as_str()
            .ok_or("member form binding missing")?,
        "reborn-auth-v1",
    )
    .json(&json!({"username":"recovery_member","password":member_password}))
    .send()
    .await
    .map_err(|_| "recovery member login failed")?;
    let member_session = cookie(&response, "__Host-keida-reborn-session")?;
    let member_login = value(response, 200).await?;
    let member_binding = member_login["csrf_token"]
        .as_str()
        .ok_or("member binding missing")?;
    let owner_panels = json!([
        {"id":"pins","visible":true},
        {"id":"note","visible":false},
        {"id":"connections","visible":true}
    ]);
    let owner_layout = json!({"revision":"1","panels":owner_panels});
    let saved = save_layout(&client, &origin, &session, binding, "0", &owner_panels).await?;
    if saved["account"] != claimed["account"] || saved["layout"] != owner_layout {
        return Err("packaged owner layout receipt differs");
    }
    // The member has no saved row yet: the owner's private arrangement must not
    // replace its canonical default or create a shared notification.
    let member_default = value(
        admitted(
            &client,
            &origin,
            "/api/workspace/snapshot",
            reqwest::Method::GET,
            &member_session,
            member_binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "packaged member default layout failed")?,
        200,
    )
    .await?;
    if member_default["layout"]
        != json!({"revision":"0","panels":[
            {"id":"note","visible":true},
            {"id":"connections","visible":true},
            {"id":"pins","visible":true}
        ]})
        || member_default["notifications"]["unread_groups"] != 0
    {
        return Err("owner layout leaked into member defaults or notifications");
    }
    let member_panels = json!([
        {"id":"connections","visible":false},
        {"id":"pins","visible":true},
        {"id":"note","visible":true}
    ]);
    let member_layout = json!({"revision":"1","panels":member_panels});
    let saved = save_layout(
        &client,
        &origin,
        &member_session,
        member_binding,
        "0",
        &member_panels,
    )
    .await?;
    if saved["account"] != member_login["account"] || saved["layout"] != member_layout {
        return Err("packaged member layout receipt differs");
    }
    let provider = reborn_crafty_fixture::Crafty::start().await?;
    let enrollment = json!({"base_revision":"0","connection":{"endpoint":provider.origin,"token":reborn_crafty_fixture::TOKEN,"ca_pem":provider.ca,"timezone":"UTC","servers":[{"id":reborn_crafty_fixture::ID,"name":"Restorable dedicated fixture","join":"play.example:25565"}]}});
    value(
        admitted(
            &client,
            &origin,
            "/api/owner/crafty",
            reqwest::Method::PUT,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .json(&enrollment)
        .send()
        .await
        .map_err(|_| "packaged encrypted enrollment failed")?,
        200,
    )
    .await?;
    let media_provider = reborn_crafty_fixture::media::Media::start().await?;
    let mut initial_media = Vec::new();
    for provider in ["jellyfin", "seerr"] {
        let enrolled = enroll_media(
            &client,
            &origin,
            &session,
            binding,
            provider,
            "0",
            &media_provider,
        )
        .await?;
        if enrolled != json!({"revision":"1","configured":true}) {
            return Err("initial packaged media enrollment receipt differs");
        }
        let page = media_page(&client, &origin, &session, binding, provider).await?;
        assert_media(&page, provider, "1", false, &media_provider)?;
        if page["account"] != claimed["account"] {
            return Err("initial packaged media account differs");
        }
        initial_media.push((provider, page));
    }
    let media_requests = media_provider.requests().len();
    member_media_denied(&client, &origin, &member_session, member_binding).await?;
    if media_provider.requests().len() != media_requests {
        return Err("member media rejection performed provider IO");
    }
    value(
        admitted(
            &client,
            &origin,
            "/api/workspace/note",
            reqwest::Method::PUT,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .json(&json!({"base_revision":"0","body":"A committed note to restore 海"}))
        .send()
        .await
        .map_err(|_| "packaged saved note failed")?,
        200,
    )
    .await?;
    let enrolled = value(admitted(&client, &origin, "/api/owner/directory", reqwest::Method::PUT, &session, binding, "reborn-workspace-v1")
        .json(&json!({"base_revision":"0","change":{"action":"create","link":{"name":"Restorable library","category":"Media","description":"A deliberate fixture link","url":"https://services.example/library"}}}))
        .send().await.map_err(|_|"packaged directory enrollment failed")?,200).await?;
    let service_id = enrolled["directory"]["services"][0]["id"]
        .as_str()
        .ok_or("packaged service identity missing")?;
    value(
        admitted(
            &client,
            &origin,
            "/api/workspace/pins",
            reqwest::Method::PUT,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .json(&json!({"base_directory_revision":"1","base_revision":"0","ids":[service_id]}))
        .send()
        .await
        .map_err(|_| "packaged personal pins failed")?,
        200,
    )
    .await?;
    let initial = value(
        admitted(
            &client,
            &origin,
            "/api/workspace/snapshot",
            reqwest::Method::GET,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "packaged overview failed")?,
        200,
    )
    .await?;
    if initial["crafty"]["servers"][0]["players"] != 0
        || initial["layout"] != owner_layout
        || initial.get("media").is_some()
        || initial_media
            .iter()
            .any(|(_, page)| page["session_generation"] != initial["session_generation"])
    {
        return Err("packaged dedicated decryption/GET failed");
    }
    let initial_activity = value(
        admitted(
            &client,
            &origin,
            "/api/workspace/activity",
            reqwest::Method::GET,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "initial Activity read failed")?,
        200,
    )
    .await?;
    if initial_activity["entries"]
        .as_array()
        .is_none_or(|v| v.len() != 4)
    {
        return Err("initial Activity actions missing");
    }
    value(
        admitted(
            &client,
            &origin,
            "/api/workspace/notifications/read",
            reqwest::Method::PUT,
            &member_session,
            member_binding,
            "reborn-workspace-v1",
        )
        .json(&json!({"category":"services","through":"1"}))
        .send()
        .await
        .map_err(|_| "initial notification read failed")?,
        200,
    )
    .await?;
    let member_initial = value(
        admitted(
            &client,
            &origin,
            "/api/workspace/snapshot",
            reqwest::Method::GET,
            &member_session,
            member_binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "initial member notifications failed")?,
        200,
    )
    .await?;
    let initial_groups = &member_initial["notifications"]["groups"];
    if member_initial["notifications"]["unread_groups"] != 1
        || member_initial["layout"] != member_layout
        || initial_groups.as_array().is_none_or(|g| g.len() != 2)
        || initial_groups[0]["category"] != "connections"
        || initial_groups[0]["revision"] != "1"
        || initial_groups[0]["read_through"] != "0"
        || initial_groups[1]["category"] != "services"
        || initial_groups[1]["read_through"] != "1"
    {
        return Err("initial grouped notifications/read markers missing");
    }
    let observed_requests = provider.requests().len();
    let initial_observations = observation_page(&client, &origin, &session, binding).await?;
    let initial_samples = initial_observations["entries"]
        .as_array()
        .filter(|entries| !entries.is_empty())
        .ok_or("actual packaged provider sample was not retained")?;
    let initial_sample = &initial_samples[0];
    if initial_observations["account"] != claimed["account"]
        || initial_observations["session_generation"] != initial["session_generation"]
        || initial_observations["current_revision"] != "1"
        || initial_sample["revision"] != "1"
        || initial_sample["complete"] != true
        || !initial_sample["error"].is_null()
        || initial_sample["checked_at"].as_str().is_none()
        || initial_sample["servers"]
            .as_array()
            .is_none_or(|v| v.len() != 1)
        || initial_sample["servers"][0]["name"] != "Restorable dedicated fixture"
        || initial_sample["servers"][0]["state"] != "running"
        || initial_sample["servers"][0]["players"] != 0
        || initial_sample["servers"][0]["capacity"] != 20
        || initial_sample["servers"][0]["freshness"] != "fresh"
        || initial_sample["servers"][0]["provider_at"]
            .as_str()
            .is_none()
        || initial_sample["servers"][0]["collected_at"]
            .as_str()
            .is_none()
    {
        return Err("retained packaged zero observation differs from the TLS provider");
    }
    let encoded_history = serde_json::to_string(&initial_observations)
        .map_err(|_| "packaged observation history encoding failed")?;
    if [
        reborn_crafty_fixture::TOKEN,
        reborn_crafty_fixture::ID,
        provider.origin.as_str(),
        provider.ca.as_str(),
        "BEGIN CERTIFICATE",
        "ca_pem",
        "play.example:25565",
        "/private/provider-path",
        "Unreviewed provider metadata",
        "sample_id",
    ]
    .iter()
    .any(|value| encoded_history.contains(value))
    {
        return Err("packaged observation history retained non-allowlisted metadata");
    }
    let member_observations =
        observation_page(&client, &origin, &member_session, member_binding).await?;
    if member_observations["account"] != member_login["account"]
        || member_observations["entries"] != initial_observations["entries"]
        || provider.requests().len() != observed_requests
    {
        return Err("configured member history differs or history performed provider IO");
    }
    docker(&["stop", "--time", "5", &first])?;
    let dump = scope.root.join("database.dump");
    let dump_file = std::fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .mode(0o600)
        .open(&dump)
        .map_err(|_| "private dump creation failed")?;
    use std::os::unix::fs::OpenOptionsExt;
    let status = Command::new("docker")
        .args([
            "exec",
            &pg,
            "pg_dump",
            "-U",
            "reborn_migrator",
            "-d",
            "first",
            "--format=custom",
            "--no-owner",
            "--no-privileges",
        ])
        .stdout(dump_file)
        .stderr(Stdio::null())
        .status()
        .map_err(|_| "consistent dump caller unavailable")?;
    if !status.success() {
        return Err("consistent dump failed");
    }
    let key_before = hash(&app_root.join("instance.key"))?;
    let dump_sha = hash(&dump)?;
    fs::copy(
        app_root.join("instance.key"),
        restored_root.join("instance.key"),
    )
    .map_err(|_| "matched private key restore failed")?;
    fs::set_permissions(
        restored_root.join("instance.key"),
        fs::Permissions::from_mode(0o600),
    )
    .map_err(|_| "matched key permissions failed")?;
    let restore_pg = format!("reborn-recovery-restore-pg-{nonce}");
    scope.containers.push(restore_pg.clone());
    let restore_pg_port = start_pg(&restore_pg, "restored", &scope.root).await?;
    bootstrap_roles(&restore_pg, "restored")?;
    crate::write(
        &restored_root.join("database.url"),
        format!("postgresql://reborn_app:disposable-app-only@127.0.0.1:{restore_pg_port}/restored")
            .as_bytes(),
        false,
    )?;
    let status = Command::new("docker")
        .args([
            "exec",
            "-i",
            &restore_pg,
            "pg_restore",
            "-U",
            "reborn_migrator",
            "-d",
            "restored",
            "--no-owner",
            "--no-privileges",
            "--exit-on-error",
        ])
        .stdin(fs::File::open(&dump).map_err(|_| "matched dump unavailable")?)
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()
        .map_err(|_| "isolated restore caller unavailable")?;
    if !status.success() {
        return Err("isolated PostgreSQL restore failed");
    }
    psql(
        &restore_pg,
        "restored",
        include_str!("../../../deploy/runtime-grants.sql"),
    )?;
    for sql in [
        "ALTER TABLE users ADD COLUMN runtime_must_not_ddl integer",
        "ALTER TABLE dashboard_layouts ADD COLUMN runtime_must_not_ddl integer",
        "DELETE FROM dashboard_layouts",
        "ALTER TABLE provider_observations ADD COLUMN runtime_must_not_ddl integer",
        "UPDATE provider_observations SET checked_at=checked_at WHERE id=1",
        "UPDATE provider_server_observations SET players=players WHERE batch_id=1",
        "DELETE FROM provider_server_observations WHERE batch_id=1",
        "ALTER TABLE media_connections ADD COLUMN runtime_must_not_ddl integer",
        "DELETE FROM media_connections WHERE provider='jellyfin'",
        "INSERT INTO media_connections (provider,revision,sealed) VALUES ('jellyfin',0,NULL)",
        "UPDATE media_connections SET provider=provider WHERE provider='jellyfin'",
        "UPDATE activity_events SET revision=revision WHERE id=1",
        "DELETE FROM activity_events WHERE id=1",
        "UPDATE _sqlx_migrations SET success=success WHERE version=1",
    ] {
        runtime_denied(&restore_pg, "restored", sql)?;
    }
    let restored = format!("reborn-recovery-restored-{nonce}");
    scope.containers.push(restored.clone());
    let restored_port = port()?;
    let mut args = app_args(
        image,
        &restored,
        &restored_root,
        restored_port,
        &restored_root.join("database.url"),
        &user,
    );
    args.insert(1, "-d".into());
    invoke(args, &["serve"])?;
    let origin = format!("http://127.0.0.1:{restored_port}");
    wait(&client, &origin).await?;
    // Read retained data before requesting a new provider collection. A later
    // minute's demand sample must not disguise missing restored history.
    let restored_requests = provider.requests().len();
    let restored_observations = observation_page(&client, &origin, &session, binding).await?;
    if restored_observations != initial_observations
        || provider.requests().len() != restored_requests
    {
        return Err("matched observation restore differs or history performed provider IO");
    }
    let retained = value(
        admitted(
            &client,
            &origin,
            "/api/workspace/snapshot",
            reqwest::Method::GET,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "restored native session failed")?,
        200,
    )
    .await?;
    if retained["account"]["username"] != "recovery_owner"
        || retained["note"] != json!({"body":"A committed note to restore 海","revision":"1"})
        || retained["crafty"]["servers"][0]["players"] != 0
        || retained["directory"] != initial["directory"]
        || retained["layout"] != owner_layout
        || hash(&restored_root.join("instance.key"))? != key_before
        || retained.get("media").is_some()
    {
        return Err("matched auth/note/secret restore rejected");
    }
    // The new process has no media cache. Real HTTPS observations therefore
    // exercise both restored envelopes with the matched key and provider domain.
    let requests_before_media_restore = media_provider.requests().len();
    for (provider, initial_page) in &initial_media {
        if media_status(&client, &origin, &session, binding, provider).await?
            != json!({"revision":"1","configured":true})
        {
            return Err("restored encrypted media enrollment status differs");
        }
        let page = media_page(&client, &origin, &session, binding, provider).await?;
        assert_media(&page, provider, "1", false, &media_provider)?;
        if page["account"] != claimed["account"]
            || page["session_generation"] != retained["session_generation"]
            || page["observation"]["items"] != initial_page["observation"]["items"]
            || page["observation"]["playback"] != initial_page["observation"]["playback"]
        {
            return Err("restored useful owner media observations differ");
        }
    }
    if media_provider.requests().len() <= requests_before_media_restore {
        return Err("restored media observations did not exercise actual HTTPS");
    }
    let restored_media_requests = media_provider.requests().len();
    member_media_denied(&client, &origin, &member_session, member_binding).await?;
    if media_provider.requests().len() != restored_media_requests {
        return Err("restored member media rejection performed provider IO");
    }
    let restored_activity = value(
        admitted(
            &client,
            &origin,
            "/api/workspace/activity",
            reqwest::Method::GET,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "restored Activity read failed")?,
        200,
    )
    .await?;
    if restored_activity != initial_activity {
        return Err("restored Activity differs");
    }
    let member_restored = value(
        admitted(
            &client,
            &origin,
            "/api/workspace/snapshot",
            reqwest::Method::GET,
            &member_session,
            member_binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "restored member notifications failed")?,
        200,
    )
    .await?;
    if member_restored["notifications"] != member_initial["notifications"]
        || member_restored["layout"] != member_layout
    {
        return Err("restored notification/read or personal layout state differs");
    }
    let newer_owner_panels = json!([
        {"id":"connections","visible":true},
        {"id":"note","visible":true},
        {"id":"pins","visible":false}
    ]);
    let newer_owner_layout = json!({"revision":"2","panels":newer_owner_panels});
    let saved = save_layout(
        &client,
        &origin,
        &session,
        binding,
        "1",
        &newer_owner_panels,
    )
    .await?;
    if saved["account"] != claimed["account"] || saved["layout"] != newer_owner_layout {
        return Err("newer owner layout receipt differs");
    }
    let newer_member_panels = json!([
        {"id":"note","visible":false},
        {"id":"connections","visible":false},
        {"id":"pins","visible":true}
    ]);
    let newer_member_layout = json!({"revision":"2","panels":newer_member_panels});
    let saved = save_layout(
        &client,
        &origin,
        &member_session,
        member_binding,
        "1",
        &newer_member_panels,
    )
    .await?;
    if saved["account"] != member_login["account"] || saved["layout"] != newer_member_layout {
        return Err("newer member layout receipt differs");
    }
    value(
        admitted(
            &client,
            &origin,
            "/api/workspace/notifications/read",
            reqwest::Method::PUT,
            &member_session,
            member_binding,
            "reborn-workspace-v1",
        )
        .json(&json!({"category":"connections","through":"1"}))
        .send()
        .await
        .map_err(|_| "newer read marker failed")?,
        200,
    )
    .await?;
    value(
        admitted(
            &client,
            &origin,
            "/api/workspace/note",
            reqwest::Method::PUT,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .json(&json!({"base_revision":"1","body":"Newer accepted writes must survive recovery"}))
        .send()
        .await
        .map_err(|_| "newer restored write failed")?,
        200,
    )
    .await?;
    value(
        admitted(
            &client,
            &origin,
            "/api/workspace/pins",
            reqwest::Method::PUT,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .json(&json!({"base_directory_revision":"1","base_revision":"1","ids":[]}))
        .send()
        .await
        .map_err(|_| "newer personal pin write failed")?,
        200,
    )
    .await?;
    // A deliberately replaced fixture enrollment gives the newer sample its
    // own revision without waiting for, or weakening, the per-minute bound.
    provider.mode(reborn_crafty_fixture::NO_PLAYERS);
    let mut newer_enrollment = enrollment.clone();
    newer_enrollment["base_revision"] = json!("1");
    newer_enrollment["connection"]["servers"][0]["name"] = json!("Newer retained fixture");
    value(
        admitted(
            &client,
            &origin,
            "/api/owner/crafty",
            reqwest::Method::PUT,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .json(&newer_enrollment)
        .send()
        .await
        .map_err(|_| "newer observation enrollment failed")?,
        200,
    )
    .await?;
    let newer_snapshot = value(
        admitted(
            &client,
            &origin,
            "/api/workspace/snapshot",
            reqwest::Method::GET,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "newer actual provider sample failed")?,
        200,
    )
    .await?;
    let newer_observations = observation_page(&client, &origin, &session, binding).await?;
    let newer_samples = newer_observations["entries"]
        .as_array()
        .ok_or("newer retained observation page absent")?;
    if newer_snapshot["crafty"]["revision"] != "2"
        || !newer_snapshot["crafty"]["servers"][0]["players"].is_null()
        || newer_observations["current_revision"] != "2"
        || newer_samples.len() <= initial_samples.len()
        || newer_samples[0]["revision"] != "2"
        || newer_samples[0]["complete"] != false
        || newer_samples[0]["servers"][0]["name"] != "Newer retained fixture"
        || !newer_samples[0]["servers"][0]["players"].is_null()
        || newer_samples[0]["servers"][0]["state"] != "running"
        || initial_samples
            .iter()
            .any(|old| !newer_samples.iter().any(|entry| entry == old))
    {
        return Err("newer real unknown-player observation was not retained beside old data");
    }
    value(
        admitted(
            &client,
            &origin,
            "/api/owner/crafty",
            reqwest::Method::PUT,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .json(&json!({"base_revision":"2","connection":null}))
        .send()
        .await
        .map_err(|_| "newer shared connection change failed")?,
        200,
    )
    .await?;
    // Replace both media envelopes after the backup. A new revision invalidates
    // their previous sample pages, and actual empty responses remain observed
    // zero rather than an unavailable provider masquerading as no results.
    media_provider.mode(reborn_crafty_fixture::media::EMPTY);
    for provider in ["jellyfin", "seerr"] {
        let enrolled = enroll_media(
            &client,
            &origin,
            &session,
            binding,
            provider,
            "1",
            &media_provider,
        )
        .await?;
        if enrolled != json!({"revision":"2","configured":true}) {
            return Err("newer packaged media enrollment receipt differs");
        }
        let page = media_page(&client, &origin, &session, binding, provider).await?;
        assert_media(&page, provider, "2", true, &media_provider)?;
    }
    let failed = format!("reborn-recovery-failed-{nonce}");
    scope.containers.push(failed.clone());
    let mut args = app_args(
        image,
        &failed,
        &restored_root,
        port()?,
        &restored_root.join("database.url"),
        &user,
    );
    let at = args.len() - 1;
    args.splice(at..at, ["-e".into(), "REBORN_DB_MAX_CONNECTIONS=0".into()]);
    if invoke(args, &["serve"]).is_ok() {
        return Err("invalid candidate unexpectedly started");
    }
    let preserved = value(
        admitted(
            &client,
            &origin,
            "/api/workspace/snapshot",
            reqwest::Method::GET,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "retained current writer failed")?,
        200,
    )
    .await?;
    if preserved["note"]
        != json!({"body":"Newer accepted writes must survive recovery","revision":"2"})
        || hash(&dump)? != dump_sha
        || preserved["directory"]["pins"] != json!([])
        || preserved["directory"]["pins_revision"] != "2"
        || preserved["directory"]["services"] != initial["directory"]["services"]
        || preserved["layout"] != newer_owner_layout
    {
        return Err("failed candidate lost newer accepted writes");
    }
    let current_activity = value(
        admitted(
            &client,
            &origin,
            "/api/workspace/activity",
            reqwest::Method::GET,
            &session,
            binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "newer Activity read failed")?,
        200,
    )
    .await?;
    let entries = current_activity["entries"]
        .as_array()
        .ok_or("newer Activity absent")?;
    if entries.len() != 8
        || entries[0]["kind"] != "connection_removed"
        || entries[0]["revision"] != "3"
        || entries[1]["kind"] != "connection_saved"
        || entries[1]["revision"] != "2"
        || entries[2]["kind"] != "pins_saved"
        || entries[2]["revision"] != "2"
        || entries[3]["kind"] != "note_saved"
        || entries[3]["revision"] != "2"
        || entries[4..]
            != *initial_activity["entries"]
                .as_array()
                .ok_or("initial Activity absent")?
    {
        return Err("failed candidate lost newer Activity");
    }
    let member_preserved = value(
        admitted(
            &client,
            &origin,
            "/api/workspace/snapshot",
            reqwest::Method::GET,
            &member_session,
            member_binding,
            "reborn-workspace-v1",
        )
        .send()
        .await
        .map_err(|_| "newer member read failed")?,
        200,
    )
    .await?;
    let groups = &member_preserved["notifications"]["groups"];
    if member_preserved["notifications"]["unread_groups"] != 1
        || member_preserved["layout"] != newer_member_layout
        || groups[0]["revision"] != "3"
        || groups[0]["read_through"] != "1"
        || groups[0]["unread"] != "2"
        || groups[1] != member_initial["notifications"]["groups"][1]
        || preserved["crafty"]["configured"] != false
        || preserved["crafty"]["revision"] != "3"
    {
        return Err("failed candidate lost newer notifications/read state");
    }
    let archived_requests = provider.requests().len();
    let archived = observation_page(&client, &origin, &session, binding).await?;
    let member_removed =
        observation_page(&client, &origin, &member_session, member_binding).await?;
    if archived["current_revision"] != "3"
        || archived["entries"] != newer_observations["entries"]
        || archived["through"] != newer_observations["through"]
        || member_removed["current_revision"] != "3"
        || member_removed["entries"] != json!([])
        || provider.requests().len() != archived_requests
    {
        return Err("failed candidate lost newer observations or removed member scope");
    }
    let through = newer_observations["through"]
        .as_str()
        .and_then(|v| v.parse::<u64>().ok())
        .ok_or("newer observation window absent")?;
    let stale_cursor = admitted(
        &client,
        &origin,
        &format!("/api/workspace/observations?revision=2&through={through}"),
        reqwest::Method::GET,
        &session,
        binding,
        "reborn-workspace-v1",
    )
    .send()
    .await
    .map_err(|_| "obsolete history window check failed")?;
    if stale_cursor.status().as_u16() != 409 {
        return Err("changed enrollment admitted an obsolete observation window");
    }
    if provider
        .requests()
        .iter()
        .any(|(method, _)| method != "GET")
    {
        return Err("recovery observer attempted mutation");
    }
    // A cache surviving in the current writer is not durable recovery evidence.
    // Restart only this owned disposable writer and decrypt its newer envelopes
    // again, without replacing current data by the older recovery dump.
    docker(&["restart", "--time", "5", &restored])?;
    wait(&client, &origin).await?;
    let requests_before_newer_media = media_provider.requests().len();
    for provider in ["jellyfin", "seerr"] {
        if media_status(&client, &origin, &session, binding, provider).await?
            != json!({"revision":"2","configured":true})
        {
            return Err("failed candidate lost newer encrypted media enrollment");
        }
        let page = media_page(&client, &origin, &session, binding, provider).await?;
        assert_media(&page, provider, "2", true, &media_provider)?;
        if page["account"] != claimed["account"]
            || page["session_generation"] != retained["session_generation"]
        {
            return Err("restarted newer media authority envelope differs");
        }
    }
    if media_provider.requests().len() <= requests_before_newer_media
        || media_provider.requests().iter().any(|(method, path)| {
            method != "GET" || path.contains(reborn_crafty_fixture::media::TOKEN)
        })
    {
        return Err("newer media recovery skipped HTTPS or attempted credentialed query/effect");
    }
    let final_media_requests = media_provider.requests().len();
    member_media_denied(&client, &origin, &member_session, member_binding).await?;
    if media_provider.requests().len() != final_media_requests || hash(&dump)? != dump_sha {
        return Err("newer media recovery changed old backup or admitted member IO");
    }
    let report = json!({"format":1,"product":"keida-hub-reborn","image_id":image,"database_schema":10,"fresh_private_claim":true,"restored_native_session_note_and_encrypted_connection":true,"restored_directory_and_personal_pins":true,"restored_activity_and_newer_entries":true,"restored_notifications_and_read_state":true,"restored_personal_layout_and_newer_edits":true,"restored_provider_observations_and_newer_samples":true,"restored_media_connections_and_observations":true,"failed_candidate_preserved_newer_writes":true,"automatic_old_backup_restore":false,"dump_sha256":dump_sha,"separate_postgresql_instance":true,"runtime_role_cannot_migrate":true,"fixture_only":true});
    crate::write(
        &out.join("recovery-proof.json"),
        &serde_json::to_vec(&report).map_err(|_| "recovery proof encoding failed")?,
        true,
    )?;
    println!(
        "Packaged recovery rehearsal passed: fresh install, matched PostgreSQL/key restore, secret decryption and newer-write preservation"
    );
    Ok(())
}

fn psql(pg: &str, database: &str, sql: &str) -> Result<()> {
    use std::io::Write;
    let mut child = Command::new("docker")
        .args([
            "exec",
            "-i",
            pg,
            "psql",
            "-U",
            "reborn_fixture",
            "-d",
            database,
            "--no-psqlrc",
            "-v",
            "ON_ERROR_STOP=1",
            "--quiet",
        ])
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|_| "private role bootstrap caller unavailable")?;
    let input = child
        .stdin
        .take()
        .ok_or("private bootstrap input unavailable")?
        .write_all(sql.as_bytes());
    if input.is_err() {
        let _ = child.kill();
        let _ = child.wait();
        return Err("private bootstrap input failed");
    }
    if !child
        .wait()
        .map_err(|_| "private bootstrap wait failed")?
        .success()
    {
        return Err("private role bootstrap failed");
    }
    Ok(())
}
fn bootstrap_roles(pg: &str, database: &str) -> Result<()> {
    if !matches!(database, "first" | "restored") {
        return Err("fixture database name rejected");
    }
    psql(
        pg,
        "postgres",
        &format!(
            "CREATE ROLE reborn_migrator LOGIN PASSWORD 'disposable-migrator-only'; CREATE ROLE reborn_app LOGIN PASSWORD 'disposable-app-only'; ALTER DATABASE {database} OWNER TO reborn_migrator; REVOKE ALL ON DATABASE {database} FROM PUBLIC; GRANT CONNECT ON DATABASE {database} TO reborn_app;"
        ),
    )?;
    psql(
        pg,
        database,
        "ALTER SCHEMA public OWNER TO reborn_migrator; REVOKE ALL ON SCHEMA public FROM PUBLIC;",
    )
}
