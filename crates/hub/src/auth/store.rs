//! PostgreSQL authentication authority. No transaction spans password hashing.
//! Every auth mutation takes the singleton lock before any account/session lock.

use sqlx::{PgPool, Postgres, Transaction};

pub(super) mod activity;
pub(super) mod connections;
pub(super) mod directory;
pub(super) mod discord;
pub(super) mod layout;
pub(super) mod media;
pub(super) mod notifications;
pub(super) mod observations;
pub(super) mod queues;
pub(super) mod workspace;

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum Error {
    Unauthorized,
    Forbidden,
    Conflict,
    Limited,
    Unavailable,
    NotFound,
    Rejected,
}

pub struct Account {
    pub id: i64,
    pub username: String,
    pub role: String,
}

pub struct LoginSnapshot {
    pub account: Account,
    pub phc: String,
    pub generation: i64,
    pub active: bool,
}

pub struct Session {
    pub account: Account,
    pub generation: i64,
}

pub struct BootstrapSnapshot {
    pub hash: Vec<u8>,
    pub expires: i64,
    pub now: i64,
}

pub struct Status {
    pub setup_available: bool,
}

struct State {
    key_id: Option<Vec<u8>>,
    setup_hash: Option<Vec<u8>>,
    setup_expires_at: Option<i64>,
    owner_id: Option<i64>,
    now: i64,
}

struct UserRow {
    id: i64,
    username: String,
    password_phc: String,
    role: String,
    active: bool,
    generation: i64,
}

impl UserRow {
    fn account(self) -> Account {
        Account {
            id: self.id,
            username: self.username,
            role: self.role,
        }
    }
}

fn valid_key(key_id: &[u8]) -> Result<(), Error> {
    if key_id.len() == 32 {
        Ok(())
    } else {
        Err(Error::Unavailable)
    }
}

fn valid_token(verifier: &[u8]) -> Result<(), Error> {
    if verifier.len() == 32 {
        Ok(())
    } else {
        Err(Error::Rejected)
    }
}

fn valid_account(username: &str, phc: &str) -> Result<(), Error> {
    if (3..=32).contains(&username.len())
        && username
            .bytes()
            .all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || matches!(b, b'_' | b'-'))
        && (40..=256).contains(&phc.len())
        && phc.starts_with("$argon2id$v=19$m=19456,t=2,p=1$")
    {
        Ok(())
    } else {
        Err(Error::Rejected)
    }
}

fn checked_key(state: &State, key_id: &[u8]) -> Result<(), Error> {
    valid_key(key_id)?;
    if state.key_id.as_deref() == Some(key_id) {
        Ok(())
    } else {
        Err(Error::Unavailable)
    }
}

fn write_error(error: sqlx::Error) -> Error {
    if error.as_database_error().and_then(|e| e.code()).as_deref() == Some("23505") {
        Error::Conflict
    } else {
        Error::Unavailable
    }
}

async fn read_state(pool: &PgPool) -> Result<State, Error> {
    sqlx::query_as!(
        State,
        r#"SELECT key_id, setup_hash, setup_expires_at, owner_id,
                  floor(extract(epoch FROM clock_timestamp()))::bigint AS "now!"
           FROM auth_state WHERE singleton = TRUE"#
    )
    .fetch_one(pool)
    .await
    .map_err(|_| Error::Unavailable)
}

