<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { MediaEnrollment, MediaProvider, MediaState } from './controller';
  export let owner = false;
  export let active = false;
  export let state: Record<MediaProvider, MediaState>;
  export let check: (provider: MediaProvider) => Promise<void>;
  export let load: (provider: MediaProvider, offset?: number) => Promise<void>;
  export let save: (provider: MediaProvider, base: string, connection: MediaEnrollment | null) => Promise<void>;
  const providers: MediaProvider[] = ['jellyfin', 'seerr'];
  const label = (provider: MediaProvider) => provider === 'jellyfin' ? 'Jellyfin' : 'Seerr';
  let forms: Partial<Record<MediaProvider, HTMLFormElement>> = {};
  const when = (seconds: number | null) => seconds === null ? 'Not collected' : new Date(seconds * 1000).toLocaleString();
  const canChange = (provider: MediaProvider) => active && owner && state[provider].phase === 'ready' && state[provider].save === 'idle' && !!state[provider].status;
  function clearForms(): void { for (const provider of providers) forms[provider]?.reset(); }
  $: if (!active || !owner) clearForms();
  onDestroy(clearForms);
  async function submit(provider: MediaProvider, remove = false): Promise<void> {
    const status = state[provider].status;
    if (!status || !canChange(provider)) return;
    const data = forms[provider] ? new FormData(forms[provider]) : undefined;
    const connection: MediaEnrollment | null = remove ? null : {
      endpoint: String(data?.get('endpoint') ?? ''), token: String(data?.get('token') ?? ''), ca_pem: String(data?.get('ca-pem') ?? ''),
      library_id: provider === 'jellyfin' ? String(data?.get('library-id') ?? '') : null,
      acknowledge_broad_access: data?.get('acknowledge') === 'on',
    };
    forms[provider]?.reset();
    await save(provider, status.revision, connection);
  }
</script>

