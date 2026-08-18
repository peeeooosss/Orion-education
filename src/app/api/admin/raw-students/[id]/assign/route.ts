import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { rawStudents, leads, contacts, leadActivities, followUps, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

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

  // Create a contact
  const contactId = `c-raw-${id}`;
  try {
    await db.insert(contacts).values({
      id: contactId,
      name: rawRecord.studentName || "Unknown",
      phone: rawRecord.phone || "",
      email: rawRecord.email,
      city: rawRecord.city,
      state: rawRecord.state,
    });
  } catch {
    // contact may already exist
  }

  // Create a lead
  const leadId = `l-raw-${id}`;
  try {
    await db.insert(leads).values({
      id: leadId,
      contactId,
      agentId,
      stage: "New",
      source: "Imported Raw Data",
      leadType: "raw",
      lookingFor: rawRecord.preferredProgram,
      targetCollege: rawRecord.preferredCollege,
      targetProgram: rawRecord.preferredProgram,
      scoreBand: rawRecord.scoreBand,
      stream: rawRecord.stream,
      rawStudentId: id,
      assignedBy: session.userId,
      assignedAt: new Date(),
      assignmentNote: note || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Update raw student status
    await db.update(rawStudents).set({
      status: "Assigned",
      assignedAgent: agentUser[0].name,
      leadId,
    }).where(eq(rawStudents.id, id));

    // Log assignment activity
    await db.insert(leadActivities).values({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      leadId,
      agentId,
      kind: "assignment",
      note: note || `Assigned by admin from raw data import`,
    });

    // Auto-create a follow-up so the lead appears in agent's Follow-ups pipeline
    await db.insert(followUps).values({
      id: `fu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      leadId,
      agentId,
      dueAt: new Date(),
      followType: "Call",
      priority: "Normal",
      note: `New imported student: ${rawRecord.studentName}. Call to introduce Orion.`,
    });

    return NextResponse.json({ ok: true, leadId });
  } catch (err) {
    console.error("Assignment error:", err);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
