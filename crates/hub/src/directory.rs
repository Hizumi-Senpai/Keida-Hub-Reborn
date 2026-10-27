//! Deliberate browser links, never backend fetch targets or credentials.
use serde::{Deserialize, Serialize};
use url::Url;

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Link {
    pub name: String,
    pub category: String,
    pub description: String,
    pub url: String,
}
impl Link {
    pub fn validate(&self) -> bool {
        fn field(s: &str, min: usize, max: usize) -> bool {
            (min..=max).contains(&s.len()) && s.trim() == s && !s.chars().any(char::is_control)
        }
        field(&self.name, 1, 80)
            && field(&self.category, 1, 40)
            && field(&self.description, 0, 240)
            && safe_url(&self.url)
    }
}
pub fn safe_url(s: &str) -> bool {
    !s.is_empty()
        && s.len() <= 1024
        && !s
            .chars()
            .any(|c| c.is_whitespace() || c.is_control() || c == '\\')
        && s.strip_prefix("https://")
            .is_some_and(|rest| !rest.starts_with('/'))
        && Url::parse(s).is_ok_and(|u| {
            u.scheme() == "https"
                && u.has_host()
                && u.username().is_empty()
                && u.password().is_none()
                && u.query().is_none()
                && u.fragment().is_none()
        })
}
pub fn decimal(s: &str, positive: bool) -> Option<i64> {
    s.parse::<i64>()
        .ok()
        .filter(|n| *n >= i64::from(positive) && n.to_string() == s)
}
#[derive(Deserialize)]
#[serde(tag = "action", rename_all = "snake_case", deny_unknown_fields)]
pub enum Change {
    Create { link: Link },
    Update { id: String, link: Link },
    Delete { id: String },
}
#[derive(Serialize)]
pub struct Entry {
    pub id: String,
    pub name: String,
    pub category: String,
    pub description: String,
    pub url: String,
}
#[derive(Serialize)]
pub struct View {
    pub revision: String,
    pub services: Vec<Entry>,
    pub pins_revision: String,
    pub pins: Vec<String>,
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn only_explicit_noncredential_https_links_and_canonical_ids() {
        for v in [
            "https://example.test/",
            "https://192.168.1.2:8443/library",
            "https://example.test/a%20b",
        ] {
            assert!(safe_url(v));
        }
        for v in [
            "javascript:alert(1)",
            "data:text/html,hi",
            "//example.test/",
            "http://example.test/",
            "https://user@example.test/",
            "https://:secret@example.test/",
            "https://example.test/?token=secret",
            "https://example.test/#secret",
            " https://example.test/",
            "https://example.test/\n",
            "https://example.test\\@evil.test/",
            "https:///example.test/",
            "https://example.test/a b",
        ] {
            assert!(!safe_url(v), "unsafe URL admitted");
        }
        assert_eq!(decimal("0", false), Some(0));
        assert_eq!(decimal("0", true), None);
        for v in ["01", "-1", "+1", " 1", "9223372036854775808"] {
            assert_eq!(decimal(v, false), None);
        }
    }
}
