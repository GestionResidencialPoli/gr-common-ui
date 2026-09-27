"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "./http-client.ts";
import { authUiLoginUrl } from "./auth-ui-url.ts";

function removeCodeFromUrl() {
  window.history.replaceState(null, "", window.location.pathname);
}

function redirectToLogin() {
  removeCodeFromUrl();
  window.location.replace(authUiLoginUrl());
}

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
