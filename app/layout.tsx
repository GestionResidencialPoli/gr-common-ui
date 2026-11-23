import { connection } from "next/server";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/features/auth/auth-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Habitar · Comunidad", template: "%s · Habitar" },
  description: "Un espacio común para tu unidad residencial.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  await connection();
  const config = {
    authUiUrl: process.env.AUTH_UI_URL || process.env.NEXT_PUBLIC_AUTH_UI_URL || "http://localhost:3002",
    common: process.env.COMMON_UI_URL || process.env.NEXT_PUBLIC_COMMON_UI_URL || "http://localhost:3000",
    admin: process.env.ADMIN_UI_URL || process.env.NEXT_PUBLIC_ADMIN_UI_URL || "http://localhost:3001",
    wall: process.env.WALL_UI_URL || process.env.NEXT_PUBLIC_WALL_UI_URL || "http://localhost:3003",
    booking: process.env.BOOKING_UI_URL || process.env.NEXT_PUBLIC_BOOKING_UI_URL || "http://localhost:3004",
    gate: process.env.GATE_UI_URL || process.env.NEXT_PUBLIC_GATE_UI_URL || "http://localhost:3005",
    billing: process.env.BILLING_UI_URL || process.env.NEXT_PUBLIC_BILLING_UI_URL || "http://localhost:3007",
  };
  const runtimeScript = `window.__RUNTIME_CONFIG__=${JSON.stringify(config).replace(/</g, "\\u003c")};`;
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: runtimeScript }} />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
