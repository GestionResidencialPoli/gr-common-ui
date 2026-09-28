import type { HomeModule, NavigationItem } from "@gestionresidencial/shared-ui";
import { ModuleIcon } from "@/components/module-icon";
import { authUiLoginUrl, type Role } from "@gestionresidencial/auth-client";

export const modules: HomeModule[] = [
  {
    id: "tablero",
    label: "Tablero",
    description: "Noticias, comunicados y lo que está pasando en tu unidad.",
    href: "/residente/modulos/tablero",
    icon: <ModuleIcon name="board" />,
    actionLabel: "Ver novedades",
  },
  {
    id: "administracion",
    label: "Administración",
    description: "Consulta tu estado de cuenta y gestiona tus pagos.",
    href: "/residente/modulos/administracion",
    icon: <ModuleIcon name="billing" />,
    actionLabel: "Consultar administración",
  },
  {
    id: "reservas",
    label: "Zonas comunes",
    description: "Encuentra un espacio para disfrutar y organiza tu próxima reserva.",
    href: "/residente/modulos/reservas",
    icon: <ModuleIcon name="calendar" />,
    actionLabel: "Explorar espacios",
  },
];

export const parkingModule: HomeModule = {
  id: "parqueaderos",
  label: "Parqueaderos",
  description: "Consulta la disponibilidad de parqueaderos de tu unidad.",
  href: "/residente/modulos/parqueaderos",
  icon: <ModuleIcon name="parking" />,
  actionLabel: "Ver disponibilidad",
};

export const residenteNavigation: NavigationItem[] = [
  { id: "home", label: "Inicio", href: "/residente", icon: <ModuleIcon name="home" /> },
  ...modules,
];

export const vigilanteModules: HomeModule[] = [
  {
    id: "porteria",
    label: "Portería",
    description: "Registra el ingreso y la salida de visitantes y consulta el aforo de parqueadero.",
    href: "/vigilante/porteria",
    icon: <ModuleIcon name="parking" />,
    actionLabel: "Ir a portería",
  },
  {
    id: "tablero",
    label: "Tablero",
    description: "Noticias, comunicados y lo que está pasando en tu unidad.",
    href: "/vigilante/tablero",
    icon: <ModuleIcon name="board" />,
    actionLabel: "Ver novedades",
  },
];

export const vigilanteNavigation: NavigationItem[] = [
  { id: "home", label: "Inicio", href: "/vigilante", icon: <ModuleIcon name="home" /> },
  ...vigilanteModules,
];

export const adminNavigation: NavigationItem[] = [
  { id: "home", label: "Inicio", href: authUiLoginUrl(), icon: <ModuleIcon name="home" /> },
];

export function navigationFor(roles: Role[]): NavigationItem[] {
  if (roles.includes("ADMINISTRACION")) return adminNavigation;
  if (roles.includes("VIGILANTE")) return vigilanteNavigation;
  return residenteNavigation;
}
