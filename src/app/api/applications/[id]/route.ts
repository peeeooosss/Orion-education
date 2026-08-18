import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { applications, applicationDocuments, applicationEvents, leads, contacts } from "@/server/db/schema";
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
      contactName: contacts.name,
      contactPhone: contacts.phone,
    })
    .from(applications)
    .leftJoin(leads, eq(applications.leadId, leads.id))
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .where(eq(applications.id, id))
    .limit(1);

  if (!result[0]) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  // Documents
  const docs = await db
    .select()
    .from(applicationDocuments)
    .where(eq(applicationDocuments.applicationId, id));

  // Timeline events
  const events = await db
    .select()
    .from(applicationEvents)
    .where(eq(applicationEvents.applicationId, id))
    .orderBy(applicationEvents.createdAt);

  return NextResponse.json({
    application: result[0],
    documents: docs,
    events,
  });
}
