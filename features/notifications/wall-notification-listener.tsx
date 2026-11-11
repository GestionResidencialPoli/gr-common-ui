"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@gestionresidencial/auth-client";

const EVENTS_PATH = "/api/v1/publicaciones/eventos";

function websocketOrigin(): string {
  const configuredOrigin = process.env.NEXT_PUBLIC_BACKEND_WS_URL;
  if (configuredOrigin) return configuredOrigin.replace(/\/$/, "");

  const { host, protocol } = window.location;
  return `${protocol === "https:" ? "wss:" : "ws:"}//${host}`;
}

export function WallNotificationListener() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let active = true;
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

    async function connect() {
      try {
        const { payload } = await apiFetch<{ payload: { ticket: string } }>(`${EVENTS_PATH}/ticket`);
        if (!active) return;

        const url = new URL(`${websocketOrigin()}${EVENTS_PATH}/ws`);
        url.searchParams.set("ticket", payload.ticket);
        socket = new WebSocket(url.toString());
        socket.onmessage = (message) => {
          try {
            const event = JSON.parse(message.data) as { type?: string };
            if (event.type === "post.created") setVisible(true);
          } catch {
            return;
          }
        };
        socket.onclose = () => {
          if (active) reconnectTimer = setTimeout(() => void connect(), 3000);
        };
      } catch {
        if (active) reconnectTimer = setTimeout(() => void connect(), 3000);
      }
    }

    void connect();
    return () => {
      active = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="gr-feedback" role="status">
      <span>La administración publicó una nueva comunicación en el tablero.</span>
      <button type="button" className="gr-feedback-close" aria-label="Cerrar aviso" onClick={() => setVisible(false)}>
        ×
      </button>
    </div>
  );
}
