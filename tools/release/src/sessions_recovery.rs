//! Actual packaged personal-session sign-out and matched-data recovery evidence.
//! All credentials belong to the freshly claimed fictional recovery owner.
use super::{Result, admitted, cookie, docker, value};
use reqwest::{Client, Method, Response};
use serde_json::{Value, json};
use sha2::{Digest, Sha256};
use std::collections::BTreeSet;

const PATH: &str = "/api/workspace/sessions";
const BODY_LIMIT: usize = 32 * 1024;

pub(super) struct Context<'a> {
    pub client: &'a Client,
    pub origin: &'a str,
    pub session: &'a str,
    pub binding: &'a str,
    pub account: &'a Value,
}

// No Debug/Serialize: these are disposable fixture bearer credentials, never
// part of a public recovery report, selector or database fingerprint output.
struct Login {
    session: String,
    binding: String,
    account: Value,
}
impl Login {
    fn context<'a>(&'a self, owner: &'a Context<'_>) -> Context<'a> {
        Context {
            client: owner.client,
            origin: owner.origin,
            session: &self.session,
            binding: &self.binding,
            account: &self.account,
        }
    }
}

fn exact_keys(value: &Value, keys: &[&str]) -> bool {
    value.as_object().is_some_and(|object| {
        object.len() == keys.len() && keys.iter().all(|key| object.contains_key(*key))
    })
}
fn decimal(value: &Value) -> Result<u64> {
    let text = value.as_str().ok_or("session recovery decimal absent")?;
    if text.is_empty()
        || text.len() > 20
        || (text.len() > 1 && text.starts_with('0'))
        || !text.bytes().all(|byte| byte.is_ascii_digit())
    {
        return Err("session recovery decimal malformed");
    }
    text.parse()
        .map_err(|_| "session recovery decimal out of bounds")
}
fn uuid(value: &str) -> bool {
    let bytes = value.as_bytes();
    bytes.len() == 36
        && bytes[14] == b'4'
        && matches!(bytes[19], b'8' | b'9' | b'a' | b'b')
        && bytes.iter().enumerate().all(|(index, byte)| {
            if matches!(index, 8 | 13 | 18 | 23) {
                *byte == b'-'
            } else {
                byte.is_ascii_digit() || (b'a'..=b'f').contains(byte)
            }
        })
}
fn rows(status: &Value) -> Result<&[Value]> {
    status["sessions"]
        .as_array()
        .map(Vec::as_slice)
        .ok_or("session recovery rows absent")
}
fn current(status: &Value) -> Result<&Value> {
    rows(status)?
        .iter()
        .find(|row| row["current"] == true)
        .ok_or("session recovery acting selector absent")
}
fn selector(row: &Value) -> Result<&str> {
    row["id"]
        .as_str()
        .filter(|id| uuid(id))
        .ok_or("session recovery selector malformed")
}
fn scope(status: &Value, account: &Value, signed_out: bool) -> Result<()> {
    let mut keys = vec![
        "product",
        "contract",
        "schema",
        "account",
        "session_generation",
        "checked_at",
        "sessions",
    ];
    if signed_out {
        keys.push("result");
    }
    if !exact_keys(status, &keys)
        || status["product"] != "keida-hub-reborn"
        || status["contract"] != "reborn-workspace-v1"
        || status["schema"] != 1
        || &status["account"] != account
        || !exact_keys(account, &["id", "username", "role"])
        || decimal(&account["id"])? == 0
        || !matches!(account["role"].as_str(), Some("owner" | "member"))
        || account["username"].as_str().is_none()
        || (signed_out && status["result"] != "signed_out")
    {
        return Err("session recovery authority or private wire fields differ");
    }
    decimal(&status["session_generation"])?;
    let checked = decimal(&status["checked_at"])?;
    let rows = rows(status)?;
    if rows.is_empty() || rows.len() > 32 {
        return Err("session recovery active list is incomplete or unbounded");
    }
    let mut ids = BTreeSet::new();
    let mut previous: Option<(u64, &str)> = None;
    let mut acting = 0;
    for row in rows {
        if !exact_keys(row, &["id", "created_at", "expires_at", "current"])
            || row["current"].as_bool().is_none()
        {
            return Err("session recovery row disclosed non-allowlisted fields");
        }
        let id = selector(row)?;
        let created = decimal(&row["created_at"])?;
        let expires = decimal(&row["expires_at"])?;
        if created > checked
            || expires <= checked
            || !ids.insert(id)
            || previous
                .is_some_and(|prior| prior.0 < created || (prior.0 == created && prior.1 <= id))
        {
            return Err("session recovery active row validity or ordering differs");
        }
        previous = Some((created, id));
        acting += usize::from(row["current"] == true);
    }
    if acting != 1 {
        return Err("session recovery current badge is ambiguous");
    }
    Ok(())
}
fn no_cookie(response: &Response) -> Result<()> {
    if response.headers().contains_key("set-cookie") {
        return Err("session recovery list or targeted action changed cookies");
    }
    Ok(())
}
async fn bounded_value(mut response: Response, expected: u16) -> Result<Value> {
    if response.status().as_u16() != expected
        || response
            .content_length()
            .is_some_and(|length| length > BODY_LIMIT as u64)
    {
        return Err("session recovery HTTP outcome or body bound differs");
    }
    let mut body = Vec::new();
    while let Some(chunk) = response
        .chunk()
        .await
        .map_err(|_| "session recovery response read failed")?
    {
        if chunk.len() > BODY_LIMIT.saturating_sub(body.len()) {
            return Err("session recovery response exceeded its body bound");
        }
        body.extend_from_slice(&chunk);
    }
    serde_json::from_slice(&body).map_err(|_| "session recovery response JSON rejected")
}
fn same_authority(left: &Value, right: &Value) -> bool {
    left["account"] == right["account"] && left["session_generation"] == right["session_generation"]
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
    pub async fn status(&self) -> Result<Value> {
        let response = self
            .request(PATH, Method::GET)
            .send()
            .await
            .map_err(|_| "session recovery status failed")?;
        no_cookie(&response)?;
        let status = bounded_value(response, 200).await?;
        scope(&status, self.account, false)?;
        Ok(status)
    }
    pub async fn revoke(&self, id: &str) -> Result<Value> {
        let before = self.status().await?;
        if !rows(&before)?
            .iter()
            .any(|row| row["id"] == id && row["current"] == false)
        {
            return Err("session recovery target is not another active session");
        }
        let expected: Vec<Value> = rows(&before)?
            .iter()
            .filter(|row| row["id"] != id)
            .cloned()
            .collect();
        let response = self
            .request("/api/workspace/sessions/revoke", Method::POST)
            .json(&json!({"session_id":id}))
            .send()
            .await
            .map_err(|_| "session recovery targeted sign-out failed")?;
        no_cookie(&response)?;
        let next = bounded_value(response, 200).await?;
        scope(&next, self.account, true)?;
        let checked = self.status().await?;
        if !same_authority(&before, &next)
            || !same_authority(&next, &checked)
            || rows(&next)? != expected
            || rows(&checked)? != expected
        {
            return Err("session recovery targeted sign-out changed unrelated authority");
        }
        Ok(next)
    }
    pub async fn conflict(&self, id: &str) -> Result<()> {
        if !uuid(id) {
            return Err("session recovery conflict selector is malformed");
        }
        let before = self.status().await?;
        let response = self
            .request("/api/workspace/sessions/revoke", Method::POST)
            .json(&json!({"session_id":id}))
            .send()
            .await
            .map_err(|_| "session recovery conflict request failed")?;
        no_cookie(&response)?;
        let error = bounded_value(response, 409).await?;
        let after = self.status().await?;
        if error != json!({"error":"conflict"})
            || !same_authority(&before, &after)
            || rows(&before)? != rows(&after)?
        {
            return Err("session recovery conflict changed or disclosed session state");
        }
        Ok(())
    }
    async fn login_other(&self, password: &str) -> Result<Login> {
        // This caller has no real-provider/owner enrollment path. Only the
        // fictional account/password already generated by packaged recovery fits.
        if self.account["username"] != "recovery_owner"
            || self.account["role"] != "owner"
            || !password
                .strip_prefix("Fixture-private-")
                .and_then(|value| value.strip_suffix("-password"))
                .is_some_and(|nonce| crate::digest(nonce, 24))
        {
            return Err("session recovery requires its fictional owner credentials");
        }
        let form_response = self
            .client
            .get(format!("{}/api/auth/form", self.origin))
            .send()
            .await
            .map_err(|_| "session recovery login form failed")?;
        let form_cookie = cookie(&form_response, "__Host-keida-reborn-form")?;
        let form = value(form_response, 200).await?;
        let csrf = form["csrf_token"]
            .as_str()
            .ok_or("session recovery login form binding absent")?;
        // Never send the acting SESSION here: finish_login would deliberately
        // retire it. Each login gets only its genuinely fresh FORM capability.
        let response = admitted(
            self.client,
            self.origin,
            "/api/auth/login",
            Method::POST,
            &form_cookie,
            csrf,
            "reborn-auth-v1",
        )
        .json(&json!({"username":"recovery_owner","password":password}))
        .send()
        .await
        .map_err(|_| "session recovery genuine additional login failed")?;
        let session = cookie(&response, "__Host-keida-reborn-session")?;
        let login = value(response, 200).await?;
        let binding = login["csrf_token"]
            .as_str()
            .ok_or("session recovery additional login binding absent")?
            .to_owned();
        if &login["account"] != self.account {
            return Err("session recovery additional login changed accounts");
        }
        Ok(Login {
            session,
            binding,
            account: login["account"].clone(),
        })
    }
    async fn denied(&self) -> Result<()> {
        for (path, contract) in [
            (PATH, "reborn-workspace-v1"),
            ("/api/auth/session", "reborn-auth-v1"),
        ] {
            let response = admitted(
                self.client,
                self.origin,
                path,
                Method::GET,
                self.session,
                self.binding,
                contract,
            )
            .send()
            .await
            .map_err(|_| "session recovery revoked bearer probe failed")?;
            // The usual invalid-session GET may clear that revoked cookie. The
            // targeted POST itself was already proven to set no cookies.
            if bounded_value(response, 401).await? != json!({"error":"invalid_session"}) {
                return Err("session recovery targeted bearer remained usable");
            }
        }
        Ok(())
    }
}

