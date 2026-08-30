"use client";

import * as React from "react";
import Link from "next/link";
import { Check, IndianRupee, Lock, LogIn, Radio, Star, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatINR, useAppStore } from "@/store/useAppStore";
import { MBA_PGDM_COLLEGES } from "@/data/college-directory";
import { StudentQuestionnaire } from "./StudentQuestionnaire";
import type { StudentQuestionnaire as Questionnaire } from "@/store/types";

export function ScholarshipUnlockChecker() {
  const authUser = useAppStore((s) => s.authUser);
  const questionnaire = useAppStore((s) => s.questionnaire);
  const payments = useAppStore((s) => s.payments);
  const setQuestionnaire = useAppStore((s) => s.setQuestionnaire);
  const createPayment = useAppStore((s) => s.createPayment);
  const completePayment = useAppStore((s) => s.completePayment);
  const createDemoLeadFromPayment = useAppStore((s) => s.createDemoLeadFromPayment);
  const claimVoucher = useAppStore((s) => s.claimVoucher);

  const [view, setView] = React.useState<"auth" | "questionnaire" | "college-select" | "checkout" | "result">("questionnaire");
  const [selectedPrimaryId, setSelectedPrimaryId] = React.useState<string | null>(null);

  const userPayment = React.useMemo(() => payments.find((p) => p.studentId === authUser?.id && p.purpose === "Scholarship Check" && p.status === "Paid"), [payments, authUser]);
  const existingPayment = React.useMemo(() => payments.find((p) => p.studentId === authUser?.id && p.purpose === "Scholarship Check" && (p.status === "Initiated" || p.status === "Pending")), [payments, authUser]);
  const scholarshipPaid = Boolean(userPayment);

  const computedView = React.useMemo((): typeof view => {
    if (!authUser) return "auth";
    if (scholarshipPaid) return "result";
    if (view === "checkout") return "checkout";
    if (view === "college-select") return "college-select";
    if (questionnaire?.completedAt) return "college-select";
    return "questionnaire";
  }, [authUser, scholarshipPaid, questionnaire, view]);

  const collegeAmounts = React.useMemo(() => {
    return MBA_PGDM_COLLEGES
      .filter((c) => c.isPartnered && c.scholarshipAvailable)
      .map((c) => ({
        id: c.id,
        name: c.name,
        shortName: c.name,
        city: c.location,
        amount: c.maxScholarship,
      }));
  }, []);

  const maxAmount = React.useMemo(() => Math.max(...collegeAmounts.map((c) => c.amount)), [collegeAmounts]);

  const effectivePrimaryId = React.useMemo(() => {
    if (selectedPrimaryId) return selectedPrimaryId;
    if (collegeAmounts.length === 0) return null;
    const sorted = [...collegeAmounts].sort((a, b) => b.amount - a.amount);
    return sorted[0].id;
  }, [selectedPrimaryId, collegeAmounts]);

  const selectedPrimary = collegeAmounts.find((c) => c.id === effectivePrimaryId);

  function handleQuestionnaireComplete(data: Questionnaire) {
    setQuestionnaire(data);
    setView("college-select");
  }

  function handleInitiatePayment() {
    if (!authUser || !questionnaire || !effectivePrimaryId) return;
    if (existingPayment) { setView("checkout"); return; }
    createPayment({
      studentId: authUser.id,
      studentName: authUser.name,
      email: authUser.email,
      phone: authUser.phone,
      collegeIds: MBA_PGDM_COLLEGES.filter((c) => c.isPartnered && c.scholarshipAvailable).map((c) => c.id),
      primaryCollegeId: effectivePrimaryId,
    });
    setView("checkout");
  }

  if (computedView === "auth") {
    return (
      <Card className="p-10 text-center">
        <Lock className="mx-auto h-10 w-10 text-gold-600" />
        <h3 className="mt-4 font-display text-xl font-bold text-surface-900">Sign in to check your scholarship</h3>
        <p className="mt-2 text-sm text-surface-600">You need to be signed in to unlock your personalized scholarship eligibility.</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/auth/sign-in?returnTo=/scholarship"><Button variant="gold" className="h-11"><LogIn className="h-4 w-4" /> Sign In</Button></Link>
          <Link href="/auth/sign-up/student"><Button variant="outline" className="h-11">Sign Up</Button></Link>
        </div>
      </Card>
    );
  }

  if (computedView === "questionnaire") {
    return <StudentQuestionnaire onComplete={handleQuestionnaireComplete} />;
  }

  if (computedView === "college-select") {
    return (
      <Card className="space-y-6 p-6 sm:p-10">
        <div>
          <Badge variant="gold" className="bg-gold-100 text-gold-700">Scholarship match ready</Badge>
          <h3 className="mt-3 font-display text-2xl font-bold text-surface-900">Pick your #1 college</h3>
           <p className="mt-2 text-sm text-surface-600">Your scholarship is valid for MBA and PGDM programs at <b>all Orion partner colleges</b> (Bachelors, Masters &amp; PhD programs are also listed but scholarships currently apply to MBA/PGDM only). Choose your top choice below.</p>
        </div>

        <div className="space-y-2 rounded-2xl bg-gold-50/50 p-4">
          <div className="flex items-center gap-2 text-sm text-surface-700">
            <Star className="h-4 w-4 text-gold-600" />
            <span>Eligible for up to <b>{formatINR(maxAmount)}</b> at {collegeAmounts.length} partner colleges</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Your scholarship amount at each college</p>
          <div className="grid gap-2">
            {collegeAmounts.map((college) => {
              const isSelected = college.id === effectivePrimaryId;
              return (
                <button
                  key={college.id}
                  onClick={() => setSelectedPrimaryId(college.id)}
                  className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? "border-gold-400 bg-gold-50/60 ring-2 ring-gold-400/30"
                      : "border-surface-200 bg-white hover:border-gold-200 hover:bg-gold-50/20"
                  }`}
                >
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    isSelected ? "border-gold-500 bg-gold-500" : "border-surface-300 group-hover:border-gold-400"
                  }`}>
                    {isSelected && <Radio className="h-3 w-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-surface-900 truncate">{college.name}</p>
                    <p className="text-xs text-surface-500">{college.city} · MBA / PGDM programs</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-lg font-bold text-gold-700">{formatINR(college.amount)}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-sm font-medium text-surface-700 text-center">
           Unlock your assured MBA/PGDM scholarship for just <b>₹99</b> — valid at every Orion partner college.
        </p>

        <Button variant="gold" className="h-12 w-full text-base" onClick={handleInitiatePayment} disabled={!effectivePrimaryId}>
          <IndianRupee className="h-4 w-4" /> Unlock for ₹99
        </Button>
        <p className="text-center text-[11px] text-surface-400">Scholarship availability is subject to eligibility and partner-college terms.</p>
      </Card>
    );
  }

  if (computedView === "checkout") {
    const payment = payments.find((p) => p.studentId === authUser?.id && p.purpose === "Scholarship Check" && (p.status === "Initiated" || p.status === "Pending"));
    if (!payment) {
      return (
        <Card className="space-y-4 p-8 text-center">
          <p className="text-sm text-surface-600">Your demo checkout is ready to start again.</p>
          <Button variant="gold" className="h-11 w-full" onClick={handleInitiatePayment}>Unlock for ₹99</Button>
        </Card>
      );
    }

    function handleComplete() {
      completePayment(payment!.id);
      if (!questionnaire) return;
      const lead = createDemoLeadFromPayment(payment!.id, questionnaire);
      if (lead) {
        claimVoucher(lead, {
          perCollegeBreakdown: collegeAmounts.map((c) => ({ collegeId: c.id, collegeName: c.name, amount: c.amount })),
          primaryCollege: selectedPrimary?.name ?? "",
          stream: questionnaire.stream ?? "",
        });
      }
      setView("result");
    }
    return (
      <Card className="space-y-6 p-6 sm:p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient"><IndianRupee className="h-8 w-8 text-gold-500" /></div>
        <div>
          <h3 className="font-display text-2xl font-bold text-surface-900">Confirm scholarship unlock</h3>
           <p className="mt-2 text-sm text-surface-600">Pay ₹99 to unlock your assured MBA/PGDM scholarship at all Orion partner colleges. Bachelors, Masters &amp; PhD programs are also listed but scholarships apply to MBA/PGDM only.</p>
        </div>
        {selectedPrimary && (
          <div className="rounded-2xl bg-gold-50/60 border border-gold-200 p-4 text-sm">
            <p className="text-xs text-surface-500">Your #1 pick</p>
            <p className="mt-1 font-semibold text-surface-900">{selectedPrimary.name} — {formatINR(selectedPrimary.amount)}</p>
          </div>
        )}
        <div className="space-y-2 rounded-2xl bg-surface-50 p-4 text-sm text-surface-700">
          <div className="flex justify-between"><span>MBA/PGDM scholarship check</span><span className="font-semibold">₹99</span></div>
          <div className="flex justify-between"><span>Free consultation</span><span className="text-green-600">Included</span></div>
          <div className="flex justify-between"><span>Agent support</span><span className="text-green-600">Included</span></div>
          <div className="flex justify-between border-t border-surface-200 pt-2 font-bold"><span>Total</span><span>₹99</span></div>
        </div>
        <p className="text-xs text-surface-500">This is a demo — no real payment is charged.</p>
        <Button variant="gold" className="h-12 w-full text-base" onClick={handleComplete}><IndianRupee className="h-4 w-4" /> Pay ₹99 (Demo)</Button>
      </Card>
    );
  }

  if (computedView === "result" && questionnaire && authUser) {
    const payment = payments.find((p) => p.studentId === authUser.id && p.status === "Paid");
    const primary = collegeAmounts.find((c) => c.id === payment?.primaryCollegeId) ?? collegeAmounts[0];
    return (
      <Card className="space-y-5 p-6 sm:p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100"><Check className="h-8 w-8 text-green-600" /></div>
        <div>
          <h3 className="font-display text-2xl font-bold text-surface-900">Payment successful!</h3>
         <p className="mt-2 text-sm text-surface-600">Your assured MBA/PGDM scholarship is <b>unlocked at all Orion partner colleges</b>. Bachelors, Masters &amp; PhD programs are also available on the platform.</p>
        </div>

        <div className="rounded-2xl bg-brand-950 p-5 text-white text-left">
          <div className="flex items-center gap-2 mb-3"><TicketPercent className="h-5 w-5 text-gold-400" /><span className="text-sm font-bold text-gold-400">Your scholarship is valid at:</span></div>
          <div className="space-y-1.5">
            {collegeAmounts.map((c) => (
              <div key={c.id} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${c.id === primary?.id ? "bg-gold-500/20 ring-1 ring-gold-400/40" : ""}`}>
                <div className="flex items-center gap-2">
                  {c.id === primary?.id && <span className="text-[10px] font-bold text-gold-400 uppercase">Your #1</span>}
                  <span className={c.id === primary?.id ? "font-semibold text-white" : "text-white/70"}>{c.shortName}</span>
                </div>
                <span className="font-semibold text-gold-400">{formatINR(c.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-2xl bg-green-50 p-4 text-left text-sm">
          <div className="flex items-center gap-2"><TicketPercent className="h-4 w-4 text-green-600" /><span className="text-green-700 font-semibold">Free counsellor consultation</span></div>
          <div className="flex items-center gap-2"><TicketPercent className="h-4 w-4 text-green-600" /><span className="text-green-700 font-semibold">College and application advice from your personal Agent</span></div>
        </div>

        {payment && <p className="text-xs text-surface-500">Payment #{payment.id.slice(0, 8)} · ₹99 · Demo</p>}
        <Link href="/student/dashboard"><Button variant="gold" className="h-12 w-full">Go to Student Portal →</Button></Link>
      </Card>
    );
  }

  return null;
}
