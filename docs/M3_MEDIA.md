# M3: owner-only media observations

Scope frozen2026-10-27 America/Chicago. Baseline accepted/installed0.1.12,
main `ae171b0ef1aef1f2a5ccd486ef9c31b4bda05035`, schema9. This document
describes the implementation slice; source, artifact, installation and real
owner/provider acceptance remain separate gates in issues1/2.

## Useful workflow and privacy

An owner deliberately enrolls separate Jellyfin and Seerr access. The persistent
Media view displays bounded Jellyfin movie/series library rows and counts-only
recent playback, and Seerr request status rows with optional titles. There are
no request, approval, playback, download or game controls. No keys/configuration
are copied from another installation. Existing private notes, Home arrangement,
all eight navigation positions, forms and the single scheduler are preserved.

Media output is owner-only. Hub members have no mapped provider identity or
deliberately accepted sharing policy. API keys can grant administrator access:
GET-only behavior does not make a key read-only. Enrollment requires explicit
broad-access acknowledgement. Jellyfin enrollment also selects one library ID;
that query scope does not restrict the underlying key. No global playback user,
device, IP, watch title or requester identity is forwarded. Provider endpoints,
tokens, CA material, filesystem paths, raw provider IDs/payloads, artwork URLs
and arbitrary remote links never enter browser snapshots or general logs.

## Frozen first-slice contracts

- Closed provider IDs: `jellyfin`, `seerr`. Schema10 adds only
  `media_connections(provider, revision, sealed)` with exactly two initial
  unconfigured rows. Revisions persist across removal. Runtime may SELECT and
  UPDATE(revision,sealed), never INSERT/DELETE/provider-column UPDATE. No media
  events are mislabeled as Crafty Activity or shared notifications.
- Media encryption uses a separate media AEAD subkey/AAD domain, binding provider
  and revision. Existing Crafty envelope bytes/domains stay unchanged. Equal
  revisions cannot permit cross-provider ciphertext substitution.
- `GET /api/owner/media/{provider}` returns only `{revision,configured}`.
  `PUT` accepts `{base_revision,connection}`; connection is null for removal or
  `{endpoint,token,ca_pem,library_id,acknowledge_broad_access}`. Endpoint is an
  HTTPS origin with `/`, no userinfo/query/fragment; CA is empty or one valid PEM
  certificate. `library_id` is a lowercase32-hex or canonical lowercase UUID for
  Jellyfin and null for Seerr. Acknowledgement must be true. Ordinary workspace
  product/contract, CSRF/origin, owner/current session/key and canonical revision
  admission apply. Owner check precedes validation/encryption and is repeated
  under the shared authority lock at the write boundary. No secret readback.
- `GET /api/workspace/media/{provider}?offset=0` is owner-only, strict query
  parsing, canonical offsets0/12/24/36/48, page size12 and maximum60 displayed
  rows. It returns the ordinary product/contract/schema1/account/
  session_generation envelope plus `provider` and `observation`. Observation is
  `{revision,configured,checked_at,freshness,error,complete,offset,next_offset,
  total,truncated,items,playback}`. Revision is canonical decimal string;
  checked_at is nonnegative Unix seconds or null; freshness is fresh/stale/unknown;
  offsets/counts are integers, total is nullable0..1,000,000,000. Provider errors
  are null or checking/unavailable/invalid_configuration/timeout/transport/denied/
  provider_error/oversized/malformed. Unconfigured/checking/error is never empty
  success or a fabricated zero. Provider IO never enters workspace/note replies.
- Each item is `{id,title,kind,year,request_status,detail_error}`. ID is lowercase
  SHA256 of the provider's bounded stable ID, never raw ID. Kind movie/series;
  title nullable nonempty control-free UTF-8 up to240 bytes; year nullable1..9999.
  Request status null for Jellyfin, otherwise pending/approved/declined/failed/
  completed/unknown; detail_error uses the same allowlisted provider error set.
  Missing detail title remains null while a valid request row survives. Items
  and totals never imply an exhaustive/stable provider snapshot.
- Playback is null for Seerr; Jellyfin uses `{playing,paused,error}` with nullable
  counts0..256. Only sessions with NowPlayingItem are counted, and a missing/
  malformed IsPaused prevents exact counts. Valid empty session array is observed
  zero within the explicit120-second activity window. Bound the non-paginated
  response to256 sessions; over-bound/malformed remains unknown.
