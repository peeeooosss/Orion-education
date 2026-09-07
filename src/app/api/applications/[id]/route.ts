import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { applications, applicationDocuments, applicationEvents, leads, contacts, users } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { APPLICATION_STAGES, STAGE_TO_LEAD_STATUS } from "@/lib/application";
import type { ApplicationStage } from "@/store/types";

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

async function assertAgentCanAccessApp(appId: string) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return { session, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const result = await db
    .select({ leadAgentId: leads.agentId })
    .from(applications)
    .leftJoin(leads, eq(applications.leadId, leads.id))
    .where(eq(applications.id, appId))
    .limit(1);

  if (!result[0]) {
    return { session, error: NextResponse.json({ error: "Application not found" }, { status: 404 }) };
  }

  if (session.role === "agent" && result[0].leadAgentId !== session.userId) {
    return { session, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { session, error: null };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await assertAgentCanAccessApp((await params).id);
  if (access.error) return access.error;
  const { id } = (await params);

  const result = await db
    .select({ ...APPLICATION_SELECT })
    .from(applications)
    .leftJoin(leads, eq(applications.leadId, leads.id))
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .leftJoin(users, eq(applications.agentId, users.id))
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await assertAgentCanAccessApp((await params).id);
  if (access.error) return access.error;
  const { id } = (await params);

  try {
    const body = await req.json();
    const now = new Date();
    const updates: Record<string, unknown> = {};
    const events: { id: string; applicationId: string; label: string; createdAt: Date }[] = [];

    if (body.stage !== undefined) {
      const stage = body.stage as ApplicationStage;
      if (!APPLICATION_STAGES.includes(stage)) {
        return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
      }
      updates.stage = stage;
      events.push({ id: `ae-${nanoid(12)}`, applicationId: id, label: `Stage moved to ${stage}`, createdAt: now });

      // Keep the linked lead's pipeline stage in sync
      const appResult = await db
        .select({ leadId: applications.leadId })
        .from(applications)
        .where(eq(applications.id, id))
        .limit(1);
      if (appResult[0]) {
        await db
          .update(leads)
          .set({ stage: STAGE_TO_LEAD_STATUS[stage], updatedAt: now })
          .where(eq(leads.id, appResult[0].leadId));
      }
    }

    if (body.notes !== undefined) {
      updates.notes = body.notes;
    }

    if (Object.keys(updates).length > 0) {
      updates.updatedAt = now;
      await db.update(applications).set(updates).where(eq(applications.id, id));
    }

    if (Array.isArray(body.docs)) {
      for (const doc of body.docs as { id?: string; done?: boolean }[]) {
        if (!doc?.id || typeof doc.done !== "boolean") continue;
        const matched = await db
          .select({ id: applicationDocuments.id })
          .from(applicationDocuments)
          .where(and(eq(applicationDocuments.id, doc.id), eq(applicationDocuments.applicationId, id)))
          .limit(1);
        if (matched[0]) {
          await db
            .update(applicationDocuments)
            .set({ done: doc.done })
            .where(eq(applicationDocuments.id, doc.id));
        }
      }
    }

    if (events.length > 0) {
      await db.insert(applicationEvents).values(events);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[applications PATCH] Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}