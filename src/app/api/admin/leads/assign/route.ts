import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { bulkAssignLeads } from "@/lib/leads";

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { leadIds, agentId, note } = body;

  if (!Array.isArray(leadIds) || leadIds.length === 0) {
    return NextResponse.json({ error: "leadIds array is required" }, { status: 400 });
  }
  if (!agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }

  const agentUser = await db.select().from(users).where(eq(users.id, agentId)).limit(1);
  if (!agentUser[0] || agentUser[0].role !== "agent") {
    return NextResponse.json({ error: "Invalid agent" }, { status: 400 });
  }

  const result = await bulkAssignLeads({
    leadIds,
    agentId,
    assignedBy: session.userId,
    note: note || null,
  });

  return NextResponse.json(result);
}