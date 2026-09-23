import type { Role } from "@gestionresidencial/auth-client";
import { homeRouteFor } from "@gestionresidencial/auth-client";

/**
 * Resuelve el destino de `homeRouteFor` y navega con el mecanismo correcto
 * segun sea una ruta interna de esta aplicacion o una URL externa (otra app
 * de rol, en otro origen). `homeRouteFor` no distingue los dos casos: solo
 * devuelve el texto configurado para cada rol. Esta funcion es la que decide
 * como llegar ahi.
 *
 * Una URL externa exige `window.location.replace`: el enrutador de Next.js
 * no sabe navegar fuera de esta aplicacion, y ademas una URL externa suele
 * implicar cambiar de origen (por eso existe el puente SSO de administracion
 * en /admin, que emite el codigo antes de que el navegador llegue ahi).
 */
export function redirectToHome(roles: Role[], replace: (href: string) => void) {
  const href = homeRouteFor(roles);

  if (href.startsWith("http://") || href.startsWith("https://")) {
    window.location.replace(href);
    return;
  }

  replace(href);
}
