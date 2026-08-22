import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { colleges, programs, websiteLeads } from "@/server/db/schema";
import { getSessionFromCookie } from "@/server/auth";
import { eq, inArray } from "drizzle-orm";
import { nanoid } from "nanoid";

function uid(): string {
  return nanoid(12);
}

export async function GET() {
  try {
    const allColleges = await db.select().from(colleges);
    const allPrograms = await db.select().from(programs);
    const progMap = new Map<string, typeof allPrograms>();
    for (const p of allPrograms) {
      const arr = progMap.get(p.collegeId) || [];
      arr.push(p);
      progMap.set(p.collegeId, arr);
    }
    const enriched = allColleges.map((c) => ({
      ...c,
      programs: progMap.get(c.id) || [],
    }));
    return NextResponse.json({ colleges: enriched });
  } catch (error) {
    console.error("Get colleges error:", error);
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
    const {
      name, shortName, city, established, rating, type, about,
      tags, accreditation, ranking, admissions, costs, scholarships,
      placementPct, highestPlacement, intake, facilities,
      sourceWebsite, coverImage, photos, videoLinks,
      partnerCollege, isPublished, budget, programsList,
      campusVideos, partnerProfile,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "College name is required" }, { status: 400 });
    }

    const collegeId = uid();

    await db.insert(colleges).values({
      id: collegeId,
      name,
      shortName: shortName || name.split(" ")[0],
      city: city || "",
      established: established || null,
      rating: rating ? String(rating) : "4.0",
      type: type || "Private",
      about: about || "",
      tags: tags || [],
      accreditation: accreditation || [],
      ranking: ranking || "",
      admissions: admissions || null,
      costs: costs || null,
      scholarships: scholarships || null,
      placementPct: placementPct ? String(placementPct) : "0",
      highestPlacement: highestPlacement ? String(highestPlacement) : "0",
      intake: intake || 0,
      facilities: facilities || [],
      sourceWebsite: sourceWebsite || null,
      coverImage: coverImage || null,
      photos: photos || [],
      videoLinks: videoLinks || [],
      campusVideos: campusVideos || [],
      partnerProfile: partnerProfile || null,
      partnerCollege: partnerCollege || false,
      isPublished: isPublished !== false,
      budget: budget ? String(budget) : "80000",
    });

    if (programsList && Array.isArray(programsList)) {
      for (const prog of programsList) {
        await db.insert(programs).values({
          id: `${collegeId}-${(prog.name || "prog").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          collegeId,
          name: prog.name,
          stream: prog.stream || null,
          durationYears: prog.durationYears || null,
          annualFee: prog.annualFee ? String(prog.annualFee) : null,
          totalFee: prog.totalFee ? String(prog.totalFee) : null,
          avgPlacement: prog.avgPlacement ? String(prog.avgPlacement) : null,
          eligibility: prog.eligibility || null,
          intakes: prog.intakes || [],
          seats: prog.seats || null,
        });
      }
    }

    return NextResponse.json({ id: collegeId, success: true });
  } catch (error) {
    console.error("Create college error:", error);
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
    const { id, programsList, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "College ID is required" }, { status: 400 });
    }

    if (updates.rating !== undefined) updates.rating = String(updates.rating);
    if (updates.placementPct !== undefined) updates.placementPct = String(updates.placementPct);
    if (updates.highestPlacement !== undefined) updates.highestPlacement = String(updates.highestPlacement);
    if (updates.budget !== undefined) updates.budget = String(updates.budget);

    await db.update(colleges).set(updates).where(eq(colleges.id, id));

    if (programsList && Array.isArray(programsList)) {
      await db.delete(programs).where(eq(programs.collegeId, id));
      for (const prog of programsList) {
        await db.insert(programs).values({
          id: `${id}-${(prog.name || "prog").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          collegeId: id,
          name: prog.name,
          stream: prog.stream || null,
          durationYears: prog.durationYears || null,
          annualFee: prog.annualFee ? String(prog.annualFee) : null,
          totalFee: prog.totalFee ? String(prog.totalFee) : null,
          avgPlacement: prog.avgPlacement ? String(prog.avgPlacement) : null,
          eligibility: prog.eligibility || null,
          intakes: prog.intakes || [],
          seats: prog.seats || null,
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update college error:", error);
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
      return NextResponse.json({ error: "College ID is required" }, { status: 400 });
    }

    await db.delete(programs).where(eq(programs.collegeId, id));
    await db.update(websiteLeads).set({ collegeId: null }).where(eq(websiteLeads.collegeId, id));
    await db.delete(colleges).where(eq(colleges.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete college error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
