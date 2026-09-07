import type { Application, ApplicationDoc, ApplicationStage, Lead } from "@/store/types";

export const DOC_TEMPLATE: Omit<ApplicationDoc, "done">[] = [
  { id: "d1", name: "Class 10 Marksheet", required: true },
  { id: "d2", name: "Class 12 Marksheet", required: true },
  { id: "d3", name: "Transfer Certificate", required: true },
  { id: "d4", name: "ID / Aadhaar Proof", required: true },
  { id: "d5", name: "Passport Photos", required: true },
  { id: "d6", name: "Entrance Exam Scorecard", required: true },
  { id: "d7", name: "Caste / Income Certificate (if applicable)", required: false },
];

export function freshDocs(): ApplicationDoc[] {
  return DOC_TEMPLATE.map((d) => ({ ...d, done: false }));
}

export const APPLICATION_STAGES: ApplicationStage[] = ["Docs Pending", "Submitted", "Offer Received", "Admitted"];

export const STAGE_TO_LEAD_STATUS: Record<ApplicationStage, Lead["status"]> = {
  "Docs Pending": "Application Started",
  Submitted: "Application Started",
  "Offer Received": "Offer Received",
  Admitted: "Admitted",
};

export function mapApplicationDetail(data: Record<string, unknown>): Application {
  const app = (data.application as Record<string, unknown>) ?? {};
  const docs = ((data.documents as { id?: string; name?: string; required?: boolean; done?: boolean }[]) ?? []).map((d) => ({
    id: d.id ?? "",
    name: d.name ?? "",
    required: Boolean(d.required),
    done: Boolean(d.done),
  }));
  const events = ((data.events as { label?: string; createdAt?: string }[]) ?? []).map((e) => ({
    at: e.createdAt ?? new Date().toISOString(),
    label: e.label ?? "",
  }));
  return {
    id: (app.id as string) ?? "",
    leadId: (app.leadId as string) ?? "",
    studentName: (app.contactName as string) ?? "Student",
    phone: (app.contactPhone as string) ?? "",
    collegeId: (app.collegeId as string) ?? "",
    collegeName: (app.collegeName as string) ?? "",
    program: (app.program as string) ?? "",
    scholarshipApplied: Number(app.scholarship ?? 0),
    stage: (app.stage as ApplicationStage) ?? "Docs Pending",
    docs,
    notes: (app.notes as string) ?? "",
    agent: (app.agentName as string) ?? "",
    startedAt: (app.startedAt as string) ?? new Date().toISOString(),
    updatedAt: (app.updatedAt as string) ?? new Date().toISOString(),
    timeline: events,
  };
}