/**
 * Add assignment-tracking columns to the website_leads table so admin can
 * send website leads to agents (mirrors raw_students).
 *
 * Adds: assigned_agent, lead_id, status (default 'Unassigned').
 *
 * Usage:
 *   npx tsx scripts/migrate-website-leads-assign.ts
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

  const check = async (col: string) => {
    const res = await sql`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'website_leads' AND column_name = ${col}
    `;
    return res.length > 0;
  };

  if (!(await check("assigned_agent"))) {
    console.log("Adding `assigned_agent` column...");
    await sql`ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS assigned_agent TEXT`;
  } else {
    console.log("Column `assigned_agent` already exists. Skipping.");
  }

  if (!(await check("lead_id"))) {
    console.log("Adding `lead_id` column...");
    await sql`ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS lead_id TEXT`;
  } else {
    console.log("Column `lead_id` already exists. Skipping.");
  }

  if (!(await check("status"))) {
    console.log("Adding `status` column with default 'Unassigned'...");
    await sql`ALTER TABLE website_leads ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Unassigned'`;
  } else {
    console.log("Column `status` already exists. Skipping.");
  }

  console.log("\n✓ Migration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
