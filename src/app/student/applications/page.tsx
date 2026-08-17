"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, FileStack, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAppStore, formatINR } from "@/store/useAppStore";
import type { ApplicationStage } from "@/store/types";

const STAGES: ApplicationStage[] = ["Docs Pending", "Submitted", "Offer Received", "Admitted"];

export default function StudentApplicationsPage() {
  const profile = useAppStore((s) => s.studentProfile);
  const applications = useAppStore((s) => s.applications).filter((application) => application.phone === profile.phone);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-gold-700">Live application tracking</p>
        <h1 className="mt-1 font-display text-3xl font-black text-brand-950">My applications</h1>
        <p className="mt-2 text-sm text-surface-600">Every stage, document and counsellor update is visible here.</p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-surface-300 bg-white p-12 text-center">
          <FileStack className="mx-auto h-10 w-10 text-surface-300" />
          <p className="mt-3 text-sm font-medium text-surface-600">You do not have an application in motion yet.</p>
          <Link href="/" className="mt-2 inline-block text-sm font-semibold text-gold-700 hover:underline">Explore colleges →</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((application) => {
            const current = STAGES.indexOf(application.stage);
            const completedDocs = application.docs.filter((doc) => doc.done).length;
            return (
              <article key={application.id} className="rounded-3xl border border-surface-200 bg-white p-6 shadow-card">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div><p className="text-lg font-bold text-brand-950">{application.collegeName}</p><p className="mt-1 text-sm text-surface-600">{application.program}</p><p className="mt-2 font-mono text-[11px] text-surface-400">Application #{application.id}</p></div>
                  <Badge variant="gold" className="w-fit bg-gold-100 text-gold-700">{formatINR(application.scholarshipApplied)} scholarship</Badge>
                </div>
                <div className="mt-7 flex items-start">
                  {STAGES.map((stage, index) => (
                    <div key={stage} className="flex flex-1 items-start">
                      <div className="flex flex-col items-center text-center">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${index <= current ? "bg-brand-gradient text-gold-400" : "bg-surface-200 text-surface-500"}`}>
                          {index < current ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                        </div>
                        <p className={`mt-2 text-[10px] font-medium ${index <= current ? "text-brand-950" : "text-surface-400"}`}>{stage}</p>
                      </div>
                      {index < STAGES.length - 1 && <div className={`mt-4 h-0.5 flex-1 ${index < current ? "bg-gold-500" : "bg-surface-200"}`} />}
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-col justify-between gap-3 border-t border-surface-100 pt-4 text-xs text-surface-500 sm:flex-row sm:items-center">
                  <span>{completedDocs}/{application.docs.length} documents verified</span>
                  <span>Updated {new Date(application.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-3 rounded-2xl bg-brand-950 p-5 text-white">
        <PhoneCall className="h-5 w-5 shrink-0 text-gold-400" />
        <p className="flex-1 text-sm text-white/75">Need help with documents or fee payment? Your Orion counsellor can guide the next step.</p>
        <Link href="/student/dashboard" className="inline-flex items-center gap-1 text-sm font-semibold text-gold-400">Dashboard <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </div>
  );
}
