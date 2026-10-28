# M5.1 Browser server-change notice and deliberate draft-safe refresh

CORE scope frozen October 28, 2026 (America/Chicago), before application edits.
Accepted/installed baseline 0.1.17/schema13 is `cc258e0376cef8e4eb88281efcc61c69fa11be2b`, tree `272bf938db2308d2ad269a501fc14e5f80e30690`. [Exact installed receipt](https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/1#issuecomment-6466893195). Expected next accepted source is 0.1.18; database remains schema13 with the same72 checked SQLx records. Existing real owner/provider/Discord and full M0–M4 acceptance stay open.

## Useful result and boundary

An open persistent workspace checks the server actually answering its same-origin health endpoint, distinguishes its loaded identity from that running identity, and offers a deliberate refresh after reviewing unfinished work. It detects both upgrades and rollbacks; different products, unsupported contracts, changed accounts and lost access receive honest terminal guidance. A newer GitHub commit or published release is not called installed. No host updater, service worker, automatic reload, credential replay, provider/game action or route transfer.

## Protocol and identity

- Retain the existing public no-store health identity. Add GET-only `/api/workspace/access`, admitted through the existing exact product/workspace contract, current key/schema/account/session/generation/expiry/revocation and CSRF binding. Return only product, workspace contract, schema1, current account/generation and compiled identity, never notes/provider data, credentials or session selectors; no Set-Cookie or database/provider effects.
- Keep the loaded page's product/version/full source/tree/channel/auth and workspace contracts. Validate bounded canonical accepted/preview/development identities. Identity comparison uses full source/tree/channel/version, not ordinal ordering; equal display text with changed source is still a change. Cross-product or incompatible auth/workspace contracts cannot be called compatible.
- A compatible result also requires the authenticated access probe matching the originally admitted account ID/username/role/generation, with the same identity as the health reply. A 200 sign-in HTML, malformed/oversized/redirected reply, auth failure or an identity race is never readiness.
- Discovery joins the existing single15-second visible workspace scheduler/focus check; no second poller. A discovery failure is visible and never silently refreshes or converts an observation into installed/latest proof.

## Deliberate refresh and private lifetimes

- Quiet account-area status/control; a visible notice only when changed or unavailable. Preserve11 primary navigation positions, native Account/current/all sign-out, existing private views and component instances.
- Refresh first reviews unfinished note/layout/service/provider/Discord forms and active or uncertain mutations. Keep/finish/save in the existing page, stay, or explicitly discard unsaved work. In-flight requests must finish or be reconciled before refresh; no blind repeat or automatic POST/PUT replay.
- Form review observes dirty flags only and does not copy field values into a new store; no password/token/CA/CSRF/cookie persistence. Existing bounded same-account note draft recovery remains optional; deliberate discard removes that draft. No promise to transfer unsaved forms across documents.
- Reconnect is a read-only deliberate attempt with a monotonic60-second total budget,4-second individual deadlines and backoff capped10seconds. Time spent hidden and delayed timers consumes the same budget. End explicitly in compatible-ready, sign-in-required, incompatible, cancelled or could-not-reconnect. No GET navigation until a separate deliberate user choice after successful checks and a fresh unfinished-work review.
- Cancel/dispose/auth change/sign-out prevent future requests and ignore late replies. Ordinary hidden/blur privacy clearing still applies; discovery/status stores contain no private account payload. Returning starts fresh authorization; incompatible/lost-account outcomes clear private DOM immediately. GET refresh targets a fixed same-origin workspace path, never a server-supplied URL.

## Verification, compatibility and recovery

Meaningful Rust HTTP contracts cover read-only admission, private/no-store envelope, owner/member isolation, revoked/deactivated/generation/expired/key/schema/ambiguous cookie and unsupported-client boundaries, with no auth cookie changes or stored effects. Rust-driven real Chromium workflows cover matching/upgrade/rollback/changed-source/cross-product/malformed identities, dirty note/layout/service/secret forms, in-flight/committed-lost responses with no write replay, cancellation/late replies, actual elapsed60-second deadline including delayed timer/hidden time, auth changes, safe fixed GET and390px/keyboard/Axe.

Retain all22 baseline workspace assets byte-for-byte and add the new pair (24 unique); retain all prior guide profiles and native account assets. No dependency/lockfile or production runtime change. Exact head/main required gates and all retained workflows/recovery flags remain. Qualify packaged schema13 recovery and current schema13 compatible upgrade/rollback with newer data preserved. Manual Reborn-only publication/installation uses new sealed audited source/held locks and fresh ownership; useful prior17 plus matched schema13 recovery retained only after exact18 qualification. No unknown mutation retry or historical script replay.


## Baseline17 rollback clarification

Baseline17 predates the access probe. A404/405 is unsupported refresh checking,
not compatible-ready or a transient outage to retry for a minute. Show the public
running identity, clear private state and offer the existing explicit native
Account/fresh-document path. Do not fetch notes/provider data as a substitute,
replay credentials or reload automatically. A fresh17 document and its existing
same-account/generation note recovery remain available. Current-data17/18 and
newer-write compatibility still need their own rehearsal.

The retained15 browser workflows keep their existing240-second invocation.
The new refresh workflow runs separately with an explicit120-second invocation,
including its actual60-second hidden-tab test. Both invocations are mandatory
in each existing native and packaged-image CI step:16 total workflows per mode.
No retained timeout, assertion, required step or45-minute job budget is weakened.
