"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCareSeekerExperience } from "../../../../hooks/use-care-seeker-experience";

export default function MessagesPage() {
  const router = useRouter();
  const { messages } = useCareSeekerExperience();
  const ordered = [...messages].sort(
    (a, b) =>
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      <h1 className="text-xl font-semibold text-[#52c340]">Messages</h1>
      {ordered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 py-16 text-center text-white/60">
          You have no conversations yet. Start by booking an appointment or tapping
          “Chat Now” on a doctor’s profile.
        </div>
      ) : (
        <div className="space-y-4">
          {ordered.map((message) => (
            <button
              key={message.id}
              onClick={() => router.push(`/care-seeker/messages/${message.id}`)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#111111] px-4 py-3 text-left"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={message.avatar || "/care-provider.png"}
                  alt={message.doctorName}
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{message.doctorName}</p>
                  <p className="text-xs text-white/60">{message.preview}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-[#52c340]">
                {new Date(message.lastUpdated).toLocaleTimeString([], {
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
