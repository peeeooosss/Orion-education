# Orion Education — Project Memory

## Stack
- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **State**: Zustand (`src/store/useAppStore.ts`) for client UI/demo state
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Auth**: HTTP-only JWT session cookie (`orion-session`) using `AUTH_SECRET`
- **UI**: shadcn/ui, Framer Motion, Recharts, canvas-confetti
- **Dev server**: `npm run dev` on port 5555
- **Build**: `npm run lint` → `npm run typecheck` → `npm run build`
- **Current verification**: typecheck and production build pass

---

## Deployment

### GitHub
- Repo: `peeeooosss/Orion-education` (public, `main` branch)

### Vercel
- Team: `aura-ai14`, project: `orion`
- URL: `https://orion-nine-eta.vercel.app`
- GitHub `main` pushes trigger Vercel deployments

### Netlify (legacy, fully removed)
- Was `orion-890.netlify.app` — all Netlify config deleted

---

## Architecture Notes

- **Environment**: `DATABASE_URL` and `AUTH_SECRET` are required in local/Vercel environments. Never commit secrets.
- **Hero backgrounds**: Local images at `public/images/hero/slide1.jpg`, `slide2.jpg`, and `slide3.jpg`.
- **Authentication**: One login page at `/auth/sign-in`; role-based redirect to student, agent, or admin portal.
- **Route protection**: `middleware.ts` protects `/admin` and `/agent`; `/admin` redirects to `/admin/dashboard`.
- **Account switching**: Existing sessions may visit `/auth/sign-in`; the SiteHeader includes Switch account and Sign Out.
- **Enquiry forms**: Public visitors can submit enquiries without signing in. Leads are persisted through `POST /api/leads`.
- **Admin website leads**: Dedicated `/admin/website-leads` page backed by PostgreSQL through `/api/website-leads`.
- **Scholarship checker price**: **₹99** (standardized everywhere).

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

### Public lead persistence
- `POST /api/leads` is public for `College Enquiry` and `Scholarship Checker` submissions.
- The endpoint finds or creates a contact, assigns an active agent, creates a database lead, increments `agents.leadsAssigned`, logs an activity, and creates the first follow-up.
- Agent leads are read from PostgreSQL by `GET /api/leads`; local Zustand-only leads are not sufficient for agent visibility.
- Global landing-page enquiries use `leadType: "enquiry"` and `source: "College Enquiry"`.

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
| `/admin/colleges` | College and program management |
| `/admin/agents` | Agent management and agent analytics |

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
| `src/components/homepage/GlobalEnquiryWidget.tsx` | Floating circular Free Enquiry control on landing page |
| `src/components/homepage/GlobalEnquiryModal.tsx` | Global enquiry form with college and program dropdowns |
| `src/components/homepage/TestimonialStrip.tsx` | Marquee testimonials |
| `src/app/student/dashboard/page.tsx` | Student portal with certificate card |
| `src/app/student/vouchers/page.tsx` | Certificate cards with per-college breakdown |
| `src/app/admin/website-leads/page.tsx` | Admin website leads page |
| `src/components/layout/SiteHeader.tsx` | "ROI" → "Fees & Placements" nav link |
| `src/components/layout/AdminSidebar.tsx` | Website Leads nav item |
| `src/app/api/leads/route.ts` | Agent lead GET/PATCH plus public lead POST |
| `src/app/api/website-leads/route.ts` | Public website-visit POST and admin-only GET |
| `src/server/db/schema.ts` | PostgreSQL/Drizzle schema including `website_leads`, `campus_videos`, `partner_profile` |
| `scripts/create-tables.ts` | Idempotent database table creation |
| `src/app/globals.css` | `@keyframes marquee` for testimonials |
| `next.config.ts` | `images.remotePatterns` for Unsplash |
| `src/data/college-directory.ts` | 82 static directory colleges + scholarship-cap logic |
| `src/data/partner-profiles.ts` | 27 researched partner profiles (logos, heroes, links) |
| `src/components/college/CollegeCover.tsx` | Shiksha-style detail-page cover (photo, logo, name below) |
| `src/components/college/CollegeLogo.tsx` | Safe img wrapper with onDark + onError fallback |
| `src/components/college/CampusReels.tsx` | YouTube embed grid with category filter tabs |
| `src/components/college/DirectoryCollegeDetail.tsx` | Static detail page with DB overlay fetch |
| `src/components/homepage/CollegeGrid.tsx` | Homepage card grid — hero photo 16:9, name below image |
| `src/app/admin/colleges/page.tsx` | Admin college CRUD UI (~1250 lines) with partner-profile + video managers |
| `src/app/api/admin/colleges/route.ts` | Admin college API (GET/POST/PUT/DELETE with cascade) |
| `src/app/api/colleges/[id]/route.ts` | Public single-college GET for overlay |
| `scripts/seed-static-colleges.ts` | Idempotent seed: 82 colleges + 111 programs + partner profiles |

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

