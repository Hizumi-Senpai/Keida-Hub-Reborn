# M0 account documents

This source slice adds the separate Askama account/recovery surface. It is not
the persistent Svelte workspace or a public deployment. Existing installations,
accounts, keys, routes and game responsibilities are not imported or changed.

## Native forms and shared authority

`/account/claim` and `/account/sign-in` serve ordinary HTML forms. Successful
native POSTs redirect with303 to `/account`; sign-out and sign-out-everywhere
redirect to `/account/sign-in`. Redirect targets are fixed local paths. Password
and setup-secret fields are always blank in server responses. Failed or expired
forms can obtain a fresh challenge; the user enters credentials deliberately.
Interrupted requests may have committed, so recovery never replays a POST.

Browser forms cannot supply the JSON API's custom headers. Their separate native
transport uses hidden `product`, `contract=reborn-account-v1` and `csrf_token`
controls, exact Origin, a strictly decoded URL-encoded body limited to8192 bytes,
and duplicate/unknown-field refusal. Admission proceeds through decoding, client
identity, Origin, exact schema/key binding, then cookie/CSRF validation. Early
rejection status survives unavailable form recovery. An unavailable service
cannot issue an actionable recovery form.

The JSON API retains its existing strict header contract. Both admitted
transports call the same credential services and PostgreSQL authority. Password
costs, fixed throttles, transaction fences, private owner claim and session
rotation/revocation remain those of [the API slice](M0_AUTH_API.md). No loopback
HTTP calls or second account/password authority are introduced. Document GET and
HEAD use current schema/session checks without requiring custom API headers.

All documents, redirects and errors are no-store. HTML has an explicit same-origin
script/style/connect/form policy, no inline code or unsafe evaluation, no base
URLs and no framing. CSS and compiled JavaScript have content-hashed immutable
URLs; unknown hashes fail404. Public source/version details come from compiled
identity, not a GitHub latest-version request. Artifact publication and retention
of supported prior browser chunks remain later delivery gates.

## Optional account identity enhancement

Native claim, sign-in and sign-out forms work without JavaScript. Server HTML
contains no private account name, role or ID, even in hidden markup. The account
identity panel starts empty and hidden; without JavaScript only that optional
identity display is unavailable. Native sign-out remains available when the
enhancement cannot check access.

The small TypeScript module fetches the existing admitted session API. A response
must have the expected shape and the same opaque CSRF binding as the original
document before it can populate the panel. It never puts credentials, cookies,
CSRF, identity snapshots or drafts in browser storage. DOM content uses text,
not HTML insertion.

Blur, pagehide, hidden visibility and namespaced cross-tab auth signals clear
private identity and cancel pending checks. Focus, pageshow and visible-tab
transitions obtain a fresh check. Epochs, cancellation and binding comparison
reject late responses and another account's session. Pagehide/restoration also
clears credential controls. Native submission data is captured normally; the
enhancement does not clear fields in the submit event or replay a request.

Each check has a4-second timer and monotonic elapsed budget. A healthy visible
page checks remote revocation every15 seconds. Hidden pages stop checks; a failed
check clears identity and stops polling, with a deliberate safe GET for recovery.
There is no automatic reconnect retry loop. These are account-document controls;
private workspace snapshots, drafts and subscriptions still need their own real
Svelte caller and verification.

## Build and evidence

Askama0.16.1 is pinned in Cargo. Node24.22.1 and locked tools under `web/` compile
the bounded account TypeScript into the committed JavaScript asset. CI runs
`npm ci`, type checks, recompiles it and refuses a generated-source difference
before deriving source identity. Production remains the Rust service; Node is
used only for build/test tooling and the isolated browser-test TLS proxy.

[Independent native HTTP expectations](M0_ACCOUNT_PAGES_CONTRACTS.md) and
[browser expectations](M0_ACCOUNT_BROWSER.md) are separate from this implementation
description. Existing tests stay in place. New native tests require actual TCP
and owned disposable PostgreSQL. Browser fixtures use the actual compiled binary,
real HTTPS and an ephemeral CA trusted only in an isolated Chromium home, with
no ignored certificate errors or manually injected cookies. Actual ten-minute
form expiry is tested by waiting for elapsed time.

Exact-source execution results belong in the PR and tracker receipts. Linux
Chromium and a mobile viewport do not establish native iPhone/Safari acceptance.
This slice does not establish an image, installed runtime, live provider,
encrypted provider-secret enrollment, matched backup/restore or public cutover.
