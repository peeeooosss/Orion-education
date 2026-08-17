# ORION EDUCATION - Platform Architecture (Demo)

> **Note:** Frontend prototype build. Powered by AURA AI infrastructure.

## 📌 Project Overview
A high-conversion frontend prototype for **Orion Education**. The goal is to build an "intent-generation machine" that increases student admission conversion rates from **1.5% to 4%**. 

Instead of a standard directory, Orion Education uses gamification (Scholarship Checker) and psychological triggers (ROI Calculators) to pre-sell the student, while routing highly qualified, structured data to a custom Agent CRM.

---

## 🛠 Tech Stack (Frontend-Only Demo)
*   **Framework:** Next.js (App Router recommended for rapid layout creation)
*   **Styling:** Tailwind CSS + Shadcn UI (for quick, accessible components)
*   **Animations:** Framer Motion (crucial for the Scholarship Checker loading effects)
*   **State Management:** Zustand (to simulate a database; allows data to pass from Student Portal to Agent Portal in real-time)
*   **Icons & Charts:** Lucide React (icons), Recharts (Admin dashboard visualizations)

---

## 📂 Architecture & Routing Structure

The application is divided into three distinct zones.

### 1. Student Zone (The Conversion Engine)
*   `app/page.tsx` **(Homepage):** 
    *   Hero section with quick-search.
    *   **Core USP:** The Orion Scholarship Checker (Assured scholarship generator).
*   `app/college/[id]/page.tsx` **(College Detail Page):** 
    *   ROI Calculator (Fee vs. Placement).
    *   Campus Reels/Video section.
    *   Sticky "Smart Enquiry / Claim Scholarship" CTA.
*   `app/student/dashboard/page.tsx` **(Student Profile):** 
    *   Shows claimed scholarship vouchers.
    *   Application progress tracking.

### 2. Agent Zone (Reference: `Desktop/UniLinkAi`)
> **Crucial Dev Note:** Take heavy reference from the local codebase at `Desktop/UniLinkAi` on the Mac. While `UniLinkAi` is a standard CRM and *not* specifically a Telecaller CRM, you should extract and reuse as much of its foundation as possible (sidebars, navbars, data tables, modal structures, and theme) to save time, then adapt the views for telecalling.

*   `app/agent/dashboard/page.tsx` **(Telecaller CRM):** 
    *   Kanban board or Data Table of incoming leads (Repurposed from UniLinkAi tables).
    *   Global state listener: Immediately updates when a student submits the Smart Enquiry form.
    *   **Lead Detail Modal:** Displays unlocked scholarship amount, specific student intent, and an AI-generated opening script.
    *   **Telecaller Quick-Actions:** Add features missing from UniLinkAi, such as "Call Connected" checkboxes, quick-status dropdowns, and WhatsApp integration buttons.

### 3. Admin Zone
*   `app/admin/dashboard/page.tsx` **(Master Overview):** 
    *   Total Enquiries vs. Conversions (Mock Charts).
    *   Scholarship budget tracking & Agent performance.

---

## 🧠 Global State & Mock Data Strategy (Zustand)

Since this is a demo without a backend database, we will use Zustand to hold the mock data in memory. This ensures the demo feels "alive" during the client presentation.

### Mock Data Schema (`store/useAppStore.ts`)
```typescript
import { create } from 'zustand'

type Lead = {
  id: string;
  name: string;
  phone: string;
  intentLevel: 'Hot' | 'Warm' | 'Cold';
  scholarshipUnlocked: number;
  lookingFor: string;
  targetCollege: string;
  status: 'New' | 'Contacted' | 'Application Started';
}

interface AppState {
  leads: Lead[];
  addLead: (lead: Lead) => void;
  updateLeadStatus: (id: string, status: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  leads: [
    {
      id: '1',
      name: 'Rohan Desai',
      phone: '+91 9876543210',
      intentLevel: 'Hot',
      scholarshipUnlocked: 25000,
      lookingFor: 'Admission Process & Loan',
      targetCollege: 'RV College of Engineering',
      status: 'New'
    }
  ],
  addLead: (lead) => set((state) => ({ leads: [lead, ...state.leads] })),
  updateLeadStatus: (id, newStatus) => set((state) => ({
    leads: state.leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead)
  }))
}))


🚀 Development Action Plan
Phase 1: Foundation & Layouts
[ ] Initialize Next.js project with Tailwind CSS.
[ ] Set up Zustand store with mockData for colleges and leads.
[ ] Salvage from UniLinkAi: Port the structural layouts (Sidebars, Navbars, Table wrappers) from Desktop/UniLinkAi into the /agent and /admin routes.
[ ] Modify the salvaged UI to accommodate telecaller-specific layouts (e.g., leaving space for a dialer pad or quick-action call buttons).
Phase 2: The Core USP - Orion Scholarship Checker
[ ] Build the Homepage Hero Section.
[ ] Create the <ScholarshipChecker /> component.
[ ] Integrate Framer Motion for a 3-second fake loading state ("Analyzing Academic Records..." -> "Generating Grant...").
[ ] Render the "Provisional Scholarship Certificate" success state.
Phase 3: College Detail & Smart Enquiry
[ ] Build /college/[id] static layout with dummy data.
[ ] Implement the ROI Calculator visual meter.
[ ] Build the Smart Enquiry Modal (Multi-step progressive form):
Step 1: Intent (Just exploring vs. Ready to apply).
Step 2: Primary roadblock (Fees, Placements, Process).
Step 3: Contact Details.
[ ] Connect the submit button to useAppStore.addLead().
Phase 4: Agent CRM & Demo Wiring
[ ] Build the Agent Dashboard lead table mapping over useAppStore.leads (using the table UI components from UniLinkAi).
[ ] Create the "Lead Detail View" showing the context tags and suggested agent script.
[ ] Test the full demo flow: Submit frontend enquiry -> Instantly appear in Agent CRM -> Agent updates status.