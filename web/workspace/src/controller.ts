import { writable, get } from 'svelte/store';
import { flushSync } from 'svelte';
import { refresh, type AccessScope } from './refresh';
import { tileController, type TileId } from './tiles';
const PRODUCT = 'keida-hub-reborn';
const CONTRACT = 'reborn-workspace-v1';
const MAX_REVISION = 9223372036854775807n;
type Note = { body: string; revision: string };
export type GameStatus = { source: 'join-gateway-v1'; state: 'sleeping' | 'starting' | 'updating' | 'online' | 'unavailable'; checked_at: number; freshness: 'fresh' | 'stale'; players: number | null; capacity: number | null; error: string | null };
export type GamesValue = { revision: string; configured: boolean; checking: boolean; servers: Array<{ name: string; join: string; gateway: GameStatus | null }> };
export type GamesState = { phase: 'idle' | 'loading' | 'ready' | 'error'; value?: GamesValue; message: string };
const emptyGames = (): GamesState => ({ phase: 'idle', message: '' });
export type Crafty = { revision: string; configured: boolean; checked_at: number | null; error: string | null; history_error?: 'unavailable' | null; servers: Array<{ name: string; join: string; state: string; players: number | null; capacity: number | null; collected_at: number | null; provider_at: number | null; freshness: string; error: string | null }> };
export type ServiceLink = { id: string; name: string; category: string; description: string; url: string };
export type Directory = { revision: string; services: ServiceLink[]; pins_revision: string; pins: string[] };
export type HomePanel = { id: 'note' | 'connections' | 'pins'; visible: boolean };
export type Layout = { revision: string; panels: HomePanel[] };
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
export type QueueProvider = 'sonarr' | 'radarr' | 'qbittorrent';
export type QueueEnrollment = { endpoint: string; token: string; ca_pem: string; profile: string; acknowledge_broad_access: boolean };
export type QueueItem = { id: string; title: string | null; status: string; import_state: string | null; warning: boolean | null; progress_basis_points: number | null; size_bytes: number | null; download_bytes_per_second: number | null; upload_bytes_per_second: number | null };
export type QueueObservation = { revision: string; configured: boolean; profile: string; checked_at: number | null; freshness: 'fresh' | 'stale' | 'unknown'; error: string | null; complete: boolean; offset: number; next_offset: number | null; total: number | null; truncated: boolean; items: QueueItem[] };
export type QueueState = { phase: 'idle' | 'loading' | 'ready' | 'error'; status?: { revision: string; configured: boolean; profile: string }; observation?: QueueObservation; offset: number; save: 'idle' | 'saving' | 'conflict' | 'uncertain'; message: string };
const queueProviders: QueueProvider[] = ['sonarr', 'radarr', 'qbittorrent'];
export const queueProfiles: Record<QueueProvider, string> = { sonarr: 'sonarr-v3', radarr: 'radarr-v3', qbittorrent: 'qbittorrent-v2-key' };
const emptyQueue = (): QueueState => ({ phase: 'idle', offset: 0, save: 'idle', message: '' });
const emptyQueues = (): Record<QueueProvider, QueueState> => ({ sonarr: emptyQueue(), radarr: emptyQueue(), qbittorrent: emptyQueue() });
export type DiscordApplication = { client_id: string; client_secret: string; callback_logging_reviewed: boolean };
export type DiscordIdentity = { id: string; display_name: string };
export type DiscordValue = {
  application: { configured: boolean; revision: string; callback_uri: string; profile: 'discord-identify-v1' };
  link: { revision: string; flow_generation: string; identity: (DiscordIdentity & { verified_at: string }) | null };
  attempt: { phase: 'none' | 'awaiting_discord' | 'ready_to_review' | 'reviewing' | 'review_ready' | 'cancelled' | 'failed' | 'restart_required'; candidate: DiscordIdentity | null; cleanup: null | 'acknowledged' | 'unconfirmed'; error: string | null };
};
export type IdentityState = { phase: 'idle' | 'loading' | 'ready' | 'error'; value?: DiscordValue; save: 'idle' | 'saving' | 'conflict' | 'uncertain'; message: string };
export type IdentityAction = 'review' | 'confirm' | 'cancel' | 'unlink';
const emptyIdentity = (): IdentityState => ({ phase: 'idle', save: 'idle', message: '' });
export type SignInSession = { id: string; created_at: string; expires_at: string; current: boolean };
export type SessionList = { checked_at: string; sessions: SignInSession[] };
export type SessionsState = { phase: 'idle' | 'loading' | 'ready' | 'error'; value?: SessionList; save: 'idle' | 'saving' | 'conflict' | 'uncertain'; message: string };
const emptySessions = (): SessionsState => ({ phase: 'idle', save: 'idle', message: '' });
export type Model = {
  phase: 'checking' | 'ready' | 'paused' | 'blocked'; message: string;
  snapshot?: Snapshot; draft: string; base: string; dirty: boolean;
  save: 'idle' | 'saving' | 'saved' | 'checking-conflict' | 'conflict' | 'uncertain'; recovery?: Draft;
  storageLimited: boolean; activity: Activity;
  notificationSave: 'idle' | 'saving' | 'uncertain'; notificationMessage: string;
  directorySave: 'idle' | 'saving' | 'conflict' | 'uncertain'; directoryMessage: string;
  guide: GuideState; games: GamesState; observations: ObservationState; media: Record<MediaProvider, MediaState>; queues: Record<QueueProvider, QueueState>; identity: IdentityState; sessions: SessionsState;
};
const empty = (phase: Model['phase'], message: string): Model => ({ phase, message, draft: '', base: '0', dirty: false, save: 'idle', storageLimited: false, directorySave: 'idle', directoryMessage: '', activity: emptyActivity(), notificationSave: 'idle', notificationMessage: '', guide: emptyGuide(), games: emptyGames(), observations: emptyObservations(), media: emptyMedia(), queues: emptyQueues(), identity: emptyIdentity(), sessions: emptySessions() });
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
        || i.status !== (['crafty', 'jellyfin', 'seerr', 'sonarr', 'radarr', 'qbittorrent'].includes(String(i.id)) ? 'available' : 'planned') || !field(i.summary, 512, true)
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
const discordId = (v: unknown): v is string => typeof v === 'string' && /^[1-9][0-9]{0,19}$/.test(v) && BigInt(v) <= 18446744073709551615n;
const discordName = (v: unknown): v is string => field(v, 320) && v.length > 0 && Array.from(v).length <= 80
  && !/^[\u0009-\u000d\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+$/u.test(v)
  && !/[\u0080-\u009f\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/u.test(v);
const discordIdentity = (v: unknown): v is DiscordIdentity => record(v) && discordId(v.id) && discordName(v.display_name);
const discordErrors = ['denied', 'invalid_response', 'timeout', 'transport', 'provider_error', 'unavailable', 'restart_required'];
function discordValue(v: Record<string, unknown>): DiscordValue {
  const a = v.application, l = v.link, t = v.attempt;
  if (!record(a) || typeof a.configured !== 'boolean' || !decimal(a.revision) || a.profile !== 'discord-identify-v1'
      || a.callback_uri !== `${window.location.origin}/account/discord/callback`
      || !record(l) || !decimal(l.revision) || !decimal(l.flow_generation)
      || !(l.identity === null || (record(l.identity) && timestamp(l.identity.verified_at) && discordIdentity(l.identity)))
      || !record(t) || !['none', 'awaiting_discord', 'ready_to_review', 'reviewing', 'review_ready', 'cancelled', 'failed', 'restart_required'].includes(String(t.phase))
      || !(t.candidate === null || discordIdentity(t.candidate))
      || !(t.cleanup === null || t.cleanup === 'acknowledged' || t.cleanup === 'unconfirmed')
      || !(t.error === null || (typeof t.error === 'string' && discordErrors.includes(t.error)))
      || (t.candidate !== null && t.phase !== 'review_ready') || (t.phase === 'review_ready' && t.candidate === null)
      || (l.identity !== null && t.candidate !== null)) throw new Error('Invalid identity response');
  // Retain only the declared fields, never an unexpected provider payload.
  return { application: { configured: a.configured, revision: a.revision, callback_uri: a.callback_uri as string, profile: 'discord-identify-v1' },
    link: { revision: l.revision, flow_generation: l.flow_generation, identity: l.identity === null ? null : { id: (l.identity as DiscordIdentity).id, display_name: (l.identity as DiscordIdentity).display_name, verified_at: (l.identity as DiscordIdentity & { verified_at: string }).verified_at } },
    attempt: { phase: t.phase as DiscordValue['attempt']['phase'], candidate: t.candidate === null ? null : { id: (t.candidate as DiscordIdentity).id, display_name: (t.candidate as DiscordIdentity).display_name },
      cleanup: t.cleanup as DiscordValue['attempt']['cleanup'], error: t.error as string | null } };
}
const identityMessage = (value: DiscordValue): string => value.attempt.phase === 'review_ready' ? 'Review the Discord identity below, then confirm deliberately.'
  : value.attempt.phase === 'ready_to_review' ? 'Discord returned. Review the identity before choosing whether to link it.'
  : value.attempt.phase === 'awaiting_discord' ? 'Continue with Discord in this browser, or cancel this unfinished link.'
  : value.attempt.phase === 'reviewing' ? 'The identity review is still in progress. Check status before another action.'
  : ['failed', 'restart_required'].includes(value.attempt.phase) ? 'The unfinished link could not be completed. Start a new link when ready.'
  : value.attempt.phase === 'cancelled' ? 'The unfinished link was cancelled.'
  : value.link.identity ? 'Your saved Discord identity is shown below.' : value.application.configured ? 'No Discord identity is linked. You can start a link when ready.' : 'Discord linking is waiting for owner setup.';
const sessionId = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(v);
function sessionList(v: Record<string, unknown>): SessionList {
  if (!timestamp(v.checked_at) || !Array.isArray(v.sessions) || v.sessions.length < 1 || v.sessions.length > 32
      || v.sessions.some((r: unknown) => !record(r) || !sessionId(r.id) || !timestamp(r.created_at) || !timestamp(r.expires_at) || typeof r.current !== 'boolean'
        || BigInt(r.expires_at) <= BigInt(v.checked_at as string) || BigInt(r.expires_at) <= BigInt(r.created_at))
      || new Set(v.sessions.map(r => r.id)).size !== v.sessions.length || v.sessions.filter(r => r.current === true).length !== 1
      || v.sessions.some((r, index, rows) => index > 0 && (BigInt(r.created_at) > BigInt(rows[index - 1].created_at)
        || (r.created_at === rows[index - 1].created_at && r.id >= rows[index - 1].id)))) throw new Error('Invalid session list');
  // Project the declared non-bearer selectors and times only. No unexpected
  // provider, credential or device metadata becomes retained browser state.
  return { checked_at: v.checked_at, sessions: v.sessions.map(r => ({ id: r.id as string, created_at: r.created_at as string, expires_at: r.expires_at as string, current: r.current as boolean })) };
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
    if (!record(c) || !decimal(c.revision) || typeof c.configured !== 'boolean' || !count(c.checked_at) || !message(c.error)
        || (c.history_error !== undefined && c.history_error !== null && c.history_error !== 'unavailable') || !Array.isArray(c.servers) || c.servers.length > 8
        || c.servers.some((s: unknown) => !record(s) || typeof s.name !== 'string' || s.name.length > 80 || typeof s.join !== 'string' || s.join.length > 253
          || !['running', 'stopped', 'unknown'].includes(String(s.state)) || !['fresh', 'stale', 'unknown'].includes(String(s.freshness))
          || !count(s.players) || !count(s.capacity) || !count(s.collected_at) || !count(s.provider_at) || !message(s.error)))) throw new Error('Invalid connection response');
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
function gamesValue(v: Record<string, unknown>): GamesValue {
  if (!decimal(v.revision) || typeof v.configured !== 'boolean' || typeof v.checking !== 'boolean'
      || !Array.isArray(v.servers) || v.servers.length > 8 || (!v.configured && v.servers.length !== 0)
      || v.servers.some((s: unknown) => !record(s) || !field(s.name, 80, true) || !field(s.join, 259)
        || (s.gateway !== null && (!record(s.gateway) || s.gateway.source !== 'join-gateway-v1'
          || !['sleeping', 'starting', 'updating', 'online', 'unavailable'].includes(String(s.gateway.state))
          || !['fresh', 'stale'].includes(String(s.gateway.freshness)) || !boundedNumber(s.gateway.checked_at, 253402300799)
          || !providerCount(s.gateway.players) || !providerCount(s.gateway.capacity) || !providerError(s.gateway.error)
          || (s.gateway.state !== 'online' && (s.gateway.players !== null || s.gateway.capacity !== null)))))) throw new Error('Invalid game status');
  const value = v as unknown as GamesValue;
  return { revision: value.revision, configured: value.configured, checking: value.checking,
    servers: value.servers.map(s => ({ name: s.name, join: s.join, gateway: s.gateway === null ? null : {
      source: s.gateway.source, state: s.gateway.state, checked_at: s.gateway.checked_at, freshness: s.gateway.freshness,
      players: s.gateway.players, capacity: s.gateway.capacity, error: s.gateway.error,
    } })) };
}
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
const queueErrors = ['checking', 'timeout', 'transport', 'denied', 'rate_limited', 'provider_error', 'oversized', 'malformed', 'unsupported_profile', 'page_moved', 'unavailable'];
const arrQueueStates = ['unknown', 'queued', 'paused', 'downloading', 'completed', 'failed', 'warning', 'delay', 'downloadClientUnavailable', 'fallback'];
const queueImportStates = ['downloading', 'importBlocked', 'importPending', 'importing', 'imported', 'failedPending', 'failed', 'ignored', 'unknown'];
const torrentStates = ['error', 'missingFiles', 'uploading', 'stoppedUP', 'queuedUP', 'stalledUP', 'checkingUP', 'forcedUP', 'downloading', 'metaDL', 'forcedMetaDL', 'stoppedDL', 'queuedDL', 'stalledDL', 'checkingDL', 'forcedDL', 'checkingResumeData', 'moving', 'unknown'];
const queueError = (v: unknown): v is string | null => v === null || (typeof v === 'string' && queueErrors.includes(v));
const queueQuantity = (v: unknown): v is number | null => v === null || boundedNumber(v, Number.MAX_SAFE_INTEGER);
function agedQueueObservation(value: QueueObservation, at = Math.floor(Date.now() / 1000)): QueueObservation {
  const collected = value.checked_at;
  const freshness = !Number.isFinite(at) || at < 0 || collected === null || collected > at ? 'unknown'
    : value.freshness === 'fresh' && at - collected > 90 ? 'stale' : value.freshness;
  return freshness === value.freshness ? value : { ...value, freshness };
}
function queueObservation(v: unknown, provider: QueueProvider, offset: number): QueueObservation {
  const torrent = provider === 'qbittorrent';
  if (!record(v) || !decimal(v.revision) || typeof v.configured !== 'boolean' || v.profile !== queueProfiles[provider]
      || !(v.checked_at === null || boundedNumber(v.checked_at, 253402300799))
      || !['fresh', 'stale', 'unknown'].includes(String(v.freshness)) || !queueError(v.error) || typeof v.complete !== 'boolean'
      || v.offset !== offset || !mediaOffset(v.offset) || !(v.next_offset === null || (mediaOffset(v.next_offset) && v.next_offset === offset + 12))
      || !(v.total === null || boundedNumber(v.total, 1_000_000_000)) || (torrent && v.total !== null) || typeof v.truncated !== 'boolean'
      || !Array.isArray(v.items) || v.items.length > 12 || new Set(v.items.map(i => record(i) ? i.id : null)).size !== v.items.length
      || v.items.some((i: unknown) => !record(i) || typeof i.id !== 'string' || !/^[a-f0-9]{64}$/.test(i.id)
        || !(i.title === null || field(i.title, 240, true)) || typeof i.status !== 'string' || !(torrent ? torrentStates : arrQueueStates).includes(i.status)
        || !(i.import_state === null || (!torrent && typeof i.import_state === 'string' && queueImportStates.includes(i.import_state)))
        || !(i.warning === null || typeof i.warning === 'boolean')
        || !(i.progress_basis_points === null || boundedNumber(i.progress_basis_points, 10000)) || !queueQuantity(i.size_bytes)
        || !queueQuantity(i.download_bytes_per_second) || !queueQuantity(i.upload_bytes_per_second)
        || (!torrent && (i.download_bytes_per_second !== null || i.upload_bytes_per_second !== null)))
      || (!v.configured && (v.items.length !== 0 || v.complete || v.checked_at !== null || v.next_offset !== null || v.total !== null || v.error !== null || v.freshness !== 'unknown' || v.truncated))
      || (v.error !== null && v.complete)
      || (v.error !== null && v.error !== 'checking' && (v.items.length !== 0 || v.next_offset !== null || v.total !== null))
      || (v.error === 'page_moved' && (v.items.length !== 0 || v.next_offset !== null || v.total !== null))
      || (v.next_offset !== null && v.items.length !== 12)
      || (v.complete && v.items.some(i => i.title === null || i.status === 'unknown' || i.warning === null || (!torrent && (i.import_state === null || i.import_state === 'unknown'))))) throw new Error('Invalid queue response');
  if (v.configured && v.error === null && !torrent) {
    if (v.total === null || v.items.length !== Math.min(12, Math.max(0, (v.total as number) - offset))
        || v.next_offset !== (offset + 12 <= 48 && offset + v.items.length < (v.total as number) ? offset + 12 : null)
        || v.truncated !== ((v.total as number) > 60)) throw new Error('Invalid queue page');
  }
  if (torrent && v.truncated && (offset !== 48 || v.items.length !== 12 || v.next_offset !== null)) throw new Error('Invalid transfer window');
  const value = v as unknown as QueueObservation;
  // Only the current projection can become browser state. Ignored provider or
  // future response fields cannot carry private data through a broad cast.
  return agedQueueObservation({
    revision: value.revision, configured: value.configured, profile: value.profile, checked_at: value.checked_at,
    freshness: value.freshness, error: value.error, complete: value.complete, offset: value.offset,
    next_offset: value.next_offset, total: value.total, truncated: value.truncated,
    items: value.items.map(({ id, title, status, import_state, warning, progress_basis_points, size_bytes, download_bytes_per_second, upload_bytes_per_second }) => ({ id, title, status, import_state, warning, progress_basis_points, size_bytes, download_bytes_per_second, upload_bytes_per_second })),
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
  let gamesReading: AbortController | undefined;
  let gamesSerial = 0;
  let marking: AbortController | undefined;
  let historySerial = 0;
  let guideSerial = 0;
  let observationsSerial = 0;
  let mediaActive = false;
  const mediaReading: Partial<Record<MediaProvider, AbortController>> = {};
  const mediaStatusReading: Partial<Record<MediaProvider, AbortController>> = {};
  const mediaSaving: Partial<Record<MediaProvider, AbortController>> = {};
  const mediaSerial: Record<MediaProvider, number> = { jellyfin: 0, seerr: 0 };
  const mediaStatusSerial: Record<MediaProvider, number> = { jellyfin: 0, seerr: 0 };
  let sessionsActive = false;
  let sessionsReading: AbortController | undefined;
  let sessionsSaving: AbortController | undefined;
  let sessionsSerial = 0;
  let identityActive = false;
  let identityReading: AbortController | undefined;
  let identitySaving: AbortController | undefined;
  let identitySerial = 0;
  let queuesActive = false;
  const queueReading: Partial<Record<QueueProvider, AbortController>> = {};
  const queueStatusReading: Partial<Record<QueueProvider, AbortController>> = {};
  const queueSaving: Partial<Record<QueueProvider, AbortController>> = {};
  const queueSerial: Record<QueueProvider, number> = { sonarr: 0, radarr: 0, qbittorrent: 0 };
  const queueStatusSerial: Record<QueueProvider, number> = { sonarr: 0, radarr: 0, qbittorrent: 0 };
  let key: string | undefined;
  let held: { key: string; draft: Draft } | undefined;
  let channel: BroadcastChannel | undefined;
  let disposed = false;
  let terminal = false;
  let admitted: AccessScope | undefined;
  let connectionPending = false, connectionUncertain = false;
  let observationResourceKey = '';
  let observationView = '';
  let homeSelection: TileId[] = [];
  const homeReadAt = new Map<TileId, number>();
  const state = () => get(model);
  const tiles = tileController({ request, scope: () => {
    const s = state(); return !disposed && !terminal && s.phase === 'ready' && document.visibilityState === 'visible' ? s.snapshot : undefined;
  }, blocked: status => invalidate(rejected(status), true) });
  const refreshBusy = (): boolean => tiles.busy() || !!saving || !!editing || !!marking || !!identitySaving || !!sessionsSaving
    || connectionPending || connectionUncertain || mediaProviders.some(p => !!mediaSaving[p]) || queueProviders.some(p => !!queueSaving[p])
    || [state().save, state().directorySave, state().notificationSave, state().identity.save, state().sessions.save,
      ...mediaProviders.map(p => state().media[p].save), ...queueProviders.map(p => state().queues[p].save)].includes('uncertain');
  function refreshDrafts(): boolean {
    const s = state();
    if (s.dirty || s.recovery || tiles.drafts()) return true;
    // Inspect only whether a form has work. Never retain or copy its values.
    return Array.from(document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('#workspace-root form input, #workspace-root form textarea, #workspace-root form select')).some(element => {
      if (element instanceof HTMLInputElement && ['hidden', 'submit', 'button'].includes(element.type) || element.id === 'workspace-note') return false;
      if (element instanceof HTMLInputElement && ['checkbox', 'radio'].includes(element.type)) return element.checked !== element.defaultChecked;
      if (element instanceof HTMLSelectElement) { const options = Array.from(element.options); let defaultIndex = 0; options.forEach((option, index) => { if (option.defaultSelected) defaultIndex = index; }); return element.selectedIndex !== (defaultIndex < 0 ? 0 : defaultIndex); }
      return element.value !== element.defaultValue || element instanceof HTMLInputElement && element.type === 'password' && element.value.length > 0;
    });
  }
  const updates = refresh(binding, { scope: () => admitted, blocked: message => invalidate(message, true), busy: refreshBusy,
    drafts: refreshDrafts, discard: removeDraft, leaving: () => { terminal = true; cancel(); } });
  const refreshStatus = () => ({ busy: refreshBusy(), drafts: refreshDrafts() });
  function connectionMutation(pending: boolean, uncertain: boolean): void { connectionPending = pending; connectionUncertain = uncertain; model.update(s => ({ ...s })); }
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
    tiles.clear(); observationResourceKey = ''; observationView = ''; homeSelection = []; homeReadAt.clear();
    ++gamesSerial; gamesReading?.abort(); gamesReading = undefined;
    ++epoch; mediaActive = false; queuesActive = false; identityActive = false; sessionsActive = false;
    ++sessionsSerial; sessionsReading?.abort(); sessionsSaving?.abort(); sessionsReading = undefined; sessionsSaving = undefined;
    ++identitySerial; identityReading?.abort(); identitySaving?.abort(); identityReading = undefined; identitySaving = undefined;
    for (const provider of mediaProviders) {
      ++mediaSerial[provider]; ++mediaStatusSerial[provider];
      mediaReading[provider]?.abort(); mediaStatusReading[provider]?.abort(); mediaSaving[provider]?.abort();
      delete mediaReading[provider]; delete mediaStatusReading[provider]; delete mediaSaving[provider];
    }
    for (const provider of queueProviders) {
      ++queueSerial[provider]; ++queueStatusSerial[provider];
      queueReading[provider]?.abort(); queueStatusReading[provider]?.abort(); queueSaving[provider]?.abort();
      delete queueReading[provider]; delete queueStatusReading[provider]; delete queueSaving[provider];
    }
    if (timer) clearTimeout(timer);
    timer = undefined;
    reading?.abort(); saving?.abort(); reading = undefined; saving = undefined;
    editing?.abort(); editing = undefined;
    ++historySerial; historyReading?.abort(); historyReading = undefined;
    ++guideSerial; guideReading?.abort(); guideReading = undefined;
    ++observationsSerial; observationsReading?.abort(); observationsReading = undefined;
    marking?.abort(); marking = undefined;
  }
  function invalidate(message: string, blocked = false): void {
    updates.pause(blocked); cancel(); terminal ||= blocked;
    flushSync(() => model.set(empty(blocked ? 'blocked' : 'paused', message)));
  }
  function schedule(): void {
    if (timer) clearTimeout(timer);
    if (!disposed && !terminal && state().phase === 'ready' && state().notificationSave !== 'uncertain' && document.visibilityState === 'visible') {
      timer = setTimeout(() => { timer = undefined; ageMedia(); ageQueues(); void read(); }, 15000);
    }
  }
  async function request(path: string, controller: AbortController, body?: unknown, method = body ? 'PUT' : 'GET'): Promise<{ status: number; value?: unknown }> {
    const started = performance.now();
    const deadline = setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch(path, {
        method, credentials: 'same-origin', cache: 'no-store', redirect: 'error', signal: controller.signal,
        headers: { 'X-Reborn-Product': PRODUCT, 'X-Reborn-Contract': CONTRACT, 'X-CSRF-Token': binding, ...(path === '/api/workspace/guide' ? { 'X-Reborn-Guide': 'home-tiles-v1' } : {}), ...(path === '/api/workspace/tiles' ? { 'X-Reborn-Tiles-Contract': 'reborn-tiles-v1' } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
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
    ++gamesSerial; gamesReading?.abort(); gamesReading = undefined; homeReadAt.delete('games');
    return { crafty, observations: { ...emptyObservations(), message: 'Connection enrollment changed. Check newest observations for the current scope.' }, changed: true };
  }
  async function read(deliberate = false): Promise<void> {
    if (disposed || terminal || reading || saving || editing || marking || document.visibilityState !== 'visible') return;
    const controller = new AbortController(); reading = controller; const current = epoch;
    try {
      const response = await request('/api/workspace/snapshot', controller);
      if (disposed || controller.signal.aborted || current !== epoch) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if (response.status !== 200) { invalidate(rejected(response.status), true); return; }
      const next = snapshot(response.value);
      if (!authorized(next)) { invalidate('Your account scope changed. Open a fresh workspace.', true); return; }
      if (admitted && (next.account.id !== admitted.account.id || next.account.username !== admitted.account.username || next.account.role !== admitted.account.role || next.session_generation !== admitted.session_generation)) { invalidate('Your account scope changed. Open a fresh workspace.', true); return; }
      admitted = { account: next.account, session_generation: next.session_generation };
      const before = state(); key = storageKey(next);
      if (before.phase === 'ready') {
        const connection = mergeCrafty(before, next.crafty);
        const conflict = before.dirty && next.note.revision !== before.base;
        const checked: Model = { ...before, snapshot: { ...next, crafty: connection.crafty },
          observations: connection.observations, games: connection.changed ? emptyGames() : before.games,
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
      tiles.admit({ account: next.account, session_generation: next.session_generation });
      if (mediaActive && state().snapshot?.account.role === 'owner') {
        for (const provider of mediaProviders) {
          const pending = state().media[provider].observation;
          if (pending?.error === 'checking' && !mediaReading[provider] && !mediaSaving[provider]) void loadMedia(provider, pending.offset);
        }
      }
      if (queuesActive && state().snapshot?.account.role === 'owner') {
        for (const provider of queueProviders) {
          const pending = state().queues[provider].observation;
          if (pending?.error === 'checking' && !queueReading[provider] && !queueSaving[provider] && !queueStatusReading[provider]) void loadQueues(provider, pending.offset);
        }
      }
      refreshHome(); void updates.discover(); schedule();
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
    if (s.phase !== 'ready' || !s.dirty || !text(s.draft) || ['conflict', 'checking-conflict', 'uncertain'].includes(s.save) || saving || marking) return;
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
    if (s.phase !== 'ready' || !s.snapshot || editing || marking || s.directorySave === 'uncertain') return false;
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
    if (disposed || terminal || s.phase !== 'ready' || !s.snapshot || marking || saving || editing || s.notificationSave !== 'idle'
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
  function setObservationView(view: string, selected: TileId[]): void {
    const owner = state().phase === 'ready' && state().snapshot?.account.role === 'owner';
    const mediaWanted = owner && (view === 'media' || view === 'home' && selected.some(id => id === 'jellyfin' || id === 'requests'));
    const queuesWanted = owner && (view === 'queues' || view === 'home' && selected.includes('downloads'));
    const selection = [...new Set(selected)].sort();
    const key = `${view}:${owner}:${selection.join(',')}`;
    if (key === observationResourceKey) return;
    observationResourceKey = key;
    for (const id of homeSelection) if (view !== 'home' || !selection.includes(id)) homeReadAt.delete(id);
    if (view !== 'home' || !selection.includes('games')) {
      ++gamesSerial; gamesReading?.abort(); gamesReading = undefined;
      model.update(m => ({ ...m, games: emptyGames() }));
    }
    if (observationView === 'home') {
      for (const [id, provider] of [['jellyfin', 'jellyfin'], ['requests', 'seerr']] as const) {
        if (homeSelection.includes(id) && (view !== 'home' || !selection.includes(id))) {
          clearMediaRead(provider); ++mediaStatusSerial[provider]; mediaStatusReading[provider]?.abort(); delete mediaStatusReading[provider];
        }
      }
    }
    observationView = view; homeSelection = selection;
    if (!mediaWanted && mediaActive) closeMedia(false); else if (mediaWanted) mediaActive = true;
    if (!queuesWanted && queuesActive) closeQueues(false); else if (queuesWanted) queuesActive = true;
    refreshHome();
  }
  function refreshHome(): void {
    if (observationView !== 'home' || disposed || terminal || state().phase !== 'ready' || document.visibilityState !== 'visible') return;
    const at = performance.now();
    for (const id of homeSelection) {
      if (at - (homeReadAt.get(id) ?? -Infinity) < 14000) continue;
      if (id === 'games') {
        if (!gamesReading) { homeReadAt.set(id, at); void loadGames(); }
        continue;
      }
      if (!ownerSnapshot() || !['jellyfin', 'requests', 'downloads'].includes(id)) continue;
      if (id === 'jellyfin' || id === 'requests') {
        const provider = id === 'jellyfin' ? 'jellyfin' : 'seerr';
        if (mediaReading[provider] || mediaStatusReading[provider] || mediaSaving[provider] || state().media[provider].save !== 'idle') continue;
        homeReadAt.set(id, at); void loadMedia(provider, 0);
      } else {
        if (queueProviders.some(provider => queueReading[provider] || queueStatusReading[provider] || queueSaving[provider] || state().queues[provider].save !== 'idle')) continue;
        homeReadAt.set(id, at); void Promise.all(queueProviders.map(provider => loadQueues(provider, 0)));
      }
    }
  }
  async function loadGames(): Promise<void> {
    const captured = state().snapshot;
    if (!captured || disposed || terminal || state().phase !== 'ready' || gamesReading
        || document.visibilityState !== 'visible' || observationView !== 'home' || !homeSelection.includes('games')) return;
    const controller = new AbortController(); gamesReading = controller;
    const serial = ++gamesSerial, current = epoch;
    model.update(m => ({ ...m, games: { ...m.games, phase: 'loading', message: '' } }));
    try {
      const response = await request('/api/workspace/games', controller);
      if (disposed || controller.signal.aborted || serial !== gamesSerial || current !== epoch || !currentScope(captured)) return;
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) {
        model.update(m => ({ ...m, games: { phase: 'error', message: 'Server details changed. Checking for an update.' } }));
        return;
      }
      if (response.status !== 200) throw new Error('Game status unavailable');
      if (!scoped(response.value, captured)) { invalidate('Your account scope changed. Open a fresh workspace.', true); return; }
      const value = gamesValue(response.value), revision = state().snapshot?.crafty?.revision;
      if (revision && BigInt(value.revision) < BigInt(revision)) throw new Error('Older server scope');
      model.update(m => ({ ...m, games: { phase: 'ready', value, message: '' } }));
    } catch {
      if (!disposed && serial === gamesSerial && current === epoch && currentScope(captured)) {
        model.update(m => ({ ...m, games: { phase: 'error', message: 'Status is taking a little longer. It will be checked again.' } }));
      }
    } finally { if (gamesReading === controller) gamesReading = undefined; }
  }
  async function checkHome(id: TileId): Promise<void> {
    if (id === 'games') { await read(true); await loadGames(); return; }
    if (!ownerSnapshot()) return;
    if (id === 'jellyfin' || id === 'requests') await checkMedia(id === 'jellyfin' ? 'jellyfin' : 'seerr');
    else if (id === 'downloads') await Promise.all(queueProviders.map(async provider => {
      if (queueReading[provider] || queueStatusReading[provider] || queueSaving[provider]) return;
      // Home uses the same bounded first-page reader as the detail view. No
      // additional timer, credential copy, enrollment write or provider control.
      await loadQueues(provider, 0);
    }));
  }
  function clearMediaRead(provider: MediaProvider): void {
    ++mediaSerial[provider]; mediaReading[provider]?.abort(); delete mediaReading[provider];
  }
  function closeMedia(flush = true): void {
    mediaActive = false;
    for (const provider of mediaProviders) {
      clearMediaRead(provider); ++mediaStatusSerial[provider]; mediaStatusReading[provider]?.abort(); delete mediaStatusReading[provider];
      const prior = state().media[provider], savingNow = !!mediaSaving[provider];
      mediaSaving[provider]?.abort(); delete mediaSaving[provider];
      setMedia(provider, { phase: 'idle', save: savingNow ? 'uncertain' : prior.save, message: savingNow ? 'The save may have completed. Check the connection state before another change.' : prior.save === 'uncertain' || prior.save === 'conflict' ? prior.message : '' }, flush);
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
  function ageQueues(): void {
    const current = state();
    if (disposed || terminal || current.phase !== 'ready') return;
    const at = Math.floor(Date.now() / 1000);
    let changed = false;
    const queues = { ...current.queues };
    for (const provider of queueProviders) {
      const observation = queues[provider].observation;
      if (!observation) continue;
      const aged = agedQueueObservation(observation, at);
      if (aged !== observation) { changed = true; queues[provider] = { ...queues[provider], observation: aged }; }
    }
    // Reuse the existing tick for held presentation only; no successful sample
    // is polled again just because its collection age changed.
    if (changed) model.set({ ...current, queues });
  }
  function setQueue(provider: QueueProvider, value: QueueState, flush = false): void {
    const update = () => model.update(m => ({ ...m, queues: { ...m.queues, [provider]: value } }));
    if (flush) flushSync(update); else update();
  }
  function clearQueueRead(provider: QueueProvider): void {
    ++queueSerial[provider]; queueReading[provider]?.abort(); delete queueReading[provider];
  }
  function closeQueues(flush = true): void {
    queuesActive = false;
    for (const provider of queueProviders) {
      clearQueueRead(provider); ++queueStatusSerial[provider]; queueStatusReading[provider]?.abort(); delete queueStatusReading[provider];
      const prior = state().queues[provider], savingNow = !!queueSaving[provider];
      queueSaving[provider]?.abort(); delete queueSaving[provider];
      setQueue(provider, { ...emptyQueue(), save: savingNow ? 'uncertain' : prior.save, message: savingNow ? 'The save may have completed. Check the connection state before another change.' : prior.save === 'uncertain' || prior.save === 'conflict' ? prior.message : '' }, flush);
    }
  }
  async function checkQueues(provider: QueueProvider): Promise<void> {
    const captured = ownerSnapshot(); if (!captured || queueSaving[provider]) return;
    queuesActive = true;
    clearQueueRead(provider); queueStatusReading[provider]?.abort();
    const controller = new AbortController(); queueStatusReading[provider] = controller;
    const serial = ++queueStatusSerial[provider], current = epoch, prior = state().queues[provider];
    setQueue(provider, { ...prior, phase: 'loading', observation: undefined, message: 'Checking the current enrollment…' }, true);
    try {
      const response = await request(`/api/owner/queues/${provider}`, controller);
      if (disposed || !queuesActive || controller.signal.aborted || serial !== queueStatusSerial[provider] || current !== epoch || !currentScope(captured)) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      const value = response.value;
      if (response.status !== 200 || !record(value) || !decimal(value.revision) || typeof value.configured !== 'boolean' || value.profile !== queueProfiles[provider]) throw new Error('Queue enrollment unavailable');
      const existing = state().queues[provider].status;
      if (existing && (BigInt(value.revision) < BigInt(existing.revision) || (value.revision === existing.revision && value.configured !== existing.configured))) throw new Error('Older enrollment reply');
      const offset = value.configured && existing?.revision === value.revision ? prior.offset : 0;
      setQueue(provider, { phase: 'ready', offset, status: { revision: value.revision, configured: value.configured, profile: value.profile as string }, save: 'idle', message: value.configured ? 'Enrollment checked. Check observations when you want a provider sample.' : 'No connection is enrolled.' }, true);
    } catch {
      if (!disposed && queuesActive && serial === queueStatusSerial[provider] && current === epoch && currentScope(captured)) {
        setQueue(provider, { ...state().queues[provider], phase: 'error', observation: undefined, message: 'The connection state could not be checked. Retry deliberately before entering credentials.' }, true);
      }
    } finally { if (queueStatusReading[provider] === controller) delete queueStatusReading[provider]; }
  }
  async function openQueues(): Promise<void> {
    if (!ownerSnapshot()) return;
    queuesActive = true;
    // Opening this private view checks status only. It does not enroll access or
    // contact a provider until the owner explicitly asks for observations.
    await Promise.all(queueProviders.map(provider => checkQueues(provider)));
  }
  async function loadQueues(provider: QueueProvider, offset = state().queues[provider].offset): Promise<void> {
    const captured = ownerSnapshot(); if (!captured || !mediaOffset(offset) || queueSaving[provider]) return;
    queuesActive = true;
    clearQueueRead(provider);
    const controller = new AbortController(); queueReading[provider] = controller;
    const serial = queueSerial[provider], current = epoch, prior = state().queues[provider];
    setQueue(provider, { ...prior, offset, phase: 'loading', observation: undefined, message: 'Checking queue observations…' }, true);
    try {
      const response = await request(`/api/workspace/queues/${provider}?offset=${offset}`, controller);
      if (disposed || !queuesActive || controller.signal.aborted || serial !== queueSerial[provider] || current !== epoch || !currentScope(captured)) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) {
        clearQueueRead(provider);
        setQueue(provider, { ...emptyQueue(), phase: 'error', save: prior.save, message: 'Enrollment changed. Check the connection state before reading its new scope.' }, true); return;
      }
      if (response.status !== 200) throw new Error('Queues unavailable');
      if (!scoped(response.value, captured)) { invalidate('Your account scope changed. Open a fresh workspace.', true); return; }
      if (response.value.provider !== provider) throw new Error('Wrong queue provider');
      const observation = queueObservation(response.value.observation, provider, offset), status = state().queues[provider].status;
      if (status && (BigInt(observation.revision) < BigInt(status.revision) || (observation.revision === status.revision && observation.configured !== status.configured))) throw new Error('Older queue scope');
      if (status?.revision !== observation.revision) { ++queueStatusSerial[provider]; queueStatusReading[provider]?.abort(); delete queueStatusReading[provider]; }
      const message = !observation.configured ? 'No connection is enrolled.'
        : observation.error === 'checking' ? 'A sample is being collected. Displayed rows, if any, retain their earlier collection time.'
        : observation.error === 'page_moved' ? 'The provider moved this page as its queue changed. Reload the first page deliberately.'
        : observation.error === 'unsupported_profile' ? 'This provider does not match the supported API profile. Review the enrolled version and address.'
        : observation.error === 'denied' ? 'The provider denied access. Review deliberate key enrollment.'
        : observation.error === 'rate_limited' ? 'The provider limited requests. Try again deliberately later.'
        : observation.error ? 'Queue observations are unavailable. Unknown values stay unknown.'
        : observation.complete ? 'Queue observations checked.' : 'An incomplete sample is available; unreported values stay unknown.';
      setQueue(provider, { phase: 'ready', offset, status: { revision: observation.revision, configured: observation.configured, profile: observation.profile }, observation, save: state().queues[provider].save, message }, true);
    } catch {
      if (!disposed && queuesActive && serial === queueSerial[provider] && current === epoch && currentScope(captured)) setQueue(provider, { ...state().queues[provider], phase: 'error', observation: undefined, message: 'Queue observations could not be checked. Retry deliberately; your private note is unchanged.' }, true);
    } finally { if (queueReading[provider] === controller) delete queueReading[provider]; }
  }
  async function saveQueues(provider: QueueProvider, base: string, connection: QueueEnrollment | null): Promise<void> {
    const captured = ownerSnapshot(), prior = state().queues[provider];
    if (!captured || queueSaving[provider] || prior.phase !== 'ready' || prior.save !== 'idle' || prior.status?.revision !== base || !decimal(base)) return;
    queuesActive = true;
    clearQueueRead(provider); ++queueStatusSerial[provider]; queueStatusReading[provider]?.abort(); delete queueStatusReading[provider];
    const controller = new AbortController(); queueSaving[provider] = controller;
    const current = epoch;
    setQueue(provider, { ...prior, observation: undefined, save: 'saving', message: connection ? 'Saving the deliberately enrolled connection…' : 'Removing the connection…' }, true);
    try {
      const response = await request(`/api/owner/queues/${provider}`, controller, { base_revision: base, connection });
      if (disposed || !queuesActive || controller.signal.aborted || current !== epoch || !currentScope(captured) || queueSaving[provider] !== controller) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) { setQueue(provider, { ...emptyQueue(), phase: 'error', save: 'conflict', message: 'The connection changed elsewhere. Check its current state before enrolling again.' }, true); return; }
      if ([400, 413, 429].includes(response.status)) { setQueue(provider, { ...prior, observation: undefined, save: 'idle', message: 'Connection not accepted. Review the root HTTPS address, supported version, certificate and broad-access acknowledgement.' }, true); return; }
      const value = response.value;
      if (response.status !== 200 || !record(value) || !decimal(value.revision, true) || BigInt(value.revision) !== BigInt(base) + 1n || value.configured !== (connection !== null) || value.profile !== queueProfiles[provider]) throw new Error('Uncertain queue save');
      setQueue(provider, { phase: 'ready', offset: 0, status: { revision: value.revision, configured: value.configured as boolean, profile: value.profile as string }, save: 'idle', message: connection ? 'Connection saved. Check its observations.' : 'Connection removed.' }, true);
    } catch {
      if (!disposed && queuesActive && current === epoch && currentScope(captured) && queueSaving[provider] === controller) setQueue(provider, { ...state().queues[provider], phase: 'error', observation: undefined, save: 'uncertain', message: 'The save may have completed. Check the connection state before entering credentials again.' }, true);
    } finally { if (queueSaving[provider] === controller) delete queueSaving[provider]; }
  }
  function identitySnapshot(): Snapshot | undefined {
    const s = state();
    return !disposed && !terminal && s.phase === 'ready' && s.snapshot && document.visibilityState === 'visible' ? s.snapshot : undefined;
  }
  function setIdentity(value: IdentityState): void { flushSync(() => model.update(m => ({ ...m, identity: value }))); }
  function closeIdentity(): void {
    identityActive = false; ++identitySerial; identityReading?.abort(); identityReading = undefined;
    const pending = !!identitySaving; identitySaving?.abort(); identitySaving = undefined;
    setIdentity({ ...emptyIdentity(), save: pending ? 'uncertain' : state().identity.save,
      message: pending ? 'The change may have completed. Check identity status before another action.' : '' });
  }
  function acceptIdentity(value: unknown, captured: Snapshot, prior = state().identity.value): DiscordValue {
    if (!scoped(value, captured)) { invalidate('Your account scope changed. Open a fresh workspace.', true); throw new Error('Identity scope changed'); }
    const next = discordValue(value);
    if (prior && (BigInt(next.application.revision) < BigInt(prior.application.revision)
        || BigInt(next.link.revision) < BigInt(prior.link.revision)
        || BigInt(next.link.flow_generation) < BigInt(prior.link.flow_generation))) throw new Error('Older identity response');
    return next;
  }
  async function checkIdentity(): Promise<void> {
    const captured = identitySnapshot(); if (!captured || identitySaving) return;
    identityActive = true; identityReading?.abort();
    const controller = new AbortController(); identityReading = controller;
    const serial = ++identitySerial, current = epoch, prior = state().identity.value;
    setIdentity({ ...state().identity, phase: 'loading', value: undefined, message: 'Checking your current Discord link…' });
    try {
      const response = await request('/api/workspace/discord', controller);
      if (disposed || !identityActive || controller.signal.aborted || serial !== identitySerial || current !== epoch || !currentScope(captured)) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status !== 200) throw new Error('Identity unavailable');
      const value = acceptIdentity(response.value, captured, prior);
      setIdentity({ phase: 'ready', value, save: 'idle', message: identityMessage(value) });
    } catch {
      if (!disposed && identityActive && serial === identitySerial && current === epoch && currentScope(captured)) setIdentity({ phase: 'error', save: state().identity.save, message: 'Identity status could not be checked. Check again before making a change.' });
    } finally { if (identityReading === controller) identityReading = undefined; }
  }
  async function openIdentity(): Promise<void> { if (!identitySnapshot()) return; identityActive = true; await checkIdentity(); }
  async function identityAction(action: IdentityAction): Promise<void> {
    const captured = identitySnapshot(), prior = state().identity, value = prior.value;
    if (!captured || !identityActive || identitySaving || prior.phase !== 'ready' || prior.save !== 'idle' || !value) return;
    if (action === 'review' && value.attempt.phase !== 'ready_to_review' || action === 'confirm' && value.attempt.phase !== 'review_ready') return;
    const body = { base_revision: value.link.revision, base_flow_generation: value.link.flow_generation,
      ...(['review', 'confirm'].includes(action) ? { base_application_revision: value.application.revision } : {}) };
    identityReading?.abort(); identityReading = undefined; ++identitySerial;
    const controller = new AbortController(); identitySaving = controller; const current = epoch;
    setIdentity({ ...prior, value: undefined, save: 'saving', message: action === 'review' ? 'Reviewing the identity returned by Discord…' : action === 'confirm' ? 'Saving your confirmed identity…' : action === 'unlink' ? 'Unlinking this identity locally…' : 'Cancelling this unfinished link…' });
    try {
      const response = await request(`/api/workspace/discord/${action}`, controller, body, 'POST');
      if (disposed || !identityActive || controller.signal.aborted || current !== epoch || !currentScope(captured) || identitySaving !== controller) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) { setIdentity({ phase: 'error', save: 'conflict', message: 'This link or application changed. Check identity status before another action.' }); return; }
      if ([400, 413, 429].includes(response.status)) { setIdentity({ phase: 'error', save: 'idle', message: 'The action was not accepted. Check identity status before starting again.' }); return; }
      if (response.status !== 200) throw new Error('Uncertain identity change');
      const next = acceptIdentity(response.value, captured, value);
      setIdentity({ phase: 'ready', value: next, save: 'idle', message: action === 'unlink' ? 'The Discord identity is unlinked locally. Your local sign-in is unchanged.' : action === 'cancel' ? 'The unfinished link is cancelled.' : identityMessage(next) });
    } catch {
      if (!disposed && identityActive && current === epoch && currentScope(captured) && identitySaving === controller) setIdentity({ phase: 'error', save: 'uncertain', message: 'The action may have completed. Check identity status before making another choice. It has not been sent again.' });
    } finally { if (identitySaving === controller) identitySaving = undefined; }
  }
  async function saveDiscordApplication(base: string, application: DiscordApplication | null): Promise<void> {
    const captured = ownerSnapshot(), prior = state().identity;
    if (!captured || !identityActive || identitySaving || prior.phase !== 'ready' || prior.save !== 'idle' || prior.value?.application.revision !== base || !decimal(base)) return;
    identityReading?.abort(); identityReading = undefined; ++identitySerial;
    const controller = new AbortController(); identitySaving = controller; const current = epoch;
    setIdentity({ phase: 'loading', save: 'saving', message: application ? 'Saving dedicated Discord application access…' : 'Removing Discord application access…' });
    try {
      const response = await request('/api/owner/discord/application', controller, { base_revision: base, application });
      if (disposed || !identityActive || controller.signal.aborted || current !== epoch || !currentScope(captured) || identitySaving !== controller) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) { setIdentity({ phase: 'error', save: 'conflict', message: 'The application changed elsewhere. Check status before entering credentials again.' }); return; }
      if ([400, 413, 429].includes(response.status)) { setIdentity({ phase: 'error', save: 'idle', message: 'Application access was not accepted. Check status, then review the application ID, secret and callback logging acknowledgement.' }); return; }
      if (response.status !== 200) throw new Error('Uncertain application save');
      const next = acceptIdentity(response.value, captured, prior.value);
      if (BigInt(next.application.revision) !== BigInt(base) + 1n || next.application.configured !== (application !== null)) throw new Error('Uncertain application revision');
      setIdentity({ phase: 'ready', value: next, save: 'idle', message: application ? 'Discord application saved. Existing identity links are unchanged.' : 'Discord application removed. Existing links remain available for local unlinking.' });
    } catch {
      if (!disposed && identityActive && current === epoch && currentScope(captured) && identitySaving === controller) setIdentity({ phase: 'error', save: 'uncertain', message: 'The application save may have completed. Check status before entering credentials again.' });
    } finally { if (application) application.client_secret = ''; if (identitySaving === controller) identitySaving = undefined; }
  }
  function setSessions(value: SessionsState): void { flushSync(() => model.update(m => ({ ...m, sessions: value }))); }
  function closeSessions(): void {
    sessionsActive = false; ++sessionsSerial; sessionsReading?.abort(); sessionsReading = undefined;
    const pending = !!sessionsSaving; sessionsSaving?.abort(); sessionsSaving = undefined;
    setSessions({ ...emptySessions(), save: pending ? 'uncertain' : state().sessions.save,
      message: pending ? 'The sign-out may have completed. Check your active sessions before another action.' : '' });
  }
  function acceptSessions(value: unknown, captured: Snapshot, prior?: SessionList): SessionList {
    if (!scoped(value, captured)) { invalidate('Your account scope changed. Open a fresh workspace.', true); throw new Error('Session scope changed'); }
    const next = sessionList(value);
    if (prior && (BigInt(next.checked_at) < BigInt(prior.checked_at)
        || next.sessions.find(r => r.current)!.id !== prior.sessions.find(r => r.current)!.id)) throw new Error('Older or different acting session list');
    return next;
  }
  async function checkSessions(): Promise<void> {
    const captured = identitySnapshot(); if (!captured || sessionsSaving) return;
    sessionsActive = true; sessionsReading?.abort();
    const controller = new AbortController(); sessionsReading = controller;
    const serial = ++sessionsSerial, current = epoch, prior = state().sessions.value;
    setSessions({ ...state().sessions, phase: 'loading', value: undefined, message: 'Checking your active sign-in sessions…' });
    try {
      const response = await request('/api/workspace/sessions', controller);
      if (disposed || !sessionsActive || controller.signal.aborted || serial !== sessionsSerial || current !== epoch || !currentScope(captured)) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status !== 200) throw new Error('Session list unavailable');
      const value = acceptSessions(response.value, captured, prior);
      setSessions({ phase: 'ready', value, save: 'idle', message: 'Your active sign-in sessions were checked. Later sign-ins, expiry or sign-outs can change this list.' });
    } catch {
      if (!disposed && sessionsActive && serial === sessionsSerial && current === epoch && currentScope(captured)) setSessions({ phase: 'error', save: state().sessions.save, message: 'Your active sessions could not be checked. This does not mean no sessions exist. Check again before choosing a session to sign out.' });
    } finally { if (sessionsReading === controller) sessionsReading = undefined; }
  }
  async function openSessions(): Promise<void> { if (!identitySnapshot()) return; sessionsActive = true; await checkSessions(); }
  async function revokeSession(id: string): Promise<void> {
    const captured = identitySnapshot(), prior = state().sessions, value = prior.value;
    if (!captured || !sessionsActive || sessionsSaving || prior.phase !== 'ready' || prior.save !== 'idle' || !value || !sessionId(id)
        || !value.sessions.some(row => row.id === id && !row.current)) return;
    sessionsReading?.abort(); sessionsReading = undefined; ++sessionsSerial;
    const controller = new AbortController(); sessionsSaving = controller; const current = epoch;
    setSessions({ phase: 'loading', save: 'saving', message: 'Signing out the selected other session…' });
    try {
      const response = await request('/api/workspace/sessions/revoke', controller, { session_id: id }, 'POST');
      if (disposed || !sessionsActive || controller.signal.aborted || current !== epoch || !currentScope(captured) || sessionsSaving !== controller) return;
      if (document.visibilityState !== 'visible') { invalidate('Workspace hidden. Checking access on return.'); return; }
      if ([401, 403, 426].includes(response.status)) { invalidate(rejected(response.status), true); return; }
      if (response.status === 409) { setSessions({ phase: 'error', save: 'conflict', message: 'That session is no longer available for targeted sign-out. Check your active sessions before making another choice.' }); return; }
      if ([400, 413, 429].includes(response.status)) { setSessions({ phase: 'error', save: 'idle', message: 'The sign-out was not accepted. Check your active sessions before another action.' }); return; }
      if (response.status !== 200 || !record(response.value) || response.value.result !== 'signed_out') throw new Error('Uncertain targeted sign-out');
      const next = acceptSessions(response.value, captured, value);
      if (next.sessions.some(r => r.id === id)) throw new Error('Target remains in sign-out receipt');
      setSessions({ phase: 'ready', value: next, save: 'idle', message: 'The selected session is signed out. This session and unrelated sign-ins remain available.' });
    } catch {
      if (!disposed && sessionsActive && current === epoch && currentScope(captured) && sessionsSaving === controller) setSessions({ phase: 'error', save: 'uncertain', message: 'The sign-out may have completed. Check your active sessions before another action. It has not been sent again.' });
    } finally { if (sessionsSaving === controller) sessionsSaving = undefined; }
  }
  function signOut(): void {
    removeDraft(); invalidate('Signing out…', true);
    try { channel?.postMessage({ kind: 'auth-changed' }); } catch { /* No optional feature blocks native submission. */ }
  }
  function start(): () => void {
    const pause = () => invalidate('Workspace hidden. Checking access on return.');
    const resume = () => { updates.resume(); void read(); };
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
      disposed = true; updates.dispose(); cancel(); channel?.close(); model.set(empty('blocked', 'Workspace closed.'));
      window.removeEventListener('blur', pause); window.removeEventListener('pagehide', pause);
      window.removeEventListener('focus', resume); window.removeEventListener('pageshow', resume);
      document.removeEventListener('visibilitychange', visibility);
    };
  }
  return { model, tiles, updates, refreshStatus, connectionMutation, start, edit, recover, resolve, save, signOut, check: () => read(true), editService, pins, activity, markNotification, loadGuide, observations, setObservationView, checkHome, openMedia, closeMedia, checkMedia, loadMedia, saveMedia, openQueues, closeQueues, checkQueues, loadQueues, saveQueues, openIdentity, closeIdentity, checkIdentity, identityAction, saveDiscordApplication, openSessions, closeSessions, checkSessions, revokeSession };
}
