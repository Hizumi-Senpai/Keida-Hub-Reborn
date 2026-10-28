# M4.2 Personal session review and targeted sign-out

CORE scope frozen October28,2026 (America/Chicago), before application edits.
Accepted/installed baseline0.1.16/schema12 is
`bb1094922baa9197297bc749a31aa1d942801ba1`, tree
`ace0e5d6e0535caa4211b875075258726feba39f`.
[Exact baseline receipt](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1#issuecomment-6462653936).
Expected next application source0.1.17/schema13 remains unqualified until its own
head/main, image, recovery and installation receipts. Real Discord registration,
private enrollment, upstream callback-query privacy and owner acceptance remain
separate pending dependencies; they do not block this independent M4 slice.

## Useful workflow and limits

An authenticated owner or member can inspect only their own active Reborn
sessions and deliberately sign out one other session. The existing native
current-session and sign-out-everywhere controls remain available and unchanged.
Account activation, passwords, roles, generation, other accounts, Discord links
and provider configuration do not change when one other session is revoked.
No administrative device control, session history, invented device/browser/IP/
last-used metadata, new provider IO or credential synchronization is included.

The existing login authority caps active current-generation sessions at32 and
prunes expired/revoked/old-generation rows on login. Return a complete bounded
active list, not pagination or a history claim. A33-row overflow is unavailable,
never a truncated list presented as complete. Rows are newest-created first,
with stable UUID-descending ties. A snapshot is current at its checked time;
normal later login/expiry/sign-out may change the next result.

## Private selector and schema13

Add `sessions.public_ref uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE`.
PostgreSQL16 supplies this core function without an extension. Existing rows
receive fresh independent random v4 UUIDs. UUIDs select a row; they grant no
authority and never replace the bearer-hash verifier primary key or cookie.
Canonical wire IDs are36 ASCII lowercase characters in8-4-4-4-12 format,
version4/variant8,9,a,b. Reject alternate PostgreSQL spellings before casting.
Project `public_ref::text` and bind `$n::text::uuid`; no new UUID crate or SQLx
feature is needed. No dependency version change is part of this slice.

The migration adds only this selector/uniqueness and schema admission13. All
previous session columns and other domain data remain unchanged. UUID backfill
may rewrite the table, so migrate only under the normal Reborn write fence.
Old16 must refuse schema13 with readiness/auth503 and no data effects.

Remove the runtime's table-wide session INSERT/UPDATE grants. Grant SELECT and
DELETE for existing authority/cleanup, INSERT only on
`verifier,account_id,generation,created_at,expires_at`, UPDATE only on `revoked`.
Runtime cannot insert or update `public_ref`, move a session between accounts,
change expiry/generation/verifier or create schema/ledger objects. Defaults
remain migration-owned; all existing legitimate auth SQL must still work.

## Closed HTTP contract

GET `/api/workspace/sessions` uses the usual product/workspace contract, CSRF,
schema and current-session admission. Response uses the usual workspace envelope:

```text
product:"keida-hub-reborn", contract:"reborn-workspace-v1", schema:1,
account:{id,username,role}, session_generation:canonical-decimal-string,
checked_at:canonical-Unix-seconds-string,
sessions:[{id:canonical-UUID,created_at:Unix-seconds-string,
           expires_at:Unix-seconds-string,current:boolean}]
```

Only active, unrevoked, current-generation, unexpired rows for the authenticated
account appear. Exactly one row is `current:true` for the acting verifier.
Never return bearer/hash/verifier bytes, CSRF material, key IDs, password hashes,
request headers, other accounts' session references or uncollected metadata.
The list itself is not an authorization decision.

POST `/api/workspace/sessions/revoke` accepts exactly
`{"session_id":"canonical-UUID"}`. Require usual exact Origin, product,
workspace contract, session CSRF and current authority. Only a different active
session belonging to the acting account may be revoked. A current-session,
foreign, missing, pruned, already-revoked or expired selector returns the same
generic409 `conflict`, changes nothing and sets no auth cookies. Malformed
selectors/JSON return400 `invalid_request`. The current row's UI action uses the
existing native `/account/sign-out`, not this endpoint.

Success revokes only the selected row and returns the same freshly scoped list
envelope with `result:"signed_out"`. No new auth cookie is set or cleared by
this targeted endpoint. A repeated POST is409, not an automatic replay. An
interrupted/uncertain reply requires a fresh GET and a deliberate user choice;
the browser never retries a POST automatically.

Both endpoints perform no provider IO. Serialize mutation through the existing
auth singleton lock, verify instance key and current actor/session, lock the
owned target and sample time again after contended locks. Recheck acting expiry,
generation, revocation and activation immediately before effect/commit; a late
failed authority check rolls back. Never reuse `revoke_member` (deactivates an
account) or `revoke_all` (changes generation), or the logout cookie-clearing
wrapper. Concurrent unrelated new logins/sessions survive targeted sign-out.

## Browser entry and lifecycle

Preserve the eleven existing primary navigation positions. Add a clear
**Review sign-in sessions** action in the workspace Account area and a public
static link on the native Account document to `/workspace#sessions`.
The sessions view belongs to the existing persistent Svelte workspace. Native
Account HTML continues to contain no private account/session data; its existing
current/all native sign-out remains the low-dependency fallback.

On opening or explicitly checking, load a fresh scoped GET. Show creation and
expiry in America/Chicago, a server-computed **This session** badge and an
explicit sign-out control for each other row. Do not display UUIDs as personal
identity; keep them only as private action selectors. Current-row sign-out uses
the existing native form/CSRF/contract and immediate private-state retirement.
Explain bounded active snapshots, empty/unavailable/conflict/uncertain states
honestly. Keyboard, focus, accessible status and390px reflow must work.

Reuse the existing single15-second scheduler, scoped lifecycle epoch, serial
checks and abort behavior. No independent poller. Close, blur, hidden visibility,
pagehide, logout, revocation, account switch or incompatible identity clears
session rows/selection/private DOM immediately. Late responses cannot restore
old private data or apply to another account. Returning requires a fresh check.
Do not persist session lists/selectors in storage, drafts or logs. Existing note,
layout/provider form lifetimes and account-scoped recovery remain intact.

Retain all20 baseline workspace assets including the exact16 JS/CSS before
building the new hashed pair. Preserve all existing guide profile snapshots and
native account assets; this slice adds no guide-profile mutation.

## Qualification and installation

Require pinned Rust/frontend checks, genuine SQLx generation preserving existing
69 metadata records where SQL is unchanged, focused store/HTTP/race/privacy and
native plus exact-image browser workflows at head and accepted main. Exercise
owner/member separation,32-bound/overflow, target conflict/repeat/foreign/current
rejection, unchanged acting/third sessions and generations, actual targeted-token
401s, current native sign-out, lifecycle clearing/late replies and no secret wire
fields. Include expiry after a contended target lock and concurrent login/
global-revocation/key/session-authority races; no actual owner credentials.

Packaged13 recovery preserves UUIDs, targeted revocation, fresh/current session
use and newer session writes alongside all retained Discord/provider/domain
recovery flags. Actual-current12→13 must preserve18 prior relations, four
sequence values with `is_called`, complete ledger1–12, matching key/configuration
and all legacy session fields. Compare sessions by explicit old columns (or
remove only `public_ref` from its JSON) for the cross-schema fingerprint, then
prove fresh UUID uniqueness/stability separately. Full schema13 restores include
the new field. Rehearse final fenced matched12 restore before production13.
Retain useful16/matched12 recovery; never automatically restore an old dump over
newer writes. Retire older14/owned fixtures only after replacement qualification.

CORE alone integrates, publishes, installs and checkpoints. Use only refreshed
self-hosted Keida Remote Commander with new sealed/hash-verified complete audits,
operation locks and exact resource ownership. Do not reset/promote/login-replay
the real owner, copy Original credentials, restart protected services or activate
an updater/game transfer. Source/fixture/image/installation and actual owner/
provider acceptance remain distinct; full M0–M4 stay open.
