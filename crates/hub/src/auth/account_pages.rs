//! Native HTML is a separate admitted transport over the same auth services.
use super::{
    account_view::{AccountPage, PageKind},
    *,
};
use askama::Template;
use axum::{
    body::Bytes,
    extract::rejection::BytesRejection,
    response::{Html, Redirect},
};
use sha2::{Digest, Sha256};
use std::{collections::BTreeMap, sync::OnceLock};

const PRODUCT: &str = "keida-hub-reborn";
const FORM_CONTRACT: &str = "reborn-account-v1";
const CSS: &str = include_str!("../../static/account.css");
const SCRIPT: &str = include_str!("../../static/account.js");
const HTML_CSP: &str = "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'";

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/account/sign-in", get(sign_in).post(submit_sign_in))
        .route("/account/claim", get(claim_page).post(submit_claim))
        .route("/account", get(account_page))
        .route("/account/sign-out", post(sign_out))
        .route("/account/sign-out-all", post(sign_out_all))
        .route("/assets/account/{file}", get(asset))
        .layer(DefaultBodyLimit::max(8192))
        .with_state(service)
}

fn asset_url(content: &str, extension: &str) -> String {
    let hash: String = Sha256::digest(content.as_bytes())
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect();
    format!("/assets/account/{hash}.{extension}")
}
fn css_url() -> &'static str {
    static URL: OnceLock<String> = OnceLock::new();
    URL.get_or_init(|| asset_url(CSS, "css"))
}
fn script_url() -> &'static str {
    static URL: OnceLock<String> = OnceLock::new();
    URL.get_or_init(|| asset_url(SCRIPT, "js"))
}
async fn asset(Path(file): Path<String>) -> Response {
    let path = format!("/assets/account/{file}");
    let (content, media) = if path == css_url() {
        (CSS, "text/css; charset=utf-8")
    } else if path == script_url() {
        (SCRIPT, "text/javascript; charset=utf-8")
    } else {
        return StatusCode::NOT_FOUND.into_response();
    };
    (
        [
            (header::CONTENT_TYPE, media),
            (header::CACHE_CONTROL, "public, max-age=31536000, immutable"),
        ],
        content,
    )
        .into_response()
}

fn render(kind: PageKind, status: StatusCode, csrf: &str, message: Option<&str>) -> Response {
    let page = AccountPage {
        kind,
        csrf_token: csrf,
        message,
        css_url: css_url(),
        script_url: Some(script_url()),
        identity: crate::identity::compiled(),
    };
    let mut response = match page.render() {
        Ok(html) => (status, Html(html)).into_response(),
        Err(_) => (
            StatusCode::SERVICE_UNAVAILABLE,
            Html("Account access is unavailable. Use a fresh sign-in form when it is available."),
        )
            .into_response(),
    };
    response.headers_mut().insert(
        header::CONTENT_SECURITY_POLICY,
        HeaderValue::from_static(HTML_CSP),
    );
    response.headers_mut().insert(
        header::REFERRER_POLICY,
        HeaderValue::from_static("same-origin"),
    );
    response
}
fn unavailable() -> Response {
    render(
        PageKind::Unavailable,
        StatusCode::SERVICE_UNAVAILABLE,
        "",
        Some(
            "Account access is unavailable. Try a fresh sign-in form later. An interrupted submission may have completed; do not resend it automatically.",
        ),
    )
}
pub(super) fn timeout() -> Response {
    render(
        PageKind::Unavailable,
        StatusCode::REQUEST_TIMEOUT,
        "",
        Some(
            "The request timed out and may have completed. Use a fresh sign-in form to check access. Your submission will not be resent automatically.",
        ),
    )
}
async fn schema(service: &Service) -> Result<(), ApiError> {
    if crate::database::ready(&service.pool).await {
        Ok(())
    } else {
        Err(ApiError(StatusCode::SERVICE_UNAVAILABLE, "unavailable"))
    }
}
async fn credential_page(
    service: &Service,
    kind: PageKind,
    status: StatusCode,
    message: Option<&str>,
) -> Response {
    let Ok((cookie, csrf)) = fresh_challenge(service).await else {
        return unavailable();
    };
    challenged(kind, status, message, &cookie, &csrf)
}
async fn fresh_challenge(service: &Service) -> Result<(String, String), ApiError> {
    schema(service).await?;
    store::status(&service.pool, &service.key_id).await?;
    service.secrets.new_form(clock()?).map_err(Into::into)
}
fn challenged(
    kind: PageKind,
    status: StatusCode,
    message: Option<&str>,
    cookie: &str,
    csrf: &str,
) -> Response {
    let mut response = render(kind, status, csrf, message);
    set_cookie(&mut response, FORM, cookie, 600);
    response
}
async fn sign_in(State(service): State<Service>) -> Response {
    credential_page(&service, PageKind::SignIn, StatusCode::OK, None).await
}
async fn claim_page(State(service): State<Service>) -> Response {
    if schema(&service).await.is_err() {
        return unavailable();
    }
    let (status, message) = match store::bootstrap(&service.pool, &service.key_id).await {
        Ok(_) => (StatusCode::OK, None),
        Err(store::Error::Conflict) => (
            StatusCode::CONFLICT,
            Some("An owner account already exists. Use a fresh sign-in form to continue."),
        ),
        Err(store::Error::Rejected) => (
            StatusCode::FORBIDDEN,
            Some(
                "Owner setup is unavailable or has expired. Ask the host owner to prepare a new claim, or sign in to an existing account.",
            ),
        ),
        Err(_) => return unavailable(),
    };
    credential_page(&service, PageKind::Claim, status, message).await
}
fn sign_in_redirect() -> Response {
    let mut response = Redirect::to("/account/sign-in").into_response();
    clear_session(&mut response);
    response
}
async fn account_page(State(service): State<Service>, headers: HeaderMap) -> Response {
    if schema(&service).await.is_err() {
        return unavailable();
    }
    match principal_csrf(&service, &headers, None).await {
        Ok(principal) => match service.secrets.session_csrf(&principal.token) {
            Ok(csrf) => render(PageKind::Account, StatusCode::OK, &csrf, None),
            Err(_) => unavailable(),
        },
        Err(ApiError(StatusCode::UNAUTHORIZED, _)) => sign_in_redirect(),
        Err(_) => unavailable(),
    }
}

