# Cómo está construido el frontend

## 1. Dos responsabilidades separadas

La aplicación Next.js está en la raíz del repositorio. La biblioteca reutilizable está en `packages/shared-ui` y se importa como `@gr/shared-ui` mediante el workspace de pnpm.

Conservamos Next.js en la raíz para no mover innecesariamente su configuración. No hacen falta dos aplicaciones ni microfrontends para esta entrega. `/preview` cumple la función de demostración de la biblioteca.

La biblioteca no importa archivos de `app`, `config`, `features` o `services`. Tampoco depende de Next.js, conoce roles ni consulta una API. Recibe datos y funciones mediante propiedades.

```text
Aplicación Next.js
  config → textos, identidad, módulos y destinos
  features → comportamiento de login, sesión y perfil
  services → contrato y simulación local
  app → rutas y composición
           ↓
  @gr/shared-ui → presentación y formularios reutilizables
```

## 2. Biblioteca compartida

`packages/shared-ui/package.json` define el nombre del paquete, sus dependencias de React y sus exportaciones. `src/index.ts` expone la API pública. No hace falta importar rutas internas.

| Carpeta / archivo               | Responsabilidad                                                     |
| ------------------------------- | ------------------------------------------------------------------- |
| `components/primitives.tsx`     | Botones, campos, tarjetas, avatar, mensajes, estados vacíos y carga |
| `components/password-field.tsx` | Mostrar y ocultar la contraseña                                     |
| `components/dialog.tsx`         | Diálogo nativo con foco modal y cierre con Escape                   |
| `navigation/dropdown-menu.tsx`  | Desplegable de enlaces accesible mediante `details`                 |
| `layout/app-shell.tsx`          | Barra lateral, encabezado, navegación móvil y área de contenido     |
| `home/home-page.tsx`            | Bienvenida y tarjetas generadas desde una lista de módulos          |
| `auth/auth-layout.tsx`          | Composición visual de la pantalla de acceso                         |
| `auth/login-form.tsx`           | Campos y envío de credenciales                                      |
| `profile/profile-form.tsx`      | Edición del teléfono; nombre opcionalmente editable y correo fijo   |
| `types.ts`                      | Contratos TypeScript compartidos                                    |
| `styles.css`                    | Variables visuales y estilos adaptables                             |

Los componentes que manejan eventos o estado llevan `"use client"`. Los componentes de composición no lo necesitan. Las páginas pueden pasar contenido del servidor a los espacios `children` de la estructura de cliente.

Los enlaces de la biblioteca son enlaces HTML normales: funcionan incluso si el destino pertenece a otra aplicación. Para enlaces internos de las páginas Next.js se utiliza también `Link`. Es una elección sencilla y portable; la navegación desde los enlaces HTML realiza una carga completa.

## 3. Textos y navegación

`config/content.ts` contiene los textos del frontend de ejemplo, incluyendo etiquetas, estados de carga, mensajes y nombre de la unidad. `config/modules.tsx` contiene las tarjetas, los iconos y las rutas.

`Button` no tiene un texto predeterminado:

```tsx
<Button onClick={save}>{labels.save}</Button>
```

Lo mismo ocurre con los formularios: reciben `labels`. Los textos de ejemplo no están dentro de la biblioteca. Las etiquetas siguen siendo obligatorias para evitar controles sin nombre.

`HomeModule` añade `description` y `actionLabel` a `NavigationItem`. `HomePage` recorre la lista y CSS adapta las columnas a su tamaño. `AppShell` recibe `activeId` para marcar la navegación seleccionada.

No hay filtros de roles. La aplicación que consuma la biblioteca decidirá qué lista de módulos entregar.

## 4. Login y estado de sesión

El flujo es:

1. `LoginScreen` prepara los textos y los estados de carga/error.
2. `LoginForm` recoge correo y contraseña mediante `FormData` y llama a `onSubmit`.
3. `LoginScreen` llama a `login` del contexto.
4. `AuthProvider` llama al servicio y guarda el usuario devuelto en memoria de React.
5. La pantalla redirige al home.

`AuthProvider` se coloca en `app/layout.tsx`, por lo que el login y el perfil comparten el mismo usuario. Al cargar la aplicación, consulta `getSession`.

`AuthenticatedShell` espera esa consulta y dirige a `/login` cuando no hay usuario. Mientras espera, muestra un `Skeleton`. Al cerrar sesión, invoca `POST /api/v1/auth/logout` para que el backend revoque el refresh token y vuelve al login.

**Esta comprobación es de navegación del frontend, no autorización de datos.** No hay información privada real ni protección de servidor en esta entrega. Cuando exista la API, el backend deberá validar sesiones y permisos en cada operación.

