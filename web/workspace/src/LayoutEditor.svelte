<script lang="ts">
  import { tick } from 'svelte';
  import { panelLabel, type HomePanel, type Layout, type Model } from './controller';
  export let draft: Model['layoutDraft'];
  export let saved: Layout | undefined;
  export let state: Model['layoutSave'];
  export let authorized: boolean;
  export let move: (id: HomePanel['id'], offset: -1 | 1) => void;
  export let toggle: (id: HomePanel['id']) => void;
  export let save: () => Promise<void>;
  export let cancel: () => void;
  export let reset: () => void;
  export let resolve: (useSaved: boolean) => void;
  export let check: () => Promise<void>;
  $: locked = !authorized || ['saving', 'checking-conflict', 'uncertain'].includes(state);
  $: visibleCount = draft?.panels.filter(p => p.visible).length ?? 0;
  $: changed = !!draft && !!saved && draft.panels.some((p, i) => p.id !== saved?.panels[i].id || p.visible !== saved?.panels[i].visible);
  async function reorder(id: HomePanel['id'], offset: -1 | 1): Promise<void> {
    move(id, offset); await tick();
    // Keep a predictable keyboard location when the moved button becomes disabled.
    document.querySelector<HTMLElement>(`[data-layout-row="${id}"]`)?.focus();
  }
</script>

<section class="layout-editor card" aria-label="Home layout" hidden={!authorized || !draft}>
  <h2>Make Home yours</h2><p>Choose the panels you see and their order. Keep at least one visible. Your other views and open forms stay available.</p>
  <ol class="layout-list">
    {#each draft?.panels ?? [] as panel, index (panel.id)}
      <li data-layout-row={panel.id} tabindex="-1">
        <label><input type="checkbox" aria-label={`Show ${panelLabel(panel.id)}`} checked={panel.visible} disabled={locked || (panel.visible && visibleCount === 1)} onchange={() => toggle(panel.id)}><span>{panelLabel(panel.id)}</span></label>
        <div class="layout-move"><button class="button secondary layout-up" aria-label={`Move ${panelLabel(panel.id)} up`} disabled={locked || index === 0} onclick={() => reorder(panel.id, -1)}>↑<span class="sr-only"> Move up</span></button><button class="button secondary layout-down" aria-label={`Move ${panelLabel(panel.id)} down`} disabled={locked || index === 2} onclick={() => reorder(panel.id, 1)}>↓<span class="sr-only"> Move down</span></button></div>
      </li>
    {/each}
  </ol>
  {#if state === 'conflict'}
    <section class="notice" aria-label="Layout conflict"><h3>There’s a newer saved layout</h3><p>Your arrangement is still shown. Compare it with the saved order below before choosing what to keep.</p><ol>{#each saved?.panels ?? [] as panel (panel.id)}<li>{panelLabel(panel.id)} — {panel.visible ? 'Shown' : 'Hidden'}</li>{/each}</ol><div class="button-row"><button class="button secondary" onclick={() => resolve(false)}>Keep my layout against saved layout</button><button class="text-button layout-use-saved" onclick={() => resolve(true)}>Use saved layout</button></div></section>
  {/if}
  {#if state === 'uncertain'}
    <section class="notice" aria-label="Uncertain layout"><h3>Check before saving again</h3><p>The layout may have saved. Your arrangement has not been sent again.</p><button class="button secondary check-layout check-saved-layout" onclick={() => check()}>Check saved layout</button></section>
  {/if}
  <div class="button-row"><button class="button primary save-layout" disabled={locked || state === 'conflict' || !changed} onclick={() => save()}>{state === 'saving' ? 'Saving layout…' : 'Save layout'}</button><button class="text-button cancel-layout" disabled={locked} onclick={cancel}>Cancel layout</button><button class="text-button reset-layout" disabled={locked} onclick={reset}>Reset layout</button></div>
  <p class="field-help">Reset previews the default order and visibility. Save layout applies it to this account.</p>
</section>