pub(super) struct Witness {
    account: Value,
    generation: Value,
    actor: Value,
    retained: Vec<Value>,
    keeper_row: Value,
    keeper: Login,
    revoked_id: String,
    revoked: Login,
}

impl Witness {
    pub async fn exercise(
        owner: &Context<'_>,
        password: &str,
        foreign: &Context<'_>,
    ) -> Result<Self> {
        let initial = owner.status().await?;
        let actor = current(&initial)?.clone();
        let other_account = foreign.status().await?;
        if other_account["account"]["id"] == initial["account"]["id"] {
            return Err("session recovery foreign account fixture is not separate");
        }
        let foreign_id = selector(current(&other_account)?)?.to_owned();
        let revoked = owner.login_other(password).await?;
        let keeper = owner.login_other(password).await?;
        let target_status = revoked.context(owner).status().await?;
        let keeper_status = keeper.context(owner).status().await?;
        let revoked_id = selector(current(&target_status)?)?.to_owned();
        let keeper_id = selector(current(&keeper_status)?)?.to_owned();
        let before = owner.status().await?;
        if !same_authority(&initial, &before)
            || !same_authority(&before, &target_status)
            || !same_authority(&before, &keeper_status)
            || current(&before)? != &actor
            || rows(&before)?.len() != rows(&initial)?.len() + 2
            || revoked_id == keeper_id
            || rows(&initial)?
                .iter()
                .any(|row| !rows(&before).is_ok_and(|next| next.contains(row)))
        {
            return Err("session recovery additional login retired unrelated sessions");
        }
        owner.conflict(selector(&actor)?).await?;
        owner.conflict(&foreign_id).await?;
        let missing = (0..=64u64)
            .map(|index| format!("00000000-0000-4000-8000-{index:012x}"))
            .find(|candidate| {
                !rows(&before).is_ok_and(|list| list.iter().any(|row| row["id"] == *candidate))
                    && !rows(&other_account)
                        .is_ok_and(|list| list.iter().any(|row| row["id"] == *candidate))
            })
            .ok_or("session recovery missing selector fixture exhausted")?;
        owner.conflict(&missing).await?;
        let after = owner.revoke(&revoked_id).await?;
        owner.conflict(&revoked_id).await?;
        revoked.context(owner).denied().await?;
        let foreign_after = foreign.status().await?;
        if !same_authority(&other_account, &foreign_after)
            || rows(&other_account)? != rows(&foreign_after)?
        {
            return Err("session recovery targeted sign-out changed another account");
        }
        let keeper_row = rows(&after)?
            .iter()
            .find(|row| row["id"] == keeper_id)
            .ok_or("session recovery keeper disappeared")?
            .clone();
        let witness = Self {
            account: owner.account.clone(),
            generation: after["session_generation"].clone(),
            actor,
            retained: rows(&after)?.to_vec(),
            keeper_row,
            keeper,
            revoked_id,
            revoked,
        };
        witness.verify(owner).await?;
        Ok(witness)
    }
    pub async fn verify(&self, owner: &Context<'_>) -> Result<()> {
        let status = owner.status().await?;
        let list = rows(&status)?;
        if status["account"] != self.account
            || status["session_generation"] != self.generation
            || current(&status)? != &self.actor
            || self.retained.iter().any(|row| !list.contains(row))
            || list.iter().any(|row| row["id"] == self.revoked_id)
        {
            return Err("session recovery lost selectors or unrelated live sessions");
        }
        self.revoked.context(owner).denied().await?;
        let keeper = self.keeper.context(owner).status().await?;
        let mut keeper_row = self.keeper_row.clone();
        keeper_row["current"] = json!(true);
        if keeper["account"] != self.account
            || keeper["session_generation"] != self.generation
            || current(&keeper)? != &keeper_row
        {
            return Err("session recovery unrelated keeper bearer or selector changed");
        }
        Ok(())
    }
}

