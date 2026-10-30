# M5.6 durable namespace and authority-origin contract

Frozen preparation for [issue40](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/40),
October 29, 2026, America/Chicago. This refines the path/bootstrap portion of
[M5](M5_HOST_UPDATER.md); it does not implement or authorize installation.
The concrete Rust slice is [issue41](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/41),
the [fixed read-only namespace probe](M5_NAMESPACE_PROBE.md). Its October30 package
and actual-root/Btrfs evidence are recorded there and in the tracker; final
head/main CI remains required. The capability/origin/executor and failure/reboot
qualification proposed below remain open. The October29 observations are history.

## Actual problem and selected profile

M5.5 qualified the real installed18 evidence with the accepted source21 diagnostic.
Its [complete receipt](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/38#issuecomment-6500827314)
reports local agreement, manual authority retained and effects/adoption/execution-ready
false. Its transient /root workspace is not a durable installation.

The existing Rust path readers correctly reject the writable, nonroot-owned
cache/appdata ancestry. Creating a root0700 child does not protect its directory
entry from a writable parent. A device/inode observation alone is not a durable
identity across reboot, filesystem replacement or inode reuse.

Select a **root-protected data-only origin anchor plus Btrfs directory/file
capabilities**, with no trusted bind view or new mount. Keep frequent journals on
the existing persistent cache filesystem. Store only the small enrollment/origin
record and bootstrap intent on the existing protected boot volume. Root remains
the trusted administrator; this is not protection against a malicious root,
block-device rollback/cloning or compromised kernel. UUIDs identify a filesystem,
not its publisher or authenticity.

No shared chmod/chown, ancestor exception in a generic parser, daemon, scheduler,
boot hook, mount propagation change, privileged application mount or Docker socket
is introduced. No new operational Python backend is selected. New operational
implementation remains Rust1.99.1 with the locked application architecture intact.

## Fresh host facts and their limits

New read-only source5cb8e881590e5bdbf3ae720a760f0b8883884bcdb9ce8ae2950b281fc9a2cf20,
Commander PID393750, root exit0/0.603s, output
fb95fef97483627e8a262b64035eaa6c794696549c91bf3389370b03781fdf53,
observed these values at October29 11:13 CDT. These are observations, not reservations.

| Surface | Actual observation |
| --- | --- |
| / and /root | root0755 and root0710; rootfs, transient |
| /run | root0755 tmpfs, nosuid/nodev/noexec; transient |
| /boot and /boot/config | root0700; VFAT volume ID8079-7391; fmask0177/dmask0077 |
| /boot/config/go | root0600; not modified or executed by this work |
| /mnt/cache | Btrfs UUID649ec41d-5d49-457d-a1e1-5caf1dacd77c; UID99:GID100/mode0777, current40:256 |
| /mnt/cache/appdata | UID99:GID100/mode0777, current40:257 |
| Existing Reborn app root | root0700, current40:40389843 |
| Existing permanent operation.lock | root0600/singlelink, current40:40389844 |
| Proposed updater and boot-anchor directories | Absent; not allocated |
| Current cache subvolume | ID5, UUIDdb75f63f-1e22-4ac4-a07c-ac9cf37b8e70 |

A second NEW read-only source
1efdadf9802801c6ad2db80908c73a8e54442f145c7dca4338312b4dbc1c8178,
PID393841, root exit0/0.026s, output
2eaad0e943374c4d07e5d51145f42e8ddb48e154635e6eed83ca76ef850ce772,
obtained opaque type77/20-byte handles for cache, appdata, app root and permanent
lock. open_by_handle_at successfully reopened each with matching path metadata.
These handles are private diagnostic evidence, not credentials, enrolled authority
or proof of persistence after an actual reboot. No proposed state-root handle exists.

Both reads used self-hosted Commander, refreshed Bazzite/keidaUID1000 to HomeLab/root,
new private0400/hash/inode-verified source/heldFD3 and the actually held existing
operation lockFD9. Audits are retained under the private M55 audit root and
/var/home/keida/Keida-Hub-Reborn-M56-Preparation-20261029-8c01. Historical source is
data only, never a command to replay. The Python probes are narrow preparation
diagnostics, not an installed executor or a qualified Rust caller.

Live health remained accepted0.1.18/source697699187aca and ready; manual installed,
operation.state and final13 index hashes matched the retained receipts. This
rechecked the index, not a full recovery set or a new restore. App/PG births remain
October29 08:01:28.324793588Z and08:01:28.487118351Z. Stopped17 remains retained.

Crafty was running again with the same CID/image and NEW StartedAt
2026-10-29T16:01:05.952484269Z (11:01:05 CDT), after its previously recorded
14:56:39.579428818Z stop. CORE issued no Crafty lifecycle command. Actor/cause and
external ownership are unresolved; this is not an approved mutation baseline,
zero-player evidence or a game responsibility transfer. Future host effects still
require fresh ownership reconciliation.

## Proposed footprint, all unallocated

| Path or resource | Role and admission |
| --- | --- |
| /boot/config/keida-hub-reborn-updater/ | Data-only enrollment directory, root0700 through protected root ancestors and expected boot filesystem/masks |
| bootstrap-intent.json in that directory | Root0600 singlelink, create-once bootstrap intent; incomplete work blocks mutation |
| authority-origin.json in that directory | Root0600 singlelink, bounded canonical enrollment/origin anchor; never rewritten as an update selector |
| Existing app-root/updater/ | Root0700 persistent state directory, admitted by its enrolled opaque handle and filesystem/subvolume identities |
| updater/bin/<sha256>/reborn-host-updater | Root0500 singlelink exact executable, authenticated and held before execution |
| updater/policy.json and admissions/ | Root0400 singlelink sealed policy/evidence, beneath admitted root0700 directories |
| updater/installed/origin-receipt.json | Root0400 immutable origin evidence and raw manual/evidence bindings |
| updater/installed/generations/<020-generation>.json | Immutable root0400 canonical InstalledBinding evidence |
| updater/installed/current.json | The sole current InstalledBinding selector after origin commitment |
| updater/operations/, plans/ and private audits | Existing bounded journal/plan contracts, future concrete layout enumerated in the full manifest |
| Existing app-root/operation.lock | The SAME permanent underlying inode; never recreated, renamed or removed |
| /root temporary review/launch staging | Root-only transient execution input, never durable state or an installed selector |

VFAT's observed masks produce0600 files; it cannot be treated as a per-file0400
POSIX seal. The exception is **only** the two named data records under the protected
boot directory, with external exact-byte SHA256 binding, type-first regular-file
checks and retained descriptors. It does not relax check-request, check-bundle,
journal or Btrfs sealed-file permissions. Stage a checked0400 RAM copy only if a
strict parser caller needs it; such a copy does not become durable authority.
Executable code, journals, secrets and per-update status do not belong on boot flash.

The complete installation manifest must enumerate every file, parent, digest,
mode, invocation and uninstall disposition. Availability is checked again before
allocation. This document supplies no placeholder state-root handle, executable
digest or activation-ready manifest.

## Root anchor and opaque identity

The proposed authority-origin.json is compact ordered ASCII JSON, no escapes,
whitespace, newline, duplicate/unknown fields or extension bag, at most16KiB.
Require an external64-lowercase-hex digest supplied by the NEW audited operator
launch. Do not calculate the expected digest from the same untrusted candidate
and call that authentication. The bootstrap receipt retains the committed digest.

The closed field order is:

```text
format,product,profile,installation_id,host,boot_volume_id,state_fs_uuid,
state_subvolume_uuid,state_subvolume_id,cache_root_handle,appdata_handle,
app_root_handle,state_root_handle,lock_handle,policy_sha256,executable_sha256,
origin_binding_sha256,origin_receipt_sha256
```

format=1, product=keida-hub-reborn, profile=unraid-btrfs-handle-anchor-v1,
host=HomeLab; installation_id is32 lowercase hex. boot_volume_id uses the
observed uppercase four-hex, hyphen, four-hex VFAT form. Filesystem/subvolume UUIDs
are canonical lowercase UUIDs; subvolume ID is a positive u64. Digests are64
lowercase hex. Each handle is a closed ordered object:

```text
handle_type,handle_bytes,handle_hex
```

This first actual host profile admits type77,20 bytes and40 lowercase hexadecimal
characters. Treat the bytes as opaque kernel data; do not decode guessed inode
fields or manufacture a new handle from dev/inode. Another handle shape needs a
new reviewed profile. Capture without AT_HANDLE_FID or connectable-only semantics;
unsupported lookup, excessive length, permission error or ESTALE is refusal.

A handle is meaningful only with the enrolled filesystem/subvolume and verified
mount descriptor. Obtain Btrfs FS_INFO/GET_SUBVOL_INFO through the held descriptor;
compare the actual identities to the anchor. Verify the current mount topology,
filesystem type and expected root-owned mountpoint ancestors. Mount IDs, st_dev
and /dev/nvmeX names are current-boot observations, not persistent identities.
No automatic mount, replacement filesystem, recreated lock or path fallback is allowed.

Canonical names remain a consistency check: inspect the two explicitly enrolled
writable appliance ancestors with type-first descriptors, compare their handles
and fixed relationships, and require app/state/lock names to agree with their
held capabilities. This is a separate narrow host profile; no generic path reader
begins accepting UID99/0777 ancestry. A renamed/substituted parent cannot retarget
an admitted descriptor. Any name/descriptor disagreement blocks subsequent effects
and is recorded; the tool does not rename it back. Detection is not a claim that
an uncooperative process cannot rename a writable parent between observations.

Root-only administration and healthy, correctly mounted boot/cache filesystems
are prerequisites. A filesystem clone/snapshot restore, missing volume, replaced
directory, stale handle, masked permission change or ambiguous topology requires
new explicit recovery review, never automatic re-enrollment.


## Bootstrap evidence records

Both supporting records use the same16KiB canonical-byte/hash/type rules as the
anchor, with the boot intent's narrow0600 profile and Btrfs origin evidence0400.
No production record is created by this review. Freeze these shapes before an
origin implementation; a successful M5.5 diagnostic is not one of these commits.

bootstrap-intent.json has this closed field order:

```text
format,product,profile,installation_id,bootstrap_id,boot_id,observed_boottime_ns,
manual_installed_sha256,manual_state_sha256,terminal_receipt_sha256,
origin_binding_sha256,envelope_sha256,adoption_plan_sha256,policy_sha256,
inventory_sha256,executable_sha256,authorization_receipt_sha256
```

format=1/product=keida-hub-reborn/profile=unraid-handle-bootstrap-intent-v1.
bootstrap_id is a NEW32-lowercase-hex identity, independent of installation,
plan and effect-operation IDs. boot_id is a canonical lowercase UUID;
observed_boottime_ns is a positive u64. All remaining references are full
64-lowercase-hex digests. The authorization receipt binds the separately approved
exact bootstrap scope; its presence is not invented by this parser.

installed/origin-receipt.json has this closed field order:

```text
format,product,profile,installation_id,bootstrap_id,state,bootstrap_intent_sha256,
manual_installed_sha256,manual_state_sha256,terminal_receipt_sha256,
origin_binding_sha256,envelope_sha256,adoption_plan_sha256,policy_sha256,
inventory_sha256,executable_sha256,boot_id,observed_boottime_ns
```

profile=unraid-handle-origin-evidence-v1 and state=prepared-origin. Other types
follow the intent. Match every shared field to the exact intent; the receipt
hash binds the entire intent, including its authorization reference. Match
installation/policy/executable/binding fields to the anchor and check the actual
retained raw evidence and canonical generation1 bytes. Require the same current
boot and a newly validated assessment within M5's60-second observation bound;
expiry requires NEW reviewed preparation, not timestamp normalization.

This receipt deliberately describes prepared origin evidence. It cannot claim
that its later boot-anchor rename already happened. A committed authority is
established only by the valid final anchor together with this evidence and the
matching selector/journal state. The external terminal bootstrap receipt records
the actual commit/sync outcome. It is not another installed selector.

The hash graph is acyclic: raw inputs/binding/admission/policy/inventory and
authorization reference -> bootstrap intent -> prepared origin receipt -> final
anchor. The final anchor is never hashed into its own evidence. A changed intent,
approval scope, raw manual record, binding or policy requires refusal; it cannot
be silently rewritten under an existing bootstrap ID.

## Capability lifetime and existing Rust callers

The eventual Rust namespace constructor has one fixed production authority source,
the externally hash-bound protected anchor. It yields a private validated
ControlNamespace type holding app/state/lock descriptors and their admitted
identities. There is no public unchecked OwnedFd/numeric-FD constructor, caller
path override, arbitrary handle JSON execution or environment-selected root.

Open by handle with O_PATH/O_NOFOLLOW first. Check type, root ownership, exact
permissions, link count and bounds before any read-open. Convert only an admitted
regular inode to its needed read/write descriptor through its held kernel handle,
compare identity and retain both. State descendants use fixed single-component
directory-relative operations, nofollow/type-first checks and private ownership.
Retain and revalidate authority bytes, parent/object descriptors and relevant
metadata through dependent operations. Hash consumed bytes and rehash where needed;
same-size same-tick mutation must not pass merely because timestamps agree.

The lock capability must identify the original permanent lock, and its current
canonical name must agree. Open that SAME object, acquire nonblocking exclusive
flock and retain it through dependent work. An fstat or another caller's busy lock
does not establish this caller's ownership. Child handoff must transfer the same
open-file description with explicit ownership/lifetime; no unlock/reopen window.
Device/inode comparisons are made on the current boot in addition to durable
handle/filesystem binding. No lock deletion or automatic repair.

The future Journal capability entrypoint accepts only the validated private
namespace, not two unrelated caller-supplied descriptors. It must preserve all
existing global corruption, pending/uncertain-work, installation, sequence,
deduplication and durability barriers. Its first implementation needs an actual
concrete caller and independent process/filesystem fixtures. Existing
Journal::open(root,path), check-request and check-bundle keep their strict path
requirements and retained tests. They are not yet a production namespace backend.

No trusted bind mount is selected. A private mount view would add namespace,
mount-lifetime and caller/daemon visibility requirements while leaving the need
for a persistent anchor. Direct verified capabilities suffice for control-state
access. This choice does not solve future Docker production bind-source races,
fencing or artifact admission; those remain distinct executor requirements.
Do not claim the stored-path APIs can already consume a capability.

The first one-shot invocation still comes from a NEW complete audited operator
launch through self-hosted Commander. It validates the protected origin and
the exact executable before execution through its held descriptor. An unchecked
cache pathname, old command snapshot or self-claimed hash is not an entrypoint.
No reboot startup or unattended launcher is installed.

## One atomic authority origin

Before bootstrap commitment the raw existing manual installed.json and
operation.state remain authoritative. The M5.5 proposed installation ID/generation1
is review data; it is neither enrolled state nor permission to adopt stale context.
Fresh current artifact, app/PG birth, complete owner/scheduler/policy comparison,
no unresolved work and the exact new bootstrap authorization are required.

After separate approval, the intended transaction under the SAME held lock is:

1. Verify absent expected footprint, protected boot/cache identity, current manual
   bytes, current owned resources and no other operation. Create/fsync the
   create-once bootstrap intent on the protected boot volume BEFORE preparation
   can be acknowledged. Unknown preexisting/partial files block, with no deletion.
2. Create only manifest-listed private state. Capture the actual new state-root
   handle; retain raw manual/state/terminal/admission evidence and exact hashes.
   Write/fsync the canonical generation1 binding, immutable origin receipt and
   installed/current.json. Fsync all affected containing directories. These are
   prepared, nonauthoritative records while the boot origin is absent.
3. Revalidate current resources/bytes/lock, then write/fsync a new boot candidate
   anchor. Commit authority-origin.json by renameat2(RENAME_NOREPLACE) within its
   held directory, followed by containing-directory fsync. Never overwrite an
   existing origin. A no-replace collision or unsupported/error result is refusal,
   not an alternate overwrite strategy.
4. Only the fully checked committed anchor plus its matching origin/binding/journal
   establishes installed-generation authority. All manual CORE and updater callers
   then use installed/current.json and this SAME lock. Raw manual files remain
   immutable history; no caller keeps updating a second selector. Generation1 is
   independent of release ordinal18 and tool source version.
5. A lost reply is inspected through the same bootstrap identity. It is never
   permission to redo allocation, replace an origin, create a new installation ID
   or switch back to manual mode. A new read-only reconciliation reports the
   durable disposition before any separately admitted next action.

The committed anchor selects the authority namespace and origin only. It is not a
second current-release/generation pointer and is not rewritten on every update.
Later successful apply/rollback selects a canonical current binding exactly once
under the existing journal/generation contract; origin and immutable generation
records remain evidence. Full journal/current-selector commit ordering and actual
Docker effects still need their own implemented and qualified executor.

A bootstrap intent with no committed origin is blocked preparation, not installed
authority. A valid origin with a missing/corrupt/divergent state, selector, lock
or origin receipt is uncertain. Partial state without a boot intent also blocks.
An expected enrolled installation whose anchor/volume disappears never silently
falls back to the old manual record. Operator launches bind the expected mode and
anchor digest from the accepted bootstrap receipt, including after reboot/uninstall.
No code treats an inaccessible volume as an empty installation.

Atomic rename visibility is distinct from durable storage and power-loss behavior.
Every relevant write, rename and directory sync must be qualified on the actual
VFAT/Btrfs profile, including failures. No /boot write or durability experiment
has been performed in this preparation. If the required filesystem behavior is
unavailable, the profile is not installable; do not weaken its acknowledgement
contract or advertise a reboot guarantee from this document.

## Reboot, recovery and uninstall boundaries

Reboot runs no updater work. Reopen the enrolled capabilities against freshly
verified volumes/boot/process identities, validate the complete durable chain and
selector, and inspect actual application restart policies and writers. Prepared
plans from an earlier boot expire. An unfinished effect remains blocked even if
the kernel released a lock. Missing, conflicting, stale or uncertain evidence
does not trigger a restart, replay, anchor rewrite or old-dump restore.

Existing unless-stopped application/PG behavior has not been changed. M5's future
fence must disable the old app's restart before candidate authority; the candidate
starts with restart no. This namespace design does not qualify that sequence.
Final matched recovery, current-data compatible prior-binary rollback, newer-write
preservation and public/authenticated acceptance remain open executor gates.

Uninstall prevents new admitted launches, resolves active/uncertain work under
the same lock, and removes only the exact approved executable/entrypoint resources.
Retain the data-only origin/intent, namespace records, journal, current binding,
raw manual evidence, admissions, private audits, images, app/PG/data/key/config,
useful stopped17 and matched final13. Retaining the origin prevents silent
manual fallback. A later manual operator uses the same installed authority and
lock through freshly reviewed tooling. De-enrollment or namespace migration is a
separate reviewed transition, not a side effect of deleting an executable.

## Expectations frozen before the new implementation

These are required outcomes, not executed fixture results. Freeze literals and
fault expectations before implementing the new namespace caller. Rootless tests
and same-UID fixtures never establish root/Btrfs/VFAT/reboot acceptance.

| Boundary | Independent expectation |
| --- | --- |
| Authority bytes | Wrong external hash, mode/mask, case alias, duplicate/unknown fields, noncanonical order/encoding, size or incomplete intent/origin refuses before dependent reads/effects |
| Filesystem identity | Wrong/missing boot volume, Btrfs FS/subvolume identity, stale/unsupported handle, wrong type/length, lost capability or changed mount view refuses; no path/dev-number fallback |
| Parent and leaf replacement | Parent/app/state/lock rename, replacement, symlink, identical-byte substitute or descriptor/name disagreement never retargets state or creates another lock |
| Type admission | FIFO/device/socket/directory/hardlink/wrong-UID input refuses before read-open; held valid regular bytes remain the consumed subject |
| Mutation | Metadata change, same-size same-timestamp-tick bytes, changed origin/policy/executable, or read/hash disagreement refuses and preserves evidence |
| Ownership | Two manual/tool callers cannot split lock identity or advance one sequence twice; death/lost reply leaves unresolved intent blocking; old inode/handle is not auto-recreated |
| Origin transaction | Crash/failure before and after every file/sync/commit boundary yields manual-with-no-preparation, blocked preparation, proven committed origin or uncertain; never two selectors or a false terminal success |
| Journal and generation | Missing/torn/conflicting status/current/origin records, stale generation, overflow and same-target retries preserve existing barriers and never dispatch twice |
| Reboot | Actual qualified VFAT/Btrfs persistence, handle reopen, new boot ID and expired plan; no autorun, recovered-old writer beside candidate, or stale-context adoption |
| Recovery/uninstall | Current-data rollback preserves newer writes; unknown effects block teardown; retained anchor/history/data/lock are not deleted or replaced |

## Concrete code sequence and approval packet

1. **Next issue41:** fixed read-only Rust probe-namespace. No path/FD/handle
   overrides, authority record creation, mount, Journal::open/read_status, Docker,
   shell/network, secrets, selector write or host effect. Report observed kernel/
   filesystem/path facts and false effect/adoption/execution-ready flags. Require
   actual root/Btrfs read-only evidence in addition to independent literal/error
   tests and all retained exact-head/main checks.
2. Separately implement the private validated capability constructor and one actual
   journal caller, preserving strict stored-path APIs; qualify filesystem/process
   faults against that implementation. Then implement the approved-origin
   transaction in disposable VFAT/Btrfs fixtures. Neither step installs production.
3. Implement actual fixed-target prepare/apply/reconcile/rollback, fencing, bounded
   children, final matched backup, exclusive restart policy and current-data
   recovery. Qualify all M5 failures/reboots/uninstall against the actual caller.
4. Assemble exact source/build/binary hashes, complete bootstrap manifest/current
   artifact, fresh owner/scheduler/policy inventory and all recovery receipts.
   Only THEN request separate installation/activation approval.

No fullM5 completion, real owner desktop/mobile/refresh, provider/Discord acceptance
or Original four-writer/two-reader transfer follows. Owner service enrollment#39
waits until home. Original, independent Rewrite, protected services, external
branches/unpublished work, stopped17/final13 and all historical receipts remain.

## Primary implementation references

- [Linux file handles](https://man7.org/linux/man-pages/man2/open_by_handle_at.2.html):
  opaque handles, required CAP_DAC_READ_SEARCH, stale-handle refusal and nonpersistent mount IDs.
- [Btrfs ioctl interface](https://btrfs.readthedocs.io/en/stable/btrfs-ioctl.html):
  filesystem and subvolume identity from an actual held filesystem descriptor.
- [Linux rename](https://man7.org/linux/man-pages/man2/rename.2.html):
  no-replace filesystem support and atomic name visibility.
- [Linux fsync](https://man7.org/linux/man-pages/man2/fsync.2.html):
  file and containing-directory durability are separate obligations.

These references support the proposed mechanisms. They do not establish this
host's power-loss, reboot, bootstrap, executor or uninstall qualification.
