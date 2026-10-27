# Personal Home arrangement

Scope frozen in [issue16](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/16)
after installed0.1.10/schema7. This is a candidate slice; source, exact artifact,
installation and actual-owner browser acceptance remain separate.

Each authenticated account owns one revisioned layout covering the existing note,
connections and pinned-service panels. All three stable IDs occur exactly once,
with at least one visible. No saved row means the default all-visible order at
revision0. Rust validates the complete bounded document; PostgreSQL constraints
repeat its vocabulary, shape, visibility and ownership invariants. The deliberate
PUT carries its observed revision and rechecks current authority under the shared
lock. Conflicting writers cannot overwrite each other. Personal arrangements
create no Activity entries or shared notifications.

Customize Home previews native checkbox and keyboard up/down controls. The keyed
panel list moves existing DOM/components in reading order; it preserves note and
service form drafts. Hidden Home pins remain available through Services. Reset
previews the default; Save applies it, and Cancel returns to the checked layout.
The existing single poller retains current authorization without replacing a
local arrangement. A committed response lost to the request deadline is marked
uncertain and reconciled by deliberate authorized GET, without automatic PUT
replay. Conflict comparison retains the local document until an explicit choice.
Account/visibility loss cancels and clears private in-memory layout state.

Schema8 is additive; accepted migrations1–7 and exact0.1.10/9/8/7/6 browser bytes
remain immutable. Schema7 binaries refuse schema8: prior-binary/current-data
rollback is unsupported. Preserve newer writes for reviewed forward/manual
recovery. Required checks include real PostgreSQL/HTTP concurrency, scope and
upgrade contracts, ten native/exact-image Rust HTTPS browser workflows, packaged
two-account layout restore/newer-write proof, exact eventual-head and main CI,
and freshly reviewed current-data7→8/matched backup recovery before installation.
Real-owner desktop/mobile and real Crafty acceptance remain separately open.
