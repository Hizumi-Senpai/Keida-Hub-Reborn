# M5.2 host-updater contract

Frozen preparation scope: [issue31](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/31),
October 28, 2026, America/Chicago. This is a contract for an implementation to be
reviewed, not an implemented updater or permission to install it. Read the
[concrete bootstrap review](M5_UPDATER_BOOTSTRAP_REVIEW.md),
[update policy](UPDATES.md), [deployment contract](DEPLOYMENT.md),
[ownership](OWNERSHIP.md) and [installed18 handoff](HANDOFF.md) together.

Accepted main and the running application remain **0.1.18/schema13**, source
`697699187aca6780d8ba7b199dc2ba90b033bd67`. The six-file handoff is carried into
this preparation PR. No new accepted ordinal, application artifact, published
channel, installation, activation or completed milestone is claimed here.
There is no host-updater source or binary to approve yet. Actual candidate source,
binary/digest, launcher and isolated failure/recovery receipts must complete the
bootstrap packet before requesting separate installation/activation approval.

## First activation profile

The first candidate is a pinned Rust1.99.1 **request-driven, one-shot host tool**.
It replaces only the independently owned Reborn application, with a qualified
schema13-to-schema13 target and compatible-current-data recovery. A root operator
supplies one sealed request and its expected digest. A process handles that
request, writes a durable result and exits. Installing that tool grants no standing
permission to select releases or replace the server without a separately admitted
request.

There is no daemon, timer, reboot autorun, release polling, HTTP/socket listener,
browser command endpoint, automatic download or automatic target selection in this
profile. The web application gets neither a Docker socket nor a worker/configuration
mount. It cannot enqueue updater requests. Existing host/game updaters retain
their owners. This profile does not migrate PostgreSQL, change grants, rotate
keys/credentials, enroll providers, modify routing, restart protected services or
transfer game/proxy responsibilities. Schema-changing and PostgreSQL-major
upgrades require another contract.

Reborn can be temporarily unavailable while its one writer is fenced. Availability
does not justify two old/new application writers on production data. Owner desktop,
mobile and refresh acceptance, real provider/Discord acceptance and whole M5
acceptance remain separate open gates.

## Existing source and reuse boundary

The accepted18 tools below are manual CORE tooling. These SHA256 values describe
reviewed source files, not a future updater binary.

| Source | SHA256 |
| --- | --- |
| `tools/release/src/main.rs` | `909a98bbd4138c35d8d4a815f6ffd062377bf0f4db1b048c43558a204b3d1c9d` |
| `tools/release/src/image.rs` | `f9b951336022746bef9ff1d4ffe64e8a32b72bd5676c320cbffe8beda6fcee30` |
| `tools/release/src/recovery.rs` | `097c4e618441d246479f9c7fd4c558e723bc6084fa4f3a31ad3f8e1b566daaa3` |
| `tools/source-identity/src/lib.rs` | `03485ea2b40f727fff5bc8d503756abbeb98ba6bba96e0b3acb006981e7eebc2` |
| `.github/workflows/foundation.yml` | `35ee207eac231f75d6e8114725204acb604b69b43c9ac1eb240f718f7f62f39a` |

`reborn-source-identity` checks clean full-history Git facts and deterministic
identity; it does not authenticate artifacts or install anything. `reborn-release`
supports `inspect-image`, `rehearse-image`, `publish` and `verify`. Its format1
manifest binds product/version/ordinal/source/tree, workspace contract/schema,
image/binary/archive/execution hashes, CI run and assets. It has no authenticated
artifact-ID/ZIP-digest envelope, signature, compatibility range, host-target policy
or host-operation journal.

`publish` verifies accepted source, a fresh main/protected observation and the
exact successful main workflow/job/steps. Its caller must independently authenticate
the CI artifact and compare archive/image/binary/assets. `verify` rehashes the stored
archive and parses the manifest; it does not establish publisher trust. The existing
local ledger is trusted only through that reviewed CORE admission boundary. No
updater may accept an arbitrary manifest merely because `verify` succeeds.

The publisher's private `publication.lock` directory is distinct from the Reborn
application operation lock. A crash can leave that directory, `channel.new`, or a
published release with an older channel. Inspect/reconcile such states; never
automatically delete them or rewrite a release to make an update proceed. The
updater does not publish releases or advance `channel.json`.

