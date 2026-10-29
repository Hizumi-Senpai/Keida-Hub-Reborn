<script lang="ts">
  import type { Crafty, Directory, MediaProvider, MediaState, QueueProvider, QueueState } from './controller';
  import type { Tile, TileId, TileCatalogEntry } from './tiles';
  export let tiles: Tile[];
  export let catalog: TileCatalogEntry[];
  export let crafty: Crafty | null | undefined;
  export let directory: Directory | undefined;
  export let media: Record<MediaProvider, MediaState>;
  export let queues: Record<QueueProvider, QueueState>;
  export let dirty = false;
  export let noteSaved = false;
  export let authorized = false;
  export let owner = false;
  export let navigate: (view: 'connections' | 'directory' | 'media' | 'queues' | 'note') => void;
  export let observe: (id: TileId) => Promise<void>;
  export let grid: HTMLDivElement | undefined = undefined;
  const label = (id: TileId) => catalog.find(entry => entry.id === id)?.label ?? id;
  const when = (seconds: number | null | undefined) => seconds == null ? 'Not collected' : new Date(seconds * 1000).toLocaleString();
  const count = (n: number | null | undefined) => n == null ? 'Not reported' : new Intl.NumberFormat().format(n);
  const sample = (freshness: string) => freshness === 'fresh' ? 'Recent sample' : freshness === 'stale' ? 'Stale sample' : 'Sample age unknown';
  const queueLabel = (provider: QueueProvider) => provider === 'sonarr' ? 'Sonarr' : provider === 'radarr' ? 'Radarr' : 'qBittorrent';
  const providerLabel = (id: TileId) => id === 'requests' ? 'Seerr' : 'Jellyfin';
  const queueProviders: QueueProvider[] = ['sonarr', 'radarr', 'qbittorrent'];
  $: pins = directory ? directory.pins.map(id => directory!.services.find(service => service.id === id)).filter(service => service !== undefined) : [];
</script>

