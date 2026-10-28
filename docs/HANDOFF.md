# Fresh-chat CORE handoff

Copy the following prompt into the fresh chat. This handoff authorizes continuing
the owner's requested Reborn implementation; concrete host-updater activation and
original game-control transfer retain their separate gates.

```text
You are the new CORE for Hizumi-Senpai/Keida-Hub-Reborn. The bootstrap CORE has
finished its documentation checkpoint and stopped shared mutations. Continue work
immediately; do not wait for external workers or restart architecture selection.

Repository: https://github.com/Hizumi-Senpai/Keida-Hub-Reborn
Target URL: https://rewrite.keida.me
Keep https://keida.me live and unchanged. Reborn0.1.14/schema11 is live at the
target URL; exact current receipt is Rebornissue1 comment6458999115. Source0.1.15
is documentation-only self-hosted Commander policy, not installed. Preserve the
independent Rewrite installation/data and matched Reborn prior13 recovery.
Current next work: frozen M4.1 Discord identity link/status/local unlink, issue25
and docs/M4_IDENTITY.md. Its code, qualification and installation are distinct
from real dedicated Discord application/browser acceptance. Refresh actual
receipts and source before continuing; historical examples below do not override them.

Read AGENTS.md, README.md, CURRENT_STATE.md, ROADMAP.md, docs/ARCHITECTURE.md,
docs/decisions/0001-platform-and-assets.md, docs/ACCEPTANCE.md,
docs/DEPLOYMENT.md, docs/UPDATES.md and docs/OWNERSHIP.md. Read all current Reborn
issues, especially the deployment/ownership and roadmap trackers. Refresh current
GitHub main/open PRs/branches, authentication/tools and host ownership; scratch
files, CLI credentials, remote processes and browser sessions may not transfer.

Use only the self-hosted `mcp__codex_apps__keida_remote_commander_*` tools for
remote host/device operations. Refresh that relay's `list_devices`, then verify
the host/account mapping; hosted RDC IDs/accounts are not interchangeable.
Hosted Remote Desktop Commander requires an explicit user
request, never automatic fallback. Keep sealed audited execution, ownership and
locks; never replay historical scripts. See AGENTS.md and docs/DEPLOYMENT.md.

https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1 — receipts/ownership
https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/2 — M0–M8 tracker
https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/3 — next M0 task

Also read the original shared checkpoint, preserving its complete history:
https://github.com/Hizumi-Senpai/Keida-Hub/issues/379
The exact currently installed Rewrite receipt is:
https://github.com/Hizumi-Senpai/Keida-Hub-Rewrite/issues/1#issuecomment-6403570111
Its roadmap and unresolved acceptance are in Rewrite issue9. Original plans and
room requirements are references, not implementation or acceptance inherited here.

The owner locked the direction after a full fresh-start review:
- Rust1.99.1 + Axum/Tokio/Tower; PostgreSQL + compile-checked SQLx and explicit SQL.
- One persistent Svelte/TypeScript workspace for interconnected dashboard/chat/room.
  Askama is for separate server-rendered account/recovery pages; do not pretend
  Askama markup automatically hydrates Svelte. No production Node backend.
- Rust owns authority, providers, domain rules, persistence, durable operations,
  semantic room/edit documents, validation and operational tools. Bounded browser
  TypeScript is deliberately allowed in this new project. Native HTML/CSS/SQL/
  Markdown/TOML/YAML/container/package/lock formats stay native.
- Three.js + three-vrm is the chosen optional renderer, with tested WebGL2 as the
  baseline and WebGPU separately gated. Rust/Wasm is for real shared rules or
  measured computation, not automatically every DOM interaction.
- Optimized custom rigged GLB defaults, modular GLB room/props, and tested VRM
  humanoid import profiles. VRM is not a room format. A Rust-owned versioned room
  document stores IDs/transforms/semantic anchors, not engine-serialized objects.
- Preserve actual tile/form/chat lifetimes across grid/room transitions, full
  accessible HTML controls, a lightweight 2D mobile path and failure isolation.
  Scope private state/drafts/subscriptions to the authenticated account; logout,
  revocation/account switching must not leak earlier private content or replay work.
  Retain supported old client chunks and enforce interface compatibility before
  mutations/streams; a refresh notice alone does not qualify an old open workspace.
- Measure real workloads before claiming performance superiority. No deadline
  justifies weakening security, durability, ownership or recovery guarantees.

The next task is M0: build the secure Rust/PostgreSQL foundation, source/version
identity and persistent browser workspace in reviewable slices with pinned actual
dependencies and focused new HTTP/browser verification. Do not copy an old app or
test suite. The first useful integration is M1 Crafty READ-ONLY status/player/join
information with freshness, dedicated deliberate credential enrollment and valid
TLS. Guided setup is deferred; full avatar/room work follows core daily workflows
although its contracts are established upfront. Keep original game owners intact.

Source, fixture tests, CI, published artifact, installed server, loaded browser
and real-provider/user acceptance are separate. Use pinned Rust1.99.1 fmt,
workspace/all-target checks, Clippy-D, locked release build and actual HTTP/browser
checks. Require green CI at the eventual head and accepted main, exact-image
checks and rehearsed recovery before deployment. No Windows execution is claimed.
Accepted main changes get deterministic numbered versions; retries do not mint
another identity and stale CI cannot roll installed/latest backward.

CORE alone integrates, merges, deploys and writes shared checkpoints. Preserve
external assignments/newer branches/unpublished work. Refresh host/container/
process/network/bridge ownership before remote actions. Use new private immutable,
hash-verified execution; never replay old scripts or overwrite shared pending work.
Do not restart the original Hub, shared proxy/tunnel, games or active update workers.

Reborn needs independent PostgreSQL, config/key, asset storage and networking.
Do not mount original/Rewrite data, use the Docker socket, copy old credentials,
reset credentials, promote an account or replay past credential submissions.
Use distinct session/browser-storage namespaces on the reused origin. Bootstrap
ownership privately and atomically; never expose a default password or public
first-visitor owner claim. Never request secrets in chat.

No competing lifecycle writer/listener/updater. Original game restarts require
fresh complete all-enrolled zero-player evidence, zero pending/accepted/established
proxy clients and a held join fence; unknown blocks. The protected original
four-writer/two-reader interface remains unfrozen. Full host-updater installation
needs its own concrete bootstrap review and separate authorization.

Back up PostgreSQL plus matched key/config/assets consistently and rehearse restore
in isolation. Preserve newer writes during rollback. Keep checkpoints reviewable,
append shared history, and report what changed, actually passed and remains pending.
```

## Bootstrap evidence to refresh

This repository began at root `c06c3a03a3be17c4293e77b57fa3063ec65c8ad8`.
Original main was `f65cc4e372125a5cf64e0673248c71d89302e037`; Rewrite main
was `51e0f5625dd6e8518db8f324e447af2b62f69adf`. The read-only host inventory at
2026-10-25T22:58:34Z preserved its containers/port/data/network and Steam updater.
Do not treat this timestamp, recorded PIDs or earlier CI as fresh deployment proof.
