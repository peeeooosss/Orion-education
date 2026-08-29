"use client";

import { useState } from "react";
import Link from "next/link";
import { Plane, Globe2, GraduationCap, ChevronRight, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { StudyAbroadLeadModal } from "@/components/studyabroad/StudyAbroadLeadModal";
import { AbroadCollegeCard } from "@/components/studyabroad/AbroadCollegeCard";
import { STUDY_ABROAD_COLLEGES, COUNTRIES, type AbroadCollege } from "@/data/study-abroad";

const STATS = [
  { value: "30+", label: "Countries" },
  { value: "1000+", label: "Partner universities" },
  { value: "₹25L+", label: "Scholarships secured" },
  { value: "98%", label: "Visa success rate" },
];

export default function StudyAbroadPage() {
  const [modalCollege, setModalCollege] = useState<AbroadCollege | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function openEnquiry(college?: AbroadCollege | null) {
    setModalCollege(college ?? null);
    setModalOpen(true);
  }

  return (
    <>
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-gold-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium">
              <Plane className="h-4 w-4 text-gold-400" /> Study Abroad with Orion
            </span>
            <h1 className="mt-5 font-display text-4xl font-black leading-tight md:text-6xl">
              Your Future, <span className="text-gold-400">Beyond Borders</span>
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-indigo-100">
              Top universities across USA, UK, Canada, Australia, Germany, Ireland and more.
              Get free counselling on admissions, scholarships and visas — every step guided by a dedicated counsellor.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openEnquiry()}
                className="flex items-center gap-2 rounded-xl bg-gold-500 px-6 py-3.5 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
              >
                Get Free Counselling <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="/study-abroad/colleges"
                className="flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                Explore Universities <Globe2 className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/15 bg-white/5 p-4 text-center backdrop-blur-sm">
                <p className="font-display text-2xl font-black text-gold-400">{s.value}</p>
                <p className="mt-1 text-xs text-indigo-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-surface-900">Popular Study Destinations</h2>
        </div>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {COUNTRIES.map((c) => (
            <span key={c} className="rounded-full border border-surface-200 bg-white px-4 py-2 text-sm font-medium text-surface-700 hover:border-indigo-300 hover:text-indigo-700">
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Featured universities */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-surface-900">Featured Universities</h2>
            <p className="mt-1 text-sm text-surface-500">Handpicked top-ranked universities around the world</p>
          </div>
          <Link href="/study-abroad/colleges" className="hidden items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline sm:flex">
            Explore all universities <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {STUDY_ABROAD_COLLEGES.map((c) => (
            <AbroadCollegeCard key={c.id} college={c} onEnquire={openEnquiry} />
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={() => openEnquiry()}>
            <GraduationCap className="h-4 w-4" /> Can&apos;t find your university? Apply for any
          </Button>
        </div>
      </section>

      {/* Why study abroad */}
      <section className="bg-surface-50 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center font-display text-3xl font-bold text-surface-900">Why Study Abroad?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-surface-600">
            Global exposure, world-class education and better career prospects — here's what studying abroad unlocks for you.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🌍", title: "Global Recognition", desc: "Degrees from top-ranked universities are valued by employers worldwide." },
              { icon: "💰", title: "Better ROI", desc: "Higher starting salaries and strong return on your education investment." },
              { icon: "🗣️", title: "Language & Culture", desc: "Immerse yourself in new languages, cultures and global networks." },
              { icon: "🧑‍🤝‍🧑", title: "Career Opportunities", desc: "Optional work permits and post-study work visas open global doors." },
              { icon: "🎓", title: "Cutting-edge Research", desc: "Access to world-class labs, faculty and research funding." },
              { icon: "🛡️", title: "End-to-end Support", desc: "From university selection to visa filing — we guide every step." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">{item.icon}</div>
                <h3 className="mt-4 font-heading text-lg font-bold text-surface-900">{item.title}</h3>
                <p className="mt-2 text-sm text-surface-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-800 to-indigo-950 py-14 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">Ready to study abroad?</h2>
            <p className="mt-2 text-indigo-100">Talk to our counsellors for free — no obligation, genuine guidance.</p>
          </div>
          <button
            onClick={() => openEnquiry()}
            className="shrink-0 rounded-xl bg-gold-500 px-8 py-4 text-sm font-semibold text-brand-950 transition-colors hover:bg-gold-400"
          >
            Book Free Consultation
          </button>
        </div>
      </section>

      <StudyAbroadLeadModal college={modalCollege} open={modalOpen} onOpenChange={setModalOpen} />
      <Footer />
    </>
  );
}
