import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  use: {
    baseURL: "http://localhost:3001",
    headless: true,
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm run dev:agent",
    url: "http://localhost:3001",
    reuseExistingServer: true,
    timeout: 120000
  }
});