type Fields = BTreeMap<String, String>;
fn bad_form() -> ApiError {
    ApiError(StatusCode::BAD_REQUEST, "invalid_request")
}
pub(super) fn decode(input: &[u8]) -> Result<String, ApiError> {
    fn hex(b: u8) -> Option<u8> {
        match b {
            b'0'..=b'9' => Some(b - b'0'),
            b'a'..=b'f' => Some(b - b'a' + 10),
            b'A'..=b'F' => Some(b - b'A' + 10),
            _ => None,
        }
    }
    let mut result = Vec::with_capacity(input.len());
    let mut i = 0;
    while i < input.len() {
        match input[i] {
            b'+' => result.push(b' '),
            b'%' => {
                let high = input
                    .get(i + 1)
                    .and_then(|v| hex(*v))
                    .ok_or_else(bad_form)?;
                let low = input
                    .get(i + 2)
                    .and_then(|v| hex(*v))
                    .ok_or_else(bad_form)?;
                result.push(high * 16 + low);
                i += 2;
            }
            b => result.push(b),
        }
        i += 1;
    }
    String::from_utf8(result).map_err(|_| bad_form())
}
pub(super) fn fields(
    headers: &HeaderMap,
    body: Result<Bytes, BytesRejection>,
    allowed: &[&str],
) -> Result<Fields, ApiError> {
    let media = one(headers, "content-type").ok_or_else(bad_form)?;
    let mut parts = media.split(';').map(str::trim);
    if !parts
        .next()
        .is_some_and(|p| p.eq_ignore_ascii_case("application/x-www-form-urlencoded"))
        || parts
            .next()
            .is_some_and(|p| !p.eq_ignore_ascii_case("charset=utf-8"))
        || parts.next().is_some()
    {
        return Err(bad_form());
    }
    let body = body.map_err(|e| {
        ApiError(
            if e.status() == StatusCode::PAYLOAD_TOO_LARGE {
                StatusCode::PAYLOAD_TOO_LARGE
            } else {
                StatusCode::BAD_REQUEST
            },
            "invalid_request",
        )
    })?;
    let mut fields = BTreeMap::new();
    if body.is_empty() {
        return Ok(fields);
    }
    for pair in body.split(|b| *b == b'&') {
        let equal = pair.iter().position(|b| *b == b'=').ok_or_else(bad_form)?;
        let name = decode(&pair[..equal])?;
        let value = decode(&pair[equal + 1..])?;
        if !allowed.contains(&name.as_str()) || fields.insert(name, value).is_some() {
            return Err(bad_form());
        }
    }
    Ok(fields)
}
fn admitted(service: &Service, headers: &HeaderMap, fields: &Fields) -> Result<(), ApiError> {
    if fields.get("product").map(String::as_str) != Some(PRODUCT)
        || fields.get("contract").map(String::as_str) != Some(FORM_CONTRACT)
    {
        return Err(ApiError(StatusCode::UPGRADE_REQUIRED, "upgrade_required"));
    }
    if one(headers, "origin") != Some(service.origin.as_ref()) {
        return Err(ApiError(StatusCode::FORBIDDEN, "origin_rejected"));
    }
    Ok(())
}
fn take(fields: &mut Fields, key: &str) -> Result<String, ApiError> {
    fields.remove(key).ok_or_else(bad_form)
}

