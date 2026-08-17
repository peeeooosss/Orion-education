import {
  BadgePercent,
  FileText,
  GraduationCap,
  PhoneCall,
  Scale,
  Search,
  Send,
  TicketPercent,
} from "lucide-react";

export interface JourneyStep {
  n: number;
  icon: typeof Search;
  title: string;
  tagline: string;
  student: string[];
  orion: string[];
  cta: { label: string; href: string };
}

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    n: 1,
    icon: Search,
    title: "Discover the right colleges",
    tagline: "Search, filter and shortlist",
    student: [
      "Search by college, stream or city from the finder.",
      "Filter by stream, city, entrance exam — sort by fee, rating or placement.",
      "Open college profiles for verified facts: NIRF ranking, accreditation, fees and programs.",
    ],
    orion: [
      "Every number is verified — NIRF / NAAC rankings and real placement data, not brochure claims.",
      "One search drives the whole shortlist, so you never start from a blank page.",
    ],
    cta: { label: "Explore the finder", href: "/#colleges" },
  },
  {
    n: 2,
    icon: Scale,
    title: "Compare & shortlist",
    tagline: "Weigh fees, packages and ROI",
    student: [
      "Compare fees, packages, seats and eligibility side by side.",
      "Run the ROI calculator on any college to see the real return.",
      "Trim the list to 2–3 colleges you actually like.",
    ],
    orion: [
      "Side-by-side comparison and an ROI model help you decide with numbers.",
      "Campus reels and facilities give you the on-ground feel before you call.",
    ],
    cta: { label: "Compare colleges", href: "/#colleges" },
  },
  {
    n: 3,
    icon: BadgePercent,
    title: "Check your scholarship eligibility",
    tagline: "Get a number in 30 seconds",
    student: [
      "Answer three quick questions — name, stream and score band.",
      "Get an instant, eligibility-backed scholarship amount.",
      "Pick a target college and unlock the estimate for it.",
    ],
    orion: [
      "The eligibility engine scores your profile and locks an amount.",
      "It also computes your intent level, so the right counsellor picks you up.",
    ],
    cta: { label: "Check eligibility", href: "/scholarship" },
  },
  {
    n: 4,
    icon: Send,
    title: "Send one enquiry",
    tagline: "Your intent reaches a human",
    student: [
      "Submit a smart enquiry for your target college.",
      "Add what you need help with — admission, loan, hostel, campus.",
      "Keep your phone handy — someone calls you back.",
    ],
    orion: [
      "Your enquiry pings the agent CRM in real time — no forms lost in a queue.",
      "A telecaller instantly sees your profile, opening script and a 48-hour voucher.",
    ],
    cta: { label: "Try a Smart Enquiry", href: "/college/rvce" },
  },
  {
    n: 5,
    icon: PhoneCall,
    title: "Talk to a counsellor",
    tagline: "A real person closes the loop",
    student: [
      "A counsellor calls back within minutes to finalise your shortlist.",
      "Ask anything — fees, scholarships, hostels, placements, next steps.",
      "Agree on which college and program to apply to.",
    ],
    orion: [
      "Agents track every lead in the pipeline; your status moves to Contacted the moment they reach out.",
      "The counsellor already has your intent and scholarship amount on screen.",
    ],
    cta: { label: "See the agent portal", href: "/agent/dashboard" },
  },
  {
    n: 6,
    icon: FileText,
    title: "Start your application",
    tagline: "Application + docs, tracked",
    student: [
      "Your counsellor starts the application — college, program and scholarship.",
      "Upload the 7 required documents on the checklist.",
      "Watch progress update in real time.",
    ],
    orion: [
      "Orion creates a 7-document checklist and a timeline for every application.",
      "Your scholarship is auto-applied, and the agent tracks docs, notes and stages.",
    ],
    cta: { label: "See applications", href: "/agent/applications" },
  },
  {
    n: 7,
    icon: TicketPercent,
    title: "Offer received",
    tagline: "The college says yes",
    student: [
      "Your offer letter arrives from the college.",
      "Review fees, scholarship credit and deposit timelines.",
      "Keep everything tracked in one place.",
    ],
    orion: [
      "Your status updates in sync across the student portal, agent and admin views.",
      "No chasing — the offer is logged the moment it's received.",
    ],
    cta: { label: "Track in your portal", href: "/student/dashboard" },
  },
  {
    n: 8,
    icon: GraduationCap,
    title: "Get admitted",
    tagline: "Seat confirmed, scholarship locked",
    student: [
      "Confirm your seat and pay the deposit.",
      "Your scholarship is locked in against your fees.",
      "Welcome to campus — onboarding begins.",
    ],
    orion: [
      "Admission is recorded end-to-end and admin sees the conversion in pipeline health.",
      "Your journey becomes part of the numbers that keep Orion accountable.",
    ],
    cta: { label: "See the admin overview", href: "/admin/dashboard" },
  },
];
