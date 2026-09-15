import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays, Clock3 } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { BLOG_POSTS } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Admission Guides & Scholarship Insights — Orion Education Blog",
  description:
    "Guides on MBA & PGDM admissions, how to get scholarships up to ₹30,000, college comparisons and the real ROI of a business degree — written by the Orion Education team.",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Admission Guides & Scholarship Insights — Orion Education Blog",
    description:
      "MBA & PGDM admission guides, scholarship guides and ROI breakdowns for choosing the right college in India.",
    siteName: "Orion Education",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <SiteHeader />
      <main className="flex-1">
        <div className="relative overflow-hidden bg-brand-gradient text-white">
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-brand-800/30 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-300">
              <BookOpen className="h-4 w-4" strokeWidth={1.75} /> Orion Education Blog
            </span>
            <h1 className="mt-5 font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Guides to getting admitted, smarter
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-surface-300/70">
              Practical reads on MBA and PGDM admissions, scholarships up to ₹30,000,
              college comparisons and the real return on every rupee you invest.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="gold" className="bg-gold-100 text-gold-700">{post.category}</Badge>
                  <span className="flex items-center gap-1 text-xs text-surface-400">
                    <Clock3 className="h-3.5 w-3.5" /> {post.readingMinutes} min
                  </span>
                </div>
                <h2 className="mt-4 font-display text-lg font-bold leading-snug text-surface-900 group-hover:text-gold-700">
                  {post.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-surface-600">{post.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-surface-100 pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-surface-500">
                    <CalendarDays className="h-3.5 w-3.5" /> {formatDate(post.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-700 transition-all group-hover:gap-2">
                    Read article <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}