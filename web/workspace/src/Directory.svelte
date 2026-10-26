<script lang="ts">
  import { onDestroy, tick } from 'svelte';
  import type { Directory, Model, ServiceLink } from './controller';
  export let directory: Directory | undefined;
  export let authorized = false;
  export let owner = false;
  export let compact = false;
  export let state: Model['directorySave'];
  export let message: string;
  export let browse: () => void;
  export let check: () => Promise<void>;
  export let edit: (base: string, change: unknown) => Promise<boolean>;
  export let pin: (ids: string[]) => Promise<boolean>;
  let query = '', category = '', name = '', description = '', url = '', linkCategory = '';
  let editing = '', removing = '', base: string | undefined;
  let generation = 0;
  $: locked = state === 'saving' || state === 'uncertain' || !authorized;
  $: categories = [...new Set(directory?.services.map((s) => s.category) ?? [])].sort();
  $: services = [...directory?.services ?? []].sort((a, b) => {
    const ai = directory?.pins.indexOf(a.id) ?? -1, bi = directory?.pins.indexOf(b.id) ?? -1;
    return ai >= 0 || bi >= 0 ? (ai < 0 ? 25 : ai) - (bi < 0 ? 25 : bi) : a.name.localeCompare(b.name) || Number(BigInt(a.id) - BigInt(b.id));
  }).filter((s) => compact ? directory?.pins.includes(s.id) : (!category || s.category === category) && `${s.name} ${s.category} ${s.description}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  $: if (!authorized) clear();
  $: if (authorized && directory && base === undefined) base = directory.revision;
  function clear(): void { ++generation; query = ''; category = ''; name = ''; description = ''; url = ''; linkCategory = ''; editing = ''; removing = ''; base = undefined; }
  onDestroy(clear);
  function reset(): void { name = ''; description = ''; url = ''; linkCategory = ''; editing = ''; removing = ''; base = directory?.revision; }
  function choose(s: ServiceLink): void {
    editing = s.id; name = s.name; description = s.description; url = s.url; linkCategory = s.category; base = directory?.revision; removing = '';
    document.querySelector<HTMLInputElement>('#service-name')?.focus();
  }
  async function submit(): Promise<void> {
    if (locked || !owner || base === undefined) return;
    const epoch = generation;
    const change = { action: editing ? 'update' : 'create', ...(editing ? { id: editing } : {}), link: { name, category: linkCategory, description, url } };
    if (await edit(base, change) && authorized && epoch === generation) { await tick(); if (authorized && epoch === generation) reset(); }
  }
  function toggle(id: string): void {
    if (locked || !directory) return;
    void pin(directory.pins.includes(id) ? directory.pins.filter((v) => v !== id) : [...directory.pins, id]);
  }
  function move(id: string, offset: number): void {
    if (locked || !directory) return;
    const ids = [...directory.pins], i = ids.indexOf(id), j = i + offset;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]]; void pin(ids);
  }
  async function remove(id: string): Promise<void> {
    if (locked || !directory || !owner) return;
    const epoch = generation;
    if (await edit(directory.revision, { action: 'delete', id }) && authorized && epoch === generation) { removing = ''; if (editing === id) reset(); }
  }
</script>

<div class="directory-heading"><div><p class="eyebrow">{compact ? 'YOUR SHORTCUTS' : 'A PLACE FOR YOUR SERVICES'}</p><h2>{compact ? 'Pinned services' : 'Service directory'}</h2></div>{#if compact}<button class="text-button" onclick={browse}>Browse services <span aria-hidden="true">→</span></button>{/if}</div>
<p class="directory-status" role="status">{message}</p>
{#if state === 'uncertain' || state === 'conflict'}<section class="notice"><h3>Review the saved state</h3><p>{state === 'uncertain' ? 'Your change has not been sent again.' : 'Your edit is still in the form. Compare it with the current directory before saving.'}</p><button class="button secondary" onclick={() => void check()}>Check saved services</button></section>{/if}
{#if !compact}
  <div class="directory-filters"><div><label for="service-search">Search services</label><input id="service-search" type="search" maxlength="120" bind:value={query} placeholder="Name, category or description"></div><div><label for="service-filter">Category</label><select id="service-filter" bind:value={category}><option value="">All categories</option>{#each categories as value}<option value={value}>{value}</option>{/each}</select></div></div>
{/if}
{#if services.length === 0}
  <section class="card small-card"><h3>{compact ? 'Keep your favorites close' : directory?.services.length ? 'No matching services' : 'Your directory starts here'}</h3><p>{compact ? 'Pin services from the directory to show them on Home.' : directory?.services.length ? 'Try another search or category.' : owner ? 'Add a service below to make it available to signed-in accounts.' : 'An owner can add reviewed service links.'}</p></section>
{:else}
  <div class="directory-grid">
    {#each services as service (service.id)}
      {@const pinned = directory?.pins.includes(service.id) ?? false}
      {@const index = directory?.pins.indexOf(service.id) ?? -1}
      <article class="card small-card service-card" data-service-id={service.id}>
        <p class="eyebrow">{service.category}</p><h3><a class="service-link" href={service.url} target="_blank" rel="noopener noreferrer">{service.name}<span class="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span></a></h3>
        {#if service.description}<p>{service.description}</p>{/if}
        <p class="field-help service-address">{service.url}</p>
        <div class="button-row"><button class="button secondary pin-service" aria-pressed={pinned} aria-label={`${pinned ? 'Unpin' : 'Pin'} ${service.name}`} disabled={locked || (!pinned && (directory?.pins.length ?? 0) >= 24)} onclick={() => toggle(service.id)}>{pinned ? 'Pinned' : 'Pin to Home'}</button>
          {#if pinned}<button class="text-button move-up" aria-label={`Move ${service.name} up`} disabled={locked || index === 0} onclick={() => move(service.id, -1)}>↑</button><button class="text-button move-down" aria-label={`Move ${service.name} down`} disabled={locked || index === (directory?.pins.length ?? 0) - 1} onclick={() => move(service.id, 1)}>↓</button>{/if}
        </div>
        {#if owner && !compact}
          <div class="button-row"><button class="text-button edit-service" disabled={locked} onclick={() => choose(service)}>Edit {service.name}</button><button class="text-button remove-service" disabled={locked} onclick={() => removing = service.id}>Remove</button></div>
          {#if removing === service.id}<div class="notice"><p>Remove {service.name} from the directory and everyone’s pins?</p><div class="button-row"><button class="button secondary confirm-remove" disabled={locked} onclick={() => void remove(service.id)}>Remove service</button><button class="text-button" onclick={() => removing = ''}>Keep service</button></div></div>{/if}
        {/if}
      </article>
    {/each}
  </div>
{/if}
{#if !compact}<p class="field-help">Up to 24 personal pins. Links open the selected service in a new tab; directory links do not check its availability or share your Hub session.</p>{/if}
{#if owner && authorized}
  <section class="card directory-editor" hidden={compact} aria-label="Service editor"><h2>{editing ? 'Edit service' : 'Add a service'}</h2><p>Add a reviewed HTTPS link without passwords, tokens, query parameters or fragments. These links are visible to signed-in accounts.</p>
    <form onsubmit={(event) => { event.preventDefault(); void submit(); }}>
      <label for="service-name">Service name</label><input id="service-name" name="service-name" required maxlength="80" bind:value={name} disabled={locked}>
      <label for="service-category">Category</label><input id="service-category" name="service-category" required maxlength="40" bind:value={linkCategory} disabled={locked}>
      <label for="service-url">HTTPS link</label><input id="service-url" name="service-url" type="url" required maxlength="1024" bind:value={url} disabled={locked} placeholder="https://service.example/">
      <label for="service-description">Description, optional</label><textarea id="service-description" name="service-description" maxlength="240" rows="2" bind:value={description} disabled={locked}></textarea>
      {#if base !== undefined && directory && base !== directory.revision}<div class="notice"><p>The directory changed after this form was opened. Review the current entries, then choose whether to keep this edit.</p><button class="button secondary" type="button" disabled={locked} onclick={() => base = directory?.revision}>Keep edit against current directory</button></div>{/if}
      <div class="button-row"><button class="button primary" type="submit" disabled={locked || base !== directory?.revision}>{state === 'saving' ? 'Saving…' : editing ? 'Save service' : 'Add service'}</button><button class="text-button" type="button" disabled={locked} onclick={reset}>{editing ? 'Cancel edit' : 'Clear form'}</button></div>
    </form>
  </section>
{/if}
