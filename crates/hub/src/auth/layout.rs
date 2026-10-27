use super::*;

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/api/workspace/layout", axum::routing::put(save))
        .layer(DefaultBodyLimit::max(2048))
        .with_state(service)
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Save {
    base_revision: String,
    panels: Vec<store::layout::Panel>,
}

async fn save(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<Save>, JsonRejection>,
) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, true).await?;
        let input = payload(body)?;
        let base = crate::directory::decimal(&input.base_revision, false)
            .ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
        let saved =
            store::layout::save(&service.pool, &service.key_id, &p.hash, base, &input.panels)
                .await
                .map_err(|error| {
                    if error == store::Error::Rejected {
                        ApiError(StatusCode::BAD_REQUEST, "invalid_request")
                    } else {
                        error.into()
                    }
                })?;
        Ok::<_, ApiError>(
            Json(json!({
                "product":"keida-hub-reborn",
                "contract":"reborn-workspace-v1",
                "schema":1,
                "account":account(saved.session.account),
                "session_generation":saved.session.generation.to_string(),
                "layout":saved.layout
            }))
            .into_response(),
        )
    }
    .await;
    result.unwrap_or_else(private_error)
}
