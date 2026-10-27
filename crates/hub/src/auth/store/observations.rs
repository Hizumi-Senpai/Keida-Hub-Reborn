//! Normalized sampled history under the existing account/connection authority.
//! No provider request or credential decryption happens inside these transactions.
use super::{Error, Session, actor, checked_key, locked};
use crate::providers::crafty::Overview;
use serde::Serialize;
use sqlx::PgPool;

fn allowed_error(value: Option<&str>) -> bool {
    value.is_none_or(|v| {
        matches!(
            v,
            "unavailable"
                | "invalid_configuration"
                | "timeout"
                | "transport"
                | "denied"
                | "provider_error"
                | "oversized"
                | "malformed"
                | "not_discovered"
        )
    })
}

// This boundary accepts only the bounded normalized result of our concrete
// observer, never arbitrary provider JSON or browser-supplied history entries.
fn valid(value: &Overview, revision: i64) -> bool {
    value.configured
        && revision > 0
        && value.revision == revision.to_string()
        && value.sample_id.as_ref().is_some_and(|v| v.len() == 16)
        && value.checked_at.is_some_and(|v| v >= 0)
        && allowed_error(value.error)
        && (1..=8).contains(&value.servers.len())
        && value.servers.iter().all(|v| {
            !v.name.trim().is_empty()
                && v.name.len() <= 80
                && !v.name.chars().any(char::is_control)
                && matches!(v.state, "running" | "stopped" | "unknown")
                && v.players.is_none_or(|n| n <= 1_000_000)
                && v.capacity.is_none_or(|n| n <= 1_000_000)
                && v.collected_at.is_none_or(|n| n >= 0)
                && v.provider_at.is_none_or(|n| n >= 0)
                && matches!(v.sampled_freshness, "fresh" | "stale" | "unknown")
                && allowed_error(v.error)
        })
}

pub async fn record(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    revision: i64,
    value: &Overview,
) -> Result<(), Error> {
    if !valid(value, revision) {
        return Err(Error::Unavailable);
    }
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    actor(&mut tx, verifier, state.now).await?;
    let current = sqlx::query!(
        "SELECT revision, sealed IS NOT NULL AS \"configured!\" FROM crafty_connection WHERE singleton = TRUE"
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    if current.revision != revision || !current.configured {
        // Enrollment was replaced/removed during provider IO. Neither stale
        // names nor obsolete failure metadata enter the retained archive.
        return Ok(());
    }
    let complete = value.error.is_none()
        && value.servers.iter().all(|v| {
            v.error.is_none()
                && v.state != "unknown"
                && v.players.is_some()
                && v.capacity.is_some()
                && v.provider_at.is_some()
        });
    let id = sqlx::query_scalar!(
        "INSERT INTO provider_observations (sample_id, connection_revision, checked_at, complete, error) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING RETURNING id",
        value.sample_id.as_deref(), revision, value.checked_at, complete, value.error
    )
    .fetch_optional(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    if let Some(id) = id {
        for (index, server) in value.servers.iter().enumerate() {
            sqlx::query!(
                "INSERT INTO provider_server_observations (batch_id, ordinal, name, state, players, capacity, collected_at, provider_at, freshness, error) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)",
                id,
                (index + 1) as i16,
                server.name,
                server.state,
                server.players.map(|v| v as i64),
                server.capacity.map(|v| v as i64),
                server.collected_at,
                server.provider_at,
                server.sampled_freshness,
                server.error
            )
            .execute(&mut *tx)
            .await
            .map_err(|_| Error::Unavailable)?;
        }
        // Only owned observation metadata is prunable. Other histories and all
        // personal state remain outside this narrowly granted DELETE authority.
        sqlx::query!(
            "DELETE FROM provider_observations WHERE id < (SELECT id FROM provider_observations ORDER BY id DESC OFFSET 9999 LIMIT 1)"
        )
        .execute(&mut *tx)
        .await
        .map_err(|_| Error::Unavailable)?;
    }
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(())
}

#[derive(Serialize)]
pub struct Server {
    pub name: String,
    pub state: String,
    pub players: Option<i64>,
    pub capacity: Option<i64>,
    pub collected_at: Option<String>,
    pub provider_at: Option<String>,
    pub freshness: String,
    pub error: Option<String>,
}

#[derive(Serialize)]
pub struct Entry {
    pub id: String,
    pub revision: String,
    pub checked_at: String,
    pub complete: bool,
    pub error: Option<String>,
    pub servers: Vec<Server>,
}

pub struct Page {
    pub session: Session,
    pub current_revision: i64,
    pub through: i64,
    pub next: Option<i64>,
    pub entries: Vec<Entry>,
}

pub async fn page(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    revision: Option<i64>,
    through: Option<i64>,
    before: Option<i64>,
) -> Result<Page, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let connection = sqlx::query!(
        "SELECT revision, sealed IS NOT NULL AS \"configured!\" FROM crafty_connection WHERE singleton = TRUE"
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    if revision.is_some_and(|v| v != connection.revision) {
        return Err(Error::Conflict);
    }
    let owner = session.account.role == "owner";
    let latest = sqlx::query_scalar!(
        r#"SELECT COALESCE(MAX(id), 0) AS "latest!" FROM provider_observations WHERE $1::boolean OR (connection_revision = $2 AND $3::boolean)"#,
        owner,
        connection.revision,
        connection.configured
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let through = through.unwrap_or(latest);
    if through > latest {
        return Err(Error::Rejected);
    }
    let mut rows = sqlx::query!(
        "SELECT id, connection_revision, checked_at, complete, error FROM provider_observations WHERE ($1::boolean OR (connection_revision = $2 AND $3::boolean)) AND id <= $4 AND ($5::bigint IS NULL OR id < $5) ORDER BY id DESC LIMIT 26",
        owner,
        connection.revision,
        connection.configured,
        through,
        before
    )
    .fetch_all(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let more = rows.len() > 25;
    rows.truncate(25);
    let next = if more {
        rows.last().map(|r| r.id)
    } else {
        None
    };
    let ids: Vec<i64> = rows.iter().map(|r| r.id).collect();
    let servers = sqlx::query!(
        "SELECT batch_id, ordinal, name, state, players, capacity, collected_at, provider_at, freshness, error FROM provider_server_observations WHERE batch_id = ANY($1) ORDER BY batch_id DESC, ordinal ASC",
        &ids
    )
    .fetch_all(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let entries = rows
        .into_iter()
        .map(|r| Entry {
            id: r.id.to_string(),
            revision: r.connection_revision.to_string(),
            checked_at: r.checked_at.to_string(),
            complete: r.complete,
            error: r.error,
            servers: servers
                .iter()
                .filter(|s| s.batch_id == r.id)
                .map(|s| Server {
                    name: s.name.clone(),
                    state: s.state.clone(),
                    players: s.players,
                    capacity: s.capacity,
                    collected_at: s.collected_at.map(|v| v.to_string()),
                    provider_at: s.provider_at.map(|v| v.to_string()),
                    freshness: s.freshness.clone(),
                    error: s.error.clone(),
                })
                .collect(),
        })
        .collect();
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(Page {
        session,
        current_revision: connection.revision,
        through,
        next,
        entries,
    })
}
