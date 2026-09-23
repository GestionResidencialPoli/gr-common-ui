"use client";

import { useEffect, useRef, useState } from "react";
import { authUiLoginUrl } from "@/lib/auth-ui-url";

const CSRF_COOKIE = "XSRF-TOKEN";
const CSRF_HEADER = "X-XSRF-TOKEN";

/**
 * Recibe el codigo SSO de un solo uso que emite gr-auth-ui para RESIDENTE y
 * VIGILANTE (GR-151), lo canjea desde este origen y deja al usuario con
 * sesion propia aqui. Espejo del callback de gr-admin-ui -- mismo contrato,
 * mismo backend -- salvo el destino en exito: aqui es interno (/), en
 * gr-admin-ui es su propia raiz por ser otra aplicacion.
 */

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function removeCodeFromUrl() {
  window.history.replaceState(null, "", window.location.pathname);
}

function redirectToLogin() {
  removeCodeFromUrl();
  window.location.replace(authUiLoginUrl());
}

export default function SsoCallbackPage() {
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
        const csrfResponse = await fetch("/api/v1/auth/csrf", { credentials: "include" });
        if (!csrfResponse.ok) throw new Error("Unable to initialize CSRF protection");

        const csrf = readCookie(CSRF_COOKIE);
        const response = await fetch("/api/v1/auth/sso/exchange", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(csrf ? { [CSRF_HEADER]: csrf } : {}),
          },
          body: JSON.stringify({ code }),
          credentials: "include",
        });

        if (!response.ok) throw new Error("SSO exchange failed");

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
