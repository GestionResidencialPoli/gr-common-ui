# @gestionresidencial/shared-ui

## 0.2.1

### Patch Changes

- a9d4902: GR-168: validaciones de formato alineadas con el backend. `PasswordField` limita a 72 caracteres y acepta `policy` y `hint` (politica de 8-72 con minuscula, mayuscula y digito), usada por `ChangePasswordForm` con la etiqueta opcional `passwordPolicy`. `LoginForm` valida el formato del correo y `ProfileForm` el nombre y el celular colombiano (`3xxxxxxxxx` o fijo `60xxxxxxxx`). Se exportan los patrones `PERSON_NAME_PATTERN`, `EMAIL_PATTERN`, `PHONE_PATTERN`, `DOCUMENT_PATTERN`, `UNIT_CODE_PATTERN` y `PASSWORD_POLICY_PATTERN`.

## 0.2.0

### Minor Changes

- 5328ae8: Agrega componentes y tipos compartidos del muro (GR-60): `CategoriaBadge`, `PublicacionCard`, `Publicacion`/`PublicacionResumen`/`PageResult`/`CategoriaPublicacion` en `shared-ui`; `initiateSsoHandoff` en `auth-client` para que cualquier app autenticada (no solo gr-auth-ui) inicie un salto SSO hacia otra app, usado por gr-wall-ui.

## 0.1.1

### Patch Changes

- a6908e5: Verificacion de la migracion a Trusted Publishing (OIDC) para la publicacion en npm. Sin cambios de comportamiento ni de API: este changeset existe unicamente para forzar una publicacion real y confirmar que la autenticacion OIDC funciona de extremo a extremo tras retirar NPM_TOKEN (GR-144).
