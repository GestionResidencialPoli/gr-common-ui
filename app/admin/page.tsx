"use client";

import { useEffect, useRef, useState } from "react";
import { Feedback, Skeleton } from "@gr/shared-ui";
import { apiFetch } from "@/lib/http-client";

export default function AdminPage() {
  const started = useRef(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function openAdministration() {
      try {
        const { code } = await apiFetch<{ code: string }>("/api/v1/auth/admin-sso/code", {
          method: "POST",
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
