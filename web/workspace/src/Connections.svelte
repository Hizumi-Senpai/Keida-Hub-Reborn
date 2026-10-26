<script lang="ts">
  import { onDestroy } from 'svelte';
  import type { Crafty } from './controller';
  export let binding: string;
  export let overview: Crafty | null | undefined;
  export let owner = false;
  export let active = false;
  export let refresh: () => Promise<void>;
  let form: HTMLFormElement | undefined;
  let entries = [0];
  let serial = 0;
  let pending: AbortController | undefined;
  let message = '';
  let uncertain = false;
  let epoch = 0;
  const when = (seconds: number | null) => seconds === null ? 'Not reported' : new Date(seconds * 1000).toLocaleString();
  function clear(): void { ++epoch; pending?.abort(); pending = undefined; form?.reset(); entries = [++serial]; message = ''; uncertain = false; }
  $: if (!active) clear();
  onDestroy(clear);
  async function submit(remove = false): Promise<void> {
    if (!active || !owner || pending || !overview || uncertain) return;
    const base = overview.revision;
    const data = form ? new FormData(form) : undefined;
    const values = (key: string) => data?.getAll(key).map(String) ?? [];
    const ids = values('server-id'), names = values('server-name'), joins = values('server-join');
    const connection = remove ? null : { endpoint: String(data?.get('endpoint') ?? ''), token: String(data?.get('token') ?? ''),
      ca_pem: String(data?.get('ca-pem') ?? ''), timezone: String(data?.get('timezone') ?? ''),
      servers: ids.map((id, i) => ({ id, name: names[i] ?? '', join: joins[i] ?? '' })) };
    form?.reset(); entries = [++serial];
    const controller = new AbortController(); pending = controller; const current = ++epoch;
    const deadline = setTimeout(() => controller.abort(), 4000);
    message = remove ? 'Removing the connection…' : 'Saving the dedicated connection…';
    try {
      const response = await fetch('/api/owner/crafty', { method: 'PUT', credentials: 'same-origin', redirect: 'error', cache: 'no-store', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', 'X-Reborn-Product': 'keida-hub-reborn', 'X-Reborn-Contract': 'reborn-workspace-v1', 'X-CSRF-Token': binding },
        body: JSON.stringify({ base_revision: base, connection }) });
      if (current !== epoch || !active) return;
      if (response.status === 200) message = remove ? 'Connection removed.' : 'Connection saved. Checking provider observations…';
      else if (response.status === 409) message = 'The connection changed elsewhere. Check its current state before enrolling again.';
      else if ([400, 401, 403, 413, 426].includes(response.status)) message = 'Connection not accepted. Check your account and the dedicated connection details.';
      else throw new Error('Uncertain connection outcome');
      await refresh();
    } catch {
      if (current === epoch && active) { uncertain = true; message = 'The save outcome is uncertain. Check the connection before entering credentials again.'; }
    } finally { clearTimeout(deadline); if (pending === controller) pending = undefined; }
  }
  async function check(): Promise<void> { await refresh(); if (active) { uncertain = false; message = 'Review the current connection state before making another change.'; } }
</script>

