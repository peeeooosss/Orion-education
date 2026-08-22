"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, animate } from "framer-motion";
import { ArrowLeft, ArrowRight, BadgeCheck, Copy, Loader2, PartyPopper, Phone, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SCORE_OPTIONS, STREAM_OPTIONS, type ScoreBand, type Stream } from "@/lib/scholarship";
import { formatINR, useAppStore } from "@/store/useAppStore";
import type { Lead } from "@/store/types";
import { MBA_PGDM_COLLEGES } from "@/data/college-directory";
import { easeOutExpo, springPop } from "@/lib/motion";
import confetti from "canvas-confetti";

type Step = "info" | "profile" | "college" | "loading" | "result";

const LOADING_MESSAGES = [
  "Scoring your academic profile...",
  "Matching scholarship bands...",
  "Consulting our assurance engine...",
  "Locking in your amount...",
];

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = React.useState(0);
  React.useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.3,
      ease: easeOutExpo,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value]);
  return <span>{formatINR(display)}</span>;
}

function CheckMarkIcon() {
  return (
    <svg className="h-7 w-7 text-gold-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <motion.path
        d="M5 12.5l5 5 9-9"
        strokeWidth="2.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.3 }}
      />
    </svg>
  );
}

export function ScholarshipChecker({ initialCollege }: { initialCollege?: string } = {}) {
  const colleges = useAppStore((s) => s.colleges);
  const claimVoucher = useAppStore((s) => s.claimVoucher);

  const [step, setStep] = React.useState<Step>("info");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [stream, setStream] = React.useState<Stream | null>(null);
  const [scoreBand, setScoreBand] = React.useState<ScoreBand | null>(null);
  const [collegeId, setCollegeId] = React.useState<string | null>(initialCollege ?? null);
  const [lead, setLead] = React.useState<Lead | null>(null);
  const [loadingIdx, setLoadingIdx] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [claimed, setClaimed] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    if (step !== "loading") return;
    const interval = setInterval(() => {
      setLoadingIdx((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, 550);
    const timer = setTimeout(() => {
      clearInterval(interval);
      setStep("result");
    }, 2600);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [step]);

  React.useEffect(() => {
    if (step !== "result" || showConfetti) return;
    const stateTimer = window.setTimeout(() => setShowConfetti(true), 0);
    const duration = 2.5;
    const end = Date.now() + duration * 1000;
    const frame = () => {
      window.requestAnimationFrame(() => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { y: 0.6 },
          zIndex: 9999,
        });
        if (Date.now() < end) frame();
      });
    };
    frame();
    return () => window.clearTimeout(stateTimer);
  }, [step, showConfetti]);

  async function handleStartGenerate() {
    if (!name.trim() || !phone.trim() || !stream || !scoreBand || !collegeId) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          stream,
          scoreBand,
          targetCollege: collegeId,
          lookingFor: "Scholarship & Admission",
          source: "Scholarship Checker",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save your details");
      }
      const data = await res.json();
      const collegeName =
        MBA_PGDM_COLLEGES.find((c) => c.id === collegeId)?.name ??
        colleges.find((c) => c.id === collegeId)?.name ??
        collegeId;
      const createdLead: Lead = {
        id: data.lead.id,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        intentLevel: (data.lead.intentLevel ?? "Warm") as Lead["intentLevel"],
        scoreBand,
        scholarshipUnlocked: Number(data.lead.scholarshipAmount ?? 0),
        lookingFor: "Scholarship & Admission",
        targetCollege: data.lead.targetCollege ?? collegeName,
        status: "New",
        callConnected: false,
        source: "Scholarship Checker",
        createdAt: data.lead.createdAt ?? new Date().toISOString(),
        agent: data.lead.assignedAgent ?? "Orion Desk",
        callStatus: "Not Called",
        interestStatus: "Not Assessed",
        remarks: [],
        intentScore: 0,
        intentReasons: [],
        leadType: "scholarship",
        scholarshipApplied: true,
      };
      setLead(createdLead);
      setLoadingIdx(0);
      setStep("loading");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClaim() {
    if (!lead) return;
    claimVoucher(lead);
    setClaimed(true);
  }

  const canContinue =
    step === "info" ? name.trim().length > 0 && phone.trim().length >= 10 : false;

  const stepWidth = step === "info" ? "25%" : step === "profile" ? "50%" : step === "college" ? "75%" : step === "loading" ? "90%" : "100%";

  return (
    <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-glass backdrop-blur-xl">
      <div className="h-1.5 bg-surface-200">
        <motion.div
          className="h-full bg-gradient-to-r from-gold-500 to-gold-400"
          initial={{ width: "25%" }}
          animate={{ width: stepWidth }}
          transition={{ duration: 0.4, ease: easeOutExpo }}
        />
      </div>

      <div className="p-6 sm:p-10">
        <AnimatePresence mode="wait">
          {step === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              className="space-y-6"
            >
              <div>
                <Badge variant="gold" className="bg-gold-100 text-gold-700">Step 1 of 3</Badge>
                <h3 className="mt-3 font-display text-2xl font-bold text-surface-900 sm:text-3xl">
                  Who should we prepare your voucher for?
                </h3>
                <p className="mt-1 text-sm text-surface-600">
                  Your scholarship is computed instantly from your profile. No spam, ever.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sc-name" className="text-surface-800">Full name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" strokeWidth={1.75} />
                    <Input
                      id="sc-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rohan Desai"
                      className="h-12 rounded-2xl border-surface-200 pl-9 focus:border-gold-500 focus:ring-gold-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sc-phone" className="text-surface-800">Mobile number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" strokeWidth={1.75} />
                    <Input
                      id="sc-phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="h-12 rounded-2xl border-surface-200 pl-9 focus:border-gold-500 focus:ring-gold-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sc-email" className="text-surface-800">
                    Email <span className="text-surface-400">(optional)</span>
                  </Label>
                  <Input
                    id="sc-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-12 rounded-2xl border-surface-200 focus:border-gold-500 focus:ring-gold-200"
                  />
                </div>
              </div>

              <Button
                variant="gold"
                className="h-12 w-full"
                disabled={!canContinue}
                onClick={() => setStep("profile")}
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              className="space-y-6"
            >
              <div>
                <Badge variant="gold" className="bg-gold-100 text-gold-700">Step 2 of 3</Badge>
                <h3 className="mt-3 font-display text-2xl font-bold text-surface-900 sm:text-3xl">
                  Tell us about your stream
                </h3>
                <p className="mt-1 text-sm text-surface-600">Pick the course family you&apos;re targeting.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {STREAM_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStream(opt.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all",
                      stream === opt.value
                        ? "border-gold-500 bg-gold-50 shadow-sm"
                        : "border-surface-200 hover:border-gold-200 hover:bg-surface-50"
                    )}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-sm font-semibold text-surface-900">{opt.label}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <Label className="text-surface-800">Your latest score</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SCORE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setScoreBand(opt.value)}
                      className={cn(
                        "flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left transition-all",
                        scoreBand === opt.value
                          ? "border-gold-500 bg-gold-50"
                          : "border-surface-200 hover:border-gold-200"
                      )}
                    >
                      <div>
                        <p className="text-sm font-semibold text-surface-900">{opt.label}</p>
                        <p className="text-xs text-surface-500">{opt.hint}</p>
                      </div>
                      {scoreBand === opt.value && <BadgeCheck className="h-5 w-5 text-gold-700" strokeWidth={1.75} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="h-12 flex-1" onClick={() => setStep("info")}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  variant="gold"
                  className="h-12 flex-1"
                  disabled={!stream || !scoreBand}
                  onClick={() => setStep("college")}
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "college" && (
            <motion.div
              key="college"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              className="space-y-6"
            >
              <div>
                <Badge variant="gold" className="bg-gold-100 text-gold-700">Step 3 of 3</Badge>
                <h3 className="mt-3 font-display text-2xl font-bold text-surface-900 sm:text-3xl">
                  Which college do you have your eye on?
                </h3>
                <p className="mt-1 text-sm text-surface-600">
                  Assured amounts scale with college prestige. Select your target.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {colleges.map((college) => (
                  <button
                    key={college.id}
                    onClick={() => setCollegeId(college.id)}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-2xl border-2 p-4 text-left transition-all",
                      collegeId === college.id
                        ? "border-gold-500 bg-gold-50 shadow-sm"
                        : "border-surface-200 hover:border-gold-200 hover:bg-surface-50"
                    )}
                  >
                    <div>
                      <p className="text-sm font-semibold text-surface-900">{college.name}</p>
                      <p className="text-xs text-surface-500">
                        {college.city} · {college.type}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-bold text-gold-700 ring-1 ring-gold-200">
                      ★ {college.rating.toFixed(1)}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="h-12 flex-1" onClick={() => setStep("profile")}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  variant="gold"
                  className="h-12 flex-1"
                  disabled={!collegeId || submitting}
                  onClick={handleStartGenerate}
                >
                  <Sparkles className="h-4 w-4" />
                  {submitting ? "Saving..." : "Generate my scholarship"}
                </Button>
              </div>
              {error && (
                <p className="mt-3 text-center text-sm font-medium text-red-600">{error}</p>
              )}
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-[420px] flex-col items-center justify-center text-center"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0px 0px rgba(245,183,0,0.4)",
                    "0 0 24px 8px rgba(245,183,0,0.35)",
                    "0 0 0px 0px rgba(245,183,0,0.4)",
                  ],
                }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute inset-0 rounded-full bg-gold-500/30 animate-ping" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-brand-gradient shadow-glass shadow-gold-500/30 ring-4 ring-gold-500/40">
                  <Loader2 className="h-10 w-10 animate-spin text-gold-500" />
                </div>
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-8 text-lg font-medium text-surface-900"
                >
                  {LOADING_MESSAGES[loadingIdx]}
                </motion.p>
              </AnimatePresence>
              <p className="mt-2 text-sm text-surface-500">Hang tight — this takes a few seconds.</p>
            </motion.div>
          )}

          {step === "result" && lead && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springPop}
              className="space-y-6"
            >
              <motion.div
                initial={{ rotate: -8, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ ...springPop, delay: 0.15 }}
                className="relative overflow-hidden rounded-3xl bg-brand-deep p-8 text-white shadow-2xl shadow-brand-950/40 ring-1 ring-white/20"
              >
                <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gold-500/20 blur-2xl" />
                <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

                <div className="absolute right-6 top-6">
                  <CheckMarkIcon />
                </div>

                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-400">
                  <PartyPopper className="h-4 w-4" strokeWidth={1.75} /> Assured Scholarship Voucher
                </p>
                <p className="mt-4 font-display text-sm text-white/70">Hello {lead.name}, your unlocked amount</p>
                <p className="mt-1 font-display text-5xl font-extrabold tracking-tight text-gold-400 sm:text-6xl tabular-nums">
                  <CountUp value={lead.scholarshipUnlocked} />
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium ring-1 ring-white/25">
                    {lead.targetCollege}
                  </span>
                  <Badge variant="gold" className="bg-gold-100 text-gold-700">
                    Intent: {lead.intentLevel}
                  </Badge>
                </div>
                <p className="mt-6 text-xs text-white/50">
                  Valid for 48 hours · Voucher #{lead.id.toUpperCase().slice(0, 8)}
                </p>
              </motion.div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  variant="gold"
                  className="h-12"
                  disabled={claimed}
                  onClick={handleClaim}
                >
                  {claimed ? <BadgeCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {claimed ? "Voucher claimed!" : "Claim this voucher"}
                </Button>
                <Link href="/student/dashboard">
                  <Button variant="outline" className="h-12 w-full">
                    Track in Student Portal →
                  </Button>
                </Link>
              </div>

              <div className="rounded-2xl bg-brand-950 p-5 text-white">
                <p className="text-sm font-semibold text-gold-400">What happens next?</p>
                <p className="mt-1 text-sm text-white/70">
                  Your details are live in our counsellor&apos;s CRM right now. A telecaller will reach out with your
                  personalised opening plan — or call them first from the Agent Portal.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
