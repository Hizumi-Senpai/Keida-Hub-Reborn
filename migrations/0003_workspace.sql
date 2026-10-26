-- One private non-secret note per account; no provider or room authority.
ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 3) NOT VALID;
UPDATE reborn_schema SET schema_version = 3 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;

CREATE TABLE workspace_notes (
    account_id bigint PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    body text NOT NULL CHECK (octet_length(body) <= 4096),
    revision bigint NOT NULL CHECK (revision > 0)
);
