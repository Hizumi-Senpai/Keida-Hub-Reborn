//! Retained successful local changes, never provider payloads or user content.
use serde::Serialize;

#[derive(Clone, Copy)]
pub enum Kind {
    Note,
    Pins,
    ServiceAdded,
    ServiceUpdated,
    ServiceRemoved,
    ConnectionSaved,
    ConnectionRemoved,
}
impl Kind {
    pub const ALL: [Self; 7] = [
        Self::Note,
        Self::Pins,
        Self::ServiceAdded,
        Self::ServiceUpdated,
        Self::ServiceRemoved,
        Self::ConnectionSaved,
        Self::ConnectionRemoved,
    ];
    pub fn code(self) -> &'static str {
        match self {
            Self::Note => "note_saved",
            Self::Pins => "pins_saved",
            Self::ServiceAdded => "service_added",
            Self::ServiceUpdated => "service_updated",
            Self::ServiceRemoved => "service_removed",
            Self::ConnectionSaved => "connection_saved",
            Self::ConnectionRemoved => "connection_removed",
        }
    }
    pub fn label(self) -> &'static str {
        match self {
            Self::Note => "Saved workspace note",
            Self::Pins => "Saved personal pins",
            Self::ServiceAdded => "Added a service",
            Self::ServiceUpdated => "Updated a service",
            Self::ServiceRemoved => "Removed a service",
            Self::ConnectionSaved => "Saved Crafty enrollment",
            Self::ConnectionRemoved => "Removed Crafty enrollment",
        }
    }
    pub fn category(self) -> &'static str {
        match self {
            Self::Note => "workspace",
            Self::Pins | Self::ServiceAdded | Self::ServiceUpdated | Self::ServiceRemoved => {
                "directory"
            }
            Self::ConnectionSaved | Self::ConnectionRemoved => "connections",
        }
    }
    pub fn parse(code: &str) -> Option<Self> {
        Self::ALL.into_iter().find(|k| k.code() == code)
    }
}

pub fn matching(category: &str, query: &str) -> Option<Vec<String>> {
    if !["all", "workspace", "directory", "connections"].contains(&category)
        || query.len() > 80
        || query.chars().any(char::is_control)
    {
        return None;
    }
    let query = query.trim().to_lowercase();
    Some(
        Kind::ALL
            .into_iter()
            .filter(|k| {
                (category == "all" || category == k.category())
                    && k.label().to_lowercase().contains(&query)
            })
            .map(|k| k.code().to_owned())
            .collect(),
    )
}

#[derive(Serialize)]
pub struct Entry {
    pub id: String,
    pub occurred_at: String,
    pub revision: String,
    pub kind: &'static str,
    pub category: &'static str,
    pub label: &'static str,
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn search_only_matches_owned_labels_and_known_categories() {
        assert_eq!(
            matching("connections", "  CRAFTY  ").unwrap(),
            ["connection_saved", "connection_removed"]
        );
        assert_eq!(matching("all", "saved").unwrap().len(), 3);
        assert!(matching("all", "%").unwrap().is_empty());
        assert!(matching("all", "_").unwrap().is_empty());
        assert!(matching("someone_else", "").is_none());
        assert!(matching("all", "\n").is_none());
        assert!(matching("all", &"界".repeat(27)).is_none());
        for k in Kind::ALL {
            assert_eq!(Kind::parse(k.code()).unwrap().label(), k.label());
        }
    }
}
