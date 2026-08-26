"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, BadgePercent, Bookmark, Building2, MapPin, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SmartEnquiryModal, type EnquiryCollege } from "@/components/college/SmartEnquiryModal";
import { MBA_PGDM_COLLEGES, canReceiveOrionScholarship, COLLEGE_REGIONS, type CollegeDirectoryEntry } from "@/data/college-directory";
import { getPartnerProfile } from "@/data/partner-profiles";
import { CollegeLogo } from "@/components/college/CollegeLogo";
import type { Stream } from "@/lib/scholarship";

export type SortKey = "default" | "fee-asc" | "fee-desc" | "rating" | "placement";

interface CollegeGridProps {
  search: string;
  stream: Stream | null;
  city: string;
  sort: SortKey;
  onStream: (stream: Stream | null) => void;
  onCity: (city: string) => void;
  onSort: (sort: SortKey) => void;
}

const selectClass =
  "h-10 rounded-2xl border border-surface-200 bg-white px-3 text-sm font-medium text-surface-900 focus:border-gold-500 outline-none focus:ring-2 focus:ring-gold-200";
const SAVED_COLLEGES_KEY = "orion-saved-colleges";
const INITIAL_VISIBLE = 16;

function feeValue(fees: string): number {
  const values = fees.match(/[\d,]+/g)?.map((value) => Number(value.replace(/,/g, ""))) ?? [];
  return values.length > 0 ? Math.min(...values) : Number.POSITIVE_INFINITY;
}

function toEnquiryCollege(college: CollegeDirectoryEntry): EnquiryCollege {
  return {
    id: college.id,
    shortName: college.name,
    programs: college.courses.map((course) => ({ name: course.name, stream: "MBA" })),
  };
}

interface DbCardOverlay {
  name?: string;
  city?: string;
  coverImage?: string | null;
  logoUrl?: string | null;
  logoOnDark?: boolean;
}

