import { apiFetch, ApiClientError } from "@/lib/http-client";
import { AuthError } from "./auth-error.ts";
import type { ChangePasswordValues, LoginValues, Profile, ProfileValues } from "@gr/shared-ui";

export { AuthError } from "./auth-error.ts";
export type { AuthErrorCode } from "./auth-error.ts";

export type Role = "RESIDENTE" | "VIGILANTE" | "ADMINISTRACION";
export type TipoResidente = "PROPIETARIO" | "ARRENDATARIO";
export type ApartmentSummary = { torre: string; numero: string; tipoResidente: TipoResidente };
export type AppUser = Profile & { roles: Role[]; apartment: ApartmentSummary | null };

export interface AuthService {
  getSession(): Promise<AppUser | null>;
  login(values: LoginValues): Promise<AppUser>;
  logout(): Promise<void>;
  updateProfile(values: ProfileValues): Promise<AppUser>;
  changePassword(values: ChangePasswordValues): Promise<void>;
}

type MeResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  roles: string[];
  apartment: ApartmentSummary | null;
};

function toAppUser(me: MeResponse): AppUser {
  return {
    id: String(me.id),
    name: `${me.firstName} ${me.lastName}`.trim(),
    email: me.email,
    phone: me.phone ?? "",
    roles: me.roles as Role[],
    apartment: me.apartment,
  };
}

function createAuthService(): AuthService {
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
    async updateProfile({ phone }) {
      try {
        const me = await apiFetch<MeResponse>("/api/v1/auth/me", {
          method: "PATCH",
          body: { phone },
        });
        return toAppUser(me);
      } catch (error) {
        if (error instanceof ApiClientError && error.status === 400) {
          throw new AuthError("invalid_profile");
        }
        throw error;
      }
    },
    async changePassword({ currentPassword, newPassword }) {
      try {
        await apiFetch("/api/v1/auth/me/password", {
          method: "POST",
          body: { currentPassword, newPassword },
        });
      } catch (error) {
        if (error instanceof ApiClientError && error.status === 401) {
          throw new AuthError("incorrect_current_password");
        }
        if (error instanceof ApiClientError && error.status === 400) {
          throw new AuthError("weak_password");
        }
        throw error;
      }
    },
  };
}

export const authService: AuthService = createAuthService();
