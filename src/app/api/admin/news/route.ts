import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { newsItems } from "@/server/db/schema";
import { getSessionFromCookie } from "@/server/auth";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function GET() {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const items = await db
      .select()
      .from(newsItems)
      .orderBy(desc(newsItems.date), desc(newsItems.createdAt));
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Admin news GET error:", error);
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
    const { title, excerpt, category, date, externalUrl, isPublished } = body;

    if (!title || !date) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
    }

    const id = nanoid(12);
    await db.insert(newsItems).values({
      id,
      title,
      excerpt: excerpt || null,
      category: category || "General",
      date,
      externalUrl: externalUrl || null,
      isPublished: isPublished !== false,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Admin news POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "News ID is required" }, { status: 400 });
    }
    if (updates.date === undefined || updates.title === undefined) {
      return NextResponse.json({ error: "Title and date are required" }, { status: 400 });
    }

    await db
      .update(newsItems)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(newsItems.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin news PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "News ID is required" }, { status: 400 });
    }

    await db.delete(newsItems).where(eq(newsItems.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin news DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}