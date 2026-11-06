import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// every page is its own HTML file
const pages = ['index', 'about', 'work', 'process', 'playground', 'contact', 'garmin-sense', 'medimate', 'spotify-lingo', 'moodie'];

export default defineConfig({
  base: './',
  css: { preprocessorOptions: { scss: { api: 'modern-compiler' } } },
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map(p => [p, resolve(__dirname, `${p}.html`)])),
    },
  },
});
