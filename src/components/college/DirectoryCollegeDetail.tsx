"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, BadgePercent, GraduationCap, MapPin, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { SmartEnquiryModal, type EnquiryCollege } from "@/components/college/SmartEnquiryModal";
import { canReceiveOrionScholarship, type CollegeDirectoryEntry } from "@/data/college-directory";

function toEnquiryCollege(college: CollegeDirectoryEntry): EnquiryCollege {
  return {
    id: college.id,
    shortName: college.name,
    programs: college.courses.map((course) => ({ name: course.name, stream: "MBA" })),
  };
}

export function DirectoryCollegeDetail({ college }: { college: CollegeDirectoryEntry }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const scholarshipProgram = college.courses.find((course) => canReceiveOrionScholarship(college, course.name));

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <SiteHeader />
      <main className="flex-1 pb-20">
        <div className={`relative overflow-hidden text-white ${college.isPartnered ? "bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800" : "bg-brand-gradient"}`}>
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link href="/#colleges" className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white">
              <ArrowLeft className="h-4 w-4" /> All MBA &amp; PGDM colleges
            </Link>
            <div className="mt-8 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                {college.isPartnered && <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700"><BadgeCheck className="h-3.5 w-3.5" /> Orion Partner College</span>}
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">{college.region}</span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-black tracking-tight sm:text-5xl">{college.name}</h1>
              <p className="mt-3 flex items-start gap-2 text-sm text-white/75"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {college.location}</p>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75">Explore available MBA and PGDM programs, fee information, and Orion scholarship availability for this college.</p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-gold-700" />
                  <h2 className="font-display text-xl font-bold text-surface-900">MBA &amp; PGDM programs</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {college.courses.map((course) => (
                    <div key={course.name} className="flex flex-col justify-between gap-2 rounded-2xl border border-surface-200 bg-surface-50 p-4 sm:flex-row sm:items-center">
                      <p className="text-sm font-semibold text-surface-900">{course.name}</p>
                      <p className="text-sm font-bold text-gold-700">{course.fees}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-surface-500">Fees are shown exactly as provided by the college directory source.</p>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card">
                <div className="flex items-center gap-2">
                  <BadgePercent className="h-5 w-5 text-gold-700" />
                  <h2 className="font-display text-lg font-bold text-surface-900">Orion scholarship</h2>
                </div>
                {scholarshipProgram ? (
                  <>
                    <p className="mt-3 text-sm leading-relaxed text-surface-700">Available for eligible MBA and PGDM programs at Orion partner colleges.</p>
                    <div className="mt-4 rounded-2xl bg-blue-50 p-4">
                      <p className="text-xs font-medium text-blue-700">Maximum scholarship</p>
                      <p className="mt-1 font-display text-3xl font-black text-surface-900">₹{college.maxScholarship.toLocaleString("en-IN")}</p>
                      <p className="mt-1 text-xs text-surface-600">For {scholarshipProgram.name}</p>
                    </div>
                    <Link href={`/scholarship?college=${college.id}`} className="mt-4 block">
                      <Button variant="brandGradient" className="w-full">Check my eligibility</Button>
                    </Link>
                  </>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-surface-600">Orion scholarship is available only for MBA and PGDM programs at partnered colleges. This college is not currently marked as an Orion partner.</p>
                )}
              </section>

              <section className="rounded-3xl border border-gold-300 bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-surface-900">Need help choosing?</h2>
                <p className="mt-2 text-sm text-surface-600">Speak with an Orion counsellor about admissions, fees, and program selection.</p>
                <Button variant="gold" className="mt-5 w-full" onClick={() => setEnquiryOpen(true)}><PhoneCall className="h-4 w-4" /> Enquire now</Button>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      {enquiryOpen && <SmartEnquiryModal college={toEnquiryCollege(college)} open onOpenChange={setEnquiryOpen} />}
    </div>
  );
}
