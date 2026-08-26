import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Award,
  Compass,
  FileCheck2,
  GraduationCap,
  Handshake,
  Landmark,
  Lightbulb,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { TestimonialStrip } from "@/components/homepage/TestimonialStrip";

export const metadata: Metadata = {
  title: "About Us | Orion Education",
  description:
    "Orion Education helps students discover, compare and get admitted to the right college — with verified facts, real counselling and scholarships up to ₹30,000.",
};

const pillars = [
  {
    icon: Lightbulb,
    title: "Expert Guidance",
    desc: "Real counsellors who know every campus personally — not chatbots reading brochures.",
  },
  {
    icon: ShieldCheck,
    title: "Quality & Clarity",
    desc: "Verified fees, real placement numbers and honest comparisons. No sugar-coating, ever.",
  },
  {
    icon: Handshake,
    title: "Comprehensive Support",
    desc: "From first search to final admission — applications, paperwork and scholarships handled end-to-end.",
  },
  {
    icon: Trophy,
    title: "Proven Success",
    desc: "Thousands of students seated at top colleges with scholarships they didn't know existed.",
  },
];

const steps = [
  {
    icon: Compass,
    title: "Explore",
    desc: "Discover top colleges and their unique programs, filtered by stream, budget and location.",
  },
  {
    icon: FileCheck2,
    title: "Apply",
    desc: "Submit tailored applications that highlight your strengths — guided by counsellors at every field.",
  },
  {
    icon: Rocket,
    title: "Achieve",
    desc: "Unlock scholarships up to ₹30,000 and step into the campus that fits your future.",
  },
];

const stats = [
  { icon: GraduationCap, value: "5,000+", label: "Students guided" },
  { icon: Award, value: "₹2 Cr+", label: "Scholarships unlocked" },
  { icon: Landmark, value: "50+", label: "Partner colleges" },
  { icon: Users, value: "25+", label: "Expert counsellors" },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-deep text-white">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-300">
              <Sparkles className="h-4 w-4" strokeWidth={1.75} /> About Orion Education
            </span>
            <h1 className="mt-6 font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Achieve your goals with <span className="text-gradient-gold">Orion Education</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-surface-300/80 sm:text-lg">
              We empower students to excel by turning college hunting into a clear, confident
              journey. From verified facts to assured scholarships, we provide expert guidance that
              makes you stand out — and gets you seated.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#colleges"
                className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand-950 transition-colors hover:bg-gold-600"
              >
                Explore Colleges <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/journey"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                See how it works
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-surface-200 bg-white py-10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2 rounded-3xl border border-surface-200 bg-surface-50 p-6 text-center shadow-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gradient text-gold-500 shadow-float">
                  <s.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="font-display text-2xl font-black text-surface-900 sm:text-3xl">{s.value}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-surface-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">Who we are</span>
                <h2 className="mt-3 font-display text-2xl font-black tracking-tight text-surface-900 sm:text-3xl">
                  A admission journey built on facts, not guesswork
                </h2>
                <p className="mt-5 leading-relaxed text-surface-700">
                  Orion Education was built on one belief: choosing a college should feel exciting,
                  not overwhelming. Every listing on our platform carries verified fees, authentic
                  placement records and scholarship details you can actually claim — so families
                  decide with confidence, not pressure.
                </p>
                <p className="mt-4 leading-relaxed text-surface-700">
                  Behind the platform is a team of counsellors who have walked thousands of students
                  through the same crossroads you stand at today. We measure our success in one way
                  only — students who start the semester at a campus that truly fits them.
                </p>
                <ul className="mt-7 space-y-3">
                  {[
                    "Every fact verified before it reaches you",
                    "Scholarships up to ₹30,000 at partner colleges",
                    "A dedicated counsellor from enquiry to admission",
                  ].map((line) => (
                    <li key={line} className="flex items-start gap-3 text-sm font-medium text-surface-800">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-100">
                        <Target className="h-3 w-3 text-gold-700" strokeWidth={2} />
                      </span>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pillars */}
              <div className="grid gap-4 sm:grid-cols-2">
                {pillars.map((p) => (
                  <div
                    key={p.title}
                    className="group rounded-3xl border border-surface-200 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:border-gold-300 hover:shadow-float"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold-50 text-gold-700 transition-colors group-hover:bg-gold-500 group-hover:text-brand-950">
                      <p.icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-4 font-display text-base font-bold text-surface-900">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-surface-600">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="border-y border-surface-200 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">How we work</span>
              <h2 className="mt-3 font-display text-2xl font-black tracking-tight text-surface-900 sm:text-3xl">
                Three steps between you and your campus
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((step, i) => (
                <div key={step.title} className="relative overflow-hidden rounded-3xl border border-surface-200 bg-surface-50 p-7 shadow-card">
                  <span className="pointer-events-none absolute -right-3 -top-6 font-display text-[7rem] font-black leading-none text-brand-100/70 select-none">
                    {i + 1}
                  </span>
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-gold-500 shadow-float">
                      <step.icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-surface-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-surface-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TestimonialStrip />

        {/* CTA */}
        <section className="bg-brand-deep py-14 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-black tracking-tight sm:text-3xl">
              Start your success story with Orion today
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-surface-300/80 sm:text-base">
              Tell us what you&apos;re looking for — a counsellor will call you back within minutes
              with options that actually fit.
            </p>
            <Link
              href="/#colleges"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3 text-sm font-bold uppercase tracking-wide text-brand-950 transition-colors hover:bg-gold-600"
            >
              Get started now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
