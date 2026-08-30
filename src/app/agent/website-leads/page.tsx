"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Globe2, PhoneCall, MessageCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { telLink, waLink } from "@/lib/wa";
import { timeAgo } from "@/lib/time";
import { LEAD_STATUSES } from "@/lib/scholarship";
import { LeadDetailModal } from "@/components/agent/LeadDetailModal";
import { StartApplicationModal } from "@/components/agent/StartApplicationModal";
import type { CallStatus, Lead, LeadType } from "@/store/types";

const STATUSES: Lead["status"][] = [...LEAD_STATUSES];
const CALL_STATUS_OPTIONS: CallStatus[] = ["Not Called", "Connected", "No Answer", "Busy", "Call Back Requested", "WhatsApp Sent", "Wrong Number", "Do Not Call"];

const intentColors: Record<string, string> = {
  Hot: "bg-red-100 text-red-700",
  Warm: "bg-amber-100 text-amber-700",
  Cold: "bg-slate-100 text-slate-600",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function AgentWebsiteLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [applyLead, setApplyLead] = useState<Lead | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/leads?source=website&sort=newest");
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          const mapped: Lead[] = (data.leads ?? []).map((r: Record<string, unknown>) => ({
            id: r.id as string,
            name: (r.contactName as string) ?? "Unknown",
            phone: (r.contactPhone as string) ?? "",
            email: (r.contactEmail as string) ?? "",
            intentLevel: (r.intentLevel as string) ?? "Cold",
            scholarshipUnlocked: Number(r.scholarshipAmount ?? 0),
            lookingFor: (r.lookingFor as string) ?? "",
            targetCollege: (r.targetCollege as string) ?? "",
            status: (r.stage as Lead["status"]) ?? "New",
            callConnected: Boolean(r.callConnected),
            source: (r.source as string) ?? "",
            createdAt: (r.createdAt as string) ?? new Date().toISOString(),
            agent: "",
            callStatus: (r.callStatus as CallStatus) ?? "Not Called",
            interestStatus: (r.interestStatus as string) ?? "Not Assessed",
            remarks: [],
            intentScore: (r.intentScore as number) ?? 0,
            intentReasons: [],
            leadType: (r.leadType as LeadType) ?? "website",
            scholarshipApplied: Boolean(r.scholarshipApplied),
          }));
          if (!cancelled) setLeads(mapped);
        }
      } catch { /* silent */ } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function updateLeadStatus(id: string, status: Lead["status"]) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    try { await fetch("/api/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, stage: status }) }); } catch { /* optimistic */ }
  }

  async function updateLeadEngagement(id: string, patch: Partial<Pick<Lead, "callStatus" | "interestStatus">>) {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, ...patch } : l));
    try { await fetch("/api/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) }); } catch { /* optimistic */ }
  }

  const assigned = leads.length;
  const called = leads.filter((l) => l.callConnected).length;
  const abroad = leads.filter((l) => l.source === "Study Abroad").length;
  const pending = leads.filter((l) => l.callStatus === "Not Called").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-950">Website Leads</h1>
        <p className="mt-1 text-sm text-slate-600">Website visits and study-abroad enquiries sent to you by admin. Same controls as New Leads — call, update status, set follow-ups.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Assigned to you", value: assigned, icon: Globe2, color: "bg-blue-100 text-blue-700" },
          { label: "Study abroad", value: abroad, icon: CheckCircle2, color: "bg-indigo-100 text-indigo-700" },
          { label: "Pending calls", value: pending, icon: PhoneCall, color: "bg-amber-100 text-amber-700" },
        ].map((m) => (
          <Card key={m.label} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${m.color}`}>
                <m.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-brand-950">{m.value}</p>
                <p className="text-xs text-slate-500">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading website leads...</p>
      ) : leads.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <Globe2 className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No website leads assigned yet.</p>
          <p className="text-xs text-slate-500">Ask admin to send website or study-abroad leads to you.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[1040px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {["Student", "Type", "Intent", "Looking for", "Target College", "Status", "Call Status", "Actions"].map((col) => (
                  <th key={col} className="p-3.5">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="group hover:bg-slate-50">
                  <td className="p-3.5">
                    <button className="flex items-center gap-3 text-left" onClick={() => { setSelectedLead(lead); setModalOpen(true); }}>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                        {getInitials(lead.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-brand-950">{lead.name}</p>
                        <p className="text-xs text-slate-500">{lead.phone} · {timeAgo(lead.createdAt)}</p>
                      </div>
                    </button>
                  </td>
                  <td className="p-3.5">
                    {lead.source === "Study Abroad" ? (
                      <Badge className="bg-indigo-100 text-indigo-700">Study Abroad</Badge>
                    ) : (
                      <Badge className="bg-slate-200 text-slate-700">Website Visit</Badge>
                    )}
                  </td>
                  <td className="p-3.5">
                    <Badge className={intentColors[lead.intentLevel]}>{lead.intentLevel}</Badge>
                  </td>
                  <td className="p-3.5 text-sm text-slate-700">{lead.lookingFor}</td>
                  <td className="p-3.5 text-sm text-slate-700">{lead.targetCollege}</td>
                  <td className="p-3.5">
                    <Select value={lead.status} onValueChange={(v) => updateLeadStatus(lead.id, v as Lead["status"])}>
                      <SelectTrigger className="h-8 w-40 border-slate-200 text-xs" onClick={(e) => e.stopPropagation()}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={lead.callStatus ?? "Not Called"}
                      onChange={(e) => updateLeadEngagement(lead.id, { callStatus: e.target.value as CallStatus })}
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-gold-500"
                    >
                      {CALL_STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <a href={telLink(lead.phone)} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-brand-950 text-brand-950 hover:bg-brand-950 hover:text-white" aria-label="Call">
                          <PhoneCall className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                      <a href={waLink(lead.phone, `Hi ${lead.name}! This is Orion Education. You enquired on our website. Can we help?`)} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-green-600 text-green-600 hover:bg-green-600 hover:text-white" aria-label="WhatsApp">
                          <MessageCircle className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => { setSelectedLead(lead); setModalOpen(true); }}>
                        <Sparkles className="h-3.5 w-3.5 text-gold-600" /> Script
                      </Button>
                      <Button
                        variant="gold"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => { setApplyLead(lead); setApplyOpen(true); }}
                        disabled={lead.status === "Admitted"}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Apply
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <LeadDetailModal lead={selectedLead} open={modalOpen} onOpenChange={setModalOpen} onStartApplication={(lead) => { setApplyLead(lead); setApplyOpen(true); }} />
      <StartApplicationModal open={applyOpen} onOpenChange={setApplyOpen} preselectedLeadId={applyLead?.id} onCreated={() => setModalOpen(false)} />
    </div>
  );
}
