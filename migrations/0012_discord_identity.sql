-- Discord identity is deliberately separate from local sign-in and provider
-- connections. Application and link revisions survive removal (no ABA).
ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 12) NOT VALID;
UPDATE reborn_schema SET schema_version = 12 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;

CREATE TABLE discord_application (
    singleton boolean PRIMARY KEY DEFAULT TRUE CHECK (singleton = TRUE),
    revision bigint NOT NULL DEFAULT 0 CHECK (revision >= 0),
    sealed bytea CHECK (sealed IS NULL OR
        (revision > 0 AND octet_length(sealed) BETWEEN 62 AND 1085))
);
INSERT INTO discord_application (singleton) VALUES (TRUE);

CREATE TABLE discord_links (
    account_id bigint PRIMARY KEY REFERENCES users(id),
    revision bigint NOT NULL DEFAULT 0 CHECK (revision >= 0),
    flow_generation bigint NOT NULL DEFAULT 0 CHECK (flow_generation >= 0),
    discord_id text UNIQUE,
    display_name text,
    verified_at bigint,
    -- The CASE prevents casts of malformed input; full unsigned snowflakes are
    -- canonical strings, rather than signed bigint or floating-point values.
    CHECK (discord_id IS NULL OR CASE
        WHEN discord_id ~ '^[1-9][0-9]{0,19}$'
        THEN discord_id::numeric <= 18446744073709551615
        ELSE FALSE END),
    CHECK (display_name IS NULL OR
        (char_length(display_name) BETWEEN 1 AND 80
         AND octet_length(display_name) <= 320
         AND display_name !~ '[[:cntrl:]]'
         AND display_name !~ U&'[\061C\200E\200F\202A-\202E\2066-\2069]'
         AND display_name !~ U&'^[\0009-\000D\0020\0085\00A0\1680\2000-\200A\2028\2029\202F\205F\3000]+$')),
    CHECK ((discord_id IS NULL AND display_name IS NULL AND verified_at IS NULL)
        OR (discord_id IS NOT NULL AND display_name IS NOT NULL
            AND verified_at IS NOT NULL AND verified_at > 0
            AND revision > 0 AND flow_generation > 0))
);
