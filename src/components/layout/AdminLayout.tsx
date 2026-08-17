"use client";

import * as React from "react";
import { Suspense } from "react";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { ZoneSwitcher } from "@/components/layout/ZoneSwitcher";
import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={null}>
        <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />
      </Suspense>
      <main
        className={cn(
          "p-6 transition-[margin-left] duration-300 ease-in-out lg:p-8",
          sidebarOpen ? "lg:ml-64" : "lg:ml-[88px]"
        )}
      >
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
      <ZoneSwitcher />
    </div>
  );
}
