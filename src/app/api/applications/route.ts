import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { applications, applicationDocuments, applicationEvents, leads, contacts, colleges, users } from "@/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { DOC_TEMPLATE, STAGE_TO_LEAD_STATUS } from "@/lib/application";

const docCount = sql<number>`(
  SELECT COUNT(*)::int FROM application_documents
  WHERE application_id = ${applications.id}
)`;
const docDoneCount = sql<number>`(
  SELECT COUNT(*)::int FROM application_documents
  WHERE application_id = ${applications.id} AND done = true
)`;

const APPLICATION_SELECT = {
  id: applications.id,
  leadId: applications.leadId,
  collegeId: applications.collegeId,
  collegeName: applications.collegeName,
  program: applications.program,
  scholarship: applications.scholarship,
  stage: applications.stage,
  notes: applications.notes,
  startedAt: applications.startedAt,
  updatedAt: applications.updatedAt,
  // Lead info
  contactName: contacts.name,
  contactPhone: contacts.phone,
  // Agent info
  agentName: users.name,
};

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const agentFilter = searchParams.get("agentId");
  const stage = searchParams.get("stage");

  let targetAgentId: string | null = null;
  if (session.role === "agent") {
    targetAgentId = session.userId;
  } else if (agentFilter) {
    targetAgentId = agentFilter;
  }

  const conditions = [];
  if (targetAgentId) {
    conditions.push(eq(applications.agentId, targetAgentId));
  }
  if (stage) {
    conditions.push(eq(applications.stage, stage));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db
    .select({
      ...APPLICATION_SELECT,
      docCount,
      docDoneCount,
    })
    .from(applications)
    .leftJoin(leads, eq(applications.leadId, leads.id))
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .leftJoin(users, eq(applications.agentId, users.id))
    .where(where)
    .orderBy(applications.updatedAt);

  return NextResponse.json({ applications: results });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { leadId, collegeId, collegeName, program, notes } = body;

    if (!leadId || !program) {
      return NextResponse.json({ error: "leadId and program are required" }, { status: 400 });
    }

    const leadResult = await db
      .select({
        agentId: leads.agentId,
        contactId: leads.contactId,
        scholarshipAmount: leads.scholarshipAmount,
        targetCollege: leads.targetCollege,
      })
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1);

    if (!leadResult[0]) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Agents may only start applications for leads assigned to them.
    if (session.role === "agent" && leadResult[0].agentId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const agentId = session.role === "agent" ? session.userId : null;

    // Resolve a human-readable college name (DB college → body fallback → lead target)
    let resolvedCollegeName = collegeName?.trim() || null;
    if (collegeId) {
      const c = await db
        .select({ name: colleges.name })
        .from(colleges)
        .where(eq(colleges.id, collegeId))
        .limit(1);
      if (c[0]) resolvedCollegeName = c[0].name;
    }
    const collegeNameFinal = resolvedCollegeName ?? leadResult[0].targetCollege ?? "College";

    const now = new Date();
    const appId = `app-${nanoid(12)}`;
    const scholarship = Number(leadResult[0].scholarshipAmount ?? 0);

    await db.insert(applications).values({
      id: appId,
      leadId,
      contactId: leadResult[0].contactId,
      agentId,
      collegeId: collegeId || null,
      collegeName: collegeNameFinal,
      program,
      scholarship: String(scholarship),
      stage: "Docs Pending",
      notes: notes?.trim() || null,
      startedAt: now,
      updatedAt: now,
    });

    // Create the default 7-document checklist for this application
    await db.insert(applicationDocuments).values(
      DOC_TEMPLATE.map((d) => ({
        id: `ad-${nanoid(12)}`,
        applicationId: appId,
        name: d.name,
        required: d.required,
        done: d.done,
      }))
    );

    // Timeline events
    const agentNameResult = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.id, agentId ?? ""))
      .limit(1);
    const agentLabel = agentNameResult[0]?.name ?? "Agent";

    await db.insert(applicationEvents).values([
      { id: `ae-${nanoid(12)}`, applicationId: appId, label: `Application started by ${agentLabel}`, createdAt: now },
      { id: `ae-${nanoid(12)}`, applicationId: appId, label: "Docs checklist created — awaiting documents", createdAt: now },
    ]);

    // Advance the lead so the pipeline reflects the application
    const leadStatus = STAGE_TO_LEAD_STATUS["Docs Pending"];
    await db
      .update(leads)
      .set({ stage: leadStatus, updatedAt: now })
      .where(eq(leads.id, leadId));

    // Fetch the created application with contact + agent info
    const created = await db
      .select({ ...APPLICATION_SELECT })
      .from(applications)
      .leftJoin(leads, eq(applications.leadId, leads.id))
      .leftJoin(contacts, eq(leads.contactId, contacts.id))
      .leftJoin(users, eq(applications.agentId, users.id))
      .where(eq(applications.id, appId))
      .limit(1);

    const docs = await db
      .select()
      .from(applicationDocuments)
      .where(eq(applicationDocuments.applicationId, appId));

    const events = await db
      .select()
      .from(applicationEvents)
      .where(eq(applicationEvents.applicationId, appId))
      .orderBy(applicationEvents.createdAt);

    return NextResponse.json(
      { application: created[0], documents: docs, events },
      { status: 201 }
    );
  } catch (error) {
    console.error("[applications POST] Error:", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}