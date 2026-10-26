use sqlx::postgres::PgConnectOptions;
use std::{env, net::SocketAddr, path::PathBuf, str::FromStr};
use url::Url;

// Deliberately no Debug: a connection string is secret-bearing configuration.
pub struct Config {
    pub bind: SocketAddr,
    pub origin: String,
    pub key_file: Option<PathBuf>,
    pub database: PgConnectOptions,
    pub max_connections: u32,
}

impl Config {
    pub fn load() -> Result<Self, &'static str> {
        let origin = env::var("REBORN_PUBLIC_ORIGIN").map_err(|_| "REBORN_PUBLIC_ORIGIN")?;
        let parsed = Url::parse(&origin).map_err(|_| "REBORN_PUBLIC_ORIGIN")?;
        if parsed.scheme() != "https"
            || parsed.host_str().is_none()
            || !parsed.username().is_empty()
            || parsed.password().is_some()
            || parsed.path() != "/"
            || parsed.query().is_some()
            || parsed.fragment().is_some()
        {
            return Err("REBORN_PUBLIC_ORIGIN");
        }
        let dsn = env::var("DATABASE_URL").map_err(|_| "DATABASE_URL")?;
        let url = Url::parse(&dsn).map_err(|_| "DATABASE_URL")?;
        if !matches!(url.scheme(), "postgres" | "postgresql")
            || url.host_str().is_none()
            || url.username().is_empty()
            || url.path().trim_matches('/').is_empty()
            || url.path().trim_matches('/').contains('/')
            || url.fragment().is_some()
        {
            return Err("DATABASE_URL");
        }
        let database = PgConnectOptions::from_str(&dsn)
            .map_err(|_| "DATABASE_URL")?
            .options([("statement_timeout", "2000"), ("lock_timeout", "1500")]);
        let bind = env::var("REBORN_BIND")
            .unwrap_or_else(|_| "127.0.0.1:8788".into())
            .parse()
            .map_err(|_| "REBORN_BIND")?;
        let max_connections = env::var("REBORN_DB_MAX_CONNECTIONS")
            .unwrap_or_else(|_| "5".into())
            .parse::<u32>()
            .map_err(|_| "REBORN_DB_MAX_CONNECTIONS")?;
        if !(1..=16).contains(&max_connections) {
            return Err("REBORN_DB_MAX_CONNECTIONS");
        }
        let key_file = env::var_os("REBORN_INSTANCE_KEY_FILE").map(PathBuf::from);
        if key_file.as_ref().is_some_and(|p| !p.is_absolute()) {
            return Err("REBORN_INSTANCE_KEY_FILE");
        }
        Ok(Self {
            bind,
            origin: parsed.origin().ascii_serialization(),
            key_file,
            database,
            max_connections,
        })
    }
}
