import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { leads, contacts, agents, leadActivities, followUps, rawStudents } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const result = await db
    .select({
      id: leads.id,
      stage: leads.stage,
      source: leads.source,
      leadType: leads.leadType,
      lookingFor: leads.lookingFor,
      targetCollege: leads.targetCollege,
      targetProgram: leads.targetProgram,
      scholarshipAmount: leads.scholarshipAmount,
      scholarshipApplied: leads.scholarshipApplied,
      paymentStatus: leads.paymentStatus,
      intentLevel: leads.intentLevel,
      intentScore: leads.intentScore,
      intentReasons: leads.intentReasons,
      scoreBand: leads.scoreBand,
      stream: leads.stream,
      callStatus: leads.callStatus,
      interestStatus: leads.interestStatus,
      nextAction: leads.nextAction,
      callConnected: leads.callConnected,
      lastCalledAt: leads.lastCalledAt,
      nextFollowUpAt: leads.nextFollowUpAt,
      createdAt: leads.createdAt,
      updatedAt: leads.updatedAt,
      rawStudentId: leads.rawStudentId,
      assignmentNote: leads.assignmentNote,
      questionnaire: leads.questionnaire,
      // Contact
      contactId: contacts.id,
      contactName: contacts.name,
      contactPhone: contacts.phone,
      contactEmail: contacts.email,
      contactCity: contacts.city,
      contactState: contacts.state,
      // Agent
      agentId: leads.agentId,
    })
    .from(leads)
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .leftJoin(agents, eq(leads.agentId, agents.id))
    .where(eq(leads.id, id))
    .limit(1);

  if (!result[0]) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const lead = result[0];

  // Fetch activities
  const activities = await db
    .select()
    .from(leadActivities)
    .where(eq(leadActivities.leadId, id))
    .orderBy(leadActivities.createdAt);

  // Fetch follow-ups
  const followUpList = await db
    .select()
    .from(followUps)
    .where(eq(followUps.leadId, id))
    .orderBy(followUps.dueAt);

  // Fetch raw student data if linked
  let rawStudent = null;
  if (lead.rawStudentId) {
    const raw = await db
      .select()
      .from(rawStudents)
      .where(eq(rawStudents.id, lead.rawStudentId))
      .limit(1);
    rawStudent = raw[0] || null;
  }

  return NextResponse.json({
    lead,
    activities,
    followUps: followUpList,
    rawStudent,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Fields that can be updated
  const allowed = [
    "stage", "intentLevel", "intentScore", "callStatus",
    "interestStatus", "nextAction", "callConnected",
    "lastCalledAt", "nextFollowUpAt", "lookingFor",
    "targetCollege", "targetProgram", "questionnaire",
  ] as const;

  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) {
      updates[key] = body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  updates.updatedAt = new Date();

  await db.update(leads).set(updates).where(eq(leads.id, id));

  // Log the update as activity
  if (body.stage || body.interestStatus || body.callStatus) {
    await db.insert(leadActivities).values({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      leadId: id,
      agentId: session.userId,
      kind: "status_change",
      note: body.note || null,
      oldStage: body.oldStage || null,
      newStage: body.stage || null,
      interest: body.interestStatus || null,
    });
  }

  return NextResponse.json({ ok: true });
}
