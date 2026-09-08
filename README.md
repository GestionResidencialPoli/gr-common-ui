# GR Common UI

Base compartida para frontend de unidades residenciales. Incluye una biblioteca de componentes React y una aplicación Next.js que demuestra el home, el login y la edición del perfil.

Diseño monocromático y adaptable. Textos, módulos y destinos configurables. Sin roles ni conexión al backend en esta entrega.

## Ejecutar

Usa Node.js 24 y pnpm 12.3.4, las versiones utilizadas para verificar este proyecto. Ejecuta desde la raíz del repositorio:

```powershell
cd C:\Users\User\Desktop\Proyectos\Front\gr-common-ui
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000). Si no hay sesión de demostración, la aplicación te lleva a `/login`.

En desarrollo, el modo demo está activo de forma predeterminada. No necesitas backend ni archivo `.env.local` para probarlo. Si prefieres configurarlo explícitamente, copia `.env.example` a `.env.local` sin reemplazar una configuración existente.

**Credenciales de demostración:**

```text
Correo: residente@demo.com
Contraseña: Demo1234!
```

No son credenciales reales. La simulación guarda sesión y perfil únicamente en `sessionStorage` de la pestaña. No guarda contraseñas ni envía peticiones a un backend.

## Probar manualmente

1. Abre `/perfil` sin iniciar sesión: debes terminar en `/login`.
2. Introduce una contraseña incorrecta: se muestra el error de acceso.
3. Prueba el control **Mostrar / Ocultar** contraseña.
4. Inicia sesión con los datos de demostración: aparece el home con tres módulos.
5. Abre un módulo: aparece su pantalla informativa pendiente de implementación.
6. Pulsa el nombre/avatar en el encabezado y luego **Editar perfil**.
7. Cambia nombre y teléfono, guarda y recarga: los cambios permanecen en la pestaña y el encabezado usa el nuevo nombre.
8. Cambia un campo sin guardar y pulsa **Deshacer cambios**: vuelve al último valor guardado.
9. Cierra sesión e intenta volver al home: la navegación te devuelve al login.
10. Abre `/preview` y `/preview?variant=four`: comprueba tres y cuatro tarjetas, otra identidad y distintos radios/fondo sin cambiar componentes.
11. Reduce el ancho del navegador: la navegación pasa a un desplegable y las tarjetas se apilan.
12. Recorre formularios y navegación con Tab, Enter y Escape.

Para reiniciar los datos demo, abre las herramientas del navegador → Application → Session Storage → el origen local, y elimina las claves `gr-demo-session` y `gr-demo-profile`. Recarga después.

## Estructura

```text
app/                       Rutas y layouts Next.js
  (community)/             Home, perfil y destinos de módulos
  login/                   Pantalla de acceso
  preview/                 Dos ejemplos públicos de consumo
components/                Composición e iconos de esta aplicación
config/                    Textos, identidad y módulos de ejemplo
features/
  auth/                    Estado de sesión y comportamiento de acceso
  profile/                 Guardado y mensajes del perfil
services/                  Contrato de autenticación y simulación local
packages/shared-ui/        Biblioteca @gr/shared-ui
docs/architecture.md       Explicación detallada del código y reutilización
tests/                     Pruebas unitarias y de navegador
```

## Qué modificar

| Necesidad                                         | Archivo                             |
| ------------------------------------------------- | ----------------------------------- |
| Cambiar textos, etiquetas y nombre de la unidad   | `config/content.ts`                 |
| Añadir módulos, cambiar sus textos o destinos     | `config/modules.tsx`                |
| Cambiar el aspecto común                          | `packages/shared-ui/src/styles.css` |
| Sobrescribir variables solo para esta app         | `app/globals.css`                   |
| Componer otro contenido debajo de los accesos     | `components/home-content.tsx`       |
| Consultar lo que deberá implementar la futura API | `services/auth-service.ts`          |
| Seleccionar el futuro servicio real               | `services/index.ts`                 |
| Consultar las exportaciones reutilizables         | `packages/shared-ui/src/index.ts`   |

Los botones de la biblioteca reciben sus textos mediante `children` o `labels`. Los nombres **Tablero**, **Administración** y **Zonas comunes** pertenecen a esta aplicación de ejemplo.

Lee [la explicación detallada de la arquitectura](docs/architecture.md) para entender el recorrido de los datos, los componentes y cómo instalar el paquete en otro frontend.

## Verificaciones automáticas

```powershell
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm format:check
pnpm build
```

`pnpm test` ejecuta siete pruebas del servicio demo. `pnpm test:e2e` ejecuta tres recorridos en dos tamaños de pantalla, seis pruebas en total. Playwright usa Microsoft Edge en Windows. Si no está instalado, ejecuta `pnpm exec playwright install msedge`. En Linux/macOS instala Chromium con `pnpm exec playwright install chromium`.

Las pruebas de navegador arrancan Next.js en el puerto 3100. Pueden reutilizar un servidor ya iniciado en ese puerto; debe estar configurado en modo demo. Las capturas quedan en `test-results/` y los traces se conservan cuando una prueba falla. Esas carpetas no se versionan.

Para aplicar el formato del proyecto:

```powershell
pnpm format
```

## Compilación de producción

```powershell
pnpm build
pnpm start
```

Si no configuras el modo demo explícitamente, la compilación de producción muestra el login pero no permite acceder porque todavía no hay integración real. `/preview` sigue mostrando los componentes de ejemplo.

Para probar una compilación de demostración en PowerShell:

```powershell
$env:NEXT_PUBLIC_AUTH_MODE = "demo"
pnpm build
pnpm start
```

Las variables `NEXT_PUBLIC_*` se incorporan al compilar. Si cambias el modo, debes volver a compilar. La autenticación demo no debe usarse como protección de una aplicación real.

## Alcance pendiente

La integración real del login, la sesión y el guardado del perfil se hará después con el contrato del backend. No se implementaron roles, noticias, pagos, reservas ni disponibilidad de parqueaderos. Los enlaces de esos módulos muestran estados informativos y se pueden reemplazar por las rutas de sus futuros frontend.

El avatar muestra iniciales; no hay carga de fotografías. El correo es de solo lectura. Compartir las pantallas no configura inicio de sesión único entre aplicaciones.
