import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { applications, leads, contacts } from "@/server/db/schema";
import { eq, and } from "drizzle-orm";

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
    })
    .from(applications)
    .leftJoin(leads, eq(applications.leadId, leads.id))
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .where(where)
    .orderBy(applications.updatedAt);

  return NextResponse.json({ applications: results });
}
