import type { ReactNode } from "react";
import { AuthenticatedShell } from "@/features/auth/authenticated-shell";

export default function ResidenteLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedShell requiredRole="RESIDENTE">{children}</AuthenticatedShell>;
}
