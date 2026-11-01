# Browser asset support and retirement

Installed24 ships browser generations24/23/18. The next daily-use browser
candidate rotates that finite set to new-current/24/18. Source-only merges,
including the M5.7 namespace probe and later M5 operational work, do not create
browser generations. Publication, installation and real owner acceptance retain
separate receipts in [issue1](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1).

## Finite shipping window

Ship exactly three reviewed browser generations: one current JavaScript/CSS
pair and two exact predecessor pairs. The compiled Rust pairs explicitly select
the generations; the public asset manifest lists each immutable URL only once.
At most six unique URLs ship: exactly three scripts and two or three styles.
Identical stylesheet bytes may naturally be shared by two generations, yielding
five URLs. CSS must not be changed just to manufacture a sixth URL.

The candidate preserves exact24 and18 bytes. Independent Rust pins are:

| Generation | Script SHA256 | Stylesheet SHA256 |
| --- | --- | --- |
|24|`87a84ee5feaefa4a27634e0260539a6b186691d651ec826a186bbfe87a4854e1`|`a7e5f962b369082d96599eff35c04c2ffb5ddf852fc74d932bc61e0fd161bae5`|
|18|`669fbfd32bccda4c9e26262c75813f456a466a7ac5102fdd77cf1bbbb4d9bcd5`|`aa0346c141e1bce1ae356a56b33c121fb090c2534c4374dd5c89586502ea5ec4`|

Native account/recovery assets and historical guide response profiles remain
available. No runtime asset archive or external asset fetch is introduced.
The workspace is a monolithic script/style build; unexpected deferred or lazy
modules require a revised concrete retention contract before shipping.

The compiled active set, public artifact manifest, exact-image inspection and
real HTTP body hashes must agree on the unique URL set. Schema14 image inspection
admits only three scripts and two or three styles, with five or six unique URLs.
Schema14 release manifests admit only five or six unique asset hashes. Historical
schema13 image inspection stays exactly twelve scripts plus twelve styles, and
historical release manifests through schema13 retain their existing bounds,
including the24-asset CURRENT18 record. Deduplication is not a broader historical
artifact-admission exception.

## Retired bootstrap assets and continuing API admission

The candidate retires exact23 in addition to the eleven earlier retired
generations6/7/8/9/10/11/12/13/14/16/17. The newly retired URLs are:

- `/assets/workspace/8a20b75c96a3e13db593acefe75b9bccae89a825c5a8a7bffa4dc1f730958ab3.js`
- `/assets/workspace/d5608ad2a1333a42b738e6a6ffc07955f88252f6b177dc7b639db647caf6f826.css`

All24 exact retired bootstrap URLs return410 Gone, no-store and a small fixed
native recovery document linking to `/workspace` and `/account`. Unknown URLs
return404. HEAD has the same status and no body. A retired URL is never redirected
to or served with newer module bytes. The retired23 generated files leave the new
source/artifact; accepted Git history and historical release artifacts are retained.

This is a bootstrap distribution window, not selective browser-version
authorization. An already loaded or browser-cached old monolithic bundle can
continue only through the same current authentication, session generation,
authorization, revision and request-contract checks. The server cannot distinguish
old generations sharing `reborn-workspace-v1` using that contract alone. No grants,
CSRF bindings, historical commands or credential submissions are replayed.

Container retention is separate. [Owner-authorized cleanup](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1#issuecomment-6551667332)
removed old17/18 container shells while preserving images, archives and matched
final13/current14 recovery; compatible stopped23 remains. Serving18 browser bytes
does not depend on an18 container. An18 binary cannot serve current14 data.

## Startup and drafts

The native bootstrap contains useful account and fresh-workspace links before
the module runs. A failed or retired module leaves that private-free fallback in
place. It does not navigate, submit work, clear storage or authorize effects.
Refreshing a document remains deliberate.

Note recovery stays product/account/session-generation scoped, with workspace.v1
and schema1 body/base data. A compatible same-account fresh document may offer
deliberate recovery after current authorization; it never saves automatically.
Another account or generation cannot inherit the draft. Provider keys, passwords,
cookies and CSRF bindings are excluded. An in-memory form is not promised
recoverable after arbitrary document loss.

Keeping predecessor browser bytes does not make a schema13 server binary
compatible with schema14 data. Current14/newer-write recovery qualification is
separate; an old backup must never overwrite newer writes.

## Evidence required

- Serve every active URL immutably and verify its response body hash, including
  exact24/18 bytes. Public manifest, compiled pairs and packaged shape agree;
  duplicate stylesheet URLs appear only once in the manifest.
- Exercise all24 retired URLs through actual HTTP GET/HEAD:410, native recovery,
  no cookie effect, no replacement module; unknown paths remain404.
- Retain the real module-failure startup path, native Account/sign-out and explicit
  same-account draft recovery. In the same browser workflow, visit the exact
  retired23 URL and use its native Account/fresh-document recovery without automatic
  navigation or PUT replay. Preserve the following member-isolation checks.
- Qualify the existing workspace/session/refresh/provider contracts and candidate
  daily-use behavior on the eventual head and accepted main. Scope new checks to
  the changed distribution boundary; fixture success is not real owner acceptance.

Rust owns the distribution boundary, domain rules, permissions, provider behavior,
persistence and operations. Svelte/TypeScript owns presentation and interaction;
native source languages stay visible. No language-statistics masking or archive
packing is used to disguise obsolete shipped assets.
