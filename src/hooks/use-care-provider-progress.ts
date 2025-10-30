"use client";

import { useEffect, useState } from "react";

export type CareProviderProgress =
  | "basic"
  | "professional"
  | "documents"
  | "awaiting"
  | "approved";

const STORAGE_KEY = "care-provider-progress";

export function useCareProviderProgress() {
  const [progress, setProgress] = useState<CareProviderProgress>(() => {
    if (typeof window === "undefined") return "basic";
    const stored = window.localStorage.getItem(STORAGE_KEY) as CareProviderProgress | null;
    return stored ?? "basic";
  });
  // derive hydration without setting state inside an effect
  const [hydrated] = useState(() => typeof window !== "undefined");

  const updateProgress = (next: CareProviderProgress) => {
    setProgress(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  };

  useEffect(() => {
    if (progress === "awaiting") {
      const timer = setTimeout(() => updateProgress("approved"), 3500);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  const resetProgress = () => {
    updateProgress("basic");
  };

  return { progress, setProgress: updateProgress, resetProgress, hydrated };
}
