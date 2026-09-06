import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { websiteLeads, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { assignLead, createLead, findOrCreateContact, resolveLeadCategory } from "@/lib/leads";

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

  // If this legacy tracking row has no linked CRM lead yet, create one first.
  let leadId = record.leadId ?? null;
  if (!leadId) {
    const isAbroad = record.source === "study-abroad";
    const sourceLabel = isAbroad ? "Study Abroad" : "Website Visit";
    const leadCategory = resolveLeadCategory(sourceLabel);

    leadId = await createLead({
      contactId: await findOrCreateContact({
        name: record.name || "Unknown",
        phone: record.phone || "",
        email: record.email,
      }),
      source: sourceLabel,
      leadType: isAbroad ? "website" : "enquiry",
      leadCategory,
      lookingFor:
        [record.program, record.admissionTimeline].filter(Boolean).join(" · ") ||
        (isAbroad ? "Study Abroad enquiry" : "Website enquiry"),
      targetCollege: record.collegeName,
      targetProgram: record.program,
      admissionTimeline: record.admissionTimeline,
      assignmentNote: note || `${sourceLabel} — awaiting assignment`,
    });

    await db.update(websiteLeads).set({ leadId }).where(eq(websiteLeads.id, id));
  }

  // Assign (or reassign) to the agent
  await assignLead({
    leadId,
    agentId,
    assignedBy: session.userId,
    note: note || null,
  });

  await db.update(websiteLeads).set({
    status: "Assigned",
    assignedAgent: agentId,
  }).where(eq(websiteLeads.id, id));

  return NextResponse.json({ ok: true, leadId });
}