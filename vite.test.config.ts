// Compilación de prueba: reemplaza Firebase por una imitación local (tests/mock).
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
const mock = (f: string) => fileURLToPath(new URL(`./tests/mock/${f}`, import.meta.url));
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: { alias: [
    { find: /^firebase\/app$/, replacement: mock('firebase-app.ts') },
    { find: /^firebase\/database$/, replacement: mock('firebase-database.ts') },
    { find: /.*\/firebase-config\.ts$/, replacement: mock('firebase-config.ts') }
  ] },
  build: { outDir: 'docs-test', emptyOutDir: true },
  worker: { format: 'es' }
});
