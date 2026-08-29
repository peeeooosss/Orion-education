/**
 * Bootstrap the first admin user for Orion Education.
 *
 * Usage:
 *   npx tsx scripts/bootstrap-admin.ts
 *   npx tsx scripts/bootstrap-admin.ts --email admin@orion.local --password MySecurePass --name "Admin User"
 */

import { hash } from "bcryptjs";
import { nanoid } from "nanoid";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { users } from "../src/server/db/schema";
import { eq } from "drizzle-orm";

function parseArgs() {
  const args = process.argv.slice(2);
  const result: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--") && i + 1 < args.length) {
      result[args[i].slice(2)] = args[i + 1];
      i++;
    }
  }
  return result;
}

async function main() {
  const args = parseArgs();
  const email = args.email || "admin@orion.education";
  const password = args.password || "Admin@1234";
  const name = args.name || "Admin User";
  const phone = args.phone || null;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("Error: DATABASE_URL environment variable is not set.");
    console.error("Set it in .env.local or export it before running this script.");
    process.exit(1);
  }

  console.log("Connecting to database...");
  const sql = neon(databaseUrl);
  const db = drizzle(sql);

  // Check if admin already exists
  const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
  if (existing.length > 0) {
    console.log(`Admin user with email "${email}" already exists (id: ${existing[0].id}).`);
    console.log("Skipping creation.");
    process.exit(0);
  }

  console.log("Hashing password...");
  const passwordHash = await hash(password, 10);

  const userId = `admin-${nanoid(8)}`;

  console.log(`Creating admin user: ${email}`);
  await db.insert(users).values({
    id: userId,
    email: email.toLowerCase(),
    passwordHash,
    name,
    phone,
    role: "admin",
    active: true,
  });

  console.log("\n✓ Admin user created successfully!");
  console.log(`  ID:    ${userId}`);
  console.log(`  Email: ${email}`);
  console.log(`  Name:  ${name}`);
  console.log(`  Role:  admin`);
  console.log(`\nYou can now sign in at /auth/sign-in/admin`);
}

main().catch((err) => {
  console.error("Failed to bootstrap admin:", err);
  process.exit(1);
});
