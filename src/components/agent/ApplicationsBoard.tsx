"use client";

import * as React from "react";
import { useState } from "react";
import {
  FileStack,
  FileText,
  GraduationCap,
  PartyPopper,
  PlusCircle,
  Search,
  TicketPercent,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatINR, useAppStore } from "@/store/useAppStore";
import { timeAgo } from "@/lib/time";
import type { Application, ApplicationStage } from "@/store/types";
import { ApplicationDetailModal } from "./ApplicationDetailModal";
import { StartApplicationModal } from "./StartApplicationModal";

const STAGES: ApplicationStage[] = ["Docs Pending", "Submitted", "Offer Received", "Admitted"];

const stageBadge: Record<ApplicationStage, string> = {
  "Docs Pending": "bg-blue-100 text-blue-700",
  Submitted: "bg-amber-100 text-amber-700",
  "Offer Received": "bg-purple-100 text-purple-700",
  Admitted: "bg-green-100 text-green-700",
};

export function ApplicationsBoard() {
  const applications = useAppStore((s) => s.applications);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Application | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = applications.filter((app) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      app.studentName.toLowerCase().includes(q) ||
      app.collegeName.toLowerCase().includes(q) ||
      app.program.toLowerCase().includes(q) ||
      app.id.toLowerCase().includes(q);
    const matchStage = stageFilter === "all" || app.stage === stageFilter;
    return matchSearch && matchStage;
  });

  const metrics = [
    { label: "Total applications", value: applications.length, icon: <FileStack className="h-4 w-4" />, tone: "bg-brand-950 text-gold-400" },
    { label: "Docs pending", value: applications.filter((a) => a.stage === "Docs Pending").length, icon: <FileText className="h-4 w-4" />, tone: "bg-blue-100 text-blue-700" },
    { label: "Offers received", value: applications.filter((a) => a.stage === "Offer Received").length, icon: <PartyPopper className="h-4 w-4" />, tone: "bg-purple-100 text-purple-700" },
    { label: "Admitted (closed)", value: applications.filter((a) => a.stage === "Admitted").length, icon: <GraduationCap className="h-4 w-4" />, tone: "bg-green-100 text-green-700" },
  ];

  function openDetail(app: Application) {
    setSelected(app);
    setDetailOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Applications</h1>
          <p className="mt-1 text-sm text-slate-600">
            Every started application, from docs pending to admitted — tracked live.
          </p>
        </div>
        <Button variant="gold" onClick={() => setAddOpen(true)}>
          <PlusCircle className="h-4 w-4" /> Start Application
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", m.tone)}>{m.icon}</div>
              <div>
                <p className="font-heading text-xl font-bold text-brand-950">{m.value}</p>
                <p className="text-[11px] text-slate-500">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student, college, program..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-8 text-sm text-slate-900 outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/30"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600" aria-label="Clear search">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-gold-500"
        >
          <option value="all">All stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[920px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60">
              {["Student", "College & Program", "Scholarship", "Docs", "Stage", "Agent", "Updated", ""].map((col) => (
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
                  <FileStack className="mx-auto h-10 w-10 text-slate-300" />
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    {search || stageFilter !== "all" ? "No applications match your filters." : "No applications yet."}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Start one from a lead or a college program.</p>
                  <Button size="sm" variant="outline" className="mt-4 border-gold-500 text-gold-600" onClick={() => setAddOpen(true)}>
                    <PlusCircle className="h-4 w-4" /> Start Application
                  </Button>
                </td>
              </tr>
            ) : (
              filtered.map((app) => {
                const docsDone = app.docs.filter((d) => d.done).length;
                const docsPct = app.docs.length > 0 ? Math.round((docsDone / app.docs.length) * 100) : 0;
                return (
                  <tr key={app.id} className="group cursor-pointer hover:bg-slate-50" onClick={() => openDetail(app)}>
                    <td className="p-3.5">
                      <p className="text-sm font-semibold text-brand-950">{app.studentName}</p>
                      <p className="text-xs text-slate-500">{app.phone}</p>
                    </td>
                    <td className="p-3.5">
                      <p className="text-sm text-slate-700">{app.collegeName}</p>
                      <p className="text-xs text-slate-500">{app.program}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 font-semibold text-gold-600">
                        <TicketPercent className="h-3.5 w-3.5" /> {formatINR(app.scholarshipApplied)}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="w-28">
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn("h-full rounded-full transition-all", docsPct === 100 ? "bg-green-500" : "bg-gradient-to-r from-gold-500 to-gold-600")}
                            style={{ width: `${docsPct}%` }}
                          />
                        </div>
                        <p className="mt-1 text-[10px] text-slate-500">{docsDone}/{app.docs.length} docs</p>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <Badge className={stageBadge[app.stage]}>{app.stage}</Badge>
                    </td>
                    <td className="p-3.5 text-sm text-slate-700">{app.agent}</td>
                    <td className="p-3.5 text-xs text-slate-500">{timeAgo(app.updatedAt)}</td>
                    <td className="p-3.5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 border-slate-200 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(app);
                        }}
                      >
                        Open
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ApplicationDetailModal application={selected} open={detailOpen} onOpenChange={setDetailOpen} />
      <StartApplicationModal open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
