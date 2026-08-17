"use client";

import * as React from "react";
import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  Copy,
  FileStack,
  MessageCircle,
  PhoneCall,
  Sparkles,
  TicketPercent,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateOpeningScript, LEAD_STATUSES } from "@/lib/scholarship";
import { telLink, waLink } from "@/lib/wa";
import { formatINR, useAppStore } from "@/store/useAppStore";
import type { Lead } from "@/store/types";
import { EngagementControls } from "./EngagementControls";

const intentColors: Record<string, string> = {
  Hot: "bg-red-100 text-red-700",
  Warm: "bg-amber-100 text-amber-700",
  Cold: "bg-slate-100 text-slate-600",
};

export function LeadDetailModal({
  lead,
  open,
  onOpenChange,
  onStartApplication,
}: {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartApplication?: (lead: Lead) => void;
}) {
  const updateLeadStatus = useAppStore((s) => s.updateLeadStatus);
  const markCallConnected = useAppStore((s) => s.markCallConnected);
  const [copied, setCopied] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);

  if (!lead) return null;

  const script = generateOpeningScript({
    name: lead.name,
    scholarshipUnlocked: lead.scholarshipUnlocked,
    targetCollege: lead.targetCollege,
    lookingFor: lead.lookingFor,
    agentName: "Rohit",
  });

  const waText = `Hi ${lead.name}! This is Rohit from Orion Education. I can see you've unlocked ${formatINR(lead.scholarshipUnlocked)} towards ${lead.targetCollege}. Shall I help you with ${lead.lookingFor.toLowerCase()}?`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white p-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-5">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
              {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-brand-950">{lead.name}</p>
                <Badge className={intentColors[lead.intentLevel]}>{lead.intentLevel} intent</Badge>
                {lead.intentOverride && <Badge className="bg-brand-100 text-brand-700">Agent override</Badge>}
                {lead.callConnected && (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> Call connected
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {lead.phone} · {lead.source} · assigned to {lead.agent}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[65vh] space-y-5 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-brand-gradient p-4 text-white">
              <p className="flex items-center gap-1.5 text-xs text-white/60">
                <TicketPercent className="h-3.5 w-3.5 text-gold-400" /> Unlocked scholarship
              </p>
              <p className="mt-1 font-heading text-3xl font-black text-gold-400">{formatINR(lead.scholarshipUnlocked)}</p>
              <p className="mt-1 text-[10px] text-white/50">Assured · 48h validity</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Looking for</p>
              <p className="mt-1 text-sm font-semibold text-brand-950">{lead.lookingFor}</p>
              <p className="mt-2 text-xs text-slate-500">Target college</p>
              <p className="mt-1 text-sm font-semibold text-brand-950">{lead.targetCollege}</p>
            </div>
          </div>

          {lead.intentScore !== undefined && (
            <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4">
              <div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Explainable intent</p><p className="text-lg font-bold text-brand-950">{lead.intentScore}/100</p></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-gradient-to-r from-gold-500 to-brand-950" style={{ width: `${lead.intentScore}%` }} /></div>
              <p className="mt-2 text-xs text-slate-600">{lead.intentReasons?.join(" · ") || "Updated from student profile and agent activity."}</p>
            </div>
          )}

          <div className="rounded-2xl border border-gold-500/40 bg-gold-50/60 p-5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-950">
                <Bot className="h-4 w-4 text-gold-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-brand-950">AI opening script</p>
                <p className="text-[10px] text-slate-500">Generated from this lead&apos;s intent &amp; amount</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto h-8 border-gold-500/50 text-gold-600 hover:bg-gold-50"
                onClick={() => {
                  navigator.clipboard?.writeText(script.replace(/"/g, "")).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-800">{script}</p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Quick actions</p>
            <div className="grid gap-2 sm:grid-cols-3">
              <a href={telLink(lead.phone)} target="_blank" rel="noreferrer">
                <Button variant="outline" className="w-full border-brand-950 text-brand-950 hover:bg-brand-950 hover:text-white" onClick={() => markCallConnected(lead.id)}>
                  <PhoneCall className="h-4 w-4" /> Call
                </Button>
              </a>
              <a href={waLink(lead.phone, waText)} target="_blank" rel="noreferrer">
                <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>
              </a>
              <Button
                variant="outline"
                className="w-full border-gold-500 text-gold-600 hover:bg-gold-50"
                onClick={() => {
                  navigator.clipboard?.writeText(waText).catch(() => {});
                  setCopiedWa(true);
                  setTimeout(() => setCopiedWa(false), 1500);
                }}
              >
                {copiedWa ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                {copiedWa ? "Copied" : "Copy WA text"}
              </Button>
            </div>

            <Button
              variant="gold"
              className="w-full"
              disabled={lead.status === "Admitted"}
              onClick={() => {
                onOpenChange(false);
                onStartApplication?.(lead);
              }}
            >
              <FileStack className="h-4 w-4" /> Start Application
            </Button>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-brand-950">Status</p>
                  <p className="text-xs text-slate-500">Update where this lead stands</p>
                </div>
                <Select
                  value={lead.status}
                  onValueChange={(v) => updateLeadStatus(lead.id, v as Lead["status"])}
                >
                  <SelectTrigger className="w-full sm:w-56">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <EngagementControls record={lead} kind="lead" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
