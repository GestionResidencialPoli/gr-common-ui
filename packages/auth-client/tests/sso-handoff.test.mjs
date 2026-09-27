import assert from "node:assert/strict";
import test from "node:test";

const { initiateSsoHandoff } = await import("../src/sso-handoff.ts");

function respondWith(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body ?? null,
    text: async () => (body ? JSON.stringify(body) : ""),
  };
}

function withStubs(handler) {
  const calls = [];
  globalThis.document = { cookie: "" };
  globalThis.fetch = async (path, init = {}) => {
    calls.push({ path, method: init.method, body: init.body ? JSON.parse(init.body) : null });
    return handler(path);
  };

  const redirects = [];
  globalThis.window = { location: { replace: (href) => redirects.push(href) } };

  return { calls, redirects };
}

test("pide un codigo para la audiencia dada y redirige al callback del destino", async () => {
  const stubs = withStubs(() => respondWith(200, { code: "codigo-abc" }));

  await initiateSsoHandoff("residente", "https://muro.ejemplo");

  assert.deepEqual(stubs.calls.at(-1).body, { audience: "residente" });
  assert.deepEqual(stubs.redirects, [
    "https://muro.ejemplo/auth/sso/callback?code=codigo-abc",
  ]);
});

test("codifica el codigo en la url del callback", async () => {
  const stubs = withStubs(() => respondWith(200, { code: "codigo con espacios" }));

  await initiateSsoHandoff("admin", "https://admin.ejemplo");

  assert.deepEqual(stubs.redirects, [
    "https://admin.ejemplo/auth/sso/callback?code=codigo%20con%20espacios",
  ]);
});
