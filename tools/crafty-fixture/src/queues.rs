//! Fictional HTTPS queue payloads only; callers keep independent expectations.
use super::*;
use axum::body::Body;
use std::collections::BTreeMap;

pub const TOKEN: &str = "qbt_0123456789abcdefghijklmnopqr";
pub const NORMAL: u8 = 0;
pub const EMPTY: u8 = 1;
pub const MISSING: u8 = 2;
pub const MALFORMED: u8 = 3;
pub const DUPLICATE: u8 = 4;
pub const LARGE: u8 = 5;
pub const CHUNKED: u8 = 6;
pub const DENIED: u8 = 7;
pub const REDIRECT: u8 = 8;
pub const TIMEOUT: u8 = 9;
pub const HOLD: u8 = 10;
pub const MANY: u8 = 11;
pub const PAGE_MOVED: u8 = 12;
pub const UNSUPPORTED: u8 = 13;
pub const RATE_LIMITED: u8 = 14;
pub const QBIT52: u8 = 15;
pub const PRECISION: u8 = 16;
pub const CHECKING_PROGRESS: u8 = 17;
pub const TRUNCATED: u8 = 18;
pub const DUPLICATE_ID: u8 = 19;
pub const BAD_PAGE: u8 = 20;
pub const NULL_RECORDS: u8 = 21;
pub const OVERSIZED_ROWS: u8 = 22;
pub const VERSION_MALFORMED: u8 = 23;
pub const VERSION_LARGE: u8 = 24;
pub const SHORT_PAGE: u8 = 25;
pub const HTML: u8 = 26;
pub const DUPLICATE_VERSION: u8 = 27;
pub const SERVER_ERROR: u8 = 28;
pub const NOT_FOUND: u8 = 29;
pub const METHOD_NOT_ALLOWED: u8 = 30;
pub const ZERO_METADATA: u8 = 31;
pub const WARNINGS: u8 = 32;

struct QueueData {
    provider: &'static str,
    mode: AtomicU8,
    requests: Mutex<Vec<(String, String)>>,
    entered: Notify,
    release: Notify,
}

pub struct Queues {
    pub origin: String,
    pub ca: String,
    data: Arc<QueueData>,
    task: JoinHandle<()>,
    _transport: Crafty,
}

fn query(request: &Request) -> Option<BTreeMap<&str, &str>> {
    let mut fields = BTreeMap::new();
    for pair in request.uri().query().unwrap_or("").split('&') {
        if pair.is_empty() {
            continue;
        }
        let (key, value) = pair.split_once('=')?;
        if fields.insert(key, value).is_some() {
            return None;
        }
    }
    Some(fields)
}

fn offset(request: &Request, provider: &str) -> Option<usize> {
    let fields = query(request)?;
    let expected: &[(&str, &str)] = match provider {
        "sonarr" => &[
            ("pageSize", "12"),
            ("sortKey", "added"),
            ("sortDirection", "descending"),
            ("includeUnknownSeriesItems", "false"),
            ("includeSeries", "false"),
            ("includeEpisode", "false"),
        ],
        "radarr" => &[
            ("pageSize", "12"),
            ("sortKey", "added"),
            ("sortDirection", "descending"),
            ("includeUnknownMovieItems", "false"),
            ("includeMovie", "false"),
        ],
        "qbittorrent" => &[
            ("filter", "all"),
            ("sort", "added_on"),
            ("reverse", "true"),
            ("limit", "13"),
        ],
        _ => return None,
    };
    if fields.len() != expected.len() + 1
        || expected
            .iter()
            .any(|(name, value)| fields.get(name) != Some(value))
    {
        return None;
    }
    if provider == "qbittorrent" {
        match *fields.get("offset")? {
            "0" => Some(0),
            "12" => Some(12),
            "24" => Some(24),
            "36" => Some(36),
            "48" => Some(48),
            _ => None,
        }
    } else {
        match *fields.get("page")? {
            "1" => Some(0),
            "2" => Some(12),
            "3" => Some(24),
            "4" => Some(36),
            "5" => Some(48),
            _ => None,
        }
    }
}

fn title(provider: &str, index: usize, ordinary: bool) -> String {
    match (provider, index, ordinary) {
        ("sonarr", 0, _) => "Queued series".into(),
        ("radarr", 0, _) => "Queued movie".into(),
        ("qbittorrent", 0, _) => "Fixture transfer".into(),
        ("sonarr", 1, true) => "Delayed series".into(),
        ("radarr", 1, true) => "Delayed movie".into(),
        ("qbittorrent", 1, true) => "Metadata pending".into(),
        ("sonarr", _, _) => format!("Queued series {}", index + 1),
        ("radarr", _, _) => format!("Queued movie {}", index + 1),
        _ => format!("Fixture transfer {}", index + 1),
    }
}

