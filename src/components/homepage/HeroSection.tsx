"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { STREAM_OPTIONS, type Stream } from "@/lib/scholarship";

const HERO_IMAGES = [
  {
    src: "/images/hero/slide1.jpg",
    alt: "Students studying in a library",
  },
  {
    src: "/images/hero/slide2.jpg",
    alt: "Graduation celebration",
  },
  {
    src: "/images/hero/slide3.jpg",
    alt: "Students collaboration",
  },
];

const HERO_SLIDES = [
  {
    title: "Assured scholarships up to ₹60,000",
    body: "Eligibility-backed and unlocked in 30 seconds — no lottery, no paperwork.",
  },
  {
    title: "Verified fees, placements & ratings",
    body: "The same data counsellors use — real placement numbers, side by side.",
  },
  {
    title: "One enquiry, a counsellor on call",
    body: "Shortlist with confidence and a human closes the loop within minutes.",
  },
];

interface HeroSectionProps {
  search: string;
  onSearch: (value: string) => void;
  stream: Stream | null;
  onStream: (stream: Stream | null) => void;
}

export function HeroSection({ search, onSearch, stream, onStream }: HeroSectionProps) {
  const [imageIdx, setImageIdx] = React.useState(0);
  const [slideIdx, setSlideIdx] = React.useState(0);

  React.useEffect(() => {
    const imageTimer = setInterval(() => setImageIdx((i) => (i + 1) % HERO_IMAGES.length), 6000);
    const slideTimer = setInterval(() => setSlideIdx((i) => (i + 1) % HERO_SLIDES.length), 4000);
    return () => {
      clearInterval(imageTimer);
      clearInterval(slideTimer);
    };
  }, []);

  function pickStream(value: Stream) {
    onStream(stream === value ? null : value);
    document.getElementById("colleges")?.scrollIntoView({ behavior: "smooth" });
  }

  const slide = HERO_SLIDES[slideIdx];

  return (
    <section className="relative overflow-hidden bg-brand-deep text-white">
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={imageIdx}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Image
              src={HERO_IMAGES[imageIdx].src}
              alt={HERO_IMAGES[imageIdx].alt}
              fill
              priority={imageIdx === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-950/85 via-brand-950/75 to-brand-950/90" />
      </div>

      <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-gold-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-800/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-gold-500" />
            India&apos;s verified college finder
          </span>

          <h1 className="mt-6 font-display text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Find the college that fits your <span className="text-gradient-gold">score, stream &amp; budget.</span>
          </h1>

          <div className="relative mt-5 h-16 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-2xl"
              >
                <p className="text-lg font-semibold text-gold-300">{slide.title}</p>
                <p className="mx-auto mt-1 max-w-xl text-sm text-surface-200/80">{slide.body}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-2xl border border-white/20 bg-white/70 p-2 shadow-glass backdrop-blur-xl">
            <Search className="ml-3 h-5 w-5 shrink-0 text-surface-400" />
            <Input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by college, stream or city..."
              className="h-12 border-0 bg-transparent text-surface-900 placeholder:text-surface-400 focus-visible:ring-0"
              aria-label="Search colleges"
            />
            <a href="#colleges" className="shrink-0">
              <Button variant="brandGradient" className="!px-6 !py-3 text-sm">Search</Button>
            </a>
          </div>

          <div className="mx-auto mt-6 flex max-w-3xl flex-wrap items-center justify-center gap-2">
            <span className="flex items-center gap-1 text-xs font-medium text-surface-300/60">
              <SlidersHorizontal className="h-3.5 w-3.5" /> Popular streams:
            </span>
            {STREAM_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => pickStream(opt.value)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                  stream === opt.value
                    ? "border-gold-500 bg-gold-500 text-brand-950 shadow-md shadow-gold-500/30"
                    : "border-white/25 text-white/80 hover:border-gold-400 hover:text-gold-300"
                )}
              >
                {opt.emoji} {opt.label}
              </button>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[
              { value: "8", label: "partner colleges" },
              { value: "40+", label: "undergrad programs" },
              { value: "₹16L", label: "avg best package" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl font-bold text-gold-500">{stat.value}</p>
                <p className="text-xs text-surface-300/60">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === slideIdx ? "w-6 bg-gold-500" : "w-1.5 bg-white/30 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
