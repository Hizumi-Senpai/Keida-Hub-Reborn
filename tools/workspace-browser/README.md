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
Chrome for Testing is pinned by SHA256
`43fd31766c7533a02dda2ded5ad50c2f861cd5400be7509c0abad71129f79d79`
from the same official156.0.8078.4 version manifest. The exact browser is supplied
to both native WebDriver and retained Playwright checks; version agreement is
checked at runtime. The Ubuntu24.04 runner supplies the browser's system libraries. The actual browser
run still fails if a required library is unavailable. The certutil package is
extracted privately without apt upgrades or global trust changes, from official
Ubuntu Noble bytes pinned by SHA256
`d8d6093edcf2206edeee40eaddd90a54bacc84cde4d8cc9c4fb50bd7aa12cf0d`.
Node does not run this native browser driver. Svelte's compiled application is
the code under test.

Thirteen independent workflows cover real native enrollment/TLS, persistent editor
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

The ninth workflow verifies grouped notifications, read watermarks, racing/lost responses without replay, persisted reads, privacy and desktop/390px accessibility.

The tenth workflow verifies personal Home arrangement with conflict/lost-response
reconciliation, focus and component lifetimes. The eleventh verifies the integration
catalog, separate dated Roadmap note, actual TLS observation capture, stable
history pagination, owner archive/member narrowing, note-save enrollment races,
late-response privacy and desktop/390px accessibility. No fixture touches production.

The twelfth workflow verifies owner-only Jellyfin/Seerr enrollment and actual TLS
observations, bounded pages and playback counts, empty/unknown/error outcomes,
secret clearing, preserved note/editor identity, lost-reply reconciliation without
replay, obsolete and revoked responses, member isolation and desktop/390px/Axe.
Guide capability negotiation preserves the supported0.1.12 catalog response.

The thirteenth workflow verifies actual native Sonarr/Radarr/qBittorrent broad-key
acknowledgement and enrollment, fixed navigation,12/12/2 pages, first60 truncation,
explicit page-moved recovery, unknown/partial/empty/error distinctions and wanted-byte
progress independent of raw checking progress. It ages held samples with the existing
scheduler and no new provider IO, preserves the private editor, checks desktop/390px
Axe, reconciles a committed lost reply by GET without replay, rejects late enrollment
and revoked-authority payloads, and verifies member isolation. Its fixed expectations
come from the frozen queue contract and fictional TLS fixture inputs; it never
reads production provider credentials or emits authenticated DOM/screenshots.
