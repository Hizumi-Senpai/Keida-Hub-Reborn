# Keida Hub Reborn roadmap

Build a fresh Rust core and persistent Svelte browser application for the useful
workflows of the original Keida Hub, with room for richer game controls and an
editable room/avatar experience. This is a new project, not an in-place conversion
of the original or the independent rewrite.

[Live acceptance tracker](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/2),
[exact deployment/ownership receipts](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1),
and [immediate M0 task](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/3).

**M0/M1 live acceptance remains in progress.** Accepted source and current API work are in
[CURRENT_STATE.md](CURRENT_STATE.md); the milestone remains open. Exact installation/acceptance receipts are in issues1/3; no benchmark or complete
milestone acceptance is inferred. The directory/search/personal-pin M2 slice is installed as0.1.8 (issue10).
Retained private Activity/history is installed as0.1.9 (issue12).
Grouped notifications/read state are installed as0.1.10 (issue14).
Personal Home arrangement is installed as0.1.11 (issue16).
The [integration catalog, retained sampled provider history and Roadmap note](docs/M2_CATALOG.md)
are installed as0.1.12 (issue18).
[Owner-only Jellyfin/Seerr observations](docs/M3_MEDIA.md) are installed as0.1.13
(issue20). [Owner-only Sonarr/Radarr/qBittorrent queue observations](docs/M3_QUEUES.md)
are installed as0.1.14 (issue22). Documentation-only source0.1.15 records the
self-hosted Commander policy. [Discord identity linking/status/local unlink](docs/M4_IDENTITY.md)
is installed as0.1.16/schema12 (issue25), with real Discord setup/privacy and
owner acceptance pending. [Personal session review/targeted sign-out](docs/M4_SESSIONS.md)
was introduced in0.1.17/schema13 (issue27). [Server-change discovery and
draft-safe refresh](docs/M5_BROWSER_REFRESH.md), issue29, is installed and
runtime/recovery/retention-qualified in **0.1.18/schema13** under the
[exact18 receipt](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1#issuecomment-6482571904).
Real owner/provider acceptance remains open. The M5 host-updater preparation
contract is frozen in [issue31](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/31),
[execution contract](docs/M5_HOST_UPDATER.md) and
[concrete bootstrap review](docs/M5_UPDATER_BOOTSTRAP_REVIEW.md). Next implement
and independently qualify the remaining Rust one-shot executor in isolation;
a diagnostic binary exists, but no activation-ready executor packet exists yet. Installation/activation needs
separate authorization. See [successor handoff](docs/HANDOFF.md).
The [M5.3 request/journal foundation](docs/M5_UPDATER_FOUNDATION.md) and
[M5.4 CURRENT-artifact/adoption-PLAN diagnostic](docs/M5_UPDATER_ADMISSION.md) are
accepted through source0.1.21/PR37; head78/main79 each passed24 steps/237 Rust tests.
[M5.5](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/38) qualified the real CURRENT18
review packet without adopting authority. [M5.6](docs/M5_UPDATER_NAMESPACE.md),
issue40, freezes a proposed protected boot-data anchor and Btrfs capabilities for
the actual writable Unraid ancestry. The anchor/state paths remain unallocated.
Next [issue41](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/41) implements the smallest
read-only Rust probe before a separately qualified capability/journal caller,
authority-origin transaction and executor. Full current-data rollback, reboot,
uninstall and exact installation approval gates stay open.
Existing accepted functionality in
another application is a behavior reference, not a completed Reborn milestone.

The original **https://keida.me stays live and unchanged**. Existing rewrite
data, original game controllers, listeners, bot jobs, backup/update workers and
unpublished external work retain their owners. A new repository, roadmap or
read-only adapter transfers no operational authority or hostname.

## Delivery order

M0 and the first useful M1 slice are the immediate work. M2–M5 can advance in
independent slices after the foundation. M6 needs accepted read-only evidence,
recovery and a separately authorized ownership handover. M7's contracts begin in
M0, but its renderer/editor is later work. Optional companion work does not block
ordinary dashboard/game use or silently enlarge M8's replacement gate.

| Milestone | Useful outcome and actionable slices | Acceptance gate |
| --- | --- | --- |
| **M0 — Foundation and contracts** | Pin Rust **1.99.1**; establish Axum, PostgreSQL and compile-checked SQLx with one persistence/migration authority. Build the persistent Svelte shell with pinned browser tooling, accessible navigation and native styles. Add health/readiness, graceful shutdown, configuration validation, structured secret-safe errors and secure owner bootstrap. Define room/asset/edit-operation contracts now. Establish numbered per-main-merge versioning and exact source/artifact/browser identity before the first release. | Reproducible locked native/browser builds; disposable fresh-install and upgrade checks; private one-time owner claim, roles and revocable sessions; exact-image HTTP/browser evidence. No public default account, copied credentials, second writer or host/game effects. See [acceptance](docs/ACCEPTANCE.md). |
| **M1 — Crafty first, useful dashboard** | Enroll a dedicated Crafty connection deliberately. Deliver a read-only named-server overview: provider-reported status, observed player counts, public join details and explicit observation freshness. Provide a calm responsive home, stable sidebar, connection detail and usable empty/error states. Keep the version beside the account/Sign out area without crowding navigation. | Actual GET-only fixture/provider contracts, owner/member isolation, secret-safe responses, valid TLS, timeouts and stale/partial/unknown handling. Credentialed live Crafty reads plus browser/public join review are separate gates. No start, stop, wake, console, idle or updater responsibility transfers. |
| **M2 — Daily Hub workflows** | Service directory, categories/search, personal pins/views, responsive dashboard arrangement and a revisitable optional-integration catalog. Add retained searchable Activity, paginated connection history, grouped notifications and per-user reads. Offer useful diagnostics and retained failure feedback. | Per-account persistence, keyboard/mobile use, conflicting edits and refresh/session transitions work. History is retained with stable pagination; errors and unknown observations do not become zeros or invented uptime. Core dashboard state remains usable during optional room/provider failures. |
| **M3 — Media and downloads** | Add dedicated Jellyfin/Seerr enrollment, useful library/request rows and playback summaries, then Sonarr/Radarr/qBittorrent queue views. Separate observation from request/approval/download mutations. | Real credentialed provider acceptance after bounded pagination, cache freshness, permission and malformed/partial-response verification. Valid empty/zero differs from unavailable. Every provider write needs its own action/permission/idempotency design; broad provider keys are not called read-only merely because this client sends GET. |
| **M4 — Friends, identity and Discord** | Discord OAuth with immutable identities, guild/role policy, deliberate account linking, recovery administrator access and session revocation. Add permitted service identity links/handoffs and bring-your-own-bot setup. Reuse the same authorization/action owners for web and Discord. | OAuth state/callback/link collision and revoked-access workflows accepted with actual sessions. No reusable downstream password synchronization. Bot command/message adoption, feedback and any explicit export consent are proven separately; no competing game loop. Hosted relay/federation remains separate scope. |
| **M5 — Install, upgrade and recover** | Supported self-hosted installation for the Rust application and private PostgreSQL service, owner-facing configuration/health and backup/restore guidance. Back up database, instance key and referenced assets together. Implement update discovery and a deliberate draft-safe browser refresh. Prepare one separately reviewed host updater with pinned artifact admission, candidate checks and matched recovery. | Fresh install, restore on an isolated instance, compatible upgrade/rollback and preserved-newer-write evidence. Exact source/CI/image/installed/browser identities agree. Host-updater bootstrap and activation require their own concrete review; browser code never replaces the server. Supported platform claims require actual execution. |
| **M6 — Safe game controls and responsibility transfer** | Start with one explicitly enrolled game. Deliver typed start/wake/graceful-stop actions, state/history, startup progress, player/join evidence, intent generations and bounded uncertain-result reconciliation. Transfer required Minecraft proxy/listener, sleep, Discord, maintenance, backup and update contracts one owner at a time. Extend to other Crafty games, Pelican/native profiles and supported bridges only after their own gates. | Accepted per-game cutover and rollback receipts name every writer, reader, listener and updater. Fresh complete enrolled zero-player evidence, zero pending/accepted/established proxy clients and a held join fence are required before a protected restart/stop. Unknown blocks. No occupied-game interruption or effect solely to manufacture acceptance. |
| **M7 — Custom avatar and editable modular room** | Add opt-in optimized GLB/VRM avatar support and a modular room with versioned assets, account-scoped appearance/layout, keyboard editing, undo and recoverable autosave. Preserve persistent dashboard panels, forms, focus and permissions across entry/exit. Add deterministic companion behavior first; optional AI/voice is separately enrolled and failure-isolated. | Full-room-state browser/resource evidence on declared desktop/mobile profiles; asset/error/reduced-motion fallback; permissions and upload/resource limits; two-tab conflicts, interrupted saves, undo and restore. Persistent appearance/layout is distinct from transient animation/presence. Models receive no host/game execution authority. |
| **M8 — Accepted replacement decision** | Agree a required workflow inventory, close its live acceptance gaps, run normal-use reliability/performance evaluation and rehearse full recovery. Offer a concrete cutover/rollback plan and independently reviewed import if wanted. | Owner explicitly accepts required workflows, remaining limitations and any primary-hostname/authority change. Original responsibilities are retired only with separate evidence. No automatic replacement from source-language share, milestone count or an installed container. |

## Contracts established before feature expansion

- Rust owns authorization, domain validation, persistence, provider communication,
  durable operations and primary verification. Svelte owns persistent browser
  interaction and presentation; generated wire definitions do not replace server
  validation. Share a small Rust/Wasm geometry/rules module when it removes
  duplicated rules or a measured bottleneck, with batched browser boundaries.
- Room documents have explicit schema versions, stable object/asset IDs, units,
  bounds and permissions. A save carries its base revision and unique operation
  ID. Asset manifests identify immutable content hashes and compatibility. Define
  migration, retention and fallback before custom assets or scenes ship.
- Separate accepted source, published artifact, installed server and loaded
  browser identities. An accepted main merge advances a readable numbered
  version; previews cannot masquerade as accepted releases. Use an immutable
  main-history anchor and deterministic ordering, safe for concurrent merges and
  CI retries, without recursive version-bump commits or reused identities.
- Observation timestamps, freshness, provenance and completeness are explicit.
  Provider observations are not proof of gameplay, external reachability,
  completion, functional recovery or authority to mutate a game.
- One authorized operation owner executes each external effect. Persist accepted
  intent and honest terminal/uncertain states; reconcile lost responses before
  retrying non-idempotent work. Browser, Discord and AI adapters do not create
  independent controllers or host updaters.

## Tracking accepted work

Every slice records the user workflow, entrypoints, stored data, permissions,
independent verification, exact release identity, browser/provider evidence,
limitations and recovery. Use the ledger in [ACCEPTANCE.md](docs/ACCEPTANCE.md).
Mark **planned**, **implemented**, **artifact verified**, **live accepted** or
**blocked on a named dependency** accurately; do not collapse them into “done.”

Measure progress through accepted required workflows and actual responsibility
transfers. Agree the denominator before reporting any completion percentage.
Neither Rust source percentage nor retiring a verification language establishes
feature parity. Existing source and tests can inform expectations; do not copy
the original application, historical test suite or legacy compatibility layers.

Large optional ideas—hosted Discord relay, federation/watch parties, automatic VM
creation, broad AI repair and custom modpack automation—remain separate reviewed
deliveries. Missing credentials do not block independent work, but they keep real
provider acceptance open. No dates or speed/stability claims are promised by this
planning document.
