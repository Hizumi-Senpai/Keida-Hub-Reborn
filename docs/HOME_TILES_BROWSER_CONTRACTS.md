# Home tile browser expectations

Frozen before inspecting the new tile implementation for issue43. These are
behavior expectations, not execution receipts or production acceptance.

The new `reborn-workspace-browser --tiles` invocation must drive the real Rust
application, disposable PostgreSQL, TLS proxy and pinned Chromium through native
forms. It has its own bounded invocation; the retained fifteen workflows and
refresh invocation keep their existing budgets.

## Independent expectations

- Home starts with game servers, Jellyfin, requests, downloads and saved services
  for an owner. A member sees game servers and saved services. Notes are optional.
  Provider details and enrollment remain in their existing sidebar views.
- Add/remove/order/normal-or-wide changes are local until deliberate Save. Reset
  and Cancel cannot write. At least one tile remains selected. Keyboard controls
  have usable focus after moves, including a boundary move whose button becomes
  disabled; reading order agrees with the selected order.
- A successful save survives a fresh document. A second browser with an older
  revision cannot overwrite it. Conflict comparison retains local changes until
  an explicit choice. A failed canonical conflict read cannot present an old
  snapshot as a verified comparison; its retry must succeed before choices are
  offered. A committed response lost behind the real proxy becomes
  uncertain, then a deliberate authorized read reconciles without another PUT.
- Rearranging and navigating preserve the actual note and service editor
  elements, their unfinished content and meaningful selection/focus. Private
  state is removed on blur/account loss, and a late authorized response cannot
  restore it after revocation.
- The catalog and selected layout are account-scoped. Owner-only provider tiles
  cannot appear in a member's Home or add controls. Member edits cannot alter the
  owner's saved layout.
- Home provider checks use existing authorized GET observation resources.
  Previewing or saving a layout does not enroll, wake, start, stop or write to a
  provider. Hidden tiles do not introduce independent background pollers.
- Desktop and 390px Home/editor have no horizontal overflow, usable native
  keyboard controls and no pinned Axe WCAG A/AA violations. Reduced-motion
  presentation remains useful.
- Failure to load the browser module leaves native fresh-workspace and Account
  recovery links usable. A surviving same-account/generation note draft is
  offered after a fresh document and recovered only by deliberate choice, with
  no automatic save or credential replay.

Existing three-panel layout and v1 API compatibility remain independent server
contracts. The old Home arrangement behavior must not be counted as new tile
acceptance merely because its former selector names still exist.

Linux Chromium/viewport verification does not establish native iPhone/Safari,
real provider, outside-LAN joining or game-control acceptance. Missing browser,
database or TLS prerequisites fail the invocation; they never become a skip.
