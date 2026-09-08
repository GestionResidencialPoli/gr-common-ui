import type { LoginValues, Profile, ProfileValues } from "@gr/shared-ui";

export type Role = "RESIDENTE" | "VIGILANTE" | "ADMINISTRACION";
export type AppUser = Profile & { roles: Role[] };

export interface AuthService {
  getSession(): Promise<AppUser | null>;
  login(values: LoginValues): Promise<AppUser>;
  logout(): Promise<void>;
  updateProfile(values: ProfileValues): Promise<AppUser>;
}

export type AuthErrorCode =
  | "invalid_credentials"
  | "not_authenticated"
  | "invalid_profile"
  | "not_configured"
  | "storage_unavailable";

export class AuthError extends Error {
  public code: AuthErrorCode;

  constructor(code: AuthErrorCode) {
    super(code);
    this.code = code;
    this.name = "AuthError";
  }
}
