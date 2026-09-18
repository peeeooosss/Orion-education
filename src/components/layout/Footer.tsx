import Link from "next/link";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Top Colleges", href: "/#colleges" },
      { label: "Study Abroad", href: "/study-abroad" },
      { label: "Student Journey", href: "/journey" },
      { label: "Scholarships", href: "/scholarship" },
      { label: "Eligibility Check", href: "/scholarship" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "MBA vs PGDM — which is right?", href: "/blog/mba-vs-pgdm-india-2026" },
      { label: "How to get an MBA scholarship", href: "/blog/how-to-get-scholarship-mba-pgdm" },
      { label: "Top MBA colleges in Bangalore", href: "/blog/top-mba-pgdm-colleges-bangalore-2026" },
      { label: "Admission documents checklist", href: "/blog/college-admission-documents-checklist" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Achievements", href: "/achievements" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-surface-200 bg-brand-950 text-surface-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center rounded-2xl bg-white px-4 py-2" aria-label="Orion Education Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.webp"
                alt="Orion Education"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm text-surface-300">
              Find, compare and get admitted with confidence — Bachelors, Masters, MBA &amp; PGDM colleges
              in Bangalore and across India, with assured scholarships up to ₹30,000 at partner colleges.
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-surface-400">
              Guides on MBA &amp; PGDM admissions, scholarship eligibility, return on investment and
              document checklists — written to help you choose the right business school.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-xs font-semibold uppercase tracking-wider text-surface-400">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-surface-300 transition-colors hover:text-gold-400">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-2 border-t border-white/10 pt-6 text-center sm:text-left">
          <p className="text-xs text-surface-400">
            © 2026 Orion Education. Frontend demo prototype — no real admissions processed.
          </p>
          <p className="text-xs leading-relaxed text-surface-500">
            Orion Education helps students shortlist MBA, PGDM, B.Tech and BBA colleges in Bangalore and
            India, compare fees and placements, and unlock eligibility-backed scholarships up to ₹30,000.
          </p>
          <p className="text-xs text-surface-400">Powered by AURA AI infrastructure</p>
        </div>
      </div>
    </footer>
  );
}