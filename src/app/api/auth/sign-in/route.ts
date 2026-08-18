import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { verifyPassword, createSession, setSessionCookie } from "@/server/auth";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const start = Date.now();
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const queryTimeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("DB query timeout")), 8000)
    );

    const result = await Promise.race([
      db.select().from(users).where(eq(users.email, email.trim().toLowerCase())),
      queryTimeout,
    ]);

    const user = result[0];

    if (!user) {
      console.warn(`[sign-in] Unknown email: ${email.trim().toLowerCase()} (${Date.now() - start}ms)`);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (!user.active) {
      return NextResponse.json({ error: "Account is disabled" }, { status: 403 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      console.warn(`[sign-in] Wrong password for: ${user.id} (${Date.now() - start}ms)`);
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await setSessionCookie(token);

    console.log(`[sign-in] OK: ${user.id} role=${user.role} (${Date.now() - start}ms)`);
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    const elapsed = Date.now() - start;
    console.error(`[sign-in] Error after ${elapsed}ms:`, error);
    if (error instanceof Error && error.message === "DB query timeout") {
      return NextResponse.json({ error: "Database timed out — please try again" }, { status: 504 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
