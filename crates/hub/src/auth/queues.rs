//! Owner-only queue access; no provider IO enters private note/workspace reads.
use super::*;
use crate::providers::queues::{self, Enrollment, Provider};
use axum::extract::{Query, rejection::QueryRejection};
use zeroize::Zeroizing;

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/api/owner/queues/{provider}", get(status).put(replace))
        .route("/api/workspace/queues/{provider}", get(observe))
        .layer(DefaultBodyLimit::max(32768))
        .with_state(service)
}

fn provider(path: Result<Path<String>, PathRejection>) -> Result<Provider, ApiError> {
    let Path(path) = path.map_err(|_| ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
    Provider::parse(&path).ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request"))
}

async fn status(
    State(service): State<Service>,
    headers: HeaderMap,
    path: Result<Path<String>, PathRejection>,
) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, false).await?;
        let provider = provider(path)?;
        let current =
            store::queues::capture(&service.pool, &service.key_id, &p.hash, provider).await?;
        Ok::<_, ApiError>(
            Json(json!({"revision":current.revision.to_string(),"configured":current.sealed.is_some(),"profile":provider.profile()}))
                .into_response(),
        )
    }
    .await;
    result.unwrap_or_else(private_error)
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Replacement {
    base_revision: String,
    #[serde(deserialize_with = "required_connection")]
    connection: Option<Enrollment>,
}

// An explicit null removes enrollment. An omitted field must not silently
// reinterpret an incomplete save request as deliberate credential removal.
fn required_connection<'de, D>(deserializer: D) -> Result<Option<Enrollment>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    Option::deserialize(deserializer)
}

async fn replace(
    State(service): State<Service>,
    headers: HeaderMap,
    path: Result<Path<String>, PathRejection>,
    input: Result<Json<Replacement>, JsonRejection>,
) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, true).await?;
        let provider = provider(path)?;
        // Admission precedes validation/encryption. The actual write repeats
        // key, owner, session and revision checks under the authority lock.
        store::queues::capture(&service.pool, &service.key_id, &p.hash, provider).await?;
        let input = payload(input)?;
        let base = crate::directory::decimal(&input.base_revision, false)
            .ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
        let next = base
            .checked_add(1)
            .ok_or(ApiError(StatusCode::CONFLICT, "conflict"))?;
        let sealed = if let Some(ref connection) = input.connection {
            connection
                .validate(provider)
                .map_err(|_| ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
            let plaintext = Zeroizing::new(
                serde_json::to_vec(connection)
                    .map_err(|_| ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?,
            );
            Some(service.secrets.seal_queues(provider, next, &plaintext)?)
        } else {
            None
        };
        let revision = store::queues::replace(
            &service.pool,
            &service.key_id,
            &p.hash,
            provider,
            base,
            sealed.as_deref(),
        )
        .await?;
        Ok::<_, ApiError>(
            Json(json!({"revision":revision.to_string(),"configured":sealed.is_some(),"profile":provider.profile()}))
                .into_response(),
        )
    }
    .await;
    result.unwrap_or_else(private_error)
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Filter {
    offset: Option<String>,
}

async fn observe(
    State(service): State<Service>,
    headers: HeaderMap,
    path: Result<Path<String>, PathRejection>,
    filter: Result<Query<Filter>, QueryRejection>,
) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, false).await?;
        let provider = provider(path)?;
        // Authorization precedes query parsing and decryption. This capture
        // commits before demand collection or any provider network IO starts.
        let captured =
            store::queues::capture(&service.pool, &service.key_id, &p.hash, provider).await?;
        let Query(filter) =
            filter.map_err(|_| ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
        let offset = match filter.offset.as_deref().unwrap_or("0") {
            "0" => 0,
            "12" => 12,
            "24" => 24,
            "36" => 36,
            "48" => 48,
            _ => return Err(ApiError(StatusCode::BAD_REQUEST, "invalid_request")),
        };
        let configured = captured.sealed.is_some();
        let observation = if let Some(sealed) = captured.sealed {
            match service
                .secrets
                .open_queues(provider, captured.revision, &sealed)
            {
                Ok(plaintext) => match serde_json::from_slice::<Enrollment>(&plaintext) {
                    Ok(config) if config.validate(provider).is_ok() => {
                        service
                            .queue_observer
                            .observe(provider, Arc::new(config), captured.revision, offset)
                            .await
                    }
                    _ => queues::unavailable(provider, captured.revision, offset),
                },
                Err(_) => queues::unavailable(provider, captured.revision, offset),
            }
        } else {
            queues::empty(provider, captured.revision, offset)
        };
        if observation.revision != captured.revision.to_string()
            || observation.offset != offset
            || observation.configured != configured
            || observation.profile != provider.profile()
        {
            return Err(ApiError(StatusCode::SERVICE_UNAVAILABLE, "unavailable"));
        }
        let current = store::queues::admit(
            &service.pool,
            &service.key_id,
            &p.hash,
            provider,
            captured.revision,
        )
        .await?;
        Ok::<_, ApiError>(
            Json(json!({
                "product":"keida-hub-reborn", "contract":"reborn-workspace-v1", "schema":1,
                "account":account(current.account), "session_generation":current.generation.to_string(),
                "provider":provider.as_str(), "observation":observation
            }))
            .into_response(),
        )
    }
    .await;
    result.unwrap_or_else(private_error)
}
