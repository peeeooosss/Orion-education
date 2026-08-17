"use client";

import * as React from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { ZoneSwitcher } from "@/components/layout/ZoneSwitcher";
import { HeroSection } from "@/components/homepage/HeroSection";
import { CollegeGrid, type SortKey } from "@/components/homepage/CollegeGrid";
import { WhyOrion } from "@/components/homepage/WhyOrion";
import { JourneyTeaser } from "@/components/homepage/JourneyTeaser";
import { type Stream } from "@/lib/scholarship";
import { BadgePercent, GraduationCap } from "lucide-react";

export default function HomePage() {
  const [search, setSearch] = React.useState("");
  const [stream, setStream] = React.useState<Stream | null>(null);
  const [city, setCity] = React.useState("");
  const [exam, setExam] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("default");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection search={search} onSearch={setSearch} stream={stream} onStream={setStream} />

        <CollegeGrid
          search={search}
          stream={stream}
          city={city}
          exam={exam}
          sort={sort}
          onStream={setStream}
          onCity={setCity}
          onExam={setExam}
          onSort={setSort}
        />

        <JourneyTeaser />

        <section id="scholarship" className="border-y border-gold-200 bg-gold-50/60 py-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-brand-950">
                <BadgePercent className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-semibold text-surface-900">
                  Scholarships up to ₹60,000 at partner colleges
                </p>
                <p className="text-sm text-surface-600">
                  Eligibility-backed, not a lottery — check yours in 30 seconds.
                </p>
              </div>
            </div>
            <Link
              href="/scholarship"
              className="rounded-full bg-brand-950 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-900"
            >
              Check my eligibility →
            </Link>
          </div>
        </section>

        <WhyOrion />

        <section className="border-y border-surface-200 bg-white py-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-brand-950">
                <GraduationCap className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <p className="font-semibold text-surface-900">Your application, tracked live</p>
                <p className="text-sm text-surface-600">
                  Send one enquiry and a counsellor calls you within minutes — watch your
                  application progress light up in your portal.
                </p>
              </div>
            </div>
            <Link
              href="/student/dashboard"
              className="rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-600"
            >
              Track in Student Portal →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <ZoneSwitcher />
    </div>
  );
}
