"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { STREAM_OPTIONS, SCORE_OPTIONS, type ScoreBand, type Stream } from "@/lib/scholarship";
import type { StudentQuestionnaire } from "@/store/types";

const GOALS = ["Corporate placement", "Career in finance", "Career in marketing", "Technology / Analytics", "Start a business", "Higher studies", "Still exploring"];
const TIMELINES = ["Immediately", "This admission cycle", "Within 3 months", "Next academic year", "Just exploring"];
const STATES = ["Assam", "Karnataka", "Maharashtra", "Delhi NCR", "Uttarakhand", "West Bengal", "Gujarat", "Tamil Nadu", "Open to any state"];
const BUDGETS = ["Below ₹5L", "₹5L–₹10L", "₹10L–₹15L", "₹15L–₹25L", "Above ₹25L"];
const PRIORITIES = ["Placement", "Scholarship", "Fees", "Reputation", "Location", "Hostel", "Specialization"];
const CONTACT_TIMES = ["Morning", "Afternoon", "Evening", "Any time"];
const EXAMS = ["CAT", "XAT", "CMAT", "MAT", "GMAT", "JEE Main", "KCET", "CUET", "Not taken yet"];

interface Props {
  onComplete: (answers: StudentQuestionnaire) => void;
  onBack?: () => void;
}

