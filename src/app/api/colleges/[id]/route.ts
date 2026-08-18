import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { colleges, programs } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await db.select().from(colleges).where(eq(colleges.id, id));
    const college = result[0];

    if (!college) {
      return NextResponse.json({ error: "College not found" }, { status: 404 });
    }

    const collegePrograms = await db.select().from(programs).where(eq(programs.collegeId, id));

    return NextResponse.json({ college: { ...college, programs: collegePrograms } });
  } catch (error) {
    console.error("Get college error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