async fn locked(pool: &PgPool) -> Result<(Transaction<'_, Postgres>, State), Error> {
    let mut tx = pool.begin().await.map_err(|_| Error::Unavailable)?;
    let row = sqlx::query!(
        "SELECT key_id, setup_hash, setup_expires_at, owner_id FROM auth_state WHERE singleton = TRUE FOR UPDATE"
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    // Read time after acquiring the authority lock. Projection expressions in
    // the locking SELECT could otherwise have run before a contended wait.
    let now = sqlx::query_scalar!(
        r#"SELECT floor(extract(epoch FROM clock_timestamp()))::bigint AS "now!""#
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let state = State {
        key_id: row.key_id,
        setup_hash: row.setup_hash,
        setup_expires_at: row.setup_expires_at,
        owner_id: row.owner_id,
        now,
    };
    Ok((tx, state))
}

pub async fn status(pool: &PgPool, key_id: &[u8]) -> Result<Status, Error> {
    let state = read_state(pool).await?;
    checked_key(&state, key_id)?;
    Ok(Status {
        setup_available: state.owner_id.is_none()
            && state.setup_hash.is_some()
            && state
                .setup_expires_at
                .is_some_and(|expiry| expiry > state.now),
    })
}

pub async fn prepare_owner(pool: &PgPool, key_id: &[u8], setup_hash: &[u8]) -> Result<(), Error> {
    valid_key(key_id)?;
    valid_token(setup_hash)?;
    let (mut tx, state) = locked(pool).await?;
    if state.key_id.is_some() {
        checked_key(&state, key_id)?;
    }
    if state.owner_id.is_some() || owner_exists(&mut tx).await? {
        return Err(Error::Conflict);
    }
    if state.setup_hash.is_some()
        && state
            .setup_expires_at
            .is_some_and(|expiry| expiry > state.now)
    {
        return Err(Error::Conflict);
    }
    sqlx::query!(
        "UPDATE auth_state SET key_id = $1, setup_hash = $2, setup_expires_at = $3 WHERE singleton = TRUE",
        key_id, setup_hash, state.now + 900)
        .execute(&mut *tx).await.map_err(|_| Error::Unavailable)?;
    tx.commit().await.map_err(|_| Error::Unavailable)
}

async fn owner_exists(tx: &mut Transaction<'_, Postgres>) -> Result<bool, Error> {
    sqlx::query_scalar!(r#"SELECT EXISTS (SELECT 1 FROM users WHERE role = 'owner') AS "exists!""#)
        .fetch_one(&mut **tx)
        .await
        .map_err(|_| Error::Unavailable)
}

async fn reserve(
    tx: &mut Transaction<'_, Postgres>,
    scope: i16,
    now: i64,
    limit: i16,
) -> Result<(), Error> {
    let row = sqlx::query!(
        "SELECT window_start, attempts FROM auth_throttles WHERE scope = $1",
        scope
    )
    .fetch_one(&mut **tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let expired = now.saturating_sub(row.window_start) >= 60;
    let count = if expired { 0 } else { row.attempts };
    if count >= limit {
        return Err(Error::Limited);
    }
    let window = if expired { now } else { row.window_start };
    sqlx::query!(
        "UPDATE auth_throttles SET window_start = $2, attempts = $3 WHERE scope = $1",
        scope,
        window,
        count + 1
    )
    .execute(&mut **tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    Ok(())
}

pub async fn reserve_setup(pool: &PgPool, key_id: &[u8]) -> Result<(), Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key_id)?;
    reserve(&mut tx, 0, state.now, 5).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)
}

pub async fn bootstrap(pool: &PgPool, key_id: &[u8]) -> Result<BootstrapSnapshot, Error> {
    let state = read_state(pool).await?;
    checked_key(&state, key_id)?;
    match (state.owner_id, state.setup_hash, state.setup_expires_at) {
        (Some(_), _, _) => Err(Error::Conflict),
        (None, Some(hash), Some(expires)) if expires > state.now => Ok(BootstrapSnapshot {
            hash,
            expires,
            now: state.now,
        }),
        _ => Err(Error::Rejected),
    }
}

async fn new_session(
    tx: &mut Transaction<'_, Postgres>,
    account_id: i64,
    generation: i64,
    verifier: &[u8],
    now: i64,
) -> Result<(), Error> {
    valid_token(verifier)?;
    sqlx::query!(
        "DELETE FROM sessions WHERE account_id = $1 AND (expires_at <= $2 OR revoked = TRUE OR generation <> $3)",
        account_id, now, generation)
        .execute(&mut **tx).await.map_err(|_| Error::Unavailable)?;
    let count = sqlx::query_scalar!(
        r#"SELECT COUNT(*) AS "count!" FROM sessions
           WHERE account_id = $1 AND expires_at > $2 AND revoked = FALSE AND generation = $3"#,
        account_id,
        now,
        generation
    )
    .fetch_one(&mut **tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    if count >= 32 {
        return Err(Error::Limited);
    }
    sqlx::query!(
        "INSERT INTO sessions (verifier, account_id, generation, created_at, expires_at) VALUES ($1, $2, $3, $4, $5)",
        verifier, account_id, generation, now, now + 43_200)
        .execute(&mut **tx).await.map_err(write_error)?;
    Ok(())
}

pub async fn claim(
    pool: &PgPool,
    key_id: &[u8],
    setup_hash: &[u8],
    username: &str,
    phc: &str,
    session_hash: &[u8],
) -> Result<Account, Error> {
    valid_account(username, phc)?;
    valid_token(setup_hash)?;
    valid_token(session_hash)?;
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key_id)?;
    if state.owner_id.is_some() || owner_exists(&mut tx).await? {
        return Err(Error::Conflict);
    }
    if state.setup_hash.as_deref() != Some(setup_hash)
        || !state
            .setup_expires_at
            .is_some_and(|expiry| expiry > state.now)
    {
        return Err(Error::Rejected);
    }
    let account = sqlx::query_as!(Account,
        "INSERT INTO users (username, password_phc, role) VALUES ($1, $2, 'owner') RETURNING id, username, role",
        username, phc)
        .fetch_one(&mut *tx).await.map_err(write_error)?;
    new_session(&mut tx, account.id, 0, session_hash, state.now).await?;
    sqlx::query!("UPDATE auth_state SET owner_id = $1, setup_hash = NULL, setup_expires_at = NULL WHERE singleton = TRUE", account.id)
        .execute(&mut *tx).await.map_err(|_| Error::Unavailable)?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(account)
}

pub async fn reserve_login(
    pool: &PgPool,
    key_id: &[u8],
    username: &str,
    bucket: u8,
) -> Result<Option<LoginSnapshot>, Error> {
    if !(1..=64).contains(&bucket) {
        return Err(Error::Rejected);
    }
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key_id)?;
    reserve(&mut tx, 1, state.now, 20).await?;
    reserve(&mut tx, i16::from(bucket) + 1, state.now, 5).await?;
    let row = sqlx::query_as!(UserRow,
        "SELECT id, username, password_phc, role, active, generation FROM users WHERE username = $1", username)
        .fetch_optional(&mut *tx).await.map_err(|_| Error::Unavailable)?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(row.map(|row| LoginSnapshot {
        account: Account {
            id: row.id,
            username: row.username,
            role: row.role,
        },
        phc: row.password_phc,
        generation: row.generation,
        active: row.active,
    }))
}

pub async fn finish_login(
    pool: &PgPool,
    key_id: &[u8],
    snapshot: &LoginSnapshot,
    session_hash: &[u8],
    previous_hash: Option<&[u8]>,
) -> Result<Account, Error> {
    valid_token(session_hash)?;
    if let Some(previous) = previous_hash {
        valid_token(previous)?;
    }
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key_id)?;
    let row = sqlx::query_as!(UserRow,
        "SELECT id, username, password_phc, role, active, generation FROM users WHERE id = $1 FOR UPDATE", snapshot.account.id)
        .fetch_optional(&mut *tx).await.map_err(|_| Error::Unavailable)?
        .ok_or(Error::Unauthorized)?;
    if !snapshot.active
        || !row.active
        || row.generation != snapshot.generation
        || row.password_phc != snapshot.phc
        || row.username != snapshot.account.username
        || row.role != snapshot.account.role
    {
        return Err(Error::Unauthorized);
    }
    // Rotation retires only the bearer presented by this browser, including
    // account switches. Do this before session-cap admission, inside the same
    // transaction: a failed insertion rolls back retirement of the old bearer.
    if let Some(previous) = previous_hash {
        sqlx::query!(
            "UPDATE sessions SET revoked = TRUE WHERE verifier = $1 AND verifier <> $2",
            previous,
            session_hash
        )
        .execute(&mut *tx)
        .await
        .map_err(|_| Error::Unavailable)?;
    }
    new_session(&mut tx, row.id, row.generation, session_hash, state.now).await?;
    let account = row.account();
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(account)
}

