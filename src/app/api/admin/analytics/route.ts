import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import {
  leads, agents, contacts, applications,
  rawStudents,
} from "@/server/db/schema";
import { eq, count, sql, desc } from "drizzle-orm";

export async function GET() {
  const start = Date.now();
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const queryTimeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Analytics query timeout")), 12000)
    );

    const data = await Promise.race([
      (async () => {
        const totalLeads = await db.select({ count: count() }).from(leads);
        const totalContacts = await db.select({ count: count() }).from(contacts);
        const totalApplications = await db.select({ count: count() }).from(applications);

        const byStage = await db
          .select({ stage: leads.stage, count: count() })
          .from(leads)
          .groupBy(leads.stage);

        const bySource = await db
          .select({ source: leads.leadType, count: count() })
          .from(leads)
          .groupBy(leads.leadType);

        const byIntent = await db
          .select({ intent: leads.intentLevel, count: count() })
          .from(leads)
          .groupBy(leads.intentLevel);

        let leaderboard: {
          agentId: string;
          userId: string;
          leadsAssigned: number | null;
          callsMade: number | null;
          callsConnected: number | null;
          conversions: number | null;
          agentName: string | null;
        }[] = [];
        try {
          leaderboard = await db
            .select({
              agentId: agents.id,
              userId: agents.id,
              leadsAssigned: agents.leadsAssigned,
              callsMade: agents.callsMade,
              callsConnected: agents.callsConnected,
              conversions: agents.conversions,
              agentName: sql<string>`(SELECT name FROM users WHERE users.id = ${agents.id})`,
            })
            .from(agents)
            .orderBy(desc(agents.conversions));
        } catch {
          leaderboard = [];
        }

        const rawTotal = await db.select({ count: count() }).from(rawStudents);
        const rawAssigned = await db
          .select({ count: count() })
          .from(rawStudents)
          .where(eq(rawStudents.status, "Assigned"));

        const appByStage = await db
          .select({ stage: applications.stage, count: count() })
          .from(applications)
          .groupBy(applications.stage);

        return {
          totals: {
            leads: totalLeads[0].count,
            contacts: totalContacts[0].count,
            applications: totalApplications[0].count,
          },
          byStage,
          bySource,
          byIntent,
          leaderboard,
          rawSummary: {
            total: rawTotal[0].count,
            assigned: rawAssigned[0].count,
          },
          appByStage,
        };
      })(),
      queryTimeout,
    ]);

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[analytics] Error:", message, Date.now() - start, "ms");
    return NextResponse.json(
      { error: "Analytics failed", detail: message, elapsedMs: Date.now() - start },
      { status: 500 }
    );
  }
}