## 5. Servicio de autenticación

`services/auth-service.ts` define cuatro métodos:

```ts
interface AuthService {
  getSession(): Promise<Profile | null>;
  login(values: LoginValues): Promise<Profile>;
  logout(): Promise<void>;
  updateProfile(values: ProfileValues): Promise<Profile>;
}
```

**Hay una sola implementación, y habla con el backend real.** No existe simulación ni variable de modo: el flujo que se ejerce en desarrollo, en las pruebas y en producción es el mismo. Una implementación falsa habría dejado sin ejercitar justo el camino que puede romperse.

El contrato, la implementación y el singleton `authService` viven en `services/auth-service.ts`. El contrato de errores está aparte, en `services/auth-error.ts`, sin ninguna dependencia: eso permite probarlo con el runner de Node sin arrastrar alias de rutas ni la biblioteca compartida.

`authService` implementa `AuthService` contra `gr-user-microservice`: `login` llama a `POST /api/v1/auth/login`, `getSession` a `GET /api/v1/auth/me` (única forma de conocer identidad y rol, ya que el access token es `HttpOnly` y el login no devuelve cuerpo) y `logout` a `POST /api/v1/auth/logout`. `updateProfile` llama a `PATCH /api/v1/auth/me`, que hoy solo acepta el teléfono (`UpdateProfileRequest(phone)`): por eso el formulario de perfil recibe `nameEditable={false}` y muestra el nombre en modo lectura. Ofrecer un campo editable cuyo valor el backend descarta habría producido un éxito falso, con el nombre viejo de vuelta al recargar.

Todas las llamadas pasan por `lib/http-client.ts`, que agrega el header `X-XSRF-TOKEN` en mutaciones, reintenta una vez tras `POST /api/v1/auth/refresh` si la petición recibe `401`, y notifica a los suscriptores de `onSessionExpired` (hoy solo `AuthProvider`) si el refresco también falla. El navegador nunca contacta al backend directamente: `next.config.ts` reescribe `/api/v1/*` hacia `BACKEND_API_URL` del lado del servidor, para que las cookies `SameSite=Strict` del backend viajen sin problemas de origen cruzado en cualquier entorno.

`proxy.ts` (el archivo que reemplazó a `middleware.ts` en Next.js 16) redirige a `/login` en toda ruta protegida cuando no hay cookie `access_token`. Solo `/login` y `/preview` quedan públicas. Que el convenio esté activo se comprueba en la salida de `pnpm build`, que lo lista como `ƒ Proxy (Middleware)`.

El mismo archivo atiende `/api/*` con otro propósito: borra las cabeceras `Origin` y `Referer` antes de que la reescritura las reenvíe al backend. El navegador es del mismo origen que el servidor Next, así que ese `Origin` describe la página, no un cliente remoto; reenviarlo hace que Spring evalúe CORS sobre una petición que en realidad es servidor a servidor y responda `403 Invalid CORS request` a todo `POST` cuando el puerto de desarrollo no está en `CORS_ALLOWED_ORIGINS`. Quitarlo deja el CORS del backend para quien sí lo llame directo y evita tener que enumerar cada puerto del frontend.

## 5.1 Errores y configuración

Dos decisiones que evitan cadenas literales dispersas por las pantallas:

`services/auth-error-messages.ts` expone `authErrorMessage(error, messages, fallback)`. Cada pantalla declara el mapa de los códigos que le interesan y su texto, y el resto cae al mensaje genérico. Las claves son de tipo `AuthErrorCode`, así que renombrar un código rompe la compilación en cada punto de uso en lugar de degradarse en silencio a un mensaje equivocado.

`config/env.ts` es el único lugar que lee `process.env`. Resuelve todo al cargar el módulo, no en el momento del acceso, para que el valor no dependa de cuándo se consulte. Lo consumen `next.config.ts`, `playwright.config.ts` y las pruebas E2E.

El contrato de `AuthService` se extendió con `AppUser = Profile & { roles: Role[] }` (en `services/auth-service.ts`, no en `@gr/shared-ui`) para que el frontend pueda proteger rutas por rol sin que la biblioteca compartida conozca roles.

## 6. Edición del perfil

`ProfileScreen` obtiene el usuario del contexto y se lo pasa a `ProfileForm`. El correo siempre se presenta como información de solo lectura. El nombre lo es también en esta aplicación, porque `PATCH /api/v1/auth/me` solo acepta el teléfono; la biblioteca conserva el parámetro `nameEditable` para que otra aplicación con un backend que sí lo admita pueda habilitarlo sin bifurcar el componente.

