import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { leads, contacts, agents, users, colleges, rawStudents, leadActivities, followUps } from "@/server/db/schema";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { computeScholarship, computeIntentLevel } from "@/lib/scholarship";
import type { Stream, ScoreBand } from "@/lib/scholarship";
import { MBA_PGDM_COLLEGES } from "@/data/college-directory";

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source"); // "scholarship" | "enquiry" | "raw"
  const stage = searchParams.get("stage");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "smart"; // "smart" | "newest" | "oldest"
  const agentFilter = searchParams.get("agentId"); // admin only

  // Resolve agent ID for this user
  let targetAgentId: string | null = null;
  if (session.role === "agent") {
    targetAgentId = session.userId;
  } else if (agentFilter) {
    targetAgentId = agentFilter;
  }

  const conditions = [];

  if (targetAgentId) {
    conditions.push(eq(leads.agentId, targetAgentId));
  }

  if (source) {
    conditions.push(eq(leads.leadType, source));
  }

  if (stage) {
    conditions.push(eq(leads.stage, stage));
  }

  if (search) {
    conditions.push(
      or(
        ilike(contacts.name, `%${search}%`),
        ilike(contacts.phone, `%${search}%`),
        ilike(contacts.email, `%${search}%`)
      )!
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Smart sort: Hot leads first, then by creation date
  let orderClause;
  if (sort === "newest") {
    orderClause = desc(leads.createdAt);
  } else if (sort === "oldest") {
    orderClause = asc(leads.createdAt);
  } else {
    // Smart: Hot > Warm > Cold, then by creation date desc
    orderClause = sql`
      CASE ${leads.intentLevel}
        WHEN 'Hot' THEN 0
        WHEN 'Warm' THEN 1
        ELSE 2
      END, ${leads.createdAt} DESC
    `;
  }

  const results = await db
    .select({
      id: leads.id,
      stage: leads.stage,
      source: leads.source,
      leadType: leads.leadType,
      lookingFor: leads.lookingFor,
      targetCollege: leads.targetCollege,
      scholarshipAmount: leads.scholarshipAmount,
      scholarshipApplied: leads.scholarshipApplied,
      intentLevel: leads.intentLevel,
      intentScore: leads.intentScore,
      callStatus: leads.callStatus,
      interestStatus: leads.interestStatus,
      callConnected: leads.callConnected,
      lastCalledAt: leads.lastCalledAt,
      nextFollowUpAt: leads.nextFollowUpAt,
      createdAt: leads.createdAt,
      rawStudentId: leads.rawStudentId,
      assignmentNote: leads.assignmentNote,
      // Contact info
      contactName: contacts.name,
      contactPhone: contacts.phone,
      contactEmail: contacts.email,
      contactCity: contacts.city,
      // Agent info
      agentName: agents.avatarColor,
    })
    .from(leads)
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .leftJoin(agents, eq(leads.agentId, agents.id))
    .where(where)
    .orderBy(orderClause);

  // Enrich raw data leads with assignment info
  const enriched = await Promise.all(
    results.map(async (lead) => {
      if (lead.rawStudentId) {
        const raw = await db
          .select()
          .from(rawStudents)
          .where(eq(rawStudents.id, lead.rawStudentId))
          .limit(1);
        return { ...lead, rawStudent: raw[0] || null };
      }
      return lead;
    })
  );

  return NextResponse.json({ leads: enriched });
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const allowed = [
      "stage", "callStatus", "interestStatus", "callConnected",
      "scholarshipApplied", "leadType", "lookingFor", "targetCollege", "targetProgram",
    ];

    const patch: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in updates) patch[key] = updates[key];
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "No valid fields" }, { status: 400 });
    }

    patch.updatedAt = new Date();

    await db.update(leads).set(patch).where(eq(leads.id, id));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[leads PATCH] Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ─── POST: Public lead creation (Free Enquiry, Scholarship Checker) ──────────
