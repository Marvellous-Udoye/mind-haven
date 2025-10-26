"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  StoredUserProfiles,
  UserIdentity,
  UserProfile,
} from "../types/user";

interface AuthSessionContextValue {
  profile: UserProfile | null;
  identity: UserIdentity | null;
  hydrated: boolean;
  saveProfile: (profile: UserProfile) => void;
  updateActiveProfile: (
    updater: (current: UserProfile | null) => UserProfile | null
  ) => void;
  selectIdentity: (identity: UserIdentity | null) => void;
  clearProfiles: () => void;
}

interface AuthSessionState {
  activeIdentity: UserIdentity | null;
  profiles: StoredUserProfiles;
}

const STORAGE_KEY = "mind-haven-session";

const defaultState: AuthSessionState = {
  activeIdentity: null,
  profiles: {},
};

const AuthSessionContext = createContext<AuthSessionContextValue | undefined>(
  undefined
);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthSessionState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<AuthSessionState>;
        setState({
          activeIdentity:
            parsed?.activeIdentity === "seeker" || parsed?.activeIdentity === "provider"
              ? parsed.activeIdentity
              : null,
          profiles:
            typeof parsed?.profiles === "object" && parsed?.profiles !== null
              ? sanitizeProfiles(parsed.profiles)
              : {},
        });
      } catch {
        setState(defaultState);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const saveProfile = useCallback((profile: UserProfile) => {
    setState((prev) => ({
      activeIdentity: profile.identity,
      profiles: {
        ...prev.profiles,
        [profile.identity]: profile,
      },
    }));
  }, []);

  const updateActiveProfile = useCallback(
    (updater: (current: UserProfile | null) => UserProfile | null) => {
      setState((prev) => {
        if (!prev.activeIdentity) {
          return prev;
        }
        const current =
          prev.profiles[prev.activeIdentity] ?? null;
        const next = updater(current);
        if (next === current) {
          return prev;
        }
        if (!next) {
          const rest = { ...prev.profiles };
          delete rest[prev.activeIdentity];
          return {
            activeIdentity: null,
            profiles: rest,
          };
        }
        return {
          activeIdentity: next.identity,
          profiles: {
            ...prev.profiles,
            [next.identity]: next,
          },
        };
      });
    },
    []
  );

  const selectIdentity = useCallback((identity: UserIdentity | null) => {
    setState((prev) => ({
      ...prev,
      activeIdentity: identity,
    }));
  }, []);

  const clearProfiles = useCallback(() => {
    setState(defaultState);
  }, []);

  const profile = useMemo(() => {
    if (!state.activeIdentity) {
      return null;
    }
    return state.profiles[state.activeIdentity] ?? null;
  }, [state.activeIdentity, state.profiles]);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      profile,
      identity: state.activeIdentity,
      hydrated,
      saveProfile,
      updateActiveProfile,
      selectIdentity,
      clearProfiles,
    }),
    [profile, state.activeIdentity, hydrated, saveProfile, updateActiveProfile, selectIdentity, clearProfiles]
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return context;
}

function sanitizeProfiles(
  rawProfiles: Partial<Record<string, unknown>>
): StoredUserProfiles {
  const result: StoredUserProfiles = {};
  for (const [key, value] of Object.entries(rawProfiles)) {
    if (
      (key === "seeker" || key === "provider") &&
      typeof value === "object" &&
      value !== null
    ) {
      const maybeProfile = value as Record<string, unknown>;
      const identity = maybeProfile.identity;
      if (identity === "seeker" || identity === "provider") {
        result[identity] = {
          identity,
          firstName: String(maybeProfile.firstName ?? ""),
          lastName: String(maybeProfile.lastName ?? ""),
          email: String(maybeProfile.email ?? ""),
          phone: String(maybeProfile.phone ?? ""),
          dob: String(maybeProfile.dob ?? ""),
          gender: String(maybeProfile.gender ?? ""),
          createdAt: String(
            maybeProfile.createdAt ??
              new Date().toISOString()
          ),
        };
      }
    }
  }
  return result;
}
