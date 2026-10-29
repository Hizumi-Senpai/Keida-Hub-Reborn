import { get, writable } from 'svelte/store';

export type TileId = 'games' | 'jellyfin' | 'requests' | 'downloads' | 'services' | 'note';
export type Tile = { id: TileId; size: 'normal' | 'wide' };
export type TileCatalogEntry = { id: TileId; label: string };
export type TileLayout = { revision: string; tiles: Tile[] };
export type TileValue = { catalog: TileCatalogEntry[]; defaults: Tile[]; layout: TileLayout };
export type TileState = {
  phase: 'idle' | 'loading' | 'ready' | 'error'; value?: TileValue;
  draft?: { base: string; tiles: Tile[] }; save: 'idle' | 'saving' | 'conflict' | 'uncertain'; message: string;
};
export type TileScope = { account: { id: string; username: string; role: 'owner' | 'member' }; session_generation: string };
type Reply = { status: number; value?: unknown };
const empty = (): TileState => ({ phase: 'idle', save: 'idle', message: '' });
const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const decimal = (v: unknown): v is string => typeof v === 'string' && /^(0|[1-9][0-9]{0,18})$/.test(v) && BigInt(v) <= 9223372036854775807n;
const copy = (tiles: Tile[]): Tile[] => tiles.map(tile => ({ ...tile }));
const same = (a: Tile[], b: Tile[]): boolean => a.length === b.length && a.every((tile, i) => tile.id === b[i].id && tile.size === b[i].size);
const scopeKey = (s: TileScope): string => `${s.account.id}:${s.account.username}:${s.account.role}:${s.session_generation}`;
class ScopeChanged extends Error {}

function selected(v: unknown, ids: TileId[]): Tile[] {
  if (!Array.isArray(v) || v.length < 1 || v.length > ids.length || new Set(v.map(t => record(t) ? t.id : undefined)).size !== v.length
      || v.some((t: unknown) => !record(t) || !ids.includes(t.id as TileId) || !['normal', 'wide'].includes(String(t.size)))) throw new Error('Invalid tiles');
  return v.map(t => ({ id: t.id as TileId, size: t.size as Tile['size'] }));
}
function value(v: unknown, scope: TileScope): TileValue {
  if (!record(v) || v.product !== 'keida-hub-reborn' || v.contract !== 'reborn-workspace-v1' || v.schema !== 1
      || v.tiles_contract !== 'reborn-tiles-v1' || !record(v.account) || v.account.id !== scope.account.id
      || v.account.username !== scope.account.username || v.account.role !== scope.account.role || v.session_generation !== scope.session_generation) throw new ScopeChanged('Invalid tile scope');
  const ids: TileId[] = scope.account.role === 'owner' ? ['games', 'jellyfin', 'requests', 'downloads', 'services', 'note'] : ['games', 'services', 'note'];
  if (!Array.isArray(v.catalog) || v.catalog.length !== ids.length || new Set(v.catalog.map(t => record(t) ? t.id : undefined)).size !== ids.length
      || v.catalog.some((t: unknown) => !record(t) || !ids.includes(t.id as TileId) || typeof t.label !== 'string' || t.label.length < 1
        || new TextEncoder().encode(t.label).length > 80 || /[\u0000-\u001f\u007f]/u.test(t.label))
      || !record(v.layout) || !decimal(v.layout.revision)) throw new Error('Invalid tile catalog');
  return { catalog: v.catalog.map(t => ({ id: t.id as TileId, label: t.label as string })), defaults: selected(v.defaults, ids),
    layout: { revision: v.layout.revision, tiles: selected(v.layout.tiles, ids) } };
}

