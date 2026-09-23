"use client";

import { useEffect, useRef, useState } from "react";
import { Feedback, Skeleton } from "@gestionresidencial/shared-ui";
import { apiFetch } from "@gestionresidencial/auth-client";

/**
 * No es una pantalla de administracion: es el puente hacia gr-admin-ui.
 *
 * El layout de esta ruta ya exige el rol ADMINISTRACION antes de renderizar
 * esta pagina, asi que al montar solo falta pedir un codigo SSO de un solo
 * uso para la audiencia "admin" (POST /api/v1/auth/sso/code, generalizado
 * en GR-151 a partir de GR-30) y entregarlo en el callback de gr-admin-ui.
 * Ese intercambio ocurre desde el origen de gr-admin-ui, asi que el backend
 * puede fijar ahi una cookie propia de ese origen -- las cookies de sesion
 * son host-only (ver ADR-001 en gr-user-microservice) y de otro modo nunca
 * llegarian a gr-admin-ui.
 */
export default function AdminPage() {
  const started = useRef(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function openAdministration() {
      try {
        const { code } = await apiFetch<{ code: string }>("/api/v1/auth/sso/code", {
          method: "POST",
          body: { audience: "admin" },
        });
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_UI_URL || "http://localhost:3001";
        const callbackUrl = new URL(
          `/auth/sso/callback?code=${encodeURIComponent(code)}`,
          adminUrl,
        );

        window.location.replace(callbackUrl.toString());
      } catch {
        setError(true);
      }
    }

    void openAdministration();
  }, []);

  return (
    <div className="standalone-state" aria-live="polite">
      {error ? (
        <Feedback error>No se pudo abrir Administración. Intenta nuevamente más tarde.</Feedback>
      ) : (
        <Skeleton label="Abriendo Administración..." />
      )}
    </div>
  );
}
