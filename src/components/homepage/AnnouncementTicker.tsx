"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Phone, Sparkles } from "lucide-react";

const announcements = [
  {
    icon: GraduationCap,
    text: "Admissions Open 2027 — Apply to top MBA & PGDM colleges across India",
    href: "/#colleges",
    cta: "Explore colleges",
  },
  {
    icon: Sparkles,
    text: "Scholarships up to ₹30,000 on MBA & PGDM — check your eligibility in 30 seconds",
    href: "/scholarship",
    cta: "Check eligibility",
  },
  {
    icon: Phone,
    text: "Get a free counsellor call-back within minutes — personalised guidance, zero cost",
    href: "/#why-orion",
    cta: "Learn more",
  },
];

export function AnnouncementTicker() {
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => setActive((i) => (i + 1) % announcements.length), 4500);
    return () => clearInterval(timer);
  }, []);

  const item = announcements[active];
  const Icon = item.icon;

  return (
    <div className="relative z-20 overflow-hidden border-b border-brand-800 bg-brand-950">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center sm:px-6 lg:px-8">
        <Icon className="h-3.5 w-3.5 shrink-0 text-gold-400" strokeWidth={2} />
        <span className="relative h-6 w-full overflow-hidden">
          {announcements.map((a, i) => (
            <span
              key={a.text}
              className={`absolute inset-0 flex items-center justify-center gap-2 px-1 text-xs font-medium transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                i === active
                  ? "translate-y-0 opacity-100"
                  : i < active
                    ? "-translate-y-full opacity-0"
                    : "translate-y-full opacity-0"
              }`}
            >
              <span className="min-w-0 truncate text-white/90">{a.text}</span>
              <Link
                href={a.href}
                className="shrink-0 whitespace-nowrap font-semibold text-gold-400 underline-offset-2 hover:underline"
              >
                {a.cta} →
              </Link>
            </span>
          ))}
        </span>
        <div className="hidden shrink-0 gap-1 sm:flex">
          {announcements.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Announcement ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-4 bg-gold-500" : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
