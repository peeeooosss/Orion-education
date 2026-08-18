import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { leadActivities, leads } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookie();
  if (!session || (session.role !== "agent" && session.role !== "admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const { kind, callResult, interest, nextAction, note } = body;

  if (!kind) {
    return NextResponse.json({ error: "kind is required" }, { status: 400 });
  }

  // Valid kinds: "call" | "whatsapp" | "note" | "status_change" | "follow_up_set" | "follow_up_completed"
  const validKinds = ["call", "whatsapp", "note", "status_change", "follow_up_set", "follow_up_completed"];
  if (!validKinds.includes(kind)) {
    return NextResponse.json({ error: `Invalid kind. Must be one of: ${validKinds.join(", ")}` }, { status: 400 });
  }

  // Insert activity
  const activity = await db.insert(leadActivities).values({
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    leadId: id,
    agentId: session.userId,
    kind,
    callResult: callResult || null,
    interest: interest || null,
    nextAction: nextAction || null,
    note: note || null,
  }).returning();

  // Update lead's lastCalledAt if it was a call
  if (kind === "call") {
    await db.update(leads).set({
      lastCalledAt: new Date(),
      callConnected: callResult === "Connected",
      callStatus: callResult === "Connected" ? "Called — Connected" : "Called — No Answer",
      updatedAt: new Date(),
    }).where(eq(leads.id, id));
  }

  // Auto-advance pipeline stage based on call result + interest
  if (kind === "call" && interest) {
    const leadResult = await db.select({ stage: leads.stage }).from(leads).where(eq(leads.id, id)).limit(1);
    const currentStage = leadResult[0]?.stage;

    let newStage: string | null = null;

    if (currentStage === "New" && callResult === "Connected") {
      newStage = "Contacted";
    } else if (currentStage === "Contacted" && (interest === "Hot" || interest === "Warm")) {
      newStage = "Qualified";
    }

    if (newStage && newStage !== currentStage) {
      await db.update(leads).set({
        stage: newStage,
        intentLevel: interest,
        updatedAt: new Date(),
      }).where(eq(leads.id, id));

      // Log the stage change
      await db.insert(leadActivities).values({
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        leadId: id,
        agentId: session.userId,
        kind: "status_change",
        oldStage: currentStage,
        newStage,
        interest,
        note: `Auto-advanced: ${currentStage} → ${newStage}`,
      });
    }
  }

  return NextResponse.json({ activity: activity[0] });
}
