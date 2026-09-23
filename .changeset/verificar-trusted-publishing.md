---
"@gestionresidencial/shared-ui": patch
"@gestionresidencial/auth-client": patch
---

Verificacion de la migracion a Trusted Publishing (OIDC) para la publicacion en npm. Sin cambios de comportamiento ni de API: este changeset existe unicamente para forzar una publicacion real y confirmar que la autenticacion OIDC funciona de extremo a extremo tras retirar NPM_TOKEN (GR-144).
