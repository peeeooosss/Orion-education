import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { galleryPhotos } from "@/server/db/schema";
import { getSessionFromCookie } from "@/server/auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { put, del } from "@vercel/blob";

export async function GET() {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const photos = await db.select().from(galleryPhotos);
    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Admin gallery GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const dateLabel = formData.get("dateLabel") as string;
    const sortOrder = Number(formData.get("sortOrder") || 0);

    if (!file || !title || !category) {
      return NextResponse.json({ error: "File, title and category are required" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const blobName = `gallery/${nanoid(12)}.${ext}`;

    const blob = await put(blobName, file, { access: "public" });

    const id = nanoid(12);
    await db.insert(galleryPhotos).values({
      id,
      title,
      category,
      imageUrl: blob.url,
      dateLabel: dateLabel || null,
      sortOrder,
      published: true,
    });

    return NextResponse.json({ id, success: true });
  } catch (error) {
    console.error("Admin gallery POST error:", error);
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
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "Photo ID is required" }, { status: 400 });
    }

    await db.update(galleryPhotos).set(updates).where(eq(galleryPhotos.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin gallery PATCH error:", error);
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
    const imageUrl = searchParams.get("imageUrl");
    if (!id) {
      return NextResponse.json({ error: "Photo ID is required" }, { status: 400 });
    }

    await db.delete(galleryPhotos).where(eq(galleryPhotos.id, id));

    if (imageUrl && imageUrl.includes("blob.vercel-storage.com")) {
      try { await del(imageUrl); } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin gallery DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