/// Exact schema13 row digest, including revoked rows, public UUIDs and verifier
/// hashes. Only the digest escapes this function; no raw session row is reported.
pub(super) fn database_fingerprint(pg: &str, database: &str) -> Result<String> {
    if !matches!(database, "first" | "restored") {
        return Err("session recovery database scope rejected");
    }
    let rows = docker(&[
        "exec",
        pg,
        "psql",
        "-X",
        "-v",
        "ON_ERROR_STOP=1",
        "-U",
        "reborn_migrator",
        "-d",
        database,
        "-Atc",
        "SELECT coalesce(jsonb_agg(to_jsonb(s) ORDER BY public_ref),'[]'::jsonb) FROM sessions s",
    ])?;
    let values: Value =
        serde_json::from_slice(&rows).map_err(|_| "session recovery database rows malformed")?;
    if values.as_array().is_none_or(Vec::is_empty) {
        return Err("session recovery database rows missing");
    }
    Ok(crate::hex(&Sha256::digest(&rows)))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn account() -> Value {
        json!({"id":"1","username":"recovery_owner","role":"owner"})
    }
    fn snapshot() -> Value {
        json!({"product":"keida-hub-reborn","contract":"reborn-workspace-v1","schema":1,
        "account":account(),"session_generation":"0","checked_at":"100",
        "sessions":[
            {"id":"ffffffff-ffff-4fff-bfff-ffffffffffff","created_at":"90","expires_at":"200","current":false},
            {"id":"00000000-0000-4000-8000-000000000001","created_at":"90","expires_at":"200","current":true}
        ]})
    }
    #[test]
    fn wire_contract_rejects_private_fields_wrong_badges_and_noncanonical_selectors() {
        let valid = snapshot();
        assert!(scope(&valid, &account(), false).is_ok());
        for key in [
            "verifier",
            "csrf_token",
            "password_phc",
            "last_used",
            "device",
        ] {
            let mut extra = valid.clone();
            extra[key] = json!("must never be accepted");
            assert!(scope(&extra, &account(), false).is_err());
            let mut extra = valid.clone();
            extra["sessions"][0][key] = json!("must never be accepted");
            assert!(scope(&extra, &account(), false).is_err());
        }
        for id in [
            "FFFFFFFF-FFFF-4FFF-BFFF-FFFFFFFFFFFF",
            "ffffffff-ffff-1fff-bfff-ffffffffffff",
            "ffffffff-ffff-4fff-7fff-ffffffffffff",
            "ffffffffffff4fffbfffffffffffffff",
        ] {
            let mut wrong = valid.clone();
            wrong["sessions"][0]["id"] = json!(id);
            assert!(scope(&wrong, &account(), false).is_err());
        }
        let mut two_current = valid.clone();
        two_current["sessions"][0]["current"] = json!(true);
        assert!(scope(&two_current, &account(), false).is_err());
        let mut foreign = valid;
        foreign["account"]["id"] = json!("2");
        assert!(scope(&foreign, &account(), false).is_err());
    }
    #[test]
    fn complete_snapshot_requires_active_rows_and_numeric_then_uuid_order() {
        let valid = snapshot();
        let mut expired = valid.clone();
        expired["sessions"][0]["expires_at"] = json!("100");
        assert!(scope(&expired, &account(), false).is_err());
        let mut reversed = valid.clone();
        reversed["sessions"].as_array_mut().unwrap().reverse();
        assert!(scope(&reversed, &account(), false).is_err());
        let mut overflow = valid.clone();
        overflow["sessions"] = json!(vec![valid["sessions"][0].clone(); 33]);
        assert!(scope(&overflow, &account(), false).is_err());
        let mut mutation = valid;
        mutation["result"] = json!("signed_out");
        assert!(scope(&mutation, &account(), true).is_ok());
        assert!(scope(&mutation, &account(), false).is_err());
    }
}
