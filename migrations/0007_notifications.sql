-- A bounded latest-change group per recipient/category, with durable read watermarks.
ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 7) NOT VALID;
UPDATE reborn_schema SET schema_version = 7 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;

CREATE TABLE notification_groups (
    account_id bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    category text NOT NULL CHECK (category IN ('services','connections')),
    revision bigint NOT NULL CHECK (revision > 0),
    read_through bigint NOT NULL CHECK (read_through >= 0 AND read_through <= revision),
    kind text NOT NULL,
    source_revision bigint NOT NULL CHECK (source_revision > 0),
    occurred_at bigint NOT NULL CHECK (occurred_at BETWEEN 0 AND 253402300799),
    PRIMARY KEY (account_id, category),
    CHECK ((category = 'services' AND kind IN ('service_added','service_updated','service_removed'))
        OR (category = 'connections' AND kind IN ('connection_saved','connection_removed')))
);
