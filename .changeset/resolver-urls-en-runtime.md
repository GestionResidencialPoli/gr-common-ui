---
"@gestionresidencial/auth-client": patch
"@gestionresidencial/shared-ui": patch
---

authUiUrl, authUiLoginUrl y platformUrls resuelven la URL en el navegador desde
window.__RUNTIME_CONFIG__ en vez de leer process.env.NEXT_PUBLIC_* (que Next.js
hornea en build). Las apps que consuman esta version deben inyectar ese objeto
en su layout raiz y pasar las URLs como variables de entorno de contenedor
(AUTH_UI_URL, COMMON_UI_URL, ADMIN_UI_URL, WALL_UI_URL, BOOKING_UI_URL,
GATE_UI_URL, BILLING_UI_URL), ya no como ARG de build.