### Latest completed work
9. **Single circular Free Enquiry widget** — desktop right-side and mobile bottom-right controls open the global enquiry modal.
10. **Counsellor avatar widget** — replaced the sparkle-only icon with a user avatar plus headphones badge and small `Free Enquiry` label.
11. **Global enquiry form** — landing page form loads published colleges from `/api/colleges`, then filters programs by selected college.
12. **Database-backed enquiry handoff** — public enquiries are assigned to agents and appear in the agent portal with an automatic follow-up.
13. **Website visit lead persistence** — `website_leads` table and admin API/page persist Visit Website submissions across sessions.
14. **Admin access fixes** — `/admin` redirects to `/admin/dashboard`; stale role sessions can switch accounts through `/auth/sign-in`.
15. **Portal sign out** — sign-out waits for server cookie deletion and redirects to `/auth/sign-in`.

---

## Static Directory + DB Overlay Pattern (Current Architecture)

### Two-layer college data model
1. **Static directory** (`src/data/college-directory.ts`) — 82 colleges with IDs `del-1`–`del-18`, `mp-1`–`mp-18`, `blr-1`–`blr-19`, `bbsr-1`–`bbsr-9`, `hk-1`–`hk-13`, `oth-1`–`oth-5`. Fields: id, name, region, location, courses (name/fees strings), isPartnered, scholarshipAvailable, maxScholarship. Powers filters, sorting, scholarship caps.
2. **Partner profiles** (`src/data/partner-profiles.ts`) — 27 researched profiles: logos, hero images, tagline, overview, highlights, specializations, established, accreditation, official links. Special cases: `del-4` IMI = one entry for Bhubaneswar+Kolkata; `hk-4` SoIM = `del-15` SOIL (same institution); `blr-11` Alliance logo has `onDark: true`; PIBM/JAGSoM/Doon use empty logos (monogram fallback).
3. **DB overlay** — admin edits live in Postgres and are layered over static data at render time via client-side fetch of `/api/colleges/{id}`.

### Overlay precedence (detail pages)
- heroPhoto: DB `partnerProfile.heroImage.url` → DB `coverImage` → static profile hero → gradient fallback
- Programs: DB programs list replaces static courses when present
- About/tagline/highlights/specializations/accreditation: DB partnerProfile → static profile
- `sourceNote`/`lastVerified` always come from the static profile

### Homepage college card (current design)
```
┌──────────────────────────────┐
│  <img> hero photo (16:9)     │ ← real img, no text overlay; logo top-right
│  gradient fallback if no img │
├──────────────────────────────┤
│  College Name (bold, dark)   │ ← BELOW the picture, line-clamp-2
│  [Orion Partner] [Region]    │
│  📍 Location                 │
├──────────────────────────────┤
│  Programs + fees             │
│  Scholarship | Enquire 🔖 View│
└──────────────────────────────┘
```
- Cover map built once from `GET /api/colleges`: `id → partnerProfile.heroImage.url || coverImage`
- Matches the CollegeCover style on detail pages

---

## Admin College Management & Seeding

### Seed script
- `scripts/seed-static-colleges.ts` — idempotent migration of all 82 directory colleges + 111 programs into DB; copies partner profiles into `partner_profile` JSONB. Fees parsed from strings ("₹14,75,000" → number). Safe to re-run (skips existing).
- After seeding: admin panel shows **95 colleges total** (82 seeded + 13 original), 27 with editable partner profiles.
- Run with ESM dynamic import (`node --input-type=module` or tsx); CJS require of `@neondatabase/serverless` is broken on this machine.

### Schema additions (via direct ALTER TABLE, not drizzle-kit push)
- `colleges.campus_videos` JSONB default `'[]'`
- `colleges.partner_profile` JSONB nullable
- `drizzle-kit push` still fails on `users_email_unique` drift — additive schema changes go through raw SQL.

### Admin endpoints
- `GET/POST/PUT/DELETE /api/admin/colleges` — full CRUD; PUT accepts campusVideos + partnerProfile; DELETE cascades (programs deleted, website_leads.college_id nulled, college removed) and is admin-only.
- `GET /api/colleges/[id]` — public single-college fetch used by detail-page overlay.

### Lead persistence (all forms server-backed)
- GlobalEnquiryModal, SmartEnquiryModal, ScholarshipChecker, EnquirySidebar → `POST /api/leads`
- VisitWebsiteModal → `POST /api/website-leads` (validates college_id FK against `colleges` table; nulls it for directory-only IDs to prevent 500s)

---

## Pending / Follow-ups

1. Replace remaining local-only public scholarship/enquiry flows with the shared database lead POST path where needed.
2. Add a visible refresh or polling strategy to `LeadsBoard` if agents need new leads without navigating away.
3. Rotate any database password that was previously exposed outside the repository, then update only local/Vercel environment variables.
4. Enquiry/scholarship partner-cap logic still reads `isPartnered` from the static file — flip to DB if admin edits partner status.
5. Seed the 7 requested new colleges (Zee Bangalore, IAME Bangalore, St Xavier's Bangalore, MIBM Pune, IMS Noida, RSM Gurgaon, SGT Gurgaon) via admin panel or seed script.
6. `npm run lint` crashes with pre-existing ESLint error (`cli.execute is not a function`) — unrelated to app code.

---

## Verification Command
```bash
npm run lint && npm run typecheck && npm run build
```
All must pass clean before any commit/deploy.
