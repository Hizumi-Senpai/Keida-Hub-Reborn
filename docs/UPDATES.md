# Reborn versions and safe updating

Status: deterministic source identity, immutable manual publication, matched
recovery and M5.1 browser server-change discovery/draft-safe refresh are installed
and runtime-qualified in **Reborn0.1.18/schema13**. [Exact18 evidence](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1#issuecomment-6482571904)
separates head/main CI, artifact, installation, recovery/retention and still-open
owner/provider acceptance. Prepare the host-updater contract and concrete
bootstrap review next, under [the successor handoff](HANDOFF.md). No daemon is
activated by the manual release CLI; activation needs separate authorization.

## Numbered identity for every accepted main merge

Use the development series **0.1.N**, where `N` is the number of first-parent main
commits after a permanent bootstrap anchor. The initial accepted anchor is
`0.1.0`; the next accepted main commit is `0.1.1`. This is an increasing development
identity, not a promise that every merge has the same compatibility contract.

The permanent anchor is the public repository's initial README commit
[`c06c3a03a3be17c4293e77b57fa3063ec65c8ad8`](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/c06c3a03a3be17c4293e77b57fa3063ec65c8ad8).
Its accepted-source identity is `0.1.0`; it contains no application. The initial
documentation bootstrap is the one explicitly authorized direct main commit
after that anchor and therefore has accepted-source identity `0.1.1`, without
implying an application build or release. Verify the actual first-parent history
and source/tree at publication; a branch name, date or mutable tag is not an
anchor. Never substitute Rewrite's anchor or reuse its numbering history; the
manifest must identify the product as `keida-hub-reborn`.

Protect main against history rewrites, deletion and direct pushes after the one
documentation bootstrap exception. Accepted PRs enter main as merge commits or
one-commit squash merges; do not use rebase merging that adds several first-parent
commits for one accepted PR. Every accepted merge, including documentation,
advances N once. Branch
commits are not accepted releases. Keep the anchor on main's first-parent path.
Major/minor series changes need an explicit reviewed policy change; they must
not silently reset or reuse this accepted-source counter.

A Rust identity tool must derive N from the exact clean commit, its full tree
and complete first-parent history. Refuse dirty source, shallow or incomplete
history, a missing/non-ancestor anchor, an ambiguous product or unqualified
accepted-main ancestry. Inject the qualified display version/source metadata at
compile time. Runtime environment variables cannot relabel an installed binary.
Cargo package metadata may remain the source package series; report it separately
from the running numbered identity. Unqualified local builds must say development,
not masquerade as accepted main. The source tool is implemented in tools/source-identity; publication remains a separate gate.

PR candidates can display `0.1.(base-N+1)-preview.<head12>` with their full source
SHA/tree and a preview channel. A preview is provisional and never installable as
an accepted release. Concurrent PRs may preview the same next N; only the actual
serialized main first-parent order assigns the accepted number. Compile/package
the accepted main commit after its own exact-head CI, not the earlier PR preview.

CI retries derive the same identity for the same accepted commit. Publication is
create-once and keyed by product, N, full commit and tree: reuse an existing
matching manifest/artifact on retry and reject conflicting bytes. Bind the first
qualified published image digest and binary checksum immutably. A rebuild must
not silently replace that release; a necessary changed build goes through a new
accepted merge and identity. Publish distinct immutable manifests for distinct
concurrent merges. A serialized, compare-and-update channel pointer may advance
only to a qualified greater accepted ordinal; an older job finishing late must
not move it backwards. A deliberate rollback is an explicit installed-target
operation, not a rewrite of release history. No bump commit or workflow writes
back to main, so there is no recursive version-bump workflow or racing increment.

## Four identities, four different facts

| Identity | What it establishes | Authority |
| --- | --- | --- |
| Accepted source | Product, numbered version, full commit/tree and accepted ordinal | Protected Git history and exact-head CI |
| Published artifact | Immutable image digest, binary checksum, provenance and compatibility manifest for that source | Qualified publisher |
| Installed server | Exact artifact currently serving requests | Fresh host receipt plus actual runtime identity |
| Loaded browser | Identity embedded in the document the user loaded | That response; it changes only with a new document |

Merging does not prove publication, installation or browser refresh. A healthy
container does not prove signed-in workflow or visual acceptance. A version string
alone cannot distinguish products, source trees or rebuilt image bytes.

Plan one compiled identity record containing product, display/package version,
full commit, source tree, accepted ordinal, channel and browser interface contract.
Expose its safe public fields through `/api/health` and `/version`, with no-store
responses and an exact source link. Keep image digest/provenance in the artifact
manifest and host receipt; a compile-time source identity does not prove which
image the host installed. Verify image labels, packaged binary metadata, runtime
health and rendered badge against the same manifest before declaring agreement.

The running badge belongs by the authenticated sidebar's Sign out/account area
and in the public footer, in normal desktop/mobile flow. Show a readable version
and short revision with keyboard-accessible exact details. Keep routine current
status quiet, reserving prominent space for an actual version change or problem.
Do not query GitHub to label a page as running the newest accepted version.

## Discovery and deliberate browser refresh

Start with a same-origin no-store identity check comparing the loaded page to
the server actually responding. Separately, an administrator can see a verified
published-release notice from the enrolled host updater's sanitized status.
Available, selected, installed and loaded identities must never collapse into
one ambiguous "updated" state. An older installed build after rollback is also a
change. A different product, such as Rewrite becoming Reborn at the same URL,
must show an explicit transition and fresh sign-in path rather than a transparent
compatible refresh.

The normal path is a clear notice and a deliberate user-requested GET refresh.
Do not introduce a service worker merely to refresh server-rendered pages. Keep
ordinary links/forms functional when the enhancement is unavailable. Browser code
cannot install a Rust binary, choose arbitrary image URLs, execute host commands
or claim that refresh upgraded the server.

Track dirty fields and in-flight form submissions. Before replacing the document,
offer to finish/save, stay, or deliberately discard and refresh. Never silently
clear a form, automatically reload, replay a POST or persist passwords, API keys,
CSRF tokens or session cookies into browser storage. Do not promise draft transfer
across incompatible documents; retain the existing page until the user decides.
Session persistence requires compatible server-side records and the matching
instance key, not browser replay of credentials.

Readiness checks must validate product, identity format and browser interface
compatibility, then use an appropriate authenticated probe for the protected page.
An HTTP 200 sign-in/error document is not a successful dashboard reconnect.
Expired/revoked sessions require the ordinary fresh form and normal CSRF/cookie
rules; never reset credentials or replay a previous submission. A check does not
replace the loaded document or prove that its old controls remain compatible.

Keep the exact immutable manifest and JS/CSS/Wasm lazy chunks for every supported
loaded-client version, including compatible rollback clients. Never serve a newer
module under an old asset URL. Mutation and stream endpoints admit the client's
product/interface contract and current authorization; incompatible clients receive
an explicit upgrade-required outcome before effects. Close incompatible old
streams honestly. Retention is bounded by the declared support/recovery window;
an unsupported old page must fail clearly rather than mix releases. Verify lazy
room entry and pending operations across deployment and rollback, including a user
who deliberately stays on the old page.

Use a monotonic total reconnect budget of **60 seconds**, individual request
deadlines of **4 seconds**, cancellable retries and backoff capped at **10 seconds**.
The total budget includes all requests and waits; a hidden tab or delayed timer
must not silently extend it. End in an explicit compatible-ready,
sign-in-required, incompatible or could-not-reconnect state. Cancellation stops
future requests and prevents late responses from changing the selected page state.
Retain the document on failure and offer a deliberate bounded retry or safe GET.
Issue29 implements these constants; its exact browser/runtime qualification
is tracked separately from this contract.

## One separately enrolled host updater

Actual server replacement belongs to one host updater, outside the web application
and browser. [DEPLOYMENT.md](DEPLOYMENT.md) owns independent PostgreSQL/data/key/
network resources, fresh shared-host coordination, consistent backups, isolated
candidate checks, write fencing and matched recovery. Do not mount the Docker
socket, install a second updater, create a competing application/database authority
or add game wake/sleep/update ownership. Reborn does not control the original Hub,
Rewrite, shared tunnel/proxy, games or existing host workers.

The planned operation sequence is:

1. **Discover:** obtain a publisher-authenticated manifest through an allowlisted
   channel. Verify the publisher/provenance chain, digest and manifest binding;
   an untrusted checksum beside an untrusted image is insufficient.
2. **Select:** bind one exact target product/version/source/digest to the current
   installed identity, architecture and supported application/database/browser
   compatibility ranges. Stable does not automatically select preview builds.
3. **Admit:** authorize the narrow requested operation; take the single operation
   lock, compare current host state again and reject stale/conflicting requests.
   Stable operation IDs deduplicate retries; uncertain effects require inspection
   and reconciliation before another attempt.
4. **Prepare:** require accepted-main CI and qualified packaged checks, validate
   the candidate against isolated PostgreSQL data, reconcile in-flight work,
   quiesce Reborn writes, create the matched backup/key/asset recovery set and
   retain the useful prior image/container and deployment configuration.
5. **Install/check:** replace only the owned Reborn application, with one active
   mutation authority. Verify exact artifact/runtime identity, database readiness,
   public HTTPS and the relevant authentication/HTTP/browser workflow. Record
   installation and browser acceptance separately.
6. **Recover:** on failure stop only the owned candidate. Prefer the compatible
   prior binary with current data. Do not restore an old PostgreSQL/key/asset
   snapshot over newer writes. Incompatible recovery needs an explicit reviewed
   restore/write-reconciliation plan and isolated rehearsal. Preserve a durable
   terminal receipt; failed or uncertain operation states must remain honest.

Before **activation**, CORE must present a concrete bootstrap review covering the
actual updater source/binary/digest; supported operations; installation paths,
ownership and privileges; fresh competing-updater inventory; request/status/lock
protocol; manifest trust and credential scope; exact network/container targets;
compatibility and backup/restore rehearsal; rollback, uninstall and failure recovery.
The owner must separately authorize that concrete host-updater installation. This
is not a request to reapprove ordinary CORE work already authorized in the session.
No service, daemon, scheduler, privileged mount or bootstrap is activated here.

## Implementation and acceptance still required

- Identity: real-history tests cover two concurrent merges, PR previews, retries,
  a late old publisher, conflicting artifacts, dirty/shallow/missing-anchor
  refusal and main-history protections. Verify no recursive bump commits.
- Source: pinned Rust1.99.1 formatting/all-target checks, Clippy-D and release
  tests/build; actual HTTP/authentication checks at the exact eventual accepted
  head. Report Linux execution explicitly; Windows acceptance remains separate.
- Artifact/runtime: exact source/tree/version agreement among image metadata,
  packaged binary, manifest, badge and health, with a qualified immutable digest.
- Browser: desktop/mobile/keyboard badge and notice; current/changed/rollback/
  cross-product identities; dirty and secret forms; interrupted submissions;
  no credential persistence/POST replay; authentication/compatibility failures;
  timeout, cancellation, retry and terminal-state behavior.
- Host: separately reviewed/authorized bootstrap, fresh ownership, consistent
  PostgreSQL/key/asset backups, isolated restore and failed-upgrade recovery with
  newer-write preservation, plus exact public and signed-in acceptance.

Record implemented source, CI, published artifacts, installation receipts and
owner/browser acceptance separately in the new repository's checkpoints/tracker.
Preserve the existing Rewrite and original-Hub checkpoint histories. The current
manual18 installation is qualified under the receipt above; automatic host
updating still needs its own concrete review, authorization and actual evidence.
Neither installed source nor fixture CI closes real owner/provider acceptance.
