---
"@gestionresidencial/auth-client": minor
---

Agrega `authUiUrl()`, `authUiLoginUrl()` y el componente `SsoCallbackScreen` (GR-157). Unifica logica que estaba duplicada, casi byte a byte, en gr-common-ui y gr-admin-ui: la URL de gr-auth-ui y la pagina de callback que canjea el codigo SSO de un solo uso emitido por GR-151. `SsoCallbackScreen` usa `apiFetch` para el intercambio en vez de reimplementar el priming manual de CSRF.
