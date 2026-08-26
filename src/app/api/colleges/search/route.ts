import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { colleges, programs } from "@/server/db/schema";
import { eq, or, ilike } from "drizzle-orm";
import { MBA_PGDM_COLLEGES } from "@/data/college-directory";
import { inferRegion } from "@/lib/region";

interface SearchCollege {
  id: string;
  name: string;
  city: string;
  region: "Delhi/NCR" | "Mumbai/Pune" | "Bangalore" | "Bhubaneswar" | "Hyderabad/Kolkata" | "Others";
  isPartnered: boolean;
  source: "static" | "db";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim().toLowerCase() || "";

    // 1. Static colleges matching query
    const staticMatches: SearchCollege[] = MBA_PGDM_COLLEGES.filter((c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q) ||
      c.courses.some((course) => course.name.toLowerCase().includes(q))
    ).map((c) => ({
      id: c.id,
      name: c.name,
      city: c.location,
      region: c.region,
      isPartnered: c.isPartnered,
      source: "static" as const,
    }));

    // 2. DB colleges matching query
    const dbResult = await db
      .select()
      .from(colleges)
      .where(
        q
          ? or(
              ilike(colleges.name, `%${q}%`),
              ilike(colleges.city, `%${q}%`),
              ilike(colleges.id, `%${q}%`)
            )
          : undefined
      );

    const dbMatches: SearchCollege[] = dbResult
      .filter((c) => c.isPublished)
      .map((c) => ({
        id: c.id,
        name: c.name,
        city: c.city || "",
        region: inferRegion(c.city),
        isPartnered: c.partnerCollege ?? false,
        source: "db" as const,
      }));

    // 3. Merge & deduplicate (DB takes precedence for same ID)
    const merged = new Map<string, SearchCollege>();
    for (const c of staticMatches) merged.set(c.id, c);
    for (const c of dbMatches) merged.set(c.id, c);

    const results = Array.from(merged.values()).slice(0, 10);

    return NextResponse.json({ colleges: results });
  } catch (error) {
    console.error("College search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}