# Keida Hub Reborn

A fresh Rust-centered Keida Hub, authorized on **2026-10-25 America/Chicago**.
The goal is a fast, reliable, feature-rich self-hosted dashboard and control platform
with an optional editable 3D room and companion.

**Target URL: https://rewrite.keida.me.** That URL currently serves the independent
Keida-Hub-Rewrite v0.1.4. Reborn has a locked architecture and an M0 backend foundation slice ([source and checks in PR #4](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/pull/4));
there is no Reborn image, production database, live deployment or performance
result yet. Keep https://keida.me live and unchanged. Reuse of the target URL follows
the [deployment and cutover gates](docs/DEPLOYMENT.md), preserving the working
Rewrite installation and its data until Reborn is ready.

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

**M0: build a secure, locally verifiable foundation** with pinned dependencies,
PostgreSQL migrations, owner/session boundaries, source/version identity and a small
persistent workspace. Then **M1: useful Crafty read-only server/player/join views**
with deliberate credentials, valid TLS and honest freshness. Do not begin with
another broad language conversion, a placeholder public deployment or game control.

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
