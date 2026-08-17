"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EngagementControls } from "@/components/agent/EngagementControls";
import { useAppStore } from "@/store/useAppStore";
import { ArrowRight, FileSpreadsheet, PhoneCall, Search, UserRound } from "lucide-react";
import type { CallStatus, RawStudentRecord } from "@/store/types";

const rawStatusColors: Record<RawStudentRecord["status"], string> = {
  Unassigned: "bg-slate-100 text-slate-600",
  Assigned: "bg-blue-100 text-blue-700",
  "Call Pending": "bg-blue-100 text-blue-700",
  Calling: "bg-amber-100 text-amber-700",
  Connected: "bg-green-100 text-green-700",
  "Follow-up Required": "bg-gold-100 text-gold-700",
  Qualified: "bg-purple-100 text-purple-700",
  "Converted to Lead": "bg-green-100 text-green-700",
  "Not Interested": "bg-red-100 text-red-700",
  Invalid: "bg-red-100 text-red-700",
  Skipped: "bg-slate-100 text-slate-500",
};

export default function AgentRawDataPage() {
  const rawStudents = useAppStore((s) => s.rawStudents);
  const agents = useAppStore((s) => s.agents);
  const convert = useAppStore((s) => s.convertRawStudentToLead);
  const updateRawStudent = useAppStore((s) => s.updateRawStudent);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [assignment, setAssignment] = useState("ALL");
  const [selected, setSelected] = useState<RawStudentRecord | null>(null);
  const [message, setMessage] = useState("");

  const filtered = rawStudents.filter((student) => {
    const query = search.toLowerCase();
    const matchSearch = !query || [student.studentName, student.phone, student.city, student.preferredCollege, student.preferredProgram].some((value) => value?.toLowerCase().includes(query));
    const matchAssignment = assignment === "ALL" || assignment === "UNASSIGNED" ? (assignment === "ALL" || !student.assignedAgent) : student.assignedAgent === assignment;
    return matchSearch && (status === "all" || student.status === status) && matchAssignment;
  });

  function convertSelected() {
    if (!selected) return;
    const lead = convert(selected.id);
    if (lead) {
      setMessage(`${lead.name} is now a ${lead.intentLevel} lead in the Telecalling CRM.`);
      setSelected(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-gold-700">Telecalling CRM</p><h1 className="mt-1 text-2xl font-bold text-brand-950">Imported Students</h1><p className="mt-1 text-sm text-slate-600">Call Admin-imported student records, save follow-ups and convert qualified students into Leads.</p></div><div className="flex items-center gap-2 rounded-xl bg-brand-950 px-3 py-2 text-xs text-white"><FileSpreadsheet className="h-4 w-4 text-gold-400" /> {rawStudents.length} raw records</div></div>
      {message && <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">{message}<button onClick={() => setMessage("")} className="text-xs underline">Dismiss</button></div>}
      <div className="flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, phone, city or college..." className="h-10 bg-white pl-10" /></div><select value={assignment} onChange={(event) => setAssignment(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="ALL">ALL agents</option><option value="UNASSIGNED">Unassigned</option>{agents.map((agent) => <option key={agent.id} value={agent.name}>{agent.name}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"><option value="all">All statuses</option>{Object.keys(rawStatusColors).map((item) => <option key={item}>{item}</option>)}</select></div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-[980px]"><thead><tr className="border-b border-slate-200 bg-slate-50/60 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500"><th className="p-3.5">Student</th><th className="p-3.5">Preference</th><th className="p-3.5">Profile</th><th className="p-3.5">Budget</th><th className="p-3.5">Assigned</th><th className="p-3.5">Status</th><th className="p-3.5">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.length === 0 ? <tr><td colSpan={7} className="p-14 text-center text-sm text-slate-500">No imported student records match this view.</td></tr> : filtered.map((student) => <tr key={student.id} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelected(student)}><td className="p-3.5"><p className="text-sm font-semibold text-brand-950">{student.studentName}</p><p className="text-xs text-slate-500">{student.phone} · {student.city}</p></td><td className="p-3.5"><p className="text-sm text-slate-700">{student.preferredCollege || "College to be selected"}</p><p className="text-xs text-slate-500">{student.preferredProgram || "Program to be selected"}</p></td><td className="p-3.5"><p className="text-sm font-semibold text-brand-950">{student.scoreBand || "Not provided"}</p><p className="text-xs text-slate-500">{student.entranceExam || "Exam not provided"}</p></td><td className="p-3.5 text-sm text-slate-700">{student.budgetRange || "Not provided"}</td><td className="p-3.5 text-xs text-slate-600">{student.assignedAgent || "Unassigned"}</td><td className="p-3.5"><Badge className={rawStatusColors[student.status]}>{student.status}</Badge><select value={student.callStatus} onChange={(event) => updateRawStudent(student.id, { callStatus: event.target.value as CallStatus })} onClick={(event) => event.stopPropagation()} className="mt-1 h-7 rounded-lg border border-slate-200 bg-white px-1 text-[10px] text-slate-600"><option>Not Called</option><option>Connected</option><option>No Answer</option><option>Busy</option><option>Call Back Requested</option><option>WhatsApp Sent</option><option>Wrong Number</option><option>Do Not Call</option></select></td><td className="p-3.5"><Button size="sm" variant={student.status === "Converted to Lead" ? "outline" : "gold"} className="h-8 text-xs" onClick={(event) => { event.stopPropagation(); setSelected(student); }}><PhoneCall className="h-3.5 w-3.5" /> {student.status === "Converted to Lead" ? "Open" : "Work record"}</Button></td></tr>)}</tbody></table></div>
      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent className="max-w-2xl bg-white"><DialogHeader><DialogTitle className="flex items-center gap-3 text-brand-950"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-white"><UserRound className="h-5 w-5" /></div>{selected?.studentName}<Badge className={selected ? rawStatusColors[selected.status] : ""}>{selected?.status}</Badge></DialogTitle></DialogHeader>{selected && <div className="max-h-[72vh] space-y-5 overflow-y-auto"><div className="grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-2"><div><p className="text-xs text-slate-500">Contact</p><p className="font-semibold text-brand-950">{selected.phone}</p><p className="text-xs text-slate-600">{selected.email}</p></div><div><p className="text-xs text-slate-500">Location</p><p className="font-semibold text-brand-950">{selected.city}, {selected.state}</p><p className="text-xs text-slate-600">{selected.sourceFile}</p></div><div><p className="text-xs text-slate-500">Academic profile</p><p className="font-semibold text-brand-950">{selected.stream} · {selected.scoreBand}</p><p className="text-xs text-slate-600">{selected.entranceExam} · {selected.entranceScore}</p></div><div><p className="text-xs text-slate-500">Requirements</p><p className="font-semibold text-brand-950">{selected.budgetRange}</p><p className="text-xs text-slate-600">Hostel: {selected.hostelRequired ? "Yes" : "No"} · Loan: {selected.loanRequired ? "Yes" : "No"}</p></div></div><EngagementControls record={selected} kind="raw" onConvert={convertSelected} />{selected.leadId && <a href="/agent/dashboard" className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">Lead created. Open Telecalling CRM <ArrowRight className="h-4 w-4" /></a>}</div>}</DialogContent></Dialog>
    </div>
  );
}
