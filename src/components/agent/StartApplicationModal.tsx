"use client";

import * as React from "react";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileStack,
  Search,
  TicketPercent,
  User,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatINR, useAppStore } from "@/store/useAppStore";
import type { Application, College, Lead } from "@/store/types";

interface StartApplicationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedLeadId?: string | null;
  preselectedCollegeId?: string | null;
  preselectedProgram?: string | null;
  onCreated?: (app: Application) => void;
}

function LeadPicker({
  leads,
  selected,
  onSelect,
}: {
  leads: Lead[];
  selected: Lead | null;
  onSelect: (lead: Lead) => void;
}) {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);

  const filtered = leads.filter(
    (l) =>
      l.status !== "Admitted" &&
      (l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.phone.includes(query) ||
        l.targetCollege.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search lead by name, phone, college..."
          value={selected ? selected.name : query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShow(true);
            if (selected) onSelect(null as unknown as Lead);
          }}
          onFocus={() => setShow(true)}
          className="h-10 pl-10"
        />
        {selected && (
          <button
            type="button"
            onClick={() => onSelect(null as unknown as Lead)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Clear lead"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {show && !selected && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {filtered.length === 0 ? (
            <p className="px-3 py-3 text-sm text-slate-500">No leads found.</p>
          ) : (
            filtered.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  onSelect(l);
                  setShow(false);
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-gold-50/60"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
                  {l.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-brand-950">{l.name}</p>
                  <p className="truncate text-xs text-slate-500">
                    {l.phone} · {l.targetCollege}
                  </p>
                </div>
                <div className="text-right">
                  <Badge className={l.intentLevel === "Hot" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}>
                    {l.intentLevel}
                  </Badge>
                  <p className="mt-0.5 text-[11px] font-semibold text-gold-600">{formatINR(l.scholarshipUnlocked)}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function CollegePicker({
  colleges,
  selected,
  onSelect,
}: {
  colleges: College[];
  selected: College | null;
  onSelect: (college: College) => void;
}) {
  const [query, setQuery] = useState("");
  const [show, setShow] = useState(false);

  const filtered = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.city.toLowerCase().includes(query.toLowerCase()) ||
      c.programs.some((p) => p.name.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search college or program..."
          value={selected ? selected.name : query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShow(true);
            if (selected) onSelect(null as unknown as College);
          }}
          onFocus={() => setShow(true)}
          className="h-10 pl-10"
        />
        {selected && (
          <button
            type="button"
            onClick={() => onSelect(null as unknown as College)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Clear college"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {show && !selected && (
        <div className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          {filtered.length === 0 ? (
            <p className="px-3 py-3 text-sm text-slate-500">No colleges found.</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onSelect(c);
                  setShow(false);
                }}
                className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-gold-50/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-brand-950">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.city} · {c.programs.length} programs</p>
                </div>
                <span className="shrink-0 text-xs font-semibold text-gold-600">★ {c.rating}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StartApplicationForm({
  leads,
  colleges,
  preselectedLeadId,
  preselectedCollegeId,
  preselectedProgram,
  onDone,
  onCancel,
}: {
  leads: Lead[];
  colleges: College[];
  preselectedLeadId?: string | null;
  preselectedCollegeId?: string | null;
  preselectedProgram?: string | null;
  onDone: (app: Application) => void;
  onCancel: () => void;
}) {
  const startApplication = useAppStore((s) => s.startApplication);
  const [lead, setLead] = useState<Lead | null>(
    leads.find((l) => l.id === preselectedLeadId) ?? null
  );
  const [college, setCollege] = useState<College | null>(
    colleges.find((c) => c.id === preselectedCollegeId) ?? null
  );
  const [program, setProgram] = useState(preselectedProgram ?? "");
  const [notes, setNotes] = useState("");
  const [created, setCreated] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = !!lead && !!college && !!program;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!lead || !college || !program) return;
    setError(null);
    const app = startApplication({
      leadId: lead.id,
      collegeId: college.id,
      program,
      notes: notes.trim() || undefined,
    });
    if (app) setCreated(app);
    else setError("Could not create the application. Try again.");
  }

  if (created) {
    return (
      <div className="p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="mt-4 font-heading text-xl font-bold text-brand-950">Application started</h3>
        <p className="mt-1 text-sm text-slate-600">
          {created.studentName} → {created.collegeName} · {created.program}
        </p>
        <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-gold-50 px-4 py-2 text-sm font-semibold text-gold-600">
          <TicketPercent className="h-4 w-4" />
          {formatINR(created.scholarshipApplied)} scholarship applied
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Track documents & stage in the Applications tab.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={() => onDone(created)}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader className="border-b border-slate-200 px-6 py-5">
        <DialogTitle className="flex items-center gap-2 text-base font-bold text-brand-950">
          <FileStack className="h-5 w-5 text-gold-600" />
          Start Application
        </DialogTitle>
      </DialogHeader>

      <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <User className="h-3.5 w-3.5" /> Student / Lead
          </Label>
          <LeadPicker leads={leads} selected={lead} onSelect={setLead} />
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Search className="h-3.5 w-3.5" /> College
          </Label>
          <CollegePicker colleges={colleges} selected={college} onSelect={setCollege} />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Program</Label>
          {college ? (
            <div className="grid max-h-40 gap-1.5 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-2">
              {college.programs.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setProgram(p.name)}
                  className={cn(
                    "flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors",
                    program === p.name
                      ? "border-gold-500 bg-gold-50/60 text-brand-950"
                      : "border-slate-200 bg-white text-slate-700 hover:border-gold-500/40"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", program === p.name ? "bg-gold-500" : "bg-slate-300")} />
                    {p.name}
                  </span>
                  <span className="text-xs text-slate-500">₹{(p.annualFee / 100000).toFixed(1)}L/yr</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-400">
              Select a college to see its programs
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gold-500/40 bg-gold-50/60 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-600">Scholarship applied (auto from lead)</p>
              <p className="font-heading text-2xl font-black text-gold-600">
                {lead ? formatINR(lead.scholarshipUnlocked) : "—"}
              </p>
            </div>
            <Badge className="bg-white/70 text-gold-600">Assured · 48h validity</Badge>
          </div>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
            <Check className="h-3 w-3 text-green-600" />
            A 7-document checklist will be created for this application.
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Notes (optional)</Label>
          <Textarea
            placeholder="e.g. Student needs help with fee deposit, prefers hostel..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[72px] resize-none"
          />
        </div>

        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" /> Cancel
        </Button>
        <Button type="submit" variant="gold" disabled={!canSubmit}>
          Start Application <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

export function StartApplicationModal({
  open,
  onOpenChange,
  preselectedLeadId,
  preselectedCollegeId,
  preselectedProgram,
  onCreated,
}: StartApplicationModalProps) {
  const leads = useAppStore((s) => s.leads);
  const colleges = useAppStore((s) => s.colleges);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white p-0">
        {open && (
          <StartApplicationForm
            leads={leads}
            colleges={colleges}
            preselectedLeadId={preselectedLeadId}
            preselectedCollegeId={preselectedCollegeId}
            preselectedProgram={preselectedProgram}
            onDone={(app) => {
              onCreated?.(app);
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
