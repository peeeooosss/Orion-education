"use client";

import { useState } from "react";
import { BadgeCheck, Lock, LogIn, Rocket, Sparkles, User, Phone } from "lucide-react";
import Link from "next/link";
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
import { StudentQuestionnaire } from "@/components/scholarship/StudentQuestionnaire";
import type { College, StudentQuestionnaire as Questionnaire } from "@/store/types";

const NEEDS = ["Admission Process", "Scholarship", "Education Loan", "Hostel", "Campus Visit", "Career Advice"];

interface SmartEnquiryModalProps {
  college: College;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EnquiryForm({ college, q, onDone }: { college: College; q: Questionnaire; onDone: () => void }) {
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

  if (submitted) {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-100"><Rocket className="h-8 w-8 text-gold-700" /></div>
        <h3 className="mt-4 font-display text-2xl font-bold text-surface-900">Enquiry sent!</h3>
        <p className="mt-2 text-sm text-surface-600">Your intent just pinged our telecaller CRM live. A counsellor will reach out within minutes.</p>
        <div className="mt-4 grid gap-3 rounded-2xl bg-surface-50 p-4 text-left text-xs text-surface-600">
          <div><span className="font-semibold text-surface-900">Profile:</span> {q.scoreBand} · {q.stream} · {q.careerGoal}</div>
          <div><span className="font-semibold text-surface-900">Budget:</span> {q.budgetRange} · Hostel: {q.hostelRequired ? "Yes" : "No"}</div>
          <div><span className="font-semibold text-surface-900">States:</span> {q.preferredStates?.join(", ") || "Any"}</div>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <a href="/agent/dashboard"><Button variant="gold" className="h-11 w-full">Track it in the Agent Portal →</Button></a>
          <Button variant="outline" className="h-11 w-full" onClick={onDone}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-lg font-bold text-surface-900">Smart Enquiry — {college.shortName}</DialogTitle>
        <DialogDescription className="text-sm text-surface-600">This sends your intent directly to a telecaller who has your opening script ready.</DialogDescription>
      </DialogHeader>
      <div className="rounded-2xl bg-surface-50 p-3 text-xs text-surface-600">
        <p className="font-semibold text-surface-900">Your questionnaire summary:</p>
        <p>{q.scoreBand} · {q.stream} · {q.careerGoal} · Budget: {q.budgetRange} · {q.preferredStates?.join(", ") || "Any state"}</p>
      </div>
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
  );
}

export function SmartEnquiryModal({ college, open, onOpenChange }: SmartEnquiryModalProps) {
  const authUser = useAppStore((s) => s.authUser);
  const questionnaire = useAppStore((s) => s.questionnaire);
  const setQuestionnaire = useAppStore((s) => s.setQuestionnaire);
  const [questionnaireOpen, setQuestionnaireOpen] = useState(false);

  function handleClose() { onOpenChange(false); setQuestionnaireOpen(false); }
  function handleQuestionnaireComplete(q: Questionnaire) { setQuestionnaire(q); setQuestionnaireOpen(false); }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border border-surface-200 bg-surface-0">
        {!authUser ? (
          <div className="py-8 text-center">
            <Lock className="mx-auto h-10 w-10 text-gold-600" />
            <h3 className="mt-3 font-display text-xl font-bold text-surface-900">Sign in to enquire</h3>
            <p className="mt-2 text-sm text-surface-600">You need an account before submitting a college enquiry.</p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href="/auth/sign-in?returnTo=/"><Button variant="gold" size="sm"><LogIn className="h-4 w-4" /> Sign In</Button></Link>
              <Link href="/auth/sign-up"><Button variant="outline" size="sm">Sign Up</Button></Link>
            </div>
          </div>
        ) : !questionnaire?.completedAt ? (
          questionnaireOpen ? (
            <StudentQuestionnaire onComplete={handleQuestionnaireComplete} />
          ) : (
            <div className="py-6 text-center">
              <Lock className="mx-auto h-9 w-9 text-gold-600" />
              <h3 className="mt-3 font-display text-lg font-bold text-surface-900">Complete your profile first</h3>
              <p className="mt-2 text-sm text-surface-600">This helps our Agents come prepared with the right opening questions.</p>
              <Button variant="gold" className="mt-4 h-11" onClick={() => setQuestionnaireOpen(true)}>Complete my profile</Button>
            </div>
          )
        ) : (
          <EnquiryForm college={college} q={questionnaire} onDone={handleClose} />
        )}
      </DialogContent>
    </Dialog>
  );
}
