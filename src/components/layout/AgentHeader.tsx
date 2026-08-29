"use client";

import * as React from "react";
import { PanelLeftClose, BellRing, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";

export function AgentHeader({
  onToggleSidebar,
  title = "Telecaller CRM",
  subtitle = "Incoming leads update the second a student submits",
}: {
  onToggleSidebar: () => void;
  title?: string;
  subtitle?: string;
}) {
  const signOut = useAppStore((s) => s.signOut);
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm">
      <button
        onClick={onToggleSidebar}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition-colors hover:bg-slate-100"
        aria-label="Toggle sidebar"
      >
        <PanelLeftClose className="h-5 w-5" strokeWidth={1.5} />
      </button>

      <div className="flex flex-1 items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-brand-950">{title}</h1>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-50 text-green-700 ring-green-600/10">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            Live
          </Badge>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100" aria-label="Notifications">
            <BellRing className="h-5 w-5" strokeWidth={1.5} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
          </button>
          <button
            onClick={async () => { await signOut(); router.push("/auth/sign-in/agent"); }}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
