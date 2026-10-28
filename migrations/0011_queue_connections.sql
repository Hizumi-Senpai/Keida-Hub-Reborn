-- Deliberate owner-only queue enrollment, separate from Media and Crafty.
-- Revision survives removal; only the migration owner creates fixed rows.
ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 11) NOT VALID;
UPDATE reborn_schema SET schema_version = 11 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;

CREATE TABLE queue_connections (
    provider text PRIMARY KEY CHECK (provider IN ('sonarr', 'radarr', 'qbittorrent')),
    revision bigint NOT NULL CHECK (revision >= 0),
    sealed bytea CHECK (sealed IS NULL OR
        (revision > 0 AND octet_length(sealed) BETWEEN 62 AND 30100))
);
INSERT INTO queue_connections (provider, revision, sealed)
VALUES ('sonarr', 0, NULL), ('radarr', 0, NULL), ('qbittorrent', 0, NULL);
