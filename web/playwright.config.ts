import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90_000,
  globalTimeout: 20 * 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: 2,
  retries: 0,
  forbidOnly: true,
  reporter: [['./fixture/reporter.ts']],
  outputDir: process.env.REBORN_BROWSER_OUTPUT_DIR ?? '/tmp/keida-reborn-browser-results',
  use: {
    browserName: 'chromium',
    headless: true,
    ignoreHTTPSErrors: false,
    screenshot: 'off',
    trace: 'off',
    video: 'off',
    actionTimeout: 8_000,
    navigationTimeout: 12_000
  }
});
