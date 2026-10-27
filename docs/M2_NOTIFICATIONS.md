# Grouped shared-change notifications

Tracked in [issue14](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/14).
This M2 slice adds a quiet per-account inbox inside the existing persistent
Svelte workspace. Activity continues to describe the acting account's own saves.

Successful shared service create/update/delete and Crafty enrollment replace/remove
operations deliver to other currently active accounts in the same PostgreSQL
transaction. Notes, pins, GETs and provider observations deliver nothing. An account
created later receives future changes only. Inactive accounts receive no delivery;
existing groups/read markers survive inactivity. There are at most two rows per
recipient: Services and Connections. Delivery uses one SQL fanout over active users;
its write cost grows with the enrolled account count and has no performance claim.

Each group stores a delivered-change counter, read-through watermark and safe
latest-action metadata (allowlisted kind/label, domain revision and timestamp).
No names, note content, URLs, actor identities or provider payloads are copied.
The badge counts unread groups, at most two. Opening the inbox never marks read.
An explicit read acknowledgement advances only through the displayed revision;
a racing later delivery stays unread. Duplicate/older acknowledgements are
idempotent; future watermarks conflict. Read state belongs to the server-derived
account, never a client-selected recipient. Updates and read markers share the
existing final authentication/key/session check under the transaction authority lock.

The workspace snapshot includes groups and reuses its visible 15-second read owner.
There is no extra poller, background job, toast, OS notification or provider call.
A lost acknowledgement leaves an uncertain result, blocks another acknowledgement
and requires checking current saved markers; the browser does not replay the PUT.
Navigation preserves actual note/form nodes and unfinished drafts. Privacy loss
cancels requests and clears groups, badge and local Show read groups state; late
responses cannot repopulate a cleared account/session scope.

Schema7 adds notification_groups. Accepted migrations1–6 remain immutable; there
is no historical notification backfill. The runtime can SELECT/INSERT/UPDATE the
notification groups but cannot DELETE them; Activity remains append-only. Schema6
binaries refuse schema7. Exact0.1.9,0.1.8,0.1.7,0.1.6 browser assets remain embedded.
A qualified current-data upgrade and matched backup/key/config restore are required
before replacement. Never overwrite newer writes with an old backup.

Verification covers real PostgreSQL/HTTP isolation, read/update races, inactive/new
recipients, failed transaction rollback, strict request admission, restart and actual
schema6 upgrade. The Rust HTTPS browser workflow exercises grouping, persistent
editor/draft lifetimes, racing/lost replies without replay, read-marker reload,
privacy clearing, desktop/390px accessibility and reflow. Packaged two-cluster
recovery checks member inbox/read state and preserves a newer delivery and read
watermark after a failed candidate, alongside all prior recovery expectations.
Source, CI, exact image, installation, actual owner browser and real provider remain
separate evidence gates; M0/M1/full M2 remain open.
