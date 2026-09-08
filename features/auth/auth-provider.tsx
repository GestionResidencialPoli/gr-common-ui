"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LoginValues, Profile, ProfileValues } from "@gr/shared-ui";
import { authService } from "@/services";

type AuthContextValue = {
  user: Profile | null;
  loading: boolean;
  sessionError: boolean;
  login: (values: LoginValues) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (values: ProfileValues) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
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

  async function login(values: LoginValues) {
    const profile = await authService.login(values);
    setUser(profile);
    setSessionError(false);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  async function updateProfile(values: ProfileValues) {
    const profile = await authService.updateProfile(values);
    setUser(profile);
  }

  return (
    <AuthContext.Provider value={{ user, loading, sessionError, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth requires AuthProvider");
  return context;
}
