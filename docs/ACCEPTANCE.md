# Reborn acceptance and evidence

This is the acceptance contract for the [M0–M8 roadmap](../ROADMAP.md), drafted
2026-10-25. **The current task is documentation only. No Reborn application,
tests, benchmarks, provider enrollment, release, deployment or live workflow is
accepted by these documents.** Original Hub and Rewrite receipts describe their
own applications, not Reborn.

## Evidence levels

| State | Evidence needed |
| --- | --- |
| Planned | Named workflow, owner, scope, dependencies and acceptance criteria |
| Implemented | Reviewable source and meaningful verification of the new boundary |
| Artifact verified | Green CI at the eventual exact head; built image/assets tied to exact source and tested through actual entrypoints |
| Live accepted | Recorded installed identity, public HTTP and appropriate signed-in/browser/provider workflow evidence, with recovery limits stated |
| Blocked | Named missing setup, authority, platform or natural-use evidence; independent work continues |
| Responsibility transferred | Explicit accepted owner/caller cutover, retirement and rollback evidence in addition to feature acceptance |

An unchecked real-account, provider, mobile or game-client gate remains open even
when source, fixtures and CI pass. State exact operating system/browser/device
execution; Linux CI and viewport emulation do not establish Windows or native
iPhone/Safari acceptance. Never reset credentials, promote another account or
replay past credential submissions to manufacture acceptance.

## Immediate M0 and M1 gates

All items below are requirements, not checked completion claims.

1. **Pinned foundation.** Rust1.99.1; Axum; PostgreSQL; compile-checked SQLx;
   persistent Svelte client with locked/pinned browser tooling. One domain,
   authorization, database migration and background-task owner. Fresh isolated
   configuration/data/network resources cannot overlap original or rewrite
   installations. Readiness checks database/schema compatibility separately from
   liveness; graceful shutdown leaves no lost accepted operation.
2. **Secure owner claim and sessions.** Host-local one-time setup secret, atomic
   owner claim and no default/public first-visitor account. Enforce password
   hashing, encrypted integration secrets, authenticated owner/member access,
   CSRF/origin checks, cookie ambiguity defenses, throttling and live session
   revocation. Rejected/expired forms have an honest recoverable outcome without
   retaining or replaying submitted credentials. Never expose tokens, private
   provider endpoints, hashes or setup secrets in responses, logs or fixtures.
3. **Database/build contract.** Apply fresh and supported upgrade schemas to a
   disposable PostgreSQL instance; check literal queries against that schema and
   validate checked-in offline metadata when used. Verify constraints, transactions,
   conflicting revisions and malformed records through real behavior. Compiler
   query checking does not prove permissions, schema upgrade safety or domain
   invariants. Do not import original databases/credentials or create dual writers.
4. **Version identity.** Before release, fix an immutable main-history anchor and
   readable numbered scheme advancing on every accepted main merge. Derive the
   number from the exact accepted commit's ordered main history; concurrent CI
   and retries cannot issue duplicates, change a commit's identity or overwrite
   an existing immutable release with different bytes. No recursive bump commits.
   Preview/development identities are explicit. Badge/details, no-store health,
   image labels/manifest and loaded client identify their actual source/build;
   accepted source and a published candidate never imply installation.
   Retain supported old clients' exact immutable manifests/lazy chunks and check
   product/interface compatibility at mutation and stream admission. An unsupported
   client gets upgrade-required before effects; it never receives mixed-release
   modules. Verify delayed room entry and pending operations across deploy/rollback.
5. **Crafty first feature.** Owner deliberately enrolls a dedicated connection;
   no original credentials are copied and no secret is requested in chat. Verify
   the actual provider contract, valid TLS and bounded timeouts/concurrency/body
   sizes/pagination. Send GET only. Show named enrolled servers, reported running/
   stopped/unknown state, player observations, timestamp/freshness and public join
   details. Protect server scope and owner/member field visibility. Valid zero,
   missing player data, partial discovery, stale data and transport/API failure
   stay distinct. Polling must not wake games. A reported count is not the complete
   evidence required to stop/restart an already managed game.
6. **Actual Crafty acceptance.** Use disposable deterministic HTTP fixtures for
   success, valid zero, missing/partial/malformed data, timeout, rejected key,
   stale observation and configuration-change races. Then accept separately
   enrolled real GET responses and browser rendering without restarting games.
   Saved public join information must be reviewed; actual outside-LAN joining and
   supported game-client compatibility require their own evidence, not a link
   appearing in a page. Until keys are enrolled, mark that gate blocked.

## Meaningful verification

