"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "./http-client";
import { authUiLoginUrl } from "./auth-ui-url";

function removeCodeFromUrl() {
  window.history.replaceState(null, "", window.location.pathname);
}

function redirectToLogin() {
  removeCodeFromUrl();
  window.location.replace(authUiLoginUrl());
}

/**
 * Recibe el codigo SSO de un solo uso que emite gr-auth-ui (GR-151), lo
 * canjea desde el origen actual y deja al usuario con sesion propia aqui.
 * Mismo contrato y mismo backend en todos los frontends que la consumen
 * (GR-155/GR-156): antes vivia duplicada, byte a byte, en cada app.
 */
export function SsoCallbackScreen() {
  const started = useRef(false);
  const [message, setMessage] = useState("Completando el inicio de sesión…");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = new URLSearchParams(window.location.search).get("code")?.trim();
    if (!code) {
      redirectToLogin();
      return;
    }

    async function exchangeCode() {
      try {
        await apiFetch("/api/v1/auth/sso/exchange", { method: "POST", body: { code } });
        removeCodeFromUrl();
        window.location.replace("/");
      } catch {
        setMessage("No fue posible completar el inicio de sesión. Redirigiendo al acceso…");
        redirectToLogin();
      }
    }

    void exchangeCode();
  }, []);

  return (
    <main className="standalone-state" aria-live="polite">
      <p>{message}</p>
    </main>
  );
}
