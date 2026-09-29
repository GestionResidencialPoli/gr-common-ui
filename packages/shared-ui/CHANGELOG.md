# @gestionresidencial/shared-ui

## 0.3.1

### Patch Changes

- 66f59d4: GR-187: los errores de `Feedback error` se muestran como aviso fijo en la parte superior de la ventana (visible sin importar el scroll, tambien dentro de dialogos) con boton para cerrarlo. Se exporta `ErrorToast`.

## 0.3.0

### Minor Changes

- 73d5cc1: GR-183: shell de navegacion compartido entre los microfrontends. `shared-ui` agrega `PlatformShell`, que arma la marca, el sidebar por rol con enlaces absolutos entre apps, el menu de usuario con "Editar perfil" (siempre en gr-common-ui) y el cierre de sesion; `platformLinksFor`, `platformUrls` (lee `NEXT_PUBLIC_*_UI_URL`) y `PlatformIcon`. `AppShell` acepta `subNavigation`, `activeSubId` y `onNavigate`, y `DropdownMenu` acepta `onNavigate`. `auth-client` agrega `openPlatformUrl` y `ssoAudienceFor`; `initiateSsoHandoff` acepta una ruta destino y `SsoCallbackScreen` aterriza en ella (solo rutas internas).

## 0.2.1

### Patch Changes

- a9d4902: GR-168: validaciones de formato alineadas con el backend. `PasswordField` limita a 72 caracteres y acepta `policy` y `hint` (politica de 8-72 con minuscula, mayuscula y digito), usada por `ChangePasswordForm` con la etiqueta opcional `passwordPolicy`. `LoginForm` valida el formato del correo y `ProfileForm` el nombre y el celular colombiano (`3xxxxxxxxx` o fijo `60xxxxxxxx`). Se exportan los patrones `PERSON_NAME_PATTERN`, `EMAIL_PATTERN`, `PHONE_PATTERN`, `DOCUMENT_PATTERN`, `UNIT_CODE_PATTERN` y `PASSWORD_POLICY_PATTERN`.

## 0.2.0

### Minor Changes

- 5328ae8: Agrega componentes y tipos compartidos del muro (GR-60): `CategoriaBadge`, `PublicacionCard`, `Publicacion`/`PublicacionResumen`/`PageResult`/`CategoriaPublicacion` en `shared-ui`; `initiateSsoHandoff` en `auth-client` para que cualquier app autenticada (no solo gr-auth-ui) inicie un salto SSO hacia otra app, usado por gr-wall-ui.

## 0.1.1

### Patch Changes

- a6908e5: Verificacion de la migracion a Trusted Publishing (OIDC) para la publicacion en npm. Sin cambios de comportamiento ni de API: este changeset existe unicamente para forzar una publicacion real y confirmar que la autenticacion OIDC funciona de extremo a extremo tras retirar NPM_TOKEN (GR-144).
