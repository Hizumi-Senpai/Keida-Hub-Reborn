//! Read-only Minecraft server-list observations from an enrolled join gateway.
//! Only handshake next-state1 and status are sent; no login/wake operation exists.
use serde::{Deserialize, Serialize};
use std::{collections::BTreeMap, net::SocketAddr, time::Duration};
use tokio::{io::{AsyncReadExt, AsyncWriteExt}, net::TcpStream, task::JoinSet};

const LIMIT: usize = 65536;
const DEADLINE: Duration = Duration::from_millis(1200);
const PROTOCOL: u32 = 767;

#[derive(Default)]
pub struct Routes { endpoint: Option<SocketAddr>, routes: BTreeMap<String, Route> }
#[derive(Clone, Deserialize)]
#[serde(deny_unknown_fields)]
struct Route { server_id: String, hostname: String, public_port: u16 }
#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct Document { format: u8, endpoint: SocketAddr, routes: Vec<Route> }
#[derive(Clone, Serialize)]
pub struct Status {
    pub source: &'static str,
    pub state: &'static str,
    pub checked_at: i64,
    pub freshness: &'static str,
    pub players: Option<u64>,
    pub capacity: Option<u64>,
    pub error: Option<&'static str>,
}
impl Status {
    fn unavailable(error: &'static str) -> Self {
        Self { source: "join-gateway-v1", state: "unavailable", checked_at: now(), freshness: "fresh", players: None, capacity: None, error: Some(error) }
    }
    pub fn age(&mut self) {
        self.freshness = if (-5..=45).contains(&now().saturating_sub(self.checked_at)) { "fresh" } else { "stale" };
    }
}
fn now() -> i64 {
    std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).map_or(0, |d| d.as_secs() as i64)
}
fn hostname(value: &str) -> bool {
    !value.is_empty() && value.len() <= 253 && value.split('.').all(|part| {
        !part.is_empty() && part.len() <= 63 && !part.starts_with('-') && !part.ends_with('-')
            && part.bytes().all(|b| b.is_ascii_lowercase() || b.is_ascii_digit() || b == b'-')
    })
}
impl Routes {
    pub fn parse(raw: &str) -> Result<Self, ()> {
        if raw.len() > 16384 { return Err(()); }
        let document: Document = serde_json::from_str(raw).map_err(|_| ())?;
        if document.format != 1 || document.endpoint.port() == 0 || document.endpoint.ip().is_unspecified()
            || document.endpoint.ip().is_multicast() || document.routes.is_empty() || document.routes.len() > 8 { return Err(()); }
        let mut routes = BTreeMap::new();
        for row in document.routes {
            if row.server_id.len() != 36 || row.server_id.bytes().enumerate().any(|(i,b)| {
                if [8,13,18,23].contains(&i) { b != b'-' } else { !(b.is_ascii_digit() || (b'a'..=b'f').contains(&b)) }
            }) || !hostname(&row.hostname) || row.public_port == 0 || routes.contains_key(&row.server_id) { return Err(()); }
            routes.insert(row.server_id.clone(), row);
        }
        Ok(Self { endpoint: Some(document.endpoint), routes })
    }
    pub fn public_join(&self, id: &str) -> Option<String> {
        self.routes.get(id).map(|r| if r.public_port == 25565 { r.hostname.clone() } else { format!("{}:{}",r.hostname,r.public_port) })
    }
    pub async fn collect(&self, selected: &[String]) -> BTreeMap<String, Status> {
        let Some(endpoint) = self.endpoint else { return BTreeMap::new(); };
        if selected.len() > 8 { return BTreeMap::new(); }
        let mut flights = JoinSet::new(); let mut out = BTreeMap::new();
        for (id, route) in &self.routes {
            if !selected.contains(id) { continue; }
            out.insert(id.clone(), Status::unavailable("unavailable"));
            let id = id.clone(); let route = route.clone();
            flights.spawn(async move {
                let status = match tokio::time::timeout(DEADLINE, observe(endpoint, &route)).await {
                    Ok(Ok(value)) => value,
                    Ok(Err(error)) => Status::unavailable(error),
                    Err(_) => Status::unavailable("timeout"),
                };
                (id, status)
            });
        }
        while let Some(result) = flights.join_next().await {
            if let Ok((id, value)) = result { out.insert(id, value); }
        }
        out
    }
}
fn varint(mut value: u32, out: &mut Vec<u8>) {
    loop {
        let byte = (value & 0x7f) as u8; value >>= 7;
        out.push(byte | if value == 0 { 0 } else { 0x80 });
        if value == 0 { break; }
    }
}
async fn length(stream: &mut TcpStream) -> Result<usize, &'static str> {
    let mut value = 0u32;
    for i in 0..5 {
        let byte = stream.read_u8().await.map_err(|_| "transport")?;
        if i == 4 && byte & 0xf0 != 0 { return Err("malformed"); }
        value |= u32::from(byte & 0x7f) << (7*i);
        if byte & 0x80 == 0 {
            if value == 0 || value as usize > LIMIT || (i > 0 && value < (1 << (7*i))) { return Err("oversized"); }
            return Ok(value as usize);
        }
    }
    Err("malformed")
}
fn slice_varint(bytes: &[u8], at: &mut usize) -> Result<usize, &'static str> {
    let mut value = 0u32;
    for i in 0..5 {
        let byte = *bytes.get(*at).ok_or("malformed")?; *at += 1;
        if i == 4 && byte & 0xf0 != 0 { return Err("malformed"); }
        value |= u32::from(byte & 0x7f) << (7*i);
        if byte & 0x80 == 0 {
            if value as usize > LIMIT || (i > 0 && value < (1 << (7*i))) { return Err("malformed"); }
            return Ok(value as usize);
        }
    }
    Err("malformed")
}
#[derive(Deserialize)]
struct Reply { version: Version, players: Option<Players> }
#[derive(Deserialize)]
struct Version { name: String, protocol: u32 }
#[derive(Deserialize)]
struct Players { online: u64, max: u64 }
fn decode(bytes: &[u8]) -> Result<Status, &'static str> {
    let mut at = 0;
    if slice_varint(bytes, &mut at)? != 0 { return Err("malformed"); }
    let size = slice_varint(bytes, &mut at)?;
    if size == 0 || bytes.len() - at != size { return Err("malformed"); }
    let reply: Reply = serde_json::from_slice(&bytes[at..]).map_err(|_| "malformed")?;
    if reply.version.name.is_empty() || reply.version.name.len() > 128 || reply.version.name.chars().any(char::is_control)
        || reply.version.protocol > 1_000_000 { return Err("malformed"); }
    let state = match reply.version.name.as_str() {
        "Sleeping • Join to wake" => "sleeping",
        "Waking up" => "starting",
        "Updating modpack" => "updating",
        "Status unavailable" => "unavailable",
        _ => "online",
    };
    if state != "online" && reply.version.protocol != PROTOCOL { return Err("malformed"); }
    if state == "unavailable" { return Ok(Status::unavailable("unavailable")); }
    let (players,capacity) = if state == "online" {
        let players = reply.players.ok_or("malformed")?;
        if players.online > 1_000_000 || players.max > 1_000_000 { return Err("malformed"); }
        (Some(players.online),Some(players.max))
    } else { (None,None) }; // Gateway placeholders never become player evidence.
    Ok(Status { source: "join-gateway-v1", state, checked_at: now(), freshness: "fresh", players, capacity, error: None })
}
async fn observe(endpoint: SocketAddr, route: &Route) -> Result<Status, &'static str> {
    let mut body = vec![0]; varint(PROTOCOL, &mut body); varint(route.hostname.len() as u32, &mut body);
    body.extend_from_slice(route.hostname.as_bytes()); body.extend_from_slice(&route.public_port.to_be_bytes()); body.push(1);
    let mut request = Vec::with_capacity(body.len()+7); varint(body.len() as u32,&mut request); request.extend(body);
    request.extend([1,0]); // The single status request, never a login packet.
    let mut stream = TcpStream::connect(endpoint).await.map_err(|_| "transport")?;
    stream.write_all(&request).await.map_err(|_| "transport")?;
    let size = length(&mut stream).await?;
    let mut bytes = vec![0;size]; stream.read_exact(&mut bytes).await.map_err(|_| "transport")?;
    decode(&bytes)
}

#[cfg(test)]
#[path = "game_status_contracts.rs"]
mod tests;
