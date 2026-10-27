//! Concrete fictional Jellyfin/Seerr HTTPS payloads. Expectations belong to callers.
use super::*;
use axum::body::Body;
use std::collections::BTreeMap;

pub const TOKEN: &str = "dedicated-media-fixture-token-2026";
pub const LIBRARY_ID: &str = "11111111111111111111111111111111";
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
pub const DETAIL_FAILED: u8 = 11;
pub const TOO_MANY_SESSIONS: u8 = 12;
pub const MANY: u8 = 13;

struct MediaData {
    mode: AtomicU8,
    requests: Mutex<Vec<(String, String)>>,
    entered: Notify,
    release: Notify,
}

pub struct Media {
    pub origin: String,
    pub ca: String,
    data: Arc<MediaData>,
    task: JoinHandle<()>,
    // Own the existing fixture's private generated certificate directory.
    _transport: Crafty,
}

fn query(request: &Request) -> Option<BTreeMap<&str, &str>> {
    let mut fields = BTreeMap::new();
    for field in request.uri().query().unwrap_or("").split('&') {
        if field.is_empty() {
            continue;
        }
        let (key, value) = field.split_once('=')?;
        if fields.insert(key, value).is_some() {
            return None;
        }
    }
    Some(fields)
}

fn page_offset(request: &Request, jellyfin: bool) -> Option<usize> {
    let fields = query(request)?;
    let expected: &[(&str, &str)] = if jellyfin {
        &[
            ("parentId", LIBRARY_ID),
            ("recursive", "true"),
            ("limit", "12"),
            ("enableUserData", "false"),
            ("enableImages", "false"),
            ("enableTotalRecordCount", "true"),
            ("sortBy", "SortName"),
            ("sortOrder", "Ascending"),
        ]
    } else {
        &[
            ("take", "12"),
            ("filter", "all"),
            ("sort", "added"),
            ("sortDirection", "desc"),
            ("mediaType", "all"),
        ]
    };
    if expected
        .iter()
        .any(|(key, value)| fields.get(key) != Some(value))
    {
        return None;
    }
    if jellyfin
        && !matches!(
            fields.get("includeItemTypes"),
            Some(&"Movie,Series" | &"Movie%2CSeries" | &"Movie%2cSeries")
        )
    {
        return None;
    }
    let offset = fields.get(if jellyfin { "startIndex" } else { "skip" })?;
    if !matches!(*offset, "0" | "12" | "24" | "36" | "48") {
        return None;
    }
    let expected_count = expected.len() + if jellyfin { 2 } else { 1 };
    (fields.len() == expected_count)
        .then(|| offset.parse().ok())
        .flatten()
}

fn title(index: usize, request: bool) -> String {
    match (index, request) {
        (0, false) => "Fixture movie".into(),
        (1, false) => "Fixture series".into(),
        (0, true) => "Requested movie".into(),
        (1, true) => "Requested series".into(),
        (_, false) => format!("Fixture item {}", index + 1),
        (_, true) => format!("Requested item {}", index + 1),
    }
}

