//! Packaged synthetic Discord recovery. No real Discord, user credentials or
//! endpoint overrides are accepted by this caller.
use super::{ORIGIN, Result, admitted, cookie, docker, value};
use reborn_crafty_fixture::discord::{self, Discord};
use reqwest::{Client, Method, Response, Url};
use serde_json::{Value, json};
use std::path::Path;

pub(super) fn transport(args: &mut Vec<String>, root: &Path, fixture: &Discord) -> Result<()> {
    let ca = root.join("discord-fixture-ca.pem");
    crate::write(&ca, fixture.ca.as_bytes(), false)?;
    let at = args
        .len()
        .checked_sub(1)
        .ok_or("Discord recovery image absent")?;
    args.splice(
        at..at,
        [
            "-e".into(),
            format!("REBORN_DISCORD_FIXTURE_SOCKET={}", fixture.address),
            "-e".into(),
            format!("REBORN_DISCORD_FIXTURE_CA_FILE={}", ca.display()),
        ],
    );
    Ok(())
}

pub(super) struct Context<'a> {
    pub client: &'a Client,
    pub origin: &'a str,
    pub session: &'a str,
    pub binding: &'a str,
    pub account: &'a Value,
}
// Synthetic credentials remain private to this disposable rehearsal and never
// enter its public JSON report. There is deliberately no Debug implementation.
pub(super) struct Pending {
    cookies: String,
    bases: Value,
}
// Askama uses numeric ampersands in HTML attributes. Decode exactly one HTML
// layer; treating &#38; as URL bytes would turn the rest of the query into a
// fragment and silently drop the fixed authorization parameters.
fn authorization_attribute(mut encoded: &str) -> Result<String> {
    let mut decoded = String::with_capacity(encoded.len());
    while let Some((prefix, entity)) = encoded.split_once('&') {
        decoded.push_str(prefix);
        encoded = ["amp;", "#38;", "#x26;", "#X26;"]
            .into_iter()
            .find_map(|name| entity.strip_prefix(name))
            .ok_or("Discord recovery authorization HTML entity rejected")?;
        decoded.push('&');
    }
    decoded.push_str(encoded);
    Ok(decoded)
}
fn native_headers(response: &Response) -> Result<()> {
    if response
        .headers()
        .get("referrer-policy")
        .and_then(|v| v.to_str().ok())
        != Some("no-referrer")
        || !response
            .headers()
            .get("cache-control")
            .and_then(|v| v.to_str().ok())
            .is_some_and(|v| v.contains("no-store"))
    {
        return Err("Discord native recovery privacy headers missing");
    }
    Ok(())
}
fn bases(status: &Value, application: bool) -> Result<Value> {
    let link = status["link"]["revision"]
        .as_str()
        .ok_or("Discord recovery link revision absent")?;
    let flow = status["link"]["flow_generation"]
        .as_str()
        .ok_or("Discord recovery flow generation absent")?;
    let mut body = json!({"base_revision":link,"base_flow_generation":flow});
    if application {
        body["base_application_revision"] = status["application"]["revision"].clone();
    }
    Ok(body)
}
impl Context<'_> {
    fn request(&self, path: &str, method: Method) -> reqwest::RequestBuilder {
        admitted(
            self.client,
            self.origin,
            path,
            method,
            self.session,
            self.binding,
            "reborn-workspace-v1",
        )
    }
    fn with_cookies(&self, path: &str, method: Method, cookies: &str) -> reqwest::RequestBuilder {
        admitted(
            self.client,
            self.origin,
            path,
            method,
            cookies,
            self.binding,
            "reborn-workspace-v1",
        )
    }
    fn scope(&self, status: &Value) -> Result<()> {
        if status["product"] != "keida-hub-reborn"
            || status["contract"] != "reborn-workspace-v1"
            || status["schema"] != 1
            || &status["account"] != self.account
            || status["session_generation"].as_str().is_none()
            || status["application"]["profile"] != "discord-identify-v1"
            || status["application"]["callback_uri"] != format!("{ORIGIN}/account/discord/callback")
        {
            return Err("Discord recovery authority envelope differs");
        }
        let encoded =
            serde_json::to_string(status).map_err(|_| "Discord recovery encoding rejected")?;
        for forbidden in [
            discord::CLIENT_SECRET,
            "fictional-discord-access-token",
            "fictional-discord-code-",
            "client_secret",
            "code_verifier",
        ] {
            if encoded.contains(forbidden) {
                return Err("Discord recovery disclosed transient credentials");
            }
        }
        Ok(())
    }
    pub async fn status(&self) -> Result<Value> {
        let status = value(
            self.request("/api/workspace/discord", Method::GET)
                .send()
                .await
                .map_err(|_| "Discord recovery status failed")?,
            200,
        )
        .await?;
        self.scope(&status)?;
        Ok(status)
    }
    pub async fn application(&self, base: &Value, configured: bool) -> Result<Value> {
        let body = json!({"base_revision":base["application"]["revision"], "application":if configured { json!({"client_id":discord::CLIENT_ID,"client_secret":discord::CLIENT_SECRET,"callback_logging_reviewed":true}) } else { Value::Null }});
        let status = value(
            self.request("/api/owner/discord/application", Method::PUT)
                .json(&body)
                .send()
                .await
                .map_err(|_| "Discord recovery application save failed")?,
            200,
        )
        .await?;
        self.scope(&status)?;
        if status["application"]["configured"] != configured || status["link"] != base["link"] {
            return Err("Discord recovery application replacement changed identity");
        }
        Ok(status)
    }
    pub async fn action(&self, action: &str, status: &Value) -> Result<Value> {
        if !matches!(action, "cancel" | "unlink") {
            return Err("Discord recovery local action rejected");
        }
        let next = value(
            self.request(&format!("/api/workspace/discord/{action}"), Method::POST)
                .json(&bases(status, false)?)
                .send()
                .await
                .map_err(|_| "Discord recovery local action failed")?,
            200,
        )
        .await?;
        self.scope(&next)?;
        Ok(next)
    }
    pub async fn begin(&self, status: &Value, fixture: &Discord) -> Result<Pending> {
        let body = bases(status, true)?;
        let mut encoded = Url::parse("https://form.invalid/")
            .map_err(|_| "Discord recovery form encoder failed")?;
        {
            let mut fields = encoded.query_pairs_mut();
            fields
                .append_pair("product", "keida-hub-reborn")
                .append_pair("contract", "reborn-discord-link-v1")
                .append_pair("csrf_token", self.binding);
            for key in [
                "base_revision",
                "base_flow_generation",
                "base_application_revision",
            ] {
                fields.append_pair(
                    key,
                    body[key]
                        .as_str()
                        .ok_or("Discord recovery form revision missing")?,
                );
            }
        }
        let response = self
            .client
            .post(format!("{}/account/discord/start", self.origin))
            .header("Origin", ORIGIN)
            .header("Cookie", self.session)
            .header("Content-Type", "application/x-www-form-urlencoded")
            .body(encoded.query().unwrap_or("").to_owned())
            .send()
            .await
            .map_err(|_| "Discord recovery native start failed")?;
        native_headers(&response)?;
        if response.status().as_u16() != 303
            || response
                .headers()
                .get("location")
                .and_then(|v| v.to_str().ok())
                != Some("/account/discord/authorize")
        {
            return Err("Discord recovery native start outcome differs");
        }
        let flow = cookie(&response, "__Host-keida-reborn-discord-flow")?;
        let cookies = format!("{}; {flow}", self.session);
        let response = self
            .client
            .get(format!("{}/account/discord/authorize", self.origin))
            .header("Cookie", &cookies)
            .send()
            .await
            .map_err(|_| "Discord recovery native authorize failed")?;
        native_headers(&response)?;
        if response.status().as_u16() != 200 {
            return Err("Discord recovery native authorize outcome differs");
        }
        let html = response
            .text()
            .await
            .map_err(|_| "Discord recovery authorize HTML unavailable")?;
        if html.len() > 16384 || html.contains(discord::DISPLAY) || html.contains(discord::ID) {
            return Err("Discord recovery native page disclosed identity");
        }
        let start = html
            .find("href=\"https://discord.com/oauth2/authorize?")
            .ok_or("Discord recovery fixed authorization anchor absent")?
            + 6;
        let end = html[start..]
            .find('"')
            .ok_or("Discord recovery authorization anchor malformed")?
            + start;
        let authorization = authorization_attribute(&html[start..end])?;
        let callback = fixture.authorization_callback(&authorization)?;
        let callback = callback
            .strip_prefix(ORIGIN)
            .filter(|p| p.starts_with("/account/discord/callback?"))
            .ok_or("Discord recovery callback origin differs")?;
        let response = self
            .client
            .get(format!("{}{callback}", self.origin))
            .send()
            .await
            .map_err(|_| "Discord recovery callback failed")?;
        native_headers(&response)?;
        if response.status().as_u16() != 303
            || response
                .headers()
                .get("location")
                .and_then(|v| v.to_str().ok())
                != Some("/account/discord/return")
        {
            return Err("Discord recovery callback outcome differs");
        }
        if response.headers().get_all("set-cookie").iter().any(|h| {
            h.to_str().is_ok_and(|h| {
                h.starts_with("__Host-keida-reborn-session=")
                    || h.starts_with("__Host-keida-reborn-form=")
            })
        }) {
            return Err("Discord recovery callback touched real auth cookies");
        }
        let returned = cookie(&response, "__Host-keida-reborn-discord-return")?;
        let cookies = format!("{cookies}; {returned}");
        let ready = value(
            self.with_cookies("/api/workspace/discord", Method::GET, &cookies)
                .send()
                .await
                .map_err(|_| "Discord recovery ready status failed")?,
            200,
        )
        .await?;
        self.scope(&ready)?;
        if ready["attempt"]["phase"] != "ready_to_review"
            || !ready["attempt"]["candidate"].is_null()
            || ready["link"]["identity"] != status["link"]["identity"]
        {
            return Err("Discord recovery callback skipped explicit review");
        }
        Ok(Pending {
            cookies,
            bases: bases(&ready, true)?,
        })
    }
    pub async fn complete(&self, pending: Pending, fixture: &Discord) -> Result<Value> {
        let before = fixture.requests().len();
        let review = value(
            self.with_cookies(
                "/api/workspace/discord/review",
                Method::POST,
                &pending.cookies,
            )
            .json(&pending.bases)
            .send()
            .await
            .map_err(|_| "Discord recovery review failed")?,
            200,
        )
        .await?;
        self.scope(&review)?;
        if review["attempt"]["phase"] != "review_ready"
            || review["attempt"]["candidate"]
                != json!({"id":discord::ID,"display_name":discord::DISPLAY})
            || review["attempt"]["cleanup"] != "acknowledged"
            || !review["link"]["identity"].is_null()
            || fixture.requests().len() != before + 3
        {
            return Err("Discord recovery review skipped actual bounded TLS identity verification");
        }
        let linked = value(
            self.with_cookies(
                "/api/workspace/discord/confirm",
                Method::POST,
                &pending.cookies,
            )
            .json(&bases(&review, true)?)
            .send()
            .await
            .map_err(|_| "Discord recovery explicit confirmation failed")?,
            200,
        )
        .await?;
        self.scope(&linked)?;
        if linked["link"]["identity"]["id"] != discord::ID
            || linked["link"]["identity"]["display_name"] != discord::DISPLAY
            || linked["link"]["identity"]["verified_at"].as_str().is_none()
            || !linked["attempt"]["candidate"].is_null()
            || fixture.requests().len() != before + 3
        {
            return Err("Discord recovery explicit link receipt differs");
        }
        Ok(linked)
    }
    pub async fn reject_after_restart(&self, pending: &Pending, fixture: &Discord) -> Result<()> {
        let before = fixture.requests().len();
        let response = self
            .with_cookies(
                "/api/workspace/discord/review",
                Method::POST,
                &pending.cookies,
            )
            .json(&pending.bases)
            .send()
            .await
            .map_err(|_| "Discord recovery stale pending rejection failed")?;
        if response.status().as_u16() != 409 || fixture.requests().len() != before {
            return Err("Discord recovery restarted an unfinished code exchange");
        }
        let current = self.status().await?;
        if !current["link"]["identity"].is_null()
            || !current["attempt"]["candidate"].is_null()
            || matches!(
                current["attempt"]["phase"].as_str(),
                Some("ready_to_review" | "review_ready" | "reviewing")
            )
        {
            return Err("Discord recovery restored unfinished token state");
        }
        Ok(())
    }
}
pub(super) fn no_transient_dump(pg: &str, database: &str) -> Result<()> {
    let dump = docker(&[
        "exec",
        pg,
        "pg_dump",
        "-U",
        "reborn_migrator",
        "-d",
        database,
        "--data-only",
        "--no-owner",
        "--no-privileges",
    ])?;
    for forbidden in [
        discord::CLIENT_SECRET,
        "fictional-discord-access-token",
        "fictional-discord-code-",
        "code_verifier",
        "access_token",
        "refresh_token",
    ] {
        if dump
            .windows(forbidden.len())
            .any(|w| w == forbidden.as_bytes())
        {
            return Err("Discord recovery dump contains transient provider credentials");
        }
    }
    Ok(())
}
pub(super) fn protocol(fixture: &Discord) -> Result<()> {
    let requests = fixture.requests();
    if requests.is_empty()
        || fixture.invalid_requests() != 0
        || !requests.len().is_multiple_of(3)
        || requests.as_chunks::<3>().0.iter().any(|r| {
            *r != [
                ("POST".into(), "/api/oauth2/token".into()),
                ("GET".into(), "/api/v10/users/@me".into()),
                ("POST".into(), "/api/oauth2/token/revoke".into()),
            ]
        })
    {
        return Err("Discord recovery fixed protocol or TLS evidence differs");
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn actual_attribute_encoding_retains_all_eight_oauth_parameters_once() {
        let url = "https://discord.com/oauth2/authorize?client_id=123456789012345678&response_type=code&scope=identify&prompt=consent&state=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa&code_challenge_method=S256&code_challenge=abcdefghijklmnopqrstuvwxyz0123456789abcdefghi&redirect_uri=https%3A%2F%2Frecovery.reborn.test%2Faccount%2Fdiscord%2Fcallback";
        for entity in ["&amp;", "&#38;", "&#x26;", "&#X26;"] {
            let encoded = url.replace('&', entity);
            let decoded = authorization_attribute(&encoded).unwrap();
            assert_eq!(decoded, url);
            let parsed = Url::parse(&decoded).unwrap();
            assert!(parsed.fragment().is_none());
            assert_eq!(parsed.query_pairs().count(), 8);
            assert_eq!(
                parsed
                    .query_pairs()
                    .find(|(k, _)| k == "redirect_uri")
                    .unwrap()
                    .1,
                format!("{ORIGIN}/account/discord/callback")
            );
        }
        assert_eq!(
            authorization_attribute("?one=1&amp;amp;two=2").unwrap(),
            "?one=1&amp;two=2"
        );
        for malformed in ["?one=1&two=2", "?one=1&#38two=2", "?one=1&unknown;two=2"] {
            assert!(authorization_attribute(malformed).is_err());
        }
    }
}
