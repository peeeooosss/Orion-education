/**
 * Add the `source` column to the website_leads table if it doesn't exist.
 * Also backfills existing rows to 'website-visit'.
 *
 * Usage:
 *   npx tsx scripts/migrate-website-leads-source.ts
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

  const columnCheck = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'website_leads' AND column_name = 'source'
  `;

  if (columnCheck.length === 0) {
    console.log("Adding `source` column to website_leads...");
    await sql`
      ALTER TABLE website_leads
      ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website-visit'
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_website_leads_source ON website_leads(source)
    `;
    console.log("✓ Column `source` added with default 'website-visit'.");
  } else {
    console.log("Column `source` already exists. Skipping.");
  }

  console.log("\n✓ Migration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
