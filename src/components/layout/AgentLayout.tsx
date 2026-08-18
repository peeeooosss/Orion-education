"use client";

import * as React from "react";
import { Suspense } from "react";
import { AgentSidebar } from "./AgentSidebar";
import { AgentHeader } from "./AgentHeader";
import { useAppStore } from "@/store/useAppStore";

export function AgentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const hydrateAuth = useAppStore((s) => s.hydrateAuth);

  React.useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      <Suspense fallback={null}>
        <AgentSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((p) => !p)} />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col transition-all duration-300">
        <AgentHeader onToggleSidebar={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
