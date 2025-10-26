"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCareProviderProgress } from "../../../../../hooks/use-care-provider-progress";
import { getProgressBlockingUI } from "../../../../../utils/care-provider-progress";

const conversations: Record<
  string,
  { name: string; messages: Array<{ author: "doctor" | "patient"; text: string }> }
> = {
  callum: {
    name: "Callum Davies",
    messages: [
      { author: "patient", text: "I have a burning sensation in my throat" },
      { author: "doctor", text: "Let's schedule a quick call tomorrow morning." },
    ],
  },
  daniel: {
    name: "Daniel Abayomi",
    messages: [
      { author: "doctor", text: "Daniel, how are you feeling today?" },
      { author: "patient", text: "Omo my bro I dey alright hby" },
      { author: "doctor", text: "Remember to rest and stay hydrated." },
    ],
  },
  habibah: {
    name: "Habibah Ituah",
    messages: [
      { author: "patient", text: "Thank you doctor, I feel a lot better" },
      { author: "doctor", text: "Great news Habibah!" },
    ],
  },
};

export default function ProviderMessageDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { progress, hydrated } = useCareProviderProgress();
  const convo = conversations[params.id] ?? conversations.callum;

  const blockingState = useMemo(
    () => getProgressBlockingUI(progress, router),
    [progress, router]
  );

  if (!hydrated) {
    return (
      <div className="pt-20 text-center text-white/60">Opening chat...</div>
    );
  }

  if (blockingState) {
    return blockingState;
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/care-provider/messages")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <Image
            src="/care-seeker.png"
            alt={convo.name}
            width={42}
            height={42}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold">{convo.name}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl bg-[#111111] p-4">
        {convo.messages.map((message, idx) => {
          const isDoctor = message.author === "doctor";
          return (
            <div key={idx} className={`flex ${isDoctor ? "justify-end" : ""}`}>
              <p
                className={[
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  isDoctor ? "bg-[#0B5B49] text-white" : "bg-white text-black",
                ].join(" ")}
              >
                {message.text}
              </p>
            </div>
          );
        })}
        <div className="rounded-2xl border border-white/10 px-4 py-3 text-xs text-white/60">
          Daniel scheduled an appointment for 20th February 2025 by 10pm
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-[#111111] px-4 py-3">
        <input
          type="text"
          placeholder="Send a message"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
        <button className="rounded-full bg-[#52c340] px-4 py-2 text-sm font-semibold text-black">
          Send
        </button>
      </div>
    </div>
  );
}
