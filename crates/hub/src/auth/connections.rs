//! Owner enrollment and authenticated disclosure around bounded external IO.
use super::*;
use crate::providers::crafty::{self, Enrollment, Overview};
use zeroize::Zeroizing;

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/api/owner/crafty", get(status).put(replace))
        .layer(DefaultBodyLimit::max(32768))
        .with_state(service)
}
async fn status(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result=async {
        let p=workspace::bound(&service,&headers,false).await?;
        let current=store::connections::capture(&service.pool,&service.key_id,&p.hash,true).await?;
        Ok::<_,ApiError>(Json(json!({"revision":current.revision.to_string(),"configured":current.sealed.is_some()})).into_response())
    }.await;
    result.unwrap_or_else(private_error)
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Replacement {
    base_revision: String,
    connection: Option<Enrollment>,
}
async fn replace(
    State(service): State<Service>,
    headers: HeaderMap,
    input: Result<Json<Replacement>, JsonRejection>,
) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, true).await?;
        // Role admission precedes validation/encryption; effect rechecks it.
        store::connections::capture(&service.pool, &service.key_id, &p.hash, true).await?;
        let input = payload(input)?;
        let base = input
            .base_revision
            .parse::<i64>()
            .ok()
            .filter(|n| *n >= 0 && n.to_string() == input.base_revision)
            .ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
        let next = base
            .checked_add(1)
            .ok_or(ApiError(StatusCode::CONFLICT, "conflict"))?;
        let sealed = if let Some(ref connection) = input.connection {
            connection
                .validate()
                .map_err(|_| ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
            let bytes = Zeroizing::new(
                serde_json::to_vec(connection)
                    .map_err(|_| ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?,
            );
            Some(service.secrets.seal_connection(next, &bytes)?)
        } else {
            None
        };
        let revision = store::connections::replace(
            &service.pool,
            &service.key_id,
            &p.hash,
            base,
            sealed.as_deref(),
        )
        .await?;
        Ok::<_, ApiError>(
            Json(json!({"revision":revision.to_string(),"configured":sealed.is_some()}))
                .into_response(),
        )
    }
    .await;
    result.unwrap_or_else(private_error)
}

pub(super) async fn observe(service: &Service, verifier: &[u8]) -> Result<Overview, ApiError> {
    let capture =
        store::connections::capture(&service.pool, &service.key_id, verifier, false).await?;
    let Some(sealed) = capture.sealed else {
        return Ok(crafty::empty(capture.revision));
    };
    let plaintext = match service.secrets.open_connection(capture.revision, &sealed) {
        Ok(v) => v,
        Err(_) => return Ok(crafty::unavailable(capture.revision)),
    };
    let config = match serde_json::from_slice::<Enrollment>(&plaintext) {
        Ok(v) if v.validate().is_ok() => v,
        _ => return Ok(crafty::unavailable(capture.revision)),
    };
    // No transaction remains open here. The final workspace read reauthorizes
    // after provider IO and captures the current connection revision atomically.
    Ok(service.observer.observe(&config, capture.revision).await)
}