fn row(provider: &str, index: usize, mode: u8) -> serde_json::Value {
    let ordinary = !matches!(mode, MANY | TRUNCATED | PRECISION | OVERSIZED_ROWS);
    if provider == "qbittorrent" {
        let metadata = !(ordinary
            && index == 1
            && !matches!(mode, CHECKING_PROGRESS | ZERO_METADATA | WARNINGS));
        let state = if mode == CHECKING_PROGRESS {
            if index == 0 { "stoppedDL" } else { "moving" }
        } else if index == 0 {
            "checkingDL"
        } else if metadata {
            "downloading"
        } else {
            "metaDL"
        };
        let mut out = json!({
            "hash":format!("{:040x}",index+1),"name":title(provider,index,ordinary),
            "state":state,"has_metadata":metadata,"size":if metadata{1000}else{0},
            "completed":if metadata{250}else{0},"progress":0.9,
            "dlspeed":if index==0{128}else{0},"upspeed":0,
            "amount_left":999999,"total_size":999999,"eta":8640000,
            "save_path":"/private/queue-fixture-path","content_path":"/private/queue-content",
            "download_path":"/private/queue-download","root_path":"/private/queue-root",
            "magnet_uri":"magnet:?xt=urn:btih:PRIVATE_QUEUE_MAGNET",
            "tracker":"https://queue-private.invalid/PRIVATE_QUEUE_PASSKEY/announce",
            "trackers":[{"url":"PRIVATE_QUEUE_TRACKER"}],"files":[{"name":"PRIVATE_QUEUE_FILE"}],
            "infohash_v2":"PRIVATE_QUEUE_INFOHASH_V2","tags":"PRIVATE_QUEUE_TAG",
            "category":"PRIVATE_QUEUE_CATEGORY","private":true,"peer":"198.51.100.88"
        });
        if mode == ZERO_METADATA {
            out["size"] = json!(0);
            out["completed"] = json!(0);
        }
        if mode == WARNINGS {
            out["state"] = json!(if index == 0 { "error" } else { "missingFiles" });
        }
        if mode == MISSING && index == 0 {
            let object = out.as_object_mut().unwrap();
            for field in [
                "name",
                "size",
                "completed",
                "has_metadata",
                "dlspeed",
                "upspeed",
            ] {
                object.remove(field);
            }
            object.insert("state".into(), json!("futureTransferState"));
        }
        if mode == DUPLICATE_ID && index == 1 {
            out["hash"] = json!(format!("{:040x}", 1));
        }
        out
    } else {
        let delayed = ordinary && index == 1 && mode != WARNINGS;
        let mut out = json!({
            "id":index*2,"title":title(provider,index,ordinary),
            "status":if delayed{"delay"}else{"downloading"},
            "size":if delayed{0}else{1000},"sizeleft":if delayed{0}else{750},
            "trackedDownloadState":if delayed{"importPending"}else{"downloading"},
            "trackedDownloadStatus":"ok","timeleft":"00:10:00",
            "outputPath":"/private/queue-fixture-path","downloadId":"PRIVATE_QUEUE_DOWNLOAD_ID",
            "downloadClient":"PRIVATE_QUEUE_CLIENT","indexer":"PRIVATE_QUEUE_INDEXER",
            "statusMessages":[{"title":"PRIVATE_QUEUE_MESSAGE","messages":["/private/queue-error"]}],
            "errorMessage":"PRIVATE_QUEUE_ERROR","series":{"path":"PRIVATE_QUEUE_SERIES"},
            "episode":{"file":"PRIVATE_QUEUE_EPISODE"},"movie":{"path":"PRIVATE_QUEUE_MOVIE"},
            "sourceUrl":"https://queue-private.invalid/PRIVATE_QUEUE_SOURCE"
        });
        if mode == WARNINGS {
            out["status"] = json!(if index == 0 { "warning" } else { "failed" });
            out["trackedDownloadState"] = json!(if index == 0 {
                "importBlocked"
            } else {
                "failed"
            });
            out["trackedDownloadStatus"] = json!(if index == 0 { "warning" } else { "error" });
        }
        if mode == MISSING && index == 0 {
            let object = out.as_object_mut().unwrap();
            for field in ["title", "size", "sizeleft"] {
                object.remove(field);
            }
            object.insert("status".into(), json!("futureQueueState"));
            object.insert("trackedDownloadState".into(), json!("futureImportState"));
            object.insert("trackedDownloadStatus".into(), json!("futureSeverity"));
        }
        if mode == DUPLICATE_ID && index == 1 {
            out["id"] = json!(0);
        }
        out
    }
}

