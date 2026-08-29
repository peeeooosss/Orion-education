"use client";

import { useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { StudyAbroadLeadModal } from "@/components/studyabroad/StudyAbroadLeadModal";
import { AbroadCollegeCard } from "@/components/studyabroad/AbroadCollegeCard";
import { STUDY_ABROAD_COLLEGES, COUNTRIES, type AbroadCollege } from "@/data/study-abroad";

export default function StudyAbroadCollegesPage() {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("All");
  const [modalCollege, setModalCollege] = useState<AbroadCollege | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = STUDY_ABROAD_COLLEGES.filter((c) => {
    const matchesQuery =
      !query.trim() ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.popularPrograms.some((p) => p.toLowerCase().includes(query.toLowerCase()));
    const matchesCountry = country === "All" || c.country === country;
    return matchesQuery && matchesCountry;
  });

  function openEnquiry(college?: AbroadCollege | null) {
    setModalCollege(college ?? null);
    setModalOpen(true);
  }

  return (
    <>
      <SiteHeader />

      <section className="bg-gradient-to-br from-indigo-700 to-indigo-950 py-12 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="font-display text-3xl font-black md:text-4xl">Explore Universities</h1>
          <p className="mt-2 text-indigo-100">Search universities across the world by program or country</p>

          <div className="mt-6 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-lg">
            <Search className="ml-3 h-5 w-5 text-surface-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by university or program..."
              className="h-11 flex-1 bg-transparent text-sm text-surface-900 outline-none placeholder:text-surface-400"
            />
            <button
              onClick={() => setQuery("")}
              className="rounded-xl px-3 py-2 text-xs font-medium text-surface-500 hover:bg-surface-100"
            >
              Clear
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {["All", ...COUNTRIES].map((c) => (
              <button
                key={c}
                onClick={() => setCountry(c)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  country === c ? "bg-white text-indigo-700" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-sm text-surface-500">
          Showing <span className="font-semibold text-surface-900">{filtered.length}</span> universities
          {country !== "All" && <> in <span className="font-semibold">{country}</span></>}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-surface-300 py-16 text-center">
            <RefreshCw className="h-10 w-10 text-surface-300" />
            <p className="text-sm font-medium text-surface-600">No universities match your search.</p>
            <p className="text-xs text-surface-500">Try a different program, or enquire — we'll find the right match for you.</p>
            <button onClick={() => openEnquiry()} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
              Enquire for any university
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c) => (
              <AbroadCollegeCard key={c.id} college={c} onEnquire={openEnquiry} />
            ))}
          </div>
        )}
      </section>

      <StudyAbroadLeadModal college={modalCollege} open={modalOpen} onOpenChange={setModalOpen} />
      <Footer />
    </>
  );
}
