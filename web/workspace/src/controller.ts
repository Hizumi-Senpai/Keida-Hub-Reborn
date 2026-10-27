import { writable, get } from 'svelte/store';
import { flushSync } from 'svelte';
const PRODUCT = 'keida-hub-reborn';
const CONTRACT = 'reborn-workspace-v1';
const MAX_REVISION = 9223372036854775807n;
type Note = { body: string; revision: string };
export type Crafty = { revision: string; configured: boolean; checked_at: number | null; error: string | null; servers: Array<{ name: string; join: string; state: string; players: number | null; capacity: number | null; collected_at: number | null; provider_at: number | null; freshness: string; error: string | null }> };
export type ServiceLink = { id: string; name: string; category: string; description: string; url: string };
export type Directory = { revision: string; services: ServiceLink[]; pins_revision: string; pins: string[] };
type Snapshot = { schema: 1; account: { id: string; username: string; role: 'owner' | 'member' }; session_generation: string; note: Note; crafty?: Crafty | null; directory: Directory };
type Draft = { body: string; base: string };
export type Model = {
  phase: 'checking' | 'ready' | 'paused' | 'blocked'; message: string;
  snapshot?: Snapshot; draft: string; base: string; dirty: boolean;
  save: 'idle' | 'saving' | 'saved' | 'checking-conflict' | 'conflict' | 'uncertain'; recovery?: Draft;
  storageLimited: boolean;
  directorySave: 'idle' | 'saving' | 'conflict' | 'uncertain'; directoryMessage: string;
};
const empty = (phase: Model['phase'], message: string): Model => ({ phase, message, draft: '', base: '0', dirty: false, save: 'idle', storageLimited: false, directorySave: 'idle', directoryMessage: '' });
const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const decimal = (v: unknown, positive = false): v is string => typeof v === 'string' && /^(0|[1-9][0-9]{0,18})$/.test(v) && BigInt(v) <= MAX_REVISION && (!positive || v !== '0');
const text = (v: unknown): v is string => typeof v === 'string' && !v.includes('\0') && new TextEncoder().encode(v).length <= 4096;
export function safeLink(v: unknown): v is string {
  if (typeof v !== 'string' || new TextEncoder().encode(v).length > 1024 || !/^https:\/\/[^/]/.test(v) || /[\s\u0000-\u001f\u007f\\]/u.test(v)) return false;
  try { const u = new URL(v); return u.protocol === 'https:' && !!u.hostname && !u.username && !u.password && !v.includes('?') && !v.includes('#'); } catch { return false; }
}
function snapshot(value: unknown): Snapshot {
  if (!record(value) || value.product !== PRODUCT || value.contract !== CONTRACT || value.schema !== 1
      || !record(value.account) || !decimal(value.account.id, true)
      || typeof value.account.username !== 'string' || !/^[a-z0-9_-]{3,32}$/.test(value.account.username)
      || (value.account.role !== 'owner' && value.account.role !== 'member')
      || !decimal(value.session_generation) || !record(value.note) || !text(value.note.body) || !decimal(value.note.revision)) throw new Error('Invalid workspace response');
  const d = value.directory;
  const field = (v: unknown, max: number, required = false) => typeof v === 'string' && (!required || v.length > 0) && new TextEncoder().encode(v).length <= max && !/[\u0000-\u001f\u007f]/u.test(v);
  if (!record(d) || !decimal(d.revision) || !decimal(d.pins_revision) || !Array.isArray(d.services) || d.services.length > 100
      || d.services.some((s: unknown) => !record(s) || !decimal(s.id, true) || !field(s.name, 80, true) || !field(s.category, 40, true) || !field(s.description, 240) || !safeLink(s.url))
      || new Set(d.services.map((s) => s.id)).size !== d.services.length
      || !Array.isArray(d.pins) || d.pins.length > 24 || new Set(d.pins).size !== d.pins.length
      || d.pins.some((id: unknown) => !decimal(id, true) || !(d.services as Record<string, unknown>[]).some((s) => s.id === id))) throw new Error('Invalid directory response');
  if (value.crafty != null) {
    const c = value.crafty;
    const count = (v: unknown) => v === null || (typeof v === 'number' && Number.isSafeInteger(v) && v >= 0);
    const message = (v: unknown) => v === null || (typeof v === 'string' && /^[a-z_]{1,40}$/.test(v));
    if (!record(c) || !decimal(c.revision) || typeof c.configured !== 'boolean' || !count(c.checked_at) || !message(c.error) || !Array.isArray(c.servers) || c.servers.length > 8
        || c.servers.some((s: unknown) => !record(s) || typeof s.name !== 'string' || s.name.length > 80 || typeof s.join !== 'string' || s.join.length > 253
          || !['running', 'stopped', 'unknown'].includes(String(s.state)) || !['fresh', 'stale', 'unknown'].includes(String(s.freshness))
          || !count(s.players) || !count(s.capacity) || !count(s.collected_at) || !count(s.provider_at) || !message(s.error))) throw new Error('Invalid connection response');
  }
  return value as unknown as Snapshot;
}
function stored(value: string | null): Draft | undefined {
  if (!value || value.length > 25000) return;
  try {
    const parsed: unknown = JSON.parse(value);
    if (record(parsed) && parsed.schema === 1 && text(parsed.body) && decimal(parsed.base)) return { body: parsed.body, base: parsed.base };
  } catch { /* Corrupt local drafts never grant authority or break the workspace. */ }
}

