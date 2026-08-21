"use client";

import { useState } from "react";
import { ExternalLink, Phone, User, AlertCircle } from "lucide-react";
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

const TIMELINES = ["This admission cycle", "Within 1 month", "Within 3 months", "Just exploring"];

export interface VisitWebsiteCollege {
  id: string;
  name: string;
  shortName: string;
  programs: { name: string }[];
  sourceWebsite?: string;
}

interface VisitWebsiteModalProps {
  college: VisitWebsiteCollege;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VisitWebsiteModal({ college, open, onOpenChange }: VisitWebsiteModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [program, setProgram] = useState<string>(college.programs[0]?.name ?? "");
  const [timeline, setTimeline] = useState<string>(TIMELINES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!name.trim() || phone.trim().length < 10) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/website-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          program,
          admissionTimeline: timeline,
          collegeId: college.id,
          collegeName: college.name,
          sourceWebsite: college.sourceWebsite,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save lead");
      }
      onOpenChange(false);
      const target = college.sourceWebsite ?? "#";
      if (target && target !== "#") {
        window.open(target, "_blank", "noopener,noreferrer");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-surface-200 bg-surface-0">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-surface-900">Visit {college.shortName} website</DialogTitle>
          <DialogDescription className="text-sm text-surface-600">
            Tell us a bit about you before we take you to the official site — our counsellor can then follow up with the right info.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="space-y-2">
            <Label htmlFor="vw-name" className="text-surface-800">Full name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <Input id="vw-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rohan Desai" className="h-11 rounded-2xl border-surface-200 pl-9 focus:border-gold-500 focus:ring-gold-200" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vw-phone" className="text-surface-800">Mobile number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <Input id="vw-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className="h-11 rounded-2xl border-surface-200 pl-9 focus:border-gold-500 focus:ring-gold-200" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-surface-800">Program of interest</Label>
            <Select value={program} onValueChange={setProgram}>
              <SelectTrigger className="h-11 w-full rounded-2xl border-surface-200">
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                {college.programs.map((p) => (
                  <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
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
                    timeline === t ? "border-brand-950 bg-brand-950 text-white" : "border-surface-200 text-surface-600 hover:border-gold-200"
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

          <Button variant="gold" className="h-12 w-full" disabled={!name.trim() || phone.trim().length < 10 || loading} onClick={handleSubmit}>
            <ExternalLink className="h-4 w-4" /> {loading ? "Saving..." : "Continue to official website"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
