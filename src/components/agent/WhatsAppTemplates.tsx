"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Check, Copy, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { waLink } from "@/lib/wa";
import { WHATSAPP_TEMPLATES } from "@/lib/whatsapp-templates";
import type { Lead } from "@/store/types";

const CATEGORIES = Array.from(new Set(WHATSAPP_TEMPLATES.map((t) => t.category)));

export function WhatsAppTemplates({ lead, agentName }: { lead: Lead; agentName: string }) {
  const [selectedId, setSelectedId] = useState(WHATSAPP_TEMPLATES[0].id);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const next = WHATSAPP_TEMPLATES[0].build(lead, agentName);
    setSelectedId(WHATSAPP_TEMPLATES[0].id);
    setText(next);
  }, [lead.id, lead.scholarshipApplied, lead.targetCollege, lead.lookingFor, agentName]);

  function choose(id: string) {
    setSelectedId(id);
    const template = WHATSAPP_TEMPLATES.find((t) => t.id === id);
    if (template) setText(template.build(lead, agentName));
  }

  function copy() {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">WhatsApp message</Label>
        <select
          value={selectedId}
          onChange={(e) => choose(e.target.value)}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-gold-500"
        >
          {CATEGORIES.map((category) => (
            <optgroup key={category} label={category}>
              {WHATSAPP_TEMPLATES.filter((t) => t.category === category).map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[96px] resize-none bg-white text-sm"
      />

      <div className="flex flex-wrap items-center gap-2">
        <a href={waLink(lead.phone, text)} target="_blank" rel="noreferrer">
          <Button className="bg-green-600 text-white hover:bg-green-700">
            <Send className="h-4 w-4" /> Open WhatsApp
          </Button>
        </a>
        <Button variant="outline" className="border-slate-200" onClick={copy}>
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy text"}
        </Button>
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-slate-400">
          <MessageCircle className="h-3 w-3" /> Opens wa.me pre-filled for {lead.phone}
        </span>
      </div>
    </div>
  );
}