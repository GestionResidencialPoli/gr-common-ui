"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout, Feedback, LoginForm, Skeleton, type LoginValues } from "@gr/shared-ui";
import { content } from "@/config/content";
import { homeRouteFor } from "@/lib/roles";
import { authErrorMessage } from "@/services/auth-error-messages";
import { useAuth } from "./auth-provider";

export function LoginScreen() {
  const { user, loading, sessionError, login } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!loading && user) router.replace(homeRouteFor(user.roles));
  }, [loading, user, router]);

  async function submit(values: LoginValues) {
    setPending(true);
    setError(undefined);
    try {
      const profile = await login(values);
      router.replace(homeRouteFor(profile.roles));
    } catch (error) {
      setError(
        authErrorMessage(
          error,
          {
            invalid_credentials: content.auth.invalid,
            not_configured: content.auth.unavailable,
          },
          content.auth.failed,
        ),
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
