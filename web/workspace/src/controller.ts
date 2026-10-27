import { writable, get } from 'svelte/store';
import { flushSync } from 'svelte';
const PRODUCT = 'keida-hub-reborn';
const CONTRACT = 'reborn-workspace-v1';
const MAX_REVISION = 9223372036854775807n;
type Note = { body: string; revision: string };
export type Crafty = { revision: string; configured: boolean; checked_at: number | null; error: string | null; history_error?: 'unavailable' | null; servers: Array<{ name: string; join: string; state: string; players: number | null; capacity: number | null; collected_at: number | null; provider_at: number | null; freshness: string; error: string | null }> };
export type ServiceLink = { id: string; name: string; category: string; description: string; url: string };
export type Directory = { revision: string; services: ServiceLink[]; pins_revision: string; pins: string[] };
export type HomePanel = { id: 'note' | 'connections' | 'pins'; visible: boolean };
export type Layout = { revision: string; panels: HomePanel[] };
export const defaultPanels = (): HomePanel[] => [{ id: 'note', visible: true }, { id: 'connections', visible: true }, { id: 'pins', visible: true }];
export const panelLabel = (id: HomePanel['id']): string => id === 'note' ? 'Workspace note' : id === 'connections' ? 'Connections' : 'Pinned services';
export type Notifications = { unread_groups: number; groups: Array<{ category: 'services' | 'connections'; revision: string; read_through: string; unread: string; latest: { kind: string; label: string; source_revision: string; occurred_at: string } }> };
type Snapshot = { schema: 1; account: { id: string; username: string; role: 'owner' | 'member' }; session_generation: string; note: Note; crafty?: Crafty | null; directory: Directory; notifications: Notifications; layout: Layout };
type Draft = { body: string; base: string };
export type ActivityEntry = { id: string; occurred_at: string; revision: string; kind: string; category: string; label: string };
export type Activity = { phase: 'idle' | 'loading' | 'ready' | 'error'; entries: ActivityEntry[]; through: string; next: string | null; category: string; query: string; message: string };
const emptyActivity = (): Activity => ({ phase: 'idle', entries: [], through: '0', next: null, category: 'all', query: '', message: '' });
export type Integration = { id: string; name: string; status: 'available' | 'planned'; summary: string; requirements: string[]; capabilities: string[] };
export type Roadmap = { as_of: string; intro: string; priorities: string[]; milestones: Array<{ id: string; title: string; status: string; delivered: string[]; remaining: string[] }>; tracker_url: string };
export type Guide = { catalog: Integration[]; roadmap: Roadmap };
export type GuideState = { phase: 'idle' | 'loading' | 'ready' | 'error'; value?: Guide; message: string };
export type ObservationServer = { name: string; state: 'running' | 'stopped' | 'unknown'; players: number | null; capacity: number | null; collected_at: string | null; provider_at: string | null; freshness: 'fresh' | 'stale' | 'unknown'; error: string | null };
export type Observation = { id: string; revision: string; checked_at: string; error: string | null; complete: boolean; servers: ObservationServer[] };
export type ObservationState = { phase: 'idle' | 'loading' | 'ready' | 'error'; entries: Observation[]; revision: string; through: string; next: string | null; message: string };
const emptyGuide = (): GuideState => ({ phase: 'idle', message: '' });
const emptyObservations = (): ObservationState => ({ phase: 'idle', entries: [], revision: '0', through: '0', next: null, message: '' });
export type MediaProvider = 'jellyfin' | 'seerr';
export type MediaEnrollment = { endpoint: string; token: string; ca_pem: string; library_id: string | null; acknowledge_broad_access: boolean };
export type MediaObservation = { revision: string; configured: boolean; checked_at: number | null; freshness: 'fresh' | 'stale' | 'unknown'; error: string | null; complete: boolean; offset: number; next_offset: number | null; total: number | null; truncated: boolean; items: Array<{ id: string; title: string | null; kind: 'movie' | 'series'; year: number | null; request_status: 'pending' | 'approved' | 'declined' | 'failed' | 'completed' | 'unknown' | null; detail_error: string | null }>; playback: { playing: number | null; paused: number | null; error: string | null } | null };
export type MediaState = { phase: 'idle' | 'loading' | 'ready' | 'error'; status?: { revision: string; configured: boolean }; observation?: MediaObservation; save: 'idle' | 'saving' | 'conflict' | 'uncertain'; message: string };
const mediaProviders: MediaProvider[] = ['jellyfin', 'seerr'];
const emptyMedia = (): Record<MediaProvider, MediaState> => ({ jellyfin: { phase: 'idle', save: 'idle', message: '' }, seerr: { phase: 'idle', save: 'idle', message: '' } });
export type Model = {
  phase: 'checking' | 'ready' | 'paused' | 'blocked'; message: string;
  snapshot?: Snapshot; draft: string; base: string; dirty: boolean;
  save: 'idle' | 'saving' | 'saved' | 'checking-conflict' | 'conflict' | 'uncertain'; recovery?: Draft;
  storageLimited: boolean; activity: Activity;
  notificationSave: 'idle' | 'saving' | 'uncertain'; notificationMessage: string;
  directorySave: 'idle' | 'saving' | 'conflict' | 'uncertain'; directoryMessage: string;
  layoutDraft?: { base: string; panels: HomePanel[] };
  layoutSave: 'idle' | 'saving' | 'checking-conflict' | 'conflict' | 'uncertain'; layoutMessage: string;
  guide: GuideState; observations: ObservationState; media: Record<MediaProvider, MediaState>;
};
const empty = (phase: Model['phase'], message: string): Model => ({ phase, message, draft: '', base: '0', dirty: false, save: 'idle', storageLimited: false, directorySave: 'idle', directoryMessage: '', activity: emptyActivity(), notificationSave: 'idle', notificationMessage: '', layoutSave: 'idle', layoutMessage: '', guide: emptyGuide(), observations: emptyObservations(), media: emptyMedia() });
const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const decimal = (v: unknown, positive = false): v is string => typeof v === 'string' && /^(0|[1-9][0-9]{0,18})$/.test(v) && BigInt(v) <= MAX_REVISION && (!positive || v !== '0');
const text = (v: unknown): v is string => typeof v === 'string' && !v.includes('\0') && new TextEncoder().encode(v).length <= 4096;
const field = (v: unknown, max: number, required = false): v is string => typeof v === 'string' && (!required || v.trim().length > 0) && new TextEncoder().encode(v).length <= max && !/[\u0000-\u001f\u007f]/u.test(v);
const strings = (v: unknown, maxItems: number, maxBytes: number): v is string[] => Array.isArray(v) && v.length <= maxItems && v.every(s => field(s, maxBytes, true));
const timestamp = (v: unknown): v is string => decimal(v) && BigInt(v) <= 253402300799n;
const providerErrors = ['unavailable', 'invalid_configuration', 'timeout', 'transport', 'denied', 'provider_error', 'oversized', 'malformed', 'not_discovered'];
const providerError = (v: unknown): v is string | null => v === null || (typeof v === 'string' && providerErrors.includes(v));
const providerCount = (v: unknown): v is number | null => v === null || (typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && v <= 1_000_000);
export function safeLink(v: unknown): v is string {
  if (typeof v !== 'string' || new TextEncoder().encode(v).length > 1024 || !/^https:\/\/[^/]/.test(v) || /[\s\u0000-\u001f\u007f\\]/u.test(v)) return false;
  try { const u = new URL(v); return u.protocol === 'https:' && !!u.hostname && !u.username && !u.password && !v.includes('?') && !v.includes('#'); } catch { return false; }
}
function notifications(v: unknown): Notifications {
  if (!record(v) || !Array.isArray(v.groups) || v.groups.length > 2 || !Number.isInteger(v.unread_groups)
      || new Set(v.groups.map(g => record(g) ? g.category : null)).size !== v.groups.length
      || v.groups.some((g: unknown) => !record(g) || !['services', 'connections'].includes(String(g.category))
        || !decimal(g.revision, true) || !decimal(g.read_through) || !decimal(g.unread)
        || BigInt(g.read_through) > BigInt(g.revision) || BigInt(g.unread) !== BigInt(g.revision) - BigInt(g.read_through)
        || !record(g.latest) || !decimal(g.latest.source_revision, true) || !decimal(g.latest.occurred_at)
        || BigInt(g.latest.occurred_at) > 253402300799n || typeof g.latest.label !== 'string' || !/^[A-Za-z ]{1,64}$/.test(g.latest.label)
        || !(g.category === 'services' ? ['service_added', 'service_updated', 'service_removed'] : ['connection_saved', 'connection_removed']).includes(String(g.latest.kind)))
      || v.unread_groups !== v.groups.filter(g => g.unread !== '0').length) throw new Error('Invalid notification response');
  return v as unknown as Notifications;
}
function layout(v: unknown): Layout {
  if (!record(v) || !decimal(v.revision) || !Array.isArray(v.panels) || v.panels.length !== 3
      || v.panels.some((p: unknown) => !record(p) || !['note', 'connections', 'pins'].includes(String(p.id)) || typeof p.visible !== 'boolean')
      || new Set(v.panels.map(p => p.id)).size !== 3 || !v.panels.some(p => p.visible)) throw new Error('Invalid layout response');
  return v as unknown as Layout;
}
function parseGuide(v: Record<string, unknown>): Guide {
  const ids = ['crafty', 'jellyfin', 'seerr', 'sonarr', 'radarr', 'qbittorrent', 'discord'];
  const c = v.catalog, r = v.roadmap;
  if (!Array.isArray(c) || c.length !== ids.length || new Set(c.map(i => record(i) ? i.id : null)).size !== ids.length
      || c.some((i: unknown) => !record(i) || !ids.includes(String(i.id)) || !field(i.name, 80, true)
        || i.status !== (['crafty', 'jellyfin', 'seerr'].includes(String(i.id)) ? 'available' : 'planned') || !field(i.summary, 512, true)
        || !strings(i.requirements, 8, 512) || !strings(i.capabilities, 8, 512))
      || !record(r) || typeof r.as_of !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(r.as_of) || !field(r.intro, 1024, true)
      || !strings(r.priorities, 8, 512) || r.tracker_url !== 'https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/issues/2'
      || !Array.isArray(r.milestones) || r.milestones.length !== 9
      || r.milestones.some((m: unknown, index: number) => !record(m) || m.id !== `M${index}` || !field(m.title, 120, true)
        || !field(m.status, 160, true) || !strings(m.delivered, 8, 512) || !strings(m.remaining, 8, 512))) throw new Error('Invalid workspace guide');
  return { catalog: c as Integration[], roadmap: r as Roadmap };
}
function observationPage(v: Record<string, unknown>, prior: ObservationState, older: boolean): ObservationState {
  if (!decimal(v.current_revision) || !decimal(v.through) || (v.next_before !== null && !decimal(v.next_before, true))
      || (older && (v.current_revision !== prior.revision || v.through !== prior.through))
      || !Array.isArray(v.entries) || v.entries.length > 25
      || v.entries.some((e: unknown) => !record(e) || !decimal(e.id, true) || !decimal(e.revision, true) || !timestamp(e.checked_at)
        || !providerError(e.error) || typeof e.complete !== 'boolean' || !Array.isArray(e.servers) || e.servers.length > 8
        || BigInt(e.id) > BigInt(v.through as string) || (older && BigInt(e.id) >= BigInt(prior.next!))
        || e.servers.some((s: unknown) => !record(s) || !field(s.name, 80, true) || !['running', 'stopped', 'unknown'].includes(String(s.state))
          || !providerCount(s.players) || !providerCount(s.capacity) || (s.collected_at !== null && !timestamp(s.collected_at))
          || (s.provider_at !== null && !timestamp(s.provider_at)) || !['fresh', 'stale', 'unknown'].includes(String(s.freshness)) || !providerError(s.error)))
      || v.entries.some((e, i) => i > 0 && BigInt(e.id) >= BigInt((v.entries as Observation[])[i - 1].id))
      || (v.next_before !== null && (v.entries.length !== 25 || v.next_before !== v.entries.at(-1)?.id))) throw new Error('Invalid observation history');
  return { phase: 'ready', entries: v.entries as Observation[], revision: v.current_revision as string, through: v.through as string, next: v.next_before as string | null, message: 'Retained provider observations checked.' };
}
const samePanels = (a: HomePanel[], b: HomePanel[]): boolean => a.length === b.length && a.every((p, i) => p.id === b[i].id && p.visible === b[i].visible);
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
    if (!record(c) || !decimal(c.revision) || typeof c.configured !== 'boolean' || !count(c.checked_at) || !message(c.error)
        || (c.history_error !== undefined && c.history_error !== null && c.history_error !== 'unavailable') || !Array.isArray(c.servers) || c.servers.length > 8
        || c.servers.some((s: unknown) => !record(s) || typeof s.name !== 'string' || s.name.length > 80 || typeof s.join !== 'string' || s.join.length > 253
          || !['running', 'stopped', 'unknown'].includes(String(s.state)) || !['fresh', 'stale', 'unknown'].includes(String(s.freshness))
          || !count(s.players) || !count(s.capacity) || !count(s.collected_at) || !count(s.provider_at) || !message(s.error))) throw new Error('Invalid connection response');
  }
  notifications(value.notifications);
  layout(value.layout);
  return value as unknown as Snapshot;
}
function stored(value: string | null): Draft | undefined {
  if (!value || value.length > 25000) return;
  try {
    const parsed: unknown = JSON.parse(value);
    if (record(parsed) && parsed.schema === 1 && text(parsed.body) && decimal(parsed.base)) return { body: parsed.body, base: parsed.base };
  } catch { /* Corrupt local drafts never grant authority or break the workspace. */ }
}

