import { get, writable } from 'svelte/store';

const PRODUCT = 'keida-hub-reborn', CONTRACT = 'reborn-workspace-v1';
const BUDGET = 60000, REQUEST = 4000;
export type Build = { product: string; version: string; commit: string; tree: string; ordinal: number | null; channel: 'accepted' | 'preview' | 'development'; contract: string; package_version: string };
export type AccessScope = { account: { id: string; username: string; role: 'owner' | 'member' }; session_generation: string };
export type RefreshState = {
  phase: 'idle' | 'checking' | 'current' | 'changed' | 'unavailable' | 'reconnecting' | 'compatible-ready' | 'sign-in-required' | 'incompatible' | 'cancelled' | 'could-not-reconnect';
  loaded?: Build; running?: Build; review: boolean; message: string;
};
type Host = { scope: () => AccessScope | undefined; blocked: (message: string) => void; busy: () => boolean; drafts: () => boolean; discard: () => void; leaving: () => void };
const object = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const token = (v: unknown, size: number): v is string => typeof v === 'string' && v.length > 0 && v.length <= size && /^[A-Za-z0-9._-]+$/.test(v);
const sha = (v: unknown): v is string => typeof v === 'string' && /^[a-f0-9]{40}$/.test(v);
function build(v: unknown): Build {
  if (!object(v) || !token(v.product, 64) || !token(v.version, 100) || !token(v.contract, 80) || !token(v.package_version, 40)
      || !['accepted', 'preview', 'development'].includes(String(v.channel))) throw new Error('Invalid build');
  const qualified = sha(v.commit) && sha(v.tree);
  if (v.channel === 'accepted') {
    if (!qualified || !Number.isSafeInteger(v.ordinal) || (v.ordinal as number) < 0 || v.version !== `0.1.${v.ordinal}`) throw new Error('Invalid accepted build');
  } else if (v.ordinal !== null || (v.channel === 'preview'
      ? !qualified || !/^0\.1\.(0|[1-9][0-9]*)-preview\.[a-f0-9]{12}$/.test(v.version) || !v.version.endsWith((v.commit as string).slice(0, 12))
      : !(qualified && v.version === `0.1.0-development.${(v.commit as string).slice(0, 12)}` || v.commit === 'unqualified' && v.tree === 'unqualified' && v.version === 'development'))) throw new Error('Invalid development build');
  return { product: v.product, version: v.version, commit: v.commit as string, tree: v.tree as string, ordinal: v.ordinal as number | null,
    channel: v.channel as Build['channel'], contract: v.contract, package_version: v.package_version };
}
function loadedBuild(): Build | undefined {
  const meta = (name: string) => document.querySelector<HTMLMetaElement>(`meta[name="reborn-${name}"]`)?.content ?? '';
  try {
    const ordinal = meta('ordinal');
    if (ordinal !== '' && !/^(0|[1-9][0-9]*)$/.test(ordinal)) return;
    return build({ product: meta('product'), version: meta('version'), commit: meta('commit'), tree: meta('tree'),
      ordinal: ordinal === '' ? null : Number(ordinal), channel: meta('channel'), contract: meta('auth-contract'), package_version: meta('package-version') });
  } catch { return; }
}
const same = (a: Build, b: Build): boolean => Object.keys(a).every(key => a[key as keyof Build] === b[key as keyof Build]);
const sameScope = (v: Record<string, unknown>, s: AccessScope): boolean => object(v.account) && v.account.id === s.account.id
  && v.account.username === s.account.username && v.account.role === s.account.role && v.session_generation === s.session_generation;
class Outcome extends Error { constructor(readonly kind: 'sign-in-required' | 'incompatible') { super(kind); } }

