"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useAuthSession } from "./use-auth-session";

export type CareProviderProgress =
  | "basic"
  | "professional"
  | "documents"
  | "awaiting"
  | "approved";

const STORAGE_KEY = "care-provider-progress";

export function useCareProviderProgress() {
  const { user } = useAuthSession();
  const [progress, setProgress] = useState<CareProviderProgress>(() => {
    if (typeof window === "undefined") return "basic";
    const stored = window.localStorage.getItem(STORAGE_KEY) as CareProviderProgress | null;
    return stored ?? "basic";
  });
  // derive hydration without setting state inside an effect
  const [hydrated] = useState(() => typeof window !== "undefined");

  // Load progress from database on mount
  useEffect(() => {
    const loadProgressFromDB = async () => {
      if (user) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("setup_progress")
          .eq("id", user.id)
          .single();

        if (!error && data?.setup_progress) {
          const dbProgress = data.setup_progress as CareProviderProgress;
          setProgress(dbProgress);
          // Update localStorage to match
          if (typeof window !== "undefined") {
            window.localStorage.setItem(STORAGE_KEY, dbProgress);
          }
        }
      }
    };

    loadProgressFromDB();
  }, [user]);

  const updateProgress = useCallback(async (next: CareProviderProgress) => {
    setProgress(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }

    // Save to database
    if (user) {
      const supabase = createClient();
      await supabase
        .from("profiles")
        .update({ setup_progress: next })
        .eq("id", user.id);
    }
  }, [user]);

  useEffect(() => {
    if (progress === "awaiting") {
      const timer = setTimeout(() => updateProgress("approved"), 3500);
      return () => clearTimeout(timer);
    }
  }, [progress, updateProgress]);

  const resetProgress = () => {
    updateProgress("basic");
  };

  return { progress, setProgress: updateProgress, resetProgress, hydrated };
}
