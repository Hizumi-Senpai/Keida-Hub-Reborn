# M0 first foundation slice

This records the historical PR#4 scope. The later
[authentication API slice](M0_AUTH_API.md) adds schema2 and private routes;
[CURRENT_STATE.md](../CURRENT_STATE.md) and linked receipts track integration.

This slice introduces a bootable Rust service and its verification boundary. It is
not the full M0 milestone, a public deployment, an authentication implementation,
an artifact publisher, or the Svelte workspace. Private routes return 404; no
account, session, setup form, provider credential or game control is exposed.

## Entrypoints and configuration

`keida-hub-reborn serve` (the default) validates configuration before listening.
`keida-hub-reborn migrate` is the explicit schema owner; it does not start HTTP.
Concurrent migration invocations use SQLx's PostgreSQL advisory lock. The web
server and readiness requests never run migrations.

| Setting | Contract |
| --- | --- |
| `DATABASE_URL` | Required PostgreSQL URL with host, user and database; secret-bearing, never printed |
| `REBORN_PUBLIC_ORIGIN` | Required HTTPS origin, without credentials, path, query or fragment |
| `REBORN_BIND` | Socket address; default loopback `127.0.0.1:8788`, not a production reservation |
| `REBORN_DB_MAX_CONNECTIONS` | Integer 1–16; default 5 |

The configured HTTPS origin establishes the input contract for later auth work;
this slice serves no forms and performs no origin-based authorization. The
listener is an internal HTTP origin intended for a future reviewed TLS proxy.
No production listener or route is allocated by the default.

`GET /api/health` reports liveness and compiled identity without accessing the
database. `GET /version` returns that same identity. `GET /api/ready` returns
200/ready only for matching durable product/schema metadata and the complete,
successful migration ledger with matching checksums; absent, dirty, future,
changed or unavailable schemas return 503/not_ready. Database checks have a
2-second total deadline. Responses use no-store and contain no database details.
Unknown/private routes return 404; unsupported methods receive 405. There are no
accepted durable operations to drain; SIGINT/SIGTERM stop admission and drain HTTP with a 5-second total shutdown
deadline; expiry reports failure and the process closes remaining connections.
Requests admitted to handlers have a 4-second deadline.

The single native SQL migration establishes constrained product/schema metadata.
The checked literal readiness query is compiled against a recreated PostgreSQL
16.15 schema. CI regenerates and compares its `.sqlx` metadata, then checks the
offline build. The metadata is generated from the database, not inferred by hand.
Database runtime tests create uniquely named local disposable databases and clean
only those names. `REBORN_TEST_DATABASE_URL` is mandatory for that test target;
missing prerequisites fail rather than skip.

## Source identity and integration boundary

The std-only [source tool](../tools/source-identity/README.md) derives source
identity from real complete Git history. The application consumes its fixed build
records at compile time. Runtime environment changes cannot relabel a binary.
Unqualified local compilation explicitly reports development/unqualified source.

The current CI caller checks exact PR head, complete history and locked builds,
and uses an explicit development channel. It does not certify main protection,
accepted release publication or installation. The accepted-source tool path and
preview path have real-Git tests, but protected-main qualification, immutable
publication, late-publisher monotonic admission and image/runtime agreement remain
M0 gates. No accepted release is published by this workflow.

Main is protected by active repository ruleset **25845081**, configured through
GitHub's settings UI after fresh account verification and read back through the
API. It targets only refs/heads/main, has an empty bypass list and disallows
deletion and non-fast-forward updates. Updates require a PR, resolved review
conversations and the GitHub Actions-owned `Rust 1.99.1 / PostgreSQL 16` check
against up-to-date branches. Only merge commits or squash merges are admitted;
rebase merging is excluded. No approving-review count is imposed on this solo
repository. CORE's independent review and exact-head/main checks remain required.
The connected GitHub tools can read these controls but do not expose settings
mutations. No direct-main bootstrap exception was reused.

## Verification and next slice

The CI workflow runs pinned Rust1.99.1 fmt, all-target checks, Clippy-D, locked
release builds, fresh checked-schema comparison and native actual-TCP HTTP,
PostgreSQL constraints/migration/readiness and real-Git history contracts. The
PostgreSQL service is pinned by image digest. Exact-head results belong in the
PR/issue receipts; source presence is not proof that those checks passed.

No browser workflow exists in this backend-only slice; browser acceptance remains
open. No Windows, native iPhone, image, restore, performance or live-provider
acceptance is claimed. No existing application, historical tests or credentials
were copied. No original/Rewrite data or game authority is inherited.

The next vertical slice is private atomic owner enrollment plus password/session,
origin/CSRF, revocation and concurrency checks. Then one account-scoped persistent
Svelte workspace can be introduced with real browser verification. Crafty remains
the first useful integration after the foundation. Public cutover and the host
updater retain their documented separate gates.
