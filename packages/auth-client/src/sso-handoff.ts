import { apiFetch } from "./http-client.ts";

export type SsoAudience = "admin" | "residente" | "vigilante";

export async function initiateSsoHandoff(
  audience: SsoAudience,
  targetOrigin: string,
): Promise<void> {
  const { code } = await apiFetch<{ code: string }>("/api/v1/auth/sso/code", {
    method: "POST",
    body: { audience },
  });

  const callbackUrl = new URL(
    `/auth/sso/callback?code=${encodeURIComponent(code)}`,
    targetOrigin,
  );
  window.location.replace(callbackUrl.toString());
}
