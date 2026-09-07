import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { leads, contacts, agents, users, colleges, rawStudents, leadActivities, followUps, websiteLeads } from "@/server/db/schema";
import { eq, and, or, ilike, desc, asc, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { computeScholarship, computeIntentLevel } from "@/lib/scholarship";
import type { Stream, ScoreBand } from "@/lib/scholarship";
import { MBA_PGDM_COLLEGES } from "@/data/college-directory";
import { createLead, findOrCreateContact, resolveLeadCategory } from "@/lib/leads";

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source"); // legacy leadType filter
  const category = searchParams.get("category"); // general | college_specific | study_abroad | imported
  const stage = searchParams.get("stage");
  const intent = searchParams.get("intent"); // Hot | Warm | Cold
  const assignment = searchParams.get("assignment"); // Assigned | Unassigned
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

  if (category) {
    conditions.push(eq(leads.leadCategory, category));
  }

  if (stage) {
    conditions.push(eq(leads.stage, stage));
  }

  if (intent) {
    conditions.push(eq(leads.intentLevel, intent));
  }

  if (assignment) {
    conditions.push(eq(leads.assignmentStatus, assignment));
  }

  if (search) {
    conditions.push(
      or(
        ilike(contacts.name, `%${search}%`),
        ilike(contacts.phone, `%${search}%`),
        ilike(contacts.email, `%${search}%`),
        ilike(leads.targetCollege, `%${search}%`),
        ilike(leads.targetProgram, `%${search}%`)
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
      leadCategory: leads.leadCategory,
      assignmentStatus: leads.assignmentStatus,
      lookingFor: leads.lookingFor,
      targetCollege: leads.targetCollege,
      targetProgram: leads.targetProgram,
      collegeId: leads.collegeId,
      admissionTimeline: leads.admissionTimeline,
      scholarshipAmount: leads.scholarshipAmount,
      scholarshipApplied: leads.scholarshipApplied,
      intentLevel: leads.intentLevel,
      intentScore: leads.intentScore,
      callStatus: leads.callStatus,
      interestStatus: leads.interestStatus,
      callConnected: leads.callConnected,
      nextAction: leads.nextAction,
      nextFollowUpAt: leads.nextFollowUpAt,
      lastCalledAt: leads.lastCalledAt,
      scoreBand: leads.scoreBand,
      stream: leads.stream,
      studyCountry: leads.studyCountry,
      studyLevel: leads.studyLevel,
      studyField: leads.studyField,
      createdAt: leads.createdAt,
      rawStudentId: leads.rawStudentId,
      assignmentNote: leads.assignmentNote,
      agentId: leads.agentId,
      // Contact info
      contactName: contacts.name,
      contactPhone: contacts.phone,
      contactEmail: contacts.email,
      contactCity: contacts.city,
      // Agent info
      agentName: users.name,
      agentAvatar: agents.avatarColor,
    })
    .from(leads)
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .leftJoin(users, eq(leads.agentId, users.id))
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
      "nextAction", "nextFollowUpAt", "lastCalledAt",
    ];

    const patch: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in updates) patch[key] = updates[key];
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "No valid fields" }, { status: 400 });
    }

    // Agents may only mutate leads assigned to them.
    if (session.role === "agent") {
      const leadResult = await db.select({ agentId: leads.agentId }).from(leads).where(eq(leads.id, id)).limit(1);
      if (!leadResult[0] || leadResult[0].agentId !== session.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    patch.updatedAt = new Date();

    await db.update(leads).set(patch).where(eq(leads.id, id));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[leads PATCH] Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ─── POST: Public lead creation (Free Enquiry, College Enquiry, Study Abroad, Website Visit) ──────────
export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const body = await req.json();
    const {
      name, phone, email, source, stream, scoreBand, targetCollege, targetProgram,
      lookingFor, score, collegeId, collegeName: rawCollegeName, admissionTimeline,
      studyCountry, studyLevel, studyField,
    } = body;

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
    let leadType: "scholarship" | "enquiry" | "website" | "raw";
    if (source === "Scholarship Checker") leadType = "scholarship";
    else if (source === "College Enquiry") leadType = "enquiry";
    else if (source === "Free Enquiry") leadType = "website";
    else if (source === "Website Visit" || source === "Study Abroad") leadType = "website";
    else leadType = "enquiry";

    const leadCategory = resolveLeadCategory(source);

    // Find or create contact by phone (normalize)
    const contactId = await findOrCreateContact({
      name,
      phone,
      email: email || null,
    });

    // Compute scholarship and intent
    const sb = (scoreBand || score || "75-90") as ScoreBand;
    const st = (stream || "Engineering") as Stream;
    const collegeData = targetCollege || collegeId || "";

    // Resolve a human-readable college name (Orion directory id → DB college → raw value)
    const dirMatch = MBA_PGDM_COLLEGES.find((c) => c.id === collegeData);
    let collegeName = dirMatch?.name ?? null;

    // Get college rating for scholarship computation
    let collegeRating = 4;
    let resolvedCollegeId: string | null = null;
    if (collegeData) {
      const c = await db
        .select({ name: colleges.name, rating: colleges.rating, id: colleges.id })
        .from(colleges)
        .where(eq(colleges.id, collegeData))
        .limit(1);
      if (c[0]) {
        collegeRating = Number(c[0].rating) || 4;
        collegeName = collegeName ?? c[0].name;
        resolvedCollegeId = c[0].id;
      } else {
        resolvedCollegeId = collegeData.startsWith("college-") ? collegeData : null;
      }
    }

    const targetDisplay = collegeName ?? collegeData ?? null;

    // Orion partner colleges have capped MBA scholarships (mirrors client store logic)
    const scholarship =
      dirMatch?.isPartnered && st === "MBA"
        ? dirMatch.maxScholarship
        : computeScholarship({ stream: st, scoreBand: sb, collegeRating });
    const intent = computeIntentLevel({ scoreBand: sb, scholarship });

    // Insert lead — never auto-assign. Admin assigns every lead.
    const leadId = await createLead({
      contactId,
      source,
      leadType,
      leadCategory,
      agentId: null,
      assignedBy: null,
      assignmentNote: `Captured via ${source}. Awaiting admin assignment.`,
      lookingFor: lookingFor || `${targetProgram || targetDisplay || "Admission"} · ${admissionTimeline || "This admission cycle"}`,
      targetCollege: targetDisplay,
      targetProgram: targetProgram || null,
      admissionTimeline: admissionTimeline || null,
      collegeId: resolvedCollegeId,
      scholarshipAmount: scholarship,
      scholarshipApplied: leadType === "scholarship",
      intentLevel: intent,
      scoreBand: sb,
      stream: st,
      studyCountry: studyCountry || null,
      studyLevel: studyLevel || null,
      studyField: studyField || null,
    });

    // Create a matching website_leads tracking row for Free Enquiry so it shows
    // in the legacy Admin & Agent "Website Leads" sections as a Free Enquiry.
    if (leadType === "website" && source === "Free Enquiry") {
      await db.insert(websiteLeads).values({
        id: `wvl-${nanoid(12)}`,
        name: name.trim(),
        phone: phone.replace(/\s+/g, ""),
        email: email?.trim() || null,
        collegeId: resolvedCollegeId,
        collegeName: rawCollegeName?.trim() || targetDisplay || null,
        program: targetProgram?.trim() || null,
        admissionTimeline: admissionTimeline || null,
        userId: sessionUserId,
        source: "free-enquiry",
        assignedAgent: null,
        leadId,
        status: "Unassigned",
      }).onConflictDoNothing();
    }

    // Log creation activity
    await db.insert(leadActivities).values({
      id: `act-${nanoid(12)}`,
      leadId,
      agentId: null,
      kind: "status_change",
      note: `Lead created via ${source}. Name: ${name.trim()}. Phone: ${phone.replace(/\s+/g, "")}. Awaiting admin assignment.`,
      oldStage: null,
      newStage: "New",
    });

    console.log(`[leads POST] Created ${leadCategory} lead ${leadId} (unassigned) (${Date.now() - start}ms)`);

    return NextResponse.json({
      lead: {
        id: leadId,
        name: name.trim(),
        phone: phone.replace(/\s+/g, ""),
        source,
        leadType,
        leadCategory,
        targetCollege: targetDisplay,
        scholarshipAmount: scholarship,
        intentLevel: intent,
        assignedAgent: null,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[leads POST] Error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}