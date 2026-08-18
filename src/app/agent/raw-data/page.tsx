"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Database, PhoneCall, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { telLink, waLink } from "@/lib/wa";
import type { RawStudentRecord } from "@/store/types";

export default function AgentRawDataPage() {
  const [rawStudents, setRawStudents] = useState<RawStudentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/raw-students");
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setRawStudents(data.rawStudents ?? []);
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  async function updateStudent(id: string, patch: Partial<RawStudentRecord>) {
    setRawStudents((prev) => prev.map((s) => s.id === id ? { ...s, ...patch } : s));
    try { await fetch("/api/raw-students", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...patch }) }); } catch { /* optimistic */ }
  }

  const assigned = rawStudents.filter((s) => s.status === "Assigned");
  const called = rawStudents.filter((s) => s.callStatus === "Connected");
  const pending = rawStudents.filter((s) => s.callStatus === "Not Called");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-950">Imported Students</h1>
        <p className="mt-1 text-sm text-slate-600">Raw student data imported by admin and assigned to you for telecalling.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Assigned to you", value: assigned.length, icon: Database, color: "bg-blue-100 text-blue-700" },
          { label: "Calls connected", value: called.length, icon: PhoneCall, color: "bg-green-100 text-green-700" },
          { label: "Pending calls", value: pending.length, icon: CheckCircle2, color: "bg-amber-100 text-amber-700" },
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
        <p className="text-sm text-slate-500">Loading imported students...</p>
      ) : rawStudents.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <Database className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No imported students assigned yet.</p>
          <p className="text-xs text-slate-500">Ask admin to import a workbook and assign records to you.</p>
        </div>
      ) : (
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-brand-950">Your assigned students ({rawStudents.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="p-3">Student</th>
                  <th className="p-3">Preference</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Budget</th>
                  <th className="p-3">Call Status</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rawStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="p-3">
                      <p className="text-sm font-semibold text-brand-950">{student.studentName}</p>
                      <p className="text-xs text-slate-500">{student.phone}</p>
                    </td>
                    <td className="p-3 text-sm text-slate-700">
                      <p>{student.preferredCollege || "Not selected"}</p>
                      <p className="text-xs text-slate-500">{student.preferredProgram}</p>
                    </td>
                    <td className="p-3 text-sm text-slate-700">{student.scoreBand} · {student.entranceExam}</td>
                    <td className="p-3 text-sm text-slate-700">{student.budgetRange}</td>
                    <td className="p-3">
                      <select
                        value={student.callStatus ?? "Not Called"}
                        onChange={(e) => updateStudent(student.id, { callStatus: e.target.value as RawStudentRecord["callStatus"] })}
                        className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-gold-500"
                      >
                        {["Not Called", "Connected", "No Answer", "Busy", "Wrong Number", "Do Not Call"].map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-3">
                      <Badge variant="secondary">{student.status}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <a href={telLink(student.phone)} target="_blank" rel="noreferrer">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand-950 text-brand-950 hover:bg-brand-950 hover:text-white">
                            <PhoneCall className="h-3 w-3" />
                          </span>
                        </a>
                        <a href={waLink(student.phone, `Hi ${student.studentName}! This is Orion Education. We have your college preference details. Can we help?`)} target="_blank" rel="noreferrer">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                            <MessageCircle className="h-3 w-3" />
                          </span>
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
