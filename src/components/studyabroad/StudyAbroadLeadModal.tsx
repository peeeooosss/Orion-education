"use client";

import { useState } from "react";
import { Plane, User, Phone, Mail, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
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
import { STUDY_ABROAD_COLLEGES, COUNTRIES, LEVELS, FIELDS, type AbroadCollege } from "@/data/study-abroad";

const TIMELINES = ["This admission cycle", "Within 1 month", "Within 3 months", "Just exploring"];
const OTHERS = "__others__";

interface StudyAbroadLeadModalProps {
  college?: AbroadCollege | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudyAbroadLeadModal({ college, open, onOpenChange }: StudyAbroadLeadModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [collegeSelection, setCollegeSelection] = useState<string>(college?.id ?? "");
  const [customCollege, setCustomCollege] = useState("");
  const [country, setCountry] = useState<string>(college?.country ?? "");
  const [level, setLevel] = useState<string>("");
  const [field, setField] = useState<string>("");
  const [timeline, setTimeline] = useState<string>(TIMELINES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isOthers = collegeSelection === OTHERS;
  const effectiveCollegeName = isOthers ? customCollege.trim() : STUDY_ABROAD_COLLEGES.find((c) => c.id === collegeSelection)?.name ?? "";

  async function handleSubmit() {
    if (!name.trim() || phone.trim().length < 10) {
      setError("Please enter your name and a valid phone number.");
      return;
    }
    if (isOthers && !customCollege.trim()) {
      setError("Please enter the university name for 'Others'.");
      return;
    }
    if (!effectiveCollegeName && !country) {
      setError("Please select a university or country.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/website-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          collegeId: isOthers ? null : collegeSelection || null,
          collegeName: effectiveCollegeName || null,
          program: field || null,
          admissionTimeline: timeline,
          source: "study-abroad",
          country: country || null,
          level: level || null,
          field: field || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save lead");
      }
      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        setCustomCollege("");
        setCollegeSelection("");
      }, 1800);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const handleCollegeChange = (value: string) => {
    setCollegeSelection(value);
    if (value !== OTHERS) {
      const c = STUDY_ABROAD_COLLEGES.find((x) => x.id === value);
      if (c) setCountry(c.country);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border border-surface-200 bg-surface-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-surface-900">
            <Plane className="h-5 w-5 text-indigo-600" />
            {effectiveCollegeName ? `Apply to ${effectiveCollegeName}` : "Study Abroad Enquiry"}
          </DialogTitle>
          <DialogDescription className="text-sm text-surface-600">
            {success
              ? "Thank you! Our study-abroad counsellor will reach out shortly."
              : "Share your details and our counsellor will guide you on admissions, scholarships and visas."}
          </DialogDescription>
        </DialogHeader>

        {!success ? (
          <div className="space-y-4 pt-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sa-name" className="text-surface-800">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                  <Input id="sa-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rohan Desai" className="h-11 rounded-2xl border-surface-200 pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sa-phone" className="text-surface-800">Mobile number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                  <Input id="sa-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="h-11 rounded-2xl border-surface-200 pl-9" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sa-email" className="text-surface-800">Email (optional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
                <Input id="sa-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-11 rounded-2xl border-surface-200 pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-surface-800">University of interest</Label>
              <Select value={collegeSelection} onValueChange={handleCollegeChange}>
                <SelectTrigger className="h-11 w-full rounded-2xl border-surface-200">
                  <SelectValue placeholder="Select a university" />
                </SelectTrigger>
                <SelectContent>
                  {STUDY_ABROAD_COLLEGES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <span className="flex items-center gap-2">{c.flag} {c.name}</span>
                    </SelectItem>
                  ))}
                  <SelectItem value={OTHERS} className="border-t border-slate-100">
                    <span className="flex items-center gap-2 font-medium text-slate-700">
                      <Plus className="h-4 w-4" /> Others (specify)
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              {isOthers && (
                <Input
                  value={customCollege}
                  onChange={(e) => setCustomCollege(e.target.value)}
                  placeholder="e.g., University of XYZ"
                  className="mt-2 h-11 rounded-2xl border-surface-200"
                  autoFocus
                />
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-surface-800">Preferred country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="h-11 w-full rounded-2xl border-surface-200">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-surface-800">Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger className="h-11 w-full rounded-2xl border-surface-200">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-surface-800">Field of interest</Label>
              <Select value={field} onValueChange={setField}>
                <SelectTrigger className="h-11 w-full rounded-2xl border-surface-200">
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {FIELDS.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-surface-800">Admission timeline</Label>
              <div className="flex flex-wrap gap-2">
                {TIMELINES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeline(t)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                      timeline === t ? "border-indigo-600 bg-indigo-600 text-white" : "border-surface-200 text-surface-600 hover:border-indigo-300"
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

            <Button variant="gold" className="h-12 w-full" disabled={loading} onClick={handleSubmit}>
              {loading ? "Submitting..." : "Get Free Counselling"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="text-sm text-surface-600">Our team will contact you within 24 hours.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
