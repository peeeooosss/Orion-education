"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatINR, useAppStore } from "@/store/useAppStore";
import { IndianRupee, Search, TicketPercent, Users2 } from "lucide-react";

const statusColors: Record<string, string> = {
  Initiated: "bg-slate-100 text-slate-600", Pending: "bg-amber-100 text-amber-700", Paid: "bg-green-100 text-green-700", Failed: "bg-red-100 text-red-700", Cancelled: "bg-slate-100 text-slate-500", Refunded: "bg-purple-100 text-purple-700",
};

export default function AdminPaymentsPage() {
  const payments = useAppStore((s) => s.payments);
  const leads = useAppStore((s) => s.leads);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = !q || [p.studentName, p.email, p.phone, p.id].some((v) => v?.toLowerCase().includes(q));
    return matchSearch && (status === "all" || p.status === status);
  });

  const paidStudents = new Set(payments.filter((p) => p.status === "Paid").map((p) => p.studentId)).size;
  const totalCollection = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const paidToday = payments.filter((p) => p.status === "Paid" && p.paidAt && new Date(p.paidAt).toDateString() === new Date().toDateString()).length;
  const paidLeadCount = payments.filter((p) => p.status === "Paid" && p.leadId).length;

  const selectedPayment = payments.find((p) => p.id === selected);
  const linkedLead = selectedPayment?.leadId ? leads.find((l) => l.id === selectedPayment.leadId) : null;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-brand-950">Scholarship payments</h1><p className="mt-1 text-sm text-slate-600">₹99 scholarship purchases, consultation and lead creation.</p></div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[{ label: "Paid students", value: paidStudents, tone: "bg-green-100 text-green-700", icon: Users2 }, { label: "Total demo collection", value: formatINR(totalCollection), tone: "bg-brand-950 text-gold-400", icon: IndianRupee }, { label: "Paid today", value: paidToday, tone: "bg-gold-100 text-gold-700", icon: TicketPercent }, { label: "Lead connected", value: paidLeadCount, tone: "bg-blue-100 text-blue-700", icon: Users2 }].map((m) => (
          <Card key={m.label} className="border-slate-200 bg-white shadow-sm"><CardContent className="flex items-center gap-4 p-5"><div className={`flex h-11 w-11 items-center justify-center rounded-xl ${m.tone}`}><m.icon className="h-5 w-5" /></div><div><p className="font-heading text-xl font-bold text-brand-950">{m.value}</p><p className="text-xs text-slate-500">{m.label}</p></div></CardContent></Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student, email, phone, payment ID..." className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 text-sm text-slate-900 outline-none focus:border-gold-500" /></div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"><option value="all">All statuses</option><option value="Paid">Paid</option><option value="Pending">Pending</option><option value="Initiated">Initiated</option><option value="Failed">Failed</option></select>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm"><CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[820px]"><thead><tr className="border-b border-slate-200 bg-slate-50/60 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"><th className="p-3.5">Student</th><th className="p-3.5">Amount</th><th className="p-3.5">Status</th><th className="p-3.5">Paid at</th><th className="p-3.5">Lead</th><th className="p-3.5">Agent</th><th className="p-3.5">Action</th></tr></thead>
        <tbody className="divide-y divide-slate-100">
          {filtered.length === 0 ? <tr><td colSpan={7} className="p-14 text-center text-sm text-slate-500">No payments match this view.</td></tr> : filtered.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50"><td className="p-3.5"><p className="text-sm font-semibold text-brand-950">{p.studentName}</p><p className="text-xs text-slate-500">{p.email}</p></td><td className="p-3.5 text-sm font-semibold text-gold-600">{formatINR(p.amount)}</td><td className="p-3.5"><Badge className={statusColors[p.status]}>{p.status}</Badge></td><td className="p-3.5 text-xs text-slate-500">{p.paidAt ? new Date(p.paidAt).toLocaleString("en-IN") : "--"}</td><td className="p-3.5 text-xs">{p.leadId ? <span className="font-semibold text-green-600">Connected</span> : <span className="text-slate-400">Not connected</span>}</td><td className="p-3.5 text-xs text-slate-600">{p.assignedAgent || "--"}</td><td className="p-3.5"><Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => setSelected(p.id)}>View</Button></td></tr>
          ))}
        </tbody></table>
      </CardContent></Card>

      <Dialog open={Boolean(selected)} onOpenChange={(o) => { if (!o) setSelected(null); }}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader><DialogTitle className="text-brand-950">Payment detail</DialogTitle></DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 text-sm">
              <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2">
                <div><p className="text-xs text-slate-500">Student</p><p className="font-semibold text-brand-950">{selectedPayment.studentName}</p></div>
                <div><p className="text-xs text-slate-500">Email</p><p className="text-slate-700">{selectedPayment.email}</p></div>
                <div><p className="text-xs text-slate-500">Amount</p><p className="font-semibold text-gold-600">{formatINR(selectedPayment.amount)}</p></div>
                <div><p className="text-xs text-slate-500">Status</p><Badge className={statusColors[selectedPayment.status]}>{selectedPayment.status}</Badge></div>
                <div><p className="text-xs text-slate-500">Paid</p><p>{selectedPayment.paidAt ? new Date(selectedPayment.paidAt).toLocaleString("en-IN") : "--"}</p></div>
                <div><p className="text-xs text-slate-500">Created</p><p>{new Date(selectedPayment.createdAt).toLocaleString("en-IN")}</p></div>
                <div><p className="text-xs text-slate-500">Scholarship</p><p>{selectedPayment.scholarshipUnlocked ? <span className="text-green-600 font-semibold">Unlocked</span> : <span className="text-slate-400">Locked</span>}</p></div>
                <div><p className="text-xs text-slate-500">Consultation</p><p>{selectedPayment.consultationEligible ? <span className="text-green-600 font-semibold">Active</span> : <span className="text-slate-400">Not active</span>}</p></div>
              </div>
              {linkedLead && (
                <div className="flex items-center justify-between rounded-xl border border-gold-200 bg-gold-50 px-3 py-2 text-xs">
                  <span className="font-semibold text-gold-700">Lead connected: {linkedLead.name} · {linkedLead.targetCollege} · {linkedLead.status}</span>
                  <a href="/agent/dashboard" className="font-semibold text-gold-700 hover:underline">Open Agent CRM →</a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
