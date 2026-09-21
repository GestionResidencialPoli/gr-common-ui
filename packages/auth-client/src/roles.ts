import type { Role } from "./auth-service.ts";

export type RoleHomeRoutes = Record<Role, string>;

/**
 * Destinos que usa esta aplicacion mientras los tres roles viven en el mismo
 * despliegue. Cada frontend puede pasar los suyos: al separarse por repositorio
 * las rutas dejan de ser las mismas.
 */
export const DEFAULT_ROLE_HOME_ROUTES: RoleHomeRoutes = {
  ADMINISTRACION: "/admin",
  VIGILANTE: "/vigilante",
  RESIDENTE: "/residente",
};

/**
 * Resuelve el destino tras iniciar sesion. El orden importa: quien acumula
 * varios roles entra por el de mayor alcance.
 */
export function homeRouteFor(
  roles: Role[],
  routes: RoleHomeRoutes = DEFAULT_ROLE_HOME_ROUTES,
): string {
  if (roles.includes("ADMINISTRACION")) return routes.ADMINISTRACION;
  if (roles.includes("VIGILANTE")) return routes.VIGILANTE;
  return routes.RESIDENTE;
}
