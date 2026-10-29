# Keida Hub Reborn architecture

Status: accepted design direction; implementation and live acceptance remain separate gates.

Reborn is a fresh Rust-centered implementation of the useful Keida Hub workflows: accounts and permissions, service discovery and integration, reliable game visibility and controls, media, personal dashboards, notifications, Activity, and optional companion/chat/room experiences. Performance includes cold mobile loading, predictable behavior under provider failure, and recovery without losing newer data. A language percentage is not a measure of acceptance.

The platform decision and alternatives are recorded in [ADR 0001](decisions/0001-platform-and-assets.md).

## Project and deployment boundary

Reborn, Keida Hub Rewrite, and the original Keida Hub are independent projects. Reborn does not inherit production data, credentials, writer ownership, unpublished worker changes, or permission to replace another service merely by implementing a similar feature.

The intended eventual public origin is `https://rewrite.keida.me`. That origin currently belongs to the existing Rewrite deployment. Reborn must first pass isolated artifact, data, browser, and recovery acceptance; an explicit coordinated cutover must then transfer the route. This document is not a deployment receipt. `https://keida.me` remains live and unchanged.

No port, data directory, PostgreSQL service, container name, network, host agent, or tunnel ownership is assumed. CORE must refresh those resources and record a concrete isolated installation before using them. Original game lifecycle owners and external worker assignments remain authoritative until a documented responsibility transfer is accepted.

## Runtime and code ownership

The primary server is one modular Rust application, pinned to Rust **1.99.1**, using Axum, Tokio, Tower, SQLx, and PostgreSQL. Dependencies, database major version, asset build tools, and image bases must be pinned and validated; a floating `latest` dependency is not a release identity.

| Boundary | Responsibility |
| --- | --- |
| Rust domain modules | Identity, roles, permission decisions, integration configuration, service identities, dashboard and room ownership, commands, persistence, audit, and compatibility rules |
| Rust HTTP layer | Validated input, session/CSRF/origin admission, typed service calls, response encoding, deadlines, and tracing |
| Rust background work | Bounded provider observations, sanitized snapshots, durable command reconciliation, notifications, and retention |
| PostgreSQL | Relational constraints, transactions, indexes, revision checks, durable application records, and migration history |
| TypeScript/Svelte workspace | Browser presentation, form drafts, focus, drag interactions, local optimistic presentation, and persistent workspace component lifetimes |
| Three.js/three-vrm | Optional room rendering, avatar presentation, animation, picking, and visual scene interaction |
| Askama | Small server-rendered account, recovery, and operational fallback pages; not a second dashboard implementation |
| Separate host updater | Reviewed artifact installation, server replacement, health admission, and matched recovery |

HTTP handlers stay thin. Domain services accept typed IDs and values rather than unstructured request objects. Database access and provider adapters sit behind explicit module APIs. Browser state never grants authority: Rust rechecks ownership, authorization, revisions, and action conditions at the operation boundary.

The modules begin in one application rather than speculative distributed services. Providers and optional experiences have bounded concurrency, timeouts, cancellation policies, and failure states. Blocking or compute-heavy tasks use a deliberately bounded execution path. An HTTP request does not hold a database transaction while waiting on a remote provider or model.

## Browser architecture

Home is the useful configurable tile dashboard; sidebar views hold detailed
provider workflows and administration. See [the Home contract](HOME_TILES.md).
Browser build outputs follow the [finite asset window](BROWSER_ASSET_RETENTION.md);
retention does not silently grow or redefine server authority.

The authenticated dashboard, chat, arrangement editor, and optional room form **one persistent Svelte workspace**. They are interconnected views of the same owned state, not unrelated islands that reconstruct each other on navigation.

The server provides a safely encoded, versioned initial data snapshot and serves compiled immutable browser assets. Node tooling may build these assets; a Node server is not required in production. The workspace is a deliberately bounded client application. Askama-generated HTML is **not** Svelte server output and must not be passed off as hydratable Svelte markup. Adding actual Svelte SSR would require a separate measured architecture decision and runtime review.

The initial workspace loads only its essential 2D code and CSS. Account/recovery pages remain usable without the workspace bundle. A workspace startup failure shows an honest retry/recovery path; an inert shell must not present controls as working. An HTML-first fallback must only claim the workflows it actually implements.

Each tile, form, and conversation has one stable component identity. Grid-to-room changes presentation, not account state or component lifetime. It must preserve unsaved fields, focus where meaningful, scroll state, pending operations, chat drafts, and provider subscriptions. It must not create duplicate tile instances or duplicate polling. Stable keys identify actual entities; mode changes do not key and remount the entire workspace.

Persistence of the workspace never crosses account authority. Scope private snapshots, subscriptions and recoverable non-secret drafts by product, authenticated account and compatible schema/session generation. Logout, revocation or account switching stops old subscriptions, invalidates late responses and removes the previous account's private content from the active UI. A later account cannot see or submit it. Same-account reauthentication may deliberately recover a compatible draft after authorization; browser identifiers alone never authorize a save. Do not persist passwords, provider keys, session cookies or CSRF tokens as drafts.

