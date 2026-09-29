import assert from "node:assert/strict";
import test from "node:test";

const { apiFetch, ApiClientError, onSessionExpired } = await import("../src/http-client.ts");

function respondWith(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body ?? null,
    text: async () => (body ? JSON.stringify(body) : ""),
  };
}

function withStubs(cookie, handler) {
  const calls = [];
  globalThis.document = { cookie };
  globalThis.fetch = async (path, init = {}) => {
    calls.push({ path, method: (init.method ?? "GET").toUpperCase(), headers: init.headers });
    return handler(path, init);
  };
  return calls;
}

test("un 401 de login no se anuncia como sesion expirada", async () => {
  const calls = withStubs("XSRF-TOKEN=abc", () => respondWith(401, { message: "credenciales" }));
  let expired = 0;
  const stop = onSessionExpired(() => (expired += 1));

  await assert.rejects(
    () => apiFetch("/api/v1/auth/login", { method: "POST", body: { email: "a@b.c" } }),
    (error) => error instanceof ApiClientError && error.status === 401,
  );

  stop();
  assert.equal(expired, 0);
  assert.deepEqual(
    calls.map((call) => call.path),
    ["/api/v1/auth/login"],
  );
});

test("un 401 de un recurso protegido intenta refrescar y luego anuncia la expiracion", async () => {
  const calls = withStubs("XSRF-TOKEN=abc", () => respondWith(401, null));
  let expired = 0;
  const stop = onSessionExpired(() => (expired += 1));

  await assert.rejects(() => apiFetch("/api/v1/apartments"));

  stop();
  assert.equal(expired, 1);
  assert.deepEqual(
    calls.map((call) => `${call.method} ${call.path}`),
    ["GET /api/v1/apartments", "POST /api/v1/auth/refresh"],
  );
});

test("un error temporal del refresh no anuncia el cierre de sesion", async () => {
  const calls = withStubs("XSRF-TOKEN=abc", (path) => {
    if (path === "/api/v1/auth/refresh") return respondWith(429, null);
    return respondWith(401, null);
  });
  let expired = 0;
  const stop = onSessionExpired(() => (expired += 1));

  await assert.rejects(
    () => apiFetch("/api/v1/apartments"),
    (error) => error instanceof ApiClientError && error.status === 401,
  );

  stop();
  assert.equal(expired, 0);
  assert.deepEqual(
    calls.map((call) => `${call.method} ${call.path}`),
    ["GET /api/v1/apartments", "POST /api/v1/auth/refresh"],
  );
});

test("dos 401 concurrentes comparten la rotacion del refresh token", async () => {
  let refreshCalls = 0;
  let resourceCalls = 0;
  const calls = withStubs("XSRF-TOKEN=abc", async (path) => {
    if (path === "/api/v1/auth/refresh") {
      refreshCalls += 1;
      await new Promise((resolve) => setTimeout(resolve, 5));
      return respondWith(204, null);
    }
    resourceCalls += 1;
    return resourceCalls <= 2 ? respondWith(401, null) : respondWith(200, { ok: true });
  });
  let expired = 0;
  const stop = onSessionExpired(() => (expired += 1));

  const results = await Promise.all([
    apiFetch("/api/v1/apartments"),
    apiFetch("/api/v1/apartments"),
  ]);

  stop();
  assert.deepEqual(results, [{ ok: true }, { ok: true }]);
  assert.equal(refreshCalls, 1);
  assert.equal(expired, 0);
  assert.deepEqual(
    calls.map((call) => `${call.method} ${call.path}`),
    [
      "GET /api/v1/apartments",
      "GET /api/v1/apartments",
      "POST /api/v1/auth/refresh",
      "GET /api/v1/apartments",
      "GET /api/v1/apartments",
    ],
  );
});

test("una peticion mutante siembra la cookie CSRF antes de enviar la cabecera", async () => {
  let cookie = "";
  const calls = withStubs(cookie, (path) => {
    if (path === "/api/v1/auth/csrf") {
      globalThis.document.cookie = "XSRF-TOKEN=sembrado";
      return respondWith(204, null);
    }
    return respondWith(204, null);
  });
  const stop = onSessionExpired(() => undefined);

  await apiFetch("/api/v1/auth/logout", { method: "POST" });

  stop();
  assert.deepEqual(
    calls.map((call) => `${call.method} ${call.path}`),
    ["GET /api/v1/auth/csrf", "POST /api/v1/auth/logout"],
  );
  assert.equal(calls[1].headers.get("X-XSRF-TOKEN"), "sembrado");
});
