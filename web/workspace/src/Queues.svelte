<script lang="ts">
  import { afterUpdate, onDestroy, onMount } from 'svelte';
  import { queueProfiles, type QueueEnrollment, type QueueProvider, type QueueState } from './controller';
  export let owner = false;
  export let active = false;
  export let state: Record<QueueProvider, QueueState>;
  export let check: (provider: QueueProvider) => Promise<void>;
  export let load: (provider: QueueProvider, offset?: number) => Promise<void>;
  export let save: (provider: QueueProvider, base: string, connection: QueueEnrollment | null) => Promise<void>;
  const providers: QueueProvider[] = ['sonarr', 'radarr', 'qbittorrent'];
  const label = (provider: QueueProvider) => provider === 'sonarr' ? 'Sonarr' : provider === 'radarr' ? 'Radarr' : 'qBittorrent';
  const profileLabel = (provider: QueueProvider) => provider === 'sonarr' ? 'Sonarr 4 · API v3' : provider === 'radarr' ? 'Radarr 6 · API v3' : 'qBittorrent 5.2–5.3 · Bearer API key';
  const when = (seconds: number | null) => seconds === null ? 'Not collected' : new Date(seconds * 1000).toLocaleString();
  const quantity = (value: number | null, unit: string) => value === null ? 'Not reported' : `${new Intl.NumberFormat().format(value)} ${unit}`;
  const progress = (value: number | null) => value === null ? 'Not reported' : `${(value / 100).toFixed(2)}%`;
  let forms: Partial<Record<QueueProvider, HTMLFormElement>> = {};
  let enrollmentScopes: Partial<Record<QueueProvider, string>> = {};
  let observationFocus: { element: HTMLButtonElement; provider: QueueProvider; revision: string; profile: string; offset: number; disabledBlur: boolean } | undefined;
  function cancelObservationFocus(): void { observationFocus = undefined; }
  function observe(provider: QueueProvider, offset: number, event: MouseEvent): void {
    const element = event.currentTarget, status = state[provider].status;
    observationFocus = active && owner && status?.configured && element instanceof HTMLButtonElement && document.activeElement === element
      ? { element, provider, revision: status.revision, profile: status.profile, offset, disabledBlur: false } : undefined;
    void load(provider, offset);
  }
  afterUpdate(() => {
    const prior = observationFocus;
    if (!prior) return;
    const current = state[prior.provider], status = current.status, element = document.activeElement;
    if (!active || !owner || !status?.configured || status.revision !== prior.revision || status.profile !== prior.profile
        || current.offset !== prior.offset || current.save !== 'idle' || !prior.element.isConnected
        || document.visibilityState !== 'visible' || !document.hasFocus()) { cancelObservationFocus(); return; }
    const neutral = element === document.body || element === document.documentElement;
    if (!neutral && element !== prior.element) { cancelObservationFocus(); return; }
    // Chromium can blur a native button as loading disables it. Keep that one
    // focus request through a completed checking reply until the control is usable.
    if (prior.element.disabled) { if (neutral) prior.disabledBlur = true; return; }
    cancelObservationFocus();
    if (prior.disabledBlur && neutral && prior.element.getClientRects().length > 0) prior.element.focus({ preventScroll: true });
  });
  onMount(() => {
    const moved = (event: FocusEvent) => {
      if (observationFocus && event.target !== observationFocus.element && event.target !== document.body && event.target !== document.documentElement) cancelObservationFocus();
    };
    const visibility = () => { if (document.visibilityState !== 'visible') cancelObservationFocus(); };
    // Any later user action wins, even when clicking a nonfocusable surface or
    // pressing Tab temporarily leaves focus on body before the next element.
    document.addEventListener('pointerdown', cancelObservationFocus, true);
    document.addEventListener('keydown', cancelObservationFocus, true);
    document.addEventListener('focusin', moved, true);
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('blur', cancelObservationFocus);
    return () => {
      cancelObservationFocus();
      document.removeEventListener('pointerdown', cancelObservationFocus, true);
      document.removeEventListener('keydown', cancelObservationFocus, true);
      document.removeEventListener('focusin', moved, true);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('blur', cancelObservationFocus);
    };
  });
  function clearForms(): void { for (const provider of providers) forms[provider]?.reset(); }
  function syncForms(current: Record<QueueProvider, QueueState>, shown: boolean, authorized: boolean): void {
    for (const provider of providers) {
      const status = current[provider].status;
      const scope = shown && authorized && status ? `${status.revision}:${status.configured}` : '';
      if (scope !== enrollmentScopes[provider] || !shown || !authorized) forms[provider]?.reset();
      enrollmentScopes[provider] = scope;
    }
  }
  $: syncForms(state, active, owner);
  onDestroy(clearForms);
  async function checkState(provider: QueueProvider): Promise<void> {
    forms[provider]?.reset();
    await check(provider);
  }
  async function submit(provider: QueueProvider, remove = false): Promise<void> {
    const current = state[provider], status = current.status;
    if (!active || !owner || current.phase !== 'ready' || current.save !== 'idle' || !status) return;
    const data = forms[provider] ? new FormData(forms[provider]) : undefined;
    const connection: QueueEnrollment | null = remove ? null : {
      endpoint: String(data?.get('endpoint') ?? ''), token: String(data?.get('token') ?? ''), ca_pem: String(data?.get('ca-pem') ?? ''),
      profile: queueProfiles[provider], acknowledge_broad_access: data?.get('acknowledge') === 'on',
    };
    forms[provider]?.reset();
    await save(provider, status.revision, connection);
  }
