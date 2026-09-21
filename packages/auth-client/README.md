# @gestionresidencial/auth-client

Cliente de sesión compartido por los frontends de Gestión Residencial. Concentra todo lo que los cuatro frontends necesitan para hablar con `gr-user-microservice` sin reimplementarlo cada uno.

Existe por una razón concreta: si cada aplicación escribe su propio cliente HTTP, terminarán divergiendo. El fallo probable no es visible —una app deja de enviar `X-XSRF-TOKEN`, o pierde el reintento tras refrescar— y se manifiesta como sesiones que caen de forma intermitente.

## Instalación

```bash
pnpm add @gestionresidencial/auth-client
```

## Qué incluye

| Módulo                | Responsabilidad                                                                                                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `http-client`         | `apiFetch` con cabecera CSRF en mutaciones, reintento único tras `POST /api/v1/auth/refresh` ante 401, y aviso de expiración de sesión |
| `auth-service`        | `login`, `logout`, `getSession`, `updateProfile`, `changePassword` contra el backend real                                              |
| `auth-error`          | `AuthError` y el catálogo `AUTH_ERROR` de códigos                                                                                      |
| `auth-error-messages` | Traducción de código de error a mensaje, con respaldo                                                                                  |
| `roles`               | `homeRouteFor`: destino tras iniciar sesión, según el rol de mayor alcance                                                             |
| `session-guard`       | Decisión de acceso para el borde, sin depender de Next.js                                                                              |

## El guard de sesión

`decideSessionAccess` es una función pura: recibe la ruta y si hay cookie de sesión, y devuelve qué hacer. Cada frontend traduce la decisión a la respuesta de su framework.

```ts
import {
  ACCESS_TOKEN_COOKIE,
  HEADERS_TO_STRIP_ON_FORWARD,
  decideSessionAccess,
} from "@gestionresidencial/auth-client";

const decision = decideSessionAccess(pathname, cookies.has(ACCESS_TOKEN_COOKIE), {
  publicPaths: ["/login"],
  publicPrefixes: ["/preview"],
  loginPath: "/login",
});
// { type: "forward-to-backend" } | { type: "allow" } | { type: "redirect", to }
```

Las rutas públicas **no** viven en el paquete: cada frontend declara las suyas, porque el login y las aplicaciones de rol no comparten las mismas.

`HEADERS_TO_STRIP_ON_FORWARD` lista las cabeceras que deben eliminarse al reenviar al backend. Son las del propio origen de la página; si llegan a Spring, evalúa CORS sobre una llamada servidor a servidor y responde `403 Invalid CORS request` a toda mutación.

## Destinos por rol

```ts
import { homeRouteFor } from "@gestionresidencial/auth-client";

homeRouteFor(["ADMINISTRACION"]); // "/admin"
homeRouteFor(["RESIDENTE", "VIGILANTE"]); // "/vigilante" — gana el de mayor alcance
homeRouteFor(["RESIDENTE"], {
  RESIDENTE: "/mi-unidad",
  VIGILANTE: "/porteria",
  ADMINISTRACION: "/gestion",
});
```

Los destinos por defecto sirven mientras los tres roles comparten despliegue. Al separarse por repositorio, cada aplicación pasa los suyos.

## Restricciones de diseño

El paquete **no depende de `next`** y no importa `next/link` ni `next/navigation`. Es la condición para que sirva al login, a las tres aplicaciones de rol y a cualquier consumidor futuro que no use Next.js.

## Desarrollo

```bash
pnpm --filter @gestionresidencial/auth-client build
pnpm --filter @gestionresidencial/auth-client test
```

Las pruebas corren sobre las fuentes con el runner de Node, sin red ni navegador.

Consulta [ADR-002](../../docs/decisiones/ADR-002-distribucion-frontend.md) para la decisión de distribución y [ADR-001](../../../gr-user-microservice/docs/decisiones/ADR-001-estrategia-tokens.md) para la estrategia de tokens que este cliente implementa del lado del navegador.
