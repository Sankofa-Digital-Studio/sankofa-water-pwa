import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from .env.local if it exists.
 * See: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Test directory
  testDir: "./__tests__/e2e",

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env["CI"],

  // Retry on CI only
  retries: process.env["CI"] ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env["CI"] ? 1 : undefined,

  // Reporter to use
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
    ...(process.env["CI"] ? [["github"] as [string]] : []),
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env["PLAYWRIGHT_BASE_URL"] ?? "http://localhost:3000",

    // Collect trace when retrying the failed test
    trace: "on-first-retry",

    // Screenshot only on failure
    screenshot: "only-on-failure",

    // Video on first retry
    video: "retain-on-failure",

    // Locale & timezone for South Africa
    locale: "en-ZA",
    timezoneId: "Africa/Johannesburg",
  },

  // Configure projects for major browsers (Chromium and Microsoft Edge)
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Microsoft Edge channel configuration
    {
      name: "msedge",
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge",
      },
    },
    // Mobile viewport for PWA testing
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
    },
    // PWA offline / install scenarios can be added here
  ],

  // Output folder for test artifacts
  outputDir: "test-results/",

  // Timeout per test (ms)
  timeout: 30_000,

  // Expect timeout (ms)
  expect: {
    timeout: 5_000,
  },

  // Run your local dev server before starting the tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env["CI"],
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
