"use client";

import { LEAD_STATUSES, isConverted } from "@/lib/scholarship";
import { useAppStore } from "@/store/useAppStore";

const STAGE_COLORS = [
  { stage: "Docs Pending", cls: "bg-slate-200 text-slate-700" },
  { stage: "Submitted", cls: "bg-blue-100 text-blue-700" },
  { stage: "Offer Received", cls: "bg-gold-100 text-gold-700" },
  { stage: "Admitted", cls: "bg-green-100 text-green-700" },
];

export function PipelineWidget() {
  const leads = useAppStore((s) => s.leads);
  const applications = useAppStore((s) => s.applications);

  const total = leads.length;
  const counts = LEAD_STATUSES.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }));
  const converted = leads.filter((l) => isConverted(l.status)).length;
  const conversionPct = total ? Math.round((converted / total) * 100) : 0;

  return (
    <div className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-bold text-surface-900">Pipeline today</h2>
          <p className="text-sm text-surface-600">
            Live from the demo store — every enquiry Orion handles, from New to Admitted.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-display text-2xl font-black text-gold-700">{conversionPct}%</p>
            <p className="text-[10px] text-surface-500">converted to application+</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-surface-100">
        {counts.map(({ status, count }) => (
          <div
            key={status}
            className={statusColor(status)}
            style={{ width: `${total ? (count / total) * 100 : 0}%` }}
            title={`${status}: ${count}`}
          />
        ))}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-5">
        {counts.map(({ status, count }) => (
          <div key={status} className="rounded-xl border border-surface-100 bg-surface-50 px-3 py-2">
            <p className="font-display text-lg font-bold text-surface-900">{count}</p>
            <p className="text-[11px] text-surface-500">{status}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-surface-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Applications in flight</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {STAGE_COLORS.map(({ stage, cls }) => {
            const n = applications.filter((a) => a.stage === stage).length;
            return (
              <span key={stage} className={`rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>
                {stage}: {n}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function statusColor(status: (typeof LEAD_STATUSES)[number]): string {
  switch (status) {
    case "New":
      return "bg-surface-400";
    case "Contacted":
      return "bg-blue-400";
    case "Application Started":
      return "bg-gold-500";
    case "Offer Received":
      return "bg-gold-600";
    case "Admitted":
      return "bg-green-500";
  }
}
