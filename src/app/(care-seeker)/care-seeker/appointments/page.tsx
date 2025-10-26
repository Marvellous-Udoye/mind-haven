"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCareSeekerExperience } from "../../../../hooks/use-care-seeker-experience";

export default function AppointmentsPage() {
  const router = useRouter();
  const { appointments } = useCareSeekerExperience();
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");

  const filtered = appointments.filter((appt) => appt.status === tab);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <h1 className="text-xl font-semibold text-[#52c340]">Appointments</h1>
      <div className="flex gap-4 text-sm font-semibold">
        {(["upcoming", "completed"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`pb-2 capitalize ${
              tab === key
                ? "border-b-2 border-[#52c340] text-[#52c340]"
                : "text-white/50"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 py-16 text-center text-white/60">
          No {tab} appointments yet.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((appointment) => (
            <button
              key={appointment.id}
              onClick={() =>
                router.push(
                  `/care-seeker/appointments/${appointment.id}?status=${appointment.status}`
                )
              }
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#111111] px-4 py-4 text-left"
            >
              <div className="flex items-center gap-3">
                <Image
                  src="/care-provider.png"
                  alt={appointment.doctorName}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{appointment.doctorName}</p>
                  <p className="text-xs text-white/60">{appointment.specialty}</p>
                </div>
              </div>
              <div className="text-right text-xs font-semibold text-[#52c340]">
                <p>
                  {new Date(appointment.date).toLocaleDateString("en-GB")}
                </p>
                <p>{appointment.time}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
