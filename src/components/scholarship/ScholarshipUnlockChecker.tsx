"use client";

import * as React from "react";
import Link from "next/link";
import { Check, IndianRupee, Lock, LogIn, Star, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatINR, useAppStore } from "@/store/useAppStore";
import { StudentQuestionnaire } from "./StudentQuestionnaire";
import type { StudentQuestionnaire as Questionnaire } from "@/store/types";

export function ScholarshipUnlockChecker() {
  const authUser = useAppStore((s) => s.authUser);
  const questionnaire = useAppStore((s) => s.questionnaire);
  const payments = useAppStore((s) => s.payments);
  const colleges = useAppStore((s) => s.colleges);
  const setQuestionnaire = useAppStore((s) => s.setQuestionnaire);
  const createPayment = useAppStore((s) => s.createPayment);
  const completePayment = useAppStore((s) => s.completePayment);
  const createDemoLeadFromPayment = useAppStore((s) => s.createDemoLeadFromPayment);

  const [view, setView] = React.useState<"auth" | "questionnaire" | "unlock" | "checkout" | "result">("questionnaire");
  const userPayment = React.useMemo(() => payments.find((p) => p.studentId === authUser?.id && p.purpose === "Scholarship Check" && p.status === "Paid"), [payments, authUser]);
  const existingPayment = React.useMemo(() => payments.find((p) => p.studentId === authUser?.id && p.purpose === "Scholarship Check" && (p.status === "Initiated" || p.status === "Pending")), [payments, authUser]);
  const scholarshipPaid = Boolean(userPayment);

  const computedView = React.useMemo((): typeof view => {
    if (!authUser) return "auth";
    if (scholarshipPaid) return "result";
    if (view === "checkout") return "checkout";
    if (questionnaire?.completedAt) return "unlock";
    return "questionnaire";
  }, [authUser, scholarshipPaid, questionnaire, view]);

  function handleQuestionnaireComplete(data: Questionnaire) {
    setQuestionnaire(data);
    setView("unlock");
  }

  function handleInitiatePayment() {
    if (!authUser || !questionnaire) return;
    if (existingPayment) { setView("checkout"); return; }
    createPayment({ studentId: authUser.id, studentName: authUser.name, email: authUser.email, phone: authUser.phone, collegeIds: colleges.map((c) => c.id) });
    setView("checkout");
  }

  const estimate = questionnaire ? 40000 + (questionnaire.scoreBand === "90+" ? 20000 : questionnaire.scoreBand === "75-90" ? 12000 : questionnaire.scoreBand === "60-75" ? 8000 : 5000) : 0;

  if (computedView === "auth") {
    return (
      <Card className="p-10 text-center">
        <Lock className="mx-auto h-10 w-10 text-gold-600" />
        <h3 className="mt-4 font-display text-xl font-bold text-surface-900">Sign in to check your scholarship</h3>
        <p className="mt-2 text-sm text-surface-600">You need to be signed in to unlock your personalized scholarship eligibility.</p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/auth/sign-in?returnTo=/scholarship"><Button variant="gold" className="h-11"><LogIn className="h-4 w-4" /> Sign In</Button></Link>
          <Link href="/auth/sign-up"><Button variant="outline" className="h-11">Sign Up</Button></Link>
        </div>
      </Card>
    );
  }

  if (computedView === "questionnaire") {
    return <StudentQuestionnaire onComplete={handleQuestionnaireComplete} />;
  }

  if (computedView === "unlock") {
    return (
      <Card className="space-y-5 p-6 sm:p-10">
        <div>
          <Badge variant="gold" className="bg-gold-100 text-gold-700">Scholarship match ready</Badge>
          <h3 className="mt-3 font-display text-2xl font-bold text-surface-900">Your personalized college and scholarship match is ready</h3>
          <p className="mt-2 text-sm text-surface-600">We have matched your profile with partner colleges and estimated your scholarship eligibility.</p>
        </div>

        <div className="space-y-3 rounded-2xl bg-gold-50/50 p-5">
          <div className="flex items-center gap-3"><Star className="h-5 w-5 text-gold-600" /><span className="text-sm font-semibold text-surface-900">Estimated scholarship: up to {formatINR(estimate)}</span></div>
          <div className="flex items-center gap-3"><Star className="h-5 w-5 text-gold-600" /><span className="text-sm font-semibold text-surface-900">College matches based on your profile</span></div>
          <div className="flex items-center gap-3"><Star className="h-5 w-5 text-gold-600" /><span className="text-sm font-semibold text-surface-900">Free counsellor and agent guidance</span></div>
          <div className="flex items-center gap-3"><Star className="h-5 w-5 text-gold-600" /><span className="text-sm font-semibold text-surface-900">Application and document support</span></div>
        </div>

        <p className="text-sm font-medium text-surface-700 text-center">Unlock your assured and deserving scholarship at our partner colleges and get free consultation — just ₹49</p>

        <Button variant="gold" className="h-12 w-full text-base" onClick={handleInitiatePayment}><IndianRupee className="h-4 w-4" /> Unlock for ₹49</Button>
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
          <Button variant="gold" className="h-11 w-full" onClick={handleInitiatePayment}>Unlock for ₹49</Button>
        </Card>
      );
    }

    function handleComplete() {
      completePayment(payment!.id);
      if (!questionnaire) return;
      createDemoLeadFromPayment(payment!.id, questionnaire);
      setView("result");
    }
    return (
      <Card className="space-y-6 p-6 sm:p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient"><IndianRupee className="h-8 w-8 text-gold-500" /></div>
        <div>
          <h3 className="font-display text-2xl font-bold text-surface-900">Confirm scholarship unlock</h3>
          <p className="mt-2 text-sm text-surface-600">Pay ₹49 to unlock your assured scholarship eligibility and free consultation.</p>
        </div>
        <div className="space-y-2 rounded-2xl bg-surface-50 p-4 text-sm text-surface-700">
          <div className="flex justify-between"><span>Scholarship check</span><span className="font-semibold">₹49</span></div>
          <div className="flex justify-between"><span>Free consultation</span><span className="text-green-600">Included</span></div>
          <div className="flex justify-between"><span>Agent support</span><span className="text-green-600">Included</span></div>
          <div className="flex justify-between border-t border-surface-200 pt-2 font-bold"><span>Total</span><span>₹49</span></div>
        </div>
        <p className="text-xs text-surface-500">This is a demo — no real payment is charged.</p>
        <Button variant="gold" className="h-12 w-full text-base" onClick={handleComplete}><IndianRupee className="h-4 w-4" /> Pay ₹49 (Demo)</Button>
      </Card>
    );
  }

  if (computedView === "result" && questionnaire && authUser) {
    const payment = payments.find((p) => p.studentId === authUser.id && p.status === "Paid");
    return (
      <Card className="space-y-5 p-6 sm:p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100"><Check className="h-8 w-8 text-green-600" /></div>
        <div>
          <h3 className="font-display text-2xl font-bold text-surface-900">Payment successful!</h3>
          <p className="mt-2 text-sm text-surface-600">Your assured scholarship eligibility is now unlocked. Estimated eligible scholarship: <b>{formatINR(estimate)}</b></p>
        </div>
        <div className="grid gap-3 rounded-2xl bg-brand-950 p-5 text-white">
          <div className="flex items-center gap-2"><TicketPercent className="h-5 w-5 text-gold-400" /><span className="text-sm font-semibold">Assured scholarship at partner colleges</span></div>
          <div className="flex items-center gap-2"><TicketPercent className="h-5 w-5 text-gold-400" /><span className="text-sm font-semibold">Free counsellor consultation</span></div>
          <div className="flex items-center gap-2"><TicketPercent className="h-5 w-5 text-gold-400" /><span className="text-sm font-semibold">College and application advice from your personal Agent</span></div>
        </div>
        {payment && <p className="text-xs text-surface-500">Payment #{payment.id.slice(0, 8)} · ₹49 · Demo</p>}
        <Link href="/student/dashboard"><Button variant="gold" className="h-12 w-full">Go to Student Portal →</Button></Link>
      </Card>
    );
  }

  return null;
}
