"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SimpleModal from "../../../../components/ui/simple-modal";
import { useCareProviderProgress } from "../../../../hooks/use-care-provider-progress";
import { getProgressBlockingUI } from "../../../../utils/care-provider-progress";
import { useAuthSession } from "../../../../hooks/use-auth-session";

interface ProviderAppointment {
  id: string;
  patient: string;
  age: number;
  type: string;
  schedule: string;
}

const initialUpcoming: ProviderAppointment[] = [];

const newRequests = [
  {
    id: "devon",
    name: "Devon Lane",
    age: 18,
    summary: "Night fever, headache, vomiting...",
    schedule: "Hospital visit • 25/03/3035 • 4:00pm",
  },
];

export default function CareProviderHome() {
  const router = useRouter();
  const { progress, hydrated } = useCareProviderProgress();
  const { profile } = useAuthSession();
  const [upcomingAppointments] =
    useState<ProviderAppointment[]>(initialUpcoming);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  const blockingState = useMemo(
    () => getProgressBlockingUI(progress, router),
    [progress, router]
  );

  if (!hydrated) {
    return (
      <div className="pt-20 text-center text-white/60">
        Preparing dashboard...
      </div>
    );
  }

  if (blockingState) {
    return blockingState;
  }

  const handleMenuSelection = (action: string, id: string) => {
    setActiveMenu(null);
    if (action === "cancel") {
      setCancelTarget(id);
    } else if (action === "details") {
      router.push(`/care-provider/appointments/${id}`);
    } else if (action === "chat") {
      router.push(`/care-provider/messages/${id}`);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header>
        <div className="flex items-center gap-3">
          <Image
            src="/care-provider.png"
            alt="Dr James"
            width={48}
            height={48}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm text-[#52c340]">
              Hi{" "}
              {profile?.firstName?.trim() ||
                profile?.lastName?.trim() ||
                "there"}
            </p>
            <p className="text-sm text-white/70">How are you today?</p>
          </div>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
        </div>
        <div className="mt-4 space-y-3">
          {upcomingAppointments.length === 0 ? (
            <EmptyState label="No upcoming appointments" />
          ) : (
            upcomingAppointments.map((appt) => (
              <div
                key={appt.id}
                className="relative rounded-2xl border border-white/10 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      {appt.patient} • {appt.age} years
                    </p>
                    <p className="text-sm text-[#52c340]">{appt.type}</p>
                    <p className="text-xs text-white/60">{appt.schedule}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu((prev) =>
                          prev === appt.id ? null : appt.id
                        )
                      }
                      className="rounded-full bg-white/10 px-2 py-1 text-lg text-white"
                      aria-label="More actions"
                    >
                      ⋯
                    </button>
                    {activeMenu === appt.id && (
                      <div className="absolute right-0 top-10 z-20 w-48 rounded-2xl border border-white/15 bg-[#050505] p-3 text-sm shadow-xl">
                        <button
                          className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-white hover:bg-white/5"
                          onClick={() =>
                            handleMenuSelection("details", appt.id)
                          }
                        >
                          View Details
                        </button>
                        <button className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-white/80 hover:bg-white/5">
                          Reschedule
                        </button>
                        <button
                          className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-white/80 hover:bg-white/5"
                          onClick={() => handleMenuSelection("chat", appt.id)}
                        >
                          Chat Patient
                        </button>
                        <button
                          className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-red-400 hover:bg-white/5"
                          onClick={() => handleMenuSelection("cancel", appt.id)}
                        >
                          Cancel Appointment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">New Requests</h2>
          <button className="text-sm text-[#52c340]">View all</button>
        </div>
        {newRequests.length === 0 ? (
          <EmptyState label="No new appointments" />
        ) : (
          newRequests.map((req) => (
            <div
              key={req.id}
              className="flex items-start justify-between rounded-2xl border border-white/10 p-4 text-sm"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-start">
                  <div className="w-full">
                    <p className="font-semibold text-white">
                      {req.name} • {req.age} years
                    </p>
                    <p className="text-white/60">{req.summary}</p>
                  </div>
                  <button
                    className="text-xs text-[#52c340] w-fit whitespace-nowrap cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/care-provider/appointments/requests/${req.id}`
                      )
                    }
                  >
                    View Details
                  </button>
                </div>

                <p className="mt-1 text-[#52c340]">{req.schedule}</p>
              </div>
            </div>
          ))
        )}
      </section>

      <SimpleModal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        title="Are you sure?"
        subtitle={
          cancelTarget
            ? `You will cancel the appointment with ${
                upcomingAppointments.find((a) => a.id === cancelTarget)
                  ?.patient ?? "this patient"
              }.`
            : undefined
        }
      >
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => setCancelTarget(null)}
            className="rounded-2xl bg-white py-2 text-sm font-semibold text-black"
          >
            No, Accept
          </button>
          <button
            onClick={() => setCancelTarget(null)}
            className="rounded-2xl bg-red-500 py-2 text-sm font-semibold text-white"
          >
            Yes, Cancel
          </button>
        </div>
      </SimpleModal>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 py-10 text-center text-white/50">
      <Image
        src="/calendar.svg"
        alt="Calendar icon"
        width={80}
        height={80}
        className="mb-3 opacity-80"
      />
      <p className="text-sm">{label}</p>
    </div>
  );
}
