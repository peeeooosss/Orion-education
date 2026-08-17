"use client";

import Link from "next/link";
import { CalendarClock, Database, FileStack, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/useAppStore";

export default function AgentFollowUpsPage() {
  const leads = useAppStore((s) => s.leads);
  const rawStudents = useAppStore((s) => s.rawStudents);
  const leadRows = leads.filter((lead) => lead.nextFollowUpAt || lead.remarks?.some((remark) => remark.followUpAt));
  const rawRows = rawStudents.filter((student) => student.nextFollowUpAt || student.remarks.some((remark) => remark.followUpAt));

  return (
    <div className="space-y-6">
      <div><p className="text-sm font-semibold text-gold-700">Your saved work</p><h1 className="mt-1 text-2xl font-bold text-brand-950">Remarks & follow-ups</h1><p className="mt-1 text-sm text-slate-600">Every student you saved for later, with the next action ready to pick up.</p></div>
      <div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="font-heading text-2xl font-bold text-brand-950">{leadRows.length + rawRows.length}</p><p className="text-xs text-slate-500">Saved records</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="font-heading text-2xl font-bold text-brand-950">{leadRows.length}</p><p className="text-xs text-slate-500">Website leads</p></div><div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="font-heading text-2xl font-bold text-brand-950">{rawRows.length}</p><p className="text-xs text-slate-500">Imported students</p></div></div>
      {leadRows.length + rawRows.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center"><CalendarClock className="mx-auto h-10 w-10 text-slate-300" /><p className="mt-3 text-sm font-medium text-slate-600">No follow-ups saved yet.</p><p className="mt-1 text-xs text-slate-500">Open a student, choose a next action and save a follow-up date.</p></div> : <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-[800px]"><thead><tr className="border-b border-slate-200 bg-slate-50/60 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"><th className="p-3.5">Student</th><th className="p-3.5">Category</th><th className="p-3.5">Next action</th><th className="p-3.5">Follow-up</th><th className="p-3.5">Latest remark</th><th className="p-3.5">Open</th></tr></thead><tbody className="divide-y divide-slate-100">{leadRows.map((lead) => <tr key={lead.id}><td className="p-3.5"><p className="text-sm font-semibold text-brand-950">{lead.name}</p><p className="text-xs text-slate-500">{lead.phone}</p></td><td className="p-3.5"><Badge className="bg-gold-100 text-gold-700">Website Lead</Badge></td><td className="p-3.5 text-sm text-slate-700">{lead.nextAction ?? "Call Again"}</td><td className="p-3.5 text-xs text-slate-500">{lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toLocaleString("en-IN") : "See remark"}</td><td className="max-w-xs p-3.5 text-xs text-slate-600">{lead.remarks?.[0]?.text ?? "No remark"}</td><td className="p-3.5"><Link href="/agent/dashboard"><Button size="sm" variant="outline" className="h-8"><PhoneCall className="h-3.5 w-3.5" /> Open Lead</Button></Link></td></tr>)}{rawRows.map((student) => <tr key={student.id}><td className="p-3.5"><p className="text-sm font-semibold text-brand-950">{student.studentName}</p><p className="text-xs text-slate-500">{student.phone}</p></td><td className="p-3.5"><Badge className="bg-blue-100 text-blue-700"><Database className="mr-1 h-3 w-3" /> Imported</Badge></td><td className="p-3.5 text-sm text-slate-700">{student.nextAction ?? "Call Again"}</td><td className="p-3.5 text-xs text-slate-500">{student.nextFollowUpAt ? new Date(student.nextFollowUpAt).toLocaleString("en-IN") : "See remark"}</td><td className="max-w-xs p-3.5 text-xs text-slate-600">{student.remarks[0]?.text ?? "No remark"}</td><td className="p-3.5"><Link href="/agent/raw-data"><Button size="sm" variant="outline" className="h-8"><FileStack className="h-3.5 w-3.5" /> Open Record</Button></Link></td></tr>)}</tbody></table></div>}
    </div>
  );
}
