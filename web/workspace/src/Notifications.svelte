<script lang="ts">
  import type { Notifications } from './controller';
  export let value: Notifications | undefined;
  export let authorized: boolean;
  export let state: 'idle' | 'saving' | 'uncertain';
  export let message: string;
  export let check: () => Promise<void>;
  export let mark: (category: string, through: string) => Promise<void>;
  let showRead = false;
  $: if (!authorized) showRead = false;
  $: groups = authorized ? (value?.groups ?? []).filter(g => showRead || g.unread !== '0') : [];
  const time = (v: string) => new Date(Number(v) * 1000).toLocaleString();
</script>

<div class="notification-card card">
  <div class="notification-heading"><div><p class="eyebrow">AT YOUR PACE</p><h2>Your notifications</h2></div><button class="button secondary check-notifications" disabled={!authorized || state === 'saving'} onclick={() => check()}>Check notifications</button></div>
  <p>Shared service and connection changes from other accounts, grouped together. Opening this inbox leaves them unread.</p>
  <label class="notification-filter"><input id="notification-show-read" type="checkbox" bind:checked={showRead} disabled={!authorized}> Show read groups</label>
  <p class="notification-status" role="status">{message || 'Read markers are saved to your account.'}</p>
  {#if state === 'uncertain'}<div class="notice"><h3>Check your read markers</h3><p>The change may have completed. Check notifications before marking another group read.</p></div>{/if}
  {#if groups.length === 0}<p class="notification-empty">{showRead ? 'No shared changes to show yet.' : 'You’re all caught up.'}</p>{/if}
  <ul class="notification-list">
    {#each groups as group (group.category)}
      <li data-notification-category={group.category}>
        <div><h3>{group.category === 'services' ? 'Services' : 'Connections'}</h3><p class="notification-count">{group.unread === '0' ? 'Read' : `${group.unread} unread ${group.unread === '1' ? 'change' : 'changes'}`}</p><p>{group.latest.label}</p><p class="field-help"><time datetime={new Date(Number(group.latest.occurred_at) * 1000).toISOString()}>{time(group.latest.occurred_at)}</time></p></div>
        <button class="button secondary mark-notification-read" disabled={!authorized || state !== 'idle' || group.unread === '0'} onclick={() => mark(group.category, group.revision)}>Mark {group.category === 'services' ? 'services' : 'connections'} read</button>
      </li>
    {/each}
  </ul>
</div>
