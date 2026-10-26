<script lang="ts">
  import { onMount } from 'svelte';
  import { workspace } from './controller';
  import Connections from './Connections.svelte';
  export let binding: string;
  const controller = workspace(binding);
  const model = controller.model;
  let view: 'home' | 'note' | 'connections' = 'home';
  let heading: HTMLHeadingElement;
  const version = document.querySelector<HTMLMetaElement>('meta[name="reborn-version"]')?.content ?? 'development';
  const commit = document.querySelector<HTMLMetaElement>('meta[name="reborn-commit"]')?.content ?? 'unqualified';
  const tree = document.querySelector<HTMLMetaElement>('meta[name="reborn-tree"]')?.content ?? 'unqualified';
  const channel = document.querySelector<HTMLMetaElement>('meta[name="reborn-channel"]')?.content ?? 'development';
  $: bytes = new TextEncoder().encode($model.draft).length;
  $: canSave = $model.phase === 'ready' && $model.dirty && bytes <= 4096
    && !['saving', 'conflict', 'uncertain'].includes($model.save);
  function navigate(next: 'home' | 'note' | 'connections'): void { view = next; heading?.focus(); }
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
    </nav>
    <div class="sidebar-bottom">
      <a href="/account" class="account-link"><span class="avatar" aria-hidden="true">K</span><span><strong>{$model.snapshot?.account.username ?? 'Your account'}</strong><small>{$model.snapshot?.account.role === 'owner' ? 'Owner' : $model.snapshot?.account.role === 'member' ? 'Member' : 'Check account access'}</small></span></a>
      <form method="post" action="/account/sign-out" onsubmit={() => controller.signOut()}>
        <input type="hidden" name="product" value="keida-hub-reborn">
        <input type="hidden" name="contract" value="reborn-account-v1">
        <input type="hidden" name="csrf_token" value={binding}>
        <button type="submit" class="sign-out">Sign out <span aria-hidden="true">↗</span></button>
      </form>
      <details class="version"><summary>{version}<span>Build details</span></summary>
        <dl><dt>Source</dt><dd>{#if /^[a-f0-9]{40}$/.test(commit)}<a href={`https://github.com/Hizumi-Senpai/Keida-Hub-Reborn/commit/${commit}`} rel="noreferrer">{commit}</a>{:else}{commit}{/if}</dd><dt>Tree</dt><dd>{tree}</dd><dt>Channel</dt><dd>{channel}</dd><dt>Workspace contract</dt><dd>reborn-workspace-v1</dd></dl>
      </details>
    </div>
  </aside>
  <main id="workspace-content" class="workspace-content">
    <header class="page-header"><div><p class="eyebrow">YOUR OWN CORNER OF KEIDA</p><h1 tabindex="-1" bind:this={heading}>{view === 'home' ? 'Welcome home.' : view === 'note' ? 'A little space to think.' : 'Your servers, at a glance.'}</h1></div><span class="connection-state"><span aria-hidden="true">●</span>{$model.phase === 'ready' ? 'Session checked' : $model.phase === 'checking' ? 'Checking access' : 'Access paused'}</span></header>
    <p class="workspace-status" role="status">{$model.message}</p>
    {#if $model.phase !== 'ready'}
      <section class="recovery card"><p class="eyebrow">A CLEAR WAY BACK</p><h2>Check access to your workspace</h2><p>Your private content is hidden. Use a fresh document to check your account and recover a compatible draft.</p><div class="button-row"><a class="button primary" href="/workspace">Open workspace again</a><a class="button secondary" href="/account">Your account</a></div></section>
    {/if}
    <section class="home-view" hidden={view !== 'home' || $model.phase !== 'ready'} aria-label="Home">
      <div class="welcome-card card"><div><p class="eyebrow">MAKE YOURSELF AT HOME</p><h2>A useful place<br>to pick things up.</h2><p>Keep a thought, make a plan, or leave yourself a reminder. Your workspace note is private to your account.</p><button class="button primary" onclick={() => navigate('note')}>Open your note <span aria-hidden="true">↗</span></button></div><div class="orb" aria-hidden="true"><div>K</div></div></div>
      <div class="home-grid"><section class="card small-card"><span class="card-icon" aria-hidden="true">▤</span><h2>Your workspace note</h2><p>{$model.dirty ? 'You have an unsaved draft open.' : $model.snapshot?.note.revision !== '0' ? 'Your saved note is ready when you are.' : 'A blank page for whatever comes next.'}</p><button class="text-button" onclick={() => navigate('note')}>Keep writing <span aria-hidden="true">→</span></button></section><section class="card small-card"><span class="card-icon" aria-hidden="true">◇</span><h2>Connections</h2><p>{$model.snapshot?.crafty?.configured ? 'Your enrolled Crafty observations are available in Connections.' : 'Enroll dedicated Crafty access to see your selected servers.'}</p><button class="text-button" onclick={() => navigate('connections')}>View connections <span aria-hidden="true">→</span></button></section></div>
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
    <section hidden={view !== 'connections' || $model.phase !== 'ready'} aria-label="Connections"><Connections {binding} overview={$model.snapshot?.crafty} owner={$model.snapshot?.account.role === 'owner'} active={view === 'connections' && $model.phase === 'ready'} refresh={controller.check} /></section>
    <footer class="content-footer"><span>Keida Reborn</span><a href="/account">Account &amp; recovery</a></footer>
  </main>
</div>
