"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BadgePercent, TicketPercent } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { ZoneSwitcher } from "@/components/layout/ZoneSwitcher";
import { ScholarshipUnlockChecker } from "@/components/scholarship/ScholarshipUnlockChecker";
import { useAppStore, formatINR } from "@/store/useAppStore";
import { estimateFromProfile } from "@/lib/scholarship";

function ScholarshipPageContent() {
  const colleges = useAppStore((s) => s.colleges);
  const profile = useAppStore((s) => s.studentProfile);

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <SiteHeader />
      <main className="flex-1">
        <div className="relative overflow-hidden bg-brand-gradient text-white">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand-800/30 blur-3xl" />
          <div className="relative mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-300">
              <TicketPercent className="h-4 w-4" strokeWidth={1.75} /> Scholarships at partner colleges
            </span>
            <h1 className="mt-5 font-display text-3xl font-black tracking-tight sm:text-4xl">
              Check your eligibility in 30 seconds
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-surface-300/70">
              Unlock an eligibility-backed scholarship of up to ₹60,000 at any of our partner
              colleges — no paperwork, no waiting.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <ScholarshipUnlockChecker />

          <section className="mt-14">
            <h2 className="font-display text-2xl font-bold text-surface-900">Which colleges offer scholarships?</h2>
            <p className="mt-1 text-sm text-surface-600">
              Your estimated amount scales with your score and the college&apos;s rating.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {colleges.map((college) => {
                const estimate = estimateFromProfile(profile, college.rating);
                return (
                  <Link
                    key={college.id}
                    href={`/scholarship?college=${college.id}`}
                    className="group rounded-2xl border border-surface-200 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-float"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-surface-900">{college.shortName}</p>
                      <span className="rounded-full bg-surface-100 px-2 py-0.5 text-[10px] font-medium text-surface-500">
                        ★ {college.rating.toFixed(1)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-surface-500">{college.city}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-gold-700">
                        <BadgePercent className="h-4 w-4" strokeWidth={1.75} /> Up to {formatINR(estimate)}
                      </span>
                      <ArrowRight className="h-4 w-4 text-surface-300 transition-all group-hover:translate-x-0.5 group-hover:text-gold-500" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <ZoneSwitcher />
    </div>
  );
}

export default function ScholarshipPage() {
  return (
    <React.Suspense fallback={null}>
      <ScholarshipPageContent />
    </React.Suspense>
  );
}
