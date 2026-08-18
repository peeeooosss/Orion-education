import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../src/server/db/schema";
import { hashPassword } from "../src/server/auth/password";
import {
  SEED_COLLEGES,
  SEED_LEADS,
  SEED_RAW_BATCHES,
  SEED_RAW_STUDENTS,
  SEED_APPLICATIONS,
} from "../src/store/seed";
import { nanoid } from "nanoid";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is required. Set it in .env.local");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql, { schema });

const STUDENTS = [
  { id: "student-1", name: "Aarav Patel", email: "aarav@orion.education", phone: "+91 98765 12345", city: "Bengaluru", state: "Karnataka" },
  { id: "student-2", name: "Ananya Das", email: "ananya@orion.education", phone: "+91 98765 10001", city: "Guwahati", state: "Assam" },
  { id: "student-3", name: "Rahul Bora", email: "rahul@orion.education", phone: "+91 98765 10002", city: "Dibrugarh", state: "Assam" },
  { id: "student-4", name: "Nandita Saikia", email: "nandita@orion.education", phone: "+91 98765 10003", city: "Jorhat", state: "Assam" },
  { id: "student-5", name: "Priyanka Hazarika", email: "priyanka@orion.education", phone: "+91 98765 10004", city: "Silchar", state: "Assam" },
  { id: "student-6", name: "PIYUSH BHUYAN", email: "piyushbhuyan71@gmail.com", phone: "+91 98765 10005", city: "Guwahati", state: "Assam" },
];

const AGENTS = [
  { id: "agent-rohit", name: "Rohit Verma", email: "rohit@orion.education", leadsAssigned: 42, callsMade: 128, callsConnected: 87, conversions: 19 },
  { id: "agent-priya", name: "Priya Nair", email: "priya@orion.education", leadsAssigned: 38, callsMade: 141, callsConnected: 96, conversions: 23 },
];

const agentIdMap: Record<string, string> = {};

