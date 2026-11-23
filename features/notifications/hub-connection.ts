const HUB_PATH = "/api/v1/notificaciones/ws";
const RECONNECT_DELAY_MS = 3000;

function websocketOrigin(): string {
  const configuredOrigin = process.env.NEXT_PUBLIC_BACKEND_WS_URL;
  if (configuredOrigin) return configuredOrigin.replace(/\/$/, "");

  const { host, protocol } = window.location;
  return `${protocol === "https:" ? "wss:" : "ws:"}//${host}`;
}

function typeOf(data: unknown): string | null {
  try {
    const event = JSON.parse(String(data)) as { type?: unknown };
    return typeof event.type === "string" ? event.type : null;
  } catch {
    return null;
  }
}

export function connectHub(ensureSession: () => Promise<unknown>, onEvent: (type: string) => void): () => void {
  let active = true;
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | undefined;

  function scheduleReconnect() {
    if (active) reconnectTimer = setTimeout(() => void connect(), RECONNECT_DELAY_MS);
  }

  async function connect() {
    try {
      await ensureSession();
      if (!active) return;

      socket = new WebSocket(`${websocketOrigin()}${HUB_PATH}`);
      socket.onmessage = (message) => {
        const type = typeOf(message.data);
        if (type) onEvent(type);
      };
      socket.onclose = scheduleReconnect;
    } catch {
      scheduleReconnect();
    }
  }

  void connect();

  return () => {
    active = false;
    clearTimeout(reconnectTimer);
    socket?.close();
  };
}
