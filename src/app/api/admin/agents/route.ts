import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { users, agents } from "@/server/db/schema";
import { getSessionFromCookie } from "@/server/auth";
import { hashPassword } from "@/server/auth/password";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

function uid(): string {
  return `agent-${nanoid(8)}`;
}

export async function GET() {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const agentUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      active: users.active,
      createdAt: users.createdAt,
    }).from(users).where(eq(users.role, "agent"));

    const agentStats = await db.select().from(agents);

    const agentMap = new Map(agentStats.map((a) => [a.id, a]));

    const result = agentUsers.map((u) => {
      const stats = agentMap.get(u.id);
      return {
        ...u,
        dailyTarget: stats?.dailyTarget ?? 40,
        avatarColor: stats?.avatarColor ?? "#6366f1",
        leadsAssigned: stats?.leadsAssigned ?? 0,
        callsMade: stats?.callsMade ?? 0,
        callsConnected: stats?.callsConnected ?? 0,
        conversions: stats?.conversions ?? 0,
      };
    });

    return NextResponse.json({ agents: result });
  } catch (error) {
    console.error("Get agents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, email, phone, password, dailyTarget, avatarColor } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase()));
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const userId = uid();

    await db.insert(users).values({
      id: userId,
      email: email.trim().toLowerCase(),
      passwordHash,
      name: name.trim(),
      phone: phone?.trim() || null,
      role: "agent",
    });

    await db.insert(agents).values({
      id: userId,
      dailyTarget: dailyTarget || 40,
      avatarColor: avatarColor || "#6366f1",
    });

    return NextResponse.json({
      agent: {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
      },
    });
  } catch (error) {
    console.error("Create agent error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { id, active, dailyTarget, avatarColor } = body;

    if (!id) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
    }

    if (active !== undefined) {
      await db.update(users).set({ active }).where(eq(users.id, id));
    }

    if (dailyTarget !== undefined || avatarColor !== undefined) {
      const patch: Record<string, unknown> = {};
      if (dailyTarget !== undefined) patch.dailyTarget = dailyTarget;
      if (avatarColor !== undefined) patch.avatarColor = avatarColor;
      await db.update(agents).set(patch).where(eq(agents.id, id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update agent error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
