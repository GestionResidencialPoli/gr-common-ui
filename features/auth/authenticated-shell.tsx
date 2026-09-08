"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell, Button, Feedback, Skeleton } from "@gr/shared-ui";
import { content } from "@/config/content";
import { navigation } from "@/config/modules";
import { useAuth } from "./auth-provider";

// This guard only manages frontend navigation. The backend must authorize data.
export function AuthenticatedShell({ children }: { children: ReactNode }) {
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
  const activeId = navigation.find((item) => item.href === pathname)?.id;

  return (
    <AppShell
      brand={content.brand}
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
      {children}
      <footer className="page-footer">
        <span>{content.footer.left}</span>
        <span>{content.footer.right}</span>
      </footer>
    </AppShell>
  );
}
