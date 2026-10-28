<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { DiscordApplication, IdentityAction, IdentityState } from './controller';
  export let binding: string;
  export let owner = false;
  export let active = false;
  export let state: IdentityState;
  export let check: () => Promise<void>;
  export let act: (action: IdentityAction) => Promise<void>;
  export let saveApplication: (base: string, application: DiscordApplication | null) => Promise<void>;
  let applicationForm: HTMLFormElement | undefined;
  let enrollmentScope = '';
  let starting = false;
  const when = (seconds: string) => new Date(Number(BigInt(seconds)) * 1000).toLocaleString('en-US', { timeZone: 'America/Chicago', timeZoneName: 'short' });
  function syncForm(current: IdentityState, shown: boolean, allowed: boolean): void {
    const scope = shown && allowed && current.value ? `${current.value.application.revision}:${current.value.application.configured}` : '';
    if (!shown || !allowed || scope !== enrollmentScope || current.save !== 'idle') applicationForm?.reset();
    if (!shown) starting = false;
    enrollmentScope = scope;
  }
  $: syncForm(state, active, owner);
  $: canChange = active && state.phase === 'ready' && state.save === 'idle' && !!state.value && !starting;
  $: unfinished = !!state.value && !['none', 'cancelled'].includes(state.value.attempt.phase);
  onDestroy(() => applicationForm?.reset());
  async function checkState(): Promise<void> { applicationForm?.reset(); starting = false; await check(); }
  async function submitApplication(remove = false): Promise<void> {
    const current = state.value;
    if (!owner || !canChange || !current) return;
    const data = applicationForm ? new FormData(applicationForm) : undefined;
    const application: DiscordApplication | null = remove ? null : {
      client_id: String(data?.get('client_id') ?? ''), client_secret: String(data?.get('client_secret') ?? ''),
      callback_logging_reviewed: data?.get('callback_logging_reviewed') === 'on',
    };
    // Clear real credential inputs before the first asynchronous step.
    applicationForm?.reset(); data?.delete('client_secret');
    try { await saveApplication(current.application.revision, application); }
    finally { if (application) application.client_secret = ''; }
  }
</script>

