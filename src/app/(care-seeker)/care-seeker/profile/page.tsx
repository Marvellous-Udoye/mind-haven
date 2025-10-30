"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useAuthSession } from "../../../../hooks/use-auth-session";

export default function ProfilePage() {
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { profile, hydrated, signOut, user } = useAuthSession();

  const fullName = useMemo(() => {
    if (!profile) return "Guest User";
    const combined = `${profile.first_name} ${profile.last_name}`.trim();
    return combined || "Guest User";
  }, [profile]);

  const initials = useMemo(() => {
    if (!profile) return "MH";
    const first = profile.first_name?.[0] ?? "";
    const last = profile.last_name?.[0] ?? "";
    const combined = `${first}${last}`.trim();
    if (combined.length === 0) {
      return (profile.first_name || "MH").slice(0, 2).toUpperCase();
    }
    return combined.toUpperCase();
  }, [profile]);

  const profileFields = useMemo(
    () => [
      { label: "Name", value: fullName },
      { label: "Email Address", value: user?.email || "Not provided" },
      { label: "Phone Number", value: profile?.phone || "Not provided" },
      { label: "D.O.B", value: formatDate(profile?.dob) },
      { label: "Gender", value: formatCapitalized(profile?.gender) },
    ],
    [profile, fullName, user]
  );

  const handleLogout = () => {
    signOut();
    setShowLogoutConfirm(false);
    router.push("/login?identity=seeker");
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-[#52c340]">Profile</h1>

      <div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={profile?.avatar_url || "/logo.svg"}
              alt="Profile avatar"
              width={72}
              height={72}
              className="rounded-3xl border border-white/10 bg-black"
            />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#0d0d0d] bg-[#52c340] text-black text-sm font-bold">
              {initials}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold">
              {hydrated ? fullName : "Loading..."}
            </p>
            <p className="text-sm text-white/60">
              {profile?.role === "provider" ? "Care Provider" : "Care Seeker"}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {profileFields.map((field) => (
            <div
              key={field.label}
              className="rounded-2xl border border-white/10 bg-[#0b1f21] px-4 py-3 text-sm"
            >
              <p className="text-white/50">{field.label}</p>
              <p className="font-semibold">
                {hydrated ? field.value : "Loading..."}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push("/care-seeker/profile/settings")}
          className="mt-6 flex w-full items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-left text-sm"
        >
          <span>Settings</span>
          <ArrowRight size={18} />
        </button>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="mt-6 w-full rounded-2xl border border-red-500/40 py-3 text-base font-semibold text-red-400"
        >
          Logout
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
          <div className="w-[85%] rounded-2xl bg-[#0d0d0d] p-6 text-center space-y-4">
            <p className="text-lg font-semibold">Are you sure?</p>
            <p className="text-sm text-white/70">Do you want to logout?</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="rounded-2xl bg-white py-2 text-sm font-semibold text-black"
              >
                No
              </button>
              <button
                onClick={handleLogout}
                className="rounded-2xl bg-red-500 py-2 text-sm font-semibold text-white"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "Not provided";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCapitalized(value?: string) {
  if (!value) return "Not provided";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
