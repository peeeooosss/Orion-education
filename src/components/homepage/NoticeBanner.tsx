"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarDays, Megaphone } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  externalUrl: string | null;
}

function formatDate(date: string): string {
  if (!date) return "";
  try {
    const d = new Date(`${date}T00:00:00`);
    if (isNaN(d.getTime())) return date;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  } catch {
    return date;
  }
}

export function NoticeBanner() {
  const [items, setItems] = React.useState<NewsItem[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/news?limit=3")
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
    <div className="border-b border-surface-200 bg-gradient-to-r from-brand-50 via-gold-50 to-brand-50">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-1.5 px-4 py-2.5 sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-brand-800">
          <Megaphone className="h-4 w-4 text-gold-600" strokeWidth={2} />
          Notices
        </span>
        {items.map((item) => (
          <span key={item.id} className="inline-flex min-w-0 items-center gap-2 text-xs">
            <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-brand-700 ring-1 ring-brand-200">
              {item.category}
            </span>
            <Link
              href={item.externalUrl || "/news"}
              target={item.externalUrl ? "_blank" : undefined}
              rel={item.externalUrl ? "noopener noreferrer" : undefined}
              className="min-w-0 truncate font-medium text-surface-700 underline-offset-2 hover:text-brand-700 hover:underline"
            >
              {item.title}
            </Link>
            <span className="hidden shrink-0 items-center gap-1 text-surface-400 md:inline-flex">
              <CalendarDays className="h-3 w-3" />
              {formatDate(item.date)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}