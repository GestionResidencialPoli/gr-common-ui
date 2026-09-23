import { AuthError, type AuthErrorCode } from "./auth-error.ts";

export type AuthErrorMessages = Partial<Record<AuthErrorCode, string>>;

export function authErrorCodeOf(error: unknown): AuthErrorCode | undefined {
  return error instanceof AuthError ? error.code : undefined;
}

export function authErrorMessage(
  error: unknown,
  messages: AuthErrorMessages,
  fallback: string,
): string {
  const code = authErrorCodeOf(error);
  return (code && messages[code]) ?? fallback;
}