export function workspace(binding: string) {
  const model = writable<Model>(empty('checking', 'Checking your workspace…'));
  let epoch = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let reading: AbortController | undefined;
  let saving: AbortController | undefined;
  let editing: AbortController | undefined;
  let key: string | undefined;
  let held: { key: string; draft: Draft } | undefined;
  let channel: BroadcastChannel | undefined;
  let disposed = false;
  let terminal = false;
  const state = () => get(model);
  const storageKey = (s: Snapshot) => `${PRODUCT}.workspace.v1:${s.account.id}:${s.session_generation}`;
  function removeDraft(): void {
    held = undefined;
    if (key) try { sessionStorage.removeItem(key); } catch { /* Native sign out must remain available. */ }
  }
  function persist(): void {
    const s = state();
    if (!key || !s.snapshot) return;
    if (!s.dirty) { removeDraft(); return; }
    const draft = { body: s.draft, base: s.base };
    held = { key, draft };
    try { sessionStorage.setItem(key, JSON.stringify({ schema: 1, ...draft })); }
    catch { model.update((m) => ({ ...m, storageLimited: true })); }
  }
  function cancel(): void {
    ++epoch;
    if (timer) clearTimeout(timer);
    timer = undefined;
    reading?.abort(); saving?.abort(); reading = undefined; saving = undefined;
    editing?.abort(); editing = undefined;
  }
  function invalidate(message: string, blocked = false): void {
    cancel(); terminal ||= blocked;
    flushSync(() => model.set(empty(blocked ? 'blocked' : 'paused', message)));
  }
  function schedule(): void {
    if (timer) clearTimeout(timer);
    if (!disposed && !terminal && state().phase === 'ready' && document.visibilityState === 'visible') {
      timer = setTimeout(() => { timer = undefined; void read(); }, 15000);
    }
  }
  async function request(path: string, controller: AbortController, body?: unknown): Promise<{ status: number; value?: unknown }> {
    const started = performance.now();
    const deadline = setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch(path, {
        method: body ? 'PUT' : 'GET', credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal: controller.signal,
        headers: { 'X-Reborn-Product': PRODUCT, 'X-Reborn-Contract': CONTRACT, 'X-CSRF-Token': binding, ...(body ? { 'Content-Type': 'application/json' } : {}) },
        body: body ? JSON.stringify(body) : undefined,
      });
      const value: unknown = response.ok ? await response.json() : undefined;
      if (controller.signal.aborted || performance.now() - started >= 4000) throw new Error('Deadline');
      return { status: response.status, value };
    } finally { clearTimeout(deadline); }
  }
  function rejected(status: number): string {
    return status === 401 || status === 403 ? 'Your sign-in changed or ended. Open a fresh workspace after signing in.'
      : status === 426 ? 'This workspace needs a fresh document. Open workspace again.'
      : 'Your workspace could not be checked. Open workspace again when access is available.';
  }
  function authorized(s: Snapshot): boolean {
    const prior = state().snapshot;
    return !prior || (s.account.id === prior.account.id && s.session_generation === prior.session_generation && s.account.role === prior.account.role);
  }
  async function read(): Promise<void> {
    if (disposed || terminal || reading || saving || editing || document.visibilityState !== 'visible') return;
    const controller = new AbortController(); reading = controller; const current = epoch;
    try {
      const response = await request('/api/workspace/snapshot', controller);
      if (disposed || controller.signal.aborted || current !== epoch) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if (response.status !== 200) { invalidate(rejected(response.status), true); return; }
      const next = snapshot(response.value);
      if (!authorized(next)) { invalidate('Your account scope changed. Open a fresh workspace.', true); return; }
      const before = state(); key = storageKey(next);
      if (before.phase === 'ready') {
        const conflict = before.dirty && next.note.revision !== before.base;
        model.set({ ...before, snapshot: next,
          draft: before.dirty ? before.draft : next.note.body,
          base: before.dirty ? before.base : next.note.revision,
          save: conflict ? 'conflict' : ['uncertain', 'checking-conflict'].includes(before.save) ? 'idle' : before.save,
          message: conflict ? 'A newer saved note is available. Your draft is unchanged.' : 'Workspace checked.',
          directorySave: before.directorySave === 'uncertain' ? 'idle' : before.directorySave,
          directoryMessage: before.directorySave === 'uncertain' ? 'Current saved directory and pins checked. Review them before making another change.' : before.directoryMessage });
        if (before.dirty && before.draft === next.note.body) {
          model.update((m) => ({ ...m, dirty: false, base: next.note.revision, save: 'saved', message: 'The current note is saved.' })); removeDraft();
        }
      } else {
        let draft = held?.key === key ? held.draft : undefined;
        let limited = false;
        try { draft ??= stored(sessionStorage.getItem(key)); } catch { limited = true; }
        if (draft?.body === next.note.body) { removeDraft(); draft = undefined; }
        model.set({ ...empty('ready', 'Workspace checked.'), snapshot: next, draft: next.note.body, base: next.note.revision, recovery: draft, storageLimited: limited });
      }
      schedule();
    } catch {
      if (reading === controller && current === epoch && !disposed) invalidate('Your workspace could not be checked. Open workspace again to retry deliberately.', true);
    } finally { if (reading === controller) reading = undefined; }
  }
  function edit(body: string): void {
    const s = state(); if (s.phase !== 'ready' || !s.snapshot) return;
    model.set({ ...s, draft: body, dirty: body !== s.snapshot.note.body, save: s.save === 'saved' ? 'idle' : s.save });
    // Oversized drafts stay editable but cannot be stored or sent.
    if (text(body)) persist();
    else { held = undefined; if (key) try { sessionStorage.removeItem(key); } catch { /* No secret-bearing fallback. */ } }
  }
  function recover(): void {
    const s = state(); if (!s.recovery || !s.snapshot || s.phase !== 'ready') return;
    model.set({ ...s, draft: s.recovery.body, base: s.recovery.base, dirty: true, recovery: undefined,
      save: s.recovery.base === s.snapshot.note.revision ? 'idle' : 'conflict', message: 'Draft recovered. Review it before saving.' }); persist();
  }
  function resolve(useSaved: boolean): void {
    const s = state(); if (!s.snapshot || s.phase !== 'ready') return;
    model.set({ ...s, draft: useSaved ? s.snapshot.note.body : s.draft, base: s.snapshot.note.revision,
      dirty: !useSaved && s.draft !== s.snapshot.note.body, recovery: undefined, save: 'idle',
      message: useSaved ? 'Loaded the saved note.' : 'Draft kept against the latest saved revision. Review, then save deliberately.' }); persist();
  }
  async function save(): Promise<void> {
    const s = state();
    if (s.phase !== 'ready' || !s.dirty || !text(s.draft) || ['conflict', 'checking-conflict', 'uncertain'].includes(s.save) || saving) return;
    reading?.abort(); reading = undefined;
    if (timer) clearTimeout(timer); timer = undefined;
    const controller = new AbortController(); saving = controller; const current = epoch;
    const submitted = { body: s.draft, base: s.base };
    model.update((m) => ({ ...m, save: 'saving', message: 'Saving your note…' }));
    try {
      const response = await request('/api/workspace/note', controller, { body: submitted.body, base_revision: submitted.base });
      if (disposed || controller.signal.aborted || current !== epoch) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) {
        model.update((m) => ({ ...m, save: 'checking-conflict', message: 'Another save won. Checking the latest saved note before comparing. Your draft is unchanged.' }));
      } else if (response.status === 200) {
        const next = snapshot(response.value);
        if (!authorized(next) || next.note.body !== submitted.body || BigInt(next.note.revision) !== BigInt(submitted.base) + 1n) throw new Error('Unqualified save result');
        model.update((m) => ({ ...m, snapshot: { ...next, crafty: next.crafty ?? m.snapshot?.crafty, directory: m.snapshot?.directory ?? next.directory }, base: next.note.revision, dirty: m.draft !== next.note.body,
          save: 'saved', message: m.draft === next.note.body ? 'Saved to your account.' : 'Submitted version saved. Your newer edits are still unsaved.' })); persist();
      } else throw new Error('Save outcome unavailable');
    } catch {
      if (saving === controller && current === epoch && !disposed) model.update((m) => ({ ...m, save: 'uncertain', message: 'Save outcome is uncertain. Check the saved note before trying again.' }));
    } finally {
      if (saving === controller) saving = undefined;
      if (current === epoch && !disposed) {
        if (state().save === 'checking-conflict') await read();
        else schedule();
      }
    }
  }
  async function directoryMutation(path: string, payload: unknown): Promise<boolean> {
    const s = state();
    if (s.phase !== 'ready' || !s.snapshot || editing || s.directorySave === 'uncertain') return false;
    reading?.abort(); reading = undefined;
    const controller = new AbortController(); editing = controller; const current = epoch;
    model.update((m) => ({ ...m, directorySave: 'saving', directoryMessage: 'Saving your change…' }));
    try {
      const response = await request(path, controller, payload);
      if (disposed || controller.signal.aborted || current !== epoch) return false;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return false; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return false; }
      if (response.status === 200) {
        const next = snapshot(response.value);
        if (!authorized(next)) { invalidate('Your account scope changed. Open a fresh workspace.', true); return false; }
        model.update((m) => ({ ...m, snapshot: m.snapshot ? { ...m.snapshot, directory: next.directory } : undefined, directorySave: 'idle', directoryMessage: 'Saved to your account.' }));
        return true;
      }
      if ([400, 404, 409, 413, 429].includes(response.status)) {
        model.update((m) => ({ ...m, directorySave: response.status === 409 ? 'conflict' : 'idle', directoryMessage: response.status === 409 ? 'Another change was saved first. Check the saved directory and review your edit before saving again.' : 'Change not accepted. Check the link, field limits and pin limit.' }));
        return false;
      }
      throw new Error('Uncertain directory outcome');
    } catch {
      if (editing === controller && current === epoch && !disposed) model.update((m) => ({ ...m, directorySave: 'uncertain', directoryMessage: 'The save may have completed. Check saved services before making another change.' }));
      return false;
    } finally {
      if (editing === controller) editing = undefined;
      if (current === epoch && !disposed) schedule();
    }
  }
  function editService(base: string, change: unknown): Promise<boolean> {
    return directoryMutation('/api/owner/directory', { base_revision: base, change });
  }
  function pins(ids: string[]): Promise<boolean> {
    const d = state().snapshot?.directory;
    return d ? directoryMutation('/api/workspace/pins', { base_directory_revision: d.revision, base_revision: d.pins_revision, ids }) : Promise.resolve(false);
  }
  function signOut(): void {
    removeDraft(); invalidate('Signing out…', true);
    try { channel?.postMessage({ kind: 'auth-changed' }); } catch { /* No optional feature blocks native submission. */ }
  }
  function start(): () => void {
    const pause = () => invalidate('Workspace hidden. Checking access on return.');
    const resume = () => { void read(); };
    const visibility = () => { if (document.visibilityState === 'visible') resume(); else pause(); };
    try {
      channel = new BroadcastChannel('keida-hub-reborn.account.v1');
      channel.onmessage = (event: MessageEvent<unknown>) => {
        if (record(event.data) && event.data.kind === 'auth-changed') invalidate('Your sign-in may have changed. Open a fresh workspace.', true);
      };
    } catch { /* Visible polling/focus and server admission remain authoritative. */ }
    window.addEventListener('blur', pause); window.addEventListener('pagehide', pause);
    window.addEventListener('focus', resume); window.addEventListener('pageshow', resume);
    document.addEventListener('visibilitychange', visibility);
    void read();
    return () => {
      disposed = true; cancel(); channel?.close(); model.set(empty('blocked', 'Workspace closed.'));
      window.removeEventListener('blur', pause); window.removeEventListener('pagehide', pause);
      window.removeEventListener('focus', resume); window.removeEventListener('pageshow', resume);
      document.removeEventListener('visibilitychange', visibility);
    };
  }
  return { model, start, edit, recover, resolve, save, signOut, check: read, editService, pins };
}
