# Publicación de los paquetes compartidos

Este repositorio publica dos paquetes públicos en npmjs.com:

- `@gestionresidencial/shared-ui`
- `@gestionresidencial/auth-client`

La decisión de publicarlos en npmjs.com y no en GitHub Packages está en [ADR-002](decisiones/ADR-002-distribucion-frontend.md): GitHub Packages exige un token incluso para instalar paquetes públicos, y eso obligaría a cualquier persona que clone un frontend a crear uno antes de que `pnpm install` funcione.

## Verificación en cada Pull Request

Este documento describe **cómo se publica**. La verificación de que el código funciona es un proceso distinto y anterior: `.github/workflows/verificar.yml` corre en cada Pull Request hacia `develop`, `qa` o `main` — `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`, en ese orden — y no toca npm ni necesita `NPM_TOKEN`.

Un PR con un error de lint, de tipos, una prueba rota o un build que falla queda marcado en rojo por GitHub antes de que pueda aprobarse. Es la comprobación automática que respalda el punto "el pipeline de CI/CD está exitoso" del checklist de PR de la guía interna del equipo.

No corre `pnpm test:e2e`: esa suite necesita el backend activo con datos semilla, que este flujo no levanta.

## Consumir los paquetes

Desde cualquier repositorio, sin token y sin `.npmrc`:

```bash
pnpm add @gestionresidencial/shared-ui @gestionresidencial/auth-client
```

## Publicar un cambio

El proceso tiene tres pasos y solo el primero es manual.

### 1. Agregar un changeset al PR

Cuando un PR modifique alguno de los dos paquetes:

```bash
pnpm changeset
```

Pregunta qué paquetes cambiaron, si el cambio es `patch`, `minor` o `major`, y pide un resumen. Genera un archivo en `.changeset/` que viaja con el PR y termina en el changelog.

Un PR que solo toca la aplicación de este repositorio no necesita changeset.

Criterio para elegir el tipo:

| Tipo    | Cuándo                                                                     |
| ------- | -------------------------------------------------------------------------- |
| `patch` | Corrección que no cambia la interfaz pública                               |
| `minor` | Se agrega una exportación, una prop opcional o un componente nuevo         |
| `major` | Se renombra o elimina una exportación, o cambia el comportamiento esperado |

Mientras la versión esté en `0.x`, un `major` sigue siendo un cambio incompatible y debe anunciarse al equipo: los consumidores no lo reciben solos.

### 2. El PR de versión

Al llegar un cambio a `main`, el flujo `\.github/workflows/publicar.yml` abre automáticamente un PR titulado `chore(release): versionar paquetes`. Ese PR sube las versiones según los changesets acumulados y escribe el `CHANGELOG.md` de cada paquete.

Revisarlo es revisar el changelog: que las versiones sean las esperadas y que los resúmenes se entiendan sin abrir el código.

### 3. La publicación

Al fusionar el PR de versión, el mismo flujo publica en npm. No hay paso manual.

## La primera publicación

La publicación se dispara con un `push` a `main`. Al llegar ahí el primer cambio, el flujo publica solo: no hay que hacer nada más.

El flujo acepta además disparo manual (**Actions → Publicar paquetes → Run workflow**), pero **el job solo se ejecuta si la rama es `main`**. Correrlo desde otra rama termina sin publicar, a propósito: el job tiene permisos de escritura y puede solicitar la identidad OIDC que Trusted Publishing usa para publicar, y dejarlo correr desde cualquier rama permitiría publicar saltándose el flujo acordado. El disparo manual sirve para reintentar una publicación fallida sin tener que volver a fusionar, no para publicar desde una rama de trabajo.

Ten en cuenta que el botón _Run workflow_ solo aparece si el archivo del flujo existe en la rama por defecto del repositorio, que es `main`.

Antes de la primera publicación no hay changesets acumulados y eso es correcto: ambos paquetes están en `0.1.0` y salen con esa versión tal cual, sin bump. El flujo lo detecta y publica directo, sin abrir PR de versión. **No agregues un changeset vacío para "dejar constancia"**: `changesets/action` lo detecta como changeset presente, abre un PR de versión que no cambia nada y no publica.

## Autenticación con npm

El flujo publica con **Trusted Publishing (OIDC)**. No hay ningún token guardado: `NPM_TOKEN` se retiró del repositorio y del workflow.

Cada ejecución, GitHub emite un JWT de un solo uso que identifica exactamente el repositorio, el workflow y la ejecución. `npm publish` (CLI ≥ 11.5.1; Node 24 trae 11.9.x) se lo presenta al registro, que lo verifica contra el **Trusted Publisher** configurado en cada paquete — no contra ninguna credencial almacenada.

Ese token no se guarda, no se filtra, no vence y no hay que rotarlo. Es la diferencia central frente al esquema anterior: antes había un secreto de larga duración con fecha de vencimiento (19 de diciembre de 2026) y sujeto a que npm retirara ese tipo de token en enero de 2027. Ahora no hay nada de eso.

### Configuración, ya hecha, una vez por paquete

En npmjs.com, para cada uno de `@gestionresidencial/shared-ui` y `@gestionresidencial/auth-client`: **paquete → Settings → Trusted Publisher → Add publisher**.

| Campo                | Valor                                             |
| -------------------- | ------------------------------------------------- |
| Publisher            | GitHub Actions                                    |
| Organization or user | `GestionResidencialPoli`                          |
| Repository           | `gr-common-ui`                                    |
| Workflow filename    | `publicar.yml`                                    |
| Environment name     | _(vacío — el workflow no declara `environment:`)_ |
| Allow npm publish    | **Habilitado**                                    |

`Allow npm publish` importa: npm separa `npm stage publish` (por defecto, deja el paquete oculto hasta que alguien lo aprueba a mano con 2FA) de `npm publish` directo (publica de inmediato). `changeset publish` usa el flujo directo, así que sin marcar esa casilla la publicación automática se rompería. El control de acceso real no se pierde: sigue siendo el Pull Request aprobado antes de llegar a `main`.

En el workflow, lo único que esto requiere es el permiso `id-token: write` a nivel de job — ya estaba declarado desde GR-136 para las attestations de provenance, y ahora cumple una función doble.

### Requisitos en el lado del repositorio

- El workflow debe correr exactamente desde `.github/workflows/publicar.yml` en `GestionResidencialPoli/gr-common-ui`. Renombrar el archivo o mover el repositorio rompe la coincidencia con el Trusted Publisher y hay que reconfigurarlo.
- La guarda `if: github.ref == 'refs/heads/main'` sigue siendo la que impide publicar desde una rama de trabajo — Trusted Publishing autentica _que_ es este repositorio y este workflow, no _desde qué rama_ se disparó.

## Consideraciones

- **La publicación es permanente.** npm no permite despublicar una versión después de 72 horas, solo marcarla como obsoleta. La primera publicación fija el nombre del scope.
- **Solo se publica `dist/`.** Ambos paquetes declaran `files`, y `pnpm pack --dry-run` permite confirmarlo antes de publicar.
- **Se publica con provenance.** Al venir de un Trusted Publisher, npm genera y adjunta las attestations de provenance automáticamente — ya no depende de la variable `NPM_CONFIG_PROVENANCE`. El registro sigue registrando desde qué repositorio y qué commit salió cada versión.
- **La app de este repositorio no se publica.** Es `private: true` y Changesets la ignora.
