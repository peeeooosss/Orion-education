/**
 * Add lead category / assignment columns to the leads table and backfill
 * existing rows. Also ensures the lead_id tracking column exists on
 * website_leads and raw_students.
 *
 * Usage:
 *   npx tsx scripts/migrate-leads-category.ts
 */

import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
config({ path: ".env.local" });

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Error: DATABASE_URL is not set in .env.local");
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  console.log("Connecting to database...");

  const run = (stmt: string) => sql`${sql.unsafe(stmt)}`;

  const columns: Array<readonly [string, string]> = [
    ["lead_category", "TEXT"],
    ["assignment_status", "TEXT"],
    ["source_form", "TEXT"],
    ["college_id", "TEXT"],
    ["study_country", "TEXT"],
    ["study_level", "TEXT"],
    ["study_field", "TEXT"],
  ];

  for (const [name, type] of columns) {
    await run(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS ${name} ${type}`);
    console.log(`✓ ensured leads.${name}`);
  }

  await run(`ALTER TABLE leads ALTER COLUMN lead_category SET DEFAULT 'general'`);
  await run(`ALTER TABLE leads ALTER COLUMN assignment_status SET DEFAULT 'Unassigned'`);

  const backfilled = await sql`
    UPDATE leads
    SET lead_category = CASE
      WHEN source = 'Study Abroad' THEN 'study_abroad'
      WHEN source = 'College Enquiry' THEN 'college_specific'
      WHEN source = 'Website Visit' THEN 'college_specific'
      WHEN source = 'Imported Raw Data' THEN 'imported'
      WHEN source = 'Free Enquiry' OR source LIKE '%Scholarship%' THEN 'general'
      ELSE 'general'
    END
    WHERE lead_category IS NULL OR lead_category = 'general'
  `;
  console.log(`✓ backfilled lead_category (${backfilled.length} rows updated)`);

  const assigned = await sql`
    UPDATE leads
    SET assignment_status = 'Assigned'
    WHERE agent_id IS NOT NULL AND (assignment_status IS NULL OR assignment_status = 'Unassigned')
  `;
  console.log(`✓ backfilled assignment_status for assigned leads (${assigned.length} rows updated)`);

  const defaults = await sql`
    UPDATE leads
    SET lead_category = COALESCE(lead_category, 'general'),
        assignment_status = COALESCE(assignment_status, 'Unassigned')
    WHERE lead_category IS NULL OR assignment_status IS NULL
  `;
  console.log(`✓ filled remaining null defaults (${defaults.length} rows updated)`);

  await run(`ALTER TABLE leads ALTER COLUMN lead_category SET NOT NULL`);
  await run(`ALTER TABLE leads ALTER COLUMN assignment_status SET NOT NULL`);
  console.log("✓ ensured defaults + not-null on lead_category / assignment_status");

  await run(`ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS lead_id TEXT REFERENCES leads(id)`);
  await run(`ALTER TABLE raw_students ADD COLUMN IF NOT EXISTS lead_id TEXT REFERENCES leads(id)`);
  console.log("✓ ensured website_leads.lead_id and raw_students.lead_id");

  await run(`CREATE INDEX IF NOT EXISTS idx_leads_category ON leads(lead_category)`);
  await run(`CREATE INDEX IF NOT EXISTS idx_leads_assignment_status ON leads(assignment_status)`);
  console.log("✓ ensured indexes on leads(lead_category), leads(assignment_status)");

  console.log("\n✓ Migration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});