//! Authenticated archive reads never contact a provider or create observations.
use super::*;
use axum::extract::{Query, rejection::QueryRejection};

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Filter {
    revision: Option<String>,
    through: Option<String>,
    before: Option<String>,
}

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/api/workspace/observations", get(page))
        .with_state(service)
}

async fn page(
    State(service): State<Service>,
    headers: HeaderMap,
    filter: Result<Query<Filter>, QueryRejection>,
) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, false).await?;
        let Query(filter) =
            filter.map_err(|_| ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
        let parse = |v: Option<String>, positive| {
            v.map(|s| {
                crate::directory::decimal(&s, positive)
                    .ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request"))
            })
            .transpose()
        };
        let revision = parse(filter.revision, false)?;
        let through = parse(filter.through, false)?;
        let before = parse(filter.before, true)?;
        if ((through.is_some() || before.is_some()) && revision.is_none())
            || before.is_some_and(|b| through.is_none_or(|t| b > t))
        {
            return Err(ApiError(StatusCode::BAD_REQUEST, "invalid_request"));
        }
        let page = store::observations::page(
            &service.pool,
            &service.key_id,
            &p.hash,
            revision,
            through,
            before,
        )
        .await
        .map_err(|error| {
            if error == store::Error::Rejected {
                ApiError(StatusCode::BAD_REQUEST, "invalid_request")
            } else {
                error.into()
            }
        })?;
        Ok::<_, ApiError>(Json(json!({
            "product":"keida-hub-reborn", "contract":"reborn-workspace-v1", "schema":1,
            "account":account(page.session.account), "session_generation":page.session.generation.to_string(),
            "current_revision":page.current_revision.to_string(), "through":page.through.to_string(),
            "next_before":page.next.map(|v|v.to_string()), "entries":page.entries
        })).into_response())
    }
    .await;
    result.unwrap_or_else(private_error)
}