Authoritative game/provider state is received as scoped snapshots or events. Prefer one authorized multiplexed stream per workspace where useful; reconnect has bounded attempts and a terminal success/failure state. A stale view remains visibly stale. Optimistic presentation is reconciled against server receipts and must not imply a remote action succeeded before evidence exists.

Large scene objects and per-frame animation state stay outside deep Svelte reactivity. The graphics loop does not trigger whole-workspace DOM updates every frame. Inactive optional work is suspended or released. Mobile and reduced-motion users retain complete 2D controls without downloading the room engine or avatar assets merely to use the Hub.

## Persistence and relational correctness

PostgreSQL is the selected Reborn database. This deliberately accepts a separately operated database service in exchange for a long-term concurrency and recovery foundation. Backups, credentials, capacity, upgrades, connection limits, maintenance, and restore rehearsal are part of the installation, not benefits supplied automatically by selecting PostgreSQL.

Use SQLx compile-checked literal queries where applicable, typed row/domain mappings, and native versioned SQL migrations. Offline query metadata is generated from a recreated schema and checked in CI. A plain `query_as` call or Rust row struct alone does not prove a query was schema-checked. Dynamic queries use bound values and explicit tests; identifiers and sort expressions come from allowlists.

Constraints enforce durable ownership, uniqueness, referential integrity, and valid state transitions wherever practical. Rust types complement those constraints. Transactions make related changes atomic. Revision checks prevent stale edits from overwriting newer changes. No ORM or Rust type substitutes for authorization, transaction design, or recovery tests.

There is one admitted migration authority for an installation. Ordinary authorized application writes may use multiple PostgreSQL connections; this does not authorize competing lifecycle controllers or a second application writing an inherited runtime store. Compatibility is explicit between application releases, schema versions, and data semantics. Rollback is permitted only when that compatibility has been demonstrated.

## Provider and game operation model

Dashboard rendering reads bounded local snapshots rather than waiting for live Crafty, Jellyfin, Seerr, or other provider calls. Each observation records source, observation time, completeness, and freshness. Unknown and stale player evidence are distinct from zero players. Credentials are dedicated, deliberately enrolled through an authorized settings flow, never copied from the original Hub or requested in chat.

Game commands have stable identities and durable accepted intent. One documented action owner dispatches and reconciles them. Repeated requests or retries must not manufacture duplicate actions; an ambiguous remote outcome is reconciled before retrying effects. An external HTTP API does not provide exactly-once execution merely because the local queue deduplicates requests.

Permissions, required evidence, ownership, and applicable join fences are rechecked before effects. Existing original-Hub lifecycle responsibilities remain in place until an explicit transfer is accepted. Read-only Crafty integration can ship before lifecycle control. Unknown player/client evidence blocks actions that require proven emptiness; no new observer is allowed to silently become another controller.

Activity and command receipts explain accepted, pending, applied, rejected, failed, and unknown outcomes. Sensitive provider payloads and secrets do not enter browser snapshots or general logs. Optional AI/voice failures cannot disable account access, dashboards, or game visibility.

## Room, avatar, and asset model

Rust owns a versioned semantic room description: asset references, transforms, ownership, capabilities, interaction anchors, and layout revisions. Renderer objects are temporary presentation state. Persisted data does not serialize Three.js classes or executable callbacks.

The authored default avatar is an optimized **custom rigged GLB** with a documented animation/rig profile. This gives direct control over quality, rig complexity, and supported behavior. **VRM 1.0** is a supported imported humanoid profile; **VRM 0.x** compatibility is deliberate, separately tested, and accurately labeled. Accepting a file extension does not establish expression, material, spring-bone, gaze, or retargeting compatibility. Unsupported features fail admission clearly or use a documented fallback.

Rooms and props use **glTF/GLB**. The preferred editable room consists of modular GLB furniture and props plus the Rust-owned layout. An imported complete room is also possible under explicit constraints. Avatar secondary motion does not supply room physics or obstacle-aware navigation. The semantic model must separately define walkable areas, collision/navigation data, and allowlisted destinations when those features are implemented.

The concrete initial browser engine is **Three.js with three-vrm**. WebGL 2 is the compatibility baseline to prove on supported devices. WebGPU is a gated experiment until matching asset, material, behavior, context-loss, and fallback acceptance passes. A modern API name does not establish a measured improvement. No benchmark currently proves this engine faster than alternatives for Keida.

The room preserves real HTML dashboard controls; forms are not screenshots or canvas textures. HTML placement, scene occlusion, pointer routing, zoom, keyboard operation, scrolling, and focused input require independent acceptance. Three's CSS3DRenderer documents a 100% browser/display zoom limitation, so it is not assumed to solve arbitrary-zoom room controls. Essential workflows always have a complete 2D/enlarged control presentation. The room must not silently weaken its HTML-control contract to evade a renderer limitation.

Imports are data, never code. Admission validates supported extensions, size and resource budgets, referenced resources, ownership, rig/animation profiles, and semantic anchors. No imported script, arbitrary handler, or asset-supplied URL gains permission to execute a Hub command. Interaction anchors refer only to allowlisted capabilities resolved and authorized by Rust.

