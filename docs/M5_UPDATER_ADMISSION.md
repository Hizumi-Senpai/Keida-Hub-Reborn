# M5.4 sealed current-artifact diagnostic contract

Frozen before implementation, October28,2026, under
[issue36](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/36).
Accepted source20 is `d3a26d9a5c13c15003e38a135692477db420f45f`;
live/channel remain18/schema13. The [foundation](M5_UPDATER_FOUNDATION.md)
and [full execution contract](M5_HOST_UPDATER.md) retain their boundaries.

## One caller and its limits

`reborn-host-updater check-bundle ABSOLUTE_PRIVATE_DIRECTORY ENVELOPE_SHA256 PLAN_SHA256 [--fixture]`
checks the fixed `manual-installed-adoption-v1` bundle below. Its admitted artifact
IS the current installed artifact, not a future candidate. A different target
needs a later, separately specified from/target admission. Existing check-request
and journal behavior stay unchanged. No dependency, production application,
SQL/migration/grant or browser change is required.

Default mode requires EUID0 and root-owned inputs. Explicit --fixture uses the
calling UID and ALWAYS reports `trust_basis:same-uid-fixture`, even under root.
Default successful output reports `trust_basis:root-sealed-core-admission`.
Both report `effects_authorized:false`, `adoption_performed:false`,
`execution_ready:false`, `manual_authority_retained:true`, proposed_generation1,
and local ZIP/archive rehashes. No private paths or input payloads enter errors.

The trust boundary is CORE's authenticated artifact/publisher review followed by
root-sealed local input. No signature is invented. A root administrator can
construct mutually consistent fictional records; this parser cannot authenticate
that history independently. Fixture success establishes local agreement only.
The checker performs no GitHub/Docker/network/shell operation, archive extraction,
production Journal::open/read_status, installed-generation/selector write,
bootstrap, daemon or scheduler activation. It never repairs production state.
Original/Rewrite, protected services/external owners, stopped17/final13 and actual
owner/provider/Discord gates stay preserved. Installation requires separate approval
after a complete executor/bootstrap/failure-reboot/rollback/uninstall packet exists.

## Files and descriptor lifetime

Exactly these21 regular files are permitted; no subdirectory, extra name or
recursive traversal. The directory must be sameUID0700. Every input must be
sameUID0400, one hard link, no symlink/FIFO/device. Open ancestry and fixed names
with nofollow directory-relative descriptors. Ancestors are root or sameUID and
not group/other writable; root-owned sticky temporary ancestors are allowed.
Hold directory/file descriptors through semantic validation and final recheck.
Recheck path/ancestor/root identities, whitelist, file dev/inode/type/UID/mode/
link count/size/mtime/ctime before and after reads; replacement or mutation refuses.
The process never creates/removes a file or acquires/creates a production journal.

| File | Limit | Encoding |
| --- | --- | --- |
| admission.json, adoption-plan.json |16KiB each| New canonical JSON |
| installed-binding.json |4KiB| Existing canonical InstalledBinding |
| artifact.zip, image.tar |1GiB each| Stream actual bytes in bounded chunks; no extraction |
| manifest.json, image-proof.json, recovery-proof.json |64KiB each| Existing producer JSON, closed typed shape and duplicate refusal; preserve original bytes/formatting |
| source-qualification.json, governance-qualification.json, artifact-qualification.json, compatibility-qualification.json |64KiB each| New canonical JSON |
| manual-projection.json |64KiB| Exact compact ordered projection followed by one LF |
| observation.json, assessment.json, authority-transition.json |64KiB each| New canonical JSON |
| manual-installed.json, manual-operation.state, terminal-receipt.json, policy.json, inventory.json |64KiB each| Opaque nonempty byte evidence, bound independently; no generic legacy/policy/inventory parser invented |

Policy/inventory hashes bind reviewed caller evidence and expected protected
ownership. Their byte equality does not evaluate policy or establish inventory
completeness. Raw manual/state/receipt hashes bind actual bytes independently of
the projection. The sealed authority/terminal claims below are caller assertions;
the diagnostic does not reinterpret arbitrary historical state/receipt formats.

All NEW records have required fields in the exact listed order, compact ASCII
JSON, closed fields, duplicate refusal, integer types and no normalization. Require
serialization equality: no alternate key order, spaces, escapes, exponent/signed/
float integers, duplicate keys or newline. No extension bag or arbitrary path/URL.
Each header format=1/product=keida-hub-reborn. Profile fields always equal
manual-installed-adoption-v1 unless explicitly stated otherwise below.
All hashes are64 lowercase hex, Git commits/trees40 lowercase hex, installation
ID32 lowercase hex, image IDs sha256:<64hex>, resource CIDs/network IDs64 lowercase
hex. Positive counters use u64 with checked arithmetic. Versions are0.1.<ordinal>
without leading zeros, ordinal>0, channel=accepted, schema13,
workspace contract=reborn-workspace-v1, auth contract=reborn-auth-v1.
Docker births use the existing canonical UTC/nine-digit-nanosecond parser.

