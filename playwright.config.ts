import { defineConfig, devices } from '@playwright/test';
import { AUTH_FILE } from './tests/test-data';

/**
 * Playwright configuration for the Sauce Demo test suite.
 *
 * Project layout:
 *  - `setup`        logs in through the UI once and saves the auth state.
 *  - `logged-out`   runs the login tests with NO stored session (they exercise
 *                   the real login flow, including negative cases).
 *  - `authenticated` runs the cart / checkout tests, reusing the saved auth
 *                   state so they don't repeat the login every time.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'html',

  use: {
    baseURL: 'https://www.saucedemo.com',
    // Sauce Demo exposes stable `data-test` hooks, so point getByTestId at them.
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'logged-out',
      testMatch: /login\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        // Login is the behaviour under test, so never start authenticated —
        // stated explicitly so a future global storageState can't leak in.
        storageState: undefined,
      },
    },
    {
      name: 'authenticated',
      testMatch: /(cart|checkout)\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,
      },
    },
  ],
});