/** One scoped layout resource. The workspace's existing access check drives it. */
export function tileController(hooks: {
  request: (path: string, controller: AbortController, body?: unknown) => Promise<Reply>;
  scope: () => TileScope | undefined; blocked: (status: number) => void;
}) {
  const model = writable<TileState>(empty());
  let admitted: string | undefined;
  let epoch = 0;
  let reading: AbortController | undefined;
  let saving: AbortController | undefined;
  const current = () => get(model);
  const alive = (s: TileScope, generation: number) => generation === epoch && admitted === scopeKey(s) && hooks.scope() && scopeKey(hooks.scope()!) === admitted;
  function clear(): void {
    ++epoch; reading?.abort(); saving?.abort(); reading = undefined; saving = undefined; admitted = undefined; model.set(empty());
  }
  function admit(scope: TileScope): void {
    const key = scopeKey(scope);
    if (admitted !== key) { clear(); admitted = key; }
    void check(false);
  }
  async function check(deliberate = true): Promise<void> {
    const scope = hooks.scope(), prior = current();
    if (!scope || admitted !== scopeKey(scope) || reading || saving || (!deliberate && (prior.save === 'uncertain' || prior.phase === 'error')) || document.visibilityState !== 'visible') return;
    const controller = new AbortController(), generation = epoch; reading = controller;
    if (!prior.value || deliberate && prior.save === 'conflict') model.set({ ...prior, phase: 'loading', message: 'Checking your saved tiles…' });
    try {
      const reply = await hooks.request('/api/workspace/tiles', controller);
      if (!alive(scope, generation) || controller.signal.aborted) return;
      if ([401, 403, 426].includes(reply.status)) { hooks.blocked(reply.status); return; }
      if (reply.status !== 200) throw new Error('Tiles unavailable');
      const next = value(reply.value, scope), before = current();
      if (before.value && BigInt(next.layout.revision) < BigInt(before.value.layout.revision)) throw new Error('Older layout');
      const resolved = deliberate && !!before.draft && same(before.draft.tiles, next.layout.tiles);
      const conflict = !!before.draft && !resolved && before.draft.base !== next.layout.revision;
      model.set({ phase: 'ready', value: next, draft: resolved ? undefined : before.draft,
        save: resolved ? 'idle' : conflict ? 'conflict' : deliberate && before.save === 'uncertain' ? 'idle' : before.save,
        message: resolved ? 'Saved tiles checked. They match your changes.' : conflict ? 'A newer tile layout was saved. Your changes are kept for comparison.'
          : before.save === 'uncertain' && deliberate ? 'Saved tiles checked. Review your changes before saving deliberately.'
          : before.draft ? before.message : 'Your tiles, saved to your account.' });
    } catch (error) {
      if (alive(scope, generation) && reading === controller) {
        if (error instanceof ScopeChanged) hooks.blocked(401);
        else model.update(s => ({ ...s, phase: 'error', message: 'Your saved tiles could not be checked. Retry, or open a fresh workspace from Account & recovery.' }));
      }
    } finally { if (reading === controller) reading = undefined; }
  }
  function begin(): void {
    const s = current(); if (!hooks.scope() || !s.value || s.draft || saving || s.save !== 'idle') return;
    reading?.abort(); reading = undefined;
    model.set({ ...s, draft: { base: s.value.layout.revision, tiles: copy(s.value.layout.tiles) }, message: 'Choose your tiles, order and widths, then save.' });
  }
  function change(tiles: Tile[]): void {
    const s = current(); if (!hooks.scope() || !s.value || !s.draft || s.save !== 'idle') return;
    model.set({ ...s, draft: { ...s.draft, tiles }, message: 'Your tile arrangement is unsaved.' });
  }
  function add(id: TileId): void {
    const s = current(); if (!s.draft || !s.value?.catalog.some(t => t.id === id) || s.draft.tiles.some(t => t.id === id)) return;
    change([...copy(s.draft.tiles), { id, size: s.value.defaults.find(t => t.id === id)?.size ?? 'normal' }]);
  }
  function remove(id: TileId): void {
    const s = current(); if (!s.draft || s.draft.tiles.length < 2) return; change(s.draft.tiles.filter(t => t.id !== id));
  }
  function move(id: TileId, delta: -1 | 1): void {
    const tiles = current().draft?.tiles; if (!tiles) return;
    const next = copy(tiles), from = next.findIndex(t => t.id === id), to = from + delta;
    if (from < 0 || to < 0 || to >= next.length) return;
    [next[from], next[to]] = [next[to], next[from]]; change(next);
  }
  function resize(id: TileId, size: Tile['size']): void {
    const tiles = current().draft?.tiles; if (!tiles || !['normal', 'wide'].includes(size)) return;
    change(tiles.map(t => t.id === id ? { ...t, size } : { ...t }));
  }
  function reset(): void { const s = current(); if (s.value) change(copy(s.value.defaults)); }
  function cancel(): void {
    const s = current(); if (!hooks.scope() || saving || ['saving', 'uncertain'].includes(s.save)) return;
    model.set({ ...s, draft: undefined, save: 'idle', message: 'Your saved tile layout is in use.' });
  }
  function resolve(useSaved: boolean): void {
    const s = current(); if (!s.value || !s.draft || s.save !== 'conflict' || s.phase !== 'ready') return;
    if (useSaved) { cancel(); return; }
    model.set({ ...s, draft: { ...s.draft, base: s.value.layout.revision }, save: 'idle', message: 'Your arrangement is kept. Review it, then save deliberately.' });
  }
  async function save(): Promise<void> {
    const scope = hooks.scope(), s = current();
    if (!scope || admitted !== scopeKey(scope) || !s.value || !s.draft || saving || s.save !== 'idle' || same(s.draft.tiles, s.value.layout.tiles)) return;
    reading?.abort(); reading = undefined;
    const submitted = { base_revision: s.draft.base, tiles: copy(s.draft.tiles) };
    const controller = new AbortController(), generation = epoch; saving = controller;
    model.set({ ...s, save: 'saving', message: 'Saving your tile layout…' });
    let conflict = false;
    try {
      const reply = await hooks.request('/api/workspace/tiles', controller, submitted);
      if (!alive(scope, generation) || controller.signal.aborted) return;
      if ([401, 403, 426].includes(reply.status)) { hooks.blocked(reply.status); return; }
      if (reply.status === 409) {
        conflict = true; model.update(m => ({ ...m, phase: 'loading', save: 'conflict', message: 'Another tile layout was saved first. Checking it before comparison…' }));
      } else if ([400, 413, 429].includes(reply.status)) model.update(m => ({ ...m, save: 'idle', message: 'The tiles were not accepted. Keep at least one tile and review the arrangement.' }));
      else {
        if (reply.status !== 200) throw new Error('Uncertain tiles');
        const next = value(reply.value, scope);
        if (BigInt(next.layout.revision) !== BigInt(submitted.base_revision) + 1n || !same(submitted.tiles, next.layout.tiles)) throw new Error('Unqualified tile receipt');
        model.set({ phase: 'ready', value: next, save: 'idle', message: 'Tile layout saved to your account.' });
      }
    } catch (error) {
      if (alive(scope, generation)) {
        if (error instanceof ScopeChanged) hooks.blocked(401);
        else model.update(m => ({ ...m, save: 'uncertain', message: 'The tile layout may have saved. Check saved tiles before saving again; your changes have not been sent again.' }));
      }
    } finally {
      if (saving === controller) saving = undefined;
      if (conflict && alive(scope, generation)) await check(true);
    }
  }
  return { model, admit, clear, check, begin, add, remove, move, resize, reset, cancel, resolve, save,
    busy: () => !!saving || current().save === 'uncertain', drafts: () => !!current().draft };
}

export type TileController = ReturnType<typeof tileController>;
