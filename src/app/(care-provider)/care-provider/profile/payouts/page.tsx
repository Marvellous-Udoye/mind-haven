"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PayoutHistoryPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => router.push("/care-provider/profile")}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
      >
        <ArrowLeft size={20} />
      </button>

      <h1 className="text-xl font-semibold text-[#52c340]">Payout History</h1>

      <div className="">
        <div className="flex flex-col items-center gap-3 py-20 text-white/60">
          <span className="text-4xl text-[#52c340]">💸</span>
          <p>No payout has been made</p>
        </div>
      </div>
    </div>
  );
}
