"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Headset, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const zones = [
  { label: "Student", href: "/", icon: GraduationCap, match: ["/", "/college", "/student"] },
  { label: "Agent", href: "/agent/dashboard", icon: Headset, match: ["/agent"] },
  { label: "Admin", href: "/admin/dashboard", icon: ShieldCheck, match: ["/admin"] },
];

export function ZoneSwitcher() {
  const pathname = usePathname();

  const activeZone = (match: string[]) =>
    match.some((m) => (m === "/" ? pathname === "/" : pathname.startsWith(m)));

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-1 rounded-full border border-white/10 bg-brand-950/90 p-1.5 shadow-2xl shadow-brand-950/40 backdrop-blur-md">
      {zones.map((zone) => {
        const active = activeZone(zone.match);
        return (
          <Link
            key={zone.label}
            href={zone.href}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition-all",
              active
                ? "bg-gold-500 text-brand-950 shadow-md shadow-gold-500/30"
                : "text-surface-300 hover:bg-white/10 hover:text-surface-100"
            )}
            aria-current={active ? "page" : undefined}
          >
            <zone.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{zone.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
