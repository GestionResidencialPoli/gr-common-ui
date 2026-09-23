import type { ReactNode } from "react";
import { AuthenticatedShell } from "@/features/auth/authenticated-shell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedShell requiredRole="ADMINISTRACION">{children}</AuthenticatedShell>;
}
