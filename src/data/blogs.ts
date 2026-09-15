export interface BlogBlock {
  type: "p" | "h2" | "ul" | "ol" | "quote";
  text?: string;
  items?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  readingMinutes: number;
  publishedAt: string;
  author: string;
  content: BlogBlock[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "mba-vs-pgdm-india-2026",
    title: "MBA vs PGDM in India 2026: Which Degree Is Right for You?",
    description:
      "MBA and PGDM look similar but differ in curriculum, autonomy and recognition. Compare them on fees, placements, entrance exams and AICTE approval to pick the right one for 2026.",
    keywords: ["mba vs pgdm", "mba in india", "pgdm colleges", "aicte approved pgdm", "mba placement"],
    category: "MBA & PGDM",
    readingMinutes: 6,
    publishedAt: "2026-09-12",
    author: "Orion Education Team",
    content: [
      {
        type: "p",
        text: "If you are shortlisting business schools in India, you have probably seen both MBA and PGDM on college brochures and scripted the same question a dozen times: which one is actually better? The honest answer is that neither is universally better — the right choice depends on the institute and how the programme is run.",
      },
      { type: "h2", text: "What is the difference between MBA and PGDM?" },
      {
        type: "p",
        text: "An MBA is a university degree. It is awarded by a university, follows a curriculum that is approved by statutory bodies, and cannot be changed freely by the college. A PGDM is a diploma. It is designed and run independently by autonomous institutes — which is exactly why it feels more flexible, updated and industry-oriented.",
      },
      {
        type: "p",
        text: "The two biggest practical differences are curriculum control and entrance flexibility. Autonomous institutes set their own fee structure, admission process and pedagogy — but only if they are approved by AICTE and recognised by the university they are affiliated to.",
      },
      { type: "h2", text: "Which one has better placements?" },
      {
        type: "p",
        text: "Placements are driven by the institute, not the degree label. A PGDM from an autonomous institute with strong corporate relations can place better than a second-tier MBA — and the reverse is equally true. When comparing, look at median package, the companies that actually visit campus, and the percentage of the batch placed, not just the highest offer in the brochure.",
      },
      { type: "h2", text: "Fees and return on investment" },
      {
        type: "p",
        text: "Top autonomous institutes often charge more than a university-affiliated MBA because they reinvest in faculty, case materials and industry partnerships. Before you compare sticker prices, build a simple ROI picture: total fee minus scholarship, against the median package and the batch placement rate.",
      },
      { type: "quote", text: "A 30 second eligibility check can tell you how much scholarship you qualify for — before you even compare fees." },
      { type: "h2", text: "What to check before you apply in 2026" },
      {
        type: "ul",
        items: [
          "AICTE approval for the programme and the institute you are targeting",
          "Whether the PGDM is recognised by the affiliated university",
          "Median package and placement percentage of the last two batches",
          "Entrance exam accepted (CAT, MAT, XAT or the institute's own test)",
          "Scholarship policy — eligibility-based, not a lucky draw",
        ],
      },
      { type: "p", text: "Start with your entrance score and scholarship eligibility, build a shortlist of three to four institutes, and compare fees and placements side by side. That is the fastest way to turn a confusing search into a decision." },
    ],
  },
  {
    slug: "how-to-get-scholarship-mba-pgdm",
    title: "How to Get a Scholarship for MBA & PGDM Colleges in India",
    description:
      "MBA and PGDM scholarships in India can cut your fees by up to ₹30,000 or more. Learn how eligibility-based scholarships work, what documents you need and how to claim yours.",
    keywords: ["mba scholarship india", "pgdm scholarship", "college scholarship up to 30000", "eligibility based scholarship", "mba fee discount"],
    category: "Scholarships",
    readingMinutes: 5,
    publishedAt: "2026-09-10",
    author: "Orion Education Team",
    content: [
      {
        type: "p",
        text: "Most students assume scholarships are only for toppers or for those with extraordinary financial constraints. In reality, many colleges run eligibility-based scholarships where a simple combination of your stream, your score band and your programme unlocks a fixed discount — automatically applied to your fees.",
      },
      { type: "h2", text: "How eligibility-based scholarships work" },
      {
        type: "p",
        text: "Instead of judging hundreds of essays, institutes fix a scholarship amount that every eligible student gets. You answer three quick questions — your name, your stream and your score band — and the amount is computed instantly. It is transparent, it is predictable, and it is not a lottery.",
      },
      { type: "h2", text: "Who is eligible?" },
      {
        type: "ul",
        items: [
          "Recent graduates applying for MBA, PGDM, MCA or other masters programmes",
          "Students within a score band that the college has linked to a scholarship level",
          "Applicants who complete their enquiry and application within the scholarship window",
          "Students who finalise admission through a partner counsellor network",
        ],
      },
      { type: "h2", text: "How to claim your scholarship" },
      {
        type: "ol",
        items: [
          "Check your eligibility and get the amount in writing before you apply",
          "Select your target college and programme in the checker",
          "Submit one enquiry so a counsellor confirms the details and locks your estimate",
          "Complete the admission process and let the counsellor apply the scholarship against your fees",
        ],
      },
      { type: "quote", text: "At partner colleges, scholarship amounts run up to ₹30,000 — locked in against your fees the moment you confirm your seat." },
      { type: "h2", text: "Documents you will need" },
      {
        type: "p",
        text: "Keep your previous semester mark sheets, a valid ID and your entrance scorecard ready. Most colleges need a copy of these to validate eligibility, after which the discount is reflected in your fee structure.",
      },
      {
        type: "p",
        text: "Because the amount is eligibility-based rather than competitive, the best move is to check early and lock it in — before the intake closes for the 2026 academic year.",
      },
    ],
  },
  {
    slug: "top-mba-pgdm-colleges-bangalore-2026",
    title: "Top MBA & PGDM Colleges in Bangalore for 2026 Admissions",
    description:
      "Bangalore is one of India's strongest markets for MBA admissions. Compare the top MBA and PGDM colleges in Bangalore on fees, placements and scholarship eligibility for 2026.",
    keywords: ["top mba colleges bangalore", "best pgdm bangalore", "mba bangalore fees", "mba colleges placement bangalore", "pgdm admissions bangalore"],
    category: "Colleges",
    readingMinutes: 6,
    publishedAt: "2026-09-08",
    author: "Orion Education Team",
    content: [
      {
        type: "p",
        text: "Bangalore's mix of startups, multinationals and established IT firms makes it one of the most active campuses for MBA and PGDM hiring in India. But the city also has more programmes than you can visit — so a structured shortlist matters more than a long list.",
      },
      { type: "h2", text: "What makes Bangalore different" },
      {
        type: "p",
        text: "The city's proximity to product and services companies translates directly into internship and pre-placement offers. For students who want a programme with strong industry exposure, Bangalore institutes typically run projects, guest lectures and hiring cycles tied to the local corporate calendar.",
      },
      { type: "h2", text: "How to shortlist colleges" },
      {
        type: "ul",
        items: [
          "Filter by stream and city, then compare fees, ratings and placement records side by side",
          "Verify NIRF ranking and NAAC accreditation instead of relying on brochure claims",
          "Check the median package — not just the highest offer printed at the top of the brochure",
          "Confirm the entrance exam accepted and your fit on the score band",
          "Check scholarship eligibility for your score band before you pay any application fee",
        ],
      },
      { type: "h2", text: "Fees vs return" },
      {
        type: "p",
        text: "Bangalore programmes range widely in price, and a higher fee does not always mean a higher median package. Build a simple return picture for each shortlisted college: total fee minus scholarship, against median package and placement percentage.",
      },
      { type: "quote", text: "Up to ₹30,000 in scholarships at partner colleges — enough to move the fee side of your ROI calculation noticeably." },
      { type: "h2", text: "Next steps for 2026" },
      {
        type: "ul",
        items: [
          "Use the college finder to explore Bangalore MBA and PGDM programmes",
          "Run the ROI view on your top three colleges",
          "Check scholarship eligibility and submit a single enquiry to a counsellor",
        ],
      },
      {
        type: "p",
        text: "The search, the comparison and the scholarship can all happen in one afternoon. Start with your score band, and let verified data do the shortlisting for you.",
      },
    ],
  },
  {
    slug: "is-an-mba-worth-it-roi",
    title: "Is an MBA Worth It? The Real ROI of a Master's in Business",
    description:
      "An MBA can cost anywhere from a few lakhs to twenty-plus lakhs. Here is how to calculate the real return on investment — fees minus scholarship against median package and placement likelihood.",
    keywords: ["mba roi", "is an mba worth it", "mba fee vs placement", "return on investment mba", "mba worth it india"],
    category: "MBA & PGDM",
    readingMinutes: 5,
    publishedAt: "2026-09-05",
    author: "Orion Education Team",
    content: [
      {
        type: "p",
        text: "Every year, thousands of students ask whether an MBA is worth it. The sensible version of that question is not a yes or no — it is a calculation. Total likely investment today against expected salary growth after graduation.",
      },
      { type: "h2", text: "The real cost of an MBA" },
      {
        type: "p",
        text: "Your total investment is tuition plus hostel plus the salary you give up during the course. Scholarships reduce the tuition part directly. At partner colleges, eligibility-based scholarships up to ₹30,000 can lower the cost before you even begin comparing packages.",
      },
      { type: "h2", text: "The return side" },
      {
        type: "p",
        text: "Use three numbers, in order of reliability: the median package, the placement percentage for the last batch, and the salary growth within three years of graduating. Median and placement percentage tell you what a typical student actually gets; the highest package tells you only what the brochure wants you to see.",
      },
      { type: "h2", text: "A simple ROI calculation" },
      {
        type: "ol",
        items: [
          "Add up total fees over the programme duration",
          "Subtract any scholarship you are eligible for",
          "Multiply the median package by the placement percentage for a realistic expected return",
          "Compare that with your current or alternate salary trajectory over the next five years",
        ],
      },
      { type: "quote", text: "A 30-second eligibility check can tell you exactly how much of the fee disappears before you start your ROI math." },
      { type: "h2", text: "When an MBA is clearly worth it" },
      {
        type: "ul",
        items: [
          "You want to move from a technical or operations role into management",
          "Your target industry recruits on campus from the programme you are considering",
          "The median package and placement rate comfortably outrun the fees you will actually pay",
          "You can keep your cost low with a scholarship instead of financing the full fee",
        ],
      },
      { type: "p", text: "Run the numbers on every college in your shortlist with the same inputs, and the decision stops being emotional. The programme that wins on total investment versus realistic return is the one to start your applications with." },
    ],
  },
  {
    slug: "college-admission-documents-checklist",
    title: "First-Time Admission Guide: The 7 Documents Every College Asks For",
    description:
      "From mark sheets to migration certificates — the standard admission document checklist colleges in India ask for, organised so you can upload everything in one sitting.",
    keywords: ["college admission documents", "admission checklist", "mba documents needed", "document checklist college", "admission process india"],
    category: "Admissions",
    readingMinutes: 4,
    publishedAt: "2026-09-03",
    author: "Orion Education Team",
    content: [
      {
        type: "p",
        text: "Most admission delays are not caused by cut-offs or interviews — they are caused by missing documents uploaded at the last minute. Prepare the standard seven now and save yourself the scramble.",
      },
      { type: "h2", text: "The 7 documents checklist" },
      {
        type: "ul",
        items: [
          "Photograph and signature — keep a clean digital copy in a standard size",
          "Previous semester / degree mark sheets for every year of study",
          "Provisional or final degree certificate (or a bonafide letter if awaiting it)",
          "Entrance exam scorecard (CAT, MAT, XAT or the institute's own test)",
          "Government-issued ID — Aadhaar, PAN or passport",
          "Address proof — usually a driving licence or utility bill",
          "Migration or transfer certificate, plus caste/category certificate if applicable",
        ],
      },
      { type: "h2", text: "Format tips that save a round-trip" },
      {
        type: "p",
        text: "Most colleges accept PDF for certificates and JPG/PNG for photos and signatures. Scan each document at a readable resolution, keep the file names clearly labelled, and check whether the fee receipt needs to be uploaded separately.",
      },
      { type: "h2", text: "How scholarship documents fit in" },
      {
        type: "p",
        text: "If you are claiming an eligibility-based scholarship, the marks you upload double as the proof for your discount. That is why checking eligibility early and keeping your mark sheets ready speeds up the whole process.",
      },
      { type: "quote", text: "A single enquiry lets a counsellor confirm both your admission documents and your scholarship — in one follow-up, not six." },
      { type: "h2", text: "Do this today" },
      {
        type: "ol",
        items: [
          "Collect all seven documents into one folder",
          "Convert them to the formats your target colleges accept",
          "Check your scholarship eligibility so the amount is locked in before you apply",
        ],
      },
      { type: "p", text: "Handling paperwork early is the single easiest way to turn an application into an admission." },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}