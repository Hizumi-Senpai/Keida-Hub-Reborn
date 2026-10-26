# Independent M0 authentication API contracts

Expectations frozen from [M0_AUTH_API.md](M0_AUTH_API.md) before inspecting the
authentication implementation. This verification owns only the new native HTTP
test and this document. It changes no live host, credentials, route or authority.

## Independent expectations

- Private CLI preparation creates new owner-only regular key/setup files, never
  overwrites existing files and never prints their contents. Auth is absent with
  no configured key; malformed/unsafe keys fail startup, and a different valid
  key cannot authenticate against an already bound database.
- A prepared, unexpired setup secret plus its anonymous form cookie/CSRF can
  claim exactly one owner. Concurrent claims cannot create two owners. Failed,
  expired and repeated claims create no extra account or usable session. Active
  preparation cannot be replaced; preparation after ownership cannot reset it.
- Password verification is real, uses the specified bounded Argon2id profile and
  survives process restart. Username canonicalization is explicit, account IDs
  are decimal strings and roles are owner/member. Unknown/wrong/disabled login
  produces the same public rejection shape.
- Product/contract admission precedes every auth effect. Missing, duplicated or
  wrong values cannot consume setup, create a user, revoke a session or log in.
  Origin and CSRF must be singular and valid, and CSRF belongs to exactly its
  anonymous form or authenticated session. Relevant duplicate cookie names are
  rejected across one or multiple Cookie headers, even for identical values.
- Cookies have the exact Reborn names and Secure, HttpOnly, SameSite=Strict,
  Path=/ attributes without Domain. Tests carry them explicitly over a private
  loopback HTTP fixture; this verifies server attributes, not browser HTTPS
  delivery or Secure-cookie enforcement.
- Member sessions cannot list/create/disable members. Owner creation cannot
  accept a role/promotion field. Disabling a member, logout, session expiry and
  revoke-all invalidate the affected authority without replacing passwords.
  Account generation changes fence old sessions and survive restart.
- Signed anonymous form expiry, setup expiry and authenticated session expiry
  fail closed. A fresh form can recover an expired anonymous challenge without
  replaying credentials. Valid key mismatch yields unavailable auth rather than
  silently binding a replacement key.
- Durable throttles reject excess work within the fixed windows; arbitrary
  usernames cannot create unbounded throttle rows. No test bypasses production
  hashing or uses implementation output as its own expected authorization policy.
- Stored password/session/setup values are verifiers, not reusable credentials.
  Public responses and captured application/CLI output contain no supplied
  passwords, setup secret, session cookie, key bytes, password hash or stored
  verifier. Appropriate CSRF tokens are the sole intentional response secrets.

## Execution boundary and remaining acceptance

`auth_http.rs` must use the actual compiled binary, TCP HTTP and explicitly
provisioned local disposable PostgreSQL through mandatory
`REBORN_TEST_DATABASE_URL`. It creates and removes only uniquely named owned test
databases and private scratch files. Missing prerequisites fail, never skip.
Database fault seams may alter only those fixtures to exercise time/generation
and malformed-record behavior. Tests must not relax schema constraints merely to
make application behavior pass.

Clarifications frozen with CORE before implementation inspection: setup output
is exactly 64 lowercase hex bytes without a newline; active/owned preparation
conflicts and losing concurrent claims are 409, wrong/expired setup is 403.
Unbound or mismatched instance keys make auth unavailable (503), while absent
auth configuration leaves routes absent (404). Anonymous cookie faults are 403;
authenticated cookie faults are 401. Duplicate product/contract headers are 426.

For independent MAC-valid expiry fixtures, the agreed anonymous wire format is
`v1.<canonical-decimal-issued>.<nonce64>.<mac64>`. Its MAC uses HMAC-SHA256 over
`b"reborn/form-cookie/v1\0"` followed by the unsigned ASCII cookie. Anonymous
CSRF uses `b"reborn/form-csrf/v1\0"` followed by the complete cookie; session
CSRF uses `b"reborn/session-csrf/v1\0"` followed by the opaque session token.
Verifiers are SHA256 over canonical ASCII token bytes. These literals come from
the frozen protocol, not imported production cryptographic helpers.

Before first publication CORE corrected password admission to **15–128 Unicode
scalar values and at most 512 UTF-8 bytes**, without normalization/truncation.
This supersedes the earlier 12–128 byte rule: fourteen ASCII characters and six
`é` characters must fail, fifteen Unicode scalars must work. The existing longer
fixture phrases remain valid. Successful login with a current old session cookie
must atomically revoke that presented token, including an account switch, while
failed login preserves it and another device's token remains valid. Protected
session snapshots expose a decimal-string `session_generation`; it is not a token.

Database fault seams expire setup/session timestamps in owned databases, hold
the auth singleton lock while setup expires, and seed the documented throttle
boundary or expire its windows. The row-lock scenario verifies rejection and
zero account/session effects after waiting; it does not alone measure when the
password hash executed. The global throttle boundary is seeded at 19 to isolate
the twentieth/next request from independent username-bucket collisions. Fixed
row count, ordinary repeated attempts and restart retention are checked too.

## Additional phase expectations frozen after review

The store's public phase APIs provide a direct seam for independently testing
decisions after hashing, without sleeps or a production test bypass. These
contracts use fixed valid PHC input fixtures and fictional 32-byte verifiers;
they do not duplicate password verification or authentication policy.

- Capturing a valid bootstrap snapshot does not authorize a later claim after
  expiry or consumption. Expiry rejects with no account/session insertion;
  consumption rejects without another owner or another session.
- Capturing a login snapshot does not authorize later session insertion after
  account generation, password verifier or active state changes. Final admission
  must reject and preserve unrelated current authority.
- Thirty-two active sessions reject another unrotated login. Two concurrent
  final admissions from thirty-one active sessions leave exactly thirty-two,
  with one success and one limited result. Rotation at the cap may replace only
  the presented old session. A new-verifier collision after old retirement must
  roll back that retirement and any cleanup, preserving the old token.
- HTTP cap verification seeds thirty-one valid owned fixture session records
  beside the real owner's session. A fresh login without the old cookie is 429;
  an admitted login presenting the old cookie succeeds, invalidates that cookie
  and preserves another device's session.
- Optional lost-response verification may observe a committed claim through the
  owned database before dropping its unread TCP response. Subsequent claim
  conflicts and deliberate fresh login recovers the same owner. This is response
  loss after known commit, not proof about a commit racing the HTTP timeout.

Record actual exact-source CI execution separately. These tests establish no
Askama/Svelte workflow, native browser/iPhone behavior, packaged artifact, live
deployment, provider-secret enrollment, backup/restore or game ownership transfer.
