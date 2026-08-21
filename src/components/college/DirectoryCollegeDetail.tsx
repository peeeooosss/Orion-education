"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, BadgePercent, CalendarDays, ExternalLink, GraduationCap, Landmark, MapPin, PhoneCall, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { SmartEnquiryModal, type EnquiryCollege } from "@/components/college/SmartEnquiryModal";
import { CollegeLogo } from "@/components/college/CollegeLogo";
import { canReceiveOrionScholarship, type CollegeDirectoryEntry } from "@/data/college-directory";
import { getPartnerProfile } from "@/data/partner-profiles";

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
  const profile = getPartnerProfile(college.id);
  const isPartner = college.isPartnered;

  const quickFacts = profile
    ? [
        profile.established ? { icon: CalendarDays, label: "Established", value: profile.established } : null,
        profile.accreditation ? { icon: ShieldCheck, label: "Accreditation", value: profile.accreditation } : null,
      ].filter(Boolean)
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <SiteHeader />
      <main className="flex-1 pb-20">
        {/* Hero */}
        <div className={`relative overflow-hidden ${isPartner ? "bg-white" : "bg-brand-gradient text-white"}`}>
          {isPartner && profile?.heroImage && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile.heroImage.url}
                alt={profile.heroImage.alt}
                onError={(event) => { event.currentTarget.style.display = "none"; }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_0_10px_#ffffff]" />
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-white via-white/75 to-transparent" />
            </>
          )}
          {!isPartner && <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />}
          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link href="/#colleges" className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${isPartner ? "text-surface-500 hover:text-surface-900" : "text-white/70 hover:text-white"}`}>
              <ArrowLeft className="h-4 w-4" /> All MBA &amp; PGDM colleges
            </Link>
            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  {isPartner && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-700 px-3 py-1 text-xs font-bold text-white">
                      <BadgeCheck className="h-3.5 w-3.5" /> Orion Partner College
                    </span>
                  )}
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isPartner ? "border border-surface-300 bg-white/80 text-surface-700" : "bg-white/15 text-white"}`}>{college.region}</span>
                  {profile?.accreditation && <span className="rounded-full border border-surface-300 bg-white/80 px-3 py-1 text-xs font-semibold text-surface-700">{profile.accreditation}</span>}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  {profile && profile.logos.length > 0 && (
                    <div className="hidden shrink-0 items-center gap-2 sm:flex">
                      {profile.logos.map((logo) => (
                        <div key={logo.url} className={`rounded-xl p-2 shadow-md ${logo.onDark ? "bg-slate-900" : "border border-surface-200 bg-white"}`}>
                          <CollegeLogo logo={logo} className="h-12 w-12 object-contain sm:h-14 sm:w-14" />
                        </div>
                      ))}
                    </div>
                  )}
                  <h1 className={`font-display text-3xl font-black tracking-tight sm:text-5xl ${isPartner ? "text-white text-stroke-dark drop-shadow-[0_2px_12px_rgba(15,23,42,0.25)]" : ""}`}>{college.name}</h1>
                </div>
                <p className={`mt-3 flex items-start gap-2 text-sm ${isPartner ? "text-surface-600" : "text-white/75"}`}><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {college.location}</p>
                {profile?.tagline ? (
                  <p className="mt-5 flex items-start gap-2 max-w-2xl font-display text-lg font-semibold leading-relaxed text-surface-900">
                    <Sparkles className="mt-1 h-4 w-4 shrink-0 text-gold-600" /> {profile.tagline}
                  </p>
                ) : (
                  <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75">Explore available MBA and PGDM programs, fee information, and Orion scholarship availability for this college.</p>
                )}
              </div>

              {profile && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-surface-300 bg-white px-5 py-2.5 text-sm font-semibold text-surface-900 transition-colors hover:border-blue-600 hover:text-blue-700">
                  <ExternalLink className="h-4 w-4" /> Official website
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {/* About / Overview */}
              {profile && (
                <section className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-gold-700" />
                    <h2 className="font-display text-xl font-bold text-surface-900">About the institute</h2>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-surface-700">{profile.overview}</p>
                  {quickFacts.length > 0 && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {quickFacts.map((fact) => {
                        const FactIcon = fact!.icon;
                        return (
                          <div key={fact!.label} className="flex items-start gap-3 rounded-2xl bg-surface-50 p-4">
                            <FactIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-700" />
                            <div>
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-surface-500">{fact!.label}</p>
                              <p className="mt-0.5 text-sm font-semibold text-surface-900">{fact!.value}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {profile.highlights.length > 0 && (
                    <>
                      <h3 className="mt-6 font-display text-base font-bold text-surface-900">Why students choose it</h3>
                      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                        {profile.highlights.map((point) => (
                          <li key={point} className="flex items-start gap-2.5 rounded-xl bg-blue-50/50 px-3 py-2.5 text-sm text-surface-700 ring-1 ring-blue-100/60">
                            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" /> {point}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {profile.specializations && profile.specializations.length > 0 && (
                    <>
                      <h3 className="mt-6 font-display text-base font-bold text-surface-900">Popular specialisations</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {profile.specializations.map((spec) => (
                          <span key={spec} className="rounded-full border border-surface-200 bg-surface-50 px-3 py-1.5 text-xs font-semibold text-surface-700">{spec}</span>
                        ))}
                      </div>
                    </>
                  )}
                </section>
              )}

              {/* Programs */}
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
              {/* Scholarship */}
              <section className={`rounded-3xl border p-6 shadow-card ${scholarshipProgram ? "border-blue-200 bg-white" : "border-surface-200 bg-white"}`}>
                <div className="flex items-center gap-2">
                  <BadgePercent className="h-5 w-5 text-gold-700" />
                  <h2 className="font-display text-lg font-bold text-surface-900">Orion scholarship</h2>
                </div>
                {scholarshipProgram ? (
                  <>
                    <p className="mt-3 text-sm leading-relaxed text-surface-700">Available for eligible MBA and PGDM programs at this Orion partner college.</p>
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

              {/* Official links */}
              {profile && (
                <section className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card">
                  <h2 className="font-display text-lg font-bold text-surface-900">Official links</h2>
                  <div className="mt-4 space-y-2">
                    {(profile.links ?? [{ label: "Official website", url: profile.website }]).map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-semibold text-surface-800 transition-colors hover:border-gold-300 hover:text-gold-700">
                        {link.label}
                        <ExternalLink className="h-4 w-4 text-surface-400" />
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {/* CTA */}
              <section className="rounded-3xl border border-gold-300 bg-white p-6 shadow-card">
                <h2 className="font-display text-lg font-bold text-surface-900">Need help choosing?</h2>
                <p className="mt-2 text-sm text-surface-600">Speak with an Orion counsellor about admissions, fees, and program selection.</p>
                <Button variant="gold" className="mt-5 w-full" onClick={() => setEnquiryOpen(true)}><PhoneCall className="h-4 w-4" /> Enquire now</Button>
              </section>

              {/* Source note */}
              {profile && (
                <p className="px-2 text-[11px] leading-relaxed text-surface-400">
                  Profile researched and written by Orion from official sources ({profile.sourceNote}). Last verified {profile.lastVerified}. Scholarship amounts shown are Orion partner benefits and are separate from any institute-offered aid.
                </p>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      {enquiryOpen && <SmartEnquiryModal college={toEnquiryCollege(college)} open onOpenChange={setEnquiryOpen} />}
    </div>
  );
}
