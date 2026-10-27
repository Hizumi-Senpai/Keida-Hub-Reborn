use super::{Error, Session, actor, checked_key, locked};
use crate::activity::{Entry, Kind};
use sqlx::{PgPool, Postgres, Transaction};

pub(super) async fn record(
    tx: &mut Transaction<'_, Postgres>,
    account: i64,
    kind: Kind,
    revision: i64,
    now: i64,
) -> Result<(), Error> {
    sqlx::query!("INSERT INTO activity_events (account_id, kind, revision, occurred_at) VALUES ($1, $2, $3, $4)", account, kind.code(), revision, now)
        .execute(&mut **tx).await.map_err(|_| Error::Unavailable)?;
    Ok(())
}
pub struct Page {
    pub session: Session,
    pub through: i64,
    pub next: Option<i64>,
    pub entries: Vec<Entry>,
}
pub async fn page(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    through: Option<i64>,
    before: Option<i64>,
    kinds: &[String],
) -> Result<Page, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let through = match through {
        Some(v) => v,
        None => sqlx::query_scalar!(
            r#"SELECT COALESCE(MAX(id),0) AS "latest!" FROM activity_events WHERE account_id = $1"#,
            session.account.id
        )
        .fetch_one(&mut *tx)
        .await
        .map_err(|_| Error::Unavailable)?,
    };
    let mut rows = sqlx::query!("SELECT id, kind, revision, occurred_at FROM activity_events WHERE account_id = $1 AND id <= $2 AND ($3::bigint IS NULL OR id < $3) AND kind = ANY($4) ORDER BY id DESC LIMIT 26", session.account.id, through, before, kinds)
        .fetch_all(&mut *tx).await.map_err(|_| Error::Unavailable)?;
    let more = rows.len() > 25;
    rows.truncate(25);
    let next = if more {
        rows.last().map(|r| r.id)
    } else {
        None
    };
    let entries = rows
        .into_iter()
        .map(|r| {
            let kind = Kind::parse(&r.kind).ok_or(Error::Unavailable)?;
            Ok(Entry {
                id: r.id.to_string(),
                occurred_at: r.occurred_at.to_string(),
                revision: r.revision.to_string(),
                kind: kind.code(),
                category: kind.category(),
                label: kind.label(),
            })
        })
        .collect::<Result<Vec<_>, Error>>()?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(Page {
        session,
        through,
        next,
        entries,
    })
}
