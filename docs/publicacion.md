# Publicación de los paquetes compartidos

Este repositorio publica dos paquetes públicos en npmjs.com:

- `@gestionresidencial/shared-ui`
- `@gestionresidencial/auth-client`

La decisión de publicarlos en npmjs.com y no en GitHub Packages está en [ADR-002](decisiones/ADR-002-distribucion-frontend.md): GitHub Packages exige un token incluso para instalar paquetes públicos, y eso obligaría a cualquier persona que clone un frontend a crear uno antes de que `pnpm install` funcione.

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

## Qué se necesita configurar una sola vez

Estos pasos no están hechos todavía y bloquean la primera publicación:

1. **Crear la organización `gestionresidencial` en npmjs.com.** El scope está libre: ambos nombres responden 404 y no hay nada publicado bajo él. Quien la cree queda como propietario.
2. **Generar un token de automatización** en npm (`Automation`, no `Publish`, para que funcione sin 2FA interactivo).
3. **Guardarlo como secreto `NPM_TOKEN`** en el repositorio, en Settings → Secrets and variables → Actions.

El token es una credencial: no debe aparecer en código, en un `.npmrc` versionado, ni en la descripción de un PR.

## Consideraciones

- **La publicación es permanente.** npm no permite despublicar una versión después de 72 horas, solo marcarla como obsoleta. La primera publicación fija el nombre del scope.
- **Solo se publica `dist/`.** Ambos paquetes declaran `files`, y `pnpm pack --dry-run` permite confirmarlo antes de publicar.
- **Se publica con provenance.** El flujo declara `id-token: write` y `NPM_CONFIG_PROVENANCE`, de modo que npm registra desde qué repositorio y qué commit salió cada versión.
- **La app de este repositorio no se publica.** Es `private: true` y Changesets la ignora.
