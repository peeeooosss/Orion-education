import {
  pgTable,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  date,
} from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("student"), // student | agent | admin
  city: text("city"),
  state: text("state"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Agents ──────────────────────────────────────────────
export const agents = pgTable("agents", {
  id: text("id").primaryKey().references(() => users.id),
  dailyTarget: integer("daily_target").default(40),
  avatarColor: text("avatar_color").default("#6366f1"),
  leadsAssigned: integer("leads_assigned").default(0),
  callsMade: integer("calls_made").default(0),
  callsConnected: integer("calls_connected").default(0),
  conversions: integer("conversions").default(0),
});

// ─── Contacts ────────────────────────────────────────────
export const contacts = pgTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  city: text("city"),
  state: text("state"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("contacts_phone_idx").on(t.phone),
]);

// ─── Leads ───────────────────────────────────────────────
export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  contactId: text("contact_id").references(() => contacts.id),
  agentId: text("agent_id").references(() => agents.id),

  // Pipeline
  stage: text("stage").notNull().default("New"),
  // New | Contacted | Qualified | Application Started | Offer Received | Admitted | Lost | Do Not Contact

  // Source
  source: text("source").notNull(),
  // "Scholarship Checker" | "College Enquiry" | "Website Visit" | "Imported Raw Data"
  leadType: text("lead_type").notNull(),
  // "scholarship" | "enquiry" | "raw"

  // Student context
  lookingFor: text("looking_for"),
  targetCollege: text("target_college"),
  targetProgram: text("target_program"),
  admissionTimeline: text("admission_timeline"),

  // Scholarship
  scholarshipAmount: numeric("scholarship_amount").default("0"),
  scholarshipApplied: boolean("scholarship_applied").default(false),
  paymentStatus: text("payment_status").default("Not Required"),
  // "Not Required" | "Pending" | "Paid"
  paymentId: text("payment_id"),

  // Intent scoring
  intentLevel: text("intent_level").default("Cold"),
  intentScore: integer("intent_score").default(0),
  intentReasons: jsonb("intent_reasons").default([]),
  scoreBand: text("score_band"),
  stream: text("stream"),

  // Call state
  callStatus: text("call_status").default("Not Called"),
  interestStatus: text("interest_status").default("Not Assessed"),
  nextAction: text("next_action"),
  callConnected: boolean("call_connected").default(false),

  // Scheduling
  lastCalledAt: timestamp("last_called_at", { withTimezone: true }),
  nextFollowUpAt: timestamp("next_follow_up_at", { withTimezone: true }),

  // Raw data link
  rawStudentId: text("raw_student_id"),

  // Assignment
  assignedBy: text("assigned_by"),
  assignedAt: timestamp("assigned_at", { withTimezone: true }),
  assignmentNote: text("assignment_note"),

  // Questionnaire snapshot
  questionnaire: jsonb("questionnaire"),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Lead Activities ─────────────────────────────────────
