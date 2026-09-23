# ADR-002: Distribución de la biblioteca compartida y composición de micro-frontends

- **Estado**: propuesta (pendiente de aprobación del equipo)
- **Relacionado**: GR-133 (este ADR), GR-134 (empaquetado), GR-135 (`auth-client`), GR-136 (publicación)
- **Depende de**: [ADR-001](../../../gr-user-microservice/docs/decisiones/ADR-001-estrategia-tokens.md) — estrategia de tokens de sesión

## Contexto

`gr-common-ui` contiene hoy dos cosas a la vez: la biblioteca de componentes `@gr/shared-ui` y una aplicación Next.js con las rutas de los tres roles (`app/residente`, `app/vigilante`, `app/admin`) más el login. El equipo quiere separar cada rol en su propio repositorio y agregar un repositorio dedicado al login, de modo que cada frontend se despliegue por separado y consuma los mismos componentes.

Eso plantea dos preguntas independientes que conviene no mezclar:

1. **Empaquetado**: ¿cómo obtiene cada repositorio el `Button`, el `AppShell` y el resto de la biblioteca?
2. **Composición**: ¿cómo se presentan cuatro aplicaciones desplegadas por separado como un solo sitio?

La segunda pregunta está condicionada por una restricción que ya existe en el backend y que no es negociable sin tocar ADR-001.

### La restricción de cookies

La sesión viaja en cookies emitidas por `gr-user-microservice`:

```properties
app.security.cookie.same-site=Strict          # fijo, no configurable por entorno
app.security.cookie.access-token-name=access_token
app.security.cookie.refresh-token-name=refresh_token
app.security.cookie.refresh-token-path=/api/v1/auth
```

`CookieProperties` no expone un atributo `domain`, por lo que las cookies son **host-only**: el navegador solo las envía al host exacto que las recibió.

Hoy eso funciona porque el navegador ve un único origen. `next.config.ts` reescribe `/api/v1/*` hacia `BACKEND_API_URL` del lado del servidor y `proxy.ts` limpia `Origin` y `Referer`, así que desde el navegador todo vive en el mismo sitio.

Si cada frontend se despliega en su propio host (`login.ejemplo`, `residente.ejemplo`, `admin.ejemplo`), el login autenticaría correctamente, el backend emitiría la cookie para el host del login, y al redirigir al rol **el navegador no enviaría esa cookie**. La persona vería un login exitoso seguido de una sesión inexistente. La documentación del repositorio ya advierte este punto en `docs/architecture.md` §9: _"Compartir componentes de login no comparte automáticamente una sesión entre dominios."_

## Alternativas evaluadas

### Empaquetado

| #   | Alternativa                               | Costo                  | Instalación sin token                             | Sobrecarga por cambio                     | Consistencia entre apps |
| --- | ----------------------------------------- | ---------------------- | ------------------------------------------------- | ----------------------------------------- | ----------------------- |
| 1   | Monorepo con workspaces de pnpm           | 0                      | N/A                                               | Un solo PR                                | Total                   |
| 2   | Registro npm público (npmjs.com)          | 0                      | Sí                                                | Versión + publicación + PR por consumidor | Total, versionada       |
| 3   | GitHub Packages                           | 0                      | **No** — exige token incluso en paquetes públicos | Igual que 2                               | Total, versionada       |
| 4   | Registro autoalojado (Verdaccio)          | Infraestructura propia | Sí                                                | Igual que 2                               | Total, versionada       |
| 5   | Dependencia de Git por etiqueta           | 0                      | Sí                                                | Etiqueta + PR por consumidor              | Sin rangos semver       |
| 6   | Tarball (`pnpm pack`)                     | 0                      | Sí                                                | Manual, se desincroniza                   | Nula en la práctica     |
| 7   | Registro de código fuente (estilo shadcn) | 0                      | Sí                                                | Copiar a mano en cada repositorio         | Diverge por diseño      |

### Composición

| #   | Alternativa                           | Costo                                  | Un solo origen | Acopla el alojamiento            |
| --- | ------------------------------------- | -------------------------------------- | -------------- | -------------------------------- |
| A   | Next.js Multi-Zones                   | 0                                      | Sí             | No                               |
| B   | Vercel Microfrontends                 | Con cargo al superar el nivel gratuito | Sí             | Sí, obliga a desplegar en Vercel |
| C   | Proxy inverso propio (nginx, Traefik) | 0                                      | Sí             | No                               |
| D   | Module Federation                     | 0                                      | No por sí solo | No                               |
| E   | Mantener una sola aplicación          | 0                                      | Sí             | No                               |

## Decisión

**Empaquetado: alternativa 2.** La biblioteca se publica como paquete npm público en npmjs.com bajo el scope `@gestionresidencial`, dividida en dos paquetes:

- `@gestionresidencial/shared-ui` — componentes de presentación.
- `@gestionresidencial/auth-client` — cliente HTTP, servicio de autenticación, mapeo de errores, roles y guard de sesión.

