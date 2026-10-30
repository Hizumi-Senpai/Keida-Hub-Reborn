# M5.7 read-only Unraid namespace probe

[Issue41](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/41) implements
the first concrete Rust caller after the [namespace/origin contract](M5_UPDATER_NAMESPACE.md).
The [independent expectations](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/41#issuecomment-6502602267)
were frozen before implementation. This is a diagnostic observation, not an
enrollment, capability for another caller, installed authority or updater executor.

## Exact invocation and fixed subject

```text
reborn-host-updater probe-namespace
```

Only Linux x86_64/EUID0 is supported. No trailing arguments, flags, paths, URLs,
numeric descriptors, handles or fixture mode are admitted. No environment variable
selects a namespace, root, authority, executable or operation. Existing
check-request/check-bundle dispatch, strict path readers and journal bodies remain
unchanged; the historical CURRENT18/schema13 packet is not extended to current14.

The private module opens `/` and then fixed single components through held
O_PATH/O_NOFOLLOW/CLOEXEC descriptors. It checks directory type/UID/GID/exact mode,
and regular/root0600/single-link admission for the existing operation.lock, before
any directory read-open. Only the two narrow Unraid appliance ancestors admit
UID99:GID100/mode0777; generic path parsers gain no exception.

| Fixed subject | Observation |
| --- | --- |
| / and /mnt | Root-owned0755 directory identity |
| /boot and /boot/config | Root-owned0700, actual FAT type/volume ID and the same current mount |
| /mnt/cache and appdata | Actual Btrfs filesystem/subvolume identity and both admitted appliance ancestors |
| Existing keida-hub-reborn app root | Root-owned0700, named/held metadata and opaque handle |
| Existing permanent operation.lock | Root0600 regular single-link identity, metadata-only handle reopen; no flock or contents read |
| app-root/updater and boot/config/keida-hub-reborn-updater | Presence only, including a present non-directory/symlink; no validity or enrollment claim |

The probe does not enumerate provider configuration or read a key, DSN, database,
credentials, installed selector, authority record, journal or private application
content. It executes no Docker, shell, network, mount, repair or write operation.
Its only byte input outside metadata is the bounded kernel boot UUID.

## Held identities and final report

statx supplies an actual mount ID for each held object; missing support refuses.
Metadata includes device/inode/mount, ownership, type/mode, links, size and mtime/
ctime. Atime is excluded because directory metadata queries may affect access
accounting. FAT_IOCTL_GET_VOLUME_ID reads the volume ID through an admitted
read-only directory descriptor. Both boot directories must agree on volume/type/
mount before and after the probe. Btrfs FS_INFO and GET_SUBVOL_INFO use fixed
Linux64 UAPI sizes/offsets through held descriptors; all three cache directories
must agree on filesystem/subvolume identity.

Each of cache/appdata/app/lock is captured from its admitted descriptor with
AT_EMPTY_PATH, without re-resolving an unchecked whole pathname. The selected
profile requires an opaque type77/20-byte handle. No guessed inode fields are
decoded, no allocation follows an excessive returned size, and no path/dev-number
fallback follows failure. open_by_handle_at uses O_PATH/O_NOFOLLOW, compares the
reopened metadata, recaptures the handle, and requires its actual mount ID to
match the held filesystem descriptor. Final checks repeat named/held identities,
handles, filesystem/boot observations and proposed-path presence.

Success prints one JSON line only after all checks. Format1/profile
unraid-read-only-namespace-probe-v1 contains boot UUID/boottime, boot filesystem
and metadata, Btrfs UUID/subvolume, four fixed-path metadata/handle observations,
and the two presence flags. These always remainfalse:

```text
effects_authorized,adoption_performed,execution_ready,writer_lock_acquired
```

Mount IDs/device/inode numbers are current-boot observations, not durable authority.
UUIDs do not authenticate a publisher or protect against filesystem cloning.
Present paths are not validated enrollment. The probe neither acquires a writer
lock nor claims ownership of an inherited audit lock. A NEW audited operator launch
can independently hold the actual permanent application lock through the child.

Any failure exits2 with no partial stdout and exactly this stderr line:

```text
namespace probe refused; no effects authorized
```

Permission/capability loss, unsupported filesystem/handle shape, ESTALE, path or
metadata drift, unknown mount identity and more than2 seconds elapsed refuse.
There is no automatic permission fix, allocation or alternate root. Audited host
qualification additionally runs the child with a separate bounded deadline.
Concurrent namespace changes can cause conservative refusal. Before/after checks
do not claim to prevent a malicious root or all uncooperative rename races.

## Qualification and scope of evidence

[The reviewed receipt](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/41#issuecomment-6535660145)
retains exact source/binary hashes and immutable audits. Pinned Rust1.99.1 package
fmt/all-target checks,49 tests, Clippy-D and locked release passed. The eight new
checks comprise actual CLI argument/nonroot refusal and six disposable OS cases:
held-parent rename/substitution; metadata-only FIFO/socket/symlink admission;
hardlinked/symlink/replaced lock refusal; mode/owner/metadata disagreement;
absence versus non-directory errors; and explicit unsupported tmpfs refusal.

All six OS cases also ran natively under root with new private Btrfs fixtures.
Their test-only TMPDIR selects disposable fixture storage, never the production
probe root. A long native audit pathname initially exceeded the Unix-socket path
limit; a NEW diagnostic captured that exact failure before the test alone changed
to bind through its held fixture directory. No fixture was skipped and no product
deadline/refusal changed. The release binary stayed byte-identical.

The strengthened native probe observed FAT8079-7391 and matching boot/config
mount28; Btrfs649ec41d-5d49-457d-a1e1-5caf1dacd77c, subvolume5/
db75f63f-1e22-4ac4-a07c-ac9cf37b8e70; four matching type77/20-byte handles on
mount50; original app40389843/lock40389844; and both proposed updater paths absent.
App-root footprint and manual installed/state bytes, all existing containers,
network and Original worker identities were unchanged. Only private preparation,
audits/builds and disposable test fixtures were written; no production or boot
namespace allocation occurred. Exact eventual-head and accepted-main CI remain
required source acceptance gates, recorded in issue41 and its PR.

This establishes the diagnostic slice and its named OS cases. It establishes no
inode-reuse, actual reboot, power-loss durability, permission/capability recovery,
authority-origin transaction, executor, game responsibility transfer or full M5
completion. The next separate slice is a private validated namespace constructor
with one actual journal caller, followed by origin and executor/failure/reboot/
current-data-rollback/uninstall qualification. Installation/activation approval is
due only after that complete concrete packet exists. Live remains0.1.24/schema14.

## Primary API references

- [Linux opaque handles](https://man7.org/linux/man-pages/man2/open_by_handle_at.2.html)
- [Linux statx mount identity](https://man7.org/linux/man-pages/man2/statx.2.html)
- [Linux FAT volume ID](https://man7.org/linux/man-pages/man2/FAT_IOCTL_GET_VOLUME_ID.2const.html)
- [Btrfs ioctl UAPI](https://github.com/torvalds/linux/blob/master/include/uapi/linux/btrfs.h)

These define mechanisms and ABI shapes, not this host's reboot or recovery proof.
