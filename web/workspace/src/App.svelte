<script lang="ts">
  import { onMount, beforeUpdate, afterUpdate, flushSync } from 'svelte';
  import { workspace, defaultPanels, type HomePanel } from './controller';
  import LayoutEditor from './LayoutEditor.svelte';
  import Connections from './Connections.svelte';
  import Directory from './Directory.svelte';
  import Activity from './Activity.svelte';
  import Notifications from './Notifications.svelte';
  import Guide from './Guide.svelte';
  import Media from './Media.svelte';
  import Queues from './Queues.svelte';
  import Identity from './Identity.svelte';
  import Sessions from './Sessions.svelte';
  import RefreshNotice from './RefreshNotice.svelte';
  export let binding: string;
  const controller = workspace(binding);
  const model = controller.model;
  const updates = controller.updates.model;
  type View = 'home' | 'note' | 'connections' | 'directory' | 'activity' | 'notifications' | 'integrations' | 'roadmap' | 'media' | 'queues' | 'identity' | 'sessions';
  let view: View = window.location.hash === '#sessions' ? 'sessions' : window.location.hash === '#identity' ? 'identity' : 'home';
  let heading: HTMLHeadingElement;
  let panelGrid: HTMLDivElement;
  let panels: HomePanel[] = defaultPanels();
  let movedFocus: { element: HTMLElement; scope: string } | undefined;
  const version = document.querySelector<HTMLMetaElement>('meta[name="reborn-version"]')?.content ?? 'development';
  const commit = document.querySelector<HTMLMetaElement>('meta[name="reborn-commit"]')?.content ?? 'unqualified';
  const tree = document.querySelector<HTMLMetaElement>('meta[name="reborn-tree"]')?.content ?? 'unqualified';
  const channel = document.querySelector<HTMLMetaElement>('meta[name="reborn-channel"]')?.content ?? 'development';
  $: desiredPanels = $model.layoutDraft?.panels ?? $model.snapshot?.layout.panels ?? defaultPanels();
  // Services shares the same pinned-services instance. Defer order changes until
  // Home is shown so a background layout check cannot detach its focused form.
  $: if ($model.phase !== 'ready') panels = defaultPanels();
  else if (view !== 'directory') panels = desiredPanels;
  $: bytes = new TextEncoder().encode($model.draft).length;
  $: canSave = $model.phase === 'ready' && $model.dirty && bytes <= 4096
    && !['saving', 'checking-conflict'].includes($model.layoutSave) && $model.notificationSave !== 'saving' && !['saving', 'checking-conflict', 'conflict', 'uncertain'].includes($model.save);
  function navigate(next: View): void { const closing = view === 'media' && next !== 'media' || view === 'queues' && next !== 'queues' || view === 'identity' && next !== 'identity' || view === 'sessions' && next !== 'sessions'; if (view === 'media' && next !== 'media') controller.closeMedia(); if (view === 'queues' && next !== 'queues') controller.closeQueues(); if (view === 'identity' && next !== 'identity') controller.closeIdentity(); if (view === 'sessions' && next !== 'sessions') controller.closeSessions(); if (closing) flushSync(() => { view = next; }); else view = next; heading?.focus(); if (next === 'activity') void controller.activity(); if (next === 'notifications') void controller.check(); if (next === 'integrations' || next === 'roadmap') void controller.loadGuide(); if (next === 'media') void controller.openMedia(); if (next === 'queues') void controller.openQueues(); }
  let identityOpened = false;
  $: if (view !== 'identity' || $model.phase !== 'ready') identityOpened = false;
  $: if (view === 'identity' && $model.phase === 'ready' && !identityOpened) { identityOpened = true; void controller.openIdentity(); }
  let sessionsOpened = false;
  $: if (view !== 'sessions' || $model.phase !== 'ready') sessionsOpened = false;
  $: if (view === 'sessions' && $model.phase === 'ready' && !sessionsOpened) { sessionsOpened = true; void controller.openSessions(); }
  const focusScope = () => $model.snapshot ? `${$model.snapshot.account.id}:${$model.snapshot.session_generation}:${$model.snapshot.account.role}` : '';
  beforeUpdate(() => {
    const element = document.activeElement;
    movedFocus = view === 'home' && $model.phase === 'ready' && element instanceof HTMLElement && panelGrid?.contains(element)
      ? { element, scope: focusScope() } : undefined;
  });
  afterUpdate(() => {
    const prior = movedFocus; movedFocus = undefined;
    // Keyed moves can temporarily blur a focused descendant. This render cycle
    // restores only a visible same-account node when focus fell back to body.
    if (prior && view === 'home' && $model.phase === 'ready' && prior.scope === focusScope() && prior.element.isConnected
        && panelGrid?.contains(prior.element) && document.activeElement === document.body && document.visibilityState === 'visible'
        && document.hasFocus() && prior.element.getClientRects().length > 0) prior.element.focus({ preventScroll: true });
  });
  onMount(controller.start);
