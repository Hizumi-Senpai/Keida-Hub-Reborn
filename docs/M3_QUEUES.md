# M3: owner-only queue and transfer observations

Frozen before application code,2026-10-27 America/Chicago. [Scope issue22](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/22). CORE continues the
owner's roadmap authorization through review, exact-head/main CI, authenticated
artifact, recovery and ordinary manual installation. Baseline accepted/installed
0.1.13 main02a7f321dd83b358da810085c563c963bdc6f3eb, treea134483871c37533f195248d5729df5f2fca678e,
schema10; [exact receipt](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1#issuecomment-6455928640).
Fresh host inventory23:25Z found healthy exact13, unchanged ownPG/network and
protected services/updater. Image labels identify Sonarr4.0.20.3014,
Radarr6.4.4.10685 and qBittorrent5.3.0. Labels are not real authenticated API acceptance.
No provider API, configuration or credential was read during inventory.

## Useful workflow and authority

- New **Queues** navigation entry follows the existing nine entries. An owner can
  deliberately enroll Sonarr/Radarr/qBittorrent access and inspect private bounded
  provider queue/transfer rows. Existing Media, notes/forms/focus, Home arrangement,
  private Activity/notifications/history and the one scheduler remain stable.
- Owner-only status/enrollment/observations. Members have no mapped provider identity
  or accepted sharing policy. No inherited keys, key rotation, provider-setting
  changes, login/password/Basic/cookie fallback, management controls or new jobs.
- Each global key may grant broad management authority. Explicit acknowledgement is
  required; GET-only behavior does not scope the key or promise no upstream auth
  bookkeeping. No download/request/approval/import/retry/pause/resume/priority/delete,
  game, listener, proxy or updater responsibility transfers.
- No provider IO in workspace/note replies, enrollment-state GET or DB transactions.
  No new activity/history table, provider notification or cross-provider identity map.

## Closed supported profiles and requests

Each provider has one explicitly enrolled fixed profile. Sonarr5/APIv5 beta and all
qBittorrent username/password/Basic/cookie/session-auth profiles are outside this slice.
Version mismatch stops collection before the queue, with no guessing or fallback.

| Provider | Profile | Version gate then bounded observation |
| --- | --- | --- |
| sonarr | sonarr-v3 | sensitive X-Api-Key; GET /api/v3/system/status, typed bounded version only, admit numeric four-part major4 (each part<=2147483647); GET /api/v3/queue?page=N&pageSize=12&sortKey=added&sortDirection=descending&includeUnknownSeriesItems=false&includeSeries=false&includeEpisode=false |
| radarr | radarr-v3 | sensitive X-Api-Key; same status endpoint, numeric four-part major6 (each part<=2147483647); GET /api/v3/queue?page=N&pageSize=12&sortKey=added&sortDirection=descending&includeUnknownMovieItems=false&includeMovie=false |
| qbittorrent | qbittorrent-v2-key | sensitive Authorization: Bearer key; GET /api/v2/app/version, plain text<=64bytes, admit stable v5.2.PATCH or v5.3.PATCH (canonical patch0..999999); GET /api/v2/torrents/info?filter=all&sort=added_on&reverse=true&limit=13&offset=OFFSET |

Send Accept:application/json for Arr. Status responses contain private paths/platform
details: typed-decode only version<=64ASCIIbytes, discard everything else without logging.
qBit version is plain text, not JSON; reject suffixes/HTML/JSON/unknown minor before info.
Do not confuse API-key introduction WebAPI2.14.1 with exact5.2.0/API2.15.1 or5.3.0/API2.16.2.
Only fixed root-mounted HTTPS origins are admitted; URLBase/subpath installs are not
covered. Endpoint<=512ASCIIgraphicbytes, no userinfo/path/query/fragment; normal hostname
and trust verification; optional single valid CA<=8192bytes; nonempty graphic token<=8192.
No proxy, redirects, insecure fallback, browser-cookie forwarding or secret URLs.
Version+queue share one absolute4second deadline; connect600ms/request1500ms,
streamed response cap262144bytes (qBit version64bytes), no retry on429 or auth errors.
Bounds constrain Reborn/network work, not the provider's internal queue-generation cost.

## Paging and strict normalization

Only canonical offsets0/12/24/36/48;12 visible rows/page, at most first60. Arr N=offset/12+1.
Arr responses must have page/pageSize12/sortKey added/sortDirection descending/
totalRecords integer0..1,000,000,000/nonnull records<=12 matching the requested page and
expected row count. A different returned page is page_moved with no rows/next/total;
never append/relabel the provider's rebased page. Other inconsistent metadata is malformed.
Arr total is that provider's filtered queue, including pending/delayed releases after
the unknown-tracked-item filter. It is not active downloader count or downloader health.
next_offset advances by12 within48; truncated is true when total>60.

qBit returns at most13 rows for lookahead, exposes12, next_offset advances by12 only
with lookahead and within48. At offset48 a13th row establishes truncated=true. total
is always null: no filtered count is supplied and no extra count endpoint is called.
This is an all-state Transfers view, not only active downloads. No category/tag/hash,
includeFiles/includeTrackers or other extra query is sent. Missing totals, stopped/error,
metadata-pending and zero rates do not prove no work/health/completion. False truncated
does not establish an exhaustive inventory. Pages can move as live providers change;
the UI displays one page rather than accumulating a purported historical cursor.

Every item has exactly these projected fields:

- id:64lowercasehex, SHA256 domain/provider/profile/revision/raw identity scoped;
  Arr id is int31 **including0**, qBit primary hash exactly40lowercasehex. No raw ID
  or hash is returned. Duplicate/ambiguous IDs within the entire response are malformed,
  not silently merged (Arr IDs are provider hashes, not guaranteed unique database IDs).
- title: nullable clean nonempty plain text<=240UTF8bytes; missing/invalid title is
  null and makes the sample incomplete. No arbitrary links/HTML are rendered.
- status: closed provider allowlist below; future/unreported values become unknown
  and incomplete. import_state is nullable Arr tracked state, null/not-applicable for qBit.
- warning: nullable boolean; Arr trackedDownloadStatus ok=>false, warning/error=>true,
  unknown/missing=>null+incomplete. qBit error/missingFiles=>true, other known states=>false,
  unknown=>null+incomplete. No provider error/status message text is exposed.
- progress_basis_points: nullable integer0..10000, explicit floor(10000*completed/size)
  using checked u128 intermediates. Arr completed=size-sizeleft. qBit uses completed and
  size (current wanted/selected bytes), never its raw progress field (which may be
  checking progress hidden even behind stopped/moving/error states). For qBit has_metadata must
  be true; for either provider size>0 and0<=completed<=size. Zero-size/metadata-pending =>null, never0%/100%.
- size_bytes: nullable nonnegative whole value<=2^53-1; qBit requires has_metadata=true.
- download_bytes_per_second/upload_bytes_per_second: nullable nonnegative whole values
  <=2^53-1 for qBit; null/not-applicable for Arr. Explicit0 is valid, missing is unknown.

Use lossless bounded numeric lexemes from the existing pinned serde_json raw_value
feature (no new package/version/runtime): accept exact whole JSON numeric values,
including integral decimal/exponent forms, only if<=2^53-1. Numeric lexemes are capped
at64bytes and exponent absolute value32; integral values use checked u128 arithmetic. Reject fractional, negative,
overbound, wrong-type or excessive numeric lexemes to null/incomplete, never round/clamp
them into known bytes. Appropriate missing/inconsistent quantities make progress null;
not-applicable fields alone do not make a valid provider sample incomplete. Output
progress is a deliberately floored estimate at0.01% precision, not import/verification/
playback proof. Do not decode/expose qBit amount_left/total_size/raw progress as another
denominator, nor ETA/sentinel estimates in this slice.

Arr status allowlist: unknown,queued,paused,downloading,completed,failed,warning,delay,
downloadClientUnavailable,fallback. Arr import states: downloading,importBlocked,
importPending,importing,imported,failedPending,failed,ignored; unrecognized values=>unknown/incomplete; an unreported applicable state is null/incomplete.
qBit status allowlist: error,missingFiles,uploading,stoppedUP,queuedUP,stalledUP,checkingUP,
forcedUP,downloading,metaDL,forcedMetaDL,stoppedDL,queuedDL,stalledDL,checkingDL,forcedDL,
checkingResumeData,moving,unknown. Old pausedUP/pausedDL are not silently treated as
current5.2/5.3 states. Typed known fields reject duplicates; whole malformed/oversized
JSON is unavailable, never observed-empty. Do not forward raw objects, expanded media,
filesystem paths, downloader/indexer names, source/magnet/download/artwork URLs,
requester/device/peer/IP identities, trackers/passkeys, tags/categories or error strings.

## Authority, wire, storage and browser

Separate queues module and queue_connections relation; do not widen media_connections.
Schema11 fixes exactly3 provider rows. Runtime SELECT and UPDATE(revision,sealed) only,
never INSERT/DELETE/provider-column UPDATE. Revisions survive removal and use canonical
nonnegative decimal strings/i64 bounds. Queue envelope format3 uses separate subkey/AAD
binding provider+fixed profile+revision; existing Media format2 and Crafty remain readable.

GET/PUT /api/owner/queues/{provider}: current owner status only
{revision,configured,profile}. PUT {base_revision,connection}, where connection is
{endpoint,token,ca_pem,profile,acknowledge_broad_access}; missing connection is rejected,
explicit null removes it. Enrollment validation requires exactly the matching profile
and true broad-access acknowledgement. Lost reply reconciles by status GET, no PUT replay.
Current key/session/generation/active owner and CAS revision are checked at actual commit.

GET /api/workspace/queues/{provider}?offset=0 uses the current product/workspace contract
and owner admission before decryption/IO. Return envelope product/contract/schema1/account/
session_generation/provider/observation. Observation fields are revision,configured,
profile,checked_at,freshness,error,complete,offset,next_offset,total,truncated,items.
freshness is fresh/stale/unknown, recent collection<=90sec, future/missing time unknown.
Errors are null or checking,timeout,transport,denied,rate_limited,provider_error,oversized,
malformed,unsupported_profile,page_moved,unavailable. No raw failure text.
No connection =>configured=false/unknown/checked_at null/total null/empty, not observed-zero.
Valid partial normalized rows may be recent but incomplete; failed reads are never
successfully empty.401/403=>denied,429=>rate_limited,404/405=>unsupported_profile,
other non-success=>provider_error; no retry or redirect following.

Demand observer has one flight/provider and at most5 pages/provider for current revision;
60sec TTL, revision/profile/page-isolated cache, no old-revision completion overwrites
new state, no DB transaction during IO. Recheck current owner/key/session/generation/
revision after observation and before disclosure. Separate flights prevent one provider
blocking another. UI reuses the existing scheduler only for local aging and bounded
pending-check reconciliation while active; no ongoing successful-sample provider polling.
Preserve requested page through pending reads. Disable observation/paging controls during
their read, keep Check connection state for explicit abort/reconciliation. Native secret
forms clear on submit/navigation/access loss/destroy; no local/session storage or replay.
Scope all private replies/late completion by product/account/generation/epoch/serial.

New guide admission X-Reborn-Guide:queues-v1 reports6available entries. Preserve exact
no-header0.1.12 guide and media-v1/0.1.13 guide snapshots (7entries,1/3available respectively),
with unknown/duplicate capabilities426. Preserve all9 prior navigation positions and
exact0.1.13 assets; expected18embedded assets after build, verified from actual bytes.

## Required proof and preserved operational boundaries

Native real TLS fixtures cover exact headers/two GET paths, version admission before
queue, both qBit5.2/5.3, Arr pending rows/id0/rebased pages, qBit lookahead/total-null/
selected-byte progress (contradict raw progress), precision/null/empty/unknown/warning,
duplicates/malformed/body caps (declared and genuine chunked)/HTML/TLS/redirect/denied/
429/timeout, private-field exclusion, independent flights/cache/revision races.
Real HTTP/PG tests cover role/contract/CSRF/origin/session/generation/key/CAS races,
removal/re-enrollment/cross-domain ciphertext and actual restricted role grants.
Native and exact-image Rust browser desktop/390px/Axe workflows preserve existing forms,
drafts/focus/layout/navigation, real enrollment, paging/page-moved/unknown/empty/partial,
lost enrollment reply without replay, stale aging without new IO and revoked/late privacy.

Packaged recovery adds restored_queue_connections_and_observations:true only after
actual fresh fake-provider enrollment and matched restore/re-observation; retain all
existing flags and test newer queue-enrollment writes after failed candidate. Actual
current10→11 and final fenced matched restore preserve **15prior relations including
media_connections/four sequence states with is_called/migrations1–10/key/configuration**.
Never copy the old14-relation schema9 fingerprint. Schema10 binaries refuse11; preserve
newer writes through reviewed forward/manual recovery, never automatic older-dump restore.
Exact eventual-head/main CI, authenticated accepted artifact, host image/recovery,
current-data qualification and exact public verification precede manual cutover.

CORE alone integrates/merges/deploys/shared checkpoints. Keep Original, Rewrite,
nginx/tunnel/Crafty/Jellyfin/Seerr/Sonarr/Radarr/qBit and all existing workers untouched;
no secret discovery, provider API calls with inherited credentials, service restarts,
Docker socket, automatic updater or game transfer. Real deliberate owner/provider/TLS/
privacy/freshness acceptance remains separate; M0/M1/full M2/M3 stay open.

Primary source basis: Sonarr/Sonarr cab419ade8ac7fcab5bf80394ee492abd35d5f5a;
Radarr/Radarr a96bf7c3ecb23cb76993770727285dc17a613fbc;
qbittorrent/qBittorrent5.2.0 b2270f7f6fec1b10117564f642b961621ae0058a,
5.3.0 9213075dd5f7b352208361c6a84c1c115efc898e; official queue/system/App controllers,
serialization/TorrentImpl and HashConverter sources. Exact links are retained in
the primary-source research/review and source documentation. No provider acceptance
is inherited from source documentation or image labels.
