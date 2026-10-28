//! A deliberately explicit identity link over the existing local authority.
use super::{
    discord_flow::{Binding, Candidate, View},
    store::discord::{self as db, Bases, Capture},
    *,
};
use crate::providers::discord::{self as provider, Enrollment};
use askama::Template;
use axum::{
    body::Bytes,
    extract::{RawQuery, rejection::BytesRejection},
    response::{Html, Redirect},
    routing::put,
};
use std::collections::BTreeMap;
use zeroize::Zeroizing;

const FLOW: &str = "__Host-keida-reborn-discord-flow";
const RETURN: &str = "__Host-keida-reborn-discord-return";
const CSP: &str = "default-src 'none'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'";
const BASES: &[&str] = &[
    "product",
    "contract",
    "csrf_token",
    "base_revision",
    "base_flow_generation",
    "base_application_revision",
];

pub fn router(service: Service) -> Router {
    Router::new()
        .route("/account/discord/start", post(start))
        .route("/account/discord/authorize", get(authorize))
        .route(
            "/account/discord/callback",
            get(callback).head(|| async {
                document_headers(StatusCode::METHOD_NOT_ALLOWED.into_response())
            }),
        )
        .route("/account/discord/return", get(return_page))
        .route("/api/workspace/discord", get(status))
        .route("/api/workspace/discord/review", post(review))
        .route("/api/workspace/discord/confirm", post(confirm))
        .route("/api/workspace/discord/cancel", post(cancel))
        .route("/api/workspace/discord/unlink", post(unlink))
        .route(
            "/api/owner/discord/application",
            get(application).merge(put(replace_application)),
        )
        .layer(DefaultBodyLimit::max(8192))
        .with_state(service)
}

