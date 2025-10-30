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
import { createClient } from "../utils/supabase/client";
import { useAuthSession } from "./use-auth-session";

interface ProviderRequest {
  id: string;
  seeker_id: string;
  provider_id: string;
  doctor_name: string;
  specialty: string;
  module: string;
  appointment_date: string;
  appointment_time: string;
  location_type: "home" | "clinic";
  location: string;
  status: "pending" | "accepted" | "rejected";
  seeker_name?: string;
  seeker_age?: number;
  seeker_summary?: string;
  name?: string;
  age?: number;
  summary?: string;
  schedule?: string;
  type?: string;
  preferredLocation?: "home" | "clinic";
}

interface ProviderAppointment {
  id: string;
  seeker_id: string;
  provider_id: string;
  doctor_name: string;
  specialty: string;
  module: string;
  appointment_date: string;
  appointment_time: string;
  location_type: "home" | "clinic";
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  seeker_name?: string;
  seeker_age?: number;
  patient?: string;
  age?: number;
  type?: string;
  schedule?: string;
  preferredLocation?: "home" | "clinic";
  conversationId?: string;
}

interface ProviderMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  author: "user" | "doctor";
  text: string;
  at: string;
  seeker_name?: string;
  seeker_avatar?: string;
}

interface CareProviderExperienceValue {
  requests: ProviderRequest[];
  upcomingAppointments: ProviderAppointment[];
  messages: ProviderMessage[];
  acceptRequest: (id: string) => Promise<void>;
  rejectRequest: (id: string) => Promise<void>;
  appendMessage: (conversationId: string, text: string) => Promise<void>;
  ensureConversation: (request: {
    id: string;
    name: string;
    avatar?: string;
  }) => void;
  cancelAppointment: (id: string) => Promise<void>;
  reset: () => void;
}

const CareProviderExperienceContext =
  createContext<CareProviderExperienceValue | undefined>(undefined);

