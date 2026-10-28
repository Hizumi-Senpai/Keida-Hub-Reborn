# M4.1 Discord identity: frozen implementation contract

CORE scope frozen October27,2026 (America/Chicago), before application edits.
Baseline accepted source0.1.15 `e501a725cccffcb59a4da965d8fbfc28fdfe68ab`
is documentation only; live remains0.1.14/schema11/source26fee1ad.
The next accepted application source is expected0.1.16/schema12. Current public
owner/provider acceptance and the wider M0–M3 checklists remain open.

## User result and limits

An existing active local account can deliberately link one verified Discord
identity, inspect its saved ID/display label/verification time, and unlink it
locally. A verified candidate requires a separate explicit confirmation before
it becomes a link. Local passwords, recovery, roles and session generations do
not change. A link records past identity verification, not a continuing Discord
grant, server membership or role. No Discord sign-in, account merging, friends,
guild authority, bots, SSO, email scope, provider business writes or inherited
Original/Rewrite credentials. Owner application enrollment starts unconfigured.

## Concrete protocol and browser boundary

Fixed profile `discord-identify-v1`: browser authorization
`https://discord.com/oauth2/authorize`, token
`https://discord.com/api/oauth2/token`, revoke
`https://discord.com/api/oauth2/token/revoke`, user
`https://discord.com/api/v10/users/@me`; issuer exactly `https://discord.com`.
Code flow, independent random256-bit state and PKCE verifier, S256 only,
scope exactly `identify`, `prompt=consent`, callback exactly configured public
origin plus `/account/discord/callback`. No endpoint fallback or configurable
provider endpoints. Form-encoded client_secret_post token/revoke bodies.

Preserve existing Secure/HttpOnly/SameSite=Strict SESSION and FORM cookies and
existing CSP form-action self. Never clear either from public callback/return or
their errors/timeouts. Two separate Secure/HttpOnly/Strict/path=/, Max-Age600
cookies, `__Host-keida-reborn-discord-flow` and
`__Host-keida-reborn-discord-return`, carry independent opaque capabilities.

1. Authenticated native POST `/account/discord/start` admits exact Origin,
   product=`keida-hub-reborn`, contract=`reborn-discord-link-v1`, session CSRF and
   `base_revision`, `base_flow_generation`, `base_application_revision`. It
   advances durable flow generation, replaces any old unfinished attempt, sets
   FLOW, clears only RETURN and303s to `/account/discord/authorize`.
2. Authenticated GET authorize validates FLOW/current authority/revisions and
   renders a fixed-provider ordinary anchor. No private identity in native HTML.
   The anchor navigates to Discord without widening form-action.
3. Public GET callback strictly bounds/rejects duplicates, malformed escapes,
   unexpected fields and missing/wrong issuer; state plus exactly code OR error
   is required. Whole raw query<=4096 bytes, state exactly64 lower hex, code
   1..1024 visible ASCII; optional bounded error_description/error_uri are never
   reflected or fetched. It escrows a code/closed denial once, sets RETURN on a
   successful state claim, and303s to clean `/account/discord/return`. No OAuth
   IO, link write, account disclosure or session-cookie clearing here. HEAD has
   no effect and is405. Invalid/replayed callback changes no cookies.
4. Neutral return HTML has no identity, query echo or external resources. Its
   normal anchor `/workspace#identity` gives a real same-origin user action;
   a redirect chain alone is not assumed to restore Strict cookies.
5. A scoped fresh JSON status read precedes review. Review POST requires current
   SESSION+original FLOW+RETURN, CSRF and all revisions, claims the attempt once
   before IO, exchanges once and fetches identity once. Recheck authority after
   IO and before revealing a candidate. Confirmation POST commits only that
   server-held candidate under current authority and all revisions.

All new native documents/errors/timeouts use no-store, no-referrer, private CSP
and no third-party resources. Private identities/candidates exist only in scoped
JSON and the lifecycle-cleared Svelte Identity view. Late fixed-cookie delivery
can require restarting an unfinished flow; it can never overwrite an accepted
link or change the real auth cookies. No automatic review/confirm replay.

## Closed wire surface

All revisions/generations/IDs are canonical decimal strings; Discord ID is
positive full-u64 (no leading zero, <=18446744073709551615), never JS number.
Usual workspace product/contract/schema/account/session_generation envelope.

GET `/api/workspace/discord` adds:

```text
application: {configured, revision, callback_uri, profile:"discord-identify-v1"}
link: {revision, flow_generation, identity:null|{id,display_name,verified_at}}
attempt: {phase, candidate:null|{id,display_name}, cleanup:null|"acknowledged"|"unconfirmed", error:null|closed_code}
```

Phases: none, awaiting_discord, ready_to_review, reviewing, review_ready,
cancelled, failed, restart_required. `verified_at` is an integer Unix-seconds
decimal string. Candidate and saved display_name are1..80 Unicode scalars/<=320 UTF8 bytes,
not Unicode-whitespace-only, with control/bidi characters rejected; they are escaped metadata,
not identity authority. Errors remain closed generic codes.