## Admission records

The exact admission.json field order is:

```text
format,product,profile,installation_id,policy_sha256,inventory_sha256,
version,ordinal,commit,tree,channel,platform,database_schema,workspace_contract,
manifest_sha256,archive_sha256,image_id,binary_sha256,qualification_execution_sha256,
ci_run,ci_attempt,repository,workflow,artifact_id,artifact_size,artifact_zip_sha256,
assets,image_proof_sha256,recovery_proof_sha256,source_qualification_sha256,
governance_qualification_sha256,artifact_qualification_sha256,compatibility_qualification_sha256
```

platform=linux/amd64; repository=Hizumi-Senpai/Keida-Hub-Reborn;
workflow=.github/workflows/foundation.yml. CI run/attempt/artifact ID/size are
positive, size<=1GiB. Hash actual raw manifest/proofs/qualification files, ZIP
and original CI tar; require every corresponding reference and byte size agrees.
Missing ZIP refuses. archive_sha256 identifies original CI image.tar, never a
host reserialization admitted through an equal-image exception. No archive
containment is parsed: ZIP→tar/proof provenance is a sealed CORE assertion.
Local rehash does not reauthenticate GitHub or freshly inspect a Docker image.

Manifest uses the exact existing format1 shape. Match all identity, schema,
contract, image/binary/archive/qualification-execution/CI fields. Require exactly24
unique asset hashes. Envelope.assets and image-proof.assets are exactly24 ordered
unique full /assets/workspace/<64hex>.js|css paths. Compare those full paths,
then extract each digest and compare manifest.assets at the same index. Never
sort/deduplicate or conflate paths with digests. Nested image-proof.identity
uses product/version/commit/tree/ordinal/channel/contract/package_version;
contract=reborn-auth-v1 and package_version=0.1.0. Top-level image-proof
workspace_contract remains reborn-workspace-v1. Match its image/binary/archive.

Recovery proof uses the exact existing producer shape. Require schema13, matching
image, valid dump hash, all positive recovery flags true, fixture_only:true and
automatic_old_backup_restore:false. This is same-image fixture evidence, not
actual current-data rollback evidence; the compatibility qualification is separate.

New source-qualification.json order:

```text
format,product,version,ordinal,commit,tree,channel,auth_contract,anchor,
qualified_main_sha,execution_sha256
```

Match identity with admission and image. anchor is fixed
c06c3a03a3be17c4293e77b57fa3063ec65c8ad8; qualified_main_sha equals admitted commit.
This is a sealed source-review statement, not a fresh Git-history calculation.

New governance-qualification.json order:

```text
format,product,repository,qualified_main_sha,workflow,policy_sha256,
governance_receipt_sha256,execution_sha256
```

Match repository/workflow/main/policy. Receipt/execution hashes are valid nonempty
digests of stated review evidence, not parser-certified current GitHub rules.

New artifact-qualification.json order:

```text
format,product,repository,ci_run,ci_attempt,head_sha,head_branch,event,workflow,
conclusion,required_job,required_steps,artifact_id,artifact_size,artifact_zip_sha256,
archive_sha256,image_proof_sha256,recovery_proof_sha256,
publication_execution_sha256,download_execution_sha256
```

Match admission subject/hashes/size and publication execution to manifest's
qualification_execution_sha256. head_branch=main/event=push/conclusion=success;
required_job=Rust 1.99.1 / PostgreSQL 16. required_steps has exactly24 ordered
objects {number,name,conclusion}; numbers are1..20,38,39,40,41 in that order,
all names nonempty ASCII<=256bytes with no controls and all conclusions success.
This checks the sealed complete step record, not current Actions service truth.
Separate source/governance/download execution hashes need not equal publisher hash.

New compatibility-qualification.json order:

```text
format,product,profile,installed_manifest_sha256,installed_image_id,rollback_image_id,
database_schema,workspace_contract,compatibility_receipt_sha256,
final_recovery_index_sha256,execution_sha256
```

Its profile=manual-installed-schema13-current-data-v1. Match current manifest/image
and observation's retained-prior image; require distinct current/rollback images.
Receipt/index/execution hashes bind separately reviewed actual current-data
compatibility evidence, not a new restore or the same-image CI fixture proof.

## Adoption plan and sealed assessment

manual-projection.json uses ONLY this explicit fresh export field order plus LF:

```text
format,product,version,ordinal,channel,commit,tree,contract,database_schema,
binary_sha256,image_id,archive_sha256,ci_run,container_id,retained_prior_container_id
```

