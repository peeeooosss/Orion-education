"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Phone, Mail, Users, PhoneCall, PhoneOff, TrendingUp, FileStack, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AgentDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  active: boolean;
  avatarColor: string;
  dailyTarget: number;
  leadsAssigned: number;
  callsMade: number;
  callsConnected: number;
  conversions: number;
}

interface LeadRow {
  id: string;
  stage: string;
  source: string;
  leadType: string;
  intentLevel: string | null;
  callStatus: string;
  interestStatus: string;
  targetCollege: string | null;
  targetProgram: string | null;
  scholarshipAmount: string;
  createdAt: string;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
}

interface ApplicationRow {
  id: string;
  collegeName: string | null;
  program: string | null;
  scholarship: string;
  stage: string;
  startedAt: string;
  updatedAt: string;
  contactName: string | null;
}

interface ActivityRow {
  id: string;
  kind: string;
  callResult: string | null;
  interest: string | null;
  note: string | null;
  oldStage: string | null;
  newStage: string | null;
  createdAt: string;
  leadId: string;
  contactName: string | null;
}

interface FollowUpRow {
  id: string;
  dueAt: string;
  followType: string;
  priority: string;
  note: string | null;
  completed: boolean;
  leadId: string;
  contactName: string | null;
}

interface StageCount {
  stage: string;
  count: number;
}

interface SourceCount {
  source: string;
  count: number;
}

const STAGE_COLORS: Record<string, string> = {
  "New": "bg-blue-100 text-blue-700",
  "Contacted": "bg-amber-100 text-amber-700",
  "Qualified": "bg-purple-100 text-purple-700",
  "Application Started": "bg-indigo-100 text-indigo-700",
  "Offer Received": "bg-teal-100 text-teal-700",
  "Admitted": "bg-green-100 text-green-700",
  "Lost": "bg-red-100 text-red-600",
};

const SOURCE_BADGES: Record<string, string> = {
  scholarship: "bg-gold-100 text-gold-700",
  enquiry: "bg-blue-100 text-blue-700",
  raw: "bg-slate-100 text-slate-600",
};

