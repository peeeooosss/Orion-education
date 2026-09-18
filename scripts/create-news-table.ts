import "dotenv/config";
import { neon } from "@neondatabase/serverless";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  const sql = neon(url);

  await sql`
    CREATE TABLE IF NOT EXISTS news_items (
      id text PRIMARY KEY,
      title text NOT NULL,
      excerpt text,
      category text NOT NULL DEFAULT 'General',
      date date NOT NULL,
      external_url text,
      is_published boolean NOT NULL DEFAULT true,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `;

  console.log("news_items table created (or already exists).");
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