export const leadActivities = pgTable("lead_activities", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull().references(() => leads.id),
  agentId: text("agent_id").references(() => agents.id),
  kind: text("kind").notNull(),
  // "call" | "whatsapp" | "note" | "status_change" | "assignment" | "scholarship_push" | "follow_up_set" | "follow_up_completed"
  callResult: text("call_result"),
  interest: text("interest"),
  nextAction: text("next_action"),
  note: text("note"),
  oldStage: text("old_stage"),
  newStage: text("new_stage"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Follow-ups ──────────────────────────────────────────
export const followUps = pgTable("follow_ups", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull().references(() => leads.id),
  agentId: text("agent_id").notNull().references(() => agents.id),
  dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
  followType: text("follow_type").default("Call"),
  // "Call" | "WhatsApp" | "Email" | "Counselling"
  priority: text("priority").default("Normal"),
  // "Normal" | "Important" | "Urgent"
  note: text("note"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Questionnaires ──────────────────────────────────────
export const questionnaires = pgTable("questionnaires", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").references(() => leads.id),
  userId: text("user_id").references(() => users.id),
  data: jsonb("data").notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Scholarship Payments ────────────────────────────────
export const scholarshipPayments = pgTable("scholarship_payments", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  leadId: text("lead_id").references(() => leads.id),
  contactId: text("contact_id").references(() => contacts.id),
  amount: numeric("amount").notNull().default("99"),
  currency: text("currency").default("INR"),
  purpose: text("purpose").default("Scholarship Check"),
  status: text("status").default("Initiated"),
  // "Initiated" | "Pending" | "Paid" | "Failed"
  primaryCollege: text("primary_college"),
  collegeIds: jsonb("college_ids").default([]),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Vouchers ────────────────────────────────────────────
export const vouchers = pgTable("vouchers", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  leadId: text("lead_id").references(() => leads.id),
  contactId: text("contact_id").references(() => contacts.id),
  amount: numeric("amount").notNull(),
  primaryCollege: text("primary_college"),
  stream: text("stream"),
  status: text("status").default("Active"),
  // "Active" | "Claimed" | "Expiring" | "Expired"
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  perCollege: jsonb("per_college").default([]),
});

// ─── Applications ────────────────────────────────────────
export const applications = pgTable("applications", {
  id: text("id").primaryKey(),
  leadId: text("lead_id").notNull().references(() => leads.id),
  contactId: text("contact_id").references(() => contacts.id),
  agentId: text("agent_id").references(() => agents.id),
  collegeId: text("college_id"),
  collegeName: text("college_name"),
  program: text("program"),
  scholarship: numeric("scholarship").default("0"),
  stage: text("stage").default("Docs Pending"),
  // "Docs Pending" | "Submitted" | "Offer Received" | "Admitted"
  notes: text("notes"),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Application Documents ───────────────────────────────
export const applicationDocuments = pgTable("application_documents", {
  id: text("id").primaryKey(),
  applicationId: text("application_id").notNull().references(() => applications.id),
  name: text("name").notNull(),
  required: boolean("required").default(true),
  done: boolean("done").default(false),
});

// ─── Application Events ──────────────────────────────────
export const applicationEvents = pgTable("application_events", {
  id: text("id").primaryKey(),
  applicationId: text("application_id").notNull().references(() => applications.id),
  label: text("label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Colleges ────────────────────────────────────────────
export const colleges = pgTable("colleges", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name"),
  city: text("city"),
  established: integer("established"),
  rating: numeric("rating"),
  type: text("type"),
  about: text("about"),
  tags: jsonb("tags").default([]),
  accreditation: jsonb("accreditation").default([]),
  ranking: text("ranking"),
  admissions: jsonb("admissions"),
  costs: jsonb("costs"),
  scholarships: jsonb("scholarships"),
  placementPct: numeric("placement_pct"),
  highestPlacement: numeric("highest_placement"),
  intake: integer("intake"),
  facilities: jsonb("facilities").default([]),
  sourceWebsite: text("source_website"),
  coverImage: text("cover_image"),
  photos: jsonb("photos").default([]),
  videoLinks: jsonb("video_links").default([]),
  campusVideos: jsonb("campus_videos").default([]),
  partnerProfile: jsonb("partner_profile"),
  partnerCollege: boolean("partner_college").default(false),
  isPublished: boolean("is_published").default(true),
  budget: numeric("budget").default("80000"),
});

// ─── Programs ────────────────────────────────────────────
export const programs = pgTable("programs", {
  id: text("id").primaryKey(),
  collegeId: text("college_id").notNull().references(() => colleges.id),
  name: text("name").notNull(),
  stream: text("stream"),
  durationYears: integer("duration_years"),
  annualFee: numeric("annual_fee"),
  totalFee: numeric("total_fee"),
  avgPlacement: numeric("avg_placement"),
  eligibility: text("eligibility"),
  intakes: jsonb("intakes").default([]),
  seats: integer("seats"),
});

// ─── Raw Import Batches ──────────────────────────────────
export const rawImportBatches = pgTable("raw_import_batches", {
  id: text("id").primaryKey(),
  fileName: text("file_name").notNull(),
  sheetName: text("sheet_name"),
  importedAt: timestamp("imported_at", { withTimezone: true }).notNull().defaultNow(),
  importedBy: text("imported_by"),
  rowCount: integer("row_count"),
  headers: jsonb("headers").default([]),
});

// ─── Raw Students ────────────────────────────────────────
export const rawStudents = pgTable("raw_students", {
  id: text("id").primaryKey(),
  batchId: text("batch_id").references(() => rawImportBatches.id),
  sourceFile: text("source_file"),
  importedAt: timestamp("imported_at", { withTimezone: true }).notNull().defaultNow(),
  studentName: text("student_name"),
  phone: text("phone"),
  email: text("email"),
  city: text("city"),
  state: text("state"),
  stream: text("stream"),
  scoreBand: text("score_band"),
  entranceExam: text("entrance_exam"),
  entranceScore: text("entrance_score"),
  preferredCollege: text("preferred_college"),
  preferredProgram: text("preferred_program"),
  budgetRange: text("budget_range"),
  hostelRequired: boolean("hostel_required").default(false),
  loanRequired: boolean("loan_required").default(false),
  admissionTimeline: text("admission_timeline"),
  assignedAgent: text("assigned_agent"),
  status: text("status").default("Unassigned"),
  callStatus: text("call_status").default("Not Called"),
  interestStatus: text("interest_status").default("Not Assessed"),
  leadId: text("lead_id").references(() => leads.id),
  intentLevel: text("intent_level"),
  intentOverride: boolean("intent_override").default(false),
  intentOverrideReason: text("intent_override_reason"),
});

// ─── Agent Daily Stats ───────────────────────────────────
export const agentDailyStats = pgTable("agent_daily_stats", {
  id: text("id").primaryKey(),
  agentId: text("agent_id").notNull().references(() => agents.id),
  date: date("date").notNull(),
  callsMade: integer("calls_made").default(0),
  callsConnected: integer("calls_connected").default(0),
  leadsQualified: integer("leads_qualified").default(0),
  leadsApplied: integer("leads_applied").default(0),
  leadsAdmitted: integer("leads_admitted").default(0),
}, (t) => [
  uniqueIndex("agent_daily_stats_agent_date_idx").on(t.agentId, t.date),
]);

// ─── Daily Metrics ───────────────────────────────────────
export const dailyMetrics = pgTable("daily_metrics", {
  id: text("id").primaryKey(),
  date: date("date").notNull().unique(),
  totalLeads: integer("total_leads").default(0),
  newLeads: integer("new_leads").default(0),
  totalCalls: integer("total_calls").default(0),
  totalConnected: integer("total_connected").default(0),
  totalQualified: integer("total_qualified").default(0),
  totalApplied: integer("total_applied").default(0),
  totalAdmitted: integer("total_admitted").default(0),
  totalLost: integer("total_lost").default(0),
  scholarshipRevenue: numeric("scholarship_revenue").default("0"),
  budgetUsed: numeric("budget_used").default("0"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Website Visit Leads ───────────────────────────────────
export const websiteLeads = pgTable("website_leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  collegeId: text("college_id").references(() => colleges.id),
  collegeName: text("college_name"),
  program: text("program"),
  admissionTimeline: text("admission_timeline"),
  sourceWebsite: text("source_website"),
  userId: text("user_id").references(() => users.id),
  source: text("source").default("website-visit"),
  assignedAgent: text("assigned_agent"),
  leadId: text("lead_id"),
  status: text("status").default("Unassigned"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ─── Gallery Photos ──────────────────────────────────────
export const galleryPhotos = pgTable("gallery_photos", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  dateLabel: text("date_label"),
  sortOrder: integer("sort_order").default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
