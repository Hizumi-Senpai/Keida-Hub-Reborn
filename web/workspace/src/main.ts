import { mount } from 'svelte';
import App from './App.svelte';
import './workspace.css';
const target = document.getElementById('workspace-root');
const binding = document.querySelector<HTMLMetaElement>('meta[name="reborn-session-binding"]')?.content;
const contract = document.querySelector<HTMLMetaElement>('meta[name="reborn-workspace-contract"]')?.content;
if (target && binding && /^[a-f0-9]{64}$/.test(binding) && contract === 'reborn-workspace-v1') {
  target.replaceChildren();
  mount(App, { target, props: { binding } });
}
