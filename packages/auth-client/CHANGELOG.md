# @gestionresidencial/auth-client

## 0.4.0

### Minor Changes

- 73d5cc1: GR-183: shell de navegacion compartido entre los microfrontends. `shared-ui` agrega `PlatformShell`, que arma la marca, el sidebar por rol con enlaces absolutos entre apps, el menu de usuario con "Editar perfil" (siempre en gr-common-ui) y el cierre de sesion; `platformLinksFor`, `platformUrls` (lee `NEXT_PUBLIC_*_UI_URL`) y `PlatformIcon`. `AppShell` acepta `subNavigation`, `activeSubId` y `onNavigate`, y `DropdownMenu` acepta `onNavigate`. `auth-client` agrega `openPlatformUrl` y `ssoAudienceFor`; `initiateSsoHandoff` acepta una ruta destino y `SsoCallbackScreen` aterriza en ella (solo rutas internas).

### Patch Changes

- Updated dependencies [73d5cc1]
  - @gestionresidencial/shared-ui@0.3.0

## 0.3.1

### Patch Changes

- 7ed769f: GR-169: el cebado de la cookie CSRF usa GET /api/v1/auth/csrf, publico en el gateway, en vez de /api/v1/auth/me, que sin sesion responde 401 antes de llegar al servicio y no siembra la cookie.
- Updated dependencies [a9d4902]
  - @gestionresidencial/shared-ui@0.2.1

## 0.3.0

### Minor Changes

- 5328ae8: Agrega componentes y tipos compartidos del muro (GR-60): `CategoriaBadge`, `PublicacionCard`, `Publicacion`/`PublicacionResumen`/`PageResult`/`CategoriaPublicacion` en `shared-ui`; `initiateSsoHandoff` en `auth-client` para que cualquier app autenticada (no solo gr-auth-ui) inicie un salto SSO hacia otra app, usado por gr-wall-ui.

### Patch Changes

- 0560be9: Quita comentarios explicativos del codigo (GR-162), sin cambios de comportamiento ni de firma publica.
- Updated dependencies [5328ae8]
  - @gestionresidencial/shared-ui@0.2.0

## 0.2.0

### Minor Changes

- ac4c586: Agrega `authUiUrl()`, `authUiLoginUrl()` y el componente `SsoCallbackScreen` (GR-157). Unifica logica que estaba duplicada, casi byte a byte, en gr-common-ui y gr-admin-ui: la URL de gr-auth-ui y la pagina de callback que canjea el codigo SSO de un solo uso emitido por GR-151. `SsoCallbackScreen` usa `apiFetch` para el intercambio en vez de reimplementar el priming manual de CSRF.

## 0.1.1

### Patch Changes

- a6908e5: Verificacion de la migracion a Trusted Publishing (OIDC) para la publicacion en npm. Sin cambios de comportamiento ni de API: este changeset existe unicamente para forzar una publicacion real y confirmar que la autenticacion OIDC funciona de extremo a extremo tras retirar NPM_TOKEN (GR-144).
- Updated dependencies [a6908e5]
  - @gestionresidencial/shared-ui@0.1.1
