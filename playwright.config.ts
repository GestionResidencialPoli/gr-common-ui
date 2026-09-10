import { defineConfig, devices } from "@playwright/test";
import { env } from "./config/env";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 2,
  use: {
    baseURL: env.e2e.baseUrl,
    channel: process.platform === "win32" ? "msedge" : "chromium",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 } },
    },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" } },
  ],
  webServer: {
    command: `pnpm dev --port ${env.e2e.port}`,
    url: `${env.e2e.baseUrl}/login`,
    reuseExistingServer: !env.isCI,
  },
});
