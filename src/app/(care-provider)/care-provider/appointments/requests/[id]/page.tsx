"use client";

import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCareProviderProgress } from "../../../../../../hooks/use-care-provider-progress";
import { getProgressBlockingUI } from "../../../../../../utils/care-provider-progress";
import { useCareProviderExperience } from "../../../../../../hooks/use-care-provider-experience";

export default function NewRequestDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-white/60">
          Loading request...
        </div>
      }
    >
      <NewRequestDetailContent />
    </Suspense>
  );
}

function NewRequestDetailContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { progress, hydrated } = useCareProviderProgress();
  const {
    requests,
    acceptRequest,
    rejectRequest,
    ensureConversation,
  } = useCareProviderExperience();

  const request = requests.find((item) => item.id === params.id);

  const blockingState = getProgressBlockingUI(progress, router);

  if (!hydrated) {
    return (
      <div className="pt-20 text-center text-white/60">Loading request...</div>
    );
  }

  if (blockingState) {
    return blockingState;
  }

  if (!request) {
    router.replace("/care-provider/home");
    return null;
  }

  const handleAccept = () => {
    acceptRequest(request.id);
    router.push("/care-provider/home");
  };

  const handleReject = () => {
    rejectRequest(request.id);
    router.push("/care-provider/home");
  };

  const handleChat = () => {
    ensureConversation({ id: request.id || "", name: request.name || "Care seeker" });
    router.push(`/care-provider/messages/${request.id || ""}`);
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">New Request</h1>
        <span />
      </div>

      <div>
        <p className="text-sm text-white/60">Patient&apos;s Details</p>
        <div className="mt-3 rounded-2xl border border-white/10 p-4 text-sm">
          <p className="text-lg font-semibold">{request.name}</p>
          <p className="text-white/60">
            Age: {request.age} years
          </p>
          <p className="text-white/60">Preferred location: {request.preferredLocation === "home" ? "Home service" : "Clinic visit"}</p>
          <button
            onClick={handleChat}
            className="mt-4 rounded-2xl border border-white/20 px-4 py-2 text-sm"
          >
            Chat patient
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm text-white/60">Appointment Details</p>
          <div className="mt-3 rounded-2xl border border-white/10 p-4 text-sm space-y-3">
            <Info label="Session type" value={request.type || ""} />
            <Info label="Schedule" value={request.schedule || ""} />
            <div>
              <p className="text-white/60">Summary</p>
              <p className="text-white">{request.summary}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={handleReject}
            className="rounded-2xl border border-white/20 py-3 text-sm font-semibold text-white"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="rounded-2xl bg-[#52c340] py-3 text-sm font-semibold text-black"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
