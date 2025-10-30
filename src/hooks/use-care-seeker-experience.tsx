"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CareModule } from "../types/care";
import { createClient } from "../utils/supabase/client";
import { useAuthSession } from "./use-auth-session";
import { UserProfile } from "../types/user";

export interface Appointment {
  id: string;
  provider_id: string;
  seeker_id: string;
  doctor_name: string;
  specialty: string;
  module: CareModule;
  appointment_date: string;
  appointment_time: string;
  location_type: "home" | "clinic";
  location: string;
  status: "pending" | "upcoming" | "completed" | "cancelled" | "rejected";
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  author: "user" | "doctor";
  text: string;
  at: string;
  doctorName?: string;
  avatar?: string;
  isLocal?: boolean; // For local messages that don't sync to database
}

interface CareSeekerContextValue {
  appointments: Appointment[];
  messages: Message[];
  providers: UserProfile[];
  bookAppointment: (appointment: Omit<Appointment, "id" | "seeker_id">) => Promise<void>;
  sendMessage: (conversation_id: string, text: string, doctor?: UserProfile) => Promise<void>;
}

const CareSeekerContext = createContext<CareSeekerContextValue | undefined>(
  undefined
);

export function CareSeekerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [providers, setProviders] = useState<UserProfile[]>([]);

  useEffect(() => {
    const fetchProviders = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "care_provider")
        .not("module", "is", null)
        .not("category", "is", null);
      if (error) {
        console.error("Error fetching providers:", error);
      } else {
        setProviders(data as UserProfile[]);
      }
    };
    const fetchAppointments = async () => {
      if (user) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .eq("seeker_id", user.id);
        if (error) {
          console.error("Error fetching appointments:", error);
        } else {
          setAppointments(data as Appointment[]);
        }
      }
    };

    const fetchMessages = async () => {
      if (user) {
        // Load local messages from localStorage
        const localMessagesKey = `messages-${user.id}`;
        const storedMessages = localStorage.getItem(localMessagesKey);
        if (storedMessages) {
          try {
            const localMessages = JSON.parse(storedMessages);
            setMessages(localMessages);
          } catch (error) {
            console.error("Error parsing stored messages:", error);
          }
        }

        // Try to fetch database messages
        const supabase = createClient();
        const { data, error } = await supabase
          .from("messages")
          .select(`
            *,
            sender:profiles!sender_id(first_name, last_name, avatar_url)
          `)
          .in(
            "conversation_id",
            (
              await supabase
                .from("conversation_participants")
                .select("conversation_id")
                .eq("user_id", user.id)
            ).data?.map((c) => c.conversation_id) || []
          )
          .order("at", { ascending: true });

        if (error) {
          console.error("Error fetching messages:", error);
        } else {
          const formattedMessages = data?.map((msg: unknown) => {
            const message = msg as {
              id: string;
              conversation_id: string;
              sender_id: string;
              author: "user" | "doctor";
              text: string;
              at: string;
              sender?: {
                first_name?: string;
                last_name?: string;
                avatar_url?: string;
              };
            };
            return {
              ...message,
              doctorName: `${message.sender?.first_name || ""} ${message.sender?.last_name || ""}`.trim(),
              avatar: message.sender?.avatar_url || "/care-provider.png",
            };
          }) || [];

          // Merge with local messages, preferring database messages for same conversation
          setMessages(prevMessages => {
            const localOnly = prevMessages.filter(m => m.isLocal);
            const merged = [...formattedMessages, ...localOnly];
            return merged;
          });
        }
      }
    };

    fetchAppointments();
    fetchMessages();
    fetchProviders();
  }, [user]);

  const bookAppointment = useCallback(
    async (appointment: Omit<Appointment, "id" | "seeker_id">) => {
      if (user) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("appointments")
          .insert([{ ...appointment, seeker_id: user.id }])
          .select();
        if (error) {
          console.error("Error booking appointment:", error);
          throw error; // Re-throw to handle in component
        } else if (data) {
          setAppointments((prev) => [...prev, data[0] as Appointment]);
        }
      }
    },
    [user]
  );

  const sendMessage = useCallback(
    async (conversation_id: string, text: string, doctor?: UserProfile) => {
      if (user) {
        // Check if this is a local conversation (starts with 'local-')
        const isLocalConversation = conversation_id.startsWith('local-');

        if (isLocalConversation) {
          // Handle local message storage
          const localMessage: Message = {
            id: `local-${Date.now()}-${Math.random()}`,
            conversation_id,
            sender_id: user.id,
            author: "user",
            text,
            at: new Date().toISOString(),
            doctorName: `${user.user_metadata?.first_name || ""} ${user.user_metadata?.last_name || ""}`.trim(),
            avatar: user.user_metadata?.avatar_url || "/care-seeker.png",
            isLocal: true,
          };

          setMessages((prev) => {
            const updated = [...prev, localMessage];
            // Save to localStorage
            const localMessagesKey = `messages-${user.id}`;
            localStorage.setItem(localMessagesKey, JSON.stringify(updated.filter(m => m.isLocal)));
            return updated;
          });

          // Add automatic doctor reply after a short delay
          if (doctor) {
            setTimeout(() => {
              const doctorReply: Message = {
                id: `local-reply-${Date.now()}-${Math.random()}`,
                conversation_id,
                sender_id: doctor.id,
                author: "doctor",
                text: `Hello! I'm ${doctor.first_name} ${doctor.last_name}. How may I help you today?`,
                at: new Date().toISOString(),
                doctorName: `${doctor.first_name} ${doctor.last_name}`,
                avatar: doctor.avatar_url || "/care-provider.png",
                isLocal: true,
              };
              setMessages((prev) => {
                const updated = [...prev, doctorReply];
                // Save to localStorage
                const localMessagesKey = `messages-${user.id}`;
                localStorage.setItem(localMessagesKey, JSON.stringify(updated.filter(m => m.isLocal)));
                return updated;
              });
            }, 1000);
          }
        } else {
          // Handle database message
          const supabase = createClient();
          const { data, error } = await supabase
            .from("messages")
            .insert([
              {
                conversation_id,
                text,
                sender_id: user.id,
                author: "user",
              },
            ])
            .select(`
              *,
              sender:profiles!sender_id(first_name, last_name, avatar_url)
            `);
          if (error) {
            console.error("Error sending message:", error);
          } else if (data) {
            const formattedMessage = {
              ...data[0],
              doctorName: `${data[0].sender?.first_name || ""} ${data[0].sender?.last_name || ""}`.trim(),
              avatar: data[0].sender?.avatar_url || "/care-provider.png",
            };
            setMessages((prev) => [...prev, formattedMessage as Message]);
          }
        }
      }
    },
    [user]
  );

  const value = useMemo(
    () => ({
      appointments,
      messages,
      providers,
      bookAppointment,
      sendMessage,
    }),
    [appointments, messages, providers, bookAppointment, sendMessage]
  );

  return (
    <CareSeekerContext.Provider value={value}>
      {children}
    </CareSeekerContext.Provider>
  );
}

export function useCareSeekerExperience() {
  const context = useContext(CareSeekerContext);
  if (!context) {
    throw new Error(
      "useCareSeekerExperience must be used within CareSeekerProvider"
    );
  }
  return context;
}
