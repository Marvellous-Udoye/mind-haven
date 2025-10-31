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
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string;
    role: string;
  } | null;
}

interface CareSeekerContextValue {
  appointments: Appointment[];
  messages: Message[];
  providers: UserProfile[];
  bookAppointment: (appointment: Omit<Appointment, "id" | "seeker_id">) => Promise<void>;
  sendMessage: (conversation_id: string, text: string) => Promise<void>;
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
      try {
        const response = await fetch("/api/messages");
        const payload = (await response.json()) as { data?: Message[]; error?: string };
        if (!response.ok) {
          throw new Error(payload.error || "Unable to fetch messages.");
        }
        setMessages(payload.data ?? []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
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
    async (conversation_id: string, text: string) => {
      if (user) {
        try {
          const doctorMatch = providers.find(provider => provider.id === conversation_id);
          const response = await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              conversationId: conversation_id,
              doctorId: doctorMatch?.id ?? conversation_id,
              userId: user.id,
              text,
            }),
          });

          const payload = (await response.json()) as {
            data?: Message[];
            error?: string;
          };

          if (!response.ok) {
            throw new Error(payload.error || "Unable to send message.");
          }

          setMessages((prev) => [...prev, ...(payload.data ?? [])]);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
    },
    [user, providers]
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
