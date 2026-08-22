"use client";

import * as React from "react";
import { useState } from "react";
import { AlertCircle, BadgeCheck, Rocket, Sparkles, User, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { SCORE_OPTIONS, type ScoreBand, type Stream } from "@/lib/scholarship";
import { useAppStore } from "@/store/useAppStore";
import type { College, CollegeProgram } from "@/store/types";

const NEEDS = ["Admission Process", "Scholarship", "Education Loan", "Hostel", "Campus Visit", "Career Advice"];
const ADMISSION_TIMELINES = ["This admission cycle", "Within 1 month", "Within 3 months", "Just exploring"];

interface SmartEnquiryModalProps {
  college: EnquiryCollege;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type EnquiryCollege = Pick<College, "id" | "shortName"> & {
  programs: Pick<CollegeProgram, "name" | "stream">[];
};

export function SmartEnquiryModal({ college, open, onOpenChange }: SmartEnquiryModalProps) {
  const authUser = useAppStore((s) => s.authUser);
  const questionnaire = useAppStore((s) => s.questionnaire);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [score, setScore] = useState<ScoreBand>("75-90");
  const [need, setNeed] = useState<string>("Admission Process");
  const [program, setProgram] = useState<string>(college.programs[0]?.name ?? "");
  const [timeline, setTimeline] = useState<string>(ADMISSION_TIMELINES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill from auth user + questionnaire when modal opens
  React.useEffect(() => {
    if (open) {
      if (authUser?.name) setName(authUser.name); // eslint-disable-line react-hooks/set-state-in-effect
      if (authUser?.phone) setPhone(authUser.phone);
      if (questionnaire?.scoreBand) setScore(questionnaire.scoreBand as ScoreBand);
    }
  }, [open, authUser, questionnaire]);

  async function handleSubmit() {
    if (!name.trim() || phone.trim().length < 10) return;
    setLoading(true);
    setError("");
    try {
      const stream = (questionnaire?.stream as Stream) ?? college.programs[0]?.stream ?? "Engineering";
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          stream,
          scoreBand: score,
          source: "College Enquiry",
          targetCollege: college.id,
          targetProgram: program || null,
          lookingFor: need,
          admissionTimeline: timeline,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit enquiry");
      }
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-surface-200 bg-surface-0">
        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-100"><Rocket className="h-8 w-8 text-gold-700" /></div>
            <h3 className="mt-4 font-display text-2xl font-bold text-surface-900">Enquiry sent!</h3>
            <p className="mt-2 text-sm text-surface-600">Your intent just pinged our telecaller CRM live. A counsellor will reach out within minutes.</p>
            <div className="mt-5 flex flex-col gap-2">
              <a href="/agent/dashboard"><Button variant="gold" className="h-11 w-full">Track it in the Agent Portal →</Button></a>
              <Button variant="outline" className="h-11 w-full" onClick={() => onOpenChange(false)}>Done</Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-surface-900">Free counselling — {college.shortName}</DialogTitle>
              <DialogDescription className="text-sm text-surface-600">Send your intent directly to a telecaller who has your opening script ready.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="eq-name" className="text-surface-800">Full name</Label>
                <div className="relative"><User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" /><Input id="eq-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rohan Desai" className="h-11 rounded-2xl border-surface-200 pl-9 focus:border-gold-500 focus:ring-gold-200" /></div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eq-phone" className="text-surface-800">Mobile number</Label>
                <div className="relative"><Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" /><Input id="eq-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="h-11 rounded-2xl border-surface-200 pl-9 focus:border-gold-500 focus:ring-gold-200" /></div>
              </div>

              {college.programs.length > 1 && (
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
              )}

              <div className="space-y-2">
                <Label className="text-surface-800">Your latest score</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SCORE_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setScore(opt.value)} className={cn("rounded-xl border-2 px-3 py-2 text-left text-xs font-semibold transition-all", score === opt.value ? "border-gold-500 bg-gold-50 text-surface-900" : "border-surface-200 text-surface-600 hover:border-gold-200")}>{opt.label}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-surface-800">What do you need help with?</Label>
                <div className="flex flex-wrap gap-2">
                  {NEEDS.map((n) => (
                    <button key={n} onClick={() => setNeed(n)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-all", need === n ? "border-brand-950 bg-brand-950 text-white" : "border-surface-200 text-surface-600 hover:border-gold-200")}>{n}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-surface-800">When do you plan to take admission?</Label>
                <div className="flex flex-wrap gap-2">
                  {ADMISSION_TIMELINES.map((t) => (
                    <button key={t} onClick={() => setTimeline(t)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-all", timeline === t ? "border-brand-950 bg-brand-950 text-white" : "border-surface-200 text-surface-600 hover:border-gold-200")}>{t}</button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button variant="gold" className="h-12 w-full" disabled={!name.trim() || phone.trim().length < 10 || loading} onClick={handleSubmit}>
                <Sparkles className="h-4 w-4" /> {loading ? "Sending..." : "Submit enquiry"}
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-surface-500"><BadgeCheck className="h-3.5 w-3.5 text-gold-700" /> Free enquiry — no payment required</p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
