"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SimpleModal from "../../../../components/ui/simple-modal";
import { useCareProviderProgress } from "../../../../hooks/use-care-provider-progress";
import { getProgressBlockingUI } from "../../../../utils/care-provider-progress";
import { useAuthSession } from "../../../../hooks/use-auth-session";
import { useCareProviderExperience } from "../../../../hooks/use-care-provider-experience";

export default function CareProviderHome() {
  const router = useRouter();
  const { progress, hydrated } = useCareProviderProgress();
  const { profile } = useAuthSession();
  const {
    requests,
    upcomingAppointments,
    acceptRequest,
    rejectRequest,
    ensureConversation,
    cancelAppointment,
  } = useCareProviderExperience();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] =
    useState<(typeof upcomingAppointments)[number] | null>(null);

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

  const handleMenuSelection = (
    action: "cancel" | "details" | "chat",
    appointmentId: string
  ) => {
    const appointment = upcomingAppointments.find((item) => item.id === appointmentId);
    if (!appointment) return;
    setActiveMenu(null);
    if (action === "cancel") {
      setCancelTarget(appointment);
    } else if (action === "details") {
      router.push(`/care-provider/appointments/${appointmentId}`);
    } else if (action === "chat") {
      ensureConversation({
        id: appointment.conversationId,
        name: appointment.patient,
      });
      router.push(`/care-provider/messages/${appointment.conversationId}`);
    }
  };

  const confirmCancel = () => {
    if (cancelTarget) {
      cancelAppointment(cancelTarget.id);
    }
    setCancelTarget(null);
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      <header>
        <div className="flex items-center gap-3">
          <Image
            src="/care-provider.png"
            alt="Care provider avatar"
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
            upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="relative rounded-2xl border border-white/10 p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      {appointment.patient} • {appointment.age} years
                    </p>
                    <p className="text-sm text-[#52c340]">
                      {appointment.type}
                    </p>
                    <p className="text-xs text-white/60">
                      {appointment.schedule}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenu((prev) =>
                          prev === appointment.id ? null : appointment.id
                        )
                      }
                      className="rounded-full bg-white/10 px-2 py-1 text-lg text-white"
                      aria-label="More actions"
                    >
                      ⋯
                    </button>
                    {activeMenu === appointment.id && (
                      <div className="absolute right-0 top-10 z-20 w-48 rounded-2xl border border-white/15 bg-[#050505] p-3 text-sm shadow-xl">
                        <button
                          className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-white/80 hover:bg-white/5"
                          onClick={() =>
                            handleMenuSelection("chat", appointment.id)
                          }
                        >
                          Chat Patient
                        </button>
                        <button
                          className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-left text-red-400 hover:bg-white/5"
                          onClick={() =>
                            handleMenuSelection("cancel", appointment.id)
                          }
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
          <button
            type="button"
            onClick={() => router.push("/care-provider/appointments?tab=new")}
            className="text-sm text-[#52c340]"
          >
            View all
          </button>
        </div>
        {requests.length === 0 ? (
          <EmptyState label="No new appointments" />
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 p-4 text-sm"
            >
              <div>
                <p className="font-semibold text-white">
                  {request.name} • {request.age} years
                </p>
                <p className="text-white/60">{request.summary}</p>
              </div>
              <p className="text-[#52c340]">{request.schedule}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-2xl border border-white/20 px-3 py-2 text-xs font-semibold text-white"
                  onClick={() => rejectRequest(request.id)}
                >
                  Reject
                </button>
                <button
                  type="button"
                  className="rounded-2xl bg-[#52c340] px-3 py-2 text-xs font-semibold text-black"
                  onClick={() => acceptRequest(request.id)}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="rounded-2xl px-3 py-2 text-xs font-semibold text-[#52c340]"
                  onClick={() =>
                    router.push(
                      `/care-provider/appointments/requests/${request.id}`
                    )
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <SimpleModal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        title="Cancel appointment?"
        subtitle={
          cancelTarget
            ? `You will cancel the appointment with ${cancelTarget.patient}.`
            : undefined
        }
      >
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCancelTarget(null)}
            className="rounded-2xl bg-white py-2 text-sm font-semibold text-black"
          >
            Keep
          </button>
          <button
            type="button"
            onClick={confirmCancel}
            className="rounded-2xl bg-red-500 py-2 text-sm font-semibold text-white"
          >
            Cancel
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
