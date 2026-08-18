"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AgentRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  active: boolean;
  createdAt: string;
  dailyTarget: number;
  avatarColor: string;
  leadsAssigned: number;
  callsMade: number;
  callsConnected: number;
  conversions: number;
}

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", dailyTarget: 40, avatarColor: "#6366f1" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchAgents(); }, []);

  async function fetchAgents() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/agents");
      if (res.ok) {
        const data = await res.json();
        setAgents(data.agents || []);
      }
    } catch {}
    setLoading(false);
  }

  async function handleCreate() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); setSaving(false); return; }
      setShowForm(false);
      setForm({ name: "", email: "", phone: "", password: "", dailyTarget: 40, avatarColor: "#6366f1" });
      fetchAgents();
    } catch {
      setError("Something went wrong");
    }
    setSaving(false);
  }

  async function toggleActive(id: string, currentActive: boolean) {
    await fetch("/api/admin/agents", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !currentActive }),
    });
    fetchAgents();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Agent Management</h1>
          <p className="text-sm text-slate-500">Create and manage telecaller agent accounts.</p>
        </div>
        <Button variant="gold" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" /> Create Agent</Button>
      </div>

      {showForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-brand-950">New Agent</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1"><Label>Full Name *</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="rounded-xl" /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1"><Label>Password *</Label><Input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Daily Target</Label><Input type="number" value={form.dailyTarget} onChange={(e) => setForm((p) => ({ ...p, dailyTarget: Number(e.target.value) }))} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Avatar Color</Label><Input type="color" value={form.avatarColor} onChange={(e) => setForm((p) => ({ ...p, avatarColor: e.target.value }))} className="h-12 rounded-xl" /></div>
          </div>
          {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <div className="flex gap-3">
            <Button variant="gold" onClick={handleCreate} disabled={saving}>{saving ? "Creating..." : "Create Agent"}</Button>
            <Button variant="outline" onClick={() => { setShowForm(false); setError(""); }}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading agents...</p>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: agent.avatarColor }}>
                {agent.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-brand-950">{agent.name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${agent.active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                    {agent.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{agent.email} {agent.phone ? `· ${agent.phone}` : ""}</p>
              </div>
              <div className="hidden sm:flex gap-6 text-center text-xs">
                <div><p className="font-bold text-brand-950">{agent.leadsAssigned}</p><p className="text-slate-400">Assigned</p></div>
                <div><p className="font-bold text-brand-950">{agent.callsMade}</p><p className="text-slate-400">Calls</p></div>
                <div><p className="font-bold text-brand-950">{agent.callsConnected}</p><p className="text-slate-400">Connected</p></div>
                <div><p className="font-bold text-green-600">{agent.conversions}</p><p className="text-slate-400">Converted</p></div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className={`h-8 text-xs ${agent.active ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}`}
                onClick={() => toggleActive(agent.id, agent.active)}
              >
                {agent.active ? "Deactivate" : "Activate"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
