import assert from "node:assert/strict";
import { test } from "node:test";
import { createDemoAuthService, DEMO_EMAIL, DEMO_PASSWORD } from "../services/demo-auth-service.ts";

function setup() {
  const data = new Map();
  const storage = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
  };
  return { data, service: createDemoAuthService(() => storage), storage };
}

test("rejects incorrect credentials without creating a session", async () => {
  const { service, data } = setup();
  await assert.rejects(service.login({ email: DEMO_EMAIL, password: "wrong" }), {
    code: "invalid_credentials",
  });
  assert.equal(await service.getSession(), null);
  assert.equal(data.size, 0);
});

test("restores the demo session without storing the password", async () => {
  const { service, storage, data } = setup();
  const user = await service.login({
    email: ` ${DEMO_EMAIL.toUpperCase()} `,
    password: DEMO_PASSWORD,
  });
  const restoredService = createDemoAuthService(() => storage);
  assert.deepEqual(await restoredService.getSession(), user);
  assert.equal(JSON.stringify([...data.values()]).includes(DEMO_PASSWORD), false);
});

test("profile changes survive reload and cannot replace id or email", async () => {
  const { service, storage } = setup();
  await service.login({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  await service.updateProfile({
    name: "  Nuevo nombre  ",
    phone: " 555 123 ",
    email: "changed@example.com",
    id: "another",
  });
  const user = await createDemoAuthService(() => storage).getSession();
  assert.equal(user.name, "Nuevo nombre");
  assert.equal(user.phone, "555 123");
  assert.equal(user.email, DEMO_EMAIL);
  assert.equal(user.id, "demo-resident");
});

test("rejects invalid profile and updates without a session", async () => {
  const { service } = setup();
  await assert.rejects(service.updateProfile({ name: "Name", phone: "" }), {
    code: "not_authenticated",
  });
  await service.login({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  await assert.rejects(service.updateProfile({ name: "   ", phone: "" }), {
    code: "invalid_profile",
  });
  await assert.rejects(service.updateProfile({ name: "Name", phone: "0".repeat(31) }), {
    code: "invalid_profile",
  });
});

test("logout removes the session and keeps the demo profile for next login", async () => {
  const { service } = setup();
  await service.login({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  await service.updateProfile({ name: "Otro nombre", phone: "" });
  await service.logout();
  assert.equal(await service.getSession(), null);
  assert.equal(
    (await service.login({ email: DEMO_EMAIL, password: DEMO_PASSWORD })).name,
    "Otro nombre",
  );
});

test("recovers malformed stored profile", async () => {
  const { service, data } = setup();
  data.set("gr-demo-profile", "{broken");
  assert.equal(
    (await service.login({ email: DEMO_EMAIL, password: DEMO_PASSWORD })).email,
    DEMO_EMAIL,
  );
});

test("reports blocked browser storage without pretending login succeeded", async () => {
  const service = createDemoAuthService(() => {
    throw new Error("Storage blocked");
  });
  await assert.rejects(service.login({ email: DEMO_EMAIL, password: DEMO_PASSWORD }), {
    code: "storage_unavailable",
  });
  await assert.rejects(service.getSession(), { code: "storage_unavailable" });
});

test("exposes the demo apartment and role on the session", async () => {
  const { service } = setup();
  const user = await service.login({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  assert.deepEqual(user.roles, ["RESIDENTE"]);
  assert.deepEqual(user.apartment, { torre: "A", numero: "101", tipoResidente: "PROPIETARIO" });
});

test("changePassword requires a session and the correct current password", async () => {
  const { service } = setup();
  await assert.rejects(
    service.changePassword({ currentPassword: DEMO_PASSWORD, newPassword: "Otra123!" }),
    { code: "not_authenticated" },
  );
  await service.login({ email: DEMO_EMAIL, password: DEMO_PASSWORD });
  await assert.rejects(
    service.changePassword({ currentPassword: "wrong", newPassword: "Otra123!" }),
    { code: "incorrect_current_password" },
  );
  await service.changePassword({ currentPassword: DEMO_PASSWORD, newPassword: "Otra123!" });
});
