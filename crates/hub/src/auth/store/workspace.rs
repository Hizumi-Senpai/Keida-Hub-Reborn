//! This concrete note caller shares authentication's transaction/lock authority.
use super::{Error, Session, actor, checked_key, locked};
use sqlx::PgPool;

pub struct Note {
    pub body: String,
    pub revision: i64,
}
pub struct Snapshot {
    pub session: Session,
    pub note: Note,
    pub connection_revision: i64,
    pub connection_configured: bool,
    pub directory: crate::directory::View,
}

pub async fn snapshot(pool: &PgPool, key: &[u8], verifier: &[u8]) -> Result<Snapshot, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let row = sqlx::query!(
        "SELECT body, revision FROM workspace_notes WHERE account_id = $1",
        session.account.id
    )
    .fetch_optional(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let note = row.map_or(
        Note {
            body: String::new(),
            revision: 0,
        },
        |r| Note {
            body: r.body,
            revision: r.revision,
        },
    );
    let connection =
        sqlx::query!("SELECT revision, sealed FROM crafty_connection WHERE singleton = TRUE")
            .fetch_one(&mut *tx)
            .await
            .map_err(|_| Error::Unavailable)?;
    let directory = super::directory::view(&mut tx, session.account.id).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(Snapshot {
        directory,
        session,
        note,
        connection_revision: connection.revision,
        connection_configured: connection.sealed.is_some(),
    })
}

pub async fn save(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    body: &str,
    base: i64,
) -> Result<Snapshot, Error> {
    if body.len() > 4096 || body.contains('\0') || base < 0 {
        return Err(Error::Rejected);
    }
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let current = sqlx::query_scalar!(
        "SELECT revision FROM workspace_notes WHERE account_id = $1",
        session.account.id
    )
    .fetch_optional(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?
    .unwrap_or(0);
    if current != base {
        return Err(Error::Conflict);
    }
    let next = current.checked_add(1).ok_or(Error::Unavailable)?;
    let row = sqlx::query!(
        "INSERT INTO workspace_notes (account_id, body, revision) VALUES ($1, $2, $3) ON CONFLICT (account_id) DO UPDATE SET body = EXCLUDED.body, revision = EXCLUDED.revision RETURNING body, revision",
        session.account.id, body, next
    ).fetch_one(&mut *tx).await.map_err(|_| Error::Unavailable)?;
    super::activity::record(
        &mut tx,
        session.account.id,
        crate::activity::Kind::Note,
        next,
        state.now,
    )
    .await?;
    let connection =
        sqlx::query!("SELECT revision, sealed FROM crafty_connection WHERE singleton = TRUE")
            .fetch_one(&mut *tx)
            .await
            .map_err(|_| Error::Unavailable)?;
    let directory = super::directory::view(&mut tx, session.account.id).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(Snapshot {
        directory,
        connection_revision: connection.revision,
        connection_configured: connection.sealed.is_some(),
        session,
        note: Note {
            body: row.body,
            revision: row.revision,
        },
    })
}
