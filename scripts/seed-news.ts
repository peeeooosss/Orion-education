import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const samples = [
  {
    id: "news-cat-2025-reg-open",
    title: "CAT 2025 Registration Now Open — Apply by Sep 13",
    excerpt:
      "CAT 2025 registration opened on August 1, 2025 at iimcat.ac.in. Exam on Nov 30, 2025 across 170 cities in 3 shifts. Fee: ₹2,600 (Gen/OBC), ₹1,300 (SC/ST/PwD). Admit cards from Nov 12. Results expected early Jan 2026.",
    category: "Exams",
    date: "2025-08-01",
    externalUrl: "https://iimcat.ac.in",
  },
  {
    id: "news-cmat-2026-reg-open",
    title: "CMAT 2026 Registration Open — Last Date Nov 17",
    excerpt:
      "NTA opened CMAT 2026 registration on Oct 17, 2025. Apply by Nov 17, 2025 at cmat.nta.nic.in. Exam in Jan 2026 (CBT, 3 hrs). Fee: ₹2,500 (Gen Male), ₹1,250 (Female/Reserved). Score accepted by 1,300+ MBA colleges.",
    category: "Exams",
    date: "2025-10-17",
    externalUrl: "https://cmat.nta.nic.in",
  },
  {
    id: "news-xat-2026-reg-open",
    title: "XAT 2026 Registration Live — XLRI Exam on Jan 4, 2026",
    excerpt:
      "XAT 2026 registration started Jul 10, 2025, closes Dec 11, 2025 at xatonline.in. Exam on Jan 4, 2026 (3.5 hrs). Fee: ₹2,100 + ₹200 per XLRI programme. Score used by 250+ institutes including XLRI, XIMB, SPJIMR, IMT, GIM, TAPMI.",
    category: "Exams",
    date: "2025-07-10",
    externalUrl: "https://xatonline.in",
  },
  {
    id: "news-cat-2025-cutoff-trends",
    title: "CAT 2025 Expected Cutoffs: IIMs 90-99%, Top B-Schools 85-95%",
    excerpt:
      "Based on 2024 trends: IIM A/B/C ~99-100%, IIM L/I/K ~97-99%, New IIMs 93-96%, SPJIMR 95-97%, MDI 93-95%, XLRI (via CAT) 95-97%, FMS 98-99%, IIFT 95-97%. Final cutoffs depend on exam difficulty and seat intake.",
    category: "Exams",
    date: "2025-09-15",
    externalUrl: "https://iimcat.ac.in",
  },
  {
    id: "news-placements-2025-top-bschools",
    title: "MBA Placements 2025: IIM Avg ₹32-35 LPA, XLRI ₹31 LPA, SPJIMR ₹33 LPA",
    excerpt:
      "2025 final placements: IIM Bangalore ₹35.31 LPA, IIM Ahmedabad ₹34.45 LPA, IIM Calcutta ₹32.62 LPA, FMS Delhi ₹34.1 LPA, SPJIMR ₹33 LPA, XLRI ₹31.08 LPA (median ₹29 LPA), ISB ₹34.21 LPA, IIM Kozhikode ₹28.05 LPA, MDI ₹26.18 LPA. Highest domestic offers ₹75-81 LPA, international up to ₹1.1 Cr.",
    category: "Placements",
    date: "2025-03-28",
    externalUrl: "https://insideiim.com",
  },
  {
    id: "news-mba-fees-2025-structure",
    title: "MBA Fees 2025: IIMs ₹15-30L, XLRI ₹27-31L, SPJIMR ₹24L, FMS ₹6L",
    excerpt:
      "Total 2-year course fees: IIM A/B/C ~₹26-27L, IIM L/K/I ~₹20-21L, XLRI Jamshedpur/Delhi ₹27-31L, SPJIMR Mumbai ₹24L, MDI Gurgaon ₹25L, IIFT Delhi ₹21L, FMS Delhi ₹6L, JBIMS ₹6L, TISS Mumbai ₹2.4L, SIMSREE ₹2-3L. ROI highest at FMS/JBIMS/TISS.",
    category: "Fees",
    date: "2025-09-11",
    externalUrl: "https://www.iquanta.in/blog/top-private-mba-colleges-in-india",
  },
  {
    id: "news-xlri-placements-2025-details",
    title: "XLRI 2025 Placements: Avg ₹31.08 LPA, Highest ₹1.1 Cr Intl / ₹75L Domestic",
    excerpt:
      "XLRI Jamshedpur + Delhi 2025 batch (591 students): 602 offers including 2 international. Avg ₹31.08 LPA (up from ₹29.89 LPA 2024), median ₹29 LPA, top 10% avg ₹52 LPA. Sectors: BFSI (Goldman, Citi, Barclays), HR (HUL, ITC, Tata Steel), Consulting (BCG, Bain), General Mgmt (Reliance, Mahindra, TAS). 139 summer internship recruiters.",
    category: "Placements",
    date: "2025-03-28",
    externalUrl: "https://insideiim.com/xlri-final-placements-2025",
  },
  {
    id: "news-spjimr-placements-2025-details",
    title: "SPJIMR 2025 Placements: Avg ₹32 LPA, Highest ₹89 LPA International",
    excerpt:
      "SPJIMR Mumbai 2023-25 batch (336 students): 100% placed, 86 companies (27 new). Avg ₹32 LPA, median ₹30.5 LPA, 53% batch >₹30 LPA. Highest intl ₹89 LPA (Infosys Consulting, HCL Tech). PPOs to 48% batch. Top sectors: Gen Mgmt (Aditya Birla, Mahindra, Tata), E-comm (Amazon, Zomato), Consulting.",
    category: "Placements",
    date: "2025-02-24",
    externalUrl: "https://insideiim.com/spjimr-placements-average-salary-highest-package-recruiters",
  },
  {
    id: "news-admissions-2025-open",
    title: "MBA Admissions 2025-27 Open — Apply via CAT/XAT/CMAT Scores",
    excerpt:
      "Admissions for 2025-27 batch underway at IIMs, XLRI, SPJIMR, MDI, FMS, IIFT, TISS, JBIMS, SIMSREE and 1000+ AICTE colleges. Shortlist via CAT 2024/XAT 2025/CMAT 2025 scores. GD/PI rounds Feb-Apr 2025. Check individual college portals for deadlines. Free counselling available on Orion.",
    category: "Admissions",
    date: "2025-01-15",
    externalUrl: "/#colleges",
  },
];

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  const sql = neon(url);

  for (const s of samples) {
    await sql`
      INSERT INTO news_items (id, title, excerpt, category, date, external_url, is_published, created_at, updated_at)
      VALUES (${s.id}, ${s.title}, ${s.excerpt}, ${s.category}, ${s.date}, ${s.externalUrl}, true, now(), now())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        category = EXCLUDED.category,
        date = EXCLUDED.date,
        external_url = EXCLUDED.external_url,
        is_published = EXCLUDED.is_published,
        updated_at = now()
    `;
  }

  console.log(`Seeded/updated ${samples.length} news items.`);
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});