use crate::{Check, check, driver::Browser};
use axum::{
    Router,
    body::{Body, to_bytes},
    extract::{Request, State},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use reqwest::Client;
use sqlx::{Connection, PgConnection};
use std::{
    fs, io,
    net::SocketAddr,
    os::unix::fs::PermissionsExt,
    path::{Path, PathBuf},
    process::{Child, Command, Stdio},
    sync::{
        Arc, Mutex,
        atomic::{AtomicBool, AtomicU64, Ordering},
    },
    time::Duration,
};
use tokio::{
    io::{AsyncReadExt, AsyncWriteExt},
    net::{TcpListener, TcpStream},
    sync::{Notify, Semaphore},
    task::{JoinHandle, JoinSet},
};
use tokio_rustls::{
    TlsAcceptor,
    rustls::{
        self,
        pki_types::{CertificateDer, PrivateKeyDer, pem::PemObject},
    },
    server::TlsStream,
};

/// A closed test transport: Chrome can CONNECT only the synthetic Discord
/// authority. It never resolves a destination or forwards arbitrary requests.
struct DiscordProxy {
    address: SocketAddr,
    task: JoinHandle<()>,
}
impl DiscordProxy {
    async fn start(target: SocketAddr) -> Check<Self> {
        check(
            target.ip().is_loopback() && target.port() != 0,
            "closed Discord proxy target",
        )?;
        let listener = TcpListener::bind("127.0.0.1:0")
            .await
            .map_err(|_| "Discord browser proxy listener")?;
        let address = listener
            .local_addr()
            .map_err(|_| "Discord browser proxy address")?;
        let task = tokio::spawn(async move {
            let permits = Arc::new(Semaphore::new(16));
            let mut bridges = JoinSet::new();
            loop {
                tokio::select! {
                    accepted = listener.accept() => {
                        let Ok((mut incoming, _)) = accepted else { break };
                        let Ok(permit) = permits.clone().try_acquire_owned() else { continue };
                        bridges.spawn(async move {
                            let _permit = permit;
                            let _ = tokio::time::timeout(Duration::from_secs(15), async {
                                let mut preface = Vec::with_capacity(1024);
                                tokio::time::timeout(Duration::from_secs(2), async {
                                    while preface.len() < 4096 && !preface.ends_with(b"\r\n\r\n") {
                                        preface.push(incoming.read_u8().await.map_err(|_| ())?);
                                    }
                                    Ok::<(), ()>(())
                                }).await.map_err(|_| ())??;
                                let preface = std::str::from_utf8(&preface).map_err(|_| ())?;
                                if !preface.ends_with("\r\n\r\n") || !preface.is_ascii() {
                                    return Err(());
                                }
                                let mut lines = preface.split("\r\n");
                                if lines.next() != Some("CONNECT discord.com:443 HTTP/1.1") {
                                    return Err(());
                                }
                                let mut host = false;
                                for line in lines.filter(|line| !line.is_empty()) {
                                    let Some((name, value)) = line.split_once(':') else { return Err(()) };
                                    if name.eq_ignore_ascii_case("host") {
                                        if host || value.trim() != "discord.com:443" { return Err(()) }
                                        host = true;
                                    } else if !["proxy-connection", "user-agent"].iter().any(|allowed| name.eq_ignore_ascii_case(allowed)) {
                                        return Err(());
                                    }
                                }
                                if !host { return Err(()) }
                                let mut upstream = TcpStream::connect(target).await.map_err(|_| ())?;
                                incoming.write_all(b"HTTP/1.1 200 Connection Established\r\n\r\n").await.map_err(|_| ())?;
                                tokio::io::copy_bidirectional(&mut incoming, &mut upstream).await.map_err(|_| ())?;
                                Ok::<(), ()>(())
                            }).await;
                        });
                    }
                    _ = bridges.join_next(), if !bridges.is_empty() => {}
                }
            }
        });
        Ok(Self { address, task })
    }
}
impl Drop for DiscordProxy {
    fn drop(&mut self) {
        self.task.abort();
    }
}

pub struct Hold {
    pub entered: Notify,
    pub release: Notify,
}
struct Proxy {
    upstream: String,
    client: Client,
    hold: Mutex<Option<(&'static str, Arc<Hold>)>>,
    pub reads: AtomicU64,
    pub writes: AtomicU64,
    callback_requests: AtomicU64,
    callback_auth_cookie: AtomicBool,
}
struct TlsListener {
    listener: TcpListener,
    acceptor: TlsAcceptor,
}
impl axum::serve::Listener for TlsListener {
    type Io = TlsStream<TcpStream>;
    type Addr = SocketAddr;
    async fn accept(&mut self) -> (Self::Io, Self::Addr) {
        loop {
            if let Ok((stream, address)) = self.listener.accept().await {
                if let Ok(Ok(tls)) =
                    tokio::time::timeout(Duration::from_secs(5), self.acceptor.accept(stream)).await
                {
                    return (tls, address);
                }
            } else {
                tokio::time::sleep(Duration::from_millis(50)).await;
            }
        }
    }
    fn local_addr(&self) -> io::Result<Self::Addr> {
        self.listener.local_addr()
    }
}
async fn forward(State(proxy): State<Arc<Proxy>>, request: Request) -> Response {
    let path = request.uri().path();
    if path == "/account/discord/callback" {
        proxy.callback_requests.fetch_add(1, Ordering::SeqCst);
        if request
            .headers()
            .get("cookie")
            .and_then(|v| v.to_str().ok())
            .is_some_and(|v| {
                v.split(';')
                    .any(|v| v.trim().starts_with("__Host-keida-reborn-session="))
            })
        {
            proxy.callback_auth_cookie.store(true, Ordering::SeqCst);
        }
    }
    if path == "/api/workspace/snapshot" {
        proxy.reads.fetch_add(1, Ordering::SeqCst);
    }
    if matches!(
        path,
        "/api/workspace/note"
            | "/api/owner/directory"
            | "/api/workspace/pins"
            | "/api/workspace/notifications/read"
            | "/api/workspace/layout"
            | "/api/workspace/discord/review"
            | "/api/workspace/discord/confirm"
            | "/api/workspace/discord/cancel"
            | "/api/workspace/discord/unlink"
    ) || (request.method() == axum::http::Method::PUT
        && matches!(
            path,
            "/api/owner/media/jellyfin"
                | "/api/owner/media/seerr"
                | "/api/owner/queues/sonarr"
                | "/api/owner/queues/radarr"
                | "/api/owner/queues/qbittorrent"
                | "/api/owner/discord/application"
        ))
    {
        proxy.writes.fetch_add(1, Ordering::SeqCst);
    }
    let hold = {
        let mut held = proxy.hold.lock().expect("private fixture mutex");
        if held.as_ref().is_some_and(|(target, _)| *target == path) {
            held.take().map(|(_, h)| h)
        } else {
            None
        }
    };
    let result = async {
        let (parts, body) = request.into_parts();
        let body = to_bytes(body, 8192).await.map_err(|_| ())?;
        let mut headers = parts.headers;
        for name in ["host", "connection", "content-length", "transfer-encoding"] {
            headers.remove(name);
        }
        let response = proxy
            .client
            .request(parts.method, format!("{}{}", proxy.upstream, parts.uri))
            .headers(headers)
            .body(body)
            .send()
            .await
            .map_err(|_| ())?;
        let status = response.status();
        let mut headers = response.headers().clone();
        for name in ["connection", "content-length", "transfer-encoding"] {
            headers.remove(name);
        }
        let body = response.bytes().await.map_err(|_| ())?;
        if body.len() > 1024 * 1024 {
            return Err(());
        }
        if status == StatusCode::OK
            && let Some(held) = hold
        {
            held.entered.notify_one();
            let _ = tokio::time::timeout(Duration::from_secs(12), held.release.notified()).await;
        }
        Response::builder()
            .status(status)
            .body(Body::from(body))
            .map(|mut response| {
                *response.headers_mut() = headers;
                response
            })
            .map_err(|_| ())
    }
    .await;
    result.unwrap_or_else(|_| StatusCode::BAD_GATEWAY.into_response())
}
fn private_dir(path: &Path) -> Check<()> {
    fs::create_dir_all(path).map_err(|_| "private fixture directory")?;
    fs::set_permissions(path, fs::Permissions::from_mode(0o700))
        .map_err(|_| "fixture directory permissions")
}
fn random() -> Check<String> {
    let mut bytes = [0u8; 10];
    getrandom::fill(&mut bytes).map_err(|_| "fixture randomness")?;
    Ok(bytes.iter().map(|b| format!("{b:02x}")).collect())
}
struct CommandChild(Child, Option<PathBuf>);
impl Drop for CommandChild {
    fn drop(&mut self) {
        if let Some(name) = &self.1 {
            stop_container(name);
        }
        let _ = self.0.kill();
        let _ = self.0.wait();
    }
}
async fn command(mut command: Command) -> Check<()> {
    let args: Vec<_> = command
        .get_args()
        .map(|v| v.to_string_lossy().into_owned())
        .collect();
    let container = if command.get_program() == "docker" {
        args.windows(2)
            .find(|a| a[0] == "--cidfile")
            .map(|a| PathBuf::from(&a[1]))
    } else {
        None
    };
    let child = command
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|_| "fixture command spawn")?;
    let mut child = CommandChild(child, container);
    let deadline = tokio::time::Instant::now() + Duration::from_secs(35);
    loop {
        if let Some(status) = child.0.try_wait().map_err(|_| "fixture command state")? {
            return check(status.success(), "private fixture command failed");
        }
        if tokio::time::Instant::now() >= deadline {
            let _ = child.0.kill();
            let _ = child.0.wait();
            return Err("fixture command deadline");
        }
        tokio::time::sleep(Duration::from_millis(15)).await;
    }
}
async fn tool(name: &str, args: Vec<String>) -> Check<()> {
    let mut cmd = Command::new(name);
    cmd.args(args);
    command(cmd).await
}
async fn database(url: &str) -> Check<PgConnection> {
    tokio::time::timeout(
        Duration::from_secs(3),
        PgConnection::connect_with(
            &url.parse::<sqlx::postgres::PgConnectOptions>()
                .map_err(|_| "fixture PostgreSQL options")?
                .options([("statement_timeout", "4000"), ("lock_timeout", "1500")]),
        ),
    )
    .await
    .map_err(|_| "fixture database deadline")?
    .map_err(|_| "fixture database connection")
}

struct PendingAllocation {
    admin: String,
    name: String,
    root: PathBuf,
    armed: bool,
}
impl Drop for PendingAllocation {
    fn drop(&mut self) {
        if self.armed {
            cleanup(&self.admin, &self.name, &self.root);
        }
    }
}
fn cleanup(admin: &str, name: &str, root: &Path) {
    let url = admin.to_owned();
    let name = name.to_owned();
    let root = root.to_owned();
    let _ = std::thread::spawn(move || {
        if let Ok(runtime) = tokio::runtime::Builder::new_current_thread()
            .enable_all()
            .build()
        {
            runtime.block_on(async {
                if let Ok(mut db) = database(&url).await {
                    let _ = sqlx::raw_sql(sqlx::AssertSqlSafe(format!(
                        "DROP DATABASE IF EXISTS \"{name}\" WITH (FORCE)"
                    )))
                    .execute(&mut db)
                    .await;
                }
            });
        }
        let _ = fs::remove_dir_all(root);
    })
    .join();
}

pub struct Fixture {
    pub origin: String,
    pub username: String,
    pub password: String,
    pub setup: String,
    pub discord: Option<reborn_crafty_fixture::discord::Discord>,
    discord_proxy: Option<DiscordProxy>,
    root: PathBuf,
    home: PathBuf,
    admin: String,
    name: String,
    child: Option<Child>,
    container: Option<PathBuf>,
    proxy: Arc<Proxy>,
    server: JoinHandle<()>,
    driver: PathBuf,
    chromium: PathBuf,
    cleaned: bool,
}
impl Fixture {
    pub async fn new() -> Check<Self> {
        Self::new_inner(false).await
    }
    pub async fn with_discord() -> Check<Self> {
        Self::new_inner(true).await
    }
    async fn new_inner(with_discord: bool) -> Check<Self> {
        let admin = std::env::var("REBORN_TEST_DATABASE_URL")
            .map_err(|_| "local PostgreSQL prerequisite missing")?;
        let mut url = url::Url::parse(&admin).map_err(|_| "fixture URL")?;
        check(
            matches!(url.scheme(), "postgres" | "postgresql")
                && matches!(
                    url.host_str(),
                    Some("localhost" | "127.0.0.1" | "[::1]" | "::1")
                ),
            "disposable loopback database required",
        )?;
        let name = format!("keida_reborn_ws_{}_{}", std::process::id(), random()?);
        let mut connection = database(&admin).await?;
        sqlx::raw_sql(sqlx::AssertSqlSafe(format!("CREATE DATABASE \"{name}\"")))
            .execute(&mut connection)
            .await
            .map_err(|_| "owned database creation")?;
        url.set_path(&format!("/{name}"));
        let db_url = url.to_string();
        let root = std::env::temp_dir().join(format!("keida-reborn-workspace-{}", random()?));
        let mut allocation = PendingAllocation {
            admin: admin.clone(),
            name: name.clone(),
            root: root.clone(),
            armed: true,
        };
        private_dir(&root)?;
        let home = root.join("home");
        private_dir(&home)?;
        let discord = if with_discord {
            Some(reborn_crafty_fixture::discord::Discord::start().await?)
        } else {
            None
        };
        let discord_proxy = if let Some(discord) = &discord {
            Some(DiscordProxy::start(discord.address).await?)
        } else {
            None
        };
        let discord_ca = root.join("discord-ca.pem");
        if let Some(discord) = &discord {
            fs::write(&discord_ca, &discord.ca).map_err(|_| "private Discord fixture CA copy")?;
            fs::set_permissions(&discord_ca, fs::Permissions::from_mode(0o600))
                .map_err(|_| "private Discord fixture CA permissions")?;
        }
        let ca = root.join("ca.crt");
        let ca_key = root.join("ca.key");
        let cert = root.join("server.crt");
        let cert_key = root.join("server.key");
        let csr = root.join("server.csr");
        let s = |p: &Path| p.to_string_lossy().into_owned();
        tool(
            "openssl",
            [
                "req",
                "-x509",
                "-newkey",
                "rsa:2048",
                "-nodes",
                "-sha256",
                "-days",
                "1",
                "-subj",
                "/CN=Reborn workspace private fixture CA",
                "-addext",
                "basicConstraints=critical,CA:TRUE,pathlen:0",
                "-addext",
                "keyUsage=critical,keyCertSign,cRLSign",
                "-keyout",
                &s(&ca_key),
                "-out",
                &s(&ca),
            ]
            .map(str::to_owned)
            .to_vec(),
        )
        .await?;
        tool(
            "openssl",
            [
                "req",
                "-newkey",
                "rsa:2048",
                "-nodes",
                "-sha256",
                "-subj",
                "/CN=127.0.0.1",
                "-addext",
                "subjectAltName=DNS:localhost,IP:127.0.0.1",
                "-keyout",
                &s(&cert_key),
                "-out",
                &s(&csr),
            ]
            .map(str::to_owned)
            .to_vec(),
        )
        .await?;
        tool(
            "openssl",
            [
                "x509",
                "-req",
                "-in",
                &s(&csr),
                "-CA",
                &s(&ca),
                "-CAkey",
                &s(&ca_key),
                "-CAcreateserial",
                "-out",
                &s(&cert),
                "-days",
                "1",
                "-sha256",
                "-copy_extensions",
                "copy",
            ]
            .map(str::to_owned)
            .to_vec(),
        )
        .await?;
        for directory in [home.join(".pki/nssdb"), home.join(".local/share/pki/nssdb")] {
            private_dir(&directory)?;
            let nss = format!("sql:{}", directory.display());
            tool(
                "certutil",
                ["-N", "-d", &nss, "--empty-password"]
                    .map(str::to_owned)
                    .to_vec(),
            )
            .await?;
            tool(
                "certutil",
                [
                    "-A",
                    "-d",
                    &nss,
                    "-n",
                    "Reborn private fixture",
                    "-t",
                    "C,,",
                    "-i",
                    &s(&ca),
                ]
                .map(str::to_owned)
                .to_vec(),
            )
            .await?;
            if discord.is_some() {
                tool(
                    "certutil",
                    [
                        "-A",
                        "-d",
                        &nss,
                        "-n",
                        "Discord private fixture",
                        "-t",
                        "C,,",
                        "-i",
                        &s(&discord_ca),
                    ]
                    .map(str::to_owned)
                    .to_vec(),
                )
                .await?;
            }
        }
        let certificates = CertificateDer::pem_file_iter(&cert)
            .map_err(|_| "fixture certificate read")?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|_| "fixture certificate decode")?;
        let key = PrivateKeyDer::from_pem_file(&cert_key).map_err(|_| "fixture TLS key read")?;
        let config = rustls::ServerConfig::builder_with_provider(Arc::new(
            rustls::crypto::ring::default_provider(),
        ))
        .with_safe_default_protocol_versions()
        .map_err(|_| "fixture TLS protocols")?
        .with_no_client_auth()
        .with_single_cert(certificates, key)
        .map_err(|_| "fixture TLS config")?;
        let listener = TcpListener::bind("127.0.0.1:0")
            .await
            .map_err(|_| "fixture TLS listener")?;
        let origin = format!(
            "https://{}",
            listener.local_addr().map_err(|_| "fixture TLS address")?
        );
        let upstream_listener = std::net::TcpListener::bind("127.0.0.1:0")
            .map_err(|_| "fixture Rust listener reservation")?;
        let bind = upstream_listener
            .local_addr()
            .map_err(|_| "fixture Rust address")?;
        drop(upstream_listener);
        let binary = PathBuf::from(
            std::env::var("REBORN_BROWSER_BINARY")
                .map_err(|_| "compiled Rust binary prerequisite")?,
        );
        let expected = std::env::var("REBORN_BROWSER_EXPECT_COMMIT")
            .map_err(|_| "exact source prerequisite")?;
        check(
            binary.is_absolute()
                && binary.is_file()
                && expected.len() == 40
                && expected.bytes().all(|b| b.is_ascii_hexdigit()),
            "qualified binary/source required",
        )?;
        let key = root.join("instance.key");
        let setup_path = root.join("setup.token");
        let image = std::env::var("REBORN_BROWSER_IMAGE").ok();
        if let Some(ref image) = image {
            check(
                image.len() == 71
                    && image.starts_with("sha256:")
                    && image[7..]
                        .bytes()
                        .all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b)),
                "exact image digest required",
            )?;
        }
        let container = image.as_ref().map(|_| root.join("owned-app.cid"));
        let uid = std::fs::metadata("/proc/self").map_err(|_| "fixture UID")?;
        use std::os::unix::fs::MetadataExt;
        let application = |args: Vec<String>| {
            let mut cmd = if let Some(ref image) = image {
                let mut cmd = Command::new("docker");
                cmd.args([
                    "run",
                    "--rm",
                    "--name",
                    &format!("reborn-browser-app-{name}"),
                    "--cidfile",
                    container
                        .as_ref()
                        .expect("owned image CID file")
                        .to_str()
                        .expect("owned path"),
                    "--network",
                    "host",
                    "--user",
                    &format!("{}:{}", uid.uid(), uid.gid()),
                    "--read-only",
                    "--cap-drop",
                    "ALL",
                    "--security-opt",
                    "no-new-privileges",
                    "--pids-limit",
                    "64",
                    "--memory",
                    "256m",
                    "--cpus",
                    "1",
                    "--tmpfs",
                    "/tmp:rw,noexec,nosuid,size=16m",
                    "--mount",
                    &format!("type=bind,src={},dst={}", s(&root), s(&root)),
                    "-e",
                    "DATABASE_URL",
                    "-e",
                    "REBORN_BIND",
                    "-e",
                    "REBORN_PUBLIC_ORIGIN",
                    "-e",
                    "REBORN_INSTANCE_KEY_FILE",
                    "-e",
                    "REBORN_DISCORD_FIXTURE_SOCKET",
                    "-e",
                    "REBORN_DISCORD_FIXTURE_CA_FILE",
                    image,
                ]);
                cmd
            } else {
                Command::new(&binary)
            };
            cmd.args(args)
                .env("DATABASE_URL", &db_url)
                .env("REBORN_BIND", bind.to_string())
                .env("REBORN_PUBLIC_ORIGIN", &origin)
                .env("REBORN_INSTANCE_KEY_FILE", &key)
                .env_remove("REBORN_DISCORD_FIXTURE_SOCKET")
                .env_remove("REBORN_DISCORD_FIXTURE_CA_FILE");
            if let Some(discord) = &discord {
                cmd.env("REBORN_DISCORD_FIXTURE_SOCKET", discord.address.to_string())
                    .env("REBORN_DISCORD_FIXTURE_CA_FILE", &discord_ca);
            }
            cmd
        };
        for args in [
            vec!["migrate".into()],
            vec!["init-key".into(), s(&key)],
            vec!["prepare-owner".into(), s(&setup_path)],
        ] {
            command(application(args)).await?;
        }
        let setup = fs::read_to_string(&setup_path).map_err(|_| "private setup read")?;
        check(
            setup.len() == 64 && setup.bytes().all(|b| b.is_ascii_hexdigit()),
            "canonical private setup",
        )?;
        let client = Client::builder()
            .timeout(Duration::from_secs(6))
            .redirect(reqwest::redirect::Policy::none())
            .no_proxy()
            .build()
            .map_err(|_| "fixture proxy client")?;
        let driver = PathBuf::from(
            std::env::var("REBORN_CHROMEDRIVER").map_err(|_| "pinned ChromeDriver prerequisite")?,
        );
        let chromium = PathBuf::from(
            std::env::var("REBORN_CHROMIUM").map_err(|_| "pinned Chromium prerequisite")?,
        );
        check(
            driver.is_absolute()
                && driver.is_file()
                && chromium.is_absolute()
                && chromium.is_file(),
            "absolute pinned browser prerequisites",
        )?;
        let username = format!("owner_{}", random()?);
        let password = format!("private-fixture-{}", random()?);
        let child = application(vec!["serve".into()])
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn()
            .map_err(|_| "start owned Rust app")?;
        let proxy = Arc::new(Proxy {
            upstream: format!("http://{bind}"),
            client: client.clone(),
            hold: Mutex::new(None),
            reads: AtomicU64::new(0),
            writes: AtomicU64::new(0),
            callback_requests: AtomicU64::new(0),
            callback_auth_cookie: AtomicBool::new(false),
        });
        let router = Router::new().fallback(forward).with_state(proxy.clone());
        let server = tokio::spawn(async move {
            let _ = axum::serve(
                TlsListener {
                    listener,
                    acceptor: TlsAcceptor::from(Arc::new(config)),
                },
                router,
            )
            .await;
        });
        let mut fixture = Self {
            origin,
            root,
            home,
            admin,
            name,
            child: Some(child),
            container,
            proxy,
            server,
            driver,
            chromium,
            cleaned: false,
            username,
            password,
            setup,
            discord,
            discord_proxy,
        };
        allocation.armed = false;
        let deadline = tokio::time::Instant::now() + Duration::from_secs(10);
        loop {
            if let Ok(response) = client.get(format!("http://{bind}/api/health")).send().await
                && let Ok(value) = response.json::<serde_json::Value>().await
            {
                check(
                    value["identity"]["commit"] == expected,
                    "actual Rust source identity",
                )?;
                for (field, env) in [
                    ("tree", "REBORN_BUILD_TREE"),
                    ("version", "REBORN_BUILD_VERSION"),
                    ("channel", "REBORN_BUILD_CHANNEL"),
                ] {
                    let expected =
                        std::env::var(env).map_err(|_| "qualified source metadata prerequisite")?;
                    check(
                        value["identity"][field] == expected,
                        "runtime source/tree/version/channel agreement",
                    )?;
                }
                break;
            }
            check(
                tokio::time::Instant::now() < deadline,
                "Rust fixture liveness deadline",
            )?;
            check(
                fixture
                    .child
                    .as_mut()
                    .ok_or("owned Rust child")?
                    .try_wait()
                    .map_err(|_| "inspect Rust child")?
                    .is_none(),
                "Rust fixture exited",
            )?;
            tokio::time::sleep(Duration::from_millis(30)).await;
        }
        Ok(fixture)
    }
    pub async fn browser(&self, trusted: bool) -> Check<Browser> {
        let home = if trusted {
            self.home.clone()
        } else {
            let p = self.root.join(format!("untrusted-{}", random()?));
            private_dir(&p)?;
            p
        };
        Browser::launch(
            &home,
            &self.root.join(format!("profile-{}", random()?)),
            &self.driver,
            &self.chromium,
            self.discord
                .as_ref()
                .zip(self.discord_proxy.as_ref())
                .map(|(discord, proxy)| (discord.address, proxy.address)),
        )
        .await
    }
    pub fn hold(&self, path: &'static str) -> Arc<Hold> {
        let h = Arc::new(Hold {
            entered: Notify::new(),
            release: Notify::new(),
        });
        *self.proxy.hold.lock().expect("fixture hold mutex") = Some((path, h.clone()));
        h
    }
    pub fn callback_evidence(&self) -> (u64, bool) {
        (
            self.proxy.callback_requests.load(Ordering::SeqCst),
            self.proxy.callback_auth_cookie.load(Ordering::SeqCst),
        )
    }
    pub fn reads(&self) -> u64 {
        self.proxy.reads.load(Ordering::SeqCst)
    }
    pub fn writes(&self) -> u64 {
        self.proxy.writes.load(Ordering::SeqCst)
    }
    // Only this freshly allocated, loopback-administered fixture database is
    // seeded. Actual TLS collection is tested separately; these older samples
    // provide enough independent rows to exercise the browser's keyset window
    // without waiting for many real collection minutes.
    pub async fn seed_observations(
        &self,
        revision: i64,
        count: u32,
        minute_offset: u32,
    ) -> Check<Vec<String>> {
        check(
            revision > 0 && (1..=30).contains(&count) && (1..=1000).contains(&minute_offset),
            "bounded owned observation seed",
        )?;
        let mut url = url::Url::parse(&self.admin).map_err(|_| "owned seed administrator URL")?;
        url.set_path(&self.name);
        let mut db = database(url.as_str()).await?;
        let mut tx = db
            .begin()
            .await
            .map_err(|_| "owned sample seed transaction")?;
        let mut ids = Vec::new();
        for n in 0..count {
            let mut sample = [0u8; 16];
            getrandom::fill(&mut sample).map_err(|_| "owned sample seed identity")?;
            let id: i64 = sqlx::query_scalar("INSERT INTO provider_observations (sample_id, connection_revision, checked_at, complete, error) VALUES ($1, $2, floor(extract(epoch FROM clock_timestamp()))::bigint - $3 * 60, FALSE, 'timeout') RETURNING id")
                .bind(sample.as_slice()).bind(revision).bind(i64::from(minute_offset + n))
                .fetch_one(&mut *tx).await.map_err(|_| "owned historical batch seed")?;
            sqlx::query("INSERT INTO provider_server_observations (batch_id, ordinal, name, state, players, capacity, collected_at, provider_at, freshness, error) VALUES ($1, 1, 'Historical timeout fixture', 'unknown', NULL, NULL, NULL, NULL, 'unknown', 'timeout')")
                .bind(id).execute(&mut *tx).await.map_err(|_| "owned historical server seed")?;
            ids.push(id.to_string());
        }
        tx.commit().await.map_err(|_| "owned sample seed commit")?;
        Ok(ids)
    }
    pub async fn observation_count(&self) -> Check<i64> {
        let mut url = url::Url::parse(&self.admin).map_err(|_| "owned sample count URL")?;
        url.set_path(&self.name);
        let mut db = database(url.as_str()).await?;
        sqlx::query_scalar("SELECT COUNT(*) FROM provider_observations")
            .fetch_one(&mut db)
            .await
            .map_err(|_| "owned observation count")
    }
    pub async fn close(mut self) -> Check<()> {
        if let Some(ref name) = self.container {
            stop_container(name);
        }
        if let Some(mut child) = self.child.take() {
            let _ = child.kill();
            child.wait().map_err(|_| "owned app shutdown")?;
        }
        self.server.abort();
        let mut admin = database(&self.admin).await?;
        sqlx::raw_sql(sqlx::AssertSqlSafe(format!(
            "DROP DATABASE \"{}\" WITH (FORCE)",
            self.name
        )))
        .execute(&mut admin)
        .await
        .map_err(|_| "owned database cleanup")?;
        fs::remove_dir_all(&self.root).map_err(|_| "owned private directory cleanup")?;
        self.cleaned = true;
        Ok(())
    }
}
impl Drop for Fixture {
    fn drop(&mut self) {
        if let Some(ref name) = self.container {
            stop_container(name);
        }
        if let Some(mut child) = self.child.take() {
            let _ = child.kill();
            let _ = child.wait();
        }
        self.server.abort();
        if !self.cleaned {
            cleanup(&self.admin, &self.name, &self.root);
        }
    }
}

