"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => router.push("/care-provider/profile")}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
      >
        <ArrowLeft size={20} />
      </button>

      <h1 className="text-xl font-semibold text-[#52c340]">Customer Support</h1>

      <div className=" space-y-4 text-sm">
        <p className="text-white/70">
          Need help? Reach us via any of the channels below.
        </p>
        <div className="rounded-2xl border border-white/10 px-4 py-3">
          <p className="font-semibold text-white">support@mindhaven.app</p>
          <p className="text-white/60">We respond within 24 hours.</p>
        </div>
        <div className="rounded-2xl border border-white/10 px-4 py-3">
          <p className="font-semibold text-white">+234 700 000 0000</p>
          <p className="text-white/60">Mon - Sat, 8am - 6pm</p>
        </div>
      </div>
    </div>
  );
}
