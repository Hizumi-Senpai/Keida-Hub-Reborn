//! The bounded Home tile vocabulary and defaults belong to Rust.
use serde::{Deserialize, Serialize};

pub const CONTRACT: &str = "reborn-tiles-v1";

#[derive(Clone, Copy, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Id {
    Games,
    Jellyfin,
    Requests,
    Downloads,
    Services,
    Note,
}

impl Id {
    const ALL: [Self; 6] = [
        Self::Games,
        Self::Jellyfin,
        Self::Requests,
        Self::Downloads,
        Self::Services,
        Self::Note,
    ];

    pub fn code(self) -> &'static str {
        match self {
            Self::Games => "games",
            Self::Jellyfin => "jellyfin",
            Self::Requests => "requests",
            Self::Downloads => "downloads",
            Self::Services => "services",
            Self::Note => "note",
        }
    }

    pub fn parse(code: &str) -> Option<Self> {
        Self::ALL.into_iter().find(|id| id.code() == code)
    }

    fn label(self) -> &'static str {
        match self {
            Self::Games => "Game servers",
            Self::Jellyfin => "Jellyfin",
            Self::Requests => "Requests",
            Self::Downloads => "Downloads",
            Self::Services => "Pinned services",
            Self::Note => "Workspace note",
        }
    }

    pub fn allowed(self, owner: bool) -> bool {
        owner || matches!(self, Self::Games | Self::Services | Self::Note)
    }
}

#[derive(Clone, Copy, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum Size {
    Normal,
    Wide,
}

impl Size {
    pub fn code(self) -> &'static str {
        match self {
            Self::Normal => "normal",
            Self::Wide => "wide",
        }
    }

    pub fn parse(code: &str) -> Option<Self> {
        match code {
            "normal" => Some(Self::Normal),
            "wide" => Some(Self::Wide),
            _ => None,
        }
    }
}

#[derive(Clone, Copy, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Tile {
    pub id: Id,
    pub size: Size,
}

#[derive(Serialize)]
pub struct CatalogEntry {
    id: Id,
    label: &'static str,
}

#[derive(Serialize)]
pub struct Layout {
    pub revision: String,
    pub tiles: Vec<Tile>,
}

pub fn catalog(owner: bool) -> Vec<CatalogEntry> {
    Id::ALL
        .into_iter()
        .filter(|id| id.allowed(owner))
        .map(|id| CatalogEntry {
            id,
            label: id.label(),
        })
        .collect()
}

pub fn defaults(owner: bool) -> Vec<Tile> {
    [
        Tile {
            id: Id::Games,
            size: Size::Wide,
        },
        Tile {
            id: Id::Jellyfin,
            size: Size::Normal,
        },
        Tile {
            id: Id::Requests,
            size: Size::Normal,
        },
        Tile {
            id: Id::Downloads,
            size: Size::Wide,
        },
        Tile {
            id: Id::Services,
            size: Size::Wide,
        },
    ]
    .into_iter()
    .filter(|tile| tile.id.allowed(owner))
    .collect()
}

pub fn valid(tiles: &[Tile], owner: bool) -> bool {
    (1..=Id::ALL.len()).contains(&tiles.len())
        && tiles.iter().enumerate().all(|(index, tile)| {
            tile.id.allowed(owner) && !tiles[..index].iter().any(|prior| prior.id == tile.id)
        })
}

/// Role changes alter disclosure without silently rewriting the saved layout.
pub fn for_role(tiles: Vec<Tile>, owner: bool) -> Vec<Tile> {
    let visible: Vec<_> = tiles
        .into_iter()
        .filter(|tile| tile.id.allowed(owner))
        .collect();
    if visible.is_empty() {
        defaults(owner)
    } else {
        visible
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn selected_tiles_are_bounded_unique_and_role_scoped() {
        assert!(valid(&defaults(true), true));
        assert!(valid(&defaults(false), false));
        assert!(!valid(&[], true));
        let tile = Tile {
            id: Id::Games,
            size: Size::Normal,
        };
        assert!(!valid(&[tile, tile], true));
        let owner_tile = Tile {
            id: Id::Jellyfin,
            size: Size::Wide,
        };
        assert!(!valid(&[owner_tile], false));
        assert!(valid(&[owner_tile], true));
        assert_eq!(for_role(vec![owner_tile], false), defaults(false));
        assert!(Id::parse("private-provider").is_none());
        assert!(Size::parse("full-screen").is_none());
    }

    #[test]
    fn tile_wire_rejects_unknown_vocabulary_and_extra_fields() {
        for document in [
            r#"{"id":"games","size":"huge"}"#,
            r#"{"id":"unknown","size":"normal"}"#,
            r#"{"id":"games","size":"normal","provider_key":"secret"}"#,
        ] {
            assert!(serde_json::from_str::<Tile>(document).is_err());
        }
    }
}
