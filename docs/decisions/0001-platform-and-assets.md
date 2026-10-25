# ADR 0001: Rust authority, persistent browser workspace, and portable assets

Date: 2026-10-25, America/Chicago

Status: accepted design direction; implementation and deployment acceptance are pending.

## Context

Keida Hub Reborn must support the useful original Hub workflows and room/avatar goals with fast mobile access, dependable game behavior, explicit permissions, reliable recovery, and room for long-term growth. Setup effort is not the limiting factor. Browser startup, component lifetimes, database operations, failure isolation, and operational responsibility matter more than a language percentage.

Reborn is independent of the original Hub and existing Rewrite. The eventual `rewrite.keida.me` route must be transferred only after isolated acceptance and coordinated cutover. This decision authorizes no original-Hub restart, game restart, inherited credential use, competing state writer, or host updater activation.

## Decision

1. Use Rust **1.99.1**, Axum, Tokio, and Tower for one modular primary application. Rust owns authentication, permission decisions, domain rules, provider adapters, durable game intent/receipts, persistence, and operational logic.
2. Select **PostgreSQL** and **SQLx compile-checked queries**, with native SQL migrations and checked offline query metadata. Operate one migration authority. Keep transaction ownership and schema/data compatibility explicit.
3. Use **TypeScript/Svelte** for one persistent authenticated workspace. Dashboard, arrangement, chat, and room share stable owned components and state. Account/recovery/fallback pages may use **Askama**. Askama markup is not presented as Svelte SSR or hydrated by assumption.
4. Serve compiled browser assets from the Rust application. Node may be a build dependency; a production Node SSR service is not part of this decision. Keep the initial 2D workspace small and lazy-load optional room/voice features.
5. Use **Three.js plus three-vrm** for the initial optional browser graphics subsystem. Prove WebGL 2 as the compatibility baseline. Gate WebGPU on actual compatibility, performance, fallback, and recovery evidence.
6. Use optimized **custom rigged GLB** default avatar assets with a defined animation profile. Support **VRM 1.0** as an imported humanoid profile, with deliberate tested/labeled **VRM 0.x** compatibility. VRM is not a room format or a general physics/navigation system.
7. Use modular **glTF/GLB** room/furniture assets and a versioned **Rust-owned semantic scene/layout model**. Permit constrained complete-room imports. Persist asset references, transforms, interaction anchors, ownership, and revisions rather than engine objects or executable callbacks.
8. Use Rust/Wasm for shared rules or bounded numeric work such as pathfinding when shared correctness or measured performance warrants it. Do not assume moving DOM or GPU orchestration into Rust improves the browser experience.
9. Keep server replacement under one separately reviewed host updater. Browser code may discover an update and perform a deliberate compatible refresh; it cannot replace the server.

The full boundaries, invariants, and proposed acceptance budgets are in [Architecture](../ARCHITECTURE.md).

## Why these choices

The Rust server provides typed boundaries and one place for authoritative policy. PostgreSQL accepts extra operational responsibility now in exchange for a deliberate concurrency/recovery foundation. SQLx keeps important queries and transactions visible while allowing schema/type checks during builds. Neither compiler checks nor the database prove authorization or external-action correctness.

A persistent workspace fits a dashboard whose live tile instances must survive grid/room transitions with forms, chat, scroll state, and polling intact. Small independent islands remain useful for independent pages, but are not the ownership model for the interconnected workspace. Browser TypeScript is an explicit capability boundary, not permission to duplicate Rust policy in the client.

Three.js and three-vrm provide a concrete browser rendering/avatar path. Their selection is not a benchmark victory over other engines. Content budgets, DOM integration, GPU resources, animation work, and recovery behavior must be measured. The Rust scene model limits persistence coupling; it does not make a future renderer replacement free.

Custom GLB defaults give direct control over the authored rig and asset budgets. VRM imports support interchangeable humanoid avatars using a standard profile. A custom GLB profile requires us to define expression/gaze/animation conventions; VRM support requires accurate material, expression, gaze, and secondary-motion compatibility. Neither extension guarantees quality or optimization.

## Alternatives considered

| Alternative | Useful strengths | Reason not selected as the primary approach |
| --- | --- | --- |
| Leptos server rendering with Rust/Wasm islands | Shared Rust components and types; HTML-first pages; localized interactivity | Not established as the fastest client for this workload. Persistent rich workspace/graphics ownership and cold mobile payloads need independent proof; browser-native TypeScript is deliberately permitted here. This is not a claim that Leptos cannot implement the product. |
| Askama plus many independent client islands | Small HTML-first pages with selective scripting | Poor default ownership boundary for interconnected tiles, chat, arrangement, and room lifetimes. Askama remains selected for genuinely independent account/recovery pages. |
| Full Svelte SSR service | Direct server rendering/hydration of Svelte components | Adds a production JavaScript runtime and deployment responsibility. Not selected without measured product benefit over the bounded compiled workspace. |
| SQLite | Embedded deployment, straightforward local installation, suitable for many self-hosted workloads | Reborn deliberately selects PostgreSQL's operational/concurrency path for this fresh start. Existing SQLite deployments remain valid separate projects; this decision does not authorize converting their data. |
| SeaORM or Diesel | Typed entity/query APIs; useful schema and CRUD tooling | SQLx plus typed domain modules keeps critical queries and transactions explicit. ORM selection alone does not improve speed, enforce permissions, or remove SQL/schema recovery responsibilities. |
| Babylon.js | Integrated scene, collision/navigation, animation, editor, and HTML-mesh capabilities | A credible alternative, but not demonstrated faster for Keida. Engine-specific integration and VRM support still need acceptance. Use it if a separately reviewed capability/performance gap justifies changing the renderer decision. |
| Rust Bevy/wgpu browser engine | Rust engine architecture and control over custom game/compute systems | Adds browser UI bridging and asset/runtime responsibilities for a web dashboard. Not justified solely by a desire to eliminate TypeScript. |
| A custom renderer or database | Maximum control over specific internals | Transfers a large correctness, compatibility, tooling, and recovery burden to Keida without a demonstrated workload benefit. |

