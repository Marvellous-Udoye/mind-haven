"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCareProviderProgress } from "../../../../hooks/use-care-provider-progress";
import { getProgressBlockingUI } from "../../../../utils/care-provider-progress";

const providerMessages = [
  {
    id: "callum",
    patient: "Callum Davies",
    preview: "I have a burning sensation in my throat",
    time: "7:35am",
  },
  {
    id: "daniel",
    patient: "Daniel Abayomi",
    preview: "Daniel scheduled an appointment for 20th Feb 2025 by 10pm",
    time: "7:35am",
  },
  {
    id: "habibah",
    patient: "Habibah Ituah",
    preview: "Thank you very much doctor, I feel a lot better",
    time: "6:55am",
  },
];

export default function CareProviderMessagesPage() {
  const router = useRouter();
  const { progress, hydrated } = useCareProviderProgress();

  const blockingState = useMemo(
    () => getProgressBlockingUI(progress, router),
    [progress, router]
  );

  if (!hydrated) {
    return (
      <div className="pt-20 text-center text-white/60">Preparing messages...</div>
    );
  }

  if (blockingState) {
    return blockingState;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-[#52c340]">Messages</h1>
      <div className="space-y-4">
        {providerMessages.map((message) => (
          <button
            key={message.id}
            onClick={() =>
              router.push(`/care-provider/messages/${message.id}`)
            }
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-left"
          >
            <div className="flex items-center gap-3">
              <Image
                src="/care-seeker.png"
                alt={message.patient}
                width={44}
                height={44}
                className="rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{message.patient}</p>
                <p className="text-xs text-white/60">{message.preview}</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#52c340]">
              {message.time}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
