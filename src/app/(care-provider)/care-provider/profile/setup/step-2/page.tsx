"use client";

import { useState } from "react";
import { ArrowLeft, DollarSign, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import SimpleModal from "../../../../../../components/ui/simple-modal";
import { useCareProviderProgress } from "../../../../../../hooks/use-care-provider-progress";

const serviceOptions = [
  "Clinic consultation",
  "Home service",
  "Online consultation",
];

export default function StepTwoPage() {
  const router = useRouter();
  const { setProgress } = useCareProviderProgress();

  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [homeCharge, setHomeCharge] = useState("");

  const [availableTimesModal, setAvailableTimesModal] = useState(false);
  const [serviceModal, setServiceModal] = useState(false);
  const [availableTime, setAvailableTime] = useState("");
  const [service, setService] = useState("");
  const [serviceCharge, setServiceCharge] = useState("");

  const handleContinue = () => {
    setProgress("documents");
    router.push("/care-provider/profile/setup/step-3");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => router.push("/care-provider/home")}
          className="text-sm text-white/70"
        >
          Skip
        </button>
      </div>

      <div>
        <p className="text-sm text-white/60">Step 2 of 3</p>
        <h1 className="mt-1 text-xl font-semibold text-[#52c340]">
          Professional Information
        </h1>
        <p className="text-sm text-white/60">Update your profile</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {(["male", "female"] as const).map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => setGender(option)}
              className={[
                "rounded-2xl border px-4 py-3 text-sm font-semibold capitalize",
                gender === option
                  ? "border-[#52c340] bg-[#052013] text-[#52c340]"
                  : "border-white/10 text-white/70",
              ].join(" ")}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <InlineInput
            placeholder="Address"
            icon={<MapPin size={16} />}
            value={address}
            onChange={setAddress}
          />
          <InlineInput
            placeholder="City"
            icon={<MapPin size={16} />}
            value={city}
            onChange={setCity}
          />
          <InlineInput
            placeholder="Country"
            icon={<MapPin size={16} />}
            value={country}
            onChange={setCountry}
          />
          <InlineInput
            placeholder="Specialization*"
            icon={<MapPin size={16} />}
            value={specialization}
            onChange={setSpecialization}
          />
          <InlineInput
            placeholder="Home Service Charge*"
            icon={<DollarSign size={16} />}
            value={homeCharge}
            onChange={setHomeCharge}
          />
          <ActionRow
            label="Add available times*"
            onClick={() => setAvailableTimesModal(true)}
            value={availableTime}
          />
          <ActionRow
            label="Add your services*"
            onClick={() => setServiceModal(true)}
            value={
              service
                ? serviceCharge
                  ? `${service} • ${serviceCharge}`
                  : service
                : ""
            }
          />
        </div>

        <button
          type="button"
          onClick={handleContinue}
          className="mt-8 w-full rounded-2xl bg-white py-3 text-base font-semibold text-black"
        >
          Continue
        </button>
      </div>

      <SimpleModal
        open={availableTimesModal}
        onClose={() => setAvailableTimesModal(false)}
        title="Add available times"
      >
        <div className="space-y-4">
          <input
            value={availableTime}
            onChange={(e) => setAvailableTime(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-[#073133] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
            placeholder="Describe your availability"
          />
          <button
            type="button"
            className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-black"
            onClick={() => setAvailableTimesModal(false)}
          >
            Done
          </button>
        </div>
      </SimpleModal>

      <SimpleModal
        open={serviceModal}
        onClose={() => setServiceModal(false)}
        title="Add service"
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/15 bg-[#073133] px-4 py-3 text-sm text-white">
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-transparent text-white focus:outline-none"
            >
              <option value="" className="text-black">
                Select service
              </option>
              {serviceOptions.map((opt) => (
                <option value={opt} key={opt} className="text-black">
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <input
            value={serviceCharge}
            onChange={(e) => setServiceCharge(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-[#073133] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
            placeholder="Service charge"
          />
          <button
            type="button"
            className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-black"
            onClick={() => setServiceModal(false)}
          >
            Done
          </button>
        </div>
      </SimpleModal>
    </div>
  );
}

function InlineInput({
  placeholder,
  icon,
  value,
  onChange,
}: {
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-[#0f4a4b] bg-[#073133] px-4 py-3 text-sm text-white">
      <span className="text-white/70">{icon}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-white placeholder:text-white/50 focus:outline-none"
        placeholder={placeholder}
      />
    </label>
  );
}

function ActionRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-[#0f4a4b] bg-[#073133] px-4 py-3 text-left text-sm text-white"
    >
      <p className="text-white/60">{label}</p>
      <p className="mt-1 font-semibold">
        {value ? value : "Not set yet"}
      </p>
    </button>
  );
}