Match current release fields to admission, including original archive identity.
Match current CID to proposed binding/observation and prior CID to observation.
No public_cid alias. This export is sealed caller evidence, not a parsing of all
legacy installed fields. The current18 raw manual digest is
640105be57eee734cff9df0943007dfe0c51b147fe25f9ab236e0825174da492; its terminal
state digest is ed33f6e264e0180a4716022f2667496036235cdd862a7a5695aca7381a285bb8.
These historical values are observations, not hardcoded authentication or live
truth. Fixture profiles may use fictional bytes with the same explicit shape.

The existing InstalledBinding shape/parser stays unchanged. Additional M5.4 rules
require generation1 and every admitted release field/hash, appCID/birth/image and
installation ID to agree. Origin generation1 is independent of release ordinal18
and updater source20. The selector remains manual-installed.json.

observation.json order:

```text
format,product,profile,installation_id,observer_execution_sha256,boot_id,
observed_boottime_ns,app_container_id,app_started_at,app_image_id,
retained_prior_container_id,retained_prior_image_id,postgres_container_id,
postgres_started_at,postgres_image_id,network_id,lock_device,lock_inode,lock_claim,
manual_installed_sha256,manual_state_sha256,terminal_receipt_sha256,
manual_projection_sha256,installed_binding_sha256,policy_sha256,inventory_sha256,
current_authority,adopted_authority,unresolved_work
```

Require canonical lowercase UUID boot_id; positive nanosecond CLOCK_BOOTTIME,
positive lock device/inode; distinct current/prior/PG CIDs; matching current
image/CID/birth/binding and prior image/compatibility. Exact sealed claims:
lock_claim=held-during-observation; current_authority=manual-installed-json;
adopted_authority=absent; unresolved_work=none. These do not claim this diagnostic
currently holds the production lock, inspected a host or scanned its journals.

assessment.json order:

```text
format,product,profile,installation_id,observation_sha256,assessment_execution_sha256,
boot_id,assessed_boottime_ns,expected_observer_execution_sha256,
expected_installed_binding_sha256,expected_postgres_container_id,
expected_postgres_started_at,expected_postgres_image_id,expected_network_id,
expected_lock_device,expected_lock_inode,policy_sha256,inventory_sha256,
current_authority,adopted_authority,unresolved_work
```

Match every expected field and authority claim to observation/binding. Same boot,
observed<=assessed; checked assessed-observed<=60_000_000_000 ns. This is an age
check WITHIN the sealed assessment context, never wall-clock/current uptime/live
freshness. Historical matching records cannot become fresh executor admission.

authority-transition.json order:

```text
format,product,profile,installation_id,state,from_authority,to_authority,
manual_installed_sha256,manual_state_sha256,terminal_receipt_sha256,
installed_binding_sha256,origin_generation,policy_sha256,inventory_sha256,
observation_sha256,assessment_sha256,handover,adoption_performed
```

Exact literals: state=proposed; from_authority=manual-installed-json;
to_authority=single-installed-binding; origin_generation=1;
handover=required-before-effects; adoption_performed=false. It proposes one future
authority transition without a destination path or any reader/writer cutover.

adoption-plan.json order:

```text
format,product,profile,installation_id,envelope_sha256,manual_installed_sha256,
manual_state_sha256,terminal_receipt_sha256,manual_projection_sha256,
installed_binding_sha256,policy_sha256,inventory_sha256,observation_sha256,
assessment_sha256,transition_sha256,origin_generation
```

Require exact file hashes/installation/profile agreement and origin_generation1.
Hash references are acyclic: raw leaves/projection/binding→observation→assessment
→transition→plan; admission never contains a plan hash. Externally supplied
envelope/plan digests bind the two top-level exact records before dependent use.

## Independent qualification required

Independent literal fixture expectations freeze before peer implementation.
Cover each identity/hash/CI/artifact/proof/asset-order mismatch; missing/extra
files, altered raw evidence with unchanged projection, noncanonical reforging,
bad generation/authority/unresolved-work/transition, boot/birth/network/lock/
inventory disagreement and sealed-age boundaries; all filesystem modes/links/
types/descriptor/root replacement and archive byte limits. A fully coherent
fictional root-sealed history is not expected to fail nonexistent signature checks.
Actual CLI success/refusal must leave bundle/pseudo-production/journal bytes
unchanged and expose none of their paths/payloads.

Require pinned Rust fmt/all-target/Clippy-D/locked release, previous25 foundation
fixtures, new actual CLI/filesystem tests, independent source/recovery review,
eventual exact-head and accepted-main full retained CI. No live adoption acceptance
or installable full updater is inferred from that evidence.
