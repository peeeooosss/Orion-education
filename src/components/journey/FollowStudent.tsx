"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, GraduationCap, UserRound } from "lucide-react";
import { LEAD_STATUSES } from "@/lib/scholarship";
import { useAppStore, formatINR } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import type { Lead } from "@/store/types";

const STATUS_STEPS: Record<Lead["status"], number> = {
  New: 4,
  Contacted: 5,
  "Application Started": 6,
  "Offer Received": 7,
  Admitted: 8,
};

interface Persona {
  key: string;
  name: string;
  role: string;
  completed: number;
  lead?: Lead;
}

export function FollowStudent() {
  const leads = useAppStore((s) => s.leads);
  const applications = useAppStore((s) => s.applications);
  const profile = useAppStore((s) => s.studentProfile);
  const vouchers = useAppStore((s) => s.vouchers);

  const personas: Persona[] = React.useMemo(() => {
    const reps: Persona[] = [];
    for (const status of LEAD_STATUSES) {
      const lead = leads.find((l) => l.status === status);
      if (lead) {
        reps.push({ key: lead.id, name: lead.name, role: status, completed: STATUS_STEPS[status], lead });
      }
    }
    const profileVouchers = vouchers.filter((v) => v.phone === profile.phone);
    if (profileVouchers.length > 0) {
      reps.unshift({ key: "profile", name: profile.name, role: "Just checking eligibility", completed: 3 });
    }
    return reps;
  }, [leads, vouchers, profile]);

  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  const selected = personas.find((p) => p.key === selectedKey) ?? personas[Math.min(2, personas.length - 1)];

  const app = selected?.lead ? applications.find((a) => a.leadId === selected.lead!.id) : undefined;
  const docsDone = app ? app.docs.filter((d) => d.done).length : 0;
  const docsRequired = app ? app.docs.filter((d) => d.required).length : 0;

  if (personas.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-surface-300 bg-white p-10 text-center text-sm text-surface-500">
        No example students in the store yet — submit an enquiry to see a journey here.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-bold text-surface-900">Follow a student</h2>
          <p className="text-sm text-surface-600">
            Pick a demo student and watch their journey light up through the pipeline.
          </p>
        </div>
        <select
          value={selected?.key ?? ""}
          onChange={(e) => setSelectedKey(e.target.value)}
          className="h-10 w-full rounded-2xl border border-surface-200 bg-white px-3 text-sm font-medium text-surface-900 focus:border-gold-500 outline-none focus:ring-2 focus:ring-gold-200 sm:w-auto"
          aria-label="Select a demo student"
        >
          {personas.map((p) => (
            <option key={p.key} value={p.key}>
              {p.name} — {p.role}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <>
          <div className="mt-6 flex items-center gap-2">
            {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => {
              const done = n <= selected.completed;
              const isCurrent = n === selected.completed;
              return (
                <React.Fragment key={n}>
                  {n > 1 && <div className={cn("h-0.5 flex-1 rounded", n - 1 <= selected.completed ? "bg-gold-500" : "bg-surface-200")} />}
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                      done ? "bg-brand-gradient text-gold-500" : "bg-surface-100 text-surface-500",
                      isCurrent && "ring-2 ring-gold-500 ring-offset-2"
                    )}
                  >
                    {done ? <BadgeCheck className="h-4 w-4" strokeWidth={1.75} /> : n}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="flex items-start gap-3 rounded-2xl bg-surface-50 p-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-gold-500`}>
                <UserRound className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-surface-900">{selected.name}</p>
                <p className="text-xs text-surface-500">{selected.role}</p>
                {selected.lead && (
                  <p className="mt-2 text-xs font-semibold text-gold-700">
                    {formatINR(selected.lead.scholarshipUnlocked)} unlocked
                  </p>
                )}
              </div>
            </div>

            {selected.lead ? (
              <div className="rounded-2xl border border-surface-200 p-4 lg:col-span-2">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-surface-600">
                  <span className="font-semibold text-surface-900">{selected.lead.targetCollege}</span>
                  <span>Intent: {selected.lead.intentLevel}</span>
                  <span>{selected.lead.source}</span>
                </div>
                {app ? (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-surface-500">
                      <GraduationCap className="h-4 w-4 text-gold-700" strokeWidth={1.75} />
                      {app.program} · {app.stage}
                    </div>
                    <div className="w-28">
                      <div className="flex justify-between text-[10px] font-semibold text-surface-500">
                        <span>Docs</span>
                        <span>{docsDone}/{docsRequired}</span>
                      </div>
                      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-200">
                        <div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${docsRequired ? (docsDone / docsRequired) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-surface-500">Application not started yet — next step: a counsellor call.</p>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-surface-200 p-4 lg:col-span-2">
                <p className="text-xs text-surface-500">
                  Has an eligibility voucher for {profile.city} — ready to send an enquiry whenever they decide.
                </p>
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-surface-100 pt-4">
            <p className="text-xs text-surface-400">
              Step {selected.completed} of 8 reached · status kept in sync by Orion&apos;s CRM
            </p>
            <Link href="/agent/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-700 hover:underline">
              Open in Agent Portal <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
