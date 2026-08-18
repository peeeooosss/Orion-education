# Orion Education — Project Memory

## Stack
- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **State**: Zustand (`src/store/useAppStore.ts`)
- **UI**: shadcn/ui, Framer Motion, Recharts, canvas-confetti
- **Dev server**: `npm run dev` on port 5555 (via `nohup`)
- **Build**: `npm run lint` → `npm run typecheck` → `npm run build`
- **22 routes** total, all pass lint/typecheck/build

---

## Deployment

### GitHub
- Repo: `peeeooosss/Orion-education` (public, `main` branch)

### Vercel
- Team: `aura-ai14`, project: `orion`
- URL: `https://orion-nine-eta.vercel.app`
- Auto-deploy NOT linked (user manages manually)

### Netlify (legacy, fully removed)
- Was `orion-890.netlify.app` — all Netlify config deleted

---

## Architecture Notes

- **No env vars** — pure frontend demo, no `process.env` usage
- **Hero backgrounds**: Unsplash hotlink URLs with gradient fallback (`images.remotePatterns` in `next.config.ts`)
- **Demo student**: `demo.student@orion.education` / `Demo@1234`, phone `+91 90000 00000`
- **Enquiry form**: de-gated (no sign-in/questionnaire required)
- **Admin website leads**: dedicated `/admin/website-leads` page
- **Scholarship checker price**: **₹99** (standardized everywhere)

---

## Scholarship Flow (Current)

### Student journey
1. `/scholarship` → `ScholarshipUnlockChecker`
2. **Auth gate** → sign in / sign up
3. **4-step questionnaire** (Education → Goals → Location & Budget → Preferences)
4. **Pick #1 college** — grid of all partner colleges with real per-college amounts via `computeScholarship()`. Highest-value pre-selected. "Your scholarship is valid at all partner colleges."
5. **Checkout** — shows primary pick, ₹99 line items, "Pay ₹99 (Demo)"
6. **Result** — "valid at all partner colleges" + highlighted breakdown table with per-college amounts

### What happens on payment
1. `completePayment(paymentId)` — marks payment Paid
2. `createDemoLeadFromPayment(paymentId, questionnaire)` — creates lead with `targetCollege` = primary college
3. `claimVoucher(lead, { perCollegeBreakdown, primaryCollege, stream })` — creates scholarship certificate with 6-month expiry

### Scholarship computation
- `computeScholarship({ stream, scoreBand, collegeRating })` in `src/lib/scholarship.ts`
- Base amounts: Engineering ₹25k, MBA ₹40k, Commerce ₹15k, Design ₹18k, Law ₹20k, Medical ₹30k
- Score multipliers: 90+ → 1.5x, 75-90 → 1.2x, 60-75 → 1.0x, Below 60 → 0.8x
- Prestige: rating ≥ 4.5 → 1.2x

---

## Voucher / Certificate System

### Voucher type (`src/store/types.ts`)
```typescript
interface Voucher {
  id, code, studentName, phone, college, program, amount,
  issuedAt, expiresAt,  // 6-month validity
  status: "Active" | "Claimed" | "Expiring" | "Expired",
  primaryCollege, stream,
  perCollegeBreakdown: { collegeId, collegeName, amount }[]
}
```

### Certificate card (student dashboard + `/student/vouchers`)
- Header: "Scholarship Certificate" + unique code
- Hero: large amount, "Valid until [month year]", days left
- Per-college breakdown: all partner colleges with amounts, primary highlighted as "Your #1"
- Footer: stream, link to full certificate

### Seed data
- 1 voucher for demo student (`+91 90000 00000`), RVCE, ₹48k, Active, 6-month expiry

---

## Lead Taxonomy

### Lead type fields
- `leadType: "scholarship" | "enquiry" | "raw"`
- `scholarshipApplied: boolean`
- `targetCollege` = primary college from payment

### Agent portal (`/agent/dashboard`)
- LeadsBoard: Type badge, Scholarship column (✓ Applied / "Push to scholarship"), filter tabs (All/Scholarship/Enquiry/Raw)
- LeadDetailModal: branches script/WA text on `scholarshipApplied`, has "Mark scholarship applied" button

