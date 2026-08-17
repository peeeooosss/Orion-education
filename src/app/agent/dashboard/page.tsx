"use client";

import * as React from "react";
import { Suspense } from "react";
import { LeadsBoard } from "@/components/agent/LeadsBoard";

export default function AgentDashboardPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading leads...</p>}>
      <LeadsBoard />
    </Suspense>
  );
}
