import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { rawStudents, rawImportBatches, users } from "@/server/db/schema";
import { eq, desc, and, ilike } from "drizzle-orm";
import { nanoid } from "nanoid";

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

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { fileName, sheetName, headers, rows, assignedAgent } = body;

    if (!fileName || !rows || !Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "fileName and rows array are required" }, { status: 400 });
    }

    // Resolve agent name to ID
    let resolvedAgentId: string | null = null;
    if (assignedAgent) {
      if (assignedAgent.startsWith("agent-")) {
        resolvedAgentId = assignedAgent;
      } else {
        const agentUser = await db.select({ id: users.id }).from(users)
          .where(and(eq(users.role, "agent"), ilike(users.name, assignedAgent)))
          .limit(1);
        resolvedAgentId = agentUser[0]?.id ?? null;
      }
    }

    const batchId = `batch-${nanoid(8)}`;
    const importedAt = new Date();

    await db.insert(rawImportBatches).values({
      id: batchId,
      fileName,
      sheetName: sheetName || null,
      importedAt,
      importedBy: session.userId,
      rowCount: rows.length,
      headers: headers || [],
    });

    const value = (row: Record<string, unknown>, names: string[]) => {
      const key = Object.keys(row).find((candidate) =>
        names.some((name) => candidate.toLowerCase().replace(/[^a-z]/g, "").includes(name))
      );
      const raw = key ? row[key] : undefined;
      return raw === undefined || raw === null ? "" : String(raw).trim();
    };

    const insertValues = rows.map((row: Record<string, unknown>) => ({
      id: `raw-${nanoid(8)}`,
      batchId,
      sourceFile: fileName,
      importedAt,
      studentName: value(row, ["fullname", "studentname", "name"]) || "Unnamed student",
      phone: value(row, ["phone", "mobile", "contact"]),
      email: value(row, ["email", "mail"]) || undefined,
      city: value(row, ["city", "location"]),
      state: value(row, ["state"]),
      stream: value(row, ["stream", "course"]),
      scoreBand: value(row, ["scoreband", "score", "percentage"]),
      entranceExam: value(row, ["entranceexam", "exam"]),
      entranceScore: value(row, ["entrancescore", "percentile", "rank"]),
      preferredCollege: value(row, ["preferredcollege", "college", "targetcollege"]),
      preferredProgram: value(row, ["preferredprogram", "program", "course"]),
      budgetRange: value(row, ["budgetrange", "budget", "fees"]),
      hostelRequired: value(row, ["hostelrequired", "hostel"]).toLowerCase() === "yes",
      loanRequired: value(row, ["loanrequired", "loan"]).toLowerCase() === "yes",
      admissionTimeline: value(row, ["admissiontimeline", "timeline", "joining"]),
      assignedAgent: resolvedAgentId,
      status: resolvedAgentId ? "Assigned" : "Unassigned",
      callStatus: "Not Called",
      interestStatus: "Not Assessed",
    }));

    for (const vals of insertValues) {
      await db.insert(rawStudents).values(vals);
    }

    return NextResponse.json({ ok: true, batchId, count: rows.length });
  } catch (error) {
    console.error("[raw-students POST] Error:", error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
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
    "studentName", "phone", "email", "city", "state", "stream",
    "scoreBand", "entranceExam", "entranceScore", "preferredCollege",
    "preferredProgram", "budgetRange", "admissionTimeline",
    "hostelRequired", "loanRequired",
  ];

  const patch: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in updates) patch[key] = updates[key];
  }

  // Resolve agent name to ID if assignedAgent looks like a name
  if (patch.assignedAgent && !String(patch.assignedAgent).startsWith("agent-")) {
    const agentUser = await db.select({ id: users.id }).from(users)
      .where(and(eq(users.role, "agent"), ilike(users.name, String(patch.assignedAgent))))
      .limit(1);
    if (agentUser[0]) {
      patch.assignedAgent = agentUser[0].id;
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  await db.update(rawStudents).set(patch).where(eq(rawStudents.id, id));

  return NextResponse.json({ ok: true });
}
