"use client";

import * as React from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  Activity,
  AlertCircle,
  BadgeCheck,
  BarChart3,
  FileStack,
  Flame,
  PhoneCall,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatINR, useAppStore } from "@/store/useAppStore";
import { isConverted, LEAD_STATUSES } from "@/lib/scholarship";
import type { Agent } from "@/store/types";

const WEEKS = 8;

function buildWeeklyBuckets(enquiries: { createdAt: string; converted: boolean }[]) {
  const now = new Date();
  const buckets: { label: string; enquiries: number; conversions: number }[] = [];
  for (let w = WEEKS - 1; w >= 0; w--) {
    const start = new Date(now);
    start.setDate(start.getDate() - w * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const weekEnquiries = enquiries.filter((e) => {
      const d = new Date(e.createdAt).getTime();
      return d >= start.getTime() && d < end.getTime();
    });
    buckets.push({
      label: `${start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`,
      enquiries: weekEnquiries.length,
      conversions: weekEnquiries.filter((e) => e.converted).length,
    });
  }
  return buckets;
}

const pipelineColors: Record<string, string> = {
  New: "bg-blue-500",
  Contacted: "bg-amber-500",
  "Application Started": "bg-gold-500",
  "Offer Received": "bg-purple-500",
  Admitted: "bg-green-500",
};

const appStageColors: Record<string, string> = {
  "Docs Pending": "bg-blue-100 text-blue-700",
  Submitted: "bg-amber-100 text-amber-700",
  "Offer Received": "bg-purple-100 text-purple-700",
  Admitted: "bg-green-100 text-green-700",
};

export function AdminDashboard() {
  const leads = useAppStore((s) => s.leads);
  const enquiries = useAppStore((s) => s.enquiries);
  const agents = useAppStore((s) => s.agents);
  const applications = useAppStore((s) => s.applications);
  const colleges = useAppStore((s) => s.colleges);
  const rawStudents = useAppStore((s) => s.rawStudents);
  const payments = useAppStore((s) => s.payments);
  const paidCount = new Set(payments.filter((p) => p.status === "Paid").map((p) => p.studentId)).size;

  const [websiteLeadCount, setWebsiteLeadCount] = React.useState(0);
  React.useEffect(() => {
    fetch("/api/website-leads?limit=1")
      .then((r) => r.json())
      .then((d) => setWebsiteLeadCount(d.count ?? 0))
      .catch(() => {});
  }, []);

  const chartData = React.useMemo(() => buildWeeklyBuckets(enquiries), [enquiries]);

  const totalEnquiries = enquiries.length;
  const conversions = leads.filter((l) => isConverted(l.status)).length;
  const conversionRate = totalEnquiries > 0 ? ((conversions / totalEnquiries) * 100).toFixed(1) : "0";
  const budgetUsed = leads.reduce((sum, l) => sum + l.scholarshipUnlocked, 0);
  const totalBudget = colleges.filter((c) => c.partnerCollege).reduce((sum, college) => sum + (college.scholarships.budget ?? 0), 0);
  const budgetPct = totalBudget > 0 ? Math.min(100, Math.round((budgetUsed / totalBudget) * 100)) : 0;

  const pipeline = LEAD_STATUSES.map((status) => ({
    status,
    count: leads.filter((l) => l.status === status).length,
  }));

  const agentRows: (Agent & { liveLeads: number; liveConversions: number; liveRate: number })[] = agents.map((agent) => {
    const liveLeads = leads.filter((l) => l.agent === agent.name).length;
    const liveConversions = leads.filter((l) => l.agent === agent.name && isConverted(l.status)).length;
    const liveRate = liveLeads > 0 ? (liveConversions / liveLeads) * 100 : 0;
    return { ...agent, liveLeads: liveLeads || agent.leadsAssigned, liveConversions: liveConversions || agent.conversions, liveRate: liveConversions > 0 ? liveRate : agent.conversions / agent.leadsAssigned * 100 };
  });

  const metrics = [
    { label: "Total Enquiries", value: String(totalEnquiries), sub: "all sources", icon: <Activity className="h-5 w-5" />, tone: "bg-brand-950 text-gold-400" },
    { label: "Conversions", value: String(conversions), sub: "application started+", icon: <BadgeCheck className="h-5 w-5" />, tone: "bg-green-100 text-green-700" },
    { label: "Conversion Rate", value: `${conversionRate}%`, sub: "target 4%", icon: <TrendingUp className="h-5 w-5" />, tone: "bg-gold-50 text-gold-600" },
    { label: "Scholarship Used", value: `${budgetPct}%`, sub: `${formatINR(budgetUsed)} of ${formatINR(totalBudget)}`, icon: <Wallet className="h-5 w-5" />, tone: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-950">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Total enquiries vs. conversions · scholarship budget · agent performance</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-slate-600">{m.label}</p>
                <p className="mt-1 font-heading text-3xl font-bold text-brand-950">{m.value}</p>
                <p className="mt-1 text-xs text-slate-500">{m.sub}</p>
              </div>
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", m.tone)}>{m.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Website lead queue</p><p className="mt-1 font-heading text-2xl font-bold text-brand-950">{leads.filter((lead) => lead.source !== "Imported Raw Data").length}</p><p className="mt-1 text-xs text-slate-500">Scholarship Checker and College Enquiry</p></div><Link href="/agent/dashboard" className="text-xs font-semibold text-gold-700 hover:underline">Open agent queue →</Link></CardContent></Card>
        <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Scholarship payments</p><p className="mt-1 font-heading text-2xl font-bold text-brand-950">{paidCount}</p><p className="mt-1 text-xs text-slate-500">paid students</p></div><Link href="/admin/payments" className="text-xs font-semibold text-gold-700 hover:underline">View payments →</Link></CardContent></Card>
        <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Imported student queue</p><p className="mt-1 font-heading text-2xl font-bold text-brand-950">{rawStudents.filter((student) => !student.leadId).length}</p><p className="mt-1 text-xs text-slate-500">{rawStudents.filter((student) => student.leadId).length} converted to leads</p></div><Link href="/admin/raw-data" className="text-xs font-semibold text-gold-700 hover:underline">Manage raw data →</Link></CardContent></Card>
        <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="flex items-center justify-between p-5"><div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Website visits</p><p className="mt-1 font-heading text-2xl font-bold text-brand-950">{websiteLeadCount}</p><p className="mt-1 text-xs text-slate-500">captured before redirect</p></div><Link href="/admin/website-leads" className="text-xs font-semibold text-gold-700 hover:underline">View website leads →</Link></CardContent></Card>
      </div>

      <div id="analytics" className="scroll-mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="border-slate-200 bg-white shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-brand-950">
              <BarChart3 className="h-4 w-4 text-gold-600" />
              Enquiries vs Conversions (weekly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F5B700" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#F5B700" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="navyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0F0D2E" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#0F0D2E" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#647489" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#647489" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: "1px solid #e2e6ee", fontSize: 12 }}
                    formatter={(value, name) => [`${value}`, name === "enquiries" ? "Enquiries" : "Conversions"]}
                  />
                  <Area type="monotone" dataKey="enquiries" stroke="#0F0D2E" strokeWidth={2} fill="url(#navyFill)" />
                  <Area type="monotone" dataKey="conversions" stroke="#F5B700" strokeWidth={2} fill="url(#goldFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card id="budget" className="scroll-mt-6 border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                <Wallet className="h-4 w-4 text-gold-600" />
                Scholarship Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-heading text-3xl font-bold text-brand-950">{formatINR(budgetUsed)}</p>
                  <p className="text-xs text-slate-500">of {formatINR(totalBudget)} allocated across partner colleges</p>
                </div>
                <Badge className={cn(budgetPct > 80 ? "bg-red-100 text-red-700" : "bg-gold-50 text-gold-600")}>
                  {budgetPct}% used
                </Badge>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn("h-full rounded-full transition-all", budgetPct > 80 ? "bg-red-500" : "bg-gradient-to-r from-gold-500 to-gold-600")}
                  style={{ width: `${budgetPct}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-sm font-bold text-brand-950">{leads.length}</p>
                  <p className="text-[10px] text-slate-500">vouchers out</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gold-600">{leads.filter((l) => l.intentLevel === "Hot").length}</p>
                  <p className="text-[10px] text-slate-500">hot intent</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-green-600">{conversions}</p>
                  <p className="text-[10px] text-slate-500">converted</p>
                </div>
              </div>
              <Link href="/admin/budgets" className="mt-4 block text-center text-xs font-semibold text-gold-700 hover:underline">Manage college budgets →</Link>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                <Flame className="h-4 w-4 text-gold-600" />
                Pipeline Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pipeline.map((p) => {
                const pct = leads.length > 0 ? Math.round((p.count / leads.length) * 100) : 0;
                return (
                  <div key={p.status} className="flex items-center gap-3">
                    <span className="w-36 text-xs font-medium text-slate-600">{p.status}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className={cn("h-full rounded-full transition-all", pipelineColors[p.status])} style={{ width: `${Math.max(pct, p.count > 0 ? 6 : 0)}%` }} />
                    </div>
                    <span className="w-8 text-right text-sm font-semibold text-brand-950">{p.count}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card id="applications" className="scroll-mt-6 border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                <FileStack className="h-4 w-4 text-gold-600" />
                Applications by stage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {(["Docs Pending", "Submitted", "Offer Received", "Admitted"] as const).map((stage) => {
                const count = applications.filter((a) => a.stage === stage).length;
                return (
                  <div key={stage} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <Badge className={appStageColors[stage]}>{stage}</Badge>
                    <span className="text-sm font-bold text-brand-950">{count}</span>
                  </div>
                );
              })}
              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
                <span className="text-xs text-slate-500">Closing rate (admitted)</span>
                <span className="text-sm font-bold text-green-600">
                  {applications.length > 0 ? Math.round((applications.filter((a) => a.stage === "Admitted").length / applications.length) * 100) : 0}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card id="agents" className="scroll-mt-6 border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-brand-950">
            <PhoneCall className="h-4 w-4 text-gold-600" />
            Agent Performance
          </CardTitle>
          <span className="text-xs text-slate-500">Live from CRM data</span>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="p-3">Agent</th>
                <th className="p-3">Leads handled</th>
                <th className="p-3">Calls made</th>
                <th className="p-3">Calls connected</th>
                <th className="p-3">Conversions</th>
                <th className="p-3">Conversion rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {agentRows.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white", agent.avatarColor)}>
                        {agent.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-950">{agent.name}</p>
                        <p className="text-xs text-slate-500">Telecaller</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-slate-700">{agent.liveLeads}</td>
                  <td className="p-3 text-sm text-slate-700">{agent.callsMade}</td>
                  <td className="p-3 text-sm text-slate-700">{agent.callsConnected}</td>
                  <td className="p-3 text-sm font-semibold text-green-600">{agent.liveConversions}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div className={cn("h-full rounded-full", agent.liveRate > 25 ? "bg-green-500" : agent.liveRate > 15 ? "bg-gold-500" : "bg-slate-400")} style={{ width: `${Math.min(100, agent.liveRate)}%` }} />
                      </div>
                      <span className="text-xs font-bold text-brand-950">{agent.liveRate.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {leads.length > 12 && (
        <div className="flex items-center gap-2 rounded-2xl border border-gold-500/40 bg-gold-50/80 px-4 py-3 text-xs text-brand-950">
          <AlertCircle className="h-4 w-4 shrink-0 text-gold-600" />
          Strong pipeline — keep routing enquiries and the conversion curve keeps climbing.
        </div>
      )}
    </div>
  );
}
