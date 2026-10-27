-- Retained, demand-collected Crafty metadata. This is sampled history, not uptime.
-- Migrations and retention never rewrite private Activity or personal notes.
ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 9) NOT VALID;
UPDATE reborn_schema SET schema_version = 9 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;

CREATE TABLE provider_observations (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sample_id bytea NOT NULL UNIQUE CHECK (octet_length(sample_id) = 16),
    connection_revision bigint NOT NULL CHECK (connection_revision > 0),
    checked_at bigint NOT NULL CHECK (checked_at >= 0),
    checked_minute bigint GENERATED ALWAYS AS (checked_at / 60) STORED,
    complete boolean NOT NULL,
    error text CHECK (error IN ('unavailable', 'invalid_configuration', 'timeout',
        'transport', 'denied', 'provider_error', 'oversized', 'malformed', 'not_discovered')),
    UNIQUE (connection_revision, checked_minute)
);
CREATE INDEX provider_observations_revision_id ON provider_observations (connection_revision, id DESC);

CREATE TABLE provider_server_observations (
    batch_id bigint NOT NULL REFERENCES provider_observations(id) ON DELETE CASCADE,
    ordinal smallint NOT NULL CHECK (ordinal BETWEEN 1 AND 8),
    name text NOT NULL CHECK (octet_length(name) BETWEEN 1 AND 80
        AND btrim(name) <> '' AND name !~ '[[:cntrl:]]'),
    state text NOT NULL CHECK (state IN ('running', 'stopped', 'unknown')),
    players bigint CHECK (players BETWEEN 0 AND 1000000),
    capacity bigint CHECK (capacity BETWEEN 0 AND 1000000),
    collected_at bigint CHECK (collected_at >= 0),
    provider_at bigint CHECK (provider_at >= 0),
    freshness text NOT NULL CHECK (freshness IN ('fresh', 'stale', 'unknown')),
    error text CHECK (error IN ('unavailable', 'invalid_configuration', 'timeout',
        'transport', 'denied', 'provider_error', 'oversized', 'malformed', 'not_discovered')),
    PRIMARY KEY (batch_id, ordinal)
);
