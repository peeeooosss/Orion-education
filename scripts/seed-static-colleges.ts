/**
 * One-time migration: seeds all static directory colleges (MBA_PGDM_COLLEGES)
 * into the DB `colleges` + `programs` tables so they are editable in the admin panel.
 *
 * Idempotent: colleges that already exist in the DB (by id) are skipped.
 * Partner profile data (from partner-profiles.ts) is copied into the
 * `partner_profile` JSONB column so admins can edit it later.
 *
 * Run: npx tsx scripts/seed-static-colleges.ts
 */
import { db } from "../src/server/db";
import { colleges, programs } from "../src/server/db/schema";
import { MBA_PGDM_COLLEGES } from "../src/data/college-directory";
import { PARTNER_PROFILES } from "../src/data/partner-profiles";
import { eq } from "drizzle-orm";

function parseFee(fees: string): number | null {
  if (!fees) return null;
  const cleaned = fees.replace(/[₹,\s]/g, "").toLowerCase();
  const lakhMatch = cleaned.match(/^([\d.]+)lakh$/);
  if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000);
  const crMatch = cleaned.match(/^([\d.]+)cr$/);
  if (crMatch) return Math.round(parseFloat(crMatch[1]) * 10000000);
  const num = parseFloat(cleaned);
  return Number.isFinite(num) ? Math.round(num) : null;
}

function deriveStream(name: string): string {
  const n = name.toLowerCase();
  if (/\bmba\b|\bpgdm\b/.test(n)) return "MBA";
  if (/\bb\.?tech\b|\bm\.?tech\b/.test(n)) return "Engineering";
  if (/\bbca\b|\bmca\b/.test(n)) return "Computer Applications";
  if (/\bbba\b|\bb\.?com\b|\bm\.?com\b/.test(n)) return "Commerce";
  if (/\bb\.?sc\b|\bm\.?sc\b/.test(n)) return "Science";
  if (/\bba\b|\bma\b/.test(n)) return "Liberal Arts";
  if (/\bllb\b|\bllm\b/.test(n)) return "Law";
  if (/\bb\.?des\b|\bm\.?des\b/.test(n)) return "Design";
  if (/\bphd\b/.test(n)) return "Research";
  return "General";
}

function deriveCity(location: string): string {
  return location.split("/")[0].trim();
}

async function main() {
  console.log(`Seeding ${MBA_PGDM_COLLEGES.length} static directory colleges...\n`);

  let inserted = 0;
  let skipped = 0;
  let programCount = 0;

  for (const c of MBA_PGDM_COLLEGES) {
    const existing = await db.select({ id: colleges.id }).from(colleges).where(eq(colleges.id, c.id)).limit(1);
    if (existing.length > 0) {
      skipped++;
      continue;
    }

    const profile = PARTNER_PROFILES[c.id] ?? null;

    await db.insert(colleges).values({
      id: c.id,
      name: c.name,
      shortName: c.name.split(" ")[0],
      city: deriveCity(c.location),
      rating: "4.0",
      type: "Private",
      about: profile?.overview ?? "",
      tags: [c.region],
      accreditation: profile?.accreditation ? [profile.accreditation] : [],
      ranking: "",
      admissions: null,
      costs: null,
      scholarships: c.scholarshipAvailable
        ? { available: true, details: `Orion scholarship up to ₹${c.maxScholarship.toLocaleString("en-IN")} for eligible MBA/PGDM programs.` }
        : { available: false, details: "" },
      placementPct: "0",
      highestPlacement: "0",
      intake: 0,
      facilities: [],
      sourceWebsite: profile?.website ?? null,
      coverImage: profile?.heroImage?.url ?? null,
      photos: [],
      videoLinks: [],
      campusVideos: [],
      partnerProfile: profile,
      partnerCollege: c.isPartnered,
      isPublished: true,
      budget: String(c.maxScholarship || 0),
    });

    for (const course of c.courses) {
      const fee = parseFee(course.fees);
      await db.insert(programs).values({
        id: `${c.id}-${course.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        collegeId: c.id,
        name: course.name,
        stream: deriveStream(course.name),
        durationYears: /\bmba\b|\bpgdm\b/i.test(course.name) ? 2 : null,
        annualFee: fee ? String(Math.round(fee / 2)) : null,
        totalFee: fee ? String(fee) : null,
        avgPlacement: null,
        eligibility: null,
        intakes: [],
        seats: null,
      });
      programCount++;
    }

    inserted++;
    console.log(`✅ ${c.id} — ${c.name} (${c.courses.length} programs${profile ? ", partner profile" : ""})`);
  }

  console.log(`\nDone. Inserted: ${inserted}, Skipped (already in DB): ${skipped}, Programs created: ${programCount}`);
  process.exit(0);
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
