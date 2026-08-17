"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Award, BadgePercent, Bookmark, Building2, MapPin, PhoneCall, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore, formatINR } from "@/store/useAppStore";
import { STREAM_OPTIONS, estimateFromProfile, type Stream } from "@/lib/scholarship";
import { SmartEnquiryModal } from "@/components/college/SmartEnquiryModal";
import type { College } from "@/store/types";

export type SortKey = "default" | "fee-asc" | "fee-desc" | "rating" | "placement";

interface CollegeGridProps {
  search: string;
  stream: Stream | null;
  city: string;
  exam: string;
  sort: SortKey;
  onStream: (stream: Stream | null) => void;
  onCity: (city: string) => void;
  onExam: (exam: string) => void;
  onSort: (sort: SortKey) => void;
}

const selectClass =
  "h-10 rounded-2xl border border-surface-200 bg-white px-3 text-sm font-medium text-surface-900 focus:border-gold-500 outline-none focus:ring-2 focus:ring-gold-200";
const SAVED_COLLEGES_KEY = "orion-saved-colleges";

export function CollegeGrid({ search, stream, city, exam, sort, onStream, onCity, onExam, onSort }: CollegeGridProps) {
  const colleges = useAppStore((s) => s.colleges);
  const profile = useAppStore((s) => s.studentProfile);
  const [enquiryCollege, setEnquiryCollege] = useState<College | null>(null);
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

  const cities = Array.from(new Set(colleges.map((c) => c.city))).sort();
  const exams = Array.from(new Set(colleges.map((c) => c.admissions.exam))).sort();

  const filtered = colleges.filter((c) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q)) ||
      c.programs.some((p) => p.name.toLowerCase().includes(q));
    const matchesStream = !stream || c.programs.some((p) => p.stream === stream);
    const matchesCity = !city || c.city === city;
    const matchesExam = !exam || c.admissions.exam.toLowerCase().includes(exam.toLowerCase());
    return matchesSearch && matchesStream && matchesCity && matchesExam;
  });

  const sorted = [...filtered].sort((a, b) => {
    const fee = (x: (typeof colleges)[number]) => Math.min(...x.programs.map((p) => p.annualFee));
    switch (sort) {
      case "fee-asc":
        return fee(a) - fee(b);
      case "fee-desc":
        return fee(b) - fee(a);
      case "rating":
        return b.rating - a.rating;
      case "placement":
        return b.placementPct - a.placementPct;
      default:
        return 0;
    }
  });

  const hasFilters = Boolean(search.trim() || stream || city || exam || sort !== "default");

  return (
    <section id="colleges" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="gold" className="bg-gold-100 text-gold-700">College Finder</Badge>
          <h2 className="mt-3 font-display text-3xl font-bold text-surface-900 sm:text-4xl">
            Explore {colleges.length} partner colleges
          </h2>
          <p className="mt-2 max-w-xl text-surface-600">
            Verified fees, placements and ratings — compare, shortlist and apply in one place.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-surface-200 bg-white p-4 shadow-card">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => onStream(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                !stream ? "bg-brand-950 text-gold-500 shadow-md shadow-gold-500/30" : "bg-surface-50 text-surface-600 hover:bg-surface-100"
              }`}
            >
              All streams
            </button>
            {STREAM_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onStream(stream === opt.value ? null : opt.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  stream === opt.value
                    ? "bg-brand-950 text-gold-500 shadow-md shadow-gold-500/30"
                    : "bg-surface-50 text-surface-600 hover:bg-surface-100"
                }`}
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <select value={city} onChange={(e) => onCity(e.target.value)} className={selectClass} aria-label="Filter by city">
              <option value="">All cities</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={exam} onChange={(e) => onExam(e.target.value)} className={selectClass} aria-label="Filter by entrance exam">
              <option value="">Any exam</option>
              {exams.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <select value={sort} onChange={(e) => onSort(e.target.value as SortKey)} className={selectClass} aria-label="Sort colleges">
              <option value="default">Sort: Featured</option>
              <option value="fee-asc">Fee: low to high</option>
              <option value="fee-desc">Fee: high to low</option>
              <option value="rating">Rating: high to low</option>
              <option value="placement">Placement: high to low</option>
            </select>
            {hasFilters && (
              <button
                onClick={() => {
                  onStream(null);
                  onCity("");
                  onExam("");
                  onSort("default");
                }}
                className="h-10 rounded-full px-3 text-xs font-semibold text-gold-700 transition-colors hover:bg-gold-100"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-surface-300 bg-surface-50 p-14 text-center">
          <Building2 className="mx-auto h-10 w-10 text-surface-300" />
          <p className="mt-3 text-sm font-medium text-surface-600">
            No colleges match your filters. Try a different stream or clear a filter.
          </p>
          {hasFilters && (
            <button
              onClick={() => {
                onStream(null);
                onCity("");
                onExam("");
                onSort("default");
              }}
              className="mt-3 text-sm font-semibold text-gold-700 hover:underline"
            >
              Clear all filters →
            </button>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((college) => {
            const lowestFee = Math.min(...college.programs.map((p) => p.annualFee));
            const estimate = estimateFromProfile(profile, college.rating);
            return (
              <div
                key={college.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
              >
                <Link
                  href={`/college/${college.id}`}
                  className="relative flex h-48 w-full items-center justify-between bg-brand-gradient bg-cover bg-center p-5"
                  style={college.coverImage ? { backgroundImage: `linear-gradient(90deg, rgba(15,13,46,.92), rgba(15,13,46,.38)), url(${college.coverImage})` } : undefined}
                >
                  <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gold-500/20 blur-2xl" />
                  <div>
                    <p className="font-display text-xl font-bold text-white">{college.shortName}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-surface-200/70">
                      <MapPin className="h-3 w-3" /> {college.city}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm">
                      <Award className="h-3 w-3" /> {college.ranking}
                    </span>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-500 text-brand-950 shadow-lg shadow-gold-500/30">
                    <span className="font-display text-lg font-black">{college.rating.toFixed(1)}</span>
                  </div>
                </Link>

                <div className="flex flex-1 flex-col p-6">
                  <Link href={`/college/${college.id}`}>
                    <p className="text-sm font-semibold text-surface-900 hover:text-gold-700">{college.name}</p>
                  </Link>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {college.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-surface-100 px-2 py-0.5 text-[10px] font-medium text-surface-600">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-surface-200 pt-4">
                    <div>
                      <p className="text-[10px] text-surface-500">Fee / yr</p>
                      <p className="text-sm font-bold text-surface-900">
                        {college.feesTbc ? "TBC" : `₹${(lowestFee / 100000).toFixed(1)}L`}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-surface-500">Placement</p>
                      <p className="text-sm font-bold text-surface-900">{college.placementPct}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-surface-500">Avg Pkg</p>
                      <p className="text-sm font-bold text-gold-700">
                        ₹{(college.programs[0].avgPlacement / 100000).toFixed(1)}L
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href={`/scholarship?college=${college.id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-gold-100 px-3 py-1 text-[11px] font-semibold text-gold-700 transition-colors hover:bg-gold-500 hover:text-brand-950"
                    >
                        <BadgePercent className="h-3.5 w-3.5" /> Up to {formatINR(estimate)} scholarship
                      </Link>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setEnquiryCollege(college)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 transition-colors hover:text-gold-700"
                      >
                        <PhoneCall className="h-3.5 w-3.5" /> Enquire
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSaved(college.id)}
                        className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors ${savedIds.includes(college.id) ? "text-gold-700" : "text-surface-500 hover:text-gold-700"}`}
                        aria-label={savedIds.includes(college.id) ? `Remove ${college.name} from saved colleges` : `Save ${college.name}`}
                      >
                        <Bookmark className="h-3.5 w-3.5" fill={savedIds.includes(college.id) ? "currentColor" : "none"} />
                        {savedIds.includes(college.id) ? "Saved" : "Save"}
                      </button>
                      <Link
                        href={`/college/${college.id}`}
                        className="flex items-center gap-1 text-sm font-semibold text-gold-700 transition-all group-hover:gap-2"
                      >
                        <TrendingUp className="h-3.5 w-3.5" />
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
      {enquiryCollege && (
        <SmartEnquiryModal
          college={enquiryCollege}
          open={Boolean(enquiryCollege)}
          onOpenChange={(open) => {
            if (!open) setEnquiryCollege(null);
          }}
        />
      )}
    </section>
  );
}
