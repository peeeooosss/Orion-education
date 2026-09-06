import { db } from "@/server/db";
import { leads, contacts, agents, users, leadActivities, followUps } from "@/server/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { nanoid } from "nanoid";

export type LeadCategory = "general" | "college_specific" | "study_abroad" | "imported";

export function resolveLeadCategory(source: string | undefined | null): LeadCategory {
  if (source === "Study Abroad") return "study_abroad";
  if (source === "College Enquiry") return "college_specific";
  if (source === "Website Visit") return "college_specific";
  if (source === "Imported Raw Data") return "imported";
  return "general";
}

export async function findOrCreateContact(input: {
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  state?: string | null;
}): Promise<string> {
  const phoneNorm = (input.phone || "").replace(/[^+\d]/g, "");
  const existing = await db
    .select()
    .from(contacts)
    .where(eq(contacts.phone, phoneNorm))
    .limit(1);

  if (existing.length > 0) {
    const patch: Record<string, unknown> = {};
    if (input.name && input.name.trim()) patch.name = input.name.trim();
    if (input.email) patch.email = input.email || null;
    if (input.city) patch.city = input.city;
    if (input.state) patch.state = input.state;
    if (Object.keys(patch).length > 0) {
      await db.update(contacts).set(patch).where(eq(contacts.id, existing[0].id));
    }
    return existing[0].id;
  }

  const contactId = `c-${nanoid(10)}`;
  await db.insert(contacts).values({
    id: contactId,
    name: input.name.trim() || "Unknown",
    phone: phoneNorm,
    email: input.email || null,
    city: input.city || null,
    state: input.state || null,
  });
  return contactId;
}

export interface CreateLeadInput {
  contactId: string;
  source: string;
  leadType: string;
  leadCategory?: LeadCategory;
  lookingFor?: string | null;
  targetCollege?: string | null;
  targetProgram?: string | null;
  admissionTimeline?: string | null;
  scholarshipAmount?: string | number;
  scholarshipApplied?: boolean;
  intentLevel?: string;
  scoreBand?: string;
  stream?: string;
  collegeId?: string | null;
  studyCountry?: string | null;
  studyLevel?: string | null;
  studyField?: string | null;
  sourceForm?: string | null;
  questionnaire?: unknown;
  rawStudentId?: string | null;
  agentId?: string | null;
  assignedBy?: string | null;
  assignmentNote?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function createLead(input: CreateLeadInput): Promise<string> {
  const leadId = `l-${nanoid(12)}`;
  const now = new Date();
  await db.insert(leads).values({
    id: leadId,
    contactId: input.contactId,
    agentId: input.agentId ?? null,
    stage: "New",
    source: input.source,
    leadType: input.leadType,
    leadCategory: input.leadCategory ?? resolveLeadCategory(input.source),
    assignmentStatus: input.agentId ? "Assigned" : "Unassigned",
    sourceForm: input.sourceForm ?? null,
    collegeId: input.collegeId ?? null,
    lookingFor: input.lookingFor ?? null,
    targetCollege: input.targetCollege ?? null,
    targetProgram: input.targetProgram ?? null,
    admissionTimeline: input.admissionTimeline ?? null,
    scholarshipAmount: input.scholarshipAmount != null ? String(input.scholarshipAmount) : "0",
    scholarshipApplied: input.scholarshipApplied ?? false,
    paymentStatus: "Not Required",
    intentLevel: input.intentLevel ?? "Cold",
    intentScore: 0,
    scoreBand: input.scoreBand ?? null,
    stream: input.stream ?? null,
    callStatus: "Not Called",
    interestStatus: "Not Assessed",
    studyCountry: input.studyCountry ?? null,
    studyLevel: input.studyLevel ?? null,
    studyField: input.studyField ?? null,
    rawStudentId: input.rawStudentId ?? null,
    assignedBy: input.assignedBy ?? null,
    assignedAt: input.agentId ? now : null,
    assignmentNote: input.assignmentNote ?? null,
    questionnaire: input.questionnaire ?? null,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  });
  return leadId;
}

export async function assignLead(params: {
  leadId: string;
  agentId: string;
  assignedBy: string;
  note?: string | null;
}): Promise<{ ok: boolean; leadId: string }> {
  const { leadId, agentId, assignedBy, note } = params;

  const agentUser = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.id, agentId))
    .limit(1);
  if (!agentUser[0] || agentUser[0].id !== agentId) {
    throw new Error("Invalid agent");
  }
  const agentName = agentUser[0].name;

  const leadResult = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  if (!leadResult[0]) {
    throw new Error("Lead not found");
  }
  const previousAgentId = leadResult[0].agentId;
  const isReassign = Boolean(previousAgentId && previousAgentId !== agentId);
  const alreadySame = previousAgentId === agentId;

  await db
    .update(leads)
    .set({
      agentId,
      assignmentStatus: "Assigned",
      assignedBy,
      assignedAt: new Date(),
      assignmentNote: note || (isReassign ? `Reassigned by admin to ${agentName}` : `Assigned by admin to ${agentName}`),
      updatedAt: new Date(),
    })
    .where(eq(leads.id, leadId));

  if (!alreadySame) {
    await db.insert(leadActivities).values({
      id: `act-${nanoid(12)}`,
      leadId,
      agentId,
      kind: "assignment",
      note: note || (isReassign ? `Reassigned by admin to ${agentName}` : `Assigned by admin to ${agentName}`),
    });

    // On reassignment, cancel the previous agent's pending follow-ups so the
    // new owner starts clean, then create a fresh intro follow-up for them.
    if (isReassign && previousAgentId) {
      await db
        .update(followUps)
        .set({ completed: true, completedAt: new Date() })
        .where(and(eq(followUps.leadId, leadId), eq(followUps.agentId, previousAgentId), eq(followUps.completed, false)));
    }

    await db.insert(followUps).values({
      id: `fu-${nanoid(12)}`,
      leadId,
      agentId,
      dueAt: new Date(),
      followType: "Call",
      priority: "Normal",
      note: `New lead assigned by admin. Call to introduce Orion.`,
    });

    await db.update(agents).set({
      leadsAssigned: sql`${agents.leadsAssigned} + 1`,
    }).where(eq(agents.id, agentId));
  }

  return { ok: true, leadId };
}

export async function bulkAssignLeads(params: {
  leadIds: string[];
  agentId: string;
  assignedBy: string;
  note?: string | null;
}): Promise<{ assigned: number; failed: number }> {
  let assigned = 0;
  let failed = 0;
  for (const leadId of params.leadIds) {
    try {
      await assignLead({
        leadId,
        agentId: params.agentId,
        assignedBy: params.assignedBy,
        note: params.note,
      });
      assigned += 1;
    } catch {
      failed += 1;
    }
  }
  return { assigned, failed };
}