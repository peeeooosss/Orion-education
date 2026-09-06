import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { rawStudents } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { createLead, findOrCreateContact } from "@/lib/leads";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Get the raw student
  const rawResult = await db.select().from(rawStudents).where(eq(rawStudents.id, id)).limit(1);
  const raw = rawResult[0];
  if (!raw) {
    return NextResponse.json({ error: "Raw student not found" }, { status: 404 });
  }

  // A canonical lead is created during import; reuse it if it already exists.
  if (raw.leadId) {
    return NextResponse.json({ leadId: raw.leadId });
  }

  const contactId = await findOrCreateContact({
    name: raw.studentName || "Unknown",
    phone: raw.phone || "",
    email: raw.email,
    city: raw.city,
    state: raw.state,
  });

  // Admin-only, unassigned. Admin assigns every lead.
  const leadId = await createLead({
    contactId,
    source: "Imported Raw Data",
    leadType: "raw",
    leadCategory: "imported",
    agentId: null,
    assignedBy: session.userId,
    assignmentNote: "Imported student — awaiting admin assignment",
    lookingFor: raw.preferredProgram || "Admission counselling",
    targetCollege: raw.preferredCollege || "College to be confirmed",
    scoreBand: raw.scoreBand || undefined,
    stream: raw.stream || undefined,
    rawStudentId: id,
  });

  await db.update(rawStudents).set({
    leadId,
    status: "Assigned",
  }).where(eq(rawStudents.id, id));

  return NextResponse.json({ leadId, contactId });
}