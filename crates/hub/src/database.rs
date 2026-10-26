use crate::config::Config;
use sqlx::{PgPool, migrate::Migrate, postgres::PgPoolOptions};
use std::time::Duration;

pub static MIGRATOR: sqlx::migrate::Migrator = sqlx::migrate!("../../migrations");

pub fn pool(config: &Config) -> PgPool {
    PgPoolOptions::new()
        .max_connections(config.max_connections)
        .acquire_timeout(Duration::from_secs(2))
        .connect_lazy_with(config.database.clone())
}

// Only this command admits migrations; SQLx PostgreSQL advisory locking serializes
// concurrent commands. The web server never calls it, even on a fresh database.
pub async fn migrate(pool: &PgPool) -> Result<(), sqlx::migrate::MigrateError> {
    MIGRATOR.run(pool).await
}

pub async fn ready(pool: &PgPool) -> bool {
    tokio::time::timeout(Duration::from_secs(2), check_schema(pool))
        .await
        .is_ok_and(|result| result.is_ok())
}

async fn check_schema(pool: &PgPool) -> Result<(), sqlx::migrate::MigrateError> {
    let mut conn = pool.acquire().await?;
    if conn.dirty_version("_sqlx_migrations").await?.is_some() {
        return Err(sqlx::migrate::MigrateError::VersionMissing(1));
    }
    let applied = conn.list_applied_migrations("_sqlx_migrations").await?;
    let expected: Vec<_> = MIGRATOR.iter().collect();
    if applied.len() != expected.len()
        || applied
            .iter()
            .zip(expected)
            .any(|(a, e)| a.version != e.version || a.checksum != e.checksum)
    {
        return Err(sqlx::migrate::MigrateError::VersionMissing(1));
    }
    let meta =
        sqlx::query!("SELECT product, schema_version FROM reborn_schema WHERE singleton = TRUE")
            .fetch_one(&mut *conn)
            .await?;
    if meta.product != "keida-hub-reborn" || meta.schema_version != 3 {
        return Err(sqlx::migrate::MigrateError::VersionMissing(1));
    }
    Ok(())
}
