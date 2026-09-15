import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { galleryPhotos } from "@/server/db/schema";
import { getSessionFromCookie } from "@/server/auth";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

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

    const result = await utapi.uploadFiles(file);
    if (!result.data) {
      const message = result.error?.message || result.error?.code || "Upload failed";
      console.error("UploadThing gallery upload error:", result.error);
      return NextResponse.json({ error: message }, { status: 500 });
    }

    const id = nanoid(12);
    await db.insert(galleryPhotos).values({
      id,
      title,
      category,
      imageUrl: result.data.url,
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

    if (imageUrl) {
      try {
        const fileKey = imageUrl.split("/").pop() || imageUrl;
        await utapi.deleteFiles(fileKey);
      } catch {}
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin gallery DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
