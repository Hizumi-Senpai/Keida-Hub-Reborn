//! Personal active-session metadata and one-other-session revocation. UUIDs are
//! selectors only; the current verifier/key/account remain the sole authority.
use super::{Error, Session, actor, checked_key, locked};
use sqlx::{PgPool, Postgres, Transaction};

pub struct Active {
    pub id: String,
    pub created_at: i64,
    pub expires_at: i64,
    pub current: bool,
}
pub struct Snapshot {
    pub session: Session,
    pub checked_at: i64,
    pub sessions: Vec<Active>,
}

/// PostgreSQL accepts other UUID spellings; the closed wire accepts only the
/// canonical lowercase random-v4/standard-variant representation we generate.
pub fn canonical_id(value: &str) -> bool {
    let bytes = value.as_bytes();
    bytes.len() == 36
        && bytes.iter().enumerate().all(|(index, byte)| {
            if matches!(index, 8 | 13 | 18 | 23) {
                *byte == b'-'
            } else {
                byte.is_ascii_digit() || (b'a'..=b'f').contains(byte)
            }
        })
        && bytes[14] == b'4'
        && matches!(bytes[19], b'8' | b'9' | b'a' | b'b')
}

async fn clock(tx: &mut Transaction<'_, Postgres>) -> Result<i64, Error> {
    sqlx::query_scalar!(r#"SELECT floor(extract(epoch FROM clock_timestamp()))::bigint AS "now!""#)
        .fetch_one(&mut **tx)
        .await
        .map_err(|_| Error::Unavailable)
}

async fn snapshot(tx: &mut Transaction<'_, Postgres>, verifier: &[u8]) -> Result<Snapshot, Error> {
    // The caller already locked the acting row. Sample after any other target
    // lock wait; checked_at describes this list rather than response arrival.
    let checked_at = clock(tx).await?;
    let session = actor(tx, verifier, checked_at).await?;
    let rows = sqlx::query!(
        r#"SELECT public_ref::text AS "id!", created_at, expires_at,
                  (verifier = $1) AS "current!"
           FROM sessions
           WHERE account_id = $2 AND generation = $3 AND revoked = FALSE AND expires_at > $4
           ORDER BY created_at DESC, public_ref DESC LIMIT 33"#,
        verifier,
        session.account.id,
        session.generation,
        checked_at
    )
    .fetch_all(&mut **tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    if rows.len() > 32
        || rows.iter().filter(|row| row.current).count() != 1
        || rows.iter().any(|row| {
            !canonical_id(&row.id)
                || row.created_at < 0
                || row.expires_at <= row.created_at
                || row.expires_at <= checked_at
        })
    {
        return Err(Error::Unavailable);
    }
    Ok(Snapshot {
        session,
        checked_at,
        sessions: rows
            .into_iter()
            .map(|row| Active {
                id: row.id,
                created_at: row.created_at,
                expires_at: row.expires_at,
                current: row.current,
            })
            .collect(),
    })
}

async fn final_actor(tx: &mut Transaction<'_, Postgres>, verifier: &[u8]) -> Result<(), Error> {
    let now = clock(tx).await?;
    actor(tx, verifier, now).await?;
    Ok(())
}

pub async fn list(pool: &PgPool, key: &[u8], verifier: &[u8]) -> Result<Snapshot, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    actor(&mut tx, verifier, state.now).await?;
    let captured = snapshot(&mut tx, verifier).await?;
    // A final authority check also protects a request whose query/row waits
    // carried the actor past expiry. No provider or other remote IO is involved.
    final_actor(&mut tx, verifier).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(captured)
}

pub async fn revoke(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    id: &str,
) -> Result<Snapshot, Error> {
    if !canonical_id(id) {
        return Err(Error::Rejected);
    }
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let acting = actor(&mut tx, verifier, state.now).await?;
    let target = sqlx::query!(
        r#"SELECT generation, expires_at, revoked, (verifier = $3) AS "current!"
           FROM sessions WHERE public_ref = $1::text::uuid AND account_id = $2 FOR UPDATE"#,
        id,
        acting.account.id,
        verifier
    )
    .fetch_optional(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let now = clock(&mut tx).await?;
    let acting = actor(&mut tx, verifier, now).await?;
    let target = target.ok_or(Error::Conflict)?;
    if target.current
        || target.revoked
        || target.generation != acting.generation
        || target.expires_at <= now
    {
        return Err(Error::Conflict);
    }
    let changed = sqlx::query!(
        "UPDATE sessions SET revoked = TRUE WHERE public_ref = $1::text::uuid AND account_id = $2 AND revoked = FALSE",
        id,
        acting.account.id
    )
    .execute(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    if changed.rows_affected() != 1 {
        return Err(Error::Conflict);
    }
    let captured = snapshot(&mut tx, verifier).await?;
    // An expired/revoked/deactivated/changed actor rolls back the target write.
    final_actor(&mut tx, verifier).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(captured)
}

#[cfg(test)]
mod tests {
    use super::canonical_id;
    #[test]
    fn only_canonical_random_uuid_selectors_are_admitted() {
        assert!(canonical_id("12345678-1234-4abc-8def-1234567890ab"));
        assert!(canonical_id("ffffffff-ffff-4fff-bfff-ffffffffffff"));
        for value in [
            "1234567812344abc8def1234567890ab",
            "{12345678-1234-4abc-8def-1234567890ab}",
            "12345678-1234-4ABC-8def-1234567890ab",
            "12345678-1234-1abc-8def-1234567890ab",
            "12345678-1234-4abc-7def-1234567890ab",
            "12345678-1234-4abc-cdef-1234567890ab",
            "12345678-1234-4abc-8def-1234567890ab ",
            "",
        ] {
            assert!(!canonical_id(value));
        }
    }
}
