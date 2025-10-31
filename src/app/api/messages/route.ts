import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/src/utils/supabase/service";

type MessageAuthor = "user" | "doctor";

interface RawMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  author: MessageAuthor;
  text: string;
  at: string;
  sender?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    role: string | null;
  } | null;
}

type RawMessageRow = Omit<RawMessage, "sender"> & {
  sender?: RawMessage["sender"] | RawMessage["sender"][] | null;
};

function normalizeSender(
  sender: RawMessageRow["sender"]
): RawMessage["sender"] {
  if (Array.isArray(sender)) {
    const first = sender[0];
    if (!first) {
      return null;
    }
    return {
      id: String(first.id ?? ""),
      first_name: first.first_name ?? "",
      last_name: first.last_name ?? "",
      avatar_url: first.avatar_url ?? "",
      role: first.role ?? "",
    };
  }

  if (!sender) {
    return null;
  }

  return {
    id: String(sender.id ?? ""),
    first_name: sender.first_name ?? "",
    last_name: sender.last_name ?? "",
    avatar_url: sender.avatar_url ?? "",
    role: sender.role ?? "",
  };
}

function formatMessages(data: RawMessageRow[] | null): RawMessage[] {
  return (
    data?.map((message) => ({
      ...message,
      sender: normalizeSender(message.sender ?? null),
    })) ?? []
  );
}

export async function GET(request: NextRequest) {
  const supabase = createServiceClient();
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversationId");
  const doctorId = searchParams.get("doctorId");

  let query = supabase
    .from("messages")
    .select(
      `
        id,
        conversation_id,
        sender_id,
        author,
        text,
        at,
        sender:profiles!sender_id (
          id,
          first_name,
          last_name,
          avatar_url,
          role
        )
      `
    )
    .order("at", { ascending: true });

  if (conversationId) {
    query = query.eq("conversation_id", conversationId);
  } else if (doctorId) {
    query = query.eq("conversation_id", doctorId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching messages via API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: formatMessages(data as RawMessageRow[] | null),
  });
}

interface PostRequestBody {
  conversationId?: string;
  doctorId: string;
  userId: string;
  text: string;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<PostRequestBody>;
  const doctorId = body.doctorId;
  const userId = body.userId;
  const text = body.text?.trim();
  const providedConversationId = body.conversationId?.trim();

  if (!doctorId || !userId || !text) {
    return NextResponse.json(
      { error: "doctorId, userId and text are required." },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Ensure the doctor profile exists so we can personalize the reply.
  const {
    data: doctorProfile,
    error: doctorError,
  } = await supabase
    .from("profiles")
    .select("first_name, last_name, avatar_url")
    .eq("id", doctorId)
    .single();

  if (doctorError) {
    console.error("Error fetching doctor profile:", doctorError);
    return NextResponse.json(
      { error: "Unable to find doctor profile." },
      { status: 404 }
    );
  }

  const doctorFullName = `${doctorProfile.first_name ?? ""} ${
    doctorProfile.last_name ?? ""
  }`.trim() || "Doctor";

  const conversationId = providedConversationId || doctorId;

  // Ensure conversation record exists using deterministic id (doctor id).
  const { error: upsertError } = await supabase
    .from("conversations")
    .upsert({ id: conversationId }, { onConflict: "id" });

  if (upsertError) {
    console.error("Error ensuring conversation exists:", upsertError);
    return NextResponse.json(
      { error: "Unable to prepare conversation." },
      { status: 500 }
    );
  }

  const doctorReplyText = `Hello, I'm ${doctorFullName}. I am currently not available. How may I help you?`;

  const { data, error: insertError } = await supabase
    .from("messages")
    .insert([
      {
        conversation_id: conversationId,
        sender_id: userId,
        author: "user" as MessageAuthor,
        text,
      },
      {
        conversation_id: conversationId,
        sender_id: doctorId,
        author: "doctor" as MessageAuthor,
        text: doctorReplyText,
      },
    ])
    .select(
      `
        id,
        conversation_id,
        sender_id,
        author,
        text,
        at,
        sender:profiles!sender_id (
          id,
          first_name,
          last_name,
          avatar_url,
          role
        )
      `
    )
    .order("at", { ascending: true });

  if (insertError) {
    console.error("Error storing messages:", insertError);
    return NextResponse.json(
      { error: "Unable to store messages." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    conversationId,
    data: formatMessages(data as RawMessageRow[] | null),
    doctor: {
      id: doctorId,
      first_name: doctorProfile.first_name ?? "",
      last_name: doctorProfile.last_name ?? "",
      avatar_url: doctorProfile.avatar_url ?? "",
    },
  });
}
