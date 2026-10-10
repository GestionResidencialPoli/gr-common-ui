type RuntimeConfig = { authUiUrl?: string };

function runtimeConfig(): RuntimeConfig {
  if (typeof window === "undefined") return {};
  return (window as unknown as { __RUNTIME_CONFIG__?: RuntimeConfig }).__RUNTIME_CONFIG__ ?? {};
}

export function authUiUrl(): string {
  if (typeof window !== "undefined") {
    return runtimeConfig().authUiUrl || "http://localhost:3002";
  }
  return process.env.AUTH_UI_URL || "http://localhost:3002";
}

export function authUiLoginUrl(): string {
  return new URL("/login", authUiUrl()).toString();
}
