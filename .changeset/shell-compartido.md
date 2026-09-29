---
"@gestionresidencial/shared-ui": minor
"@gestionresidencial/auth-client": minor
---

GR-183: shell de navegacion compartido entre los microfrontends. `shared-ui` agrega `PlatformShell`, que arma la marca, el sidebar por rol con enlaces absolutos entre apps, el menu de usuario con "Editar perfil" (siempre en gr-common-ui) y el cierre de sesion; `platformLinksFor`, `platformUrls` (lee `NEXT_PUBLIC_*_UI_URL`) y `PlatformIcon`. `AppShell` acepta `subNavigation`, `activeSubId` y `onNavigate`, y `DropdownMenu` acepta `onNavigate`. `auth-client` agrega `openPlatformUrl` y `ssoAudienceFor`; `initiateSsoHandoff` acepta una ruta destino y `SsoCallbackScreen` aterriza en ella (solo rutas internas).