<div class="media-view">
  <section class="card media-intro"><p class="eyebrow">MEDIA, WITH DELIBERATE ACCESS</p><h2>Media observations</h2><p>Check a selected Jellyfin library, counts of recent playback and Seerr request status. These connections send observation requests only.</p><p class="field-help">Media is owner-only. Hub member accounts are not linked to provider accounts, and this view does not share their playback or request identities.</p></section>
  {#if !owner}
    <section class="card small-card media-owner-only"><h2>Owner access required</h2><p>An owner can enroll and view media connections. Provider-account sharing has not been configured for members.</p></section>
  {:else}
    <div class="media-providers">
      {#each providers as provider (provider)}
        {@const current = state[provider]}
        {@const observation = current.observation}
        {@const workingNow = !active || current.save === 'saving'}
        {@const canChangeNow = active && owner && current.phase === 'ready' && current.save === 'idle' && !!current.status}
        <section class="card media-provider" data-media-provider={provider} data-media-revision={current.status?.revision ?? ''} data-media-configured={String(current.status?.configured ?? false)} data-media-error={observation?.error ?? ''} data-media-complete={String(observation?.complete ?? false)} data-media-offset={observation?.offset ?? 0} data-media-save={current.save} aria-label={`${label(provider)} media connection`}>
          <div class="guide-card-heading"><h2>{label(provider)}</h2><span class="quiet-label">Owner-only observations</span></div>
          <p class="workspace-status" role="status" data-media-status>{current.message || 'Check the connection state to begin.'}</p>
          <div class="button-row media-actions"><button class="button secondary media-check-state" disabled={workingNow} onclick={() => void check(provider)}>Check {label(provider)} connection state</button><button class="button secondary media-check-observations" disabled={workingNow || current.phase === 'loading' || !current.status?.configured} onclick={() => void load(provider, observation?.offset ?? 0)}>Check {label(provider)} observations</button></div>
          {#if observation?.configured}
            <dl class="media-sample"><dt>Collected</dt><dd>{when(observation.checked_at)}</dd><dt>Freshness</dt><dd>{observation.freshness === 'fresh' ? 'Recent collection' : observation.freshness === 'stale' ? 'Stale collection' : 'Collection age unknown'}</dd><dt>Sample</dt><dd>{observation.complete ? 'Complete for these bounded queries' : 'Incomplete or still checking'}</dd></dl>
            {#if provider === 'jellyfin'}<div class="media-playback" data-media-playback><h3>Recent server playback</h3><p>{observation.playback && observation.playback.playing !== null && observation.playback.paused !== null ? `${observation.playback.playing} playing · ${observation.playback.paused} paused` : 'Playback counts unavailable'}</p><p class="field-help">Across the Jellyfin server, not limited to the selected library: sessions active within 120 seconds with a reported playing item. Counts do not show users, devices or watch titles.</p></div>{/if}
            {#if observation.items.length}
              <div class="media-table-scroll"><table class="media-table"><caption>{provider === 'jellyfin' ? 'Selected library rows' : 'Recent request rows'}</caption><thead><tr><th scope="col">Title</th><th scope="col">Type</th><th scope="col">{provider === 'jellyfin' ? 'Year' : 'Request status'}</th></tr></thead><tbody data-media-rows={provider}>{#each observation.items as item (item.id)}<tr data-media-item><td>{item.title ?? 'Title unavailable'}{#if item.detail_error}<small>Some details unavailable</small>{/if}</td><td>{item.kind === 'movie' ? 'Movie' : 'Series'}</td><td>{provider === 'jellyfin' ? item.year ?? 'Not reported' : item.request_status === 'unknown' ? 'Unknown' : item.request_status ? item.request_status[0].toUpperCase() + item.request_status.slice(1) : 'Not reported'}</td></tr>{/each}</tbody></table></div>
            {:else if observation.complete && observation.error === null && observation.total === 0}<p class="media-empty">{provider === 'jellyfin' ? 'No movie or series rows were reported in this library.' : 'No requests were reported.'}</p>
            {:else if observation.error !== 'checking'}<p class="field-help">No usable rows were reported for this sample. This does not establish an empty library or request list.</p>{/if}
            <p class="field-help">{observation.total === null ? 'Provider total unavailable.' : `${observation.total} rows reported by the provider.`} Up to 12 rows per page and the first 60 rows only. Pages can change as the provider changes.</p>
            {#if observation.truncated}<p class="notice">More rows exist beyond this bounded view.</p>{/if}
            <div class="button-row media-pagination"><button class="text-button media-previous" disabled={workingNow || observation.offset === 0} onclick={() => void load(provider, observation.offset - 12)}>Previous {label(provider)} page</button><span class="quiet-label">Page {observation.offset / 12 + 1}</span><button class="text-button media-next" disabled={workingNow || observation.next_offset === null} onclick={() => observation.next_offset !== null && void load(provider, observation.next_offset)}>Next {label(provider)} page</button></div>
          {:else if current.status && !current.status.configured}<p class="media-empty">No {label(provider)} connection enrolled.</p>{/if}
          <details class="media-enrollment"><summary>Enroll dedicated {label(provider)} access</summary><p>Use a key created deliberately for Reborn. It is encrypted on the server and will not be shown again.</p><p class="notice">A {label(provider)} API key can grant administrator access. Reborn sends observation requests only; this does not restrict what the key itself can do.</p>
            {#if provider === 'jellyfin'}<p class="field-help">Choose one Jellyfin library by its ID. This limits the rows requested here; the underlying API key may still access all libraries and sessions.</p>{/if}
            <form bind:this={forms[provider]} autocomplete="off" onsubmit={(event) => { event.preventDefault(); void submit(provider); }}>
              <label for={`${provider}-endpoint`}>{label(provider)} HTTPS address</label><input id={`${provider}-endpoint`} name="endpoint" type="url" required maxlength="512" placeholder={`https://${provider}.example/`} disabled={!canChangeNow}>
              <label for={`${provider}-token`}>Dedicated API key</label><input id={`${provider}-token`} name="token" type="password" required maxlength="8192" autocomplete="off" disabled={!canChangeNow}>
              {#if provider === 'jellyfin'}<label for="jellyfin-library">Jellyfin library ID</label><input id="jellyfin-library" name="library-id" required maxlength="36" pattern={'[a-f0-9]{32}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}'} disabled={!canChangeNow}><p class="field-help">Use the library’s lowercase 32-digit ID or UUID, without an address or API key.</p>{/if}
              <label for={`${provider}-ca`}>Private CA certificate, if needed</label><textarea id={`${provider}-ca`} name="ca-pem" rows="3" maxlength="8192" disabled={!canChangeNow}></textarea><p class="field-help">Leave blank for publicly trusted HTTPS. Normal hostname and trust checks always apply.</p>
              <label class="media-ack" for={`${provider}-ack`}><input id={`${provider}-ack`} name="acknowledge" type="checkbox" required disabled={!canChangeNow}>I understand this key may grant broad access, and I choose owner-only media observations.</label>
              <button class="button primary media-save" type="submit" disabled={!canChangeNow}>Save {label(provider)} connection</button>
            </form>
          </details>
          {#if current.status?.configured}<button class="text-button media-remove" disabled={!canChangeNow} onclick={() => void submit(provider, true)}>Remove {label(provider)} connection</button>{/if}
        </section>
      {/each}
    </div>
  {/if}
</div>
