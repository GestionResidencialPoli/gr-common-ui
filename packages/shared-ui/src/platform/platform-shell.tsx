"use client";

import type { MouseEvent, ReactNode } from "react";
import type { NavigationItem } from "../types";
import { Button } from "../components/primitives";
import { AppShell } from "../layout/app-shell";
import { PlatformIcon } from "./platform-icon";
import {
  PROFILE_LINK,
  activeLinkId,
  activePlatformLinkId,
  platformHref,
  platformLinksFor,
  platformRoleOf,
  platformUrls,
  type PlatformApp,
  type PlatformRole,
} from "./platform";

export type PlatformSubLink = { id: string; label: string; path: string };

const ROLE_CAPTIONS: Record<PlatformRole, string> = {
  RESIDENTE: "Residente",
  VIGILANTE: "Vigilante",
  ADMINISTRACION: "Administración",
};

const BRAND = { name: "Habitar", description: "Tu comunidad, en un lugar", mark: "h." };

const LABELS = {
  navigation: "Mi comunidad",
  menu: "Abrir navegación",
  skip: "Saltar al contenido",
  footer: "Un espacio para todos",
};

function isPlainClick(event: MouseEvent<HTMLAnchorElement>): boolean {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export function PlatformShell({
  app,
  pathname,
  user,
  subNavigation = [],
  onOpenApp,
  onLogout,
  loggingOut = false,
  children,
}: {
  app: PlatformApp;
  pathname: string;
  user: { name: string; roles: readonly string[] };
  subNavigation?: PlatformSubLink[];
  onOpenApp: (url: string) => void;
  onLogout: () => void;
  loggingOut?: boolean;
  children: ReactNode;
}) {
  const urls = platformUrls();
  const links = platformLinksFor(user.roles);
  const navigation: NavigationItem[] = links.map((link) => ({
    id: link.id,
    label: link.label,
    href: platformHref(link, app, urls),
    icon: <PlatformIcon name={link.icon} />,
  }));
  const subItems: NavigationItem[] = subNavigation.map((link) => ({
    id: link.id,
    label: link.label,
    href: link.path,
  }));
  const activeSubId = subNavigation.length > 1 ? activeLinkId(subNavigation, pathname) : undefined;

  function navigate(item: NavigationItem, event: MouseEvent<HTMLAnchorElement>) {
    if (!isPlainClick(event)) return;
    const target = new URL(item.href, window.location.href);
    if (target.origin === window.location.origin) return;
    event.preventDefault();
    onOpenApp(target.toString());
  }

  return (
    <AppShell
      brand={{ ...BRAND, href: navigation[0].href }}
      navigation={navigation}
      activeId={activePlatformLinkId(links, app, pathname)}
      subNavigation={subNavigation.length > 1 ? subItems : []}
      activeSubId={activeSubId}
      user={{ name: user.name, caption: ROLE_CAPTIONS[platformRoleOf(user.roles)] }}
      userMenuItems={[
        {
          id: PROFILE_LINK.id,
          label: PROFILE_LINK.label,
          href: platformHref(PROFILE_LINK, app, urls),
        },
      ]}
      labels={LABELS}
      eyebrow={BRAND.description}
      onNavigate={navigate}
      actions={
        <Button variant="ghost" disabled={loggingOut} onClick={onLogout}>
          {loggingOut ? "Cerrando sesión…" : "Cerrar sesión"}
        </Button>
      }
    >
      {children}
    </AppShell>
  );
}
