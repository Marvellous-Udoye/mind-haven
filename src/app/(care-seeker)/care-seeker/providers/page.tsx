"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { doctorSpecialties } from "../../../../data/doctor-directory";
import { useCareSeekerExperience } from "../../../../hooks/use-care-seeker-experience";
import type { CareCategory, CareModule } from "../../../../types/care";
import { UserProfile } from "../../../../types/user";

type BookingStep =
  | "care-type"
  | "doctor-category"
  | "top-doctors"
  | "doctor-detail"
  | "date"
  | "time"
  | "location"
  | "success";

const timeSlots = [
  "10:00am",
  "11:00am",
  "12:00pm",
  "01:00pm",
  "02:00pm",
  "03:00pm",
  "04:00pm",
  "05:00pm",
  "06:00pm",
];

const calendarDays = Array.from({ length: 31 }, (_, idx) => idx + 1);

export default function ProviderFlowPage() {
  return (
    <Suspense fallback={<ProvidersLoadingState />}>
      <ProviderFlowContent />
    </Suspense>
  );
}

function ProviderFlowContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const moduleParam = (searchParams.get("module") || "mental") as CareModule;
  const [step, setStep] = useState<BookingStep>("care-type");
  const [careCategory, setCareCategory] =
    useState<CareCategory>("psychologist");
  const [specialty, setSpecialty] = useState("Any");
  const [selectedDoctor, setSelectedDoctor] = useState<UserProfile | null>(
    null
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [locationType, setLocationType] = useState<"home" | "clinic">("clinic");
  const { bookAppointment, providers } = useCareSeekerExperience();

  const doctors = useMemo(
    () =>
      providers.filter(
        (doctor) =>
          doctor.module === moduleParam &&
          doctor.category === careCategory &&
          (specialty === "Any" ||
            (doctor.specialty?.toLowerCase() === specialty.toLowerCase()))
      ),
    [providers, moduleParam, careCategory, specialty]
  );

  const handleCareTypeNext = () => {
    if (careCategory === "psychologist") {
      setStep("top-doctors");
    } else {
      setStep("doctor-category");
    }
  };

  const startBooking = (doctor: UserProfile) => {
    setSelectedDoctor(doctor);
    setStep("doctor-detail");
  };

  const handleChatNow = async (doctor: UserProfile) => {
    // For now, just navigate to messages - conversation creation will be handled in messaging
    router.push(`/care-seeker/messages/${doctor.id}`);
  };

  const confirmAppointment = async () => {
    if (!selectedDoctor || !selectedDay || !selectedTime) return;

    // Create appointment date
    const appointmentDate = new Date();
    appointmentDate.setDate(selectedDay);
    const dateString = appointmentDate.toISOString().split('T')[0]; // YYYY-MM-DD format

    try {
      await bookAppointment({
        provider_id: selectedDoctor.id,
        doctor_name: `${selectedDoctor.first_name} ${selectedDoctor.last_name}`,
        specialty: selectedDoctor.specialty || "",
        module: moduleParam,
        appointment_date: dateString,
        appointment_time: selectedTime,
        location_type: locationType,
        location: selectedDoctor.location || "",
        status: "upcoming" as const,
      });
      setStep("success");
    } catch (error) {
      console.error("Error booking appointment:", error);
      // Handle error - maybe show a toast or error message
    }
  };

  const resetToHome = () => {
    setStep("care-type");
    router.replace("/care-seeker/home");
  };

  return (
    <div className="flex min-h-dvh flex-col gap-6 pb-10">
      <div className="flex items-center gap-5">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
        >
          <ArrowLeft size={20} />
        </button>
        <p className="text-[18px] text-white/70">HealthCare Provider</p>
        <span />
      </div>

      {step === "care-type" && (
        <CardShell
          title="Welcome Campbell"
          subtitle="What care would you like?"
          footerLabel="Next"
          onNext={handleCareTypeNext}
        >
          <SelectPill
            options={[
              { label: "Psychologist", value: "psychologist" },
              { label: "Doctor", value: "doctor" },
            ]}
            value={careCategory}
            onChange={(value) => setCareCategory(value as CareCategory)}
          />
        </CardShell>
      )}

      {step === "doctor-category" && (
        <CardShell
          title="Welcome Campbell"
          subtitle="What doctor would you like to see?"
          footerLabel="Next"
          onNext={() => setStep("top-doctors")}
        >
          <SelectPill
            options={doctorSpecialties.map((item) => ({
              label: item,
              value: item,
            }))}
            value={specialty}
            onChange={setSpecialty}
            stacked
          />
        </CardShell>
      )}

      {step === "top-doctors" && (
        <CardShell title="Healthcare Provider" subtitle="Top Doctors">
          <div className="space-y-3">
            {doctors.map((doctor) => (
              <button
                key={doctor.id}
                onClick={() => startBooking(doctor)}
                className="flex w-full items-center gap-3 rounded-2xl bg-white/5 px-4 py-4 text-left"
              >
                <Image
                  src={doctor.avatar_url || "/care-provider.png"}
                  alt={`${doctor.first_name} ${doctor.last_name}`}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{`${doctor.first_name} ${doctor.last_name}`}</p>
                  <p className="text-xs text-white/50">
                    Reviews: {doctor.reviews || 0}
                  </p>
                </div>
              </button>
            ))}
            {doctors.length === 0 && (
              <p className="text-center text-sm text-white/60">
                No doctors match this category yet.
              </p>
            )}
          </div>
        </CardShell>
      )}

      {step === "doctor-detail" && selectedDoctor && (
        <DoctorDetailCard
          doctor={selectedDoctor}
          onBook={() => setStep("date")}
          onChat={() => handleChatNow(selectedDoctor)}
        />
      )}

      {step === "date" && (
        <BookingStepCard
          doctor={selectedDoctor}
          title="Select a date"
          subtitle="Choose a convenient day for your appointment"
        >
          <div className="grid grid-cols-7 gap-x-2 gap-y-4">
            {calendarDays.map((day) => (
              <button
                key={day}
                onClick={() => {
                  setSelectedDay(day);
                  setStep("time");
                }}
                className={`text-lg ${
                  selectedDay === day
                    ? "bg-[#52c340] text-black"
                    : " text-white"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </BookingStepCard>
      )}

      {step === "time" && (
        <BookingStepCard
          doctor={selectedDoctor}
          title="Select a time"
          subtitle="Choose a time slot"
        >
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => {
                  setSelectedTime(slot);
                  setStep("location");
                }}
                className={`rounded-2xl border px-3 py-3 text-sm ${
                  selectedTime === slot
                    ? "border-[#52c340] bg-[#052013] text-[#52c340]"
                    : "border-white/15 text-white/80"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </BookingStepCard>
      )}

      {step === "location" && selectedDoctor && (
        <BookingStepCard
          doctor={selectedDoctor}
          title="Appointment Details"
          subtitle="Confirm location"
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#52c340] px-4 py-3 text-sm">
              <p className="text-white/60">Start Time</p>
              <p className="font-semibold">
                {selectedDay}/{new Date().getMonth() + 1}/
                {new Date().getFullYear()} • {selectedTime}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {["home", "clinic"].map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 text-sm capitalize text-white/80"
                >
                  <input
                    type="radio"
                    checked={locationType === option}
                    onChange={() =>
                      setLocationType(option as "home" | "clinic")
                    }
                  />
                  {option}
                </label>
              ))}
            </div>
            <p className="text-sm text-white/60">{selectedDoctor.location}</p>
            <button
              onClick={confirmAppointment}
              className="w-full rounded-2xl bg-white py-3 text-base font-semibold text-black"
            >
              Book Appointment
            </button>
          </div>
        </BookingStepCard>
      )}

      {step === "success" && (
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Image
            src="/success.svg"
            alt="Success icon"
            width={72}
            height={72}
            className="mx-auto"
          />
          <div>
            <h2 className="text-2xl font-semibold">Success</h2>
            <p className="mt-2 text-sm text-white/70">
              You have successfully booked an appointment with{" "}
              {selectedDoctor?.first_name} {selectedDoctor?.last_name}. A reminder has been added to your upcoming
              appointments.
            </p>
          </div>
          <button
            onClick={resetToHome}
            className="w-full rounded-2xl bg-white py-3 text-base font-semibold text-black"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

function ProvidersLoadingState() {
  return (
    <div className="flex min-h-dvh items-center justify-center text-white/70">
      Loading providers...
    </div>
  );
}

function CardShell({
  title,
  subtitle,
  children,
  footerLabel,
  onNext,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerLabel?: string;
  onNext?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="mt-1 text-xl font-semibold text-[#52c340]">{title}</h1>
      <p className="text-sm text-white/60">{subtitle}</p>
      <div className="mt-6 flex-1">{children}</div>
      {footerLabel && (
        <button
          onClick={onNext}
          className="mt-8 w-full rounded-2xl bg-white py-3 text-base font-semibold text-black"
        >
          {footerLabel}
        </button>
      )}
    </div>
  );
}

function SelectPill({
  options,
  value,
  onChange,
}: {
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
  stacked?: boolean;
}) {
  return (
    <div className="space-y-4 mt-6 flex flex-col">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`w-full rounded-2xl border px-4 py-4 text-left ${
              active
                ? "border-[#52c340] bg-[#52c340] text-black"
                : "border-white/20 text-white"
            }`}
            style={{
              fontSize: "15px",
              fontWeight: 400,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function DoctorDetailCard({
  doctor,
  onBook,
  onChat,
}: {
  doctor: UserProfile;
  onBook: () => void;
  onChat: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col ">
      <div className="flex items-center gap-4">
        <Image
          src={doctor.avatar_url || "/care-provider.png"}
          alt={`${doctor.first_name} ${doctor.last_name}`}
          width={72}
          height={72}
          className="rounded-3xl object-cover"
        />
        <div>
          <p className="text-lg font-semibold">{`${doctor.first_name} ${doctor.last_name}`}</p>
          <p className="text-sm text-white/70">{doctor.role}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-black">
        <div className="rounded-2xl bg-white/90 px-4 py-3 text-center">
          <p className="text-xs text-black/60">Patients</p>
          <p className="text-lg font-semibold">{doctor.patients || 0}</p>
        </div>
        <div className="rounded-2xl bg-white/90 px-4 py-3 text-center">
          <p className="text-xs text-black/60">Experience</p>
          <p className="text-lg font-semibold">
            {doctor.experience_years || 0} yrs
          </p>
        </div>
      </div>

      <section className="mt-6 space-y-4 text-sm text-white/80">
        <div>
          <p className="text-white/50">About Me</p>
          <p>{doctor.about}</p>
        </div>
        <div>
          <p className="text-white/50">Location</p>
          <p>{doctor.location}</p>
        </div>
        <div>
          <p className="text-white/50">Charges</p>
          <p>Home Consultation {doctor.charges?.home || "N/A"}</p>
          <p>Online Consultation {doctor.charges?.online || "N/A"}</p>
          <p>Clinic Consultation {doctor.charges?.clinic || "N/A"}</p>
        </div>
        <div>
          <p className="text-white/50">Time Availability</p>
          <p>{doctor.availability}</p>
        </div>
      </section>

      <div className="mt-auto space-y-3 pt-6">
        <button
          onClick={onBook}
          className="w-full rounded-2xl border border-white py-3 text-base font-semibold text-white"
        >
          Book Appointment
        </button>
        <button
          onClick={onChat}
          className="w-full rounded-2xl bg-white py-3 text-base font-semibold text-black"
        >
          Chat Now
        </button>
      </div>
    </div>
  );
}

function BookingStepCard({
  doctor,
  title,
  subtitle,
  children,
}: {
  doctor: UserProfile | null;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <p className="text-sm text-white/60">Book Appointment</p>
      {doctor && (
        <div className="mt-3 flex items-center gap-3">
          <Image
            src={doctor.avatar_url || "/care-provider.png"}
            alt={`${doctor.first_name} ${doctor.last_name}`}
            width={56}
            height={56}
            className="rounded-2xl object-cover"
          />
          <div>
            <p className="font-semibold">{`${doctor.first_name} ${doctor.last_name}`}</p>
            <p className="text-xs text-white/60">{doctor.role}</p>
          </div>
        </div>
      )}
      <h2 className="mt-6 text-xl font-semibold">{title}</h2>
      <p className="text-sm text-white/60">{subtitle}</p>
      <div className="mt-6 flex-1">{children}</div>
    </div>
  );
}
