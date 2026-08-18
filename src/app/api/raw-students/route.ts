import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { rawStudents, rawImportBatches } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const batchId = searchParams.get("batchId");
  const status = searchParams.get("status");
  const assignedAgent = searchParams.get("assignedAgent");

  let results;
  if (session.role === "agent") {
    results = await db.select().from(rawStudents)
      .where(eq(rawStudents.assignedAgent, session.userId))
      .orderBy(desc(rawStudents.importedAt));
  } else {
    results = await db.select().from(rawStudents)
      .orderBy(desc(rawStudents.importedAt));
  }

  if (batchId) {
    results = results.filter((r) => r.batchId === batchId);
  }
  if (status) {
    results = results.filter((r) => r.status === status);
  }
  if (assignedAgent && session.role === "admin") {
    results = results.filter((r) => r.assignedAgent === assignedAgent);
  }

  const batches = await db.select().from(rawImportBatches);

  return NextResponse.json({ rawStudents: results, batches });
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const allowed = [
    "status", "callStatus", "interestStatus", "assignedAgent",
    "intentLevel", "intentOverride", "intentOverrideReason",
  ];

  const patch: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in updates) patch[key] = updates[key];
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  await db.update(rawStudents).set(patch).where(eq(rawStudents.id, id));

  return NextResponse.json({ ok: true });
}
