# Manual alpha package and release qualification

`reborn-release` is CORE operational tooling, not an application endpoint,
installation daemon, host updater or game controller. Its actual CI caller is
`.github/workflows/foundation.yml`; the current session slice is frozen in
[M4_SESSIONS.md](../../docs/M4_SESSIONS.md), alongside the retained provider and
Discord recovery contracts.

`inspect-image IMAGE_ID COMMIT TREE VERSION CHANNEL PRIVATE_OUTPUT` verifies the
repository Docker image's default UID65532, entrypoint/healthcheck, OCI labels,
actual packaged `artifact-info`, source/tree/version/channel/schema/client assets,
extracted binary checksum and saved archive checksum. It creates `image.tar` and
`image-proof.json` once in a precreated private0700 directory. The actual Rust
browser suite is then repeated through that image. The disposable browser app
uses the fixture owner's unprivileged UID so its0700/0600 test files remain private;
default UID65532 is separately exercised by the image entrypoint inspection.

`rehearse-image IMAGE_ID PRIVATE_OUTPUT` provisions only newly named disposable
PostgreSQL/app containers and private loopback endpoints. It uses a separate
migration role and constrained web role, protected owner claim, a saved note and
an encrypted dedicated HTTPS fixture connection. It quiesces that fixture writer,
captures a real PostgreSQL custom dump with its matching key/configuration, and
restores into a **different PostgreSQL container/cluster**. Native session/note
and secret decryption must work after restoration. The app role must be unable to
alter schema or write migration admission. A failed candidate must leave a newer
accepted write intact; no old dump is silently restored over it. The nonsecret
`recovery-proof.json` explicitly labels its fixture scope. Only newly allocated
container names and private fixture files are cleaned; no live data is accepted.

Schema13 additionally uses genuine fictional-account logins to create independent
sessions, revokes one other session, and verifies its actual token receives401
while the acting, third and unrelated member sessions remain usable. A digest of
all stored session columns, including UUID selectors and the revoked row, must
match across the real dump/restore before any new login can prune inactive rows.
New sessions and a second targeted revocation after restoration must survive the
failed candidate and the current writer's restart. Only after these checks pass
are `restored_session_selectors_and_targeted_revocation` and
`preserved_newer_sessions_and_unrelated_access` emitted as true. Existing
Discord, media, queue and other domain proofs remain required. No bearer,
selector, CSRF value or private session list enters the public report.

`publish ROOT MANIFEST ARCHIVE REPO EXPECTED_MAIN CI_RUN` requires a private0700
release root, exact accepted-source derivation through the sibling Rust identity
tool and fresh public GitHub main/CI verification. The caller must first obtain
the exact successful main run's immutable image artifact through the authenticated
GitHub connector, verify its GitHub artifact digest, and compare the proof,
archive, loaded image and packaged metadata before composing the manifest. This
is a trusted CORE-only input boundary, not an API accepting arbitrary manifests
or image URLs. Record the private immutable execution hash and GitHub artifact
ID/digest in the deployment receipt. No original credentials are read or copied.

The versioned manifest binds product/ordinal/source/tree, accepted channel,
workspace contract/schema, binary/image/archive hashes, actual reviewed execution
hash, exact-main CI and immutable asset hashes. Publication takes one operation
lock, writes/fsyncs a private stage and publishes each numbered directory once.
Matching retries reuse it; conflicting bytes refuse. The channel advances only
to a greater accepted ordinal, including when an older publisher finishes late.
An uncertain/stale lock is inspected, never automatically deleted. Publication
does not change any installed selector. `verify ROOT ORDINAL` rechecks the stored
manifest/archive. Filesystem unit/race fixtures are not image or live acceptance.

CI uploads only the image and nonsecret image/recovery proofs. It never uploads
database dumps, keys, credentials, authenticated screenshots or storage state.
Linux is the executed platform. Windows, native iPhone/Safari, outside-LAN game
joining, real provider acceptance and workload performance stay separate.

The sessions slice keeps the same workspace contract and retains all20 baseline
workspace assets plus its new hashed JS/CSS pair. Image inspection requires the
current22-asset manifest. Retaining assets does not qualify the prior
schema12 binary on schema13. Actual12→13 qualification must compare every legacy
session column without treating the newly backfilled `public_ref` as an old
column; full schema13 recovery includes and preserves it. Upgrades must qualify
their actual old-page, asset and data window, with no automatic older-dump restore
over newer writes.

Primary contracts: Crafty's official [OpenAPI](https://docs.craftycontrol.com/pages/developer-guide/api-reference/openapi-spec.yml),
[ring AEAD](https://docs.rs/ring/0.17.14/ring/aead/),
[PostgreSQL backup](https://www.postgresql.org/docs/16/backup-dump.html), and
the pinned GitHub [artifact uploader](https://github.com/actions/upload-artifact/tree/cf430e030ddbb5b0abf93d22962f4752f3646cd9).

The browser-refresh slice keeps schema13 and all22 existing assets, adding its
new pair for a24-asset manifest. Its supported prior17 binary must be checked
against current schema13 data and newer writes; no schema migration is needed.
