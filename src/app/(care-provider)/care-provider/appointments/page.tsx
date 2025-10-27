"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SimpleModal from "../../../../components/ui/simple-modal";
import { useCareProviderProgress } from "../../../../hooks/use-care-provider-progress";
import { getProgressBlockingUI } from "../../../../utils/care-provider-progress";
import { useCareProviderExperience } from "../../../../hooks/use-care-provider-experience";

type TabKey = "upcoming" | "new" | "completed";

export default function ProviderAppointmentsPage() {
  const router = useRouter();
  const { progress, hydrated } = useCareProviderProgress();
  const {
    requests,
    upcomingAppointments,
    cancelAppointment,
    acceptRequest,
    rejectRequest,
    ensureConversation,
  } = useCareProviderExperience();

  const [tab, setTab] = useState<TabKey>("upcoming");
  const [detailTarget, setDetailTarget] =
    useState<(typeof upcomingAppointments)[number] | null>(null);
  const [cancelTarget, setCancelTarget] =
    useState<(typeof upcomingAppointments)[number] | null>(null);

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

  const renderList = () => {
    if (tab === "upcoming") {
      if (upcomingAppointments.length === 0) {
        return (
          <EmptyBlock message="No upcoming appointments. Accept a request to get started." />
        );
      }
      return upcomingAppointments.map((appointment) => (
        <div
          key={appointment.id}
          className="rounded-2xl border border-white/10 bg-[#111111] p-4"
        >
          <div className="flex items-start gap-3">
            <Image
              src="/care-seeker.png"
              alt={appointment.patient}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold">{appointment.patient}</p>
              <p className="text-sm text-[#52c340]">{appointment.type}</p>
              <p className="text-xs text-white/60">{appointment.schedule}</p>

              <div className="mt-3 flex flex-wrap gap-3 text-xs">
                <button
                  className="text-white/70"
                  onClick={() => setDetailTarget(appointment)}
                >
                  View Details
                </button>
                <button
                  className="text-white/70"
                  onClick={() => {
                    ensureConversation({
                      id: appointment.conversationId,
                      name: appointment.patient,
                    });
                    router.push(
                      `/care-provider/messages/${appointment.conversationId}`
                    );
                  }}
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
            </div>
          </div>
        </div>
      ));
    }

    if (tab === "new") {
      if (requests.length === 0) {
        return <EmptyBlock message="No new appointment requests." />;
      }
      return requests.map((request) => (
        <div
          key={request.id}
          className="rounded-2xl border border-white/10 bg-[#111111] p-4"
        >
          <div className="flex items-start gap-3">
            <Image
              src="/care-seeker.png"
              alt={request.name}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
            <div className="flex-1 space-y-2">
              <div>
                <p className="font-semibold">
                  {request.name} • {request.age} years
                </p>
                <p className="text-sm text-[#52c340]">{request.type}</p>
                <p className="text-xs text-white/60">{request.schedule}</p>
              </div>
              <p className="text-xs text-white/60">{request.summary}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  className="rounded-2xl border border-white/20 px-3 py-2 text-white"
                  onClick={() => rejectRequest(request.id)}
                >
                  Reject
                </button>
                <button
                  className="rounded-2xl bg-[#52c340] px-3 py-2 text-black"
                  onClick={() => acceptRequest(request.id)}
                >
                  Accept
                </button>
                <button
                  className="rounded-2xl px-3 py-2 text-[#52c340]"
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
          </div>
        </div>
      ));
    }

    return <EmptyBlock message="You have no completed appointments yet." />;
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
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

      <div className="space-y-3">{renderList()}</div>

      <SimpleModal
        open={Boolean(detailTarget)}
        onClose={() => setDetailTarget(null)}
        title="Appointment details"
      >
        {detailTarget && (
          <div className="space-y-3 text-sm">
            <p className="text-white/70">
              You have an upcoming appointment with {detailTarget.patient}.
            </p>
            <div className="rounded-2xl border border-white/10 p-3">
              <InfoRow label="Patient's name" value={detailTarget.patient} />
              <InfoRow label="Session type" value={detailTarget.type} />
              <InfoRow label="Schedule" value={detailTarget.schedule} />
              <InfoRow
                label="Preferred location"
                value={
                  detailTarget.preferredLocation === "home"
                    ? "Home service"
                    : "Clinic visit"
                }
              />
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
        title="Cancel appointment?"
        subtitle={
          cancelTarget
            ? `You will cancel the appointment with ${cancelTarget.patient}.`
            : undefined
        }
      >
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            className="rounded-2xl bg-white py-2 text-sm font-semibold text-black"
            onClick={() => setCancelTarget(null)}
          >
            Keep
          </button>
          <button
            className="rounded-2xl bg-red-500 py-2 text-sm font-semibold text-white"
            onClick={() => {
              if (cancelTarget) {
                cancelAppointment(cancelTarget.id);
              }
              setCancelTarget(null);
            }}
          >
            Cancel
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
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/10 py-10 text-center text-white/60">
      {message}
    </div>
  );
}
