-- Explicitly enrolled links; personal ordering conveys no provider authority.
ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 5) NOT VALID;
UPDATE reborn_schema SET schema_version = 5 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;

CREATE TABLE directory_state (
    singleton boolean PRIMARY KEY CHECK (singleton),
    revision bigint NOT NULL CHECK (revision >= 0)
);
INSERT INTO directory_state VALUES (TRUE, 0);
CREATE TABLE directory_services (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text NOT NULL CHECK (octet_length(name) BETWEEN 1 AND 80),
    category text NOT NULL CHECK (octet_length(category) BETWEEN 1 AND 40),
    description text NOT NULL CHECK (octet_length(description) <= 240),
    url text NOT NULL CHECK (octet_length(url) BETWEEN 1 AND 1024)
);
CREATE TABLE directory_pins (
    account_id bigint PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    revision bigint NOT NULL CHECK (revision > 0),
    ids bigint[] NOT NULL CHECK (cardinality(ids) <= 24 AND array_position(ids, NULL) IS NULL)
);
