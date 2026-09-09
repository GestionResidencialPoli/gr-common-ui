import type { Role } from "@/services/auth-service";

export function homeRouteFor(roles: Role[]): string {
  if (roles.includes("ADMINISTRACION")) return "/admin";
  if (roles.includes("VIGILANTE")) return "/vigilante";
  return "/residente";
}
