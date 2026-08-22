import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { users, agents } from "@/server/db/schema";
import { hashPassword, createSession, setSessionCookie } from "@/server/auth";
import { eq } from "drizzle-orm";

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, city, state, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const existing = await db.select().from(users).where(eq(users.email, email.trim().toLowerCase()));
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const userId = uid("user");

    await db.insert(users).values({
      id: userId,
      email: email.trim().toLowerCase(),
      passwordHash,
      name: name.trim(),
      phone: phone?.trim() || null,
      city: city?.trim() || null,
      state: state?.trim() || null,
      role: role || "student",
    });

    if (role === "agent") {
      await db.insert(agents).values({
        id: userId,
        dailyTarget: 40,
        avatarColor: "#6366f1",
      });
    }

    const token = await createSession({
      userId,
      email: email.trim().toLowerCase(),
      role: role || "student",
    });

    return setSessionCookie(token, {
      user: {
        id: userId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        role: role || "student",
      },
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
