export const AUTH_ERROR = {
  InvalidCredentials: "invalid_credentials",
  NotAuthenticated: "not_authenticated",
  InvalidProfile: "invalid_profile",
  IncorrectCurrentPassword: "incorrect_current_password",
  WeakPassword: "weak_password",
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
