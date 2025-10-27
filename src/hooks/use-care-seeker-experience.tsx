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

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  module: CareModule;
  date: string;
  time: string;
  locationType: "home" | "clinic";
  location: string;
  status: "upcoming" | "completed";
}

export interface Message {
  id: string;
  doctorName: string;
  avatar: string;
  lastUpdated: string;
  preview: string;
  history: Array<{ author: "user" | "doctor"; text: string; at: string }>;
}

interface CareSeekerContextValue {
  appointments: Appointment[];
  messages: Message[];
  upsertAppointment: (appointment: Appointment) => void;
  ensureConversation: (
    doctorId: string,
    doctorName: string,
    avatar: string
  ) => void;
  appendMessage: (doctorId: string, text: string) => void;
}

const STORAGE_KEY = "care-seeker-experience";

const CareSeekerContext = createContext<CareSeekerContextValue | undefined>(
  undefined
);

const initialState: Pick<CareSeekerContextValue, "appointments" | "messages"> = {
  appointments: [],
  messages: [],
};

export function CareSeekerProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(
    initialState.appointments
  );
  const [messages, setMessages] = useState<Message[]>(initialState.messages);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.appointments)) {
          setAppointments(parsed.appointments);
        }
        if (Array.isArray(parsed?.messages)) {
          setMessages(parsed.messages);
        }
      } catch {
        // ignore parse errors
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    const payload = JSON.stringify({ appointments, messages });
    window.localStorage.setItem(STORAGE_KEY, payload);
  }, [appointments, messages, hydrated]);

  const upsertAppointment = useCallback((appointment: Appointment) => {
    setAppointments((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === appointment.id);
      if (existingIndex > -1) {
        const clone = [...prev];
        clone[existingIndex] = appointment;
        return clone;
      }
      return [appointment, ...prev];
    });
  }, []);

  const ensureConversation = useCallback(
    (doctorId: string, doctorName: string, avatar: string) => {
      setMessages((prev) => {
        const exists = prev.find((m) => m.id === doctorId);
        if (exists) return prev;
        const now = new Date().toISOString();
        return [
          {
            id: doctorId,
            doctorName,
            avatar,
            lastUpdated: now,
            preview: "Say hello to start the conversation",
            history: [],
          },
          ...prev,
        ];
      });
    },
    []
  );

  const appendMessage = useCallback((doctorId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => {
      const conversation = prev.find((m) => m.id === doctorId);
      if (!conversation) {
        return prev;
      }
      const now = new Date();
      const userEntry = {
        author: "user" as const,
        text: trimmed,
        at: now.toISOString(),
      };
      const replyText = `Hi, I am ${conversation.doctorName}, how may I help you?`;
      const replyEntry = {
        author: "doctor" as const,
        text: replyText,
        at: new Date(now.getTime() + 400).toISOString(),
      };

      return prev.map((message) => {
        if (message.id !== doctorId) return message;
        const history = [...message.history, userEntry, replyEntry];
        return {
          ...message,
          history,
          lastUpdated: replyEntry.at,
          preview: replyText,
        };
      });
    });
  }, []);

  const value = useMemo(
    () => ({
      appointments,
      messages,
      upsertAppointment,
      ensureConversation,
      appendMessage,
    }),
    [appointments, messages, upsertAppointment, ensureConversation, appendMessage]
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
