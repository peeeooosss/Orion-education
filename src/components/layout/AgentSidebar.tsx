"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, Flame, PhoneCall, FileCheck2, ArrowLeft, Headset, ChevronLeft, ChevronRight, FileStack, Building2, BookOpen, Database, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";

const leadNavItems = [
  { title: "Telecaller Dashboard", href: "/agent/dashboard", icon: LayoutDashboard },
  { title: "New Leads", href: "/agent/dashboard?filter=new", icon: PhoneCall },
  { title: "Hot Leads", href: "/agent/dashboard?filter=hot", icon: Flame },
  { title: "Follow-ups", href: "/agent/follow-ups", icon: FileCheck2 },
];

const knowledgeNavItems = [
  { title: "Imported Students", href: "/agent/raw-data", icon: Database },
  { title: "Applications", href: "/agent/applications", icon: FileStack },
  { title: "University Directory", href: "/agent/universities", icon: Building2 },
  { title: "Program List", href: "/agent/programs", icon: BookOpen },
];

interface AgentSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export function AgentSidebar({ open, onToggle }: AgentSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authUser = useAppStore((s) => s.authUser);
  const signOut = useAppStore((s) => s.signOut);
  const router = useRouter();

  const filter = searchParams.get("filter");
  const agentName = authUser?.name || "Agent";
  const agentInitial = agentName.charAt(0).toUpperCase();

  const isActive = (href: string) => {
    if (href.includes("?")) {
      const f = href.split("filter=")[1];
      return pathname.startsWith("/agent/dashboard") && filter === f;
    }
    if (href === "/agent/follow-ups") {
      return pathname === "/agent/follow-ups";
    }
    return pathname === href && !filter;
  };

  return (
    <aside
      className="relative flex h-full shrink-0 flex-col overflow-hidden bg-brand-950 text-white transition-all duration-300 ease-in-out"
      style={{ width: open ? 256 : 0 }}
    >
      <div className="flex h-full w-64 flex-col">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link href="/agent/dashboard" className="flex items-center gap-2" aria-label="Orion Agent Portal">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 shadow-lg shadow-gold-500/20">
              <Headset className="h-4 w-4 text-brand-950" strokeWidth={1.5} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold">Orion <span className="text-gold-400">CRM</span></p>
              <p className="text-[10px] text-white/50">Telecaller Zone</p>
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
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">Pipeline</p>
          {leadNavItems.map((item) => {
            const active = isActive(item.href);
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

          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">Everything in one place</p>
          {knowledgeNavItems.map((item) => {
            const active = isActive(item.href);
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

          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-gold-400" strokeWidth={1.5} />
            Back to Student Site
          </Link>
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-500 text-brand-950 text-xs font-bold">
              {agentInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{agentName}</p>
              <p className="text-xs text-gold-400">Telecaller · On call</p>
            </div>
            <button
              onClick={async () => { await signOut(); router.push("/auth/sign-in"); }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-red-500/20 hover:text-red-400"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
