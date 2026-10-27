use super::*;
use crate::directory::{Change, decimal};

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/api/owner/directory", axum::routing::put(edit))
        .route("/api/workspace/pins", axum::routing::put(pins))
        .layer(DefaultBodyLimit::max(8192))
        .with_state(service)
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Edit {
    base_revision: String,
    change: Change,
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Pins {
    base_directory_revision: String,
    base_revision: String,
    ids: Vec<String>,
}
fn revision(s: &str) -> Result<i64, ApiError> {
    decimal(s, false).ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request"))
}
fn rejected(e: store::Error) -> ApiError {
    if e == store::Error::Rejected {
        ApiError(StatusCode::BAD_REQUEST, "invalid_request")
    } else {
        e.into()
    }
}
async fn result(service: &Service, p: &Principal) -> Result<Response, ApiError> {
    Ok(workspace::wire(
        store::workspace::snapshot(&service.pool, &service.key_id, &p.hash).await?,
        None,
    ))
}
async fn edit(
    State(service): State<Service>,
    headers: HeaderMap,
    input: Result<Json<Edit>, JsonRejection>,
) -> Response {
    let outcome = async {
        let p = workspace::bound(&service, &headers, true).await?;
        let input = payload(input)?;
        store::directory::edit(
            &service.pool,
            &service.key_id,
            &p.hash,
            revision(&input.base_revision)?,
            input.change,
        )
        .await
        .map_err(rejected)?;
        result(&service, &p).await
    }
    .await;
    outcome.unwrap_or_else(private_error)
}
async fn pins(
    State(service): State<Service>,
    headers: HeaderMap,
    input: Result<Json<Pins>, JsonRejection>,
) -> Response {
    let outcome = async {
        let p = workspace::bound(&service, &headers, true).await?;
        let input = payload(input)?;
        let ids = input
            .ids
            .iter()
            .map(|s| decimal(s, true).ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request")))
            .collect::<Result<Vec<_>, _>>()?;
        store::directory::pins(
            &service.pool,
            &service.key_id,
            &p.hash,
            revision(&input.base_directory_revision)?,
            revision(&input.base_revision)?,
            &ids,
        )
        .await
        .map_err(rejected)?;
        result(&service, &p).await
    }
    .await;
    outcome.unwrap_or_else(private_error)
}
