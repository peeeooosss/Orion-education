import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { questionnaires } from "@/server/db/schema";
import { getSessionFromCookie } from "@/server/auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return NextResponse.json({ questionnaire: null });
    }

    const result = await db.select().from(questionnaires)
      .where(eq(questionnaires.userId, session.userId))
      .limit(1);

    return NextResponse.json({ questionnaire: result[0] || null });
  } catch (error) {
    console.error("Get questionnaire error:", error);
    return NextResponse.json({ questionnaire: null });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { data } = body;

    if (!data) {
      return NextResponse.json({ error: "Data is required" }, { status: 400 });
    }

    // Check if existing
    const existing = await db.select().from(questionnaires)
      .where(eq(questionnaires.userId, session.userId))
      .limit(1);

    if (existing.length > 0) {
      await db.update(questionnaires)
        .set({
          data,
          completedAt: new Date(),
        })
        .where(eq(questionnaires.userId, session.userId));
    } else {
      await db.insert(questionnaires).values({
        id: `q-${nanoid(8)}`,
        userId: session.userId,
        data,
        completedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save questionnaire error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
