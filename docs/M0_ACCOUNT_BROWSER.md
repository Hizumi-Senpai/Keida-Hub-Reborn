# Independent account browser acceptance

These expectations are frozen before inspecting the new Askama account pages or
their lifecycle module. This is a backend-backed account-page slice, not the
Svelte workspace, room renderer, production enrollment or a provider integration.

## Transport, fixtures and privacy

Run the actual compiled Rust binary against uniquely owned disposable databases
inside the explicitly supplied local PostgreSQL fixture. Apply actual migrations
and run the actual `init-key` / `prepare-owner` commands using new private paths.
Generate fictional credentials in memory. No original/Rewrite key or account is
read, imported, reset or promoted. Missing prerequisites fail instead of skipping.

A small test-only Node HTTPS reverse proxy terminates TLS for a fresh private
fixture CA and loopback certificate. Chromium trusts that CA through an isolated
NSS trust database and browser HOME; there is no certificate-error bypass and no
global trust-store mutation. All native form submissions, redirects and Secure
cookies pass through actual HTTPS. The browser receives cookies only from normal
server responses; `addCookies`, browser storage injection and credential replay
are forbidden. This Node process is verification tooling, not a production server.

Automatic screenshots, traces and videos are disabled, including on failure.
Only the explicitly approved blank desktop/mobile forms may be captured, before
any credential is filled, with blank-value assertions; no signed-in screenshot is
captured. Test errors
and process output must be sanitized; no supplied password, setup secret, cookie,
CSRF token, private key, key path or database URL is logged or attached. Browser
and proxy diagnostics record only safe classifications/counts. Never persist an
authenticated browser storage state. Temporary files are private and owned by
the fixture, and teardown removes only those files/databases/processes.

## Native account workflows

- `/account/sign-in` and `/account/claim` provide native GET/POST forms. Visible
  labels are Username, Password and (claim only) Setup secret. Submit buttons
  are Sign in and Create owner. Successful submissions redirect with GET into
  `/account`; refresh/back navigation never replays credentials automatically.
- `/account` has real native Sign out and Sign out everywhere forms, posting to
  `/account/sign-out` and `/account/sign-out-all`. A Switch account link obtains
  a fresh sign-in form. These core forms remain usable with JavaScript disabled.
- Claim consumes the private one-time setup capability and creates exactly one
  owner. Deliberate subsequent sign-in verifies the actual password. Incorrect
  password leaves an already present authenticated session usable.
- Successful sign-in retires only the browser's presented previous bearer,
  including account switches. Another browser/device's session remains valid.
  Neither hidden IDs nor browser-stored values authorize server writes.
- Rejected or expired CSRF produces an honest error and a fresh blank recovery
  form. Password/setup inputs and their submitted bytes never reappear in HTML,
  URLs, storage or later automatic requests. Old form guards cannot authorize
  effects after an independent fresh anonymous cookie is issued.
- Wrong instance-key binding and unknown schema state fail closed. Recovery
  restores the matched fixture state and obtains fresh forms; no key/password
  reset or silent fallback is accepted.

## Account display and lifecycle isolation

The account HTML response contains no private account name, role or ID. Its live
identity fields start hidden and empty; public decorative content is not private
identity. A bounded browser module may populate the identity fields
only from a fresh authorized session probe whose CSRF identity equals the loaded
document's initial session guard. Without JavaScript the native account forms
remain useful, while no private identity snapshot is embedded in HTML.

Page hide, blur, hidden visibility and cross-tab invalidation clear the private
panel. Focus, pageshow and visible restoration require a new bounded probe before
displaying private data. Cookie/account/generation changes, logout and revocation
clear previous private content and expose deliberate fresh GET recovery links.
Cancelled, obsolete or late probes cannot repopulate a cleared page or display a
new account inside an old document. No POST is replayed by these transitions.

Use actual multiple browser tabs/contexts to verify cross-account changes,
revocation and held late probe responses. Explicit event dispatch is a bounded
additional seam for lifecycle cleanup; it is not a claim that native bfcache,
mobile app suspension or every device lifecycle has been accepted.

## Accessibility and evidence boundaries

Verify labeled controls, keyboard-only submission and visible focus, readable
errors, meaningful headings/landmarks, and reflow at a declared narrow mobile
viewport without horizontal page scrolling. Run a pinned accessibility checker
on blank forms and safe signed-in chrome. Clear credentials before any checker
could include an input's value in diagnostics. Automated rules complement
keyboard checks; they do not establish full accessibility certification.

Record exact dependency locks, Chromium revision, compiled source identity and
executed Linux/browser workflows. Type checking, source presence and CI success
are separate from actual browser execution. Chromium mobile viewport emulation
is not native iPhone/Safari acceptance. No production deployment, real-user
acceptance, packaged recovery, encrypted provider secret or game transfer is
claimed by this harness.


## Locked harness and actual execution

The `web` package pins Playwright1.64.1, TypeScript7.0.2, Axe4.14.0 and the Node
PostgreSQL driver/type dependencies with `package-lock.json`. It runs only test
fixtures and compiles the small production account module; it adds no production
Node process. `npm ci` uses that exact lock. The sanitized custom reporter omits
raw Playwright call logs, which can otherwise include `fill()` credentials.

CI needs Node24.22.1, OpenSSL, `libnss3-tools`, and the pinned Playwright Chromium:

```text
npm ci --prefix web
npm --prefix web run check
npm --prefix web run build:account
git diff --exit-code -- crates/hub/static/account.js
cd web
npx playwright install --with-deps chromium
npm run test:browser
```

Set `REBORN_BROWSER_BINARY` to the absolute actual compiled release binary,
`REBORN_BROWSER_EXPECT_COMMIT` to its exact qualified full source SHA, and
`REBORN_TEST_DATABASE_URL` to the already provisioned local disposable PostgreSQL
administrator fixture. Optional `REBORN_BROWSER_OUTPUT_DIR` isolates safe blank
PNG outputs. The Chromium version and actual compiled source are printed as safe
evidence; secret-bearing fixture output is never printed. An optional explicit
`REBORN_BROWSER_EXECUTABLE` must be an absolute browser path and is for a recorded
matching pinned-browser installation, not a TLS-validation bypass.

The anonymous-expiry case unconditionally waits602seconds of actual monotonic
elapsed time. The real browser must expire its600second cookie; the old DOM form
then fails without creating an owner, and a deliberate fresh GET/form recovers.
It has a660second test deadline. Two workers use separate databases/keys/browser
homes, so other cases can complete while this real expiry gate waits.

Late-probe verification pauses a real Chromium network response only after normal
TLS validation and a real Rust session200. It never injects a successful auth
payload. A separate explicit network-abort seam proves optional read failure does
not disable native sign out. Synthetic page-transition events are named lifecycle
seams, not native iPhone or bfcache acceptance.

Primary implementation references: [Playwright browser installation](https://playwright.dev/docs/browsers),
[Playwright configuration](https://playwright.dev/docs/test-configuration), and
[Chromium Linux NSS trust management](https://chromium.googlesource.com/chromium/src.git/+/refs/heads/main/docs/linux/cert_management.md).

Local TypeScript checks and OpenSSL/Node HTTPS CA/header/cookie transport smoke
were executed. Local Chromium execution was unavailable: the standard pinned CDN
returned an invalid HTML response, and a matching official CFT download could not
be launched in this environment. No actual browser workflow is claimed from those
local checks. Exact-source CI must execute and qualify this complete harness.
