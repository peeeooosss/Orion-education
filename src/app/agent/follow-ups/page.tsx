"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, PhoneCall, MessageSquare, CheckCircle2, AlertTriangle, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FollowUp {
  id: string;
  leadId: string;
  agentId: string;
  dueAt: string;
  followType: string;
  priority: string;
  note: string | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  leadName: string | null;
  leadPhone: string | null;
  leadType?: string;
  leadStage?: string;
}

const TYPE_ICONS: Record<string, typeof PhoneCall> = {
  Call: PhoneCall,
  WhatsApp: MessageSquare,
  Email: MessageSquare,
  Counselling: CalendarClock,
};

const SOURCE_BADGES: Record<string, string> = {
  scholarship: "bg-gold-100 text-gold-700",
  enquiry: "bg-blue-100 text-blue-700",
  raw: "bg-slate-100 text-slate-600",
};

const SOURCE_LABELS: Record<string, string> = {
  scholarship: "Scholarship",
  enquiry: "Enquiry",
  raw: "Imported Student",
};

export default function AgentFollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [filter, setFilter] = useState<string>("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFollowUps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchFollowUps() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === "overdue") params.set("filter", "overdue");
      else if (filter === "upcoming") params.set("filter", "upcoming");
      // "pending" = all incomplete, "completed" = all completed

      const res = await fetch(`/api/follow-ups?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setFollowUps(data.followUps || []);
      }
    } catch {
      // silent
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchFollowUps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function markComplete(id: string) {
    await fetch(`/api/follow-ups/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: true }),
    });
    setFollowUps((prev) => prev.filter((fu) => fu.id !== id));
  }

  const pending = followUps.filter((fu) => !fu.completed);
  const overdue = pending.filter((fu) => new Date(fu.dueAt) < new Date());
  const today = pending.filter((fu) => {
    const d = new Date(fu.dueAt);
    const now = new Date();
    return d >= now && d.toDateString() === now.toDateString();
  });

  const displayList = filter === "completed" ? followUps.filter((fu) => fu.completed) : pending;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-gold-700">Pipeline</p>
        <h1 className="mt-1 text-2xl font-bold text-brand-950">Follow-ups</h1>
        <p className="mt-1 text-sm text-slate-600">All follow-ups from every source — Enquiry, Scholarship, and Imported Students — in one pipeline.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <button onClick={() => setFilter("pending")} className={`rounded-2xl border p-5 text-left transition-colors ${filter === "pending" ? "border-brand-300 bg-brand-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
          <div className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-brand-500" />
            <p className="text-xs font-medium text-slate-500">Pending</p>
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-brand-950">{pending.length}</p>
        </button>
        <button onClick={() => setFilter("overdue")} className={`rounded-2xl border p-5 text-left transition-colors ${filter === "overdue" ? "border-red-300 bg-red-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <p className="text-xs font-medium text-slate-500">Overdue</p>
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-red-600">{overdue.length}</p>
        </button>
        <button onClick={() => setFilter("today")} className={`rounded-2xl border p-5 text-left transition-colors ${filter === "today" ? "border-gold-300 bg-gold-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-gold-500" />
            <p className="text-xs font-medium text-slate-500">Today</p>
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-brand-950">{today.length}</p>
        </button>
        <button onClick={() => setFilter("completed")} className={`rounded-2xl border p-5 text-left transition-colors ${filter === "completed" ? "border-green-300 bg-green-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <p className="text-xs font-medium text-slate-500">Completed</p>
          </div>
          <p className="mt-2 font-heading text-2xl font-bold text-green-600">{followUps.filter((fu) => fu.completed).length}</p>
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <p className="text-sm text-slate-500">Loading follow-ups...</p>
        </div>
      ) : displayList.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <CalendarClock className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            {filter === "completed" ? "No completed follow-ups yet." : "No pending follow-ups. Great work!"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Follow-ups are created when you set a next action during a call.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/60 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Due</th>
                <th className="p-3.5">Note</th>
                <th className="p-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayList.map((fu) => {
                const Icon = TYPE_ICONS[fu.followType] || PhoneCall;
                const isOverdue = !fu.completed && new Date(fu.dueAt) < new Date();
                return (
                  <tr key={fu.id} className={isOverdue ? "bg-red-50/30" : ""}>
                    <td className="p-3.5">
                      <p className="text-sm font-semibold text-brand-950">{fu.leadName || "Unknown"}</p>
                      <p className="text-xs text-slate-500">{fu.leadPhone}</p>
                    </td>
                    <td className="p-3.5">
                      <Badge className={SOURCE_BADGES[fu.leadType || "enquiry"]}>
                        {SOURCE_LABELS[fu.leadType || "enquiry"]}
                      </Badge>
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-slate-700">
                        <Icon className="h-3.5 w-3.5 text-slate-400" />
                        {fu.followType}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <p className={`text-xs ${isOverdue ? "font-semibold text-red-600" : "text-slate-600"}`}>
                        {new Date(fu.dueAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {isOverdue && <p className="text-[10px] font-medium text-red-500">Overdue</p>}
                    </td>
                    <td className="max-w-xs p-3.5 text-xs text-slate-600">{fu.note || "—"}</td>
                    <td className="p-3.5">
                      {!fu.completed && (
                        <div className="flex items-center gap-2">
                          <Link href={fu.leadType === "raw" ? "/agent/raw-data" : "/agent/dashboard"}>
                            <Button size="sm" variant="outline" className="h-7 text-[11px]">
                              <PhoneCall className="h-3 w-3" /> Open
                            </Button>
                          </Link>
                          <Button size="sm" variant="ghost" className="h-7 text-[11px] text-green-600" onClick={() => markComplete(fu.id)}>
                            <CheckCircle2 className="h-3 w-3" /> Done
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
