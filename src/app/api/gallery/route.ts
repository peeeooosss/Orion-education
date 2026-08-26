import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { galleryPhotos } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const photos = await db
      .select()
      .from(galleryPhotos)
      .where(eq(galleryPhotos.published, true))
      .orderBy(galleryPhotos.sortOrder, desc(galleryPhotos.createdAt));
    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Get gallery error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
