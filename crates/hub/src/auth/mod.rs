mod account_pages;
mod account_view;
mod connections;
pub mod crypto;
mod directory;
pub mod store;
#[cfg(test)]
mod store_contracts;
mod workspace;
mod workspace_assets;

use axum::{
    Json, Router,
    extract::{
        DefaultBodyLimit, Path, State,
        rejection::{JsonRejection, PathRejection},
    },
    http::{HeaderMap, HeaderValue, Method, StatusCode, header},
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::{get, post},
};
use crypto::{CryptoError, Secrets};
use serde::Deserialize;
use serde_json::{Value, json};
use sqlx::PgPool;
use std::{
    path::Path as FsPath,
    sync::Arc,
    time::{SystemTime, UNIX_EPOCH},
};

pub const CONTRACT: &str = "reborn-auth-v1";
pub fn artifact_assets() -> Vec<String> {
    workspace_assets::manifest()
}
pub fn account_timeout() -> Response {
    account_pages::timeout()
}
const SESSION: &str = "__Host-keida-reborn-session";
const FORM: &str = "__Host-keida-reborn-form";

#[derive(Clone)]
pub struct Service {
    pool: PgPool,
    secrets: Arc<Secrets>,
    key_id: Arc<Vec<u8>>,
    origin: Arc<str>,
    observer: Arc<crate::providers::crafty::Observer>,
}

impl Service {
    pub fn load(pool: PgPool, origin: String, key_path: &FsPath) -> Result<Self, CryptoError> {
        let secrets = Secrets::from_file(key_path)?;
        let key_id = Arc::new(secrets.fingerprint());
        Ok(Self {
            pool,
            secrets,
            key_id,
            origin: origin.into(),
            observer: Arc::new(crate::providers::crafty::Observer::new()),
        })
    }

    pub async fn ready(&self) -> bool {
        tokio::time::timeout(
            std::time::Duration::from_secs(2),
            store::status(&self.pool, &self.key_id),
        )
        .await
        .is_ok_and(|r| r.is_ok())
    }

    pub async fn prepare_owner(&self, path: &FsPath) -> Result<(), &'static str> {
        let token = Secrets::token().map_err(|_| "owner preparation rejected")?;
        let hash = Secrets::token_hash(&token).map_err(|_| "owner preparation rejected")?;
        Secrets::write_private_token(path, &token)
            .map_err(|_| "private output creation rejected")?;
        // Commit failure can be uncertain. Retain this newly created private
        // output so a committed preparation never loses its sole usable secret.
        store::prepare_owner(&self.pool, &self.key_id, &hash)
            .await
            .map_err(|_| "owner preparation rejected; new private output retained")
    }
}

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/api/auth/form", get(form))
        .route("/api/auth/claim", post(claim))
        .route("/api/auth/login", post(login))
        .route("/api/auth/session", get(session))
        .route("/api/auth/logout", post(logout))
        .route("/api/auth/revoke-all", post(revoke_all))
        .route("/api/owner/members", get(members).post(create_member))
        .route("/api/owner/members/{id}/revoke", post(revoke_member))
        .layer(DefaultBodyLimit::max(8192))
        .layer(middleware::from_fn_with_state(
            service.clone(),
            schema_guard,
        ))
        .with_state(service.clone())
        .merge(account_pages::router(service.clone()))
        .merge(connections::router(service.clone()))
        .merge(directory::router(service.clone()))
        .merge(workspace::router(service))
}

async fn schema_guard(
    State(service): State<Service>,
    request: axum::extract::Request,
    next: Next,
) -> Response {
    let method = request.method();
    let path = request.uri().path();
    // Axum's GET routes also serve HEAD through the same handlers.
    let read_request = method == Method::GET || method == Method::HEAD;
    let public_form = read_request && path == "/api/auth/form";
    let protected_read = read_request && matches!(path, "/api/auth/session" | "/api/owner/members");
    let mutation_request = method == Method::POST;
    if public_form || protected_read || mutation_request {
        if !public_form {
            let admission = if mutation_request {
                mutation(&service, request.headers()).map(|_| ())
            } else {
                client(request.headers())
            };
            if let Err(error) = admission {
                return error.into_response();
            }
        }
        // Readiness is an admission gate, not merely a diagnostic badge. The
        // separately owned migrator must still fence live writes during upgrades.
        if !crate::database::ready(&service.pool).await {
            return ApiError(StatusCode::SERVICE_UNAVAILABLE, "unavailable").into_response();
        }
    }
    next.run(request).await
}

