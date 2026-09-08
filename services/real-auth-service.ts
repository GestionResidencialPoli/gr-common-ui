import { apiFetch, ApiClientError } from "@/lib/http-client";
import { AuthError, type AppUser, type AuthService, type Role } from "./auth-service";

type MeResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  roles: string[];
};

function toAppUser(me: MeResponse): AppUser {
  return {
    id: String(me.id),
    name: `${me.firstName} ${me.lastName}`.trim(),
    email: me.email,
    phone: me.phone ?? "",
    roles: me.roles as Role[],
  };
}

export function createRealAuthService(): AuthService {
  return {
    async getSession() {
      try {
        const me = await apiFetch<MeResponse>("/api/v1/auth/me");
        return toAppUser(me);
      } catch (error) {
        if (error instanceof ApiClientError && error.status === 401) return null;
        throw error;
      }
    },
    async login({ email, password }) {
      try {
        await apiFetch("/api/v1/auth/login", { method: "POST", body: { email, password } });
      } catch (error) {
        if (error instanceof ApiClientError && error.status === 401) {
          throw new AuthError("invalid_credentials");
        }
        throw error;
      }
      const me = await apiFetch<MeResponse>("/api/v1/auth/me");
      return toAppUser(me);
    },
    async logout() {
      await apiFetch("/api/v1/auth/logout", { method: "POST" });
    },
    async updateProfile() {
      throw new AuthError("not_configured");
    },
  };
}
