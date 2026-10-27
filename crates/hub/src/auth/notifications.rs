use super::*;

pub fn router(service: Service) -> Router {
    Router::new()
        .route(
            "/api/workspace/notifications/read",
            axum::routing::put(mark_read),
        )
        .layer(DefaultBodyLimit::max(2048))
        .with_state(service)
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Read {
    category: String,
    through: String,
}
async fn mark_read(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<Read>, JsonRejection>,
) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, true).await?;
        let input = payload(body)?;
        if !["services", "connections"].contains(&input.category.as_str()) {
            return Err(ApiError(StatusCode::BAD_REQUEST, "invalid_request"));
        }
        let through = crate::directory::decimal(&input.through, false).ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
        let read = store::notifications::mark_read(&service.pool, &service.key_id, &p.hash, &input.category, through).await?;
        Ok::<_, ApiError>(Json(json!({"product":"keida-hub-reborn","contract":"reborn-workspace-v1","schema":1,"account":account(read.session.account),"session_generation":read.session.generation.to_string(),"notifications":read.notifications})).into_response())
    }.await;
    result.unwrap_or_else(private_error)
}
