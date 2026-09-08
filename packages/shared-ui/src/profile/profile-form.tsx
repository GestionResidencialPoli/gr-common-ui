"use client";

import { useId, type FormEvent, type ReactNode } from "react";
import type { Profile, ProfileLabels, ProfileValues } from "../types";
import { Button, Feedback, TextField } from "../components/primitives";

export function ProfileForm({
  initialValues,
  labels,
  pending,
  error,
  success,
  onSubmit,
  children,
}: {
  initialValues: Profile;
  labels: ProfileLabels;
  pending: boolean;
  error?: string;
  success?: string;
  onSubmit: (values: ProfileValues) => void;
  children?: ReactNode;
}) {
  const id = useId();
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    onSubmit({ name: String(data.get("name")).trim(), phone: String(data.get("phone")).trim() });
  }
  return (
    <form className="gr-form" onSubmit={submit} aria-busy={pending}>
      <TextField
        id={`${id}-name`}
        name="name"
        label={labels.name}
        defaultValue={initialValues.name}
        autoComplete="name"
        required
        maxLength={100}
        pattern=".*\S.*"
        disabled={pending}
      />
      <TextField
        id={`${id}-email`}
        label={labels.email}
        value={initialValues.email}
        type="email"
        autoComplete="email"
        readOnly
        hint={labels.emailHelp}
      />
      <TextField
        id={`${id}-phone`}
        name="phone"
        label={labels.phone}
        defaultValue={initialValues.phone}
        type="tel"
        autoComplete="tel"
        maxLength={30}
        disabled={pending}
      />
      {children}
      {error && <Feedback error>{error}</Feedback>}
      {success && <Feedback>{success}</Feedback>}
      <div className="gr-form-actions">
        <Button type="submit" disabled={pending}>
          {pending ? labels.pending : labels.submit}
        </Button>
        <Button type="reset" variant="secondary" disabled={pending}>
          {labels.reset}
        </Button>
      </div>
    </form>
  );
}
