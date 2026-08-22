import type { IntentLevel, LeadStatus, ScoreBand, Stream } from "@/lib/scholarship";

export type { IntentLevel, LeadStatus };

export type LeadSource = "Scholarship Checker" | "College Enquiry" | "Imported Raw Data";
export type LeadType = "scholarship" | "enquiry" | "raw";
export type CallStatus = "Not Called" | "Call Started" | "Connected" | "No Answer" | "Busy" | "Call Back Requested" | "WhatsApp Sent" | "Wrong Number" | "Do Not Call";
export type InterestStatus = "Not Assessed" | "Interested" | "Needs More Details" | "Parent Discussion" | "Fee Concern" | "Scholarship Focused" | "Placement Focused" | "Exam Result Pending" | "Not Interested" | "Qualified";
export type NextAction = "Call Again" | "Send College Details" | "Send Fee Structure" | "Send Scholarship Details" | "Send Placement Details" | "Send WhatsApp Comparison" | "Talk to Parent" | "Book Counselling" | "Follow Up After Exam Result" | "Start Application" | "Close Record";

export type RawStudentStatus = "Unassigned" | "Assigned" | "Call Pending" | "Calling" | "Connected" | "Follow-up Required" | "Qualified" | "Converted to Lead" | "Not Interested" | "Invalid" | "Skipped";

export interface Remark {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
  followUpAt?: string;
  reminderType?: "Call" | "WhatsApp" | "Fees" | "Scholarship" | "Parent Callback" | "Application";
  priority: "Normal" | "Important" | "Urgent";
}

export interface RawStudentRecord {
  id: string;
  batchId: string;
  sourceFile: string;
  importedAt: string;
  studentName: string;
  phone: string;
  email?: string;
  city?: string;
  state?: string;
  stream?: string;
  scoreBand?: string;
  entranceExam?: string;
  entranceScore?: string;
  preferredCollege?: string;
  preferredProgram?: string;
  budgetRange?: string;
  hostelRequired?: boolean;
  loanRequired?: boolean;
  admissionTimeline?: string;
  assignedAgent?: string;
  status: RawStudentStatus;
  leadId?: string;
  callStatus: CallStatus;
  interestStatus: InterestStatus;
  nextAction?: NextAction;
  lastCalledAt?: string;
  nextFollowUpAt?: string;
  remarks: Remark[];
  intentLevel?: IntentLevel;
  systemIntentLevel?: IntentLevel;
  systemIntentScore?: number;
  intentOverride?: boolean;
  intentOverrideReason?: string;
  intentUpdatedBy?: string;
  intentUpdatedAt?: string;
  lastEditedBy?: string;
  lastEditedAt?: string;
}

export interface RawDataBatch {
  id: string;
  fileName: string;
  sheetName: string;
  importedAt: string;
  importedBy: string;
  rowCount: number;
  headers: string[];
}

export type ApplicationStage = "Docs Pending" | "Submitted" | "Offer Received" | "Admitted";

export interface ApplicationDoc {
  id: string;
  name: string;
  required: boolean;
  done: boolean;
}

export interface TimelineEvent {
  at: string;
  label: string;
}

export interface Application {
  id: string;
  leadId: string;
  studentName: string;
  phone: string;
  collegeId: string;
  collegeName: string;
  program: string;
  scholarshipApplied: number;
  stage: ApplicationStage;
  docs: ApplicationDoc[];
  notes: string;
  agent: string;
  startedAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  intentLevel: IntentLevel;
  scoreBand?: ScoreBand;
  scholarshipUnlocked: number;
  lookingFor: string;
  targetCollege: string;
  status: LeadStatus;
  callConnected: boolean;
  source: LeadSource;
  createdAt: string;
  agent: string;
  callStatus?: CallStatus;
  interestStatus?: InterestStatus;
  nextAction?: NextAction;
  lastCalledAt?: string;
  nextFollowUpAt?: string;
  remarks?: Remark[];
  intentScore?: number;
  intentReasons?: string[];
  systemIntentLevel?: IntentLevel;
  systemIntentScore?: number;
  intentOverride?: boolean;
  intentOverrideReason?: string;
  intentUpdatedBy?: string;
  intentUpdatedAt?: string;
  rawDataId?: string;
  questionnaire?: StudentQuestionnaire;
  paymentStatus?: "Not Required" | "Pending" | "Paid";
  leadType: LeadType;
  scholarshipApplied: boolean;
}

