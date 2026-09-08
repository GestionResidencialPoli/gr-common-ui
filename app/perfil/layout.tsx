import type { ReactNode } from "react";
import { AuthenticatedShell } from "@/features/auth/authenticated-shell";

export default function PerfilLayout({ children }: { children: ReactNode }) {
  return <AuthenticatedShell>{children}</AuthenticatedShell>;
}
