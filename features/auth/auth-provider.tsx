"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ChangePasswordValues, LoginValues, ProfileValues } from "@gr/shared-ui";
import { onSessionExpired } from "@/lib/http-client";
import { authService, type AppUser } from "@/services/auth-service";

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  sessionError: boolean;
  login: (values: LoginValues) => Promise<AppUser>;
  logout: () => Promise<void>;
  updateProfile: (values: ProfileValues) => Promise<void>;
  changePassword: (values: ChangePasswordValues) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState(false);

  useEffect(() => {
    let active = true;
    authService
      .getSession()
      .then((profile) => {
        if (active) setUser(profile);
      })
      .catch(() => {
        if (active) setSessionError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => onSessionExpired(() => setUser(null)), []);

  async function login(values: LoginValues) {
    const profile = await authService.login(values);
    setUser(profile);
    setSessionError(false);
    return profile;
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  async function updateProfile(values: ProfileValues) {
    const profile = await authService.updateProfile(values);
    setUser(profile);
  }

  async function changePassword(values: ChangePasswordValues) {
    await authService.changePassword(values);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, sessionError, login, logout, updateProfile, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth requires AuthProvider");
  return context;
}
