# Keida Hub Reborn agent guide

Read README.md, CURRENT_STATE.md, ROADMAP.md, docs/ARCHITECTURE.md,
docs/decisions/0001-platform-and-assets.md, docs/ACCEPTANCE.md,
docs/DEPLOYMENT.md, docs/UPDATES.md, docs/OWNERSHIP.md and docs/HANDOFF.md
before implementation. Refresh GitHub main, open PRs/issues and worker ownership;
scratch directories, credentials, processes and cloud-browser sessions may not transfer.

## Authorized project and locked direction

This is the owner's separately authorized fresh start: Hizumi-Senpai/Keida-Hub-Reborn.
Target URL is https://rewrite.keida.me. At bootstrap that URL still serves
Keida-Hub-Rewrite v0.1.4. Do not claim Reborn is deployed or replace a working
application with a documentation/placeholder page. Original https://keida.me remains
live and unchanged. A gated Reborn cutover may reuse the target hostname; no primary
keida.me switch is authorized. Read the actual latest deployment receipt before acting.

Implement the recorded design rather than restarting stack selection: Rust1.99.1,
Axum/Tokio/Tower, PostgreSQL and compile-checked SQLx; one persistent Svelte/TypeScript
workspace; Askama for separate server-rendered account/recovery pages; optional
Three.js/three-vrm presentation; glTF/GLB assets and tested VRM import profiles.
Rust owns authority, domain rules, persistence, providers, jobs, semantic room/edit
contracts and operational tooling. Browser TypeScript owns presentation/interaction
and renderer integration. Shared Rust/Wasm needs a concrete caller and benefit.

TypeScript/Svelte is an intentional first-party browser exception in this new
repository. It does not amend Rewrite's Rust/browser policy. Keep SQL migrations,
HTML templates, CSS, Markdown, Cargo/TOML, package/lock files, YAML and Dockerfile
in their native forms. Build-time Node tooling is allowed; a production Node server
is not part of this design. Do not hide languages or use percentages as acceptance.
Do not add Python application fallbacks or copy the original React/FastAPI app.

Keep a modular application with clear callers. Do not prebuild speculative engines,
generic plugin frameworks, alternative database backends or unused Rust modules.
Material architecture changes need a reviewed decision with concrete requirements
and evidence. Ordinary dependency/security maintenance remains expected.

## Integration and verification

CORE alone integrates, merges, deploys and writes shared checkpoints. Preserve
external workers' assignments, branches, unpublished work and independent expectations.
Use isolated worktrees/branches and explicit file scopes. The separate competing
chat receives no shared deployment authority from this repository.

Pin Rust1.99.1 in rust-toolchain.toml. When application source exists, require
cargo fmt --all --check; workspace/all-target locked checks; Clippy with warnings
denied; locked release build; appropriate units/contracts; actual HTTP verification
and actual browser workflows. Pin frontend dependencies with a lockfile and require
type/compiler/accessibility checks plus meaningful browser tests. Rust should own
new HTTP/operational verification logic where practical. Do not copy the old test
suite or produce tests solely to raise Rust share. No Windows execution is required
for this Linux service and none may be claimed without actual execution.

Require green CI on the eventual PR head and accepted main, exact-image checks,
recovery proof and public/browser/provider acceptance appropriate to the change.
Documentation-only bootstrap validation is not application CI or live acceptance.
Separate accepted source, published artifact, installed server and loaded browser
identity. Every accepted main merge advances the documented numbered identity.

## Shared-host and data boundaries

Before remote actions refresh host/container/process/network/bridge ownership.
Use new private immutable, hash-verified execution with bounded diagnostics.
Never replay old commands, execute a shared mutable pending file, overwrite another
project's inbox, kill unidentified processes or run broad cleanup/prune commands.
Treat Unraid as an appliance; preflight tools and use bounded build/test containers.

Reborn needs its own PostgreSQL service, role/database, data directory, instance key
and network. Discover availability before allocating names/ports; recorded Rewrite
port8790 and /mnt/user/appdata/keida-hub-rewrite belong to Rewrite until actual cutover.
Never mount original/Rewrite databases or keys into Reborn, copy provider secrets,
reset credentials, promote an account or replay earlier credential submissions.
Use a distinct session-cookie namespace and browser-storage namespace on the reused
origin. New owner enrollment must use a private host-mediated atomic claim; no public
first-visitor owner claim, default/shared password or secrets in chat/logs/Git/screenshots.
Scope private workspace state, subscriptions and recoverable non-secret drafts to
product, authenticated account and compatible schema/session generation. Logout,
revocation and account switches must stop old subscriptions and remove old private
content from the active UI; another account cannot inherit those drafts or snapshots.

Keep PostgreSQL backups, instance key/configuration and referenced immutable assets
recoverable together. Rehearse recovery in isolation. A compatible rollback uses
current data; never overwrite newer writes with an older backup silently.
Retain the matched prior Rewrite container/data during URL transition.

Do not restart original Hub, shared tunnel/proxy, games or active update workers.
Never mount the Docker socket or introduce a competing game writer/updater/listener.
Crafty begins read-only with deliberately enrolled dedicated access and valid TLS.
Unknown player evidence is never zero. Original managed-game restarts require fresh
complete all-enrolled zero-player evidence, zero pending/accepted/established proxy
clients and a held join fence. Unknown blocks. Original four-writer/two-reader
ownership remains unfrozen until its separately accepted transfer.

Browser code cannot replace the Rust server. Full host-updater installation and
activation need their own concrete bootstrap review and separate authorization.
AI, avatar, room assets and renderer events never gain host/service authority.

## Progress and handoff

Track accepted workflows and actual responsibility transfers. Source, fixture,
published, installed, browser and real-provider acceptance are separate states.
Keep CURRENT_STATE short; retain exact evidence in the deployment/tracker issues.
Append shared checkpoints without overwriting history. On a requested handoff,
record the next concrete task, pending work and ownership, then stop shared mutations
after the final response so one successor CORE can continue immediately.