Asset replacement is transactional: validate and prepare a candidate, retain the current usable asset, commit only a successful candidate, then release the previous resources. Failure keeps the current selection. Memory admission accounts for old and candidate resources coexisting. Server-backed asset ownership, quotas, storage, and matched backup must be implemented before claiming cross-device persistence.

Shared rules, navigation/pathfinding, or other bounded numeric work may use Rust/Wasm when measured benefit or shared correctness warrants it. This is not a commitment to rebuild the browser renderer in Rust. Native shader and asset formats remain appropriate to the selected graphics APIs.

## Version, updates, and recovery

Every accepted merge needs a deterministic advancing readable version, with retry/concurrency-safe identities and no recursive bump commits. Accepted source, published image, installed server, and loaded browser are separate records. An exact release records the commit, tree, artifact digest, binary and browser asset identities, schema compatibility, and acceptance receipts.

The browser may discover an update, explain it, preserve drafts where safe, and request deliberate refresh. It cannot replace the Rust server. Session and compatibility checks determine whether a refresh can continue normally or requires a clear sign-in/recovery path. Reconnect and refresh never loop indefinitely or label a failure successful.

An old loaded workspace may remain open after deployment. Retain the exact immutable manifests and lazy JS/CSS/Wasm chunks for supported client versions; never resolve an old workspace's module request to newer bytes. Mutation and stream admission checks the client's product/interface contract as well as current authorization. An unsupported client receives an explicit upgrade-required outcome before effects, and stale streams close with a declared reason. Test delayed room entry and pending mutations across deployment and rollback. A notice or an identity check alone does not make old controls compatible.

Actual installation belongs to one separately reviewed host updater. Its concrete bootstrap needs review before activation. It receives a verified immutable artifact, checks compatibility and host ownership, performs the admitted replacement, verifies health and exact running identity, and retains a compatible prior artifact. No Docker socket is mounted into the application and no competing updater is installed.

Recovery protects newer writes. A prior data backup is not overwritten onto newer production state as an automatic rollback. Database backups, instance encryption keys, provider-secret material, and server-backed assets require a documented consistent recovery set. PostgreSQL point-in-time recovery requires actual base backups, retained WAL, monitoring, and rehearsal; it is not enabled merely by using PostgreSQL.

## Proposed performance budgets and acceptance

The following are **initial proposed engineering budgets, not measurements or claims of live acceptance**. Before they become release gates, record the exact server allocation, database setup, reference desktop/iPhone/browser, data shape, network profile, and workload. Changes to approved budgets require a documented reason and comparable evidence.

| Scenario | Proposed target |
| --- | --- |
| Healthy local snapshot APIs, 50 active sessions and representative 100-service data | Origin p95 at or below 100 ms and p99 at or below 250 ms; provider timeouts do not enter the page request path |
| Essential 2D workspace startup payload | At most 250 KiB compressed application JavaScript and 100 KiB compressed CSS; optional room/voice packages excluded because they must not load |
| Cold usable 2D workspace on the declared reference phone at 4 Mbit/s and 80 ms RTT | At or below 2.5 seconds to useful controls, measured independently from first paint |
| Ordinary workspace interactions after load | p95 interaction latency at or below 100 ms; inspect long tasks and input loss |
| Optimized default desktop room on declared reference hardware | Target 60 fps with p95 frame time at or below 16.7 ms; degrade quality deliberately under pressure |
| Resource/recovery behavior | No duplicate subscriptions or cumulative resource growth across repeated mode switches; bounded queues and admission; restoration time and data-loss window measured and published before production acceptance |

Budgets are evaluated with realistic authentication, roles, retained Activity, concurrent edits, and game/provider snapshots. Record CPU, resident memory, connection/pool waits, query counts, lock/retry behavior, queue age, client bytes, frame time, and GPU-memory estimates where available. No fixed requests-per-second number demonstrates real workflow capacity by itself.

Required acceptance includes mobile and desktop browser behavior, accessibility/zoom, provider failure, stale evidence, concurrent commands, authorization races, interrupted work, asset rejection/replacement, graphics context loss, app/database restart, upgrade compatibility, and restore without overwriting newer writes. Pinned Rust formatting, all-target checks, Clippy with warnings denied, release builds, browser builds, focused actual HTTP checks, and exact-head CI remain required. No unexecuted platform or workflow is reported as tested.

## Source-language policy

Reborn explicitly permits bounded first-party **TypeScript/Svelte** for the browser workspace and graphics integration. This is a new-project design decision, not a silent change to the existing Rewrite's language policy.

Rust remains the server, domain, operational-tooling, and shared-rule language. Native CSS, HTML/Askama templates, SQL migrations, TOML, lockfiles, YAML workflows, Dockerfiles, Markdown, glTF/GLB/VRM assets, and appropriate shader formats remain legitimate source formats. Generated bindings and assets are identified as generated. Browser bootstrap glue may remain minimal JavaScript where required by the build/runtime.

Do not relocate native SQL into Rust strings or rebuild native formats merely to improve a language chart. Do not hide languages with repository classification settings. New exceptions need a concrete capability, boundary, maintenance cost, and acceptance record.
