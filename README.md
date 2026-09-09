# GR Common UI

Base compartida para frontend de unidades residenciales. Incluye una biblioteca de componentes React y una aplicación Next.js que demuestra el home, el login y la edición del perfil.

Diseño monocromático y adaptable. Textos, módulos y destinos configurables.

## Ejecutar

Usa Node.js 24 y pnpm 12.3.4, las versiones utilizadas para verificar este proyecto. Ejecuta desde la raíz del repositorio:

```powershell
cd C:\Users\User\Desktop\Proyectos\Front\gr-common-ui
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000). Sin sesión, la aplicación te lleva a `/login`.

**La aplicación requiere el backend activo.** No hay modo de demostración: la autenticación es siempre contra `gr-user-microservice`, tanto en desarrollo como en producción, así que el flujo que pruebas en local es el mismo que corre desplegado.

Copia `.env.example` a `.env.local` si necesitas apuntar a un backend distinto del predeterminado.

## Conexión con el backend

`services/auth-service.ts` contiene el contrato y la única implementación: habla con `gr-user-microservice` por HTTP.

El navegador nunca habla directamente con el backend: `next.config.ts` reescribe `/api/v1/*` hacia `BACKEND_API_URL` (por defecto `http://localhost:8080`) del lado del servidor de Next.js. Así, desde la perspectiva del navegador todo vive en un solo origen, lo que evita problemas de cookies `SameSite` entre dominios distintos en producción. `proxy.ts` completa el reenvío borrando las cabeceras `Origin` y `Referer` de esas peticiones: son las del propio origen de la página, y si llegan al backend Spring evalúa CORS sobre una llamada servidor a servidor y responde `403 Invalid CORS request` a todo `POST` cuyo puerto no esté en `CORS_ALLOWED_ORIGINS`.

`lib/http-client.ts` centraliza cada llamada: agrega el header `X-XSRF-TOKEN` en mutaciones (leyendo la cookie legible `XSRF-TOKEN`), reintenta una vez tras `POST /api/v1/auth/refresh` si una petición recibe `401`, y notifica a `AuthProvider` para cerrar la sesión localmente si el refresco también falla. `proxy.ts` redirige a `/login` cuando no hay cookie `access_token` en rutas protegidas. En Next.js 16 el convenio `middleware` quedó deprecado y se renombró a `proxy`: el archivo va en la raíz y exporta una función `proxy` con su `config.matcher`. El build lo confirma listándolo como `ƒ Proxy (Middleware)`.

`GET /api/v1/auth/me` es la única forma de conocer la identidad y el rol de la sesión activa: el access token es `HttpOnly` y el login no devuelve cuerpo.

Para correr contra el backend real en local:

```powershell
$env:BACKEND_API_URL = "http://localhost:8080"
pnpm dev
```

El backend se levanta desde `gr-user-microservice` con `docker compose up -d` y `./mvnw spring-boot:run`. Sus datos semilla incluyen usuarios de los tres roles; el correo y la contraseña del residente están en `.env.example` como valores predeterminados de las pruebas E2E.

## Probar manualmente

1. Abre `/perfil` sin iniciar sesión: debes terminar en `/login`.
2. Introduce una contraseña incorrecta: se muestra el error de acceso.
3. Prueba el control **Mostrar / Ocultar** contraseña.
4. Inicia sesión con un usuario semilla del backend: aparece el home con tres módulos.
5. Abre un módulo: aparece su pantalla informativa pendiente de implementación.
6. Pulsa el nombre/avatar en el encabezado y luego **Editar perfil**.
7. El nombre y el correo aparecen en solo lectura, con la nota de quién los administra: el backend solo acepta cambios de teléfono.
8. Cambia el teléfono, guarda y recarga: el cambio permanece. Cámbialo otra vez sin guardar y pulsa **Deshacer cambios**: vuelve al último valor guardado.
9. Cierra sesión e intenta volver al home: la navegación te devuelve al login.
10. Abre `/preview` y `/preview?variant=four`: comprueba tres y cuatro tarjetas, otra identidad y distintos radios/fondo sin cambiar componentes.
11. Reduce el ancho del navegador: la navegación pasa a un desplegable y las tarjetas se apilan.
12. Recorre formularios y navegación con Tab, Enter y Escape.

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
lib/http-client.ts         Cliente HTTP: CSRF, reintento tras refresh, expiración de sesión
proxy.ts                   Redirección a /login sin sesión y reenvío limpio de /api
config/env.ts              Único punto de lectura de process.env
services/                  Contrato de autenticación y su implementación contra el backend
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

`pnpm test` ejecuta catorce pruebas unitarias sin red ni navegador: el mapeo de errores de autenticación y el wrapper de variables de entorno. `pnpm test:e2e` ejecuta tres recorridos en dos tamaños de pantalla, seis pruebas en total. Playwright usa Microsoft Edge en Windows. Si no está instalado, ejecuta `pnpm exec playwright install msedge`. En Linux/macOS instala Chromium con `pnpm exec playwright install chromium`.

Las pruebas de navegador arrancan Next.js en el puerto que indique `E2E_PORT` (3100 por defecto) y **necesitan el backend activo con sus datos semilla**. Las credenciales salen de `E2E_USER_EMAIL` y `E2E_USER_PASSWORD`, así que la suite es portable entre entornos y no lleva credenciales fijas en el código. Las capturas quedan en `test-results/` y los traces se conservan cuando una prueba falla. Esas carpetas no se versionan.

Para aplicar el formato del proyecto:

```powershell
pnpm format
```

## Compilación de producción

```powershell
pnpm build
pnpm start
```

La compilación de producción llama al backend a través de `BACKEND_API_URL`. `/preview` sigue mostrando los componentes de ejemplo.

`BACKEND_API_URL` se lee en el servidor de Next.js, no en el navegador, así que no se incorpora al bundle y puede cambiar entre entornos sin recompilar.

## Alcance pendiente

El login, la consulta de sesión (`/api/v1/auth/me`) y el cierre de sesión ya están conectados al backend real. Sigue pendiente:

- **Rutas por rol** (`/residente`, `/vigilante`, `/admin`) y una pantalla de acceso denegado cuando un rol entra a la de otro (GR-49 CA-2): hoy la estructura de páginas es genérica (`(community)`), sin segmentar por rol.
- **Guardar el perfil contra el backend real**: `updateProfile` del adaptador real lanza `not_configured` porque el backend todavía no expone un endpoint para editar el propio perfil (HU-1.8 / GR-45, sin empezar).
- No se implementaron noticias, pagos, reservas ni disponibilidad de parqueaderos. Los enlaces de esos módulos muestran estados informativos y se pueden reemplazar por las rutas de sus futuros frontend.

El avatar muestra iniciales; no hay carga de fotografías. El correo es de solo lectura. Compartir las pantallas no configura inicio de sesión único entre aplicaciones.
