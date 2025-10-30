"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCareProviderProgress } from "../../../../../hooks/use-care-provider-progress";
import { getProgressBlockingUI } from "../../../../../utils/care-provider-progress";
import { useCareProviderExperience } from "../../../../../hooks/use-care-provider-experience";

export default function ProviderMessageDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center text-white/60">
          Opening chat...
        </div>
      }
    >
      <ProviderMessageDetailContent />
    </Suspense>
  );
}

function ProviderMessageDetailContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { progress, hydrated } = useCareProviderProgress();
  const { messages, appendMessage } = useCareProviderExperience();

  // Get all messages for this conversation
  const conversationMessages = messages.filter((m) => m.conversation_id === params.id);
  const latestMessage = conversationMessages[conversationMessages.length - 1];

  const conversation = latestMessage ? {
    id: params.id,
    conversation_id: params.id,
    patient: latestMessage.seeker_name || "Patient",
    avatar: latestMessage.seeker_avatar || "/care-seeker.png",
    history: conversationMessages.map(msg => ({
      author: msg.author,
      text: msg.text,
      at: msg.at,
    })),
  } : null;

  const [draft, setDraft] = useState("");

  const blockingState = getProgressBlockingUI(progress, router);

  if (!hydrated) {
    return (
      <div className="pt-20 text-center text-white/60">Opening chat...</div>
    );
  }

  if (blockingState) {
    return blockingState;
  }

  if (!conversation) {
    router.replace("/care-provider/messages");
    return null;
  }

  const handleSend = () => {
    if (!draft.trim()) return;
    appendMessage(conversation.id, draft);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col gap-4 pb-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/care-provider/messages")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <Image
            src={conversation.avatar || "/care-seeker.png"}
            alt={conversation.patient || "Patient"}
            width={42}
            height={42}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold">{conversation.patient}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl bg-[#111111] p-4">
        {conversation.history.map((message, idx) => {
          // In this app, provider-authored messages are stored with author === "doctor"
          const isProvider = message.author === "doctor";
          return (
            <div key={idx} className={`flex ${isProvider ? "justify-end" : ""}`}>
              <p
                className={[
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  isProvider ? "bg-[#0B5B49] text-white" : "bg-white text-black",
                ].join(" ")}
              >
                {message.text}
              </p>
            </div>
          );
        })}
        {conversation.history.length === 0 && (
          <div className="rounded-2xl border border-white/10 px-4 py-3 text-xs text-white/60">
            You haven&apos;t sent any messages to this patient yet.
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-[#111111] px-4 py-3">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Send a message"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="rounded-full bg-[#52c340] px-4 py-2 text-sm font-semibold text-black"
        >
          Send
        </button>
      </div>
    </div>
  );
}