impl Fixture {
    async fn api_write(
        &self,
        browser: &Browser,
        path: &str,
        payload: serde_json::Value,
        workspace: bool,
    ) -> Check<()> {
        let cookie = browser.cookie("__Host-keida-reborn-session").await?;
        let certificate = reqwest::Certificate::from_pem(
            &fs::read(self.root.join("ca.crt")).map_err(|_| "fixture CA read")?,
        )
        .map_err(|_| "fixture CA decode")?;
        let client = Client::builder()
            .timeout(Duration::from_secs(5))
            .add_root_certificate(certificate)
            .no_proxy()
            .build()
            .map_err(|_| "private API client")?;
        let headers = || {
            [
                ("X-Reborn-Product", "keida-hub-reborn"),
                ("X-Reborn-Contract", "reborn-auth-v1"),
            ]
        };
        let cookie = format!("__Host-keida-reborn-session={cookie}");
        let mut request = client
            .get(format!("{}/api/auth/session", self.origin))
            .header("Cookie", &cookie);
        for (k, v) in headers() {
            request = request.header(k, v);
        }
        let response = request
            .send()
            .await
            .map_err(|_| "authorized fixture session read")?;
        check(
            response.status() == StatusCode::OK,
            "fixture session admission",
        )?;
        let value: serde_json::Value = response.json().await.map_err(|_| "fixture session JSON")?;
        let csrf = value["csrf_token"]
            .as_str()
            .ok_or("fixture session guard")?;
        let mut request = client
            .request(
                if workspace {
                    reqwest::Method::PUT
                } else {
                    reqwest::Method::POST
                },
                format!("{}{path}", self.origin),
            )
            .header("Cookie", cookie)
            .header("Origin", &self.origin)
            .header("X-CSRF-Token", csrf)
            .json(&payload);
        for (k, v) in headers() {
            request = request.header(
                k,
                if workspace && k == "X-Reborn-Contract" {
                    "reborn-workspace-v1"
                } else {
                    v
                },
            );
        }
        let response = request
            .send()
            .await
            .map_err(|_| "authorized fixture API write")?;
        check(
            response.status().is_success(),
            "fixture API write admission",
        )
    }
    pub async fn shared_service(&self, owner: &Browser, base: u32) -> Check<()> {
        self.api_write(owner, "/api/owner/directory", serde_json::json!({"base_revision":base.to_string(),"change":{"action":"create","link":{"name":"Fictional shared service","category":"Home","description":"Notification fixture","url":"https://example.test/"}}}), true).await
    }
    pub async fn enroll_member(&self, browser: &Browser) -> Check<(String, String)> {
        let name = format!("member_{}", random()?);
        let password = format!("member-fixture-{}", random()?);
        self.api_write(
            browser,
            "/api/owner/members",
            serde_json::json!({"username":name,"password":password}),
            false,
        )
        .await?;
        Ok((name, password))
    }
    pub async fn revoke_all(&self, browser: &Browser) -> Check<()> {
        self.api_write(
            browser,
            "/api/auth/revoke-all",
            serde_json::json!({}),
            false,
        )
        .await
    }
}

