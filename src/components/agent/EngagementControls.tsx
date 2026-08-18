"use client";

import { useState } from "react";
import { Check, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/useAppStore";
import type { CallStatus, InterestStatus, IntentLevel, Lead, NextAction, RawStudentRecord } from "@/store/types";

const CALL_STATUSES: CallStatus[] = ["Not Called", "Call Started", "Connected", "No Answer", "Busy", "Call Back Requested", "WhatsApp Sent", "Wrong Number", "Do Not Call"];
const INTEREST_STATUSES: InterestStatus[] = ["Not Assessed", "Interested", "Needs More Details", "Parent Discussion", "Fee Concern", "Scholarship Focused", "Placement Focused", "Exam Result Pending", "Not Interested", "Qualified"];
const NEXT_ACTIONS: NextAction[] = ["Call Again", "Send College Details", "Send Fee Structure", "Send Scholarship Details", "Send Placement Details", "Send WhatsApp Comparison", "Talk to Parent", "Book Counselling", "Follow Up After Exam Result", "Start Application", "Close Record"];

const QUICK_PRESETS = [
  { label: "Connected - Interested", callStatus: "Connected" as CallStatus, interestStatus: "Interested" as InterestStatus, nextAction: "Call Again" as NextAction },
  { label: "Connected - Needs Details", callStatus: "Connected" as CallStatus, interestStatus: "Needs More Details" as InterestStatus, nextAction: "Send College Details" as NextAction },
  { label: "Parent Discussion Required", callStatus: "Connected" as CallStatus, interestStatus: "Parent Discussion" as InterestStatus, nextAction: "Talk to Parent" as NextAction },
  { label: "Fee Concern", callStatus: "Connected" as CallStatus, interestStatus: "Fee Concern" as InterestStatus, nextAction: "Send Fee Structure" as NextAction },
  { label: "Scholarship Requested", callStatus: "Connected" as CallStatus, interestStatus: "Scholarship Focused" as InterestStatus, nextAction: "Send Scholarship Details" as NextAction },
  { label: "No Answer - Retry Later", callStatus: "No Answer" as CallStatus, interestStatus: "Not Assessed" as InterestStatus, nextAction: "Call Again" as NextAction },
  { label: "Busy - Retry Later", callStatus: "Busy" as CallStatus, interestStatus: "Not Assessed" as InterestStatus, nextAction: "Call Again" as NextAction },
  { label: "Application Ready", callStatus: "Connected" as CallStatus, interestStatus: "Qualified" as InterestStatus, nextAction: "Start Application" as NextAction },
  { label: "Not Interested", callStatus: "Connected" as CallStatus, interestStatus: "Not Interested" as InterestStatus, nextAction: "Close Record" as NextAction },
];

interface EngagementControlsProps {
  record: RawStudentRecord | Lead;
  kind: "raw" | "lead";
  onConvert?: () => void;
}

function isRaw(record: RawStudentRecord | Lead, kind: "raw" | "lead"): record is RawStudentRecord {
  return kind === "raw";
}

export function EngagementControls({ record, kind, onConvert }: EngagementControlsProps) {
  const updateRawStudent = useAppStore((s) => s.updateRawStudent);
  const updateLeadEngagement = useAppStore((s) => s.updateLeadEngagement);
  const [callStatus, setCallStatus] = useState<CallStatus>(record.callStatus ?? "Not Called");
  const [interestStatus, setInterestStatus] = useState<InterestStatus>(record.interestStatus ?? "Not Assessed");
  const [nextAction, setNextAction] = useState<NextAction>(record.nextAction ?? "Call Again");
  const [intentChoice, setIntentChoice] = useState<"System Calculated" | IntentLevel>(record.intentOverride ? (record.intentLevel ?? "System Calculated") : "System Calculated");
  const [intentReason, setIntentReason] = useState(record.intentOverrideReason ?? "");
  const [followUpAt, setFollowUpAt] = useState(record.nextFollowUpAt?.slice(0, 16) ?? "");
  const [saved, setSaved] = useState(false);

  function applyQuick(label: string) {
    const preset = QUICK_PRESETS.find((item) => item.label === label);
    if (!preset) return;
    setCallStatus(preset.callStatus);
    setInterestStatus(preset.interestStatus);
    setNextAction(preset.nextAction);
  }

  async function saveUpdate() {
    const now = new Date().toISOString();
    if (isRaw(record, kind)) {
      const status = interestStatus === "Not Interested" ? "Not Interested" : callStatus === "No Answer" || callStatus === "Busy" ? "Follow-up Required" : interestStatus === "Qualified" ? "Qualified" : callStatus === "Not Called" ? record.status : "Connected";
      updateRawStudent(record.id, {
        status,
        callStatus,
        interestStatus,
        nextAction,
        lastCalledAt: callStatus !== "Not Called" ? now : record.lastCalledAt,
        nextFollowUpAt: followUpAt ? new Date(followUpAt).toISOString() : undefined,
        intentLevel: intentChoice === "System Calculated" ? undefined : intentChoice,
        intentOverride: intentChoice !== "System Calculated",
        intentOverrideReason: intentChoice === "System Calculated" ? undefined : intentReason.trim() || "Agent judgement after call",
      });

      // Create follow-up via API if this raw student has been converted to a lead
      const leadId = (record as { leadId?: string }).leadId;
      if (followUpAt && leadId) {
        try {
          await fetch("/api/follow-ups", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              leadId,
              dueAt: new Date(followUpAt).toISOString(),
              followType: nextAction === "Start Application" ? "Counselling" : "Call",
              priority: interestStatus === "Interested" || interestStatus === "Qualified" ? "Important" : "Normal",
              note: nextAction,
            }),
          });
        } catch {
          // silent
        }
      }
    } else {
      updateLeadEngagement(record.id, {
        callStatus,
        interestStatus,
        nextAction,
        lastCalledAt: callStatus !== "Not Called" ? now : record.lastCalledAt,
        nextFollowUpAt: followUpAt ? new Date(followUpAt).toISOString() : undefined,
        intentLevel: intentChoice === "System Calculated" ? undefined : intentChoice,
        intentOverride: intentChoice !== "System Calculated",
        intentOverrideReason: intentChoice === "System Calculated" ? undefined : intentReason.trim() || "Agent judgement after call",
      });

      // Create follow-up via API if date is set
      if (followUpAt && record.id) {
        try {
          await fetch("/api/follow-ups", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              leadId: record.id,
              dueAt: new Date(followUpAt).toISOString(),
              followType: nextAction === "Start Application" ? "Counselling" : "Call",
              priority: interestStatus === "Interested" || interestStatus === "Qualified" ? "Important" : "Normal",
              note: nextAction,
            }),
          });
        } catch {
          // silent - follow-up creation is best-effort
        }
      }
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-brand-950">Quick status update</p>
          <p className="text-xs text-slate-500">Use one preset or update the fields individually.</p>
        </div>
        {saved && <span className="flex items-center gap-1 text-xs font-semibold text-green-700"><Check className="h-4 w-4" /> Saved</span>}
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-slate-600">Quick update</Label>
        <select defaultValue="" onChange={(event) => applyQuick(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm">
          <option value="">Choose a common outcome...</option>
          {QUICK_PRESETS.map((preset) => <option key={preset.label} value={preset.label}>{preset.label}</option>)}
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <div className="space-y-2"><Label className="text-xs text-slate-600">Call status</Label><select value={callStatus} onChange={(event) => setCallStatus(event.target.value as CallStatus)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs">{CALL_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>
        <div className="space-y-2"><Label className="text-xs text-slate-600">Interest</Label><select value={interestStatus} onChange={(event) => setInterestStatus(event.target.value as InterestStatus)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs">{INTEREST_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></div>
        <div className="space-y-2"><Label className="text-xs text-slate-600">Next action</Label><select value={nextAction} onChange={(event) => setNextAction(event.target.value as NextAction)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs">{NEXT_ACTIONS.map((action) => <option key={action}>{action}</option>)}</select></div>
        <div className="space-y-2"><Label className="text-xs text-slate-600">Intent</Label><select value={intentChoice} onChange={(event) => setIntentChoice(event.target.value as "System Calculated" | IntentLevel)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs"><option>System Calculated</option><option>Hot</option><option>Warm</option><option>Cold</option></select></div>
      </div>
      {intentChoice !== "System Calculated" && <div className="space-y-2"><Label className="text-xs text-slate-600">Why did you override the intent?</Label><Input value={intentReason} onChange={(event) => setIntentReason(event.target.value)} placeholder="Student is excited to join and asked for the application link" className="h-10 bg-white text-xs" /></div>}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs text-slate-600">Follow-up date and time</Label>
          <Input type="datetime-local" value={followUpAt} onChange={(event) => setFollowUpAt(event.target.value)} className="h-10 bg-white text-xs" />
        </div>
      </div>
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" size="sm" onClick={saveUpdate}><MessageSquarePlus className="h-4 w-4" /> Save & Next</Button>
        {kind === "raw" && (interestStatus === "Qualified" || nextAction === "Start Application") && onConvert && <Button variant="gold" size="sm" onClick={onConvert}>Convert to Lead</Button>}
      </div>
    </div>
  );
}