New domain/provider/operation and primary verification logic belongs in Rust.
Use focused unit checks for pure rules, native HTTP integration checks through
the real application and a Rust browser driver through supported browser
protocols. Retain tiny browser primitives only where the protocol lacks an
equivalent. Exercise the actual CI/container callers; do not replace behavior
checks with source-string assertions, mock-only success or copied legacy tests.
The Svelte client has real browser/type/build checks appropriate to its role.
CSS, SQL migrations and Cargo/browser/CI/container manifests retain their native
formats; language statistics are not an acceptance target.

Required publishing checks include formatting, locked all-target/workspace
checks, Clippy with warnings denied, release/native/browser builds and focused
actual HTTP/browser verification. Run them with the pinned toolchains at the
eventual exact head. Record failed, unavailable or skipped checks and their
impact; a newer commit needs its own exact-head evidence. CI success alone does
not establish the installed image, a real provider or normal-use reliability.

## Persistent browser, room and avatar contracts

- The Svelte shell remains mounted across dashboard/room navigation. Forms,
  focus, sessions, panel subscriptions and edits survive intended transitions
  without duplicate polling/action owners. Session loss and incompatible server
  versions lead to explicit states and preserved drafts, not silent write replay.
- Private snapshots, subscriptions and recoverable non-secret drafts are scoped
  to product, authenticated account and compatible schema/session generation.
  Logout, revocation and account switches cancel old subscriptions and late
  responses, remove old private content from the active UI, and prevent another
  account inheriting it. Test switching accounts in one browser and stale-tab
  responses. Same-account reauthentication may deliberately recover a compatible
  draft only after authorization; browser-stored IDs never authorize writes.
  Passwords, provider keys, session cookies and CSRF tokens are never saved drafts.
- Define a versioned Rust scene/edit wire model with stable object IDs, bounded
  coordinates/scales, units, catalog references, asset permissions and supported
  schema migration. Generated browser types/schema reduce duplicate contracts;
  the server still validates every write. Persist appearance/layout separately
  from per-frame pose, pointer activity and transient presence.
- A save carries base revision and operation ID. The server atomically admits
  the revision and records the result; repeated identical operations do not apply
  twice. Reusing an operation ID with different content is rejected. Revisions
  prevent two tabs/devices silently overwriting one another. Conflict handling
  retains both recoverable local work and the current canonical scene.
- Coalesce gestures into meaningful edits. Autosave explicitly reports unsaved,
  saving, committed, conflict or failed. “Saved” requires server acknowledgement.
  Undo/redo has bounded retained history; undo of committed work creates a new
  accepted revision rather than restoring an old database snapshot. Recoverable
  local drafts retain their base revision and tolerate unavailable/full/cleared
  browser storage. Local storage is not the backup authority.
- Use optimized licensed GLB/VRM assets and modular room pieces with versioned
  manifests/content hashes. Declare byte/texture/geometry/animation budgets and
  upload validation before enrollment. Missing/corrupt/incompatible assets and
  renderer failure preserve a usable dashboard and an accessible fallback. Hashes
  identify bytes; trust, authorization and safe asset admission are separate.
  Keep referenced old assets for supported clients/scenes/recovery, with explicit
  retention and garbage collection.
- Verify keyboard placement/editing, touch, reduced motion, fallback, collision/
  navigation rules, avatar selection and room entry/exit. Test interrupted/lost
  save responses, two-tab conflicts, restore and schema/assets upgrade together.
  Share Rust/Wasm geometry where useful; profile batched crossings and full scene
  serialization instead of assuming Wasm or a particular renderer is faster.

## Proposed performance and reliability evaluation

This matrix defines work to measure, **not measured results or a speed claim**.
Before a candidate is evaluated, record a versioned profile with exact hardware,
OS/browser, database/storage, network conditions, account/data volume, asset
manifest, complete room scene, toolchains and proposed numeric budgets. Record
why the budgets fit the supported user/device profile. Unspecified or exceeded
budgets keep performance acceptance open.

Compare candidates with identical authorization, validation, encryption,
database durability, logging, history, task concurrency and error/recovery
semantics. Use the same room/avatar assets, visible objects, animations, panels,
saved layout and interactions. A stripped scene, disabled safeguards, warmed
cache or reduced-motion fallback is a separate named workload, not a fair result
for the full room. Include repeatable runs, sample counts and variance.

