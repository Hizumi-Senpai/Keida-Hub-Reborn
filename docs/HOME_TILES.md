# Useful Home tiles

Installed23/schema14 delivered issue43. [Issue45](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/45)
prepares [direct Home landing, automatic observations and managed sleep](HOME_CONVENIENCE.md).
Qualification and installation receipts remain separate from source changes.

Home returns to the useful tile dashboard from the Original Hub. The sidebar
keeps detailed provider views, setup and administration. A large note-led welcome
banner is not the dashboard; the private note is an optional tile and its full
editor remains available. This is a focused use of the existing Rust/Svelte
foundation, not another framework or operational ownership transfer.

## Catalog and arrangement

Rust owns the bounded catalog, labels, role eligibility, default selection and
normal/wide size vocabulary. The owner can select game servers, Jellyfin,
requests, downloads, pinned services and the optional note. Members can select
game servers, pinned services and the note; media and queue disclosure retains
its existing owner-only boundary. Selected tiles are unique, ordered and bounded
to six, with at least one selected. Native buttons provide add/remove, up/down
and width controls with explicit Save, Cancel, Reset and revision conflicts.
Pointer dragging and arbitrary pixel dimensions are not part of this delivery.

The separate tiles-v1 GET/PUT API shares existing product/workspace/session/CSRF
admission. Rust rechecks the current account, role, key, generation and revision
under the existing authority lock. PostgreSQL repeats the vocabulary, dimension,
uniqueness and ownership constraints. Lost-save replies require a deliberate
read and comparison; no automatic PUT replay occurs. Reset uses server defaults.

Schema14 adds dashboard_tiles without rewriting notes, provider enrollment,
personal pins or the old three-panel layout. Legacy workspace-v1 responses and
the old layout API keep their shape for retained browsers. Role filtering never
grants provider access or silently rewrites an earlier owner's saved selection.

## Observation and browser ownership

Tiles summarize existing Rust provider observations and link to the sidebar
details. Home automatically reads its selected eligible tiles through bounded GET paths;
Refresh is optional. There is one resource owner and the existing authorization poller;
Home must not add provider polling loops or disguise a view transition to open
and close provider resources. Generic note/workspace snapshots perform no new
provider IO. Enrollment forms and credentials stay in their existing workflows.

Fresh, stale, partial, unknown, unavailable and valid-empty samples remain
distinct. A stopped Crafty controller or failed public request does not prove
managed sleep. Reborn has no lifecycle authority and no wake/start/stop, queue
mutation, request approval or game-controller transfer is added here.

Keyed tile identities, existing editors and account-scoped note/service drafts
survive intended navigation and arrangement. Focus follows a useful visible
target after a move. Hidden/blur, sign-out, generation changes and account changes
retain existing private-content clearing and late-response cancellation. Tile
edits participate in draft-safe refresh review and before-unload protection.
Another account cannot inherit private tiles, samples or drafts.

## Verification and recovery

Independent real HTTP/PostgreSQL checks cover validation, role/account scope,
revision races, revoked authority, legacy response shapes and schema13→14 data
preservation. Rust-driven Chromium workflows cover arrangement, draft/focus
preservation, conflict and uncertain saves, actual provider fixtures, privacy,
390px layout, keyboard, reduced motion and accessibility. Viewport emulation
does not establish native iPhone acceptance.

The packaged matched14 recovery proof restores two accounts' tile order/sizes,
then preserves newer edits through a failed candidate and disposable writer
restart. Old17/18 binaries cannot use schema14 current data. Preserve useful
stopped17 and matched final13; a prior dump never overwrites newer writes
automatically. Exact image, accepted-head/main CI and actual installation remain
separate receipts. The [finite asset policy](BROWSER_ASSET_RETENTION.md) preserves
23/18 browser bytes in the issue45 candidate, native startup recovery and deliberate note-draft recovery.

Rust continues to own domain rules, providers, permissions, persistence and
operational verification. Svelte/TypeScript owns browser presentation, interaction
and wire validation. SQL/CSS/HTML/manifests retain their native formats. No
production Node/Python backend or language-statistics override is introduced.
