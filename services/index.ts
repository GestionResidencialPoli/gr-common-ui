import { AuthError, type AuthService } from "./auth-service";
import { createDemoAuthService } from "./demo-auth-service";

// Demo defaults to development only. Production needs explicit demo opt-in.
export const isDemoMode =
  process.env.NEXT_PUBLIC_AUTH_MODE === "demo" ||
  (!process.env.NEXT_PUBLIC_AUTH_MODE && process.env.NODE_ENV === "development");

const unconfiguredService: AuthService = {
  async getSession() {
    return null;
  },
  async login() {
    throw new AuthError("not_configured");
  },
  async logout() {},
  async updateProfile() {
    throw new AuthError("not_configured");
  },
};

export const authService: AuthService = isDemoMode
  ? createDemoAuthService(() => window.sessionStorage)
  : unconfiguredService;
