"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, BadgePercent, Bookmark, Building2, MapPin, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SmartEnquiryModal, type EnquiryCollege } from "@/components/college/SmartEnquiryModal";
import { MBA_PGDM_COLLEGES, canReceiveOrionScholarship, COLLEGE_REGIONS, type CollegeDirectoryEntry } from "@/data/college-directory";
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

export function CollegeGrid({ search, stream, city, sort, onStream, onCity, onSort }: CollegeGridProps) {
  const [enquiryCollege, setEnquiryCollege] = useState<EnquiryCollege | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);

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

  function resetFilters() {
    onStream(null);
    onCity("");
    onSort("default");
  }

  return (
    <section id="colleges" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="gold" className="bg-gold-100 text-gold-700">MBA &amp; PGDM Finder</Badge>
          <h2 className="mt-3 font-display text-3xl font-bold text-surface-900 sm:text-4xl">
            Explore {MBA_PGDM_COLLEGES.length} management colleges
          </h2>
          <p className="mt-2 max-w-xl text-surface-600">
            Compare MBA and PGDM fees by region. Blue cards are Orion partner colleges with scholarship support.
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
            All MBA &amp; PGDM
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
          <p className="mt-3 text-sm font-medium text-surface-600">No MBA or PGDM colleges match your filters.</p>
          {hasFilters && <button onClick={resetFilters} className="mt-3 text-sm font-semibold text-gold-700 hover:underline">Clear all filters →</button>}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((college) => {
            const scholarshipCourse = college.courses.find((course) => canReceiveOrionScholarship(college, course.name));
            const isPartner = college.isPartnered;
            return (
              <div
                key={college.id}
                className={`group flex flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float ${
                  isPartner ? "border-blue-300 ring-1 ring-blue-100" : "border-surface-200"
                }`}
              >
                <Link href={`/college/${college.id}`} className={`relative flex min-h-44 w-full items-start justify-between p-5 ${isPartner ? "bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700" : "bg-brand-gradient"}`}>
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
                  <div className="relative">
                    <div className="flex flex-wrap gap-2">
                      {isPartner && <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700"><BadgeCheck className="h-3 w-3" /> Orion Partner</span>}
                      <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white">{college.region}</span>
                    </div>
                    <p className="mt-8 max-w-[18rem] font-display text-xl font-bold text-white">{college.name}</p>
                    <p className="mt-1 flex items-start gap-1 text-xs text-white/75"><MapPin className="mt-0.5 h-3 w-3 shrink-0" /> {college.location}</p>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-6">
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

      {enquiryCollege && <SmartEnquiryModal college={enquiryCollege} open onOpenChange={(open) => { if (!open) setEnquiryCollege(null); }} />}
    </section>
  );
}
