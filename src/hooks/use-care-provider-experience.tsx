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

interface ProviderRequest {
  id: string;
  name: string;
  age: number;
  summary: string;
  schedule: string;
  type: string;
  preferredLocation: "home" | "clinic";
}

interface ProviderAppointment {
  id: string;
  patient: string;
  age: number;
  type: string;
  schedule: string;
  preferredLocation: "home" | "clinic";
  conversationId: string;
}

interface ProviderMessage {
  id: string;
  patient: string;
  avatar: string;
  lastUpdated: string;
  preview: string;
  history: Array<{ author: "provider" | "patient"; text: string; at: string }>;
}

interface CareProviderExperienceValue {
  requests: ProviderRequest[];
  upcomingAppointments: ProviderAppointment[];
  messages: ProviderMessage[];
  acceptRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  appendMessage: (conversationId: string, text: string) => void;
  ensureConversation: (request: {
    id: string;
    name: string;
    avatar?: string;
  }) => void;
  cancelAppointment: (id: string) => void;
  reset: () => void;
}

const STORAGE_KEY = "care-provider-experience";

const initialRequests: ProviderRequest[] = [
  {
    id: "req-devon",
    name: "Devon Lane",
    age: 29,
    summary: "Fever, persistent headache, and nausea lasting three days.",
    schedule: "Hospital visit • 25/03/2025 • 4:00pm",
    type: "Hospital Visit",
    preferredLocation: "clinic",
  },
  {
    id: "req-camila",
    name: "Camila Reyes",
    age: 34,
    summary: "Experiencing anxiety and restlessness around bedtime.",
    schedule: "Online session • 27/03/2025 • 7:30pm",
    type: "Online Consultation",
    preferredLocation: "home",
  },
];

const CareProviderExperienceContext =
  createContext<CareProviderExperienceValue | undefined>(undefined);

export function CareProviderExperienceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [requests, setRequests] = useState<ProviderRequest[]>(initialRequests);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    ProviderAppointment[]
  >([]);
  const [messages, setMessages] = useState<ProviderMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed?.requests)) {
          setRequests(parsed.requests);
        }
        if (Array.isArray(parsed?.upcomingAppointments)) {
          setUpcomingAppointments(parsed.upcomingAppointments);
        }
        if (Array.isArray(parsed?.messages)) {
          setMessages(parsed.messages);
        }
      } catch {
        // ignore
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    const payload = JSON.stringify({
      requests,
      upcomingAppointments,
      messages,
    });
    window.localStorage.setItem(STORAGE_KEY, payload);
  }, [requests, upcomingAppointments, messages, hydrated]);

  const ensureConversation = useCallback(
    ({ id, name, avatar = "/care-seeker.png" }: { id: string; name: string; avatar?: string }) => {
      setMessages((prev) => {
        const exists = prev.find((conversation) => conversation.id === id);
        if (exists) return prev;
        const now = new Date().toISOString();
        return [
          {
            id,
            patient: name,
            avatar,
            lastUpdated: now,
            preview: "Conversation started",
            history: [],
          },
          ...prev,
        ];
      });
    },
    []
  );

  const acceptRequest = useCallback(
    (id: string) => {
      setRequests((prev) => {
        const request = prev.find((item) => item.id === id);
        if (!request) return prev;
        const appointmentId = `appt-${Date.now()}`;
        setUpcomingAppointments((current) => [
          {
            id: appointmentId,
            patient: request.name,
            age: request.age,
            type: request.type,
            schedule: request.schedule,
            preferredLocation: request.preferredLocation,
            conversationId: request.id,
          },
          ...current,
        ]);
        ensureConversation({ id: request.id, name: request.name });
        return prev.filter((item) => item.id !== id);
      });
    },
    [ensureConversation]
  );

  const rejectRequest = useCallback((id: string) => {
    setRequests((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const appendMessage = useCallback((conversationId: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => {
      const exists = prev.find((conversation) => conversation.id === conversationId);
      if (!exists) {
        return prev;
      }
      const now = new Date().toISOString();
      return prev.map((conversation) => {
        if (conversation.id !== conversationId) return conversation;
        return {
          ...conversation,
          lastUpdated: now,
          preview: trimmed,
          history: [
            ...conversation.history,
            { author: "provider", text: trimmed, at: now },
          ],
        };
      });
    });
  }, []);

  const reset = useCallback(() => {
    setRequests(initialRequests);
    setUpcomingAppointments([]);
    setMessages([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const cancelAppointment = useCallback((id: string) => {
    setUpcomingAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id)
    );
  }, []);

  const value = useMemo(
    () => ({
      requests,
      upcomingAppointments,
      messages,
      acceptRequest,
      rejectRequest,
      appendMessage,
      ensureConversation,
      cancelAppointment,
      reset,
    }),
    [
      requests,
      upcomingAppointments,
      messages,
      acceptRequest,
      rejectRequest,
      appendMessage,
      ensureConversation,
      cancelAppointment,
      reset,
    ]
  );

  return (
    <CareProviderExperienceContext.Provider value={value}>
      {children}
    </CareProviderExperienceContext.Provider>
  );
}

export function useCareProviderExperience() {
  const context = useContext(CareProviderExperienceContext);
  if (!context) {
    throw new Error(
      "useCareProviderExperience must be used within CareProviderExperienceProvider"
    );
  }
  return context;
}
