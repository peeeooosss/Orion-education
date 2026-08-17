"use client";

import * as React from "react";
import { useState } from "react";
import { BookOpen, Search, Sparkles, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { StartApplicationModal } from "./StartApplicationModal";

const STREAMS = ["All", "Engineering", "MBA", "Commerce", "Design", "Law", "Medical"] as const;

const streamColors: Record<string, string> = {
  Engineering: "bg-blue-100 text-blue-700",
  MBA: "bg-purple-100 text-purple-700",
  Commerce: "bg-green-100 text-green-700",
  Design: "bg-pink-100 text-pink-700",
  Law: "bg-amber-100 text-amber-700",
  Medical: "bg-red-100 text-red-700",
};

export function ProgramsDirectory() {
  const colleges = useAppStore((s) => s.colleges);
  const [search, setSearch] = useState("");
  const [stream, setStream] = useState<(typeof STREAMS)[number]>("All");
  const [collegeFilter, setCollegeFilter] = useState("All");
  const [applyData, setApplyData] = useState<{ collegeId: string; program: string } | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);

  const rows = colleges.flatMap((c) =>
    c.programs.map((p) => ({
      collegeId: c.id,
      college: c.name,
      shortName: c.shortName,
      city: c.city,
      program: p.name,
      stream: p.stream,
      duration: p.durationYears,
      annualFee: p.annualFee,
      avgPlacement: p.avgPlacement,
      eligibility: p.eligibility,
      intakes: p.intakes,
      seats: p.seats,
      placementPct: c.placementPct,
    }))
  );

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.program.toLowerCase().includes(q) ||
      r.college.toLowerCase().includes(q) ||
      r.eligibility.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q);
    const matchStream = stream === "All" || r.stream === stream;
    const matchCollege = collegeFilter === "All" || r.college === collegeFilter;
    return matchSearch && matchStream && matchCollege;
  });

  const openApply = (collegeId: string, program: string) => {
    setApplyData({ collegeId, program });
    setApplyOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Program List</h1>
          <p className="mt-1 text-sm text-slate-600">
            Every program across partner colleges — compare fees, placements & eligibility.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit bg-white !text-brand-950">
          {rows.length} programs
        </Badge>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search program, college, eligibility..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-8 text-sm text-slate-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600" aria-label="Clear search">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <select
            value={collegeFilter}
            onChange={(e) => setCollegeFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-gold-500"
          >
            <option value="All">All colleges</option>
            {colleges.map((c) => (
              <option key={c.id} value={c.name}>{c.shortName} · {c.city}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
          {STREAMS.map((s) => (
            <button
              key={s}
              onClick={() => setStream(s)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                stream === s ? "bg-brand-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[960px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60">
              {["Program", "College", "Stream", "Eligibility", "Intakes", "Fee / yr", "Avg placement", ""].map((col) => (
                <th key={col} className="p-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-16 text-center">
                  <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-3 text-sm font-medium text-slate-600">No programs match your filters.</p>
                </td>
              </tr>
            ) : (
              filtered.map((r, i) => (
                <tr key={`${r.collegeId}-${r.program}-${i}`} className="hover:bg-slate-50">
                  <td className="p-3.5">
                    <p className="text-sm font-semibold text-brand-950">{r.program}</p>
                    <p className="text-xs text-slate-500">{r.duration} years · {r.seats} seats</p>
                  </td>
                  <td className="p-3.5">
                    <p className="text-sm text-slate-700">{r.shortName}</p>
                    <p className="text-xs text-slate-500">{r.city}</p>
                  </td>
                  <td className="p-3.5">
                    <Badge className={cn("text-[10px]", streamColors[r.stream])}>{r.stream}</Badge>
                  </td>
                  <td className="p-3.5 text-xs text-slate-600">{r.eligibility}</td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {r.intakes.map((i) => (
                        <Badge key={i} className="bg-slate-100 text-slate-600">{i}</Badge>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-sm font-bold text-gold-600">₹{(r.annualFee / 100000).toFixed(1)}L</td>
                  <td className="p-3.5 text-sm text-green-600">₹{(r.avgPlacement / 100000).toFixed(1)}L</td>
                  <td className="p-3.5 text-right">
                    <Button size="sm" variant="gold" className="h-8" onClick={() => openApply(r.collegeId, r.program)}>
                      <Sparkles className="h-3.5 w-3.5" /> Apply
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <StartApplicationModal
        open={applyOpen}
        onOpenChange={setApplyOpen}
        preselectedCollegeId={applyData?.collegeId}
        preselectedProgram={applyData?.program}
      />
    </div>
  );
}
