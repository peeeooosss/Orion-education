import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { UTApi } from "uploadthing/server";

export async function POST(request: Request) {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const utapi = new UTApi();
    const result = await utapi.uploadFiles(file);

    if (!result.data) {
      const message = result.error?.message || result.error?.code || "Upload failed";
      console.error("UploadThing error:", result.error);
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({ url: result.data.url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}