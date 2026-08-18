import { create } from "zustand";
import {
  computeIntentScore,
  computeScholarship,
  isConverted,
  LEAD_STATUSES,
} from "@/lib/scholarship";
import {
  SEED_AGENTS,
  SEED_APPLICATIONS,
  SEED_COLLEGES,
  SEED_ENQUIRIES,
  SEED_LEADS,
  SEED_RAW_BATCHES,
  SEED_RAW_STUDENTS,
  SEED_STUDENT_PROFILE,
  SEED_VOUCHERS,
} from "./seed";
import type {
  Agent,
  Application,
  ApplicationDoc,
  ApplicationStage,
  AuthUser,
  College,
  Enquiry,
  Lead,
  LeadType,
  NewLeadInput,
  NewWebsiteVisitInput,
  RawDataBatch,
  RawStudentRecord,
  Remark,
  ScholarshipPayment,
  StudentProfile,
  StudentQuestionnaire,
  Voucher,
  WebsiteVisitLead,
} from "./types";

function leadTypeFromSource(source: Lead["source"]): LeadType {
  if (source === "Scholarship Checker") return "scholarship";
  if (source === "Imported Raw Data") return "raw";
  return "enquiry";
}

let uidCounter = 100;
function uid(prefix: string): string {
  uidCounter += 1;
  return `${prefix}-${uidCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

export function formatINR(n: number): string {
  return `₹${n.toLocaleString("en-IN")}`;
}

const DOC_TEMPLATE: Omit<ApplicationDoc, "done">[] = [
  { id: "d1", name: "Class 10 Marksheet", required: true },
  { id: "d2", name: "Class 12 Marksheet", required: true },
  { id: "d3", name: "Transfer Certificate", required: true },
  { id: "d4", name: "ID / Aadhaar Proof", required: true },
  { id: "d5", name: "Passport Photos", required: true },
  { id: "d6", name: "Entrance Exam Scorecard", required: true },
  { id: "d7", name: "Caste / Income Certificate (if applicable)", required: false },
];

function freshDocs(): ApplicationDoc[] {
  return DOC_TEMPLATE.map((d) => ({ ...d, done: false }));
}

const STAGE_TO_LEAD_STATUS: Record<ApplicationStage, Lead["status"]> = {
  "Docs Pending": "Application Started",
  Submitted: "Application Started",
  "Offer Received": "Offer Received",
  Admitted: "Admitted",
};

interface StartApplicationInput {
  leadId: string;
  collegeId: string;
  program: string;
  notes?: string;
}

export const DEFAULT_COLLEGE_BUDGETS: Record<string, number> = {
  rvce: 100000,
  bmsce: 90000,
  christ: 85000,
  manipal: 110000,
  nmims: 150000,
  dtu: 70000,
  nid: 60000,
  sjcc: 65000,
  myra: 100000,
  doon: 80000,
  pibm: 120000,
  uwsb: 60000,
  gims: 90000,
};

function withCollegeBudgets(colleges: College[]): College[] {
  return colleges.map((college) => ({
    ...college,
    scholarships: {
      ...college.scholarships,
      budget: college.scholarships.budget ?? DEFAULT_COLLEGE_BUDGETS[college.id] ?? 80000,
    },
  }));
}

function toRemark(input: Omit<Remark, "id" | "createdAt">): Remark {
  return { ...input, id: uid("remark"), createdAt: new Date().toISOString() };
}

interface AppState {
  leads: Lead[];
  colleges: College[];
  agents: Agent[];
  enquiries: Enquiry[];
  vouchers: Voucher[];
  applications: Application[];
  rawStudents: RawStudentRecord[];
  rawBatches: RawDataBatch[];
  studentProfile: StudentProfile;
  authUser: AuthUser | null;
  payments: ScholarshipPayment[];
  websiteLeads: WebsiteVisitLead[];
  questionnaire: StudentQuestionnaire | null;
  lastAddedLeadId: string | null;
  clearLastAddedLead: () => void;
  hydrateAuth: () => Promise<void>;
  hydrateQuestionnaire: () => Promise<void>;
  addLead: (input: NewLeadInput) => Lead;
  importRawData: (input: { fileName: string; sheetName: string; headers: string[]; rows: Record<string, unknown>[]; importedBy?: string }) => string;
  assignRawStudents: (ids: string[], agent: string) => void;
  updateRawStudent: (id: string, patch: Partial<RawStudentRecord>) => void;
  addRawRemark: (id: string, input: Omit<Remark, "id" | "createdAt">) => void;
  convertRawStudentToLead: (id: string, input?: { lookingFor?: string }) => Lead | null;
  updateLeadStatus: (id: string, status: Lead["status"]) => void;
  updateLeadEngagement: (id: string, patch: Partial<Pick<Lead, "callStatus" | "interestStatus" | "nextAction" | "lastCalledAt" | "nextFollowUpAt" | "intentScore" | "intentReasons" | "intentLevel" | "intentOverride" | "intentOverrideReason">>) => void;
  addLeadRemark: (id: string, input: Omit<Remark, "id" | "createdAt">) => void;
  updateCollegeScholarshipBudget: (collegeId: string, budget: number) => void;
  markCallConnected: (id: string) => void;
  claimVoucher: (lead: Lead, options?: { perCollegeBreakdown?: { collegeId: string; collegeName: string; amount: number }[]; primaryCollege?: string; stream?: string }) => void;
  markScholarshipApplied: (leadId: string) => void;
  addWebsiteVisitLead: (input: NewWebsiteVisitInput) => WebsiteVisitLead;
  setStudentProfile: (profile: StudentProfile) => void;
  signUp: (input: { name: string; email: string; phone: string; password: string; city?: string; state?: string }) => AuthUser;
  signIn: (input: { email: string; password: string }) => AuthUser | null;
  signOut: () => Promise<void>;
  setQuestionnaire: (q: StudentQuestionnaire) => void;
  createPayment: (input: { studentId: string; studentName: string; email: string; phone: string; collegeIds: string[]; primaryCollegeId?: string }) => ScholarshipPayment;
  completePayment: (paymentId: string) => void;
  createDemoLeadFromPayment: (paymentId: string, questionnaire: StudentQuestionnaire) => Lead | null;
  startApplication: (input: StartApplicationInput) => Application | null;
  updateApplicationStage: (id: string, stage: ApplicationStage) => void;
  toggleDoc: (applicationId: string, docId: string) => void;
  updateApplicationNotes: (applicationId: string, notes: string) => void;
  resetDemo: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  leads: SEED_LEADS,
  colleges: withCollegeBudgets(SEED_COLLEGES),
  agents: SEED_AGENTS,
  enquiries: SEED_ENQUIRIES,
  vouchers: SEED_VOUCHERS,
  applications: SEED_APPLICATIONS,
  rawStudents: SEED_RAW_STUDENTS,
  rawBatches: SEED_RAW_BATCHES,
  studentProfile: SEED_STUDENT_PROFILE,
  authUser: null,
  payments: [],
  websiteLeads: [],
  questionnaire: null,
  lastAddedLeadId: null,

  clearLastAddedLead: () => set({ lastAddedLeadId: null }),

  hydrateAuth: async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          set({
            authUser: {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
              phone: data.user.phone ?? "",
              role: data.user.role,
              city: data.user.city,
              state: data.user.state,
              createdAt: new Date().toISOString(),
            },
          });
        }
      }
    } catch {
      // silent
    }
  },

  hydrateQuestionnaire: async () => {
    try {
      const res = await fetch("/api/student/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.questionnaire?.data) {
          set({ questionnaire: data.questionnaire.data });
        }
      }
    } catch {
      // silent
    }
  },

  signUp: (input) => {
    const user: AuthUser = {
      id: uid("user"),
      name: input.name,
      email: input.email,
      phone: input.phone,
      role: "student",
      city: input.city,
      state: input.state,
      createdAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("orion-demo-users");
      const users = stored ? JSON.parse(stored) : [];
      if (!users.find((u: { email: string }) => u.email === input.email)) {
        users.push({ email: input.email, password: input.password, name: input.name, phone: input.phone });
        window.localStorage.setItem("orion-demo-users", JSON.stringify(users));
      }
    }
    set({ authUser: user });
    return user;
  },

  signIn: (input) => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("orion-demo-users") : null;
    const users: { email: string; password: string; name: string; phone: string }[] = stored ? JSON.parse(stored) : [];
    const match = users.find((u) => u.email === input.email && u.password === input.password);
    if (input.email === "demo.student@orion.education" && input.password === "Demo@1234") {
      const user: AuthUser = { id: "user-demo", name: "Demo Student", email: input.email, phone: "+91 90000 00000", role: "student", createdAt: new Date().toISOString() };
      set({ authUser: user, questionnaire: null, payments: [] });
      return user;
    }
    if (match) {
      const user: AuthUser = { id: uid("user"), name: match.name, email: match.email, phone: match.phone, role: "student", createdAt: new Date().toISOString() };
      set({ authUser: user });
      return user;
    }
    return null;
  },

  signOut: async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" });
    } catch {}
    set({ authUser: null, questionnaire: null, payments: [] });
  },

  setQuestionnaire: (q) => {
    const completed = { ...q, completedAt: new Date().toISOString() };
    set({ questionnaire: completed });
    // Persist to DB in background (fire-and-forget)
    fetch("/api/student/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: completed }),
    }).catch(() => {});
  },

  createPayment: (input) => {
    const payment: ScholarshipPayment = {
      id: uid("pay"),
      studentId: input.studentId,
      studentName: input.studentName,
      email: input.email,
      phone: input.phone,
      amount: 99,
      currency: "INR",
      purpose: "Scholarship Check",
      status: "Initiated",
      isDemo: true,
      questionnaireCompleted: true,
      scholarshipUnlocked: false,
      consultationEligible: false,
      collegeIds: input.collegeIds,
      primaryCollegeId: input.primaryCollegeId,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ payments: [payment, ...state.payments] }));
    return payment;
  },

  completePayment: (paymentId) => set((state) => ({
    payments: state.payments.map((p) => p.id === paymentId ? { ...p, status: "Paid", scholarshipUnlocked: true, consultationEligible: true, paidAt: new Date().toISOString() } : p),
  })),

  createDemoLeadFromPayment: (paymentId, questionnaire) => {
    const state = get();
    const payment = state.payments.find((p) => p.id === paymentId);
    if (!payment) return null;
    const colleges = state.colleges.filter((c) => payment.collegeIds.includes(c.id));
    const primaryCollege = colleges.find((c) => c.id === payment.primaryCollegeId) ?? colleges[0];
    const agent = state.agents[Math.floor(Math.random() * state.agents.length)].name;
    const scoreBand = questionnaire.scoreBand ?? "75-90";
    const stream = questionnaire.stream ?? "MBA";
    const scholarship = computeScholarship({ stream: stream as import("@/lib/scholarship").Stream, scoreBand: scoreBand as import("@/lib/scholarship").ScoreBand, collegeRating: primaryCollege?.rating ?? 4 });
    const intent = computeIntentScore({ scoreBand: scoreBand as import("@/lib/scholarship").ScoreBand, scholarship });
    const lead: Lead = {
      id: uid("l"),
      name: payment.studentName,
      phone: payment.phone,
      email: payment.email,
      intentLevel: intent.level,
      scoreBand: scoreBand as import("@/lib/scholarship").ScoreBand,
      scholarshipUnlocked: scholarship,
      lookingFor: questionnaire.preferredProgram ?? "Scholarship & Admission",
      targetCollege: primaryCollege?.name ?? "College to be confirmed",
      status: "New",
      callConnected: false,
      source: "Scholarship Checker",
      createdAt: new Date().toISOString(),
      agent,
      callStatus: "Not Called",
      interestStatus: "Not Assessed",
      remarks: [],
      intentScore: intent.score,
      intentReasons: intent.reasons,
      questionnaire,
      paymentStatus: "Paid",
      leadType: "scholarship",
      scholarshipApplied: true,
    };
    set((current) => ({
      leads: [lead, ...current.leads],
      payments: current.payments.map((p) => p.id === paymentId ? { ...p, leadId: lead.id, assignedAgent: agent } : p),
      enquiries: [{ id: uid("e"), leadId: lead.id, createdAt: lead.createdAt, converted: false, source: "Scholarship Checker" }, ...current.enquiries],
      lastAddedLeadId: lead.id,
    }));
    return lead;
  },

  importRawData: ({ fileName, sheetName, headers, rows, importedBy = "Superadmin" }) => {
    const batchId = uid("batch");
    const importedAt = new Date().toISOString();
    const value = (row: Record<string, unknown>, names: string[]) => {
      const key = Object.keys(row).find((candidate) => names.some((name) => candidate.toLowerCase().replace(/[^a-z]/g, "").includes(name)));
      const raw = key ? row[key] : undefined;
      return raw === undefined || raw === null ? "" : String(raw).trim();
    };
    const rawStudents: RawStudentRecord[] = rows.map((row) => ({
      id: uid("raw"),
      batchId,
      sourceFile: fileName,
      importedAt,
      studentName: value(row, ["fullname", "studentname", "name"]) || "Unnamed student",
      phone: value(row, ["phone", "mobile", "contact"]),
      email: value(row, ["email", "mail"]) || undefined,
      city: value(row, ["city", "location"]),
      state: value(row, ["state"]),
      stream: value(row, ["stream", "course"]),
      scoreBand: value(row, ["scoreband", "score", "percentage"]),
      entranceExam: value(row, ["entranceexam", "exam"]),
      entranceScore: value(row, ["entrancescore", "percentile", "rank"]),
      preferredCollege: value(row, ["preferredcollege", "college", "targetcollege"]),
      preferredProgram: value(row, ["preferredprogram", "program", "course"]),
      budgetRange: value(row, ["budgetrange", "budget", "fees"]),
      hostelRequired: value(row, ["hostelrequired", "hostel"]).toLowerCase() === "yes",
      loanRequired: value(row, ["loanrequired", "loan"]).toLowerCase() === "yes",
      admissionTimeline: value(row, ["admissiontimeline", "timeline", "joining"]),
      status: "Unassigned",
      callStatus: "Not Called",
      interestStatus: "Not Assessed",
      remarks: [],
    }));
    const batch: RawDataBatch = { id: batchId, fileName, sheetName, importedAt, importedBy, rowCount: rawStudents.length, headers };
    set((state) => ({ rawStudents: [...rawStudents, ...state.rawStudents], rawBatches: [batch, ...state.rawBatches] }));
    return batchId;
  },

  assignRawStudents: (ids, agent) => set((state) => ({
    rawStudents: state.rawStudents.map((student) => ids.includes(student.id) ? { ...student, assignedAgent: agent, status: "Assigned" } : student),
  })),

  updateRawStudent: (id, patch) => set((state) => {
    const current = state.rawStudents.find((student) => student.id === id);
    const updated = current ? { ...current, ...patch } : null;
    return {
      rawStudents: state.rawStudents.map((student) => student.id === id ? { ...student, ...patch } : student),
      leads: updated?.leadId
        ? state.leads.map((lead) => lead.id === updated.leadId
          ? {
              ...lead,
              name: updated.studentName,
              phone: updated.phone,
              email: updated.email,
              targetCollege: updated.preferredCollege || lead.targetCollege,
              lookingFor: updated.preferredProgram || lead.lookingFor,
            }
          : lead)
        : state.leads,
    };
  }),

  addRawRemark: (id, input) => set((state) => ({
    rawStudents: state.rawStudents.map((student) => student.id === id ? { ...student, remarks: [toRemark(input), ...student.remarks] } : student),
  })),

  convertRawStudentToLead: (id, input = {}) => {
    const state = get();
    const raw = state.rawStudents.find((student) => student.id === id);
    if (!raw || raw.leadId) return null;
    const college = state.colleges.find((candidate) => candidate.name.toLowerCase() === raw.preferredCollege?.toLowerCase() || candidate.name.toLowerCase().includes((raw.preferredCollege ?? "").toLowerCase()));
    const agent = raw.assignedAgent ?? state.agents[0]?.name ?? "Unassigned";
    const scoreBand = raw.scoreBand === "90+" || raw.scoreBand === "75-90" || raw.scoreBand === "60-75" || raw.scoreBand === "Below 60" ? raw.scoreBand : "75-90";
    const stream = raw.stream === "Engineering" || raw.stream === "MBA" || raw.stream === "Commerce" || raw.stream === "Design" || raw.stream === "Law" || raw.stream === "Medical" ? raw.stream : "MBA";
    const scholarship = computeScholarship({ stream, scoreBand, collegeRating: college?.rating ?? 4 });
    const intent = computeIntentScore({ scoreBand, scholarship, callStatus: raw.callStatus, interestStatus: raw.interestStatus, nextAction: raw.nextAction });
    const effectiveIntent = raw.intentOverride && raw.intentLevel ? raw.intentLevel : intent.level;
    const lead: Lead = {
      id: uid("l"),
      name: raw.studentName,
      phone: raw.phone,
      email: raw.email,
      intentLevel: effectiveIntent,
      scoreBand,
      scholarshipUnlocked: scholarship,
      lookingFor: input.lookingFor ?? raw.preferredProgram ?? "Admission counselling",
      targetCollege: college?.name ?? raw.preferredCollege ?? "College to be confirmed",
      status: "Contacted",
      callConnected: raw.callStatus === "Connected",
      source: "Imported Raw Data",
      createdAt: new Date().toISOString(),
      agent,
      callStatus: raw.callStatus,
      interestStatus: raw.interestStatus === "Not Assessed" ? "Qualified" : raw.interestStatus,
      nextAction: raw.nextAction,
      lastCalledAt: raw.lastCalledAt,
      nextFollowUpAt: raw.nextFollowUpAt,
      remarks: raw.remarks,
      rawDataId: raw.id,
      intentScore: intent.score,
      intentReasons: [...intent.reasons, college ? `Interested in ${college.shortName}` : "College preference captured"],
      systemIntentLevel: intent.level,
      systemIntentScore: intent.score,
      intentOverride: raw.intentOverride,
      intentOverrideReason: raw.intentOverrideReason,
      intentUpdatedBy: raw.intentUpdatedBy,
      intentUpdatedAt: raw.intentUpdatedAt,
      leadType: "raw",
      scholarshipApplied: false,
    };
    set((current) => ({
      leads: [lead, ...current.leads],
      rawStudents: current.rawStudents.map((student) => student.id === id ? { ...student, leadId: lead.id, status: "Converted to Lead" } : student),
      enquiries: [{ id: uid("e"), leadId: lead.id, createdAt: lead.createdAt, converted: true, source: "Imported Raw Data" }, ...current.enquiries],
      lastAddedLeadId: lead.id,
    }));
    return lead;
  },

  addLead: (input) => {
    const college = get().colleges.find((c) => c.id === input.targetCollege);
    const rating = college?.rating ?? 4;
    const scholarship = computeScholarship({
      stream: input.stream,
      scoreBand: input.scoreBand,
      collegeRating: rating,
    });
    const intent = computeIntentScore({ scoreBand: input.scoreBand, scholarship });
    const agentPool = get().agents;
    const agent = agentPool[Math.floor(Math.random() * agentPool.length)].name;
    const questionnaire = get().questionnaire;
    const authUser = get().authUser;

    const lead: Lead = {
      id: uid("l"),
      name: authUser?.name ?? input.name,
      phone: authUser?.phone ?? input.phone,
      email: authUser?.email ?? input.email,
      intentLevel: intent.level,
      scoreBand: input.scoreBand,
      scholarshipUnlocked: scholarship,
      lookingFor: input.lookingFor,
      targetCollege: college?.name ?? input.targetCollege,
      status: "New",
      callConnected: false,
      source: input.source,
      createdAt: new Date().toISOString(),
      agent,
      callStatus: "Not Called",
      interestStatus: "Not Assessed",
      remarks: [],
      intentScore: intent.score,
      intentReasons: intent.reasons,
      questionnaire: questionnaire?.completedAt ? questionnaire : undefined,
      leadType: leadTypeFromSource(input.source),
      scholarshipApplied: input.source === "Scholarship Checker",
    };

    set((state) => ({
      leads: [lead, ...state.leads],
      enquiries: [
        { id: uid("e"), leadId: lead.id, createdAt: lead.createdAt, converted: false, source: input.source },
        ...state.enquiries,
      ],
      lastAddedLeadId: lead.id,
    }));

    // Auto-create a follow-up so this lead appears in Follow-ups pipeline
    fetch("/api/follow-ups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: lead.id,
        dueAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        followType: "Call",
        priority: input.source === "Scholarship Checker" ? "Important" : "Normal",
        note: `New ${leadTypeFromSource(input.source)} lead. Call to discuss ${lead.targetCollege}.`,
      }),
    }).catch(() => {});

    return lead;
  },

  updateLeadStatus: (id, status) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id ? { ...lead, status } : lead
      ),
      enquiries: state.enquiries.map((e) =>
        isConverted(status) && e.leadId === id ? { ...e, converted: true } : e
      ),
    })),

  updateLeadEngagement: (id, patch) => set((state) => ({
    leads: state.leads.map((lead) => {
      if (lead.id !== id) return lead;
      const merged = { ...lead, ...patch, callConnected: patch.callStatus === "Connected" ? true : lead.callConnected };
      const intent = computeIntentScore({ scoreBand: merged.scoreBand ?? "75-90", scholarship: merged.scholarshipUnlocked, callStatus: merged.callStatus, interestStatus: merged.interestStatus, nextAction: merged.nextAction });
      const override = patch.intentOverride ?? merged.intentOverride ?? false;
      return {
        ...merged,
        intentLevel: override ? (patch.intentLevel ?? merged.intentLevel) : intent.level,
        intentScore: intent.score,
        intentReasons: intent.reasons,
        systemIntentLevel: intent.level,
        systemIntentScore: intent.score,
        intentOverride: override,
        intentOverrideReason: override ? (patch.intentOverrideReason ?? merged.intentOverrideReason) : undefined,
        intentUpdatedBy: patch.intentOverride !== undefined ? "Rohit Verma" : merged.intentUpdatedBy,
        intentUpdatedAt: patch.intentOverride !== undefined ? new Date().toISOString() : merged.intentUpdatedAt,
      };
    }),
  })),

  addLeadRemark: (id, input) => set((state) => ({
    leads: state.leads.map((lead) => lead.id === id ? { ...lead, remarks: [toRemark(input), ...(lead.remarks ?? [])] } : lead),
  })),

  updateCollegeScholarshipBudget: (collegeId, budget) => set((state) => ({
    colleges: state.colleges.map((college) => college.id === collegeId
      ? { ...college, scholarships: { ...college.scholarships, budget: Math.max(0, Math.round(budget)) } }
      : college),
  })),

  markCallConnected: (id) =>
    set((state) => ({
      leads: state.leads.map((lead) => {
        if (lead.id !== id) return lead;
         const intent = computeIntentScore({ scoreBand: lead.scoreBand ?? "75-90", scholarship: lead.scholarshipUnlocked, callStatus: "Connected", interestStatus: lead.interestStatus, nextAction: lead.nextAction });
         return { ...lead, callConnected: true, callStatus: "Connected", lastCalledAt: new Date().toISOString(), intentLevel: lead.intentOverride ? lead.intentLevel : intent.level, intentScore: intent.score, intentReasons: intent.reasons, systemIntentLevel: intent.level, systemIntentScore: intent.score };
      }),
    })),

  claimVoucher: (lead, options) => {
    const now = new Date();
    const expires = new Date(now);
    expires.setMonth(expires.getMonth() + 6);
    const voucher: Voucher = {
      id: uid("v"),
      code: `ORN-${Math.random().toString(36).slice(2, 6).toUpperCase()}-2026`,
      studentName: lead.name,
      phone: lead.phone,
      college: lead.targetCollege,
      program: lead.lookingFor,
      amount: lead.scholarshipUnlocked,
      issuedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      status: "Active",
      primaryCollege: options?.primaryCollege ?? lead.targetCollege,
      stream: options?.stream ?? "",
      perCollegeBreakdown: options?.perCollegeBreakdown ?? [],
    };
    set((state) => {
      const vouchers = [voucher, ...state.vouchers];
      const profile = {
        ...state.studentProfile,
        name: lead.name,
        phone: lead.phone,
        email: lead.email ?? state.studentProfile.email,
      };
      return { vouchers, studentProfile: profile };
    });
  },

  setStudentProfile: (profile) => set({ studentProfile: profile }),

  markScholarshipApplied: (leadId) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === leadId
          ? { ...lead, leadType: "scholarship" as LeadType, scholarshipApplied: true, nextAction: "Send Scholarship Details" as Lead["nextAction"] }
          : lead
      ),
    })),

  addWebsiteVisitLead: (input) => {
    const record: WebsiteVisitLead = {
      id: uid("wv"),
      name: input.name,
      phone: input.phone,
      email: input.email,
      collegeId: input.collegeId,
      collegeName: input.collegeName,
      program: input.program,
      admissionTimeline: input.admissionTimeline,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ websiteLeads: [record, ...state.websiteLeads] }));
    return record;
  },

  startApplication: (input) => {
    const state = get();
    const lead = state.leads.find((l) => l.id === input.leadId);
    if (!lead) return null;
    const college = state.colleges.find((c) => c.id === input.collegeId);
    if (!college) return null;
    const program = college.programs.find((p) => p.name === input.program);
    if (!program) return null;

    const now = new Date().toISOString();
    const application: Application = {
      id: uid("ap"),
      leadId: lead.id,
      studentName: lead.name,
      phone: lead.phone,
      collegeId: college.id,
      collegeName: college.name,
      program: program.name,
      scholarshipApplied: lead.scholarshipUnlocked,
      stage: "Docs Pending",
      docs: freshDocs(),
      notes: input.notes ?? "",
      agent: lead.agent,
      startedAt: now,
      updatedAt: now,
      timeline: [
        { at: now, label: `Application started by ${lead.agent}` },
        { at: now, label: "Docs checklist created — awaiting documents" },
      ],
    };

    set((s) => ({
      applications: [application, ...s.applications],
      leads: s.leads.map((l) =>
        l.id === lead.id
          ? { ...l, status: "Application Started", targetCollege: college.name }
          : l
      ),
      enquiries: s.enquiries.map((e) =>
        e.leadId === lead.id ? { ...e, converted: true } : e
      ),
    }));

    return application;
  },

  updateApplicationStage: (id, stage) => {
    const now = new Date().toISOString();
    set((state) => {
      const app = state.applications.find((a) => a.id === id);
      const leadStatus = STAGE_TO_LEAD_STATUS[stage];
      return {
        applications: state.applications.map((a) =>
          a.id === id
            ? {
                ...a,
                stage,
                updatedAt: now,
                timeline: [...a.timeline, { at: now, label: `Stage moved to ${stage}` }],
              }
            : a
        ),
        leads: app
          ? state.leads.map((l) =>
              l.id === app.leadId ? { ...l, status: leadStatus } : l
            )
          : state.leads,
        enquiries: app
          ? state.enquiries.map((e) =>
              e.leadId === app.leadId ? { ...e, converted: true } : e
            )
          : state.enquiries,
      };
    });
  },

  toggleDoc: (applicationId, docId) => {
    const now = new Date().toISOString();
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              updatedAt: now,
              docs: a.docs.map((d) =>
                d.id === docId ? { ...d, done: !d.done } : d
              ),
            }
          : a
      ),
    }));
  },

  updateApplicationNotes: (applicationId, notes) => {
    const now = new Date().toISOString();
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === applicationId ? { ...a, notes, updatedAt: now } : a
      ),
    }));
  },

  resetDemo: () =>
    set({
      leads: SEED_LEADS,
      colleges: withCollegeBudgets(SEED_COLLEGES),
      enquiries: SEED_ENQUIRIES,
      vouchers: SEED_VOUCHERS,
      applications: SEED_APPLICATIONS,
      rawStudents: SEED_RAW_STUDENTS,
      rawBatches: SEED_RAW_BATCHES,
      studentProfile: SEED_STUDENT_PROFILE,
      authUser: null,
      payments: [],
      websiteLeads: [],
      questionnaire: null,
      lastAddedLeadId: null,
    }),
}));

export const getCollegeById = (id: string): College | undefined =>
  useAppStore.getState().colleges.find((c) => c.id === id);

export { LEAD_STATUSES };
