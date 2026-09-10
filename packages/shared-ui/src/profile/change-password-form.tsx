"use client";

import type { FormEvent } from "react";
import type { ChangePasswordLabels, ChangePasswordValues } from "../types";
import { Button, Feedback } from "../components/primitives";
import { PasswordField } from "../components/password-field";

export function ChangePasswordForm({
  labels,
  pending,
  error,
  success,
  onSubmit,
}: {
  labels: ChangePasswordLabels;
  pending: boolean;
  error?: string;
  success?: string;
  onSubmit: (values: ChangePasswordValues) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    onSubmit({
      currentPassword: String(data.get("currentPassword")),
      newPassword: String(data.get("newPassword")),
    });
    event.currentTarget.reset();
  }
  return (
    <form className="gr-form" onSubmit={submit} aria-busy={pending}>
      <PasswordField
        name="currentPassword"
        autoComplete="current-password"
        label={labels.currentPassword}
        showLabel={labels.showPassword}
        hideLabel={labels.hidePassword}
        disabled={pending}
      />
      <PasswordField
        name="newPassword"
        autoComplete="new-password"
        label={labels.newPassword}
        showLabel={labels.showPassword}
        hideLabel={labels.hidePassword}
        disabled={pending}
      />
      {error && <Feedback error>{error}</Feedback>}
      {success && <Feedback>{success}</Feedback>}
      <Button type="submit" disabled={pending}>
        {pending ? labels.pending : labels.submit}
      </Button>
    </form>
  );
}
