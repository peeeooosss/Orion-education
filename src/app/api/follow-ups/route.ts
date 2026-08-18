import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { followUps, leads, contacts } from "@/server/db/schema";
import { eq, and, asc, lte } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter"); // "today" | "overdue" | "upcoming" | null (all)
  const agentFilter = searchParams.get("agentId");

  let targetAgentId: string | null = null;
  if (session.role === "agent") {
    targetAgentId = session.userId;
  } else if (agentFilter) {
    targetAgentId = agentFilter;
  }

  const conditions = [];
  if (targetAgentId) {
    conditions.push(eq(followUps.agentId, targetAgentId));
  }

  if (filter === "today") {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    conditions.push(lte(followUps.dueAt, endOfDay));
    conditions.push(eq(followUps.completed, false));
  } else if (filter === "overdue") {
    conditions.push(lte(followUps.dueAt, new Date()));
    conditions.push(eq(followUps.completed, false));
  } else if (filter === "upcoming") {
    conditions.push(eq(followUps.completed, false));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db
    .select({
      id: followUps.id,
      leadId: followUps.leadId,
      agentId: followUps.agentId,
      dueAt: followUps.dueAt,
      followType: followUps.followType,
      priority: followUps.priority,
      note: followUps.note,
      completed: followUps.completed,
      completedAt: followUps.completedAt,
      createdAt: followUps.createdAt,
      // Lead info for display
      leadName: contacts.name,
      leadPhone: contacts.phone,
    })
    .from(followUps)
    .leftJoin(leads, eq(followUps.leadId, leads.id))
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .where(where)
    .orderBy(asc(followUps.dueAt));

  return NextResponse.json({ followUps: results });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { leadId, dueAt, followType, priority, note } = body;

  if (!leadId || !dueAt) {
    return NextResponse.json({ error: "leadId and dueAt are required" }, { status: 400 });
  }

  const followUp = await db.insert(followUps).values({
    id: `fu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    leadId,
    agentId: session.userId,
    dueAt: new Date(dueAt),
    followType: followType || "Call",
    priority: priority || "Normal",
    note: note || null,
  }).returning();

  return NextResponse.json({ followUp: followUp[0] });
}
