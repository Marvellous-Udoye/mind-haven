"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCareSeekerExperience } from "../../../../../hooks/use-care-seeker-experience";

export default function AppointmentDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-white/60">
          Loading appointment...
        </div>
      }
    >
      <AppointmentDetailContent />
    </Suspense>
  );
}

function AppointmentDetailContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { appointments } = useCareSeekerExperience();
  const appointment = appointments.find((appt) => appt.id === params.id);

  if (!appointment) {
    router.replace("/care-seeker/appointments");
    return null;
  }

  const status = searchParams.get("status") ?? appointment.status;

  return (
    <div className="flex h-full flex-col gap-6">
      <button
        onClick={() => router.push("/care-seeker/appointments")}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
      >
        <ArrowLeft size={20} />
      </button>

      <div className=" text-sm">
        <h2 className="text-xl font-semibold text-[#52c340]">Appointment details</h2>
        <p className="mt-1 text-white/70">
          Thank you for choosing MindHaven.
        </p>

        <div className="mt-6 space-y-4 text-white">
          <div>
            <p className="text-sm text-white/60">Hi,</p>
            <p className="mt-1 text-sm">
              You {status === "completed" ? "have concluded" : "have an upcoming"} appointment with{" "}
              {appointment.doctor_name}. Here are the details:
            </p>
          </div>

          <div className="space-y-3 rounded-2xl border border-white/10 p-4">
            <InfoRow label="Doctor's name" value={appointment.doctor_name} />
            <InfoRow label="Specialty" value={appointment.specialty} />
            <InfoRow
              label="Date"
              value={new Date(appointment.appointment_date).toLocaleDateString("en-GB")}
            />
            <InfoRow label="Start Time" value={appointment.appointment_time} />
            <InfoRow
              label="Consultation type"
              value={appointment.location_type === "home" ? "Home Consultation" : "Clinic Consultation"}
            />
            <InfoRow label="Location" value={appointment.location} />
          </div>
        </div>

        <button
          onClick={() => router.push("/care-seeker/appointments")}
          className="mt-6 w-full rounded-2xl bg-white py-3 text-base font-semibold text-black"
        >
          Done
        </button>
      </div>
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