fn stop_container(cid_file: &Path) {
    if let Ok(id) = fs::read_to_string(cid_file) {
        let id = id.trim();
        if id.len() != 64
            || !id
                .bytes()
                .all(|b| b.is_ascii_digit() || (b'a'..=b'f').contains(&b))
        {
            return;
        }
        let _ = Command::new("docker")
            .args(["rm", "--force", id])
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .status();
        let _ = fs::remove_file(cid_file);
    }
}

#[cfg(test)]
mod discord_proxy_tests {
    use super::*;

    #[tokio::test]
    async fn fixed_authority_tunnel_never_forwards_another_destination() {
        let target = TcpListener::bind("127.0.0.1:0").await.unwrap();
        let proxy = DiscordProxy::start(target.local_addr().unwrap())
            .await
            .unwrap();
        let mut wrong = TcpStream::connect(proxy.address).await.unwrap();
        wrong
            .write_all(b"CONNECT other.invalid:443 HTTP/1.1\r\nHost: other.invalid:443\r\n\r\n")
            .await
            .unwrap();
        let mut byte = [0];
        assert_eq!(
            tokio::time::timeout(Duration::from_secs(1), wrong.read(&mut byte))
                .await
                .unwrap()
                .unwrap(),
            0
        );
        assert!(
            tokio::time::timeout(Duration::from_millis(30), target.accept())
                .await
                .is_err()
        );

        let mut allowed = TcpStream::connect(proxy.address).await.unwrap();
        allowed.write_all(b"CONNECT discord.com:443 HTTP/1.1\r\nHost: discord.com:443\r\nProxy-Connection: keep-alive\r\n\r\n").await.unwrap();
        let (mut upstream, _) = tokio::time::timeout(Duration::from_secs(1), target.accept())
            .await
            .unwrap()
            .unwrap();
        let expected = b"HTTP/1.1 200 Connection Established\r\n\r\n";
        let mut reply = vec![0; expected.len()];
        allowed.read_exact(&mut reply).await.unwrap();
        assert_eq!(&reply, expected);
        upstream.write_all(b"synthetic TLS bytes").await.unwrap();
        let mut forwarded = [0; 19];
        allowed.read_exact(&mut forwarded).await.unwrap();
        assert_eq!(&forwarded, b"synthetic TLS bytes");
    }
}
