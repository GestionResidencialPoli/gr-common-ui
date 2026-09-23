# Contribuir a la biblioteca compartida

Guía para agregar o cambiar algo en `@gestionresidencial/shared-ui` o `@gestionresidencial/auth-client` desde cualquier repositorio del equipo: `gr-common-ui`, `gr-admin-ui`, y los que vengan después (residente, vigilante, login).

Si tu cambio es específico de una sola aplicación —una pantalla, un texto, una ruta— no necesitas esta guía: eso vive en el repositorio de esa app, no en la biblioteca.

## Dónde va un cambio

Tres sitios posibles. En este orden de preferencia:

```
¿Otro repositorio va a necesitar esto también?
│
├─ No, es propio de esta app (un texto, una página, una ruta)
│   → queda en la app, no toca la biblioteca
│
├─ Sí, y es presentación (un componente visual, un formulario, un layout)
│   → packages/shared-ui
│
└─ Sí, y es sesión/red (autenticación, llamadas HTTP, roles, guard de rutas)
    → packages/auth-client
```

Regla práctica: si al escribirlo usas `useState`, JSX y CSS, probablemente es `shared-ui`. Si usas `fetch`, cookies o roles, probablemente es `auth-client`. `auth-client` ya depende de `shared-ui` solo por tipos (`Profile`, `LoginValues`, …), nunca al revés.

### Ejemplos reales del repositorio

| Cambio                                                                | Dónde                                                              | Por qué                                                                      |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Un nuevo estado visual para `Button` (por ejemplo `variant="danger"`) | `packages/shared-ui/src/components/primitives.tsx`                 | Presentación pura, cualquier app lo puede necesitar                          |
| Un campo nuevo en el formulario de perfil                             | `packages/shared-ui/src/profile/profile-form.tsx`                  | Ya existe ahí; extiende el componente, no lo dupliques en tu app             |
| Soportar un nuevo código de error del backend                         | `packages/auth-client/src/auth-error.ts`                           | Es contrato de red, no presentación                                          |
| Cambiar a qué ruta va cada rol tras iniciar sesión                    | Se pasa por parámetro a `homeRouteFor`, **no se edita el paquete** | `homeRouteFor` ya acepta un mapa de rutas propio de cada app — ver su README |
| El texto "Bienvenido" en la pantalla de inicio de `gr-admin-ui`       | `gr-admin-ui`, no aquí                                             | Específico de una app                                                        |

## Cómo agregar un componente a `shared-ui`

1. Créalo en `packages/shared-ui/src/`, en la carpeta que corresponda (`components/`, `auth/`, `profile/`, `layout/`, `home/`, `navigation/`).
2. Recibe sus datos por props — **nunca hardcodees textos, colores de marca ni rutas**. Compáralo con `AppShell` o `HomePage`: reciben `brand`, `labels`, `navigation` completos desde afuera.
3. No importes `next/link` ni `next/navigation`. Recibe `href` como texto y comunica eventos por callbacks (`onSubmit`, `onClick`), como hace `LoginForm`. Es la única forma de que sirva al login y a las apps de rol por igual, usen Next.js o no.
4. Si usa hooks de React (`useState`, `useEffect`) o maneja eventos del navegador, necesita `"use client"` al principio del archivo. Si es puramente presentacional sin estado, no lo agregues — el build preserva esa distinción archivo por archivo (ver más abajo).
5. Expórtalo desde `packages/shared-ui/src/index.ts`.
6. Si agrega estilos, usa clases con prefijo `gr-` y variables CSS (`var(--color-action)`, etc.) en `src/styles.css` — no Tailwind ni CSS-in-JS. Es lo que hace que el paquete no imponga su sistema de build a quien lo consume.

## Cómo agregar algo a `auth-client`

1. Un módulo nuevo en `packages/auth-client/src/`, o extiende uno existente.
2. Exporta lo nuevo desde `packages/auth-client/src/index.ts`.
3. Si toca `session-guard.ts`: las rutas públicas y el destino del login **no se fijan en el paquete**, se reciben como configuración (`SessionGuardConfig`). Cada app tiene las suyas.
4. El paquete no depende de `next` ni de ningún framework. Si tu cambio necesita algo del framework de la app que lo consume, no pertenece aquí.

## Por qué el build es distinto a lo que esperarías

