"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Award,
  Building2,
  GraduationCap,
  IndianRupee,
  Medal,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";

const stats = [
  { icon: GraduationCap, value: 5000, suffix: "+", label: "Students guided" },
  { icon: IndianRupee, value: 2, prefix: "₹", suffix: " Cr+", label: "Scholarships unlocked" },
  { icon: Building2, value: 50, suffix: "+", label: "Partner colleges" },
  { icon: Medal, value: 98, suffix: "%", label: "Student satisfaction" },
];

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const totalFrames = Math.round(duration / 16);
    const tick = () => {
      frame += 1;
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3);
      setValue(Math.round(target * progress));
      if (frame < totalFrames) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, active, duration]);
  return value;
}

function StatCard({ icon: Icon, value, prefix = "", suffix, label, active }: (typeof stats)[number] & { prefix?: string; active: boolean }) {
  const count = useCountUp(value, active);
  return (
    <div className="flex flex-col items-center gap-2 rounded-3xl border border-surface-200 bg-surface-50 p-6 text-center shadow-card">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-gold-500 shadow-float">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <p className="font-display text-3xl font-black text-surface-900">
        {prefix}
        {count}
        {suffix}
      </p>
      <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">{label}</p>
    </div>
  );
}

const milestones = [
  { year: "2026", title: "Orion platform goes live", desc: "Full student journey — discovery, counselling, applications and tracked scholarships — in one place." },
  { year: "2025", title: "50+ partner colleges onboarded", desc: "Expanded network across MBA, PGDM, Engineering and Commerce streams with verified data for every campus." },
  { year: "2024", title: "Counsellor network crosses 25 experts", desc: "A dedicated specialist assigned to every enquiry, calling students back within minutes." },
  { year: "2024", title: "First 1,000 admissions delivered", desc: "Students placed at RVCE, NMIMS, Christ, BMSCE and more — several with ₹30,000+ scholarships." },
];

const successStories = [
  { name: "Ishita Rao", result: "₹45,000 scholarship secured", detail: "NMIMS University · MBA", icon: Award },
  { name: "Aarav Patel", result: "Admission sorted end-to-end", detail: "RV College of Engineering", icon: GraduationCap },
  { name: "Aditi Kulkarni", result: "Best-value seat for COMEDK rank", detail: "BMS College of Engineering", icon: Star },
];

export default function AchievementsPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setInView(true),
      { threshold: 0.25 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-deep text-white">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-18 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-300">
              <Trophy className="h-4 w-4" strokeWidth={1.75} /> Achievements
            </span>
            <h1 className="mt-5 font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Numbers that tell our story
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-surface-300/70">
              Every milestone below is a student who found the right campus, a scholarship that
              made it affordable, or a family that decided with confidence.
            </p>
          </div>
        </section>

        {/* Counters */}
        <div ref={ref}>
          <section className="border-b border-surface-200 bg-white py-10">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} active={inView} />
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="py-14 sm:py-18">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">Milestones</span>
                <h2 className="mt-2 font-display text-2xl font-bold text-surface-900 sm:text-3xl">
                  How far we&apos;ve come
                </h2>
              </div>
              <ol className="relative mx-auto mt-12 max-w-4xl space-y-8">
                <div className="absolute bottom-8 left-6 top-8 hidden w-px bg-surface-200 sm:block" />
                {milestones.map((m) => (
                  <li key={m.title} className="relative pl-16 sm:pl-24">
                    <div className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient font-display text-sm font-black text-gold-500 shadow-lg shadow-brand-950/20 ring-4 ring-surface-50 sm:left-3">
                      {m.year}
                    </div>
                    <div className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card transition-shadow hover:shadow-float">
                      <h3 className="font-display text-lg font-bold text-surface-900">{m.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-surface-600">{m.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Success stories */}
          <section className="border-t border-surface-200 bg-white py-14 sm:py-18">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">Hall of fame</span>
                <h2 className="mt-2 font-display text-2xl font-bold text-surface-900 sm:text-3xl">
                  Recent wins worth celebrating
                </h2>
              </div>
              <div className="mt-10 grid gap-6 md:grid-cols-3">
                {successStories.map((s) => (
                  <div key={s.name} className="group relative overflow-hidden rounded-3xl border border-surface-200 bg-surface-50 p-7 shadow-card transition-all hover:-translate-y-1 hover:border-gold-300 hover:shadow-float">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-500 text-brand-950 shadow-glow-gold transition-transform group-hover:scale-110">
                      <s.icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-surface-900">{s.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-gold-700">{s.result}</p>
                    <p className="mt-1 text-sm text-surface-500">{s.detail}</p>
                  </div>
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  href="/#colleges"
                  className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-sm font-bold uppercase tracking-wide text-brand-950 transition-colors hover:bg-gold-600"
                >
                  Be our next achievement <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* CTA */}
        <section className="bg-brand-deep py-14 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
              Your name could be on this page next
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-surface-300/80 sm:text-base">
              Join thousands of students who turned confusion into an admission letter with Orion.
            </p>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3 text-sm font-bold uppercase tracking-wide transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              <Sparkles className="h-4 w-4" /> Learn more about us
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
