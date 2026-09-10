import type { LoginValues, Profile, ProfileValues } from "@gr/shared-ui";
import { apiFetch, ApiClientError } from "@/lib/http-client";

const PHONE_PATTERN = /^\d{10}$/;

export type Role = "RESIDENTE" | "VIGILANTE" | "ADMINISTRACION";
export type AppUser = Profile & { roles: Role[] };

export interface AuthService {
  getSession(): Promise<AppUser | null>;
  login(values: LoginValues): Promise<AppUser>;
  logout(): Promise<void>;
  updateProfile(values: ProfileValues): Promise<AppUser>;
}

export const AUTH_ERROR = {
  InvalidCredentials: "invalid_credentials",
  NotAuthenticated: "not_authenticated",
  InvalidProfile: "invalid_profile",
  StorageUnavailable: "storage_unavailable",
} as const;

export type AuthErrorCode = (typeof AUTH_ERROR)[keyof typeof AUTH_ERROR];

export class AuthError extends Error {
  public code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.code = code;
    this.name = "AuthError";
  }
}

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

export const authService: AuthService = {
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
        throw new AuthError(AUTH_ERROR.InvalidCredentials);
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
    const normalizedPhone = phone.trim();
    if (!PHONE_PATTERN.test(normalizedPhone)) throw new AuthError(AUTH_ERROR.InvalidProfile);

    try {
      const me = await apiFetch<MeResponse | void>("/api/v1/auth/me", {
        method: "PATCH",
        body: { phone: normalizedPhone },
      });
      if (me) return toAppUser(me);
      const refreshedProfile = await apiFetch<MeResponse>("/api/v1/auth/me");
      return toAppUser(refreshedProfile);
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 400) {
        throw new AuthError(AUTH_ERROR.InvalidProfile);
      }
      throw error;
    }
  },
};
