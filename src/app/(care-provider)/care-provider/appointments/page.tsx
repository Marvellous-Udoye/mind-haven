"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SimpleModal from "../../../../components/ui/simple-modal";
import { useCareProviderProgress } from "../../../../hooks/use-care-provider-progress";
import { getProgressBlockingUI } from "../../../../utils/care-provider-progress";

type Appointment = {
  id: string;
  name: string;
  subtitle: string;
  schedule: string;
  type: "upcoming" | "new" | "completed";
  symptoms?: string;
};

const appointments: Appointment[] = [
  {
    id: "junior",
    name: "Junior Daren • 18 years",
    subtitle: "Home service",
    schedule: "25/03/3035 • 3:00pm",
    type: "upcoming",
    symptoms: "Fever, headache",
  },
  {
    id: "marvin",
    name: "Marvin McKinney • 30 years",
    subtitle: "Hospital visit",
    schedule: "25/03/3035 • 4:00pm",
    type: "upcoming",
  },
  {
    id: "devon",
    name: "Devon Lane • 18 years",
    subtitle: "Night fever, headache, vomiting...",
    schedule: "Hospital visit • 25/03/3035 • 4:00pm",
    type: "new",
    symptoms: "Stomach ache, dizziness, weakness",
  },
  {
    id: "callistus",
    name: "Callistus Emmanuel",
    subtitle: "Online consultation",
    schedule: "10/01/2025 • 02:00pm",
    type: "completed",
  },
  {
    id: "festus",
    name: "Dr Festus Ibeh",
    subtitle: "Clinic consultation",
    schedule: "02/02/2025 • 02:00pm",
    type: "completed",
  },
];

export default function ProviderAppointmentsPage() {
  const router = useRouter();
  const { progress, hydrated } = useCareProviderProgress();
  const [tab, setTab] = useState<"upcoming" | "new" | "completed">("upcoming");
  const [detailTarget, setDetailTarget] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);

  const blockingState = useMemo(
    () => getProgressBlockingUI(progress, router),
    [progress, router]
  );

  if (!hydrated) {
    return (
      <div className="pt-20 text-center text-white/60">
        Loading appointments...
      </div>
    );
  }

  if (blockingState) {
    return blockingState;
  }

  const filtered = appointments.filter((item) => item.type === tab);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-[#52c340]">Appointments</h1>
      <div className="flex gap-4 text-sm font-semibold">
        {(["upcoming", "new", "completed"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={[
              "pb-2 capitalize",
              tab === key
                ? "border-b-2 border-[#52c340] text-[#52c340]"
                : "text-white/50",
            ].join(" ")}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 py-10 text-center text-white/60">
            No {tab} appointments
          </div>
        ) : (
          filtered.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-2xl border border-white/10 bg-[#111111] p-4"
            >
              <div className="flex items-start gap-3">
                <Image
                  src="/care-seeker.png"
                  alt={appointment.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold">{appointment.name}</p>
                  <p className="text-sm text-[#52c340]">
                    {appointment.subtitle}
                  </p>
                  <p className="text-xs text-white/60">
                    {appointment.schedule}
                  </p>
                </div>
                {appointment.type === "new" ? (
                  <button
                    className="text-xs text-[#52c340]"
                    onClick={() =>
                      router.push(
                        `/care-provider/appointments/requests/${appointment.id}`
                      )
                    }
                  >
                    View Details
                  </button>
                ) : (
                  <button
                    className="text-white/60"
                    onClick={() => setDetailTarget(appointment)}
                  >
                    ⋯
                  </button>
                )}
              </div>
              {appointment.type === "upcoming" && (
                <div className="mt-3 flex justify-end gap-3 text-xs">
                  <button
                    className="text-white/70"
                    onClick={() => setDetailTarget(appointment)}
                  >
                    View Details
                  </button>
                  <button className="text-white/70">Reschedule</button>
                  <button
                    className="text-white/70"
                    onClick={() =>
                      router.push(`/care-provider/messages/${appointment.id}`)
                    }
                  >
                    Chat Patient
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => setCancelTarget(appointment)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <SimpleModal
        open={Boolean(detailTarget)}
        onClose={() => setDetailTarget(null)}
        title="Appointment details"
      >
        {detailTarget && (
          <div className="space-y-3 text-sm">
            <p className="text-white/70">Hi Dr James,</p>
            <p>
              You have{" "}
              {detailTarget.type === "completed"
                ? "concluded"
                : "an upcoming"}{" "}
              appointment with {detailTarget.name} on {detailTarget.schedule}.
              Here are the details:
            </p>
            <div className="rounded-2xl border border-white/10 p-3">
              <InfoRow label="Patient's name" value={detailTarget.name} />
              {detailTarget.symptoms && (
                <InfoRow label="Symptoms" value={detailTarget.symptoms} />
              )}
              <InfoRow label="Date" value={detailTarget.schedule.split("•")[0]} />
              <InfoRow label="Start Time" value={detailTarget.schedule.split("•")[1] ?? ""} />
              <InfoRow label="Consultation type" value={detailTarget.subtitle} />
            </div>
            <button
              className="w-full rounded-2xl bg-white py-3 text-base font-semibold text-black"
              onClick={() => setDetailTarget(null)}
            >
              Done
            </button>
          </div>
        )}
      </SimpleModal>

      <SimpleModal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        title="Are you sure?"
        subtitle={
          cancelTarget
            ? `You will cancel the appointment with ${cancelTarget.name}.`
            : undefined
        }
      >
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            className="rounded-2xl bg-white py-2 text-sm font-semibold text-black"
            onClick={() => setCancelTarget(null)}
          >
            No, Accept
          </button>
          <button
            className="rounded-2xl bg-red-500 py-2 text-sm font-semibold text-white"
            onClick={() => setCancelTarget(null)}
          >
            Yes, Cancel
          </button>
        </div>
      </SimpleModal>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
