# Changesets

Esta carpeta registra los cambios pendientes de publicar de `@gestionresidencial/shared-ui` y `@gestionresidencial/auth-client`.

Cuando un PR modifique alguno de los dos paquetes, agrega un changeset:

```bash
pnpm changeset
```

El comando pregunta que paquetes cambiaron, si el cambio es `patch`, `minor` o `major`, y pide un resumen. Genera un archivo Markdown en esta carpeta que viaja con el PR.

Un PR que solo toca la aplicacion de este repositorio no necesita changeset.

El resto del proceso es automatico: al llegar a `main`, el flujo de trabajo abre un PR de version y, al fusionarlo, publica en npm. Ver `docs/publicacion.md`.
