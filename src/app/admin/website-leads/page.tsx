"use client";

import * as React from "react";
import { ExternalLink, MousePointerClick, Users, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/time";
import { cn } from "@/lib/utils";

interface WebsiteLead {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  collegeId: string | null;
  collegeName: string | null;
  program: string | null;
  admissionTimeline: string | null;
  sourceWebsite: string | null;
  userId: string | null;
  createdAt: string;
}

export default function AdminWebsiteLeadsPage() {
  const [leads, setLeads] = React.useState<WebsiteLead[]>([]);
  const [count, setCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  async function loadLeads() {
    try {
      setError("");
      setLoading(true);
      const res = await fetch("/api/website-leads?limit=100");
      if (!res.ok) throw new Error("Failed to load website leads");
      const data = await res.json();
      setLeads(data.leads ?? []);
      setCount(data.count ?? 0);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { loadLeads(); }, []);

  const today = new Date().toDateString();
  const todayCount = leads.filter((l) => new Date(l.createdAt).toDateString() === today).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Website Leads</h1>
          <p className="mt-1 text-sm text-slate-600">
            Students who clicked &ldquo;Visit website&rdquo; on a college page. Captured before redirect.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadLeads} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4 mr-1", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-950 text-gold-400">
              <MousePointerClick className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-brand-950">{count}</p>
              <p className="text-xs text-slate-500">Total website visits captured</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-heading text-xl font-bold text-brand-950">{todayCount}</p>
              <p className="text-xs text-slate-500">Captured today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-brand-950">
            <ExternalLink className="h-4 w-4 text-gold-600" /> Redirect leads
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading website leads...</div>
          ) : leads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <MousePointerClick className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-600">No website visits captured yet.</p>
              <p className="text-xs text-slate-500">
                When a student clicks &ldquo;Visit website&rdquo; on a college page, their details will appear here.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-3">Student</th>
                  <th className="p-3">College</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Admission timeline</th>
                  <th className="p-3">Captured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <p className="text-sm font-semibold text-brand-950">{lead.name}</p>
                      <p className="text-xs text-slate-500">{lead.phone}</p>
                      {lead.email && <p className="text-xs text-slate-500">{lead.email}</p>}
                    </td>
                    <td className="p-3 text-sm text-slate-700">{lead.collegeName ?? lead.collegeId ?? "—"}</td>
                    <td className="p-3 text-sm text-slate-700">{lead.program ?? "—"}</td>
                    <td className="p-3">
                      <Badge className="bg-blue-100 text-blue-700">{lead.admissionTimeline ?? "—"}</Badge>
                    </td>
                    <td className="p-3 text-xs text-slate-500">{timeAgo(lead.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
