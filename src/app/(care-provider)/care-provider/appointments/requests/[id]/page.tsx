"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import SimpleModal from "../../../../../../components/ui/simple-modal";
import { useCareProviderProgress } from "../../../../../../hooks/use-care-provider-progress";
import { getProgressBlockingUI } from "../../../../../../utils/care-provider-progress";

const requestMap: Record<
  string,
  {
    name: string;
    age: string;
    gender: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    type: string;
    symptoms: string;
  }
> = {
  devon: {
    name: "Devon Lane",
    age: "18 years",
    gender: "Male",
    email: "devonlane20@gmail.com",
    phone: "0809 543 756",
    date: "3rd March 2025",
    time: "3:00pm",
    type: "Home Consultation",
    symptoms:
      "Stomach ache, dizziness, weakness, loss of breath, body pains all over",
  },
};

export default function NewRequestDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { progress, hydrated } = useCareProviderProgress();
  const [cancelModal, setCancelModal] = useState(false);
  const request = requestMap[params.id] ?? requestMap.devon;

  const blockingState = useMemo(
    () => getProgressBlockingUI(progress, router),
    [progress, router]
  );

  if (!hydrated) {
    return (
      <div className="pt-20 text-center text-white/60">Loading request...</div>
    );
  }

  if (blockingState) {
    return blockingState;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/care-provider/appointments?tab=new")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">New Requests</h1>
        <span />
      </div>

      <div className="">
        <p className="text-sm text-white/60">Patient’s Details</p>
        <div className="mt-3 rounded-2xl border border-white/10 p-4 text-sm">
          <p className="text-lg font-semibold">{request.name}</p>
          <p className="text-white/60">
            Age: {request.age} • Gender: {request.gender}
          </p>
          <p className="text-white/60">Mail: {request.email}</p>
          <p className="text-white/60">Phone Number: {request.phone}</p>
          <button
            onClick={() => router.push(`/care-provider/messages/${params.id}`)}
            className="mt-4 rounded-2xl border border-white/20 px-4 py-2 text-sm"
          >
            Chat patient
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm text-white/60">Appointment Details</p>
          <div className="mt-3 rounded-2xl border border-white/10 p-4 text-sm">
            <Info label="Date" value={request.date} />
            <Info label="Time" value={request.time} />
            <Info label="Type" value={request.type} />
            <div className="mt-3">
              <p className="text-white/60">Symptoms listed:</p>
              <p className="text-white">{request.symptoms}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => setCancelModal(true)}
            className="rounded-2xl border border-white/20 py-3 text-sm font-semibold text-white"
          >
            Cancel
          </button>
          <button className="rounded-2xl bg-[#52c340] py-3 text-sm font-semibold text-black">
            Accept
          </button>
        </div>
      </div>

      <SimpleModal
        open={cancelModal}
        onClose={() => setCancelModal(false)}
        title="Are you sure?"
        subtitle="Do you want to cancel this request?"
      >
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            className="rounded-2xl bg-white py-2 text-sm font-semibold text-black"
            onClick={() => setCancelModal(false)}
          >
            No
          </button>
          <button
            className="rounded-2xl bg-red-500 py-2 text-sm font-semibold text-white"
            onClick={() => setCancelModal(false)}
          >
            Yes
          </button>
        </div>
      </SimpleModal>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
