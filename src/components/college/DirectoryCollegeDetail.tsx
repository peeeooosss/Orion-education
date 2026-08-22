"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BadgeCheck, BadgePercent, CalendarDays, ExternalLink, GraduationCap, Landmark, PhoneCall, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { SmartEnquiryModal, type EnquiryCollege } from "@/components/college/SmartEnquiryModal";
import { VisitWebsiteModal, type VisitWebsiteCollege } from "@/components/college/VisitWebsiteModal";
import { CollegeCover } from "@/components/college/CollegeCover";
import { CampusReels } from "@/components/college/CampusReels";
import { canReceiveOrionScholarship, type CollegeDirectoryEntry } from "@/data/college-directory";
import { getPartnerProfile } from "@/data/partner-profiles";

interface DbProgram {
  id: string;
  name: string;
  stream?: string | null;
  durationYears?: number | null;
  totalFee?: string | null;
  annualFee?: string | null;
  eligibility?: string | null;
}

interface DbCampusVideo {
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  category?: string;
  duration?: string;
  order?: number;
}

interface DbCollegeOverlay {
  coverImage?: string | null;
  sourceWebsite?: string | null;
  about?: string | null;
  campusVideos?: DbCampusVideo[] | null;
  programs?: DbProgram[] | null;
  partnerProfile?: {
    website?: string;
    tagline?: string;
    overview?: string;
    highlights?: string[];
    specializations?: string[];
    established?: string | null;
    accreditation?: string | null;
    logos?: { url: string; alt: string; onDark?: boolean }[];
    heroImage?: { url: string; alt: string; onDark?: boolean } | null;
    links?: { label: string; url: string }[] | null;
  } | null;
}

function formatDbFee(fee?: string | null): string {
  if (!fee) return "Fee on Request";
  const num = Number(fee);
  if (!Number.isFinite(num) || num <= 0) return "Fee on Request";
  return `₹${num.toLocaleString("en-IN")}`;
}

function toEnquiryCollege(college: CollegeDirectoryEntry): EnquiryCollege {
  return {
    id: college.id,
    shortName: college.name,
    programs: college.courses.map((course) => ({ name: course.name, stream: "MBA" })),
  };
}

export function DirectoryCollegeDetail({ college }: { college: CollegeDirectoryEntry }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [visitUrl, setVisitUrl] = useState<string | null>(null);
  const [dbData, setDbData] = useState<DbCollegeOverlay | null>(null);

  // Overlay admin-managed DB data on top of the static directory entry.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/colleges/${college.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled && d?.college) setDbData(d.college); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [college.id]);

  const staticProfile = getPartnerProfile(college.id);
  const isPartner = college.isPartnered;
  const profile = dbData
    ? {
        website: dbData.partnerProfile?.website || dbData.sourceWebsite || staticProfile?.website || "",
        tagline: dbData.partnerProfile?.tagline || staticProfile?.tagline,
        overview: dbData.partnerProfile?.overview || dbData.about || staticProfile?.overview || "",
        highlights: dbData.partnerProfile?.highlights ?? staticProfile?.highlights ?? [],
        specializations: dbData.partnerProfile?.specializations ?? staticProfile?.specializations,
        accreditation: dbData.partnerProfile?.accreditation ?? staticProfile?.accreditation,
        established: dbData.partnerProfile?.established ?? staticProfile?.established,
        logos: dbData.partnerProfile?.logos ?? staticProfile?.logos ?? [],
        heroImage: dbData.partnerProfile?.heroImage
          ?? (dbData.coverImage ? { url: dbData.coverImage, alt: college.name } : null)
          ?? staticProfile?.heroImage,
        links: dbData.partnerProfile?.links ?? staticProfile?.links,
        sourceNote: staticProfile?.sourceNote,
        lastVerified: staticProfile?.lastVerified,
      }
    : staticProfile;

  const scholarshipProgram = college.courses.find((course) => canReceiveOrionScholarship(college, course.name));

  const campusVideos = (dbData?.campusVideos ?? []).filter((v) => v.youtubeUrl);

  // Admin-managed DB programs take precedence over the static directory list.
  const courses: { name: string; fees: string }[] =
    dbData && dbData.programs && dbData.programs.length > 0
      ? dbData.programs.map((p) => ({ name: p.name, fees: formatDbFee(p.totalFee) }))
      : college.courses;

  const visitCollege: VisitWebsiteCollege | null = profile
    ? {
        id: college.id,
        name: college.name,
        shortName: college.name,
        programs: college.courses.map((course) => ({ name: course.name })),
        sourceWebsite: visitUrl ?? profile.website,
      }
    : null;

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
        {/* Cover */}
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <CollegeCover
            name={college.name}
            location={college.location}
            region={college.region}
            isPartner={isPartner}
            heroPhoto={profile?.heroImage?.url}
            logo={profile?.logos?.[0]}
            tagline={profile?.tagline}
            accreditation={profile?.accreditation}
            sourceWebsite={profile?.website}
            onVisitWebsite={() => profile && setVisitUrl(profile.website)}
            onEnquire={() => setEnquiryOpen(true)}
            backLabel="All MBA &amp; PGDM colleges"
          />
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

              {/* Campus videos (admin-managed) */}
              {campusVideos.length > 0 && <CampusReels videos={campusVideos} />}

              {/* Programs */}
              <section className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-gold-700" />
                  <h2 className="font-display text-xl font-bold text-surface-900">Programs</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {courses.map((course) => (
                    <div key={course.name} className="flex flex-col justify-between gap-2 rounded-2xl border border-surface-200 bg-surface-50 p-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-sm font-semibold text-surface-900">{course.name}</p>
                      </div>
                      <p className="text-sm font-bold text-gold-700">{course.fees}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-surface-500">Fees are shown as provided by the college directory source.</p>
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
                      <button key={link.url} onClick={() => setVisitUrl(link.url)}
                        className="flex w-full items-center justify-between rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-semibold text-surface-800 transition-colors hover:border-gold-300 hover:text-gold-700">
                        {link.label}
                        <ExternalLink className="h-4 w-4 text-surface-400" />
                      </button>
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

      {visitCollege && (
        <VisitWebsiteModal
          college={visitCollege}
          open={visitUrl !== null}
          onOpenChange={(open) => { if (!open) setVisitUrl(null); }}
        />
      )}
    </div>
  );
}
