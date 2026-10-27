//! One connection revision under the existing authentication authority lock.
use super::{Error, actor, checked_key, locked};
use sqlx::PgPool;

pub struct Captured {
    pub revision: i64,
    pub sealed: Option<Vec<u8>>,
}

pub async fn capture(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    owner: bool,
) -> Result<Captured, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    if owner && session.account.role != "owner" {
        return Err(Error::Forbidden);
    }
    let row = sqlx::query!("SELECT revision, sealed FROM crafty_connection WHERE singleton = TRUE")
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
    base: i64,
    sealed: Option<&[u8]>,
) -> Result<i64, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    if session.account.role != "owner" {
        return Err(Error::Forbidden);
    }
    let current =
        sqlx::query_scalar!("SELECT revision FROM crafty_connection WHERE singleton = TRUE")
            .fetch_one(&mut *tx)
            .await
            .map_err(|_| Error::Unavailable)?;
    if current != base {
        return Err(Error::Conflict);
    }
    let next = current.checked_add(1).ok_or(Error::Unavailable)?;
    sqlx::query!(
        "UPDATE crafty_connection SET revision = $1, sealed = $2 WHERE singleton = TRUE",
        next,
        sealed
    )
    .execute(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    super::activity::record(
        &mut tx,
        session.account.id,
        if sealed.is_some() {
            crate::activity::Kind::ConnectionSaved
        } else {
            crate::activity::Kind::ConnectionRemoved
        },
        next,
        state.now,
    )
    .await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(next)
}
