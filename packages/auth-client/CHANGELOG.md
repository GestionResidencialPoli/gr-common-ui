# @gestionresidencial/auth-client

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
