"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout, Feedback, LoginForm, Skeleton, type LoginValues } from "@gr/shared-ui";
import { content } from "@/config/content";
import { AuthError } from "@/services/auth-service";
import { useAuth } from "./auth-provider";

export function LoginScreen() {
  const { user, loading, sessionError, login } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  async function submit(values: LoginValues) {
    setPending(true);
    setError(undefined);
    try {
      await login(values);
      router.replace("/");
    } catch (error) {
      setError(
        error instanceof AuthError && error.code === "invalid_credentials"
          ? content.auth.invalid
          : error instanceof AuthError && error.code === "not_configured"
            ? content.auth.unavailable
            : content.auth.failed,
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthLayout brand={content.brand.name} mark={content.brand.mark} {...content.auth}>
      {loading || user ? (
        <Skeleton label={content.auth.loading} />
      ) : (
        <LoginForm labels={content.loginLabels} pending={pending} error={error} onSubmit={submit} />
      )}
      {sessionError && <Feedback error>{content.auth.failed}</Feedback>}
    </AuthLayout>
  );
}
