"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, BadgePercent, Building2, Calendar, ExternalLink, GraduationCap, MapPin, PhoneCall, Star, Users } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

import { ProgramFacts } from "@/components/college/ProgramFacts";
import { CampusReels } from "@/components/college/CampusReels";
import { SmartEnquiryModal } from "@/components/college/SmartEnquiryModal";
import { EnquirySidebar } from "@/components/college/EnquirySidebar";
import { VisitWebsiteModal } from "@/components/college/VisitWebsiteModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore, formatINR } from "@/store/useAppStore";
import { estimateFromProfile } from "@/lib/scholarship";

export default function CollegeDetailPage() {
  const params = useParams<{ id: string }>();
  const college = useAppStore((s) => s.colleges.find((c) => c.id === params.id));
  const profile = useAppStore((s) => s.studentProfile);
  const [enquiryOpen, setEnquiryOpen] = React.useState(false);
  const [visitOpen, setVisitOpen] = React.useState(false);

  if (!college) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center p-8 text-center">
          <div>
            <Building2 className="mx-auto h-12 w-12 text-surface-300" strokeWidth={1.75} />
            <h1 className="mt-4 font-display text-2xl font-bold text-surface-900">College not found</h1>
            <Link href="/" className="mt-4 inline-block text-sm font-semibold text-gold-700 hover:underline">
              ← Back to all colleges
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const lowestFee = Math.min(...college.programs.map((p) => p.annualFee));
  const estimate = estimateFromProfile(profile, college.rating);

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <SiteHeader />

      <main className="flex-1 pb-24">
        <div
          className="relative overflow-hidden bg-brand-gradient bg-cover bg-center text-white"
          style={college.coverImage ? { backgroundImage: `linear-gradient(90deg, rgba(15,13,46,.94), rgba(15,13,46,.6)), url(${college.coverImage})` } : undefined}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-800/30 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link href="/#colleges" className="inline-flex items-center gap-1.5 text-sm font-medium text-surface-300/70 transition-colors hover:text-gold-300">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /> All colleges
            </Link>

            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <Badge variant="gold" className="bg-gold-100 text-gold-700">
                    <span className="text-white">{college.type}</span> Institution
                  </Badge>
                  <span className="flex items-center gap-1 text-sm font-semibold text-gold-400">
                    <Star className="h-4 w-4 fill-current" strokeWidth={1.75} /> {college.rating.toFixed(1)} rating
                  </span>
                </div>
                <h1 className="mt-3 font-display text-3xl font-black tracking-tight sm:text-4xl">{college.name}</h1>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-surface-300/70">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" strokeWidth={1.75} /> {college.city}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" strokeWidth={1.75} /> Est. {college.established}</span>
                  <span className="flex items-center gap-1"><GraduationCap className="h-4 w-4" strokeWidth={1.75} /> {college.programs.length} programs</span>
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {college.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                {college.sourceWebsite && (
                  <button
                    onClick={() => setVisitOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-gold-400 hover:text-gold-300"
                  >
                    <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} /> Visit official website
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                {[
                   { label: "Fee / yr", value: college.feesTbc ? "TBC" : `₹${(lowestFee / 100000).toFixed(2)}L` },
                  { label: "Placement", value: `${college.placementPct}%` },
                  { label: "Highest pkg", value: `₹${(college.highestPlacement / 100000).toFixed(1)}L` },
                  { label: "Intake", value: `${college.intake.toLocaleString("en-IN")}` },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-white/10 px-5 py-3 text-center ring-1 ring-white/15 backdrop-blur-sm">
                    <p className="font-display text-xl font-bold text-gold-400">{s.value}</p>
                    <p className="text-[11px] text-surface-300/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-gold-200 bg-gold-50 p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-brand-950">
                <BadgePercent className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-bold text-surface-900">Eligibility alert</p>
                <p className="mt-0.5 text-sm text-surface-700">
                  Based on your profile ({profile.stream}, {profile.scoreBand}), you may be eligible for up to{" "}
                  <span className="font-bold text-gold-700">{formatINR(estimate)}</span> in scholarships at{" "}
                  {college.shortName}.
                </p>
              </div>
            </div>
            <Link href={`/scholarship?college=${college.id}`}>
              <Button variant="brandGradient" className="!px-6 !py-3 text-sm">Check my eligibility</Button>
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-surface-900">About {college.shortName}</h2>
                <p className="mt-2 text-sm leading-relaxed text-surface-700">{college.about}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {college.facilities.map((f) => (
                    <div key={f} className="flex items-center gap-2 rounded-xl bg-surface-50 px-3 py-2 text-xs font-medium text-surface-700">
                      <BadgeCheck className="h-4 w-4 shrink-0 text-gold-700" strokeWidth={1.75} />
                      {f}
                    </div>
                  ))}
                </div>
              </section>

              <CampusReels college={college} />
              <ProgramFacts college={college} />
            </div>

            <div className="sticky top-24 space-y-6 self-start">
              <EnquirySidebar college={college} />

              <div className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card">
                <div className="flex items-center gap-2">
                  <BadgePercent className="h-5 w-5 text-gold-700" strokeWidth={1.75} />
                  <p className="font-display text-lg font-bold text-surface-900">Scholarships & financial aid</p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-surface-700">{college.scholarships.details}</p>
                <div className="mt-4 rounded-2xl bg-gold-50 p-4">
                  <p className="text-xs font-medium text-gold-700">Your estimated eligibility</p>
                  <p className="mt-1 font-display text-2xl font-black text-surface-900">{formatINR(estimate)}</p>
                  <p className="mt-1 text-xs text-surface-600">
                    Unlocked with your {profile.stream} · {profile.scoreBand} profile
                  </p>
                </div>
                <Link href={`/scholarship?college=${college.id}`} className="mt-4 block">
                  <Button variant="outline" className="w-full border-gold-200 text-gold-700 hover:bg-gold-50">
                    Check full eligibility →
                  </Button>
                </Link>
              </div>

              <div className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card">
                <p className="text-sm font-semibold text-surface-900">Why students choose {college.shortName}</p>
                <ul className="mt-3 space-y-3">
                  {[
                    `₹${(college.programs[0].avgPlacement / 100000).toFixed(1)}L average package in ${college.programs[0].name}`,
                    `${college.placementPct}% of batch placed in the last academic year`,
                    `${college.intake.toLocaleString("en-IN")} seats — competitive but accessible via Orion`,
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-surface-700">
                      <Users className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" strokeWidth={1.75} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <div className="sticky bottom-0 z-40 border-t border-surface-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-surface-900">{college.name}</p>
            <p className="text-xs text-surface-500">
              Scholarship up to ₹60,000 · {college.placementPct}% placement
            </p>
          </div>
          <div className="flex items-center gap-3">
            {college.sourceWebsite && (
              <Button
                onClick={() => setVisitOpen(true)}
                variant="outline"
                className="!h-11 !px-5"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={1.75} />
                Visit website
              </Button>
            )}
            <Button
              onClick={() => setEnquiryOpen(true)}
              variant="gold"
              className="!h-11 !px-5 !text-base"
            >
              <PhoneCall className="h-4 w-4" strokeWidth={1.75} />
              Get free counselling
            </Button>
          </div>
        </div>
      </div>

      <SmartEnquiryModal college={college} open={enquiryOpen} onOpenChange={setEnquiryOpen} />
      <VisitWebsiteModal college={college} open={visitOpen} onOpenChange={setVisitOpen} />
    </div>
  );
}
