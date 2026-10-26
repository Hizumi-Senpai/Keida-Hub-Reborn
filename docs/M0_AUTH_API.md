# M0 authentication API slice contract

This records authentication migration0002. The later workspace migration0003
advances exact application schema admission to3 without changing0001/0002.

Frozen implementation contract for the next reviewable source slice. This is a
backend/API slice, not browser sign-in acceptance or production enrollment. No
existing deployment, account, credential, route or game owner is changed.

## Authority and private preparation

Authentication is deliberately absent (404) when REBORN_INSTANCE_KEY_FILE is
unset. A configured missing, unsafe, malformed or wrong key never generates a
replacement; it fails closed. A fresh key is created only with explicit local
`init-key ABSOLUTE_NEW_PATH`. It is 32 random bytes in a new owner-only regular
file; existing files are never replaced. CLI does not print key/token/password.

After explicit migration, `prepare-owner ABSOLUTE_NEW_PATH` uses the configured
instance key, generates a 256-bit setup token and writes it to a new private file.
Only its SHA256 verifier and 15-minute database expiry are stored. The durable
singleton binds the key fingerprint. An unconsumed active preparation cannot be
overwritten; an expired preparation can be deliberately prepared again. No
preparation can replace an owner. On uncertain database failure the newly written
private output is retained for inspection, never silently removed/replayed.

Claim creates owner, consumes setup verifier and creates the initial session in
one transaction after hashing outside the transaction. Lock and recheck current
setup verifier/expiry, no owner and key binding before committing. Concurrent
claims produce one owner. No default password or public first-visitor claim.

## Cryptographic and resource contract

Passwords: 15–128 Unicode scalar values, at most512 UTF-8 bytes, no password normalization, Argon2id v19 m19456/t2/p1
with random salts. At most two blocking hash jobs; acquire a permit before spawn
and retain it inside the blocking task despite HTTP cancellation. Stored PHC
parameters are bounded/validated before verification. Unknown usernames perform
dummy verification using the same cost. Helpers and sensitive structs have no
Debug; failures/logs do not echo secrets, verifiers, cookies or private paths.

Setup/session tokens: 32 random bytes encoded as exactly 64 lowercase hex chars.
Store only session SHA256 verifiers, expiry, account generation and revoked state.
Authenticated sessions expire after12hours on database time and rotate on every
successful claim/login. A successful login atomically retires only the old session
presented in that request; a failed login preserves it. Server-side revocation and account disablement are checked
on every protected request. Every write rechecks current authorization inside the
same serialized transaction as its effects. Login rechecks unchanged password
verifier, active account and generation after verification; concurrent revoke-all
cannot revive an old generation. At most32 active sessions per account; obsolete
expired/revoked/generation-invalid rows may be removed when creating a session.

Login throttles are bounded durable fixed rows: global20attempts/60seconds and
5attempts/60seconds for each of64 key-HMAC username buckets (same behavior for
known/unknown usernames, no attacker-created rows). Setup has global5/60seconds.
Counters are reserved before costly work. These are temporary windows, not
permanent lockouts. No forwarded IP header is trusted.

## HTTP and client contract

All JSON bodies deny unknown fields and are at most8KiB. Errors are sanitized
JSON {error:code}; all responses use no-store. Username input is trimmed and ASCII
lowercased; canonical names are3–32 ASCII letters/digits/underscore/hyphen.
Account IDs are decimal strings in JSON. Role values are owner/member only.

POST requires exactly one Origin equal to canonical configured HTTPS origin,
exactly one X-Reborn-Product:keida-hub-reborn and
X-Reborn-Contract:reborn-auth-v1, plus exactly one X-CSRF-Token. Missing/wrong
client product/contract returns426 before effects; invalid/ambiguous Origin or
CSRF returns403. Protected GETs also require product/contract admission.

Parse every Cookie header. Duplicate relevant cookie names, even identical,
malformed/noncanonical values and cross-session CSRF are rejected. Ignore valid
unrelated cookies. Session namespace is __Host-keida-reborn-session; anonymous
form namespace is __Host-keida-reborn-form. Both use Secure,HttpOnly,SameSite=Strict,
Path=/, no Domain. Never accept IDs from body/query as authentication.

Anonymous form cookie is signed/key-bound and expires after10minutes; CSRF uses a
separate HMAC domain tied to that cookie. Session CSRF uses a separate HMAC domain
tied to its fresh opaque session token. Tokens never enter URLs/logs/browser
storage. The JSON response exposes only the appropriate CSRF token, never cookie,
password, setup token/verifier or key. GET form deliberately issues a fresh anonymous cookie even if oldcookies are
malformed; this recovery exception never authorizes an effect. A fresh GET form recovers expiry without
retaining/replaying submitted credentials. Successful claim/login clears the
anonymous cookie and sets a fresh authenticated one.