export function CareProviderExperienceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuthSession();
  const [requests, setRequests] = useState<ProviderRequest[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    ProviderAppointment[]
  >([]);
  const [messages, setMessages] = useState<ProviderMessage[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (user) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("appointments")
          .select(`
            *,
            seeker:profiles!seeker_id(first_name, last_name, dob)
          `)
          .eq("provider_id", user.id)
          .eq("status", "pending");

        if (error) {
          console.error("Error fetching requests:", error);
        } else {
          const formattedRequests: ProviderRequest[] = (data?.map((req) => {
            const request = req as {
              id: string;
              seeker_id: string;
              provider_id: string;
              doctor_name: string;
              specialty: string;
              module: string;
              appointment_date: string;
              appointment_time: string;
              location_type: "home" | "clinic";
              location: string;
              status: "pending" | "accepted" | "rejected";
              seeker?: { first_name?: string; last_name?: string; dob?: string };
            };
            return {
              ...request,
              seeker_name: `${request.seeker?.first_name || ""} ${request.seeker?.last_name || ""}`.trim(),
              seeker_age: request.seeker?.dob ? new Date().getFullYear() - new Date(request.seeker.dob).getFullYear() : undefined,
              seeker_summary: "Appointment request",
              name: `${request.seeker?.first_name || ""} ${request.seeker?.last_name || ""}`.trim(),
              age: request.seeker?.dob ? new Date().getFullYear() - new Date(request.seeker.dob).getFullYear() : undefined,
              summary: "Appointment request",
              schedule: `${request.appointment_date} • ${request.appointment_time}`,
              type: request.module,
              preferredLocation: request.location_type,
            } as ProviderRequest;
          }) || []) as ProviderRequest[];
          setRequests(formattedRequests);
        }
      }
    };

    const fetchAppointments = async () => {
      if (user) {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("appointments")
          .select(`
            *,
            seeker:profiles!seeker_id(first_name, last_name, dob)
          `)
          .eq("provider_id", user.id)
          .eq("status", "upcoming");

        if (error) {
          console.error("Error fetching appointments:", error);
        } else {
          const formattedAppointments: ProviderAppointment[] = (data?.map((appt) => {
            const appointment = appt as {
              id: string;
              seeker_id: string;
              provider_id: string;
              doctor_name: string;
              specialty: string;
              module: string;
              appointment_date: string;
              appointment_time: string;
              location_type: "home" | "clinic";
              location: string;
              status: "upcoming" | "completed" | "cancelled";
              seeker?: { first_name?: string; last_name?: string; dob?: string };
            };
            return {
              ...appointment,
              seeker_name: `${appointment.seeker?.first_name || ""} ${appointment.seeker?.last_name || ""}`.trim(),
              seeker_age: appointment.seeker?.dob ? new Date().getFullYear() - new Date(appointment.seeker.dob).getFullYear() : undefined,
              patient: `${appointment.seeker?.first_name || ""} ${appointment.seeker?.last_name || ""}`.trim(),
              age: appointment.seeker?.dob ? new Date().getFullYear() - new Date(appointment.seeker.dob).getFullYear() : undefined,
              type: appointment.module,
              schedule: `${appointment.appointment_date} • ${appointment.appointment_time}`,
              preferredLocation: appointment.location_type,
              conversationId: appointment.id,
            } as ProviderAppointment;
          }) || []) as ProviderAppointment[];
          setUpcomingAppointments(formattedAppointments);
        }
      }
    };

    const fetchMessages = async () => {
      if (user) {
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
          );

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
              seeker_name: `${message.sender?.first_name || ""} ${message.sender?.last_name || ""}`.trim(),
              seeker_avatar: message.sender?.avatar_url || "/care-seeker.png",
            };
          }) || [];
          setMessages(formattedMessages);
        }
      }
    };

    fetchRequests();
    fetchAppointments();
    fetchMessages();
  }, [user]);

  const ensureConversation = useCallback(
    ({ id }: { id: string; name: string; avatar?: string }) => {
      setMessages((prev) => {
        const exists = prev.find((c) => c.conversation_id === id);
        return exists ? prev : prev;
      });
    },
    []
  );

  const acceptRequest = useCallback(
    async (id: string) => {
      if (user) {
        const supabase = createClient();
        const { error } = await supabase
          .from("appointments")
          .update({ status: "upcoming" })
          .eq("id", id)
          .eq("provider_id", user.id);

        if (error) {
          console.error("Error accepting request:", error);
        } else {
          setRequests((prev) => prev.filter((item) => item.id !== id));
          // Refresh appointments
          const { data } = await supabase
            .from("appointments")
            .select(`
              *,
              seeker:profiles!seeker_id(first_name, last_name, dob)
            `)
            .eq("provider_id", user.id)
            .eq("status", "upcoming");

          if (data) {
            const formattedAppointments: ProviderAppointment[] = data.map((appt) => {
              const appointment = appt as {
                id: string;
                seeker_id: string;
                provider_id: string;
                doctor_name: string;
                specialty: string;
                module: string;
                appointment_date: string;
                appointment_time: string;
                location_type: "home" | "clinic";
                location: string;
                status: "upcoming" | "completed" | "cancelled" | string;
                seeker?: {
                  first_name?: string;
                  last_name?: string;
                  dob?: string;
                };
              };
              return {
                ...appointment,
                // coerce status into union (expected upcoming after accept)
                status: (appointment.status === "completed" || appointment.status === "cancelled") ? appointment.status : "upcoming",
                seeker_name: `${appointment.seeker?.first_name || ""} ${appointment.seeker?.last_name || ""}`.trim(),
                seeker_age: appointment.seeker?.dob ? new Date().getFullYear() - new Date(appointment.seeker.dob).getFullYear() : undefined,
                patient: `${appointment.seeker?.first_name || ""} ${appointment.seeker?.last_name || ""}`.trim(),
                age: appointment.seeker?.dob ? new Date().getFullYear() - new Date(appointment.seeker.dob).getFullYear() : undefined,
                type: appointment.module,
                schedule: `${appointment.appointment_date} • ${appointment.appointment_time}`,
                preferredLocation: appointment.location_type,
                conversationId: appointment.id,
              } as ProviderAppointment;
            });
            setUpcomingAppointments(formattedAppointments);
          }
        }
      }
    },
    [user]
  );

  const rejectRequest = useCallback(
    async (id: string) => {
      if (user) {
        const supabase = createClient();
        const { error } = await supabase
          .from("appointments")
          .update({ status: "rejected" })
          .eq("id", id)
          .eq("provider_id", user.id);

        if (error) {
          console.error("Error rejecting request:", error);
        } else {
          setRequests((prev) => prev.filter((item) => item.id !== id));
        }
      }
    },
    [user]
  );

  const appendMessage = useCallback(
    async (conversationId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !user) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: conversationId,
            text: trimmed,
            sender_id: user.id,
            author: "doctor",
          },
        ])
        .select();

      if (error) {
        console.error("Error sending message:", error);
      } else if (data) {
        setMessages((prev) => [...prev, data[0] as ProviderMessage]);
      }
    },
    [user]
  );

  const cancelAppointment = useCallback(
    async (id: string) => {
      if (user) {
        const supabase = createClient();
        const { error } = await supabase
          .from("appointments")
          .update({ status: "cancelled" })
          .eq("id", id)
          .eq("provider_id", user.id);

        if (error) {
          console.error("Error cancelling appointment:", error);
        } else {
          setUpcomingAppointments((prev) =>
            prev.filter((appointment) => appointment.id !== id)
          );
        }
      }
    },
    [user]
  );

  const reset = useCallback(() => {
    setRequests([]);
    setUpcomingAppointments([]);
    setMessages([]);
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
