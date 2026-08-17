import { BadgeCheck, Scale, BadgePercent, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: BadgeCheck,
    title: "Verified facts, not brochure claims",
    body: "NIRF rankings, NAAC accreditation and real placement numbers — the same data counsellors use, in front of you.",
  },
  {
    icon: Scale,
    title: "Compare before you commit",
    body: "Fees, packages, seats and eligibility side by side across every partner college — shortlist with confidence.",
  },
  {
    icon: BadgePercent,
    title: "Scholarships up to ₹60,000",
    body: "An eligibility-backed scholarship at any partner college, unlocked in 30 seconds — no paperwork, no lottery.",
  },
  {
    icon: PhoneCall,
    title: "A counsellor who calls you back",
    body: "Send one enquiry and get a personalised call within minutes — every next step tracked in your portal.",
  },
];

export function WhyOrion() {
  return (
    <section id="why-orion" className="bg-surface-50 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="gold" className="bg-gold-100 text-gold-700">Why Orion</Badge>
          <h2 className="mt-3 font-display text-3xl font-bold text-surface-900 sm:text-4xl">
            Everything to shortlist, compare and apply — in one place
          </h2>
          <p className="mt-3 text-surface-600">
            Most portals stop at a list. Orion helps you decide — with verified data, a real
            scholarship, and a human who closes the loop.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <feature.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-base font-bold text-surface-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-surface-600">{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
