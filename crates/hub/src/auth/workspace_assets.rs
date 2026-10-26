//! Exact embedded outputs generated from web/workspace, with immutable URLs.
use sha2::{Digest, Sha256};
use std::sync::OnceLock;

const SCRIPT: &[u8] = include_bytes!("../../static/workspace/workspace.js");
const STYLE: &[u8] = include_bytes!("../../static/workspace/workspace.css");
fn url(bytes: &[u8], extension: &str) -> String {
    let digest: String = Sha256::digest(bytes)
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect();
    format!("/assets/workspace/{digest}.{extension}")
}
pub fn script() -> &'static str {
    static URL: OnceLock<String> = OnceLock::new();
    URL.get_or_init(|| url(SCRIPT, "js"))
}
pub fn style() -> &'static str {
    static URL: OnceLock<String> = OnceLock::new();
    URL.get_or_init(|| url(STYLE, "css"))
}
pub fn find(path: &str) -> Option<(&'static str, &'static [u8])> {
    if path == script() {
        Some(("text/javascript; charset=utf-8", SCRIPT))
    } else if path == style() {
        Some(("text/css; charset=utf-8", STYLE))
    } else {
        None
    }
}
