//! Owner-only queue enrollment under the existing authentication authority lock.
use super::{Error, Session, actor, checked_key, locked};
use crate::providers::queues::Provider;
use sqlx::PgPool;

pub struct Captured {
    pub revision: i64,
    pub sealed: Option<Vec<u8>>,
}

pub async fn capture(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    provider: Provider,
) -> Result<Captured, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    if session.account.role != "owner" {
        return Err(Error::Forbidden);
    }
    let row = sqlx::query!(
        "SELECT revision, sealed FROM queue_connections WHERE provider = $1",
        provider.as_str()
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(Captured {
        revision: row.revision,
        sealed: row.sealed,
    })
}

pub async fn replace(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    provider: Provider,
    base: i64,
    sealed: Option<&[u8]>,
) -> Result<i64, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    if session.account.role != "owner" {
        return Err(Error::Forbidden);
    }
    let current = sqlx::query_scalar!(
        "SELECT revision FROM queue_connections WHERE provider = $1",
        provider.as_str()
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    if current != base {
        return Err(Error::Conflict);
    }
    let next = current.checked_add(1).ok_or(Error::Unavailable)?;
    sqlx::query!(
        "UPDATE queue_connections SET revision = $1, sealed = $2 WHERE provider = $3",
        next,
        sealed,
        provider.as_str()
    )
    .execute(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    // Existing connection Activity and notifications describe Crafty. Queue
    // enrollment neither reuses those labels nor discloses owner-only changes.
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(next)
}

/// A provider result is private until current authority and enrollment agree.
/// No caller holds this transaction while contacting a provider.
pub async fn admit(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    provider: Provider,
    revision: i64,
) -> Result<Session, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    if session.account.role != "owner" {
        return Err(Error::Forbidden);
    }
    let current = sqlx::query_scalar!(
        "SELECT revision FROM queue_connections WHERE provider = $1",
        provider.as_str()
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    if current != revision {
        return Err(Error::Conflict);
    }
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(session)
}
