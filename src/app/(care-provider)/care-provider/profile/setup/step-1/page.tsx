"use client";

import { useState } from "react";
import { ArrowLeft, Calendar, Mail, Phone, User } from "lucide-react";
import { useRouter } from "next/navigation";
import SimpleModal from "../../../../../../components/ui/simple-modal";
import { useCareProviderProgress } from "../../../../../../hooks/use-care-provider-progress";

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

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [qualification, setQualification] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [bio, setBio] = useState("");

  const handleContinue = () => {
    setProgress("professional");
    router.push("/care-provider/profile/setup/step-2");
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
          <EditableInputRow
            icon={<User size={16} className="text-white/70" />}
            placeholder="Full Name"
            value={fullName}
            onChange={setFullName}
          />
          <EditableInputRow
            icon={<Mail size={16} className="text-white/70" />}
            placeholder="Email Address"
            value={email}
            onChange={setEmail}
            type="email"
          />
          <EditableInputRow
            icon={<Phone size={16} className="text-white/70" />}
            placeholder="Phone Number"
            value={phone}
            onChange={setPhone}
            type="tel"
          />
          <EditableInputRow
            icon={<Calendar size={16} className="text-white/70" />}
            placeholder="Date of Birth"
            value={dob}
            onChange={setDob}
            type="date"
          />
          <ActionInputRow
            icon={<User size={16} className="text-white/70" />}
            placeholder="Educational Qualification"
            value={qualification}
            onClick={() => setQualificationModal(true)}
          />
          <ActionInputRow
            icon={<User size={16} className="text-white/70" />}
            placeholder="Medical License Number"
            value={licenseNumber}
            onClick={() => setLicenseModal(true)}
          />
          <ActionInputRow
            icon={<User size={16} className="text-white/70" />}
            placeholder="Add Your Hospital"
            value={hospitalName}
            onClick={() => setHospitalModal(true)}
          />
          <EditableInputRow
            icon={<User size={16} className="text-white/70" />}
            placeholder="Years of Experience"
            value={yearsOfExperience}
            onChange={setYearsOfExperience}
            type="number"
          />
          <EditableInputRow
            icon={<User size={16} className="text-white/70" />}
            placeholder="Write about yourself"
            value={bio}
            onChange={setBio}
            multiline
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
                type="button"
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
                {active && <span>✔</span>}
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
            type="button"
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
            type="button"
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

function EditableInputRow({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  multiline = false,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <label className="flex w-full items-start gap-3 rounded-2xl border border-[#0f4a4b] bg-[#073133] px-4 py-3 text-sm text-white">
      <span className="mt-1 text-white/70">{icon}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-20 flex-1 resize-none bg-transparent text-white placeholder:text-white/50 focus:outline-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-white placeholder:text-white/50 focus:outline-none"
        />
      )}
    </label>
  );
}

function ActionInputRow({
  icon,
  placeholder,
  value,
  onClick,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-[#0f4a4b] bg-[#073133] px-4 py-3 text-left text-sm text-white"
    >
      <span className="text-white/70">{icon}</span>
      <span className={value ? "font-semibold" : "text-white/50"}>
        {value || placeholder}
      </span>
    </button>
  );
}