fn precision(provider: &str) -> String {
    let mut rows = Vec::new();
    let sizes = [
        "9007199254740991",
        "1000.0",
        "9007199254740990.999999999999999999",
        "-1",
        "\"1000\"",
        "1000",
        "1e33",
        "1000.000000000000000000000000000000000000000000000000000000000000000000000",
    ];
    for (index, size) in sizes.iter().enumerate() {
        let mut value = row(provider, index, PRECISION);
        value["size"] = json!(format!("RAW_SIZE_{index}"));
        if provider == "qbittorrent" {
            value["dlspeed"] = json!(format!("RAW_RATE_{index}"));
        }
        let remaining = if index == 0 {
            "0"
        } else if index == 1 {
            "7.5e2"
        } else {
            "1001"
        };
        let completed = if index == 0 {
            "9007199254740991"
        } else if index == 1 {
            "2.5e2"
        } else {
            "1001"
        };
        let field = if provider == "qbittorrent" {
            "completed"
        } else {
            "sizeleft"
        };
        value[field] = json!(format!("RAW_VALUE_{index}"));
        let serialized = value
            .to_string()
            .replace(&format!("\"RAW_SIZE_{index}\""), size)
            .replace(&format!("\"RAW_RATE_{index}\""), size)
            .replace(
                &format!("\"RAW_VALUE_{index}\""),
                if provider == "qbittorrent" {
                    completed
                } else {
                    remaining
                },
            );
        rows.push(serialized);
    }
    let records = format!("[{}]", rows.join(","));
    if provider == "qbittorrent" {
        records
    } else {
        format!(
            r#"{{"page":1,"pageSize":12,"sortKey":"added","sortDirection":"descending","totalRecords":8,"records":{records}}}"#
        )
    }
}

async fn handler(State(data): State<Arc<QueueData>>, request: Request) -> Response {
    data.requests
        .lock()
        .unwrap()
        .push((request.method().to_string(), request.uri().to_string()));
    if request.method() != axum::http::Method::GET {
        return StatusCode::METHOD_NOT_ALLOWED.into_response();
    }
    let headers = request.headers();
    let qbit = data.provider == "qbittorrent";
    let authorized = if qbit {
        headers.get("authorization").and_then(|v| v.to_str().ok())
            == Some(&format!("Bearer {TOKEN}"))
            && headers.get("x-api-key").is_none()
    } else {
        headers.get("x-api-key").and_then(|v| v.to_str().ok()) == Some(TOKEN)
            && headers.get("authorization").is_none()
            && headers.get("accept").and_then(|v| v.to_str().ok()) == Some("application/json")
    };
    if !authorized
        || [
            "cookie",
            "x-csrf-token",
            "x-reborn-product",
            "x-reborn-contract",
            "x-api-user",
        ]
        .iter()
        .any(|h| headers.get(*h).is_some())
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
            [("location", "https://queue-never-follow.invalid/")],
        )
            .into_response();
    }
    let version_path = if qbit {
        "/api/v2/app/version"
    } else {
        "/api/v3/system/status"
    };
    if request.uri().path() == version_path {
        if !request.uri().query().unwrap_or("").is_empty() {
            return StatusCode::BAD_REQUEST.into_response();
        }
        if mode == VERSION_MALFORMED {
            return (
                [("content-type", "application/json")],
                "<html>PRIVATE_QUEUE_LOGIN</html>",
            )
                .into_response();
        }
        if mode == DUPLICATE_VERSION && !qbit {
            return (
                [("content-type", "application/json")],
                r#"{"version":"4.0.20.3014","version":"6.4.4.10685"}"#,
            )
                .into_response();
        }
        let version = if mode == VERSION_LARGE {
            "v".repeat(65)
        } else if mode == UNSUPPORTED {
            match data.provider {
                "sonarr" => "5.0.0.0",
                "radarr" => "7.0.0.0",
                _ => "v5.4.0",
            }
            .into()
        } else {
            match data.provider {
                "sonarr" => "4.0.20.3014",
                "radarr" => "6.4.4.10685",
                _ if mode == QBIT52 => "v5.2.0",
                _ => "v5.3.0",
            }
            .into()
        };
        if qbit {
            return version.into_response();
        }
        return Json(json!({"version":version,"startupPath":"/private/queue-fixture-path","appData":"PRIVATE_QUEUE_APPDATA","databaseVersion":"PRIVATE_QUEUE_DATABASE","authentication":"PRIVATE_QUEUE_AUTH"})).into_response();
    }
    let queue_path = if qbit {
        "/api/v2/torrents/info"
    } else {
        "/api/v3/queue"
    };
    if request.uri().path() != queue_path {
        return StatusCode::NOT_FOUND.into_response();
    }
    let Some(offset) = offset(&request, data.provider) else {
        return StatusCode::BAD_REQUEST.into_response();
    };
    if mode == HOLD {
        data.entered.notify_one();
        let _ = tokio::time::timeout(Duration::from_secs(6), data.release.notified()).await;
    }
    if mode == TIMEOUT {
        tokio::time::sleep(Duration::from_secs(3)).await;
    }
    match mode {
        RATE_LIMITED => return StatusCode::TOO_MANY_REQUESTS.into_response(),
        SERVER_ERROR => return StatusCode::BAD_GATEWAY.into_response(),
        NOT_FOUND => return StatusCode::NOT_FOUND.into_response(),
        METHOD_NOT_ALLOWED => return StatusCode::METHOD_NOT_ALLOWED.into_response(),
        MALFORMED => {
            return ([("content-type", "application/json")], "{broken-queue").into_response();
        }
        HTML => {
            return (
                [("content-type", "text/html")],
                "<html>PRIVATE_QUEUE_LOGIN</html>",
            )
                .into_response();
        }
        DUPLICATE => {
            let body = if qbit {
                r#"[{"hash":"0000000000000000000000000000000000000001","name":"a","name":"b","size":1000,"completed":250,"state":"downloading","has_metadata":true,"dlspeed":0,"upspeed":0}]"#
            } else {
                r#"{"page":1,"pageSize":12,"sortKey":"added","sortDirection":"descending","totalRecords":0,"records":[],"records":[]}"#
            };
            return ([("content-type", "application/json")], body).into_response();
        }
        LARGE => return "x".repeat(262145).into_response(),
        CHUNKED => {
            let stream = Body::from(vec![b'x'; 262145]).into_data_stream();
            return Response::new(Body::from_stream(stream));
        }
        PRECISION => {
            return (
                [("content-type", "application/json")],
                precision(data.provider),
            )
                .into_response();
        }
        _ => {}
    }
    let total = match mode {
        EMPTY => 0,
        MANY => 26,
        TRUNCATED => 70,
        OVERSIZED_ROWS => 14,
        _ => 2,
    };
    let page_size = if qbit { 13 } else { 12 };
    let end = if mode == OVERSIZED_ROWS {
        total
    } else {
        usize::min(total, offset + page_size)
    };
    let mut rows: Vec<_> = (offset..end)
        .map(|index| row(data.provider, index, mode))
        .collect();
    if mode == SHORT_PAGE && !rows.is_empty() {
        rows.pop();
    }
    if qbit {
        return Json(rows).into_response();
    }
    let returned_page = if mode == PAGE_MOVED {
        if offset == 0 { 2 } else { 1 }
    } else {
        offset / 12 + 1
    };
    Json(json!({"page":returned_page,"pageSize":if mode==BAD_PAGE{13}else{12},"sortKey":"added","sortDirection":"descending","totalRecords":total,"records":if mode==NULL_RECORDS{serde_json::Value::Null}else{json!(rows)}})).into_response()
}

