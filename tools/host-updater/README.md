# Updater protocol, journal and local evidence diagnostics

This Rust1.99.1 tool is the bounded foundation slice in
[issue33](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/33).
Read the [frozen updater contract](../../docs/M5_HOST_UPDATER.md) and
[concrete bootstrap review](../../docs/M5_UPDATER_BOOTSTRAP_REVIEW.md) for the
complete execution and installation gates. This crate implements request checks
and private journal storage. The subsequent [M5.4 contract](../../docs/M5_UPDATER_ADMISSION.md),
issue36, adds a sealed current-artifact/adoption-plan check. Neither implements a
host updater executor or changes installed authority.

## Fixed Unraid namespace probe

```text
reborn-host-updater probe-namespace
```

[Issue41's bounded diagnostic](../../docs/M5_NAMESPACE_PROBE.md) is Linux x86_64/
root-only and accepts no extra argument, user path, FD, handle, fixture mode or
environment-selected root. It reports only actual fixed namespace metadata and
opaque handles, current boot/boottime, FAT volume/mount and Btrfs identity.
All effect/adoption/execution-ready flags stayfalse, as does writer_lock_acquired.
It neither acquires nor claims a production writer lock; its NEW audited operator
launch may independently retain the real permanent lock.

Refusal exits2 with exactly `namespace probe refused; no effects authorized`,
no path/payload echo and no partial JSON. The complete report is formed only
after before/after checks; more than2 seconds elapsed refuses. Operator execution
also uses a bounded child deadline. This is an observation, not an authority
enrollment, reboot guarantee or updater installation. Existing request/bundle/
journal interfaces below retain their strict path and schema13 contracts.

## Diagnostic CLI

```text
reborn-host-updater check-request /absolute/private/request.json EXPECTED_SHA256
```

`check-request` reads and validates the supplied file
without executing its request. The file must be a regular, same-effective-UID,
0400 file with one link, at most16,384 bytes, inside an immediate same-UID0700
directory. The path must be absolute. Componentwise descriptor-relative opens
reject symlinks and untrusted writable ancestors; root-owned sticky temporary
ancestors are permitted. The bounded bytes read through the file descriptor are
the bytes checked against the expected digest and parsed.

Exit0 means that those exact bytes satisfy the protocol and digest. Its JSON
output contains only fixed `format:1`, product `keida-hub-reborn`, the validated
command name, the validated request SHA256, and **`effects_authorized:false`**.
Refusal exits2 with a fixed message that does not echo a path or request content.
There is no command dispatcher, Docker access, network request, shell execution,
daemon, scheduler or application/database action in this CLI.

The request format recognizes `inspect`, `status`, `prepare`, `apply`, `reconcile`
and `rollback`. These are validated data shapes; none is an executable CLI
operation. In particular, an accepted `apply` request remains diagnostic input.

## Sealed bundle diagnostic

```text
reborn-host-updater check-bundle /absolute/private/bundle ENVELOPE_SHA256 PLAN_SHA256 [--fixture]
```

The [exact21-file contract](../../docs/M5_UPDATER_ADMISSION.md) binds the CURRENT
installed artifact, its original CI ZIP/tar, raw manifest/image/recovery proofs,
sealed source/governance/artifact/compatibility qualifications and an adoption
PLAN. Default requires root ownership/EUID0; explicit --fixture ALWAYS reports
same-uid-fixture trust, even under root. Inputs are sameUID0400/singlelink in a
sameUID0700 directory; descriptor-relative nofollow opens and retained metadata/
path identity rechecks refuse replacement. Archives are streamed, not extracted.
No ZIP containment or live Docker/GitHub/host observation is performed.

The proposed binding's generation1 is an installation origin, independent of
release ordinal. Manual authority stays unchanged. Raw manual/state/receipt and
policy/inventory are opaque, hash-bound caller evidence; a sealed projection and
assessment supply explicit assertions. This is not a generic legacy parser,
policy evaluator, inventory completeness check or fresh executor admission.

Success reports local archive_rehashed/zip_rehashed and
manual_authority_retained:true, with effects_authorized:false,
adoption_performed:false and execution_ready:false. Root trust means admitted
root-sealed CORE input, not an invented signature; coherent fictional sealed
history cannot be independently authenticated by this parser. Refusal exits2 with
a generic message and preserves all input/production/journal files. It never calls
Journal::open/read_status or creates/repairs status projections.

## Exact protocol bytes

`protocol::parse_request` accepts at most16,384 bytes; `parse_installed_binding`
accepts at most4,096. Both require an externally supplied64-character lowercase
hex SHA256 matching the exact input bytes. JSON must use the frozen field order,
compact ASCII bytes, unescaped strings, canonical decimal integers, and no
whitespace or trailing newline. Duplicate/unknown fields, alternate encodings,
null substitutes, extra command fields and malformed IDs/hashes are refused.
The contract contains the complete required fields and their order.

Installation, plan and operation IDs are32 lowercase hex characters. The special
status selector `current` is not an operation ID. Generation values are positive
u64 integers. Plan and operation identities have separate protocol roles.

The installed binding is a separate new format, not a parser for historical
manual `installed.json`. It requires accepted product/source/tree/image/binary/
manifest/container identities, schema13, `reborn-workspace-v1`, and a matching
`0.1.N` version/positive ordinal. Container birth timestamps use exactly
`YYYY-MM-DDTHH:MM:SS.nnnnnnnnnZ`, with a valid Gregorian date, hours00–23,
minutes00–59 and seconds00–59; leap-second60 and alternate precision/offsets are
unsupported. The returned protocol types expose validated values without public
mutable fields or a public deserialization shortcut.

Syntax and hashes establish neither artifact publisher trust nor current installed
state, request authorization, compatibility, or permission to change a host.

## Journal storage API

`Journal::open(root, operation_lock)` requires an existing same-UID0700 root and
existing same-UID0600 regular single-link permanent lock file. It holds a
nonblocking exclusive lock for the instance lifetime and never creates, unlinks
or replaces that lock. Directory/file access uses held descriptors and no-follow
opens; changed root, operations-directory or lock identity refuses dependent API
work. Same-UID checks let isolated fixtures exercise the implementation without
requiring host root. A future enrolled installation must supply its actual root
and the shared application operation lock under the separately reviewed policy.

`admit` stores only canonical `apply`/`rollback` requests. Identical bytes under an
existing operation ID return its committed state without another admission;
different bytes under that ID refuse. A different unfinished or uncertain
operation blocks new admission and advancement. Mixed installation IDs or corrupt
evidence also refuse. `append` requires the expected sequence and adjacent phase
transition; a terminal state cannot be extended.

| Storage | Format and bounds |
| --- | --- |
| `operations/<32hex>/request.json` | Immutable0400 canonical request;16,384-byte bound |
| `events/<020-sequence>.json` | Immutable0400 JSON: `format,operation_id,request_sha256,sequence,previous_sha256,event`;4,096-byte bound |
| Event zero | Sequence0, zero previous hash, `{"phase":"accepted"}` |
| Later events | Contiguous sequence, exact request/operation identity and SHA256 of prior event bytes |
| `status.json` | Atomic0400 projection: `format,status,last_event_sha256`;4,096-byte bound |
| `status-<32hex>.pending` | Retained crash-left projection file; no authority |
| Census limits | At most1,024 operation directories,4,096 events per operation,16 pending projections per operation |

Immutable writes and status replacement fsync files and containing directories.
`read_status` validates the complete journal and can repair a missing or older
valid status projection from that evidence, so it is not a strictly read-only
filesystem call. Malformed, future, conflicting, torn or incomplete journal/status
evidence refuses; it is not truncated, normalized or deleted to permit progress.
Pending projection files remain retained, bounded and nonauthoritative.

Phases advance from accepted through preparing, prepared, fencing, backed_up,
replacing and checking. Rejected/no_change are pre-fence terminal outcomes;
succeeded/rolled_back_current_data require checking; failed_safe/uncertain can
terminate any phase. Terminal records are immutable, and uncertain remains a
global unresolved barrier. These are storage rules only: recording a phase or
terminal label does not prove a host effect or adopt an installed generation.
The CLI has no journal-write command.

## Remaining execution gates

Fresh authenticated publisher/host admission, installed-generation adoption and
ownership, host intent/result binding, bounded child execution, actual candidate
replacement, final matched backup/current-data rollback, reboot recovery,
bootstrap and uninstall are not implemented here. Their independent executor
fixtures and exact executable/bootstrap review remain required. Source and
filesystem fixtures do not establish real host-update acceptance.

No installation or activation is performed by this slice. Separate owner approval
of the completed concrete packet remains required; the existing application,
PostgreSQL, useful rollback/recovery, protected services and other owners retain
their state and authority.