async fn handler(State(data): State<Arc<MediaData>>, request: Request) -> Response {
    let path = request.uri().path();
    data.requests
        .lock()
        .unwrap()
        .push((request.method().to_string(), request.uri().to_string()));
    if request.method() != axum::http::Method::GET {
        return StatusCode::METHOD_NOT_ALLOWED.into_response();
    }
    let jellyfin = matches!(path, "/Items" | "/Sessions");
    let authorized = if jellyfin {
        request
            .headers()
            .get("authorization")
            .and_then(|h| h.to_str().ok())
            == Some(&format!("MediaBrowser Token=\"{TOKEN}\""))
            && request.headers().get("x-emby-token").is_none()
            && request.headers().get("x-emby-authorization").is_none()
            && request.headers().get("x-api-key").is_none()
    } else {
        request
            .headers()
            .get("x-api-key")
            .and_then(|h| h.to_str().ok())
            == Some(TOKEN)
            && request.headers().get("x-api-user").is_none()
            && request.headers().get("authorization").is_none()
    };
    if !authorized {
        return StatusCode::UNAUTHORIZED.into_response();
    }
    let mode = data.mode.load(Ordering::SeqCst);
    if mode == HOLD {
        data.entered.notify_one();
        let _ = tokio::time::timeout(Duration::from_secs(6), data.release.notified()).await;
    }
    if mode == TIMEOUT {
        tokio::time::sleep(Duration::from_secs(3)).await;
    }
    match mode {
        DENIED => return StatusCode::FORBIDDEN.into_response(),
        REDIRECT => {
            return (
                StatusCode::FOUND,
                [("location", "https://media-never-follow.invalid/")],
            )
                .into_response();
        }
        MALFORMED => {
            return ([("content-type", "application/json")], "{broken-media").into_response();
        }
        DUPLICATE => {
            let body = if jellyfin {
                r#"{"Items":[],"Items":[],"TotalRecordCount":0,"StartIndex":0}"#
            } else {
                r#"{"pageInfo":{"pages":0,"pageSize":12,"results":0,"page":1},"results":[],"results":[],"serviceErrors":{}}"#
            };
            return ([("content-type", "application/json")], body).into_response();
        }
        LARGE => return "x".repeat(262145).into_response(),
        CHUNKED => {
            // A stream has no declared Content-Length; the reader must enforce
            // its own cumulative cap rather than trusting response metadata.
            let stream = Body::from(vec![b'x'; 262145]).into_data_stream();
            return Response::new(Body::from_stream(stream));
        }
        _ => {}
    }
    if path == "/Items" {
        let Some(offset) = page_offset(&request, true) else {
            return StatusCode::BAD_REQUEST.into_response();
        };
        let total = if mode == EMPTY {
            0
        } else if mode == MANY {
            80
        } else {
            26
        };
        let rows: Vec<_> = (offset..usize::min(total, offset + 12))
            .map(|index| {
                let mut row = json!({
                    "Id":format!("{:032x}",index+1),
                    "Name":title(index,false),"Type":if index%2==0{"Movie"}else{"Series"},
                    "ProductionYear":2024+index%2,
                    "Path":"/private/media-fixture-path","UserData":{"Played":true},
                    "ProviderIds":{"secret":"PRIVATE_MEDIA_PROVIDER_ID"},
                    "MediaSources":[{"Path":"https://media-private.invalid/secret"}],
                    "ImageTags":{"Primary":"PRIVATE_MEDIA_IMAGE"}
                });
                if mode == MISSING && index == offset {
                    row.as_object_mut().unwrap().remove("Name");
                }
                row
            })
            .collect();
        return Json(json!({"Items":rows,"TotalRecordCount":total,"StartIndex":offset}))
            .into_response();
    }
    if path == "/Sessions" {
        if query(&request) != Some(BTreeMap::from([("activeWithinSeconds", "120")])) {
            return StatusCode::BAD_REQUEST.into_response();
        }
        let rows = if mode == EMPTY {
            vec![]
        } else if mode == TOO_MANY_SESSIONS {
            vec![json!({"NowPlayingItem":null}); 257]
        } else {
            let mut playing = json!({"Id":"PRIVATE_MEDIA_SESSION_ID","UserId":"PRIVATE_MEDIA_USER_ID","UserName":"PRIVATE_MEDIA_USERNAME","RemoteEndPoint":"198.51.100.77","DeviceId":"PRIVATE_MEDIA_DEVICE_ID","NowPlayingItem":{"Id":"PRIVATE_WATCH_ID","Name":"PRIVATE_WATCH_TITLE"},"PlayState":{"IsPaused":false}});
            if mode == MISSING {
                playing["PlayState"] = json!({});
            }
            vec![
                playing,
                json!({"NowPlayingItem":{"Id":"PRIVATE_PAUSED_ID","Name":"PRIVATE_PAUSED_TITLE"},"PlayState":{"IsPaused":true}}),
                json!({"NowPlayingItem":null,"UserName":"PRIVATE_IDLE_USER"}),
            ]
        };
        return Json(rows).into_response();
    }
    if path == "/api/v1/request" {
        let Some(offset) = page_offset(&request, false) else {
            return StatusCode::BAD_REQUEST.into_response();
        };
        let total = if mode == EMPTY {
            0
        } else if mode == MANY {
            80
        } else {
            26
        };
        let rows: Vec<_> = (offset..usize::min(total, offset+12)).map(|index|json!({
            "id":index+1,"status":if index==1{5}else{index%5+1},"type":if index%2==0{"movie"}else{"tv"},"is4k":false,
            "createdAt":"2026-10-27T12:00:00Z","updatedAt":"2026-10-27T12:01:00Z",
            "media":{"tmdbId":1001+index,"mediaType":if index%2==0{"movie"}else{"tv"},"status":6,"rootFolder":"/private/media-fixture-path","externalServiceId":"PRIVATE_MEDIA_SERVICE_ID"},
            "requestedBy":{"email":"private-media-email@example.invalid","displayName":"PRIVATE_REQUESTER","plexToken":"PRIVATE_REQUESTER_TOKEN"},
            "modifiedBy":{"email":"PRIVATE_MODIFIER_EMAIL"},"profileId":"PRIVATE_PROFILE_ID"
        })).collect();
        return Json(json!({"pageInfo":{"pages":total.div_ceil(12),"pageSize":12,"results":total,"page":offset/12+1},"results":rows,"serviceErrors":{}})).into_response();
    }
    let detail = path
        .strip_prefix("/api/v1/movie/")
        .map(|id| (id, "title"))
        .or_else(|| path.strip_prefix("/api/v1/tv/").map(|id| (id, "name")));
    if let Some((id, field)) = detail {
        if !request.uri().query().unwrap_or("").is_empty() {
            return StatusCode::BAD_REQUEST.into_response();
        }
        let Some(index) = id
            .parse::<usize>()
            .ok()
            .filter(|v| (1001..=1080).contains(v))
            .map(|v| v - 1001)
        else {
            return StatusCode::NOT_FOUND.into_response();
        };
        if mode == DETAIL_FAILED {
            return StatusCode::BAD_GATEWAY.into_response();
        }
        if mode == MISSING {
            return Json(json!({})).into_response();
        }
        return Json(json!({(field):title(index,true),"overview":"PRIVATE_MEDIA_OVERVIEW","posterPath":"PRIVATE_MEDIA_POSTER","externalIds":{"secret":"PRIVATE_MEDIA_PROVIDER_ID"}})).into_response();
    }
    StatusCode::NOT_FOUND.into_response()
}

