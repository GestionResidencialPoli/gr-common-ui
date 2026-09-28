import type { Role } from "./auth-service.ts";

export type RoleHomeRoutes = Record<Role, string>;

export const DEFAULT_ROLE_HOME_ROUTES: RoleHomeRoutes = {
  ADMINISTRACION: "/admin",
  VIGILANTE: "/vigilante",
  RESIDENTE: "/residente",
};

export function homeRouteFor(
  roles: Role[],
  routes: RoleHomeRoutes = DEFAULT_ROLE_HOME_ROUTES,
): string {
  if (roles.includes("ADMINISTRACION")) return routes.ADMINISTRACION;
  if (roles.includes("VIGILANTE")) return routes.VIGILANTE;
  return routes.RESIDENTE;
}
