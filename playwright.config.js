import { defineConfig, devices } from '@playwright/test';

// End to end tests: a real browser clicking through the built app (npm run build first).
const PORT = 4320;
const URL = `http://localhost:${PORT}/expense-tracker/`;

export default defineConfig({
  testDir: 'e2e',
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { baseURL: URL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ].map((project) => ({
    ...project,
    // locally it uses the Edge that is already installed instead of downloading Chromium
    use: { ...project.use, channel: process.env.CI ? undefined : 'msedge' },
  })),
  webServer: {
    command: `npx vite preview --port ${PORT} --strictPort`,
    url: URL,
    reuseExistingServer: false,
  },
});