## Fixed installation policy and local artifact trust

The bootstrap packet must bind one installation ID to a root-owned immutable policy.
It assigns exact canonical paths for the candidate binary, request/admission inbox,
plans, operation journal, private recovery sets and sanitized status. Those paths
are constants of the reviewed policy; requests cannot supply alternate roots,
Docker arguments, shell text, URLs, credentials or executable hooks. The policy
also binds the exact Reborn app/PG/network resources, allowed listener, configuration
mounts, resource/security settings and protected-service/process inventory. The
bootstrap review records current facts separately from proposed allocations.

The existing application operation lock is
`/mnt/cache/appdata/keida-hub-reborn/operation.lock`. CORE manual operations and the
future tool must use this same held lock. The updater has no right to replace or
unlink it. Host root is a trusted administration boundary; a root-capable updater
can technically exceed its policy, so this is not advertised as OS-enforced
Docker privilege separation. Review its actual fixed operations and executable
identity accordingly. Private state directories are root0700; sealed admission,
request and audit files are root0400 with one link. Secrets never enter public
status or ordinary diagnostics.

For each target, CORE creates a new immutable local admission envelope only after:

1. Authenticating the exact successful accepted-main CI artifact through the
   connected GitHub artifact service, with a fresh download grant. Record repository,
   run, attempt, workflow, job/step qualification, artifact ID/size and ZIP digest.
2. Verifying the downloaded ZIP digest and original contained archive/proofs, then
   comparing the loaded image ID, packaged binary checksum, compiled full identity,
   image labels, workspace contract/schema and all immutable browser assets.
3. Verifying full-history source identity and current main governance. A branch's
   boolean `protected` value alone is insufficient governance evidence. An older
   accepted target must retain its original identity and its original qualified
   artifact; rebuilding it cannot replace create-once bytes.
4. Binding the immutable release manifest hash and archive hash, exact target
   image/binary/assets, Linux architecture, supported schema13/contract profile,
   current-data compatibility and packaged/browser/recovery receipts. Include the
   reviewed qualification execution hash and admission-policy revision.
5. Sealing the complete envelope with a recorded SHA256 under the private admitted
   root. No signer claim is implied: trust is the authenticated CORE admission plus
   local root ownership and the reviewed sealed execution chain.

The envelope names only an existing local immutable ledger entry. The tool opens
that entry through verified directory/file descriptors, rejects symlinks/hardlinks,
checks ownership/modes/type/size, and verifies hashes of the bytes it will consume.
It retains the admitted descriptors through the dependent read/load boundary;
path re-resolution cannot substitute different bytes. Original authenticated
archives are preserved even when Docker reserialization yields a different tar
checksum. Image ID, tar checksum, binary checksum and source identity remain
different facts. A missing/expired artifact or missing qualification is refusal,
not permission to rebuild/relabel a prior release.

## Operations and exact request format

All commands use a bounded UTF-8 JSON object, maximum **16,384 bytes**. Parse before
effects with duplicate keys and unknown fields rejected. Fields below are required
exactly for their command; no optional extension bag exists. Strings use the listed
ASCII grammar. No secret is a request field.

Every request has these fields in this canonical order:

| Field | Required value/bound |
| --- | --- |
| `format` | JSON integer `1` |
| `product` | `keida-hub-reborn` |
| `installation_id` | 32 lowercase hexadecimal characters, fixed at bootstrap |
| `command` | One of `inspect`, `status`, `prepare`, `apply`, `reconcile`, `rollback` |

Command-specific fields follow in the order shown:

