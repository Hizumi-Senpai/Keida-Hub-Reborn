-- Personal Home arrangement. No row means revision zero and the default layout.
-- The fixed panel vocabulary belongs to this workspace contract, not providers.
ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 8) NOT VALID;
UPDATE reborn_schema SET schema_version = 8 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;

CREATE TABLE dashboard_layouts (
    account_id bigint PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    revision bigint NOT NULL CHECK (revision > 0),
    panel_order text[] NOT NULL CHECK (CASE
        WHEN array_dims(panel_order) = '[1:3]'
        THEN array_position(panel_order, NULL) IS NULL
             AND panel_order @> ARRAY['note', 'connections', 'pins']::text[]
        ELSE FALSE
    END),
    note_visible boolean NOT NULL,
    connections_visible boolean NOT NULL,
    pins_visible boolean NOT NULL,
    CHECK (note_visible OR connections_visible OR pins_visible)
);
