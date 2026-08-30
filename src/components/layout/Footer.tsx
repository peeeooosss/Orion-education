import Link from "next/link";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Top Colleges", href: "#colleges" },
      { label: "Study Abroad", href: "/study-abroad" },
      { label: "Student Journey", href: "/journey" },
      { label: "Scholarships", href: "/scholarship" },
    ],
  },
  {
    title: "Portals",
    links: [
      { label: "Student Portal", href: "/auth/sign-in" },
      { label: "Agent CRM", href: "/auth/sign-in" },
      { label: "Admin Overview", href: "/auth/sign-in" },
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
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
                <svg className="h-4 w-4 text-gold-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21 2a3 3 0 0 0-3.1 3.5l-4 4a2 2 0 0 0-2.1 1l-4.7 4.7a2 2 0 1 0 1.4 1.4l4.7-4.7a2 2 0 0 0 1-2.1l4-4A3 3 0 0 0 21 2Z" />
                </svg>
              </div>
              <span className="font-display text-lg font-bold">
                Orion<span className="text-gold-500"> Education</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-surface-300">
              Find, compare and get admitted with confidence — Bachelors, Masters, MBA &amp; PGDM colleges with scholarships up to ₹30,000 at partner colleges.
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

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-surface-400">
            © 2026 Orion Education. Frontend demo prototype — no real admissions processed.
          </p>
          <p className="text-xs text-surface-400">Powered by AURA AI infrastructure</p>
        </div>
      </div>
    </footer>
  );
}
