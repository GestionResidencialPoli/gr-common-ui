"use client";

import { SsoCallbackScreen } from "@gestionresidencial/auth-client";

/**
 * Recibe el codigo SSO de un solo uso que emite gr-auth-ui para RESIDENTE y
 * VIGILANTE (GR-151). La logica de intercambio vive en @gestionresidencial/
 * auth-client (GR-157): antes estaba duplicada aqui y en gr-admin-ui.
 */
export default function SsoCallbackPage() {
  return <SsoCallbackScreen />;
}