export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const body = await req.json();
    const { name, phone, email, source, stream, scoreBand, targetCollege, targetProgram, lookingFor, score, collegeId, admissionTimeline } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Valid name is required" }, { status: 400 });
    }
    if (!phone || phone.trim().length < 10) {
      return NextResponse.json({ error: "Valid phone number is required" }, { status: 400 });
    }
    if (!source) {
      return NextResponse.json({ error: "Source is required" }, { status: 400 });
    }

    const session = await getSessionFromCookie().catch(() => null);
    const sessionUserId = session?.userId ?? null;

    // Determine lead type from source
    let leadType: "scholarship" | "enquiry" | "raw";
    if (source === "Scholarship Checker") leadType = "scholarship";
    else if (source === "College Enquiry") leadType = "enquiry";
    else leadType = "enquiry";

    // Find or create contact by phone (normalize)
    const phoneNorm = phone.replace(/\s+/g, "");
    const existing = await db
      .select()
      .from(contacts)
      .where(eq(contacts.phone, phoneNorm))
      .limit(1);

    let contactId: string;
    if (existing.length > 0) {
      contactId = existing[0].id;
      await db
        .update(contacts)
        .set({ name: name.trim(), email: email || null })
        .where(eq(contacts.id, contactId));
    } else {
      contactId = `c-${nanoid(10)}`;
      await db.insert(contacts).values({
        id: contactId,
        name: name.trim(),
        phone: phoneNorm,
        email: email || null,
      });
    }

    // Select agent: prefer DB agents sorted by fewest conversions (round-robin-ish)
    const agentUsers = await db
      .select({ id: users.id, name: users.name })
      .from(users)
      .where(eq(users.role, "agent"));

    // Get agent stats (conversions) to pick the least busy agent
    const agentStats = agentUsers.length > 0
      ? await db
          .select({ id: agents.id, conversions: agents.conversions, leadsAssigned: agents.leadsAssigned })
          .from(agents)
          .where(
            agentUsers.length === 1
              ? eq(agents.id, agentUsers[0].id)
              : sql`id IN (${agentUsers.map((u) => `'${u.id}'`).join(",")})`
          )
      : [];

    const statsMap = new Map(agentStats.map((a) => [a.id, a]));

    // Sort: prefer agents with fewest conversions+assignments (load balancing)
    const sortedAgents = agentUsers
      .map((u) => {
        const s = statsMap.get(u.id);
        return { id: u.id, name: u.name, conv: s?.conversions ?? 0, assigned: s?.leadsAssigned ?? 0 };
      })
      .sort((a, b) => (a.conv + a.assigned) - (b.conv + b.assigned));

    const assignedAgent = sortedAgents[0] ?? { id: null, name: null };

    // Compute scholarship and intent
    const sb = (scoreBand || score || "75-90") as ScoreBand;
    const st = (stream || "Engineering") as Stream;
    const collegeData = targetCollege || collegeId || "";

    // Resolve a human-readable college name (Orion directory id → DB college → raw value)
    const dirMatch = MBA_PGDM_COLLEGES.find((c) => c.id === collegeData);
    let collegeName = dirMatch?.name ?? null;

    // Get college rating for scholarship computation
    let collegeRating = 4;
    if (collegeData) {
      const c = await db
        .select({ name: colleges.name, rating: colleges.rating })
        .from(colleges)
        .where(eq(colleges.id, collegeData))
        .limit(1);
      if (c[0]) {
        collegeRating = Number(c[0].rating) || 4;
        collegeName = collegeName ?? c[0].name;
      }
    }

    const targetDisplay = collegeName ?? collegeData;

    // Orion partner colleges have capped MBA scholarships (mirrors client store logic)
    const scholarship =
      dirMatch?.isPartnered && st === "MBA"
        ? dirMatch.maxScholarship
        : computeScholarship({ stream: st, scoreBand: sb, collegeRating });
    const intent = computeIntentLevel({ scoreBand: sb, scholarship });

    const leadId = `l-${nanoid(12)}`;
    const now = new Date();

    // Insert lead
    await db.insert(leads).values({
      id: leadId,
      contactId,
      agentId: assignedAgent.id,
      stage: "New",
      source: source,
      leadType,
      lookingFor: lookingFor || `${targetProgram || targetDisplay} · ${admissionTimeline || "This admission cycle"}`,
      targetCollege: targetDisplay,
      targetProgram: targetProgram || null,
      admissionTimeline: admissionTimeline || null,
      scholarshipAmount: String(scholarship),
      scholarshipApplied: leadType === "scholarship",
      paymentStatus: "Not Required",
      intentLevel: intent,
      intentScore: 0,
      scoreBand: sb,
      stream: st,
      callStatus: "Not Called",
      interestStatus: "Not Assessed",
      rawStudentId: null,
      assignedBy: sessionUserId,
      assignedAt: now,
      assignmentNote: `Auto-assigned via ${source}`,
    });

    // Increment agent's leadsAssigned
    if (assignedAgent.id) {
      await db
        .update(agents)
        .set({ leadsAssigned: sql`${agents.leadsAssigned} + 1` })
        .where(eq(agents.id, assignedAgent.id));
    }

    // Log activity
    await db.insert(leadActivities).values({
      id: `act-${nanoid(12)}`,
      leadId,
      agentId: assignedAgent.id,
      kind: "status_change",
      note: `Lead created via ${source}. Name: ${name.trim()}. Phone: ${phoneNorm}.`,
      oldStage: null,
      newStage: "New",
    });

    // Create first follow-up: due in 30 minutes
    await db.insert(followUps).values({
      id: `fu-${nanoid(12)}`,
      leadId,
      agentId: assignedAgent.id as string,
      dueAt: new Date(Date.now() + 30 * 60 * 1000),
      followType: "Call",
      priority: leadType === "scholarship" ? "Important" : "Normal",
      note: `New ${leadType} lead from ${source}. Call to discuss ${targetProgram || targetDisplay || "admission"}.`,
    });

    console.log(`[leads POST] Created ${leadType} lead ${leadId} agent=${assignedAgent.id} (${Date.now() - start}ms)`);

    return NextResponse.json({
      lead: {
        id: leadId,
        name: name.trim(),
        phone: phoneNorm,
        source,
        leadType,
        targetCollege: targetDisplay,
        scholarshipAmount: scholarship,
        intentLevel: intent,
        assignedAgent: assignedAgent.name ?? "Unassigned",
        createdAt: now.toISOString(),
      },
    });
  } catch (error) {
    console.error("[leads POST] Error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
