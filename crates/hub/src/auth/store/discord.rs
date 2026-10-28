//! Discord links and enrollment under the existing authentication authority lock.
//! A captured provider candidate is never itself authority; every disclosure and
//! commit rechecks the current key, exact session and durable revisions.
use super::{Error, Session, actor, checked_key, locked, write_error};
use sqlx::{PgPool, Postgres, Transaction};
use std::time::Instant;

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Identity {
    pub id: String,
    pub display_name: String,
    pub verified_at: i64,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Link {
    pub revision: i64,
    pub flow_generation: i64,
    pub identity: Option<Identity>,
}

// No Debug: sealed application material is for the internal HTTP admission path.
pub struct Capture {
    pub session: Session,
    pub application_revision: i64,
    pub sealed: Option<Vec<u8>>,
    pub link: Link,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub struct Bases {
    pub revision: i64,
    pub flow_generation: i64,
    pub application_revision: i64,
}

/// Discord IDs cover the full unsigned snowflake range and never have leading
/// zeroes. Names, emails and signed local-account IDs are not identity selectors.
pub fn valid_id(value: &str) -> bool {
    !value.is_empty()
        && value.len() <= 20
        && !value.starts_with('0')
        && value.bytes().all(|byte| byte.is_ascii_digit())
        && value.parse::<u64>().is_ok_and(|value| value > 0)
}

fn valid_name(value: &str) -> bool {
    !value.trim().is_empty()
        && value.len() <= 320
        && value.chars().count() <= 80
        && !value.chars().any(|character| {
            character.is_control()
                || matches!(
                    character,
                    '\u{061c}' | '\u{200e}' | '\u{200f}' | '\u{202a}'..='\u{202e}' | '\u{2066}'..='\u{2069}'
                )
        })
}

fn next(value: i64) -> Result<i64, Error> {
    value.checked_add(1).ok_or(Error::Unavailable)
}

async fn load(tx: &mut Transaction<'_, Postgres>, session: Session) -> Result<Capture, Error> {
    // All callers hold the singleton authority lock and lock rows in this order:
    // user/session, application, link. Only this INSERT creates a link tombstone.
    let application = sqlx::query!(
        "SELECT revision, sealed FROM discord_application WHERE singleton = TRUE FOR UPDATE"
    )
    .fetch_one(&mut **tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    sqlx::query!(
        "INSERT INTO discord_links (account_id) VALUES ($1) ON CONFLICT (account_id) DO NOTHING",
        session.account.id
    )
    .execute(&mut **tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let row = sqlx::query!(
        "SELECT revision, flow_generation, discord_id, display_name, verified_at FROM discord_links WHERE account_id = $1 FOR UPDATE",
        session.account.id
    )
    .fetch_one(&mut **tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let identity = match (row.discord_id, row.display_name, row.verified_at) {
        (None, None, None) => None,
        (Some(id), Some(display_name), Some(verified_at))
            if valid_id(&id) && valid_name(&display_name) && verified_at > 0 =>
        {
            Some(Identity {
                id,
                display_name,
                verified_at,
            })
        }
        _ => return Err(Error::Unavailable),
    };
    Ok(Capture {
        session,
        application_revision: application.revision,
        sealed: application.sealed,
        link: Link {
            revision: row.revision,
            flow_generation: row.flow_generation,
            identity,
        },
    })
}

fn check_link(captured: &Capture, revision: i64, flow_generation: i64) -> Result<(), Error> {
    if revision < 0
        || flow_generation < 0
        || captured.link.revision != revision
        || captured.link.flow_generation != flow_generation
    {
        Err(Error::Conflict)
    } else {
        Ok(())
    }
}

fn check(captured: &Capture, bases: Bases) -> Result<(), Error> {
    check_link(captured, bases.revision, bases.flow_generation)?;
    if bases.application_revision < 0
        || captured.application_revision != bases.application_revision
        || captured.sealed.is_none()
    {
        Err(Error::Conflict)
    } else {
        Ok(())
    }
}

async fn write_link(tx: &mut Transaction<'_, Postgres>, captured: &Capture) -> Result<(), Error> {
    let identity = captured.link.identity.as_ref();
    let id = identity.map(|identity| identity.id.as_str());
    let display_name = identity.map(|identity| identity.display_name.as_str());
    let verified_at = identity.map(|identity| identity.verified_at);
    sqlx::query!(
        "UPDATE discord_links SET revision = $1, flow_generation = $2, discord_id = $3, display_name = $4, verified_at = $5 WHERE account_id = $6",
        captured.link.revision,
        captured.link.flow_generation,
        id,
        display_name,
        verified_at,
        captured.session.account.id
    )
    .execute(&mut **tx)
    .await
    .map_err(write_error)?;
    Ok(())
}

pub async fn capture(pool: &PgPool, key: &[u8], verifier: &[u8]) -> Result<Capture, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let captured = load(&mut tx, session).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(captured)
}

pub async fn owner_capture(pool: &PgPool, key: &[u8], verifier: &[u8]) -> Result<Capture, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    if session.account.role != "owner" {
        return Err(Error::Forbidden);
    }
    let captured = load(&mut tx, session).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(captured)
}

pub async fn replace_application(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    base: i64,
    sealed: Option<&[u8]>,
) -> Result<Capture, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    if session.account.role != "owner" {
        return Err(Error::Forbidden);
    }
    let mut captured = load(&mut tx, session).await?;
    if base < 0 || captured.application_revision != base {
        return Err(Error::Conflict);
    }
    if sealed.is_some_and(|sealed| !(62..=1085).contains(&sealed.len())) {
        return Err(Error::Rejected);
    }
    let revision = next(base)?;
    sqlx::query!(
        "UPDATE discord_application SET revision = $1, sealed = $2 WHERE singleton = TRUE",
        revision,
        sealed
    )
    .execute(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    captured.application_revision = revision;
    captured.sealed = sealed.map(ToOwned::to_owned);
    // A changed application revision invalidates every RAM attempt without
    // erasing any accepted identity or changing local account authority.
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(captured)
}

pub async fn start(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    bases: Bases,
) -> Result<Capture, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let mut captured = load(&mut tx, session).await?;
    check(&captured, bases)?;
    if captured.link.identity.is_some() {
        return Err(Error::Conflict);
    }
    captured.link.flow_generation = next(captured.link.flow_generation)?;
    write_link(&mut tx, &captured).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(captured)
}

/// Re-admit after provider IO; never disclose a cached candidate without this
/// current authority/revision check. This function does not consume the flow.
pub async fn admit(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    bases: Bases,
) -> Result<Capture, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let captured = load(&mut tx, session).await?;
    check(&captured, bases)?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(captured)
}

pub async fn confirm(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    bases: Bases,
    id: &str,
    display_name: &str,
    deadline: Instant,
) -> Result<Capture, Error> {
    if !valid_id(id) || !valid_name(display_name) {
        return Err(Error::Rejected);
    }
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let mut captured = load(&mut tx, session).await?;
    check(&captured, bases)?;
    if captured.link.identity.is_some() {
        return Err(Error::Conflict);
    }
    captured.link.revision = next(captured.link.revision)?;
    captured.link.flow_generation = next(captured.link.flow_generation)?;
    captured.link.identity = Some(Identity {
        id: id.to_owned(),
        display_name: display_name.to_owned(),
        verified_at: state.now,
    });
    // The RAM claim can have waited for database locks. Its monotonic deadline
    // still governs locked commit admission, not eventual response arrival.
    if Instant::now() >= deadline {
        return Err(Error::Conflict);
    }
    write_link(&mut tx, &captured).await?;
    if Instant::now() >= deadline {
        return Err(Error::Conflict);
    }
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(captured)
}

pub async fn cancel(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    base_revision: i64,
    base_flow_generation: i64,
) -> Result<Capture, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let mut captured = load(&mut tx, session).await?;
    check_link(&captured, base_revision, base_flow_generation)?;
    captured.link.flow_generation = next(captured.link.flow_generation)?;
    write_link(&mut tx, &captured).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(captured)
}

/// Local unlink deliberately makes no Discord call and works even after the
/// owner removes application enrollment. The tombstone prevents stale ABA wins.
pub async fn unlink(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    base_revision: i64,
    base_flow_generation: i64,
) -> Result<Capture, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let mut captured = load(&mut tx, session).await?;
    check_link(&captured, base_revision, base_flow_generation)?;
    captured.link.revision = next(captured.link.revision)?;
    captured.link.flow_generation = next(captured.link.flow_generation)?;
    captured.link.identity = None;
    write_link(&mut tx, &captured).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(captured)
}
