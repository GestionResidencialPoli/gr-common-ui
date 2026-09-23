import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { homeRouteFor } from "@gestionresidencial/auth-client";
import { redirectToHome } from "../lib/redirect-to-home.ts";

const adminPage = await readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8");

test("ADMINISTRACION usa /admin como ruta interna de esta app", () => {
  // "Interna" es la clave: /admin sigue viviendo aqui como lanzador. El
  // salto real hacia gr-admin-ui ocurre dentro de esa pagina, no aqui.
  assert.equal(homeRouteFor(["ADMINISTRACION"]), "/admin");
});

test("redirectToHome navega dentro de la app para un destino interno", () => {
  const calls = [];
  redirectToHome(["ADMINISTRACION"], (href) => calls.push(href));
  assert.deepEqual(calls, ["/admin"]);
});

test("/admin emite una vez el código SSO y redirige al callback de gr-admin-ui", () => {
  assert.match(adminPage, /const started = useRef\(false\)/);
  assert.match(adminPage, /if \(started\.current\) return/);
  assert.match(adminPage, /started\.current = true/);
  assert.match(
    adminPage,
    /apiFetch<\{ code: string \}>\("\/api\/v1\/auth\/admin-sso\/code", \{\s*method: "POST",\s*\}\)/s,
  );
  assert.match(adminPage, /\/auth\/sso\/callback\?code=\$\{encodeURIComponent\(code\)\}/);
  assert.match(adminPage, /window\.location\.replace\(callbackUrl\.toString\(\)\)/);
});

test("/admin muestra un error sin volver a emitir ni navegar cuando falla", () => {
  assert.match(adminPage, /catch \{\s*setError\(true\);\s*\}/s);
  assert.match(adminPage, /error \? \(/);
  assert.doesNotMatch(adminPage, /setTimeout|setInterval/);
});
