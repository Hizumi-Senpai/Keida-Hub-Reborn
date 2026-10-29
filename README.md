# Keida Hub Reborn

A fresh Rust-centered Keida Hub, authorized on **2026-10-25 America/Chicago**.
The goal is a fast, reliable, feature-rich self-hosted dashboard and control platform
with an optional editable 3D room and companion.

**Reborn is live at https://rewrite.keida.me.** Current exact source, CI,
artifact, independent PostgreSQL/key recovery and public HTTP receipts are in
[deployment issue1](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1).
The owner reports successful sign-in; wider desktop/mobile workflow acceptance and
real dedicated Crafty enrollment remain separate open gates. The original
https://keida.me stays live and unchanged, and the independent Rewrite installation
is preserved for route reversal.

The accepted foundation is Rust/PostgreSQL authentication, separate Askama account
pages, one persistent Svelte workspace with private revisioned notes, and dedicated
encrypted GET-only Crafty enrollment/observations. The service directory/search/categories and personal pins are installed. Retained private Activity and connection-enrollment history are installed. Grouped notifications/read state and personal Home arrangement are installed. The current
daily-use catalog, sampled Crafty history and Roadmap note are installed.
[Owner-only Jellyfin/Seerr observations](docs/M3_MEDIA.md) are installed as0.1.13
([issue20](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/20)).
[Owner-only queue/transfer observations](docs/M3_QUEUES.md) are installed as0.1.14
([issue22](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/22)). Source0.1.15
records the self-hosted Commander policy. [Discord identity linking/status/local
unlink](docs/M4_IDENTITY.md) is installed as0.1.16/schema12
([issue25](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/25)); dedicated
real Discord setup/privacy/owner acceptance remains pending. Personal session
review/targeted sign-out was introduced in0.1.17/schema13 (issue27).
[Server-change discovery and draft-safe refresh](docs/M5_BROWSER_REFRESH.md),
[issue29](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/29), is now installed
and runtime/recovery/retention-qualified in **0.1.18/schema13** under the
[exact18 receipt](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1#issuecomment-6482571904).
Source, fixture verification, installation and real owner/provider acceptance
remain separate. The requested [successor handoff](docs/HANDOFF.md) records the
next task and ownership transfer.

## Start here

1. [Agent instructions](AGENTS.md)
2. [Current state](CURRENT_STATE.md)
3. [Roadmap](ROADMAP.md)
4. [Architecture](docs/ARCHITECTURE.md) and [locked decision](docs/decisions/0001-platform-and-assets.md)
5. [Acceptance](docs/ACCEPTANCE.md), [deployment](docs/DEPLOYMENT.md) and [updates](docs/UPDATES.md)
6. [Ownership](docs/OWNERSHIP.md) and [fresh-chat handoff](docs/HANDOFF.md)

Trackers: [deployment/ownership receipts](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1),
[M0–M8 acceptance](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/2),
[next implementation task](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/3).

## Locked foundation

| Responsibility | Selection |
| --- | --- |
| Authoritative application | Rust1.99.1; Axum, Tokio, Tower; modular domain services |
| Persistence | PostgreSQL; SQLx checked queries; explicit SQL migrations |
| Live workspace | One persistent Svelte/TypeScript application with accessible HTML controls |
| Separate public/account pages | Rust/Askama; no implied Svelte hydration from Askama markup |
| Room rules and editing | Rust-defined versioned documents/commands; shared Wasm where useful |
| Optional 3D presentation | Three.js plus three-vrm; tested WebGL2 baseline, separately gated WebGPU |
| Assets | Optimized custom rigged GLB defaults, modular GLB room/props, tested VRM avatar import profiles |
| Delivery | Immutable exact-source images; one separately authorized host updater |

Rust owns authorization, provider access, durable commands, saved state and recovery.
The browser owns presentation and interaction. TypeScript is a deliberate new-project
choice, not an accidental fallback. CSS, HTML, SQL, Markdown, TOML, YAML, lockfiles
and container configuration retain their native roles. No production Node server
or Python/React application is selected.

The avatar format, room assets, renderer and room document are separate decisions.
VRM is a glTF-based humanoid profile; it is not the room format. Saved rooms use
Keida-owned object/asset IDs, transforms and interaction anchors, not serialized
engine objects. Grid/room transitions preserve the same tiles, forms and chat.
Mobile retains a full useful 2D dashboard without downloading the 3D experience.

## What happens next

The **M5 host-updater contract and concrete bootstrap review** are frozen for
implementation in [issue31](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/31):
[execution contract](docs/M5_HOST_UPDATER.md) and
[actual host/source/binary/bootstrap review](docs/M5_UPDATER_BOOTSTRAP_REVIEW.md).
Next implement and qualify the bounded Rust one-shot protocol in isolation.
The first [request/journal foundation](docs/M5_UPDATER_FOUNDATION.md), issue33,
now has a diagnostic-only Rust CLI, strict canonical parsers and durable private
journals with25 passing independent package fixtures. Full eventual-head CI and
the actual host executor remain open. Crash/reboot/recovery/uninstall evidence and
a complete activation packet remain open. Installation/activation requires separate
owner approval of that exact packet. No updater daemon, scheduler or second
writer is activated here. Accepted documentation main is0.1.19; live/channel
remain0.1.18/schema13, and this implementation is unmerged.
M5.1 browser refresh is already installed; do not repeat18's installation/cleanup.

Dedicated Discord application enrollment/callback-query privacy and real owner
linking acceptance remain open, alongside earlier daily-use/Crafty/Media/Queues
acceptance. Full M0–M4 are not complete. Game-control and host-updater authority
retain their separate review gates.

Performance goals are proposed budgets until measured on named hardware/browsers.
The architecture is selected; it is not a benchmark victory or feature-parity claim.
The [roadmap](ROADMAP.md) retains the original Hub's useful feature set and separates
source completion, real acceptance and eventual responsibility transfers.

## Existing projects remain intact

- [Original Hub](https://github.com/Hizumi-Senpai/Keida-Hub) remains the owner of its live game/control workflows.
- [Rewrite](https://github.com/Hizumi-Senpai/Keida-Hub-Rewrite) remains preserved, with its [v0.1.4 deployment receipt](https://github.com/Hizumi-Senpai/Keida-Hub-Rewrite/issues/1#issuecomment-6403570111).
- [Original shared checkpoint](https://github.com/Hizumi-Senpai/Keida-Hub/issues/379) keeps its history; workers' newer/unpublished work is not cancelled or imported automatically.

Do not copy an entire legacy application or test suite. Reuse reviewed Rust only
with a concrete Reborn caller, its required contracts and retained attribution.
No account, credential, provider key or production database is implicitly migrated.
