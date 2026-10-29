//! Additive tile preferences share the existing account/session authority lock.
use super::{Error, Session, actor, checked_key, locked};
use crate::tiles::{self, Id, Layout, Size, Tile};
use sqlx::{PgPool, Postgres, Transaction};

pub struct View {
    pub session: Session,
    pub layout: Layout,
}

async fn layout(
    tx: &mut Transaction<'_, Postgres>,
    account: i64,
    owner: bool,
) -> Result<Layout, Error> {
    let row = sqlx::query!(
        "SELECT revision, tile_order, tile_sizes, array_dims(tile_order) AS order_dimensions, array_dims(tile_sizes) AS size_dimensions FROM dashboard_tiles WHERE account_id = $1",
        account
    )
    .fetch_optional(&mut **tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let Some(row) = row else {
        return Ok(Layout {
            revision: "0".to_owned(),
            tiles: tiles::defaults(owner),
        });
    };
    let dimensions = format!("[1:{}]", row.tile_order.len());
    if row.revision <= 0
        || row.tile_order.len() != row.tile_sizes.len()
        || row.order_dimensions.as_deref() != Some(dimensions.as_str())
        || row.size_dimensions.as_deref() != Some(dimensions.as_str())
    {
        return Err(Error::Unavailable);
    }
    let selected = row
        .tile_order
        .iter()
        .zip(&row.tile_sizes)
        .map(|(id, size)| {
            Ok(Tile {
                id: Id::parse(id).ok_or(Error::Unavailable)?,
                size: Size::parse(size).ok_or(Error::Unavailable)?,
            })
        })
        .collect::<Result<Vec<_>, Error>>()?;
    // Validate the stored vocabulary before filtering an earlier owner's view.
    if !tiles::valid(&selected, true) {
        return Err(Error::Unavailable);
    }
    Ok(Layout {
        revision: row.revision.to_string(),
        tiles: tiles::for_role(selected, owner),
    })
}

pub async fn read(pool: &PgPool, key: &[u8], verifier: &[u8]) -> Result<View, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let layout = layout(&mut tx, session.account.id, session.account.role == "owner").await?;
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(View { session, layout })
}

pub async fn save(
    pool: &PgPool,
    key: &[u8],
    verifier: &[u8],
    base_revision: i64,
    selected: &[Tile],
) -> Result<View, Error> {
    let (mut tx, state) = locked(pool).await?;
    checked_key(&state, key)?;
    let session = actor(&mut tx, verifier, state.now).await?;
    let owner = session.account.role == "owner";
    // Current role, key and session authority are checked under the same lock
    // as revision admission. Browser selections cannot grant tile capabilities.
    if base_revision < 0 || !tiles::valid(selected, owner) {
        return Err(Error::Rejected);
    }
    let current = sqlx::query_scalar!(
        "SELECT revision FROM dashboard_tiles WHERE account_id = $1",
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
    let order = selected
        .iter()
        .map(|tile| tile.id.code().to_owned())
        .collect::<Vec<_>>();
    let sizes = selected
        .iter()
        .map(|tile| tile.size.code().to_owned())
        .collect::<Vec<_>>();
    sqlx::query!(
        "INSERT INTO dashboard_tiles (account_id, revision, tile_order, tile_sizes) VALUES ($1, $2, $3, $4) ON CONFLICT (account_id) DO UPDATE SET revision = EXCLUDED.revision, tile_order = EXCLUDED.tile_order, tile_sizes = EXCLUDED.tile_sizes",
        session.account.id,
        next,
        &order,
        &sizes
    )
    .execute(&mut *tx)
    .await
    .map_err(|_| Error::Unavailable)?;
    let layout = Layout {
        revision: next.to_string(),
        tiles: selected.to_vec(),
    };
    tx.commit().await.map_err(|_| Error::Unavailable)?;
    Ok(View { session, layout })
}