| Command | Additional fields and meaning |
| --- | --- |
| `inspect` | None. Bounded fresh inventory and comparison with policy; no application, database, release or journal writes. Its private execution audit is still retained. |
| `status` | `operation_id`: 32 lowercase hex, or the literal `current`. Reads the last committed sanitized status/journal projection; it does not probe, reconcile or imply freshness. |
| `prepare` | `plan_id`: 32 lowercase hex; `expected_generation`: positive u64; `expected_installed_sha256`, `policy_sha256`, `inventory_sha256`, `admission_sha256`: each 64 lowercase hex. Creates an immutable plan and preparation receipt after admission and isolated validation, without changing production. |
| `apply` | `operation_id`: 32 lowercase hex; `expected_generation`: positive u64; `expected_installed_sha256`, `policy_sha256`, `inventory_sha256`, `prepared_receipt_sha256`: each 64 lowercase hex. Explicitly admits replacement using exactly that prepared plan. |
| `reconcile` | `operation_id`: 32 lowercase hex; `expected_request_sha256`: 64 lowercase hex. Inspects actual effects for that operation and appends an observed disposition. It cannot replay commands, restart a writer, release a fence or perform a rollback. |
| `rollback` | Same fields/order as `apply`. The prepared receipt must explicitly qualify the selected useful prior binary with CURRENT schema13 data. It is a new admitted operation, never a channel reversal or database restore. |

Canonical bytes are the compact JSON object with the exact field order above, one
ASCII double-quoted representation per string with no escapes, decimal integers
without leading zero/exponent/sign, no whitespace and no trailing newline. A
`request_sha256` is SHA256 of those canonical bytes; it is an externally supplied
launch binding and journal field, not a field hashed into itself. The file's original
bytes must equal that canonical encoding. Refuse another encoding rather than
silently normalize it. An implementation must publish literal protocol fixtures
before claiming the format is supported.

`expected_installed_sha256` binds a canonical installed binding record, maximum
4,096 bytes, using the same byte rules and exactly these fields in this order:

| Field | Required value/bound |
| --- | --- |
| `format`, `product`, `installation_id` | Same values as the request |
| `generation` | Positive u64, equal to request `expected_generation` |
| `version`, `ordinal` | `0.1.N` and positive u64 `N`, matching the qualified accepted source |
| `commit`, `tree` | Each 40 lowercase hex |
| `channel` | `accepted` |
| `image_id` | `sha256:` followed by 64 lowercase hex |
| `manifest_sha256`, `binary_sha256` | Each 64 lowercase hex |
| `database_schema`, `workspace_contract` | Integer `13`, then `reborn-workspace-v1` |
| `container_id` | 64 lowercase hex |
| `container_started_at` | UTC `YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ`, valid timestamp with exactly nine fractional digits |

This binding is a new protocol record derived from verified installed evidence;
it does not reinterpret or overwrite existing manual `installed.json` formats.
Bootstrap must adopt one installed-generation authority before effects, retaining
the raw manual record and its hash as historical evidence. A manual operator must
use that same authority and application lock afterward; a second independent
installed selector is prohibited. The bootstrap packet must identify the exact
adoption location and readers before activation.
`inventory_sha256` binds the full private policy comparison snapshot and protected
process births, not arbitrary Docker inspect output or an assumed historical
baseline. Comparison bytes omit observation timestamps and volatile utilization
counters, which are separately recorded in the receipt. Both records are bounded,
secret-free and read through verified descriptors. A policy/inventory/installed
mismatch blocks the dependent effect and requires fresh review and preparation.

Plan IDs and operation IDs use different namespaces. Repeating identical `prepare`
bytes for one plan returns its existing receipt; a different hash under that ID
refuses. Repeating identical `apply`/`rollback` bytes for one operation returns
current status; it never dispatches again. Another request hash, including another
command, under the same operation ID refuses. An explicit `reconcile` addresses
the original operation rather than allocating another effect identity. Do not
reuse a preparation ID as an effect operation ID.

Only operator-admitted `apply`/`rollback` changes production. `prepare` may allocate
isolated resources exclusively named in its durable fixture ledger, capture a
preliminary consistent read backup and rehearse current-data compatibility. That
does not fence production or qualify the final stopped-writer recovery set.
It must not hold a database transaction across external work or invoke real
providers. Status output distinguishes available/admitted/prepared/installed and
loaded-client/owner acceptance; it cannot collapse them into "updated".
For a changed target, `apply` admits a greater accepted ordinal; only `rollback`
admits the exact useful prior target named in policy and its current-data proof.
An exactly matching installed target returns `no_change` for either command.

## Ownership, lock and durable journal

Every executable/request launch uses new complete immutable audited source, verified
hash/inode and held descriptors. Remote orchestration uses only the self-hosted
Keida Remote Commander with fresh device/account discovery. An uncertain transport
result is followed through its same process/operation identity; no second invocation
may repeat an uncertain effect.