pub async fn session(pool: &PgPool, key_id: &[u8], verifier: &[u8]) -> Result<Session, Error> {
    if verifier.len() != 32 {
        return Err(Error::Unauthorized);
    }
    let state = read_state(pool).await?;
    checked_key(&state, key_id)?;
    let row = sqlx::query!(
        "SELECT u.id, u.username, u.role, u.generation FROM sessions s JOIN users u ON u.id = s.account_id WHERE s.verifier = $1 AND s.revoked = FALSE AND s.expires_at > floor(extract(epoch FROM clock_timestamp()))::bigint AND s.generation = u.generation AND u.active = TRUE",
        verifier)
        .fetch_optional(pool).await.map_err(|_| Error::Unavailable)?
        .ok_or(Error::Unauthorized)?;
    Ok(Session {
        account: Account {
            id: row.id,
            username: row.username,
            role: row.role,
        },
        generation: row.generation,
    })
}

pub(super) async fn guide_session(
    pool: &PgPool,
    key_id: &[u8],
    verifier: &[u8],
) -> Result<Session, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key_id)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(session)
}

async fn actor(
    tx: &mut Transaction<'_, Postgres>,
    verifier: &[u8],
    now: i64,
) -> Result<Session, Error> {
    if verifier.len() != 32 {
        return Err(Error::Unauthorized);
    }
    let row = sqlx::query!(
        "SELECT u.id, u.username, u.role, u.generation FROM sessions s JOIN users u ON u.id = s.account_id WHERE s.verifier = $1 AND s.revoked = FALSE AND s.expires_at > $2 AND s.generation = u.generation AND u.active = TRUE FOR UPDATE OF u, s",
        verifier, now)
        .fetch_optional(&mut **tx).await.map_err(|_| Error::Unavailable)?
        .ok_or(Error::Unauthorized)?;
    Ok(Session {
        account: Account {
            id: row.id,
            username: row.username,
            role: row.role,
        },
        generation: row.generation,
    })
}