- Separate per-provider flights and at most five page slots each; cache keyed by
  provider/revision/offset,60-second refresh TTL, fresh through90 seconds then
  stale. A demand read starts a bounded background collection and returns cached
  data or checking promptly. No timer/background collection without demand.
  At most one flight per provider; a slow one cannot block the other. Absolute
  collection deadline4 seconds, connect600ms, each request1500ms, streamed body
  cap262144 bytes, no proxy/redirect, HTTPS hostname/trust validation. Seerr detail
  enrichment has maximum12 calls, concurrency at most3 and the same total
  deadline. Only GET is sent. Typed known fields reject duplicate JSON keys.
- Before disclosure, reacquire current authority and require active owner,
  matching key/session/generation and unchanged provider revision; changed
  enrollment discards cached/held results. No DB transaction spans provider IO.
  Browser reads use account/generation/epoch/serial admission, abort and flush
  private media on access or enrollment loss. Late responses cannot repopulate.
  Secret form values clear on submission, navigation, access loss and destruction;
  no secret drafts/storage or mutation replay. Lost replies require current-state
  reconciliation. Media sampling is deliberate open/refresh, without a new timer;
  pending samples may reconcile once through the existing scheduler.
- New guide clients explicitly send `X-Reborn-Guide: media-v1`. Without it, the
  endpoint retains the exact0.1.12 catalog/roadmap capability snapshot for the old
  strict parser. Unknown or duplicate capability values receive426. This extends
  guide capabilities without breaking supported loaded clients or their assets.

## Provider calls and primary references

Jellyfin: `Authorization: MediaBrowser Token="…"`; GET `/Items` with explicit
parentId, recursive=true, includeItemTypes=Movie,Series, startIndex/limit12,
enableUserData=false, enableImages=false, enableTotalRecordCount=true and bounded
sort; GET `/Sessions?activeWithinSeconds=120`. Do not use legacy X-Emby headers,
userinfo, API keys in query strings or pretend userId scopes an administrator key.

Seerr: `X-Api-Key`; GET `/api/v1/request` with take12/skip, filter=all, sort=added,
sortDirection=desc, mediaType=all. Optional bounded same-provider movie/{tmdbId}
or tv/{tmdbId} title enrichment; no direct TMDB API/key. Do not send X-API-User.
Only request status1..5 is mapped; do not use drifting media availability enums.

Primary sources reviewed:

- [Jellyfin ItemsController](https://github.com/jellyfin/jellyfin/blob/02c2951eb72d7282ff9e1c7610489edb924898c3/Jellyfin.Api/Controllers/ItemsController.cs)
- [Jellyfin authentication](https://github.com/jellyfin/jellyfin/blob/02c2951eb72d7282ff9e1c7610489edb924898c3/Jellyfin.Api/Auth/CustomAuthenticationHandler.cs)
- [Jellyfin SessionManager](https://github.com/jellyfin/jellyfin/blob/02c2951eb72d7282ff9e1c7610489edb924898c3/Emby.Server.Implementations/Session/SessionManager.cs)
- [Seerr request route](https://github.com/seerr-team/seerr/blob/84eae6727cbd57f280232ec3761b4878b513af98/server/routes/request.ts)
- [Seerr authentication](https://github.com/seerr-team/seerr/blob/84eae6727cbd57f280232ec3761b4878b513af98/server/middleware/auth.ts)

## Required evidence and recovery

Real HTTPS fixtures cover exact GET headers/query bounds, valid zero/empty,
missing/partial/duplicate/malformed/oversized/chunked/denied/timeout/redirect/TLS
responses, cache/concurrency and held enrollment/session/key races. Verify owner/
member/anonymous and contract/origin/CSRF boundaries, monotonic CAS/remove/re-enroll,
cross-provider envelope substitution, exact runtime grants and schema9→10.

Actual-current-data preservation includes all14 prior relations and4 sequence
states (including provider_observations and its ID sequence), migrations1–9,
matched key/config and expired-session rejection. Exact-image recovery restores
both encrypted enrollments with the matched key and obtains useful fixture media
observations; failed candidates preserve newer writes. Require pinned fmt/check/
Clippy-D/release/frontend builds, exact head/main CI, retained prior client assets,
Rust native/image browser desktop/390px/Axe media workflows and public verification
before claiming installation. Schema9 binaries cannot run10; preserve newer writes
through reviewed forward/manual recovery, never an automatic older dump restore.

Actual owner refresh and real Jellyfin/Seerr/Crafty credentials/TLS/library/privacy/
freshness acceptance remain open until separately exercised. Native Safari/iPhone,
performance, provider mutations, host updater and game transfer have no inferred
acceptance. M0/M1/full M2/M3 remain open.
