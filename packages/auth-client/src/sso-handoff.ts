import { apiFetch } from "./http-client.ts";
import type { Role } from "./auth-service.ts";

export type SsoAudience = "admin" | "residente" | "vigilante";

export function ssoAudienceFor(roles: readonly Role[]): SsoAudience {
  if (roles.includes("ADMINISTRACION")) return "admin";
  if (roles.includes("VIGILANTE")) return "vigilante";
  return "residente";
}

export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return "/";
  }
  return value;
}

export async function initiateSsoHandoff(
  audience: SsoAudience,
  targetOrigin: string,
  next?: string,
): Promise<void> {
  const { code } = await apiFetch<{ code: string }>("/api/v1/auth/sso/code", {
    method: "POST",
    body: { audience },
  });

  const nextPath = safeNextPath(next);
  const nextQuery = nextPath === "/" ? "" : `&next=${encodeURIComponent(nextPath)}`;
  const callbackUrl = new URL(
    `/auth/sso/callback?code=${encodeURIComponent(code)}${nextQuery}`,
    targetOrigin,
  );
  window.location.replace(callbackUrl.toString());
}

export async function openPlatformUrl(roles: readonly Role[], url: string): Promise<void> {
  const target = new URL(url);
  try {
    await initiateSsoHandoff(
      ssoAudienceFor(roles),
      target.origin,
      `${target.pathname}${target.search}`,
    );
  } catch {
    window.location.assign(target.toString());
  }
}