export function StudentQuestionnaire({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [scoreBand, setScoreBand] = useState<ScoreBand | null>(null);
  const [stream, setStream] = useState<Stream | null>(null);
  const [careerGoal, setCareerGoal] = useState("");
  const [admissionTimeline, setAdmissionTimeline] = useState("");
  const [preferredStates, setPreferredStates] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState("");
  const [loanRequired, setLoanRequired] = useState(false);
  const [hostelRequired, setHostelRequired] = useState(false);
  const [entranceExam, setEntranceExam] = useState("");
  const [entranceScore, setEntranceScore] = useState("");
  const [scholarshipPriority, setScholarshipPriority] = useState("");
  const [preferredContactTime, setPreferredContactTime] = useState("");
  const [preferredProgram, setPreferredProgram] = useState("");
  const [specialization, setSpecialization] = useState("");

  const STEPS = [
    { title: "Education", desc: "Your academic profile" },
    { title: "Goals", desc: "Career and timeline" },
    { title: "Location & Budget", desc: "Where and how much" },
    { title: "Preferences", desc: "Contact and priorities" },
  ];
  const totalSteps = STEPS.length;

  function handleFinish() {
    onComplete({
      scoreBand: scoreBand ?? "75-90",
      stream: stream ?? "MBA",
      careerGoal,
      admissionTimeline,
      preferredStates,
      budgetRange,
      loanRequired,
      hostelRequired,
      entranceExam,
      entranceScore,
      scholarshipPriority: scholarshipPriority as "High" | "Medium" | "Low" | undefined,
      preferredContactTime,
      preferredProgram,
      specialization,
    });
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-glass backdrop-blur-xl">
      <div className="h-1.5 bg-surface-200">
        <div className="h-full bg-gradient-to-r from-gold-500 to-gold-400 transition-all duration-400" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
      </div>

      <div className="p-6 sm:p-10">
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-surface-900">Your academic profile</h3>
              <p className="mt-1 text-sm text-surface-600">Which stream and score describe you best?</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Stream</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {STREAM_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setStream(opt.value)} className={cn("flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center text-xs font-semibold transition-all", stream === opt.value ? "border-gold-500 bg-gold-50" : "border-surface-200 hover:border-gold-200")}>
                      <span className="text-lg">{opt.emoji}</span> {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Score</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SCORE_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => setScoreBand(opt.value)} className={cn("rounded-xl border-2 px-4 py-2.5 text-left text-xs font-semibold transition-all", scoreBand === opt.value ? "border-gold-500 bg-gold-50" : "border-surface-200 hover:border-gold-200")}>
                      {opt.label} <span className="ml-2 font-normal text-surface-500">{opt.hint}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Entrance exam</Label>
                <div className="flex flex-wrap gap-2">
                  {EXAMS.map((e) => <button key={e} onClick={() => setEntranceExam(e)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-all", entranceExam === e ? "border-brand-950 bg-brand-950 text-white" : "border-surface-200 text-surface-600 hover:border-gold-200")}>{e}</button>)}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Entrance score <span className="text-surface-400">(optional)</span></Label>
                <input type="text" value={entranceScore} onChange={(e) => setEntranceScore(e.target.value)} placeholder="e.g. 85 percentile" className="h-12 w-full rounded-2xl border border-surface-200 px-4 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200" />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-surface-900">Your goals</h3>
              <p className="mt-1 text-sm text-surface-600">What do you want to achieve, what program and when?</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Program</Label>
                <input type="text" value={preferredProgram} onChange={(e) => setPreferredProgram(e.target.value)} placeholder="e.g. PGDM Business Analytics" className="h-12 w-full rounded-2xl border border-surface-200 px-4 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200" />
              </div>
              <div className="space-y-2">
                <Label>Specialization</Label>
                <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Marketing, Finance, HR..." className="h-12 w-full rounded-2xl border border-surface-200 px-4 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-200" />
              </div>
              <div className="space-y-2">
                <Label>Career goal</Label>
                <div className="flex flex-wrap gap-2">
                  {GOALS.map((g) => <button key={g} onClick={() => setCareerGoal(g)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-all", careerGoal === g ? "border-brand-950 bg-brand-950 text-white" : "border-surface-200 text-surface-600 hover:border-gold-200")}>{g}</button>)}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Admission timeline</Label>
                <div className="flex flex-wrap gap-2">
                  {TIMELINES.map((t) => <button key={t} onClick={() => setAdmissionTimeline(t)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-all", admissionTimeline === t ? "border-brand-950 bg-brand-950 text-white" : "border-surface-200 text-surface-600 hover:border-gold-200")}>{t}</button>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-surface-900">Location & budget</h3>
              <p className="mt-1 text-sm text-surface-600">Where and how much would you like to spend?</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred states</Label>
                <div className="flex flex-wrap gap-2">
                  {STATES.map((s) => <button key={s} onClick={() => setPreferredStates((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-all", preferredStates.includes(s) ? "border-brand-950 bg-brand-950 text-white" : "border-surface-200 text-surface-600 hover:border-gold-200")}>{s}</button>)}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Budget range</Label>
                <div className="flex flex-wrap gap-2">
                  {BUDGETS.map((b) => <button key={b} onClick={() => setBudgetRange(b)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-all", budgetRange === b ? "border-brand-950 bg-brand-950 text-white" : "border-surface-200 text-surface-600 hover:border-gold-200")}>{b}</button>)}
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm text-surface-700"><input type="checkbox" checked={hostelRequired} onChange={(e) => setHostelRequired(e.target.checked)} className="rounded border-surface-300" /> Hostel required</label>
                <label className="flex items-center gap-2 text-sm text-surface-700"><input type="checkbox" checked={loanRequired} onChange={(e) => setLoanRequired(e.target.checked)} className="rounded border-surface-300" /> Education loan required</label>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="font-display text-2xl font-bold text-surface-900">Your preferences</h3>
              <p className="mt-1 text-sm text-surface-600">What matters most, and how should we reach you?</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Top priority</Label>
                <div className="flex flex-wrap gap-2">
                  {PRIORITIES.map((p) => <button key={p} onClick={() => setScholarshipPriority(p)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-all", scholarshipPriority === p ? "border-brand-950 bg-brand-950 text-white" : "border-surface-200 text-surface-600 hover:border-gold-200")}>{p}</button>)}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Preferred contact time</Label>
                <div className="flex flex-wrap gap-2">
                  {CONTACT_TIMES.map((t) => <button key={t} onClick={() => setPreferredContactTime(t)} className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition-all", preferredContactTime === t ? "border-brand-950 bg-brand-950 text-white" : "border-surface-200 text-surface-600 hover:border-gold-200")}>{t}</button>)}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="h-12 flex-1" onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
              <Button variant="gold" className="h-12 flex-1" onClick={handleFinish}><CheckCircle2 className="h-4 w-4" /> Complete profile</Button>
            </div>
          </div>
        )}

        {step < 3 && (
          <div className="mt-6 flex gap-3">
            {step > 0 && <Button variant="outline" className="h-12 flex-1" onClick={() => setStep(step - 1)}><ArrowLeft className="h-4 w-4" /> Back</Button>}
            <Button variant="gold" className="h-12 flex-1" onClick={() => setStep(step + 1)} disabled={(step === 0 && (!stream || !scoreBand)) || (step === 1 && !careerGoal) || (step === 2 && !budgetRange)}>Continue <ArrowRight className="h-4 w-4" /></Button>
          </div>
        )}
      </div>
    </div>
  );
}
