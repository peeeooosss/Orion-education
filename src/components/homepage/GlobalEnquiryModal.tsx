"use client";

import { useState } from "react";
import { Sparkles, Phone, User, AlertCircle, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { STREAM_OPTIONS, type Stream, type ScoreBand } from "@/lib/scholarship";
import { MBA_PGDM_COLLEGES } from "@/data/college-directory";

interface CollegeOption {
  id: string;
  name: string;
  city: string;
  programs: { name: string; stream: string | null }[];
}

const ADMISSION_TIMELINES = ["This admission cycle", "Within 1 month", "Within 3 months", "Just exploring"];

const COLLEGE_OPTIONS: CollegeOption[] = MBA_PGDM_COLLEGES.map((college) => ({
  id: college.id,
  name: college.name,
  city: college.location,
  programs: college.courses.map((course) => ({ name: course.name, stream: "MBA" })),
}));

export function GlobalEnquiryModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCollege, setSelectedCollege] = useState<CollegeOption | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [scoreBand, setScoreBand] = useState<ScoreBand>("75-90");
  const [timeline, setTimeline] = useState<string>(ADMISSION_TIMELINES[0]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [stream, setStream] = useState<Stream>("Engineering");

  function resetForm() {
    setStep("form");
    setError("");
    setName("");
    setPhone("");
    setSelectedCollege(null);
    setSelectedProgram("");
    setScoreBand("75-90");
    setStream("MBA");
    setTimeline(ADMISSION_TIMELINES[0]);
  }

  function handleCollegeChange(collegeId: string) {
    const c = COLLEGE_OPTIONS.find((col) => col.id === collegeId) || null;
    setSelectedCollege(c);
    setSelectedProgram(c?.programs[0]?.name ?? "");
    if (c) {
      const pStream = c.programs[0]?.stream as Stream;
      if (pStream && STREAM_OPTIONS.some((s) => s.value === pStream)) {
        setStream(pStream);
      }
    }
  }

  async function handleSubmit() {
    if (!name.trim() || phone.trim().length < 10 || !selectedCollege) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          stream,
          scoreBand,
          source: "College Enquiry",
          targetCollege: selectedCollege.id,
          collegeId: selectedCollege.id,
          targetProgram: selectedProgram,
          lookingFor: `${selectedProgram} · ${stream}`,
          admissionTimeline: timeline,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit enquiry");
      }
      setStep("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const programOptions = selectedCollege?.programs || [];

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!loading) { if (o) resetForm(); onOpenChange(o); } }}>
      <DialogContent className="max-w-md border border-surface-200 bg-surface-0">
        {step === "success" ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold-100">
              <CheckCircle className="h-8 w-8 text-gold-700" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold text-surface-900">Enquiry sent!</h3>
            <p className="mt-2 text-sm text-surface-600">
              A counsellor will call you within minutes.
            </p>
            <Button variant="outline" className="mt-5 h-11 w-full" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-surface-900">
                Free Enquiry
              </DialogTitle>
              <DialogDescription className="text-sm text-surface-600">
                A counsellor calls you within minutes — no payment, no obligation.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-1">
              <div className="space-y-2">
                <Label htmlFor="ge-name" className="text-surface-800">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                  <Input
                    id="ge-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rohan Desai"
                    className="h-11 rounded-2xl border-surface-200 pl-9 focus:border-gold-500 focus:ring-gold-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ge-phone" className="text-surface-800">Mobile number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                  <Input
                    id="ge-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="h-11 rounded-2xl border-surface-200 pl-9 focus:border-gold-500 focus:ring-gold-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-surface-800">College</Label>
                <Select
                  value={selectedCollege?.id ?? ""}
                  onValueChange={handleCollegeChange}
                 >
                    <SelectTrigger className="h-11 w-full rounded-2xl border-surface-200">
                     <SelectValue placeholder="Select a college" />
                  </SelectTrigger>
                  <SelectContent>
                     {COLLEGE_OPTIONS.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <div className="flex flex-col">
                          <span>{c.name}</span>
                          <span className="text-xs text-slate-500">{c.city}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCollege && programOptions.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-surface-800">Program</Label>
                  <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                    <SelectTrigger className="h-11 w-full rounded-2xl border-surface-200">
                      <SelectValue placeholder="Select program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programOptions.map((p) => (
                        <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-surface-800">Program type</Label>
                <div className="flex flex-wrap gap-2">
                  {STREAM_OPTIONS.filter((opt) => opt.value === "MBA").map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStream(opt.value)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                        stream === opt.value
                          ? "border-brand-950 bg-brand-950 text-white"
                          : "border-surface-200 text-surface-600 hover:border-gold-200"
                      )}
                    >
                      {opt.emoji} {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-surface-800">When do you plan to take admission?</Label>
                <div className="flex flex-wrap gap-2">
                  {ADMISSION_TIMELINES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeline(t)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                        timeline === t
                          ? "border-brand-950 bg-brand-950 text-white"
                          : "border-surface-200 text-surface-600 hover:border-gold-200"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                variant="gold"
                className="h-12 w-full"
                disabled={!name.trim() || phone.trim().length < 10 || !selectedCollege || loading}
                onClick={handleSubmit}
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Sending..." : "Get free counselling"}
              </Button>
              <p className="flex items-center justify-center gap-1.5 text-[11px] text-surface-500">
                <AlertCircle className="h-3.5 w-3.5 text-gold-700" /> No payment required
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
