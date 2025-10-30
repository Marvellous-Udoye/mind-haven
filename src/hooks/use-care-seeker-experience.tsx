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
  status: "upcoming" | "completed" | "cancelled";
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  author: "user" | "doctor";
  text: string;
  at: string;
}

interface CareSeekerContextValue {
  appointments: Appointment[];
  messages: Message[];
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

  useEffect(() => {
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
        const supabase = createClient();
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .in(
            "conversation_id",
            (
              await supabase
                .from("conversation_participants")
                .select("conversation_id")
                .eq("user_id", user.id)
            ).data?.map((c) => c.conversation_id) || []
          );
        if (error) {
          console.error("Error fetching messages:", error);
        } else {
          setMessages(data as Message[]);
        }
      }
    };

    fetchAppointments();
    fetchMessages();
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
          .select();
        if (error) {
          console.error("Error sending message:", error);
        } else if (data) {
          setMessages((prev) => [...prev, data[0] as Message]);
        }
      }
    },
    [user]
  );

  const value = useMemo(
    () => ({
      appointments,
      messages,
      bookAppointment,
      sendMessage,
    }),
    [appointments, messages, bookAppointment, sendMessage]
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
