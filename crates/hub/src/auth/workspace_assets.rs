//! Exact embedded outputs generated from web/workspace, with immutable URLs.
use sha2::{Digest, Sha256};
use std::sync::OnceLock;

const SCRIPT: &[u8] = include_bytes!("../../static/workspace/workspace.js");
const STYLE: &[u8] = include_bytes!("../../static/workspace/workspace.css");
const PREVIOUS_SCRIPT: &[u8] = include_bytes!("../../static/workspace-compat/0.1.6.js");
const PREVIOUS_STYLE: &[u8] = include_bytes!("../../static/workspace-compat/0.1.6.css");
const ALPHA_SCRIPT: &[u8] = include_bytes!("../../static/workspace-compat/0.1.7.js");
const ALPHA_STYLE: &[u8] = include_bytes!("../../static/workspace-compat/0.1.7.css");
const DIRECTORY_SCRIPT: &[u8] = include_bytes!("../../static/workspace-compat/0.1.8.js");
const DIRECTORY_STYLE: &[u8] = include_bytes!("../../static/workspace-compat/0.1.8.css");
const ACTIVITY_SCRIPT: &[u8] = include_bytes!("../../static/workspace-compat/0.1.9.js");
const ACTIVITY_STYLE: &[u8] = include_bytes!("../../static/workspace-compat/0.1.9.css");
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
    } else if path == url(PREVIOUS_SCRIPT, "js") {
        Some(("text/javascript; charset=utf-8", PREVIOUS_SCRIPT))
    } else if path == url(PREVIOUS_STYLE, "css") {
        Some(("text/css; charset=utf-8", PREVIOUS_STYLE))
    } else if path == url(ALPHA_SCRIPT, "js") {
        Some(("text/javascript; charset=utf-8", ALPHA_SCRIPT))
    } else if path == url(ALPHA_STYLE, "css") {
        Some(("text/css; charset=utf-8", ALPHA_STYLE))
    } else if path == url(DIRECTORY_SCRIPT, "js") {
        Some(("text/javascript; charset=utf-8", DIRECTORY_SCRIPT))
    } else if path == url(DIRECTORY_STYLE, "css") {
        Some(("text/css; charset=utf-8", DIRECTORY_STYLE))
    } else if path == url(ACTIVITY_SCRIPT, "js") {
        Some(("text/javascript; charset=utf-8", ACTIVITY_SCRIPT))
    } else if path == url(ACTIVITY_STYLE, "css") {
        Some(("text/css; charset=utf-8", ACTIVITY_STYLE))
    } else {
        None
    }
}
pub fn manifest() -> Vec<String> {
    vec![
        script().into(),
        style().into(),
        url(PREVIOUS_SCRIPT, "js"),
        url(PREVIOUS_STYLE, "css"),
        url(ALPHA_SCRIPT, "js"),
        url(ALPHA_STYLE, "css"),
        url(DIRECTORY_SCRIPT, "js"),
        url(DIRECTORY_STYLE, "css"),
        url(ACTIVITY_SCRIPT, "js"),
        url(ACTIVITY_STYLE, "css"),
    ]
}
