import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// La app se publica en GitHub Pages desde la carpeta docs/ con rutas relativas.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { outDir: 'docs', emptyOutDir: true },
  worker: { format: 'es' }
});
