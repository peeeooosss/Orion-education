import { Globe, Banknote, Clock } from "lucide-react";
import type { AbroadCollege } from "@/data/study-abroad";

interface AbroadCollegeCardProps {
  college: AbroadCollege;
  onEnquire: (college: AbroadCollege) => void;
}

export function AbroadCollegeCard({ college, onEnquire }: AbroadCollegeCardProps) {
  return (
    <div className="group flex flex-col rounded-2xl border border-surface-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-indigo-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
            {college.flag}
          </div>
          <div>
            <h3 className="font-heading text-base font-bold text-surface-900 leading-tight">
              {college.name}
            </h3>
            <p className="text-xs text-surface-500">{college.city}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
          {college.qsRanking}
        </span>
      </div>

      <p className="mt-4 line-clamp-2 text-sm text-surface-600">{college.description}</p>

      <div className="mt-4 space-y-2.5">
        <p className="flex items-center gap-2 text-sm"><Banknote className="h-4 w-4 text-gold-600 shrink-0" /><span className="text-surface-700"><span className="font-semibold">{college.estAnnualFee}</span> / year</span></p>
        <p className="flex items-center gap-2 text-sm"><Clock className="h-4 w-4 text-gold-600 shrink-0" /><span className="text-surface-700">{college.duration}</span></p>
        <p className="flex items-center gap-2 text-sm"><Globe className="h-4 w-4 text-gold-600 shrink-0" /><span className="text-surface-700">{college.country}</span></p>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {college.popularPrograms.slice(0, 3).map((p) => (
          <span key={p} className="rounded-full bg-surface-100 px-2.5 py-1 text-[11px] font-medium text-surface-600">
            {p}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-2">
        <button
          onClick={() => onEnquire(college)}
          className="flex-1 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
        >
          Enquire Now
        </button>
        <a
          href={college.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface-200 text-surface-500 transition-colors hover:border-indigo-300 hover:text-indigo-600"
          aria-label={`Visit ${college.name} website`}
        >
          <Globe className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
