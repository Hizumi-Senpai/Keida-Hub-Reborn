<script lang="ts">
  import type { GuideState } from './controller';
  export let mode: 'catalog' | 'roadmap' = 'catalog';
  export let state: GuideState;
  export let authorized = false;
  export let retry: () => Promise<void>;
  export let connections: () => void;
</script>

<div class="guide-card">
  <p class="workspace-status" role="status">{state.message}</p>
  {#if authorized && state.phase === 'ready' && state.value}
    {#if mode === 'catalog'}
      <section class="card guide-intro"><p class="eyebrow">OPTIONAL CONNECTIONS</p><h2>Integration catalog</h2><p>Come back here to see what is available and what is planned. Each connection needs deliberate setup and its own access permissions.</p><p class="field-help">Available means the Reborn feature exists. Your Connections view shows whether Crafty is enrolled; credentials and real provider acceptance are separate.</p></section>
      <div class="catalog-list">
        {#each state.value.catalog as integration (integration.id)}
          <article class="card integration-card" data-integration-id={integration.id}>
            <div class="guide-card-heading"><h2>{integration.name}</h2><span class="integration-status" data-status={integration.status}>{integration.status === 'available' ? 'Available' : 'Planned'}</span></div>
            <p>{integration.summary}</p>
            <h3>What it offers</h3><ul>{#each integration.capabilities as capability}<li>{capability}</li>{/each}</ul>
            <h3>Setup requirements</h3><ul>{#each integration.requirements as requirement}<li>{requirement}</li>{/each}</ul>
            {#if integration.status === 'available'}<button class="button secondary" onclick={connections}>Open Connections</button>{:else}<p class="field-help">Setup will be available when this integration is implemented and qualified.</p>{/if}
          </article>
        {/each}
      </div>
    {:else}
      <article class="card roadmap-note" aria-label="Project roadmap note">
        <p class="eyebrow">A NOTE FOR THE ROAD AHEAD</p><h2>Keida Reborn roadmap</h2>
        <p>{state.value.roadmap.intro}</p>
        <p class="field-help">Work-list snapshot dated <time datetime={state.value.roadmap.as_of}>{state.value.roadmap.as_of}</time>. This note ships with the site; it does not update itself from GitHub. Your private workspace note is separate.</p>
        <h3>Next priorities</h3><ol class="roadmap-priorities">{#each state.value.roadmap.priorities as priority}<li>{priority}</li>{/each}</ol>
        <div class="roadmap-milestones">
          {#each state.value.roadmap.milestones as milestone (milestone.id)}
            <section data-milestone-id={milestone.id} aria-label={`${milestone.id}: ${milestone.title}`}>
              <div class="guide-card-heading"><h3>{milestone.id} · {milestone.title}</h3><span class="quiet-label">{milestone.status}</span></div>
              {#if milestone.delivered.length}<h4>Recorded progress</h4><ul>{#each milestone.delivered as item}<li>{item}</li>{/each}</ul>{/if}
              <h4>Work still ahead</h4><ul>{#each milestone.remaining as item}<li>{item}</li>{/each}</ul>
            </section>
          {/each}
        </div>
        <p><a href={state.value.roadmap.tracker_url} rel="noreferrer">Open the current roadmap and acceptance tracker <span aria-hidden="true">↗</span></a></p>
      </article>
    {/if}
  {:else if authorized && state.phase !== 'loading'}
    <section class="card guide-intro"><h2>{mode === 'roadmap' ? 'Roadmap note' : 'Integration catalog'}</h2><p>The guide is available after your account access is checked.</p><button class="button secondary" onclick={() => void retry()}>{state.phase === 'error' ? 'Retry workspace guide' : 'Check workspace guide'}</button></section>
  {/if}
</div>
