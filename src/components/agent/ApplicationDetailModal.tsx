"use client";

import * as React from "react";
import { useState } from "react";
import {
  Check,
  ClipboardList,
  Clock,
  Copy,
  GraduationCap,
  History,
  NotebookPen,
  Save,
  TicketPercent,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { formatINR, useAppStore } from "@/store/useAppStore";
import { timeAgo } from "@/lib/time";
import type { Application, ApplicationStage } from "@/store/types";

const STAGES: ApplicationStage[] = ["Docs Pending", "Submitted", "Offer Received", "Admitted"];

const stageBadge: Record<ApplicationStage, string> = {
  "Docs Pending": "bg-blue-100 text-blue-700",
  Submitted: "bg-amber-100 text-amber-700",
  "Offer Received": "bg-purple-100 text-purple-700",
  Admitted: "bg-green-100 text-green-700",
};

export function ApplicationDetailModal({
  application,
  open,
  onOpenChange,
}: {
  application: Application | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white p-0">
        {application && (
          <ApplicationDetailBody key={application.id} application={application} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ApplicationDetailBody({ application }: { application: Application }) {
  const updateApplicationStage = useAppStore((s) => s.updateApplicationStage);
  const toggleDoc = useAppStore((s) => s.toggleDoc);
  const updateApplicationNotes = useAppStore((s) => s.updateApplicationNotes);

  const [notes, setNotes] = useState(application.notes ?? "");
  const [saved, setSaved] = useState(false);

  const docsDone = application.docs.filter((d) => d.done).length;
  const docsPct = application.docs.length > 0 ? Math.round((docsDone / application.docs.length) * 100) : 0;

  return (
    <>
      <DialogHeader className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5">
        <DialogTitle className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
            {application.studentName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-brand-950">{application.studentName}</p>
              <Badge className={stageBadge[application.stage]}>{application.stage}</Badge>
            </div>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <GraduationCap className="h-3 w-3" /> {application.collegeName} · {application.program} · by {application.agent}
            </p>
          </div>
          <Button variant="outline" size="sm" className="h-8 border-gold-500 text-gold-600" onClick={() => { navigator.clipboard?.writeText(`${application.studentName} - ${application.collegeName} - ${application.program}`).catch(() => {}); }}>
            <CopyId appId={application.id} />
          </Button>
        </DialogTitle>
      </DialogHeader>

        <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-brand-gradient p-4 text-white">
              <p className="flex items-center gap-1.5 text-xs text-white/60">
                <TicketPercent className="h-3.5 w-3.5 text-gold-400" /> Scholarship
              </p>
              <p className="mt-1 font-heading text-2xl font-black text-gold-400">{formatINR(application.scholarshipApplied)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Started</p>
              <p className="mt-1 text-sm font-semibold text-brand-950">{timeAgo(application.startedAt)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Last update</p>
              <p className="mt-1 text-sm font-semibold text-brand-950">{timeAgo(application.updatedAt)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                <ClipboardList className="h-4 w-4 text-gold-600" /> Documents checklist
              </p>
              <Badge className="bg-gold-50 text-gold-600">{docsDone}/{application.docs.length} done · {docsPct}%</Badge>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn("h-full rounded-full transition-all", docsPct === 100 ? "bg-green-500" : "bg-gradient-to-r from-gold-500 to-gold-600")}
                style={{ width: `${docsPct}%` }}
              />
            </div>
            <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {application.docs.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDoc(application.id, d.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-3 py-2 text-left text-xs transition-colors",
                    d.done ? "border-green-200 bg-green-50 text-green-700" : "border-slate-200 bg-white text-slate-600 hover:border-gold-500/40"
                  )}
                >
                  <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded border", d.done ? "border-green-500 bg-green-500 text-white" : "border-slate-300 bg-white")}>
                    {d.done && <Check className="h-3 w-3" />}
                  </span>
                  <span className="flex-1">{d.name}</span>
                  {!d.required && <span className="text-[10px] text-slate-400">optional</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                <History className="h-4 w-4 text-gold-600" /> Timeline
              </p>
              <Badge className="bg-slate-100 text-slate-600">{application.timeline.length} events</Badge>
            </div>
            <div className="mt-4 space-y-0">
              {application.timeline.map((event, i) => (
                <div key={i} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < application.timeline.length - 1 && (
                    <span className="absolute left-[5px] top-4 h-full w-px bg-slate-200" />
                  )}
                  <span className="relative mt-1.5 flex h-2.5 w-2.5 shrink-0 items-center justify-center rounded-full border-2 border-gold-500 bg-white" />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700">{event.label}</p>
                    <p className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="h-3 w-3" /> {timeAgo(event.at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                <NotebookPen className="h-4 w-4 text-gold-600" /> Notes
              </p>
              {saved && <Badge className="bg-green-100 text-green-700">Saved</Badge>}
            </div>
            <div className="mt-3 flex gap-2">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add follow-up notes for this application..."
                className="min-h-[72px] resize-none"
              />
              <Button
                variant="gold"
                size="sm"
                className="h-auto shrink-0 self-stretch"
                onClick={() => {
                  updateApplicationNotes(application.id, notes);
                  setSaved(true);
                  setTimeout(() => setSaved(false), 1500);
                }}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <p className="text-xs text-slate-500">Move this application forward</p>
          <Select
            value={application.stage}
            onValueChange={(v) => updateApplicationStage(application.id, v as ApplicationStage)}
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
    </>
  );
}

function CopyId({ appId }: { appId: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <span
      className="flex items-center gap-1"
      onClick={() => {
        navigator.clipboard?.writeText(appId).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : appId}
    </span>
  );
}
