"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function TimeSettingsPage() {
  const router = useRouter();
  const [slots, setSlots] = useState([
    "Weekdays • 9am - 4pm",
    "Weekends • 10am - 2pm",
  ]);
  const [newSlot, setNewSlot] = useState("");

  const addSlot = () => {
    if (!newSlot.trim()) return;
    setSlots((prev) => [...prev, newSlot.trim()]);
    setNewSlot("");
  };

  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={() => router.push("/care-provider/profile")}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
      >
        <ArrowLeft size={20} />
      </button>

      <h1 className="text-xl font-semibold text-[#52c340]">Time Settings</h1>

      <div className=" space-y-4">
        {slots.map((slot) => (
          <div
            key={slot}
            className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 text-sm"
          >
            <span>{slot}</span>
            <button
              className="text-red-400"
              onClick={() => setSlots((prev) => prev.filter((item) => item !== slot))}
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex gap-3">
          <input
            value={newSlot}
            onChange={(e) => setNewSlot(e.target.value)}
            placeholder="Add new slot e.g. Mondays • 8am - 1pm"
            className="flex-1 rounded-2xl border border-white/15 bg-[#073133] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
          />
          <button
            onClick={addSlot}
            className="rounded-2xl bg-[#52c340] px-4 py-3 text-sm font-semibold text-black"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
