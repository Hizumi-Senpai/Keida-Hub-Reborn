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
    if initial["crafty"]["servers"][0]["players"] != 0 {
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
        "UPDATE activity_events SET revision=revision WHERE id=1",
        "DELETE FROM activity_events WHERE id=1",
        "UPDATE _sqlx_migrations SET success=success WHERE version=1",
    ] {
        if docker(&[
            "exec",
            &restore_pg,
            "psql",
            "-U",
            "reborn_app",
            "-d",
            "restored",
            "-v",
            "ON_ERROR_STOP=1",
            "-c",
            sql,
        ])
        .is_ok()
        {
            return Err("runtime database role gained migration authority");
        }
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
        || hash(&restored_root.join("instance.key"))? != key_before
    {
        return Err("matched auth/note/secret restore rejected");
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
    if entries.len() != 6
        || entries[0]["kind"] != "pins_saved"
        || entries[0]["revision"] != "2"
        || entries[1]["kind"] != "note_saved"
        || entries[1]["revision"] != "2"
        || entries[2..]
            != *initial_activity["entries"]
                .as_array()
                .ok_or("initial Activity absent")?
    {
        return Err("failed candidate lost newer Activity");
    }
    if provider
        .requests()
        .iter()
        .any(|(method, _)| method != "GET")
    {
        return Err("recovery observer attempted mutation");
    }
    let report = json!({"format":1,"product":"keida-hub-reborn","image_id":image,"database_schema":6,"fresh_private_claim":true,"restored_native_session_note_and_encrypted_connection":true,"restored_directory_and_personal_pins":true,"restored_activity_and_newer_entries":true,"failed_candidate_preserved_newer_writes":true,"automatic_old_backup_restore":false,"dump_sha256":dump_sha,"separate_postgresql_instance":true,"runtime_role_cannot_migrate":true,"fixture_only":true});
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