#[derive(Clone, Copy)]
enum Submission {
    SignIn,
    Claim,
    SignOut,
    SignOutAll,
}
async fn submit(
    service: Service,
    headers: HeaderMap,
    body: Result<Bytes, BytesRejection>,
    submission: Submission,
) -> Response {
    let kind = if matches!(submission, Submission::Claim) {
        PageKind::Claim
    } else {
        PageKind::SignIn
    };
    let mut allowed = vec!["product", "contract", "csrf_token"];
    if matches!(submission, Submission::Claim | Submission::SignIn) {
        allowed.extend(["username", "password"]);
    }
    if matches!(submission, Submission::Claim) {
        allowed.push("setup_secret");
    }
    let result = async {
        let mut fields = fields(&headers, body, &allowed)?;
        admitted(&service, &headers, &fields)?;
        schema(&service).await?;
        store::status(&service.pool, &service.key_id).await?;
        let csrf = fields
            .get("csrf_token")
            .ok_or(ApiError(StatusCode::FORBIDDEN, "csrf_rejected"))?
            .to_owned();
        let response = match submission {
            Submission::Claim | Submission::SignIn => {
                anonymous_csrf(&service, &headers, &csrf)?;
                let username = take(&mut fields, "username")?;
                let password = take(&mut fields, "password")?;
                let authenticated = if matches!(submission, Submission::Claim) {
                    let setup_secret = take(&mut fields, "setup_secret")?;
                    authenticate_claim(
                        &service,
                        ClaimInput {
                            setup_secret,
                            username,
                            password,
                        },
                    )
                    .await?
                } else {
                    authenticate_login(&service, &headers, LoginInput { username, password })
                        .await?
                };
                let mut response = Redirect::to("/account").into_response();
                session_cookies(&mut response, &authenticated.token);
                response
            }
            Submission::SignOut | Submission::SignOutAll => {
                let principal = principal_csrf(&service, &headers, Some(&csrf)).await?;
                if matches!(submission, Submission::SignOut) {
                    store::logout(&service.pool, &service.key_id, &principal.hash).await?;
                } else {
                    store::revoke_all(&service.pool, &service.key_id, &principal.hash).await?;
                }
                sign_in_redirect()
            }
        };
        Ok::<_, ApiError>(response)
    }
    .await;
    match result {
        Ok(response) => response,
        Err(ApiError(StatusCode::UNAUTHORIZED, _))
            if matches!(submission, Submission::SignOut | Submission::SignOutAll) =>
        {
            sign_in_redirect()
        }
        Err(error) => {
            if error.0 == StatusCode::SERVICE_UNAVAILABLE {
                return unavailable();
            }
            let message = match error.1 {
                "upgrade_required" => {
                    "This form is no longer supported. Use a fresh form before submitting again."
                }
                "origin_rejected" | "csrf_rejected" => {
                    "This form could not be verified or has expired. Use the fresh form below; enter your details again deliberately."
                }
                "invalid_credentials" => {
                    "Sign-in was not accepted. Check your username and password before trying again."
                }
                "setup_rejected" => {
                    "The setup secret was not accepted or has expired. Use sign-in for an existing account, or ask the host owner for a new claim."
                }
                "conflict" => {
                    "This request conflicts with an existing account or completed claim. Use a fresh sign-in form to check access."
                }
                "try_later" => {
                    "Too many attempts are in progress. Wait a minute before trying a fresh form."
                }
                _ => {
                    "The form was not accepted. Check the field requirements and use the fresh form below."
                }
            };
            // Challenge recovery cannot replace an earlier decoding, client or
            // Origin rejection with a later database/key availability result.
            match fresh_challenge(&service).await {
                Ok((cookie, csrf)) => challenged(kind, error.0, Some(message), &cookie, &csrf),
                Err(_) => render(PageKind::Unavailable, error.0, "", Some(message)),
            }
        }
    }
}
async fn submit_sign_in(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Bytes, BytesRejection>,
) -> Response {
    submit(service, headers, body, Submission::SignIn).await
}
async fn submit_claim(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Bytes, BytesRejection>,
) -> Response {
    submit(service, headers, body, Submission::Claim).await
}
async fn sign_out(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Bytes, BytesRejection>,
) -> Response {
    submit(service, headers, body, Submission::SignOut).await
}
async fn sign_out_all(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Bytes, BytesRejection>,
) -> Response {
    submit(service, headers, body, Submission::SignOutAll).await
}
