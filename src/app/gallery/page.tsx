"use client";

import { useState, useEffect } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  dateLabel: string | null;
  sortOrder: number;
  published: boolean;
}

const PLACEHOLDER_TILES = [
  { title: "Admission Fair 2026", category: "Events", date: "Jan 2026", gradient: "from-brand-600 via-violet-600 to-brand-800", span: true },
  { title: "Counsellor Bootcamp", category: "Team", date: "Dec 2025", gradient: "from-teal-500 via-teal-700 to-brand-900" },
  { title: "Campus Visit — NMIMS", category: "Campus Visits", date: "Nov 2025", gradient: "from-gold-400 via-gold-600 to-gold-800" },
  { title: "Scholarship Felicitation", category: "Achievements", date: "Oct 2025", gradient: "from-gold-300 via-orange-500 to-red-600" },
  { title: "Education Expo Stall", category: "Events", date: "Sep 2025", gradient: "from-brand-500 via-indigo-600 to-violet-700", span: true },
  { title: "Campus Visit — Christ University", category: "Campus Visits", date: "Aug 2025", gradient: "from-emerald-400 via-teal-600 to-teal-800" },
  { title: "Student Success Meetup", category: "Achievements", date: "Jul 2025", gradient: "from-violet-500 via-purple-600 to-brand-800" },
  { title: "Agent Partner Summit", category: "Team", date: "Jun 2025", gradient: "from-sky-400 via-blue-600 to-indigo-800" },
  { title: "Seminar — Beyond Rankings", category: "Events", date: "May 2025", gradient: "from-rose-400 via-pink-600 to-violet-700", span: true },
  { title: "Campus Visit — RVCE", category: "Campus Visits", date: "Apr 2025", gradient: "from-amber-300 via-yellow-500 to-orange-600" },
];

type TileItem =
  | { kind: "db"; photo: GalleryPhoto }
  | { kind: "placeholder"; title: string; category: string; date: string; gradient: string; span?: boolean };

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [tiles, setTiles] = useState<TileItem[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.photos?.length > 0) {
          const dbTiles: TileItem[] = data.photos.map((p: GalleryPhoto) => ({ kind: "db" as const, photo: p }));
          const placeholderTiles: TileItem[] = PLACEHOLDER_TILES.map((t) => ({ kind: "placeholder" as const, ...t }));
          setTiles([...dbTiles, ...placeholderTiles]);
        } else {
          setTiles(PLACEHOLDER_TILES.map((t) => ({ kind: "placeholder" as const, ...t })));
        }
      })
      .catch(() => {
        setTiles(PLACEHOLDER_TILES.map((t) => ({ kind: "placeholder" as const, ...t })));
      });
  }, []);

  const allCategories = ["All", ...Array.from(new Set(tiles.map((t) => (t.kind === "db" ? t.photo.category : t.category))))];
  const visible = tiles.filter((t) => filter === "All" || (t.kind === "db" ? t.photo.category === filter : t.category === filter));

  const step = (dir: 1 | -1) => {
    if (lightbox === null) return;
    setLightbox((lightbox + dir + visible.length) % visible.length);
  };

  function getTileTitle(t: TileItem) { return t.kind === "db" ? t.photo.title : t.title; }
  function getTileCategory(t: TileItem) { return t.kind === "db" ? t.photo.category : t.category; }
  function getTileDate(t: TileItem) { return t.kind === "db" ? (t.photo.dateLabel || "") : t.date; }
  function getTileSpan(t: TileItem) { return t.kind === "placeholder" ? t.span : false; }

  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-deep text-white">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold text-gold-300">
              <Images className="h-4 w-4" strokeWidth={1.75} /> Gallery
            </span>
            <h1 className="mt-5 font-display text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Moments that made us
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-surface-300/70">
              Fairs, campus visits, felicitations and everything in between — a look at Orion in action.
            </p>
          </div>
        </section>

        {/* Filter + Grid */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-2">
              {allCategories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm font-semibold transition-all",
                    filter === c
                      ? "bg-brand-gradient text-white shadow-float"
                      : "border border-surface-200 bg-white text-surface-600 hover:border-gold-400 hover:text-gold-700"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-10 grid auto-rows-[220px] grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {visible.map((tile, i) => {
                const span = getTileSpan(tile);
                const isDb = tile.kind === "db";
                return (
                  <button
                    key={isDb ? tile.photo.id : `${tile.category}-${i}`}
                    onClick={() => setLightbox(i)}
                    className={cn(
                      "group relative overflow-hidden rounded-3xl text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-float",
                      span ? "col-span-2 row-span-1 sm:row-span-2" : ""
                    )}
                  >
                    {isDb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tile.photo.imageUrl} alt={tile.photo.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    ) : (
                      <div className={cn("absolute inset-0 bg-gradient-to-br", (tile as TileItem & { kind: "placeholder" }).gradient)} />
                    )}
                    {isDb && <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/20" />}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent p-4 pt-10 sm:p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/70">{getTileCategory(tile)}</p>
                      <h2 className={cn("font-display font-bold leading-snug text-white", span ? "text-lg sm:text-xl" : "text-sm sm:text-base")}>
                        {getTileTitle(tile)}
                      </h2>
                      {getTileDate(tile) && (
                        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/60">
                          <CalendarDays className="h-3 w-3" /> {getTileDate(tile)}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {tiles.length === 0 && (
              <p className="mt-10 text-center text-xs text-surface-400">No photos available yet. Check back soon.</p>
            )}
          </div>
        </section>

        {/* Lightbox */}
        {lightbox !== null && visible[lightbox] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/90 p-4 backdrop-blur-sm"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:left-6"
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20 sm:right-6"
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div
              className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-3xl shadow-float"
              onClick={(e) => e.stopPropagation()}
            >
              {visible[lightbox].kind === "db" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={visible[lightbox].photo.imageUrl} alt={visible[lightbox].photo.title} className="h-full w-full object-cover" />
              ) : (
                <div className={cn("absolute inset-0 bg-gradient-to-br", (visible[lightbox] as TileItem & { kind: "placeholder" }).gradient)} />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 pt-14">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">{getTileCategory(visible[lightbox])}</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-white">{getTileTitle(visible[lightbox])}</h2>
                {getTileDate(visible[lightbox]) && (
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                    <CalendarDays className="h-3.5 w-3.5" /> {getTileDate(visible[lightbox])}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