impl Media {
    pub async fn start() -> Result<Self, &'static str> {
        let transport = Crafty::start().await?;
        transport.task.abort();
        let certs = CertificateDer::pem_file_iter(transport.root.join("leaf.pem"))
            .map_err(|_| "media fixture cert")?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|_| "media fixture cert decode")?;
        let key = PrivateKeyDer::from_pem_file(transport.root.join("leaf.key"))
            .map_err(|_| "media fixture key")?;
        let tls = rustls::ServerConfig::builder_with_provider(Arc::new(
            rustls::crypto::ring::default_provider(),
        ))
        .with_safe_default_protocol_versions()
        .map_err(|_| "media TLS protocol")?
        .with_no_client_auth()
        .with_single_cert(certs, key)
        .map_err(|_| "media TLS config")?;
        let tcp = TcpListener::bind("127.0.0.1:0")
            .await
            .map_err(|_| "media listener")?;
        let origin = format!("https://{}", tcp.local_addr().map_err(|_| "media address")?);
        let data = Arc::new(MediaData {
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
    pub async fn entered(&self) {
        self.data.entered.notified().await;
    }
    pub fn release(&self) {
        self.data.release.notify_waiters();
    }
}
impl Drop for Media {
    fn drop(&mut self) {
        self.task.abort();
    }
}