struct ApiError(StatusCode, &'static str);
impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        (self.0, Json(json!({"error":self.1}))).into_response()
    }
}
impl From<store::Error> for ApiError {
    fn from(error: store::Error) -> Self {
        use store::Error::*;
        match error {
            Unauthorized => Self(StatusCode::UNAUTHORIZED, "invalid_session"),
            Forbidden => Self(StatusCode::FORBIDDEN, "forbidden"),
            Conflict => Self(StatusCode::CONFLICT, "conflict"),
            Limited => Self(StatusCode::TOO_MANY_REQUESTS, "try_later"),
            Unavailable => Self(StatusCode::SERVICE_UNAVAILABLE, "unavailable"),
            NotFound => Self(StatusCode::NOT_FOUND, "not_found"),
            Rejected => Self(StatusCode::FORBIDDEN, "setup_rejected"),
        }
    }
}
impl From<CryptoError> for ApiError {
    fn from(error: CryptoError) -> Self {
        match error {
            CryptoError::Invalid => Self(StatusCode::BAD_REQUEST, "invalid_request"),
            CryptoError::Busy => Self(StatusCode::TOO_MANY_REQUESTS, "try_later"),
            CryptoError::Unavailable => Self(StatusCode::SERVICE_UNAVAILABLE, "unavailable"),
        }
    }
}

fn one<'a>(headers: &'a HeaderMap, name: &str) -> Option<&'a str> {
    let mut values = headers.get_all(name).iter();
    let first = values.next()?.to_str().ok()?;
    if values.next().is_some() {
        return None;
    }
    Some(first)
}
fn client(headers: &HeaderMap) -> Result<(), ApiError> {
    if one(headers, "x-reborn-product") != Some("keida-hub-reborn")
        || one(headers, "x-reborn-contract") != Some(CONTRACT)
    {
        return Err(ApiError(StatusCode::UPGRADE_REQUIRED, "upgrade_required"));
    }
    Ok(())
}
fn mutation<'a>(service: &Service, headers: &'a HeaderMap) -> Result<&'a str, ApiError> {
    client(headers)?;
    if one(headers, "origin") != Some(service.origin.as_ref()) {
        return Err(ApiError(StatusCode::FORBIDDEN, "origin_rejected"));
    }
    one(headers, "x-csrf-token").ok_or(ApiError(StatusCode::FORBIDDEN, "csrf_rejected"))
}

