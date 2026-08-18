import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { websiteLeads } from "@/server/db/schema";
import { getSessionFromCookie } from "@/server/auth";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200);
  const offset = Math.max(parseInt(searchParams.get("offset") ?? "0"), 0);

  const rows = await db
    .select()
    .from(websiteLeads)
    .orderBy(websiteLeads.createdAt)
    .limit(limit)
    .offset(offset);

  return NextResponse.json({ leads: rows, count: rows.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, collegeId, collegeName, program, admissionTimeline, sourceWebsite } = body;

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ error: "Valid name is required" }, { status: 400 });
  }
  if (!phone || phone.trim().length < 10) {
    return NextResponse.json({ error: "Valid phone number is required" }, { status: 400 });
  }
  if (!collegeId || !collegeName) {
    return NextResponse.json({ error: "College is required" }, { status: 400 });
  }

  let userId: string | null = null;
  try {
    const session = await getSessionFromCookie();
    if (session && session.role === "student") {
      userId = session.userId;
    }
  } catch {}

  const record = await db.insert(websiteLeads).values({
    id: `wvl-${nanoid(12)}`,
    name: name.trim(),
    phone: phone.trim(),
    email: email?.trim() || null,
    collegeId: collegeId || null,
    collegeName: collegeName || null,
    program: program || null,
    admissionTimeline: admissionTimeline || null,
    sourceWebsite: sourceWebsite || null,
    userId: userId || null,
  }).returning();

  return NextResponse.json({ lead: record[0] });
}
