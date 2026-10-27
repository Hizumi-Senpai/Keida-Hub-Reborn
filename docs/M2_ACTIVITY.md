# Retained private Activity

Source contract for [issue12](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/12).
This is a new source slice after installed0.1.8. Source, exact-image qualification,
installation and actual owner/provider acceptance remain distinct.

Rust appends one allowlisted event in the same transaction as a successful note,
pin, directory or dedicated Crafty enrollment change. Failure to append aborts the
related write. Conflicts, rejected requests, provider GETs and ordinary reads create
no events. This is a record of local successful changes, not game operations,
provider uptime or a complete security audit. No historical events are fabricated.

Each row belongs to its authenticated acting account and contains only an ID,
allowlisted action, domain revision and server time. No note content, service name,
URL, provider endpoint, credential, raw error or provider response is stored.
Directory actions are visible in their actor's own history; other accounts' pin
cleanup after a service deletion does not pretend those accounts submitted a save.
Rows persist without automatic expiration, cascade only with account deletion,
and ordinary runtime grants allow SELECT/INSERT, never UPDATE/DELETE.

`GET /api/workspace/activity` requires the current workspace product/contract and
loaded session CSRF. Rust rechecks key/account/generation/role/session admission
under the existing authentication authority lock. There is no account parameter.
Responses are no-store, carry account scope and contain at most25 entries plus
`through` and optional `next_before`. A page fetches26 rows to determine whether
another page exists. IDs order accepted transaction commits because the existing
auth singleton lock serializes these writes; time is display metadata, not order.

Optional `category` is `all`, `workspace`, `directory` or `connections`. `q` is at
most80 UTF-8 bytes without controls and performs case-insensitive literal search
of Rust-owned action names. SQL wildcards have no special meaning. Unknown query
fields and duplicate/malformed fields fail with a sanitized invalid-request result.
`through` is the history upper ID captured on the first page; `before` is the last
shown ID, required to be positive and no greater than `through`. A cursor does not
grant authority and guessing another account's IDs never removes the account SQL
predicate. New events do not shift a selected older-page window. Check newest
starts a fresh window. Changing search/category also starts a fresh window.

One persistent Svelte Activity view owns presentation. It replaces each25-entry
page rather than growing an unbounded client cache. Search/filter/window data stay
only in memory; no subscription/polling writer or provider call is introduced.
Every request has a four-second deadline and serial/epoch/cancellation fences.
Auth/scope change, visibility loss or workspace disposal clears private results
and inputs synchronously; a late result cannot repopulate them. A failed Activity
read offers deliberate retry without disabling notes or Services. View navigation
preserves the existing editor and directory entities. Connections links to the
same Activity view with its connection-enrollment filter.

Migration0006 adds the append-only event relation and strict schema6 admission.
Accepted migrations1–5 remain byte-identical. A schema5 binary refuses schema6;
no prior-binary/current-data rollback is qualified. Current data, key/config,
events and newer entries need matched isolated recovery before live replacement.
Exact0.1.8/0.1.7/0.1.6 JS/CSS are retained under their content hashes; retention
alone does not certify a future lazy-renderer/rollback compatibility window.

Native PostgreSQL/HTTP checks cover transaction failure, failed writes, paging
under concurrent new saves, literal search, account isolation, revocation, restart
and schema5 upgrade. Rust HTTPS browser workflows and packaged restoration must
qualify the exact eventual head/main image before installation. Real owner mobile,
Crafty enrollment/TLS and game joining remain separate. Grouped notifications,
provider-observation history and dashboard arrangement remain future M2 slices.
