"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TicketPercent,
  FileStack,
  Bookmark,
  GraduationCap,
  Headset,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SmartEnquiryModal } from "@/components/college/SmartEnquiryModal";
import { useAppStore } from "@/store/useAppStore";

const navItems = [
  { title: "Overview", href: "/student/dashboard", icon: LayoutDashboard },
  { title: "My Vouchers", href: "/student/vouchers", icon: TicketPercent },
  { title: "My Applications", href: "/student/applications", icon: FileStack },
  { title: "Saved Colleges", href: "/student/saved-colleges", icon: Bookmark },
  { title: "Scholarship Checker", href: "/scholarship", icon: GraduationCap },
];

interface StudentSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function StudentSidebar({ open, onToggle }: StudentSidebarProps) {
  const pathname = usePathname();
  const [enquiryOpen, setEnquiryOpen] = React.useState(false);
  const defaultCollege = useAppStore((s) => s.colleges.find((college) => college.id === "myra") ?? s.colleges[0]);
  const authUser = useAppStore((s) => s.authUser);
  const questionnaire = useAppStore((s) => s.questionnaire);
  const profile = useAppStore((s) => s.studentProfile);

  const displayName = authUser?.name ?? profile.name;
  const initial = displayName.charAt(0).toUpperCase();
  const stream = questionnaire?.stream ?? profile.stream;
  const score = questionnaire?.scoreBand ?? profile.scoreBand;

  return (
    <aside
      className="relative flex h-full shrink-0 flex-col overflow-hidden bg-brand-950 text-white transition-all duration-300 ease-in-out"
      style={{ width: open ? 256 : 0 }}
    >
      <div className="flex h-full w-64 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/student/dashboard" className="flex items-center gap-2" aria-label="Orion Student Portal">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg shadow-gold-500/20">
              <GraduationCap className="h-4 w-4 text-brand-950" strokeWidth={1.5} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold">Orion <span className="text-gold-400">Student</span></p>
              <p className="text-[10px] text-white/50">My Dashboard</p>
            </div>
          </Link>
          <button
            onClick={onToggle}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          >
            {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">My Journey</p>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-gold-500 text-brand-950 shadow-md shadow-gold-500/20" : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", active ? "text-brand-950" : "text-gold-400")} strokeWidth={1.5} />
                {item.title}
              </Link>
            );
          })}

          <div className="my-4 h-px bg-white/10" />

          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">Actions</p>
          <button
            onClick={() => setEnquiryOpen(true)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Headset className="h-5 w-5 shrink-0 text-gold-400" strokeWidth={1.5} />
            Book Counselling
          </button>

          <div className="my-4 h-px bg-white/10" />

          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">Quick Links</p>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Headset className="h-5 w-5 shrink-0 text-gold-400" strokeWidth={1.5} />
            Back to College Finder
          </Link>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-sm font-bold text-brand-950">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{displayName}</p>
              <p className="text-xs text-gold-400">{stream || "Not set"} {score ? `• ${score}` : ""}</p>
            </div>
          </div>
        </div>
      </div>

      {defaultCollege && (
        <SmartEnquiryModal college={defaultCollege} open={enquiryOpen} onOpenChange={setEnquiryOpen} />
      )}
    </aside>
  );
}
