# Browser asset support and retirement

Status: candidate implementation for [issue43](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/43).
This contract does not establish publication, installation or owner acceptance.
The live0.1.18 installation and its historical receipts remain unchanged.

## Finite shipping window

Ship at most three distinct browser generations: the current workspace bundle
and two explicitly reviewed predecessor bundles. Each generation is one immutable
JavaScript/CSS pair, so the shipping window has at most six unique URLs. This
tile candidate changes both outputs and its artifact manifest has exactly six.
Source-only merges do not create a browser generation or extend this window.

The tile candidate retains the exact0.1.17 and0.1.18 pairs. Rust tests pin their
four SHA256 URLs independently of the current frontend build. The supported
native account/recovery assets and historical guide response profiles remain
available. No runtime asset archive or external asset fetch is introduced.

A later browser change rotates this finite set in its normally reviewed PR.
Before a predecessor is removed, identify its exact retired URLs, review any
deferred/lazy modules, preserve the supported recovery artifact and prove the
startup/draft path. Optional lazy modules require a revised concrete retention
contract before they can ship. Silently appending every historical bundle or
removing a supported predecessor is a release failure.

Rust serves and verifies this distribution boundary. The compiled active set,
public artifact manifest, exact-image inspection and focused HTTP checks must
agree on six unique URLs containing three scripts and three styles. Current
schema14 release manifests require six unique asset hashes. Historical release
manifests through schema13 keep their existing admission bounds, including the
24-asset CURRENT18 record. Image inspection still admits the historical
schema13/24-asset shape and the current schema14/six-asset shape, with matching
container labels and packaged metadata.

A future JavaScript-only generation may reuse an identical stylesheet URL. Its
review must update the exact candidate-count expectations to allow that natural
deduplication within the same six-URL ceiling; changing CSS solely to manufacture
another unique URL is not a valid retention policy.

## Retired bootstrap assets and continuing API admission

This candidate retires the ten browser generations0.1.6,0.1.7,0.1.8,0.1.9,
0.1.10,0.1.11,0.1.12,0.1.13,0.1.14 and0.1.16. Their twenty exact hashed
bootstrap URLs return410 Gone, no-store and a small fixed native recovery
document linking to /workspace and /account. Unknown asset URLs return404.
A retired URL is never redirected to or served with newer module bytes.

The retired generated files leave the new source/artifact. Their accepted Git
history and historical release artifacts are not rewritten or deleted. Useful
stopped17, matched final13 recovery, external work and protected services are
outside this source-only retirement.

This is a bootstrap distribution window, not selective browser-version
authorization. These historical clients share reborn-workspace-v1. An already
loaded or browser-cached monolithic old bundle can continue only through the
same current authentication, session generation, authorization, revision and
request-contract checks. The server does not claim it can distinguish an old
0.1.6 page from a0.1.18 page using that shared contract. No grants, CSRF bindings,
historical commands or credential submissions are replayed.

## Startup and drafts

The native bootstrap contains useful account and fresh-workspace links before
the module runs. A failed/retired module leaves that private-free fallback in
place. It does not navigate, submit work, clear storage or authorize an effect.
Refreshing a document remains deliberate.

The note recovery key and schema remain product/account/session-generation
scoped workspace.v1 and schema1 body/base data. A compatible same-account fresh
document may offer deliberate recovery after current authorization. Recovery
does not save automatically. Another account or generation cannot inherit it.
Provider keys, passwords, cookies and CSRF bindings remain excluded from drafts.
An in-memory form is not claimed recoverable after arbitrary document loss.

Keeping predecessor browser bytes does not make a schema13 server binary
compatible with schema14 data. Recovery and any installation need the separate
schema14/newer-write qualification; no old backup may overwrite newer writes.

## Evidence required

- Serve every active URL with immutable cache semantics and verify its body hash,
  including exact17/18 bytes. Public manifest and packaged asset window agree.
- Return410 with native recovery and no cookie effects for all twenty exact
  retired URLs; unknown paths stay404. HEAD has the same status and no body.
- Keep native Account/sign-out available when workspace startup fails. A fresh
  document recovers a compatible note draft only after explicit choice, without
  automatic PUT, navigation or credential replay.
- Retain current workspace/session/refresh/provider contracts and independently
  qualify the tile UI, database upgrade and recovery path.

GitHub language percentages are not acceptance criteria. This removes obsolete
shipped compatibility bundles for a declared product support window. Source
languages remain visible; no Linguist override, binary packing, archive trick or
replacement backend is used to change the language display. Rust continues to
own domain rules, permissions, providers, persistence and operations;
Svelte/TypeScript owns browser presentation and interaction.
