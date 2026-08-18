"use client";

import { useState } from "react";
import { BadgeCheck, Phone, Rocket, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { College } from "@/store/types";

const TIMELINES = ["This admission cycle", "Within 1 month", "Within 3 months", "Just exploring"];

export function EnquirySidebar({ college }: { college: College }) {
  const addLead = useAppStore((s) => s.addLead);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [program, setProgram] = useState<string>(college.programs[0]?.name ?? "");
  const [timeline, setTimeline] = useState<string>(TIMELINES[0]);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!name.trim() || phone.trim().length < 10) return;
    const selected = college.programs.find((p) => p.name === program) ?? college.programs[0];
    addLead({
      name: name.trim(),
      phone: phone.trim(),
      stream: selected?.stream ?? "Engineering",
      scoreBand: "75-90",
      targetCollege: college.id,
      lookingFor: `${selected?.name ?? "Admission"} · ${timeline}`,
      source: "College Enquiry",
    });
    setSubmitted(true);
  }

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-gold-500 bg-white shadow-glow-gold">
      <div className="bg-brand-gradient px-5 py-4 text-white">
        <p className="flex items-center gap-2 font-display text-lg font-bold">
          <Sparkles className="h-4 w-4 text-gold-400" /> Free Enquiry
        </p>
        <p className="mt-0.5 text-xs text-white/70">A counsellor calls you back — no fee, no obligation.</p>
      </div>

      {submitted ? (
        <div className="px-5 py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-100">
            <Rocket className="h-7 w-7 text-gold-700" />
          </div>
          <h3 className="mt-3 font-display text-lg font-bold text-surface-900">Enquiry sent!</h3>
          <p className="mt-1 text-sm text-surface-600">A counsellor will reach out within minutes.</p>
        </div>
      ) : (
        <div className="space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="es-name" className="text-surface-800">Full name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <Input
                id="es-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Desai"
                className="h-11 rounded-2xl border-surface-200 pl-9 focus:border-gold-500 focus:ring-gold-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="es-phone" className="text-surface-800">Mobile number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <Input
                id="es-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="h-11 rounded-2xl border-surface-200 pl-9 focus:border-gold-500 focus:ring-gold-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-surface-800">Program of interest</Label>
            <Select value={program} onValueChange={setProgram}>
              <SelectTrigger className="h-11 w-full rounded-2xl border-surface-200">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {college.programs.map((p) => (
                  <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-surface-800">When do you plan to join?</Label>
            <div className="flex flex-wrap gap-2">
              {TIMELINES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeline(t)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    timeline === t
                      ? "border-brand-950 bg-brand-950 text-white"
                      : "border-surface-200 text-surface-600 hover:border-gold-200"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="gold"
            className="h-12 w-full"
            disabled={!name.trim() || phone.trim().length < 10}
            onClick={handleSubmit}
          >
            <Sparkles className="h-4 w-4" /> Get free counselling
          </Button>
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-surface-500">
            <BadgeCheck className="h-3.5 w-3.5 text-gold-700" /> No payment required
          </p>
        </div>
      )}
    </div>
  );
}
