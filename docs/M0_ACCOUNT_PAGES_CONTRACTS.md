# Independent account-page HTTP contracts

Expectations frozen from CORE's scoped account-page assignment before inspecting
the native transport or templates. This is the separate Askama account/recovery
surface selected by the architecture, not a dashboard or Svelte workspace.

## Routes and transport authority

| Route | Required behavior |
| --- | --- |
| GET/HEAD `/account/claim` | Fresh anonymous challenge; claim is possible only with deliberate private preparation |
| POST `/account/claim` | Admitted setup secret, username and password claim one owner; success 303 to `/account` |
| GET/HEAD `/account/sign-in` | Fresh anonymous challenge and native password form |
| POST `/account/sign-in` | Real password verification and atomic presented-session rotation; success 303 to `/account` |
| GET/HEAD `/account` | Current authenticated account document; no API headers required for ordinary navigation |
| POST `/account/sign-out` | Revoke the presented session; success 303 to `/account/sign-in` |
| POST `/account/sign-out-all` | Revoke the current account generation; success 303 to `/account/sign-in` |

Native POST has an explicit form transport: `product=keida-hub-reborn`,
`contract=reborn-account-v1` and `csrf_token`, plus only the route's credential
fields. Claim uses `setup_secret`, `username`, `password`; sign-in uses `username`,
`password`; sign-out routes accept no credential fields. The client version and
CSRF values belong in escaped hidden controls, not URLs. Ordinary document GETs
do not make custom headers optional on the existing JSON API: its frozen
`X-Reborn-Product`/`X-Reborn-Contract`/`X-CSRF-Token` contract stays strict.

