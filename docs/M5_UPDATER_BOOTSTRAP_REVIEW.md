# M5.2 concrete host-updater bootstrap review

Prepared October 28, 2026, America/Chicago, for [issue31](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/31).
Review result: the [execution contract](M5_HOST_UPDATER.md) can be frozen for
implementation. **Installation and activation are not ready for approval.**
There is no host-updater source, executable, digest, launcher or end-to-end
failure qualification yet. The actual source and binaries reviewed below are
manual release tools. They must not be represented as an updater installation.

Follow-up: [M5.3 foundation](M5_UPDATER_FOUNDATION.md), issue33, now adds a
diagnostic-only parser/journal tool. Its exact preliminary binary/package
qualification is recorded there. It supplies no host dispatcher or completed
activation packet; the missing execution gates below remain open. This bootstrap
review preserves its original preparation observations and manual-tool identities.

This is authorized preparation only. It carries the six-file predecessor
handoff into a normally reviewed documentation PR. Main and live remain
**0.1.18/schema13**, source `697699187aca6780d8ba7b199dc2ba90b033bd67`, tree
`bef1ea4021485466a22fedf4afc6559f3fb7e5bf`. This PR does not publish another
release, replace18, activate a daemon/scheduler, or repeat completed retirement.
Every eventual accepted main merge still advances the source ordinal once.

## Actual reviewed source and binaries

All implementation files below are unchanged from accepted18. Source-review
and recovery-review expectations were frozen independently before writing this
contract. Neither reviewer was assigned host access, integration or external
DEPLOY/COVERAGE ownership.

| Accepted18 file | Git blob | SHA256 |
| --- | --- | --- |
| `tools/release/src/main.rs` | `b4aeb583344f9141d4bca5cc0ce9ab08cc4925f5` | `909a98bbd4138c35d8d4a815f6ffd062377bf0f4db1b048c43558a204b3d1c9d` |
| `tools/release/src/image.rs` | `18f2d80daf90c26633ebfc968b3921cebceb03c5` | `f9b951336022746bef9ff1d4ffe64e8a32b72bd5676c320cbffe8beda6fcee30` |
| `tools/release/src/recovery.rs` | `6ce93d93ee57ec668f4a8091a6ff7f654f52c2d4` | `097c4e618441d246479f9c7fd4c558e723bc6084fa4f3a31ad3f8e1b566daaa3` |
| `tools/source-identity/src/lib.rs` | `b0e8804189b32789173dfe1ef138638e1c441f5c` | `03485ea2b40f727fff5bc8d503756abbeb98ba6bba96e0b3acb006981e7eebc2` |
| `.github/workflows/foundation.yml` | `2667cfb8529fbb0d5d15cb94fe66bd9354d07c3c` | `35ee207eac231f75d6e8114725204acb604b69b43c9ac1eb240f718f7f62f39a` |

The actual clean host checkout at
`/mnt/cache/appdata/keida-hub-reborn-refresh-ops-20261028-e37c/publish-repo`
reported the exact accepted18 commit/tree and no porcelain changes. The older
session checkout and its dirty overlay were not reset, reused or cleaned.

The retained tools are under
`/mnt/cache/appdata/keida-hub-reborn-refresh-ops-20261028-e37c/accepted-697699187aca/publisher-tools/`:

| Actual executable | Owner/mode | SHA256 | Authority |
| --- | --- | --- | --- |
| `reborn-release` | root:root / 0500 | `f613967313557607f141bc80a90947cd2c4c1a219a112ee9ea591c4d05a009ce` | Manual image inspection, fixture rehearsal, publication, ledger integrity verification |
| `reborn-source-identity` | root:root / 0500 | `4958dd6f12f4b2edba1fe3251302adc933d19430f223ece3b1b2e4086cee41be` | Clean full-history source identity derivation |
| Host updater | Absent from reviewed repository; no enrolled executable | **Not assigned** | No install/apply/reconcile worker exists |

