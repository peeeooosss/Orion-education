"use client";

import Link from "next/link";
import { ArrowRight, Route, Sparkles, UserRound } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

import { PipelineWidget } from "@/components/journey/PipelineWidget";
import { FollowStudent } from "@/components/journey/FollowStudent";
import { JOURNEY_STEPS } from "@/lib/journey";

export default function JourneyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <SiteHeader />
      <main className="flex-1">
        <div className="relative overflow-hidden bg-brand-gradient text-white">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand-800/30 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-300">
              <Route className="h-4 w-4" strokeWidth={1.75} /> Student Journey
            </span>
            <h1 className="mt-5 font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              From search to seat — your journey with Orion
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-surface-300/70">
              Eight steps take you from discovering the right college to walking into it. At every
              step, Orion works behind the scenes — a counsellor, a checklist, a tracked pipeline —
              so nothing falls through the cracks.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ol className="relative mx-auto max-w-4xl space-y-8">
            <div className="absolute bottom-8 left-6 top-8 hidden w-px bg-surface-200 sm:block" />
            {JOURNEY_STEPS.map((step) => (
              <li key={step.n} className="relative pl-16 sm:pl-24">
                <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient font-display text-lg font-black text-gold-500 shadow-lg shadow-brand-950/20 ring-4 ring-surface-50 sm:left-3">
                  {step.n}
                </div>
                <div className="overflow-hidden rounded-3xl border border-surface-200 bg-white p-6 shadow-card transition-shadow hover:shadow-float">
                  <div className="flex flex-col justify-between gap-2 border-b border-surface-100 pb-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-50 text-gold-700">
                        <step.icon className="h-5 w-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h2 className="font-display text-lg font-bold text-surface-900">{step.title}</h2>
                        <p className="text-xs text-surface-500">{step.tagline}</p>
                      </div>
                    </div>
                    <Link
                      href={step.cta.href}
                      className="inline-flex items-center gap-1 self-start rounded-full bg-gold-500 px-4 py-2 text-xs font-bold text-brand-950 transition-colors hover:bg-gold-600 sm:self-center"
                    >
                      {step.cta.label} <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="grid gap-4 pt-4 sm:grid-cols-2">
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-surface-500">
                        <UserRound className="h-3.5 w-3.5" strokeWidth={1.75} /> What you do
                      </p>
                      <ul className="mt-3 space-y-2">
                        {step.student.map((line, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-surface-700">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl bg-gold-50 p-4">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-700">
                        <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} /> How Orion helps
                      </p>
                      <ul className="mt-3 space-y-2">
                        {step.orion.map((line, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-surface-800">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-700" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mx-auto mt-16 max-w-4xl space-y-6">
            <PipelineWidget />
            <FollowStudent />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
