import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const roles = await import("../lib/roles.ts");
const adminPage = await readFile(new URL("../app/admin/page.tsx", import.meta.url), "utf8");

test("ADMINISTRACION usa /admin como ruta local de inicio", () => {
  assert.equal(roles.homeRouteFor(["ADMINISTRACION"]), "/admin");
});

test("/admin emite una vez el código SSO y redirige al callback del Admin", () => {
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
