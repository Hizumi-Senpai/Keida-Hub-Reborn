# First useful live alpha

Frozen before implementation, 2026-10-26 America/Chicago. The owner authorized
the persistent workspace plus a Crafty read-only overview at rewrite.keida.me.
This authorizes the necessary isolated packaging, dedicated provider enrollment,
recovery checks and reversible route change after their gates pass. It does not
activate an automatic host updater or transfer original Hub/game responsibilities.

## Dedicated connection and observation

One owner-managed Crafty connection is stored in Reborn's own PostgreSQL database.
Enrollment/replacement/removal uses the current authenticated owner, exact HTTPS
Origin, loaded session binding, product/interface admission and a base revision.
Recheck key/session/account/role/generation/expiry inside the same authority
transaction as configuration effects. Members cannot enroll, inspect credentials
or select private provider endpoints/server IDs. Failed or uncertain enrollment
never causes credential replay. Inputs clear after submission and are never
persisted in browser drafts, history or logs. No existing product's key is copied.

Seal the complete private configuration using ring0.17.14 ChaCha20-Poly1305,
an independently random256-bit salt-derived HMAC-SHA256 subkey for each envelope,
a random96-bit nonce and authenticated product/purpose/revision context. Store
only versioned salt/nonce/ciphertext/tag. Reject wrong keys, altered metadata,
truncation and corrupt plaintext. Keep key/plaintext buffers zeroizing where
owned. Back up the independent instance key with the database; missing/wrong keys
fail closed without rotation. A monotonically increasing configuration revision
survives deletion, preventing stale updates and observation ABA.

Owner explicitly selects at most8 Crafty UUIDs, reviewed display names and optional
public join host/port. Never infer a join address from private provider metadata.
Use only GET /api/v2/servers and GET /api/v2/servers/{UUID}/stats. No action,
console, wake, stop, login, filesystem or auto-enrollment API is part of the
observer. No ambient proxy, redirects, cookies or unbounded pagination. HTTPS
hostname/chain validation is mandatory; an optional deliberately supplied CA is
trust material, never an insecure-TLS flag. Only the enrolled origin is contacted.

Bound the aggregate observation to2seconds, each response to256KiB and at most
one discovery plus8 stat requests. One shared Rust observation/cache owner allows
one in-flight refresh per configuration revision, with a15second minimum refresh
interval. No database transaction spans provider IO. Recheck current authorization
and configuration revision after IO before disclosing a result. A replacement,
removal or revoke cannot publish an old private result. Optional provider failure
does not disable workspace note reads, writes, native sign-out or recovery.

Output only reviewed public names/join details, running/stopped/unknown state,
optional nonnegative player count and explicit collection/provider timestamps,
fresh/stale/unknown state and sanitized error categories. Missing/null/malformed,
stale, denied, timeout, partial discovery and valid zero remain distinct. A
running process is not game-ready; provider-reported players are not complete
restart eligibility. Never manufacture zeros, uptime or outside-LAN join proof.

## Persistent browser and independent verification

Extend the one mounted Svelte workspace with real server cards and an owner-only
connection form. Keep the existing editor node/drafts/selection/scroll, one
observation controller, privacy clearing, revision conflicts and uncertain-save
semantics. Server authority remains Rust. No production Node or alternative stack.
Secrets are never included in successful/error responses or member/browser state.

Freeze meaningful expectations before inspecting outputs: actual HTTPS fixture
GET counts/paths, trusted and untrusted TLS, populated/zero/missing/malformed/stale
responses, missing configured servers, denied token, body bounds, timeout,
concurrent refresh coalescing, configuration replacement/removal and revoked
session during held IO; account/role/CSRF/origin/contract failures before effects;
encrypted-at-rest/wrong-key/tamper/revision behavior and schema3 data retention.
New primary HTTP/browser/operational verification is Rust. Retain all accepted
47 native tests,5 Rust browser workflows and11 additional browser regressions.
Exact eventual-head and accepted-main checks must pass without skipped gates.

## Immutable package, recovery and client compatibility

The actual qualified main binary/assets/source identity are packaged into a pinned
Linux image, run as a dedicated unprivileged UID with read-only root/cap-drop/
no-new-privileges, no Docker socket and only independent private data/config.
Record binary, image/config and archive digests separately. Verify the packaged
entrypoints, migrations, protected claim, sign-in, workspace/provider behavior,
health/readiness and image/runtime/manifest identity against the exact image.

Publish a create-once private release manifest and image archive bound to product,
ordinal, full source/tree, binary and archive hashes. Serialize publication;
matching retries reuse the recorded artifact, conflicts refuse, and late older
publishers cannot move the channel backward. Installed selection is separate.
No bump commits or rewritten history. An explicit manual CORE install is not an
automatic updater. Preserve supported content-addressed browser assets; refuse
unsupported product/contracts before effects and prove old-page/new-server and
failed-upgrade recovery without mixed assets or silent POST replay.

Use one private PostgreSQL service and scoped application role, no public DB port,
one explicit migration owner and independently generated keys. Prove consistent
PostgreSQL/key/config/asset backup and isolated restoration with native auth,
note and encrypted-secret checks. Rehearse candidate failure and safe recovery
using current writes. Schema incompatibility fences writes and preserves current
state; an older backup cannot overwrite newer accepted writes automatically.

## Host and public acceptance

Before each dependent host mutation refresh exact containers/images/start times,
mounts/networks/ports, active jobs/bridge ownership, route and recovery resources.
Use a fresh private immutable hash-verified execution; bounded diagnostics only.
No broad cleanup, unidentified process termination or shared-service restart.

Validate privately before routing. Keep the independent Rewrite container/image,
SQLite/key/data and working route recoverable. New Reborn owner enrollment uses
private host-mediated material and deliberate fresh credentials, never inherited
sessions/passwords. Route reversal restores Rewrite without mixing databases.
Protect newer Reborn writes during reversal. Original keida.me stays unchanged.

Accept live only after exact installed identity, public HTTPS, version/assets,
protected sign-in and signed-in desktop/mobile workflows agree. Separately record
real dedicated Crafty GET/browser acceptance and honest missing configuration.
No fixture claim implies a real account/provider, native iPhone/Safari, game
client, performance result or transfer of game/proxy/updater authority. Append
exact terminal source/artifact/installed/browser/recovery receipts to issues1/3.
