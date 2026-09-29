export type PlatformApp = "common" | "admin" | "wall" | "booking" | "gate" | "billing";
export type PlatformRole = "RESIDENTE" | "VIGILANTE" | "ADMINISTRACION";
export type PlatformUrls = Record<PlatformApp, string>;
export type PlatformIconName =
  "home" | "board" | "calendar" | "gate" | "billing" | "building" | "shield" | "mail";

export type PlatformLink = {
  id: string;
  label: string;
  app: PlatformApp;
  path: string;
  icon: PlatformIconName;
};

export function platformUrls(): PlatformUrls {
  return {
    common: process.env.NEXT_PUBLIC_COMMON_UI_URL || "http://localhost:3000",
    admin: process.env.NEXT_PUBLIC_ADMIN_UI_URL || "http://localhost:3001",
    wall: process.env.NEXT_PUBLIC_WALL_UI_URL || "http://localhost:3003",
    booking: process.env.NEXT_PUBLIC_BOOKING_UI_URL || "http://localhost:3004",
    gate: process.env.NEXT_PUBLIC_GATE_UI_URL || "http://localhost:3005",
    billing: process.env.NEXT_PUBLIC_BILLING_UI_URL || "http://localhost:3007",
  };
}

const RESIDENTE_LINKS: PlatformLink[] = [
  { id: "inicio", label: "Inicio", app: "common", path: "/residente", icon: "home" },
  { id: "tablero", label: "Tablero", app: "wall", path: "/", icon: "board" },
  { id: "zonas-comunes", label: "Zonas comunes", app: "booking", path: "/", icon: "calendar" },
  { id: "finanzas", label: "Administración", app: "billing", path: "/", icon: "billing" },
];

const VIGILANTE_LINKS: PlatformLink[] = [
  { id: "inicio", label: "Inicio", app: "common", path: "/vigilante", icon: "home" },
  { id: "porteria", label: "Portería", app: "gate", path: "/", icon: "gate" },
  { id: "tablero", label: "Tablero", app: "wall", path: "/", icon: "board" },
];

const ADMINISTRACION_LINKS: PlatformLink[] = [
  { id: "inicio", label: "Inicio", app: "admin", path: "/", icon: "home" },
  { id: "tablero", label: "Tablero", app: "wall", path: "/", icon: "board" },
  { id: "zonas-comunes", label: "Zonas comunes", app: "booking", path: "/", icon: "calendar" },
  { id: "porteria", label: "Portería", app: "gate", path: "/", icon: "gate" },
  {
    id: "apartamentos",
    label: "Apartamentos",
    app: "admin",
    path: "/apartamentos",
    icon: "building",
  },
  { id: "vigilantes", label: "Vigilantes", app: "admin", path: "/vigilantes", icon: "shield" },
  { id: "contacto", label: "Contacto", app: "admin", path: "/contacto", icon: "mail" },
  { id: "finanzas", label: "Finanzas", app: "billing", path: "/", icon: "billing" },
];

export const PROFILE_LINK: PlatformLink = {
  id: "perfil",
  label: "Editar perfil",
  app: "common",
  path: "/perfil",
  icon: "home",
};

export function platformRoleOf(roles: readonly string[]): PlatformRole {
  if (roles.includes("ADMINISTRACION")) return "ADMINISTRACION";
  if (roles.includes("VIGILANTE")) return "VIGILANTE";
  return "RESIDENTE";
}

export function platformLinksFor(roles: readonly string[]): PlatformLink[] {
  const role = platformRoleOf(roles);
  if (role === "ADMINISTRACION") return ADMINISTRACION_LINKS;
  if (role === "VIGILANTE") return VIGILANTE_LINKS;
  return RESIDENTE_LINKS;
}

export function platformHref(
  link: PlatformLink,
  currentApp: PlatformApp,
  urls: PlatformUrls,
): string {
  if (link.app === currentApp) return link.path;
  return new URL(link.path, urls[link.app]).toString();
}

function matchesPath(pathname: string, path: string): boolean {
  return path === "/" || pathname === path || pathname.startsWith(`${path}/`);
}

export function activeLinkId<T extends { id: string; path: string }>(
  links: readonly T[],
  pathname: string,
): string | undefined {
  return links
    .filter((link) => matchesPath(pathname, link.path))
    .sort((a, b) => b.path.length - a.path.length)[0]?.id;
}

export function activePlatformLinkId(
  links: readonly PlatformLink[],
  currentApp: PlatformApp,
  pathname: string,
): string | undefined {
  return activeLinkId(
    links.filter((link) => link.app === currentApp),
    pathname,
  );
}
