//! Shared changes delivered atomically to existing active accounts other than the actor.
use super::{Error, Session, actor, checked_key, locked};
use crate::activity::Kind;
use serde::Serialize;
use sqlx::{PgPool, Postgres, Transaction};

#[derive(Serialize)]
pub struct Latest {
    kind: &'static str,
    label: &'static str,
    source_revision: String,
    occurred_at: String,
}
#[derive(Serialize)]
pub struct Group {
    category: String,
    revision: String,
    read_through: String,
    unread: String,
    latest: Latest,
}
#[derive(Serialize)]
pub struct View {
    groups: Vec<Group>,
    unread_groups: usize,
}
fn category(kind: Kind) -> Option<&'static str> {
    match kind {
        Kind::ServiceAdded | Kind::ServiceUpdated | Kind::ServiceRemoved => Some("services"),
        Kind::ConnectionSaved | Kind::ConnectionRemoved => Some("connections"),
        Kind::Note | Kind::Pins => None,
    }
}
pub(super) async fn emit(
    tx: &mut Transaction<'_, Postgres>,
    account: i64,
    kind: Kind,
    source_revision: i64,
    now: i64,
) -> Result<(), Error> {
    let category = category(kind).ok_or(Error::Rejected)?;
    sqlx::query!("INSERT INTO notification_groups (account_id, category, revision, read_through, kind, source_revision, occurred_at) SELECT id, $2, 1, 0, $3, $4, $5 FROM users WHERE active = TRUE AND id <> $1 ON CONFLICT (account_id, category) DO UPDATE SET revision = notification_groups.revision + 1, kind = EXCLUDED.kind, source_revision = EXCLUDED.source_revision, occurred_at = EXCLUDED.occurred_at", account, category, kind.code(), source_revision, now)
        .execute(&mut **tx).await.map_err(|_| Error::Unavailable)?;
    Ok(())
}
pub(super) async fn view(tx: &mut Transaction<'_, Postgres>, account: i64) -> Result<View, Error> {
    let rows = sqlx::query!("SELECT category, revision, read_through, kind, source_revision, occurred_at FROM notification_groups WHERE account_id = $1 ORDER BY category LIMIT 3", account)
        .fetch_all(&mut **tx).await.map_err(|_| Error::Unavailable)?;
    if rows.len() > 2 {
        return Err(Error::Unavailable);
    }
    let mut unread_groups = 0;
    let groups = rows
        .into_iter()
        .map(|r| {
            let kind = Kind::parse(&r.kind).ok_or(Error::Unavailable)?;
            if category(kind) != Some(r.category.as_str())
                || r.read_through < 0
                || r.read_through > r.revision
            {
                return Err(Error::Unavailable);
            }
            unread_groups += usize::from(r.read_through < r.revision);
            Ok(Group {
                category: r.category,
                revision: r.revision.to_string(),
                read_through: r.read_through.to_string(),
                unread: (r.revision - r.read_through).to_string(),
                latest: Latest {
                    kind: kind.code(),
                    label: kind.label(),
                    source_revision: r.source_revision.to_string(),
                    occurred_at: r.occurred_at.to_string(),
                },
            })
        })
        .collect::<Result<Vec<_>, Error>>()?;
    Ok(View {
        groups,
        unread_groups,
    })
}
pub struct Read {
    pub session: Session,
    pub notifications: View,
}
pub async fn mark_read(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    category: &str,
    through: i64,
) -> Result<Read, Error> {
    if !["services", "connections"].contains(&category) || through < 0 {
        return Err(Error::Rejected);
    }
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let revision = sqlx::query_scalar!(
        "SELECT revision FROM notification_groups WHERE account_id = $1 AND category = $2",
        session.account.id,
        category
    )
    .fetch_optional(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?
    .unwrap_or(0);
    if through > revision {
        return Err(Error::Conflict);
    }
    sqlx::query!("UPDATE notification_groups SET read_through = GREATEST(read_through, $3) WHERE account_id = $1 AND category = $2", session.account.id, category, through)
        .execute(&mut *tx).await.map_err(|_| Error::Unavailable)?;
    let notifications = view(&mut tx, session.account.id).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(Read {
        session,
        notifications,
    })
}