struct Cookies {
    session: Option<String>,
    form: Option<String>,
}
fn cookies(headers: &HeaderMap) -> Result<Cookies, ()> {
    let mut result = Cookies {
        session: None,
        form: None,
    };
    for line in headers.get_all(header::COOKIE) {
        for part in line.to_str().map_err(|_| ())?.split(';') {
            let (name, value) = part.trim().split_once('=').ok_or(())?;
            if name.is_empty() {
                return Err(());
            }
            let slot = match name {
                SESSION => {
                    Secrets::token_hash(value).map_err(|_| ())?;
                    &mut result.session
                }
                FORM => {
                    if !canonical_form(value) {
                        return Err(());
                    }
                    &mut result.form
                }
                _ => continue,
            };
            if slot.is_some() || value.is_empty() {
                return Err(());
            }
            *slot = Some(value.to_owned());
        }
    }
    Ok(result)
}
fn canonical_form(value: &str) -> bool {
    let parts: Vec<_> = value.split('.').collect();
    parts.len() == 4
        && parts[0] == "v1"
        && parts[1]
            .parse::<u64>()
            .is_ok_and(|n| n.to_string() == parts[1])
        && Secrets::token_hash(parts[2]).is_ok()
        && Secrets::token_hash(parts[3]).is_ok()
}
fn clock() -> Result<u64, ApiError> {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_secs())
        .map_err(|_| ApiError(StatusCode::SERVICE_UNAVAILABLE, "unavailable"))
}
fn anonymous(service: &Service, headers: &HeaderMap) -> Result<(), ApiError> {
    let csrf = mutation(service, headers)?;
    anonymous_csrf(service, headers, csrf)
}
fn anonymous_csrf(service: &Service, headers: &HeaderMap, csrf: &str) -> Result<(), ApiError> {
    let parsed = cookies(headers).map_err(|_| ApiError(StatusCode::FORBIDDEN, "csrf_rejected"))?;
    let cookie = parsed
        .form
        .ok_or(ApiError(StatusCode::FORBIDDEN, "csrf_rejected"))?;
    if !service.secrets.verify_form(&cookie, csrf, clock()?) {
        return Err(ApiError(StatusCode::FORBIDDEN, "csrf_rejected"));
    }
    Ok(())
}
struct Principal {
    token: String,
    hash: Vec<u8>,
    session: store::Session,
}
async fn principal(
    service: &Service,
    headers: &HeaderMap,
    write: bool,
) -> Result<Principal, ApiError> {
    let csrf = if write {
        Some(mutation(service, headers)?)
    } else {
        client(headers)?;
        None
    };
    principal_csrf(service, headers, csrf).await
}
async fn principal_csrf(
    service: &Service,
    headers: &HeaderMap,
    csrf: Option<&str>,
) -> Result<Principal, ApiError> {
    let parsed =
        cookies(headers).map_err(|_| ApiError(StatusCode::UNAUTHORIZED, "invalid_session"))?;
    let token = parsed
        .session
        .ok_or(ApiError(StatusCode::UNAUTHORIZED, "invalid_session"))?;
    let hash = Secrets::token_hash(&token)
        .map_err(|_| ApiError(StatusCode::UNAUTHORIZED, "invalid_session"))?;
    if csrf.is_some_and(|csrf| !service.secrets.verify_session_csrf(&token, csrf)) {
        return Err(ApiError(StatusCode::FORBIDDEN, "csrf_rejected"));
    }
    let session = store::session(&service.pool, &service.key_id, &hash).await?;
    Ok(Principal {
        token,
        hash,
        session,
    })
}
fn account(account: store::Account) -> Value {
    json!({"id":account.id.to_string(),"username":account.username,"role":account.role})
}
fn set_cookie(response: &mut Response, name: &str, value: &str, max_age: u64) {
    let value = HeaderValue::from_str(&format!(
        "{name}={value}; Path=/; Max-Age={max_age}; Secure; HttpOnly; SameSite=Strict"
    ))
    .expect("only validated canonical tokens enter cookies");
    response.headers_mut().append(header::SET_COOKIE, value);
}
fn clear_session(response: &mut Response) {
    set_cookie(response, SESSION, "", 0);
}
fn private_error(error: ApiError) -> Response {
    let unauthorized = error.0 == StatusCode::UNAUTHORIZED;
    let mut response = error.into_response();
    if unauthorized {
        clear_session(&mut response);
    }
    response
}
fn payload<T>(input: Result<Json<T>, JsonRejection>) -> Result<T, ApiError> {
    input.map(|Json(value)| value).map_err(|error| {
        ApiError(
            if error.status() == StatusCode::PAYLOAD_TOO_LARGE {
                StatusCode::PAYLOAD_TOO_LARGE
            } else {
                StatusCode::BAD_REQUEST
            },
            "invalid_request",
        )
    })
}
fn username(value: String) -> Result<String, ApiError> {
    let value = value.trim().to_ascii_lowercase();
    if !(3..=32).contains(&value.len())
        || !value
            .bytes()
            .all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || matches!(b, b'_' | b'-'))
    {
        return Err(ApiError(StatusCode::BAD_REQUEST, "invalid_request"));
    }
    Ok(value)
}
fn password(value: &str) -> Result<(), ApiError> {
    if !(15..=128).contains(&value.chars().count()) || value.len() > 512 {
        return Err(ApiError(StatusCode::BAD_REQUEST, "invalid_request"));
    }
    Ok(())
}
fn signed_in(
    service: &Service,
    status: StatusCode,
    who: store::Account,
    token: &str,
) -> Result<Response, ApiError> {
    let csrf = service.secrets.session_csrf(token)?;
    let mut response = (
        status,
        Json(json!({"account":account(who),"csrf_token":csrf})),
    )
        .into_response();
    session_cookies(&mut response, token);
    Ok(response)
}
fn session_cookies(response: &mut Response, token: &str) {
    set_cookie(response, SESSION, token, 43_200);
    set_cookie(response, FORM, "", 0);
}

