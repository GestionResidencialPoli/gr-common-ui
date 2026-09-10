import assert from "node:assert/strict";
import test from "node:test";
import { AuthError } from "../services/auth-error.ts";
import { authErrorCodeOf, authErrorMessage } from "../services/auth-error-messages.ts";

const FALLBACK = "mensaje generico";

test("uses the message mapped to the error code", () => {
  const message = authErrorMessage(
    new AuthError("invalid_credentials"),
    { invalid_credentials: "credenciales incorrectas" },
    FALLBACK,
  );

  assert.equal(message, "credenciales incorrectas");
});

test("falls back when the code has no message mapped", () => {
  const message = authErrorMessage(
    new AuthError("weak_password"),
    { invalid_profile: "otro" },
    FALLBACK,
  );

  assert.equal(message, FALLBACK);
});

test("falls back for an error that is not an AuthError", () => {
  assert.equal(
    authErrorMessage(new Error("boom"), { invalid_credentials: "x" }, FALLBACK),
    FALLBACK,
  );
});

test("falls back for a thrown value that is not an Error at all", () => {
  assert.equal(authErrorMessage("texto suelto", {}, FALLBACK), FALLBACK);
  assert.equal(authErrorMessage(undefined, {}, FALLBACK), FALLBACK);
});

test("exposes the code only for an AuthError", () => {
  assert.equal(authErrorCodeOf(new AuthError("not_configured")), "not_configured");
  assert.equal(authErrorCodeOf(new Error("boom")), undefined);
  assert.equal(authErrorCodeOf(null), undefined);
});

test("keeps the code reachable on the error instance", () => {
  const error = new AuthError("incorrect_current_password");

  assert.equal(error.name, "AuthError");
  assert.equal(error.code, "incorrect_current_password");
  assert.ok(error instanceof Error);
});
