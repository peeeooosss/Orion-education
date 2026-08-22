"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CampusVideo {
  title: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  category?: string;
  duration?: string;
  order?: number;
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?#]+)/);
  return match ? match[1] : null;
}

const CATEGORIES = ["All", "Campus Tour", "Hostel Tour", "Student Life", "Placements", "Other"];

export function CampusReels({ videos }: { videos: CampusVideo[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  if (!videos || videos.length === 0) return null;

  const sorted = [...videos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const filtered = filter === "All" ? sorted : sorted.filter((v) => v.category === filter);
  const activeVideo = filtered.find((v) => v.youtubeUrl === active);
  const activeId = active ? extractYoutubeId(active) : null;

  return (
    <Card className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-surface-800">
          <Play className="h-4 w-4 text-gold-700" strokeWidth={1.75} />
          Campus Reels &amp; Videos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const count = cat === "All" ? videos.length : videos.filter((v) => v.category === cat).length;
            if (cat !== "All" && count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  filter === cat
                    ? "bg-brand-950 text-gold-500 shadow-md"
                    : "bg-surface-50 text-surface-600 hover:bg-surface-100"
                }`}
              >
                {cat} {cat === "All" ? `(${count})` : `(${count})`}
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => {
            const vid = extractYoutubeId(video.youtubeUrl);
            const thumb = video.thumbnailUrl || (vid ? `https://img.youtube.com/vi/${vid}/mqdefault.jpg` : "");
            return (
              <button
                key={video.youtubeUrl}
                onClick={() => setActive(video.youtubeUrl)}
                className="group relative aspect-video overflow-hidden rounded-2xl text-left outline-none focus:ring-2 focus:ring-gold-500"
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumb}
                    alt={video.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-indigo-800" />
                )}
                <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-surface-900 shadow-lg transition-transform group-hover:scale-110">
                    <Play className="h-5 w-5 fill-current" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-xs font-semibold text-white line-clamp-1">{video.title || "Campus Video"}</p>
                  {video.duration && <p className="text-[10px] text-white/70">{video.duration}</p>}
                </div>
                {video.category && video.category !== "Other" && (
                  <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white">
                    {video.category}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>

      {active && activeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setActive(null)}>
          <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${activeId}?autoplay=1&rel=0`}
                title={activeVideo?.title || "Campus Video"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <button
              onClick={() => setActive(null)}
              className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-surface-900 shadow-lg hover:bg-surface-100"
              aria-label="Close video"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
            {activeVideo?.title && (
              <p className="mt-3 text-center text-sm font-semibold text-white">{activeVideo.title}</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
