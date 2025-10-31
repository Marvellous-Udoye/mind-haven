"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCareSeekerExperience } from "../../../../../hooks/use-care-seeker-experience";

export default function MessageDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { messages, providers, sendMessage } = useCareSeekerExperience();

  // Get all messages for this conversation
  const conversationMessages = useMemo(() =>
    messages.filter((m) => m.conversation_id === params.id),
    [messages, params.id]
  );

  const doctorProfile = useMemo(
    () => providers.find((provider) => provider.id === params.id),
    [providers, params.id]
  );

  const doctorMessage = useMemo(
    () =>
      conversationMessages.find(
        (msg) => msg.author === "doctor" || msg.sender?.role === "care_provider"
      ),
    [conversationMessages]
  );

  const doctorName =
    (doctorProfile
      ? `${doctorProfile.first_name} ${doctorProfile.last_name}`.trim()
      : "") ||
    (doctorMessage
      ? `${doctorMessage.sender?.first_name ?? ""} ${
          doctorMessage.sender?.last_name ?? ""
        }`.trim()
      : "") ||
    "Doctor";

  const doctorAvatar =
    doctorProfile?.avatar_url ||
    doctorMessage?.sender?.avatar_url ||
    "/care-provider.png";

  const conversation = useMemo(() => {
    return {
      id: params.id,
      conversation_id: params.id,
      doctorName,
      avatar: doctorAvatar,
      history: conversationMessages.map((msg) => ({
        author: msg.author,
        text: msg.text,
        at: msg.at,
      })),
    };
  }, [conversationMessages, params.id, doctorName, doctorAvatar]);

  const [draft, setDraft] = useState("");

  // Handle navigation when conversation is not found
  useEffect(() => {
    if (providers.length > 0 && !doctorProfile) {
      router.replace("/care-seeker/messages");
    }
  }, [providers.length, doctorProfile, router]);

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(conversation.id, draft.trim());
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col gap-4 pb-6">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => router.push("/care-seeker/messages")}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#0C4031]"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center flex-row-reverse gap-14">
          <Image
            src={conversation.avatar || "/care-provider.png"}
            alt={conversation.doctorName}
            width={42}
            height={42}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold">{conversation.doctorName}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-3xl bg-[#111111] p-4">
        {conversation.history.map((message, idx) => {
          const isYou = message.author === "user";
          return (
            <div key={idx} className={`flex ${isYou ? "justify-end" : ""}`}>
              <p
                className={[
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                  isYou ? "bg-[#0B5B49] text-white" : "bg-white text-black",
                ].join(" ")}
              >
                {message.text}
              </p>
            </div>
          );
        })}
        {conversation.history.length === 0 && (
          <div className="rounded-2xl border border-white/10 px-4 py-3 text-xs text-white/60">
            No messages yet. Say hello to begin the conversation.
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
