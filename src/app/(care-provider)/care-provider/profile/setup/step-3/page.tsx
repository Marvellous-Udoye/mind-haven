"use client";

import { ArrowLeft, Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCareProviderProgress } from "../../../../../../hooks/use-care-provider-progress";

const UploadRow = ({ label }: { label: string }) => (
  <button
    type="button"
    className="w-full flex items-center justify-between rounded-2xl border border-[#0f4a4b] bg-[#073133] px-4 py-4 text-left"
  >
    <div>
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-white/60">Attach supported document</p>
    </div>
    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#52c340]/20 text-[#52c340]">
      <Paperclip size={18} />
    </span>
  </button>
);

export default function StepThreePage() {
  const router = useRouter();
  const { setProgress } = useCareProviderProgress();

  const handleContinue = () => {
    setProgress("awaiting");
    router.push("/care-provider/home");
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
          onClick={() => handleContinue()}
          className="text-sm text-white/70"
        >
          Skip
        </button>
      </div>

      <div className="">
        <p className="text-sm text-white/60">Step 3 of 3</p>
        <h1 className="mt-1 text-xl font-semibold text-[#52c340]">
          Document Verification
        </h1>
        <p className="text-sm text-white/60">
          Attach your documents for your profile verification
        </p>

        <div className="mt-8 space-y-4">
          <UploadRow label="Practicing Medical License*" />
          <UploadRow label="Qualification Certificate*" />
        </div>

        <button
          onClick={handleContinue}
          className="mt-10 w-full rounded-2xl bg-white py-3 text-base font-semibold text-black"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
