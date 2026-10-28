-- A private non-bearer selector for the existing session row. The bearer hash
-- and all earlier session authority fields remain unchanged. The volatile core
-- UUID default backfills each old row independently under the migration fence.
ALTER TABLE sessions
    ADD COLUMN public_ref uuid NOT NULL DEFAULT pg_catalog.gen_random_uuid() UNIQUE;

ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 13) NOT VALID;
UPDATE reborn_schema SET schema_version = 13 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;