export function CollegeGrid({ search, stream, city, sort, onStream, onCity, onSort }: CollegeGridProps) {
  const [enquiryCollege, setEnquiryCollege] = useState<EnquiryCollege | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [dbMap, setDbMap] = useState<Record<string, DbCardOverlay>>({});

  // Admin-managed DB values overlay the static directory cards.
  useEffect(() => {
    fetch("/api/colleges")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.colleges) return;
        const map: Record<string, DbCardOverlay> = {};
        for (const c of d.colleges) {
          map[c.id] = {
            name: c.name,
            city: c.city,
            coverImage: c.partnerProfile?.heroImage?.url || c.coverImage || null,
            logoUrl: c.partnerProfile?.logos?.[0]?.url || null,
            logoOnDark: c.partnerProfile?.logos?.[0]?.onDark ?? false,
          };
        }
        setDbMap(map);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(SAVED_COLLEGES_KEY);
    if (!stored) return;
    const timer = window.setTimeout(() => setSavedIds(JSON.parse(stored) as string[]), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function toggleSaved(id: string) {
    const next = savedIds.includes(id) ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id];
    setSavedIds(next);
    window.localStorage.setItem(SAVED_COLLEGES_KEY, JSON.stringify(next));
  }

  const filtered = MBA_PGDM_COLLEGES.filter((college) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      college.name.toLowerCase().includes(q) ||
      college.location.toLowerCase().includes(q) ||
      college.region.toLowerCase().includes(q) ||
      college.courses.some((course) => course.name.toLowerCase().includes(q));
    const matchesStream = !stream || stream === "MBA";
    const matchesRegion = !city || college.region === city;
    return matchesSearch && matchesStream && matchesRegion;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "fee-asc") return feeValue(a.courses[0].fees) - feeValue(b.courses[0].fees);
    if (sort === "fee-desc") return feeValue(b.courses[0].fees) - feeValue(a.courses[0].fees);
    if (sort === "default") return Number(b.isPartnered) - Number(a.isPartnered);
    return 0;
  });

  const hasFilters = Boolean(search.trim() || stream || city || sort !== "default");
  const visible = showAll ? sorted : sorted.slice(0, INITIAL_VISIBLE);
  const hiddenCount = sorted.length - visible.length;

  function resetFilters() {
    onStream(null);
    onCity("");
    onSort("default");
  }

  return (
    <section id="colleges" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="gold" className="bg-gold-100 text-gold-700">Explore Programs</Badge>
          <h2 className="mt-3 font-display text-3xl font-bold text-surface-900 sm:text-4xl">
            Explore your dream college
          </h2>
          <p className="mt-2 max-w-xl text-surface-600">
            Compare fees, placements and scholarships across Bachelors, Masters, MBA &amp; PGDM. Blue cards are Orion partner colleges with scholarship support.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-surface-200 bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onStream(null)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              !stream ? "bg-brand-950 text-gold-500 shadow-md shadow-gold-500/30" : "bg-surface-50 text-surface-600 hover:bg-surface-100"
            }`}
          >
            All Programs
          </button>
          <button
            onClick={() => onStream(stream === "MBA" ? null : "MBA")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
              stream === "MBA" ? "bg-brand-950 text-gold-500 shadow-md shadow-gold-500/30" : "bg-surface-50 text-surface-600 hover:bg-surface-100"
            }`}
          >
            MBA / PGDM
          </button>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <select value={city} onChange={(e) => onCity(e.target.value)} className={selectClass} aria-label="Filter by region">
              <option value="">All regions</option>
              {COLLEGE_REGIONS.map((region) => <option key={region} value={region}>{region}</option>)}
            </select>
            <select value={sort} onChange={(e) => onSort(e.target.value as SortKey)} className={selectClass} aria-label="Sort colleges">
              <option value="default">Sort: Partners first</option>
              <option value="fee-asc">Fee: low to high</option>
              <option value="fee-desc">Fee: high to low</option>
            </select>
            {hasFilters && (
              <button onClick={resetFilters} className="h-10 rounded-full px-3 text-xs font-semibold text-gold-700 transition-colors hover:bg-gold-100">
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-surface-300 bg-surface-50 p-14 text-center">
          <Building2 className="mx-auto h-10 w-10 text-surface-300" />
          <p className="mt-3 text-sm font-medium text-surface-600">No colleges match your filters.</p>
          {hasFilters && <button onClick={resetFilters} className="mt-3 text-sm font-semibold text-gold-700 hover:underline">Clear all filters →</button>}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((college) => {
            const scholarshipCourse = college.courses.find((course) => canReceiveOrionScholarship(college, course.name));
            const isPartner = college.isPartnered;
            const db = dbMap[college.id];
            const displayName = db?.name || college.name;
            const displayLocation = db?.city || college.location;
            const cardProfile = isPartner ? getPartnerProfile(college.id) : undefined;
            const cardLogo = db?.logoUrl
              ? { url: db.logoUrl, alt: displayName, onDark: db.logoOnDark }
              : cardProfile?.logos[0];
            const heroPhoto = db?.coverImage || undefined;
            return (
              <div
                key={college.id}
                className={`group flex flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float ${
                  isPartner ? "border-blue-300 ring-1 ring-blue-100" : "border-surface-200"
                }`}
              >
                <Link href={`/college/${college.id}`} className="block">
                  <div className="relative overflow-hidden">
                    {heroPhoto ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={heroPhoto}
                          alt={`${displayName} campus`}
                          className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          style={{ aspectRatio: "16/9" }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <div
                          className={`hidden w-full items-center justify-center px-4 ${isPartner ? "bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800" : "bg-brand-gradient"}`}
                          style={{ aspectRatio: "16/9" }}
                        >
                          <p className="text-center text-sm font-bold text-white/70">{displayName}</p>
                        </div>
                      </>
                    ) : (
                      <div
                        className={`flex w-full items-center justify-center px-4 ${isPartner ? "bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800" : "bg-brand-gradient"}`}
                        style={{ aspectRatio: "16/9" }}
                      >
                        <p className="text-center text-sm font-bold text-white/70">{displayName}</p>
                      </div>
                    )}
                    {cardLogo && (
                      <div className="absolute right-3 top-3">
                        {cardLogo.onDark ? (
                          <CollegeLogo logo={cardLogo} className="h-10 w-10 rounded-lg object-contain drop-shadow" />
                        ) : (
                          <div className="rounded-lg bg-white p-1.5 shadow-sm">
                            <CollegeLogo logo={cardLogo} className="h-8 w-8 object-contain" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-5 pb-0">
                  <Link href={`/college/${college.id}`}>
                    <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-brand-950 transition-colors hover:text-gold-700">{displayName}</h3>
                  </Link>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {isPartner && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-200">
                        <BadgeCheck className="h-3 w-3" /> Orion Partner
                      </span>
                    )}
                    <span className="rounded-full bg-surface-100 px-2.5 py-0.5 text-[10px] font-semibold text-surface-600">{college.region}</span>
                  </div>
                  <p className="mt-1.5 flex items-start gap-1 text-xs text-surface-600"><MapPin className="mt-0.5 h-3 w-3 shrink-0" /> {displayLocation}</p>
                </div>

                <div className="flex flex-1 flex-col p-5 pt-4">
                  <div className="space-y-2">
                    {college.courses.map((course) => (
                      <div key={course.name} className="flex items-start justify-between gap-3 rounded-xl bg-surface-50 px-3 py-2.5">
                        <span className="text-xs font-semibold text-surface-800">{course.name}</span>
                        <span className="shrink-0 text-xs font-bold text-surface-900">{course.fees}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-surface-200 pt-4">
                    {scholarshipCourse && college.scholarshipAvailable ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700">
                        <BadgePercent className="h-3.5 w-3.5" /> Up to ₹{college.maxScholarship.toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span className="text-[11px] text-surface-500">Orion scholarship not available</span>
                    )}
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => setEnquiryCollege(toEnquiryCollege(college))} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 transition-colors hover:text-gold-700">
                        <PhoneCall className="h-3.5 w-3.5" /> Enquire
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSaved(college.id)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors ${savedIds.includes(college.id) ? "text-gold-700" : "text-surface-500 hover:text-gold-700"}`}
                        aria-label={savedIds.includes(college.id) ? `Remove ${college.name} from saved colleges` : `Save ${college.name}`}
                      >
                        <Bookmark className="h-3.5 w-3.5" fill={savedIds.includes(college.id) ? "currentColor" : "none"} />
                      </button>
                      <Link href={`/college/${college.id}`} className="flex items-center gap-1 text-sm font-semibold text-gold-700 transition-all group-hover:gap-2">
                        View <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {sorted.length > INITIAL_VISIBLE && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-950/20 transition-transform hover:scale-105"
          >
            {showAll ? "Show Less" : `View More (${hiddenCount} more)`}
            {!showAll && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      )}

      {enquiryCollege && <SmartEnquiryModal college={enquiryCollege} open onOpenChange={(open) => { if (!open) setEnquiryCollege(null); }} />}
    </section>
  );
}
