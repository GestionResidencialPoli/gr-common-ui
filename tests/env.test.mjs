import assert from "node:assert/strict";
import test from "node:test";

async function loadEnv(overrides) {
  const previous = { ...process.env };
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  const loaded = await import(`../config/env.ts?cache=${Math.random()}`);
  process.env = previous;
  return loaded.env;
}

test("falls back to the local backend when the variable is absent", async () => {
  const env = await loadEnv({ BACKEND_API_URL: undefined });

  assert.equal(env.backendApiUrl, "http://localhost:8080");
});

test("reads the backend url from the environment", async () => {
  const env = await loadEnv({ BACKEND_API_URL: "https://api.ejemplo.test" });

  assert.equal(env.backendApiUrl, "https://api.ejemplo.test");
});

test("treats an empty variable as absent instead of as an empty url", async () => {
  const env = await loadEnv({ BACKEND_API_URL: "   " });

  assert.equal(env.backendApiUrl, "http://localhost:8080");
});

test("derives the e2e base url from the port when it is not set explicitly", async () => {
  const env = await loadEnv({ E2E_PORT: "4200", E2E_BASE_URL: undefined });

  assert.equal(env.e2e.baseUrl, "http://localhost:4200");
});

test("an explicit e2e base url wins over the port", async () => {
  const env = await loadEnv({ E2E_PORT: "4200", E2E_BASE_URL: "http://ci.local:9999" });

  assert.equal(env.e2e.baseUrl, "http://ci.local:9999");
});

test("reads the CI flag from its usual truthy values", async () => {
  assert.equal((await loadEnv({ CI: "1" })).isCI, true);
  assert.equal((await loadEnv({ CI: "true" })).isCI, true);
  assert.equal((await loadEnv({ CI: "TRUE" })).isCI, true);
  assert.equal((await loadEnv({ CI: undefined })).isCI, false);
  assert.equal((await loadEnv({ CI: "0" })).isCI, false);
});

test("exposes overridable e2e credentials so the suite is portable", async () => {
  const env = await loadEnv({
    E2E_USER_EMAIL: "otro@ejemplo.test",
    E2E_USER_PASSWORD: "Otra#2026",
  });

  assert.equal(env.e2e.email, "otro@ejemplo.test");
  assert.equal(env.e2e.password, "Otra#2026");
});
