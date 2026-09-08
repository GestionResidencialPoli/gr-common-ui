"use client";

import { useState } from "react";
import {
  Avatar,
  Card,
  ChangePasswordForm,
  ProfileForm,
  type ChangePasswordValues,
  type ProfileValues,
} from "@gr/shared-ui";
import { content } from "@/config/content";
import { isDemoMode } from "@/services";
import { useAuth } from "@/features/auth/auth-provider";
import { AuthError } from "@/services/auth-service";

export function ProfileScreen() {
  const { user, updateProfile, changePassword } = useAuth();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [revision, setRevision] = useState(0);

  const [passwordPending, setPasswordPending] = useState(false);
  const [passwordError, setPasswordError] = useState<string>();
  const [passwordSuccess, setPasswordSuccess] = useState<string>();

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

  async function submitPasswordChange(values: ChangePasswordValues) {
    setPasswordPending(true);
    setPasswordError(undefined);
    setPasswordSuccess(undefined);
    try {
      await changePassword(values);
      setPasswordSuccess(content.changePassword.saved);
    } catch (error) {
      setPasswordError(
        error instanceof AuthError && error.code === "incorrect_current_password"
          ? content.changePassword.incorrect
          : error instanceof AuthError && error.code === "weak_password"
            ? content.changePassword.weak
            : content.changePassword.failed,
      );
    } finally {
      setPasswordPending(false);
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
            nameEditable={isDemoMode}
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
          <dl className="profile-details">
            <dt>{content.profile.role}</dt>
            <dd>{user.roles.map((role) => content.roleLabels[role]).join(", ")}</dd>
            <dt>{content.profile.apartment}</dt>
            <dd>
              {user.apartment
                ? `Torre ${user.apartment.torre}, ${user.apartment.numero} · ${content.residencyLabels[user.apartment.tipoResidente]}`
                : content.profile.noApartment}
            </dd>
          </dl>
        </Card>
        <Card className="profile-card">
          <h2>{content.changePassword.title}</h2>
          <p>{content.changePassword.description}</p>
          <ChangePasswordForm
            labels={content.changePasswordLabels}
            pending={passwordPending}
            error={passwordError}
            success={passwordSuccess}
            onSubmit={submitPasswordChange}
          />
        </Card>
      </div>
    </>
  );
}
