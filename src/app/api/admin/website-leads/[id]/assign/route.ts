import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { websiteLeads, leads, contacts, leadActivities, followUps, users, agents } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

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

  // Get the website lead
  const wl = await db.select().from(websiteLeads).where(eq(websiteLeads.id, id)).limit(1);
  if (!wl[0]) {
    return NextResponse.json({ error: "Website lead not found" }, { status: 404 });
  }
  const record = wl[0];

  // If already assigned, just update the assignee unless a lead already exists
  let leadId = record.leadId ?? null;

  // Determine source labels
  const isAbroad = record.source === "study-abroad";
  const sourceLabel = isAbroad ? "Study Abroad" : "Website Visit";

  // Create a contact (by phone, idempotent)
  const contactId = `c-wl-${id}`;
  try {
    await db.insert(contacts).values({
      id: contactId,
      name: record.name || "Unknown",
      phone: record.phone || "",
      email: record.email,
    });
  } catch {
    // contact may already exist
  }

  // Create a lead if not already created
  if (!leadId) {
    const program = record.program;
    const lookingFor =
      [program, record.admissionTimeline].filter(Boolean).join(" · ") ||
      (isAbroad ? "Study Abroad enquiry" : "Website enquiry");

    leadId = `l-wl-${id}`;
    await db.insert(leads).values({
      id: leadId,
      contactId,
      agentId,
      stage: "New",
      source: sourceLabel,
      leadType: "website",
      lookingFor,
      targetCollege: record.collegeName,
      targetProgram: record.program,
      admissionTimeline: record.admissionTimeline,
      assignedBy: session.userId,
      assignedAt: new Date(),
      assignmentNote: note || `Assigned by admin from website lead (${sourceLabel})`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Increment agent's leadsAssigned counter
    const agentStats = await db.select({ leadsAssigned: agents.leadsAssigned }).from(agents).where(eq(agents.id, agentId)).limit(1);
    await db.update(agents).set({
      leadsAssigned: (agentStats[0]?.leadsAssigned ?? 0) + 1,
    }).where(eq(agents.id, agentId));

    // Log assignment activity
    await db.insert(leadActivities).values({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      leadId,
      agentId,
      kind: "assignment",
      note: note || `Assigned by admin from website lead (${sourceLabel})`,
    });

    // Auto-create a follow-up so the lead appears in agent's Follow-ups pipeline
    await db.insert(followUps).values({
      id: `fu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      leadId,
      agentId,
      dueAt: new Date(),
      followType: "Call",
      priority: "Normal",
      note: `New website lead: ${record.name}. Call to introduce Orion.`,
    });
  }

  // Update the website lead tracking record
  await db.update(websiteLeads).set({
    status: "Assigned",
    assignedAgent: agentId,
    leadId: leadId || null,
  }).where(eq(websiteLeads.id, id));

  return NextResponse.json({ ok: true, leadId });
}
