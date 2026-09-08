import type { ChangePasswordValues, LoginValues, Profile, ProfileValues } from "@gr/shared-ui";

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

export type AuthErrorCode =
  | "invalid_credentials"
  | "not_authenticated"
  | "invalid_profile"
  | "incorrect_current_password"
  | "weak_password"
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
