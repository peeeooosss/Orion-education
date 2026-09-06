"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, FileSpreadsheet, Filter, Flame, Globe2, GraduationCap, Inbox, RefreshCw, Search, Send, Sparkles, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/time";

type CategoryKey = "all" | "general" | "college_specific" | "study_abroad" | "imported";

interface AdminLead {
  id: string;
  stage: string;
  source: string;
  leadType: string;
  leadCategory: string;
  assignmentStatus: string;
  lookingFor: string | null;
  targetCollege: string | null;
  targetProgram: string | null;
  admissionTimeline: string | null;
  scholarshipAmount: string;
  scholarshipApplied: boolean;
  intentLevel: string;
  callStatus: string;
  interestStatus: string;
  callConnected: boolean;
  createdAt: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string | null;
  agentId: string | null;
  agentName: string | null;
  studyCountry: string | null;
  studyLevel: string | null;
  studyField: string | null;
  assignmentNote: string | null;
}

interface AgentOption {
  id: string;
  name: string;
}

const CATEGORY_TABS: { key: CategoryKey; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All Leads", icon: Inbox },
  { key: "general", label: "General Enquiries", icon: Sparkles },
  { key: "college_specific", label: "College-Specific", icon: GraduationCap },
  { key: "study_abroad", label: "Study Abroad", icon: Globe2 },
  { key: "imported", label: "Import Students", icon: FileSpreadsheet },
];

const CATEGORY_LABEL: Record<string, string> = {
  general: "General Enquiry",
  college_specific: "College-Specific",
  study_abroad: "Study Abroad",
  imported: "Imported Student",
};

const CATEGORY_BADGE: Record<string, string> = {
  general: "bg-gold-100 text-gold-700",
  college_specific: "bg-blue-100 text-blue-700",
  study_abroad: "bg-indigo-100 text-indigo-700",
  imported: "bg-slate-200 text-slate-700",
};

