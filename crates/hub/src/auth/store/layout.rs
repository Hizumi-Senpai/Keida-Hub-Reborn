//! The existing session authority owns each account's bounded Home arrangement.
use super::{Error, Session, actor, checked_key, locked};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Postgres, Transaction};

#[derive(Clone, Copy, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum PanelId {
    Note,
    Connections,
    Pins,
}
impl PanelId {
    const ALL: [Self; 3] = [Self::Note, Self::Connections, Self::Pins];

    fn code(self) -> &'static str {
        match self {
            Self::Note => "note",
            Self::Connections => "connections",
            Self::Pins => "pins",
        }
    }

    fn parse(value: &str) -> Option<Self> {
        Self::ALL.into_iter().find(|id| id.code() == value)
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Panel {
    pub id: PanelId,
    pub visible: bool,
}

#[derive(Serialize)]
pub struct View {
    revision: String,
    panels: Vec<Panel>,
}

pub(super) fn valid(panels: &[Panel]) -> bool {
    panels.len() == PanelId::ALL.len()
        && PanelId::ALL
            .into_iter()
            .all(|id| panels.iter().filter(|panel| panel.id == id).count() == 1)
        && panels.iter().any(|panel| panel.visible)
}

fn defaults() -> View {
    View {
        revision: "0".to_owned(),
        panels: PanelId::ALL
            .into_iter()
            .map(|id| Panel { id, visible: true })
            .collect(),
    }
}

pub(super) async fn view(tx: &mut Transaction<'_, Postgres>, account: i64) -> Result<View, Error> {
    let row = sqlx::query!(
        "SELECT revision, panel_order, array_dims(panel_order) AS panel_dimensions, note_visible, connections_visible, pins_visible FROM dashboard_layouts WHERE account_id = $1",
        account
    )
    .fetch_optional(&mut **tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let Some(row) = row else {
        return Ok(defaults());
    };
    if row.revision <= 0 || row.panel_dimensions.as_deref() != Some("[1:3]") {
        return Err(Error::Unavailable);
    }
    let panels = row
        .panel_order
        .iter()
        .map(|id| {
            let id = PanelId::parse(id).ok_or(Error::Unavailable)?;
            let visible = match id {
                PanelId::Note => row.note_visible,
                PanelId::Connections => row.connections_visible,
                PanelId::Pins => row.pins_visible,
            };
            Ok(Panel { id, visible })
        })
        .collect::<Result<Vec<_>, Error>>()?;
    if !valid(&panels) {
        return Err(Error::Unavailable);
    }
    Ok(View {
        revision: row.revision.to_string(),
        panels,
    })
}

pub struct Saved {
    pub session: Session,
    pub layout: View,
}

pub async fn save(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    base_revision: i64,
    panels: &[Panel],
) -> Result<Saved, Error> {
    if base_revision < 0 || !valid(panels) {
        return Err(Error::Rejected);
    }
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let current = sqlx::query_scalar!(
        "SELECT revision FROM dashboard_layouts WHERE account_id = $1",
        session.account.id
    )
    .fetch_optional(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?
    .unwrap_or(0);
    if current != base_revision {
        return Err(Error::Conflict);
    }
    let next = current.checked_add(1).ok_or(Error::Unavailable)?;
    let order = panels
        .iter()
        .map(|panel| panel.id.code().to_owned())
        .collect::<Vec<_>>();
    // Validation guarantees exactly one entry for every fixed panel ID.
    let visible = |id| panels.iter().any(|panel| panel.id == id && panel.visible);
    let note_visible = visible(PanelId::Note);
    let connections_visible = visible(PanelId::Connections);
    let pins_visible = visible(PanelId::Pins);
    sqlx::query!(
        "INSERT INTO dashboard_layouts (account_id, revision, panel_order, note_visible, connections_visible, pins_visible) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (account_id) DO UPDATE SET revision = EXCLUDED.revision, panel_order = EXCLUDED.panel_order, note_visible = EXCLUDED.note_visible, connections_visible = EXCLUDED.connections_visible, pins_visible = EXCLUDED.pins_visible",
        session.account.id,
        next,
        &order,
        note_visible,
        connections_visible,
        pins_visible
    )
    .execute(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let layout = view(&mut tx, session.account.id).await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(Saved { session, layout })
}
