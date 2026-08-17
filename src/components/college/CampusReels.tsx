"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { College } from "@/store/types";

export function CampusReels({ college }: { college: College }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <Card className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-surface-800">
          <Play className="h-4 w-4 text-gold-700" strokeWidth={1.75} />
          Campus Reels
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {college.reels.map((reel, i) => (
            <button
              key={reel.id}
              onClick={() => setActive(reel.id)}
              className="group relative aspect-video overflow-hidden rounded-2xl text-left outline-none focus:ring-2 focus:ring-gold-500"
               style={{
                 background: college.photos?.[i]
                   ? `linear-gradient(135deg, rgba(15,13,46,.35), rgba(15,13,46,.72)), url(${college.photos[i]}) center/cover`
                   : `linear-gradient(135deg, ${reel.from}, ${reel.to})`,
               }}
              aria-label={`Play ${reel.title}`}
            >
              <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-surface-900 shadow-lg transition-transform group-hover:scale-110">
                  <Play className="h-5 w-5 fill-current" strokeWidth={1.75} />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-3">
                <p className="text-xs font-semibold text-white">{reel.title}</p>
                <p className="text-[10px] text-white/70">{reel.duration}</p>
              </div>
              <span className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </CardContent>

      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setActive(null)}>
          <div
            className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-3xl shadow-glass"
            style={{ background: "linear-gradient(135deg, #1E1B4B, #0F0D2E)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500 text-brand-950 shadow-2xl">
                <Play className="h-7 w-7 fill-current" strokeWidth={1.75} />
              </div>
              <p className="mt-4 font-display text-xl font-bold text-white">
                {college.reels.find((r) => r.id === active)?.title}
              </p>
              <p className="mt-1 text-sm text-white/60">Demo preview · {college.shortName} campus tour</p>
            </div>
            <button
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
              aria-label="Close reel"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