The tools were hashed, not executed as historical commands. Unraid has Docker,
Git, jq, flock, stat, timeout and SHA256 utilities; this preflight found no host
Cargo or rustc. Future builds use bounded isolated tooling, preserving the
appliance. Rust1.99.1 remains the operational implementation language. Existing
Python workers below belong to other projects and are not Reborn fallbacks.

## Fresh transport and host observations

The self-hosted Keida Commander inventory showed Bazzite
`78dd5c47-fbff-4109-b271-c4377fba14ee` online, account keida/UID1000, hostname
Keida-Bazzite-PC. Existing trusted BatchMode SSH reached HomeLab/root UID0 at
192.168.1.135. The two paired Windows devices were offline and unused. Hosted
Remote Desktop Commander was not used. Device IDs remain relay-local.

Each substantive read used new private root0400 source, verified hash/owner/link
count/inode through held read-onlyFD3, and heldFD9 on the existing root0600
`/mnt/cache/appdata/keida-hub-reborn/operation.lock`, device/inode
**40:40389844**. Bazzite retained UID1000:0400 source and passed sealed in-memory
bytes. The lock was not deleted/replaced. Audit directories are diagnostic
artifacts, not an installed updater or shared command inbox.

| Read | Source SHA256 | Actual result |
| --- | --- | --- |
| Initial inventory | `0dcfb5483f7915ddb2b77964c5817d0ee0d81cb0a4b79737a927b52a8b3e91dd` | PID354782, exit124/runtime8.22s: Docker CLI listing deadline; no application effect |
| Fresh socket/ledger/status inventory | `240a82baa06f729143a1ecf1483abe6f90a29fa2fd99d6827bf4f331799727b6` | PID354932, exit0/runtime1.34s; 85 containers listed; public exact18/ready |
| Exact boundaries/manual-binary inspection | `814e118fb38f0ab822c79229a684babfe911110870c98f6b5b1266ae3633f3c7` | PID355013, exit0/runtime0.34s; exact app/PG/prior/protected resources and tool digests |
| Manual-state/footprint/final HTTP read | `fcadea94e55e4db082ec822b0f577da59ea12533cf03ca19e36b874accdcadbd` | PID355239, exit0; proposed updater path absent, exact18/ready, Original301→www; output SHA256 `24df929ada8140a4d10952b0eed3c1ba4615912553ebb904aa3a06f56df4bec7` |

One intervening launcher stopped at exclusive diagnostic-directory creation
(PID354866, exit1) before source execution or application-lock acquisition. CORE
corrected its directory precondition in a new execution; no application mutation
was retried. The Docker timeout likewise caused no restart or cleanup. Successful
new reads do not erase either diagnostic failure. Review03 retained the literal
completion label `REVIEW02_COMPLETE`; its new complete executed source hash,
PID354932/actualexit0 and output hash
`862925f5ea2631f4bc4ffb010dafe206e916c9f520f436cbae53b8a6ba0f31e7`
identify that read. The stale label does not identify its executable source.

Root source is preserved under
`/mnt/cache/appdata/keida-hub-reborn-updater-review-20261028-8c01/executed-snapshots/`
as `inventory-01.sh`, `review-03.sh`, `review-04.sh` and `review-05.sh`. Corresponding Bazzite
source/logs are in
`/var/home/keida/Keida-Hub-Reborn-Updater-Review-20261028-8c01/`.
Historical snapshots and logs are evidence, never scripts to replay.

The final18:59CDT read found the historical Bazzite
`/var/home/keida/Keida-Hub/UNRAID_BRIDGE` path absent; it was not declared clean
or used as a command bridge. It also hashed the existing manual `installed.json`
as `640105be57eee734cff9df0943007dfe0c51b147fe25f9ab236e0825174da492`
and inspected its nonsecret schema/identity projection. The existing selector
field is `container_id`, not `public_cid`. The updater path proposed below was
absent, which must still be refreshed before any later allocation.

