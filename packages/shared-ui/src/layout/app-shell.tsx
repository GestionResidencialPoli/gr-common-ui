import type { ReactNode } from "react";
import type { NavigationItem } from "../types";
import { Avatar } from "../components/primitives";
import { DropdownMenu } from "../navigation/dropdown-menu";

type AppShellProps = {
  brand: { name: string; description: string; mark: string; href: string };
  navigation: NavigationItem[];
  activeId?: string;
  user: { name: string; caption: string };
  userMenuItems: NavigationItem[];
  labels: { navigation: string; menu: string; skip: string; footer: string };
  eyebrow: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AppShell({
  brand,
  navigation,
  activeId,
  user,
  userMenuItems,
  labels,
  eyebrow,
  actions,
  children,
}: AppShellProps) {
  const links = navigation.map((item) => (
    <a key={item.id} href={item.href} aria-current={activeId === item.id ? "page" : undefined}>
      <span className="gr-nav-icon">{item.icon}</span>
      {item.label}
    </a>
  ));
  return (
    <div className="gr-shell">
      <a className="gr-skip" href="#main-content">
        {labels.skip}
      </a>
      <aside className="gr-sidebar">
        <a className="gr-brand" href={brand.href}>
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
