"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, BadgeCheck, BadgePercent, CalendarDays, ExternalLink, GraduationCap, Landmark, Phone, PhoneCall, ShieldCheck, Sparkles, TrendingUp, User, Rocket, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
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
  type?: string | null;
  rating?: string | number | null;
  established?: number | null;
  tags?: string[] | null;
  ranking?: string | null;
  placementPct?: string | number | null;
  highestPlacement?: string | null;
  intake?: number | null;
  facilities?: string[] | null;
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
  partnerCollege?: boolean | null;
  photos?: string[] | null;
}

const TIMELINES = ["This admission cycle", "Within 1 month", "Within 3 months", "Just exploring"];

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

interface DirectoryEnquiryFormProps {
  collegeId: string;
  collegeName: string;
  programs: { name: string }[];
}

function DirectoryEnquiryForm({ collegeId, collegeName, programs }: DirectoryEnquiryFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [program, setProgram] = useState(programs[0]?.name ?? "");
  const [timeline, setTimeline] = useState(TIMELINES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!name.trim() || phone.trim().length < 10) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          stream: "MBA",
          scoreBand: "75-90",
          targetCollege: collegeId,
          targetProgram: program || null,
          lookingFor: program || "Admission",
          admissionTimeline: timeline,
          source: "College Enquiry",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit enquiry");
      }
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="overflow-hidden rounded-3xl border-2 border-gold-500 bg-white shadow-glow-gold">
        <div className="bg-brand-gradient px-5 py-4 text-white">
          <p className="flex items-center gap-2 font-display text-lg font-bold">
            <Sparkles className="h-4 w-4 text-gold-400" /> Free Enquiry
          </p>
        </div>
        <div className="px-5 py-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-100">
            <Rocket className="h-7 w-7 text-gold-700" />
          </div>
          <h3 className="mt-3 font-display text-lg font-bold text-surface-900">Enquiry sent!</h3>
          <p className="mt-1 text-sm text-surface-600">A counsellor will reach out within minutes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-gold-500 bg-white shadow-glow-gold">
      <div className="bg-brand-gradient px-5 py-4 text-white">
        <p className="flex items-center gap-2 font-display text-lg font-bold">
          <Sparkles className="h-4 w-4 text-gold-400" /> Free Enquiry
        </p>
        <p className="mt-0.5 text-xs text-white/70">A counsellor calls you back — no fee, no obligation.</p>
      </div>
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <Label htmlFor="de-name" className="text-surface-800">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <Input
              id="de-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rohan Desai"
              className="h-11 rounded-2xl border-surface-200 pl-9 focus:border-gold-500 focus:ring-gold-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="de-phone" className="text-surface-800">Mobile number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
            <Input
              id="de-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="98765 43210"
              className="h-11 rounded-2xl border-surface-200 pl-9 focus:border-gold-500 focus:ring-gold-200"
            />
          </div>
        </div>

        {programs.length > 0 && (
          <div className="space-y-2">
            <Label className="text-surface-800">Program of interest</Label>
            <Select value={program} onValueChange={setProgram}>
              <SelectTrigger className="h-11 w-full rounded-2xl border-surface-200">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((p) => (
                  <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label className="text-surface-800">When do you plan to join?</Label>
          <div className="flex flex-wrap gap-2">
            {TIMELINES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeline(t)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  timeline === t
                    ? "border-brand-950 bg-brand-950 text-white"
                    : "border-surface-200 text-surface-600 hover:border-gold-200"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Button
          variant="gold"
          className="h-12 w-full"
          disabled={!name.trim() || phone.trim().length < 10 || loading}
          onClick={handleSubmit}
        >
          <Sparkles className="h-4 w-4" /> {loading ? "Sending..." : "Get free counselling"}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-surface-500">
          <BadgeCheck className="h-3.5 w-3.5 text-gold-700" /> No payment required
        </p>
      </div>
    </div>
  );
}

export function DirectoryCollegeDetail({ college }: { college: CollegeDirectoryEntry }) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [visitUrl, setVisitUrl] = useState<string | null>(null);
  const [dbData, setDbData] = useState<DbCollegeOverlay | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/colleges/${college.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled && d?.college) setDbData(d.college); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [college.id]);

  const staticProfile = getPartnerProfile(college.id);
  const isPartner = dbData?.partnerCollege ?? college.isPartnered;

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
        heroImage: dbData.partnerProfile?.heroImage ?? staticProfile?.heroImage,
        links: dbData.partnerProfile?.links ?? staticProfile?.links,
        sourceNote: staticProfile?.sourceNote,
        lastVerified: staticProfile?.lastVerified,
      }
    : staticProfile;

  const scholarshipProgram = college.courses.find((course) => canReceiveOrionScholarship(college, course.name));
  const campusVideos = (dbData?.campusVideos ?? []).filter((v) => v.youtubeUrl);

  const courses: { name: string; fees: string }[] =
    dbData?.programs && dbData.programs.length > 0
      ? dbData.programs.map((p) => ({ name: p.name, fees: formatDbFee(p.totalFee || p.annualFee) }))
      : college.courses;

  const photos = (dbData?.photos ?? []).filter(Boolean);

  const visitCollege: VisitWebsiteCollege | null = profile?.website
    ? {
        id: college.id,
        name: college.name,
        shortName: college.name,
        programs: courses.map((c) => ({ name: c.name })),
        sourceWebsite: visitUrl ?? profile.website,
      }
    : null;

  const quickFacts = profile
    ? [
        profile.established ? { icon: CalendarDays, label: "Established", value: profile.established } : null,
        profile.accreditation ? { icon: ShieldCheck, label: "Accreditation", value: profile.accreditation } : null,
      ].filter(Boolean)
    : [];

  const dbRating = dbData?.rating != null ? Number(dbData.rating) : null;
  const dbType = dbData?.type || undefined;
  const dbEstablished = dbData?.established ?? undefined;
  const dbTags = (dbData?.tags ?? []).filter(Boolean);
  const dbPlacementPct = dbData?.placementPct != null ? Number(dbData.placementPct) : null;
  const highestPlacementNum = dbData?.highestPlacement != null ? Number(dbData.highestPlacement) : null;
  const dbHighestPlacement = highestPlacementNum != null && highestPlacementNum > 0 ? formatDbFee(dbData?.highestPlacement) : null;
  const dbRanking = dbData?.ranking || null;
  const dbIntake = dbData?.intake ?? null;
  const dbFacilities = (dbData?.facilities ?? []).filter(Boolean);

  const hasStatsSection = Boolean(
    dbPlacementPct || dbHighestPlacement || dbRanking || dbIntake || dbFacilities.length > 0,
  );

  const heroPhoto = dbData?.coverImage || profile?.heroImage?.url || null;

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <SiteHeader />

      <main className="flex-1 pb-0 lg:pb-20">
        {/* Cover — admin cover image takes precedence */}
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:pt-6">
          <CollegeCover
            name={college.name}
            location={college.location}
            region={college.region}
            isPartner={isPartner}
            type={dbType}
            rating={dbRating ?? undefined}
            established={dbEstablished}
            tags={dbTags.length > 0 ? dbTags : undefined}
            heroPhoto={heroPhoto}
            logo={profile?.logos?.[0]}
            tagline={profile?.tagline}
            accreditation={profile?.accreditation}
            sourceWebsite={profile?.website}
            onVisitWebsite={profile?.website ? () => setVisitUrl(profile.website) : undefined}
            backLabel={isPartner ? "All MBA & PGDM colleges" : "All colleges"}
          />
        </div>

        {/* Quick facts bar */}
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:py-6">
          <div className="mb-2 flex gap-3 overflow-x-auto pb-2 lg:mb-6 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {[
              ...(courses.length > 0 ? [{ label: "Fee", value: courses[0].fees }] : []),
              dbPlacementPct != null && dbPlacementPct > 0 ? { label: "Placement", value: `${dbPlacementPct}%` } : null,
              dbHighestPlacement ? { label: "Highest pkg", value: dbHighestPlacement } : null,
              dbIntake != null && dbIntake > 0 ? { label: "Intake", value: dbIntake.toLocaleString("en-IN") } : null,
            ].filter(Boolean).map((s) => (
              <div key={s!.label} className="min-w-[120px] shrink-0 rounded-2xl border border-surface-200 bg-white px-4 py-3 text-center shadow-sm lg:min-w-0">
                <p className="font-display text-lg font-bold text-brand-950 lg:text-xl">{s!.value}</p>
                <p className="text-[11px] text-surface-500">{s!.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:pb-12">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main content — 2/3 width on desktop */}
            <div className="space-y-6 lg:col-span-2">

              {/* About / Overview */}
              {profile && (
                <section className="rounded-3xl border border-surface-200 bg-white p-5 shadow-card sm:p-6">
                  <div className="flex items-center gap-2">
                    <Landmark className="h-5 w-5 text-gold-700" />
                    <h2 className="font-display text-lg font-bold text-surface-900 sm:text-xl">About the institute</h2>
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
                      <ul className="mt-3 grid gap-2 sm:grid-cols-1 md:grid-cols-2">
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

              {/* Placements & key stats */}
              {hasStatsSection && (
                <section className="rounded-3xl border border-surface-200 bg-white p-5 shadow-card sm:p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-gold-700" />
                    <h2 className="font-display text-lg font-bold text-surface-900 sm:text-xl">Placements &amp; key stats</h2>
                  </div>
                  <div className="mt-5 grid gap-3 grid-cols-2 sm:grid-cols-2">
                    {dbPlacementPct != null && dbPlacementPct > 0 && (
                      <div className="rounded-2xl bg-surface-50 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-surface-500">Placement rate</p>
                        <p className="mt-1 font-display text-2xl font-black text-surface-900">{dbPlacementPct}%</p>
                      </div>
                    )}
                    {dbHighestPlacement && (
                      <div className="rounded-2xl bg-surface-50 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-surface-500">Highest package</p>
                        <p className="mt-1 font-display text-2xl font-black text-surface-900">{dbHighestPlacement}</p>
                      </div>
                    )}
                    {dbIntake != null && dbIntake > 0 && (
                      <div className="rounded-2xl bg-surface-50 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-surface-500">Annual intake</p>
                        <p className="mt-1 font-display text-2xl font-black text-surface-900">{dbIntake.toLocaleString("en-IN")}</p>
                      </div>
                    )}
                    {dbRanking && (
                      <div className="rounded-2xl bg-surface-50 p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-surface-500">Ranking</p>
                        <p className="mt-1 font-display text-lg font-bold text-surface-900">{dbRanking}</p>
                      </div>
                    )}
                  </div>
                  {dbFacilities.length > 0 && (
                    <>
                      <h3 className="mt-6 font-display text-base font-bold text-surface-900">Facilities</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {dbFacilities.map((facility) => (
                          <span key={facility} className="rounded-full border border-surface-200 bg-surface-50 px-3 py-1.5 text-xs font-semibold text-surface-700">{facility}</span>
                        ))}
                      </div>
                    </>
                  )}
                </section>
              )}

              {/* Campus videos */}
              {campusVideos.length > 0 && <CampusReels videos={campusVideos} />}

              {/* Campus photos */}
              {photos.length > 0 && (
                <section className="rounded-3xl border border-surface-200 bg-white p-5 shadow-card sm:p-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gold-700" />
                    <h2 className="font-display text-lg font-bold text-surface-900 sm:text-xl">Campus photos</h2>
                  </div>
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                    {photos.map((url, idx) => (
                      <img key={idx} src={url} alt={`${college.name} campus photo ${idx + 1}`} className="h-40 w-56 shrink-0 rounded-2xl object-cover sm:h-48 sm:w-64" />
                    ))}
                  </div>
                </section>
              )}

              {/* Programs */}
              <section className="rounded-3xl border border-surface-200 bg-white p-5 shadow-card sm:p-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-gold-700" />
                  <h2 className="font-display text-lg font-bold text-surface-900 sm:text-xl">Programs</h2>
                </div>
                <div className="mt-5 space-y-3">
                  {courses.map((course) => (
                    <div key={course.name} className="flex flex-col justify-between gap-2 rounded-2xl border border-surface-200 bg-surface-50 p-4 sm:flex-row sm:items-center">
                      <p className="text-sm font-semibold text-surface-900">{course.name}</p>
                      <p className="text-sm font-bold text-gold-700">{course.fees}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-surface-500">Fees are shown as provided by the college directory source.</p>
              </section>
            </div>

            {/* Sidebar — 1/3 width on desktop, FREE ENQUIRY at top */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              {/* Free Enquiry form — primary sidebar element */}
              <DirectoryEnquiryForm
                collegeId={college.id}
                collegeName={college.name}
                programs={courses}
              />

              {/* Scholarship */}
              {isPartner && (
                <section className="rounded-3xl border border-blue-200 bg-white p-5 shadow-card sm:p-6">
                  <div className="flex items-center gap-2">
                    <BadgePercent className="h-5 w-5 text-gold-700" />
                    <h2 className="font-display text-lg font-bold text-surface-900">Orion scholarship</h2>
                  </div>
                  {scholarshipProgram && college.maxScholarship > 0 ? (
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
                    <p className="mt-3 text-sm leading-relaxed text-surface-600">Orion scholarship is available only for MBA and PGDM programs at partnered colleges.</p>
                  )}
                </section>
              )}

              {/* Official links */}
              {profile && (
                <section className="rounded-3xl border border-surface-200 bg-white p-5 shadow-card sm:p-6">
                  <h2 className="font-display text-lg font-bold text-surface-900">Official links</h2>
                  <div className="mt-4 space-y-2">
                    {(profile.links ?? (profile.website ? [{ label: "Official website", url: profile.website }] : [])).map((link) => (
                      link.url ? (
                        <button key={link.url} onClick={() => setVisitUrl(link.url)}
                          className="flex w-full items-center justify-between rounded-xl border border-surface-200 px-4 py-2.5 text-sm font-semibold text-surface-800 transition-colors hover:border-gold-300 hover:text-gold-700">
                          {link.label}
                          <ExternalLink className="h-4 w-4 text-surface-400" />
                        </button>
                      ) : null
                    ))}
                  </div>
                </section>
              )}

              {/* Source note */}
              {profile && profile.sourceNote && (
                <p className="px-2 text-[11px] leading-relaxed text-surface-400">
                  Profile researched by Orion from official sources ({profile.sourceNote}). Last verified {profile.lastVerified}. Scholarship amounts shown are Orion partner benefits.
                </p>
              )}
            </aside>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile sticky CTA — visible only on mobile */}
      <div className="sticky bottom-0 z-40 border-t border-surface-200 bg-white/95 backdrop-blur-sm lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3 safe-area-bottom">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-surface-900">{college.name}</p>
            <p className="text-xs text-surface-500">
              {isPartner ? "Orion Partner · " : ""}{dbPlacementPct != null ? `${dbPlacementPct}% placement` : "Free counselling"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {profile?.website && (
              <Button onClick={() => setVisitUrl(profile.website)} variant="outline" className="!h-11 !px-3 text-xs">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button onClick={() => setEnquiryOpen(true)} variant="gold" className="!h-11 !px-4 text-xs">
              <PhoneCall className="h-3.5 w-3.5" /> Enquire
            </Button>
          </div>
        </div>
      </div>

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
