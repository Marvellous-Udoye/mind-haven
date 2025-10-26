"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import SimpleModal from "../../../../components/ui/simple-modal";
import { useAuthSession } from "../../../../hooks/use-auth-session";
import { useCareProviderProgress } from "../../../../hooks/use-care-provider-progress";

const menuItems = [
  { label: "Banking Details", href: "/care-provider/profile/banking" },
  { label: "Payout History", href: "/care-provider/profile/payouts" },
  { label: "Time Settings", href: "/care-provider/profile/time-settings" },
  { label: "Services", href: "/care-provider/profile/services" },
  { label: "Settings", href: "/care-provider/profile/settings" },
  { label: "Customer Support", href: "/care-provider/profile/support" },
];

export default function CareProviderProfilePage() {
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const { profile, hydrated, selectIdentity } = useAuthSession();
  const { resetProgress } = useCareProviderProgress();

  const fullName = useMemo(() => {
    if (!profile) return "Guest Provider";
    const combined = `${profile.firstName} ${profile.lastName}`.trim();
    return combined || "Guest Provider";
  }, [profile]);

  const initials = useMemo(() => {
    if (!profile) return "MH";
    const first = profile.firstName?.[0] ?? "";
    const last = profile.lastName?.[0] ?? "";
    const combined = `${first}${last}`.trim();
    if (combined.length === 0) {
      return (profile.firstName || "MH").slice(0, 2).toUpperCase();
    }
    return combined.toUpperCase();
  }, [profile]);

  const phoneDisplay = profile?.phone || "Not provided";
  const emailDisplay = profile?.email || "Not provided";
  const detailCards = useMemo(
    () => [
      { label: "D.O.B", value: formatDate(profile?.dob) },
      { label: "Gender", value: formatCapitalized(profile?.gender) },
    ],
    [profile]
  );

  const handleLogout = () => {
    selectIdentity(null);
    resetProgress();
    setShowLogout(false);
    router.push("/login?identity=provider");
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-[#52c340]">Profile</h1>

      <div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="size-18">
              <Image
                src="/logo.svg"
                alt="Profile avatar"
                width={72}
                height={72}
                className="rounded-3xl border border-white/10 bg-black"
              />
            </div>

            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[#0d0d0d] bg-[#52c340] text-black text-sm font-bold">
              {initials}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold">
              {hydrated ? fullName : "Loading..."}
            </p>
            <p className="text-sm text-white/60">
              {hydrated ? phoneDisplay : "Loading..."}
            </p>
            <p className="text-xs text-white/60">
              {hydrated ? emailDisplay : "Loading..."}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {detailCards.map((detail) => (
            <div
              key={detail.label}
              className="rounded-2xl border border-white/10 bg-[#0b1f21] px-4 py-3 text-sm"
            >
              <p className="text-white/50">{detail.label}</p>
              <p className="font-semibold">
                {hydrated ? detail.value : "Loading..."}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-left text-sm"
            >
              <span>{item.label}</span>
              <ArrowRight size={18} />
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowLogout(true)}
          className="mt-6 w-full rounded-2xl border border-red-500/40 py-3 text-base font-semibold text-red-400"
        >
          Logout
        </button>
      </div>

      <SimpleModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        title="Are you sure?"
        subtitle="Do you want to Logout?"
      >
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            className="rounded-2xl bg-white py-2 text-sm font-semibold text-black"
            onClick={() => setShowLogout(false)}
          >
            No
          </button>
          <button
            className="rounded-2xl bg-red-500 py-2 text-sm font-semibold text-white"
            onClick={handleLogout}
          >
            Yes
          </button>
        </div>
      </SimpleModal>
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
