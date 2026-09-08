"use client";

import { useState } from "react";
import { Avatar, Card, ProfileForm, type ProfileValues } from "@gr/shared-ui";
import { content } from "@/config/content";
import { useAuth } from "@/features/auth/auth-provider";
import { AuthError } from "@/services/auth-service";

export function ProfileScreen() {
  const { user, updateProfile } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [revision, setRevision] = useState(0);

  async function submit(values: ProfileValues) {
    setPending(true);
    setError(undefined);
    setSuccess(undefined);
    try {
      await updateProfile(values);
      setRevision((value) => value + 1);
      setSuccess(content.profile.saved);
    } catch (error) {
      setError(
        error instanceof AuthError && error.code === "invalid_profile"
          ? content.profile.invalid
          : content.profile.failed,
      );
    } finally {
      setPending(false);
    }
  }

  if (!user) return null;
  return (
    <>
      <div className="page-heading">
        <span className="gr-eyebrow">{content.profile.eyebrow}</span>
        <h1>{content.profile.title}</h1>
        <p>{content.profile.description}</p>
      </div>
      <div className="profile-grid">
        <Card className="profile-card">
          <h2>{content.profile.formTitle}</h2>
          <ProfileForm
            key={revision}
            initialValues={user}
            labels={content.profileLabels}
            pending={pending}
            error={error}
            success={success}
            onSubmit={submit}
          />
        </Card>
        <Card className="profile-summary">
          <Avatar name={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <p>{user.phone}</p>
          <hr />
          <h3>{content.profile.summaryTitle}</h3>
          <p>{content.profile.summaryDescription}</p>
        </Card>
      </div>
    </>
  );
}
