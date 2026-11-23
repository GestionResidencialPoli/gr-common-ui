"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@gestionresidencial/auth-client";
import { connectHub } from "./hub-connection";

const MESSAGES: Record<string, string> = {
  "post.created": "La administración publicó una nueva comunicación en el tablero.",
  "contacto.creado": "Hay una nueva solicitud de contacto.",
  "usuario.contrasena-actualizada": "La contraseña de tu cuenta cambió. Si no fuiste tú, avisa a la administración.",
};

export function HubNotificationListener() {
  const [types, setTypes] = useState<string[]>([]);

  useEffect(
    () =>
      connectHub(
        () => apiFetch("/api/v1/auth/me"),
        (type) => {
          if (type in MESSAGES) setTypes((current) => [...current.filter((item) => item !== type), type]);
        },
      ),
    [],
  );

  return types.map((type) => (
    <div key={type} className="gr-feedback" role="status">
      <span>{MESSAGES[type]}</span>
      <button
        type="button"
        className="gr-feedback-close"
        aria-label="Cerrar aviso"
        onClick={() => setTypes((current) => current.filter((item) => item !== type))}
      >
        ×
      </button>
    </div>
  ));
}
