"use client";

import Link from "next/link";
import * as React from "react";
import { Check, Lock, FileText, PhoneCall, TicketPercent, Wallet, CalendarDays, ShieldCheck, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore, formatINR } from "@/store/useAppStore";
import { StudentQuestionnaire } from "@/components/scholarship/StudentQuestionnaire";
import type { StudentQuestionnaire as Questionnaire } from "@/store/types";

function daysUntilExpiry(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export default function StudentDashboardPage() {
  const authUser = useAppStore((s) => s.authUser);
  const profile = useAppStore((s) => s.studentProfile);
  const vouchers = useAppStore((s) => s.vouchers);
  const leads = useAppStore((s) => s.leads);
  const payments = useAppStore((s) => s.payments);
  const questionnaire = useAppStore((s) => s.questionnaire);
  const setQuestionnaire = useAppStore((s) => s.setQuestionnaire);
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);

  // Show onboarding prompt if questionnaire not completed yet (after auth loads)
  React.useEffect(() => {
    if (authUser && !questionnaire?.completedAt) {
      const timer = setTimeout(() => setOnboardingOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [authUser, questionnaire]);

  function handleOnboardingComplete(data: Questionnaire) {
    setQuestionnaire(data);
    setOnboardingOpen(false);
  }

  const phone = authUser?.phone ?? profile.phone;
  const displayName = authUser?.name ?? profile.name;
  const displayLocation = authUser?.city ?? profile.city;
  const displayStream = questionnaire?.stream ?? profile.stream;
  const displayScore = questionnaire?.scoreBand ?? profile.scoreBand;

  const myVouchers = vouchers.filter((v) => v.phone === phone);
  const myApplications = leads.filter((l) => l.phone === phone);
  const totalValue = myVouchers.reduce((sum, v) => sum + v.amount, 0);
  const paymentPaid = payments.filter((p) => p.studentId === authUser?.id && p.status === "Paid").length > 0;
  const activeVoucher = myVouchers.find((v) => v.status === "Active");

  return (
    <div className="space-y-8">
      <div className="bg-brand-gradient text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-gold-400">Student Portal</p>
              <h1 className="mt-1 font-display text-3xl font-black tracking-tight">Welcome back, {displayName.split(" ")[0]}</h1>
              <p className="mt-2 text-sm text-surface-300/70">{displayLocation || "Not set"} · {displayStream || "Not set"} · {displayScore || "Not set"}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/scholarship">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-brand-950 shadow-lg shadow-gold-500/30 transition-colors hover:bg-gold-400"><TicketPercent className="h-4 w-4" /> Check scholarship</span>
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Active certificates", value: String(myVouchers.filter((v) => v.status !== "Claimed" && v.status !== "Expired").length), icon: TicketPercent },
              { label: "Total scholarship value", value: formatINR(totalValue), icon: Wallet },
              { label: "Applications in motion", value: String(myApplications.length), icon: FileText },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 text-brand-950"><stat.icon className="h-5 w-5" /></div>
                <div><p className="font-display text-xl font-bold text-gold-400">{stat.value}</p><p className="text-xs text-surface-300/60">{stat.label}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-3 space-y-6">
            {/* Payment Status Card */}
            {authUser && (
              <div>
                {paymentPaid ? (
                  <div className="rounded-3xl border border-green-200 bg-green-50/60 p-5">
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500 text-white"><Check className="h-5 w-5" /></div><div><p className="text-sm font-bold text-green-700">₹99 Scholarship check — Paid</p><p className="text-xs text-green-600">Assured scholarship at all partner colleges and free consultation active</p></div></div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-gold-200 bg-gold-50/60 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-brand-950"><Lock className="h-5 w-5" /></div>
                      <div className="flex-1"><p className="text-sm font-bold text-brand-950">Unlock your scholarship eligibility</p><p className="text-xs text-surface-600">Pay ₹99 to get assured scholarship at all partner colleges and free consultation from an Orion counsellor.</p></div>
                      <Link href="/scholarship"><Button size="sm" variant="gold">Unlock now</Button></Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Scholarship Certificate */}
            {activeVoucher && (
              <div className="relative overflow-hidden rounded-3xl border border-gold-200 bg-white shadow-lg shadow-gold-500/10">
                {/* Header */}
                <div className="bg-brand-gradient px-6 py-5 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-gold-400" />
                      <span className="text-xs font-semibold uppercase tracking-widest text-gold-300">Scholarship Certificate</span>
                    </div>
                    <span className="font-mono text-[11px] text-white/50">#{activeVoucher.code}</span>
                  </div>
                  <p className="mt-2 text-sm text-white/60">Awarded to {activeVoucher.studentName}</p>
                </div>

                {/* Amount */}
                <div className="px-6 py-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Your assured scholarship</p>
                  <p className="mt-2 font-display text-4xl font-black text-gold-600">{formatINR(activeVoucher.amount)}</p>
                  <div className="mt-2 flex items-center justify-center gap-2 text-sm text-surface-500">
                    <CalendarDays className="h-4 w-4" />
                    <span>Valid until {new Date(activeVoucher.expiresAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</span>
                    <span className="text-surface-300">·</span>
                    <span>{daysUntilExpiry(activeVoucher.expiresAt)} days left</span>
                  </div>
                </div>

                {/* Per-college breakdown */}
                {activeVoucher.perCollegeBreakdown.length > 0 && (
                  <div className="border-t border-surface-100 px-6 py-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">Valid at all partner colleges</p>
                    <div className="mt-3 grid gap-1.5">
                      {activeVoucher.perCollegeBreakdown.map((c) => {
                        const isPrimary = c.collegeName === activeVoucher.primaryCollege;
                        return (
                          <div key={c.collegeId} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${isPrimary ? "bg-gold-50 ring-1 ring-gold-200" : ""}`}>
                            <div className="flex items-center gap-2">
                              {isPrimary && <span className="text-[10px] font-bold text-gold-600 uppercase">Your #1</span>}
                              <span className={isPrimary ? "font-semibold text-surface-900" : "text-surface-600"}>{c.collegeName}</span>
                            </div>
                            <span className="font-semibold text-gold-700">{formatINR(c.amount)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-surface-100 bg-surface-50/50 px-6 py-3 flex items-center justify-between">
                  <span className="text-xs text-surface-400">{activeVoucher.stream} · Assured scholarship</span>
                  <Link href="/student/vouchers" className="text-xs font-semibold text-gold-700 hover:underline">View full certificate →</Link>
                </div>
              </div>
            )}

            {!activeVoucher && !paymentPaid && (
              <div className="rounded-3xl border border-dashed border-surface-300 bg-white p-12 text-center">
                <TicketPercent className="mx-auto h-10 w-10 text-surface-300" />
                <p className="mt-3 text-sm font-medium text-surface-600">No scholarship certificate yet.</p>
                <Link href="/scholarship" className="mt-2 inline-block text-sm font-semibold text-gold-700 hover:underline">Check your eligibility →</Link>
              </div>
            )}

            {questionnaire?.completedAt && (
              <div className="rounded-3xl border border-surface-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-surface-900">Your profile</p>
                <div className="mt-3 grid gap-2 text-xs text-surface-600 sm:grid-cols-2">
                  <p><span className="font-semibold text-surface-900">Score:</span> {questionnaire.scoreBand}</p>
                  <p><span className="font-semibold text-surface-900">Stream:</span> {questionnaire.stream}</p>
                  <p><span className="font-semibold text-surface-900">Goal:</span> {questionnaire.careerGoal}</p>
                  <p><span className="font-semibold text-surface-900">Budget:</span> {questionnaire.budgetRange}</p>
                  <p><span className="font-semibold text-surface-900">States:</span> {questionnaire.preferredStates?.join(", ")}</p>
                  <p><span className="font-semibold text-surface-900">Timeline:</span> {questionnaire.admissionTimeline}</p>
                  <p><span className="font-semibold text-surface-900">Hostel:</span> {questionnaire.hostelRequired ? "Yes" : "No"}</p>
                  <p><span className="font-semibold text-surface-900">Loan:</span> {questionnaire.loanRequired ? "Yes" : "No"}</p>
                </div>
              </div>
            )}
          </section>

          <section className="lg:col-span-2">
            <h2 className="font-display text-xl font-bold text-surface-900">Application progress</h2>

            {myApplications.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-dashed border-surface-300 bg-white p-10 text-center">
                <PhoneCall className="mx-auto h-10 w-10 text-surface-300" />
                <p className="mt-3 text-sm font-medium text-surface-600">No active applications. Submit a Scholarship Check or Smart Enquiry and track your progress here.</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {myApplications.map((lead) => {
                  const STEPS = ["New", "Contacted", "Application Started"] as const;
                  const stepIdx = STEPS.indexOf(lead.status as (typeof STEPS)[number]);
                  return (
                    <div key={lead.id} className="rounded-3xl border border-surface-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div><p className="text-sm font-semibold text-surface-900">{lead.targetCollege}</p><p className="text-xs text-surface-500">{lead.source} · {lead.intentLevel} intent</p></div>
                        <Badge variant="gold" className="bg-gold-100 text-gold-700">{formatINR(lead.scholarshipUnlocked)}</Badge>
                      </div>
                      <div className="mt-4 flex items-center">
                        {STEPS.map((step, i) => (
                          <div key={step} className="flex flex-1 items-center">
                            <div className="flex flex-col items-center">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${i <= (stepIdx >= 0 ? stepIdx : 0) ? "bg-brand-gradient text-gold-500" : "bg-surface-200 text-surface-500"}`}>
                                {stepIdx >= 0 && i < stepIdx ? <FileText className="h-4 w-4" /> : i + 1}
                              </div>
                              <p className={`mt-1.5 text-[10px] font-medium ${i <= (stepIdx >= 0 ? stepIdx : 0) ? "text-surface-900" : "text-surface-400"}`}>{step}</p>
                            </div>
                            {i < STEPS.length - 1 && <div className={`mx-1 mb-5 h-0.5 flex-1 rounded ${i < (stepIdx >= 0 ? stepIdx : 0) ? "bg-gold-500" : "bg-surface-200"}`} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 rounded-3xl bg-brand-950 p-5 text-white">
              <p className="text-sm font-semibold text-gold-400">Counsellor status</p>
              <p className="mt-1 text-sm text-white/70">
                {myApplications.some((l) => l.callConnected)
                  ? "Your counsellor has reached out. Keep your phone handy for the next step."
                  : paymentPaid
                    ? "Congratulations! Your application and scholarship are active. A counsellor will contact you soon."
                    : "Complete the questionnaire and unlock the scholarship to activate your free counsellor."}
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Onboarding prompt banner */}
      {authUser && !questionnaire?.completedAt && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border-2 border-dashed border-gold-300 bg-gold-50/60 p-6 text-center">
            <ClipboardList className="mx-auto h-10 w-10 text-gold-600" />
            <h3 className="mt-3 font-display text-lg font-bold text-surface-900">Complete your student profile</h3>
            <p className="mt-1 text-sm text-surface-600">Tell us about your academic background and goals to get personalized scholarship and college recommendations.</p>
            <Button variant="gold" className="mt-4" onClick={() => setOnboardingOpen(true)}>
              <ClipboardList className="h-4 w-4" /> Complete Profile
            </Button>
          </div>
        </div>
      )}

      {/* Onboarding Modal */}
      {onboardingOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-950/60 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) setOnboardingOpen(false); }}>
          <div className="relative max-h-[90vh] w-full overflow-y-auto">
            <button onClick={() => setOnboardingOpen(false)} className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-surface-600 shadow hover:bg-white">Skip for now</button>
            <StudentQuestionnaire onComplete={handleOnboardingComplete} />
          </div>
        </div>
      )}
    </div>
  );
}
