"use client";

import * as React from "react";
import { useState } from "react";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Info,
  MapPin,
  Search,
  Sparkles,
  Star,
  Trophy,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { College } from "@/store/types";
import { UniversityDetailSheet } from "./UniversityDetailSheet";
import { StartApplicationModal } from "./StartApplicationModal";

const STREAMS = ["All", "Engineering", "MBA", "Commerce", "Design", "Law", "Medical"] as const;

type SortKey = "rating" | "placement" | "feeAsc" | "feeDesc";

const streamColors: Record<string, string> = {
  Engineering: "bg-blue-100 text-blue-700",
  MBA: "bg-purple-100 text-purple-700",
  Commerce: "bg-green-100 text-green-700",
  Design: "bg-pink-100 text-pink-700",
  Law: "bg-amber-100 text-amber-700",
  Medical: "bg-red-100 text-red-700",
};

export function UniversityDirectory() {
  const colleges = useAppStore((s) => s.colleges);
  const [search, setSearch] = useState("");
  const [stream, setStream] = useState<(typeof STREAMS)[number]>("All");
  const [city, setCity] = useState("All");
  const [sort, setSort] = useState<SortKey>("rating");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [detailCollege, setDetailCollege] = useState<College | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [applyData, setApplyData] = useState<{ collegeId: string; program: string } | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);

  const cities = ["All", ...Array.from(new Set(colleges.map((c) => c.city))).sort()];

  const filtered = colleges
    .filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.programs.some((p) => p.name.toLowerCase().includes(q));
      const matchStream =
        stream === "All" ||
        c.programs.some((p) => p.stream === stream);
      const matchCity = city === "All" || c.city === city;
      return matchSearch && matchStream && matchCity;
    })
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "placement") return b.placementPct - a.placementPct;
      const aFee = Math.min(...a.programs.map((p) => p.annualFee));
      const bFee = Math.min(...b.programs.map((p) => p.annualFee));
      return sort === "feeAsc" ? aFee - bFee : bFee - aFee;
    });

  const totalPrograms = colleges.reduce((s, c) => s + c.programs.length, 0);

  const toggleCollege = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const openApply = (collegeId: string, program: string) => {
    setApplyData({ collegeId, program });
    setApplyOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">University Directory</h1>
          <p className="mt-1 text-sm text-slate-600">
            Deep-research every partner college — programs, eligibility, fees, placements & scholarships.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit bg-white !text-brand-950">
          {colleges.length} colleges · {totalPrograms} programs
        </Badge>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search college, city, program..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-8 text-sm text-slate-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600" aria-label="Clear search">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-gold-500"
          >
            {cities.map((c) => (
              <option key={c} value={c}>{c === "All" ? "All cities" : c}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-gold-500"
          >
            <option value="rating">Sort: Top rated</option>
            <option value="placement">Sort: Best placement</option>
            <option value="feeAsc">Sort: Lowest fee</option>
            <option value="feeDesc">Sort: Highest fee</option>
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

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <Building2 className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No colleges match your filters.</p>
          <p className="text-xs text-slate-500">Try clearing the search or switching stream.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((college) => {
            const isExpanded = expanded.has(college.id);
            const lowestFee = Math.min(...college.programs.map((p) => p.annualFee));
            const streams = Array.from(new Set(college.programs.map((p) => p.stream)));
            return (
              <div key={college.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-sm font-black text-white">
                    {college.shortName}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-brand-950">{college.name}</h3>
                      <Badge className="bg-gold-50 text-gold-600">{college.type}</Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {college.city}</span>
                      <span className="flex items-center gap-1"><Trophy className="h-3 w-3 text-gold-600" /> {college.ranking}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 text-gold-600" /> {college.rating}/5</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {streams.map((s) => (
                        <Badge key={s} className={cn("text-[10px]", streamColors[s])}>{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid shrink-0 grid-cols-3 gap-2 text-center sm:block sm:text-right">
                    <div>
                      <p className="font-heading text-xl font-black text-brand-950">{college.placementPct}%</p>
                      <p className="text-[10px] text-slate-500">placement</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="font-heading text-xl font-black text-gold-600">₹{(lowestFee / 100000).toFixed(1)}L</p>
                      <p className="text-[10px] text-slate-500">from /yr</p>
                    </div>
                    <div>
                      <p className="font-heading text-xl font-black text-brand-950">{college.programs.length}</p>
                      <p className="text-[10px] text-slate-500">programs</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 border-brand-950/30 text-brand-950 hover:bg-brand-950 hover:text-white"
                      onClick={() => { setDetailCollege(college); setDetailOpen(true); }}
                    >
                      <Info className="h-4 w-4" /> Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 border-gold-500 text-gold-600 hover:bg-gold-50"
                      onClick={() => toggleCollege(college.id)}
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      Programs
                    </Button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
                    <div className="space-y-2">
                      {college.programs.map((p) => (
                        <div key={p.name} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-brand-950">{p.name}</p>
                              <Badge className={cn("text-[10px]", streamColors[p.stream])}>{p.stream}</Badge>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500">
                              <span>{p.durationYears} yrs</span>
                              <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" /> {p.eligibility}</span>
                              <span>{p.seats} seats</span>
                              {p.intakes.map((i) => (
                                <Badge key={i} className="bg-slate-100 text-slate-600">{i}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <div className="text-right text-xs">
                              <p className="text-sm font-bold text-gold-600">₹{(p.annualFee / 100000).toFixed(1)}L/yr</p>
                              <p className="text-green-600">avg place ₹{(p.avgPlacement / 100000).toFixed(1)}L</p>
                            </div>
                            <Button
                              size="sm"
                              variant="gold"
                              className="h-8"
                              onClick={() => openApply(college.id, p.name)}
                            >
                              <Sparkles className="h-3.5 w-3.5" /> Start Application
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <UniversityDetailSheet
        college={detailCollege}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onStartApplication={(college, program) => {
          setDetailOpen(false);
          openApply(college.id, program);
        }}
      />

      <StartApplicationModal
        open={applyOpen}
        onOpenChange={setApplyOpen}
        preselectedCollegeId={applyData?.collegeId}
        preselectedProgram={applyData?.program}
      />
    </div>
  );
}
