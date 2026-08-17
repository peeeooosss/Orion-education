"use client";

import * as React from "react";
import {
  Award,
  BadgeCheck,
  Banknote,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  IndianRupee,
  MapPin,
  Star,
  Trophy,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/store/useAppStore";
import type { College } from "@/store/types";

export function UniversityDetailSheet({
  college,
  open,
  onOpenChange,
  onStartApplication,
}: {
  college: College | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartApplication: (college: College, program: string) => void;
}) {
  if (!college) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-slate-200 bg-brand-gradient px-6 py-6">
          <SheetTitle className="flex items-center justify-between gap-2 text-white">
            <span>{college.name}</span>
            <Badge className="bg-white/15 text-gold-400">{college.type}</Badge>
          </SheetTitle>
          <SheetDescription className="flex flex-wrap items-center gap-x-3 gap-y-1 text-white/70">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {college.city}
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-gold-400" /> {college.rating}
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" /> {college.ranking}
            </span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-6 py-5">
          <p className="text-sm leading-relaxed text-slate-700">{college.about}</p>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-brand-gradient p-3 text-white">
              <p className="text-[10px] text-white/60">Placement</p>
              <p className="font-heading text-xl font-black text-gold-400">{college.placementPct}%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Highest package</p>
              <p className="text-sm font-bold text-brand-950">₹{(college.highestPlacement / 100000).toFixed(1)}L</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3">
              <p className="text-[10px] text-slate-500">Intake</p>
              <p className="text-sm font-bold text-brand-950">{college.intake}</p>
            </div>
          </div>

          {college.accreditation.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-brand-950">
                <BadgeCheck className="h-4 w-4 text-gold-600" /> Accreditation
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {college.accreditation.map((a) => (
                  <Badge key={a} className="bg-gold-50 text-gold-600">{a}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 p-4">
            <h4 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-brand-950">
              <ClipboardCheck className="h-4 w-4 text-gold-600" /> Admissions
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Entrance exam</p>
                <p className="font-semibold text-brand-950">{college.admissions.exam}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Application fee</p>
                <p className="font-semibold text-brand-950">{college.admissions.applicationFee === 0 ? "No fee" : formatINR(college.admissions.applicationFee)}</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <CalendarDays className="h-3 w-3" /> Deadline
                </p>
                <p className="font-semibold text-brand-950">{college.admissions.deadline}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Min. eligibility</p>
                <p className="font-semibold text-brand-950">{college.admissions.minGPA}</p>
              </div>
            </div>
            {college.admissions.notes && (
              <p className="mt-2 text-xs text-slate-500">{college.admissions.notes}</p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <h4 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-brand-950">
              <IndianRupee className="h-4 w-4 text-gold-600" /> Cost of study
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Hostel / month</p>
                <p className="font-semibold text-brand-950">{formatINR(college.costs.hostelMonthly)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Living / month</p>
                <p className="font-semibold text-brand-950">{formatINR(college.costs.livingMonthly)}</p>
              </div>
            </div>
          </div>

          {college.scholarships.available && (
            <div className="flex items-start gap-2 rounded-2xl bg-gold-50/60 p-4">
              <Award className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
              <div>
                <p className="text-sm font-semibold text-brand-950">Scholarships available</p>
                <p className="text-xs text-slate-600">{college.scholarships.details}</p>
              </div>
            </div>
          )}

          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-brand-950">
              <GraduationCap className="h-4 w-4 text-gold-600" /> Programs ({college.programs.length})
            </h4>
            <div className="space-y-2">
              {college.programs.map((p) => (
                <div key={p.name} className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-brand-950">{p.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{p.durationYears} yrs</span>
                        <span>·</span>
                        <span>{p.eligibility}</span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {p.intakes.map((intake) => (
                          <Badge key={intake} className="bg-slate-100 text-slate-600">{intake}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="flex items-center justify-end gap-1 text-sm font-bold text-gold-600">
                        <Banknote className="h-3.5 w-3.5" /> ₹{(p.annualFee / 100000).toFixed(1)}L/yr
                      </p>
                      <p className="text-[11px] text-green-600">place {formatINR(p.avgPlacement)}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-7 border-gold-500 text-xs text-gold-600 hover:bg-gold-50"
                        onClick={() => onStartApplication(college, p.name)}
                      >
                        <CheckCircle2 className="h-3 w-3" /> Start Application
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
