import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, isNull } from "drizzle-orm";
import * as schema from "../src/server/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const db = drizzle(neon(DATABASE_URL), { schema });

async function main() {
  console.log("Backfilling follow-ups for leads without any...\n");

  // Find leads that have no follow-up records
  const leadsWithoutFollowUps = await db
    .select({
      id: schema.leads.id,
      agentId: schema.leads.agentId,
      source: schema.leads.source,
      leadType: schema.leads.leadType,
      createdAt: schema.leads.createdAt,
    })
    .from(schema.leads)
    .leftJoin(schema.followUps, eq(schema.leads.id, schema.followUps.leadId))
    .where(isNull(schema.followUps.id));

  console.log(`Found ${leadsWithoutFollowUps.length} leads without follow-ups\n`);

  if (leadsWithoutFollowUps.length === 0) {
    console.log("All leads already have follow-ups. Nothing to do.");
    return;
  }

  let created = 0;
  for (const lead of leadsWithoutFollowUps) {
    if (!lead.agentId) {
      console.log(`  Skipping ${lead.id} — no agent assigned`);
      continue;
    }

    await db.insert(schema.followUps).values({
      id: `fu-bf-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      leadId: lead.id,
      agentId: lead.agentId,
      dueAt: new Date(), // Due now → appears as overdue/pending
      followType: "Call",
      priority: lead.leadType === "scholarship" ? "Important" : "Normal",
      note: `Follow up on ${lead.source} lead`,
    });
    created++;
    console.log(`  Created follow-up for ${lead.id} (${lead.leadType})`);
  }

  console.log(`\nDone. Created ${created} follow-ups.`);
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});
