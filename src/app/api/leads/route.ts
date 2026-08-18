import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { leads, contacts, agents, rawStudents } from "@/server/db/schema";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source"); // "scholarship" | "enquiry" | "raw"
  const stage = searchParams.get("stage");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "smart"; // "smart" | "newest" | "oldest"
  const agentFilter = searchParams.get("agentId"); // admin only

  // Resolve agent ID for this user
  let targetAgentId: string | null = null;
  if (session.role === "agent") {
    targetAgentId = session.userId;
  } else if (agentFilter) {
    targetAgentId = agentFilter;
  }

  const conditions = [];

  if (targetAgentId) {
    conditions.push(eq(leads.agentId, targetAgentId));
  }

  if (source) {
    conditions.push(eq(leads.leadType, source));
  }

  if (stage) {
    conditions.push(eq(leads.stage, stage));
  }

  if (search) {
    conditions.push(
      or(
        ilike(contacts.name, `%${search}%`),
        ilike(contacts.phone, `%${search}%`),
        ilike(contacts.email, `%${search}%`)
      )!
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Smart sort: Hot leads first, then by creation date
  let orderClause;
  if (sort === "newest") {
    orderClause = desc(leads.createdAt);
  } else if (sort === "oldest") {
    orderClause = asc(leads.createdAt);
  } else {
    // Smart: Hot > Warm > Cold, then by creation date desc
    orderClause = sql`
      CASE ${leads.intentLevel}
        WHEN 'Hot' THEN 0
        WHEN 'Warm' THEN 1
        ELSE 2
      END, ${leads.createdAt} DESC
    `;
  }

  const results = await db
    .select({
      id: leads.id,
      stage: leads.stage,
      source: leads.source,
      leadType: leads.leadType,
      lookingFor: leads.lookingFor,
      targetCollege: leads.targetCollege,
      scholarshipAmount: leads.scholarshipAmount,
      scholarshipApplied: leads.scholarshipApplied,
      intentLevel: leads.intentLevel,
      intentScore: leads.intentScore,
      callStatus: leads.callStatus,
      interestStatus: leads.interestStatus,
      callConnected: leads.callConnected,
      lastCalledAt: leads.lastCalledAt,
      nextFollowUpAt: leads.nextFollowUpAt,
      createdAt: leads.createdAt,
      rawStudentId: leads.rawStudentId,
      assignmentNote: leads.assignmentNote,
      // Contact info
      contactName: contacts.name,
      contactPhone: contacts.phone,
      contactEmail: contacts.email,
      contactCity: contacts.city,
      // Agent info
      agentName: agents.avatarColor,
    })
    .from(leads)
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .leftJoin(agents, eq(leads.agentId, agents.id))
    .where(where)
    .orderBy(orderClause);

  // Enrich raw data leads with assignment info
  const enriched = await Promise.all(
    results.map(async (lead) => {
      if (lead.rawStudentId) {
        const raw = await db
          .select()
          .from(rawStudents)
          .where(eq(rawStudents.id, lead.rawStudentId))
          .limit(1);
        return { ...lead, rawStudent: raw[0] || null };
      }
      return lead;
    })
  );

  return NextResponse.json({ leads: enriched });
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const allowed = [
      "stage", "callStatus", "interestStatus", "callConnected",
      "scholarshipApplied", "leadType", "lookingFor", "targetCollege",
    ];

    const patch: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in updates) patch[key] = updates[key];
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "No valid fields" }, { status: 400 });
    }

    patch.updatedAt = new Date();

    await db.update(leads).set(patch).where(eq(leads.id, id));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[leads PATCH] Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
