import assert from "node:assert/strict";
import test from "node:test";

const {
  PROFILE_LINK,
  activeLinkId,
  activePlatformLinkId,
  platformHref,
  platformLinksFor,
  platformRoleOf,
  platformUrls,
} = await import("../src/platform/platform.ts");

const urls = {
  common: "https://inicio.ejemplo",
  admin: "https://admin.ejemplo",
  wall: "https://muro.ejemplo",
  booking: "https://reservas.ejemplo",
  gate: "https://porteria.ejemplo",
  billing: "https://finanzas.ejemplo",
};

const ids = (roles) => platformLinksFor(roles).map((link) => link.id);

test("cada rol ve la misma navegacion en todas las apps", () => {
  assert.deepEqual(ids(["RESIDENTE"]), ["inicio", "tablero", "zonas-comunes", "finanzas"]);
  assert.deepEqual(ids(["VIGILANTE"]), ["inicio", "porteria", "tablero"]);
  assert.deepEqual(ids(["ADMINISTRACION"]), [
    "inicio",
    "tablero",
    "zonas-comunes",
    "porteria",
    "apartamentos",
    "vigilantes",
    "contacto",
    "finanzas",
  ]);
});

test("quien acumula roles navega con el de mayor alcance", () => {
  assert.equal(platformRoleOf(["RESIDENTE", "ADMINISTRACION"]), "ADMINISTRACION");
  assert.equal(platformRoleOf(["RESIDENTE", "VIGILANTE"]), "VIGILANTE");
  assert.equal(platformRoleOf([]), "RESIDENTE");
});

test("los enlaces a otra app son absolutos y los de la app actual relativos", () => {
  const [inicio, tablero] = platformLinksFor(["RESIDENTE"]);

  assert.equal(platformHref(inicio, "common", urls), "/residente");
  assert.equal(platformHref(inicio, "wall", urls), "https://inicio.ejemplo/residente");
  assert.equal(platformHref(tablero, "common", urls), "https://muro.ejemplo/");
});

test("el perfil vive en common-ui para todos los roles", () => {
  assert.equal(platformHref(PROFILE_LINK, "gate", urls), "https://inicio.ejemplo/perfil");
  assert.equal(platformHref(PROFILE_LINK, "common", urls), "/perfil");
});

test("marca como activo el enlace de la app actual con la ruta mas especifica", () => {
  const admin = platformLinksFor(["ADMINISTRACION"]);

  assert.equal(activePlatformLinkId(admin, "admin", "/apartamentos/7/editar"), "apartamentos");
  assert.equal(activePlatformLinkId(admin, "admin", "/"), "inicio");
  assert.equal(activePlatformLinkId(admin, "booking", "/admin/reservas"), "zonas-comunes");
  assert.equal(
    activePlatformLinkId(platformLinksFor(["RESIDENTE"]), "common", "/perfil"),
    undefined,
  );
});

test("la subnavegacion elige la ruta mas especifica", () => {
  const sub = [
    { id: "zonas", path: "/" },
    { id: "mis-reservas", path: "/mis-reservas" },
  ];

  assert.equal(activeLinkId(sub, "/mis-reservas"), "mis-reservas");
  assert.equal(activeLinkId(sub, "/zonas/3"), "zonas");
});

test("las urls de las apps salen del entorno con respaldo local", () => {
  const previous = process.env.NEXT_PUBLIC_WALL_UI_URL;
  process.env.NEXT_PUBLIC_WALL_UI_URL = "https://muro.ejemplo";
  assert.equal(platformUrls().wall, "https://muro.ejemplo");
  delete process.env.NEXT_PUBLIC_WALL_UI_URL;
  assert.equal(platformUrls().wall, "http://localhost:3003");
  if (previous !== undefined) process.env.NEXT_PUBLIC_WALL_UI_URL = previous;
});
