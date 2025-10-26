"use client";

import { useState } from "react";
import { ArrowLeft, MapPin, DollarSign } from "lucide-react";
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
  const [gender, setGender] = useState<"male" | "female">("male");
  const [availableTimesModal, setAvailableTimesModal] = useState(false);
  const [serviceModal, setServiceModal] = useState(false);
  const [availableTime, setAvailableTime] = useState("Mon - Fri • 9am - 4pm");
  const [service, setService] = useState("Home service");
  const [serviceCharge, setServiceCharge] = useState("₦30,000");

  const handleContinue = () => {
    setProgress("documents");
    router.push("/care-provider/profile/setup/step-3");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={() => router.push("/care-provider/home")}
          className="text-sm text-white/70"
        >
          Skip
        </button>
      </div>

      <div className="">
        <p className="text-sm text-white/60">Step 2 of 3</p>
        <h1 className="mt-1 text-xl font-semibold text-[#52c340]">
          Professional Information
        </h1>
        <p className="text-sm text-white/60">Update your profile</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {(["male", "female"] as const).map((option) => (
            <button
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
          <InputRow placeholder="Address" icon={<MapPin size={16} />} />
          <InputRow placeholder="City" icon={<MapPin size={16} />} />
          <InputRow placeholder="Nigeria" icon={<MapPin size={16} />} />
          <InputRow placeholder="Specialization*" icon={<MapPin size={16} />} />
          <InputRow
            placeholder="Home Service Charge*"
            icon={<DollarSign size={16} />}
          />
          <ActionRow
            label="Add available times*"
            onClick={() => setAvailableTimesModal(true)}
            value={availableTime}
          />
          <ActionRow
            label="Add your services*"
            onClick={() => setServiceModal(true)}
            value={`${service} • ${serviceCharge}`}
          />
        </div>

        <button
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

function InputRow({
  placeholder,
  icon,
}: {
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#0f4a4b] bg-[#073133] px-4 py-3 text-sm text-white/80">
      {icon}
      <input
          className="w-full bg-transparent text-white placeholder:text-white/50 focus:outline-none"
          placeholder={placeholder}
      />
    </div>
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
      onClick={onClick}
      className="w-full rounded-2xl border border-[#0f4a4b] bg-[#073133] px-4 py-3 text-left text-sm text-white"
    >
      <p className="text-white/60">{label}</p>
      {value && <p className="mt-1 font-semibold">{value}</p>}
    </button>
  );
}
