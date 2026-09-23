import type { Role, RoleHomeRoutes } from "@gestionresidencial/auth-client";
import { authUiLoginUrl, homeRouteFor } from "@gestionresidencial/auth-client";

/**
 * ADMINISTRACION ya no tiene ruta interna en esta app: el lanzador /admin se
 * retiro cuando gr-auth-ui asumio el login de los tres roles (GR-155). Bajo
 * el diseno actual esa sesion nunca deberia llegar aqui -- el puente SSO
 * dirige a ADMINISTRACION directo a gr-admin-ui, sin pasar por este origen
 * -- pero si ocurriera, se manda al login central en vez de a una ruta que
 * ya no existe.
 */
export const ROLE_HOME_ROUTES: RoleHomeRoutes = {
  RESIDENTE: "/residente",
  VIGILANTE: "/vigilante",
  ADMINISTRACION: authUiLoginUrl(),
};

/**
 * Resuelve el destino de `homeRouteFor` y navega con el mecanismo correcto
 * segun sea una ruta interna de esta aplicacion o una URL externa (otro
 * origen). `homeRouteFor` no distingue los dos casos: solo devuelve el texto
 * configurado para cada rol. Esta funcion es la que decide como llegar ahi.
 *
 * Una URL externa exige `window.location.replace`: el enrutador de Next.js
 * no sabe navegar fuera de esta aplicacion.
 */
export function redirectToHome(roles: Role[], replace: (href: string) => void) {
  const href = homeRouteFor(roles, ROLE_HOME_ROUTES);

  if (href.startsWith("http://") || href.startsWith("https://")) {
    window.location.replace(href);
    return;
  }

  replace(href);
}
