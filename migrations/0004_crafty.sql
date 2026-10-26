-- Dedicated encrypted connection; revision survives removal (no ABA).
ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 4) NOT VALID;
UPDATE reborn_schema SET schema_version = 4 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;

CREATE TABLE crafty_connection (
    singleton boolean PRIMARY KEY DEFAULT TRUE CHECK (singleton),
    revision bigint NOT NULL CHECK (revision >= 0),
    sealed bytea CHECK (octet_length(sealed) BETWEEN 65 AND 32768)
);
INSERT INTO crafty_connection (singleton, revision, sealed) VALUES (TRUE, 0, NULL);
