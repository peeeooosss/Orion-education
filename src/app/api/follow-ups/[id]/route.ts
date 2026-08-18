import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { followUps, leadActivities } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  if (body.completed !== undefined) {
    await db.update(followUps).set({
      completed: body.completed,
      completedAt: body.completed ? new Date() : null,
    }).where(eq(followUps.id, id));

    // Log follow-up completion as activity
    if (body.completed) {
      const fu = await db.select().from(followUps).where(eq(followUps.id, id)).limit(1);
      if (fu[0]) {
        await db.insert(leadActivities).values({
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          leadId: fu[0].leadId,
          agentId: session.userId,
          kind: "follow_up_completed",
          note: `Follow-up (${fu[0].followType}) completed`,
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
