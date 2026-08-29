export interface AbroadCollege {
  id: string;
  name: string;
  country: string;
  flag: string;
  city: string;
  type: string;
  qsRanking?: string;
  popularPrograms: string[];
  estAnnualFee: string;
  duration: string;
  description: string;
  website: string;
}

export interface StudyAbroadFields {
  countries: string[];
  levels: string[];
  fields: string[];
}

export const COUNTRIES = [
  "USA",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "Ireland",
  "New Zealand",
  "Singapore",
  "UAE",
  "Netherlands",
];

export const LEVELS = [
  "Bachelor's Degree",
  "Master's Degree",
  "PhD / Doctorate",
  "Diploma / PG Diploma",
  "Language Course",
];

export const FIELDS = [
  "Computer Science / IT",
  "Engineering",
  "Business / Management",
  "Data Science / AI",
  "Healthcare / Medicine",
  "Law",
  "Arts / Design",
  "Psychology",
  "Finance / Economics",
  "Other",
];

export const STUDY_ABROAD_COLLEGES: AbroadCollege[] = [
  {
    id: "utoronto",
    name: "University of Toronto",
    country: "Canada",
    flag: "🇨🇦",
    city: "Toronto, Ontario",
    type: "Public",
    qsRanking: "QS #21",
    popularPrograms: ["Computer Science", "Engineering", "Business"],
    estAnnualFee: "CAD 58,000",
    duration: "3–4 years",
    description: "Canada's top-ranked university, renowned for research and a vibrant global campus in downtown Toronto.",
    website: "https://www.utoronto.ca",
  },
  {
    id: "melbourne",
    name: "University of Melbourne",
    country: "Australia",
    flag: "🇦🇺",
    city: "Melbourne, Victoria",
    type: "Public",
    qsRanking: "QS #13",
    popularPrograms: ["Data Science", "Business", "Law"],
    estAnnualFee: "AUD 48,000",
    duration: "3–4 years",
    description: "Australia's leading university, consistently ranked among the world's best for employability and research.",
    website: "https://www.unimelb.edu.au",
  },
  {
    id: "tumunich",
    name: "Technical University of Munich",
    country: "Germany",
    flag: "🇩🇪",
    city: "Munich, Bavaria",
    type: "Public",
    qsRanking: "QS #28",
    popularPrograms: ["Engineering", "Computer Science", "Physics"],
    estAnnualFee: "€0 (tuition-free)",
    duration: "2–4 years",
    description: "Germany's premier technical university with low or no tuition and strong industry ties to BMW, Siemens & SAP.",
    website: "https://www.tum.de",
  },
  {
    id: "ucdublin",
    name: "University College Dublin",
    country: "Ireland",
    flag: "🇮🇪",
    city: "Dublin, Leinster",
    type: "Public",
    qsRanking: "QS #126",
    popularPrograms: ["Computer Science", "Business", "Pharmacy"],
    estAnnualFee: "€24,000",
    duration: "3–4 years",
    description: "Ireland's largest university, a gateway to Europe's booming tech and pharma sector in Dublin.",
    website: "https://www.ucd.ie",
  },
  {
    id: "asustate",
    name: "Arizona State University",
    country: "USA",
    flag: "🇺🇸",
    city: "Tempe, Arizona",
    type: "Public",
    qsRanking: "QS #184",
    popularPrograms: ["Computer Science", "Engineering", "Business"],
    estAnnualFee: "USD 32,000",
    duration: "4 years",
    description: "America's most innovative university, with strong STEM programs and generous scholarship opportunities.",
    website: "https://www.asu.edu",
  },
  {
    id: "birmingham",
    name: "University of Birmingham",
    country: "United Kingdom",
    flag: "🇬🇧",
    city: "Birmingham, England",
    type: "Public",
    qsRanking: "QS #84",
    popularPrograms: ["Business", "Engineering", "Computer Science"],
    estAnnualFee: "£25,000",
    duration: "3–4 years",
    description: "A Russell Group university with a global reputation, ranked among the UK's top for graduate employability.",
    website: "https://www.birmingham.ac.uk",
  },
  {
    id: "monash",
    name: "Monash University",
    country: "Australia",
    flag: "🇦🇺",
    city: "Melbourne, Victoria",
    type: "Public",
    qsRanking: "QS #37",
    popularPrograms: ["Engineering", "Medicine", "Business"],
    estAnnualFee: "AUD 46,000",
    duration: "3–4 years",
    description: "A group-of-eight research university with world-class engineering, medical and business faculties.",
    website: "https://www.monash.edu",
  },
  {
    id: "newyork",
    name: "New York University",
    country: "USA",
    flag: "🇺🇸",
    city: "New York City, NY",
    type: "Private",
    qsRanking: "QS #39",
    popularPrograms: ["Business", "Data Science", "Arts"],
    estAnnualFee: "USD 56,000",
    duration: "4 years",
    description: "Located in the heart of Manhattan, NYU is a global leader in business, finance and the arts.",
    website: "https://www.nyu.edu",
  },
];

export const STUDY_ABROAD_CONTEXT: StudyAbroadFields = {
  countries: COUNTRIES,
  levels: LEVELS,
  fields: FIELDS,
};

export function getAbroadCollegeById(id: string): AbroadCollege | undefined {
  return STUDY_ABROAD_COLLEGES.find((c) => c.id === id);
}
