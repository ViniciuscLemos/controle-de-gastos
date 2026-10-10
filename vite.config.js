import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site at /expense-tracker/
  base: '/expense-tracker/',
  // the Playwright tests in e2e/ run in a real browser (npm run e2e), not in vitest
  test: { exclude: ['e2e/**', 'node_modules/**'] },
});
