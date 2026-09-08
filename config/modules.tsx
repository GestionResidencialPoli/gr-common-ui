import type { HomeModule, NavigationItem } from "@gr/shared-ui";
import { ModuleIcon } from "@/components/module-icon";

// Replace href with each frontend's destination when those apps are available.
export const modules: HomeModule[] = [
  {
    id: "tablero",
    label: "Tablero",
    description: "Noticias, comunicados y lo que está pasando en tu unidad.",
    href: "/modulos/tablero",
    icon: <ModuleIcon name="board" />,
    actionLabel: "Ver novedades",
  },
  {
    id: "administracion",
    label: "Administración",
    description: "Consulta tu estado de cuenta y gestiona tus pagos.",
    href: "/modulos/administracion",
    icon: <ModuleIcon name="billing" />,
    actionLabel: "Consultar administración",
  },
  {
    id: "reservas",
    label: "Zonas comunes",
    description: "Encuentra un espacio para disfrutar y organiza tu próxima reserva.",
    href: "/modulos/reservas",
    icon: <ModuleIcon name="calendar" />,
    actionLabel: "Explorar espacios",
  },
];

export const parkingModule: HomeModule = {
  id: "parqueaderos",
  label: "Parqueaderos",
  description: "Consulta la disponibilidad de parqueaderos de tu unidad.",
  href: "/modulos/parqueaderos",
  icon: <ModuleIcon name="parking" />,
  actionLabel: "Ver disponibilidad",
};
export const navigation: NavigationItem[] = [
  { id: "home", label: "Inicio", href: "/", icon: <ModuleIcon name="home" /> },
  ...modules,
];
