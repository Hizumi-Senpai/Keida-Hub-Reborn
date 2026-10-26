# M0 persistent workspace contract

Frozen before implementation, 2026-10-26 America/Chicago. This slice introduces
one compiled Svelte workspace at `/workspace`, served by Rust without Svelte SSR
or a production Node process. Separate Askama account documents remain separate.

## Concrete workflow and authority

Home and a private workspace note share one mounted editor and one observation
owner. Switching views preserves the actual textarea node, draft, selection and
scroll position. No room engine, pretend provider records or nonfunctional action
buttons are introduced. The note is ordinary non-secret text, not credential
storage: at most4096 UTF-8 bytes and no NUL. Saving is deliberate, never automatic.

PostgreSQL stores one note per authenticated account, with a nonnegative bigint
revision. Missing notes read as empty/revision0 without a write. A save submits
only body and canonical decimal-string base_revision; it never selects an account
ID. Rust rechecks key binding, active account, session expiry/generation/revocation
inside the same transaction as the revision check and write. Conflicting saves
return409; no stale overwrite, credential replay or background save retry occurs.
An uncertain result requires a fresh read and deliberate reconciliation. Revision
overflow fails closed. Migration0003 preserves accepted0001/0002 and their data.
The old schema2 binary refuses schema3; no rollback compatibility is claimed.

`GET /workspace` authenticates before serving a native HTML bootstrap with no
private account/note snapshot. It contains only public compiled build identity,
immutable asset URLs and an opaque session binding. The Svelte client mounts;
it does not hydrate this HTML. Startup failure retains useful recovery links.

`GET /api/workspace/snapshot` and `PUT /api/workspace/note` require singular
X-Reborn-Product:keida-hub-reborn, X-Reborn-Contract:reborn-workspace-v1 and
X-CSRF-Token equal to the loaded session binding. PUT also requires the exact
configured HTTPS Origin. Admission rejects wrong clients426 before effects,
wrong Origin/binding403, invalid sessions401 and incompatible schema/key503.
JSON denies unknown fields, is bounded8192bytes and never echoes rejected data.
IDs, generations and revisions are canonical decimal strings. Reads and writes
derive account scope from the current bearer. Successful snapshots include the
current account, session generation, note and explicit workspace schema1.

## Browser lifetimes and recovery

One controller owns bounded4second reads/saves and one15second visible-page poll.
Navigation does not create more controllers, editors or subscriptions. Pause on
blur/hidden/pagehide, synchronously flush cleared private DOM and abort/invalidate all work.
Focus/visible/pageshow performs a fresh bound read before revealing private UI.
Account-document auth notifications also invalidate the workspace. An obsolete,
cancelled, expired or late result never restores cleared content or another
account. Terminal read failure stops polling and exposes deliberate GET recovery.

Non-secret note drafts use sessionStorage under product/workspace-schema/account/
session-generation keys. Never store passwords, setup/provider keys, cookies or
CSRF/session bindings. Storage absence/quota/corruption cannot disable editing or
sign out. Drafts carry a base revision; recovery after a fresh authorized read is
deliberate. Another account/generation cannot inherit a draft. Explicit sign out
removes the current draft, clears UI and subscriptions before native submission;
it never waits for the optional polling enhancement. Other invalidations retain
only the compatible scoped draft for deliberate recovery after authentication.

Polls may update canonical remote state, but never overwrite dirty editor text.
A remote revision change or409 retains local text and presents the latest saved
note separately, with explicit keep-editing or load-saved choices. A save result
acknowledges only the submitted text/revision; edits made while it was pending
remain dirty. Lost responses do not trigger another PUT automatically.

## Assets and verification

Pinned Svelte/Vite/compiler tooling uses one npm lock. The existing account/test
TypeScript7 compiler stays pinned; Svelte's checker currently requires TypeScript6,
so its npm workspace pins a compatible separate compiler rather than bypassing
peer checks. Compiler/accessibility warnings are errors. Rust embeds an exact
generated allowlist of content-addressed JS/CSS assets. Unknown paths return404;
no filesystem wildcard or mutable latest URL. A build compares tracked generated
bytes, records raw/gzip sizes and checks the proposed initial2D byte budget.
There are no lazy chunks yet: retention/deploy/rollback acceptance remains open.

New primary HTTP/database/browser verification belongs in Rust. A narrowly scoped
W3C WebDriver client drives pinned Chromium/ChromeDriver against the real Rust
binary and disposable PostgreSQL, using a fresh private trusted HTTPS fixture.
No TLS bypass, injected auth cookie, fabricated success snapshot, secret-bearing
diagnostic or authenticated screenshot/storage-state artifact is accepted. Browser
JavaScript primitives inspect/hold DOM/network work only where necessary; Rust
owns fixture authority, expectations and outcomes. Existing accepted Playwright
contracts remain additional regression coverage, not the new primary driver.

Acceptance covers native HTTP admission/IDOR/revisions/malformed input/revocation,
fresh and prior-schema migration, actual browser navigation/editor lifetime,
draft recovery, conflicts, pending saves, late responses, cross-tab account
switches, remote revocation, optional failures, keyboard/reflow and accessibility.
Exact eventual-head and main CI must pass. Source/fixture acceptance does not
publish an image, enroll a provider, install Reborn or transfer any host/game owner.
