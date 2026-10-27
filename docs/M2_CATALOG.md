# Integration catalog, provider history and Roadmap note

Frozen scope: [issue18](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/18).
Baseline0.1.11/schema8; this source slice adds schema9. Source, CI, artifact,
installation and real-owner/provider acceptance are recorded separately.

## User workflows

Integrations revisits a fixed Rust-owned catalog: Crafty is available, while
Jellyfin, Seerr, Sonarr, Radarr, qBittorrent and Discord are planned. Requirements
and capabilities are explicit. Only the implemented Crafty entry leads to existing
Connections; a catalog entry installs no provider, controller or updater.

Roadmap is a dedicated read-only work-list note shipped with the build, dated and
linked to the authoritative GitHub tracker. It covers M0–M8 and the next priorities
without claiming milestone completion or automatic live synchronization. The
existing private workspace note, draft and all three Home layout IDs are preserved.

Connections separates enrollment Activity from retained provider observations.
Historical player counts may be zero or unavailable; unknown never becomes zero.
Freshness describes the provider timestamp at collection. The retained sample is
not current status, game readiness, an uptime measurement or maintenance evidence.

## Persistence and authority

Actual demand-driven Crafty collections receive a private random16-byte identity,
retained with cached results and never serialized to clients. History records only
the first admitted sample per connection revision/minute and keeps the latest
10,000 collection batches. There is no continuous background collector. Gaps have
no implied meaning; retention can shorten an already opened older page window.

Two normalized PostgreSQL relations store collection revision/time/allowlisted
outcome and up to8 reviewed display names with state, nullable counts, timestamps,
collection freshness and allowlisted errors. Endpoint, token, CA, server UUID,
join address, player identities and raw provider bodies are excluded. Migration9
does not backfill older observations or change prior data/migrations.

Provider IO holds no database transaction. The existing singleton authority lock
then rechecks key, active account, current session/generation/expiry/revocation and
exact configured connection revision before retaining the result. Obsolete results
are discarded. Cached/concurrent reads cannot create duplicate history batches;
checking and unconfigured responses create no observation. Sampling emits no
Activity or notification events and touches no private note/layout.

History GET performs no provider IO or history writes. Owners may read retained
previous revisions; members see only the current configured revision and nothing
after removal. Strict canonical revision/through/before cursors give fixed25-entry
keyset pages, a captured upper window and deliberate newest refresh. Enrollment
changes reject an old revision cursor. Guide/history responses bind current
product, interface, account, role and session generation and use no-store.

Only observation headers receive runtime DELETE authority, solely for bounded
retention; child rows cascade. Observation UPDATE is denied. Activity remains
append-only and notification/layout deletion remains denied.

## Browser and verification

The existing six navigation positions remain; Integrations and Roadmap follow.
New requests have bounded deadlines, current scope/revision admission, cancellation
and late-reply rejection. Auth/visibility/scope loss clears private results and
inputs. Existing component/form lifetimes, unsaved note drafts and the single15s
workspace poller are preserved.

Require real PostgreSQL/HTTP/TLS tests for normalized failure/zero/unknown behavior,
deduplication, retention, stable pagination, enrollment/revocation races, member
disclosure and unchanged prior state. Actual desktop/390px Rust HTTPS browser
workflows cover guide/history and privacy without production fixtures. Packaged
recovery must restore observations and preserve newer observations plus private
state after a failed candidate. Pinned native/frontend checks and exact-head/main
CI, exact-image verification and actual-current-data recovery gate manual deployment.

Schema8 binaries cannot run9. Keep current data/newer writes and use reviewed
forward/manual recovery; an old backup never automatically replaces newer writes.
Real Crafty credentials/TLS/scope/join and actual-owner acceptance remain separate.
