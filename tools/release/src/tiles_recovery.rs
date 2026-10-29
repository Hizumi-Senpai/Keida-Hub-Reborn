//! Account tile layouts through the packaged application and matched PostgreSQL.
//! These witnesses use only the fictional recovery accounts, never live data.
use super::{Result, admitted, docker};
use reqwest::{Client, Method, Response};
use serde_json::{Value, json};
use sha2::{Digest, Sha256};

const PATH: &str = "/api/workspace/tiles";
const CONTRACT: &str = "reborn-tiles-v1";
const BODY_LIMIT: usize = 4096;

pub(super) struct Context<'a> {
    pub client: &'a Client,
    pub origin: &'a str,
    pub session: &'a str,
    pub binding: &'a str,
    pub account: &'a Value,
}

fn exact_keys(value: &Value, keys: &[&str]) -> bool {
    value.as_object().is_some_and(|object| {
        object.len() == keys.len() && keys.iter().all(|key| object.contains_key(*key))
    })
}

fn decimal(value: &Value) -> bool {
    value.as_str().is_some_and(|text| {
        !text.is_empty()
            && (text.len() == 1 || !text.starts_with('0'))
            && text.bytes().all(|byte| byte.is_ascii_digit())
            && text.parse::<i64>().is_ok_and(|number| number >= 0)
    })
}

fn defaults(owner: bool) -> Value {
    if owner {
        json!([
            {"id":"games","size":"wide"},
            {"id":"jellyfin","size":"normal"},
            {"id":"requests","size":"normal"},
            {"id":"downloads","size":"wide"},
            {"id":"services","size":"wide"}
        ])
    } else {
        json!([{"id":"games","size":"wide"},{"id":"services","size":"wide"}])
    }
}

fn scope(status: &Value, account: &Value) -> Result<()> {
    let owner = account["role"] == "owner";
    let ids: &[&str] = if owner {
        &["games", "jellyfin", "requests", "downloads", "services", "note"]
    } else {
        &["games", "services", "note"]
    };
    if !exact_keys(
        status,
        &[
            "product", "contract", "schema", "account", "session_generation",
            "tiles_contract", "catalog", "defaults", "layout",
        ],
    ) || status["product"] != "keida-hub-reborn"
        || status["contract"] != "reborn-workspace-v1"
        || status["tiles_contract"] != CONTRACT
        || status["schema"] != 1
        || &status["account"] != account
        || !exact_keys(account, &["id", "username", "role"])
        || !decimal(&account["id"])
        || account["id"] == "0"
        || !matches!(account["role"].as_str(), Some("owner" | "member"))
        || !decimal(&status["session_generation"])
        || status["defaults"] != defaults(owner)
        || !exact_keys(&status["layout"], &["revision", "tiles"])
        || !decimal(&status["layout"]["revision"])
    {
        return Err("tile recovery authority, defaults or private wire fields differ");
    }
    let catalog = status["catalog"]
        .as_array()
        .ok_or("tile recovery catalog absent")?;
    if catalog.len() != ids.len()
        || catalog.iter().zip(ids).any(|(row, id)| {
            !exact_keys(row, &["id", "label"])
                || row["id"] != *id
                || row["label"].as_str().is_none_or(|label| label.is_empty() || label.len() > 80)
        })
    {
        return Err("tile recovery catalog crossed the account role boundary");
    }
    let tiles = status["layout"]["tiles"]
        .as_array()
        .ok_or("tile recovery selected layout absent")?;
    if tiles.is_empty()
        || tiles.len() > ids.len()
        || tiles.iter().enumerate().any(|(index, tile)| {
            !exact_keys(tile, &["id", "size"])
                || !tile["id"].as_str().is_some_and(|id| ids.contains(&id))
                || !matches!(tile["size"].as_str(), Some("normal" | "wide"))
                || tiles[..index].iter().any(|prior| prior["id"] == tile["id"])
        })
    {
        return Err("tile recovery selected layout differs or disclosed a private tile");
    }
    Ok(())
}

async fn bounded_value(mut response: Response, expected: u16) -> Result<Value> {
    if response.status().as_u16() != expected
        || response.headers().contains_key("set-cookie")
        || !response.headers().get("cache-control").and_then(|value| value.to_str().ok())
            .is_some_and(|value| value.contains("no-store"))
        || response.content_length().is_some_and(|length| length > BODY_LIMIT as u64)
    {
        return Err("tile recovery HTTP outcome, private caching or cookie differs");
    }
    let mut body = Vec::new();
    while let Some(chunk) = response.chunk().await.map_err(|_| "tile recovery response read failed")? {
        if chunk.len() > BODY_LIMIT.saturating_sub(body.len()) {
            return Err("tile recovery response exceeded its body bound");
        }
        body.extend_from_slice(&chunk);
    }
    serde_json::from_slice(&body).map_err(|_| "tile recovery JSON rejected")
}

