"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  FileStack,
  Flame,
  LayoutGrid,
  List,
  MessageCircle,
  PhoneCall,
  Radio,
  Sparkles,
  TicketPercent,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/time";
import { telLink, waLink } from "@/lib/wa";
import { formatINR, useAppStore } from "@/store/useAppStore";
import { LEAD_STATUSES, isConverted } from "@/lib/scholarship";
import type { CallStatus, Lead } from "@/store/types";
import { LeadDetailModal } from "./LeadDetailModal";
import { StartApplicationModal } from "./StartApplicationModal";

const STATUSES: Lead["status"][] = [...LEAD_STATUSES];
const CALL_STATUS_OPTIONS: CallStatus[] = ["Not Called", "Connected", "No Answer", "Busy", "Call Back Requested", "WhatsApp Sent", "Wrong Number", "Do Not Call"];

const intentColors: Record<string, string> = {
  Hot: "bg-red-100 text-red-700",
  Warm: "bg-amber-100 text-amber-700",
  Cold: "bg-slate-100 text-slate-600",
};

const columnBg: Record<string, string> = {
  New: "bg-blue-50/60",
  Contacted: "bg-amber-50/60",
  "Application Started": "bg-gold-50/60",
  "Offer Received": "bg-purple-50/60",
  Admitted: "bg-green-50/60",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function waTextFor(lead: Lead) {
  return `Hi ${lead.name}! This is Rohit from Orion Education. You've unlocked ${formatINR(lead.scholarshipUnlocked)} towards ${lead.targetCollege}. Can I help you with ${lead.lookingFor.toLowerCase()}?`;
}

function LeadTable({
  leads,
  lastAddedId,
  onOpen,
  onStartApplication,
}: {
  leads: Lead[];
  lastAddedId: string | null;
  onOpen: (lead: Lead) => void;
  onStartApplication: (lead: Lead) => void;
}) {
  const updateLeadStatus = useAppStore((s) => s.updateLeadStatus);
  const updateLeadEngagement = useAppStore((s) => s.updateLeadEngagement);

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[880px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/60">
            {["Student", "Intent", "Scholarship", "Looking for", "Target College", "Status", "Call Status", "Actions"].map((col) => (
              <th key={col} className="p-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <AnimatePresence initial={false}>
            {leads.map((lead) => {
              const isNew = lead.id === lastAddedId;
              return (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0, backgroundColor: "#fef9c4" }}
                  animate={{ opacity: 1, backgroundColor: isNew ? "#fef9c4" : "#ffffff" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className={cn("group hover:bg-slate-50", isNew && "ring-1 ring-inset ring-gold-500/50")}
                >
                  <td className="p-3.5">
                    <button className="flex items-center gap-3 text-left" onClick={() => onOpen(lead)}>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                        {getInitials(lead.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-brand-950">
                          {lead.name}
                          {isNew && <span className="rounded-full bg-gold-500 px-1.5 py-0.5 text-[9px] font-bold text-brand-950">NEW</span>}
                        </p>
                        <p className="text-xs text-slate-500">{lead.phone} · {timeAgo(lead.createdAt)}</p>
                      </div>
                    </button>
                  </td>
                  <td className="p-3.5">
                    <Badge className={intentColors[lead.intentLevel]}>{lead.intentLevel}</Badge>
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-gold-600">
                      <TicketPercent className="h-3.5 w-3.5" />
                      {formatINR(lead.scholarshipUnlocked)}
                    </span>
                  </td>
                  <td className="p-3.5 text-sm text-slate-700">{lead.lookingFor}</td>
                  <td className="p-3.5 text-sm text-slate-700">{lead.targetCollege}</td>
                  <td className="p-3.5">
                    <Select
                      value={lead.status}
                      onValueChange={(v) => updateLeadStatus(lead.id, v as Lead["status"])}
                    >
                      <SelectTrigger className="h-8 w-40 border-slate-200 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                   <td className="p-3.5">
                     <select
                       value={lead.callStatus ?? "Not Called"}
                       onChange={(event) => updateLeadEngagement(lead.id, { callStatus: event.target.value as CallStatus })}
                       onClick={(event) => event.stopPropagation()}
                       className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-700 outline-none focus:border-gold-500"
                     >
                       {CALL_STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}
                     </select>
                   </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <a href={telLink(lead.phone)} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-brand-950 text-brand-950 hover:bg-brand-950 hover:text-white" aria-label="Call">
                          <PhoneCall className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                      <a href={waLink(lead.phone, waTextFor(lead))} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="icon" className="h-8 w-8 border-green-600 text-green-600 hover:bg-green-600 hover:text-white" aria-label="WhatsApp">
                          <MessageCircle className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                      <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => onOpen(lead)}>
                        <Sparkles className="h-3.5 w-3.5 text-gold-600" /> Script
                      </Button>
                      <Button
                        variant="gold"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => onStartApplication(lead)}
                        disabled={lead.status === "Admitted"}
                      >
                        <FileStack className="h-3.5 w-3.5" /> Apply
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

function KanbanCard({
  lead,
  isNew,
  onOpen,
  onStartApplication,
}: {
  lead: Lead;
  isNew: boolean;
  onOpen: (lead: Lead) => void;
  onStartApplication: (lead: Lead) => void;
}) {
  const markCallConnected = useAppStore((s) => s.markCallConnected);
  return (
    <div
      className={cn(
        "cursor-pointer rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:shadow-md",
        isNew && "ring-2 ring-gold-500"
      )}
      onClick={() => onOpen(lead)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
            {getInitials(lead.name)}
          </div>
          <div>
            <p className="flex items-center gap-1 text-sm font-semibold text-brand-950">
              {lead.name}
              {isNew && <span className="rounded-full bg-gold-500 px-1.5 py-0.5 text-[9px] font-bold text-brand-950">NEW</span>}
            </p>
            <p className="text-[11px] text-slate-500">{lead.phone}</p>
          </div>
        </div>
        <Badge className={intentColors[lead.intentLevel]}>{lead.intentLevel}</Badge>
      </div>
      <p className="mt-2.5 text-xs text-slate-600">{lead.targetCollege}</p>
      <p className="text-xs text-slate-500">Wants: {lead.lookingFor}</p>
      <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
        <span className="flex items-center gap-1 text-sm font-bold text-gold-600">
          <TicketPercent className="h-3.5 w-3.5" /> {formatINR(lead.scholarshipUnlocked)}
        </span>
        <div className="flex items-center gap-1">
          <a href={telLink(lead.phone)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-brand-950 text-brand-950 hover:bg-brand-950 hover:text-white">
              <PhoneCall className="h-3 w-3" />
            </span>
          </a>
          <a href={waLink(lead.phone, waTextFor(lead))} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
              <MessageCircle className="h-3 w-3" />
            </span>
          </a>
          <button
            onClick={(e) => { e.stopPropagation(); markCallConnected(lead.id); }}
            className={cn(
              "flex h-7 items-center justify-center rounded-lg border px-1.5",
              lead.callConnected ? "border-green-200 bg-green-50 text-green-600" : "border-slate-200 text-slate-400"
            )}
            aria-label="Toggle call connected"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onStartApplication(lead); }}
            disabled={lead.status === "Admitted"}
            className="flex h-7 items-center justify-center gap-1 rounded-lg border border-gold-500 bg-gold-50 px-1.5 text-[10px] font-bold text-gold-600 disabled:opacity-40"
            aria-label="Start application"
          >
            <FileStack className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function LeadKanban({
  leads,
  lastAddedId,
  onOpen,
  onStartApplication,
  onDragEnd,
}: {
  leads: Lead[];
  lastAddedId: string | null;
  onOpen: (lead: Lead) => void;
  onStartApplication: (lead: Lead) => void;
  onDragEnd: (result: DropResult) => void;
}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {STATUSES.map((status) => {
          const columnLeads = leads.filter((l) => l.status === status);
          return (
            <div key={status} className={cn("rounded-2xl p-3", columnBg[status])}>
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-950" />
                  <span className="text-sm font-semibold text-brand-950">{status}</span>
                </div>
                <Badge variant="secondary" className="text-xs !text-brand-950">{columnLeads.length}</Badge>
              </div>
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn("min-h-[120px] space-y-2.5 rounded-xl p-1 transition-colors", snapshot.isDraggingOver && "bg-gold-500/10")}
                  >
                    {columnLeads.map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(dragProvided, snapshot) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className={snapshot.isDragging ? "rotate-1 shadow-xl" : ""}
                          >
                            <KanbanCard lead={lead} isNew={lead.id === lastAddedId} onOpen={onOpen} onStartApplication={onStartApplication} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

export function LeadsBoard() {
  const searchParams = useSearchParams();
  const leads = useAppStore((s) => s.leads);
  const updateLeadStatus = useAppStore((s) => s.updateLeadStatus);
  const lastAddedId = useAppStore((s) => s.lastAddedLeadId);
  const clearLastAdded = useAppStore((s) => s.clearLastAddedLead);

  const [view, setView] = React.useState<"table" | "kanban">("table");
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [applyLead, setApplyLead] = React.useState<Lead | null>(null);
  const [applyOpen, setApplyOpen] = React.useState(false);

  const filter = searchParams.get("filter") ?? "all";

  const filtered = React.useMemo(() => {
    if (filter === "new") return leads.filter((l) => l.status === "New");
    if (filter === "hot") return leads.filter((l) => l.intentLevel === "Hot");
    if (filter === "contacted") return leads.filter((l) => l.status === "Contacted" || l.callConnected);
    return leads;
  }, [leads, filter]);

  const newLead = leads.find((l) => l.id === lastAddedId) ?? null;

  const metrics = React.useMemo(() => {
    const all = leads;
    return [
      { label: "Total leads", value: all.length, icon: <AlertCircle className="h-4 w-4" />, tone: "bg-brand-950 text-gold-400" },
      { label: "New today", value: all.filter((l) => l.status === "New").length, icon: <Radio className="h-4 w-4" />, tone: "bg-blue-100 text-blue-700" },
      { label: "Hot leads", value: all.filter((l) => l.intentLevel === "Hot").length, icon: <Flame className="h-4 w-4" />, tone: "bg-red-100 text-red-700" },
      { label: "Calls connected", value: all.filter((l) => l.callConnected).length, icon: <PhoneCall className="h-4 w-4" />, tone: "bg-green-100 text-green-700" },
      { label: "Conversions", value: all.filter((l) => isConverted(l.status)).length, icon: <CheckCircle2 className="h-4 w-4" />, tone: "bg-gold-50 text-gold-600" },
    ];
  }, [leads]);

  function handleDragEnd(result: DropResult) {
    const { destination, draggableId } = result;
    if (!destination) return;
    const newStatus = destination.droppableId as Lead["status"];
    updateLeadStatus(draggableId, newStatus);
  }

  function openLead(lead: Lead) {
    setSelectedLead(lead);
    setModalOpen(true);
  }

  function startApplication(lead: Lead) {
    setApplyLead(lead);
    setApplyOpen(true);
  }

  React.useEffect(() => {
    if (!newLead) return;
    const t = setTimeout(clearLastAdded, 8000);
    return () => clearTimeout(t);
  }, [newLead, clearLastAdded]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">Incoming leads</h1>
          <p className="mt-1 text-sm text-slate-600">
            {filter === "new" ? "Only brand-new leads — call them first." : filter === "hot" ? "Hot intent, high scholarship — your best conversions." : "Every enquiry routed from the student site, live."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-slate-200 bg-white p-1">
            {[
              { key: "table", icon: List, label: "Table" },
              { key: "kanban", icon: LayoutGrid, label: "Board" },
            ].map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key as "table" | "kanban")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                  view === v.key ? "bg-brand-950 text-white" : "text-slate-600 hover:text-brand-950"
                )}
              >
                <v.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {metrics.map((m) => (
          <Card key={m.label} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", m.tone)}>{m.icon}</div>
              <div>
                <p className="font-heading text-xl font-bold text-brand-950">{m.value}</p>
                <p className="text-[11px] text-slate-500">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {newLead && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="flex items-center gap-3 rounded-2xl border border-gold-500/50 bg-gold-50 px-4 py-3 shadow-md shadow-gold-500/10"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-500 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-gold-500" />
            </span>
            <p className="flex-1 text-sm font-semibold text-brand-950">
              New lead received — {newLead.name} just unlocked {formatINR(newLead.scholarshipUnlocked)} for {newLead.targetCollege}.
            </p>
            <Button size="sm" variant="outline" className="border-gold-500 text-gold-600 hover:bg-white" onClick={() => openLead(newLead)}>
              Open script
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <Radio className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-600">No leads in this view yet.</p>
          <p className="text-xs text-slate-500">Submit an enquiry on the student site and it will appear here instantly.</p>
        </div>
      ) : view === "table" ? (
        <LeadTable leads={filtered} lastAddedId={lastAddedId} onOpen={openLead} onStartApplication={startApplication} />
      ) : (
        <LeadKanban leads={filtered} lastAddedId={lastAddedId} onOpen={openLead} onStartApplication={startApplication} onDragEnd={handleDragEnd} />
      )}

      <LeadDetailModal lead={selectedLead} open={modalOpen} onOpenChange={setModalOpen} onStartApplication={startApplication} />
      <StartApplicationModal
        open={applyOpen}
        onOpenChange={setApplyOpen}
        preselectedLeadId={applyLead?.id}
        onCreated={() => setModalOpen(false)}
      />
    </div>
  );
}
