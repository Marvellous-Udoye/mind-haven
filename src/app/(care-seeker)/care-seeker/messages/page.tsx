"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCareSeekerExperience } from "../../../../hooks/use-care-seeker-experience";

export default function MessagesPage() {
  const router = useRouter();
  const { messages } = useCareSeekerExperience();

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
    if (!existing || new Date(message.at) > new Date(existing.lastMessageAt)) {
      if (existing) {
        Object.assign(existing, {
          lastMessageAt: message.at,
          preview: message.text,
        });
      } else {
        acc.push({
          id: message.conversation_id,
          conversation_id: message.conversation_id,
          doctorName: message.doctorName || "Doctor",
          avatar: message.avatar || "/care-provider.png",
          lastMessageAt: message.at,
          preview: message.text,
          history: [], // We'll populate this when opening the conversation
        });
      }
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
