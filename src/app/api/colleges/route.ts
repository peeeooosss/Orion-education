import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { colleges, programs } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.select().from(colleges).where(eq(colleges.isPublished, true));
    const programResults = await db.select().from(programs);

    const programsByCollege = new Map<string, typeof programResults>();
    for (const prog of programResults) {
      const list = programsByCollege.get(prog.collegeId) || [];
      list.push(prog);
      programsByCollege.set(prog.collegeId, list);
    }

    const enriched = result.map((college) => ({
      ...college,
      programs: programsByCollege.get(college.id) || [],
    }));

    return NextResponse.json({ colleges: enriched });
  } catch (error) {
    console.error("Get public colleges error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
