import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL required");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const stmts = [
  // Add new columns to colleges table
  `ALTER TABLE colleges ADD COLUMN IF NOT EXISTS photos jsonb DEFAULT '[]'`,
  `ALTER TABLE colleges ADD COLUMN IF NOT EXISTS video_links jsonb DEFAULT '[]'`,
  `ALTER TABLE colleges ADD COLUMN IF NOT EXISTS partner_college boolean DEFAULT false`,
  `ALTER TABLE colleges ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT true`,
];

async function main() {
  console.log("🔧 Running migration...\n");
  for (const stmt of stmts) {
    try {
      await sql.query(stmt);
      console.log(`✅ ${stmt.substring(0, 60)}...`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("already exists")) {
        console.log(`⏭️  Column already exists, skipping`);
      } else {
        console.error(`❌ Failed: ${msg}`);
      }
    }
  }
  console.log("\n✅ Migration complete!");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
