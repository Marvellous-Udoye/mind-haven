"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCareProviderProgress } from "../../../../hooks/use-care-provider-progress";
import { getProgressBlockingUI } from "../../../../utils/care-provider-progress";
import { useCareProviderExperience } from "../../../../hooks/use-care-provider-experience";

export default function CareProviderMessagesPage() {
  const router = useRouter();
  const { progress, hydrated } = useCareProviderProgress();
  const { messages } = useCareProviderExperience();

  const blockingState = useMemo(
    () => getProgressBlockingUI(progress, router),
    [progress, router]
  );

  const ordered = [...messages].sort(
    (a, b) =>
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );

  if (!hydrated) {
    return (
      <div className="pt-20 text-center text-white/60">
        Preparing messages...
      </div>
    );
  }

  if (blockingState) {
    return blockingState;
  }

  return (
    <div className="flex flex-col gap-6 pb-8">
      <h1 className="text-xl font-semibold text-[#52c340]">Messages</h1>
      {ordered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 py-16 text-center text-white/60">
          You have no conversations yet. Accept a request to start chatting with
          patients.
        </div>
      ) : (
        <div className="space-y-4">
          {ordered.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() =>
                router.push(`/care-provider/messages/${conversation.id}`)
              }
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={conversation.avatar || "/care-seeker.png"}
                  alt={conversation.patient}
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{conversation.patient}</p>
                  <p className="text-xs text-white/60">{conversation.preview}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#52c340]">
                {new Date(conversation.lastUpdated).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