**Composición: alternativa A.** Los frontends se componen con Next.js Multi-Zones detrás de **un único origen**, con rutas por trayecto (`/login`, `/residente`, `/vigilante`, `/admin`), cada aplicación con su propio `basePath` y `assetPrefix`.

En consecuencia, **ADR-001 no se modifica**: `SameSite=Strict` se mantiene, no se agrega atributo `Domain` y no se introduce un mecanismo de autenticación paralelo.

## Por qué no las otras alternativas

**Empaquetado**

- **Alternativa 1 (monorepo)** es la de menor costo total y sigue permitiendo despliegues independientes: un monorepo no implica un despliegue monolítico. Se descarta solo porque el equipo decidió un repositorio por rol; si esa decisión se revisara, esta sería la opción recomendada. El costo real de no elegirla es la sobrecarga de entrega: con la regla de dos aprobaciones, un cambio en un componente exige un PR en la biblioteca más un PR de actualización en cada consumidor.
- **Alternativa 3 (GitHub Packages)** se descarta por fricción de consumo. La documentación de GitHub indica que se requiere un token de acceso personal para instalar paquetes públicos, privados e internos. Con repositorios públicos y un contexto académico, obligar a quien clone el proyecto a crear un token y un `.npmrc` antes de que `pnpm install` funcione es un costo innecesario.
- **Alternativa 4 (Verdaccio)** se descarta por operación: exige alojar y mantener un registro propio para un equipo de tres personas, sin ventaja sobre un registro público dado que los repositorios ya son públicos.
- **Alternativa 5 (dependencia de Git)** se descarta como destino final porque no admite rangos semver ni distribución construida; sirve como puente si la publicación se retrasa.
- **Alternativa 6 (tarball)** es la que documenta hoy `docs/architecture.md` §9. Se descarta para uso continuo: es manual y se desincroniza en cuanto hay más de un consumidor.
- **Alternativa 7 (registro de código fuente)** se descarta porque su ventaja —que cada app pueda divergir— es justamente lo contrario del objetivo. Corregir el `Button` exigiría volver a copiarlo en cuatro repositorios.

**Composición**

- **Alternativa B (Vercel Microfrontends)** resuelve el problema con elegancia pero condiciona el alojamiento a Vercel y tiene cargo al superar el nivel gratuito. El despliegue previsto es Jenkins sobre un servidor propio, así que no aplica.
- **Alternativa C (proxy inverso)** es equivalente en resultado y compatible con el despliegue previsto. No se descarta: es el mecanismo que materializa el origen único en producción. Multi-Zones y proxy inverso se complementan, no compiten.
- **Alternativa D (Module Federation)** se descarta por dos motivos. Primero, no resuelve por sí sola el origen único, que es la restricción real. Segundo, su soporte para App Router y Turbopack en Next.js 16 no es maduro; `@module-federation/nextjs-mf` ha ido por detrás de las versiones recientes de Next.js.
- **Alternativa E (una sola aplicación)** sigue siendo defendible al tamaño actual del proyecto y es el punto de partida. Se descarta porque el equipo quiere propiedad separada por rol.

## Consecuencias

- Los paquetes se publican **públicos y de forma permanente**. npm no permite despublicar una versión después de 72 horas, solo marcarla como obsoleta. El scope se elige una sola vez.
- Cada paquete debe declarar `files` para que solo se publique `dist/`. Ningún `.env`, dato semilla ni credencial puede viajar en el tarball.
- La biblioteca **no debe importar `next/link` ni `next/navigation`**. Recibe `href` como texto y devuelve eventos mediante callbacks, tal como ya hace `LoginForm` con `onSubmit`. Así el login y cualquier consumidor futuro que no use Next.js pueden usarla.
- `react` y `react-dom` se mantienen como `peerDependencies` para que no se dupliquen en el árbol de dependencias del consumidor.
- Las versiones de Next.js y React deben fijarse de forma central. Ya existe desviación: `gr-common-ui` usa `next@16.3.4` y `gr-admin-ui` usa `next@16.3.5`.
- Un cambio en la biblioteca implica publicar una versión y abrir un PR de actualización en cada consumidor. Con dos aprobaciones obligatorias, conviene agrupar cambios en lugar de publicar por cada ajuste menor.
- En producción, el origen único exige HTTPS: `COOKIE_SECURE=true` impide que el navegador almacene la cookie sobre `http://`. Sobre un servidor propio esto implica un certificado válido, no una dirección IP desnuda.
- `proxy.ts` deja de ser un archivo por aplicación copiado a mano: su lógica de guard pasa a `@gestionresidencial/auth-client` y cada app la invoca con sus propias rutas públicas.

## Impacto en decisiones existentes

- **ADR-001 no cambia.** La decisión de un solo origen se toma precisamente para no tener que relajar `SameSite` ni agregar `Domain`. Si en el futuro el equipo optara por subdominios, ADR-001 debe modificarse **antes** de escribir código, según la regla de `AGENTS.md`.
- `docs/architecture.md` §9 describe el tarball como mecanismo de consumo entre repositorios. Queda reemplazado por este ADR y debe actualizarse cuando GR-136 publique los paquetes.
