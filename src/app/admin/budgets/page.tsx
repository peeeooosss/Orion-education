"use client";

import { useState } from "react";
import { AlertTriangle, Check, Edit3, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR, useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export default function AdminBudgetsPage() {
  const colleges = useAppStore((s) => s.colleges);
  const leads = useAppStore((s) => s.leads);
  const updateBudget = useAppStore((s) => s.updateCollegeScholarshipBudget);
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const rows = colleges.filter((c) => c.partnerCollege).map((college) => {
    const allocated = college.scholarships.budget ?? 0;
    const used = leads.filter((lead) => lead.targetCollege === college.name).reduce((sum, lead) => sum + lead.scholarshipUnlocked, 0);
    const remaining = Math.max(0, allocated - used);
    const percentage = allocated > 0 ? Math.round((used / allocated) * 100) : 0;
    return { college, allocated, used, remaining, percentage };
  });
  const totals = rows.reduce((result, row) => ({ allocated: result.allocated + row.allocated, used: result.used + row.used }), { allocated: 0, used: 0 });
  const totalRemaining = Math.max(0, totals.allocated - totals.used);
  const totalPercentage = totals.allocated > 0 ? Math.round((totals.used / totals.allocated) * 100) : 0;

  function save(id: string) {
    const value = Number(draft);
    if (!Number.isFinite(value) || value < 0) return;
    updateBudget(id, value);
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-950">Scholarship Budgets</h1>
        <p className="mt-1 text-sm text-slate-600">Control the scholarship allocation for every partner college.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total allocated", value: formatINR(totals.allocated), tone: "bg-brand-950 text-gold-400" },
          { label: "Total used", value: formatINR(totals.used), tone: "bg-gold-100 text-gold-700" },
          { label: "Remaining", value: formatINR(totalRemaining), tone: totalPercentage > 80 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700" },
        ].map((metric) => (
          <Card key={metric.label} className="border-slate-200 bg-white shadow-sm"><CardContent className="flex items-center gap-4 p-5"><div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", metric.tone)}><Wallet className="h-5 w-5" /></div><div><p className="font-heading text-xl font-bold text-brand-950">{metric.value}</p><p className="text-xs text-slate-500">{metric.label}</p></div></CardContent></Card>
        ))}
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader><CardTitle className="text-sm font-semibold text-brand-950">Allocation by college</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <thead><tr className="border-b border-slate-200 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"><th className="p-3">College</th><th className="p-3">Allocated</th><th className="p-3">Used</th><th className="p-3">Remaining</th><th className="p-3">Usage</th><th className="p-3">Action</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(({ college, allocated, used, remaining, percentage }) => (
                <tr key={college.id} className="hover:bg-slate-50">
                  <td className="p-3"><p className="text-sm font-semibold text-brand-950">{college.name}</p><p className="text-xs text-slate-500">{college.city}</p></td>
                  <td className="p-3">
                    {editing === college.id ? <input autoFocus type="number" min="0" value={draft} onChange={(event) => setDraft(event.target.value)} className="h-9 w-32 rounded-lg border border-gold-500 px-2 text-sm outline-none" onKeyDown={(event) => { if (event.key === "Enter") save(college.id); if (event.key === "Escape") setEditing(null); }} /> : <span className="text-sm font-semibold text-brand-950">{formatINR(allocated)}</span>}
                  </td>
                  <td className="p-3 text-sm text-slate-700">{formatINR(used)}</td>
                  <td className="p-3 text-sm font-semibold text-green-700">{formatINR(remaining)}</td>
                  <td className="p-3"><div className="flex items-center gap-2"><div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100"><div className={cn("h-full rounded-full", percentage > 80 ? "bg-red-500" : percentage > 50 ? "bg-amber-500" : "bg-green-500")} style={{ width: `${Math.min(100, percentage)}%` }} /></div><Badge className={percentage > 80 ? "bg-red-100 text-red-700" : percentage > 50 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}>{percentage}%</Badge></div></td>
                  <td className="p-3">{editing === college.id ? <Button size="sm" variant="gold" className="h-8" onClick={() => save(college.id)}><Check className="h-3.5 w-3.5" /> Save</Button> : <Button size="sm" variant="outline" className="h-8" onClick={() => { setEditing(college.id); setDraft(String(allocated)); }}><Edit3 className="h-3.5 w-3.5" /> Edit</Button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.some((row) => row.percentage > 80) && <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"><AlertTriangle className="h-4 w-4" /> One or more colleges are above 80% of their allocated scholarship budget.</div>}
        </CardContent>
      </Card>
    </div>
  );
}
