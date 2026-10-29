//! Per-account tile arrangement; provider and game effects are outside this API.
use super::*;
use crate::tiles::{self, Tile};

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/api/workspace/tiles", get(read).put(save))
        .layer(DefaultBodyLimit::max(2048))
        .with_state(service)
}

async fn bound(service: &Service, headers: &HeaderMap, write: bool) -> Result<Principal, ApiError> {
    if one(headers, "x-reborn-tiles-contract") != Some(tiles::CONTRACT) {
        return Err(ApiError(StatusCode::UPGRADE_REQUIRED, "upgrade_required"));
    }
    workspace::bound(service, headers, write).await
}

fn wire(view: store::tiles::View) -> Response {
    let owner = view.session.account.role == "owner";
    Json(json!({
        "product":"keida-hub-reborn", "contract":"reborn-workspace-v1", "schema":1,
        "account":account(view.session.account),
        "session_generation":view.session.generation.to_string(),
        "tiles_contract":tiles::CONTRACT,
        "catalog":tiles::catalog(owner), "defaults":tiles::defaults(owner),
        "layout":view.layout
    }))
    .into_response()
}

async fn read(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result = async {
        let p = bound(&service, &headers, false).await?;
        Ok::<_, ApiError>(wire(
            store::tiles::read(&service.pool, &service.key_id, &p.hash).await?,
        ))
    }
    .await;
    result.unwrap_or_else(private_error)
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Save {
    base_revision: String,
    tiles: Vec<Tile>,
}

async fn save(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<Save>, JsonRejection>,
) -> Response {
    let result = async {
        let p = bound(&service, &headers, true).await?;
        let input = payload(body)?;
        let base = crate::directory::decimal(&input.base_revision, false)
            .ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
        let saved = store::tiles::save(
            &service.pool,
            &service.key_id,
            &p.hash,
            base,
            &input.tiles,
        )
        .await
        .map_err(|error| {
            if error == store::Error::Rejected {
                ApiError(StatusCode::BAD_REQUEST, "invalid_request")
            } else {
                error.into()
            }
        })?;
        Ok::<_, ApiError>(wire(saved))
    }
    .await;
    result.unwrap_or_else(private_error)
}
