import type { ReactNode } from "react";
import { AuthenticatedShell } from "@/features/auth/authenticated-shell";

export default function CommunityLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
