import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({ onwarn(warning) { throw new Error(`Svelte warning: ${warning.code}`); } })],
  build: {
    target: 'es2022', outDir: 'dist', emptyOutDir: true, sourcemap: false,
    cssCodeSplit: false,
    lib: { entry: 'src/main.ts', formats: ['es'], fileName: () => 'workspace.js', cssFileName: 'workspace' },
    rolldownOptions: { output: { codeSplitting: false } },
  },
});
