import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { rawStudents, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { assignLead } from "@/lib/leads";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { agentId, note } = body;

  if (!agentId) {
    return NextResponse.json({ error: "agentId is required" }, { status: 400 });
  }

  // Verify agent exists
  const agentUser = await db.select().from(users).where(eq(users.id, agentId)).limit(1);
  if (!agentUser[0] || agentUser[0].role !== "agent") {
    return NextResponse.json({ error: "Invalid agent" }, { status: 400 });
  }

  // Get the raw student
  const raw = await db.select().from(rawStudents).where(eq(rawStudents.id, id)).limit(1);
  if (!raw[0]) {
    return NextResponse.json({ error: "Raw student not found" }, { status: 404 });
  }

  const rawRecord = raw[0];

  // A canonical lead already exists (created during import). Assign it.
  if (!rawRecord.leadId) {
    return NextResponse.json({ error: "Imported student has no CRM lead yet" }, { status: 400 });
  }

  await assignLead({
    leadId: rawRecord.leadId,
    agentId,
    assignedBy: session.userId,
    note: note || null,
  });

  await db.update(rawStudents).set({
    status: "Assigned",
    assignedAgent: agentId,
  }).where(eq(rawStudents.id, id));

  return NextResponse.json({ ok: true, leadId: rawRecord.leadId });
}