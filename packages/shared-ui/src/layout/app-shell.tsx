import type { MouseEvent, ReactNode } from "react";
import type { NavigationItem } from "../types";
import { Avatar } from "../components/primitives";
import { DropdownMenu } from "../navigation/dropdown-menu";

export type NavigateHandler = (item: NavigationItem, event: MouseEvent<HTMLAnchorElement>) => void;

type AppShellProps = {
  brand: { name: string; description: string; mark: string; href: string };
  navigation: NavigationItem[];
  activeId?: string;
  subNavigation?: NavigationItem[];
  activeSubId?: string;
  user: { name: string; caption: string };
  userMenuItems: NavigationItem[];
  labels: { navigation: string; menu: string; skip: string; footer: string };
  eyebrow: string;
  actions?: ReactNode;
  onNavigate?: NavigateHandler;
  children: ReactNode;
};

export function AppShell({
  brand,
  navigation,
  activeId,
  subNavigation = [],
  activeSubId,
  user,
  userMenuItems,
  labels,
  eyebrow,
  actions,
  onNavigate,
  children,
}: AppShellProps) {
  const clickHandler = (item: NavigationItem) =>
    onNavigate ? (event: MouseEvent<HTMLAnchorElement>) => onNavigate(item, event) : undefined;
  const links = navigation.map((item) => (
    <div key={item.id} className="gr-nav-group">
      <a
        href={item.href}
        aria-current={activeId === item.id && !activeSubId ? "page" : undefined}
        data-active={activeId === item.id ? "true" : undefined}
        onClick={clickHandler(item)}
      >
        <span className="gr-nav-icon">{item.icon}</span>
        {item.label}
      </a>
      {activeId === item.id && subNavigation.length > 0 && (
        <div className="gr-subnav">
          {subNavigation.map((child) => (
            <a
              key={child.id}
              href={child.href}
              aria-current={activeSubId === child.id ? "page" : undefined}
              onClick={clickHandler(child)}
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </div>
  ));
  const brandItem: NavigationItem = { id: "brand", label: brand.name, href: brand.href };
  return (
    <div className="gr-shell">
      <a className="gr-skip" href="#main-content">
        {labels.skip}
      </a>
      <aside className="gr-sidebar">
        <a className="gr-brand" href={brand.href} onClick={clickHandler(brandItem)}>
          <span className="gr-brand-mark">{brand.mark}</span>
          <span>
            <strong>{brand.name}</strong>
            <small>{brand.description}</small>
          </span>
        </a>
        <div className="gr-nav-heading">{labels.navigation}</div>
        <nav aria-label={labels.navigation} className="gr-nav">
          {links}
        </nav>
        <div className="gr-sidebar-bottom">
          <span className="gr-status-dot" />
          {labels.footer}
        </div>
      </aside>
      <div className="gr-workspace">
        <header className="gr-topbar">
          <span className="gr-eyebrow">{eyebrow}</span>
          <div className="gr-topbar-actions">
            <DropdownMenu
              label={`${user.name} · ${user.caption}`}
              trigger={
                <span className="gr-user">
                  <Avatar name={user.name} />
                  <span>
                    <strong>{user.name}</strong>
                    <small>{user.caption}</small>
                  </span>
                  <span aria-hidden="true">⌄</span>
                </span>
              }
              items={userMenuItems}
              onNavigate={onNavigate}
            />
            {actions}
          </div>
        </header>
        <details className="gr-mobile-nav">
          <summary>{labels.menu}</summary>
          <nav aria-label={labels.navigation} className="gr-nav">
            {links}
          </nav>
        </details>
        <main id="main-content" className="gr-main" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
