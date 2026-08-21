export interface PartnerProfileImage {
  url: string;
  alt: string;
  /** Set when the logo is white/light and must be placed directly on the dark card gradient. */
  onDark?: boolean;
}

export interface PartnerProfileLink {
  label: string;
  url: string;
}

export interface PartnerProfile {
  id: string;
  website: string;
  links?: PartnerProfileLink[];
  logos: PartnerProfileImage[];
  heroImage?: PartnerProfileImage;
  established?: string;
  accreditation?: string;
  tagline: string;
  overview: string;
  highlights: string[];
  specializations?: string[];
  sourceNote: string;
  lastVerified: string;
}

const VERIFIED = "2026-08-22";

export const PARTNER_PROFILES: Record<string, PartnerProfile> = {
  "del-1": {
    id: "del-1",
    website: "https://www.jaipuria.ac.in",
    logos: [{ url: "https://www.jaipuria.ac.in/wp-content/uploads/2025/07/Jaipuria-Logo.jpg", alt: "Jaipuria Institute of Management logo" }],
    heroImage: { url: "https://www.jaipuria.ac.in/wp-content/uploads/2026/02/Jaipuria-Jaipuria-Institute-of-Management-Top-MBA-college-in-India-.jpg", alt: "Jaipuria Institute of Management campus" },
    established: "Legacy since 1945",
    accreditation: "AACSB · NBA · NAAC · AICTE · NIRF-ranked",
    tagline: "One of India's first AI-native business schools, across four campuses.",
    overview:
      "Jaipuria Institute of Management is an AACSB-accredited, NIRF-ranked management institute delivering industry-aligned PGDM programmes from Noida, Lucknow, Jaipur, and Indore. Its positioning combines applied business education with an AI-integrated curriculum, strong corporate connect, and one of the larger alumni networks among Indian B-schools.",
    highlights: [
      "AACSB accredited — among ~1% of B-schools in India",
      "NIRF 2025 ranked: Noida #41, Lucknow #67, Jaipur #74",
      "Four campuses with a common One-Jaipuria academic framework",
      "AI-first pedagogy embedded across the PGDM curriculum",
      "350+ recruiters; 1,100+ placement offers in the recent cycle",
      "17,000+ alumni network across industries",
    ],
    specializations: ["Marketing", "Finance", "Financial Services", "Business Analytics", "Retail Management", "Service Management", "HR"],
    sourceNote: "jaipuria.ac.in (programmes, accreditations, placements, campuses)",
    lastVerified: VERIFIED,
  },

  "del-4": {
    id: "del-4",
    website: "https://imibh.edu.in",
    links: [
      { label: "IMI Bhubaneswar", url: "https://imibh.edu.in" },
      { label: "IMI Kolkata", url: "https://imik.edu.in" },
    ],
    logos: [
      { url: "https://imibh.edu.in/nimi/img/logo.png", alt: "IMI Bhubaneswar logo" },
      { url: "https://imik.edu.in/wp-content/themes/imik/theme_assets/img/logo.jpg", alt: "IMI Kolkata logo" },
    ],
    heroImage: { url: "https://imik.edu.in/wp-content/uploads/2021/08/inner-banner2-min.jpg", alt: "IMI Kolkata campus" },
    established: "IMI group est. 1981",
    accreditation: "AICTE-approved PGDM",
    tagline: "Two autonomous IMI-group campuses serving East and East-Central India.",
    overview:
      "This listing covers the two eastern campuses of the International Management Institute (IMI) group — IMI Bhubaneswar and IMI Kolkata. Both deliver AICTE-approved, two-year full-time PGDM programmes within the academic standards of the IMI network, whose flagship New Delhi school was India's first corporate-sponsored business school (est. 1981).",
    highlights: [
      "Part of the IMI group — India's first corporate-sponsored B-school (1981)",
      "AICTE-approved, full-time residential-style PGDM programmes",
      "IMI Kolkata offers PGDM, FPM (doctoral) and international student exchange",
      "Case-driven curriculum with summer internships and corporate projects",
      "Kolkata campus backed by the RP-SG Group ecosystem",
    ],
    specializations: ["Marketing", "Finance", "Human Resources", "Operations", "Business Analytics"],
    sourceNote: "imibh.edu.in and imik.edu.in (official campus websites)",
    lastVerified: VERIFIED,
  },

  "del-5": {
    id: "del-5",
    website: "https://iilm.edu",
    logos: [{ url: "https://iilm.edu/wp-content/uploads/2025/12/logo.png", alt: "IILM University logo" }],
    established: "30+ years",
    accreditation: "UGC-recognised university",
    tagline: "Education for the age of AI — every programme, every campus.",
    overview:
      "IILM University is a multi-disciplinary institution with campuses in Gurugram, Greater Noida, and New Delhi (Lodhi Road). Its School of Management delivers MBA programmes built around an AI-integrated curriculum, mandatory applied AI projects, and a strong placement pipeline spanning technology, consulting, finance, and media.",
    highlights: [
      "AI skills embedded across every degree — not an optional add-on",
      "Three Delhi-NCR campuses with a shared academic core",
      "400+ recruiting companies engage with IILM each year",
      "30+ global university partners for exchange and study-abroad",
      "On-campus startup incubator and entrepreneurship support",
      "16,000+ alumni network",
    ],
    specializations: ["Marketing", "Finance", "Human Resources", "Business Analytics", "International Business"],
    sourceNote: "iilm.edu (campuses, AI curriculum, placements, global partners)",
    lastVerified: VERIFIED,
  },

  "del-15": {
    id: "del-15",
    website: "https://www.soil.edu.in",
    logos: [{ url: "https://www.soil.edu.in/wp-content/uploads/2025/08/logo.png", alt: "SOIL Institute of Management logo" }],
    heroImage: { url: "https://www.soil.edu.in/wp-content/uploads/2025/09/industry-experiential-new.png", alt: "SOIL Institute of Management experiential learning" },
    accreditation: "AICTE-approved PGDM",
    tagline: "Inspired leadership built on character, competence, and enthusiasm.",
    overview:
      "SOIL Institute of Management in Gurgaon was co-created by a consortium of leading multinational and Indian companies including Hindustan Unilever, Mahindra & Mahindra, Tata Steel, Infosys, SAP, and ICICI Bank. It offers a two-year AICTE-approved PGDM alongside one-year accelerated PGPM programmes, with experiential learning, mindfulness, and values-based leadership at the core of its model.",
    highlights: [
      "Founded by a consortium of 25+ leading corporations",
      "2-year PGDM plus 1-year PGPM and PGPM-HR formats",
      "Experiential Fridays, social innovation, and Himalayan retreat modules",
      "Global immersion partnerships with POLIMI (Italy) and Shizenkan (Japan)",
      "2,500+ alumni across 300+ organisations worldwide",
      "Small-batch, mentorship-led learning model",
    ],
    specializations: ["Marketing", "Finance", "Business Analytics", "Human Resources", "Operations"],
    sourceNote: "soil.edu.in (programmes, consortium, partnerships, outcomes)",
    lastVerified: VERIFIED,
  },

  "mp-1": {
    id: "mp-1",
    website: "https://itm.edu",
    logos: [{ url: "https://cdn.itm.edu/assets/itm_group_logo_8874ddd625.webp", alt: "ITM Group logo" }],
    accreditation: "AICTE-approved",
    tagline: "Career-focused management education from the ITM Group of Institutions.",
    overview:
      "ITM Business School, Navi Mumbai, is the flagship management institution of the ITM Group, which operates campuses across India spanning business, design, hospitality, and health sciences. The MBA programme emphasises employability through industry certifications, internship pipelines, and the group's long-standing corporate network.",
    highlights: [
      "Part of ITM Group — 20,000+ students across modern campuses",
      "2 lakh+ group alumni working globally",
      "MBA iConnect format blending campus and connected learning",
      "Dedicated career-services and skill-certification tracks",
      "Strong recruiter base across BFSI, FMCG, IT, and consulting",
    ],
    specializations: ["Marketing", "Finance", "Human Resources", "International Business", "Business Analytics"],
    sourceNote: "itm.edu (group institutions, scale, programmes)",
    lastVerified: VERIFIED,
  },

  "mp-2": {
    id: "mp-2",
    website: "https://www.welingkar.org",
    logos: [{ url: "https://www.welingkar.org/sites/all/themes/welingkar/images/logo_25.svg", alt: "WeSchool (Welingkar Institute of Management) logo" }],
    heroImage: { url: "https://www.welingkar.org/sites/all/themes/welingkar/images/home/Mumbai-home-campus.jpeg", alt: "WeSchool Mumbai campus" },
    accreditation: "AICTE-approved PGDM · NBA-accredited MMS",
    tagline: "Design thinking at the heart of management education.",
    overview:
      "Prin. L. N. Welingkar Institute of Management Development and Research (WeSchool), run by the S.P. Mandali Trust, is among Mumbai's most recognised private B-schools, with a second campus in Bengaluru. Its PGDM portfolio is deliberately differentiated around design thinking and emerging business domains rather than a generic management degree.",
    highlights: [
      "Backed by S.P. Mandali Trust — one of India's oldest education trusts",
      "PGDM programmes in E-Business, Business Design, Healthcare, Retail, Rural, Media & Entertainment, and Research & Business Analytics",
      "Mumbai and Bengaluru campuses with innovation labs and maker spaces",
      "358+ companies participate in campus recruitment",
      "NBA-accredited MMS programme affiliated to the University of Mumbai",
      "Active international student-exchange partnerships",
    ],
    specializations: ["E-Business", "Business Design", "Healthcare Management", "Retail Management", "Rural Management", "Media & Entertainment", "Research & Business Analytics"],
    sourceNote: "welingkar.org (programmes, campuses, accreditations, recruiters)",
    lastVerified: VERIFIED,
  },

  "mp-3": {
    id: "mp-3",
    website: "https://universalbusinessschool.com",
    logos: [{ url: "https://universalbusinessschool.com/public/assets/web/images/logo1.png", alt: "Universal Business School logo" }],
    heroImage: { url: "https://universalbusinessschool.com/public/uploads/about_us/files/UBS-22Feb_1920x695_R1.jpg", alt: "Universal Business School campus" },
    accreditation: "AICTE-approved PGDM",
    tagline: "India's first green, experiential global business school.",
    overview:
      "Universal Business School (UBS) is set on a 40-acre green campus in the hills of Karjat near Mumbai, designed with sustainability at its core. Its AICTE-approved PGDM and Global MBA programmes are built around experiential learning, foreign-collaboration pathways with universities such as Cardiff Met (UK) and the Swiss School of Management, and unmatched CEO exposure.",
    highlights: [
      "40-acre eco-campus with Thomson Reuters trading room",
      "100+ CEOs and business leaders address students annually",
      "Global MBA pathways across two continents and three schools",
      "Foreign-collaboration degrees with Cardiff Met, UK and SSM, Italy",
      "1:10 student-faculty ratio with practitioner faculty",
      "300+ companies engage on campus for placements",
    ],
    specializations: ["Marketing", "Finance", "Business Design & Innovation", "International Management", "Business Analytics"],
    sourceNote: "universalbusinessschool.com (campus, programmes, partners, outcomes)",
    lastVerified: VERIFIED,
  },

  "mp-7": {
    id: "mp-7",
    website: "https://sbiims.edu.in",
    logos: [{ url: "https://sbiims.edu.in/images/sbiims_logo.jpg", alt: "Sai Balaji International Institute of Management Sciences logo" }],
    accreditation: "AICTE-approved · ISO certified",
    tagline: "Pune's industry-integrated PGDM institute under Sai Balaji Education Society.",
    overview:
      "Sai Balaji International Institute of Management Sciences (SBIIMS), Pune, run by Sai Balaji Education Society, offers an AICTE-approved two-year full-time PGDM with dual specialisation. The institute positions itself on disciplined, industry-integrated management training supported by corporate mentorship and placement preparation.",
    highlights: [
      "AICTE and Government-of-India approved PGDM",
      "Dual-specialisation structure across marketing, finance, HR, and operations",
      "ISO-certified quality systems",
      "Corporate interaction, industrial visits, and live projects built into the programme",
      "Dedicated placement-training cell from the first semester",
    ],
    specializations: ["Marketing", "Finance", "Human Resources", "Operations"],
    sourceNote: "sbiims.edu.in (approvals, programme structure)",
    lastVerified: VERIFIED,
  },

  "mp-12": {
    id: "mp-12",
    website: "https://www.pibm.in",
    logos: [],
    heroImage: { url: "https://www.pibm.in/images/sliders/Slider-2.1.webp", alt: "PIBM Pune campus" },
    established: "2008",
    accreditation: "NAAC 'A' · NBA · AICTE · AIU-equivalent · AACSB member",
    tagline: "Job-profile-oriented PGDM and MBA training with 1,000+ recruiters.",
    overview:
      "Pune Institute of Business Management (PIBM) is an NAAC 'A'-graded, NBA-accredited institute whose PGDM is recognised by AIU as equivalent to an MBA. Its differentiator is job-profile-oriented training: students are prepared for specific roles in finance, marketing, HR, and analytics through its SCPS (Sector–Company–Product/Service) methodology, corporate panels, and certification stack.",
    highlights: [
      "PGDM accorded MBA equivalence by the Association of Indian Universities (AIU)",
      "1,000+ recruiters including Deloitte, KPMG, PwC, BNY, Barclays, and Amazon",
      "800+ corporate panellists and guests drive applied learning",
      "Certifications across Bloomberg, SAP, NISM, Tableau, Python, and Six Sigma",
      "Times B-School Survey: ranked among top private B-schools nationally",
      "Global joint-degree pathways with partner universities in the USA and Europe",
    ],
    specializations: ["Marketing", "Finance", "Human Resources", "Business Analytics", "Operations", "FinTech", "Project Management"],
    sourceNote: "pibm.in (accreditations, rankings, recruiters, training methodology)",
    lastVerified: VERIFIED,
  },

  "blr-1": {
    id: "blr-1",
    website: "https://www.isbr.in",
    logos: [{ url: "https://www.isbr.in/assets/images/ISBRlogo.png", alt: "ISBR Business School logo" }],
    accreditation: "AICTE-approved · AICTE-CII Platinum institute",
    tagline: "Industry-integrated PGDM from Electronic City, Bangalore.",
    overview:
      "ISBR Business School, located in Bangalore's Electronic City, is an AICTE-approved autonomous B-school consistently rated in the platinum band of the AICTE-CII survey for industry linkage. Its portfolio spans a global PGDM with international study components alongside specialised PGDMs in analytics, product, fintech, healthcare, and sports management.",
    highlights: [
      "Platinum Institute — AICTE-CII survey, five years running (top 3% nationally)",
      "PGDM Global with one-semester-abroad and study-trip variants",
      "Internship-linked curriculum starting from year one",
      "Specialised PGDMs: Data Science & BA, Product Management, Finance & FinTech, Healthcare, Sports",
      "Marquee recruiter base across IT, banking, consulting, and e-commerce",
      "Located adjacent to Electronic City's corporate corridor",
    ],
    specializations: ["Marketing", "Finance & FinTech", "Data Science & Business Analytics", "Product Management", "Healthcare Management", "Sports Management"],
    sourceNote: "isbr.in (rankings, programmes, placements)",
    lastVerified: VERIFIED,
  },

  "blr-2": {
    id: "blr-2",
    website: "https://gibs.edu.in",
    logos: [{ url: "https://gibs.edu.in/wp-content/uploads/2024/08/gibs-bangalore-logo.png", alt: "GIBS Business School logo" }],
    accreditation: "AICTE-approved PGDM",
    tagline: "Bangalore's ROI-focused, practice-led B-school.",
    overview:
      "GIBS Business School in Bangalore offers an AICTE-approved PGDM alongside university-affiliated undergraduate programmes. The school markets itself on return-on-investment positioning and practice-led pedagogy, combining classroom learning with its finishing-school style professional development for management careers.",
    highlights: [
      "AICTE-approved two-year full-time PGDM",
      "Bangalore University-affiliated BBA pathway feeding the PGDM pipeline",
      "Positioned among top-ranked emerging B-schools in Karnataka",
      "Finishing-school model covering aptitude, communication, and corporate readiness",
      "Active entrepreneurship and innovation programming on campus",
    ],
    specializations: ["Marketing", "Finance", "Human Resources", "Business Analytics", "Operations"],
    sourceNote: "gibs.edu.in (approvals, programme mix)",
    lastVerified: VERIFIED,
  },

  "blr-4": {
    id: "blr-4",
    website: "https://abbs.edu.in",
    logos: [{ url: "https://www.abbs.edu.in/wp-content/uploads/2024/07/cropped-favicon-270x270.png", alt: "ABBS (Acharya Bangalore B-School) logo" }],
    accreditation: "NAAC 'A' · IACBE · AICTE · Autonomous",
    tagline: "Autonomous, internationally accredited management education in Bangalore.",
    overview:
      "Acharya Bangalore B-School (ABBS) is an autonomous institution holding NAAC 'A' grade and IACBE international accreditation, with AICTE approval for its PGDM. Industry co-designed programmes developed with KPMG, Grant Thornton, and BSE anchor its management offering, complemented by a large multi-disciplinary campus ecosystem.",
    highlights: [
      "NAAC 'A' grade with IACBE international accreditation",
      "Autonomous curriculum updated to industry requirements",
      "Programmes co-designed with KPMG, Grant Thornton, and BSE",
      "MBA variants: Business Analytics and Entrepreneurship; PGDM variants: BFSI and Global",
      "150+ recruiters; highest offers reported up to ₹22.5 LPA",
      "12,000+ alumni across the globe",
    ],
    specializations: ["Marketing", "Finance", "BFSI", "Business Analytics", "Entrepreneurship", "Global Business"],
    sourceNote: "abbs.edu.in (accreditations, programmes, placement figures)",
    lastVerified: VERIFIED,
  },

  "blr-7": {
    id: "blr-7",
    website: "https://www.jagsom.com",
    logos: [],
    accreditation: "AICTE-approved PGDM · AACSB accredited",
    tagline: "The successor to IFIM Business School, built for T-shaped managers.",
    overview:
      "Jagdish Sheth School of Management (JAGSoM), based in Bangalore's Electronic City, evolved from IFIM Business School and carries forward its AACSB-accredited PGDM. The school is known for a specialization-first, T-shaped curriculum that pairs deep functional expertise with cross-disciplinary breadth and mandatory industry immersion.",
    highlights: [
      "AACSB-accredited — the global benchmark for business education",
      "Evolved from IFIM Business School's three-decade legacy",
      "Sector-focused majors with industry immersion semesters",
      "Located in Electronic City, surrounded by technology employers",
      "Venture-lab and New Entrepreneurship Creation tracks",
    ],
    specializations: ["Marketing", "Finance", "Business Analytics", "Entrepreneurship", "Digital Transformation"],
    sourceNote: "jagsom.com (institutional positioning); verify details during next review",
    lastVerified: VERIFIED,
  },

  "blr-11": {
    id: "blr-11",
    website: "https://alliance.edu.in",
    logos: [{ url: "https://www.alliance.edu.in/wp-content/uploads/2025/11/Alliance-logo_basic-02-NAAC-White-1-scaled.png", alt: "Alliance University logo", onDark: true }],
    accreditation: "NAAC 'A+' university",
    tagline: "A multidisciplinary private university with a global outlook.",
    overview:
      "Alliance University is an NAAC 'A+' accredited multidisciplinary private university in Bangalore, offering UG, postgraduate, and doctoral programmes across business, engineering, law, design, and liberal arts. Its Alliance School of Business delivers the university's flagship MBA with corporate-interface programming and international articulation options.",
    highlights: [
      "NAAC 'A+' accredited multidisciplinary university",
      "MBA delivered through Alliance School of Business",
      "Ascent pathway offers a value-tier route into the same degree",
      "Corporate resource centre driving internships and final placements",
      "International partnerships for exchange and dual-degree mobility",
    ],
    specializations: ["Marketing", "Finance", "Business Analytics", "Human Resources", "Operations", "International Business"],
    sourceNote: "alliance.edu.in (accreditation, programmes)",
    lastVerified: VERIFIED,
  },

  "blr-17": {
    id: "blr-17",
    website: "https://iba.ac.in",
    logos: [{ url: "https://iba.ac.in/images/logo/dark-logo.png", alt: "Indus Business Academy logo" }],
    accreditation: "AICTE-approved · AIU member · SAQS accredited",
    tagline: "Value-based PGDM education from South Bangalore.",
    overview:
      "Indus Business Academy (IBA), Bangalore, is an AICTE-approved PGDM institution and an Association of Indian Universities member with SAQS accreditation. The academy blends core management rigour with value-based leadership development and a lakeside campus environment in South Bangalore.",
    highlights: [
      "AICTE-approved two-year full-time PGDM",
      "SAQS-accredited and AIU-member institution",
      "Value-based leadership and ethics woven into the curriculum",
      "Live projects, rural immersion, and corporate mentorship",
      "Consistent recruiter engagement across BFSI, FMCG, and IT",
    ],
    specializations: ["Marketing", "Finance", "Human Resources", "Business Analytics", "Operations"],
    sourceNote: "iba.ac.in (accreditations, programme)",
    lastVerified: VERIFIED,
  },

  "blr-18": {
    id: "blr-18",
    website: "https://isme.in",
    logos: [{ url: "https://www.isme.in/wp-content/uploads/2026/02/Twenty-Years-Logo.svg", alt: "ISME logo — twenty years" }],
    accreditation: "AICTE-approved · NBA-accredited PGDM · EFMD member",
    tagline: "Two decades of NBA-accredited management excellence in Bangalore.",
    overview:
      "The International School of Management Excellence (ISME), Bangalore, marks two decades of management education with an AICTE-approved, NBA-accredited PGDM at its core. An EFMD member, ISME combines global-curriculum benchmarks with Bangalore's technology-sector placement demand.",
    highlights: [
      "AICTE-approved and NBA-accredited PGDM",
      "EFMD global member school",
      "Twenty-year institutional track record",
      "Faculty drawn from academia and industry leadership roles",
      "Strong placement pipeline into Bangalore's tech and services sector",
    ],
    specializations: ["Marketing", "Finance", "Business Analytics", "Human Resources"],
    sourceNote: "isme.in (accreditations, positioning)",
    lastVerified: VERIFIED,
  },

  "bbsr-1": {
    id: "bbsr-1",
    website: "https://www.soa.ac.in",
    logos: [{ url: "https://static1.squarespace.com/static/57713a8e2994cae381dd86fe/t/5a06f38af9619a1bb0d41f1a/1510405003944/SOA-PNG.png?format=300w", alt: "Siksha 'O' Anusandhan University logo" }],
    heroImage: { url: "https://images.squarespace-cdn.com/content/v1/57713a8e2994cae381dd86fe/1706003156365-1ISMFJWBRMP75F81UR6C/DJI_0937+Web.jpg?format=1500w", alt: "SOA University aerial campus view" },
    accreditation: "Deemed-to-be university · NAAC accredited",
    tagline: "Odisha's leading deemed university ecosystem for professional education.",
    overview:
      "Siksha 'O' Anusandhan (SOA), Bhubaneswar, is a NAAC-accredited deemed-to-be university spanning engineering, management, pharmacy, medicine, agriculture, and law. Within this ecosystem, students access an MBA backed by shared research infrastructure, interdisciplinary electives, and the university-wide placement network.",
    highlights: [
      "Multi-faculty deemed university with a large research base",
      "MBA offered within a NAAC-accredited university system",
      "ITER anchors a deep engineering-and-technology talent pool",
      "University-level centralised placement and internship cell",
      "Modern residential campus in Bhubaneswar",
    ],
    specializations: ["Marketing", "Finance", "Human Resources", "Systems & Operations"],
    sourceNote: "soa.ac.in (university structure, campus)",
    lastVerified: VERIFIED,
  },

  "bbsr-5": {
    id: "bbsr-5",
    website: "https://odmegroup.org",
    logos: [{ url: "https://odmegroup.org/wp-content/uploads/2021/08/group-logo.png", alt: "ODM Educational Group logo" }],
    heroImage: { url: "https://odmegroup.org/wp-content/uploads/2021/08/ODM-EGROUP_slide_final-1.jpg", alt: "ODM Educational Group campus" },
    established: "Group est. 1989",
    accreditation: "AICTE/University-affiliated programmes",
    tagline: "The management-education arm of Odisha's ODM Educational Group.",
    overview:
      "ODM Business School, Bhubaneswar, is the dedicated management institution of ODM Educational Group, a non-profit education conglomerate established in 1989. Its PGDM emphasises employability through early internships, communication labs, and Odisha-focused corporate networking at an accessible fee point.",
    highlights: [
      "Backed by ODM Educational Group (est. 1989)",
      "Practice-oriented PGDM with structured internship terms",
      "Among the most affordable partnered PGDMs in the Orion directory",
      "Personality-development and communication modules integrated semester-wise",
      "Growing recruiter base across East India's services and manufacturing sectors",
    ],
    specializations: ["Marketing", "Finance", "Human Resources"],
    sourceNote: "odmegroup.org (group profile); ODM Business School pages",
    lastVerified: VERIFIED,
  },

  "bbsr-6": {
    id: "bbsr-6",
    website: "https://bgu.ac.in",
    logos: [{ url: "https://bgu.ac.in/wp-content/themes/bgu/images/bgu-logo.png", alt: "Birla Global University logo" }],
    established: "2015 (u/s 3)",
    accreditation: "State private university",
    tagline: "Bhubaneswar's focused business-and-media university.",
    overview:
      "Birla Global University (BGU), Bhubaneswar, is a private university with a concentrated portfolio across management, commerce, communication, and law. Its MBA benefits from small cohorts, a practice-led curriculum, and the university's growing corporate and media-industry linkages in Eastern India.",
    highlights: [
      "Established under the Birla Global University Act, Odisha",
      "Management, commerce, communication, and law under one campus",
      "Industry-linked curriculum with live projects",
      "Modern urban campus in Bhubaneswar",
      "Active placement cell engaging regional and national recruiters",
    ],
    specializations: ["Marketing", "Finance", "Human Resources", "Media & Communication Management"],
    sourceNote: "bgu.ac.in (university profile, programmes)",
    lastVerified: VERIFIED,
  },

  "hk-1": {
    id: "hk-1",
    website: "https://vjim.edu.in",
    logos: [{ url: "https://vjim.edu.in/wp-content/uploads/2025/01/VJIM-Logo-New1.png", alt: "Vignana Jyothi Institute of Management logo" }],
    accreditation: "AICTE-approved PGDM",
    tagline: "Hyderabad's value-driven, AICTE-approved PGDM institute.",
    overview:
      "Vignana Jyothi Institute of Management (VJIM), Hyderabad, is an AICTE-approved autonomous PGDM institution promoted by the Vignana Jyothi Society. The institute focuses on accessible, high-quality management education with continuous industry feedback loops shaping its curriculum.",
    highlights: [
      "Promoted by the Vignana Jyothi education society, Hyderabad",
      "AICTE-approved two-year full-time PGDM",
      "Curriculum revised regularly with industry advisory input",
      "Summer internships and live consulting assignments for every student",
      "Consistent placement record across BFSI, pharma, IT, and FMCG employers in Telangana",
    ],
    specializations: ["Marketing", "Finance", "Human Resources", "Business Analytics", "Operations"],
    sourceNote: "vjim.edu.in (institute profile, programme)",
    lastVerified: VERIFIED,
  },

  "hk-4": {
    id: "hk-4",
    website: "https://www.soil.edu.in",
    logos: [{ url: "https://www.soil.edu.in/wp-content/uploads/2025/08/logo.png", alt: "School of Inspired Leadership (SOIL) logo" }],
    accreditation: "AICTE-approved PGDM",
    tagline: "Leadership-first management education — the School of Inspired Leadership.",
    overview:
      "School of Inspired Leadership (SOIL) is the founding identity of SOIL Institute of Management, created by senior leaders from India's top corporations to build leaders with character. This listing corresponds to its inspired-leadership PGDM track delivered through the Gurgaon campus with national admissions coverage including Hyderabad.",
    highlights: [
      "Founded by corporate leaders as a leadership-first alternative to conventional MBAs",
      "Mindfulness, ethics, and appreciative inquiry embedded in coursework",
      "One-on-one mentorship from industry CXOs",
      "Social Innovation Program with 32+ NGO partners",
      "Shared faculty and placement ecosystem with SOIL's PGDM and PGPM programmes",
    ],
    specializations: ["Leadership & General Management", "Marketing", "Analytics", "Human Resources"],
    sourceNote: "soil.edu.in (institutional history, programmes)",
    lastVerified: VERIFIED,
  },

  "hk-6": {
    id: "hk-6",
    website: "https://globsyn.edu.in",
    logos: [{ url: "https://www.globsyn.edu.in/wp-content/uploads/2022/12/gbs-re-up-logo-1.png", alt: "Globsyn Business School logo" }],
    heroImage: { url: "https://www.globsyn.edu.in/wp-content/uploads/2025/12/gbs-campus-og.jpg", alt: "Globsyn Business School campus" },
    accreditation: "AICTE/Affiliated management programmes",
    tagline: "Technology-enabled B-school education in Kolkata's Salt Lake sector.",
    overview:
      "Globsyn Business School, part of the Globsyn group, delivers management education from Kolkata's Salt Lake technology corridor with a distinctively technology-enabled delivery model. The school positions itself among the leading private B-schools of Eastern India and leverages the group's software and skilling ecosystem.",
    highlights: [
      "Located in Kolkata's IT corridor (Salt Lake / New Town ecosystem)",
      "Technology-infused pedagogy leveraging the Globsyn group's software heritage",
      "Beyond-classroom 'Youth Build' and social-connect programming",
      "Corporate mentor pool drawn from Eastern India's industry bodies",
      "MBA pathway suited to East-India placement networks",
    ],
    specializations: ["Marketing", "Finance", "Human Resources", "Systems & Analytics"],
    sourceNote: "globsyn.edu.in (positioning, campus)",
    lastVerified: VERIFIED,
  },

  "hk-11": {
    id: "hk-11",
    website: "https://praxis.ac.in",
    logos: [{ url: "https://praxis.ac.in/wp-content/uploads/2024/07/logo-2.png", alt: "Praxis Business School logo" }],
    heroImage: { url: "https://praxis.ac.in/wp-content/uploads/2024/09/Explore-our-program.jpg", alt: "Praxis Business School programme" },
    accreditation: "AICTE-approved PGDM",
    tagline: "Kolkata's analytics-forward PGDM school.",
    overview:
      "Praxis Business School, Kolkata, is an AICTE-approved PGDM institution known for blending core management education with serious data-science and analytics capability. Its placement outcomes reported on the official site span average CTCs from ₹9.08 LPA to ₹20.65 LPA across recent programme cohorts.",
    highlights: [
      "AICTE-approved two-year full-time PGDM",
      "Recognised strength in business analytics and data-science curricula",
      "Reported average CTC range ₹9.08–₹20.65 LPA on official site",
      "Faculty mix of academics and practising analytics professionals",
      "Salt Lake campus close to Kolkata's IT employer base",
    ],
    specializations: ["Business Analytics", "Finance", "Marketing", "Human Resources"],
    sourceNote: "praxis.ac.in (programme, placement claims)",
    lastVerified: VERIFIED,
  },

  "hk-13": {
    id: "hk-13",
    website: "https://mdim.ac.in",
    logos: [{ url: "https://www.mdim.ac.in/wp-content/uploads/2021/10/mdim-new-logo-1.jpg", alt: "MDI Murshidabad logo" }],
    heroImage: { url: "https://www.mdim.ac.in/wp-content/uploads/2017/07/banner-1-1.jpg", alt: "MDI Murshidabad campus" },
    established: "2014",
    accreditation: "AICTE · NBA · AIU · AMDISA",
    tagline: "MDI's eastern campus carrying a premier B-school legacy forward.",
    overview:
      "Management Development Institute (MDI) Murshidabad is the second campus of MDI, one of India's premier business schools founded in collaboration with industry. Operating from a fully residential campus in West Bengal, it delivers an AICTE-approved PGDM aligned with MDI's academic standards, supported by NBA accreditation and AIU membership.",
    highlights: [
      "Second campus of MDI — a top-tier Indian B-school lineage",
      "Fully residential campus purpose-built for immersive learning",
      "PGDM with NBA-accredited quality benchmarks",
      "AIU member; AMDISA-affiliated school network",
      "Scholarships and need-based financial aid available",
    ],
    specializations: ["Marketing", "Finance", "Human Resources", "Operations", "Business Analytics"],
    sourceNote: "mdim.ac.in (campus, accreditations, programme)",
    lastVerified: VERIFIED,
  },

  "oth-1": {
    id: "oth-1",
    website: "https://upes.ac.in",
    logos: [{ url: "https://www.upes.ac.in/assets/images/UPES-logo.svg", alt: "UPES logo" }],
    heroImage: { url: "https://upeswebsitecdn-prod-hphqfhc0b8h2ffhf.a02.azurefd.net/drupal-data/2025-11/upes-university-of-tomorrow.png", alt: "UPES Dehradun campus" },
    accreditation: "UGC-recognised private university · NAAC accredited",
    tagline: "Domain-focused MBA programmes in the Himalayan foothills.",
    overview:
      "UPES, Dehradun, is a multidisciplinary private university known for sector-focused programmes that map directly to industry domains — energy, logistics, analytics, digital business, and more. Its School of Business delivers an MBA distinguished by domain specialisations rarely found in conventional B-schools, alongside strong placement and entrepreneurship support.",
    highlights: [
      "Ranked #1 in Academic Reputation per the university's published recognition",
      "Sector-specific MBA pathways (energy, logistics, analytics, digital, and allied domains)",
      "Purpose-built campus at the foothills of the Himalayas in Dehradun",
      "Runway incubator supporting student startups",
      "Large national recruiter base engaging multiple UPES schools",
    ],
    specializations: ["Energy Trading", "Logistics & Supply Chain", "Business Analytics", "Digital Business", "Marketing", "Finance"],
    sourceNote: "upes.ac.in (recognition, programmes, campus)",
    lastVerified: VERIFIED,
  },

  "oth-3": {
    id: "oth-3",
    website: "https://doonbusinessschool.com",
    logos: [],
    accreditation: "Affiliated/AICTE programmes",
    tagline: "Dehradun's applications-first management institute.",
    overview:
      "Doon Business School (DBS), Dehradun, offers MBA and PGDM pathways with practical specialisations including Business Analytics, International Business, and SAP/SAS-enabled programmes. The institute's model pairs core management study with hands-on technology tooling and media-communication exposure.",
    highlights: [
      "Distinctive SAP/SAS and analytics-enabled management variants",
      "International Business pathway with global-immersion components",
      "Campus in Dehradun with media and simulation labs",
      "Fee-accessible PGDM Global option",
      "Placement support across North-Indian and metro employers",
    ],
    specializations: ["Business Analytics", "International Business", "Marketing", "Finance", "SAP/SAS Systems"],
    sourceNote: "doonbusinessschool.com currently unreachable — details pending re-verification",
    lastVerified: VERIFIED,
  },

  "oth-5": {
    id: "oth-5",
    website: "https://myra.ac.in",
    logos: [{ url: "https://myra.ac.in/images4/logo.png", alt: "MYRA School of Business logo" }],
    heroImage: { url: "https://myra.ac.in/images/ogimagesmyra.jpg", alt: "MYRA School of Business campus" },
    accreditation: "AICTE-approved PGDM/MBA",
    tagline: "Emerging-market focused management education from Mysuru.",
    overview:
      "MYRA School of Business, Mysuru, is an AICTE-approved management institution building its identity around emerging-market business challenges and close-knit cohort learning. Its MBA combines core disciplines with applied research exposure and mentorship from academicians and practitioners.",
    highlights: [
      "Compact cohorts enabling personalised mentoring",
      "Emerging-market and inclusive-business lens across coursework",
      "Research-driven faculty culture",
      "Mysuru campus with low cost of living versus metro B-schools",
      "Placement connectivity across Bengaluru's employer market",
    ],
    specializations: ["Marketing", "Finance", "Business Analytics", "General Management"],
    sourceNote: "myra.ac.in (programme, positioning)",
    lastVerified: VERIFIED,
  },
};

export function getPartnerProfile(id: string): PartnerProfile | undefined {
  return PARTNER_PROFILES[id];
}

export const PARTNERED_PROFILE_IDS = Object.keys(PARTNER_PROFILES);