At 18:52–18:54CDT, October28, the safe audit observations were:

| Resource | Exact identity and observed boundary |
| --- | --- |
| Current18 application | CID `6b0ce717744813abea65cfa36ce6aca8dafa117c60b72ddb3a1ea36c41cfe3f9`; image `sha256:74231723bfcb2bd52363d848a53c3d62cf6c70e90cc7a590fb75b7ca9a655f0d`; StartedAt `2026-10-28T21:18:09.639816887Z`; running/healthy |
| Useful stopped17 | CID `b06aa102f99e194427278c055acde772fc5494b8509544940a92a0cfcd5f902b`; image `sha256:cabfa37f35e55af08cf3b32f3bb07fbbc5cc92e65b64c414068b4cb9320996a6`; original StartedAt `2026-10-28T10:24:22.303339338Z`; exited |
| Production PostgreSQL | CID `ef804d5b6878334d1c3eeabc48729dca310d808b8c508a58a81bd89e30f6b21a`; image `sha256:392c708576858a9a583a1b937503a99df57ca5dae63890748f4d0f2fc848abc6`; StartedAt `2026-10-28T08:02:31.974054147Z`; running; no public5432 binding |
| Reborn network | `keida-hub-reborn-net`, ID `ee8fef3968c8d374bf3bb457a996b358ad346324dbbcb9b8891d89a7a6346857`; current app172.31.0.2 and PG172.31.0.3; stopped17 has no active address |
| Reborn application execution | UID65532:65532; read-only root and `/mnt/cache/appdata/keida-hub-reborn/app`→`/run/reborn` bind; cap-dropALL/no-new-privileges;1CPU/256MiB/64pids;16MiB tmpfs;192.168.1.135:8790→8788;unless-stopped |
| Existing manual state | `operation.state` says `public18-terminal-qualified-owner-browser-provider-pending`; existing `installed.json` remains the manual authority until a separately reviewed adoption |
| Independent Rewrite | CID `4d59e3f30d54d26365e4deef135a78a299086eb5ffd7ebfd74ce60ecf21661a9`, image `sha256:6fc93c846aefd9087d58b8e8e218b7e2f629e6c6282df2bb4310e30c6f042adc`; exited; own data bind/network retained |

Application key/app DSN and migrator DSN remain UID65532/0600 in separate0700
directories. PG data is UID999/0700. Root owner credentials/history were not
read, replayed, reset or copied. Nothing mounts Docker/host-worker authority into
Reborn. Stopped17's health label is historical, not proof that it is running or
that a fresh rollback has been accepted.

## Competing owners and denied targets

All85 container names/IDs/images/states/mounts/networks/ports were inventoried;
the app, prior, PG, Rewrite, Original Hub dev, Crafty, nginx and Cloudflared were
also inspected for actual birth/configuration. This is a dated preparation
inventory, not a future activation baseline or a full player/join census.

Four root workers retain their exact assignments and October24 09:09:24 host-local
births: PID9856 service-manager,9858 steam-game-updates,9859 phase-maintenance,
9860 native-checkpoint-schedule. Their scripts/policies are under their respective
`/mnt/user/appdata/keida-*` roots. The phase worker holds its own watch.lock.
No process was killed, signalled, reconfigured or adopted.

Protected Docker observations include:

| Target | CID prefix | StartedAt |
| --- | --- | --- |
| Original `keida-hub-dev` | `16f002a59ae5` | `2026-10-28T08:02:30.066782695Z` |
| Crafty-4 | `f00dfa3d737e` | `2026-10-28T18:30:57.953174391Z` |
| nginx | `d48e93768bfd` | `2026-10-24T14:10:50.134370974Z` |
| Cloudflared | `0089224c9b0b` | `2026-10-24T14:10:52.856453274Z` |

