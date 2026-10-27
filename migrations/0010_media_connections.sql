-- Deliberate owner-only media enrollment. Revision survives removal (no ABA).
-- Keys may have broad provider authority; the adapter sends observations only.
ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 10) NOT VALID;
UPDATE reborn_schema SET schema_version = 10 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;

CREATE TABLE media_connections (
    provider text PRIMARY KEY CHECK (provider IN ('jellyfin', 'seerr')),
    revision bigint NOT NULL CHECK (revision >= 0),
    sealed bytea CHECK (sealed IS NULL OR
        (revision > 0 AND octet_length(sealed) BETWEEN 62 AND 30100))
);
INSERT INTO media_connections (provider, revision, sealed)
VALUES ('jellyfin', 0, NULL), ('seerr', 0, NULL);