impl Queues {
    pub async fn start(provider: &str) -> Result<Self, String> {
        let provider = match provider {
            "sonarr" => "sonarr",
            "radarr" => "radarr",
            "qbittorrent" => "qbittorrent",
            _ => return Err("unknown queue fixture provider".into()),
        };
        let transport = Crafty::start().await?;
        transport.task.abort();
        let certs = CertificateDer::pem_file_iter(transport.root.join("leaf.pem"))
            .map_err(|_| "queue fixture cert")?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|_| "queue fixture cert decode")?;
        let key = PrivateKeyDer::from_pem_file(transport.root.join("leaf.key"))
            .map_err(|_| "queue fixture key")?;
        let tls = rustls::ServerConfig::builder_with_provider(Arc::new(
            rustls::crypto::ring::default_provider(),
        ))
        .with_safe_default_protocol_versions()
        .map_err(|_| "queue TLS protocol")?
        .with_no_client_auth()
        .with_single_cert(certs, key)
        .map_err(|_| "queue TLS config")?;
        let tcp = TcpListener::bind("127.0.0.1:0")
            .await
            .map_err(|_| "queue listener")?;
        let origin = format!("https://{}", tcp.local_addr().map_err(|_| "queue address")?);
        let data = Arc::new(QueueData {
            provider,
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
            ca: transport.ca.clone(),
            data,
            task,
            _transport: transport,
        })
    }
    pub fn mode(&self, mode: u8) {
        self.data.mode.store(mode, Ordering::SeqCst);
    }
    pub fn requests(&self) -> Vec<(String, String)> {
        self.data.requests.lock().unwrap().clone()
    }
    pub async fn wait_entered(&self) {
        self.data.entered.notified().await;
    }
    pub fn release(&self) {
        self.data.release.notify_one();
    }
}
impl Drop for Queues {
    fn drop(&mut self) {
        self.task.abort();
    }
}
