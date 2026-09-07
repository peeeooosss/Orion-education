import type { Lead } from "@/store/types";

export interface WhatsAppTemplate {
  id: string;
  label: string;
  category: "First Touch" | "Scholarship" | "Follow-up" | "Application" | "Success";
  build: (lead: Lead, agentName: string) => string;
}

function shareLine(lead: Lead): string {
  const amount = `₹${lead.scholarshipUnlocked.toLocaleString("en-IN")}`;
  return lead.scholarshipApplied
    ? `I can see you've unlocked ${amount} in scholarship towards ${lead.targetCollege}.`
    : `You're eligible for up to ${amount} in scholarship towards ${lead.targetCollege}.`;
}

function askLine(lead: Lead): string {
  return lead.lookingFor ? `Shall I help you with ${lead.lookingFor.toLowerCase()}?` : "Shall I help you with the admission process?";
}

export const WHATSAPP_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: "first-touch",
    label: "First touch — enquiry",
    category: "First Touch",
    build: (lead, agentName) =>
      `Hi ${lead.name}! 👋 This is ${agentName} from Orion Education. You enquired with us about ${lead.targetCollege}. ${shareLine(lead)} ${askLine(lead)}`,
  },
  {
    id: "scholarship-unlocked",
    label: "Scholarship unlocked",
    category: "Scholarship",
    build: (lead, agentName) =>
      `Hi ${lead.name}! ${agentName} here from Orion Education. Great news — ${shareLine(lead)} This is assured and valid for 48 hours. Let's finalise your application while it lasts. 🎯`,
  },
  {
    id: "send-college-details",
    label: "Send college details / brochure",
    category: "Follow-up",
    build: (lead, agentName) =>
      `Hi ${lead.name}! ${agentName} from Orion Education. Here's everything you asked about ${lead.targetCollege} — fee structure, placements and eligibility. ${askLine(lead)}`,
  },
  {
    id: "send-scholarship-details",
    label: "Send scholarship details",
    category: "Scholarship",
    build: (lead, agentName) =>
      `Hi ${lead.name}! ${agentName} here. ${shareLine(lead)} I'll send the full scholarship breakdown and how to claim it. Shall we proceed?`,
  },
  {
    id: "follow-up-nudge",
    label: "Follow-up nudge",
    category: "Follow-up",
    build: (lead, agentName) =>
      `Hi ${lead.name}! ${agentName} from Orion Education checking in. We spoke earlier about ${lead.targetCollege} — I wanted to see if you had any questions. ${askLine(lead)}`,
  },
  {
    id: "request-documents",
    label: "Request application documents",
    category: "Application",
    build: (lead, agentName) =>
      `Hi ${lead.name}! ${agentName} from Orion Education. Your application for ${lead.targetCollege} is ready to move forward. Please share your Class 10 & 12 marksheets and ID proof so we can submit it. 📄`,
  },
  {
    id: "application-submitted",
    label: "Application submitted",
    category: "Application",
    build: (lead, agentName) =>
      `Hi ${lead.name}! 🎉 Your application has been submitted. ${agentName} will keep you posted on the next steps from ${lead.targetCollege}. Let me know if you need anything!`,
  },
  {
    id: "offer-received",
    label: "Offer received",
    category: "Success",
    build: (lead, agentName) =>
      `Hi ${lead.name}! 🎊 Congratulations — you've received an offer from ${lead.targetCollege}! ${agentName} from Orion Education is here to help you accept it and plan your next steps.`,
  },
  {
    id: "study-abroad-intro",
    label: "Study abroad intro",
    category: "First Touch",
    build: (lead, agentName) =>
      `Hi ${lead.name}! ${agentName} from Orion Education. I see you're exploring ${lead.lookingFor}. ${shareLine(lead)} Let's discuss universities, deadlines and the full process. 📚`,
  },
  {
    id: "imported-outreach",
    label: "Imported student outreach",
    category: "First Touch",
    build: (lead, agentName) =>
      `Hi ${lead.name}! ${agentName} from Orion Education. You have a college preference on file (${lead.targetCollege}). ${shareLine(lead)} ${askLine(lead)}`,
  },
];

export function getWhatsAppTemplate(id: string): WhatsAppTemplate | undefined {
  return WHATSAPP_TEMPLATES.find((t) => t.id === id);
}

export function buildWhatsApp(id: string, lead: Lead, agentName: string): string {
  return getWhatsAppTemplate(id)?.build(lead, agentName) ?? WHATSAPP_TEMPLATES[0].build(lead, agentName);
}