async function main() {
  console.log("🌱 Starting seed...\n");

  // ─── 1. Admin User ─────────────────────────────────────
  const adminHash = await hashPassword("Admin@1234");
  try {
    await db.insert(schema.users).values({
      id: "admin-001",
      email: "admin@orion.education",
      passwordHash: adminHash,
      name: "Superadmin",
      role: "admin",
    });
    console.log("✅ Admin user: admin@orion.education / Admin@1234");
  } catch {
    console.log("⚠️  Admin user already exists, skipping");
  }

  // ─── 2. Student Users ──────────────────────────────────
  const studentHash = await hashPassword("Student@1234");
  for (const student of STUDENTS) {
    try {
      await db.insert(schema.users).values({
        id: student.id,
        email: student.email,
        passwordHash: studentHash,
        name: student.name,
        role: "student",
        phone: student.phone,
        city: student.city,
        state: student.state,
      });
      console.log(`✅ Student: ${student.name} (${student.email}) / Student@1234`);
    } catch {
      console.log(`⚠️  Student ${student.name} already exists, skipping`);
    }
  }

  // ─── 3. Agents (users + agent records) ─────────────────
  const agentHash = await hashPassword("Agent@1234");
  for (const agent of AGENTS) {
    agentIdMap[agent.name] = agent.id;
    try {
      await db.insert(schema.users).values({
        id: agent.id,
        email: agent.email,
        passwordHash: agentHash,
        name: agent.name,
        role: "agent",
      });
      await db.insert(schema.agents).values({
        id: agent.id,
        leadsAssigned: agent.leadsAssigned,
        callsMade: agent.callsMade,
        callsConnected: agent.callsConnected,
        conversions: agent.conversions,
      });
      console.log(`✅ Agent: ${agent.name} (${agent.email}) / Agent@1234`);
    } catch {
      console.log(`⚠️  Agent ${agent.name} already exists, skipping`);
    }
  }

  // ─── 4. Colleges + Programs ────────────────────────────
  let programCount = 0;
  for (const college of SEED_COLLEGES) {
    try {
      await db.insert(schema.colleges).values({
        id: college.id,
        name: college.name,
        shortName: college.shortName,
        city: college.city,
        established: college.established,
        rating: String(college.rating),
        type: college.type,
        about: college.about,
        tags: college.tags,
        accreditation: college.accreditation,
        ranking: college.ranking,
        admissions: college.admissions,
        costs: college.costs,
        scholarships: college.scholarships,
        placementPct: String(college.placementPct),
        highestPlacement: String(college.highestPlacement),
        intake: college.intake,
        facilities: college.facilities,
        sourceWebsite: college.sourceWebsite,
        coverImage: college.coverImage,
      });

      for (const prog of college.programs) {
        await db.insert(schema.programs).values({
          id: `${college.id}-${prog.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          collegeId: college.id,
          name: prog.name,
          stream: prog.stream,
          durationYears: prog.durationYears,
          annualFee: String(prog.annualFee),
          totalFee: String(prog.totalFee),
          avgPlacement: String(prog.avgPlacement),
          eligibility: prog.eligibility,
          intakes: prog.intakes,
          seats: prog.seats,
        });
        programCount++;
      }
      console.log(`✅ College: ${college.name} (${college.programs.length} programs)`);
    } catch {
      console.log(`⚠️  College ${college.name} already exists, skipping`);
    }
  }
  console.log(`   ${programCount} programs seeded total`);

  // ─── 5. Contacts + Leads ───────────────────────────────
  for (const lead of SEED_LEADS) {
    const contactId = `c-${lead.id}`;
    try {
      await db.insert(schema.contacts).values({
        id: contactId,
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
      });
    } catch { /* skip */ }

    const agentUserId = agentIdMap[lead.agent] ?? null;

    try {
      await db.insert(schema.leads).values({
        id: lead.id,
        contactId,
        agentId: agentUserId,
        stage: lead.status,
        source: lead.source,
        leadType: lead.leadType,
        lookingFor: lead.lookingFor,
        targetCollege: lead.targetCollege,
        scholarshipAmount: String(lead.scholarshipUnlocked),
        scholarshipApplied: lead.scholarshipApplied,
        intentLevel: lead.intentLevel,
        intentScore: lead.intentLevel === "Hot" ? 80 : lead.intentLevel === "Warm" ? 50 : 20,
        callConnected: lead.callConnected,
        createdAt: new Date(lead.createdAt),
        updatedAt: new Date(),
      });
      console.log(`✅ Lead: ${lead.name} (${lead.source} → ${lead.status})`);
    } catch {
      console.log(`⚠️  Lead ${lead.name} already exists, skipping`);
    }
  }

  // ─── 6. Raw Import Batch + Raw Students ────────────────
  for (const batch of SEED_RAW_BATCHES) {
    try {
      await db.insert(schema.rawImportBatches).values({
        id: batch.id,
        fileName: batch.fileName,
        sheetName: batch.sheetName,
        importedBy: batch.importedBy,
        rowCount: batch.rowCount,
        headers: batch.headers,
      });
      console.log(`✅ Raw batch: ${batch.fileName}`);
    } catch {
      console.log(`⚠️  Raw batch ${batch.fileName} already exists, skipping`);
    }
  }

  for (const raw of SEED_RAW_STUDENTS) {
    try {
      await db.insert(schema.rawStudents).values({
        id: raw.id,
        batchId: raw.batchId,
        sourceFile: raw.sourceFile,
        studentName: raw.studentName,
        phone: raw.phone,
        email: raw.email,
        city: raw.city,
        state: raw.state,
        stream: raw.stream,
        scoreBand: raw.scoreBand,
        entranceExam: raw.entranceExam,
        entranceScore: raw.entranceScore,
        preferredCollege: raw.preferredCollege,
        preferredProgram: raw.preferredProgram,
        budgetRange: raw.budgetRange,
        hostelRequired: raw.hostelRequired,
        loanRequired: raw.loanRequired,
        admissionTimeline: raw.admissionTimeline,
        assignedAgent: raw.assignedAgent,
        status: raw.status,
        callStatus: raw.callStatus,
        interestStatus: raw.interestStatus,
      });
      console.log(`✅ Raw student: ${raw.studentName} (assigned → ${raw.assignedAgent})`);
    } catch {
      console.log(`⚠️  Raw student ${raw.studentName} already exists, skipping`);
    }
  }

  // ─── 7. Applications ──────────────────────────────────
  for (const app of SEED_APPLICATIONS) {
    try {
      await db.insert(schema.applications).values({
        id: app.id,
        leadId: app.leadId,
        collegeId: app.collegeId,
        collegeName: app.collegeName,
        program: app.program,
        scholarship: String(app.scholarshipApplied),
        stage: app.stage,
        notes: app.notes,
        agentId: agentIdMap[app.agent] ?? null,
        startedAt: new Date(app.startedAt),
        updatedAt: new Date(app.updatedAt),
      });

      for (const doc of app.docs) {
        await db.insert(schema.applicationDocuments).values({
          id: `${app.id}-${doc.id}`,
          applicationId: app.id,
          name: doc.name,
          required: doc.required,
          done: doc.done,
        });
      }

      for (const event of app.timeline) {
        await db.insert(schema.applicationEvents).values({
          id: nanoid(),
          applicationId: app.id,
          label: event.label,
          createdAt: new Date(event.at),
        });
      }
      console.log(`✅ Application: ${app.studentName} @ ${app.collegeName} (${app.stage})`);
    } catch {
      console.log(`⚠️  Application ${app.id} already exists, skipping`);
    }
  }

  console.log("\n🎉 Seed complete!");
  console.log("──────────────────────────────────────────");
  console.log("Login credentials:");
  console.log("  Admin:     admin@orion.education / Admin@1234");
  console.log("  Agent:     rohit@orion.education / Agent@1234");
  console.log("  Student:   aarav@orion.education / Student@1234");
  console.log("──────────────────────────────────────────");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
