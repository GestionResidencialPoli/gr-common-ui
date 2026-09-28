# @gestionresidencial/shared-ui

Biblioteca de componentes compartida por los frontends de Gestión Residencial: el login y las aplicaciones de residente, vigilante y administración.

Diseño monocromático y adaptable. Los componentes no traen textos ni destinos propios: cada aplicación aporta los suyos por props.

## Instalación

```bash
pnpm add @gestionresidencial/shared-ui
```

`react` y `react-dom` 19 son dependencias entre pares y las aporta la aplicación consumidora.

## Uso

Importa la hoja de estilos una sola vez, en el layout raíz:

```tsx
import "@gestionresidencial/shared-ui/styles.css";
```

Después, los componentes donde hagan falta:

```tsx
import { AppShell, HomePage, Button } from "@gestionresidencial/shared-ui";
```

## Personalización

El aspecto se controla con variables CSS. Redefínelas después de importar la hoja de estilos para cambiar el tema sin tocar componentes:

```css
:root {
  --color-action: #1f4fd8;
  --radius-card: 20px;
}
```

Variables disponibles: `--color-background`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-action`, `--color-action-text`, `--color-subtle`, `--radius-control`, `--radius-card` y `--font-body`.

## Qué exporta

| Grupo       | Exportaciones                                                                                                                                             |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Primitivos  | `Button`, `TextField`, `Card`, `Avatar`, `Feedback`, `EmptyState`, `Skeleton`                                                                             |
| Formularios | `PasswordField`, `LoginForm`, `ProfileForm`, `ChangePasswordForm`                                                                                         |
| Estructura  | `AppShell`, `AuthLayout`, `HomePage`                                                                                                                      |
| Navegación  | `DropdownMenu`, `Dialog`                                                                                                                                  |
| Tipos       | `NavigationItem`, `HomeModule`, `Profile`, `ProfileValues`, `LoginValues`, `LoginLabels`, `ProfileLabels`, `ChangePasswordValues`, `ChangePasswordLabels` |

## Restricciones de diseño

La biblioteca **no importa `next/link` ni `next/navigation`**. Recibe `href` como texto y comunica eventos por callbacks, de modo que sirva a cualquier consumidor de React, use Next.js o no.

El paquete se construye sin empaquetar (`bundle: false`), archivo por archivo, para preservar la directiva `"use client"` de cada componente. Agrupar el código obligaría a que toda la biblioteca se ejecute en el cliente.

## Desarrollo

```bash
pnpm --filter @gestionresidencial/shared-ui build
```

La salida queda en `dist/`: ESM, mapas de origen, declaraciones de tipos y la hoja de estilos.

¿Vas a agregar un componente? Lee la [guía de contribución](../../docs/contribuir.md) primero — cubre dónde va cada tipo de cambio y cómo probarlo sin publicar.

Consulta [ADR-002](../../docs/decisiones/ADR-002-distribucion-frontend.md) para la decisión de distribución y [docs/architecture.md](../../docs/architecture.md) para el recorrido completo del frontend.
