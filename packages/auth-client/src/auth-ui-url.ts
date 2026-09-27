export function authUiUrl(): string {
  return process.env.NEXT_PUBLIC_AUTH_UI_URL || "http://localhost:3002";
}

export function authUiLoginUrl(): string {
  return new URL("/login", authUiUrl()).toString();
}
