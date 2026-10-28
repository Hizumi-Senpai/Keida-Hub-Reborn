//! Shared HTTPS plumbing/data only. Each caller owns independent expectations.
pub mod discord;
pub mod media;
pub mod queues;
use axum::{
    Json, Router,
    extract::{Request, State},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde_json::json;
use std::{
    fs, io,
    net::SocketAddr,
    os::unix::fs::{DirBuilderExt, PermissionsExt},
    path::PathBuf,
    process::{Command, Stdio},
    sync::{
        Arc, Mutex,
        atomic::{AtomicU8, AtomicU64, Ordering},
    },
    time::{Duration, SystemTime, UNIX_EPOCH},
};
use tokio::{
    net::{TcpListener, TcpStream},
    sync::Notify,
    task::JoinHandle,
};
use tokio_rustls::{
    TlsAcceptor,
    rustls::{
        self,
        pki_types::{CertificateDer, PrivateKeyDer, pem::PemObject},
    },
    server::TlsStream,
};

pub const ID: &str = "12345678-1234-1234-1234-123456789abc";
pub const TOKEN: &str = "dedicated-fictional-native-fixture-token";
pub const NORMAL: u8 = 0;
pub const DENIED: u8 = 1;
pub const MISSING: u8 = 2;
pub const MALFORMED: u8 = 3;
pub const STALE: u8 = 4;
pub const NO_PLAYERS: u8 = 5;
pub const WRONG_TYPE: u8 = 6;
pub const LARGE: u8 = 7;
pub const TIMEOUT: u8 = 8;
pub const REDIRECT: u8 = 9;
pub const HOLD: u8 = 10;
pub const DUPLICATE: u8 = 11;
static NEXT: AtomicU64 = AtomicU64::new(0);
struct Data {
    mode: AtomicU8,
    requests: Mutex<Vec<(String, String)>>,
    entered: Notify,
    release: Notify,
}
pub struct Crafty {
    pub origin: String,
    pub ca: String,
    root: PathBuf,
    data: Arc<Data>,
    task: JoinHandle<()>,
}
struct Listener {
    tcp: TcpListener,
    tls: TlsAcceptor,
}
impl axum::serve::Listener for Listener {
    type Io = TlsStream<TcpStream>;
    type Addr = SocketAddr;
    async fn accept(&mut self) -> (Self::Io, Self::Addr) {
        loop {
            if let Ok((tcp, addr)) = self.tcp.accept().await {
                if let Ok(Ok(tls)) =
                    tokio::time::timeout(Duration::from_secs(2), self.tls.accept(tcp)).await
                {
                    return (tls, addr);
                }
            } else {
                tokio::time::sleep(Duration::from_millis(20)).await;
            }
        }
    }
    fn local_addr(&self) -> io::Result<Self::Addr> {
        self.tcp.local_addr()
    }
}
async fn handler(State(data): State<Arc<Data>>, request: Request) -> Response {
    let path = request.uri().path();
    data.requests
        .lock()
        .unwrap()
        .push((request.method().to_string(), path.to_string()));
    if request.method() != axum::http::Method::GET {
        return StatusCode::METHOD_NOT_ALLOWED.into_response();
    }
    if request
        .headers()
        .get("authorization")
        .and_then(|h| h.to_str().ok())
        != Some(&format!("Bearer {TOKEN}"))
    {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    let mode = data.mode.load(Ordering::SeqCst);
    if mode == DENIED {
        return StatusCode::FORBIDDEN.into_response();
    }
    if mode == REDIRECT {
        return (
            StatusCode::FOUND,
            [("location", "https://should-never-be-contacted.invalid/")],
        )
            .into_response();
    }
    if path == "/api/v2/servers" {
        return Json(json!({"status":"ok","data":if mode==MISSING {vec![]}else{vec![json!({"server_id":ID,"server_name":"Unreviewed provider metadata","path":"/private/provider-path"})]}})).into_response();
    }
    if path != format!("/api/v2/servers/{ID}/stats") {
        return StatusCode::NOT_FOUND.into_response();
    }
    if mode == HOLD {
        data.entered.notify_one();
        let _ = tokio::time::timeout(Duration::from_secs(8), data.release.notified()).await;
    }
    if mode == TIMEOUT {
        tokio::time::sleep(Duration::from_secs(3)).await;
    }
    if mode == MALFORMED {
        return ([("content-type", "application/json")], "{broken").into_response();
    }
    if mode == DUPLICATE {
        return ([("content-type","application/json")],r#"{"status":"ok","data":{"running":true,"online":5,"online":0,"int_ping_results":true}}"#).into_response();
    }
    if mode == LARGE {
        return "x".repeat(262145).into_response();
    }
    let at = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64
        - if mode == STALE { 300 } else { 1 };
    let created = chrono::DateTime::from_timestamp(at, 0)
        .unwrap()
        .to_rfc3339();
    let online = if mode == NO_PLAYERS {
        serde_json::Value::Null
    } else if mode == WRONG_TYPE {
        json!(false)
    } else {
        json!(0)
    };
    Json(json!({"status":"ok","data":{"running":true,"int_ping_results":"True","online":online,"max":20,"created":created,"server_id":{"path":"/private/provider-path"},"players":"[]"}})).into_response()
}
impl Crafty {
    pub async fn start() -> Result<Self, &'static str> {
        let root = std::env::temp_dir().join(format!(
            "reborn-crafty-fixture-{}-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map_err(|_| "fixture clock")?
                .as_nanos(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        ));
        fs::DirBuilder::new()
            .mode(0o700)
            .create(&root)
            .map_err(|_| "fixture private directory")?;
        let make = |args: &[&str]| -> Result<(), &'static str> {
            let status = Command::new("openssl")
                .current_dir(&root)
                .args(args)
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .status()
                .map_err(|_| "fixture openssl prerequisite")?;
            if status.success() {
                Ok(())
            } else {
                Err("fixture certificate generation")
            }
        };
        make(&[
            "req",
            "-x509",
            "-newkey",
            "rsa:2048",
            "-nodes",
            "-days",
            "1",
            "-subj",
            "/CN=Disposable Crafty Test CA",
            "-keyout",
            "ca.key",
            "-out",
            "ca.pem",
            "-addext",
            "basicConstraints=critical,CA:TRUE",
        ])?;
        make(&[
            "req",
            "-newkey",
            "rsa:2048",
            "-nodes",
            "-subj",
            "/CN=localhost",
            "-keyout",
            "leaf.key",
            "-out",
            "leaf.csr",
            "-addext",
            "subjectAltName=DNS:localhost,IP:127.0.0.1",
            "-addext",
            "basicConstraints=critical,CA:FALSE",
        ])?;
        make(&[
            "x509",
            "-req",
            "-in",
            "leaf.csr",
            "-CA",
            "ca.pem",
            "-CAkey",
            "ca.key",
            "-CAcreateserial",
            "-out",
            "leaf.pem",
            "-days",
            "1",
            "-copy_extensions",
            "copy",
        ])?;
        for entry in fs::read_dir(&root).map_err(|_| "fixture private files")? {
            fs::set_permissions(
                entry.map_err(|_| "fixture file")?.path(),
                fs::Permissions::from_mode(0o600),
            )
            .map_err(|_| "fixture private permissions")?;
        }
        let certs = CertificateDer::pem_file_iter(root.join("leaf.pem"))
            .map_err(|_| "fixture cert")?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|_| "fixture certificate decode")?;
        let key = PrivateKeyDer::from_pem_file(root.join("leaf.key")).map_err(|_| "fixture key")?;
        let tls = rustls::ServerConfig::builder_with_provider(Arc::new(
            rustls::crypto::ring::default_provider(),
        ))
        .with_safe_default_protocol_versions()
        .map_err(|_| "fixture TLS protocol")?
        .with_no_client_auth()
        .with_single_cert(certs, key)
        .map_err(|_| "fixture TLS configuration")?;
        let tcp = TcpListener::bind("127.0.0.1:0")
            .await
            .map_err(|_| "fixture listener")?;
        let origin = format!(
            "https://{}",
            tcp.local_addr().map_err(|_| "fixture address")?
        );
        let ca = fs::read_to_string(root.join("ca.pem")).map_err(|_| "fixture CA")?;
        let data = Arc::new(Data {
            mode: AtomicU8::new(NORMAL),
            requests: Mutex::new(Vec::new()),
            entered: Notify::new(),
            release: Notify::new(),
        });
        let router = Router::new().fallback(handler).with_state(data.clone());
        let task = tokio::spawn(async move {
            let _ = axum::serve(
                Listener {
                    tcp,
                    tls: TlsAcceptor::from(Arc::new(tls)),
                },
                router,
            )
            .await;
        });
        Ok(Self {
            origin,
            ca,
            root,
            data,
            task,
        })
    }
    pub fn mode(&self, mode: u8) {
        self.data.mode.store(mode, Ordering::SeqCst);
    }
    pub fn requests(&self) -> Vec<(String, String)> {
        self.data.requests.lock().unwrap().clone()
    }
    pub async fn entered(&self) {
        self.data.entered.notified().await;
    }
    pub fn release(&self) {
        self.data.release.notify_one();
    }
}
impl Drop for Crafty {
    fn drop(&mut self) {
        self.task.abort();
        let _ = fs::remove_dir_all(&self.root);
    }
}
