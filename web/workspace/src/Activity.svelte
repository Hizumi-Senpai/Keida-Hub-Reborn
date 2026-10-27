<script lang="ts">
  import type { Activity } from './controller';
  export let state: Activity;
  export let authorized = false;
  export let load: (category?: string, query?: string, older?: boolean) => Promise<void>;
  let query = '';
  let category = 'all';
  let applied: Activity | undefined;
  $: if (!authorized) { query = ''; category = 'all'; applied = undefined; }
  $: if (state !== applied && state.phase === 'loading') { applied = state; query = state.query; category = state.category; }
  const when = (s: string) => new Date(Number(s) * 1000).toLocaleString();
</script>

<section class="card activity-card" aria-label="Your retained activity">
  <h2>Your activity</h2>
  <p>Successful changes made by your account, retained from the introduction of Activity. Connection entries describe enrollment changes, not game actions or provider uptime.</p>
  <form class="activity-search" onsubmit={(e) => { e.preventDefault(); void load(category, query); }}>
    <div><label for="activity-query">Search action names</label><input id="activity-query" bind:value={query} maxlength="80" disabled={!authorized} placeholder="For example, saved or Crafty"></div>
    <div><label for="activity-category">Activity category</label><select id="activity-category" bind:value={category} disabled={!authorized}><option value="all">All activity</option><option value="workspace">Workspace notes</option><option value="directory">Services and pins</option><option value="connections">Connection enrollment</option></select></div>
    <button type="submit" class="button primary" disabled={!authorized}>Search activity</button>
  </form>
  <p class="workspace-status" role="status">{state.message}</p>
  {#if state.phase === 'ready'}
    {#if state.entries.length === 0}<p class="activity-empty">No matching activity in this window. Try another action name or check the newest entries.</p>{/if}
    <ol class="activity-list">
      {#each state.entries as entry (entry.id)}
        <li data-activity-id={entry.id}><div><strong>{entry.label}</strong><p>Revision {entry.revision} · {entry.category === 'connections' ? 'Connection enrollment' : entry.category === 'directory' ? 'Services and pins' : 'Workspace note'}</p></div><time datetime={new Date(Number(entry.occurred_at) * 1000).toISOString()}>{when(entry.occurred_at)}</time></li>
      {/each}
    </ol>
    <div class="button-row"><button class="button secondary" onclick={() => void load(state.category, state.query)}>Check newest activity</button><button class="button secondary" disabled={!state.next} onclick={() => void load(state.category, state.query, true)}>Older activity</button></div>
    <p class="field-help">Up to 25 entries per page. New changes appear when you check newest; older pages stay within the current history window. Search matches action names, not note or credential contents.</p>
  {:else if state.phase === 'error'}
    <button class="button secondary" onclick={() => void load(state.category, state.query)}>Retry activity</button>
  {:else if state.phase === 'idle'}
    <button class="button secondary" disabled={!authorized} onclick={() => void load(category, query)}>Check activity</button>
  {/if}
</section>
