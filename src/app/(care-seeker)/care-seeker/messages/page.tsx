"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useCareSeekerExperience } from "../../../../hooks/use-care-seeker-experience";

export default function MessagesPage() {
  const router = useRouter();
  const { messages, providers } = useCareSeekerExperience();

  const providerMap = useMemo(() => {
    return new Map(providers.map((provider) => [provider.id, provider]));
  }, [providers]);

  // Group messages by conversation and get the latest message for each
  interface ConversationPreview {
    id: string;
    conversation_id: string;
    doctorName: string;
    avatar: string;
    lastMessageAt: string;
    preview: string;
    history: never[];
  }

  const conversations = messages.reduce((acc: ConversationPreview[], message) => {
    const existing = acc.find(conv => conv.conversation_id === message.conversation_id);
    const provider = providerMap.get(message.conversation_id);
    const doctorNameFromProvider = provider
      ? `${provider.first_name} ${provider.last_name}`.trim()
      : "";
    const senderIsDoctor = message.author === "doctor" || message.sender?.role === "care_provider";
    const doctorName =
      doctorNameFromProvider ||
      (senderIsDoctor
        ? `${message.sender?.first_name ?? ""} ${message.sender?.last_name ?? ""}`.trim()
        : "Doctor");
    const avatar =
      provider?.avatar_url ||
      (senderIsDoctor ? message.sender?.avatar_url : undefined) ||
      "/care-provider.png";

    if (!existing) {
      acc.push({
        id: message.conversation_id,
        conversation_id: message.conversation_id,
        doctorName: doctorName || "Doctor",
        avatar,
        lastMessageAt: message.at,
        preview: message.text,
        history: [], // We'll populate this when opening the conversation
      });
    } else if (new Date(message.at) > new Date(existing.lastMessageAt)) {
      Object.assign(existing, {
        doctorName: doctorName || existing.doctorName,
        avatar: avatar || existing.avatar,
        lastMessageAt: message.at,
        preview: message.text,
      });
    }
    return acc;
  }, []);

  const ordered = conversations.sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  return (
    <div className="flex flex-col gap-6 pb-10">
      <h1 className="text-xl font-semibold text-[#52c340]">Messages</h1>
      {ordered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 py-16 px-4 text-center text-white/60">
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
                {new Date(message.lastMessageAt).toLocaleTimeString([], {
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