The initial real-browser run exposed a transport requirement absent from the
manually headed fixture: both the response and HTML referrer policy must be
`same-origin`, so a same-origin native POST retains its actual Origin while
off-origin Referer information is withheld. The
[WHATWG Fetch algorithm](https://fetch.spec.whatwg.org/#append-a-request-origin-header)
would serialize native non-CORS POST Origin as `null` under `no-referrer`.
This amendment preserves exact-Origin admission: an explicit `Origin: null`
remains forbidden. The HTTP fixture checks both policy declarations and null
refusal; real Chromium must still perform the positive native submission.

The native adapter must call shared authentication services directly. It must
not invoke a loopback HTTP API, copy store decisions or implement a second
password/session authority. Schema/key qualification, current authorization,
bounded hashing/throttling and transaction/revocation behavior stay identical.
Both GET and implicit HEAD receive the same schema and session gates.

## Admission and form decoding

- POST requires exactly one Origin equal to the configured canonical HTTPS
  origin and a valid, unambiguous appropriate cookie/CSRF pair. Product/contract
  admission is explicit and occurs before auth effects.
- The encoded body is at most 8192 bytes and accepts only URL-encoded form data.
  Decode percent escapes and UTF-8 strictly, exactly once; no replacement
  characters, lossy decoding or silent truncation. Duplicate decoded field
  names, unknown fields and unsupported content types are rejected.
- Missing/wrong native client identity is 426; wrong/missing/ambiguous
  Origin or CSRF is 403; invalid input/encoding is 400; unavailable authority is
  503. Oversize is 413; unsupported or duplicated media type is 400. Accept one
  `application/x-www-form-urlencoded`, optionally with `charset=utf-8`.
  Every duplicate decoded field, including product/contract, is 400. Admission
  order is strict decoding, client identity, Origin, exact schema, then CSRF.
- Preserve the existing password rule: 15–128 Unicode scalar values and at most
  512 UTF-8 bytes, without normalization/trimming/truncation. Usernames follow
  the existing canonicalization and validation policy.
- Parse every Cookie header and reject relevant ambiguity; keep the established
  Reborn cookie names and Secure, HttpOnly, SameSite=Strict, Path=/ attributes,
  without Domain. No posted account ID or role authorizes an action.

## Responses, recovery and privacy

Success uses 303 with the fixed local destinations above. Invalid sessions on
protected GET/POST use 303 to the fixed sign-in document and expire their cookie;
submitted or query-provided return destinations
never become redirects. GET cannot submit credentials or revoke authority.

Failures are sanitized accessible HTML with a clear outcome and appropriate
recovery link/form. If authority is available, a fresh anonymous challenge allows
deliberate retry. Password and setup-secret controls are blank on every rendered
document, including failed submissions. No automatic POST or credential replay
occurs. A failed login preserves an existing session; a successful login retires
only the old token presented in that request, including account switches, and
preserves another device's session.

Claim-page states are explicit: active preparation is 200; an existing owner is
409 with blank credentials and a sign-in link; absent/expired setup is 403 with
blank credentials; unbound/mismatched key is a 503 unavailable document with no
form. Bound, schema-qualified 409/403 recovery may mint a fresh challenge. Wrong
password sign-in is 401 with the sign-in document and no old-session retirement.

Render untrusted input only through escaping or omit it. Rejecting an XSS payload
must never create executable markup, event handlers, script URLs or raw payload
reflection. If a username is retained for recovery, its HTML attribute/text
contexts must be escaped. Secret values never enter HTML text/attributes,
redirects, logs, browser storage or public errors; CSRF hidden controls are the
intentional narrow exception. Private key/setup-file paths are not diagnostics.

Before implementation review CORE further narrowed the account document: HTML
contains no actual private account name, role or ID, including hidden controls,
titles and serialized data. The server still authenticates `/account` and renders
working native CSRF sign-out forms. An initially hidden, empty identity panel is
filled only by the separately owned bounded browser probe when the returned
session CSRF matches this document's initial opaque CSRF. This prevents a later
account's response from populating an earlier account document. The agreed hooks
are `[data-account-page]`, `[data-private-account]`, `[data-account-name]`,
`[data-account-role]` and `[data-account-status]`. Lifecycle clearing/revalidation
on blur, visibility, restored pages and cross-tab changes is separate browser
verification; HTTP checks must not infer that behavior from HTML hooks alone.

All documents, errors and redirects are no-store and use correct HTML response
types where they carry documents. CSP must prevent framing, restrict form actions
to the same origin and prohibit injected base URLs; it must not require inline
script or unsafe evaluation. Styles/assets and any later lifecycle enhancement
are separately admitted, rather than weakening the core form policy.

## Independent execution and acceptance boundary

The new `account_http.rs` will drive the actual binary over TCP and actual
PostgreSQL, with mandatory `REBORN_TEST_DATABASE_URL` and uniquely named local
owned databases/private key/setup files. Prerequisite failures do not skip tests.
Native submissions will carry real cookies explicitly in the loopback fixture;
cookie attributes are checked, but this alone is not browser Secure-cookie or TLS
acceptance. Existing JSON/API contracts must remain unchanged and green.

Required scenarios include claim/sign-in/account/sign-out flows; expired or
rejected forms and unavailable authority; schema and HEAD gates; body/header/
field ambiguity; XSS and secret-response/log privacy; cache/CSP; failed-login
preservation; and successful account-switch retirement of only the presented old
session. Browser cross-tab clearing, restored-page/late-response isolation,
actual trusted HTTPS delivery and native iPhone/Safari acceptance remain separate
work with their own exact-source evidence. This source contract claims no
deployment, provider enrollment or game ownership transfer.

## Verification source freeze

`account_http.rs` now contains five independent workflow tests covering native
navigation/actions and exact assets, strict decoding/admission/XSS, deliberate
expiry recovery, old-session-preserving failure/account switching, and native
schema/HEAD boundaries. Malformed encoding is tested inside an otherwise valid
password field so username validation or unknown-field rejection cannot hide a
lossy decoder. No native transport/template source was inspected to derive these
expectations.

Local Rust 1.99.1 formatting, locked offline test compilation (`--no-run`) and
Clippy with warnings denied passed. Actual PostgreSQL/HTTP execution and exact-
source CI remain pending integration; successful compilation does not establish
those workflows or browser acceptance. The source is frozen for peer review.

Focused precedence checks additionally stage an unknown future schema and retain
426 for wrong contract, 403 for wrong Origin and 400 for malformed encoding;
unavailable fresh-form recovery must not overwrite those earlier results. With
valid client identity/Origin, missing CSRF is 503 under the schema fence and 403
with a healthy schema. All staged requests preserve durable counts/generation/
throttles and unavailable recovery produces no form.
