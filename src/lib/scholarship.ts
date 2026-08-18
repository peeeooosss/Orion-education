export type Stream =
  | "Engineering"
  | "MBA"
  | "Commerce"
  | "Design"
  | "Law"
  | "Medical";

export type ScoreBand = "90+" | "75-90" | "60-75" | "Below 60";

export type IntentLevel = "Hot" | "Warm" | "Cold";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Application Started"
  | "Offer Received"
  | "Admitted";

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Application Started",
  "Offer Received",
  "Admitted",
];

export const PIPELINE_INDEX: Record<LeadStatus, number> = {
  New: 0,
  Contacted: 1,
  "Application Started": 2,
  "Offer Received": 3,
  Admitted: 4,
};

export function isConverted(status: LeadStatus): boolean {
  return PIPELINE_INDEX[status] >= 2;
}

const BASE_SCHOLARSHIP: Record<Stream, number> = {
  Engineering: 25000,
  MBA: 40000,
  Commerce: 15000,
  Design: 18000,
  Law: 20000,
  Medical: 30000,
};

const SCORE_MULTIPLIER: Record<ScoreBand, number> = {
  "90+": 1.5,
  "75-90": 1.2,
  "60-75": 1.0,
  "Below 60": 0.8,
};

export function computeScholarship(input: {
  stream: Stream;
  scoreBand: ScoreBand;
  collegeRating: number;
}): number {
  const base = BASE_SCHOLARSHIP[input.stream] ?? 15000;
  const scoreFactor = SCORE_MULTIPLIER[input.scoreBand] ?? 1;
  const prestigeFactor = input.collegeRating >= 4.5 ? 1.2 : 1;
  const raw = base * scoreFactor * prestigeFactor;
  return Math.round(raw / 500) * 500;
}

export function estimateFromProfile(
  profile: { stream: string; scoreBand: string },
  collegeRating: number
): number {
  const stream = (profile.stream as Stream) || "Engineering";
  const scoreBand = (profile.scoreBand as ScoreBand) || "75-90";
  return computeScholarship({ stream, scoreBand, collegeRating });
}

export function computeIntentLevel(input: {
  scoreBand: ScoreBand;
  scholarship: number;
}): IntentLevel {
  const scoreFactor = SCORE_MULTIPLIER[input.scoreBand] ?? 1;
  if (scoreFactor >= 1.2 && input.scholarship >= 30000) return "Hot";
  if (scoreFactor >= 1) return "Warm";
  return "Cold";
}

export function computeIntentScore(input: {
  scoreBand: ScoreBand;
  scholarship: number;
  callStatus?: string;
  interestStatus?: string;
  nextAction?: string;
}): { score: number; level: IntentLevel; reasons: string[] } {
  const reasons: string[] = [];
  let score = input.scoreBand === "90+" ? 20 : input.scoreBand === "75-90" ? 15 : input.scoreBand === "60-75" ? 8 : 0;
  if (score > 0) reasons.push(`${input.scoreBand} academic profile`);
  if (input.scholarship >= 50000) {
    score += 15;
    reasons.push("high scholarship value");
  } else if (input.scholarship >= 30000) {
    score += 10;
    reasons.push("scholarship unlocked");
  }
  if (input.callStatus === "Connected") {
    score += 10;
    reasons.push("call connected");
  }
  if (input.interestStatus === "Interested") {
    score += 15;
    reasons.push("student expressed interest");
  }
  if (input.interestStatus === "Qualified") {
    score += 25;
    reasons.push("student qualified by agent");
  }
  if (input.interestStatus === "Parent Discussion") score += 5;
  if (input.interestStatus === "Not Interested") {
    score -= 30;
    reasons.push("student is not interested");
  }
  if (input.nextAction === "Start Application") {
    score += 15;
    reasons.push("application action selected");
  }
  const bounded = Math.max(0, Math.min(100, score));
  return { score: bounded, level: bounded >= 70 ? "Hot" : bounded >= 40 ? "Warm" : "Cold", reasons };
}

const SCRIPT_OPENERS = [
  "You just unlocked a scholarship on our site — let's not let it expire.",
  "I'm calling about the assured scholarship you checked with us today.",
  "Your Orion scholarship voucher is ready, and I wanted to walk you through the next step.",
];

const ENQUIRY_OPENERS = [
  "I saw you requested free counselling on our site — I'm here to help.",
  "Thanks for your enquiry with Orion — I've got everything you need to shortlist.",
  "I'm calling about your enquiry — happy to walk you through fees and placements.",
];

const SCRIPT_CLOSERS = [
  "Should I block 15 minutes tomorrow to lock in this amount?",
  "I can reserve this scholarship amount for 48 hours — shall I?",
  "Want me to send the full breakdown on WhatsApp?",
];

export function generateOpeningScript(lead: {
  name: string;
  scholarshipUnlocked: number;
  targetCollege: string;
  lookingFor: string;
  agentName?: string;
  scholarshipApplied?: boolean;
}): string {
  const opener = (lead.scholarshipApplied ? SCRIPT_OPENERS : ENQUIRY_OPENERS)[Math.floor(Math.random() * (lead.scholarshipApplied ? SCRIPT_OPENERS : ENQUIRY_OPENERS).length)];
  const closer = SCRIPT_CLOSERS[Math.floor(Math.random() * SCRIPT_CLOSERS.length)];
  if (lead.scholarshipApplied) {
    return `"Hi ${lead.name}, this is ${lead.agentName ?? "Rohit"} from Orion Education. ${opener} You've unlocked ₹${lead.scholarshipUnlocked.toLocaleString("en-IN")} towards ${lead.targetCollege}. I saw you're interested in ${lead.lookingFor.toLowerCase()}. ${closer}"`;
  }
  return `"Hi ${lead.name}, this is ${lead.agentName ?? "Rohit"} from Orion Education. ${opener} I saw you're interested in ${lead.lookingFor.toLowerCase()} at ${lead.targetCollege}. I can also check if you're eligible for an assured scholarship of up to ₹60,000 — shall I? ${closer}"`;
}

export const STREAM_OPTIONS: { value: Stream; label: string; emoji: string }[] = [
  { value: "Engineering", label: "Engineering", emoji: "🛠️" },
  { value: "MBA", label: "MBA / Business", emoji: "💼" },
  { value: "Commerce", label: "Commerce / B.Com", emoji: "🧮" },
  { value: "Design", label: "Design / Creative", emoji: "🎨" },
  { value: "Law", label: "Law", emoji: "⚖️" },
  { value: "Medical", label: "Medical / Health", emoji: "🩺" },
];

export const SCORE_OPTIONS: { value: ScoreBand; label: string; hint: string }[] = [
  { value: "90+", label: "90% & above", hint: "Top of the class" },
  { value: "75-90", label: "75% – 90%", hint: "Strong performer" },
  { value: "60-75", label: "60% – 75%", hint: "Steady" },
  { value: "Below 60", label: "Below 60%", hint: "Needs guidance" },
];
