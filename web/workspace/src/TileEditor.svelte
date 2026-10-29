<script lang="ts">
  import type { TileController, TileState, Tile } from './tiles';
  export let state: TileState;
  export let control: TileController;
  export let finish: (action: () => void | Promise<void>) => Promise<void>;
  export let authorized = false;
  const label = (id: string) => state.value?.catalog.find(t => t.id === id)?.label ?? id;
  $: locked = !authorized || state.save !== 'idle';
  $: unchanged = !!state.draft && !!state.value && JSON.stringify(state.draft.tiles) === JSON.stringify(state.value.layout.tiles);
</script>

{#if state.draft && state.value}
  <section class="tiles-editor card" aria-label="Customize Home tiles">
    <div class="tile-heading"><div><p class="eyebrow">MAKE HOME YOURS</p><h2>Your tiles</h2></div><span class="quiet-label">Changes save to your account</span></div>
    <p>Add the things you use, choose their order and give larger tiles more room. Keep at least one tile.</p>
    <ol class="tile-editor-list">
      {#each state.draft.tiles as tile, index (tile.id)}
        <li data-tile-row={tile.id} tabindex="-1" aria-label={`${label(tile.id)} tile, position ${index + 1} of ${state.draft!.tiles.length}`}>
          <strong>{label(tile.id)}</strong>
          <div class="tile-editor-controls">
            <label class="tile-width"><span>Width</span><select aria-label={`${label(tile.id)} tile width`} value={tile.size} disabled={locked} onchange={(event) => control.resize(tile.id, event.currentTarget.value as Tile['size'])}><option value="normal">Normal</option><option value="wide">Wide</option></select></label>
            <button class="button secondary" aria-label={`Move ${label(tile.id)} up`} disabled={locked || index === 0} onclick={() => control.move(tile.id, -1)}>↑</button>
            <button class="button secondary" aria-label={`Move ${label(tile.id)} down`} disabled={locked || index === state.draft!.tiles.length - 1} onclick={() => control.move(tile.id, 1)}>↓</button>
            <button class="text-button" aria-label={`Remove ${label(tile.id)}`} disabled={locked || state.draft!.tiles.length === 1} onclick={() => control.remove(tile.id)}>Remove</button>
          </div>
        </li>
      {/each}
    </ol>
    {#if state.value.catalog.some(entry => !state.draft!.tiles.some(tile => tile.id === entry.id))}
      <div class="tile-add"><h3>Add a tile</h3><div class="button-row">
        {#each state.value.catalog.filter(entry => !state.draft!.tiles.some(tile => tile.id === entry.id)) as entry (entry.id)}
          <button class="button secondary" aria-label={`Add ${entry.label}`} disabled={locked} onclick={() => control.add(entry.id)}>+ {entry.label}</button>
        {/each}
      </div></div>
    {/if}
    <div class="button-row tile-save-actions"><button class="button primary save-tiles" disabled={locked || unchanged} onclick={() => void finish(control.save)}>{state.save === 'saving' ? 'Saving…' : 'Save tiles'}</button><button class="button secondary cancel-tiles" disabled={!authorized || ['saving', 'uncertain'].includes(state.save)} onclick={() => void finish(control.cancel)}>Cancel</button><button class="text-button reset-tiles" disabled={locked} onclick={control.reset}>Reset to default tiles</button></div>
    {#if state.save === 'conflict'}
      <section class="notice" aria-label="Tile layout conflict"><h3>A newer tile layout is saved</h3>
        {#if state.phase === 'ready'}<p>Saved order: {state.value.layout.tiles.map(tile => label(tile.id)).join(', ')}. Your arrangement above is unchanged.</p><div class="button-row"><button class="button secondary" onclick={() => control.resolve(false)}>Keep my tile arrangement</button><button class="text-button" onclick={() => void finish(() => control.resolve(true))}>Use saved tiles</button></div>
        {:else}<p>The latest saved layout still needs checking. Your arrangement above is unchanged.</p><button class="button secondary check-tiles" disabled={!authorized || state.phase === 'loading'} onclick={() => void finish(control.check)}>Check saved tiles</button>{/if}
      </section>
    {/if}
    {#if state.save === 'uncertain'}
      <section class="notice" aria-label="Uncertain tile save"><h3>Check before saving again</h3><p>The save may have completed. Your arrangement has not been sent again.</p><button class="button secondary check-tiles" disabled={!authorized} onclick={() => void finish(control.check)}>Check saved tiles</button></section>
    {/if}
  </section>
{/if}
