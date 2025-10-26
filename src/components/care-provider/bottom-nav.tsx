"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarCheck2,
  Home,
  MessageSquare,
  UserRound,
} from "lucide-react";

const navItems = [
  { href: "/care-provider/home", label: "Home", icon: Home },
  { href: "/care-provider/messages", label: "Messages", icon: MessageSquare },
  { href: "/care-provider/appointments", label: "Appointments", icon: CalendarCheck2 },
  { href: "/care-provider/profile", label: "Profile", icon: UserRound },
];

export default function CareProviderBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-auto absolute bottom-5 left-1/2 z-30 w-[90%] max-w-sm -translate-x-1/2 rounded-4xl bg-[#022629] px-4 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
      <ul className="flex items-center justify-between text-xs font-semibold text-white/70">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  "flex items-center rounded-2xl transition",
                  isActive
                    ? "gap-2 bg-[#52c340] px-4 py-2 text-black"
                    : "gap-0 px-2 py-2 text-white/70",
                ].join(" ")}
              >
                <Icon
                  size={20}
                  className={isActive ? "text-black" : "text-white"}
                />
                {isActive && <span>{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
