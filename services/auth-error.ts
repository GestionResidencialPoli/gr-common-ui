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
