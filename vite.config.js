import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // o GitHub Pages serve o site em /controle-de-gastos/
  base: '/controle-de-gastos/',
});