<div class="identity-view">
  <section class="card identity-intro"><p class="eyebrow">YOUR DISCORD IDENTITY</p><h2>Choose a deliberate connection</h2><p>Link a verified Discord identity to this Reborn account. You review the identity and confirm it before a link is saved.</p><p class="field-help">Your local sign-in and recovery stay available. A saved link records past identity verification; Discord sign-in, friends, server roles and bot setup are still planned.</p></section>
  <section class="card identity-card" data-discord-identity data-phase={state.value?.attempt.phase ?? state.phase} data-configured={String(state.value?.application.configured ?? false)} data-link-revision={state.value?.link.revision ?? ''} data-flow-generation={state.value?.link.flow_generation ?? ''} data-app-revision={state.value?.application.revision ?? ''} data-save={state.save} aria-label="Discord identity connection">
    <p class="workspace-status" role="status" data-discord-status>{state.message || 'Check your current Discord link to begin.'}</p>
    <button class="button secondary discord-check" disabled={!active || state.save === 'saving' || state.phase === 'loading'} onclick={() => void checkState()}>Check Discord identity status</button>
    {#if active && state.phase === 'ready' && state.value}
      {@const current = state.value}
      {#if current.link.identity}
        <div class="identity-saved" data-discord-linked>
          <h3>Linked Discord identity</h3>
          <dl class="identity-details"><dt>Display name at verification</dt><dd>{current.link.identity.display_name}</dd><dt>Discord ID</dt><dd class="identity-id">{current.link.identity.id}</dd><dt>Verified</dt><dd>{when(current.link.identity.verified_at)}</dd></dl>
          <p class="field-help">The immutable Discord ID identifies this link. Display names can change.</p>
          <button class="text-button discord-unlink" disabled={!canChange} onclick={() => void act('unlink')}>Unlink Discord identity locally</button>
          <p class="field-help">Local unlink removes this account’s saved identity link. It does not contact Discord or change your local sign-in.</p>
        </div>
      {:else}
        <p class="identity-empty">No Discord identity linked.</p>
        {#if current.application.configured}
          <form method="post" action="/account/discord/start" class="identity-start-form" onsubmit={() => { starting = true; applicationForm?.reset(); }}>
            <input type="hidden" name="product" value="keida-hub-reborn">
            <input type="hidden" name="contract" value="reborn-discord-link-v1">
            <input type="hidden" name="csrf_token" value={binding}>
            <input type="hidden" name="base_revision" value={current.link.revision}>
            <input type="hidden" name="base_flow_generation" value={current.link.flow_generation}>
            <input type="hidden" name="base_application_revision" value={current.application.revision}>
            <button class="button primary discord-start" type="submit" disabled={!canChange || ['ready_to_review', 'reviewing', 'review_ready'].includes(current.attempt.phase)}>{unfinished ? 'Start a new Discord link' : 'Start Discord identity link'}</button>
          </form>
          <p class="field-help">Continue through the Reborn handoff page to Discord, then return to this browser to review the result. Starting a new link cancels an older unfinished attempt.</p>
        {:else}<p class="notice">Discord linking is waiting for dedicated application setup by an owner. Existing links can still be unlinked locally.</p>{/if}
      {/if}
      {#if current.attempt.phase === 'ready_to_review'}
        <section class="identity-review" aria-label="Review returned Discord identity"><h3>Discord returned</h3><p>Review fetches your Discord identity once. You will choose separately whether to save the link.</p><button class="button primary discord-review" disabled={!canChange} onclick={() => void act('review')}>Review Discord identity</button></section>
      {/if}
      {#if current.attempt.phase === 'review_ready' && current.attempt.candidate}
        <section class="identity-review" data-discord-candidate aria-label="Confirm Discord identity"><h3>Confirm this identity</h3><dl class="identity-details"><dt>Display name</dt><dd>{current.attempt.candidate.display_name}</dd><dt>Discord ID</dt><dd class="identity-id">{current.attempt.candidate.id}</dd></dl><p>This identity has been verified for this attempt. Choose Confirm to save it to your current Reborn account.</p><button class="button primary discord-confirm" disabled={!canChange} onclick={() => void act('confirm')}>Confirm Discord identity link</button></section>
      {/if}
      {#if current.attempt.cleanup === 'acknowledged'}<p class="field-help">Discord acknowledged revoking this verification grant. This revokes tokens for the whole application authorization.</p>{:else if current.attempt.cleanup === 'unconfirmed'}<p class="notice">Discord grant revocation could not be confirmed. Reborn discarded the verification tokens. You can remove the application authorization in Discord’s Authorized Apps settings.</p>{/if}
      {#if unfinished}<button class="text-button discord-cancel" disabled={!canChange || current.attempt.phase === 'reviewing'} onclick={() => void act('cancel')}>Cancel unfinished Discord link</button>{/if}
      {#if owner}
        <details class="identity-enrollment"><summary>Set up Discord application access</summary><p>Enroll a dedicated Discord application for Reborn. The secret is encrypted on the server and will not be shown again.</p><p>Register this exact redirect URI in the application’s OAuth settings:</p><p class="identity-callback"><code>{current.application.callback_uri}</code></p><p class="field-help">Only the identify permission is requested. Before real use, review callback query handling in access logs at every proxy and application layer. OAuth codes and state arrive in the callback URL.</p>
          <form bind:this={applicationForm} autocomplete="off" onsubmit={(event) => { event.preventDefault(); void submitApplication(); }}>
            <label for="discord-client-id">Discord application ID</label><input id="discord-client-id" name="client_id" type="text" inputmode="numeric" pattern={'[1-9][0-9]{0,19}'} maxlength="20" required disabled={!canChange} autocomplete="off">
            <label for="discord-client-secret">Discord application secret</label><input id="discord-client-secret" name="client_secret" type="password" minlength="1" maxlength="256" pattern="[!-~]+" required autocomplete="off" disabled={!canChange}>
            <label class="identity-ack" for="discord-logging-ack"><input id="discord-logging-ack" name="callback_logging_reviewed" type="checkbox" required disabled={!canChange}>I reviewed callback query logging at every layer before enabling this application.</label>
            <button class="button primary discord-save-application" type="submit" disabled={!canChange}>Save Discord application</button>
          </form>
          {#if current.application.configured}<button class="text-button discord-remove-application" disabled={!canChange} onclick={() => void submitApplication(true)}>Remove Discord application access</button>{/if}
          <p class="field-help">Replacing or removing application access cancels unfinished links. Accepted identity links remain saved and can be unlinked locally.</p>
        </details>
      {/if}
    {/if}
  </section>
</div>