pub async fn logout(pool: &PgPool, key_id: &[u8], verifier: &[u8]) -> Result<(), Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key_id)?;
    actor(&mut tx, verifier, state.now).await?;
    sqlx::query!(
        "UPDATE sessions SET revoked = TRUE WHERE verifier = $1",
        verifier
    )
    .execute(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    tx.commit().await.map_err(|_| Error::Unavailable)
}

pub async fn revoke_all(pool: &PgPool, key_id: &[u8], verifier: &[u8]) -> Result<(), Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key_id)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    if session.generation == i64::MAX {
        return Err(Error::Unavailable);
    }
    sqlx::query!(
        "UPDATE users SET generation = generation + 1 WHERE id = $1",
        session.account.id
    )
    .execute(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    sqlx::query!(
        "UPDATE sessions SET revoked = TRUE WHERE account_id = $1",
        session.account.id
    )
    .execute(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    tx.commit().await.map_err(|_| Error::Unavailable)
}

pub async fn create_member(
    pool: &PgPool,
    key_id: &[u8],
    verifier: &[u8],
    username: &str,
    phc: &str,
) -> Result<Account, Error> {
    valid_account(username, phc)?;
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key_id)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    if session.account.role != "owner" {
        return Err(Error::Forbidden);
    }
    let account = sqlx::query_as!(Account,
        "INSERT INTO users (username, password_phc, role) VALUES ($1, $2, 'member') RETURNING id, username, role",
        username, phc)
        .fetch_one(&mut *tx).await.map_err(write_error)?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(account)
}

pub async fn members(pool: &PgPool, key_id: &[u8], verifier: &[u8]) -> Result<Vec<Account>, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key_id)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    if session.account.role != "owner" {
        return Err(Error::Forbidden);
    }
    let members = sqlx::query_as!(
        Account,
        "SELECT id, username, role FROM users WHERE role = 'member' ORDER BY id LIMIT 101"
    )
    .fetch_all(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(members)
}

pub async fn revoke_member(
    pool: &PgPool,
    key_id: &[u8],
    verifier: &[u8],
    member_id: i64,
) -> Result<(), Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key_id)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    if session.account.role != "owner" {
        return Err(Error::Forbidden);
    }
    let target = sqlx::query!(
        "SELECT role, active, generation FROM users WHERE id = $1 FOR UPDATE",
        member_id
    )
    .fetch_optional(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?
    .ok_or(Error::NotFound)?;
    if target.role != "member" {
        return Err(Error::Forbidden);
    }
    if target.active {
        if target.generation == i64::MAX {
            return Err(Error::Unavailable);
        }
        sqlx::query!(
            "UPDATE users SET active = FALSE, generation = generation + 1 WHERE id = $1",
            member_id
        )
        .execute(&mut *tx)
        .await
        .map_err(|_| Error::Unavailable)?;
        sqlx::query!(
            "UPDATE sessions SET revoked = TRUE WHERE account_id = $1",
            member_id
        )
        .execute(&mut *tx)
        .await
        .map_err(|_| Error::Unavailable)?;
    }
    tx.commit().await.map_err(|_| Error::Unavailable)
}