const SOURCE_LABELS: Record<string, string> = {
  scholarship: "Scholarship",
  enquiry: "Enquiry",
  raw: "Imported",
};

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  const [data, setData] = useState<{
    agent: AgentDetail;
    leads: LeadRow[];
    applications: ApplicationRow[];
    recentActivities: ActivityRow[];
    pendingFollowUps: FollowUpRow[];
    stats: {
      totalLeads: number;
      convertedLeads: number;
      activeLeads: number;
      pendingFollowUpCount: number;
      totalApplications: number;
      stageBreakdown: StageCount[];
      sourceBreakdown: SourceCount[];
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"leads" | "applications" | "activity" | "followups">("leads");

  useEffect(() => {
    fetch(`/api/admin/agents/${agentId}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [agentId]);

  if (loading) return <div className="p-8 text-center text-sm text-slate-500">Loading agent details...</div>;
  if (!data) return <div className="p-8 text-center text-sm text-red-500">Agent not found</div>;

  const { agent, leads, applications, recentActivities, pendingFollowUps, stats } = data;
  const initial = agent.name.charAt(0).toUpperCase();
  const conversionRate = stats.totalLeads > 0 ? ((stats.convertedLeads / stats.totalLeads) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/agents")}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white" style={{ backgroundColor: agent.avatarColor }}>
            {initial}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-brand-950">{agent.name}</h1>
              <Badge className={agent.active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}>
                {agent.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {agent.email}</span>
              {agent.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {agent.phone}</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Leads", value: stats.totalLeads, icon: Users, tone: "bg-brand-950 text-gold-400" },
          { label: "Active Leads", value: stats.activeLeads, icon: PhoneCall, tone: "bg-blue-100 text-blue-700" },
          { label: "Converted", value: stats.convertedLeads, icon: CheckCircle2, tone: "bg-green-100 text-green-700" },
          { label: "Conversion Rate", value: `${conversionRate}%`, icon: TrendingUp, tone: "bg-purple-100 text-purple-700" },
          { label: "Pending Follow-ups", value: stats.pendingFollowUpCount, icon: Clock, tone: "bg-amber-100 text-amber-700" },
        ].map((m) => (
          <Card key={m.label} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", m.tone)}>
                <m.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-heading text-xl font-bold text-brand-950">{m.value}</p>
                <p className="text-[11px] text-slate-500">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stage + Source Breakdown */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader><CardTitle className="text-sm font-semibold text-brand-950">Leads by Stage</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.stageBreakdown.map((s) => (
              <div key={s.stage} className="flex items-center justify-between">
                <Badge className={STAGE_COLORS[s.stage] || "bg-slate-100 text-slate-600"}>{s.stage}</Badge>
                <span className="text-sm font-bold text-brand-950">{s.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader><CardTitle className="text-sm font-semibold text-brand-950">Leads by Source</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stats.sourceBreakdown.map((s) => (
              <div key={s.source} className="flex items-center justify-between">
                <Badge className={SOURCE_BADGES[s.source] || "bg-slate-100 text-slate-600"}>{SOURCE_LABELS[s.source] || s.source}</Badge>
                <span className="text-sm font-bold text-brand-950">{s.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1">
        {[
          { key: "leads" as const, label: `Leads (${leads.length})` },
          { key: "applications" as const, label: `Applications (${applications.length})` },
          { key: "activity" as const, label: `Activity (${recentActivities.length})` },
          { key: "followups" as const, label: `Follow-ups (${pendingFollowUps.filter((f) => !f.completed).length} pending)` },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn("flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors", tab === t.key ? "bg-brand-950 text-gold-400" : "text-slate-500 hover:bg-slate-50")}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "leads" && (
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-3">Student</th>
                  <th className="p-3">Source</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Intent</th>
                  <th className="p-3">Call Status</th>
                  <th className="p-3">Target College</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <p className="text-sm font-semibold text-brand-950">{l.contactName || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{l.contactPhone}</p>
                    </td>
                    <td className="p-3"><Badge className={SOURCE_BADGES[l.leadType] || "bg-slate-100 text-slate-600"}>{SOURCE_LABELS[l.leadType] || l.leadType}</Badge></td>
                    <td className="p-3"><Badge className={STAGE_COLORS[l.stage] || "bg-slate-100 text-slate-600"}>{l.stage}</Badge></td>
                    <td className="p-3"><span className={cn("text-xs font-semibold", l.intentLevel === "Hot" ? "text-red-600" : l.intentLevel === "Warm" ? "text-amber-600" : "text-slate-500")}>{l.intentLevel || "—"}</span></td>
                    <td className="p-3 text-xs text-slate-600">{l.callStatus}</td>
                    <td className="p-3 text-xs text-slate-600">{l.targetCollege || "—"}</td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-sm text-slate-500">No leads assigned yet</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {tab === "applications" && (
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-3">Student</th>
                  <th className="p-3">College</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Scholarship</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-3 text-sm font-semibold text-brand-950">{a.contactName || "Unknown"}</td>
                    <td className="p-3 text-sm text-slate-700">{a.collegeName || "—"}</td>
                    <td className="p-3 text-xs text-slate-600">{a.program || "—"}</td>
                    <td className="p-3"><Badge className={STAGE_COLORS[a.stage] || "bg-slate-100 text-slate-600"}>{a.stage}</Badge></td>
                    <td className="p-3 text-sm font-semibold text-green-700">₹{Number(a.scholarship).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-sm text-slate-500">No applications started yet</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {tab === "activity" && (
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="space-y-3 p-4">
            {recentActivities.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
                <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", a.kind === "call" ? "bg-blue-100 text-blue-600" : a.kind === "status_change" ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-600")}>
                  {a.kind === "call" ? <PhoneCall className="h-4 w-4" /> : a.kind === "status_change" ? <TrendingUp className="h-4 w-4" /> : <FileStack className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-brand-950">{a.contactName || a.leadId}</p>
                    <Badge className="bg-slate-100 text-slate-600 text-[10px]">{a.kind}</Badge>
                  </div>
                  {a.oldStage && a.newStage && <p className="text-xs text-slate-500">{a.oldStage} → {a.newStage}</p>}
                  {a.note && <p className="mt-1 text-xs text-slate-600">{a.note}</p>}
                  <p className="mt-1 text-[10px] text-slate-400">{new Date(a.createdAt).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">No recent activity</div>
            )}
          </CardContent>
        </Card>
      )}

      {tab === "followups" && (
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-3">Student</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Due</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingFollowUps.map((f) => {
                  const isOverdue = !f.completed && new Date(f.dueAt) < new Date();
                  return (
                    <tr key={f.id} className={isOverdue ? "bg-red-50/30" : "hover:bg-slate-50"}>
                      <td className="p-3 text-sm font-semibold text-brand-950">{f.contactName || f.leadId}</td>
                      <td className="p-3 text-xs text-slate-600">{f.followType}</td>
                      <td className="p-3">
                        <p className={cn("text-xs", isOverdue ? "font-semibold text-red-600" : "text-slate-600")}>
                          {new Date(f.dueAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </td>
                      <td className="p-3"><Badge className={f.priority === "Important" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}>{f.priority}</Badge></td>
                      <td className="p-3">
                        {f.completed ? (
                          <Badge className="bg-green-100 text-green-700"><CheckCircle2 className="mr-1 h-3 w-3" />Done</Badge>
                        ) : isOverdue ? (
                          <Badge className="bg-red-100 text-red-600"><AlertTriangle className="mr-1 h-3 w-3" />Overdue</Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-700">Pending</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {pendingFollowUps.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-sm text-slate-500">No follow-ups</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
