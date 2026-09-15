import Link from "next/link";
import { ArrowRight, BadgePercent, GraduationCap, PhoneCall, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const steps = [
  {
    icon: Search,
    title: "Discover & compare",
    body: "Search, filter and shortlist colleges with verified fees and placements.",
    href: "/#colleges",
  },
  {
    icon: BadgePercent,
    title: "Check eligibility",
    body: "Unlock your scholarship amount in 30 seconds, backed by your score.",
    href: "/scholarship",
  },
  {
    icon: PhoneCall,
    title: "Counsellor closes it",
    body: "One enquiry routes to a counsellor who calls you back within minutes — your portal keeps everything in one place.",
  },
  {
    icon: GraduationCap,
    title: "Track to admission",
    body: "Docs, offer and seat — followed live in your student portal, every step of the way.",
    href: "/student/dashboard",
  },
];

export function JourneyTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="gold" className="bg-gold-100 text-gold-700">Student Journey</Badge>
          <h2 className="mt-3 font-display text-3xl font-bold text-surface-900 sm:text-4xl">
            Your journey to a confirmed seat
          </h2>
          <p className="mt-2 max-w-xl text-surface-600">
            From discovering the right college to walking into it — a real counsellor
            and a tracked process behind every step, so nothing falls through the cracks.
          </p>
        </div>
        <Link
          href="/journey"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-900"
        >
          See the full journey <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => {
          const card = (
            <>
              <span className="absolute right-5 top-5 font-display text-3xl font-black text-surface-200/50 transition-colors group-hover:text-gold-500/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <step.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-base font-bold text-surface-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-surface-600">{step.body}</p>
              {step.href ? (
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-gold-700 transition-all group-hover:gap-2">
                  Try it <ArrowRight className="h-4 w-4" />
                </span>
              ) : (
                <span className="mt-4 inline-block text-sm font-semibold text-surface-400">
                  Handled by your counsellor
                </span>
              )}
            </>
          );

          const classes =
            "group relative overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 shadow-card";

          return step.href ? (
            <Link
              key={step.title}
              href={step.href}
              className={classes + " transition-all duration-300 hover:-translate-y-1 hover:shadow-float"}
            >
              {card}
            </Link>
          ) : (
            <div key={step.title} className={classes}>
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}