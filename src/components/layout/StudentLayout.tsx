"use client";

import * as React from "react";
import { Suspense } from "react";
import { StudentSidebar } from "./StudentSidebar";
import { AgentHeader } from "./AgentHeader";
import { useAppStore } from "@/store/useAppStore";

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const hydrateAuth = useAppStore((s) => s.hydrateAuth);
  const hydrateQuestionnaire = useAppStore((s) => s.hydrateQuestionnaire);

  React.useEffect(() => {
    hydrateAuth().then(() => hydrateQuestionnaire());
  }, [hydrateAuth, hydrateQuestionnaire]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-surface-50">
      <Suspense fallback={null}>
        <StudentSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((open) => !open)} />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <AgentHeader
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          title="Student Portal"
          subtitle="Track your scholarships, applications and counselling journey"
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
