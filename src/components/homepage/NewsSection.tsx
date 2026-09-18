"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  date: string;
  externalUrl: string | null;
}

function formatDate(date: string): string {
  if (!date) return "";
  try {
    const d = new Date(`${date}T00:00:00`);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return date;
  }
}

const CATEGORY_STYLES: Record<string, string> = {
  Exams: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  Admissions: "bg-green-50 text-green-700 ring-green-200",
  Scholarships: "bg-gold-100 text-gold-700 ring-gold-200",
  Results: "bg-rose-50 text-rose-700 ring-rose-200",
  College: "bg-blue-50 text-blue-700 ring-blue-200",
  General: "bg-surface-100 text-surface-600 ring-surface-200",
};

export function NewsSection() {
  const [items, setItems] = React.useState<NewsItem[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/news?limit=6")
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        if (!cancelled) setItems(data.items || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="border-t border-surface-200 bg-surface-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700">
              <Newspaper className="h-4 w-4" /> Stay updated
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-surface-900 sm:text-4xl">
              News &amp; Updates
            </h2>
            <p className="mt-2 max-w-xl text-surface-600">
              Exam dates, admission windows, results and scholarship deadlines — fresh
              updates for students applying this cycle.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const Tag = item.externalUrl ? Link : "div";
            return (
              <Tag
                key={item.id}
                {...(item.externalUrl
                  ? {
                      href: item.externalUrl,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    }
                  : {})}
                className="group flex flex-col rounded-2xl border border-surface-200 bg-white p-6 shadow-card transition-shadow hover:shadow-float"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${CATEGORY_STYLES[item.category] || CATEGORY_STYLES.General}`}
                  >
                    {item.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-surface-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(item.date)}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-surface-900 group-hover:text-brand-700">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-surface-600">
                    {item.excerpt}
                  </p>
                )}
                {item.externalUrl && (
                  <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-brand-700">
                    Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}