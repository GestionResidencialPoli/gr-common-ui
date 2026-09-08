"use client";

import type { FormEvent } from "react";
import type { LoginLabels, LoginValues } from "../types";
import { Button, Feedback, TextField } from "../components/primitives";
import { PasswordField } from "../components/password-field";

export function LoginForm({
  labels,
  pending,
  error,
  onSubmit,
}: {
  labels: LoginLabels;
  pending: boolean;
  error?: string;
  onSubmit: (values: LoginValues) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    onSubmit({ email: String(data.get("email")).trim(), password: String(data.get("password")) });
  }
  return (
    <form className="gr-form" onSubmit={submit} aria-busy={pending}>
      <TextField
        id="email"
        name="email"
        label={labels.email}
        type="email"
        autoComplete="username"
        required
        maxLength={254}
        disabled={pending}
      />
      <PasswordField
        label={labels.password}
        showLabel={labels.showPassword}
        hideLabel={labels.hidePassword}
        disabled={pending}
      />
      {error && <Feedback error>{error}</Feedback>}
      <Button type="submit" disabled={pending}>
        {pending ? labels.pending : labels.submit}
        <span aria-hidden="true">→</span>
      </Button>
    </form>
  );
}
