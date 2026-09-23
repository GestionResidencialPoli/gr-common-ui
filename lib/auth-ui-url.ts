/**
 * Login y recuperacion de contrasena viven en gr-auth-ui desde que existe
 * (GR-154): esta app ya no tiene su propia pagina de login.
 */
export function authUiUrl(): string {
  return process.env.NEXT_PUBLIC_AUTH_UI_URL || "http://localhost:3002";
}

export function authUiLoginUrl(): string {
  return new URL("/login", authUiUrl()).toString();
}