Crafty's already documented external restart remains reconciled in
[comment6478870688](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1#issuecomment-6478870688).
The fresh inventory does not claim it never restarted. Lobby/gateway/relay,
games, Commander/Discord setup, Forge, map, all other containers, Original
four-writer/two-reader transfer, independent Rewrite and unpublished work remain
outside updater authority. Unknown player evidence blocks protected game actions.

Scheduler discovery found existing cron/user-script entrypoints, including
Palworld Update Watchdog and network maintenance. `/boot/config/go` and
`/etc/cron.d/root` had zero literal Reborn references. That string check does not
prove absence of indirect schedulers; complete competing-owner admission must
be refreshed before activation. No scheduler files were edited.

GitHub refresh found Reborn main unchanged/no open PRs before this work, Original
main `f65cc4e372125a5cf64e0673248c71d89302e037` with its four open PRs retained,
and Rewrite main `51e0f5625dd6e8518db8f324e447af2b62f69adf` with no open PRs.
The20 existing Reborn branches were preserved. This CORE's subordinate reviews
do not reassign external chats or transfer their operational responsibilities.

## Artifact trust and retained recovery

The private immutable ledger is
`/mnt/cache/appdata/keida-hub-reborn-alpha-ops-20261026-2f9399d/release-ledger`,
root0700. Fresh channel18 hash is
`994aefb4d662e5b414b34016337760db852203fcf36cb4aa0ea030a0e6cd964b`;
manifest18 hash is
`a871b8a6643de2b83f8a8e8906eb5ed831eb1dffbf90de80b2418d7995085c5b`.
The manifest binds exact18/source/tree/image/binary/schema13 and24 asset hashes.

The [manual18 receipt](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1#issuecomment-6482571904)
binds authenticated CI artifact12851087663/run40764821795, original ZIP SHA256
`2a3af18dc57f02f76ee9fab592bf18fc832e0ba2000f6e0f7f8cb206659cb6c0`,
and original CI image.tar SHA256
`2a14bb2c0afcbf5ebff8dd98ef1fb7dc49931bd78fb0d2877d2cb54ab5a69a2c`.
These are distinct from Docker host tar reserialization and the actual updater
binary, which does not exist. The authenticated original archive is retained;
no expired download grant was reused. Release18 is create-once, never rebuilt
under the same identity.

Format1 manifest and `verify` establish bounded integrity inside a pretrusted
ledger, not publisher authentication. `publish` checks Git facts/main/CI; its
trusted CORE caller supplies authenticated artifact and exact-image evidence.
The initial updater therefore accepts only a root-sealed local admission
envelope with that evidence. It gets no GitHub/provider/Discord credential and
cannot select a network image URL. Protected-main boolean alone is not complete
governance qualification. CI's14-day upload retention is not durable storage.

Useful17 and matched final13 recovery remain retained at
`/mnt/cache/appdata/keida-hub-reborn-backups/pre-0.1.18-697699187aca`.
Fresh `RECOVERY-SHA256SUMS` hash matches
`0a441f250b179cc2e3db37686cd08d41fbb1b5b1a0cda2fc5819ca29e2549890`.
This preparation rechecked that index hash, not all backup files or a new restore.
The exact18 receipt records the qualified full13-file checksum/restore proof.
Current13 and final stopped-writer dumps were restored under actual17/18,
comparing all18 domain relations, full sessions/selectors, ledger1–13 and four
sequence value/is_called pairs. Newer isolated writes survived rollback.

`rehearse-image` separately proves fictional matched recovery and a failed
same-image startup with invalid pool configuration; it is not the manual17↔18
compatibility proof, an updater cutover, a reboot test or owner acceptance.
Its blocking Docker helpers and host-network fixtures must not be reused
unchanged as production executor logic. An updater needs its own isolated
failure evidence against its actual caller. No old dump/key is a rollback input.

## Concrete proposed bootstrap footprint

The first candidate is a root-invoked, bounded Rust one-shot executable. It has
no daemon, timer, boot hook, listening socket, autonomous target selection or
web request path. A later unattended scheduler is a separate reviewed change.
Root/Docker access is broad host capability; fixed target policy constrains the
implementation, not a kernel sandbox. The application retains no host access.

| Path | Proposed owner/mode and permitted use | Current status |
| --- | --- | --- |
| `/mnt/cache/appdata/keida-hub-reborn/updater/` | root0700; new private control root, refuse preexisting unknown content | Not allocated by this preparation |
| `updater/bin/<binary-sha256>/reborn-host-updater` | root0500; create-once qualified executable, hash/inode-verified heldFD | Source/binary/digest absent |
| `updater/policy.json` | root0400; fixed host/product/targets/paths/limits and policy digest | Specification only |
| `updater/admissions/<envelope-sha256>.json` | root0400; publisher-qualified local admission records | Specification only |
| `updater/operations/<operation-id>/` | root0700; create-once request, append-only events, atomic status and immutable terminal receipt | Not implemented |
| Existing `operation.lock` | root0600; permanent shared inode, never unlink/recreate | Observed40:40389844 |
| Existing release ledger | root0700/read-only to executor; publication owner remains separate | Observed channel18 |
| Existing app/config/key, PG, backup roots | Preserve owners/modes; read minimum required private recovery data; no key/DSN rewrite or PG filesystem copy | Retained |

Before installation, a concrete manifest must enumerate every created file,
parent permission, executable digest, policy digest, launcher invocation and
uninstall disposition. The new path's availability must be checked through
safe descriptors; a proposal is not a reservation. Bootstrap must atomically
adopt the existing terminal manual state under the same operation lock, preserve
its raw evidence, and define one installed-generation authority shared with
manual CORE. No second selector or ambiguous manual/updater owner is acceptable.

Installation approval would cover only those listed updater resources and
one-shot entrypoint. Application replacement needs an explicitly selected,
admitted operation under the approved policy. It does not authorize installing
any future accepted release automatically. Existing unless-stopped policies
require isolated crash/reboot proof before the first mutating profile: incomplete
candidates cannot auto-resume beside the retained writer. No live restart-policy
change was made to obtain this review.

Uninstall must stop admission, inspect/reconcile accepted or uncertain work under
the same lock, and remove only manifest-listed executable/entrypoint resources.
It retains operation history, current app/PG/data/key/configuration, useful prior,
matched recovery, ledger, images and audits. It never deletes the operation lock
or restores an older database. Unknown effects block teardown.

## Approval packet completion gates

The documentation review and evidence inventory are complete for this scope.
The following execution gates stay open; no installation question is due yet:

- [ ] Reviewed Rust updater source and actual pinned Linux executable, with its
  full digest/build/source identity and bootstrap manifest. No placeholder digest.
- [ ] Implemented request/status/journal/installed-generation adoption and held
  source/lock protocol, with strict input/target/path/privilege boundaries.
- [ ] Independent actual-executor fixtures for trust, competing callers, lost
  replies, failure at each journal/effect boundary, PID/boot/inode drift, timeouts,
  reboot/no-dual-writer, matched backup, newer-write rollback and uninstall.
- [ ] Current exact qualified candidate and compatibility window, full target/
  protected-owner/scheduler/bridge refresh and nonsecret receipt. No historical
  command, secret/header replay or implicit responsibility transfer.
- [ ] Normally reviewed PR/head checks and eventual accepted-main checks, plus
  actual updater build/image/fixture evidence appropriate to its caller.
- [ ] Owner separately authorizes the exact installation/activation packet.

Real owner desktop/mobile/refresh and dedicated provider/Discord acceptance
remain open independently. Linux inventory and documentary review establish
neither those workflows nor fullM5. Next implement and qualify the frozen
one-shot protocol in isolation; return for installation approval only when its
actual complete packet is reviewable.
