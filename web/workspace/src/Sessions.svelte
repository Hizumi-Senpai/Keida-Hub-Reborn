<script lang="ts">
  import { onMount } from 'svelte';
  import type { SessionsState } from './controller';
  export let active = false;
  export let state: SessionsState;
  export let check: () => Promise<void>;
  export let revoke: (id: string) => Promise<void>;
  let checkButton: HTMLButtonElement;
  let returnFocus = false;
  const when = (seconds: string) => new Date(Number(BigInt(seconds)) * 1000).toLocaleString('en-US', { timeZone: 'America/Chicago', timeZoneName: 'short' });
  const machineTime = (seconds: string) => new Date(Number(BigInt(seconds)) * 1000).toISOString();
  $: canAct = active && state.phase === 'ready' && state.save === 'idle' && !!state.value;
  function cancelFocus(): void { returnFocus = false; }
  async function signOutOther(id: string, event: MouseEvent): Promise<void> {
    const button = event.currentTarget;
    returnFocus = button instanceof HTMLButtonElement && document.activeElement === button;
    await revoke(id);
    const restore = returnFocus; returnFocus = false;
    // A removed row no longer owns focus. Return to the stable list check only
    // if no later user action or privacy loss chose a different destination.
    if (restore && active && document.visibilityState === 'visible' && document.hasFocus()
        && (document.activeElement === document.body || document.activeElement === document.documentElement)
        && checkButton?.isConnected && !checkButton.disabled) checkButton.focus({ preventScroll: true });
  }
  $: if (!active) cancelFocus();
  onMount(() => {
    const moved = (event: FocusEvent) => {
      if (event.target !== document.body && event.target !== document.documentElement) cancelFocus();
    };
    document.addEventListener('pointerdown', cancelFocus, true);
    document.addEventListener('keydown', cancelFocus, true);
    document.addEventListener('focusin', moved, true);
    window.addEventListener('blur', cancelFocus);
    return () => {
      cancelFocus();
      document.removeEventListener('pointerdown', cancelFocus, true);
      document.removeEventListener('keydown', cancelFocus, true);
      document.removeEventListener('focusin', moved, true);
      window.removeEventListener('blur', cancelFocus);
    };
  });
</script>

<div class="sessions-view">
  <section class="card sessions-intro"><p class="eyebrow">YOUR SIGN-IN SESSIONS</p><h2>Review your active sign-ins</h2><p>Review your active Reborn sign-ins and deliberately sign out one other session. Each entry shows when that session was created and when it expires.</p><p class="field-help">This list does not identify a device, browser, IP address or last-used time. Your account supports up to 32 active sessions. It shows a complete snapshot when checked, rather than session history.</p></section>
  <section class="card sessions-card" data-sessions-view data-phase={state.phase} data-save={state.save} data-session-count={state.value?.sessions.length ?? ''} data-checked-at={state.value?.checked_at ?? ''} aria-label="Active sign-in sessions">
    <div class="sessions-heading"><h2>Active sessions</h2><button class="button secondary sessions-check" bind:this={checkButton} disabled={!active || state.phase === 'loading' || state.save === 'saving'} onclick={() => void check()}>Check active sessions</button></div>
    <p class="workspace-status" role="status" data-sessions-status>{state.message || 'Check your active sign-in sessions to begin.'}</p>
    {#if active && state.phase === 'ready' && state.value}
      <p class="field-help sessions-snapshot">Checked <time datetime={machineTime(state.value.checked_at)}>{when(state.value.checked_at)}</time>. Later sign-ins, expiry and sign-outs can change the next result.</p>
      <ul class="session-list" aria-label="Your active sign-in sessions">
        {#each state.value.sessions as session (session.id)}
          <li class="session-row" data-session-row data-session-id={session.id} data-current={String(session.current)}>
            <div class="session-row-heading"><h3>{session.current ? 'Your current sign-in' : 'Another sign-in session'}</h3>{#if session.current}<span class="quiet-label session-current-badge">This session</span>{/if}</div>
            <dl class="session-details"><dt>Created</dt><dd><time data-session-created datetime={machineTime(session.created_at)}>{when(session.created_at)}</time></dd><dt>Expires</dt><dd><time data-session-expires datetime={machineTime(session.expires_at)}>{when(session.expires_at)}</time></dd></dl>
            {#if session.current}
              <button class="button secondary session-signout-current" form="workspace-sign-out" type="submit" disabled={!canAct}>Sign out this session</button>
              <p class="field-help">Uses the normal sign-out form for this browser.</p>
            {:else}
              <button class="button secondary session-revoke" type="button" disabled={!canAct} aria-label={`Sign out the other session created ${when(session.created_at)}`} onclick={(event) => void signOutOther(session.id, event)}>Sign out this other session</button>
              <p class="field-help">Ends only this sign-in. Your account and other sessions stay available.</p>
            {/if}
          </li>
        {/each}
      </ul>
      {#if state.value.sessions.length === 1}<p class="sessions-only-current">This is your only active session at the checked time.</p>{/if}
    {/if}
    <p class="field-help sessions-account-link">For normal sign-out, sign-out everywhere or recovery, <a href="/account">open Account &amp; recovery</a>.</p>
  </section>
</div>
