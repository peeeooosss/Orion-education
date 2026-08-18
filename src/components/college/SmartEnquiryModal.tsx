"use client";

import { useState } from "react";
import { BadgeCheck, Rocket, Sparkles, User, Phone } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { SCORE_OPTIONS, type ScoreBand } from "@/lib/scholarship";
import { useAppStore } from "@/store/useAppStore";
import type { College } from "@/store/types";

const NEEDS = ["Admission Process", "Scholarship", "Education Loan", "Hostel", "Campus Visit", "Career Advice"];

interface SmartEnquiryModalProps {
  college: College;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SmartEnquiryModal({ college, open, onOpenChange }: SmartEnquiryModalProps) {
  const addLead = useAppStore((s) => s.addLead);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [score, setScore] = useState<ScoreBand>("75-90");
  const [need, setNeed] = useState<string>("Admission Process");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!name.trim() || phone.trim().length < 10) return;
    const stream = college.programs[0]?.stream ?? "Engineering";
    addLead({
      name: name.trim(),
      phone: phone.trim(),
      stream,
      scoreBand: score,
      targetCollege: college.id,
      lookingFor: need,
      source: "College Enquiry",
    });
    setSubmitted(true);
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
              <Button variant="gold" className="h-12 w-full" disabled={!name.trim() || phone.trim().length < 10} onClick={handleSubmit}>
                <Sparkles className="h-4 w-4" /> Submit enquiry
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-surface-500"><BadgeCheck className="h-3.5 w-3.5 text-gold-700" /> Free enquiry — no payment required</p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