| Workload | Required conditions | Metrics and correctness checks |
| --- | --- | --- |
| Cold/warm entry | Authenticated dashboard and full room, empty/warm asset caches, representative desktop/mobile devices | Request and usable-interaction latency, transferred bytes, process/browser memory, CPU; correct identity and permission scope |
| Room interaction | Declared full GLB/VRM scene, animation, editing, panel use and keyboard/touch paths | Frame-time percentiles, input delay, long tasks, CPU/GPU/memory; identical scene/rules and usable fallback |
| Edit and autosave | Single editor, sustained gestures, two tabs, concurrent unrelated writes, delayed/lost responses | Save latency p50/p95/p99, payload/write volume, conflict/retry counts; no acknowledged edit loss, overwrite or duplicate operation |
| Dashboard/provider load | Declared account/service/history sizes, simultaneous browser sessions, complete/partial/slow providers | HTTP latency p50/p95/p99, database pool wait, query count/time, worker saturation; freshness, pagination and secret isolation |
| Disconnection/restart | Network loss, session expiry/revocation, application restart and compatible/incompatible version changes | Bounded reconnect/save outcomes, draft recovery, shutdown/restart time; honest failure and no replayed credentials/effects |
| Sustained use | Fixed-duration normal-use profile including room entry/exit and retained history growth | Resource trend, task/connection leaks, errors and tail latency; no duplicated pollers, subscriptions or operation owners |
| Restore/upgrade | Complete database/key/asset backup, supported prior/current versions, isolated restored instance | Restore/verification time and measured recovery objectives; usable accepted workflows and no overwrite of newer live writes |

PostgreSQL adds ongoing backup, monitoring and upgrade responsibilities; record
them in operational acceptance. An ORM, cache or renderer is not a substitute
for useful indexes, bounded queries, short transactions, measured contention and
rehearsed restore. Provider caches carry timestamps and revisions; caching never
turns an old observation into current player/recovery evidence.

## Release, updater and recovery gates

CORE refreshes host/container/process/network/bridge ownership before any remote
action and uses a new private immutable hash-verified execution. Record accepted
source, exact CI head, compiled source/tree, image digest, migration/schema,
asset/client manifest, installed health and public/browser evidence separately.
No original Hub, proxy/tunnel, game or active update worker restart is authorized
by this document. Keep shared checkpoints reviewable and preserve their history.

Update discovery can show an available compatible candidate. Activation preserves
unsaved forms and room drafts, checks session/interface compatibility, offers a
deliberate refresh and ends reconnect attempts in an honest bounded success or
failure state. No service worker is required just to refresh the shell. Browser
code cannot install a Rust server image. One separately authorized host updater
requires a concrete bootstrap, privilege, lock, candidate admission, backup,
failure and recovery review before installation or activation. No Docker socket
in the application and no competing updater.

Back up a consistent PostgreSQL database, private instance key and referenced
asset/manifest set. Verify an isolated restore before relying on it. Prefer
backward-compatible schema evolution within the declared rollback window;
otherwise reject an incompatible prior binary and provide an explicit recovery
path. A rollback rehearsal cannot restore an old backup over newer live writes.
Document what a matched prior image can read/preserve and what data created by a
newer version requires. Proposed recovery-time/data-loss objectives need measured
evidence before being advertised.

## Game and external-effect transfer gates

Read-only status never conveys start/stop/listener/updater authority. Before each
handover, inventory all enrolled game writers/readers, browser/Discord adapters,
listeners, maintenance/backup/update jobs, lock/intent identities and recovery
callers. Keep the original protected four-writer/two-reader interface unfrozen
until its owner accepts a replacement contract. Preserve newer branches,
assignments and unpublished external work.

Accept one Rust operation owner with authorization, generation/revision fences,
idempotency, terminal/uncertain outcomes, retained feedback and lost-response
reconciliation. External effects occur outside database transactions. Database
commit or an HTTP success alone is not proof of game readiness, save completion,
backup completeness, functional repair or gameplay compatibility. AI may explain
captured evidence or propose typed actions; it never acquires execution authority.

For protected stop/restart, require fresh complete enrolled zero-player evidence,
zero pending/accepted/established proxy clients and a held join fence. Unknown
blocks. Preserve original updater/backup/idle ownership until the per-game cutover
is explicitly accepted, and rehearse matched recovery without disturbing occupied
games or newer writes. A browser button or new adapter is not a responsibility
transfer receipt.

## Acceptance ledger for every slice

Keep one row per independently useful workflow. Evidence may link to review/CI
and immutable receipts; never include secrets. Do not copy another project's
acceptance status into Reborn.

| Workflow / milestone | Source and exact-head checks | Artifact / installed identity | Browser / provider / platform evidence | Storage, permissions and recovery | Remaining gate / responsible owner | Transferred / retired responsibility |
| --- | --- | --- | --- | --- | --- | --- |
| M0 foundation | Planned | Not built or deployed | Not accepted | Design requirements above | Implementation and isolated verification / CORE | None |
| M1 Crafty overview | Planned | Not built or deployed | Credentialed reads and real browser acceptance open | GET-only; no game effects | Dedicated enrollment and actual contract verification / CORE | None |

Define the agreed required-workflow denominator before any completion percentage.
Track actual accepted workflows and individually transferred responsibilities;
source-language share, fixture coverage and milestone count do not prove parity
or retirement. A primary-site replacement needs a separate owner decision after
M8 evidence and its concrete rollback plan are reviewable.
