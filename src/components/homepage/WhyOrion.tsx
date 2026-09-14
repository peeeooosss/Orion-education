"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { BadgeCheck, Scale, BadgePercent, PhoneCall, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardBase =
  "group overflow-hidden rounded-2xl border bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float";

export function WhyOrion() {
  return (
    <section id="why-orion" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="gold" className="bg-gold-100 text-gold-700">Why Orion</Badge>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="mt-3 font-display text-3xl font-bold text-surface-900 sm:text-4xl"
          >
            Everything to shortlist, compare and apply — in one place
          </motion.h2>
          <motion.p variants={fadeInUp} className="mt-3 text-surface-600">
            Most portals stop at a list. Orion helps you decide — with verified data, a real
            scholarship, and a human who closes the loop.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Featured scholarship card */}
          <motion.div variants={fadeInUp} className="sm:col-span-2 lg:col-span-1">
            <div className="group relative h-full overflow-hidden rounded-2xl border border-gold-300 bg-gradient-to-br from-gold-50 via-white to-gold-50 p-6 shadow-float transition-all duration-300 hover:-translate-y-1">
              <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-gold-200/40 blur-2xl" />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                <BadgePercent className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <div className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-2.5 py-0.5 text-[11px] font-bold text-brand-950">
                <Sparkles className="h-3 w-3" />
                Up to ₹30,000
              </div>
              <h3 className="mt-3 text-base font-bold text-surface-900">
                Scholarships up to ₹30,000 on MBA &amp; PGDM
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-surface-600">
                An eligibility-backed scholarship at any partner college, unlocked in 30 seconds.
              </p>
              <Link
                href="/scholarship"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-brand-950 shadow-glow-gold-idle transition-all duration-300 hover:shadow-glow-gold hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Check my eligibility
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-2 text-[11px] font-medium text-surface-400">MBA &amp; PGDM programs only · Partner colleges</p>
            </div>
          </motion.div>

          {/* Verified facts */}
          <motion.div variants={fadeInUp} className={cardBase + " border-surface-200"}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <BadgeCheck className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-base font-bold text-surface-900">Verified facts, not brochure claims</h3>
            <p className="mt-2 text-sm leading-relaxed text-surface-600">
              NIRF rankings, NAAC accreditation and real placement numbers — the same data counsellors use, in front of you.
            </p>
          </motion.div>

          {/* Compare */}
          <motion.div variants={fadeInUp} className={cardBase + " border-surface-200"}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Scale className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-base font-bold text-surface-900">Compare before you commit</h3>
            <p className="mt-2 text-sm leading-relaxed text-surface-600">
              Fees, packages, seats and eligibility side by side across every partner college — shortlist with confidence.
            </p>
          </motion.div>

          {/* Counsellor */}
          <motion.div variants={fadeInUp} className={cardBase + " border-surface-200"}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <PhoneCall className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-base font-bold text-surface-900">A counsellor who calls you back</h3>
            <p className="mt-2 text-sm leading-relaxed text-surface-600">
              Send one enquiry and get a personalised call within minutes — every next step tracked in your portal.
            </p>
            <Link
              href="/student/dashboard"
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              Track in student portal <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
