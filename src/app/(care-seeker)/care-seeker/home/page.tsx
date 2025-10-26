"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCareSeekerExperience } from "../../../../hooks/use-care-seeker-experience";
import { useAuthSession } from "../../../../hooks/use-auth-session";

const quickActions = [
  {
    key: "mental" as const,
    title: "Mental Health\nCare",
    subtitle: "Talk to a therapist",
    icon: "/mental-icon.svg",
  },
  {
    key: "hospital" as const,
    title: "Hospital Aid",
    subtitle: "Book a checkup",
    icon: "/hospital-icon.svg",
  },
];

export default function CareSeekerHome() {
  const router = useRouter();
  const { appointments } = useCareSeekerExperience();
  const { profile } = useAuthSession();

  const upcomingAppointments = appointments.filter(
    (appt) => appt.status === "upcoming"
  );

  const greetingName =
    profile?.firstName?.trim() ||
    profile?.lastName?.trim() ||
    "there";

  return (
    <div className="flex flex-col gap-8 pb-8">
      <header>
        <div className="flex items-center gap-3">
          <Image
            src="/care-seeker.png"
            alt="Care seeker avatar"
            width={48}
            height={48}
            className="rounded-full object-cover"
            priority
          />
          <div>
            <p className="text-sm text-[#52c340]">Hi {greetingName}</p>
            <p className="text-sm text-white/70">How are you today?</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {quickActions.map((item) => (
            <button
              key={item.key}
              className="flex flex-col items-center gap-3 rounded-[22px] bg-white px-4 py-5 text-center text-black shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition duration-200 active:scale-[0.98]"
              onClick={() =>
                router.push(`/care-seeker/providers?module=${item.key}`)
              }
            >
              <span
                aria-hidden
                className="flex h-12 w-12 items-center justify-center "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  className="text-[#52c340]"
                >
                  {item.key === "mental" ? (
                    <path
                      d="M14.6667 18.6665C12.8986 18.6665 11.2029 17.9641 9.95262 16.7139C8.70238 15.4636 8 13.7679 8 11.9998V6.6665C8 6.31288 8.14048 5.97374 8.39053 5.7237C8.64058 5.47365 8.97971 5.33317 9.33334 5.33317H10.6667C11.0203 5.33317 11.3594 5.19269 11.6095 4.94265C11.8595 4.6926 12 4.35346 12 3.99984C12 3.64622 11.8595 3.30708 11.6095 3.05703C11.3594 2.80698 11.0203 2.6665 10.6667 2.6665H9.33334C8.27247 2.6665 7.25505 3.08793 6.50491 3.83808C5.75476 4.58822 5.33334 5.60564 5.33334 6.6665V11.9998C5.33505 13.5062 5.70237 14.9895 6.40374 16.3226C7.10511 17.6557 8.11957 18.7986 9.36 19.6532C10.553 20.7029 11.5203 21.9839 12.2033 23.4187C12.8863 24.8535 13.2708 26.412 13.3333 27.9998C13.3333 30.4752 14.3167 32.8492 16.067 34.5995C17.8173 36.3498 20.1913 37.3332 22.6667 37.3332C25.142 37.3332 27.516 36.3498 29.2663 34.5995C31.0167 32.8492 32 30.4752 32 27.9998V26.4798C33.2569 26.1553 34.3523 25.3835 35.0808 24.3092C35.8094 23.2348 36.1211 21.9316 35.9575 20.6438C35.7939 19.3561 35.1663 18.1722 34.1923 17.3141C33.2183 16.456 31.9648 15.9825 30.6667 15.9825C29.3686 15.9825 28.115 16.456 27.141 17.3141C26.167 18.1722 25.5394 19.3561 25.3758 20.6438C25.2123 21.9316 25.524 23.2348 26.2525 24.3092C26.9811 25.3835 28.0765 26.1553 29.3333 26.4798V27.9998C29.3333 29.7679 28.631 31.4636 27.3807 32.7139C26.1305 33.9641 24.4348 34.6665 22.6667 34.6665C20.8986 34.6665 19.2029 33.9641 17.9526 32.7139C16.7024 31.4636 16 29.7679 16 27.9998C16.066 26.4101 16.4546 24.8503 17.1422 23.4154C17.8299 21.9805 18.8022 20.7005 20 19.6532C21.2355 18.7956 22.2448 17.6514 22.9414 16.3185C23.638 14.9856 24.0013 13.5038 24 11.9998V6.6665C24 5.60564 23.5786 4.58822 22.8284 3.83808C22.0783 3.08793 21.0609 2.6665 20 2.6665H18.6667C18.313 2.6665 17.9739 2.80698 17.7239 3.05703C17.4738 3.30708 17.3333 3.64622 17.3333 3.99984C17.3333 4.35346 17.4738 4.6926 17.7239 4.94265C17.9739 5.19269 18.313 5.33317 18.6667 5.33317H20C20.3536 5.33317 20.6928 5.47365 20.9428 5.7237C21.1929 5.97374 21.3333 6.31288 21.3333 6.6665V11.9998C21.3333 12.8753 21.1609 13.7422 20.8259 14.5511C20.4908 15.3599 19.9998 16.0948 19.3807 16.7139C18.7617 17.3329 18.0267 17.824 17.2179 18.159C16.4091 18.4941 15.5421 18.6665 14.6667 18.6665ZM30.6667 23.9998C29.9594 23.9998 29.2811 23.7189 28.7811 23.2188C28.281 22.7187 28 22.0404 28 21.3332C28 20.6259 28.281 19.9476 28.7811 19.4476C29.2811 18.9475 29.9594 18.6665 30.6667 18.6665C31.3739 18.6665 32.0522 18.9475 32.5523 19.4476C33.0524 19.9476 33.3333 20.6259 33.3333 21.3332C33.3333 22.0404 33.0524 22.7187 32.5523 23.2188C32.0522 23.7189 31.3739 23.9998 30.6667 23.9998Z"
                      fill="#52C340"
                    />
                  ) : (
                    <path
                      d="M38.75 32.5H37.5V20C37.5 19.337 37.2366 18.7011 36.7678 18.2322C36.2989 17.7634 35.663 17.5 35 17.5H26.25V7.5C26.25 6.83696 25.9866 6.20107 25.5178 5.73223C25.0489 5.26339 24.413 5 23.75 5H8.75C8.08696 5 7.45107 5.26339 6.98223 5.73223C6.51339 6.20107 6.25 6.83696 6.25 7.5V32.5H5C4.66848 32.5 4.35054 32.6317 4.11612 32.8661C3.8817 33.1005 3.75 33.4185 3.75 33.75C3.75 34.0815 3.8817 34.3995 4.11612 34.6339C4.35054 34.8683 4.66848 35 5 35H38.75C39.0815 35 39.3995 34.8683 39.6339 34.6339C39.8683 34.3995 40 34.0815 40 33.75C40 33.4185 39.8683 33.1005 39.6339 32.8661C39.3995 32.6317 39.0815 32.5 38.75 32.5ZM20 32.5H12.5V25H20V32.5ZM20 16.25H17.5V18.75C17.5 19.0815 17.3683 19.3995 17.1339 19.6339C16.8995 19.8683 16.5815 20 16.25 20C15.9185 20 15.6005 19.8683 15.3661 19.6339C15.1317 19.3995 15 19.0815 15 18.75V16.25H12.5C12.1685 16.25 11.8505 16.1183 11.6161 15.8839C11.3817 15.6495 11.25 15.3315 11.25 15C11.25 14.6685 11.3817 14.3505 11.6161 14.1161C11.8505 13.8817 12.1685 13.75 12.5 13.75H15V11.25C15 10.9185 15.1317 10.6005 15.3661 10.3661C15.6005 10.1317 15.9185 10 16.25 10C16.5815 10 16.8995 10.1317 17.1339 10.3661C17.3683 10.6005 17.5 10.9185 17.5 11.25V13.75H20C20.3315 13.75 20.6495 13.8817 20.8839 14.1161C21.1183 14.3505 21.25 14.6685 21.25 15C21.25 15.3315 21.1183 15.6495 20.8839 15.8839C20.6495 16.1183 20.3315 16.25 20 16.25ZM35 32.5H26.25V20H35V32.5Z"
                      fill="#52C340"
                    />
                  )}
                </svg>
              </span>
              <p
                className="whitespace-pre-line text-center text-base font-semibold text-black"
                style={{
                  fontWeight: 400,
                }}
              >
                {item.title}
              </p>
            </button>
          ))}
        </div>
      </header>

      <section>
        <h2 className="text-lg font-semibold text-white">
          Upcoming Appointments
        </h2>
        <div className="mt-4 space-y-3">
          {upcomingAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 py-8 text-center text-white/60">
              <Image
                src="/calendar.svg"
                alt="Calendar illustration"
                width={96}
                height={96}
                className="mb-3 opacity-80"
              />
              <p>No Upcoming Appointments</p>
            </div>
          ) : (
            upcomingAppointments.map((appointment) => (
              <button
                key={appointment.id}
                onClick={() =>
                  router.push(`/care-seeker/appointments/${appointment.id}`)
                }
                className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-[#111111] px-4 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src="/care-provider.png"
                    alt={appointment.doctorName}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{appointment.doctorName}</p>
                    <p className="text-sm text-white/60">
                      {appointment.specialty}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm font-semibold text-[#52c340]">
                  <p>
                    {new Date(appointment.date).toLocaleDateString("en-GB")}
                  </p>
                  <p>{appointment.time}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