#[derive(Template)]
#[template(path = "discord.html")]
struct Page<'a> {
    title: &'a str,
    message: &'a str,
    authorize_url: Option<&'a str>,
    identity: crate::identity::Identity,
}
fn page(status: StatusCode, title: &str, message: &str, url: Option<&str>) -> Response {
    let html = Page {
        title,
        message,
        authorize_url: url,
        identity: crate::identity::compiled(),
    }
    .render()
    .unwrap_or_else(|_| {
        "Discord linking is unavailable. <a href=\"/workspace#identity\">Return to Identity</a>."
            .into()
    });
    document_headers((status, Html(html)).into_response())
}
pub(super) fn document_headers(mut response: Response) -> Response {
    let headers = response.headers_mut();
    headers.insert(header::CACHE_CONTROL, HeaderValue::from_static("no-store"));
    headers.insert(
        header::REFERRER_POLICY,
        HeaderValue::from_static("no-referrer"),
    );
    headers.insert(
        header::CONTENT_SECURITY_POLICY,
        HeaderValue::from_static(CSP),
    );
    response
}
pub(super) fn timeout() -> Response {
    page(
        StatusCode::REQUEST_TIMEOUT,
        "Discord linking interrupted",
        "Return to Identity and check the current status before starting again.",
        None,
    )
}
fn native_error(error: ApiError) -> Response {
    // In particular, public callbacks and their error paths never touch either
    // local authentication cookie, even if a browser supplies an old session.
    page(
        error.0,
        "Discord linking unavailable",
        "Return to Identity and check the current status before trying again.",
        None,
    )
}
fn flow_error(code: &'static str) -> ApiError {
    ApiError(
        match code {
            "invalid_request" => StatusCode::BAD_REQUEST,
            "try_later" => StatusCode::TOO_MANY_REQUESTS,
            "unavailable" => StatusCode::SERVICE_UNAVAILABLE,
            _ => StatusCode::CONFLICT,
        },
        code,
    )
}
fn decimal(value: &str) -> Result<i64, ApiError> {
    crate::directory::decimal(value, false)
        .ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request"))
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct FullBase {
    base_revision: String,
    base_flow_generation: String,
    base_application_revision: String,
}
impl FullBase {
    fn parse(&self) -> Result<Bases, ApiError> {
        Ok(Bases {
            revision: decimal(&self.base_revision)?,
            flow_generation: decimal(&self.base_flow_generation)?,
            application_revision: decimal(&self.base_application_revision)?,
        })
    }
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct LinkBase {
    base_revision: String,
    base_flow_generation: String,
}
impl LinkBase {
    fn parse(&self) -> Result<(i64, i64), ApiError> {
        Ok((
            decimal(&self.base_revision)?,
            decimal(&self.base_flow_generation)?,
        ))
    }
}
fn callback_uri(service: &Service) -> String {
    format!("{}/account/discord/callback", service.origin)
}
fn enrollment(service: &Service, value: &Capture) -> Result<Enrollment, ApiError> {
    let sealed = value
        .sealed
        .as_deref()
        .ok_or(ApiError(StatusCode::CONFLICT, "conflict"))?;
    let plaintext = service
        .secrets
        .open_discord_application(value.application_revision, sealed)
        .map_err(|_| ApiError(StatusCode::SERVICE_UNAVAILABLE, "unavailable"))?;
    let app: Enrollment = serde_json::from_slice(&plaintext)
        .map_err(|_| ApiError(StatusCode::SERVICE_UNAVAILABLE, "unavailable"))?;
    app.validate()
        .map_err(|_| ApiError(StatusCode::SERVICE_UNAVAILABLE, "unavailable"))?;
    Ok(app)
}
fn capability(headers: &HeaderMap, wanted: &str) -> Result<Option<Zeroizing<String>>, ApiError> {
    let mut value = None;
    for line in headers.get_all(header::COOKIE) {
        for part in line
            .to_str()
            .map_err(|_| flow_error("conflict"))?
            .split(';')
        {
            let Some((name, token)) = part.trim().split_once('=') else {
                return Err(flow_error("conflict"));
            };
            if name != wanted {
                continue;
            }
            if value.is_some() || Secrets::token_hash(token).is_err() {
                return Err(flow_error("conflict"));
            }
            value = Some(Zeroizing::new(token.to_owned()));
        }
    }
    Ok(value)
}
fn capabilities(headers: &HeaderMap) -> Result<(Zeroizing<String>, Zeroizing<String>), ApiError> {
    let flow = capability(headers, FLOW)?.ok_or(ApiError(StatusCode::FORBIDDEN, "forbidden"))?;
    let returned =
        capability(headers, RETURN)?.ok_or(ApiError(StatusCode::FORBIDDEN, "forbidden"))?;
    Ok((flow, returned))
}
fn wire(
    service: &Service,
    headers: &HeaderMap,
    verifier: &[u8],
    captured: Capture,
    phase: Option<&'static str>,
) -> Result<Response, ApiError> {
    let flow = capability(headers, FLOW)?;
    let returned = capability(headers, RETURN)?;
    let binding = Binding::capture(&captured, &service.key_id, verifier);
    let attempt = match phase {
        Some(phase) => View {
            phase,
            candidate: None,
            cleanup: None,
            error: None,
        },
        None => service
            .discord_flows
            .view(
                &binding,
                flow.as_deref().map(String::as_str),
                returned.as_deref().map(String::as_str),
            )
            .map_err(flow_error)?,
    };
    let identity = captured.link.identity.map(|value| json!({"id":value.id,"display_name":value.display_name,"verified_at":value.verified_at.to_string()}));
    Ok(Json(json!({"product":"keida-hub-reborn","contract":"reborn-workspace-v1","schema":1,
        "account":account(captured.session.account),"session_generation":captured.session.generation.to_string(),
        "application":{"configured":captured.sealed.is_some(),"revision":captured.application_revision.to_string(),"callback_uri":callback_uri(service),"profile":provider::PROFILE},
        "link":{"revision":captured.link.revision.to_string(),"flow_generation":captured.link.flow_generation.to_string(),"identity":identity},"attempt":attempt})).into_response())
}
async fn status(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, false).await?;
        let captured = db::capture(&service.pool, &service.key_id, &p.hash).await?;
        wire(&service, &headers, &p.hash, captured, None)
    }
    .await;
    result.unwrap_or_else(private_error)
}
async fn application(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, false).await?;
        let captured = db::owner_capture(&service.pool, &service.key_id, &p.hash).await?;
        wire(&service, &headers, &p.hash, captured, None)
    }
    .await;
    result.unwrap_or_else(private_error)
}
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Application {
    base_revision: String,
    // A missing field is invalid; only an explicit null removes enrollment.
    #[serde(deserialize_with = "required_application")]
    application: Option<Enrollment>,
}
fn required_application<'de, D: serde::Deserializer<'de>>(
    input: D,
) -> Result<Option<Enrollment>, D::Error> {
    Option::<Enrollment>::deserialize(input)
}
async fn replace_application(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<Application>, JsonRejection>,
) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, true).await?;
        db::owner_capture(&service.pool, &service.key_id, &p.hash).await?;
        let input = payload(body)?;
        let base = decimal(&input.base_revision)?;
        let sealed = if let Some(app) = input.application.as_ref() {
            app.validate()
                .map_err(|_| ApiError(StatusCode::BAD_REQUEST, "invalid_request"))?;
            let plaintext =
                Zeroizing::new(serde_json::to_vec(app).map_err(|_| flow_error("unavailable"))?);
            Some(service.secrets.seal_discord_application(
                base.checked_add(1).ok_or(flow_error("unavailable"))?,
                &plaintext,
            )?)
        } else {
            None
        };
        let captured = db::replace_application(
            &service.pool,
            &service.key_id,
            &p.hash,
            base,
            sealed.as_deref(),
        )
        .await?;
        service
            .discord_flows
            .invalidate_application(captured.application_revision)
            .map_err(flow_error)?;
        wire(&service, &headers, &p.hash, captured, Some("none"))
    }
    .await;
    result.unwrap_or_else(private_error)
}
async fn start(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Bytes, BytesRejection>,
) -> Response {
    let result = async {
        let fields = account_pages::fields(&headers, body, BASES)?;
        if fields.get("product").map(String::as_str) != Some("keida-hub-reborn")
            || fields.get("contract").map(String::as_str) != Some("reborn-discord-link-v1")
        {
            return Err(ApiError(StatusCode::UPGRADE_REQUIRED, "upgrade_required"));
        }
        if one(&headers, "origin") != Some(service.origin.as_ref()) {
            return Err(ApiError(StatusCode::FORBIDDEN, "origin_rejected"));
        }
        if !crate::database::ready(&service.pool).await {
            return Err(flow_error("unavailable"));
        }
        let csrf = fields
            .get("csrf_token")
            .ok_or(ApiError(StatusCode::FORBIDDEN, "csrf_rejected"))?;
        let p = principal_csrf(&service, &headers, Some(csrf)).await?;
        let field = |key: &str| {
            fields
                .get(key)
                .ok_or(ApiError(StatusCode::BAD_REQUEST, "invalid_request"))
                .and_then(|v| decimal(v))
        };
        let base = Bases {
            revision: field("base_revision")?,
            flow_generation: field("base_flow_generation")?,
            application_revision: field("base_application_revision")?,
        };
        let captured = db::admit(&service.pool, &service.key_id, &p.hash, base).await?;
        let _app = enrollment(&service, &captured)?;
        let prepared = service.discord_flows.prepare().map_err(flow_error)?;
        let captured = db::start(&service.pool, &service.key_id, &p.hash, base).await?;
        let flow = service
            .discord_flows
            .install(
                prepared,
                Binding::capture(&captured, &service.key_id, &p.hash),
            )
            .map_err(flow_error)?;
        let mut response = Redirect::to("/account/discord/authorize").into_response();
        set_cookie(&mut response, FLOW, &flow, 600);
        set_cookie(&mut response, RETURN, "", 0);
        Ok::<_, ApiError>(document_headers(response))
    }
    .await;
    result.unwrap_or_else(native_error)
}
async fn authorize(State(service): State<Service>, headers: HeaderMap) -> Response {
    let result = async {
        if !crate::database::ready(&service.pool).await { return Err(flow_error("unavailable")); }
        let p = principal_csrf(&service, &headers, None).await?;
        let captured = db::capture(&service.pool, &service.key_id, &p.hash).await?;
        let app = enrollment(&service, &captured)?;
        let flow = capability(&headers, FLOW)?.ok_or(ApiError(StatusCode::FORBIDDEN, "forbidden"))?;
        let (state, verifier) = service.discord_flows.authorize(&Binding::capture(&captured, &service.key_id, &p.hash), &flow).map_err(flow_error)?;
        let url = provider::authorize_url(&app.client_id, &callback_uri(&service), &state, &verifier).map_err(flow_error)?;
        Ok::<_, ApiError>(page(StatusCode::OK, "Link your Discord identity", "Continue to Discord, then return to Identity to review and explicitly confirm the verified candidate.", Some(&url)))
    }.await;
    result.unwrap_or_else(native_error)
}

