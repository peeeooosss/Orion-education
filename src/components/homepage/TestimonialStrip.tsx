"use client";

import { Star } from "lucide-react";

const testimonials = [
  { name: "Aarav Patel", stream: "Engineering", quote: "Orion showed me the real placement numbers before I even shortlisted. Got my RVCE admission sorted end-to-end.", college: "RV College of Engineering" },
  { name: "Ishita Rao", stream: "MBA", quote: "The assured ₹45,000 scholarship was the push I needed. The counsellor called me within 10 minutes of enquiring.", college: "NMIMS University" },
  { name: "Aditi Kulkarni", stream: "Engineering", quote: "Compared 6 colleges side by side and found BMSCE was the best value for my COMEDK rank.", college: "BMS College of Engineering" },
  { name: "Farhan Sheikh", stream: "Commerce", quote: "The free counselling helped me pick BBA at Christ over pricier options. No pushy sales, just facts.", college: "Christ University" },
  { name: "Ananya Das", stream: "MBA", quote: "My enquiry went straight to a real agent who had my opening script ready. Felt handled from day one.", college: "MYRA School of Business" },
];

export function TestimonialStrip() {
  return (
    <section className="border-b border-surface-200 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-700">Loved by students</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-surface-900 sm:text-3xl">
            Real students. Real admissions.
          </h2>
        </div>
      </div>

      <div className="relative mt-8 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white to-transparent" />
        <div className="animate-marquee flex w-max gap-5 px-5">
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={`${t.name}-${i}`}
              className="w-80 shrink-0 rounded-2xl border border-surface-200 bg-surface-50 p-5 shadow-card"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-surface-700">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                  {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900">{t.name}</p>
                  <p className="text-xs text-surface-500">{t.stream} · {t.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
