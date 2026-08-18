"use client";

import * as React from "react";
import { GraduationCap, IndianRupee, Target, Timer, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { College } from "@/store/types";

export function ProgramFacts({ college }: { college: College }) {
  const [programIdx, setProgramIdx] = React.useState(0);
  const program = college.programs[programIdx];

  const facts = [
    { icon: IndianRupee, label: "Annual fee", value: `₹${(program.annualFee / 100000).toFixed(2)}L` },
    { icon: Target, label: "Total program fee", value: `₹${(program.totalFee / 100000).toFixed(2)}L` },
    { icon: Timer, label: "Duration", value: `${program.durationYears} yrs` },
    { icon: Users, label: "Seats", value: `${program.seats}` },
  ];

  return (
    <Card className="rounded-3xl border border-surface-200 bg-white shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-surface-800">
          <TrendingUp className="h-4 w-4 text-gold-700" strokeWidth={1.75} />
          Placement &amp; Fee Facts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {college.programs.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setProgramIdx(i)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                i === programIdx
                  ? "bg-brand-950 text-gold-500 shadow-md shadow-gold-500/30"
                  : "bg-surface-50 text-surface-600 hover:bg-surface-100"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="rounded-2xl bg-surface-50 p-4">
              <p className="flex items-center gap-1 text-xs text-surface-500">
                <f.icon className="h-3 w-3" strokeWidth={1.75} /> {f.label}
              </p>
              <p className="mt-1 font-display text-xl font-bold text-surface-900">{f.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-gold-50 p-4">
            <p className="text-xs text-gold-700">Placement rate</p>
            <p className="mt-1 font-display text-3xl font-black text-gold-700">{college.placementPct}%</p>
            <p className="mt-1 text-[11px] text-surface-600">of batch placed</p>
          </div>
          <div className="rounded-2xl bg-brand-950 p-4 text-white">
            <p className="text-xs text-white/60">Avg package</p>
            <p className="mt-1 font-display text-3xl font-black text-gold-400">₹{(program.avgPlacement / 100000).toFixed(1)}L</p>
            <p className="mt-1 text-[11px] text-white/50">in {program.name}</p>
          </div>
          <div className="rounded-2xl bg-surface-50 p-4">
            <p className="text-xs text-surface-500">Highest package</p>
            <p className="mt-1 font-display text-3xl font-black text-surface-900">₹{(college.highestPlacement / 100000).toFixed(1)}L</p>
            <p className="mt-1 text-[11px] text-surface-600">college-wide</p>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-surface-200 p-4 text-sm">
          <div className="flex items-start justify-between gap-4">
            <span className="flex items-center gap-2 text-surface-600">
              <GraduationCap className="h-4 w-4 text-gold-700" strokeWidth={1.75} /> Eligibility
            </span>
            <span className="text-right font-medium text-surface-900">{program.eligibility}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-surface-600">Intakes</span>
            <span className="text-right font-medium text-surface-900">{program.intakes.join(", ")}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-surface-600">Stream</span>
            <span className="text-right font-medium text-surface-900">{program.stream}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
