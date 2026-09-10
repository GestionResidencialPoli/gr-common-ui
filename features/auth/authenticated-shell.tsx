"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell, Button, EmptyState, Feedback, Skeleton } from "@gr/shared-ui";
import { content } from "@/config/content";
import { navigationFor } from "@/config/modules";
import { homeRouteFor } from "@/lib/roles";
import type { Role } from "@/services/auth-service";
import { useAuth } from "./auth-provider";

export function AuthenticatedShell({
  children,
  requiredRole,
}: {
  children: ReactNode;
  requiredRole?: Role;
}) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  async function signOut() {
    setPending(true);
    setError(false);
    try {
      await logout();
      router.replace("/login");
    } catch {
      setError(true);
    } finally {
      setPending(false);
    }
  }

  if (loading || !user)
    return (
      <div className="standalone-state">
        <Skeleton label={content.auth.loading} />
      </div>
    );

  const homeHref = homeRouteFor(user.roles);
  const navigation = navigationFor(user.roles);
  const activeId = navigation.find((item) => item.href === pathname)?.id;
  const hasAccess = !requiredRole || user.roles.includes(requiredRole);

  return (
    <AppShell
      brand={{ ...content.brand, href: homeHref }}
      navigation={navigation}
      activeId={activeId}
      user={{ name: user.name, caption: content.profile.caption }}
      userMenuItems={[{ id: "profile", label: content.profile.link, href: "/perfil" }]}
      labels={content.shell}
      eyebrow={content.brand.description}
      actions={
        <Button variant="ghost" disabled={pending} onClick={signOut}>
          {pending ? content.auth.loggingOut : content.auth.logout}
        </Button>
      }
    >
      {error && <Feedback error>{content.auth.logoutError}</Feedback>}
      {hasAccess ? (
        children
      ) : (
        <EmptyState
          title={content.accessDenied.title}
          description={content.accessDenied.description}
        >
          <a className="gr-button gr-button--secondary" href={homeHref}>
            {content.accessDenied.back}
          </a>
        </EmptyState>
      )}
      <footer className="page-footer">
        <span>{content.footer.left}</span>
        <span>{content.footer.right}</span>
      </footer>
    </AppShell>
  );
}
