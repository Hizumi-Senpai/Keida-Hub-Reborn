import { writable, get } from 'svelte/store';
import { flushSync } from 'svelte';
const PRODUCT = 'keida-hub-reborn';
const CONTRACT = 'reborn-workspace-v1';
const MAX_REVISION = 9223372036854775807n;
type Note = { body: string; revision: string };
type Snapshot = { schema: 1; account: { id: string; username: string; role: 'owner' | 'member' }; session_generation: string; note: Note };
type Draft = { body: string; base: string };
export type Model = {
  phase: 'checking' | 'ready' | 'paused' | 'blocked'; message: string;
  snapshot?: Snapshot; draft: string; base: string; dirty: boolean;
  save: 'idle' | 'saving' | 'saved' | 'conflict' | 'uncertain'; recovery?: Draft;
  storageLimited: boolean;
};
const empty = (phase: Model['phase'], message: string): Model => ({ phase, message, draft: '', base: '0', dirty: false, save: 'idle', storageLimited: false });
const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const decimal = (v: unknown, positive = false): v is string => typeof v === 'string' && /^(0|[1-9][0-9]{0,18})$/.test(v) && BigInt(v) <= MAX_REVISION && (!positive || v !== '0');
const text = (v: unknown): v is string => typeof v === 'string' && !v.includes('\0') && new TextEncoder().encode(v).length <= 4096;
function snapshot(value: unknown): Snapshot {
  if (!record(value) || value.product !== PRODUCT || value.contract !== CONTRACT || value.schema !== 1
      || !record(value.account) || !decimal(value.account.id, true)
      || typeof value.account.username !== 'string' || !/^[a-z0-9_-]{3,32}$/.test(value.account.username)
      || (value.account.role !== 'owner' && value.account.role !== 'member')
      || !decimal(value.session_generation) || !record(value.note) || !text(value.note.body) || !decimal(value.note.revision)) throw new Error('Invalid workspace response');
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
  async function request(path: string, controller: AbortController, body?: Draft): Promise<{ status: number; value?: unknown }> {
    const started = performance.now();
    const deadline = setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch(path, {
        method: body ? 'PUT' : 'GET', credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal: controller.signal,
        headers: { 'X-Reborn-Product': PRODUCT, 'X-Reborn-Contract': CONTRACT, 'X-CSRF-Token': binding, ...(body ? { 'Content-Type': 'application/json' } : {}) },
        body: body ? JSON.stringify({ body: body.body, base_revision: body.base }) : undefined,
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
    if (disposed || terminal || reading || saving || document.visibilityState !== 'visible') return;
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
          save: conflict ? 'conflict' : before.save === 'uncertain' ? 'idle' : before.save,
          message: conflict ? 'A newer saved note is available. Your draft is unchanged.' : 'Workspace checked.' });
        if (before.dirty && before.draft === next.note.body) {
          model.update((m) => ({ ...m, dirty: false, base: next.note.revision, save: 'saved' })); removeDraft();
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
    if (s.phase !== 'ready' || !s.dirty || !text(s.draft) || s.save === 'conflict' || s.save === 'uncertain' || saving) return;
    reading?.abort(); reading = undefined;
    if (timer) clearTimeout(timer); timer = undefined;
    const controller = new AbortController(); saving = controller; const current = epoch;
    const submitted = { body: s.draft, base: s.base };
    model.update((m) => ({ ...m, save: 'saving', message: 'Saving your note…' }));
    try {
      const response = await request('/api/workspace/note', controller, submitted);
      if (disposed || controller.signal.aborted || current !== epoch) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) {
        model.update((m) => ({ ...m, save: 'conflict', message: 'Another save won. Your draft is unchanged.' }));
      } else if (response.status === 200) {
        const next = snapshot(response.value);
        if (!authorized(next) || next.note.body !== submitted.body || BigInt(next.note.revision) !== BigInt(submitted.base) + 1n) throw new Error('Unqualified save result');
        model.update((m) => ({ ...m, snapshot: next, base: next.note.revision, dirty: m.draft !== next.note.body,
          save: 'saved', message: m.draft === next.note.body ? 'Saved to your account.' : 'Submitted version saved. Your newer edits are still unsaved.' })); persist();
      } else throw new Error('Save outcome unavailable');
    } catch {
      if (saving === controller && current === epoch && !disposed) model.update((m) => ({ ...m, save: 'uncertain', message: 'Save outcome is uncertain. Check the saved note before trying again.' }));
    } finally {
      if (saving === controller) saving = undefined;
      if (current === epoch && !disposed) {
        if (state().save === 'conflict') await read();
        else schedule();
      }
    }
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
  return { model, start, edit, recover, resolve, save, signOut, check: read };
}
