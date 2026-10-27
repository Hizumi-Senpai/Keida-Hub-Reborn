<script lang="ts">
  import type { ObservationState } from './controller';
  export let state: ObservationState;
  export let authorized = false;
  export let owner = false;
  export let load: (older?: boolean) => Promise<void>;
  export let checkConnection: () => Promise<void>;
  const when = (seconds: string | null) => seconds === null ? 'Not reported' : new Date(Number(seconds) * 1000).toLocaleString();
  const errorLabel = (error: string | null): string => error === 'denied' ? 'Provider access denied' : error === 'timeout' ? 'Provider timed out' : error === 'transport' ? 'Provider could not be reached' : error === 'not_discovered' ? 'Selected server was not discovered' : error === 'malformed' ? 'Provider response was incomplete or malformed' : error === 'oversized' ? 'Provider response exceeded the observation limit' : error === 'invalid_configuration' ? 'Connection could not be checked' : error ? 'Provider observation unavailable' : '';
</script>

<section class="card observation-history" aria-label="Provider observation history">
  <p class="eyebrow">RETAINED PROVIDER SAMPLES</p><h2 tabindex="-1">Crafty observation history</h2>
  <p>Samples are collected while an authorized workspace checks the enrolled connection. At most the first sample per enrollment revision each minute is retained, up to the newest 10,000 batches.</p>
  <p class="field-help">This is sampled, on-demand history. Gaps do not establish downtime, and a process or player report does not establish game readiness. Freshness below describes the sample at collection time.</p>
  <p>{owner ? 'Your owner account can review retained samples from prior enrollment revisions.' : 'Your account sees samples only for the currently enrolled servers. Replacing or removing a connection changes this history scope.'}</p>
  <p class="workspace-status observation-status" role="status">{state.message}</p>
  {#if authorized && state.phase === 'ready'}
    <p class="quiet-label" data-current-revision={state.revision}>Current enrollment revision {state.revision}</p>
    {#if state.entries.length === 0}<p class="observation-empty">No retained observations in this window. A connection must be enrolled and observed before samples appear.</p>{/if}
    <ol class="observation-list">
      {#each state.entries as observation (observation.id)}
        <li data-observation-id={observation.id} data-observation-revision={observation.revision}>
          <div class="guide-card-heading"><h3>Enrollment revision {observation.revision}</h3><time datetime={new Date(Number(observation.checked_at) * 1000).toISOString()}>{when(observation.checked_at)}</time></div>
          <p class="observation-completeness">{observation.complete ? 'Complete provider sample' : 'Incomplete provider sample'}</p>
          {#if observation.error}<p class="notice">{errorLabel(observation.error)}</p>{/if}
          <div class="observation-servers">
            {#each observation.servers as server, index (index)}
              <section aria-label={`Observation for ${server.name}`}>
                <h4>{server.name}</h4>
                <dl><dt>Reported process</dt><dd>{server.state === 'running' ? 'Running' : server.state === 'stopped' ? 'Stopped' : 'Unknown'}</dd>
                  <dt>Players</dt><dd>{server.players === null ? 'Not reported' : `${server.players} reported`}{server.capacity === null ? '' : ` / ${server.capacity} capacity`}</dd>
                  <dt>Freshness at collection</dt><dd>{server.freshness === 'fresh' ? 'Fresh at collection' : server.freshness === 'stale' ? 'Stale at collection' : 'Sample age was unknown'}</dd>
                  <dt>Collected</dt><dd>{when(server.collected_at)}</dd><dt>Provider sample</dt><dd>{when(server.provider_at)}</dd></dl>
                {#if server.error}<p class="field-help">{errorLabel(server.error)}</p>{/if}
              </section>
            {/each}
          </div>
        </li>
      {/each}
    </ol>
  {/if}
  <div class="button-row"><button class="button secondary observation-newest" disabled={!authorized || state.phase === 'loading'} onclick={() => void load()}>Check newest observations</button><button class="button secondary observation-older" disabled={!authorized || state.phase !== 'ready' || !state.next} onclick={() => void load(true)}>Older observations</button><button class="text-button" disabled={!authorized} onclick={() => void checkConnection()}>Check current connection</button></div>
  <p class="field-help">Up to 25 batches per page. New samples appear when you check newest. Older pages use the same history window; retention can shorten that window as new samples arrive. Reading history does not contact Crafty.</p>
</section>
