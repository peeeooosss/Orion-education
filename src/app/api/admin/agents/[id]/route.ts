import { NextRequest, NextResponse } from "next/server";
import { getSessionFromCookie } from "@/server/auth";
import { db } from "@/server/db";
import { users, agents, leads, contacts, applications, leadActivities, followUps } from "@/server/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  // Get agent user + stats
  const agentUser = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (!agentUser[0] || agentUser[0].role !== "agent") {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  const agentStats = await db.select().from(agents).where(eq(agents.id, id)).limit(1);

  // Get all leads for this agent with contact info
  const agentLeads = await db.select({
    id: leads.id,
    stage: leads.stage,
    source: leads.source,
    leadType: leads.leadType,
    intentLevel: leads.intentLevel,
    callStatus: leads.callStatus,
    interestStatus: leads.interestStatus,
    targetCollege: leads.targetCollege,
    targetProgram: leads.targetProgram,
    scholarshipAmount: leads.scholarshipAmount,
    createdAt: leads.createdAt,
    contactName: contacts.name,
    contactPhone: contacts.phone,
    contactEmail: contacts.email,
  })
    .from(leads)
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .where(eq(leads.agentId, id))
    .orderBy(desc(leads.createdAt));

  // Get all applications for this agent
  const agentApplications = await db.select({
    id: applications.id,
    collegeName: applications.collegeName,
    program: applications.program,
    scholarship: applications.scholarship,
    stage: applications.stage,
    startedAt: applications.startedAt,
    updatedAt: applications.updatedAt,
    leadId: applications.leadId,
    contactName: contacts.name,
  })
    .from(applications)
    .leftJoin(leads, eq(applications.leadId, leads.id))
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .where(eq(applications.agentId, id))
    .orderBy(desc(applications.updatedAt));

  // Get recent activities
  const recentActivities = await db.select({
    id: leadActivities.id,
    kind: leadActivities.kind,
    callResult: leadActivities.callResult,
    interest: leadActivities.interest,
    note: leadActivities.note,
    oldStage: leadActivities.oldStage,
    newStage: leadActivities.newStage,
    createdAt: leadActivities.createdAt,
    leadId: leadActivities.leadId,
    contactName: contacts.name,
  })
    .from(leadActivities)
    .leftJoin(leads, eq(leadActivities.leadId, leads.id))
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .where(eq(leadActivities.agentId, id))
    .orderBy(desc(leadActivities.createdAt))
    .limit(30);

  // Get pending follow-ups
  const pendingFollowUps = await db.select({
    id: followUps.id,
    dueAt: followUps.dueAt,
    followType: followUps.followType,
    priority: followUps.priority,
    note: followUps.note,
    completed: followUps.completed,
    leadId: followUps.leadId,
    contactName: contacts.name,
  })
    .from(followUps)
    .leftJoin(leads, eq(followUps.leadId, leads.id))
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .where(eq(followUps.agentId, id))
    .orderBy(desc(followUps.dueAt));

  // Compute live stats
  const totalLeads = agentLeads.length;
  const convertedLeads = agentLeads.filter((l) => l.stage === "Admitted").length;
  const activeLeads = agentLeads.filter((l) => l.stage !== "Admitted" && l.stage !== "Lost").length;
  const pendingFollowUpCount = pendingFollowUps.filter((f) => !f.completed).length;

  // Leads by stage
  const stageBreakdown = ["New", "Contacted", "Qualified", "Application Started", "Offer Received", "Admitted"].map((stage) => ({
    stage,
    count: agentLeads.filter((l) => l.stage === stage).length,
  }));

  // Leads by source
  const sourceBreakdown = ["scholarship", "enquiry", "raw"].map((source) => ({
    source,
    count: agentLeads.filter((l) => l.leadType === source).length,
  }));

  return NextResponse.json({
    agent: {
      ...agentUser[0],
      passwordHash: undefined,
      ...agentStats[0],
    },
    leads: agentLeads,
    applications: agentApplications,
    recentActivities,
    pendingFollowUps,
    stats: {
      totalLeads,
      convertedLeads,
      activeLeads,
      pendingFollowUpCount,
      totalApplications: agentApplications.length,
      stageBreakdown,
      sourceBreakdown,
    },
  });
}
