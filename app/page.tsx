"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@gr/shared-ui";
import { content } from "@/config/content";
import { homeRouteFor } from "@/lib/roles";
import { useAuth } from "@/features/auth/auth-provider";

export default function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    router.replace(user ? homeRouteFor(user.roles) : "/login");
  }, [loading, user, router]);

  return (
    <div className="standalone-state">
      <Skeleton label={content.auth.loading} />
    </div>
  );
}
