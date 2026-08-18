"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { CheckCircle2, Edit3, FileSpreadsheet, Loader2, Upload, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RawStudentEditModal } from "@/components/admin/RawStudentEditModal";
import type { RawStudentRecord, RawDataBatch } from "@/store/types";

type WorkbookRows = Record<string, unknown>[];

interface AgentOption {
  id: string;
  name: string;
}

export default function AdminRawDataPage() {
  const [rawStudents, setRawStudents] = useState<RawStudentRecord[]>([]);
  const [batches, setBatches] = useState<RawDataBatch[]>([]);
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetName, setSheetName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<WorkbookRows>([]);
  const [fileName, setFileName] = useState("");
  const [agent, setAgent] = useState("");
  const [message, setMessage] = useState("");
  const [importing, setImporting] = useState(false);
  const [editing, setEditing] = useState<RawStudentRecord | null>(null);

  async function refetch() {
    try {
      const [rawRes, agentsRes] = await Promise.all([
        fetch("/api/raw-students"),
        fetch("/api/admin/agents"),
      ]);
      if (rawRes.ok) {
        const data = await rawRes.json();
        setRawStudents(data.rawStudents ?? []);
        setBatches(data.batches ?? []);
      }
      if (agentsRes.ok) {
        const data = await agentsRes.json();
        setAgents((data.agents ?? []).map((a: AgentOption) => ({ id: a.id, name: a.name })));
      }
    } catch {
      // silent
    }
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rawRes, agentsRes] = await Promise.all([
          fetch("/api/raw-students"),
          fetch("/api/admin/agents"),
        ]);
        if (cancelled) return;
        if (rawRes.ok) {
          const data = await rawRes.json();
          setRawStudents(data.rawStudents ?? []);
          setBatches(data.batches ?? []);
        }
        if (agentsRes.ok) {
          const data = await agentsRes.json();
          setAgents((data.agents ?? []).map((a: AgentOption) => ({ id: a.id, name: a.name })));
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function parseSheet(book: XLSX.WorkBook, name: string) {
    const sheet = book.Sheets[name];
    if (!sheet) return;
    const parsed = XLSX.utils.sheet_to_json<WorkbookRows[number]>(sheet, { defval: "" });
    setSheetName(name);
    setRows(parsed);
    setHeaders(parsed.length > 0 ? Object.keys(parsed[0]) : []);
  }

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const book = XLSX.read(await file.arrayBuffer(), { type: "array" });
    setFileName(file.name);
    setWorkbook(book);
    parseSheet(book, book.SheetNames[0] ?? "");
    setMessage("");
  }

  async function loadDemoWorkbook() {
    setImporting(true);
    setMessage("");
    try {
      const res = await fetch("/demo-data/orion-demo-student-raw-data.xlsx");
      if (!res.ok) throw new Error("Failed to fetch demo file");
      const buf = await res.arrayBuffer();
      const book = XLSX.read(buf, { type: "array" });
      setFileName("orion-demo-student-raw-data.xlsx");
      setWorkbook(book);
      parseSheet(book, book.SheetNames[0] ?? "");
      setMessage(`Demo workbook loaded — ${book.SheetNames[0]}`);
    } catch {
      setMessage("Failed to load demo workbook.");
    } finally {
      setImporting(false);
    }
  }

  async function publish() {
    if (!workbook || !sheetName || rows.length === 0) return;
    setImporting(true);
    try {
      const res = await fetch("/api/raw-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: fileName || "Uploaded student workbook",
          sheetName,
          headers,
          rows,
          assignedAgent: agent || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setMessage(`${data.count} student records imported and published to ${agent || "the Agent queue"}.`);
      setRows([]);
      setHeaders([]);
      setWorkbook(null);
      refetch();
    } catch (err) {
      setMessage(`Import failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setImporting(false);
    }
  }

  async function assignRawStudents(ids: string[], agentId: string) {
    for (const id of ids) {
      await fetch(`/api/admin/raw-students/${id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });
    }
    refetch();
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-brand-950">Student RAW DATA</h1><p className="mt-1 text-sm text-slate-600">Import unqualified student details and publish them to the Agent telecalling queue.</p></div>
      {loading ? (
        <p className="text-sm text-slate-500">Loading raw data...</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[{ label: "Imported records", value: rawStudents.length, icon: FileSpreadsheet }, { label: "Import batches", value: batches.length, icon: Upload }, { label: "Assigned agents", value: new Set(rawStudents.map((student) => student.assignedAgent).filter(Boolean)).size, icon: Users2 }].map((metric) => <Card key={metric.label} className="border-slate-200 bg-white shadow-sm"><CardContent className="flex items-center gap-4 p-5"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-100 text-gold-700"><metric.icon className="h-5 w-5" /></div><div><p className="font-heading text-2xl font-bold text-brand-950">{metric.value}</p><p className="text-xs text-slate-500">{metric.label}</p></div></CardContent></Card>)}
          </div>
          <Card className="border-slate-200 bg-white shadow-sm"><CardHeader><CardTitle className="text-sm font-semibold text-brand-950">Import student workbook</CardTitle></CardHeader><CardContent className="space-y-5">
            <div className="flex flex-col gap-3">
              <Button variant="gold" onClick={loadDemoWorkbook} disabled={importing} className="h-11">
                {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                {importing ? "Loading..." : "Load Demo Workbook (20 students)"}
              </Button>
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 text-center transition-colors hover:border-gold-500 hover:bg-gold-50"><Upload className="h-7 w-7 text-gold-600" /><span className="mt-2 text-sm font-semibold text-brand-950">Or choose your own XLSX / CSV file</span><span className="mt-1 text-xs text-slate-500">Supports .xlsx, .xls, .csv</span><input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} className="sr-only" /></label>
            </div>
            {workbook && <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"><div className="flex-1"><p className="text-sm font-semibold text-brand-950">Select worksheet</p><p className="text-xs text-slate-500">Preview the sheet before publishing it to agents.</p></div><select value={sheetName} onChange={(event) => parseSheet(workbook, event.target.value)} className="h-10 rounded-lg border border-slate-200 px-3 text-sm"><option value="" disabled>Select sheet</option>{workbook.SheetNames.map((name) => <option key={name} value={name}>{name}</option>)}</select></div>}
            {rows.length > 0 && <div className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-3"><div><Badge variant="gold" className="bg-gold-100 text-gold-700">{rows.length} rows ready</Badge><span className="ml-2 text-xs text-slate-500">{headers.length} columns detected</span></div><div className="flex items-center gap-2"><select value={agent} onChange={(event) => setAgent(event.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-xs"><option value="">Assign later</option>{agents.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><Button variant="gold" size="sm" onClick={publish} disabled={importing}><CheckCircle2 className="h-4 w-4" /> {importing ? "Importing..." : "Publish to Agents"}</Button></div></div><div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[800px] text-left text-xs"><thead className="bg-slate-50"><tr>{headers.slice(0, 8).map((header) => <th key={header} className="p-3 font-semibold text-slate-500">{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.slice(0, 8).map((row, index) => <tr key={index}>{headers.slice(0, 8).map((header) => <td key={header} className="max-w-48 truncate p-3 text-slate-700">{String(row[header] ?? "")}</td>)}</tr>)}</tbody></table></div></div>}
            {message && <p className="rounded-xl bg-green-50 px-3 py-2 text-sm font-medium text-green-700">{message}</p>}
          </CardContent></Card>
          {batches.length > 0 && <Card className="border-slate-200 bg-white shadow-sm"><CardHeader><CardTitle className="text-sm font-semibold text-brand-950">Import history</CardTitle></CardHeader><CardContent className="space-y-2">{batches.map((batch) => <div key={batch.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><div><p className="text-sm font-semibold text-brand-950">{batch.fileName}</p><p className="text-xs text-slate-500">{batch.sheetName} · {new Date(batch.importedAt).toLocaleString("en-IN")}</p></div><Badge variant="secondary">{batch.rowCount} records</Badge></div>)}</CardContent></Card>}
          {rawStudents.length > 0 && <Card className="border-slate-200 bg-white shadow-sm"><CardHeader><CardTitle className="text-sm font-semibold text-brand-950">Agent assignment queue</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full min-w-[850px] text-left"><thead><tr className="border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500"><th className="p-3">Student</th><th className="p-3">Preference</th><th className="p-3">Status</th><th className="p-3">Assigned agent</th><th className="p-3">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{rawStudents.map((student) => <tr key={student.id}><td className="p-3"><p className="text-sm font-semibold text-brand-950">{student.studentName}</p><p className="text-xs text-slate-500">{student.phone}</p></td><td className="p-3 text-sm text-slate-700">{student.preferredCollege || "Not selected"}</td><td className="p-3"><Badge variant="secondary">{student.status}</Badge></td><td className="p-3"><select value={student.assignedAgent ?? ""} onChange={(event) => assignRawStudents([student.id], event.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs"><option value="">Unassigned</option>{agents.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></td><td className="p-3"><Button size="sm" variant="outline" className="h-8" onClick={() => setEditing(student)}><Edit3 className="h-3.5 w-3.5" /> Edit</Button></td></tr>)}</tbody></table></CardContent></Card>}
          <RawStudentEditModal student={editing} open={Boolean(editing)} onOpenChange={(open) => { if (!open) setEditing(null); }} />
        </>
      )}
    </div>
  );
}
