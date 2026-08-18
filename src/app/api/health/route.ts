import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  const start = Date.now();
  try {
    const result = await Promise.race([
      db.select({ count: sql<number>`count(*)::int` }).from(users),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("DB timeout")), 5000)
      ),
    ]);
    const userCount = result[0]?.count ?? 0;
    return NextResponse.json({
      status: "ok",
      db: "connected",
      userCount,
      latencyMs: Date.now() - start,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { status: "error", db: "disconnected", error: message, latencyMs: Date.now() - start },
      { status: 503 }
    );
  }
}
