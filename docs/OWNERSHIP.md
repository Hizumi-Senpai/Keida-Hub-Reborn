# Ownership and preserved projects

The owner authorized Reborn as a fresh project on 2026-10-25. This does not delete,
archive, rewrite or cancel work in the two earlier repositories.

| Surface | Current authority |
| --- | --- |
| Original https://keida.me | Original Hub and its existing game/proxy/update owners |
| https://rewrite.keida.me before Reborn cutover | Keida-Hub-Rewrite v0.1.4 |
| Reborn main/merges/deployment/checkpoints | One active CORE |
| External worker branches/unpublished work | Their existing workers, with scopes preserved |
| Reborn browser/3D renderer/AI | Presentation only; no host or provider authority |
| Future server updater | One separately reviewed/authorized host owner |

## Refreshed preservation inventory

At bootstrap, Rewrite main is `51e0f5625dd6e8518db8f324e447af2b62f69adf`;
all14 branches remain and there are no open Rewrite PRs. The prior CORE branch
`work/core-rust-boundaries-20261025-2aa83d6f` remains at
`501a6cbcc6a1c6a2c10e563e88e9d120591c2735`. Do not delete or reuse old worker
branches to bootstrap Reborn. Reborn starts with independent history.

Original main remains `f65cc4e372125a5cf64e0673248c71d89302e037`. Open original PRs
were #235 (`abc2cb68e40835e22cafa630fa45bf500f326300`), #214
(`01e59ed7bca137c2688218b9913ede53af3d280f`), #207
(`a85215f338a7bb733167095d5452b41ec19ef7b2`) and #134
(`a8f0c57f9a9766452c3a7ae1e8db462b16b18b1b`). Their continued existence is not a
request for Reborn CORE to merge or supersede them. Original branch inventory also
contains newer preparation/probe branches; leave them intact and refresh before
future coordination.

HUB-DEPLOY/HUB-COVERAGE's last recorded queued-wake cohort was accepted in the
original repository, while the larger production state transfer remained unfinished.
This record assigns them no new work and makes no claim about unpublished progress.
Do not re-task an external chat without a fresh scoped assignment and coordination.

## Runtime boundaries

Recorded Rewrite origin192.168.1.135:8790, `/mnt/user/appdata/keida-hub-rewrite`,
its instance key, SQLite database and network remain its own. Reborn will use a
new PostgreSQL database/service, key/config and asset storage. No implicit data,
session, password or provider-key migration occurs. Reusing the public origin
requires distinct cookie/storage names and deliberate account enrollment.

No game wake, stop, auto-sleep, proxy admission or modpack updater ownership is
transferred by a read-only provider adapter. An accepted transfer must name every
writer/reader/listener/scheduler and its recovery path. Unknown player/client
evidence blocks maintenance. Do not replace an active updater or restart shared
infrastructure to prove a feature.

## CORE handoff

Only one chat acts as integrator. This bootstrap CORE finishes its documentation
checkpoint and stops shared mutations after delivering the handoff. When the owner
starts the fresh chat with docs/HANDOFF.md, that successor refreshes ownership and
begins M0 immediately. It does not wait for an unassigned worker or assume a saved
session/process exists. A separate competing implementation must not share Reborn
production write/deploy ownership.
