import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_ROLE_HOME_ROUTES, homeRouteFor } from "../src/roles.ts";

test("cada rol entra a su propio destino", () => {
  assert.equal(homeRouteFor(["ADMINISTRACION"]), "/admin");
  assert.equal(homeRouteFor(["VIGILANTE"]), "/vigilante");
  assert.equal(homeRouteFor(["RESIDENTE"]), "/residente");
});

test("quien acumula roles entra por el de mayor alcance", () => {
  assert.equal(homeRouteFor(["RESIDENTE", "ADMINISTRACION"]), "/admin");
  assert.equal(homeRouteFor(["RESIDENTE", "VIGILANTE"]), "/vigilante");
  assert.equal(homeRouteFor(["VIGILANTE", "ADMINISTRACION"]), "/admin");
});

test("sin roles cae en residente", () => {
  // El backend siempre asigna al menos un rol; el respaldo evita una pantalla
  // en blanco si alguna vez llega una sesion sin roles.
  assert.equal(homeRouteFor([]), "/residente");
});

test("cada frontend puede declarar sus propios destinos", () => {
  const propios = {
    ADMINISTRACION: "https://admin.ejemplo/inicio",
    VIGILANTE: "/porteria",
    RESIDENTE: "/mi-unidad",
  };
  assert.equal(homeRouteFor(["ADMINISTRACION"], propios), "https://admin.ejemplo/inicio");
  assert.equal(homeRouteFor(["VIGILANTE"], propios), "/porteria");
  assert.equal(homeRouteFor([], propios), "/mi-unidad");
});

test("los destinos por defecto cubren los tres roles", () => {
  assert.deepEqual(Object.keys(DEFAULT_ROLE_HOME_ROUTES).sort(), [
    "ADMINISTRACION",
    "RESIDENTE",
    "VIGILANTE",
  ]);
});
