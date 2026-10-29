-- The tile dashboard is additive. Preserve the legacy three-panel arrangement.
ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 14) NOT VALID;
UPDATE reborn_schema SET schema_version = 14 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;

CREATE TABLE dashboard_tiles (
    account_id bigint PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    revision bigint NOT NULL CHECK (revision > 0),
    tile_order text[] NOT NULL,
    tile_sizes text[] NOT NULL,
    CHECK (CASE
        WHEN array_ndims(tile_order) = 1 AND array_lower(tile_order, 1) = 1
        AND cardinality(tile_order) BETWEEN 1 AND 6
        THEN array_position(tile_order, NULL) IS NULL
        AND tile_order <@ ARRAY['games', 'jellyfin', 'requests', 'downloads', 'services', 'note']::text[]
        AND cardinality(array_positions(tile_order, 'games')) <= 1
        AND cardinality(array_positions(tile_order, 'jellyfin')) <= 1
        AND cardinality(array_positions(tile_order, 'requests')) <= 1
        AND cardinality(array_positions(tile_order, 'downloads')) <= 1
        AND cardinality(array_positions(tile_order, 'services')) <= 1
        AND cardinality(array_positions(tile_order, 'note')) <= 1
        ELSE FALSE
    END),
    CHECK (CASE
        WHEN array_ndims(tile_sizes) = 1 AND array_lower(tile_sizes, 1) = 1
        AND cardinality(tile_sizes) BETWEEN 1 AND 6
        AND array_dims(tile_sizes) = array_dims(tile_order)
        THEN array_position(tile_sizes, NULL) IS NULL
             AND tile_sizes <@ ARRAY['normal', 'wide']::text[]
        ELSE FALSE
    END)
);
