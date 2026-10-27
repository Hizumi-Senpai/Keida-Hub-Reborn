//! Directory and per-account pins share the final current-session authority lock.
use super::{Error, actor, checked_key, locked};
use crate::directory::{Change, Entry, View, decimal};
use sqlx::{PgPool, Postgres, Transaction};

pub(super) async fn view(tx: &mut Transaction<'_, Postgres>, account: i64) -> Result<View, Error> {
    let revision =
        sqlx::query_scalar!("SELECT revision FROM directory_state WHERE singleton = TRUE")
            .fetch_one(&mut **tx)
            .await
            .map_err(|_| Error::Unavailable)?;
    let rows = sqlx::query!(
        "SELECT id, name, category, description, url FROM directory_services ORDER BY id LIMIT 101"
    )
    .fetch_all(&mut **tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    if rows.len() > 100 {
        return Err(Error::Unavailable);
    }
    let pins = sqlx::query!(
        "SELECT revision, ids FROM directory_pins WHERE account_id = $1",
        account
    )
    .fetch_optional(&mut **tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    Ok(View {
        revision: revision.to_string(),
        services: rows
            .into_iter()
            .map(|r| Entry {
                id: r.id.to_string(),
                name: r.name,
                category: r.category,
                description: r.description,
                url: r.url,
            })
            .collect(),
        pins_revision: pins.as_ref().map_or(0, |p| p.revision).to_string(),
        pins: pins.map_or_else(Vec::new, |p| {
            p.ids.into_iter().map(|v| v.to_string()).collect()
        }),
    })
}
pub async fn edit(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    base: i64,
    change: Change,
) -> Result<(), Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    if session.account.role != "owner" {
        return Err(Error::Forbidden);
    }
    let current =
        sqlx::query_scalar!("SELECT revision FROM directory_state WHERE singleton = TRUE")
            .fetch_one(&mut *tx)
            .await
            .map_err(|_| Error::Unavailable)?;
    if base != current {
        return Err(Error::Conflict);
    }
    let next = current.checked_add(1).ok_or(Error::Unavailable)?;
    let kind = match &change {
        Change::Create { .. } => crate::activity::Kind::ServiceAdded,
        Change::Update { .. } => crate::activity::Kind::ServiceUpdated,
        Change::Delete { .. } => crate::activity::Kind::ServiceRemoved,
    };
    match change {
        Change::Create { link } => {
            if !link.validate() {
                return Err(Error::Rejected);
            }
            let count =
                sqlx::query_scalar!(r#"SELECT COUNT(*) AS "count!" FROM directory_services"#)
                    .fetch_one(&mut *tx)
                    .await
                    .map_err(|_| Error::Unavailable)?;
            if count >= 100 {
                return Err(Error::Limited);
            }
            sqlx::query!("INSERT INTO directory_services (name, category, description, url) VALUES ($1, $2, $3, $4)", link.name, link.category, link.description, link.url)
                .execute(&mut *tx).await.map_err(|_| Error::Unavailable)?;
        }
        Change::Update { id, link } => {
            let id = decimal(&id, true).ok_or(Error::Rejected)?;
            if !link.validate() {
                return Err(Error::Rejected);
            }
            let affected = sqlx::query!("UPDATE directory_services SET name = $2, category = $3, description = $4, url = $5 WHERE id = $1", id, link.name, link.category, link.description, link.url)
                .execute(&mut *tx).await.map_err(|_| Error::Unavailable)?.rows_affected();
            if affected != 1 {
                return Err(Error::NotFound);
            }
        }
        Change::Delete { id } => {
            let id = decimal(&id, true).ok_or(Error::Rejected)?;
            // Cleanup changes each affected personal revision, so a stale pin
            // edit cannot silently reintroduce a removed link or overwrite order.
            sqlx::query!("UPDATE directory_pins SET ids = array_remove(ids, $1), revision = revision + 1 WHERE $1 = ANY(ids)", id)
                .execute(&mut *tx).await.map_err(|_| Error::Unavailable)?;
            let affected = sqlx::query!("DELETE FROM directory_services WHERE id = $1", id)
                .execute(&mut *tx)
                .await
                .map_err(|_| Error::Unavailable)?
                .rows_affected();
            if affected != 1 {
                return Err(Error::NotFound);
            }
        }
    }
    sqlx::query!(
        "UPDATE directory_state SET revision = $1 WHERE singleton = TRUE",
        next
    )
    .execute(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    super::activity::record(&mut tx, session.account.id, kind, next, state.now).await?;
    super::notifications::emit(&mut tx, session.account.id, kind, next, state.now).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)
}
pub async fn pins(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    base_directory: i64,
    base: i64,
    ids: &[i64],
) -> Result<(), Error> {
    if ids.len() > 24
        || ids.iter().any(|id| *id <= 0)
        || ids.iter().enumerate().any(|(i, id)| ids[..i].contains(id))
    {
        return Err(Error::Rejected);
    }
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let current = view(&mut tx, session.account.id).await?;
    if current.revision != base_directory.to_string() || current.pins_revision != base.to_string() {
        return Err(Error::Conflict);
    }
    if ids
        .iter()
        .any(|id| !current.services.iter().any(|s| s.id == id.to_string()))
    {
        return Err(Error::Rejected);
    }
    let next = base.checked_add(1).ok_or(Error::Unavailable)?;
    sqlx::query!("INSERT INTO directory_pins (account_id, revision, ids) VALUES ($1, $2, $3) ON CONFLICT (account_id) DO UPDATE SET revision = EXCLUDED.revision, ids = EXCLUDED.ids", session.account.id, next, ids)
        .execute(&mut *tx).await.map_err(|_| Error::Unavailable)?;
    super::activity::record(
        &mut tx,
        session.account.id,
        crate::activity::Kind::Pins,
        next,
        state.now,
    )
    .await?;
    tx.commit().await.map_err(|_| Error::Unavailable)
}
