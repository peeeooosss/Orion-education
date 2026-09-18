import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const samples = [
  {
    id: "news-cat-2027",
    title: "CAT 2027 registration window opens in August",
    excerpt:
      "IIM-issued CAT is the gateway to India's top MBA programmes. Registrations typically begin in August — book your CAT ID, choose test cities early and start mock tests.",
    category: "Exams",
    date: "2026-09-10",
    externalUrl: "https://iimcat.ac.in",
  },
  {
    id: "news-cmat-2027",
    title: "CMAT 2027 dates announced — no. of test slots increased",
    excerpt:
      "NTA has announced the CMAT schedule with additional test slots for MBA/PGDM aspirants. Check slot availability and register before the late fee window closes.",
    category: "Exams",
    date: "2026-09-02",
    externalUrl: "https://cmat.nta.nic.in",
  },
  {
    id: "news-mba-scholarship-deadline",
    title: "Last chance: MBA scholarship deadline approaching",
    excerpt:
      "Eligibility-backed scholarships up to ₹30,000 at partner colleges. Check your scholarship amount in 30 seconds before the current admission cycle closes.",
    category: "Scholarships",
    date: "2026-08-22",
    externalUrl: null,
  },
  {
    id: "news-admissions-2027",
    title: "Admissions Open 2027 — get counselling before seats fill",
    excerpt:
      "Top MBA & PGDM colleges across India have opened admissions for the 2027 batch. Shortlist colleges, verify fees and lock an early seat with a counsellor.",
    category: "Admissions",
    date: "2026-08-15",
    externalUrl: "/#colleges",
  },
  {
    id: "news-cat-result-2026",
    title: "CAT 2026 results — use your percentile to plan admissions",
    excerpt:
      "With last cycle's results out, aspirants are finalising college shortlists. Attend free counselling to match your percentile with the best-fit MBA colleges.",
    category: "Results",
    date: "2026-08-01",
    externalUrl: "/journey",
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
      ON CONFLICT (id) DO NOTHING
    `;
  }

  console.log(`Seeded ${samples.length} news items.`);
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});