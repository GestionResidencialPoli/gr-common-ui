import type { Role } from "@/services/auth-service";

const adminUiUrl = process.env.NEXT_PUBLIC_ADMIN_UI_URL || "http://localhost:3001";

export function homeRouteFor(roles: Role[]): string {
  if (roles.includes("ADMINISTRACION")) return adminUiUrl;
  if (roles.includes("VIGILANTE")) return "/vigilante";
  return "/residente";
}

export function redirectToHome(roles: Role[], replace: (href: string) => void) {
  const href = homeRouteFor(roles);

  if (href.startsWith("http://") || href.startsWith("https://")) {
    window.location.replace(href);
    return;
  }

  replace(href);
}