`inspect`/`status` are observations, not lock ownership. `prepare`, `apply`,
`rollback` and `reconcile` acquire the same exclusive application operation lock
nonblocking. Busy means busy, never automatic lock removal. Hold its descriptor
through all dependent operations. Bind device/inode, host boot ID, PID and process
start ticks, executable hash, request hash and policy hash into a durable owner
record; PID alone is insufficient. Kernel lock release after death does not mean
an unfinished operation is safe to repeat. Any unresolved effect journal blocks
new preparation or effects until reconciliation establishes a safe disposition.

The root-private operation directory is create-once. Before the first effect,
write/fsync its canonical request, admitted plan, exact target/old resource IDs,
launch identity, expected generation, deadline and authorization reference. Write
each event into a new numbered record containing operation/request identity,
sequence, previous-record hash, phase, intent/result and exact resource IDs.
Fsync the file and containing directory before acknowledging that event. Atomic
status replacement uses a unique create-new temporary file, fsync, rename and
directory fsync. A successful output message without these durable receipts is
not success. Torn, missing, duplicate, out-of-order or conflicting events refuse
and preserve `uncertain`; never truncate a journal to a convenient phase.

Each Docker/host effect has a durable **intent before dispatch**, then an observed
result before the next effect. Record exact allocated CIDs/network IDs before
later use/cleanup, including any create whose response was lost. Resolve an
ambiguous create by its unique operation label plus the full planned configuration;
name matching alone does not establish ownership. Unknown or multiple matches
block. Never kill an unidentified process or clean a name prefix broadly.

Installation generation is a durable monotonic u64, initialized from the reviewed
bootstrap installed record. A successful replacement/compatible rollback increments
it exactly once with checked arithmetic, inside the held operation lock. Same-target
apply is a no-effect terminal result and does not increment it. Reconciliation
can complete a missing generation/status commit only from the same proven operation
and exact final identity; it cannot choose a different target. At u64 exhaustion,
refuse effects. Published release ordinal never substitutes for generation: a
deliberate rollback can lower ordinal while generation increases.

## Phases, deadlines and cancellation

Effect operations progress through `accepted`, `preparing`, `prepared`, `fencing`,
`backed_up`, `replacing`, `checking`, then a terminal disposition. `prepare` itself
ends with a prepared-plan receipt; it does not create an installed generation.
The effect operation revalidates preparation and current state while holding the
lock. A prepared receipt is valid for at most **30 minutes** and never survives
a host reboot, inventory/policy/installed-generation change or changed admitted
bytes. Its age uses a recorded boot ID and Linux `CLOCK_BOOTTIME` completion
timestamp, never the operator's wall clock. This monotonic clock includes host
suspend time. Expiry requires a new plan ID and fresh preparation.

Terminal dispositions are:

| Disposition | Required evidence |
| --- | --- |
| `rejected` | Admission failed before production effects; exact reason retained. |
| `no_change` | Target already equals the exact installed identity/configuration; no lifecycle effect or generation increment. |
| `failed_safe` | Failure/cancellation with proved production effects absent, or prior writer/configuration still exclusively serving and unchanged. |
| `succeeded` | Exact requested target exclusively installed, all required checks and durable installed/generation/terminal records complete. |
| `rolled_back_current_data` | Candidate stopped, qualified prior binary exclusively restored using current data, exact checks and new generation/receipt complete. |
| `uncertain` | Effects, writer exclusivity, installed identity or durability cannot be established; all further effects blocked. |

An apply deadline is **30 minutes** total `CLOCK_BOOTTIME` time on the same boot;
a prepare deadline is **20 minutes**. Record wall-clock timestamps for audit only. Individual
HTTP calls have a 4-second timeout, health/reconnect evaluation a 60-second total
budget and subprocesses explicit bounded deadlines: inventory 30 seconds,
image load 180 seconds, graceful app stop 30 seconds, backup 180 seconds and isolated
restore/qualification 600 seconds. These are maxima within the remaining total,
not additive permission to extend it. Resource estimates exceeding them refuse
before fencing; a future budget change needs reviewed evidence.