const intentColors: Record<string, string> = {
  Hot: "bg-red-100 text-red-700",
  Warm: "bg-amber-100 text-amber-700",
  Cold: "bg-slate-100 text-slate-600",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function AdminLeadsPageContent() {
  const searchParams = useSearchParams();
  const rawCategory = (searchParams.get("category") as CategoryKey) || "all";

  const [leads, setLeads] = React.useState<AdminLead[]>([]);
  const [agents, setAgents] = React.useState<AgentOption[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [category, setCategory] = React.useState<CategoryKey>(rawCategory);

  const [search, setSearch] = React.useState("");
  const [assignment, setAssignment] = React.useState("all");
  const [agentFilter, setAgentFilter] = React.useState("all");
  const [intentFilter, setIntentFilter] = React.useState("all");

  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [bulkAgent, setBulkAgent] = React.useState("");
  const [assigning, setAssigning] = React.useState(false);
  const [bulkMessage, setBulkMessage] = React.useState("");

  const [detail, setDetail] = React.useState<AdminLead | null>(null);

  async function loadLeads() {
    try {
      setError("");
      setLoading(true);
      const params = new URLSearchParams({ sort: "newest", limit: "200" });
      if (category !== "all") params.set("category", category);
      if (search.trim()) params.set("search", search.trim());
      if (assignment === "assigned" || assignment === "unassigned") params.set("assignment", assignment);
      if (agentFilter !== "all") params.set("agentId", agentFilter);
      if (intentFilter !== "all") params.set("intent", intentFilter);

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load leads");
      const data = await res.json();
      setLeads((data.leads ?? []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        stage: (r.stage as string) ?? "New",
        source: (r.source as string) ?? "",
        leadType: (r.leadType as string) ?? "",
        leadCategory: (r.leadCategory as string) ?? "general",
        assignmentStatus: (r.assignmentStatus as string) ?? "Unassigned",
        lookingFor: (r.lookingFor as string) ?? null,
        targetCollege: (r.targetCollege as string) ?? null,
        targetProgram: (r.targetProgram as string) ?? null,
        admissionTimeline: (r.admissionTimeline as string) ?? null,
        scholarshipAmount: (r.scholarshipAmount as string) ?? "0",
        scholarshipApplied: Boolean(r.scholarshipApplied),
        intentLevel: (r.intentLevel as string) ?? "Cold",
        callStatus: (r.callStatus as string) ?? "Not Called",
        interestStatus: (r.interestStatus as string) ?? "Not Assessed",
        callConnected: Boolean(r.callConnected),
        createdAt: (r.createdAt as string) ?? new Date().toISOString(),
        contactName: (r.contactName as string) ?? "Unknown",
        contactPhone: (r.contactPhone as string) ?? "",
        contactEmail: (r.contactEmail as string) ?? null,
        agentId: (r.agentId as string) ?? null,
        agentName: (r.agentName as string) ?? null,
        studyCountry: (r.studyCountry as string) ?? null,
        studyLevel: (r.studyLevel as string) ?? null,
        studyField: (r.studyField as string) ?? null,
        assignmentNote: (r.assignmentNote as string) ?? null,
      })));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  async function loadAgents() {
    try {
      const res = await fetch("/api/admin/agents");
      if (res.ok) {
        const data = await res.json();
        setAgents((data.agents ?? []).map((a: AgentOption) => ({ id: a.id, name: a.name })));
      }
    } catch {
      // silent
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => { setCategory(rawCategory); }, [rawCategory]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => { loadLeads(); }, [category, assignment, agentFilter, intentFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => { loadAgents(); }, []);

  const allVisibleSelected = leads.length > 0 && leads.every((l) => selected.has(l.id));

  function toggleAll() {
    if (allVisibleSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(leads.map((l) => l.id)));
    }
  }

  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  async function runBulkAssign() {
    if (selected.size === 0 || !bulkAgent) return;
    setAssigning(true);
    setBulkMessage("");
    try {
      const res = await fetch("/api/admin/leads/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: Array.from(selected), agentId: bulkAgent }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign");
      setBulkMessage(`${data.assigned ?? 0} lead(s) assigned.${data.failed ? ` ${data.failed} failed.` : ""}`);
      setSelected(new Set());
      setBulkAgent("");
      await loadLeads();
    } catch (e: unknown) {
      setBulkMessage(`Assignment failed: ${e instanceof Error ? e.message : "Unknown error"}`);
    } finally {
      setAssigning(false);
    }
  }

  const assignedCount = leads.filter((l) => l.assignmentStatus === "Assigned").length;
  const unassignedCount = leads.length - assignedCount;
  const hotCount = leads.filter((l) => l.intentLevel === "Hot").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Leads</h1>
          <p className="mt-1 text-sm text-slate-600">
            Every lead lands here first — Admin assigns them to agents. Agents never self-assign.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/admin/raw-data">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" /> Import XLSX
            </Button>
          </a>
          <Button variant="outline" size="sm" onClick={() => loadLeads()} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-1", loading && "animate-spin")} /> Refresh
          </Button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => (
          <a
            key={tab.key}
            href={tab.key === "all" ? "/admin/leads" : `/admin/leads?category=${tab.key}`}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              category === tab.key
                ? "bg-brand-950 text-gold-400"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </a>
        ))}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-950 text-gold-400">
              <Inbox className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-brand-950">{leads.length}</p>
              <p className="text-xs text-slate-500">Leads in view</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-brand-950">{unassignedCount}</p>
              <p className="text-xs text-slate-500">Unassigned — awaiting admin</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-brand-950">{hotCount}</p>
              <p className="text-xs text-slate-500">Hot leads</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="flex flex-wrap items-end gap-3 p-4">
          <div className="min-w-52 flex-1">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Search</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") loadLeads(); }}
                placeholder="Name, phone, college or program…"
                className="h-9 rounded-lg pl-9"
              />
            </div>
          </div>
          <div className="min-w-40">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Assignment</p>
            <Select value={assignment} onValueChange={setAssignment}>
              <SelectTrigger className="h-9 w-full border-slate-200 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-40">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Agent</p>
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="h-9 w-full border-slate-200 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All agents</SelectItem>
                {agents.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-40">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Intent</p>
            <Select value={intentFilter} onValueChange={setIntentFilter}>
              <SelectTrigger className="h-9 w-full border-slate-200 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Hot">Hot</SelectItem>
                <SelectItem value="Warm">Warm</SelectItem>
                <SelectItem value="Cold">Cold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk assign bar */}
      {selected.size > 0 && (
        <Card className="border-gold-500 bg-gold-50 shadow-sm">
          <CardContent className="flex flex-wrap items-center gap-3 p-4">
            <Badge variant="gold" className="bg-brand-950 text-gold-400">{selected.size} selected</Badge>
            <Select value={bulkAgent} onValueChange={setBulkAgent}>
              <SelectTrigger className="h-9 w-56 border-slate-200 bg-white text-xs"><SelectValue placeholder="Choose an agent…" /></SelectTrigger>
              <SelectContent>
                {agents.map((a) => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="gold" size="sm" onClick={runBulkAssign} disabled={!bulkAgent || assigning}>
              <Send className="h-3.5 w-3.5" /> {assigning ? "Assigning…" : "Assign to agent"}
            </Button>
            {bulkMessage && <p className="text-xs font-medium text-green-700">{bulkMessage}</p>}
          </CardContent>
        </Card>
      )}

      {/* Leads table */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="overflow-x-auto p-0">
          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">Loading leads…</div>
          ) : leads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-14 text-center">
              <Inbox className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-600">No leads in this view yet.</p>
              <p className="text-xs text-slate-500">
                {category === "all"
                  ? "New enquiries will appear here as soon as students submit forms."
                  : "New enquiries in this category will appear here."}
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleAll}
                      className="h-4 w-4 accent-brand-950"
                      aria-label="Select all"
                    />
                  </th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">College / University</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Intent</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Agent</th>
                  <th className="p-3">Assigned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => {
                  const isAssigned = lead.assignmentStatus === "Assigned";
                  return (
                    <tr key={lead.id} className={cn("hover:bg-slate-50", selected.has(lead.id) && "bg-gold-50")}>
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selected.has(lead.id)}
                          onChange={() => toggleOne(lead.id)}
                          className="h-4 w-4 accent-brand-950"
                          aria-label={`Select ${lead.contactName}`}
                        />
                      </td>
                      <td className="p-3">
                        <button className="flex items-center gap-3 text-left" onClick={() => setDetail(lead)}>
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                            {getInitials(lead.contactName)}
                          </div>
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-950">
                              {lead.contactName}
                              {!isAssigned && <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">UNASSIGNED</span>}
                            </p>
                            <p className="text-xs text-slate-500">
                              {lead.contactPhone} · {timeAgo(lead.createdAt)}
                            </p>
                          </div>
                        </button>
                      </td>
                      <td className="p-3">
                        <Badge className={CATEGORY_BADGE[lead.leadCategory] ?? "bg-slate-100 text-slate-600"}>
                          {CATEGORY_LABEL[lead.leadCategory] ?? lead.leadCategory}
                        </Badge>
                        {lead.leadCategory === "study_abroad" && lead.studyCountry && (
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {lead.studyCountry}{lead.studyLevel ? ` · ${lead.studyLevel}` : ""}
                          </p>
                        )}
                      </td>
                      <td className="p-3 text-sm text-slate-700">{lead.targetCollege ?? "—"}</td>
                      <td className="p-3 text-sm text-slate-700">{lead.targetProgram ?? lead.studyField ?? "—"}</td>
                      <td className="p-3">
                        <Badge className={intentColors[lead.intentLevel] ?? "bg-slate-100 text-slate-600"}>{lead.intentLevel}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="bg-blue-100 text-blue-700">{lead.stage}</Badge>
                      </td>
                      <td className="p-3 text-sm text-slate-700">{lead.agentName ?? <span className="text-slate-400">—</span>}</td>
                      <td className="p-3">
                        {isAssigned ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">No</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Lead detail modal */}
      <Dialog open={Boolean(detail)} onOpenChange={(open) => { if (!open) setDetail(null); }}>
        <DialogContent className="max-w-lg border border-surface-200 bg-surface-0">
          {detail && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-surface-900">
                  {detail.contactName}
                  <Badge className={cn("mt-1 ml-2 align-middle", CATEGORY_BADGE[detail.leadCategory])}>
                    {CATEGORY_LABEL[detail.leadCategory] ?? detail.leadCategory}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <p className="text-surface-600">Phone: <span className="font-semibold text-surface-900">{detail.contactPhone}</span></p>
                {detail.contactEmail && <p className="text-surface-600">Email: <span className="font-semibold text-surface-900">{detail.contactEmail}</span></p>}
                <p className="text-surface-600">College: <span className="font-medium text-surface-900">{detail.targetCollege ?? "—"}</span></p>
                <p className="text-surface-600">Program: <span className="font-medium text-surface-900">{detail.targetProgram ?? detail.studyField ?? "—"}</span></p>
                {detail.studyCountry && <p className="text-surface-600">Country: <span className="font-medium text-surface-900">{detail.studyCountry}</span></p>}
                {detail.studyLevel && <p className="text-surface-600">Level: <span className="font-medium text-surface-900">{detail.studyLevel}</span></p>}
                <p className="text-surface-600">Looking for: <span className="font-medium text-surface-900">{detail.lookingFor ?? "—"}</span></p>
                <p className="text-surface-600">Timeline: <span className="font-medium text-surface-900">{detail.admissionTimeline ?? "—"}</span></p>
                <p className="text-surface-600">Intent: <Badge className={intentColors[detail.intentLevel]}>{detail.intentLevel}</Badge></p>
                <p className="text-surface-600">Stage: <Badge className="bg-blue-100 text-blue-700">{detail.stage}</Badge></p>
                <p className="text-surface-600">Assigned agent: <span className="font-medium text-surface-900">{detail.agentName ?? "Unassigned"}</span></p>
                {detail.assignmentNote && <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">{detail.assignmentNote}</p>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminLeadsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Loading leads...</p>}>
      <AdminLeadsPageContent />
    </Suspense>
  );
}