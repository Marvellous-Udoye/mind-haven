"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import type { CareModule } from "../types/care";

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  module: CareModule;
  date: string; // ISO string
  time: string; // e.g. 2025-01-15T15:00
  locationType: "home" | "clinic";
  location: string;
  status: "upcoming" | "completed";
}

export interface Message {
  id: string; // doctorId
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
  resetData: () => void;
}

const STORAGE_KEY = "care-seeker-experience";

const CareSeekerContext = createContext<CareSeekerContextValue | undefined>(
  undefined
);

const initialState = {
  appointments: [] as Appointment[],
  messages: [
    {
      id: "callum",
      doctorName: "Callum Davies",
      avatar: "/care-provider.png",
      lastUpdated: new Date().toISOString(),
      preview: "Just breathe in and out",
      history: [
        { author: "doctor", text: "Just breathe in and out", at: new Date().toISOString() },
      ],
    },
    {
      id: "daniel",
      doctorName: "Daniel Abayomi",
      avatar: "/care-provider.png",
      lastUpdated: new Date().toISOString(),
      preview: "Daniel scheduled an appointment for 20th February 2025 by 10pm",
      history: [
        { author: "doctor", text: "Daniel scheduled an appointment for 20th February 2025 by 10pm", at: new Date().toISOString() },
      ],
    },
    {
      id: "habibah",
      doctorName: "Habibah Ituah",
      avatar: "/care-provider.png",
      lastUpdated: new Date().toISOString(),
      preview: "Hope you are actually feeling better now",
      history: [
        { author: "doctor", text: "Hope you are actually feeling better now", at: new Date().toISOString() },
      ],
    },
  ] as Message[],
};

export function CareSeekerProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(
    initialState.appointments
  );
  const [messages, setMessages] = useState<Message[]>(initialState.messages);

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
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload = JSON.stringify({ appointments, messages });
    window.localStorage.setItem(STORAGE_KEY, payload);
  }, [appointments, messages]);

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
    setMessages((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== doctorId) return conversation;
        const now = new Date().toISOString();
        return {
          ...conversation,
          lastUpdated: now,
          preview: text,
          history: [
            ...conversation.history,
            { author: "user", text, at: now },
          ],
        };
      })
    );
  }, []);

  const resetData = useCallback(() => {
    setAppointments(initialState.appointments);
    setMessages(initialState.messages);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      appointments,
      messages,
      upsertAppointment,
      ensureConversation,
      appendMessage,
      resetData,
    }),
    [appointments, messages, upsertAppointment, ensureConversation, appendMessage, resetData]
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
