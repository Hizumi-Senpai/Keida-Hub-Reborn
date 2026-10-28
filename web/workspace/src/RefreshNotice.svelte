<script lang="ts">
  import { onMount, tick } from 'svelte';
  import type { Model } from './controller';
  import type { refresh } from './refresh';
  export let control: ReturnType<typeof refresh>;
  export let inspect: () => { busy: boolean; drafts: boolean };
  export let workspaceModel: Model;
  const updates = control.model;
  let flags = { busy: false, drafts: false }, revision = 0;
  $: { void workspaceModel; void revision; flags = inspect(); }
  onMount(() => {
    const changed = () => { void tick().then(() => { ++revision; }); };
    document.addEventListener('input', changed); document.addEventListener('change', changed);
    return () => { document.removeEventListener('input', changed); document.removeEventListener('change', changed); };
  });
</script>

{#if $updates.review || ['changed', 'unavailable', 'sign-in-required', 'incompatible', 'could-not-reconnect'].includes($updates.phase)}
  <section class="refresh-notice notice" aria-label="Workspace refresh" data-refresh-phase={$updates.phase}>
    <p class="eyebrow">YOUR PAGE, YOUR CHOICE</p>
    <h2>Refresh when you are ready.</h2>
    <p role="status" data-refresh-status>{$updates.message}</p>
    {#if $updates.loaded || $updates.running}
      <dl class="refresh-builds">
        {#if $updates.loaded}<dt>Loaded page</dt><dd>{$updates.loaded.version} <span class="field-help">{$updates.loaded.commit.slice(0, 12)}</span></dd>{/if}
        {#if $updates.running}<dt>Running server</dt><dd>{$updates.running.version} <span class="field-help">{$updates.running.commit.slice(0, 12)}{#if $updates.running.product !== $updates.loaded?.product} · {$updates.running.product}{/if}</span></dd>{/if}
      </dl>
    {/if}
    {#if $updates.review}
      <p>Save or finish work in this page before refreshing. Unsaved forms do not move to the next document.</p>
      {#if flags.drafts}<p data-refresh-drafts>There is unfinished work in your note, arrangement or a form. You can stay and finish it, or deliberately discard it.</p>{/if}
      {#if flags.busy}<p data-refresh-busy>A change is pending or its result needs checking. Finish it or check the saved state before refreshing. It will not be sent again.</p>{/if}
      <div class="button-row">
        {#if $updates.phase === 'reconnecting'}
          <button class="button secondary refresh-cancel" onclick={control.cancel}>Cancel refresh checks</button>
        {:else if $updates.phase === 'compatible-ready'}
          <button class="button primary refresh-navigate" disabled={flags.busy} onclick={() => control.navigate(flags.drafts)}>{flags.drafts ? 'Discard unsaved work and refresh' : 'Refresh workspace'}</button>
        {:else if $updates.phase !== 'sign-in-required' && $updates.phase !== 'incompatible'}
          <button class="button primary refresh-prepare" disabled={flags.busy} onclick={() => void control.reconnect()}>Check access for refresh</button>
        {/if}
        <button class="text-button refresh-stay" onclick={control.stay}>Stay on this page</button>
      </div>
      {#if $updates.phase === 'sign-in-required' || $updates.phase === 'incompatible'}<p class="field-help">Private content is hidden. <a href="/account">Open your account</a> to choose a fresh document. Review any unfinished work before leaving.</p>{/if}
    {:else}
      <button class="button secondary refresh-review" onclick={control.review}>Review refresh</button>
    {/if}
  </section>
{/if}