export interface WebsiteVisitLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  collegeId: string;
  collegeName: string;
  program: string;
  admissionTimeline: string;
  createdAt: string;
}

export interface NewWebsiteVisitInput {
  name: string;
  phone: string;
  email?: string;
  collegeId: string;
  collegeName: string;
  program: string;
  admissionTimeline: string;
}

export interface NewLeadInput {
  name: string;
  phone: string;
  email?: string;
  stream: Stream;
  scoreBand: ScoreBand;
  targetCollege: string;
  lookingFor: string;
  source: LeadSource;
}

export interface CollegeProgram {
  name: string;
  stream: Stream;
  durationYears: number;
  annualFee: number;
  totalFee: number;
  avgPlacement: number;
  eligibility: string;
  intakes: string[];
  seats: number;
}

export interface CampusReel {
  id: string;
  title: string;
  duration: string;
  from: string;
  to: string;
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  city: string;
  established: number;
  rating: number;
  type: "Private" | "Government";
  about: string;
  tags: string[];
  accreditation: string[];
  ranking: string;
  admissions: {
    exam: string;
    applicationFee: number;
    deadline: string;
    minGPA: string;
    notes?: string;
  };
  costs: {
    hostelMonthly: number;
    livingMonthly: number;
  };
  scholarships: {
    available: boolean;
    details: string;
    budget?: number;
  };
  programs: CollegeProgram[];
  placementPct: number;
  highestPlacement: number;
  intake: number;
  facilities: string[];
  reels: CampusReel[];
  coverImage?: string;
  photos?: string[];
  videoLinks?: string[];
  campusVideos?: { title: string; youtubeUrl: string; thumbnailUrl?: string; category?: string; duration?: string; order?: number }[];
  sourceWebsite?: string;
  partnerCollege?: boolean;
  isPublished?: boolean;
  feesTbc?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  avatarColor: string;
  leadsAssigned: number;
  callsMade: number;
  callsConnected: number;
  conversions: number;
}

export interface Enquiry {
  id: string;
  leadId?: string;
  createdAt: string;
  converted: boolean;
  source: string;
}

export interface Voucher {
  id: string;
  code: string;
  studentName: string;
  phone: string;
  college: string;
  program: string;
  amount: number;
  issuedAt: string;
  expiresAt: string;
  status: "Active" | "Claimed" | "Expiring" | "Expired";
  primaryCollege: string;
  stream: string;
  perCollegeBreakdown: { collegeId: string; collegeName: string; amount: number }[];
}

export interface StudentProfile {
  name: string;
  phone: string;
  email: string;
  city: string;
  scoreBand: string;
  stream: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "student";
  city?: string;
  state?: string;
  createdAt: string;
}

export interface StudentQuestionnaire {
  qualification?: string;
  class10Score?: string;
  class12Score?: string;
  graduationScore?: string;
  scoreBand?: string;
  stream?: string;
  preferredProgram?: string;
  specialization?: string;
  careerGoal?: string;
  entranceExam?: string;
  entranceScore?: string;
  admissionTimeline?: string;
  preferredStates?: string[];
  preferredCities?: string[];
  budgetRange?: string;
  loanRequired?: boolean;
  hostelRequired?: boolean;
  scholarshipPriority?: string;
  preferredContactTime?: string;
  preferredContactMethod?: "Phone" | "WhatsApp" | "Email";
  completedAt?: string;
}

export type PaymentStatus = "Initiated" | "Pending" | "Paid" | "Failed" | "Cancelled" | "Refunded";

export interface ScholarshipPayment {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  phone: string;
  amount: number;
  currency: string;
  purpose: string;
  status: PaymentStatus;
  isDemo: boolean;
  questionnaireCompleted: boolean;
  scholarshipUnlocked: boolean;
  consultationEligible: boolean;
  leadId?: string;
  assignedAgent?: string;
  collegeIds: string[];
  primaryCollegeId?: string;
  createdAt: string;
  paidAt?: string;
  failureReason?: string;
}
