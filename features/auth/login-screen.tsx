"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLayout, Feedback, LoginForm, Skeleton, type LoginValues } from "@gr/shared-ui";
import { content } from "@/config/content";
import { homeRouteFor } from "@/lib/roles";
import { AUTH_ERROR } from "@/services/auth-service";
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
            [AUTH_ERROR.InvalidCredentials]: content.auth.invalid,
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