Al guardar, el servicio valida campos básicos, conserva identificador y correo, devuelve el perfil actualizado y el contexto actualiza también el encabezado. Se incrementa `revision` para que el formulario tome los datos guardados como su nuevo estado inicial. De esta manera, **Deshacer cambios** vuelve a la última versión guardada.

El avatar usa las iniciales del nombre. No se incluyó carga de fotografías porque implicaría definir almacenamiento y un contrato adicional. El formulario acepta `children` para componer contenido adicional; si otra aplicación añade campos editables, deberá extender también su manejo de valores y servicio.

## 7. Diseño y accesibilidad

El diseño usa blancos, negros y grises, bordes discretos y espaciado consistente. Las variables están al principio de `styles.css`. Cada consumidor puede sobrescribirlas después de importar el CSS:

```css
:root {
  --color-background: #eeeeee;
  --radius-card: 4px;
  --radius-control: 4px;
}
```

`/preview?variant=four` aplica una variante de ejemplo a un contenedor. Los componentes no cambian.

Hay etiquetas asociadas a campos, foco visible, mensajes con `alert`/`status`, navegación por teclado, un enlace para saltar al contenido y un diálogo nativo. Los iconos decorativos se ocultan del árbol accesible. En móvil la barra lateral se convierte en navegación desplegable.

El CSS compartido incluye un reset básico y estilos globales de tipografía. Está pensado para usarse como base completa de un frontend; si se incorpora a una aplicación con otro sistema de estilos, se debe revisar esa convivencia.

## 8. Rutas

| URL                       | Contenido                                           |
| ------------------------- | --------------------------------------------------- |
| `/login`                  | Formulario de acceso                                |
| `/`                       | Home de la comunidad                                |
| `/perfil`                 | Edición del perfil                                  |
| `/modulos/tablero`        | Estado de módulo pendiente                          |
| `/modulos/administracion` | Estado de módulo pendiente                          |
| `/modulos/reservas`       | Estado de módulo pendiente                          |
| `/modulos/parqueaderos`   | Estado de módulo pendiente                          |
| `/preview`                | Home público de ejemplo con tres módulos            |
| `/preview?variant=four`   | Otra identidad, variables visuales y cuatro módulos |

`(community)` agrupa páginas bajo el mismo layout sin añadir un segmento a la URL. Los módulos tienen pantallas informativas para que sus enlaces no estén rotos; todavía no implementan noticias, pagos o reservas.

## 9. Consumir la biblioteca desde otra aplicación

En el mismo workspace, añade `"@gr/shared-ui": "workspace:*"` a las dependencias del consumidor y ejecuta `pnpm install`. En su configuración Next.js:

```ts
const nextConfig = {
  transpilePackages: ["@gr/shared-ui"],
};
```

Importa los estilos una sola vez en el layout raíz:

```tsx
import "@gr/shared-ui/styles.css";
```

Después importa los componentes y tipos:

```tsx
import { AppShell, HomePage, LoginForm, ProfileForm } from "@gr/shared-ui";
```

Para otro repositorio, puedes generar un paquete local:

```powershell
pnpm --dir packages/shared-ui pack --pack-destination ../../artifacts
```

Instala el `.tgz` generado desde el otro repositorio con `pnpm add <ruta-al-archivo.tgz>`. El paquete exporta TypeScript y JSX, por eso el consumidor necesita compilarlos; Next.js puede hacerlo mediante `transpilePackages`.

No se publicó el paquete en ningún registro. La aplicación consumidora aporta sus textos, destinos y adaptador de autenticación. Compartir componentes de login no comparte automáticamente una sesión entre dominios.

## 10. Verificación

`tests/auth-error-messages.test.mjs` y `tests/env.test.mjs` usan el runner integrado de Node, sin red ni navegador: el mapeo de códigos de error a mensajes con sus casos de reserva, y la resolución de variables de entorno incluyendo valores vacíos y la precedencia entre puerto y URL base.

`tests/e2e/community.spec.ts` usa Playwright para recorrer login, perfil, recarga y logout, comprobar los destinos y probar las dos configuraciones en escritorio y móvil. Guarda capturas dentro de `test-results`. **Requiere el backend activo con sus datos semilla**, y toma las credenciales de `E2E_USER_EMAIL` y `E2E_USER_PASSWORD` para no fijarlas en el código.

Consulta `README.md` para los comandos de ejecución y la prueba manual.

Referencia de las convenciones de Next.js: [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components). También se consultó la documentación local de Next.js 16.3.4 indicada por `AGENTS.md`.