Cancellation before fencing stops new work and records whether temporary fixture
effects need reconciliation. After a lifecycle effect begins, cancellation or
deadline prevents new forward effects but cannot declare absence of an in-flight
effect. Inspect/reconcile its exact result. Compatible recovery may run only as
the preadmitted bounded failure branch; otherwise preserve the fence and report
`uncertain`. Signals/reboot do not automatically resume work. Killing a caller
must not leave an untracked child; record child PID/birth and manage its bounded
process group without killing unrelated work. A forced stop or timeout is evidence
to inspect, not proof that an external effect failed.

## Application fence, restart policy and recovery

Before fencing, recheck exact Reborn app/PG/network/listener/mount/security settings,
all protected resources and competing-updater process births. Prepare/rehearse
the candidate in an isolated network/data copy with external egress unavailable;
copied configuration cannot contact real providers or production PG. No new
accounts or fixtures enter production. A successful isolated restore is required
before any production interruption.

The write fence stops only the exact owned Reborn writer gracefully and proves
its process/connections drained. Preserve deployment metadata and disable the
old container's automatic restart before permitting a candidate writer. Persist
that intent first. The candidate begins with restart policy `no`; it receives no
production access until the old writer is proved stopped and unable to restart.
Do not restart production PG, proxy/tunnel, games or other workers. Unknown old
writer/connection evidence blocks progression.

Under the held fence capture and checksum the **final matched recovery set**:
consistent PostgreSQL custom dump, role/ownership recovery, full migration ledger,
instance key, app/migrator configuration, referenced assets/manifests, prior exact
image/configuration and installed/container evidence. Keep private secret files
out of general logs/Git/status. Restore that final set into a different isolated
PostgreSQL cluster and verify both target and useful prior binary with current
schema13 data before installation. Compare all18 domain relations, complete session
selectors/revocation, ledger1–13 and all four sequence value/is_called pairs.
Newer isolated writes must survive the compatible rollback rehearsal. A preliminary
live backup or successful dump command alone does not qualify final recovery.

Retain the current useful stopped17 and matched final13 set until a later replacement
and its useful recovery are qualified. Old16/old14 are already retired; this work
must not repeat that cleanup. Keep images, historical backups, audits, caches and
external work. The first updater profile performs no automated historical pruning.

There is no application maintenance/write-admission gate in the accepted18 server.
The fence is stopped/drained writers, and public port binding itself reopens access.
No proxy/tunnel mutation is permitted. Use this exact production sequence after
isolated copy qualification and the final stopped-writer backup/rehearsal:

1. With the old writer stopped and automatic restart disabled, start one exact
   production candidate with restart policy `no` on a freshly allocated,
   policy-recorded loopback-only private origin. Only this candidate may access
   production as the application writer. Verify image/binary/compiled identity,
   configuration/security, PG readiness, private health, closed setup and protected
   anonymous admission. Loopback reachability is private qualification, not public
   acceptance.
2. Stop/drain that exact private candidate and prove it cannot restart. Preserve
   its CID/evidence. Journal the planned public replacement, same qualified image,
   configuration and owned endpoint `192.168.1.135:8790` to app8788. Start the new
   public container only after exclusive stopped-writer evidence; record its exact
   new CID/StartedAt.
3. Public container start/binding is an explicit journaled **public reopening
   effect**. It can accept real writes immediately. Now perform bounded public
   HTTPS/no-store identity/readiness/admission checks against that exact server.
   Do not claim public HTTPS was checked while access was closed. Failure after
   reopening must preserve every newer accepted write and use only qualified
   current-data rollback.

Authenticated acceptance uses only an independently authorized current acceptance
path, never stored login/header replay, credential reset/promotion or a production
fixture. Missing required authenticated runtime evidence blocks a success claim;
separate real owner use remains open. Browser refresh is already shipped and
remains deliberate; installation does not assert any user's loaded document changed.

Only after successful checks and durable exclusive installed selection may the
selected container receive the reviewed `unless-stopped` restart policy. The
retained old writer stays stopped with restart policy `no`. Every transition is
journaled. On host reboot an interrupted operation is discovered and blocked;
there is no updater autorun in this profile. Before resuming any owner-admitted
operation, reconcile actual restart policies, container births and connections.
No recovery path blindly starts the prior container based on a name or stale flag.

