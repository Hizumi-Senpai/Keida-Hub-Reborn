# Manual alpha package and release qualification

`reborn-release` is CORE operational tooling, not an application endpoint,
installation daemon, host updater or game controller. Its actual CI caller is
`.github/workflows/foundation.yml`; the frozen scope is docs/LIVE_ALPHA.md.

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

The first alpha has one supported workspace contract and no lazy renderer chunks.
The accepted0.1.6 JS/CSS bytes are additionally retained at their original immutable
hashes. There is no previous installed Reborn release; source retention alone does
not qualify a previous binary on schema4. Future upgrades must qualify their
actual supported old-page/asset/data window. The first cross-product rollback
returns the preserved route to Rewrite while retaining all newer Reborn data.

Primary contracts: Crafty's official [OpenAPI](https://docs.craftycontrol.com/pages/developer-guide/api-reference/openapi-spec.yml),
[ring AEAD](https://docs.rs/ring/0.17.14/ring/aead/),
[PostgreSQL backup](https://www.postgresql.org/docs/16/backup-dump.html), and
the pinned GitHub [artifact uploader](https://github.com/actions/upload-artifact/tree/cf430e030ddbb5b0abf93d22962f4752f3646cd9).
