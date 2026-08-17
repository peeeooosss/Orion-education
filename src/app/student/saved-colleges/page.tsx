"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, MapPin, Trash2 } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const STORAGE_KEY = "orion-saved-colleges";

export default function SavedCollegesPage() {
  const colleges = useAppStore((s) => s.colleges);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const timer = window.setTimeout(() => setSavedIds(JSON.parse(stored) as string[]), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function remove(id: string) {
    const next = savedIds.filter((savedId) => savedId !== id);
    setSavedIds(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  const saved = colleges.filter((college) => savedIds.includes(college.id));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-gold-700">Your shortlist</p>
        <h1 className="mt-1 font-display text-3xl font-black text-brand-950">Saved colleges</h1>
        <p className="mt-2 text-sm text-surface-600">Keep your favourite options together while you compare fees, programs and placements.</p>
      </div>

      {saved.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-surface-300 bg-white p-12 text-center">
          <Bookmark className="mx-auto h-10 w-10 text-surface-300" />
          <p className="mt-3 text-sm font-medium text-surface-600">No saved colleges yet.</p>
          <Link href="/#colleges" className="mt-2 inline-block text-sm font-semibold text-gold-700 hover:underline">Browse the college finder →</Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((college) => (
            <article key={college.id} className="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-card">
              <div className="h-36 bg-brand-gradient bg-cover bg-center" style={college.coverImage ? { backgroundImage: `linear-gradient(90deg, rgba(15,13,46,.9), rgba(15,13,46,.35)), url(${college.coverImage})` } : undefined}>
                <div className="flex h-full items-end p-5"><p className="font-display text-xl font-bold text-white">{college.shortName}</p></div>
              </div>
              <div className="p-5"><p className="text-sm font-bold text-brand-950">{college.name}</p><p className="mt-1 flex items-center gap-1 text-xs text-surface-500"><MapPin className="h-3 w-3" /> {college.city}</p><div className="mt-4 flex items-center justify-between"><Link href={`/college/${college.id}`} className="text-sm font-semibold text-gold-700 hover:underline">View profile →</Link><button type="button" onClick={() => remove(college.id)} className="inline-flex items-center gap-1 text-xs text-surface-500 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /> Remove</button></div></div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