The sole automatic failure branch is a plan-qualified compatible prior binary with
CURRENT data, and only after the candidate is proved stopped and unable to restart.
It never restores the pre-operation dump/key/config over newer accepted writes.
If current-data compatibility or exclusive ownership is unknown, keep the Reborn
fence, preserve current state and require a separately reviewed recovery action.
Explicit `rollback` follows these same gates as a new operation; it does not rewrite
the published channel. Destructive restore is outside this profile.

## Reconciliation, status and uninstall

`reconcile` obtains the lock, verifies the original request/journal chain and
observes current resources, binary/runtime identity, restart policies, data/schema
and process births. It can report a safe no-effect failure or complete a proven
terminal receipt/generation after a lost response. It cannot infer success from
HTTP200, start/stop a container, restore a dump or repeat the last journaled intent.
Unexplained state remains `uncertain` and requires a new concrete reviewed action.
An operator must not clear uncertainty by deleting a lock/journal/status file.

Sanitized status contains format/product/installation, operation/request hash,
phase/disposition, sequence/generation, available/admitted/selected/installed
identities, timestamps/freshness, bounded reason codes and private-receipt digests.
It exposes no secrets, private endpoints, session selectors, owner IDs, provider
payloads or raw process/Docker environment. A stale status remains labelled stale.
Status cannot authorize effects or supply browser refresh readiness.

Uninstall is a separately admitted host-maintenance operation described by the
bootstrap packet, not an updater request command or application deletion. First
prevent new launches, then wait/reconcile active operations under the same lock.
An uncertain operation blocks removing the evidence or executable needed for its
reconciliation. Remove only the exact enrolled updater launcher/binary after proving
no active operation; preserve journals, admission receipts and private recovery.
Leave Reborn app/PG/current data/key/assets, useful rollback, release ledger,
Original, independent Rewrite and protected services intact. This profile has no
scheduled task or daemon to disable. No broad prune or prefix-based cleanup.

## Independent validation matrix before activation review

Fixtures must exercise the actual eventual Rust caller, durable filesystem journal
and real isolated Docker/PostgreSQL effects. Pure state models, source-string
assertions, fabricated success or skipped missing-peer tests cannot qualify it.
Freeze expected states/effects before implementation inspection; preserve retained
source/image/browser/recovery checks. Report exact Linux execution, toolchain,
source/binary hashes and receipt identities; no Windows/iPhone claim follows.

| Boundary | Required independent cases |
| --- | --- |
| Request bytes | Canonical literals/digests; duplicate/unknown fields; wrong product/installation; noncanonical UTF-8/escapes/integers; oversize/truncated files; wrong sealed hash, inode, owner/mode/type/link; arbitrary path/URL/command rejected. |
| Dedup/generation | Identical retry returns status without effects; changed hash or command under one ID refuses; distinct plan/effect IDs; stale generation/installed record; same-target no-change; concurrent manual/tool callers; checked generation overflow. |
| Trust | Wrong/preview/development product/channel; forged manifest with matching untrusted checksum; tampered ZIP/archive/image/binary/assets; wrong run/head/attempt/artifact; unqualified governance or missing compatibility; changed admitted file; no fresh download grant replay. |
| Ownership | Held lock, changed lock inode, stale PID/reused PID/different boot; protected updater birth/CID/config/network/listener/mount/security drift; unknown/multiple create matches; no unrelated host effect. |
| Durability | Crash before/after each intent/result/fsync/status/generation boundary; torn event or pointer; successful effect with lost RPC; child still running; process death and host reboot. Never dispatch twice or permit two production writers. |
| Deadlines | Request/subprocess/phase/total exhaustion, hidden or delayed caller, cancellation before/after fence, late result. Remaining time never resets; unknown effects remain uncertain. |
| Recovery | Final dump/key/config/roles/assets/ledger mismatch or corruption, insufficient space, failed final restore, candidate failure before/after cutover, unsupported current-data rollback refusal, newer isolated writes/session revocation preserved; no old-dump restore. |
| Restart/uninstall | Old automatic restart disabled before candidate authority; candidate restart no until durable acceptance; crash at policy transitions; explicit rollback generation; uninstall during active/uncertain operation; app/data/recovery/ledger/protected services preserved. |

Until this matrix and the exact candidate/launcher review are complete, this
document establishes a frozen preparation contract only. Separate owner approval
will concern a concrete reviewed installation packet, with all material remaining
gates named; it is not requested by this documentation change.
