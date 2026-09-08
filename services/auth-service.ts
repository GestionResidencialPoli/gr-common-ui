import type { LoginValues, Profile, ProfileValues } from "@gr/shared-ui";

// This contract is the only piece a future API adapter must implement.
export interface AuthService {
  getSession(): Promise<Profile | null>;
  login(values: LoginValues): Promise<Profile>;
  logout(): Promise<void>;
  updateProfile(values: ProfileValues): Promise<Profile>;
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
