---
"@gestionresidencial/auth-client": patch
---

GR-169: el cebado de la cookie CSRF usa GET /api/v1/auth/csrf, publico en el gateway, en vez de /api/v1/auth/me, que sin sesion responde 401 antes de llegar al servicio y no siembra la cookie.
