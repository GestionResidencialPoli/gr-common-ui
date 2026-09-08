import type { Profile } from "@gr/shared-ui";
import { AuthError, type AuthService } from "./auth-service.ts";

export const DEMO_EMAIL = "residente@demo.com";
export const DEMO_PASSWORD = "Demo1234!";
const SESSION_KEY = "gr-demo-session";
const PROFILE_KEY = "gr-demo-profile";
const initialProfile: Profile = {
  id: "demo-resident",
  name: "Andrea Martínez",
  email: DEMO_EMAIL,
  phone: "300 123 4567",
};

type DemoStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function isDemoProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Record<string, unknown>;
  return (
    profile.id === initialProfile.id &&
    profile.email === DEMO_EMAIL &&
    typeof profile.name === "string" &&
    typeof profile.phone === "string"
  );
}

// A UI demo, not authentication. Never store real passwords or tokens here.
// A storage factory allows SSR to import this file without reading window.
export function createDemoAuthService(getStorage: () => DemoStorage): AuthService {
  function storage() {
    try {
      return getStorage();
    } catch {
      throw new AuthError("storage_unavailable");
    }
  }

  function readProfile(): Profile {
    try {
      const saved = storage().getItem(PROFILE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (isDemoProfile(parsed)) return parsed;
      }
    } catch (error) {
      if (error instanceof AuthError) throw error;
      // Old or malformed demo data can be safely replaced with the sample.
    }
    return { ...initialProfile };
  }

  function write(key: string, value: string) {
    try {
      storage().setItem(key, value);
    } catch {
      throw new AuthError("storage_unavailable");
    }
  }

  return {
    async getSession() {
      try {
        return storage().getItem(SESSION_KEY) === "active" ? readProfile() : null;
      } catch {
        throw new AuthError("storage_unavailable");
      }
    },
    async login({ email, password }) {
      if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD)
        throw new AuthError("invalid_credentials");
      const profile = readProfile();
      write(SESSION_KEY, "active");
      return profile;
    },
    async logout() {
      try {
        storage().removeItem(SESSION_KEY);
      } catch {
        throw new AuthError("storage_unavailable");
      }
    },
    async updateProfile(values) {
      const current = await this.getSession();
      if (!current) throw new AuthError("not_authenticated");
      const name = values.name.trim();
      const phone = values.phone.trim();
      if (!name || name.length > 100 || phone.length > 30) throw new AuthError("invalid_profile");
      const updated = { ...current, name, phone };
      write(PROFILE_KEY, JSON.stringify(updated));
      return updated;
    },
  };
}
