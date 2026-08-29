"use client";

import * as React from "react";
import { ExternalLink, MousePointerClick, Users, RefreshCw, AlertCircle, Plane } from "lucide-react";
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
  source: string | null;
  createdAt: string;
}

type SourceFilter = "all" | "website-visit" | "study-abroad";

const SOURCE_LABEL: Record<string, string> = {
  "website-visit": "Website",
  "study-abroad": "Abroad",
};

export default function AdminWebsiteLeadsPage() {
  const [leads, setLeads] = React.useState<WebsiteLead[]>([]);
  const [count, setCount] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [filter, setFilter] = React.useState<SourceFilter>("all");

  async function loadLeads(source: SourceFilter = filter) {
    try {
      setError("");
      setLoading(true);
      const res = await fetch(`/api/website-leads?limit=100&source=${source}`);
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

  // Load the server-backed list once when the admin view mounts.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => { loadLeads(); }, []);

  function switchFilter(next: SourceFilter) {
    setFilter(next);
    loadLeads(next);
  }

  const today = new Date().toDateString();
  const todayCount = leads.filter((l) => new Date(l.createdAt).toDateString() === today).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Website Leads</h1>
          <p className="mt-1 text-sm text-slate-600">
            Students who enquired on the website — college visits and study-abroad forms.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => loadLeads()} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4 mr-1", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "website-visit", "study-abroad"] as SourceFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => switchFilter(f)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              filter === f ? "bg-brand-950 text-gold-400" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            )}
          >
            {f === "all" && "All"}
            {f === "website-visit" && "College Visits"}
            {f === "study-abroad" && "Study Abroad"}
          </button>
        ))}
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
              <p className="text-xs text-slate-500">{filter === "study-abroad" ? "Study abroad enquiries" : filter === "website-visit" ? "Website visit leads" : "Total leads captured"}</p>
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
            {filter === "study-abroad" ? (
              <Plane className="h-4 w-4 text-indigo-600" />
            ) : (
              <ExternalLink className="h-4 w-4 text-gold-600" />
            )}
            {filter === "study-abroad" ? "Study abroad leads" : "Redirect / enquiry leads"}
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="py-12 text-center text-sm text-slate-500">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <Plane className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-600">No leads in this category yet.</p>
              <p className="text-xs text-slate-500">
                Leads will appear here when students enquire on the website.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-3">Student</th>
                  <th className="p-3">Type</th>
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
                    <td className="p-3">
                      {lead.source === "study-abroad" ? (
                        <Badge className="bg-indigo-100 text-indigo-700">
                          <Plane className="h-3 w-3 mr-1" /> Abroad
                        </Badge>
                      ) : (
                        <Badge className="bg-surface-100 text-slate-600">Website</Badge>
                      )}
                    </td>
                    <td className="p-3 text-sm text-slate-700">{lead.collegeName ?? "—"}</td>
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
