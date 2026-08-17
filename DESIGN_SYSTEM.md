# ORION EDUCATION — Design System

> **Purpose of this document:** This is the single source of truth for styling the ORION EDUCATION platform. It governs two distinct products under one brand: the **Student Portal** (public-facing, gamified, premium) and the **Agent/Admin CRM** (internal, data-dense, functional). An AI coding assistant should treat every class string and hex value below as authoritative — do not invent new colors, radii, or shadows outside this system. Stack: **Next.js (App Router) + Tailwind CSS + Framer Motion.**

---

## Table of Contents

1. [Brand Identity & Design Philosophy](#1-brand-identity--design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Elevation System: Shadows, Borders & Radii](#4-elevation-system-shadows-borders--radii)
5. [Component Styling Specifications](#5-component-styling-specifications)
6. [Animation & Micro-interactions](#6-animation--micro-interactions)
7. [Iconography & Imagery](#7-iconography--imagery)
8. [Do's & Don'ts Cheat Sheet](#8-dos--donts-cheat-sheet)
9. [Appendix A: Consolidated tailwind.config.js](#appendix-a-consolidated-tailwindconfigjs)

---

## 1. Brand Identity & Design Philosophy

**Design language: "Prestige Momentum" — Modern FinTech Trust meets Gen-Z EdTech.**

ORION sits at an emotionally high-stakes intersection: parents and students are making a decision involving large sums of money and a life trajectory (studying abroad, admissions, loans). The UI has to *feel* as trustworthy as a banking app while *feeling* as alive and rewarding as a gamified consumer product. We resolve this tension by splitting the brand into two coherent but distinct expressions of the same tokens:

| | **Student Portal** | **Agent/Admin CRM** |
|---|---|---|
| **Emotional goal** | Excitement, aspiration, safety | Speed, clarity, control |
| **Reference points** | Premium fintech (Stripe, Mercury), Gen-Z consumer apps (Notion, Duolingo, Cred) | Linear, Salesforce Lightning, Attio |
| **Shape language** | Soft, rounded, floating | Sharp, flat, grounded |
| **Color energy** | Deep Indigo authority + Electric Gold reward | Neutral slate + sparing semantic color |
| **Motion** | Springy, expressive, celebratory | Fast, quiet, near-instant |
| **Density** | Generous whitespace, breathing room | Dense, information-rich, compact |

**Core principle:** Both portals share the *exact same* color tokens, font families, and design primitives (defined below) — they are never re-themed from scratch. The CRM simply uses a **restrained, neutral-heavy subset** of the same palette (mostly `slate` + small hits of `brand`/`intent` colors), while the Student Portal uses the **full expressive range** (gradients, glows, glassmorphism). This is what makes them feel like one brand with two moods, not two unrelated products.

---

## 2. Color System

### 2.1 Quick Reference

| Token | Hex | Role |
|---|---|---|
| `brand-600` | `#4F46E5` | Primary brand — Sleek Indigo (CTAs, links, active states) |
| `brand-900` / `brand-950` | `#1E1B4B` / `#0F0D2E` | Deep Space — dark hero sections, footers, ROI meter cards |
| `gold-500` | `#F5B700` | Electric Gold — gamification, wins, hero CTAs, scholarship reveals |
| `teal-500` | `#0FC9BC` | Neon Teal — growth/positive ROI indicators, secondary success accent |
| `violet-500` | `#8B5CF6` | Vibrant Violet — gradient partner for CTAs, decorative accents |
| `surface-50…900` | `#FAFAFC…#16162A` | Student Portal neutrals (warm off-white → near-black) |
| `slate-50…900` | Tailwind default | CRM neutrals (strict, cool gray — do not use `surface` in CRM) |
| `intent-hot` | `#EF4444` | Hot / high-intent lead |
| `intent-warm` | `#F59E0B` | Warm lead |
| `intent-cold` | `#38BDF8` | Cold lead |
| `intent-dropped` | `#94A3B8` | Dropped / lost lead |
| `intent-new` | `#6366F1` | New / untouched lead |
| `intent-won` | `#22C55E` | Converted / enrolled |

### 2.2 Primary / Brand — "Sleek Indigo" / "Deep Space"

The brand color is a single indigo scale that does double duty: mid-tones (`500–600`) read as an energetic, trustworthy **Sleek Indigo** for interactive elements; the darkest steps (`900–950`) become **Deep Space Blue**, used for premium dark surfaces (hero backgrounds, ROI cards, CRM sidebar). This keeps "authority" and "trust" on one consistent hue instead of two competing blues.

| Shade | Hex | Typical use |
|---|---|---|
| 50 | `#EEF2FF` | Tinted backgrounds, hover states on light surfaces |
| 100 | `#E0E7FF` | Badge backgrounds |
| 200 | `#C7D2FE` | Borders on tinted cards |
| 300 | `#A5B4FC` | Disabled brand elements |
| 400 | `#818CF8` | Icon accents |
| 500 | `#6366F1` | Secondary interactive |
| **600** | **`#4F46E5`** | **Primary — buttons, links, active nav, focus rings** |
| 700 | `#4338CA` | Hover/pressed state of primary |
| 800 | `#3730A3` | Text-on-tint, deep accents |
| 900 | `#1E1B4B` | Deep Space — hero/footer backgrounds |
| 950 | `#0F0D2E` | Deepest Space — CRM sidebar, near-black brand text |

### 2.3 Gamification / Accent Colors

Three accents power the "reward" feel of the Student Portal. **Gold is dominant** (scholarship, wins, primary gamified CTA); **Teal and Violet are supporting** (growth metrics, gradients).

**Electric Gold** — the color of "you just won something."
| Shade | Hex |
|---|---|
| 50 | `#FFFBEB` |
| 100 | `#FEF3C7` |
| 300 | `#FCD34D` |
| 400 | `#FBBF24` |
| **500** | **`#F5B700`** |
| 600 | `#D69E00` |
| 700 | `#A67C00` |

**Neon Teal** — growth, positive ROI, "money saved."
| Shade | Hex |
|---|---|
| 50 | `#ECFEFC` |
| 100 | `#CFFDF7` |
| 400 | `#22DDD0` |
| **500** | **`#0FC9BC`** |
| 600 | `#0AA39A` |
| 700 | `#0B7F7A` |

**Vibrant Violet** — used almost exclusively as a gradient partner with `brand-600` on primary CTAs (`from-brand-600 to-violet-600`), and as a decorative blur/glow color behind hero sections.
| Shade | Hex |
|---|---|
| 400 | `#A78BFA` |
| **500** | **`#8B5CF6`** |
| 600 | `#7C3AED` |

### 2.4 Neutral / Surface Colors

**Student Portal** uses a warm, slightly indigo-tinted off-white scale called `surface` — this avoids the "cold SaaS gray" look and feels more premium/editorial.

| Shade | Hex | Use |
|---|---|---|
| 0 | `#FFFFFF` | Pure white cards on tinted backgrounds |
| 50 | `#FAFAFC` | Page background |
| 100 | `#F5F5FA` | Section background alternation |
| 200 | `#ECECF5` | Borders, dividers |
| 300 | `#DCDCE8` | Stronger borders, disabled fills |
| 400 | `#B8B8CC` | Placeholder text |
| 500 | `#8E8EA8` | Muted/secondary text |
| 600 | `#6B6B85` | Body text (secondary) |
| 700 | `#4A4A63` | Body text (primary, lighter contexts) |
| 800 | `#2E2E45` | Headings on light bg |
| 900 | `#16162A` | Primary heading/text color |

**CRM Portal** uses Tailwind's **default `slate` palette** directly (`slate-50` → `slate-950`) — a strictly neutral, cooler gray reads as more "enterprise-grade" and matches Linear/Salesforce conventions. **Do not substitute `surface` tokens in the CRM.**

### 2.5 CRM Semantic / Status Colors — Lead Intent & Alerts

These map lead temperature and system alerts to consistent, low-saturation-background + high-saturation-text pairs (badge-friendly, accessible at small sizes).

| Intent / State | Token | Dot/Icon | Text | Background | Ring |
|---|---|---|---|---|---|
| 🔥 Hot | `intent-hot` | `#EF4444` | `#B91C1C` (red-700) | `#FEF2F2` (red-50) | `#FECACA` |
| 🌤 Warm | `intent-warm` | `#F59E0B` | `#B45309` (amber-700) | `#FFFBEB` (amber-50) | `#FDE68A` |
| ❄️ Cold | `intent-cold` | `#38BDF8` | `#0369A1` (sky-700) | `#F0F9FF` (sky-50) | `#BAE6FD` |
| ⚪ New | `intent-new` | `#6366F1` | `#4338CA` (brand-700) | `#EEF2FF` (brand-50) | `#C7D2FE` |
| 🚫 Dropped | `intent-dropped` | `#94A3B8` | `#475569` (slate-600) | `#F1F5F9` (slate-100) | `#E2E8F0` |
| ✅ Won/Enrolled | `intent-won` | `#22C55E` | `#15803D` (green-700) | `#F0FDF4` (green-50) | `#BBF7D0` |

**UI Alerts** (reuse standard semantics, do not invent new ones):
| Alert | Hex |
|---|---|
| Success | `#22C55E` (green-500) |
| Warning | `#F59E0B` (amber-500) |
| Error / Destructive | `#EF4444` (red-500) |
| Info | `#3B82F6` (blue-500) |

### 2.6 `tailwind.config.js` — Colors

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5', // Primary — Sleek Indigo
          700: '#4338CA',
          800: '#3730A3',
          900: '#1E1B4B', // Deep Space
          950: '#0F0D2E', // Deepest Space
        },
        gold: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F5B700', // Electric Gold
          600: '#D69E00',
          700: '#A67C00',
          800: '#7A5A00',
          900: '#4D3800',
        },
        teal: {
          50: '#ECFEFC',
          100: '#CFFDF7',
          200: '#99F9EF',
          300: '#5CEEE0',
          400: '#22DDD0',
          500: '#0FC9BC', // Neon Teal
          600: '#0AA39A',
          700: '#0B7F7A',
          800: '#0D6461',
          900: '#0F5250',
        },
        violet: {
          400: '#A78BFA',
          500: '#8B5CF6', // Vibrant Violet
          600: '#7C3AED',
        },
        surface: {
          0: '#FFFFFF',
          50: '#FAFAFC',
          100: '#F5F5FA',
          200: '#ECECF5',
          300: '#DCDCE8',
          400: '#B8B8CC',
          500: '#8E8EA8',
          600: '#6B6B85',
          700: '#4A4A63',
          800: '#2E2E45',
          900: '#16162A',
        },
        intent: {
          hot: '#EF4444',
          warm: '#F59E0B',
          cold: '#38BDF8',
          new: '#6366F1',
          dropped: '#94A3B8',
          won: '#22C55E',
        },
      },
    },
  },
};
```

---

## 3. Typography

### 3.1 Font Stack & Rationale

| Family | Google Font | Weights | Used for |
|---|---|---|---|
| **Display** | `Plus Jakarta Sans` | 500, 600, 700, 800 | All headings (both portals), brand wordmark, hero copy |
| **Sans (body/UI)** | `Inter` | 400, 500, 600, 700 | Body text, form labels, buttons, CRM UI at every size |
| **Mono** | `JetBrains Mono` | 400, 500 | CRM data: lead IDs, phone numbers, timestamps, KPI numerals |

**Rationale:** Plus Jakarta Sans has geometric warmth that reads premium without being cold — ideal for aspirational headlines ("Get Into Your Dream University"). Inter is the most legible UI typeface at small sizes, which the CRM depends on heavily. Mono is used sparingly, only where tabular alignment and unambiguous character recognition matter (phone numbers, IDs, currency).

### 3.2 Next.js Font Loading

```tsx
// app/layout.tsx
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-surface-50 text-surface-900 antialiased">{children}</body>
    </html>
  );
}
```

### 3.3 Type Scale — Student Portal

Generous, dramatic scale for marketing/landing pages and gamified tools.

| Element | Tailwind class string |
|---|---|
| **H1** (hero) | `font-display text-5xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-surface-900` |
| **H2** (section) | `font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight text-surface-900` |
| **H3** (subsection) | `font-display text-2xl md:text-3xl font-bold leading-snug text-surface-900` |
| **H4** (card title) | `font-display text-xl md:text-2xl font-semibold text-surface-900` |
| **H5** (small heading) | `font-display text-lg md:text-xl font-semibold text-surface-800` |
| **H6** (eyebrow label) | `font-sans text-sm font-semibold uppercase tracking-wider text-brand-600` |
| **Body Large** | `font-sans text-lg leading-relaxed text-surface-700` |
| **Body** | `font-sans text-base leading-relaxed text-surface-700` |
| **Body Small** | `font-sans text-sm leading-relaxed text-surface-600` |
| **Micro-copy** (disclaimers, hints) | `font-sans text-xs font-medium tracking-wide text-surface-500` |
| **Stat/Number display** (ROI, scholarship $) | `font-display text-4xl md:text-6xl font-extrabold tabular-nums text-gold-500` |

### 3.4 Type Scale — CRM Portal

Compact, functional scale optimized for density and scanning.

| Element | Tailwind class string |
|---|---|
| **Page Title** | `font-display text-xl font-semibold tracking-tight text-slate-900` |
| **Section Header** | `font-sans text-base font-semibold text-slate-900` |
| **Panel/Card Title** | `font-sans text-sm font-semibold uppercase tracking-wide text-slate-500` |
| **Table Header** | `font-sans text-xs font-medium uppercase tracking-wide text-slate-500` |
| **Table Cell / Body** | `font-sans text-sm font-normal text-slate-700` |
| **KPI Number** | `font-mono text-2xl font-bold tabular-nums text-slate-900` |
| **Meta / Timestamp / ID** | `font-mono text-xs text-slate-400` |
| **Form Label** | `font-sans text-xs font-medium text-slate-600` |

### 3.5 `tailwind.config.js` — Fonts

```js
theme: {
  extend: {
    fontFamily: {
      display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
    },
  },
},
```

---

## 4. Elevation System: Shadows, Borders & Radii

### 4.1 Student Portal — Soft & Floating

Rounded, buoyant, with colored ambient shadows that tie elevation back to the brand rather than generic gray shadows.

| Purpose | Class |
|---|---|
| Default card radius | `rounded-2xl` (16px) |
| Hero panel / modal radius | `rounded-3xl` (24px) |
| Pills, buttons, avatars, badges | `rounded-full` |
| Input fields | `rounded-2xl` |
| Resting card shadow | `shadow-[0_2px_16px_-4px_rgba(16,16,42,0.06)]` |
| Hover/float shadow | `shadow-[0_16px_32px_-8px_rgba(79,70,229,0.15)]` |
| Gold glow (CTA hover / win state) | `shadow-[0_0_24px_6px_rgba(245,183,0,0.45)]` |
| Glassmorphic panel | `bg-white/70 backdrop-blur-xl border border-white/60` |
| Standard border | `border border-surface-200` |

### 4.2 CRM Portal — Sharp & Flat

Minimal radius, thin hairline borders, near-zero shadow. Elevation is communicated via **background shift + border**, not shadow depth — this is what makes it feel like Linear/Salesforce rather than a consumer app.

| Purpose | Class |
|---|---|
| Buttons, inputs, badges | `rounded-md` (6px) |
| Cards, panels, modals (max radius allowed) | `rounded-lg` (8px) |
| Standard border | `border border-slate-200` |
| Table row divider | `divide-y divide-slate-100` |
| Resting shadow (cards/dropdowns only) | `shadow-sm` |
| Elevated surface (instead of shadow) | `bg-slate-50` on `bg-white` base |
| **Never use:** `rounded-xl` and above, colored/glow shadows, `backdrop-blur` | — |

### 4.3 `tailwind.config.js` — Shadows & Radii

```js
theme: {
  extend: {
    boxShadow: {
      'card': '0 2px 16px -4px rgba(16,16,42,0.06)',
      'float': '0 16px 32px -8px rgba(79,70,229,0.15)',
      'glow-gold': '0 0 24px 6px rgba(245,183,0,0.45)',
      'glow-gold-idle': '0 0 0px 0px rgba(245,183,0,0.4)',
      'glass': '0 8px 32px 0 rgba(31,38,135,0.10)',
    },
    borderRadius: {
      // Tailwind defaults (sm, md, lg, xl, 2xl, 3xl, full) are used as-is.
      // Student Portal ceiling: rounded-3xl. CRM ceiling: rounded-lg.
    },
  },
},
```

---

## 5. Component Styling Specifications

### 5.1 Buttons

**Student Portal — Primary Gamified CTA** (gradient + glow, e.g. "Start Your Journey")
```
inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 via-violet-600 to-brand-600 bg-[length:200%_auto] bg-left px-8 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-6px_rgba(79,70,229,0.5)] transition-all duration-300 hover:bg-right hover:shadow-[0_12px_32px_-6px_rgba(79,70,229,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-200
```

**Student Portal — Gold CTA** (reserved for the highest-intent action, e.g. "Check My Scholarship")
```
inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-base font-bold text-brand-950 shadow-glow-gold-idle transition-all duration-300 hover:shadow-glow-gold hover:bg-gold-400 hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold-200
```

**Student Portal — Secondary**
```
inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-600 bg-transparent px-8 py-4 text-base font-semibold text-brand-600 transition-colors duration-200 hover:bg-brand-50 active:bg-brand-100
```

**Student Portal — Outline (neutral)**
```
inline-flex items-center justify-center gap-2 rounded-full border border-surface-300 bg-white px-6 py-3 text-sm font-medium text-surface-700 transition-colors duration-200 hover:border-surface-400 hover:bg-surface-50
```

**Student Portal — Ghost**
```
inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-surface-600 transition-colors duration-200 hover:bg-surface-100 hover:text-surface-900
```

**CRM — Primary**
```
inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-brand-700 active:bg-brand-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500
```

**CRM — Secondary**
```
inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors duration-150 hover:bg-slate-50
```

**CRM — Destructive**
```
inline-flex items-center justify-center gap-1.5 rounded-md bg-white px-3.5 py-2 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-200 transition-colors duration-150 hover:bg-red-50
```

### 5.2 Inputs & Forms — "Smart Enquiry" Multi-Step Form

**Base input (Student Portal)**
```
w-full rounded-2xl border border-surface-200 bg-white px-5 py-4 text-base text-surface-900 placeholder:text-surface-400 shadow-sm transition-all duration-200 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100
```

**Error state**
```
w-full rounded-2xl border border-red-300 bg-red-50/50 px-5 py-4 text-base text-surface-900 placeholder:text-surface-400 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-100
```
Error text: `flex items-center gap-1 mt-1.5 text-sm font-medium text-red-600`

**Field label**
```
mb-2 block text-sm font-semibold text-surface-800
```

**Step progress indicator** (dots that expand when active)
```
// container
flex items-center gap-2

// inactive dot
h-1.5 w-4 rounded-full bg-surface-200 transition-all duration-300

// active dot
h-1.5 w-8 rounded-full bg-gold-500 transition-all duration-300

// completed dot
h-1.5 w-4 rounded-full bg-brand-500 transition-all duration-300
```

**CRM input** (compact, functional)
```
w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20
```
CRM error state: `border-red-300 focus:border-red-500 focus:ring-red-500/20`

### 5.3 Cards

**College Listing Card** (premium solid, hover-lift)
```
group overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-float
```
Image container: `relative h-48 w-full overflow-hidden rounded-t-2xl`
Content padding: `p-6`
Ranking/trust badge (top-left overlay): `absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm`

**Glassmorphic Container** (ROI Calculator / Scholarship Checker wrapper)
```
rounded-3xl border border-white/60 bg-white/70 p-8 shadow-glass backdrop-blur-xl
```
Use over a subtle gradient/blurred-blob background (`bg-gradient-to-br from-brand-50 via-white to-gold-50`) so the blur has something to refract.

**ROI Meter / Dark Stat Card** (high-contrast accent card, Deep Space + Gold)
```
rounded-2xl bg-gradient-to-br from-brand-900 to-brand-950 p-6 text-white shadow-[0_12px_32px_-8px_rgba(15,13,46,0.4)]
```
Big number inside: `font-display text-4xl font-extrabold tabular-nums text-gold-400`
Label: `text-sm font-medium text-brand-200`

### 5.4 CRM Components

**Data table row**
```
border-b border-slate-100 transition-colors duration-100 hover:bg-slate-50 data-[state=selected]:bg-brand-50/60
```
Table header cell: `px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wide text-slate-500 bg-slate-50 sticky top-0`
Table body cell: `px-4 py-3 text-sm text-slate-700`

**Kanban board column** (e.g. pipeline stages: New → Contacted → Qualified → Won/Lost)
```
flex-shrink-0 w-80 rounded-lg border border-slate-200 bg-slate-50 p-3
```
Column header: `flex items-center justify-between px-1 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500`

**Kanban card**
```
rounded-md border border-slate-200 bg-white p-3 shadow-sm transition-shadow duration-150 hover:shadow-md cursor-grab active:cursor-grabbing
```

**Status badge (compact, pill, with dot)** — pattern for all `intent` colors
```
// Hot example — swap red-* for the relevant intent color family
inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10

// dot inside
h-1.5 w-1.5 rounded-full bg-red-500
```
| Status | bg / text / ring |
|---|---|
| Hot | `bg-red-50 text-red-700 ring-red-600/10` |
| Warm | `bg-amber-50 text-amber-700 ring-amber-600/10` |
| Cold | `bg-sky-50 text-sky-700 ring-sky-600/10` |
| New | `bg-brand-50 text-brand-700 ring-brand-600/10` |
| Dropped | `bg-slate-100 text-slate-600 ring-slate-500/10` |
| Won | `bg-green-50 text-green-700 ring-green-600/10` |

**KPI/metric card** (dashboard top row)
```
rounded-lg border border-slate-200 bg-white p-4 shadow-sm
```

---

## 6. Animation & Micro-interactions

### 6.1 Global Motion Principles

| | Student Portal | CRM Portal |
|---|---|---|
| **Personality** | Springy, expressive, celebratory | Fast, quiet, utilitarian |
| **Entrance duration** | 400–600ms | 100–180ms |
| **Easing** | `[0.16, 1, 0.3, 1]` (ease-out-expo) for reveals; spring physics for interactive elements | `easeOut`, linear for progress — no spring/bounce |
| **Stagger** | 80–120ms between children | Avoid; if needed, ≤40ms |
| **Hover feedback** | Scale + lift + shadow/glow change | Background color shift only (CSS transition, not Framer Motion) |
| **Page transitions** | Fade + slide, ~500ms | Fade only, ~120ms, no vertical movement |

**Rule of thumb:** in the CRM, motion should be felt more than seen — it exists to orient the user (this card moved, this drawer opened), never to delight. In the Student Portal, motion is part of the value proposition — it should feel earned and rewarding.

### 6.2 Framer Motion Variants (Student Portal)

```jsx
// Section/card reveal on scroll
export const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

// Button hover/tap
<motion.button
  whileHover={{ scale: 1.03, y: -2 }}
  whileTap={{ scale: 0.97 }}
  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
>
  Check My Scholarship
</motion.button>

// Page transition wrapper (app/(student)/template.tsx)
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
>
  {children}
</motion.div>
```

### 6.3 CRM Motion Notes

- Prefer plain CSS (`transition-colors duration-150`) over Framer Motion for row/button hovers — better performance in dense tables.
- Reserve Framer Motion for: **Kanban drag-and-drop** (`layout` prop on cards + `AnimatePresence` for insert/remove), **drawers/modals** (slide from right, `x: '100%' → 0`, 180ms `easeOut`), and **toast notifications** (fade + slide up 8px, 150ms).
- No `whileHover` scale transforms anywhere in the CRM — data tables should never visually "jump."

### 6.4 Scholarship Checker — Signature Animations

This is the flagship gamified moment. Sequence:

1. **Idle pulsating glow** around the checker CTA/icon to draw the eye before interaction:
```jsx
<motion.div
  animate={{
    boxShadow: [
      '0 0 0px 0px rgba(245,183,0,0.4)',
      '0 0 24px 8px rgba(245,183,0,0.35)',
      '0 0 0px 0px rgba(245,183,0,0.4)',
    ],
  }}
  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
/>
```

2. **Multi-step form transitions** — outgoing step slides out (`x: -40, opacity: 0`), incoming step slides in (`x: 40 → 0, opacity: 0 → 1`), 300ms, with fields inside staggered 60ms apart.

3. **Result reveal — count-up animation.** Animate the scholarship amount from 0 to the final figure over ~1.2–1.5s using `animate()`/`useMotionValue` from Framer Motion (or `react-countup`), `ease: 'easeOut'`, formatted with currency + commas. On completion, apply a single scale pop: `1 → 1.06 → 1` over 300ms.

4. **Eligibility/progress meter** — width animates with a spring (`type: 'spring', stiffness: 120, damping: 20`), fill color interpolates from `surface-300` toward `gold-500` as the percentage climbs.

5. **"You Qualify!" success state** — gold gradient sweep-in behind the card, checkmark badge drawn via SVG `pathLength` animation (`0 → 1`, 600ms, `easeInOut`), optional lightweight confetti burst (e.g. `canvas-confetti`) fired once on mount of the success state — never looping, never on every re-render.

### 6.5 `tailwind.config.js` — Keyframes & Animation

```js
theme: {
  extend: {
    keyframes: {
      'pulse-glow': {
        '0%, 100%': { boxShadow: '0 0 0px 0px rgba(245,183,0,0.4)' },
        '50%': { boxShadow: '0 0 24px 8px rgba(245,183,0,0.35)' },
      },
      shimmer: {
        '0%': { backgroundPosition: '0% 50%' },
        '100%': { backgroundPosition: '200% 50%' },
      },
    },
    animation: {
      'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
      shimmer: 'shimmer 3s linear infinite',
    },
  },
},
```

---

## 7. Iconography & Imagery

- **Icon library:** `lucide-react` across both portals (consistent stroke-based icon language).
  - Student Portal: `strokeWidth={1.75}`, sizes `20–28px`, colored to match context (brand/gold), can sit inside soft tinted circles (`bg-brand-50 text-brand-600 rounded-full p-2.5`).
  - CRM: `strokeWidth={1.5}`, sizes `16–18px` only, neutral `text-slate-500` by default, colored only to reinforce status (e.g. red phone icon on a hot lead row).
- **Photography (Student Portal):** real, diverse student photography with natural light and candid framing — avoid generic corporate stock or overly staged "smiling at laptop" imagery. Photos should feel aspirational but authentic, reinforcing trust.
- **CRM:** no decorative imagery. Avatars only (initials-based fallback: `bg-brand-100 text-brand-700 rounded-full` circle with 2-letter initials).

---

## 8. Do's & Don'ts Cheat Sheet

| | ✅ Do | ❌ Don't |
|---|---|---|
| **Student Portal radius** | `rounded-2xl` / `rounded-3xl` / `rounded-full` | Sharp corners, `rounded-none` |
| **Student Portal shadows** | Colored, soft, ambient (`shadow-card`, `shadow-float`, `shadow-glow-gold`) | Flat gray default browser shadows |
| **Student CTAs** | Gradient or solid gold, generous padding (`px-8 py-4`), pill-shaped | Small square buttons, sharp corners |
| **CRM radius** | `rounded-md` / `rounded-lg` max | `rounded-2xl`/`rounded-3xl`, anything "soft" |
| **CRM shadows** | `shadow-sm` or none; use borders/bg for hierarchy | Colored glows, `backdrop-blur`, floating cards |
| **CRM motion** | Fast CSS transitions, ≤180ms | Springs, bounce, scale-on-hover on table rows |
| **Colors** | Use only tokens defined in §2 | New one-off hex values not in the palette |
| **Fonts** | Plus Jakarta Sans (display) + Inter (body) everywhere | Introducing a third UI typeface |
| **Status badges (CRM)** | Tinted bg + colored text + ring, per §5.4 | Solid saturated color fills (too loud for dense tables) |
| **Gamified reveals** | One clear celebratory moment (count-up, confetti) per flow | Looping confetti, animation on every interaction |

---

## Appendix A: Consolidated `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC',
          400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA',
          800: '#3730A3', 900: '#1E1B4B', 950: '#0F0D2E',
        },
        gold: {
          50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D',
          400: '#FBBF24', 500: '#F5B700', 600: '#D69E00', 700: '#A67C00',
          800: '#7A5A00', 900: '#4D3800',
        },
        teal: {
          50: '#ECFEFC', 100: '#CFFDF7', 200: '#99F9EF', 300: '#5CEEE0',
          400: '#22DDD0', 500: '#0FC9BC', 600: '#0AA39A', 700: '#0B7F7A',
          800: '#0D6461', 900: '#0F5250',
        },
        violet: { 400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED' },
        surface: {
          0: '#FFFFFF', 50: '#FAFAFC', 100: '#F5F5FA', 200: '#ECECF5',
          300: '#DCDCE8', 400: '#B8B8CC', 500: '#8E8EA8', 600: '#6B6B85',
          700: '#4A4A63', 800: '#2E2E45', 900: '#16162A',
        },
        intent: {
          hot: '#EF4444', warm: '#F59E0B', cold: '#38BDF8',
          new: '#6366F1', dropped: '#94A3B8', won: '#22C55E',
        },
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 16px -4px rgba(16,16,42,0.06)',
        float: '0 16px 32px -8px rgba(79,70,229,0.15)',
        'glow-gold': '0 0 24px 6px rgba(245,183,0,0.45)',
        'glow-gold-idle': '0 0 0px 0px rgba(245,183,0,0.4)',
        glass: '0 8px 32px 0 rgba(31,38,135,0.10)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0px 0px rgba(245,183,0,0.4)' },
          '50%': { boxShadow: '0 0 24px 8px rgba(245,183,0,0.35)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
```

*End of DESIGN_SYSTEM.md*