struct Delivery {
    state: Zeroizing<String>,
    code: Option<Zeroizing<String>>,
}
fn delivery(query: Option<String>) -> Result<Delivery, ApiError> {
    let query = Zeroizing::new(query.ok_or(flow_error("invalid_request"))?);
    if query.is_empty() || query.len() > 4096 {
        return Err(flow_error("invalid_request"));
    }
    let mut values = BTreeMap::new();
    for pair in query.as_bytes().split(|byte| *byte == b'&') {
        let equal = pair
            .iter()
            .position(|byte| *byte == b'=')
            .ok_or(flow_error("invalid_request"))?;
        let name = account_pages::decode(&pair[..equal])?;
        let value = Zeroizing::new(account_pages::decode(&pair[equal + 1..])?);
        if ![
            "state",
            "iss",
            "code",
            "error",
            "error_description",
            "error_uri",
        ]
        .contains(&name.as_str())
            || values.insert(name, value).is_some()
        {
            return Err(flow_error("invalid_request"));
        }
    }
    let state = values
        .remove("state")
        .ok_or(flow_error("invalid_request"))?;
    if Secrets::token_hash(&state).is_err()
        || values.remove("iss").as_deref().map(String::as_str) != Some("https://discord.com")
    {
        return Err(flow_error("invalid_request"));
    }
    let code = values.remove("code");
    let error = values.remove("error");
    let visible = |value: &str, max| {
        !value.is_empty()
            && value.len() <= max
            && value.bytes().all(|byte| (0x21..=0x7e).contains(&byte))
    };
    match (&code, &error) {
        (Some(code), None) if visible(code, 1024) && values.is_empty() => {}
        (None, Some(error)) if visible(error, 128) => {
            if values
                .values()
                .any(|value| value.len() > 1024 || value.chars().any(char::is_control))
            {
                return Err(flow_error("invalid_request"));
            }
        }
        _ => return Err(flow_error("invalid_request")),
    }
    Ok(Delivery { state, code })
}
async fn callback(State(service): State<Service>, RawQuery(query): RawQuery) -> Response {
    let result = (|| {
        let delivery = delivery(query)?;
        let returned = service
            .discord_flows
            .callback(&delivery.state, delivery.code)
            .map_err(flow_error)?;
        let mut response = Redirect::to("/account/discord/return").into_response();
        set_cookie(&mut response, RETURN, &returned, 600);
        Ok::<_, ApiError>(document_headers(response))
    })();
    result.unwrap_or_else(native_error)
}
async fn return_page() -> Response {
    page(
        StatusCode::OK,
        "Return to Identity",
        "Open Identity to check the current status. Review and confirmation are separate deliberate actions.",
        None,
    )
}
async fn review(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<FullBase>, JsonRejection>,
) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, true).await?;
        let base = payload(body)?.parse()?;
        let (flow, returned) = capabilities(&headers)?;
        let captured = db::admit(&service.pool, &service.key_id, &p.hash, base).await?;
        let app = enrollment(&service, &captured)?;
        let binding = Binding::capture(&captured, &service.key_id, &p.hash);
        let claim = service
            .discord_flows
            .claim_review(&binding, &flow, &returned)
            .map_err(flow_error)?;
        let result = service
            .discord_client
            .review(&app, &claim.code, &claim.verifier, &callback_uri(&service))
            .await;
        // This second durable admission is required even when provider IO failed.
        // Dropping a claimed request at any await makes it non-retryable.
        let captured = db::admit(&service.pool, &service.key_id, &p.hash, base).await?;
        claim
            .complete(result.map(|value| {
                (
                    Candidate {
                        id: value.id,
                        display_name: value.display_name,
                    },
                    value.cleanup,
                )
            }))
            .map_err(flow_error)?;
        wire(&service, &headers, &p.hash, captured, None)
    }
    .await;
    result.unwrap_or_else(private_error)
}
async fn confirm(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<FullBase>, JsonRejection>,
) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, true).await?;
        let base = payload(body)?.parse()?;
        let (flow, returned) = capabilities(&headers)?;
        let captured = db::admit(&service.pool, &service.key_id, &p.hash, base).await?;
        let binding = Binding::capture(&captured, &service.key_id, &p.hash);
        let claim = service
            .discord_flows
            .claim_confirm(&binding, &flow, &returned)
            .map_err(flow_error)?;
        let captured = db::confirm(
            &service.pool,
            &service.key_id,
            &p.hash,
            base,
            &claim.candidate.id,
            &claim.candidate.display_name,
            claim.deadline(),
        )
        .await?;
        claim.complete();
        service
            .discord_flows
            .retire_binding(&binding)
            .map_err(flow_error)?;
        let mut response = wire(&service, &headers, &p.hash, captured, Some("none"))?;
        set_cookie(&mut response, FLOW, "", 0);
        set_cookie(&mut response, RETURN, "", 0);
        Ok::<_, ApiError>(response)
    }
    .await;
    result.unwrap_or_else(private_error)
}
async fn cancel(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<LinkBase>, JsonRejection>,
) -> Response {
    end(service, headers, body, false).await
}
async fn unlink(
    State(service): State<Service>,
    headers: HeaderMap,
    body: Result<Json<LinkBase>, JsonRejection>,
) -> Response {
    end(service, headers, body, true).await
}
async fn end(
    service: Service,
    headers: HeaderMap,
    body: Result<Json<LinkBase>, JsonRejection>,
    unlink: bool,
) -> Response {
    let result = async {
        let p = workspace::bound(&service, &headers, true).await?;
        let (revision, generation) = payload(body)?.parse()?;
        let captured = if unlink {
            db::unlink(
                &service.pool,
                &service.key_id,
                &p.hash,
                revision,
                generation,
            )
            .await?
        } else {
            db::cancel(
                &service.pool,
                &service.key_id,
                &p.hash,
                revision,
                generation,
            )
            .await?
        };
        service
            .discord_flows
            .retire_before(captured.session.account.id, captured.link.flow_generation)
            .map_err(flow_error)?;
        let mut response = wire(
            &service,
            &headers,
            &p.hash,
            captured,
            Some(if unlink { "none" } else { "cancelled" }),
        )?;
        set_cookie(&mut response, FLOW, "", 0);
        set_cookie(&mut response, RETURN, "", 0);
        Ok::<_, ApiError>(response)
    }
    .await;
    result.unwrap_or_else(private_error)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn callback_rejects_ambiguous_or_unbounded_input_without_claiming_delivery() {
        let state = "a".repeat(64);
        let valid = format!("state={state}&iss=https%3A%2F%2Fdiscord.com&code=opaque");
        assert!(delivery(Some(valid.clone())).is_ok());
        for query in [
            format!("{valid}&code=second"),
            format!("{valid}&error=access_denied"),
            format!("{valid}&unknown=x"),
            valid.replace("discord.com", "discord.com.evil"),
            valid.replace("opaque", "%00"),
            valid.replace("opaque", "%GG"),
            valid.replace("opaque", ""),
            valid.replace(&state, &"A".repeat(64)),
            format!("{valid}&error_description=echo"),
            "x".repeat(4097),
        ] {
            assert!(delivery(Some(query)).is_err());
        }
        assert!(delivery(Some(format!("state={state}&iss=https%3A%2F%2Fdiscord.com&error=access_denied&error_description=Private%20text"))).is_ok());
    }
    #[test]
    fn removal_requires_explicit_null_and_provider_configuration_is_closed() {
        assert!(serde_json::from_str::<Application>(r#"{"base_revision":"0"}"#).is_err());
        assert!(
            serde_json::from_str::<Application>(r#"{"base_revision":"0","application":null}"#)
                .unwrap()
                .application
                .is_none()
        );
        assert!(
            serde_json::from_str::<Application>(
                r#"{"base_revision":"0","application":null,"endpoint":"https://evil.test"}"#
            )
            .is_err()
        );
    }
}
