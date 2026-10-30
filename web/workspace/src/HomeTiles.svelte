<script lang="ts">
  import type { Crafty, Directory, GameStatus, GamesState, MediaProvider, MediaState, QueueProvider, QueueState } from './controller';
  import type { Tile, TileId, TileCatalogEntry } from './tiles';
  export let tiles: Tile[];
  export let catalog: TileCatalogEntry[];
  export let crafty: Crafty | null | undefined;
  export let games: GamesState;
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
  type GameServer = NonNullable<Crafty>['servers'][number] & { gateway?: GameStatus | null };
  $: gameServers = (crafty?.servers ?? []).map((server, index): GameServer => {
    const observed = games.value?.revision === crafty?.revision && games.value?.configured === crafty?.configured ? games.value?.servers[index] : undefined;
    return observed?.name === server.name ? { ...server, join: server.join || observed.join, gateway: observed.gateway } : server;
  });
  const gateway = (server: GameServer) => server.gateway?.freshness === 'fresh'
    && Date.now() / 1000 - server.gateway.checked_at <= 45 && Date.now() / 1000 - server.gateway.checked_at >= -5 ? server.gateway : undefined;
  const gameState = (server: GameServer) => gateway(server)?.state === 'sleeping' ? 'Sleeping'
    : gateway(server)?.state === 'starting' ? 'Waking up' : gateway(server)?.state === 'updating' ? 'Updating'
    : gateway(server)?.state === 'online' ? 'Online' : server.state === 'running' && server.freshness === 'fresh' ? 'Running'
    : server.state === 'stopped' && server.freshness === 'fresh' ? 'Offline' : !server.join ? 'Not listed' : 'Status pending';
  const gamePlayers = (server: GameServer) => gateway(server)?.state === 'online' ? gateway(server)!.players
    : !gateway(server) && server.state === 'running' && server.freshness === 'fresh' ? server.players : null;
  const gameCapacity = (server: GameServer) => gateway(server)?.state === 'online' ? gateway(server)!.capacity
    : !gateway(server) && server.state === 'running' && server.freshness === 'fresh' ? server.capacity : null;
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
            <ul class="game-tile-list">
              {#each gameServers as server}
                {@const status = gameState(server)}
                {@const players = gamePlayers(server)}
                {@const capacity = gameCapacity(server)}
                <li data-game-status={status}>
                  <div class="game-tile-name"><strong>{server.name}</strong><span class="state-chip" class:is-running={status === 'Online' || status === 'Running'} class:is-sleeping={status === 'Sleeping'}>{status}</span></div>
                  {#if status === 'Sleeping'}<p class="game-hint">Join to wake.</p>
                  {:else if status === 'Waking up'}<p class="game-hint">Getting ready for you.</p>
                  {:else if status === 'Updating'}<p class="game-hint">A new modpack is being prepared.</p>
                  {:else if status === 'Not listed'}<p class="game-hint">Join details aren't set up yet.</p>
                  {:else if status === 'Status pending'}<p class="game-hint">Checking for an update.</p>{/if}
                  {#if players !== null}<p class="tile-meta">{players} players{capacity === null ? '' : ` / ${capacity}`}</p>{/if}
                  {#if server.join}<p class="game-join"><span class="field-help">Join</span> <code>{server.join}</code></p>{/if}
                  {#if gateway(server)?.checked_at || server.collected_at}<span class="tile-collected">Updated {when(gateway(server)?.checked_at ?? server.collected_at)}</span>{/if}
                </li>
              {/each}
            </ul>
          {/if}
          <div class="tile-actions"><button class="text-button tile-observe" data-observe-tile="games" disabled={!authorized} onclick={() => void observe('games')}>Refresh</button><button class="text-button" onclick={() => navigate('connections')}>Server details →</button></div>
        {:else if tile.id === 'jellyfin' || tile.id === 'requests'}
          {@const current = media[tile.id === 'jellyfin' ? 'jellyfin' : 'seerr']}
          {@const observation = current.observation}
          {#if observation?.configured}
            <p class="tile-stat"><strong>{count(observation.total)}</strong><span>{tile.id === 'jellyfin' ? 'library items reported' : 'requests reported'}</span></p>
            <p class="tile-meta">{sample(observation.freshness)} · {observation.complete ? 'Complete bounded sample' : 'Partial sample'}</p>
            {#if tile.id === 'jellyfin'}<p class="playback-counts">{observation.playback?.playing == null ? 'Playback unknown' : `${observation.playback.playing} playing`}{observation.playback?.paused == null ? '' : ` · ${observation.playback.paused} paused`}</p>{/if}
            {#if observation.error}<p class="tile-feedback">{observation.error === 'checking' ? 'Collecting a sample…' : 'This sample is unavailable or incomplete.'}</p>{/if}
            {#if observation.items.length}<ul class="tile-item-list">{#each observation.items.slice(0, 4) as item (item.id)}<li><span>{item.title ?? 'Title unavailable'}</span>{#if tile.id === 'requests'}<small>{item.request_status ?? 'unknown'}</small>{:else if item.year}<small>{item.year}</small>{/if}</li>{/each}</ul>{:else if observation.complete && observation.total === 0}<p>No {tile.id === 'jellyfin' ? 'library items' : 'requests'} reported.</p>{/if}
            <p class="tile-collected">Updated {when(observation.checked_at)} · Showing up to 4 items</p>
          {:else}
            <p>{current.phase === 'loading' ? 'Loading…' : current.status?.configured === false ? `${providerLabel(tile.id)} is not connected.` : `${tile.id === 'jellyfin' ? 'Loading your library' : 'Loading requests'}…`}</p>
          {/if}
          {#if current.phase === 'error'}<p class="tile-feedback">{current.message}</p>{/if}
          <div class="tile-actions"><button class="text-button tile-observe" data-observe-tile={tile.id} disabled={!authorized || current.phase === 'loading' || current.save === 'saving'} onclick={() => void observe(tile.id)}>Refresh</button><button class="text-button" onclick={() => navigate('media')}>{tile.id === 'jellyfin' ? 'Library & playback' : 'All requests'} →</button></div>
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
                  <p class="tile-collected">Updated {when(observation.checked_at)}</p>
                {:else}<p class="field-help">{current.phase === 'loading' ? 'Checking…' : current.status?.configured === false ? 'Not connected' : 'Loading…'}</p>{/if}
                {#if current.phase === 'error'}<p class="tile-feedback">{current.message}</p>{/if}
              </div>
            {/each}
          </div>
          <div class="tile-actions"><button class="text-button tile-observe" data-observe-tile="downloads" disabled={!authorized || queueProviders.some(provider => queues[provider].phase === 'loading' || queues[provider].save === 'saving')} onclick={() => void observe('downloads')}>Refresh</button><button class="text-button" onclick={() => navigate('queues')}>All queues & transfers →</button></div>
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
