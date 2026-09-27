# @gestionresidencial/shared-ui

## 0.2.0

### Minor Changes

- 5328ae8: Agrega componentes y tipos compartidos del muro (GR-60): `CategoriaBadge`, `PublicacionCard`, `Publicacion`/`PublicacionResumen`/`PageResult`/`CategoriaPublicacion` en `shared-ui`; `initiateSsoHandoff` en `auth-client` para que cualquier app autenticada (no solo gr-auth-ui) inicie un salto SSO hacia otra app, usado por gr-wall-ui.

## 0.1.1

### Patch Changes

- a6908e5: Verificacion de la migracion a Trusted Publishing (OIDC) para la publicacion en npm. Sin cambios de comportamiento ni de API: este changeset existe unicamente para forzar una publicacion real y confirmar que la autenticacion OIDC funciona de extremo a extremo tras retirar NPM_TOKEN (GR-144).
