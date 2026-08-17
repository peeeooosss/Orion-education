"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";
import type { RawStudentRecord, RawStudentStatus } from "@/store/types";

const STATUS_OPTIONS: RawStudentStatus[] = ["Unassigned", "Assigned", "Call Pending", "Calling", "Connected", "Follow-up Required", "Qualified", "Converted to Lead", "Not Interested", "Invalid", "Skipped"];

export function RawStudentEditModal({ student, open, onOpenChange }: { student: RawStudentRecord | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  const updateRawStudent = useAppStore((state) => state.updateRawStudent);
  const agents = useAppStore((state) => state.agents);
  const [draft, setDraft] = useState(() => student ? { ...student } : null);
  if (!student || !draft) return null;
  const studentId = student.id;

  function set<K extends keyof RawStudentRecord>(key: K, value: RawStudentRecord[K]) {
    setDraft((current) => current ? { ...current, [key]: value } : current);
  }

  function save() {
    updateRawStudent(studentId, { ...draft, lastEditedBy: "Superadmin", lastEditedAt: new Date().toISOString() });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader><DialogTitle className="text-brand-950">Edit imported student</DialogTitle></DialogHeader>
        <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          {student.leadId && <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">This record is linked to Lead #{student.leadId}. Changes to identity and preference fields will update the linked Lead.</p>}
          <div className="grid gap-3 sm:grid-cols-2">
            {(["studentName", "phone", "email", "city", "state", "stream", "scoreBand", "entranceExam", "entranceScore", "preferredCollege", "preferredProgram", "budgetRange", "admissionTimeline"] as const).map((field) => <div key={field} className="space-y-1.5"><Label className="text-xs capitalize text-slate-600">{field.replace(/([A-Z])/g, " $1")}</Label><Input value={String(draft[field] ?? "")} onChange={(event) => set(field, event.target.value)} className="h-9 text-sm" /></div>)}
            <div className="space-y-1.5"><Label className="text-xs text-slate-600">Assigned agent</Label><select value={draft.assignedAgent ?? ""} onChange={(event) => set("assignedAgent", event.target.value || undefined)} className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm"><option value="">Unassigned</option>{agents.map((agent) => <option key={agent.id} value={agent.name}>{agent.name}</option>)}</select></div>
            <div className="space-y-1.5"><Label className="text-xs text-slate-600">Raw status</Label><select value={draft.status} onChange={(event) => set("status", event.target.value as RawStudentStatus)} className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-sm">{STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}</select></div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-700"><label className="flex items-center gap-2"><input type="checkbox" checked={Boolean(draft.hostelRequired)} onChange={(event) => set("hostelRequired", event.target.checked)} /> Hostel required</label><label className="flex items-center gap-2"><input type="checkbox" checked={Boolean(draft.loanRequired)} onChange={(event) => set("loanRequired", event.target.checked)} /> Education loan required</label></div>
          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button variant="gold" onClick={save}>Save changes</Button></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
