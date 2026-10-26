# Native workspace browser contracts

A concrete Rust W3C WebDriver caller for the M0 Svelte workspace. Rust owns
PostgreSQL/key/app/TLS fixture creation, browser orchestration, expectations,
actual-response hold seams, cleanup and sanitized terminal outcomes. The binary
has no production caller or host/game authority. It is run explicitly after the
qualified release build; normal Rust unit tests do not pretend it was executed.

Required environment: `REBORN_TEST_DATABASE_URL` (explicit disposable loopback
administrator), `REBORN_BROWSER_BINARY` (absolute compiled application),
`REBORN_BROWSER_EXPECT_COMMIT` (its exact SHA), `REBORN_CHROMIUM`,
`REBORN_CHROMEDRIVER`, and `REBORN_AXE_SCRIPT` (pinned local Axe bundle).
OpenSSL and certutil are local test prerequisites. Missing prerequisites fail.

Chromium and ChromeDriver both must report156.0.8078.4. The driver ZIP is pinned
by SHA256 `ae36d1b2391e6852594d7dd1be963f818ca05f117cfc5fdcb41c33f3074afa8b`;
CI downloads its exact official Chrome-for-Testing URL and verifies those bytes.
The existing locked Playwright installer supplies Chromium; Node does not run
this browser driver. Svelte's compiled application is the code under test.

Five independent workflows cover real native enrollment/TLS, persistent editor
identity and selection, one poll owner, draft/keyboard/reflow/accessibility,
concurrent-device409, editing during a held successful save, committed lost
response/no replay, cross-tab account switch/late response, explicit same-account
recovery, remote generation revocation and optional storage/network failures.

The HTTPS proxy is Rust/Axum/rustls, with a fresh private CA enrolled only in
private Chromium HOME/NSS paths. acceptInsecureCerts must be false. A separate
untrusted browser must reject the same certificate. No browser cookie injection,
authenticated screenshots, storage-state exports, raw DOM/errors or secret-bearing
process logs are emitted. Held successful responses are actual upstream Rust
responses after normal TLS and authorization; no fabricated auth success exists.

Small WebDriver execute-script primitives inspect DOM identity/selection,
exercise explicitly named lifecycle/storage fault seams and call the pinned Axe
checker. Rust owns their input, checks and outcome. A ChromeDriver-supported CDP
command deliberately blocks only the workspace snapshot URL for one network-fault
case. A blocked workspace module must leave native account/sign-out recovery
usable. Native clicks/keys drive credential and workspace forms. These seams are
not claims about native iPhone/Safari or every bfcache/suspension implementation.

Primary protocol references: [W3C WebDriver](https://www.w3.org/TR/webdriver2/),
[ChromeDriver capabilities](https://developer.chrome.com/docs/chromedriver/capabilities),
[Chrome-for-Testing version manifest](https://googlechromelabs.github.io/chrome-for-testing/156.0.8078.4.json),
[Chromium NSS trust](https://chromium.googlesource.com/chromium/src/+/main/docs/linux/cert_management.md).
