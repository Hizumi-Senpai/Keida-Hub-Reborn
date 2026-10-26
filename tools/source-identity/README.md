# Reborn source identity

This dependency-free Rust tool reads the exact checked-out commit, tree and
complete Git history. The fixed product is `keida-hub-reborn`; its permanent
anchor is `c06c3a03a3be17c4293e77b57fa3063ec65c8ad8`. The committed
`version-policy.toml` must match that contract. A different product, anchor or
policy is rejected.

The checkout must be clean, including untracked files, and `HEAD` must equal the
full lowercase candidate SHA. Shallow history, missing objects and grafted history
are refused. Git replacement objects are disabled for every read. Generated build
outputs belong in the repository's reviewed `.gitignore`; the tool does not hide
untracked source itself. Index flags that hide tracked changes (`skip-worktree`
and `assume-unchanged`) are refused. Inherited alternate Git worktree/index inputs
are removed, and the reported worktree root must match the explicit repository.

## Actual caller contract

Run the tool from a pinned Rust 1.99.1 build with a full Git checkout. The caller
must independently authenticate the accepted main ref and its exact expected SHA,
verify main protections/merge policy and the relevant exact-head checks. A local
branch named `main` is not authenticated approval. This tool checks Git facts;
it cannot certify GitHub governance, CI, artifact provenance or installation.

```text
reborn-source-identity --repo . --candidate FULL_SHA --channel development
reborn-source-identity --repo . --candidate FULL_SHA --channel preview --main-ref refs/remotes/origin/main --main-sha VERIFIED_MAIN_SHA --base ACCEPTED_BASE_SHA
reborn-source-identity --repo . --candidate FULL_SHA --channel accepted --main-ref refs/remotes/origin/main --main-sha VERIFIED_MAIN_SHA
```

`development` produces `0.1.0-development.<head12>` and no accepted ordinal. It
refuses main/base flags to prevent an ambiguous qualification. `preview` requires
an accepted first-parent base and a candidate descending from that base, then
produces `0.1.(base-N+1)-preview.<head12>` with no accepted ordinal. Two concurrent
previews may have the same provisional number. A candidate already on main's
first-parent path cannot be labeled a preview.

`accepted` requires the candidate on the verified main first-parent path after
the fixed anchor. Its version is `0.1.N`, counting only that path, so side-parent
feature commits do not become accepted versions. An older accepted candidate
retains its identity when main advances. The main ref's expected SHA is compared
before and after derivation; changes refuse the invocation. No tool command
changes Git history or creates bump commits.

The default output is one JSON object with `product`, `version`, `commit`, `tree`,
`ordinal`, `channel` and `contract`. `ordinal` is null for development/preview.
`--format env` emits these newline-delimited records:

```text
REBORN_BUILD_PRODUCT=keida-hub-reborn
REBORN_BUILD_VERSION=...
REBORN_BUILD_COMMIT=...
REBORN_BUILD_TREE=...
REBORN_BUILD_ORDINAL=...
REBORN_BUILD_CHANNEL=...
REBORN_BUILD_CONTRACT=reborn-auth-v1
```

The values consist solely of validated lowercase hexadecimal, decimal digits and
fixed identifiers/punctuation; no repository text or arbitrary CLI value enters
them. A successful env result can be appended directly to `GITHUB_ENV` with output
redirection. It is data and must never be shell-sourced or evaluated. Generate it
only after the source is committed and clean; keep temporary output outside the
checkout or in a reviewed ignored build-output path. Consumers must reject missing
or duplicate records and compile these fields into the binary. Runtime environment
variables must not relabel an already compiled binary. Compiler input is still
trusted build input, not signed provenance.

## Verification and remaining scope

New tests create real disposable Git repositories, concurrent feature branches
and serialized merge commits. They verify provisional numbers, accepted ordering,
side-parent refusal, stable retries/older-source identities, dirty/shallow/missing
history, expected-ref mismatch, wrong product and explicit development labeling.
Synthetic tests inject their temporary root only through a private test helper;
the public API/CLI has no alternate-anchor switch.

This slice does not publish artifacts, bind an image/binary digest, implement
create-once release manifests, update a channel pointer, install a host updater,
or prove protected-main governance. Late-publisher monotonicity and conflicting
artifact refusal therefore remain separate acceptance gates. Neither source
identity nor a passing test establishes a release, deployment or browser identity.
