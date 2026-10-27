//! One client-mounted Svelte application over Rust-owned account/note authority.
use super::workspace_assets as assets;
use super::*;
use axum::response::{Html, Redirect};

const CONTRACT: &str = "reborn-workspace-v1";
const DOCUMENT: &str = include_str!("../../static/workspace.html");
const CSP: &str = "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'";

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/", get(|| async { Redirect::to("/workspace") }))
        .route("/workspace", get(document))
        .route("/api/workspace/snapshot", get(snapshot))
        .route("/api/workspace/note", axum::routing::put(save))
        .route("/assets/workspace/{file}", get(asset))
        .layer(DefaultBodyLimit::max(8192))
        .with_state(service)
}

async fn schema(service: &Service) -> Result<(), ApiError> {
    if crate::database::ready(&service.pool).await {
        Ok(())
    } else {
        Err(ApiError(StatusCode::SERVICE_UNAVAILABLE, "unavailable"))
    }
}
pub(super) async fn bound(
    service: &Service,
    headers: &HeaderMap,
    write: bool,
) -> Result<Principal, ApiError> {
    if one(headers, "x-reborn-product") != Some("keida-hub-reborn")
        || one(headers, "x-reborn-contract") != Some(CONTRACT)
    {
        return Err(ApiError(StatusCode::UPGRADE_REQUIRED, "upgrade_required"));
    }
    if write && one(headers, "origin") != Some(service.origin.as_ref()) {
        return Err(ApiError(StatusCode::FORBIDDEN, "origin_rejected"));
    }
    schema(service).await?;
    let csrf =
        one(headers, "x-csrf-token").ok_or(ApiError(StatusCode::FORBIDDEN, "csrf_rejected"))?;
    principal_csrf(service, headers, Some(csrf)).await
}
async fn document(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result = async {
        schema(&service).await?;
        let p = principal_csrf(&service, &headers, None).await?;
        let binding = service.secrets.session_csrf(&p.token)?;
        let identity = crate::identity::compiled();
        // Replacements are canonical hex or restricted compiled identity fields,
        // never usernames, note text, request values or unescaped arbitrary JSON.
        let html = DOCUMENT
            .replace("{{SCRIPT}}", assets::script())
            .replace("{{STYLE}}", assets::style())
            .replace("{{BINDING}}", &binding)
            .replace("{{VERSION}}", identity.version)
            .replace("{{COMMIT}}", identity.commit)
            .replace("{{TREE}}", identity.tree)
            .replace("{{CHANNEL}}", identity.channel);
        Ok::<_, ApiError>(Html(html).into_response())
    }
    .await;
    let mut response = match result {
        Ok(r) => r,
        Err(ApiError(StatusCode::UNAUTHORIZED, _)) => {
            let mut r = Redirect::to("/account/sign-in").into_response();
            clear_session(&mut r);
            r
        }
        Err(e) => (
            e.0,
            Html("Workspace access is unavailable. <a href=\"/account\">Check your account</a>."),
        )
            .into_response(),
    };
    response.headers_mut().insert(
        header::CONTENT_SECURITY_POLICY,
        HeaderValue::from_static(CSP),
    );
    response.headers_mut().insert(
        header::REFERRER_POLICY,
        HeaderValue::from_static("same-origin"),
    );
    response
}
async fn asset(Path(file): Path<String>) -> Response {
    let path = format!("/assets/workspace/{file}");
    match assets::find(&path) {
        Some((media, bytes)) => (
            [
                (header::CONTENT_TYPE, media),
                (header::CACHE_CONTROL, "public, max-age=31536000, immutable"),
            ],
            bytes,
        )
            .into_response(),
        None => StatusCode::NOT_FOUND.into_response(),
    }
}
pub(super) fn wire(
    snapshot: store::workspace::Snapshot,
    overview: Option<crate::providers::crafty::Overview>,
) -> Response {
    let waiting = || {
        let mut v = crate::providers::crafty::empty(snapshot.connection_revision);
        v.configured = snapshot.connection_configured;
        v.error = if v.configured { Some("checking") } else { None };
        v
    };
    let overview = overview
        .map(|value| {
            if value.revision == snapshot.connection_revision.to_string() {
                value
            } else {
                waiting()
            }
        })
        .unwrap_or_else(waiting);
    Json(json!({"product":"keida-hub-reborn", "contract":CONTRACT, "schema":1,
        "account":account(snapshot.session.account), "session_generation":snapshot.session.generation.to_string(),
        "note":{"body":snapshot.note.body,"revision":snapshot.note.revision.to_string()}, "crafty":overview, "directory":snapshot.directory})).into_response()
}
async fn snapshot(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result = async {
        let p = bound(&service, &headers, false).await?;
        let overview = super::connections::observe(&service, &p.hash).await?;
        Ok::<_, ApiError>(wire(
            store::workspace::snapshot(&service.pool, &service.key_id, &p.hash).await?,
            Some(overview),
        ))
    }
    .await;
    result.unwrap_or_else(private_error)
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Save {
    body: String,
    base_revision: String,
}
async fn save(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<Save>, JsonRejection>,
) -> Response {
    let result = async {
        let p = bound(&service, &headers, true).await?;
        let input = payload(body)?;
        let base = input
            .base_revision
            .parse::<i64>()
            .ok()
            .filter(|n| *n >= 0 && n.to_string() == input.base_revision)
            .ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
        let saved =
            store::workspace::save(&service.pool, &service.key_id, &p.hash, &input.body, base)
                .await
                .map_err(|e| {
                    if e == store::Error::Rejected {
                        ApiError(StatusCode::BAD_REQUEST, "invalid_request")
                    } else {
                        e.into()
                    }
                })?;
        Ok::<_, ApiError>(wire(saved, None))
    }
    .await;
    result.unwrap_or_else(private_error)
}