</script>

<a class="skip-link" href="#workspace-content">Skip to content</a>
<div class="workspace-shell">
  <aside class="sidebar" aria-label="Workspace sidebar">
    <a class="brand" href="/workspace"><span class="brand-mark" aria-hidden="true">K</span><span>Keida <small>REBORN</small></span></a>
    <p class="nav-label">YOUR SPACE</p>
    <nav class="main-nav" aria-label="Workspace views">
      <button class:active={view === 'home'} aria-current={view === 'home' ? 'page' : undefined} onclick={() => navigate('home')}><span aria-hidden="true">⌂</span>Home</button>
      <button class:active={view === 'note'} aria-current={view === 'note' ? 'page' : undefined} onclick={() => navigate('note')}><span aria-hidden="true">▤</span>Workspace note<span class="draft-dot" class:visible={$model.dirty} aria-hidden="true"></span></button>
      <button class:active={view === 'connections'} aria-current={view === 'connections' ? 'page' : undefined} onclick={() => navigate('connections')}><span aria-hidden="true">◇</span>Connections</button>
      <button class:active={view === 'directory'} aria-current={view === 'directory' ? 'page' : undefined} onclick={() => navigate('directory')}><span aria-hidden="true">▦</span>Services</button>
      <button class:active={view === 'activity'} aria-current={view === 'activity' ? 'page' : undefined} onclick={() => navigate('activity')}><span aria-hidden="true">◷</span>Activity</button>
      <button class:active={view === 'notifications'} aria-current={view === 'notifications' ? 'page' : undefined} onclick={() => navigate('notifications')}><span aria-hidden="true">♧</span>Notifications{#if $model.snapshot?.notifications.unread_groups}<span class="notification-badge" aria-label={`${$model.snapshot.notifications.unread_groups} unread groups`}>{$model.snapshot.notifications.unread_groups}</span>{/if}</button>
      <button class:active={view === 'integrations'} aria-current={view === 'integrations' ? 'page' : undefined} onclick={() => navigate('integrations')}><span aria-hidden="true">⊞</span>Integrations</button>
      <button class:active={view === 'roadmap'} aria-current={view === 'roadmap' ? 'page' : undefined} onclick={() => navigate('roadmap')}><span aria-hidden="true">≡</span>Roadmap</button>
      <button class:active={view === 'media'} aria-current={view === 'media' ? 'page' : undefined} onclick={() => navigate('media')}><span aria-hidden="true">▻</span>Media</button>
      <button class:active={view === 'queues'} aria-current={view === 'queues' ? 'page' : undefined} onclick={() => navigate('queues')}><span aria-hidden="true">⇄</span>Queues</button>
      <button class:active={view === 'identity'} aria-current={view === 'identity' ? 'page' : undefined} onclick={() => navigate('identity')}><span aria-hidden="true">◎</span>Identity</button>
    </nav>
    <div class="sidebar-bottom">
      <a href="/account" class="account-link"><span class="avatar" aria-hidden="true">K</span><span><strong>{$model.snapshot?.account.username ?? 'Your account'}</strong><small>{$model.snapshot?.account.role === 'owner' ? 'Owner' : $model.snapshot?.account.role === 'member' ? 'Member' : 'Check account access'}</small></span></a>
      <button class="text-button review-sessions" data-open-sessions disabled={$model.phase !== 'ready'} aria-current={view === 'sessions' ? 'page' : undefined} onclick={() => navigate('sessions')}>Review sign-in sessions</button>
      <form id="workspace-sign-out" method="post" action="/account/sign-out" onsubmit={() => controller.signOut()}>
        <input type="hidden" name="product" value="keida-hub-reborn">
        <input type="hidden" name="contract" value="reborn-account-v1">
        <input type="hidden" name="csrf_token" value={binding}>
        <button type="submit" class="sign-out">Sign out <span aria-hidden="true">↗</span></button>
      </form>
      <details class="version"><summary>{version}<span>Build details</span></summary>
        <dl><dt>Source</dt><dd>{#if /^[a-f0-9]{40}$/.test(commit)}<a href={`https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/${commit}`} rel="noreferrer">{commit}</a>{:else}{commit}{/if}</dd><dt>Tree</dt><dd>{tree}</dd><dt>Channel</dt><dd>{channel}</dd><dt>Workspace contract</dt><dd>reborn-workspace-v1</dd></dl>
      </details>
      <div class="refresh-control"><span class="field-help">{$updates.phase === 'changed' ? 'Server changed' : $updates.phase === 'current' ? 'Page matches server' : $updates.phase === 'checking' ? 'Checking server version' : 'Page and server versions'}</span><button class="text-button refresh-open" onclick={controller.updates.review}>Review refresh</button></div>
    </div>
  </aside>
  <main id="workspace-content" class="workspace-content">
    <header class="page-header"><div><p class="eyebrow">YOUR OWN CORNER OF KEIDA</p><h1 tabindex="-1" bind:this={heading}>{view === 'home' ? 'Welcome home.' : view === 'note' ? 'A little space to think.' : view === 'connections' ? 'Your servers, at a glance.' : view === 'directory' ? 'Everything within reach.' : view === 'activity' ? 'Pick up the thread.' : view === 'notifications' ? 'Catch up at your pace.' : view === 'integrations' ? 'Make the right connections.' : view === 'media' ? 'A window into your media.' : view === 'queues' ? 'See what’s in motion.' : view === 'identity' ? 'An identity you choose.' : view === 'sessions' ? 'Your active sign-ins.' : 'See what comes next.'}</h1></div><span class="connection-state"><span aria-hidden="true">●</span>{$model.phase === 'ready' ? 'Session checked' : $model.phase === 'checking' ? 'Checking access' : 'Access paused'}</span></header>
    <p class="workspace-status" role="status">{$model.message}</p>
    <RefreshNotice control={controller.updates} inspect={controller.refreshStatus} workspaceModel={$model} />
    {#if $model.phase !== 'ready'}
      <section class="recovery card"><p class="eyebrow">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class="button-row"><a class="button primary" href="/workspace">Open workspace again</a><a class="button secondary" href="/account">Your account</a></div></section>
    {/if}
    <section class="home-view" hidden={(view !== 'home' && view !== 'directory') || $model.phase !== 'ready'} aria-label={view === 'directory' ? 'Service directory view' : 'Home'}>
      <div class="welcome-card card" hidden={view !== 'home'}><div><p class="eyebrow">MAKE YOURSELF AT HOME</p><h2>A useful place<br>to pick things up.</h2><p>Keep a thought, make a plan, or leave yourself a reminder. Your workspace note is private to your account.</p><div class="button-row"><button class="button primary" onclick={() => navigate('note')}>Open your note <span aria-hidden="true">↗</span></button><button class="text-button" onclick={() => navigate('roadmap')}>Read the Roadmap note</button></div></div><div class="orb" aria-hidden="true"><div>K</div></div></div>
      <div class="home-layout-heading" hidden={view !== 'home'}><p class="layout-status" role="status">{$model.layoutMessage || 'Your panels, in your own order.'}</p><button class="button secondary customize-home" disabled={!!$model.layoutDraft || $model.phase !== 'ready' || $model.layoutSave === 'saving'} onclick={controller.beginLayout}>Customize Home</button></div>
      <div hidden={view !== 'home'}><LayoutEditor draft={$model.layoutDraft} saved={$model.snapshot?.layout} state={$model.layoutSave} authorized={$model.phase === 'ready'} move={controller.moveLayout} toggle={controller.toggleLayout} save={controller.saveLayout} cancel={controller.cancelLayout} reset={controller.resetLayout} resolve={controller.resolveLayout} check={controller.checkLayout} /></div>
      <div class="home-grid" bind:this={panelGrid} class:services-view={view === 'directory'}>
        {#each panels as panel (panel.id)}
          <section data-home-panel={panel.id} class:card={panel.id !== 'pins'} class:small-card={panel.id !== 'pins'} class:pins-panel={panel.id === 'pins'} hidden={$model.phase !== 'ready' || (panel.id === 'pins' ? view === 'home' && !panel.visible : view !== 'home' || !panel.visible)} aria-label={panel.id === 'pins' ? 'Services' : panel.id === 'note' ? 'Workspace note shortcut' : 'Connections shortcut'}>
            {#if panel.id === 'note'}<span class="card-icon" aria-hidden="true">▤</span><h2>Your workspace note</h2><p>{$model.dirty ? 'You have an unsaved draft open.' : $model.snapshot?.note.revision !== '0' ? 'Your saved note is ready when you are.' : 'A blank page for whatever comes next.'}</p><button class="text-button" onclick={() => navigate('note')}>Keep writing <span aria-hidden="true">→</span></button>
            {:else if panel.id === 'connections'}<span class="card-icon" aria-hidden="true">◇</span><h2>Connections</h2><p>{$model.snapshot?.crafty?.configured ? 'Your enrolled Crafty observations are available in Connections.' : 'Enroll dedicated Crafty access to see your selected servers.'}</p><button class="text-button" onclick={() => navigate('connections')}>View connections <span aria-hidden="true">→</span></button>
            {:else}<Directory directory={$model.snapshot?.directory} authorized={$model.phase === 'ready'} owner={$model.snapshot?.account.role === 'owner'} compact={view === 'home'} state={$model.directorySave} message={$model.directoryMessage} browse={() => navigate('directory')} check={controller.check} edit={controller.editService} pin={controller.pins} />{/if}
          </section>
        {/each}
      </div>
    </section>
    <section class="note-view" hidden={view !== 'note' || $model.phase !== 'ready'} aria-label="Workspace note">
      <div class="note-heading"><p>A private note, available each time you sign in.</p><span class="quiet-label">{$model.dirty ? 'Unsaved changes' : 'Up to date'}</span></div>
      {#if $model.recovery}
        <section class="notice" aria-label="Draft recovery"><h2>A draft is waiting</h2><p>This browser session has an unfinished note for this account. Review it before saving.</p><div class="button-row"><button class="button secondary" onclick={controller.recover}>Recover draft</button><button class="text-button" onclick={() => controller.resolve(true)}>Discard draft</button></div></section>
      {/if}
      <form class="note-card card" onsubmit={(event) => { event.preventDefault(); void controller.save(); }}>
        <label for="workspace-note">Workspace note</label>
        <textarea id="workspace-note" name="workspace-note" maxlength="4096" spellcheck="true" aria-describedby="note-help note-size"
          value={$model.draft} oninput={(event) => controller.edit(event.currentTarget.value)} disabled={$model.phase !== 'ready'} placeholder="What would you like to come back to?"></textarea>
        <p id="note-help" class="field-help">For ordinary notes. Keep passwords, API keys and other secrets out of this space.</p>
        <div class="note-footer"><span id="note-size" class:over-limit={bytes > 4096}>{bytes} / 4096 bytes</span><button class="button primary" type="submit" disabled={!canSave}>{$model.save === 'saving' ? 'Saving…' : 'Save note'}</button></div>
      </form>
      {#if $model.storageLimited}<p class="field-help">Browser storage is unavailable. Draft recovery is limited to this open page.</p>{/if}
      {#if bytes > 4096}<p class="notice">Shorten this note to 4096 bytes before saving or leaving this page.</p>{/if}
      {#if $model.save === 'conflict'}
        <section class="notice" aria-label="Save conflict"><h2>There’s a newer saved note</h2><p>Your draft is still in the editor. Compare it with the saved version, then choose what to keep.</p><pre>{$model.snapshot?.note.body}</pre><div class="button-row"><button class="button secondary" onclick={() => controller.resolve(false)}>Keep my draft</button><button class="text-button" onclick={() => controller.resolve(true)}>Use saved note</button></div></section>
      {/if}
      {#if $model.save === 'uncertain'}<section class="notice" aria-label="Uncertain save"><h2>Check before saving again</h2><p>The previous save may have completed. Your draft has not been sent again.</p><button class="button secondary" onclick={() => controller.check()}>Check saved note</button></section>{/if}
    </section>
    <section hidden={view !== 'connections' || $model.phase !== 'ready'} aria-label="Connections"><Connections mutationState={controller.connectionMutation} history={() => { view = 'activity'; heading?.focus(); void controller.activity('connections', ''); }} {binding} overview={$model.snapshot?.crafty} owner={$model.snapshot?.account.role === 'owner'} active={view === 'connections' && $model.phase === 'ready'} refresh={controller.check} observationState={$model.observations} loadObservations={controller.observations} /></section>
    <section hidden={view !== 'activity' || $model.phase !== 'ready'} aria-label="Activity"><Activity state={$model.activity} authorized={$model.phase === 'ready'} load={controller.activity} /></section>
    <section hidden={view !== 'notifications' || $model.phase !== 'ready'} aria-label="Notifications"><Notifications value={$model.snapshot?.notifications} authorized={$model.phase === 'ready'} state={$model.notificationSave} message={$model.notificationMessage} check={controller.check} mark={controller.markNotification} /></section>
    <section hidden={(view !== 'integrations' && view !== 'roadmap') || $model.phase !== 'ready'} aria-label={view === 'roadmap' ? 'Roadmap note' : 'Integration catalog'}><Guide mode={view === 'roadmap' ? 'roadmap' : 'catalog'} state={$model.guide} authorized={$model.phase === 'ready'} retry={() => controller.loadGuide(true)} connections={() => navigate('connections')} media={() => navigate('media')} queues={() => navigate('queues')} identity={() => navigate('identity')} owner={$model.snapshot?.account.role === 'owner'} /></section>
    <section hidden={view !== 'media' || $model.phase !== 'ready'} aria-label="Media"><Media state={$model.media} owner={$model.snapshot?.account.role === 'owner'} active={view === 'media' && $model.phase === 'ready'} check={controller.checkMedia} load={controller.loadMedia} save={controller.saveMedia} /></section>
    <section hidden={view !== 'queues' || $model.phase !== 'ready'} aria-label="Queues"><Queues state={$model.queues} owner={$model.snapshot?.account.role === 'owner'} active={view === 'queues' && $model.phase === 'ready'} check={controller.checkQueues} load={controller.loadQueues} save={controller.saveQueues} /></section>
    <section hidden={view !== 'identity' || $model.phase !== 'ready'} aria-label="Identity"><Identity {binding} state={$model.identity} owner={$model.snapshot?.account.role === 'owner'} active={view === 'identity' && $model.phase === 'ready'} check={controller.checkIdentity} act={controller.identityAction} saveApplication={controller.saveDiscordApplication} /></section>
    <section hidden={view !== 'sessions' || $model.phase !== 'ready'} aria-label="Sign-in sessions"><Sessions state={$model.sessions} active={view === 'sessions' && $model.phase === 'ready'} check={controller.checkSessions} revoke={controller.revokeSession} /></section>
    <footer class="content-footer"><span>Keida Reborn</span><a href="/account">Account &amp; recovery</a></footer>
  </main>
</div>
