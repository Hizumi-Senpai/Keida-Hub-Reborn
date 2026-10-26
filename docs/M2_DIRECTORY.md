# Service directory and personal pins

First M2 slice, tracked in issue10. Source and verification do not certify a
deployment. Reborn0.1.7 remains the live receipt baseline until an actual replacement
is qualified. Owner-reported login success is recorded separately in issue3.

## Workflow and authority

An owner adds, edits or removes up to100 named service links in Services. Each
link has a name (80UTF-8 bytes), category (40), description (240) and HTTPS URL
(1024). Fields reject controls and surrounding whitespace. URLs reject credentials,
query parameters, fragments, whitespace, backslashes and non-HTTPS schemes. A
deliberate LAN/private HTTPS destination is allowed. Rust never fetches these URLs;
this is a directory, not provider availability, discovery, a login broker or proxy.
Authenticated accounts can see all enrolled links. Links open in a separate tab
with noopener/noreferrer; no Hub cookie or reusable credential is forwarded.

Each account can pin up to24 unique services and reorder them with keyboard/touch
buttons. Home shows that account's pins in order; Services provides category and
text filtering. The same keyed service cards, note editor and owner service form
survive Home/Services navigation. Forms/search clear synchronously on workspace
privacy invalidation, and pending/late responses cannot repopulate another account.
Service-form edits are held only in the open page; they are not saved browser drafts.

## HTTP and persistence

The authenticated `/api/workspace/snapshot` gains an additive `directory` record:
global decimal-string revision, services, personal pin revision and ordered IDs.
Existing workspace-v1 note/Crafty fields keep their semantics. Existing clients do
not gain new directory mutations merely by receiving additional fields.

`PUT /api/owner/directory` takes `base_revision` and one tagged `change`: `create`
with a link, `update` with an existing ID/link, or `delete` with an existing ID.
`PUT /api/workspace/pins` takes `base_directory_revision`, `base_revision` and `ids`.
There is no account parameter: Rust derives it from the current admitted session.
Both endpoints require the workspace product/contract, loaded session CSRF and
exact Origin, with an8192-byte request limit and strict unknown-field rejection.

Writes recheck key, active account, generation, session expiry/revocation and owner
role where required while holding the existing authentication authority lock.
The global directory revision and per-account pin revision prevent stale overwrites.
Removing a service atomically removes affected pins and advances their revisions.
IDs are database identities and are not reused after deletion. Invalid/nonexistent
IDs, duplicate/excessive pins and stale revisions have explicit rejected outcomes.

The browser sends each deliberate change once. Timeout/unknown responses block
further changes until a successful authorized GET reconciles the saved state.
It never automatically retries PUT. Conflicting service edits remain in the form;
the owner reviews the current directory before rebasing and submitting again.

Migration0005 adds directory state/services/pins and advances strict schema admission
to5; accepted migrations0001–0004 remain byte-identical. The0.1.7 schema4 binary
refuses schema5, so previous-binary/current-data rollback is not qualified. Any live
replacement requires a fresh matched backup and isolated restoration preserving
auth, notes, encrypted Crafty connection, directory and pins; never overwrite newer
writes with an old backup. Older release-ledger manifests remain readable. Exact
0.1.7 and0.1.6 JS/CSS bytes are retained, but retention alone does not certify a
complete supported deployment/rollback client window.

## Verification and remaining scope

Focused native HTTP tests cover unsafe links, owner/member boundaries, independent
pins, persistence across application restart, concurrent edits, stale pin saves,
atomic deletion cleanup, contract/Origin/CSRF rejection and revoked sessions.
An actual schema4 upgrade preserves auth/session/note/encrypted-connection bytes.
The seventh Rust HTTPS browser workflow exercises enrollment, search/filtering,
pins/order, real card/form/editor lifetimes, a committed lost response without
replay, privacy clearing, account switches and desktop/narrow-viewport Axe.
Exact-image recovery additionally verifies directory/pin restoration and newer
pin changes after a failed candidate. Actual pass/failure receipts belong in PR/CI.

This slice does not finish M2: general dashboard arrangement, retained Activity,
paginated connection history and grouped per-user notifications remain future work.
Real Crafty enrollment, native Safari/iPhone, outside-LAN game joining, performance,
advanced old-client compatibility and host updater/game transfers retain their gates.
