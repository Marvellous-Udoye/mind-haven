"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => router.push("/care-seeker/profile")}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
      >
        <ArrowLeft size={20} />
      </button>

      <h1 className="text-xl font-semibold text-[#52c340]">Settings</h1>

      <div className=" space-y-6">
        <div className="flex items-center justify-between text-sm">
          <span>Notifications</span>
          <button
            onClick={() => setNotifications((prev) => !prev)}
            className={[
              "flex h-6 w-12 items-center rounded-full px-1 transition",
              notifications ? "bg-[#52c340]" : "bg-white/20",
            ].join(" ")}
          >
            <span
              className={[
                "h-4 w-4 rounded-full bg-white transition",
                notifications ? "translate-x-6" : "",
              ].join(" ")}
            />
          </button>
        </div>

        {["Old Password", "New Password", "Confirm Password"].map((label) => {
          const key = label.toLowerCase().split(" ")[0] as
            | "old"
            | "new"
            | "confirm";
          return (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-[#0f4a4b] bg-[#073133] px-4 py-3 text-sm"
            >
              <Lock size={16} className="text-white/70" />
              <input
                type={showPassword[key] ? "text" : "password"}
                placeholder={label}
                className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                aria-label={`Toggle ${label}`}
              >
                {showPassword[key] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          );
        })}

        <button className="w-full rounded-2xl bg-white py-3 text-base font-semibold text-black">
          Save
        </button>
      </div>
    </div>
  );
}
