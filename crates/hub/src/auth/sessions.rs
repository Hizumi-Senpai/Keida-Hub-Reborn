//! Scoped JSON for personal active-session review. No provider IO or cookie
//! mutation is part of targeted sign-out, including rejected/uncertain requests.
use super::{store::sessions as db, *};

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/api/workspace/sessions", get(list))
        .route("/api/workspace/sessions/revoke", post(revoke))
        .layer(DefaultBodyLimit::max(8192))
        .with_state(service)
}

fn wire(captured: db::Snapshot, signed_out: bool) -> Response {
    let entries: Vec<_> = captured.sessions.into_iter().map(|row| {
        json!({"id":row.id,"created_at":row.created_at.to_string(),"expires_at":row.expires_at.to_string(),"current":row.current})
    }).collect();
    let mut value = json!({"product":"keida-hub-reborn","contract":"reborn-workspace-v1","schema":1,
        "account":account(captured.session.account),"session_generation":captured.session.generation.to_string(),
        "checked_at":captured.checked_at.to_string(),"sessions":entries});
    if signed_out {
        value["result"] = json!("signed_out");
    }
    Json(value).into_response()
}
async fn list(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, false).await?;
        let captured = db::list(&service.pool, &service.key_id, &p.hash).await?;
        Ok::<_, ApiError>(wire(captured, false))
    }
    .await;
    result.unwrap_or_else(IntoResponse::into_response)
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Revoke {
    session_id: String,
}
async fn revoke(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<Revoke>, JsonRejection>,
) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, true).await?;
        let input = payload(body)?;
        if !db::canonical_id(&input.session_id) {
            return Err(ApiError(StatusCode::BAD_REQUEST, "invalid_request"));
        }
        let captured =
            db::revoke(&service.pool, &service.key_id, &p.hash, &input.session_id).await?;
        Ok::<_, ApiError>(wire(captured, true))
    }
    .await;
    // private_error/cleared would clear SESSION on401; this endpoint must never
    // change either real authentication cookie, even when its actor has ended.
    result.unwrap_or_else(IntoResponse::into_response)
}
