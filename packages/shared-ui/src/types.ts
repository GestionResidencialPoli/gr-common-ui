import type { ReactNode } from "react";

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  icon?: ReactNode;
};

export type HomeModule = NavigationItem & { description: string; actionLabel: string };
export type Profile = { id: string; name: string; email: string; phone: string };
export type ProfileValues = Pick<Profile, "name" | "phone">;
export type LoginValues = { email: string; password: string };

export type LoginLabels = {
  email: string;
  password: string;
  showPassword: string;
  hidePassword: string;
  submit: string;
  pending: string;
};

export type ProfileLabels = {
  name: string;
  email: string;
  emailHelp: string;
  phone: string;
  submit: string;
  pending: string;
  reset: string;
};
