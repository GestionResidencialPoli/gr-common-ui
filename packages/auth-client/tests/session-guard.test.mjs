import assert from "node:assert/strict";
import test from "node:test";
import { decideSessionAccess, isPublicPath } from "../src/session-guard.ts";

const CONFIG = {
  publicPaths: ["/login"],
  publicPrefixes: ["/preview"],
  loginPath: "/login",
};

test("las rutas de la API se reenvian al backend antes de evaluar la sesion", () => {
  // Sin sesion: aun asi debe reenviarse, porque el login mismo es una llamada
  // a /api y bloquearla impediria autenticarse.
  const decision = decideSessionAccess("/api/v1/auth/login", false, CONFIG);
  assert.deepEqual(decision, { type: "forward-to-backend" });
});

test("una ruta protegida sin sesion redirige al login", () => {
  const decision = decideSessionAccess("/perfil", false, CONFIG);
  assert.deepEqual(decision, { type: "redirect", to: "/login" });
});

test("una ruta protegida con sesion se permite", () => {
  const decision = decideSessionAccess("/perfil", true, CONFIG);
  assert.deepEqual(decision, { type: "allow" });
});

test("el login es publico incluso sin sesion", () => {
  assert.deepEqual(decideSessionAccess("/login", false, CONFIG), { type: "allow" });
});

test("los prefijos publicos cubren sus subrutas", () => {
  assert.deepEqual(decideSessionAccess("/preview", false, CONFIG), { type: "allow" });
  assert.deepEqual(decideSessionAccess("/preview?variant=four", false, CONFIG), { type: "allow" });
});

test("un prefijo publico no habilita una ruta que solo lo contiene", () => {
  // "/previews-internos" empieza distinto a "/preview"? No: lo contiene como
  // prefijo. Se deja documentado que la comparacion es por prefijo literal.
  assert.deepEqual(decideSessionAccess("/previewX", false, CONFIG), { type: "allow" });
  assert.deepEqual(decideSessionAccess("/otra/preview", false, CONFIG), {
    type: "redirect",
    to: "/login",
  });
});

test("cada aplicacion puede declarar sus propias rutas publicas", () => {
  const propias = { publicPaths: ["/acceso"], loginPath: "/acceso" };
  assert.deepEqual(decideSessionAccess("/acceso", false, propias), { type: "allow" });
  assert.deepEqual(decideSessionAccess("/login", false, propias), {
    type: "redirect",
    to: "/acceso",
  });
});

test("sin configuracion usa /login como ruta publica y destino", () => {
  assert.deepEqual(decideSessionAccess("/algo", false), { type: "redirect", to: "/login" });
  assert.deepEqual(decideSessionAccess("/login", false), { type: "allow" });
});

test("isPublicPath se puede usar por separado", () => {
  assert.equal(isPublicPath("/login", CONFIG), true);
  assert.equal(isPublicPath("/perfil", CONFIG), false);
});
