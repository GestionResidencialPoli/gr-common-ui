import type { Role, RoleHomeRoutes } from "@gestionresidencial/auth-client";
import { authUiLoginUrl, homeRouteFor } from "@gestionresidencial/auth-client";

export const ROLE_HOME_ROUTES: RoleHomeRoutes = {
  RESIDENTE: "/residente",
  VIGILANTE: "/vigilante",
  ADMINISTRACION: authUiLoginUrl(),
};

export function redirectToHome(roles: Role[], replace: (href: string) => void) {
  const href = homeRouteFor(roles, ROLE_HOME_ROUTES);

  if (href.startsWith("http://") || href.startsWith("https://")) {
    window.location.replace(href);
    return;
  }

  replace(href);
}