Ambos paquetes se construyen con `bundle: false` en `tsup.config.ts` — archivo por archivo, sin agrupar. Es deliberado: si empaquetara todo junto, perdería la distinción entre archivos con `"use client"` y sin ella, y forzaría a que toda la biblioteca corriera en el cliente. Por eso, si agregas un archivo, su directiva (o ausencia de ella) se preserva tal cual la escribiste — no hace falta configurar nada aparte.

Un efecto secundario de ese modo: el build corre además `scripts/normalize-esm-imports.mjs`, que reescribe los imports relativos a `.js`. Sin eso, el paquete funcionaría dentro de un bundler pero no bajo ESM de Node puro. Si ves ese paso en el log de build, es intencional — no lo quites.

## Probar tu cambio antes de publicarlo

Publicar es permanente — npm no permite despublicar una versión pasadas 72 horas. Antes de abrir un PR que toque `shared-ui` o `auth-client`, pruébalo contra un consumidor real sin publicar nada.

### Opción rápida: `pnpm link` (para iterar)

Desde el repositorio consumidor (por ejemplo `gr-admin-ui`):

```bash
pnpm link ../gr-common-ui/packages/shared-ui
```

Cada cambio que hagas en `gr-common-ui` requiere reconstruir el paquete para que el consumidor lo vea (los enlaces apuntan a `dist/`, no a `src/`):

```bash
pnpm --filter @gestionresidencial/shared-ui build
```

Para volver a la versión publicada real:

```bash
pnpm remove @gestionresidencial/shared-ui
pnpm add @gestionresidencial/shared-ui
```

### Opción exacta: tarball (para confirmar qué se publicaría)

Genera el mismo artefacto que `npm publish` subiría, sin publicarlo:

```bash
pnpm --filter @gestionresidencial/shared-ui build
pnpm --dir packages/shared-ui pack --pack-destination ../../artifacts
```

Instálalo desde el otro repositorio:

```bash
pnpm add ../gr-common-ui/artifacts/gestionresidencial-shared-ui-0.1.0.tgz
```

Esta opción es la que hay que usar antes de un cambio en `package.json` (`files`, `exports`, dependencias): `pnpm pack --dry-run` (sin generar el archivo) te deja ver la lista exacta de lo que se publicaría, útil para confirmar que no se cuela nada que no debería — solo `dist/`, `package.json` y `README.md`.

```bash
pnpm --dir packages/shared-ui pack --dry-run
```

## Versionar el cambio: el changeset

Antes de abrir el PR:

```bash
pnpm changeset
```

Pregunta qué paquete cambió y si es `patch`, `minor` o `major`. Genera un archivo en `.changeset/` que viaja con tu PR — sin él, tu cambio queda hecho pero nunca se publica.

| Tipo    | Cuándo                                                                                      |
| ------- | ------------------------------------------------------------------------------------------- |
| `patch` | Corrección que no cambia la interfaz pública                                                |
| `minor` | Agregas una exportación, una prop opcional o un componente nuevo                            |
| `major` | Renombras o eliminas una exportación, o cambia el comportamiento esperado de algo existente |

El detalle completo del ciclo de publicación —qué pasa después de fusionar, cómo se dispara la versión, cómo se autentica con npm— está en [`docs/publicacion.md`](publicacion.md). Esta guía es solo el "cómo contribuyo"; esa es el "cómo se libera".

## Antes de abrir el PR

Los mismos comandos que corre `verificar.yml` en cada Pull Request:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Si tu cambio es en un paquete, `pnpm test` incluye las pruebas de `packages/*/tests/` además de las de la app — corren con el runner de Node, sin red ni navegador.

## Qué revisar de otro repositorio antes de proponer un cambio aquí

Si vas a agregar algo a `shared-ui` o `auth-client` desde otro repositorio (por ejemplo, porque `gr-admin-ui` necesita un componente que hoy no existe), el cambio en sí se hace en `gr-common-ui` —es donde viven los paquetes—, no en el repositorio consumidor. El flujo:

1. Rama en `gr-common-ui`, siguiendo esta guía.
2. Publica el cambio (ver `docs/publicacion.md`).
3. En el repositorio consumidor, actualiza la dependencia a la nueva versión (`pnpm update @gestionresidencial/shared-ui`) y ábrelo como un PR aparte.

Son dos PRs, en dos repositorios, y eso es correcto: cada uno pasa por su propia revisión y su propio CI.
