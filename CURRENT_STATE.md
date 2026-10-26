# Reborn current state

Updated **2026-10-26 America/Chicago**. **M0 remains in progress.**

## Source and acceptance

The prior accepted baseline is source **0.1.4**, main
`377f89d0dee9ed9e2e96f70385587f7ca6939b22`: Rust/PostgreSQL foundation,
private atomic owner/session API and separate native Askama account documents.
Its exact head/main CI passed42 Rust tests and11 real Chromium HTTPS workflows.
[Exact receipt](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1#issuecomment-6407867529).

The [persistent workspace slice](docs/M0_WORKSPACE.md) adds one compiled Svelte
application served by Rust, a private account-owned note with revision conflicts,
scoped non-secret drafts, one observation controller, and logout/revocation/
account-switch/late-response cleanup. Separate account pages remain native Askama.
Schema3 adds workspace notes without editing accepted0001/0002. The old schema2
binary refuses schema3; recovery/rollback compatibility is not claimed.

New primary browser verification uses a [Rust WebDriver caller](tools/workspace-browser/README.md)
against real Chromium/ChromeDriver156.0.8078.4, private trusted HTTPS and disposable
PostgreSQL. Existing Playwright workflows remain additional regression coverage.
Svelte/Vite/checker dependencies are exact locked; its checker uses a compatible
TypeScript6 npm workspace while account/test TypeScript7 stays pinned. No production
Node server, renderer, room engine or invented provider data is introduced.

Source presence is not execution acceptance. Exact eventual-head/main CI, review,
accepted source identity and terminal outcomes for this slice are recorded in
[issue1](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1) and
[issue3](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/3). No Reborn image,
production database/key/account, installed service, public/provider acceptance,
packaged restore, native iPhone/Safari or performance result exists yet.

## Ownership and delivery

One active CORE integrates. No external Reborn worker assignment is active;
existing original/Rewrite assignments and unpublished branches remain protected.
Main ruleset25845081 is active, main-only, empty bypass list, PR-only with current
base and required `Rust 1.99.1 / PostgreSQL 16` check, no deletion/force pushes,
resolved conversations and merge/squash only. Refresh before integration.

Accepted source, publication, installation and loaded browser identities remain
separate. Source derivation/compiled HTTP/HTML metadata exist; immutable artifact
publication, conflicting/late publisher admission, lazy-client retention and
packaged recovery remain open. Full M0 is tracked in issue3, M0–M8 in issue2.

## Preserved live baseline

`https://rewrite.keida.me` is recorded as the independent **Keida-Hub-Rewrite
v0.1.4**; `https://keida.me` remains the original Hub. Read the
[Rewrite deployment receipt](https://github.com/Hizumi-Senpai/Keida-Hub-Rewrite/issues/1#issuecomment-6403570111)
and refresh host/container/process/network/bridge ownership before remote work.

The last read-only host receipt (2026-10-25T22:58:34Z) recorded unchanged original,
Rewrite, nginx/tunnel/Crafty containers, active Steam updater9858 and clean bridge
`36c62838b99a9804383884f775358fe90b8bc45c`. Those observations are historical,
not fresh locks. Rewrite's port8790/data/key/network remain its own. No host,
route, provider credential, game controller or updater was changed by these source
slices. Full host-updater installation and original game transfer retain separate
concrete review/authorization gates. See [OWNERSHIP.md](docs/OWNERSHIP.md).

## Next concrete work

Qualify the workspace's exact eventual-head/main checks and record its receipt.
Then introduce encrypted dedicated provider-secret enrollment with the first
Crafty read-only caller; use valid TLS and honest observation freshness/unknowns.
Immutable publication, supported client asset retention, isolated packaged
install/upgrade/recovery and any public cutover remain separate acceptance gates.
