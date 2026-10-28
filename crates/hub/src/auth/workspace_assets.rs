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
const NOTIFICATIONS_SCRIPT: &[u8] = include_bytes!("../../static/workspace-compat/0.1.10.js");
const NOTIFICATIONS_STYLE: &[u8] = include_bytes!("../../static/workspace-compat/0.1.10.css");
const LAYOUT_SCRIPT: &[u8] = include_bytes!("../../static/workspace-compat/0.1.11.js");
const LAYOUT_STYLE: &[u8] = include_bytes!("../../static/workspace-compat/0.1.11.css");
const CATALOG_SCRIPT: &[u8] = include_bytes!("../../static/workspace-compat/0.1.12.js");
const CATALOG_STYLE: &[u8] = include_bytes!("../../static/workspace-compat/0.1.12.css");
const MEDIA_SCRIPT: &[u8] = include_bytes!("../../static/workspace-compat/0.1.13.js");
const MEDIA_STYLE: &[u8] = include_bytes!("../../static/workspace-compat/0.1.13.css");
const QUEUES_SCRIPT: &[u8] = include_bytes!("../../static/workspace-compat/0.1.14.js");
const QUEUES_STYLE: &[u8] = include_bytes!("../../static/workspace-compat/0.1.14.css");
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
    } else if path == url(NOTIFICATIONS_SCRIPT, "js") {
        Some(("text/javascript; charset=utf-8", NOTIFICATIONS_SCRIPT))
    } else if path == url(NOTIFICATIONS_STYLE, "css") {
        Some(("text/css; charset=utf-8", NOTIFICATIONS_STYLE))
    } else if path == url(LAYOUT_SCRIPT, "js") {
        Some(("text/javascript; charset=utf-8", LAYOUT_SCRIPT))
    } else if path == url(LAYOUT_STYLE, "css") {
        Some(("text/css; charset=utf-8", LAYOUT_STYLE))
    } else if path == url(CATALOG_SCRIPT, "js") {
        Some(("text/javascript; charset=utf-8", CATALOG_SCRIPT))
    } else if path == url(CATALOG_STYLE, "css") {
        Some(("text/css; charset=utf-8", CATALOG_STYLE))
    } else if path == url(MEDIA_SCRIPT, "js") {
        Some(("text/javascript; charset=utf-8", MEDIA_SCRIPT))
    } else if path == url(MEDIA_STYLE, "css") {
        Some(("text/css; charset=utf-8", MEDIA_STYLE))
    } else if path == url(QUEUES_SCRIPT, "js") {
        Some(("text/javascript; charset=utf-8", QUEUES_SCRIPT))
    } else if path == url(QUEUES_STYLE, "css") {
        Some(("text/css; charset=utf-8", QUEUES_STYLE))
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
        url(NOTIFICATIONS_SCRIPT, "js"),
        url(NOTIFICATIONS_STYLE, "css"),
        url(LAYOUT_SCRIPT, "js"),
        url(LAYOUT_STYLE, "css"),
        url(CATALOG_SCRIPT, "js"),
        url(CATALOG_STYLE, "css"),
        url(MEDIA_SCRIPT, "js"),
        url(MEDIA_STYLE, "css"),
        url(QUEUES_SCRIPT, "js"),
        url(QUEUES_STYLE, "css"),
    ]
}