| Endpoint | Input and result |
| --- | --- |
| GET /api/auth/form | Public after private preparation/key binding; {csrf_token,contract,setup_available}, signed anonymous cookie |
| POST /api/auth/claim | {setup_secret,username,password}; anonymous cookie/CSRF;201 {account,csrf_token}; consumed/expired/wrong setup rejected |
| POST /api/auth/login | {username,password}; anonymous cookie/CSRF;200 {account,csrf_token}; unknown/wrong/disabled generic401 |
| GET /api/auth/session | Session cookie plus client contract;200 {account,csrf_token}; invalid/expired/revoked401 |
| POST /api/auth/logout | Session/CSRF;204 and cookie expiry |
| POST /api/auth/revoke-all | Session/CSRF; increments own account generation atomically;204 and cookie expiry |
| POST /api/owner/members | Owner/session/CSRF; {username,password};201 {account}; no role parameter/promotion/reset |
| GET /api/owner/members | Owner/session/contract; at most100 public member records plus truncated flag |
| POST /api/owner/members/{id}/revoke | Owner/session/CSRF; disables only a member, invalidates sessions;204; repeated disabled-member request no further effect |

Private/member denials are403, missing/invalid session401, unavailable database or
key binding503, duplicate username/preparation conflict409, throttle/hash saturation
429. Unknown private routes remain404. Each PostgreSQL statement is bounded to2seconds and lock waits to1.5seconds; the
readiness budget is2seconds total. Existing global request and shutdown bounds
remain. No provider credentials or encrypted provider-secret store is introduced
without a real provider caller; that part of M0 remains open.

## Database and verification

Add migration0002, never edit accepted0001. Schema metadata advances to2; all auth
constraints, key binding, owner uniqueness and token lengths are durable. Actual
SQLx checked literal queries and regenerated metadata remain required. One global
auth singleton serializes short auth mutations; no transaction spans password
hashing or remote work. This is a deliberate initial correctness boundary, not a
performance claim. Existing schema tests are extended for2 and migration upgrade;
expectations are not weakened or skipped.

New native actual HTTP/PostgreSQL tests independently cover owner preparation,
claim/login concurrency, one owner, expiry/rollback, password verification, private
key refusal/mismatch, username roles, revocation/generation/expiry, duplicates,
wrong Origin/CSRF/contracts, throttling, at-rest verifier/response/log privacy and
restart persistence. Supported prior schema upgrade is exercised. Browser Secure
cookie transport, Askama forms/rejected-form recovery, account-switch/late-response
isolation, encrypted provider-secret enrollment and packaged recovery remain
explicit later gates. No application browser acceptance is inferred from API tests.

## Protocol amendments before first publication

The initial12-byte password proposal was corrected to15Unicode scalar values
(minimum),128characters/512bytes(maximum), preserving exact bytes. A byte minimum
incorrectly admitted short non-ASCII passwords. See the primary
[OWASP authentication guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
for the no-MFA minimum; this is not a claim of full standards certification.
Successful login now atomically retires the presented prior session, including
an account switch, while failed login preserves it. GETsession also returns a
decimal-string session_generation for later account-scoped client handling.

The exact anonymous wire form is v1.decimalIssued.nonce64.mac64. The MAC is
HMAC-SHA256(instance-key, b"reborn/form-cookie/v1\0" + unsigned ASCII
v1.decimalIssued.nonce64). Form CSRF uses b"reborn/form-csrf/v1\0" + fullcookie;
session CSRF uses b"reborn/session-csrf/v1\0" + canonical sessiontokenASCII64.
All HMAC outputs are canonical lowercase64hex. Token verifiers are SHA256 of
canonical tokenASCII64. The key fingerprint hashes b"reborn/instance-key/v1\0"
then key32. Username buckets use HMAC b"reborn/login-bucket/v1\0" + canonical
username, firstbyte modulo64 plus1. These purpose tags are distinct protocols.

A transport failure or request deadline is an uncertain result, not proof of no
commit. Claim retry cannot create a second owner; after a lost claim response the
operator uses a fresh form and normal password sign-in. A lost member-creation
response is reconciled through the authorized member list and unique username.
Revocations recheck current authority; no automatic credential or POST replay is
implemented. Native phase contracts test stale state directly, while actual HTTP
concurrency/response-loss cases remain separate evidence.

Exact schema readiness is enforced at every actual auth HTTP entrypoint and before
CLI owner preparation, rather than being only a diagnostic. Header/client
admission precedes that database read. HEAD uses the same read admission and
schema guard as GET because Axum dispatches it through the same handlers.
Controlled concurrent upgrades still need
the documented single migration owner and a held write fence; the schema probe is
not a replacement for deployment coordination. Unknown future ledger/schema state
after startup refuses auth reads/writes until the matched schema is restored.
The owner singleton additionally has a composite foreign key requiring owner_role
to be owner; it cannot point at a member row.
