import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { newsItems } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawLimit = Number(searchParams.get("limit"));
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 50) : 10;

    const items = await db
      .select()
      .from(newsItems)
      .where(eq(newsItems.isPublished, true))
      .orderBy(desc(newsItems.date), desc(newsItems.createdAt))
      .limit(limit);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("News GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}