## Non-negotiable invariants

- Rust authorizes all server effects. Client presentation and imported assets cannot grant capabilities.
- One component instance owns each live tile/form/chat. Grid/room mode changes do not recreate them or duplicate provider polling.
- Essential controls remain real HTML, with a complete lightweight 2D mobile path. Room graphics are optional.
- Browser zoom, keyboard/focus, scrolling, occlusion, pointer routing, and iPhone behavior need actual acceptance. Three's CSS3DRenderer documents a 100% browser/display zoom limitation; it is not assumed to solve the full HTML-in-room contract.
- Asset replacement validates a candidate before committing it. Failure preserves the current usable asset; resource admission includes overlapping old/new memory.
- Imported assets are validated data, not executable behavior. Interaction anchors resolve only to allowlisted Rust-authorized actions.
- Snapshot freshness and unknown player/client evidence remain honest. Unknown does not become zero.
- One documented lifecycle owner dispatches and reconciles durable game command identities. Local deduplication does not manufacture exactly-once remote HTTP effects.
- No database transaction is held across remote provider/model work. No new project silently inherits the original protected writers/readers.
- Accepted source, image artifact, installed server, and loaded browser versions remain distinct and verifiable.
- Rollback respects schema/data compatibility and newer writes. Backups, instance keys, secret material, and server-backed assets have a rehearsed matched recovery path.

## Costs and consequences

PostgreSQL requires its own credential, maintenance, monitoring, backup, and recovery plan. TypeScript/Svelte adds a second first-party programming language and browser dependency/build tooling. Askama and Svelte have separate rendering responsibilities, so shared styles/contracts must be intentional and dashboard logic must not be duplicated across them. Three/VRM introduces asset-profile and graphics compatibility work, including WebGPU material differences and browser resource limits.

These are accepted costs for explicit capability boundaries. Native SQL, CSS, HTML/templates, TOML, YAML, Dockerfiles, Markdown, lockfiles, asset and shader formats remain permitted. Generated code is labeled; languages are not hidden to improve statistics. This policy applies to Reborn and does not retroactively relax the existing Rewrite's policy.

## Evidence and acceptance

This ADR records a design selection, not implemented functionality, a measured engine comparison, or live deployment acceptance. Proposed budgets in Architecture must be tied to declared hardware/data/network profiles before becoming release gates. A failure must produce a documented fix or reviewed tradeoff, not a silent weakening of the budget or workflow.

Acceptance must include real HTTP/browser flows, mobile cold load, concurrent edits/commands, permission races, provider timeouts, duplicate/reconciled effects, stable forms and chat across room transitions, asset rejection/replacement, graphics context loss, interrupted updates, and restoration without overwriting newer writes. Require pinned Rust formatting, all-target checks, Clippy with warnings denied, release/browser builds, and green exact-head CI. Report only executed platforms and workflows.

## Primary references

- [Axum](https://docs.rs/axum/latest/axum/): Tokio/Tower integration and request handling.
- [SQLx checked queries](https://docs.rs/sqlx/0.9.0/sqlx/macro.query.html): build-time schema/type checking and offline metadata.
- [PostgreSQL concurrency](https://www.postgresql.org/docs/current/mvcc-intro.html) and [continuous archiving](https://www.postgresql.org/docs/current/continuous-archiving.html): concurrency and recovery mechanisms, with explicit operational requirements.
- [Svelte](https://svelte.dev/docs/svelte/overview) and [best practices](https://svelte.dev/docs/svelte/best-practices): compiled components, reactivity, and component lifetime considerations.
- [Askama](https://docs.rs/askama/latest/askama/): typed Rust templates.
- [Leptos browser binary size](https://book.leptos.dev/deployment/binary_size.html): Wasm size/compilation tradeoffs; not a Keida benchmark.
- [Three CSS3DRenderer](https://threejs.org/docs/pages/CSS3DRenderer.html): DOM integration and zoom limitation.
- [Three WebGPURenderer](https://threejs.org/manual/pages/webgpurenderer): WebGPU and WebGL 2 backend behavior.
- [three-vrm](https://pixiv.github.io/three-vrm/docs/): VRM integration and WebGPU material compatibility notes.
- [Babylon capabilities](https://www.babylonjs.com/specifications/) and [HTML Mesh](https://doc.babylonjs.com/addons/htmlMesh/): alternative features and browser/iOS caveats.
