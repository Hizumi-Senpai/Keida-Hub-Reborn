# Keida Hub Reborn deployment contract

Status: deployment contract. Rust/browser source and isolated fixture execution
are tracked in CURRENT_STATE.md and issues1/3. Reborn has no published image,
production database, installed service or accepted public deployment. The rules
below describe the packaged/operational acceptance still required.

At this planning checkpoint, `https://rewrite.keida.me` serves **Keida Hub
Rewrite v0.1.4**, not Reborn. Its eventual reuse for Reborn is reserved; creating
this repository does not change that route. Keep `https://keida.me`, the existing
Rewrite installation and all shared services operating unchanged. No DNS change,
proxy/tunnel restart, bootstrap execution or updater activation belongs to this
documentation stage. Refresh the actual live identity before any later action;
these recorded values are not a substitute for that inspection.

## Independent deployment and ownership

The planned default has one Reborn application container and a dedicated
PostgreSQL service. PostgreSQL is Reborn's durable database authority. Multiple
application pool connections do not create separate application authorities;
there must be one serialized migration owner and one application owner for each
mutating responsibility. Do not run competing old/new applications against the
same production database during validation or replacement.

Reserve fresh names and resources only after inventory. A proposed data root is
`/mnt/user/appdata/keida-hub-reborn`, with independently owned application assets,
private instance keys and PostgreSQL data. This path is a proposal, not evidence
that it is empty, available or created. Store recovery archives in a separately
identified private backup location. Do not reuse Rewrite's SQLite directory,
instance key, cookies, secrets, volumes or database; do not mount the original
Hub's configuration or PostgreSQL resources belonging to another application.

Use a dedicated Reborn network, database name and scoped application role.
PostgreSQL is reachable only by its enrolled application/administration paths,
not through a new public database port. Pin application and database images by
digest and record the supported PostgreSQL major version. Do not use floating
`latest` tags as installed identity. Create Reborn-specific secret material and
protected owner enrollment; never expose an unclaimed first-visitor owner form.
Database credentials, instance keys and reusable passwords never enter Git,
public status, screenshots or deployment receipts.

The host origin and port remain **unassigned** until CORE performs fresh
discovery. Rewrite's recorded `192.168.1.135:8790` is not a Reborn reservation;
neither an old address nor `localhost:8790` authorizes attaching to a service.
Record the selected address, container/network identity and actual listener
after checking for conflicts. Do not rename an unexpected existing resource to
make a proposed name available.

Reborn receives no Docker socket, host shell, deployment-worker mount or broad
host privilege. The application cannot replace itself. The separately reviewed
host updater in [UPDATES.md](UPDATES.md) is the only eventual automatic replacement
owner. Existing games, Crafty/Pelican controllers, join listeners, shutdown
owners and update/backup workers retain their current assignments. Read-only
provider integration does not transfer game-action ownership. No second game
owner, scheduler or SQLite writer may be introduced as a migration shortcut.

## CORE execution preflight

CORE alone integrates, merges, deploys, coordinates shared-host work and records
deployment checkpoints. Immediately before a host operation, refresh:

1. Repository main/head, candidate CI, artifact digest and existing deployment
   receipts; open branches and unpublished worker work remain protected.
2. Host identity, relevant containers/images, exact mounts/networks/ports,
   process start identities and command ownership, active jobs and operation locks.
3. Bridge checkout/session ownership, pending commands, shared tunnel/proxy
   ownership and the exact route currently serving the intended public URL.
4. Reborn resource ownership, database/migration state, secret-file permissions,
   available backup/recovery resources and any existing host updater.

Do not replay a historical bridge command or use a shared mutable pending file.
Prepare a new private execution snapshot, review its exact bytes, seal it
immutable, hash-verify immediately before execution and record the executed
hash/source plus authorization. A preview hash is insufficient if the executed
file can change afterward. Never overwrite another project's pending work.
Diagnostics are bounded by scope, output and wall-clock time. Unknown processes,
locks or resource ownership block the dependent mutation; broad killing/pruning
and assumed appliance tools are prohibited.

No operation may restart the original Hub, shared tunnel/proxy, active games or
another owner's worker. An original managed-game restart remains outside Reborn
deployment: it requires fresh complete enrolled zero-player evidence, zero
pending/accepted/established proxy clients and a held join fence. Unknown blocks.

## Source and candidate gates

Use pinned Rust **1.99.1**. The exact eventual accepted main head must pass
formatting, all-target checks, Clippy with warnings denied, release tests/build
and focused actual HTTP/authentication verification. Exercise database migrations
from supported prior schemas with representative data. Preserve independent
expectations rather than translating implementation output into expected results.
Record the operating system actually executed: Linux checks prove Linux behavior;
they do not establish Windows execution or acceptance.

