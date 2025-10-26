"use client";

import Link from "next/link";
import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  CalendarCheck2,
  Home,
  MessageSquare,
  UserRound,
} from "lucide-react";

const navItems = [
  { href: "/care-seeker/home", label: "Home", icon: Home },
  { href: "/care-seeker/messages", label: "Messages", icon: MessageSquare },
  { href: "/care-seeker/appointments", label: "Appointments", icon: CalendarCheck2 },
  { href: "/care-seeker/profile", label: "Profile", icon: UserRound },
];

export default function CareSeekerBottomNav() {
  return (
    <Suspense fallback={<BottomNavShell />}>
      <BottomNavContent />
    </Suspense>
  );
}

function BottomNavContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const moduleParam = searchParams.get("module");
  const homeShouldBeActive =
    pathname === "/care-seeker/providers" &&
    (moduleParam === "mental" || moduleParam === "hospital");

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-sm rounded-4xl bg-[#022629] px-4 py-2 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
        <ul className="flex items-center justify-between text-xs font-semibold text-white/70">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/care-seeker/home"
                ? homeShouldBeActive ||
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
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
      </div>
    </nav>
  );
}

function BottomNavShell() {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-sm rounded-4xl bg-[#022629] px-4 py-2 opacity-70 shadow-[0_12px_40px_rgba(0,0,0,0.55)]" />
    </nav>
  );
}
