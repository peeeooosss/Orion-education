import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { rawStudents, contacts, leads, leadActivities } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Get the raw student
  const rawResult = await db.select().from(rawStudents).where(eq(rawStudents.id, id)).limit(1);
  const raw = rawResult[0];
  if (!raw) {
    return NextResponse.json({ error: "Raw student not found" }, { status: 404 });
  }

  // Create contact
  const contactId = `c-${nanoid(10)}`;
  await db.insert(contacts).values({
    id: contactId,
    name: raw.studentName || "Unknown",
    phone: raw.phone || "",
    email: raw.email,
    city: raw.city,
    state: raw.state,
  });

  // Create lead
  const leadId = `l-${nanoid(10)}`;
  await db.insert(leads).values({
    id: leadId,
    contactId,
    agentId: session.userId,
    stage: "New",
    source: "Imported Raw Data",
    leadType: "raw",
    lookingFor: raw.preferredProgram || "Admission counselling",
    targetCollege: raw.preferredCollege || "College to be confirmed",
    scoreBand: raw.scoreBand,
    stream: raw.stream,
    callStatus: raw.callStatus || "Not Called",
    interestStatus: raw.interestStatus || "Not Assessed",
    rawStudentId: id,
    assignedBy: session.userId,
    assignedAt: new Date(),
  });

  // Update raw student with lead link
  await db.update(rawStudents).set({
    leadId,
    status: "Converted to Lead",
  }).where(eq(rawStudents.id, id));

  // Log activity
  await db.insert(leadActivities).values({
    id: `act-${nanoid(10)}`,
    leadId,
    agentId: session.userId,
    kind: "assignment",
    note: `Converted from imported student: ${raw.studentName}`,
  });

  return NextResponse.json({ leadId, contactId });
}