const mediaError = (v: unknown): v is string | null => v === null || (typeof v === 'string' && ['checking', 'unavailable', 'invalid_configuration', 'timeout', 'transport', 'denied', 'provider_error', 'oversized', 'malformed'].includes(v));
const boundedNumber = (v: unknown, max: number, min = 0): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= min && v <= max;
const mediaOffset = (v: unknown): v is number => boundedNumber(v, 48) && v % 12 === 0;
function agedMediaObservation(value: MediaObservation, at = Math.floor(Date.now() / 1000)): MediaObservation {
  const collected = value.checked_at;
  const freshness = !Number.isFinite(at) || at < 0 || collected === null || collected > at + 5 ? 'unknown'
    : value.freshness === 'fresh' && at - collected > 90 ? 'stale' : value.freshness;
  return freshness === value.freshness ? value : { ...value, freshness };
}
function mediaObservation(v: unknown, provider: MediaProvider, offset: number): MediaObservation {
  if (!record(v) || !decimal(v.revision) || typeof v.configured !== 'boolean' || !(v.checked_at === null || boundedNumber(v.checked_at, 253402300799))
      || !['fresh', 'stale', 'unknown'].includes(String(v.freshness)) || !mediaError(v.error) || typeof v.complete !== 'boolean'
      || v.offset !== offset || !mediaOffset(v.offset) || !(v.next_offset === null || (mediaOffset(v.next_offset) && v.next_offset === offset + 12))
      || !(v.total === null || boundedNumber(v.total, 1_000_000_000)) || typeof v.truncated !== 'boolean'
      || !Array.isArray(v.items) || v.items.length > 12 || new Set(v.items.map(i => record(i) ? i.id : null)).size !== v.items.length
      || v.items.some((i: unknown) => !record(i) || typeof i.id !== 'string' || !/^[a-f0-9]{64}$/.test(i.id)
        || !(i.title === null || field(i.title, 240, true)) || !['movie', 'series'].includes(String(i.kind))
        || !(i.year === null || boundedNumber(i.year, 9999, 1)) || !mediaError(i.detail_error)
        || (provider === 'jellyfin' ? i.request_status !== null : !['pending', 'approved', 'declined', 'failed', 'completed', 'unknown'].includes(String(i.request_status))))
      || (provider === 'seerr' ? v.playback !== null : !(v.playback === null || (record(v.playback)
        && (v.playback.playing === null || boundedNumber(v.playback.playing, 256)) && (v.playback.paused === null || boundedNumber(v.playback.paused, 256)) && mediaError(v.playback.error))))
      || (!v.configured && (v.items.length !== 0 || v.complete || v.checked_at !== null || v.next_offset !== null))) throw new Error('Invalid media response');
  const value = v as unknown as MediaObservation;
  // Keep only the current presentation contract. Extra provider or future
  // response fields cannot become private browser state through a broad cast.
  return agedMediaObservation({
    revision: value.revision, configured: value.configured, checked_at: value.checked_at,
    freshness: value.freshness, error: value.error, complete: value.complete,
    offset: value.offset, next_offset: value.next_offset, total: value.total, truncated: value.truncated,
    items: value.items.map(({ id, title, kind, year, request_status, detail_error }) => ({ id, title, kind, year, request_status, detail_error })),
    playback: value.playback === null ? null : { playing: value.playback.playing, paused: value.playback.paused, error: value.playback.error },
  });
}
export function workspace(binding: string) {
  const model = writable<Model>(empty('checking', 'Checking your workspace…'));
  let epoch = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let reading: AbortController | undefined;
  let saving: AbortController | undefined;
  let editing: AbortController | undefined;
  let historyReading: AbortController | undefined;
  let guideReading: AbortController | undefined;
  let observationsReading: AbortController | undefined;
  let marking: AbortController | undefined;
  let arranging: AbortController | undefined;
  let historySerial = 0;
  let guideSerial = 0;
  let observationsSerial = 0;
  let mediaActive = false;
  const mediaReading: Partial<Record<MediaProvider, AbortController>> = {};
  const mediaStatusReading: Partial<Record<MediaProvider, AbortController>> = {};
  const mediaSaving: Partial<Record<MediaProvider, AbortController>> = {};
  const mediaSerial: Record<MediaProvider, number> = { jellyfin: 0, seerr: 0 };
  const mediaStatusSerial: Record<MediaProvider, number> = { jellyfin: 0, seerr: 0 };
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
    ++epoch; mediaActive = false;
    for (const provider of mediaProviders) {
      ++mediaSerial[provider]; ++mediaStatusSerial[provider];
      mediaReading[provider]?.abort(); mediaStatusReading[provider]?.abort(); mediaSaving[provider]?.abort();
      delete mediaReading[provider]; delete mediaStatusReading[provider]; delete mediaSaving[provider];
    }
    if (timer) clearTimeout(timer);
    timer = undefined;
    reading?.abort(); saving?.abort(); reading = undefined; saving = undefined;
    editing?.abort(); editing = undefined;
    ++historySerial; historyReading?.abort(); historyReading = undefined;
    ++guideSerial; guideReading?.abort(); guideReading = undefined;
    ++observationsSerial; observationsReading?.abort(); observationsReading = undefined;
    marking?.abort(); marking = undefined;
    arranging?.abort(); arranging = undefined;
  }
  function invalidate(message: string, blocked = false): void {
    cancel(); terminal ||= blocked;
    flushSync(() => model.set(empty(blocked ? 'blocked' : 'paused', message)));
  }
  function schedule(): void {
    if (timer) clearTimeout(timer);
    if (!disposed && !terminal && state().phase === 'ready' && state().notificationSave !== 'uncertain' && state().layoutSave !== 'uncertain' && document.visibilityState === 'visible') {
      timer = setTimeout(() => { timer = undefined; ageMedia(); void read(); }, 15000);
    }
  }
  async function request(path: string, controller: AbortController, body?: unknown): Promise<{ status: number; value?: unknown }> {
    const started = performance.now();
    const deadline = setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch(path, {
        method: body ? 'PUT' : 'GET', credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal: controller.signal,
        headers: { 'X-Reborn-Product': PRODUCT, 'X-Reborn-Contract': CONTRACT, 'X-CSRF-Token': binding, ...(path === '/api/workspace/guide' ? { 'X-Reborn-Guide': 'media-v1' } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
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
  function scoped(value: unknown, captured: Snapshot): value is Record<string, unknown> {
    return record(value) && value.product === PRODUCT && value.contract === CONTRACT && value.schema === 1
      && record(value.account) && value.account.id === captured.account.id && value.account.username === captured.account.username
      && value.account.role === captured.account.role && value.session_generation === captured.session_generation;
  }
  function currentScope(captured: Snapshot): boolean {
    const s = state();
    return s.phase === 'ready' && !!s.snapshot && captured.account.id === s.snapshot.account.id
      && captured.account.username === s.snapshot.account.username && captured.account.role === s.snapshot.account.role
      && captured.session_generation === s.snapshot.session_generation;
  }
  function mergeCrafty(before: Model, incoming: Crafty | null | undefined, keepMatching = false): { crafty: Crafty | null | undefined; observations: ObservationState; changed: boolean } {
    const prior = before.snapshot?.crafty;
    // A note reply contains a waiting overview, not a new provider sample.
    // Keep a checked overview on matching revisions and never let a delayed
    // response move the browser back to an older enrollment scope.
    const crafty = !incoming ? prior ?? incoming : prior
      && (BigInt(incoming.revision) < BigInt(prior.revision) || (keepMatching && incoming.revision === prior.revision)) ? prior : incoming;
    if (prior?.revision === crafty?.revision) return { crafty, observations: before.observations, changed: false };
    ++observationsSerial; observationsReading?.abort(); observationsReading = undefined;
    return { crafty, observations: { ...emptyObservations(), message: 'Connection enrollment changed. Check newest observations for the current scope.' }, changed: true };
  }
  async function read(deliberate = false): Promise<void> {
    if (disposed || terminal || reading || saving || editing || marking || arranging || (!deliberate && state().layoutSave === 'uncertain') || document.visibilityState !== 'visible') return;
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
        const connection = mergeCrafty(before, next.crafty);
        const conflict = before.dirty && next.note.revision !== before.base;
        const layoutMatches = !!before.layoutDraft && samePanels(before.layoutDraft.panels, next.layout.panels);
        const layoutResolved = layoutMatches && deliberate && ['uncertain', 'checking-conflict'].includes(before.layoutSave);
        const layoutConflict = !!before.layoutDraft && !layoutResolved && before.layoutDraft.base !== next.layout.revision;
        const checked: Model = { ...before, snapshot: { ...next, crafty: connection.crafty },
          observations: connection.observations,
          layoutDraft: layoutResolved ? undefined : before.layoutDraft,
          layoutSave: layoutConflict ? 'conflict' : ['uncertain', 'checking-conflict'].includes(before.layoutSave) || layoutResolved ? 'idle' : before.layoutSave,
          layoutMessage: layoutResolved ? 'Saved layout checked. The current layout matches your changes.' : layoutConflict ? 'A newer layout was saved. Your arrangement is unchanged; compare before saving.' : before.layoutSave === 'uncertain' ? 'The saved layout was checked. Review your arrangement before saving deliberately.' : before.layoutMessage,
          draft: before.dirty ? before.draft : next.note.body,
          base: before.dirty ? before.base : next.note.revision,
          save: conflict ? 'conflict' : ['uncertain', 'checking-conflict'].includes(before.save) ? 'idle' : before.save,
          message: conflict ? 'A newer saved note is available. Your draft is unchanged.' : 'Workspace checked.',
          notificationSave: 'idle', notificationMessage: before.notificationSave === 'uncertain' ? 'Current read markers checked. Review newer changes before marking read.' : 'Notifications checked.',
          directorySave: before.directorySave === 'uncertain' ? 'idle' : before.directorySave,
          directoryMessage: before.directorySave === 'uncertain' ? 'Current saved directory and pins checked. Review them before making another change.' : before.directoryMessage };
        if (connection.changed) flushSync(() => model.set(checked)); else model.set(checked);
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
      if (mediaActive && state().snapshot?.account.role === 'owner') {
        for (const provider of mediaProviders) {
          const pending = state().media[provider].observation;
          if (pending?.error === 'checking' && !mediaReading[provider] && !mediaSaving[provider]) void loadMedia(provider, pending.offset);
        }
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
    if (s.phase !== 'ready' || !s.dirty || !text(s.draft) || ['conflict', 'checking-conflict', 'uncertain'].includes(s.save) || saving || marking || arranging || s.layoutSave === 'checking-conflict') return;
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
        const before = state(), connection = mergeCrafty(before, next.crafty, true);
        const saved: Model = { ...before, snapshot: { ...next, crafty: connection.crafty, directory: before.snapshot?.directory ?? next.directory, notifications: before.snapshot?.notifications ?? next.notifications, layout: before.snapshot?.layout ?? next.layout }, observations: connection.observations, base: next.note.revision, dirty: before.draft !== next.note.body,
          save: 'saved', message: before.draft === next.note.body ? 'Saved to your account.' : 'Submitted version saved. Your newer edits are still unsaved.' };
        if (connection.changed) flushSync(() => model.set(saved)); else model.set(saved);
        persist();
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
    if (s.phase !== 'ready' || !s.snapshot || editing || marking || arranging || s.layoutSave === 'checking-conflict' || s.directorySave === 'uncertain') return false;
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
  async function markNotification(category: string, through: string): Promise<void> {
    const s = state();
    if (disposed || terminal || s.phase !== 'ready' || !s.snapshot || marking || saving || editing || arranging || s.layoutSave === 'checking-conflict' || s.notificationSave !== 'idle'
        || !['services', 'connections'].includes(category) || !decimal(through, true)) return;
    reading?.abort(); reading = undefined;
    if (timer) clearTimeout(timer); timer = undefined;
    const controller = new AbortController(); marking = controller; const current = epoch;
    model.update(m => ({ ...m, notificationSave: 'saving', notificationMessage: 'Saving your read marker…' }));
    try {
      const response = await request('/api/workspace/notifications/read', controller, { category, through });
      if (disposed || controller.signal.aborted || current !== epoch) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) throw new Error('Read watermark changed');
      const v = response.value;
      if (response.status !== 200 || !record(v)) throw new Error('Read marker unavailable');
      if (v.product !== PRODUCT || v.contract !== CONTRACT || v.schema !== 1 || !record(v.account)
          || v.account.id !== s.snapshot.account.id || v.account.username !== s.snapshot.account.username
          || v.account.role !== s.snapshot.account.role || v.session_generation !== s.snapshot.session_generation) {
        invalidate('Your account scope changed. Open a fresh workspace.', true); return;
      }
      const next = notifications(v.notifications);
      const group = next.groups.find(g => g.category === category);
      if (!group || BigInt(group.read_through) < BigInt(through)) throw new Error('Unqualified read marker');
      model.update(m => ({ ...m, snapshot: m.snapshot ? { ...m.snapshot, notifications: next } : undefined, notificationSave: 'idle', notificationMessage: 'Read marker saved. Newer changes remain unread.' }));
    } catch {
      if (marking === controller && current === epoch && !disposed) model.update(m => ({ ...m, notificationSave: 'uncertain', notificationMessage: 'The read marker may have saved. Check notifications to see the current state.' }));
    } finally {
      if (marking === controller) marking = undefined;
      if (current === epoch && !disposed) schedule();
    }
  }

  function beginLayout(): void {
    const s = state();
    if (s.phase !== 'ready' || !s.snapshot || s.layoutDraft || saving || editing || marking || arranging) return;
    reading?.abort(); reading = undefined;
    if (timer) clearTimeout(timer); timer = undefined;
    model.set({ ...s, layoutDraft: { base: s.snapshot.layout.revision, panels: s.snapshot.layout.panels.map(p => ({ ...p })) }, layoutSave: 'idle', layoutMessage: 'Arrange your Home panels, then save to your account.' });
    schedule();
  }
  function changeLayout(panels: HomePanel[]): void {
    const s = state();
    if (s.phase !== 'ready' || !s.layoutDraft || ['saving', 'checking-conflict', 'uncertain'].includes(s.layoutSave)) return;
    model.set({ ...s, layoutDraft: { ...s.layoutDraft, panels }, layoutMessage: 'Your arrangement is unsaved.' });
  }
  function moveLayout(id: HomePanel['id'], offset: -1 | 1): void {
    const panels = state().layoutDraft?.panels.map(p => ({ ...p })); if (!panels) return;
    const index = panels.findIndex(p => p.id === id), next = index + offset;
    if (index < 0 || next < 0 || next >= panels.length) return;
    [panels[index], panels[next]] = [panels[next], panels[index]]; changeLayout(panels);
  }
  function toggleLayout(id: HomePanel['id']): void {
    const panels = state().layoutDraft?.panels.map(p => ({ ...p })); if (!panels) return;
    const panel = panels.find(p => p.id === id); if (!panel || (panel.visible && panels.filter(p => p.visible).length === 1)) return;
    panel.visible = !panel.visible; changeLayout(panels);
  }
  function resetLayout(): void { changeLayout(defaultPanels()); }
  function cancelLayout(): void {
    const s = state();
    if (s.phase !== 'ready' || ['saving', 'checking-conflict', 'uncertain'].includes(s.layoutSave)) return;
    model.set({ ...s, layoutDraft: undefined, layoutSave: 'idle', layoutMessage: 'Your saved Home layout is in use.' }); schedule();
  }
  function resolveLayout(useSaved: boolean): void {
    const s = state(); if (s.phase !== 'ready' || !s.snapshot || !s.layoutDraft || s.layoutSave !== 'conflict') return;
    if (useSaved) { cancelLayout(); return; }
    model.set({ ...s, layoutDraft: { ...s.layoutDraft, base: s.snapshot.layout.revision }, layoutSave: 'idle', layoutMessage: 'Your arrangement is kept against the checked saved layout. Review, then save deliberately.' });
  }
  async function saveLayout(): Promise<void> {
    const s = state();
    if (disposed || terminal || s.phase !== 'ready' || !s.snapshot || !s.layoutDraft || s.layoutSave !== 'idle' || saving || editing || marking || arranging) return;
    const submitted = { base: s.layoutDraft.base, panels: s.layoutDraft.panels.map(p => ({ ...p })) };
    if (!submitted.panels.some(p => p.visible) || samePanels(submitted.panels, s.snapshot.layout.panels)) return;
    reading?.abort(); reading = undefined;
    if (timer) clearTimeout(timer); timer = undefined;
    const controller = new AbortController(); arranging = controller; const current = epoch;
    model.update(m => ({ ...m, layoutSave: 'saving', layoutMessage: 'Saving your Home layout…' }));
    let conflict = false;
    try {
      const response = await request('/api/workspace/layout', controller, { base_revision: submitted.base, panels: submitted.panels });
      if (disposed || controller.signal.aborted || current !== epoch) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) {
        conflict = true;
        model.update(m => ({ ...m, layoutSave: 'checking-conflict', layoutMessage: 'Another layout was saved first. Checking the saved arrangement before comparing; your changes are unchanged.' }));
      } else if ([400, 413, 429].includes(response.status)) {
        model.update(m => ({ ...m, layoutSave: 'idle', layoutMessage: 'The layout was not accepted. Keep at least one panel visible and review your changes.' }));
      } else {
        const v = response.value;
        if (response.status !== 200 || !record(v)) throw new Error('Layout unavailable');
        if (v.product !== PRODUCT || v.contract !== CONTRACT || v.schema !== 1 || !record(v.account)
            || v.account.id !== s.snapshot.account.id || v.account.username !== s.snapshot.account.username
            || v.account.role !== s.snapshot.account.role || v.session_generation !== s.snapshot.session_generation) {
          invalidate('Your account scope changed. Open a fresh workspace.', true); return;
        }
        const next = layout(v.layout);
        if (BigInt(next.revision) !== BigInt(submitted.base) + 1n || !samePanels(next.panels, submitted.panels)) throw new Error('Unqualified layout result');
        model.update(m => ({ ...m, snapshot: m.snapshot ? { ...m.snapshot, layout: next } : undefined, layoutDraft: undefined, layoutSave: 'idle', layoutMessage: 'Layout saved to your account.' }));
      }
    } catch {
      if (arranging === controller && current === epoch && !disposed) model.update(m => ({ ...m, layoutSave: 'uncertain', layoutMessage: 'The layout may have saved. Check the saved layout before saving again; your changes have not been sent again.' }));
    } finally {
      if (arranging === controller) arranging = undefined;
      if (current === epoch && !disposed) { if (conflict) await read(true); else schedule(); }
    }
  }
  async function activity(category = state().activity.category, query = state().activity.query, older = false): Promise<void> {
    const s = state();
    if (disposed || terminal || s.phase !== 'ready' || !s.snapshot || document.visibilityState !== 'visible') return;
    historyReading?.abort();
    const controller = new AbortController(); historyReading = controller;
    const serial = ++historySerial, current = epoch;
    const prior = s.activity;
    const params = new URLSearchParams({ category, q: query });
    if (older) {
      if (!prior.next || prior.category !== category || prior.query !== query) return;
      params.set('through', prior.through); params.set('before', prior.next);
    }
    model.update(m => ({ ...m, activity: { ...emptyActivity(), phase: 'loading', category, query, message: 'Checking your retained activity…' } }));
    try {
      const response = await request(`/api/workspace/activity?${params}`, controller);
      if (disposed || controller.signal.aborted || serial !== historySerial || current !== epoch) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      const v = response.value;
      if (response.status !== 200 || !record(v) || v.product !== PRODUCT || v.contract !== CONTRACT || v.schema !== 1
          || !record(v.account) || v.account.id !== s.snapshot.account.id || v.account.role !== s.snapshot.account.role || v.account.username !== s.snapshot.account.username
          || v.session_generation !== s.snapshot.session_generation) {
        if (response.status === 200) { invalidate('Your account scope changed. Open a fresh workspace.', true); return; }
        throw new Error('Activity unavailable');
      }
      const categories = ['workspace', 'directory', 'connections'];
      const kinds = ['note_saved', 'pins_saved', 'service_added', 'service_updated', 'service_removed', 'connection_saved', 'connection_removed'];
      if (v.category !== category || v.q !== query || !decimal(v.through) || (v.next_before !== null && !decimal(v.next_before, true))
          || (older && v.through !== prior.through) || !Array.isArray(v.entries) || v.entries.length > 25
          || v.entries.some((e: unknown) => !record(e) || !decimal(e.id, true) || !decimal(e.revision, true) || !decimal(e.occurred_at)
            || BigInt(e.occurred_at) > 253402300799n || !kinds.includes(String(e.kind)) || !categories.includes(String(e.category))
            || typeof e.label !== 'string' || !/^[A-Za-z ]{1,64}$/.test(e.label) || BigInt(e.id) > BigInt(v.through as string)
            || (older && BigInt(e.id) >= BigInt(prior.next!)))
          || v.entries.some((e, i) => i > 0 && BigInt(e.id) >= BigInt((v.entries as ActivityEntry[])[i - 1].id))
          || (v.next_before !== null && (v.entries.length !== 25 || v.next_before !== v.entries.at(-1)?.id))) throw new Error('Invalid activity response');
      model.update(m => ({ ...m, activity: { phase: 'ready', category, query, entries: v.entries as ActivityEntry[], through: v.through as string, next: v.next_before as string | null, message: 'Retained activity checked.' } }));
    } catch {
      if (!disposed && serial === historySerial && current === epoch) model.update(m => ({ ...m, activity: { ...emptyActivity(), phase: 'error', category, query, message: 'Activity could not be checked. Retry deliberately; other workspace views remain available.' } }));
    } finally { if (historyReading === controller) historyReading = undefined; }
  }
  async function loadGuide(force = false): Promise<void> {
    const s = state();
    if (disposed || terminal || s.phase !== 'ready' || !s.snapshot || document.visibilityState !== 'visible' || guideReading || (!force && s.guide.phase === 'ready')) return;
    const captured = s.snapshot, controller = new AbortController(); guideReading = controller;
    const serial = ++guideSerial, current = epoch;
    model.update(m => ({ ...m, guide: { phase: 'loading', message: 'Checking the workspace guide…' } }));
    try {
      const response = await request('/api/workspace/guide', controller);
      if (disposed || controller.signal.aborted || serial !== guideSerial || current !== epoch || !currentScope(captured)) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status !== 200) throw new Error('Guide unavailable');
      if (!scoped(response.value, captured)) { invalidate('Your account scope changed. Open a fresh workspace.', true); return; }
      const value = parseGuide(response.value);
      model.update(m => ({ ...m, guide: { phase: 'ready', value, message: 'Workspace guide checked.' } }));
    } catch {
      if (!disposed && serial === guideSerial && current === epoch && currentScope(captured)) model.update(m => ({ ...m, guide: { phase: 'error', message: 'The workspace guide could not be checked. Retry deliberately; your private note is unchanged.' } }));
    } finally { if (guideReading === controller) guideReading = undefined; }
  }
  async function observations(older = false): Promise<void> {
    const s = state();
    if (disposed || terminal || s.phase !== 'ready' || !s.snapshot || document.visibilityState !== 'visible') return;
    const prior = s.observations;
    if (older && (!prior.next || prior.phase !== 'ready' || prior.revision !== s.snapshot.crafty?.revision)) return;
    observationsReading?.abort();
    const captured = s.snapshot, controller = new AbortController(); observationsReading = controller;
    const serial = ++observationsSerial, current = epoch;
    const params = new URLSearchParams();
    if (older) { params.set('revision', prior.revision); params.set('through', prior.through); params.set('before', prior.next!); }
    model.update(m => ({ ...m, observations: { ...emptyObservations(), phase: 'loading', message: 'Checking retained provider observations…' } }));
    try {
      const response = await request(`/api/workspace/observations${older ? `?${params}` : ''}`, controller);
      if (disposed || controller.signal.aborted || serial !== observationsSerial || current !== epoch || !currentScope(captured)) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) {
        model.update(m => ({ ...m, observations: { ...emptyObservations(), phase: 'error', message: 'Connection enrollment changed. Check the current connection, then check newest observations.' } })); return;
      }
      if (response.status !== 200) throw new Error('Observation history unavailable');
      if (!scoped(response.value, captured)) { invalidate('Your account scope changed. Open a fresh workspace.', true); return; }
      const next = observationPage(response.value, prior, older);
      if (next.revision !== captured.crafty?.revision || next.revision !== state().snapshot?.crafty?.revision) {
        model.update(m => ({ ...m, observations: { ...emptyObservations(), phase: 'error', message: 'Connection enrollment changed. Check the current connection, then check newest observations.' } })); return;
      }
      if (captured.account.role === 'member' && next.entries.some(e => e.revision !== next.revision)) throw new Error('Observation revision outside member scope');
      model.update(m => ({ ...m, observations: next }));
    } catch {
      if (!disposed && serial === observationsSerial && current === epoch && currentScope(captured)) model.update(m => ({ ...m, observations: { ...emptyObservations(), phase: 'error', message: 'Provider history could not be checked. Retry deliberately; current connections remain available.' } }));
    } finally { if (observationsReading === controller) observationsReading = undefined; }
  }
  function ageMedia(): void {
    const current = state();
    if (disposed || terminal || current.phase !== 'ready') return;
    const at = Math.floor(Date.now() / 1000);
    let changed = false;
    const media = { ...current.media };
    for (const provider of mediaProviders) {
      const observation = media[provider].observation;
      if (!observation) continue;
      const aged = agedMediaObservation(observation, at);
      if (aged !== observation) { changed = true; media[provider] = { ...media[provider], observation: aged }; }
    }
    // Age only the already-held presentation on the existing scheduler tick.
    // No provider request, new timer or promotion from stale back to fresh.
    if (changed) model.set({ ...current, media });
  }
  function setMedia(provider: MediaProvider, value: MediaState, flush = false): void {
    const update = () => model.update(m => ({ ...m, media: { ...m.media, [provider]: value } }));
    if (flush) flushSync(update); else update();
  }
  function ownerSnapshot(): Snapshot | undefined {
    const s = state();
    return !disposed && !terminal && s.phase === 'ready' && s.snapshot?.account.role === 'owner' && document.visibilityState === 'visible' ? s.snapshot : undefined;
  }
  function clearMediaRead(provider: MediaProvider): void {
    ++mediaSerial[provider]; mediaReading[provider]?.abort(); delete mediaReading[provider];
  }
  function closeMedia(): void {
    mediaActive = false;
    for (const provider of mediaProviders) {
      clearMediaRead(provider); ++mediaStatusSerial[provider]; mediaStatusReading[provider]?.abort(); delete mediaStatusReading[provider];
      const prior = state().media[provider], savingNow = !!mediaSaving[provider];
      mediaSaving[provider]?.abort(); delete mediaSaving[provider];
      setMedia(provider, { phase: 'idle', save: savingNow ? 'uncertain' : prior.save, message: savingNow ? 'The save may have completed. Check the connection state before another change.' : prior.save === 'uncertain' || prior.save === 'conflict' ? prior.message : '' }, true);
    }
  }
  async function checkMedia(provider: MediaProvider, observe = true): Promise<void> {
    const captured = ownerSnapshot(); if (!captured || mediaSaving[provider]) return;
    mediaActive = true; clearMediaRead(provider);
    mediaStatusReading[provider]?.abort();
    const controller = new AbortController(); mediaStatusReading[provider] = controller;
    const serial = ++mediaStatusSerial[provider], current = epoch, prior = state().media[provider];
    setMedia(provider, { ...prior, phase: 'loading', observation: undefined, message: 'Checking the current enrollment…' }, true);
    try {
      const response = await request(`/api/owner/media/${provider}`, controller);
      if (disposed || controller.signal.aborted || serial !== mediaStatusSerial[provider] || current !== epoch || !currentScope(captured)) return;
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      const value = response.value;
      if (response.status !== 200 || !record(value) || !decimal(value.revision) || typeof value.configured !== 'boolean') throw new Error('Media enrollment unavailable');
      const existing = state().media[provider].status;
      if (existing && BigInt(value.revision) < BigInt(existing.revision)) throw new Error('Older enrollment reply');
      setMedia(provider, { phase: 'ready', status: { revision: value.revision, configured: value.configured }, save: 'idle', message: value.configured ? 'Enrollment checked. Only observation requests are sent.' : 'No connection is enrolled.' }, true);
      if (observe && value.configured) await loadMedia(provider);
    } catch {
      if (!disposed && serial === mediaStatusSerial[provider] && current === epoch && currentScope(captured)) {
        const latest = state().media[provider];
        setMedia(provider, { ...latest, phase: 'error', observation: undefined, message: 'The connection state could not be checked. Retry deliberately before entering credentials.' }, true);
      }
    } finally { if (mediaStatusReading[provider] === controller) delete mediaStatusReading[provider]; }
  }
  async function openMedia(): Promise<void> {
    if (!ownerSnapshot()) return;
    mediaActive = true; await Promise.all(mediaProviders.map(provider => checkMedia(provider)));
  }
  async function loadMedia(provider: MediaProvider, offset = 0): Promise<void> {
    const captured = ownerSnapshot(); if (!captured || !mediaOffset(offset) || mediaSaving[provider]) return;
    mediaActive = true; clearMediaRead(provider);
    const controller = new AbortController(); mediaReading[provider] = controller;
    const serial = mediaSerial[provider], current = epoch, prior = state().media[provider];
    setMedia(provider, { ...prior, phase: 'loading', observation: undefined, message: 'Checking sampled media observations…' }, true);
    try {
      const response = await request(`/api/workspace/media/${provider}?offset=${offset}`, controller);
      if (disposed || controller.signal.aborted || serial !== mediaSerial[provider] || current !== epoch || !currentScope(captured)) return;
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) {
        clearMediaRead(provider);
        setMedia(provider, { phase: 'error', save: prior.save, message: 'Enrollment changed. Check the connection state before reading its new scope.' }, true); return;
      }
      if (response.status !== 200) throw new Error('Media unavailable');
      if (!scoped(response.value, captured)) { invalidate('Your account scope changed. Open a fresh workspace.', true); return; }
      if (response.value.provider !== provider) throw new Error('Wrong media provider');
      const observation = mediaObservation(response.value.observation, provider, offset), status = state().media[provider].status;
      if (status && BigInt(observation.revision) < BigInt(status.revision)) throw new Error('Older media scope');
      // A separately opened tab can replace enrollment. The current response is
      // authorized by Rust; abort any older status reply before adopting scope.
      if (status?.revision !== observation.revision) { ++mediaStatusSerial[provider]; mediaStatusReading[provider]?.abort(); delete mediaStatusReading[provider]; }
      const message = !observation.configured ? 'No connection is enrolled.' : observation.error === 'checking' ? 'A sample is being collected. Check observations again, or wait for the existing workspace access check.'
        : observation.error ? 'This provider sample is unavailable or incomplete. Unknown values stay unknown.' : observation.complete ? 'Media observations checked.' : 'A partial media sample is available; some details are unknown.';
      setMedia(provider, { phase: 'ready', status: { revision: observation.revision, configured: observation.configured }, observation, save: state().media[provider].save, message }, true);
    } catch {
      if (!disposed && serial === mediaSerial[provider] && current === epoch && currentScope(captured)) setMedia(provider, { ...state().media[provider], phase: 'error', observation: undefined, message: 'Media observations could not be checked. Retry deliberately; your workspace note is unchanged.' }, true);
    } finally { if (mediaReading[provider] === controller) delete mediaReading[provider]; }
  }
  async function saveMedia(provider: MediaProvider, base: string, connection: MediaEnrollment | null): Promise<void> {
    const captured = ownerSnapshot(), prior = state().media[provider];
    if (!captured || mediaSaving[provider] || prior.phase !== 'ready' || prior.save !== 'idle' || prior.status?.revision !== base || !decimal(base)) return;
    mediaActive = true; clearMediaRead(provider); ++mediaStatusSerial[provider]; mediaStatusReading[provider]?.abort(); delete mediaStatusReading[provider];
    const controller = new AbortController(); mediaSaving[provider] = controller;
    const current = epoch;
    setMedia(provider, { ...prior, observation: undefined, save: 'saving', message: connection ? 'Saving the dedicated connection…' : 'Removing the connection…' }, true);
    try {
      const response = await request(`/api/owner/media/${provider}`, controller, { base_revision: base, connection });
      if (disposed || controller.signal.aborted || current !== epoch || !currentScope(captured) || mediaSaving[provider] !== controller) return;
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) { setMedia(provider, { phase: 'error', save: 'conflict', message: 'The connection changed elsewhere. Check its current state before enrolling again.' }, true); return; }
      if ([400, 413, 429].includes(response.status)) { setMedia(provider, { ...prior, observation: undefined, save: 'idle', message: 'Connection not accepted. Check the address, library, certificate and broad-access acknowledgement.' }, true); return; }
      const value = response.value;
      if (response.status !== 200 || !record(value) || !decimal(value.revision, true) || BigInt(value.revision) !== BigInt(base) + 1n || value.configured !== (connection !== null)) throw new Error('Uncertain media save');
      setMedia(provider, { phase: 'ready', status: { revision: value.revision, configured: value.configured as boolean }, save: 'idle', message: connection ? 'Connection saved. Check its observations.' : 'Connection removed.' }, true);
    } catch {
      if (!disposed && current === epoch && currentScope(captured) && mediaSaving[provider] === controller) setMedia(provider, { phase: 'error', save: 'uncertain', message: 'The save may have completed. Check the connection state before entering credentials again.' }, true);
    } finally { if (mediaSaving[provider] === controller) delete mediaSaving[provider]; }
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
  return { model, start, edit, recover, resolve, save, signOut, check: () => read(true), editService, pins, activity, markNotification, beginLayout, moveLayout, toggleLayout, resetLayout, cancelLayout, resolveLayout, saveLayout, checkLayout: () => read(true), loadGuide, observations, openMedia, closeMedia, checkMedia, loadMedia, saveMedia };
}
