-- Authentication authority is independent of all earlier Hub applications.
ALTER TABLE reborn_schema DROP CONSTRAINT reborn_schema_schema_version_check;
ALTER TABLE reborn_schema ADD CONSTRAINT reborn_schema_schema_version_check CHECK (schema_version = 2) NOT VALID;
UPDATE reborn_schema SET schema_version = 2 WHERE singleton = TRUE;
ALTER TABLE reborn_schema VALIDATE CONSTRAINT reborn_schema_schema_version_check;

CREATE TABLE users (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username text NOT NULL UNIQUE
        CHECK (octet_length(username) BETWEEN 3 AND 32)
        CHECK (username ~ '^[a-z0-9_-]{3,32}$'),
    password_phc text NOT NULL
        CHECK (octet_length(password_phc) BETWEEN 40 AND 256)
        CHECK (password_phc LIKE '$argon2id$v=19$m=19456,t=2,p=1$%'),
    role text NOT NULL CHECK (role IN ('owner', 'member')),
    active boolean NOT NULL DEFAULT TRUE,
    generation bigint NOT NULL DEFAULT 0 CHECK (generation >= 0),
    UNIQUE (id, role)
);
-- A second owner is forbidden even if application concurrency admission regresses.
CREATE UNIQUE INDEX users_single_owner ON users (role) WHERE role = 'owner';

CREATE TABLE auth_state (
    singleton boolean PRIMARY KEY DEFAULT TRUE CHECK (singleton),
    key_id bytea CHECK (key_id IS NULL OR octet_length(key_id) = 32),
    setup_hash bytea CHECK (setup_hash IS NULL OR octet_length(setup_hash) = 32),
    setup_expires_at bigint CHECK (setup_expires_at IS NULL OR setup_expires_at >= 0),
    owner_id bigint,
    owner_role text NOT NULL DEFAULT 'owner' CHECK (owner_role = 'owner'),
    FOREIGN KEY (owner_id, owner_role) REFERENCES users (id, role),
    CHECK ((setup_hash IS NULL) = (setup_expires_at IS NULL)),
    CHECK (owner_id IS NULL OR (key_id IS NOT NULL AND setup_hash IS NULL)),
    CHECK (key_id IS NOT NULL OR (setup_hash IS NULL AND owner_id IS NULL))
);
INSERT INTO auth_state (singleton) VALUES (TRUE);

CREATE TABLE sessions (
    verifier bytea PRIMARY KEY CHECK (octet_length(verifier) = 32),
    account_id bigint NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    generation bigint NOT NULL CHECK (generation >= 0),
    created_at bigint NOT NULL CHECK (created_at >= 0),
    expires_at bigint NOT NULL CHECK (expires_at > created_at),
    revoked boolean NOT NULL DEFAULT FALSE
);
CREATE INDEX sessions_account ON sessions (account_id);

-- Fixed rows only: setup global, login global, then 64 keyed username buckets.
-- No username/IP/request token can become a durable row identifier.
CREATE TABLE auth_throttles (
    scope smallint PRIMARY KEY CHECK (scope BETWEEN 0 AND 65),
    window_start bigint NOT NULL DEFAULT 0 CHECK (window_start >= 0),
    attempts smallint NOT NULL DEFAULT 0
        CHECK (attempts >= 0 AND ((scope = 1 AND attempts <= 20) OR (scope <> 1 AND attempts <= 5)))
);
INSERT INTO auth_throttles (scope) SELECT generate_series(0, 65)::smallint;