async fn form(State(service): State<Service>) -> Result<Response, ApiError> {
    let status = store::status(&service.pool, &service.key_id).await?;
    let (cookie, csrf) = service.secrets.new_form(clock()?)?;
    let mut response = Json(
        json!({"csrf_token":csrf,"contract":CONTRACT,"setup_available":status.setup_available}),
    )
    .into_response();
    set_cookie(&mut response, FORM, &cookie, 600);
    Ok(response)
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct ClaimInput {
    setup_secret: String,
    username: String,
    password: String,
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct LoginInput {
    username: String,
    password: String,
}

async fn claim(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<ClaimInput>, JsonRejection>,
) -> Result<Response, ApiError> {
    anonymous(&service, &headers)?;
    let input = payload(body)?;
    let authenticated = authenticate_claim(&service, input).await?;
    signed_in(
        &service,
        StatusCode::CREATED,
        authenticated.who,
        &authenticated.token,
    )
}
struct Authenticated {
    who: store::Account,
    token: String,
}
// Both admitted HTTP transports call the same credential/domain path. Cookie,
// origin and client-contract admission remain explicit in each adapter.
async fn authenticate_claim(
    service: &Service,
    input: ClaimInput,
) -> Result<Authenticated, ApiError> {
    let username = username(input.username)?;
    password(&input.password)?;
    let setup_hash = Secrets::token_hash(&input.setup_secret)
        .map_err(|_| ApiError(StatusCode::FORBIDDEN, "setup_rejected"))?;
    store::reserve_setup(&service.pool, &service.key_id).await?;
    let snapshot = store::bootstrap(&service.pool, &service.key_id).await?;
    if snapshot.expires <= snapshot.now || !Secrets::constant_equal(&setup_hash, &snapshot.hash) {
        return Err(ApiError(StatusCode::FORBIDDEN, "setup_rejected"));
    }
    let phc = service.secrets.hash_password(input.password).await?;
    let token = Secrets::token()?;
    let session_hash = Secrets::token_hash(&token)?;
    let who = store::claim(
        &service.pool,
        &service.key_id,
        &setup_hash,
        &username,
        &phc,
        &session_hash,
    )
    .await?;
    Ok(Authenticated { who, token })
}
async fn login(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<LoginInput>, JsonRejection>,
) -> Result<Response, ApiError> {
    anonymous(&service, &headers)?;
    let input = payload(body)?;
    let authenticated = authenticate_login(&service, &headers, input).await?;
    signed_in(
        &service,
        StatusCode::OK,
        authenticated.who,
        &authenticated.token,
    )
}
async fn authenticate_login(
    service: &Service,
    headers: &HeaderMap,
    input: LoginInput,
) -> Result<Authenticated, ApiError> {
    let username = username(input.username)?;
    password(&input.password)?;
    let snapshot = store::reserve_login(
        &service.pool,
        &service.key_id,
        &username,
        service.secrets.login_bucket(&username),
    )
    .await?;
    let verified = service
        .secrets
        .verify_password(input.password, snapshot.as_ref().map(|s| s.phc.clone()))
        .await?;
    let snapshot = snapshot
        .filter(|s| verified && s.active)
        .ok_or(ApiError(StatusCode::UNAUTHORIZED, "invalid_credentials"))?;
    let token = Secrets::token()?;
    let hash = Secrets::token_hash(&token)?;
    let previous_hash = cookies(headers)
        .map_err(|_| ApiError(StatusCode::FORBIDDEN, "csrf_rejected"))?
        .session
        .map(|value| Secrets::token_hash(&value))
        .transpose()?;
    let who = store::finish_login(
        &service.pool,
        &service.key_id,
        &snapshot,
        &hash,
        previous_hash.as_deref(),
    )
    .await
    .map_err(|e| {
        if e == store::Error::Unauthorized {
            ApiError(StatusCode::UNAUTHORIZED, "invalid_credentials")
        } else {
            e.into()
        }
    })?;
    Ok(Authenticated { who, token })
}
async fn session(State(service): State<Service>, headers: HeaderMap) -> Response {
    match principal(&service, &headers, false).await {
        Ok(p) => match service.secrets.session_csrf(&p.token) {
            Ok(csrf) => Json(json!({"account":account(p.session.account),"csrf_token":csrf,"session_generation":p.session.generation.to_string()}))
                .into_response(),
            Err(e) => private_error(e.into()),
        },
        Err(e) => private_error(e),
    }
}
async fn logout(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result = async {
        let p = principal(&service, &headers, true).await?;
        store::logout(&service.pool, &service.key_id, &p.hash)
            .await
            .map_err(ApiError::from)
    }
    .await;
    cleared(result)
}
async fn revoke_all(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result = async {
        let p = principal(&service, &headers, true).await?;
        store::revoke_all(&service.pool, &service.key_id, &p.hash)
            .await
            .map_err(ApiError::from)
    }
    .await;
    cleared(result)
}
fn cleared(result: Result<(), ApiError>) -> Response {
    match result {
        Ok(()) => {
            let mut response = StatusCode::NO_CONTENT.into_response();
            clear_session(&mut response);
            response
        }
        Err(error) => private_error(error),
    }
}
async fn create_member(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<LoginInput>, JsonRejection>,
) -> Response {
    let result = async {
        let p = principal(&service, &headers, true).await?;
        if p.session.account.role != "owner" {
            return Err(ApiError(StatusCode::FORBIDDEN, "forbidden"));
        }
        let input = payload(body)?;
        let username = username(input.username)?;
        let phc = service.secrets.hash_password(input.password).await?;
        let who =
            store::create_member(&service.pool, &service.key_id, &p.hash, &username, &phc).await?;
        Ok::<_, ApiError>(
            (StatusCode::CREATED, Json(json!({"account":account(who)}))).into_response(),
        )
    }
    .await;
    result.unwrap_or_else(private_error)
}
async fn members(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result = async {
        let p = principal(&service, &headers, false).await?;
        let mut accounts = store::members(&service.pool, &service.key_id, &p.hash).await?;
        let truncated = accounts.len() > 100;
        accounts.truncate(100);
        Ok::<_, ApiError>(Json(json!({"members":accounts.into_iter().map(account).collect::<Vec<_>>(),"truncated":truncated})).into_response())
    }.await;
    result.unwrap_or_else(private_error)
}
async fn revoke_member(
    State(service): State<Service>,
    headers: HeaderMap,
    path: Result<Path<String>, PathRejection>,
) -> Response {
    let result = async {
        let p = principal(&service, &headers, true).await?;
        let Path(id) = path.map_err(|_| ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
        let id = id
            .parse::<i64>()
            .ok()
            .filter(|id| *id > 0)
            .ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
        store::revoke_member(&service.pool, &service.key_id, &p.hash, id).await?;
        Ok(())
    }
    .await;
    match result {
        Ok(()) => StatusCode::NO_CONTENT.into_response(),
        Err(e) => private_error(e),
    }
}
