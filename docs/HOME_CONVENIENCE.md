# Convenient Home and confirmed managed sleep

Issue45 is the owner's follow-up to installed23. Successful native or enhanced
claim/sign-in redirects to `/workspace`, whose initial view is Home. Account
settings stay available from the sidebar. There is no arbitrary return URL.
Draft-safe Review refresh still protects unfinished work in an already-open tab;
a fresh sign-in needs no second Workspace click.

## Automatic selected reads

The existing visible-workspace resource owner reads selected Home tiles at entry
and on its existing15-second access cadence. There is no second polling timer.
Reorder does not reopen resources. Removing a tile, leaving Home, hiding the tab,
logout, revocation or generation/account changes abort or invalidate its late
reads. Owner-only media/queue rules stay unchanged; games remain member-readable.
Enrollment saves, uncertain writes and no-PUT-replay rules retain their authority.
The Refresh button remains optional; no enrollment or control request is automatic.

## Rust game status

`GET /api/workspace/games` uses the existing product/workspace/session/CSRF/schema
admission and current Crafty enrollment. It contacts only host-reviewed routes
whose server IDs are selected in that enrollment. It holds no database transaction
over network IO, then rechecks current key/session/role/enrollment before disclosure.
It returns only ordered public names, join addresses and bounded typed status.
Legacy workspace/note snapshots and the Crafty DTO retain their existing shapes.

Optional `game-routes.json` sits beside `instance.key` with the same strict private
file reader. The closed format is `{"format":1,"endpoint":"IP:port","routes":[{"server_id":"UUID","hostname":"public.example","public_port":25570}]}`.
It contains public metadata, no provider credentials. Missing file sends nothing;
invalid file fails startup. At most8 unique routes and16KiB are admitted.
Changes require a qualified scoped operator action, not a browser override.

The Rust client sends one Minecraft handshake with protocol767 and next-state1,
then one status request. It never sends login, ping, wake, provider writes or
lifecycle commands. Each route has a total1200ms deadline and64KiB reply bound.
A single-flight cache lasts15seconds. Missing, malformed, expired or unavailable
evidence never proves sleep or zero players. Counts from synthetic sleep/start/
update responses are discarded. Browser freshness independently expires after45s.

The existing gateway's explicit `Sleeping • Join to wake`, `Waking up` and
`Updating modpack` responses produce simple Home labels. Actual online responses
may include real reported player counts. Technical provider diagnostics remain
in the detailed Connections view. Reborn gains no game-control ownership.

Four existing Original routes have wake-on-join metadata. AR:T has no configured
join route; Home must not promise that joining will wake it. Original's private
status/database/key files are never mounted into Reborn or changed by this work.

## Qualification and recovery

Require actual literal-wire TCP tests (including no extra/login packet), authority
and revision-race HTTP tests, native automatic-loading/landing/hidden-resource
browser checks, desktop/mobile fictional image review, all eventual-head/main CI
and exact-image checks. Actual gateway queries need fresh audited host identity,
the permanent operation lock and before/after protected process/service evidence.
Normal user joins/wake acceptance remains separate and must not be manufactured.

No schema changes from current14. Rehearse the candidate and compatible23 rollback
against an isolated current14/key copy and newer writes before installation.
Backup/index the optional route metadata with the existing matched recovery
packet. Retain old17/18/final13; those binaries cannot serve current14 data.
The finite browser window is current/23/18, with actual17 bootstrap-file removal.
Host-updater installation/activation still requires its separate complete packet.
