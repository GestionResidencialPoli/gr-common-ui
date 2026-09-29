import assert from "node:assert/strict";
import test from "node:test";

const { initiateSsoHandoff, openPlatformUrl, safeNextPath, ssoAudienceFor } =
  await import("../src/sso-handoff.ts");

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
  const assigned = [];
  globalThis.window = {
    location: {
      replace: (href) => redirects.push(href),
      assign: (href) => assigned.push(href),
    },
  };

  return { calls, redirects, assigned };
}

test("pide un codigo para la audiencia dada y redirige al callback del destino", async () => {
  const stubs = withStubs(() => respondWith(200, { code: "codigo-abc" }));

  await initiateSsoHandoff("residente", "https://muro.ejemplo");

  assert.deepEqual(stubs.calls.at(-1).body, { audience: "residente" });
  assert.deepEqual(stubs.redirects, ["https://muro.ejemplo/auth/sso/callback?code=codigo-abc"]);
});

test("codifica el codigo en la url del callback", async () => {
  const stubs = withStubs(() => respondWith(200, { code: "codigo con espacios" }));

  await initiateSsoHandoff("admin", "https://admin.ejemplo");

  assert.deepEqual(stubs.redirects, [
    "https://admin.ejemplo/auth/sso/callback?code=codigo%20con%20espacios",
  ]);
});

test("conserva la ruta destino para que el callback aterrice en ella", async () => {
  const stubs = withStubs(() => respondWith(200, { code: "c1" }));

  await initiateSsoHandoff("residente", "https://inicio.ejemplo", "/perfil");

  assert.deepEqual(stubs.redirects, [
    "https://inicio.ejemplo/auth/sso/callback?code=c1&next=%2Fperfil",
  ]);
});

test("abre otra app con la audiencia del rol del usuario", async () => {
  const stubs = withStubs(() => respondWith(200, { code: "c2" }));

  await openPlatformUrl(["RESIDENTE", "ADMINISTRACION"], "https://admin.ejemplo/apartamentos");

  assert.deepEqual(stubs.calls.at(-1).body, { audience: "admin" });
  assert.deepEqual(stubs.redirects, [
    "https://admin.ejemplo/auth/sso/callback?code=c2&next=%2Fapartamentos",
  ]);
});

test("si el salto falla navega directo a la app destino", async () => {
  const stubs = withStubs(() => respondWith(500, { message: "caido" }));

  await openPlatformUrl(["VIGILANTE"], "https://porteria.ejemplo/");

  assert.deepEqual(stubs.redirects, []);
  assert.deepEqual(stubs.assigned, ["https://porteria.ejemplo/"]);
});

test("la audiencia sigue al rol de mayor alcance", () => {
  assert.equal(ssoAudienceFor(["ADMINISTRACION"]), "admin");
  assert.equal(ssoAudienceFor(["RESIDENTE", "VIGILANTE"]), "vigilante");
  assert.equal(ssoAudienceFor([]), "residente");
});

test("solo acepta rutas internas como destino", () => {
  assert.equal(safeNextPath("/perfil"), "/perfil");
  assert.equal(safeNextPath("https://malo.ejemplo"), "/");
  assert.equal(safeNextPath("//malo.ejemplo"), "/");
  assert.equal(safeNextPath("/\\malo.ejemplo"), "/");
  assert.equal(safeNextPath(null), "/");
});
