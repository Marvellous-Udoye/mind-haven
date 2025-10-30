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
import type { UserIdentity, UserProfile } from "../types/user";
import { createClient } from "../utils/supabase/client";
import { User } from "@supabase/supabase-js";

interface AuthSessionContextValue {
  profile: UserProfile | null;
  user: User | null;
  identity: UserIdentity | null;
  hydrated: boolean;
  signOut: () => void;
}

const AuthSessionContext = createContext<AuthSessionContextValue | undefined>(
  undefined
);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else {
          setProfile(data as UserProfile);
        }
      }
      setHydrated(true);
    };

    fetchProfile();
  }, [user]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      profile,
      user,
      identity: (profile?.role as UserIdentity) || null,
      hydrated,
      signOut,
    }),
    [profile, user, hydrated, signOut]
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