<div class="dashboard-grid" bind:this={grid}>
  {#each tiles as tile (tile.id)}
    {#if owner || !['jellyfin', 'requests', 'downloads'].includes(tile.id)}
      <section class="dashboard-tile card" class:tile-wide={tile.size === 'wide'} data-home-tile={tile.id} data-tile-size={tile.size} aria-label={`${label(tile.id)} tile`}>
        <div class="tile-heading"><h2>{label(tile.id)}</h2><span class="tile-symbol" aria-hidden="true">{tile.id === 'games' ? '◇' : tile.id === 'jellyfin' ? '▻' : tile.id === 'requests' ? '☷' : tile.id === 'downloads' ? '⇣' : tile.id === 'services' ? '▦' : '▤'}</span></div>
        {#if tile.id === 'games'}
          {#if !crafty?.configured}
            <p>No game connection enrolled yet.</p><p class="field-help">Choose which servers to display in Connections.</p>
          {:else}
            {#if crafty.error}<p class="tile-feedback">{crafty.error === 'checking' ? 'Checking server observations…' : 'Provider unavailable or incomplete. Earlier samples keep their original age.'}</p>{/if}
            <ul class="game-tile-list">
              {#each crafty.servers as server}
                <li><div class="game-tile-name"><strong>{server.name}</strong><span class="state-chip" class:is-running={server.state === 'running'}>{server.state === 'running' ? 'Running' : server.state === 'stopped' ? 'Stopped' : 'Unknown'}</span></div>
                  <p class="tile-meta">{server.players === null ? 'Players unknown' : `${server.players} players`}{server.capacity === null ? '' : ` / ${server.capacity}`} · {sample(server.freshness)}</p>
                  {#if server.join}<p class="game-join"><span class="field-help">Join</span> <code>{server.join}</code></p>{/if}
                  <span class="tile-collected">Collected {when(server.collected_at)}</span>
                  {#if server.error}<p class="tile-feedback">This server could not be fully observed.</p>{/if}
                </li>
              {/each}
            </ul>
            <p class="field-help">States are reported by Crafty. Running does not prove readiness; stopped does not establish managed sleep.</p>
          {/if}
          <div class="tile-actions"><button class="text-button tile-observe" data-observe-tile="games" disabled={!authorized} onclick={() => void observe('games')}>Check observations</button><button class="text-button" onclick={() => navigate('connections')}>All game details →</button></div>
        {:else if tile.id === 'jellyfin' || tile.id === 'requests'}
          {@const current = media[tile.id === 'jellyfin' ? 'jellyfin' : 'seerr']}
          {@const observation = current.observation}
          {#if observation?.configured}
            <p class="tile-stat"><strong>{count(observation.total)}</strong><span>{tile.id === 'jellyfin' ? 'library items reported' : 'requests reported'}</span></p>
            <p class="tile-meta">{sample(observation.freshness)} · {observation.complete ? 'Complete bounded sample' : 'Partial sample'}</p>
            {#if tile.id === 'jellyfin'}<p class="playback-counts">{observation.playback?.playing == null ? 'Playback unknown' : `${observation.playback.playing} playing`}{observation.playback?.paused == null ? '' : ` · ${observation.playback.paused} paused`}</p>{/if}
            {#if observation.error}<p class="tile-feedback">{observation.error === 'checking' ? 'Collecting a sample…' : 'This sample is unavailable or incomplete.'}</p>{/if}
            {#if observation.items.length}<ul class="tile-item-list">{#each observation.items.slice(0, 4) as item (item.id)}<li><span>{item.title ?? 'Title unavailable'}</span>{#if tile.id === 'requests'}<small>{item.request_status ?? 'unknown'}</small>{:else if item.year}<small>{item.year}</small>{/if}</li>{/each}</ul>{:else if observation.complete && observation.total === 0}<p>No {tile.id === 'jellyfin' ? 'library items' : 'requests'} reported.</p>{/if}
            <p class="tile-collected">Collected {when(observation.checked_at)} · Showing up to 4 items from page {observation.offset / 12 + 1}</p>
          {:else}
            <p>{current.phase === 'loading' ? 'Checking observations…' : current.status?.configured === false ? `${providerLabel(tile.id)} is not connected.` : 'Check observations to see your current sample.'}</p>
          {/if}
          {#if current.phase === 'error'}<p class="tile-feedback">{current.message}</p>{/if}
          <div class="tile-actions"><button class="text-button tile-observe" data-observe-tile={tile.id} disabled={!authorized || current.phase === 'loading' || current.save === 'saving'} onclick={() => void observe(tile.id)}>Check observations</button><button class="text-button" onclick={() => navigate('media')}>{tile.id === 'jellyfin' ? 'Library & playback' : 'All requests'} →</button></div>
        {:else if tile.id === 'downloads'}
          <div class="download-tile-providers">
            {#each queueProviders as provider (provider)}
              {@const current = queues[provider]}
              {@const observation = current.observation}
              <div class="download-tile-provider" data-tile-queue={provider}><h3>{queueLabel(provider)}</h3>
                {#if observation?.configured}
                  <p><strong>{observation.total === null ? `${observation.items.length} transfers on this sample page` : `${count(observation.total)} queued`}</strong></p>
                  <p class="tile-meta">{sample(observation.freshness)} · {observation.complete ? 'Complete bounded sample' : 'Partial sample'}</p>
                  {#if observation.error}<p class="tile-feedback">{observation.error === 'checking' ? 'Collecting a sample…' : 'Observations unavailable or incomplete.'}</p>{/if}
                  {#if observation.items.length}<ul class="tile-item-list">{#each observation.items.slice(0, 3) as item (item.id)}<li><span>{item.title ?? 'Title unavailable'}</span><small>{item.progress_basis_points === null ? item.status : `${(item.progress_basis_points / 100).toFixed(1)}%`}</small></li>{/each}</ul>{:else if observation.complete}<p class="field-help">{observation.total === 0 ? 'Queue empty.' : 'No rows on this sample page.'}</p>{/if}
                  <p class="tile-collected">Collected {when(observation.checked_at)}</p>
                {:else}<p class="field-help">{current.phase === 'loading' ? 'Checking…' : current.status?.configured === false ? 'Not connected' : 'No sample checked yet'}</p>{/if}
                {#if current.phase === 'error'}<p class="tile-feedback">{current.message}</p>{/if}
              </div>
            {/each}
          </div>
          <div class="tile-actions"><button class="text-button tile-observe" data-observe-tile="downloads" disabled={!authorized || queueProviders.some(provider => queues[provider].phase === 'loading' || queues[provider].save === 'saving')} onclick={() => void observe('downloads')}>Check observations</button><button class="text-button" onclick={() => navigate('queues')}>All queues & transfers →</button></div>
        {:else if tile.id === 'services'}
          {#if pins.length}<ul class="service-tile-links">{#each pins as service (service.id)}<li><a href={service.url} target="_blank" rel="noopener noreferrer"><span><strong>{service.name}</strong>{#if service.description}<small>{service.description}</small>{/if}</span><span aria-hidden="true">↗</span></a></li>{/each}</ul>{:else}<p>Pin the services you use from Services.</p>{/if}
          <div class="tile-actions"><button class="text-button" onclick={() => navigate('directory')}>Manage services →</button></div>
        {:else}
          <p>{dirty ? 'Your unfinished note is waiting.' : noteSaved ? 'Your saved note is ready.' : 'A private place for a thought or reminder.'}</p>
          <div class="tile-actions"><button class="text-button" onclick={() => navigate('note')}>{dirty ? 'Continue your draft' : 'Open your note'} →</button></div>
        {/if}
      </section>
    {/if}
  {/each}
</div>
