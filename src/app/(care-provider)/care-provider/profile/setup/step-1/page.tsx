"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import SimpleModal from "../../../../../../components/ui/simple-modal";
import { useCareProviderProgress } from "../../../../../../hooks/use-care-provider-progress";
import {
  Calendar,
  Mail,
  Phone,
  User,
} from "lucide-react";

const qualificationOptions = [
  "Undergraduate",
  "Bachelor of Surgery (MBBS)",
  "Doctor of Medicine (MD)",
  "Master of Science (MSc)",
  "Doctor of Philosophy (PhD)",
];

export default function StepOnePage() {
  const router = useRouter();
  const { setProgress } = useCareProviderProgress();

  const [qualificationModal, setQualificationModal] = useState(false);
  const [licenseModal, setLicenseModal] = useState(false);
  const [hospitalModal, setHospitalModal] = useState(false);

  const [qualification, setQualification] = useState(
    "Bachelor of Surgery (MBBS)"
  );
  const [licenseNumber, setLicenseNumber] = useState("NG-129030-BX");
  const [hospitalName, setHospitalName] = useState("Lagos Teaching Hospital");
  const [hospitalAddress, setHospitalAddress] = useState("Ikeja, Lagos");

  const handleContinue = () => {
    setProgress("professional");
    router.push("/care-provider/profile/setup/step-2");
  };

  const InputRow = ({
    icon,
    placeholder,
    value,
    onClick,
    type = "text",
    onChange,
    multiline = false,
  }: {
    icon: React.ReactNode;
    placeholder: string;
    value?: string;
    onClick?: () => void;
    type?: string;
    onChange?: (value: string) => void;
    multiline?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-2xl border border-[#0f4a4b] bg-[#073133] px-4 py-3 text-left text-sm",
        onClick ? "cursor-pointer" : "cursor-default",
      ].join(" ")}
    >
      {icon}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="h-20 w-full resize-none bg-transparent text-white placeholder:text-white/50 focus:outline-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-white placeholder:text-white/50 focus:outline-none"
        />
      )}
    </button>
  );

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
        <p className="text-sm text-white/60">Step 1 of 3</p>
        <h1 className="mt-1 text-xl font-semibold text-[#52c340]">
          Basic Information
        </h1>
        <p className="text-sm text-white/60">Update your profile</p>

        <div className="mt-6 flex flex-col items-center">
          <div className="relative h-20 w-20 rounded-3xl border border-[#0f4a4b] bg-[#073133] p-4">
            <User className="h-full w-full text-white/70" />
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-[#0d0d0d] bg-[#52c340] text-black text-xs font-bold">
              +
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <InputRow
            icon={<User size={16} className="text-white/70" />}
            placeholder="Full Name"
            value="Dr Oke-albert campbell"
            onChange={() => {}}
          />
          <InputRow
            icon={<Mail size={16} className="text-white/70" />}
            placeholder="Email Address"
            value="campbellalbertoke@gmail.com"
            onChange={() => {}}
          />
          <InputRow
            icon={<Phone size={16} className="text-white/70" />}
            placeholder="+234 Mobile Number"
            value="+234 709405281"
            onChange={() => {}}
          />
          <InputRow
            icon={<Calendar size={16} className="text-white/70" />}
            placeholder="D.O.B"
            value="12/12/2024"
            onChange={() => {}}
          />
          <InputRow
            icon={<User size={16} className="text-white/70" />}
            placeholder="Educational Qualification"
            value={qualification}
            onClick={() => setQualificationModal(true)}
          />
          <InputRow
            icon={<User size={16} className="text-white/70" />}
            placeholder="Medical License Number"
            value={licenseNumber}
            onClick={() => setLicenseModal(true)}
          />
          <InputRow
            icon={<User size={16} className="text-white/70" />}
            placeholder="Add Your Hospital"
            value={hospitalName}
            onClick={() => setHospitalModal(true)}
          />
          <InputRow
            icon={<User size={16} className="text-white/70" />}
            placeholder="Years of Experience"
            value="10"
            onChange={() => {}}
          />
          <InputRow
            icon={<User size={16} className="text-white/70" />}
            placeholder="Write about yourself"
            value="Passionate about mental wellness."
            multiline
            onChange={() => {}}
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
        open={qualificationModal}
        onClose={() => setQualificationModal(false)}
        title="Choose your qualification"
        subtitle="Select the highest qualification you possess."
      >
        <div className="space-y-3">
          {qualificationOptions.map((option) => {
            const active = option === qualification;
            return (
              <button
                key={option}
                onClick={() => {
                  setQualification(option);
                  setQualificationModal(false);
                }}
                className={[
                  "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left",
                  active
                    ? "border-[#52c340] bg-[#052013] text-[#52c340]"
                    : "border-white/10 text-white",
                ].join(" ")}
              >
                {option}
                {active && <span>✓</span>}
              </button>
            );
          })}
        </div>
      </SimpleModal>

      <SimpleModal
        open={licenseModal}
        onClose={() => setLicenseModal(false)}
        title="Medical License Number"
        subtitle="Please input the registration number on your medical license"
      >
        <div className="space-y-4">
          <input
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-[#073133] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
            placeholder="License Number"
          />
          <button
            className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-black"
            onClick={() => setLicenseModal(false)}
          >
            Done
          </button>
        </div>
      </SimpleModal>

      <SimpleModal
        open={hospitalModal}
        onClose={() => setHospitalModal(false)}
        title="Add Your Hospital"
        subtitle="Link your practicing hospital"
      >
        <div className="space-y-4">
          <input
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-[#073133] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
            placeholder="Hospital Name"
          />
          <input
            value={hospitalAddress}
            onChange={(e) => setHospitalAddress(e.target.value)}
            className="w-full rounded-2xl border border-white/15 bg-[#073133] px-4 py-3 text-white placeholder:text-white/40 focus:outline-none"
            placeholder="Hospital Address"
          />
          <button
            className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-black"
            onClick={() => setHospitalModal(false)}
          >
            Save
          </button>
        </div>
      </SimpleModal>
    </div>
  );
}