POST `/api/workspace/discord/review` and `/confirm`: exact JSON three base fields
above. POST `/cancel` and `/unlink`: exact base_revision/base_flow_generation.
Usual authenticated workspace Origin/product/CSRF headers apply. Mutation
responses use the same current status envelope; uncertain replies require a
fresh GET before any deliberate next action. No user-supplied candidate ID. Closed attempt errors are denied, invalid_response,
timeout, transport, provider_error, unavailable and restart_required.

Owner GET `/api/owner/discord/application` returns the workspace envelope plus
the same public application metadata, never client ID/secret. Owner PUT accepts
exact `{base_revision,application:null|{client_id,client_secret,callback_logging_reviewed:true}}`.
Client ID uses the same canonical u64 rule; client secret is1..256 ASCII graphic
bytes. Remove/replace increments application revision, invalidates unfinished
attempts, retains accepted links. Never return credentials or secrets in errors.

## Authority, persistence and bounds

Schema12 adds only `discord_application` fixed singleton(revision,sealed) and
`discord_links` retained per-account row(account_id,revision,flow_generation,
discord_id,display_name,verified_at). Nullable identity tuple is consistent;
nonnull canonical Discord ID has a global unique constraint. Unlink keeps the
tombstone and increments revision+flow generation, including repeated unlink;
cancel advances flow generation; successful confirm advances both. Start on an
already linked account conflicts. No implicit replace, merge or promotion.

Application encrypted frame4 has its own domain/AAD/revision; existing frames
remain unchanged. Runtime cannot insert/delete singleton or delete link rows or
update account_id. SQLx queries are compile-checked against actual PostgreSQL.
Use existing singleton authority lock, key and current principal checks, then
lock application/link rows in consistent order. No DB transaction spans IO.

RAM attempts: maximum64 global, one per account, monotonic600-second TTL; bounded
zeroizing state/code/verifier/token buffers, no Debug secrets. Bind exact account,
session verifier/generation, key fingerprint, app revision, link revision and
durable flow generation. Restart invalidates unfinished flows; no code/token
backup or replay. Exhaustion fails closed. Review cancellation/global timeout
makes the claimed code non-retryable and requires a new flow. Confirmation checks
the same monotonic deadline after authority/row locks immediately before its write
and before commit; the deadline governs locked transaction admission, not response arrival.

Fixed TLS-validated IO, no proxy, redirects or automatic retries; at most8
concurrent exchanges, total3 seconds within the existing4-second request limit,
connect<=500ms, each request<=1200ms; token/revoke body<=16KiB, user body<=32KiB.
Require Bearer, exact identify scope and bounded positive expiry; discard all
unknown body fields and never persist access/refresh tokens. Best-effort revoke
once after identity read; report acknowledged or unconfirmed truthfully and
discard tokens either way. Revocation affects the whole Discord authorization;
local unlink performs no provider IO. Token/refresh/client secret/verifier/CSRF
never enter URLs. OAuth code/state necessarily enter the callback URL.

Fixture-only host DNS/socket+CA transport may be enabled only for loopback or
`.test` app origins, with fixed Discord URI strings and validated fixture TLS;
any test override with a real production origin fails startup. No owner endpoint
override. Actual native and packaged-image tests use isolated synthetic TLS
Discord, no real Discord access. The browser fixture uses an owned bounded CONNECT
relay accepting only discord.com:443 to its fixed loopback TLS socket, plus DNS
denial; it performs no external DNS/forwarding. Tests must distinguish clock-controlled expiry
from actual elapsed time and preserve all existing workflows/real form expiry.

## Integration, qualification and real dependencies

Identity is the eleventh workspace view; preserve the single15-second workspace
scheduler, account scoping, drafts and private lifecycle cleanup. Preserve exact
live14 JS/CSS as compat0.1.14 before rebuilding. Add guide profile `identity-v1`,
preserving exact legacy/media-v1/queues-v1 responses. Discord catalog remains
overall planned while explicitly offering this bounded Identity workflow.

Require Rust/frontend checks, real SQLx metadata, HTTP race/privacy/authority
contracts, native plus exact-image desktop/390px/browser workflows, head and
accepted-main CI, image identity and current schema11→12 recovery before manual
Reborn-only deployment. Preserve all16 prior domain relations, four sequence
states/is_called and ledger1–11; add explicit application/link/newer-write
preservation. Old14 must refuse schema12. Final fenced current-data backup/
restore must not overwrite newer writes; automatic_old_backup_restore=false.

Real application registration, dedicated owner-provided credentials, exact
callback registration, upstream callback query-log privacy review and real owner
Discord/browser acceptance are named dependencies. No secret requests in chat,
configuration dumps or protected proxy/tunnel restarts to manufacture evidence.
Full M4 and earlier acceptance checklists remain open.

Official protocol references: Discord OAuth documentation and current metadata
(`https://discord.com/.well-known/oauth-authorization-server`), Discord User
resource, RFC7636, RFC9207 and RFC9700. The human browser authorization URL is
deliberately frozen above despite the metadata's different advertised path.