<div class="connections-intro"><p>Server observations from your deliberately enrolled Crafty connection.</p><span class="quiet-label">Read-only overview</span></div>
{#if !overview || !overview.configured}
  <section class="card small-card"><h2>No Crafty connection enrolled</h2><p>An owner can add dedicated access and choose which servers to show.</p></section>
{:else}
  {#if overview.error}<p class="notice" role="status">{overview.error === 'checking' ? 'Checking the provider. Fresh results will appear on the next observation.' : 'Provider observations are unavailable or incomplete. Unknown player counts stay unknown.'}</p>{/if}
  <div class="server-grid">
    {#each overview.servers as server}
      <article class="card small-card server-card"><h2>{server.name}</h2>
        <p><strong>{server.state === 'running' ? 'Running' : server.state === 'stopped' ? 'Stopped' : 'Unknown'}</strong> <span class="field-help">Provider-reported process state</span></p>
        <dl><dt>Players</dt><dd>{server.players === null ? 'Not reported' : `${server.players} reported`}{server.capacity === null ? '' : ` / ${server.capacity} capacity`}</dd>
          <dt>Freshness</dt><dd>{server.freshness === 'fresh' ? 'Recent provider sample' : server.freshness === 'stale' ? 'Stale provider sample' : 'Provider sample age unknown'}</dd>
          <dt>Collected</dt><dd>{when(server.collected_at)}</dd><dt>Provider sample</dt><dd>{when(server.provider_at)}</dd>
          <dt>Join address</dt><dd>{server.join || 'Not configured'}</dd></dl>
        {#if server.error}<p class="field-help">This server could not be fully observed.</p>{/if}
      </article>
    {/each}
  </div>
  <p class="field-help">A running process does not establish game readiness. Join addresses are owner-reviewed; outside-network joining is accepted separately.</p>
{/if}

{#if owner && active}
  <section class="card connection-setup" aria-label="Dedicated Crafty enrollment"><h2>Dedicated Crafty access</h2>
    <p>Create access specifically for Reborn, limited to viewing the selected servers. Credentials are encrypted on the server and are not shown again.</p>
    <p class="workspace-status" role="status">{message}</p>
    {#if uncertain}<button class="button secondary" onclick={() => void check()}>Check connection state</button>{/if}
    <form bind:this={form} autocomplete="off" onsubmit={(event) => { event.preventDefault(); void submit(); }}>
      <label for="crafty-endpoint">Crafty HTTPS address</label><input id="crafty-endpoint" name="endpoint" type="url" required maxlength="512" placeholder="https://crafty.example/" disabled={!!pending || uncertain}>
      <label for="crafty-token">Dedicated API token</label><input id="crafty-token" name="token" type="password" required maxlength="8192" autocomplete="off" disabled={!!pending || uncertain}>
      <label for="crafty-timezone">Crafty’s configured time zone</label><input id="crafty-timezone" name="timezone" required maxlength="64" placeholder="America/Chicago or UTC" disabled={!!pending || uncertain}>
      <label for="crafty-ca">Private CA certificate, if needed</label><textarea id="crafty-ca" name="ca-pem" maxlength="8192" rows="3" disabled={!!pending || uncertain}></textarea>
      <p class="field-help">Leave the certificate blank for publicly trusted HTTPS. The address and certificate must pass normal hostname and trust checks.</p>
      {#each entries as entry, index (entry)}
        <fieldset><legend>Server {index + 1}</legend>
          <label for={`crafty-id-${entry}`}>Crafty server UUID</label><input id={`crafty-id-${entry}`} name="server-id" required maxlength="36" disabled={!!pending || uncertain}>
          <label for={`crafty-name-${entry}`}>Display name</label><input id={`crafty-name-${entry}`} name="server-name" required maxlength="80" disabled={!!pending || uncertain}>
          <label for={`crafty-join-${entry}`}>Reviewed public join address, optional</label><input id={`crafty-join-${entry}`} name="server-join" maxlength="253" placeholder="play.example:25565" disabled={!!pending || uncertain}>
          {#if entries.length > 1}<button class="text-button" type="button" disabled={!!pending || uncertain} onclick={() => entries = entries.filter((v) => v !== entry)}>Remove server</button>{/if}
        </fieldset>
      {/each}
      <div class="button-row"><button class="button secondary" type="button" disabled={entries.length >= 8 || !!pending || uncertain} onclick={() => entries = [...entries, ++serial]}>Add server</button>
        <button class="button primary" type="submit" disabled={!!pending || uncertain || !overview}>{pending ? 'Working…' : 'Save dedicated connection'}</button></div>
    </form>
    {#if overview?.configured}<button class="text-button" type="button" disabled={!!pending || uncertain} onclick={() => void submit(true)}>Remove connection</button>{/if}
  </section>
{/if}
