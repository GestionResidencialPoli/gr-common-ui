import type { AuthService } from "./auth-service";
import { createDemoAuthService } from "./demo-auth-service";
import { createRealAuthService } from "./real-auth-service";

export const isDemoMode =
  process.env.NEXT_PUBLIC_AUTH_MODE === "demo" ||
  (!process.env.NEXT_PUBLIC_AUTH_MODE && process.env.NODE_ENV === "development");

export const authService: AuthService = isDemoMode
  ? createDemoAuthService(() => window.sessionStorage)
  : createRealAuthService();