Build only the qualified exact source and bind its numbered identity, full commit
and tree to the immutable image digest and release manifest. Validate the packaged
binary, image labels and health response against that manifest. A successful PR
preview is not an accepted-main release. [UPDATES.md](UPDATES.md) defines numbering,
publication and browser identity separately.

Validate a candidate on isolated PostgreSQL data, keys, assets, network and origin;
it must not write production state or invoke real game/provider mutations. Verify
startup, migrations, protected owner enrollment, sign-in/session behavior, health,
source identity, relevant forms and failure paths in the packaged image. The
public URL remains on Rewrite while these checks run. No active shadow writer or
public first-run instance is an acceptable validation fixture.

## Consistent backup and matched recovery

Before an installed Reborn replacement, identify and hold the Reborn operation
lock. Quiesce only Reborn mutators and reconcile in-flight commands; do not replay
an uncertain provider effect to drain work. Capture a consistent PostgreSQL
backup with its schema/migration state, role/ownership recovery requirements,
application configuration, matching instance/encryption keys and referenced
asset manifest/blobs. Keep these as one private recovery set with image/source
identities, timestamps, checksums and the write-fence boundary. A database-only
dump cannot recover encrypted secrets without its matching key.

A qualified PostgreSQL logical dump is internally consistent, but does not by
itself capture external keys/assets or cluster-wide roles. Choose and document
the actual logical or physical/PITR backup method and supported database/tool
versions before bootstrap. Never treat a live filesystem copy of PostgreSQL's
data directory as a qualified backup. The [PostgreSQL backup guide](https://www.postgresql.org/docs/current/backup.html)
and [dump contract](https://www.postgresql.org/docs/current/backup-dump.html)
are the implementation references; this document installs no backup schedule.

Retain the previous useful application container/image, its deployment settings
and its matched recovery set. Rehearse restoration into a separate isolated
PostgreSQL instance and verify authentication, encrypted-secret decryption,
assets and source identity without sending real external actions. A successful
backup command alone is not recovery acceptance. Retain at most one useful
matched application rollback after replacement acceptance; temporary overlap is
necessary, and older retained checkpoints must not be removed prematurely.
Never prune unrelated PostgreSQL, game, Rewrite or original-Hub resources.

Prefer compatibility-preserving migrations so the prior binary can run with the
**current** database after a failed replacement. Stop only the owned candidate
before reselecting a prior writer. Never automatically restore an old database,
key or asset snapshot over newer writes. If the old binary cannot safely use
current data, fence Reborn writes, preserve current state and require a concrete
recovery plan with isolated rehearsal, write reconciliation and explicit data-loss
scope before any destructive restore. A rollback image is not permission to
discard accepted work. PostgreSQL major upgrades have their own tested migration
and recovery plan; they are not implicit application replacements.

## Eventual public URL cutover

Before reusing `rewrite.keida.me`, CORE must have all of the following concrete
evidence. The future routing action must stay inside its separately established
authorization; this documentation stage performs none of it.

- Exact Reborn main/CI, immutable artifact, isolated packaged checks and a healthy
  private origin with matching badge/health/manifest identity.
- Fresh route/host ownership, an allocated conflict-free origin and a reviewed
  scoped route-change/reversal method that does not restart shared services.
- A preserved Rewrite container/image, its own SQLite/key/data recovery set and
  recorded working route. Do not convert its data directory in place or stop it
  merely to reserve the URL. Any account/data import is a separate validated
  migration with explicit scope; no original-Hub credentials are copied.
- Reborn-specific session/cookie identity and safe fresh sign-in behavior.
  Rewrite sessions must not be interpreted as Reborn credentials just because
  the URL is the same. Preserve existing Rewrite credentials for route rollback.
- A write-fence/cutover boundary, matched recovery evidence and an honest user
  transition notice. A cross-product change is not a same-product hot update.
- Public HTTPS, version/health/artifact agreement, desktop/mobile navigation,
  protected sign-in and the relevant signed-in browser workflow after routing.
  A login page or HTTP 200 alone is not signed-in acceptance.

On cutover failure, restore the reviewed route to the preserved Rewrite origin
without mixing databases or session authorities. Preserve any newer Reborn writes
for reconciliation; routing back does not authorize overwriting either product's
data. Keep source, installed health and owner/browser acceptance separately
recorded. No original feature or responsibility is retired by the URL change.

## Required receipt and current acceptance

Each eventual operation records its authorization, fresh ownership inventory,
executed snapshot hash, source/version/tree, CI run and actual OS, application and
database image identities, selected origin/network, private recovery-set reference,
health/HTTP evidence, public/browser result and terminal success/failure/recovery
state. Record limitations and pending owner acceptance explicitly. Preserve prior
checkpoint history rather than replacing it with an unqualified success claim.

Current deployment acceptance: **not installed**. Source/fixture CI is separate
from host bootstrap, updater activation, immutable publication, production
migration, URL cutover and public/provider acceptance; all remain open.
