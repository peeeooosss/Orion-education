#!/usr/bin/env tsx
import "dotenv/config";
import { db } from "@/server/db";
import { colleges, programs } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { writeFileSync } from "fs";
import { inferRegion } from "@/lib/region";

interface DbProgram {
  name: string;
  stream?: string | null;
  durationYears?: number | null;
  totalFee?: string | null;
  annualFee?: string | null;
  eligibility?: string | null;
}

interface DbCollege {
  id: string;
  name: string;
  city?: string | null;
  partnerCollege?: boolean | null;
  programs: DbProgram[];
}

function formatFee(fee?: string | null): string {
  if (!fee) return "Fee on Request";
  const num = Number(fee);
  if (!Number.isFinite(num) || num <= 0) return "Fee on Request";
  return `₹${num.toLocaleString("en-IN")}`;
}

function generateDirectoryEntry(c: DbCollege): string {
  const region = inferRegion(c.city);
  const location = c.city || "";
  const courses = (c.programs || []).map((p) => ({
    name: p.name,
    fees: formatFee(p.totalFee || p.annualFee),
  }));
  const isPartnered = Boolean(c.partnerCollege);
  const maxScholarship = isPartnered ? 25000 : 0;

  return `  college("${c.id}", "${c.name.replace(/"/g, '\\"')}", "${region}", "${location.replace(/"/g, '\\"')}", ${JSON.stringify(courses)}, ${isPartnered}, ${maxScholarship}),`;
}

async function main() {
  console.log("🔄 Fetching colleges and programs from DB...");

  const allColleges = await db.select().from(colleges).where(eq(colleges.isPublished, true));
  const allPrograms = await db.select().from(programs);

  const programsByCollege = new Map<string, DbProgram[]>();
  for (const prog of allPrograms) {
    const list = programsByCollege.get(prog.collegeId) || [];
    list.push({
      name: prog.name,
      stream: prog.stream,
      durationYears: prog.durationYears,
      totalFee: prog.totalFee?.toString() ?? null,
      annualFee: prog.annualFee?.toString() ?? null,
      eligibility: prog.eligibility,
    });
    programsByCollege.set(prog.collegeId, list);
  }

  const dbColleges: DbCollege[] = allColleges.map((c) => ({
    id: c.id,
    name: c.name,
    city: c.city,
    partnerCollege: c.partnerCollege,
    programs: programsByCollege.get(c.id) || [],
  }));

  console.log(`📊 Found ${dbColleges.length} published colleges`);

  const entries = dbColleges.map(generateDirectoryEntry).join("\n");

  const output = `export interface DirectoryCourse {
  name: string;
  specialization?: string;
  fees: string;
}

export interface CollegeDirectoryEntry {
  id: string;
  name: string;
  region: "Delhi/NCR" | "Mumbai/Pune" | "Bangalore" | "Bhubaneswar" | "Hyderabad/Kolkata" | "Others";
  location: string;
  courses: DirectoryCourse[];
  isPartnered: boolean;
  scholarshipAvailable: boolean;
  maxScholarship: number;
}

function college(
  id: string,
  name: string,
  region: CollegeDirectoryEntry["region"],
  location: string,
  courses: DirectoryCourse[],
  isPartnered: boolean,
  maxScholarship = 0,
): CollegeDirectoryEntry {
  return {
    id,
    name,
    region,
    location,
    courses,
    isPartnered,
    scholarshipAvailable: isPartnered && maxScholarship > 0,
    maxScholarship,
  };
}

export const COLLEGE_REGIONS: CollegeDirectoryEntry["region"][] = [
  "Delhi/NCR",
  "Mumbai/Pune",
  "Bangalore",
  "Bhubaneswar",
  "Hyderabad/Kolkata",
  "Others",
];

export const MBA_PGDM_COLLEGES: CollegeDirectoryEntry[] = [
${entries}
];

export function isMBAOrPGDMProgram(programName: string): boolean {
  return /\\bMBA\\b|\\bPGDM\\b/i.test(programName);
}

export function canReceiveOrionScholarship(
  college: Pick<CollegeDirectoryEntry, "isPartnered" | "scholarshipAvailable">,
  programName: string,
): boolean {
  return college.isPartnered && college.scholarshipAvailable && isMBAOrPGDMProgram(programName);
}

export const PARTNER_COLLEGE_COUNT = MBA_PGDM_COLLEGES.filter((college) => college.isPartnered).length;
`;

  const outputPath = "src/data/college-directory.ts";
  writeFileSync(outputPath, output);
  console.log(`✅ Generated ${outputPath} with ${dbColleges.length} colleges`);
  console.log(`🎓 Partner colleges: ${dbColleges.filter((c) => c.partnerCollege).length}`);
}

main().catch((err) => {
  console.error("❌ Sync failed:", err);
  process.exit(1);
});