// One read-only owner. Normal discovery is called by the workspace's existing
// scheduler. Only an explicit reconnect owns a bounded retry/deadline sequence.
export function refresh(binding: string, host: Host) {
  const loaded = loadedBuild();
  const model = writable<RefreshState>({ phase: 'idle', loaded, review: false, message: 'Check the server version when ready.' });
  let serial = 0, active: AbortController | undefined, deadline: ReturnType<typeof setTimeout> | undefined;
  let disposed = false, reconnecting = false, readyAt = 0;
  let expire: (() => void) | undefined, attemptUntil = 0;
  let wake: (() => void) | undefined;
  const set = (next: Partial<RefreshState>) => model.update(s => ({ ...s, ...next }));
  function abort(): void { ++serial; active?.abort(); active = undefined; if (deadline) clearTimeout(deadline); deadline = undefined; wake?.(); wake = undefined; expire = undefined; reconnecting = false; }
  function terminal(kind: 'sign-in-required' | 'incompatible'): void {
    set({ phase: kind, message: kind === 'sign-in-required' ? 'Your sign-in changed or ended. Use a fresh sign-in to continue.' : 'This page cannot continue with the server now answering. Open a fresh document when you are ready.' });
    host.blocked(kind === 'sign-in-required' ? 'Your sign-in changed or ended. Open a fresh workspace after signing in.' : 'The server is incompatible with this loaded page. Open a fresh document.');
  }
  async function json(path: string, signal: AbortSignal, until: number): Promise<{ status: number; value?: unknown }> {
    const request = new AbortController(), started = performance.now();
    const stop = () => request.abort(); signal.addEventListener('abort', stop, { once: true });
    if (signal.aborted) request.abort();
    const limit = Math.min(REQUEST, until - started);
    if (limit <= 0) { signal.removeEventListener('abort', stop); throw new Error('Deadline'); }
    const timer = setTimeout(stop, limit);
    try {
      const response = await fetch(path, { method: 'GET', credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal: request.signal,
        headers: { 'X-Reborn-Product': PRODUCT, 'X-Reborn-Contract': CONTRACT, 'X-CSRF-Token': binding } });
      if (signal.aborted || request.signal.aborted || performance.now() - started >= limit || performance.now() >= until) throw new Error('Deadline');
      if (response.status !== 200) return { status: response.status };
      if (response.headers.get('content-type')?.split(';')[0].trim() !== 'application/json' || !response.body) throw new Error('Invalid reply');
      const reader = response.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
      try {
        while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength;
          if (size > 8192 || signal.aborted || request.signal.aborted || performance.now() - started >= limit || performance.now() >= until) throw new Error('Invalid reply'); chunks.push(value); }
      } catch (e) { await reader.cancel().catch(() => {}); throw e; }
      if (signal.aborted || request.signal.aborted || performance.now() - started >= limit || performance.now() >= until) throw new Error('Deadline');
      const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      return { status: 200, value: JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)) as unknown };
    } finally { clearTimeout(timer); signal.removeEventListener('abort', stop); }
  }
  async function probe(signal: AbortSignal, until: number, scope: AccessScope): Promise<Build> {
    const health = await json('/api/health', signal, until);
    if (health.status !== 200 || !object(health.value) || health.value.status !== 'ok') throw new Error('Unavailable health');
    const running = build(health.value.identity);
    if (!loaded || loaded.product !== PRODUCT || running.product !== PRODUCT || loaded.contract !== 'reborn-auth-v1' || running.contract !== loaded.contract
        || document.querySelector<HTMLMetaElement>('meta[name="reborn-workspace-contract"]')?.content !== CONTRACT) throw new Outcome('incompatible');
    const access = await json('/api/workspace/access', signal, until);
    if (access.status === 401 || access.status === 403) throw new Outcome('sign-in-required');
    if (access.status === 426) throw new Outcome('incompatible');
    if (access.status !== 200 || !object(access.value)) throw new Error('Unavailable access');
    const v = access.value;
    if (v.product !== PRODUCT || v.contract !== CONTRACT || v.schema !== 1) throw new Outcome('incompatible');
    if (!sameScope(v, scope)) throw new Outcome('sign-in-required');
    if (!same(running, build(v.identity))) throw new Error('Server changed between probes');
    return running;
  }
  async function discover(): Promise<void> {
    const scope = host.scope(); if (disposed || active || !scope || document.visibilityState !== 'visible') return;
    if (get(model).review) return;
    const controller = new AbortController(), current = ++serial; active = controller;
    const before = get(model); if (before.phase === 'compatible-ready') return void (active = undefined);
    set({ phase: 'checking' });
    try {
      const running = await probe(controller.signal, performance.now() + REQUEST * 2, scope);
      if (disposed || controller.signal.aborted || serial !== current) return;
      set({ running, phase: same(loaded!, running) ? 'current' : 'changed', message: same(loaded!, running) ? 'This page matches the running server.' : 'The running server changed. Review your work before refreshing.' });
    } catch (e) {
      if (disposed || controller.signal.aborted || serial !== current) return;
      if (e instanceof Outcome) terminal(e.kind);
      else set({ phase: 'unavailable', message: 'The server version could not be checked. This page has not refreshed.' });
    } finally { if (active === controller) active = undefined; }
  }
  function cancel(): void { abort(); set({ phase: 'cancelled', message: 'Refresh checks cancelled. This page has not refreshed.' }); }
  function pause(blocked = false): void {
    if (blocked) { const phase = get(model).phase; abort(); if (!['sign-in-required', 'incompatible'].includes(phase)) set({ phase: 'cancelled', review: false, message: 'Workspace access paused. Open a fresh document to check access.' }); }
    else if (!reconnecting) { abort(); if (get(model).phase === 'checking') set({ phase: 'idle' }); }
  }
  async function reconnect(): Promise<void> {
    if (disposed || reconnecting || host.busy()) return;
    const scope = host.scope(); if (!scope) { terminal('sign-in-required'); return; }
    abort(); const controller = new AbortController(), current = ++serial, until = performance.now() + BUDGET;
    active = controller; reconnecting = true; set({ phase: 'reconnecting', review: true, message: 'Checking the running server and your access. This can take up to one minute.' });
    const expired = () => { if (serial !== current || disposed) return; controller.abort(); wake?.(); set({ phase: 'could-not-reconnect', message: 'Could not reconnect within one minute. Your page has not refreshed.' }); };
    attemptUntil = until; expire = expired;
    deadline = setTimeout(expired, BUDGET);
    let delay = 1000;
    try {
      while (!disposed && serial === current && !controller.signal.aborted && performance.now() < until) {
        if (document.visibilityState === 'visible') {
          try {
            const running = await probe(controller.signal, until, scope);
            if (disposed || serial !== current || controller.signal.aborted || performance.now() >= until) break;
            if (document.visibilityState !== 'visible') throw new Error('Workspace hidden');
            readyAt = performance.now(); set({ running, phase: 'compatible-ready', message: 'The server and your account are ready. Review unfinished work, then choose whether to refresh.' }); return;
          } catch (e) { if (disposed || serial !== current || controller.signal.aborted) break; if (e instanceof Outcome) { terminal(e.kind); return; } }
        }
        if (performance.now() >= until) break;
        await new Promise<void>(resolve => { const timer = setTimeout(() => { wake = undefined; resolve(); }, Math.min(delay, until - performance.now())); wake = () => { clearTimeout(timer); resolve(); }; });
        delay = Math.min(delay * 2, 10000);
      }
      if (!disposed && serial === current) expired();
    } finally { if (serial === current) { if (deadline) clearTimeout(deadline); deadline = undefined; expire = undefined; reconnecting = false; if (active === controller) active = undefined; } }
  }
  function navigate(discard: boolean): void {
    if (disposed || get(model).phase !== 'compatible-ready') return;
    if (host.busy()) { set({ message: 'Finish or check the pending change before refreshing.' }); return; }
    if (performance.now() - readyAt > 15000) { set({ phase: 'unavailable', message: 'The access check expired. Check again before refreshing.' }); return; }
    if (host.drafts() && !discard) { set({ message: 'Unfinished work is still here. Save it, stay, or choose to discard it deliberately.' }); return; }
    if (discard) host.discard(); abort(); host.leaving(); window.location.assign('/workspace');
  }
  return { model, discover, reconnect, navigate, cancel, pause,
    resume: () => { if (reconnecting) { if (performance.now() >= attemptUntil) expire?.(); else wake?.(); } },
    review: () => { if (!reconnecting) abort(); set({ review: true }); }, stay: () => { if (reconnecting) cancel(); else if (get(model).phase === 'compatible-ready') set({ phase: 'idle' }); set({ review: false }); },
    dispose: () => { disposed = true; abort(); } };
}
