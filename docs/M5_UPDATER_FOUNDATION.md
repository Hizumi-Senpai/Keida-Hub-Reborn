# M5.3 request and durable-journal foundation

Scope: [issue33](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/33),
implementing the first bounded part of the [M5 contract](M5_HOST_UPDATER.md).
This is a Rust diagnostic CLI and storage library, **not a host executor**.
The [bootstrap review](M5_UPDATER_BOOTSTRAP_REVIEW.md) and its installation gates
remain open. See [the tool README](../tools/host-updater/README.md) for usage,
literal formats, limits, repair/refusal and security boundaries.

Accepted as source0.1.20/PR35, with exact head76/main77 each all24 steps/221 Rust
tests, including25 updater fixtures. [Final receipt](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1#issuecomment-6485954735).
The later [M5.4 local admission/adoption-plan diagnostic](M5_UPDATER_ADMISSION.md)
is a separate review slice; the foundation behavior below describes its accepted
request/journal boundary and does not claim a host executor or authority transfer.

## Implemented boundary

M5.3 introduced only `reborn-host-updater check-request ABSOLUTE_FILE EXPECTED_SHA256`.
It opens a private0400 single-link same-UID request through held descriptors,
checks bounded canonical bytes and the externally supplied digest, and reports
`effects_authorized:false`. It never dispatches the request. Errors echo no
private path, payload or credential. No Docker/network/shell/database operation,
daemon, scheduler, bootstrap or installed-generation adoption exists in this CLI.

The parser admits the exact six request shapes and installed-binding format from
the frozen contract, with closed fields, ordered compact ASCII JSON, canonical
positive integers, full digest/ID/source/version relationships and exact UTC
nanosecond timestamps. Leap-second60 and alternate timestamp precision/offsets
are unsupported in this Docker-birth profile. No normalization, public mutable
validated fields or public deserialization shortcut bypasses those checks.

The journal library requires an existing permanent lock and private root, retains
held descriptors and a nonblocking exclusive lock, and checks identity/ownership/
mode/link/type before dependent work. It records immutable canonical requests,
hash-linked sequential events and an atomic status projection with fsync.
Same-ID/same-bytes reuses state; changed bytes, other unresolved/uncertain work,
mixed installations and corrupt prior evidence block admission or advancement.
Concurrent callers cannot commit the same expected sequence twice.

Missing or older valid status projections can be reconstructed from the complete
validated chain. Corrupt/future/conflicting evidence refuses and remains retained.
Crash-left pending files are bounded nonauthority, never an excuse to delete
history. Terminal labels are immutable storage states, not evidence that any
host effect occurred. The CLI cannot write journal phases.

## Independent verification and exact preliminary receipts

Expectations were frozen before implementation inspection. The25 new tests
exercise actual parser/CLI/filesystem/process behavior:8 protocol/CLI tests and
17 journal tests. They cover canonical literal bytes and invalid equivalents,
unsafe files/redirected paths, request/hash/sequence conflicts, global prior
corruption barriers, partial evidence, status reconstruction, concurrent threads,
and actual killed-child lock release with unfinished admission still blocking.
There are no ignored or missing-peer success substitutions.

Two code reviews and an extra descriptor/journal review preceded qualification.
One real gap was fixed: appending an existing operation originally checked only
that operation, permitting advancement after earlier evidence became corrupt.
Global evidence validation and an independent regression now cover this case.

The first fully qualified package source was
`1b23586e57029b552bb1307dc990138c464de70d`, tree
`244eaabc6243bee8b6a21bc36de47fff65fb78ad`. On Linuxamd64, pinned Rust1.99.1
passed fmt-all, locked/offline all-target package checks, Clippy-D, all25 actual
tests and a locked release build. These are package checks; complete eventual
PR-head/workspace/HTTP/browser/recovery CI remains a separate gate.

| Receipt | Value |
| --- | --- |
| New immutable build03 execution source | `d6f69505dc3d0f51ca05ac04542fcdf432b1d647295b35cea886376bb96c8463` |
| Commander process | PID357468, actualexit0,18.76s |
| Exact isolated build container | `369bbbe22246741f435ba3c7e03a84757f75e0947f52bfbb9567b7578cb1fe8b` |
| Actual diagnostic binary SHA256 | `928af9391c2f740d37335edade3da8abb7b5fd0fc06fe1d170ed5d0b7cd3f72b` |
| Complete build output SHA256 | `5d128857bcb8402d42a4af214b7fa906634fc6a5345477628f77b7fdac9b6584` |
| Qualified build-only tooling image | `sha256:387659866e5a54256bea043adf59250cd0ecf074bdd49ce3a1e0401eebfdf77c` |

The tool image derives from the existing pinned Rust1.99.1 base and adds only its
exact formatter/Clippy components in a bounded container. It is not an application
or updater installation. The test container had networknone, read-only root and
source/cache mounts, cap-dropALL/no-new-privileges,2CPU/4GiB/256pids and new private
build output. It mounted no Docker socket, production data, key or configuration.
Unraid reports no swap-limit enforcement; the recorded4GiB limit is the memory
limit, not a qualified combined memory/swap cap.

Initial build01 failed before Rust checks because rustup attempted a component
sync in a read-only image. Its carrier response timed out, then the saved log
and exact exited container reconciled the result; no command was replayed.
Build02 passed compiler/tests/release but lacked formatter/Clippy. These failures
are retained. Build03 is the subsequent complete package qualification, using
new audited source rather than retrying an unknown effect.

Audits, source clones and outputs are under
`/mnt/cache/appdata/keida-hub-reborn-updater-foundation-ops-20261028-8c01`;
Bazzite carrier logs are under
`/var/home/keida/Keida-Hub-Reborn-Updater-Foundation-20261028-8c01`.
All remote work used self-hosted Keida Commander, refreshed Bazzite/keidaUID1000
to HomeLab/root, root0400 source/heldFD3 and the existing operation lock heldFD9,
device/inode40:40389844. Historical snapshots remain evidence only.

## Retained main-CI qualification and remaining gates

The preceding documentation PR32 passed headCI74/all24 steps and was accepted as
source0.1.19 at `634774d2678a3a4178d976d38b4d41fb6525d609`. No application source
changed. Accepted-main CI75 attempt1 then observed403 in a retained Activity HTTP
fixture. [Issue34](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/34)
records the evidence and a test-only startup repair: configure the existing
application's ephemeral port0, verify the actual child's owned listening socket,
and accept health only from that endpoint. A released-port reservation and
another fixture's health200 must not satisfy readiness. Existing test bodies,
product admission and timeouts remain intact. The original failure's exact
occurrence was not captured, so this repair is not called proof of that cause.
One unchanged-main rerun is characterization, not permission to ignore the gap.

Publisher/envelope admission, one installed-generation owner, actual host intent/
result binding, process/operation deadlines, final matched backup and current-data
rollback, reboot behavior, bootstrap and uninstall remain unimplemented and
unqualified. No actual updater installation packet is ready for owner approval.
Real owner desktop/mobile/refresh, provider/Discord and wholeM5 acceptance remain
open. Live remains0.1.18/schema13, with useful stopped17/final13 and all protected
services/external owners preserved.
