import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL required");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

const tables = [
  "daily_metrics",
  "agent_daily_stats",
  "application_events",
  "application_documents",
  "applications",
  "vouchers",
  "scholarship_payments",
  "questionnaires",
  "lead_activities",
  "follow_ups",
  "raw_students",
  "raw_import_batches",
  "leads",
  "programs",
  "colleges",
  "agents",
  "contacts",
  "users",
];

async function main() {
  console.log("🗑️  Dropping all tables...\n");

  for (const table of tables) {
    try {
      await sql.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
      console.log(`  ✅ Dropped ${table}`);
    } catch {
      console.log(`  ⚠️  ${table} not found, skipping`);
    }
  }

  console.log("\n🎉 All tables dropped.");
}

main().catch((err) => {
  console.error("❌ Drop failed:", err);
  process.exit(1);
});
