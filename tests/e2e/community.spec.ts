import { expect, test } from "@playwright/test";
import { env } from "../../config/env";

test("login, edit profile, reload and logout", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/perfil");
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel("Correo electrónico").fill(env.e2e.email);
  await page.getByLabel("Contraseña", { exact: true }).fill("incorrecta");
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await expect(page.locator("form").getByRole("alert")).toContainText("no son correctos");

  await page.getByLabel("Contraseña", { exact: true }).fill(env.e2e.password);
  await page.getByRole("button", { name: "Mostrar" }).click();
  await expect(page.getByLabel("Contraseña", { exact: true })).toHaveAttribute("type", "text");
  await page.screenshot({ path: testInfo.outputPath("login.png"), fullPage: true });
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await expect(page.getByRole("heading", { name: "Qué bueno tenerte aquí." })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("home.png"), fullPage: true });
  await page.locator("summary[aria-label]").click();
  await page.getByRole("link", { name: "Editar perfil" }).click();
  const nombre = page.getByLabel("Nombre completo");
  const nombreRegistrado = await nombre.inputValue();
  await expect(nombre).toHaveAttribute("readonly", "");
  await expect(page.getByLabel("Correo electrónico")).toHaveAttribute("readonly", "");
  await page.getByLabel("Teléfono").fill("3015551234");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page.getByRole("status")).toContainText("se guardaron");
  await page.reload();
  await expect(page.getByLabel("Teléfono")).toHaveValue("3015551234");
  await expect(nombre).toHaveValue(nombreRegistrado);
  await page.getByLabel("Teléfono").fill("3000000000");
  await page.getByRole("button", { name: "Deshacer cambios" }).click();
  await expect(page.getByLabel("Teléfono")).toHaveValue("3015551234");
  await page.screenshot({ path: testInfo.outputPath("profile.png"), fullPage: true });
  await page.getByRole("button", { name: "Cerrar sesión" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  expect(errors).toEqual([]);
});

test("both home configurations render without overflow", async ({ page }, testInfo) => {
  await page.goto("/preview");
  await expect(page.locator(".gr-module")).toHaveCount(3);
  await page.getByRole("link", { name: "Cuatro módulos" }).click();
  await expect(page.locator(".gr-module")).toHaveCount(4);
  await expect(page.getByRole("heading", { name: "Parqueaderos" })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
  await page.screenshot({ path: testInfo.outputPath("preview-four.png"), fullPage: true });
});

test("module destinations and unknown routes give honest states", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(env.e2e.email);
  await page.getByLabel("Contraseña", { exact: true }).fill(env.e2e.password);
  await page.getByRole("button", { name: "Iniciar sesión" }).click();
  await expect(page.getByRole("heading", { name: "Qué bueno tenerte aquí." })).toBeVisible();
  await page.locator(".gr-module").first().click();
  await expect(page.getByRole("heading", { name: "Este espacio está por llegar" })).toBeVisible();
  await page.getByRole("link", { name: "Volver al inicio" }).click();
  await expect(page.getByRole("heading", { name: "Qué bueno tenerte aquí." })).toBeVisible();
  await page.goto("/modulos/no-existe");
  await expect(page.getByRole("heading", { name: "Esta página no existe" })).toBeVisible();
});