</script>

<div class="queues-view">
  <section class="card queue-intro"><p class="eyebrow">QUEUE OBSERVATIONS</p><h2>See what’s in motion</h2><p>Check Sonarr and Radarr queue items, including pending releases, and qBittorrent transfers. Each provider is checked only when requested.</p><p class="field-help">This view is owner-only. Member accounts have no provider identity mapping or accepted sharing policy.</p></section>
  {#if !owner}
    <section class="card small-card queue-owner-only"><h2>Owner access required</h2><p>An owner can enroll and view queue connections. Provider-account sharing has not been configured for members.</p></section>
  {:else}
    <div class="queue-providers">
      {#each providers as provider (provider)}
        {@const current = state[provider]}
        {@const observation = current.observation}
        {@const workingNow = !active || current.save === 'saving'}
        {@const pendingNow = current.phase === 'loading' || observation?.error === 'checking'}
        {@const canChangeNow = active && owner && current.phase === 'ready' && current.save === 'idle' && !!current.status}
        <section class="card queue-provider" data-queue-provider={provider} data-queue-phase={current.phase} data-queue-revision={current.status?.revision ?? ''} data-queue-configured={String(current.status?.configured ?? false)} data-queue-error={observation?.error ?? ''} data-queue-complete={String(observation?.complete ?? false)} data-queue-offset={current.offset} data-queue-save={current.save} data-queue-freshness={observation?.freshness ?? 'unknown'} data-queue-total={observation?.total ?? ''} data-queue-truncated={String(observation?.truncated ?? false)} aria-label={`${label(provider)} queue connection`}>
          <div class="guide-card-heading"><h2>{label(provider)}{provider === 'qbittorrent' ? ' Transfers' : ' queue'}</h2><span class="quiet-label">Owner-only observations</span></div>
          <p class="workspace-status" role="status" data-queue-status>{current.message || 'Check the connection state to begin.'}</p>
          <div class="button-row queue-actions"><button class="button secondary queue-check-state" disabled={workingNow} onclick={() => void checkState(provider)}>Check {label(provider)} connection state</button><button class="button secondary queue-check-observations" disabled={workingNow || pendingNow || !current.status?.configured} onclick={(event) => observe(provider, current.offset, event)}>Check {label(provider)} observations</button></div>
          {#if observation?.configured}
            <dl class="queue-sample"><dt>Collected</dt><dd>{when(observation.checked_at)}</dd><dt>Freshness</dt><dd>{observation.freshness === 'fresh' ? 'Recent collection' : observation.freshness === 'stale' ? 'Stale collection' : 'Collection age unknown'}</dd><dt>Sample</dt><dd>{observation.complete ? 'Complete for this bounded query' : 'Incomplete or still checking'}</dd></dl>
            {#if provider === 'qbittorrent'}<p class="field-help">Transfers include downloading, uploading, stopped, checking and other reported states. Progress estimates current wanted/selected bytes; it does not measure checking, import or playback completion.</p>{:else}<p class="field-help">The provider queue includes pending and delayed releases. Its count does not establish the number of active downloads or downloader health. Progress estimates downloaded bytes and does not establish import or playback completion.</p>{/if}
            {#if observation.items.length}
              <!-- svelte-ignore a11y_no_noninteractive_tabindex (The named overflow region must be focusable so keyboard users can scroll the table.) -->
              <div class="queue-table-scroll" tabindex="0" role="region" aria-label={`${label(provider)} ${provider === 'qbittorrent' ? 'transfers' : 'queue items'}`}><table class="queue-table"><caption>{provider === 'qbittorrent' ? 'All-state Transfers' : 'Queue and pending items'}</caption><thead><tr><th scope="col">Title</th><th scope="col">State</th>{#if provider !== 'qbittorrent'}<th scope="col">Import state</th>{/if}<th scope="col">Progress estimate</th><th scope="col">Size</th>{#if provider === 'qbittorrent'}<th scope="col">Download rate</th><th scope="col">Upload rate</th>{/if}</tr></thead><tbody data-queue-rows={provider}>{#each observation.items as item (item.id)}<tr data-queue-item><td>{item.title ?? 'Title unavailable'}<small>{item.warning === true ? 'Provider warning reported' : item.warning === null ? 'Warning state not reported' : ''}</small></td><td>{item.status === 'unknown' ? 'Unknown' : item.status}</td>{#if provider !== 'qbittorrent'}<td>{item.import_state === null ? 'Not reported' : item.import_state === 'unknown' ? 'Unknown' : item.import_state}</td>{/if}<td>{progress(item.progress_basis_points)}</td><td>{quantity(item.size_bytes, 'B')}</td>{#if provider === 'qbittorrent'}<td>{quantity(item.download_bytes_per_second, 'B/s')}</td><td>{quantity(item.upload_bytes_per_second, 'B/s')}</td>{/if}</tr>{/each}</tbody></table></div>
            {:else if observation.complete && observation.error === null}<p class="queue-empty">{provider === 'qbittorrent' ? 'No transfers were reported on this page.' : 'No queue or pending items were reported on this page.'}</p>
            {:else if observation.error !== 'checking' && observation.error !== 'page_moved'}<p class="field-help">No usable rows were reported for this sample. This does not establish an empty provider queue.</p>{/if}
            <p class="field-help">{observation.total === null ? provider === 'qbittorrent' ? 'Provider total is not supplied.' : 'Provider total unavailable.' : `${observation.total} queue and pending items reported by the provider.`} Up to 12 rows per page and the first 60 rows only. Live pages can move as the provider changes.</p>
            {#if observation.truncated}<p class="notice">More items exist beyond this bounded view.</p>{/if}
            {#if observation.error === 'page_moved'}<button class="button secondary queue-first-page" disabled={workingNow || pendingNow} onclick={() => void load(provider, 0)}>Reload first {label(provider)} page</button>{/if}
            <div class="button-row queue-pagination"><button class="text-button queue-previous" disabled={workingNow || pendingNow || current.offset === 0 || observation.error === 'page_moved'} onclick={() => void load(provider, current.offset - 12)}>Previous {label(provider)} page</button><span class="quiet-label">Page {current.offset / 12 + 1}</span><button class="text-button queue-next" disabled={workingNow || pendingNow || observation.next_offset === null} onclick={() => observation.next_offset !== null && void load(provider, observation.next_offset)}>Next {label(provider)} page</button></div>
          {:else if current.status && !current.status.configured}<p class="queue-empty">No {label(provider)} connection enrolled.</p>{/if}
          <details class="queue-enrollment"><summary>Enroll {label(provider)} access</summary><p>Use access deliberately enrolled for Reborn. The key is encrypted on the server and will not be shown again.</p><p class="notice">A global {label(provider)} API key may grant broad management authority. Reborn sends observation requests only; this does not restrict what the key itself can do.</p><p class="field-help">Supported profile: {profileLabel(provider)}. Use a root-mounted HTTPS address. Subpath installations and username/password login are not supported here.</p>
            <form bind:this={forms[provider]} autocomplete="off" onsubmit={(event) => { event.preventDefault(); void submit(provider); }}>
              <label for={`queue-${provider}-endpoint`}>{label(provider)} HTTPS address</label><input id={`queue-${provider}-endpoint`} name="endpoint" type="url" required maxlength="512" placeholder={`https://${provider}.example/`} disabled={!canChangeNow}>
              <label for={`queue-${provider}-token`}>API key</label><input id={`queue-${provider}-token`} name="token" type="password" required maxlength="8192" autocomplete="off" disabled={!canChangeNow}>
              <label for={`queue-${provider}-ca`}>Private CA certificate, if needed</label><textarea id={`queue-${provider}-ca`} name="ca-pem" rows="3" maxlength="8192" disabled={!canChangeNow}></textarea><p class="field-help">Leave blank for publicly trusted HTTPS. Normal hostname and trust checks always apply.</p>
              <label class="queue-ack" for={`queue-${provider}-ack`}><input id={`queue-${provider}-ack`} name="acknowledge" type="checkbox" required disabled={!canChangeNow}>I understand this key may grant broad management access, and I choose owner-only queue observations.</label>
              <button class="button primary queue-save" type="submit" disabled={!canChangeNow}>Save {label(provider)} connection</button>
            </form>
          </details>
          {#if current.status?.configured}<button class="text-button queue-remove" disabled={!canChangeNow} onclick={() => void submit(provider, true)}>Remove {label(provider)} connection</button>{/if}
        </section>
      {/each}
    </div>
  {/if}
</div>
