mod auth;
mod config;
mod database;
mod directory;
mod identity;
mod providers;

use axum::{
    Json, Router,
    extract::State,
    http::{HeaderValue, StatusCode, header},
    middleware,
    response::{IntoResponse, Response},
    routing::get,
};
use serde::Serialize;
use sqlx::PgPool;
use std::{future::IntoFuture, path::Path, process::ExitCode, time::Duration};
use tower::limit::ConcurrencyLimitLayer;

#[derive(Serialize)]
struct Health {
    status: &'static str,
    identity: identity::Identity,
}
#[derive(Serialize)]
struct Readiness {
    status: &'static str,
}

#[tokio::main]
async fn main() -> ExitCode {
    match run().await {
        Ok(()) => ExitCode::SUCCESS,
        Err(message) => {
            eprintln!("{message}");
            ExitCode::from(2)
        }
    }
}

async fn run() -> Result<(), String> {
    let args: Vec<String> = std::env::args().collect();
    let command = args.get(1).map(String::as_str).unwrap_or("serve");
    if command == "artifact-info" && args.len() == 2 {
        println!(
            "{}",
            serde_json::json!({"identity":identity::compiled(),"workspace_contract":"reborn-workspace-v1","database_schema":5,"assets":auth::artifact_assets()})
        );
        return Ok(());
    }
    if command == "init-key" && args.len() == 3 {
        return auth::crypto::Secrets::init_key(Path::new(&args[2]))
            .map_err(|_| "private key initialization rejected".into());
    }
    if !((matches!(command, "serve" | "migrate" | "healthcheck") && args.len() <= 2)
        || (command == "prepare-owner" && args.len() == 3))
    {
        return Err(
            "usage: keida-hub-reborn [serve|migrate|healthcheck|init-key NEW_PATH|prepare-owner NEW_PATH]"
                .into(),
        );
    }
    let config =
        config::Config::load().map_err(|field| format!("configuration rejected: {field}"))?;
    if command == "healthcheck" {
        let client = reqwest::Client::builder()
            .no_proxy()
            .timeout(Duration::from_secs(2))
            .build()
            .map_err(|_| "health client unavailable")?;
        let value = client
            .get(format!("http://127.0.0.1:{}/api/ready", config.bind.port()))
            .send()
            .await
            .map_err(|_| "not ready")?;
        if value.status() != StatusCode::OK
            || value
                .json::<serde_json::Value>()
                .await
                .map_err(|_| "not ready")?["status"]
                != "ready"
        {
            return Err("not ready".into());
        }
        return Ok(());
    }
    let pool = database::pool(&config);
    if command == "migrate" {
        tokio::time::timeout(Duration::from_secs(30), database::migrate(&pool))
            .await
            .map_err(|_| "migration deadline exceeded")?
            .map_err(|_| "migration rejected")?;
        pool.close().await;
        return Ok(());
    }
    let auth = config
        .key_file
        .as_deref()
        .map(|path| auth::Service::load(pool.clone(), config.origin.clone(), path))
        .transpose()
        .map_err(|_| "configuration rejected: REBORN_INSTANCE_KEY_FILE")?;
    if command == "prepare-owner" {
        if !database::ready(&pool).await {
            return Err("schema unavailable".into());
        }
        return auth
            .ok_or("configuration rejected: REBORN_INSTANCE_KEY_FILE")?
            .prepare_owner(Path::new(&args[2]))
            .await
            .map_err(Into::into);
    }
    let state = AppState {
        pool: pool.clone(),
        auth: auth.clone(),
    };
    let mut app = Router::new()
        .route(
            "/api/health",
            get(|| async {
                Json(Health {
                    status: "ok",
                    identity: identity::compiled(),
                })
            }),
        )
        .route("/version", get(|| async { Json(identity::compiled()) }))
        .route("/api/ready", get(readiness))
        .fallback(|| async { StatusCode::NOT_FOUND })
        .with_state(state);
    if let Some(service) = auth {
        app = app.merge(auth::router(service));
    }
    let app = app
        .layer(ConcurrencyLimitLayer::new(64))
        .layer(middleware::from_fn(headers));
    let listener = tokio::net::TcpListener::bind(config.bind)
        .await
        .map_err(|_| "listener unavailable")?;
    let (stop, stopped) = tokio::sync::oneshot::channel::<()>();
    let server = axum::serve(listener, app)
        .with_graceful_shutdown(async {
            let _ = stopped.await;
        })
        .into_future();
    tokio::pin!(server);
    let result = tokio::select! {
        result = &mut server => result.map_err(|_| "server failed"),
        _ = shutdown() => {
            let _ = stop.send(());
            tokio::time::timeout(Duration::from_secs(5), &mut server)
                .await.map_err(|_| "shutdown deadline exceeded")?
                .map_err(|_| "server failed")
        }
    };
    pool.close().await;
    result.map_err(Into::into)
}

#[derive(Clone)]
struct AppState {
    pool: PgPool,
    auth: Option<auth::Service>,
}

async fn readiness(State(state): State<AppState>) -> (StatusCode, Json<Readiness>) {
    let ready = tokio::time::timeout(Duration::from_secs(2), async {
        if !database::ready(&state.pool).await {
            return false;
        }
        match state.auth {
            Some(service) => service.ready().await,
            None => true,
        }
    })
    .await
    .unwrap_or(false);
    if ready {
        (StatusCode::OK, Json(Readiness { status: "ready" }))
    } else {
        (
            StatusCode::SERVICE_UNAVAILABLE,
            Json(Readiness {
                status: "not_ready",
            }),
        )
    }
}

async fn headers(request: axum::extract::Request, next: middleware::Next) -> Response {
    let account_document = matches!(
        request.uri().path(),
        "/workspace"
            | "/account"
            | "/account/claim"
            | "/account/sign-in"
            | "/account/sign-out"
            | "/account/sign-out-all"
    );
    let mut response = match tokio::time::timeout(Duration::from_secs(4), next.run(request)).await {
        Ok(response) => response,
        Err(_) if account_document => auth::account_timeout(),
        Err(_) => (
            StatusCode::REQUEST_TIMEOUT,
            Json(serde_json::json!({"error":"request_timeout"})),
        )
            .into_response(),
    };
    let headers = response.headers_mut();
    headers
        .entry(header::CACHE_CONTROL)
        .or_insert(HeaderValue::from_static("no-store"));
    headers.insert(
        header::X_CONTENT_TYPE_OPTIONS,
        HeaderValue::from_static("nosniff"),
    );
    headers
        .entry(header::CONTENT_SECURITY_POLICY)
        .or_insert(HeaderValue::from_static(
            "default-src 'none'; frame-ancestors 'none'",
        ));
    response
}

async fn shutdown() {
    let mut terminate = tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
        .expect("signal handler");
    tokio::select! { _ = tokio::signal::ctrl_c() => {}, _ = terminate.recv() => {} }
}
