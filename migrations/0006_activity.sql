-- Successful local changes only: no free-form payload or secret-bearing fields.
ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 6) NOT VALID;
UPDATE reborn_schema SET schema_version = 6 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;

CREATE TABLE activity_events (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    account_id bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    kind text NOT NULL CHECK (kind IN ('note_saved','pins_saved','service_added','service_updated','service_removed','connection_saved','connection_removed')),
    revision bigint NOT NULL CHECK (revision > 0),
    occurred_at bigint NOT NULL CHECK (occurred_at BETWEEN 0 AND 253402300799)
);
CREATE INDEX activity_account_page ON activity_events (account_id, id DESC);
