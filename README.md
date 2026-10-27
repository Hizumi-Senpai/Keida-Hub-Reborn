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
daily-use catalog, sampled Crafty history and Roadmap note are installed. The next
slice is [owner-only Jellyfin/Seerr observations](docs/M3_MEDIA.md), tracked in
[issue20](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/20). Source, packaged
verification, installation and live acceptance are recorded separately.

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

Continue **M3 media observations** with deliberate owner-only Jellyfin/Seerr
enrollment, bounded library/request rows and counts-only playback. Broad API keys
are not called read-only merely because the adapter sends GET. M0/M1/full M2/M3
remain open pending their complete acceptance. Real Crafty enrollment,
valid TLS, dedicated access and real freshness/join acceptance are deliberate next
provider gates. Real media enrollment/privacy/TLS acceptance is separate; game-control and
host-updater responsibility keep their separate review gates.

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