### Call scripts (`src/lib/scholarship.ts`)
- `generateOpeningScript()` branches on `scholarshipApplied`:
  - Scholarship: "You just unlocked a scholarship…"
  - Enquiry: "I saw you requested free counselling…"

---

## Admin Pages

| Route | Purpose |
|-------|---------|
| `/admin/dashboard` | Summary cards including website leads |
| `/admin/payments` | ₹99 scholarship payments list/detail |
| `/admin/website-leads` | Dedicated website visit leads page |
| `/admin/budgets` | College scholarship budget management |
| `/admin/raw-data` | Raw student data import |

---

## Key Files

| File | Purpose |
|------|---------|
| `src/store/types.ts` | All types: Lead, Voucher, ScholarshipPayment, College, etc. |
| `src/store/useAppStore.ts` | Zustand store: auth, payments, leads, vouchers, claims |
| `src/store/seed.ts` | Seed data: colleges, leads, agents, vouchers |
| `src/lib/scholarship.ts` | `computeScholarship`, `computeIntentScore`, `generateOpeningScript` |
| `src/components/scholarship/ScholarshipUnlockChecker.tsx` | Main scholarship flow (auth → questionnaire → college-select → checkout → result) |
| `src/components/scholarship/StudentQuestionnaire.tsx` | 4-step questionnaire |
| `src/components/college/EnquirySidebar.tsx` | Sticky right enquiry form |
| `src/components/college/ProgramFacts.tsx` | Fees/placements (replaced ROI Calculator) |
| `src/components/college/VisitWebsiteModal.tsx` | Visit Website gate form |
| `src/components/agent/LeadsBoard.tsx` | Agent leads with type filters |
| `src/components/agent/LeadDetailModal.tsx` | Lead detail with scholarship branching |
| `src/components/homepage/HeroSection.tsx` | Unsplash backgrounds + auto-rotating slider |
| `src/components/homepage/TestimonialStrip.tsx` | Marquee testimonials |
| `src/app/student/dashboard/page.tsx` | Student portal with certificate card |
| `src/app/student/vouchers/page.tsx` | Certificate cards with per-college breakdown |
| `src/app/admin/website-leads/page.tsx` | Admin website leads page |
| `src/components/layout/SiteHeader.tsx` | "ROI" → "Fees & Placements" nav link |
| `src/components/layout/AdminSidebar.tsx` | Website Leads nav item |
| `src/app/globals.css` | `@keyframes marquee` for testimonials |
| `next.config.ts` | `images.remotePatterns` for Unsplash |

---

## Completed Features (All 8 Client Requirements + Scholarship Revamp)

1. **Hero photos + slider** — Unsplash backgrounds, AnimatePresence crossfade, auto-rotating captions, dot indicators, TestimonialStrip marquee
2. **ROI Calculator removed** → replaced with ProgramFacts (fees, placement %, avg/highest package, eligibility, seats)
3. **Lead taxonomy** — `leadType`, `scholarshipApplied` on Lead; `WebsiteVisitLead` + `addWebsiteVisitLead()` + `markScholarshipApplied()`
4. **Agent portal** — LeadsBoard with Type badge, Scholarship column, filter tabs; LeadDetailModal branches script/WA on scholarshipApplied
5. **Right-side enquiry form** — `EnquirySidebar.tsx` (sticky right column), `SmartEnquiryModal.tsx` de-gated
6. **Visit Website gate** — `VisitWebsiteModal.tsx` (name/phone/program/timeline → save → redirect), "Visit official website" button in hero + sticky bottom bar
7. **Scholarship checker revamp** — one ₹99 check = valid at all partner colleges + primary college pick
8. **Scholarship certificate** — auto-created on payment, 6-month expiry, per-college breakdown, certificate card UI

---

## Pending / Follow-ups

1. Persist auth session across refresh (currently in-memory only, resets on page reload)
2. Remove unused `ScholarshipChecker.tsx` (old duplicate, no longer rendered)
3. Consider whether Netlify name `orion` matters (taken as `orion-890`)
4. Vercel auto-deploy linking (user said they'd connect manually)

---

## Verification Command
```bash
npm run lint && npm run typecheck && npm run build
```
All must pass clean before any commit/deploy.