impl Context<'_> {
    fn request(&self, method: Method) -> reqwest::RequestBuilder {
        admitted(self.client, self.origin, PATH, method, self.session, self.binding, "reborn-workspace-v1")
            .header("x-reborn-tiles-contract", CONTRACT)
    }

    async fn status(&self) -> Result<Value> {
        let response = self.request(Method::GET).send().await
            .map_err(|_| "tile recovery read failed")?;
        let status = bounded_value(response, 200).await?;
        scope(&status, self.account)?;
        Ok(status)
    }

    async fn save(&self, base: &str, tiles: &Value) -> Result<Value> {
        let response = self.request(Method::PUT)
            .json(&json!({"base_revision":base,"tiles":tiles})).send().await
            .map_err(|_| "tile recovery save failed")?;
        let status = bounded_value(response, 200).await?;
        scope(&status, self.account)?;
        if status["layout"]["tiles"] != *tiles
            || status["layout"]["revision"].as_str().and_then(|v| v.parse::<u64>().ok())
                != base.parse::<u64>().ok().and_then(|v| v.checked_add(1))
        {
            return Err("tile recovery save did not retain the requested order and sizes");
        }
        Ok(status)
    }

    async fn stale(&self, base: &str, tiles: &Value) -> Result<()> {
        let before = self.status().await?;
        let response = self.request(Method::PUT)
            .json(&json!({"base_revision":base,"tiles":tiles})).send().await
            .map_err(|_| "tile recovery stale save failed")?;
        if bounded_value(response, 409).await? != json!({"error":"conflict"})
            || self.status().await? != before
        {
            return Err("tile recovery stale writer overwrote newer accepted state");
        }
        Ok(())
    }
}

pub(super) struct Witness {
    owner: Value,
    member: Value,
}

impl Witness {
    pub async fn seed(owner: &Context<'_>, member: &Context<'_>) -> Result<Self> {
        let owner_default = owner.status().await?;
        let member_default = member.status().await?;
        if owner.account["role"] != "owner" || member.account["role"] != "member"
            || owner.account["id"] == member.account["id"]
            || owner_default["layout"] != json!({"revision":"0","tiles":defaults(true)})
            || member_default["layout"] != json!({"revision":"0","tiles":defaults(false)})
        {
            return Err("tile recovery initial account defaults were not independent");
        }
        let owner_saved = owner.save("0", &json!([
            {"id":"downloads","size":"normal"},{"id":"games","size":"wide"},
            {"id":"jellyfin","size":"wide"},{"id":"note","size":"normal"}
        ])).await?;
        if member.status().await? != member_default {
            return Err("tile recovery owner edit changed another account");
        }
        let member_saved = member.save("0", &json!([
            {"id":"note","size":"wide"},{"id":"services","size":"normal"},
            {"id":"games","size":"normal"}
        ])).await?;
        let witness = Self { owner: owner_saved, member: member_saved };
        witness.verify(owner, member).await?;
        Ok(witness)
    }

    pub async fn advance(&self, owner: &Context<'_>, member: &Context<'_>) -> Result<Self> {
        self.verify(owner, member).await?;
        let newer_owner = owner.save("1", &json!([
            {"id":"services","size":"normal"},{"id":"requests","size":"wide"},
            {"id":"games","size":"normal"}
        ])).await?;
        if member.status().await? != self.member {
            return Err("tile recovery newer owner edit changed another account");
        }
        let newer_member = member.save("1", &json!([
            {"id":"games","size":"wide"},{"id":"note","size":"normal"}
        ])).await?;
        owner.stale("1", &self.owner["layout"]["tiles"]).await?;
        member.stale("1", &self.member["layout"]["tiles"]).await?;
        let newer = Self { owner: newer_owner, member: newer_member };
        newer.verify(owner, member).await?;
        Ok(newer)
    }

    pub async fn verify(&self, owner: &Context<'_>, member: &Context<'_>) -> Result<()> {
        if owner.status().await? != self.owner || member.status().await? != self.member {
            return Err("tile recovery lost saved layouts, sizes, revisions or account isolation");
        }
        Ok(())
    }
}

/// Hash all and only the two fictional accounts' rows before dump and after
/// restore. Reads use the migration owner; raw persisted documents stay private.
pub(super) fn database_fingerprint(pg: &str, database: &str) -> Result<String> {
    if !matches!(database, "first" | "restored") {
        return Err("tile recovery database scope rejected");
    }
    let rows = docker(&[
        "exec", pg, "psql", "-X", "-v", "ON_ERROR_STOP=1", "-U",
        "reborn_migrator", "-d", database, "-Atc",
        "SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY account_id),'[]'::jsonb) FROM dashboard_tiles t",
    ])?;
    let values: Value = serde_json::from_slice(&rows)
        .map_err(|_| "tile recovery persisted rows malformed")?;
    if values.as_array().is_none_or(|rows| rows.len() != 2) {
        return Err("tile recovery persisted account rows missing or duplicated");
    }
    Ok(crate::hex(&Sha256::digest(&rows)))
}
