//! Selected Home game reads have their own bounded observer, never a wake path.
use super::*;
use crate::providers::crafty::Enrollment;

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/api/workspace/games", get(observe))
        .with_state(service)
}

async fn observe(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, false).await?;
        let captured = store::connections::capture(
            &service.pool, &service.key_id, &p.hash, false,
        ).await?;
        let config = if let Some(sealed) = &captured.sealed {
            let plaintext = service.secrets.open_connection(captured.revision, sealed)
                .map_err(|_| ApiError(StatusCode::SERVICE_UNAVAILABLE, "unavailable"))?;
            let value: Enrollment = serde_json::from_slice(&plaintext)
                .map_err(|_| ApiError(StatusCode::SERVICE_UNAVAILABLE, "unavailable"))?;
            value.validate().map_err(|_| ApiError(StatusCode::SERVICE_UNAVAILABLE, "unavailable"))?;
            Some(value)
        } else { None };
        let ids = config.as_ref().map_or_else(Vec::new, |c| c.servers.iter().map(|s| s.id.clone()).collect());
        // No transaction or authority lock crosses network IO. This observer
        // sends only server-list status packets to the host-reviewed gateway.
        let observed = service.game_observer.observe(captured.revision, &ids).await;
        let current = store::connections::capture(
            &service.pool, &service.key_id, &p.hash, false,
        ).await?;
        if current.revision != captured.revision {
            return Err(ApiError(StatusCode::CONFLICT, "conflict"));
        }
        let servers: Vec<_> = config.as_ref().map_or_else(Vec::new, |c| c.servers.iter().map(|s| {
            let join = if s.join.is_empty() { service.game_observer.public_join(&s.id).unwrap_or_default() } else { s.join.clone() };
            json!({"name":s.name,"join":join,"gateway":observed.as_ref().and_then(|v|v.get(&s.id))})
        }).collect());
        Ok::<_, ApiError>(Json(json!({
            "product":"keida-hub-reborn", "contract":"reborn-workspace-v1", "schema":1,
            "account":account(current.session.account), "session_generation":current.session.generation.to_string(),
            "revision":current.revision.to_string(), "configured":config.is_some(),
            "checking":observed.is_none(), "servers":servers
        })).into_response())
    }.await;
    result.unwrap_or_else(private_error)
}
