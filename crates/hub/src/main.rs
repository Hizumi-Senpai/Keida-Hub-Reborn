mod config;
mod database;
mod identity;

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
use std::{future::IntoFuture, process::ExitCode, time::Duration};
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
    let command = std::env::args().nth(1).unwrap_or_else(|| "serve".into());
    if !matches!(command.as_str(), "serve" | "migrate") || std::env::args().len() > 2 {
        return Err("usage: keida-hub-reborn [serve|migrate]".into());
    }
    let config =
        config::Config::load().map_err(|field| format!("configuration rejected: {field}"))?;
    let pool = database::pool(&config);
    if command == "migrate" {
        tokio::time::timeout(Duration::from_secs(30), database::migrate(&pool))
            .await
            .map_err(|_| "migration deadline exceeded")?
            .map_err(|_| "migration rejected")?;
        pool.close().await;
        return Ok(());
    }
    let app = Router::new()
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
        .with_state(pool.clone())
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

async fn readiness(State(pool): State<PgPool>) -> (StatusCode, Json<Readiness>) {
    if database::ready(&pool).await {
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
    let mut response = match tokio::time::timeout(Duration::from_secs(4), next.run(request)).await {
        Ok(response) => response,
        Err(_) => StatusCode::REQUEST_TIMEOUT.into_response(),
    };
    let headers = response.headers_mut();
    headers.insert(header::CACHE_CONTROL, HeaderValue::from_static("no-store"));
    headers.insert(
        header::X_CONTENT_TYPE_OPTIONS,
        HeaderValue::from_static("nosniff"),
    );
    headers.insert(
        header::CONTENT_SECURITY_POLICY,
        HeaderValue::from_static("default-src 'none'; frame-ancestors 'none'"),
    );
    response
}

async fn shutdown() {
    let mut terminate = tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
        .expect("signal handler");
    tokio::select! { _ = tokio::signal::ctrl_c() => {}, _ = terminate.recv() => {} }
}
