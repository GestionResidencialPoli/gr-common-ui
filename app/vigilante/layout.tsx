import type { ReactNode } from "react";
import { AuthenticatedShell } from "@/features/auth/authenticated-shell";

export default function VigilanteLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedShell requiredRole="VIGILANTE">{children}</AuthenticatedShell>;
}
