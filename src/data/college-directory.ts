export interface DirectoryCourse {
  name: string;
  specialization?: string;
  fees: string;
}

export interface CollegeDirectoryEntry {
  id: string;
  name: string;
  region: "Delhi/NCR" | "Mumbai/Pune" | "Bangalore" | "Bhubaneswar" | "Hyderabad/Kolkata" | "Others";
  location: string;
  courses: DirectoryCourse[];
  isPartnered: boolean;
  scholarshipAvailable: boolean;
  maxScholarship: number;
}

function college(
  id: string,
  name: string,
  region: CollegeDirectoryEntry["region"],
  location: string,
  courses: DirectoryCourse[],
  isPartnered: boolean,
  maxScholarship = 0,
): CollegeDirectoryEntry {
  return {
    id,
    name,
    region,
    location,
    courses,
    isPartnered,
    scholarshipAvailable: isPartnered && maxScholarship > 0,
    maxScholarship,
  };
}

export const COLLEGE_REGIONS: CollegeDirectoryEntry["region"][] = [
  "Delhi/NCR",
  "Mumbai/Pune",
  "Bangalore",
  "Bhubaneswar",
  "Hyderabad/Kolkata",
  "Others",
];

export const MBA_PGDM_COLLEGES: CollegeDirectoryEntry[] = [
  college("bmsce", "BMS College of Engineering", "Bangalore", "Bengaluru", [{"name":"B.E. Computer Science","fees":"₹10,40,000"},{"name":"B.E. Information Science","fees":"₹10,00,000"},{"name":"B.E. Electronics & Comm.","fees":"₹10,20,000"},{"name":"B.E. Civil","fees":"₹9,20,000"},{"name":"B.E. Mechanical","fees":"₹9,60,000"}], false, 0),
  college("manipal", "Manipal Institute of Technology", "Others", "Manipal", [{"name":"B.Tech Computer Science","fees":"₹17,60,000"},{"name":"B.Tech AI & Data Science","fees":"₹18,40,000"},{"name":"B.Tech Electronics & Comm.","fees":"₹16,80,000"},{"name":"B.Tech Mechanical","fees":"₹15,60,000"},{"name":"B.Tech Aerospace","fees":"₹16,40,000"},{"name":"M.Tech VLSI","fees":"₹5,60,000"}], false, 0),
  college("nmims", "NMIMS University", "Mumbai/Pune", "Mumbai", [{"name":"MBA Core","fees":"₹19,60,000"},{"name":"MBA Fintech","fees":"₹20,40,000"},{"name":"BBA","fees":"₹14,40,000"},{"name":"B.Com (Hons.)","fees":"₹7,20,000"},{"name":"B.Tech Computer Science","fees":"₹18,40,000"}], false, 0),
  college("dtu", "Delhi Technological University", "Delhi/NCR", "New Delhi", [{"name":"B.Tech Computer Science","fees":"₹13,60,000"},{"name":"B.Tech IT","fees":"₹13,20,000"},{"name":"B.Tech Electronics & Comm.","fees":"₹12,80,000"},{"name":"B.Tech Mechanical","fees":"₹11,60,000"},{"name":"M.Tech Computer Science","fees":"₹2,80,000"}], false, 0),
  college("nid", "National Institute of Design", "Others", "Ahmedabad", [{"name":"Bachelor of Design","fees":"₹11,60,000"},{"name":"B.Des Communication Design","fees":"₹11,60,000"},{"name":"B.Des Interaction Design","fees":"₹12,40,000"},{"name":"PG Product Design","fees":"₹7,00,000"}], false, 0),
  college("sjcc", "St. Joseph's College of Commerce", "Bangalore", "Bengaluru", [{"name":"B.Com","fees":"₹4,20,000"},{"name":"B.Com (Hons.)","fees":"₹4,80,000"},{"name":"BBA","fees":"₹5,40,000"},{"name":"BBA Fintech","fees":"₹6,00,000"}], false, 0),
  college("myra", "MYRA School of Business", "Others", "Mysuru", [{"name":"PGDM — Finance","fees":"₹12,10,000"},{"name":"PGDM — Marketing & Sales","fees":"₹12,10,000"},{"name":"PGDM — Business Analytics","fees":"₹12,10,000"},{"name":"PGDM — HR & Operations","fees":"₹12,10,000"}], false, 0),
  college("del-13", "Noida International University (NIU)", "Delhi/NCR", "Noida", [{"name":"MBA","fees":"₹5,85,000"}], false, 0),
  college("christ", "Christ University", "Bangalore", "Bengaluru", [{"name":"MBA","fees":"₹13,00,000"},{"name":"BBA","fees":"₹10,20,000"},{"name":"B.Com","fees":"₹6,60,000"},{"name":"B.Com (Hons.)","fees":"₹7,80,000"},{"name":"M.Sc Data Science","fees":"₹8,40,000"}], false, 0),
  college("doon", "Doon Business School", "Others", "Dehradun", [{"name":"MBA — General Management","fees":"₹6,60,000"},{"name":"PGDM — Digital Business","fees":"₹7,20,000"},{"name":"PGDM — Data Analytics","fees":"₹7,20,000"},{"name":"PGDM — Marketing & Finance","fees":"₹7,20,000"}], false, 0),
  college("pibm", "Pune Institute of Business Management", "Mumbai/Pune", "Pune", [{"name":"PGDM — General Management","fees":"₹8,95,000"},{"name":"MBA — Marketing","fees":"₹8,95,000"},{"name":"MBA — Finance","fees":"₹8,95,000"},{"name":"PGDM — Business Analytics","fees":"₹8,95,000"}], false, 0),
  college("uwsb", "IQ City United World School of Business", "Hyderabad/Kolkata", "Kolkata", [{"name":"MBA — Marketing","fees":"₹6,00,000"},{"name":"MBA — Finance","fees":"₹6,00,000"},{"name":"MBA — Human Resources","fees":"₹6,00,000"},{"name":"MBA — Business Analytics","fees":"₹6,00,000"}], false, 0),
  college("gims", "GNIOT Institute of Management Studies", "Delhi/NCR", "Greater Noida", [{"name":"PGDM — Marketing","fees":"₹8,55,000"},{"name":"PGDM — Finance","fees":"₹8,55,000"},{"name":"PGDM — Business Analytics","fees":"₹8,55,000"},{"name":"PGDM — International Business","fees":"₹8,55,000"}], false, 0),
  college("del-15", "SOIL Institute of Management", "Delhi/NCR", "Gurgaon", [{"name":"PGDM","fees":"₹15,33,226"}], true, 25000),
  college("del-17", "IMM", "Delhi/NCR", "Delhi", [{"name":"PGDM","fees":"₹8,90,000"}], false, 0),
  college("del-1", "Jaipuria Institute of Management", "Delhi/NCR", "Noida", [{"name":"PGDM","fees":"₹14,75,000"}], true, 25000),
  college("del-2", "BML Munjal University", "Others", "Haryana", [{"name":"PGDM","fees":"₹13,00,000"}], false, 0),
  college("del-3", "Kirloskar Institute of Management", "Mumbai/Pune", "Pune", [{"name":"PGDM (Pune)","fees":"₹12,50,000"},{"name":"PGDM (Harihar)","fees":"₹10,85,000"}], false, 0),
  college("del-4", "IMI", "Bhubaneswar", "Bhubaneswar", [{"name":"PGDM (Bhubaneswar)","fees":"₹13,50,000"},{"name":"PGDM (Kolkata)","fees":"₹14,50,000"}], true, 25000),
  college("del-7", "JK Business School", "Delhi/NCR", "Gurgaon", [{"name":"PGDM","fees":"₹6,90,000"}], false, 0),
  college("del-10", "Sharda University", "Delhi/NCR", "Greater Noida", [{"name":"MBA","fees":"Fee on Request"}], false, 0),
  college("del-6", "GL Bajaj", "Delhi/NCR", "Greater Noida", [{"name":"PGDM","fees":"Fee on Request"}], false, 0),
  college("del-8", "Lloyds Business School", "Delhi/NCR", "Greater Noida", [{"name":"PGDM Business Analytics","fees":"₹7,60,000"},{"name":"PGDM BFSI","fees":"₹7,00,000"},{"name":"PGDM SCM","fees":"₹7,00,000"},{"name":"PGDM Core","fees":"₹6,80,000"}], false, 0),
  college("del-9", "I Business Institute (IBI)", "Delhi/NCR", "Greater Noida", [{"name":"PGDM","fees":"₹8,95,000"}], false, 0),
  college("del-11", "GIMS", "Delhi/NCR", "Noida", [{"name":"MBA","fees":"₹3,50,000"},{"name":"PGDM","fees":"₹7,38,000"}], false, 0),
  college("del-12", "New Delhi Institute of Management (NDIM)", "Delhi/NCR", "New Delhi", [{"name":"PGDM","fees":"₹9,75,000"}], false, 0),
  college("del-14", "FOSTIIMA Business School", "Delhi/NCR", "Delhi", [{"name":"PGDM","fees":"₹9,50,000"}], false, 0),
  college("del-16", "ITS", "Delhi/NCR", "Ghaziabad", [{"name":"PGDM","fees":"₹6,00,000"}], false, 0),
  college("del-18", "Fortune Institute of International Business (FIIB)", "Delhi/NCR", "Delhi", [{"name":"PGDM","fees":"₹9,00,000"}], false, 0),
  college("mp-2", "Welingkar Institute of Management", "Mumbai/Pune", "Mumbai", [{"name":"PGDM","fees":"₹13,00,000"}], true, 25000),
  college("mp-5", "MITCON Institute of Management", "Mumbai/Pune", "Pune", [{"name":"MBA","fees":"₹5,50,000"}], false, 0),
  college("mp-8", "Sri Balaji (BIMM)", "Mumbai/Pune", "Pune", [{"name":"MBA","fees":"₹10,00,000"}], false, 0),
  college("mp-13", "Pune Institute of Management Studies (PIMS)", "Mumbai/Pune", "Pune", [{"name":"MBA","fees":"₹4,65,000"}], false, 0),
  college("mp-15", "Lexicon MILE", "Mumbai/Pune", "Pune", [{"name":"PGDM","fees":"₹10,50,000"}], false, 0),
  college("mp-17", "RIIM Pune", "Mumbai/Pune", "Pune", [{"name":"MBA/PGDM (1 Certification)","fees":"₹5,40,000"},{"name":"MBA/PGDM (3 Certifications)","fees":"₹6,50,000"},{"name":"MBA/PGDM (Abroad Exposure)","fees":"₹7,20,000"}], false, 0),
  college("blr-1", "ISBR Business School", "Bangalore", "Electronic City, Bangalore", [{"name":"PGDM Global","fees":"₹11,00,000"},{"name":"PGDM","fees":"₹9,00,000"},{"name":"MBA","fees":"₹9,00,000"}], true, 25000),
  college("blr-3", "AIMS Institutes", "Bangalore", "Bangalore", [{"name":"MBA","fees":"₹8,75,000"},{"name":"PGDM","fees":"₹6,50,000"}], false, 0),
  college("bbsr-5", "ODM Business School", "Bhubaneswar", "Bhubaneswar", [{"name":"PGDM","fees":"₹4,20,000"}], true, 25000),
  college("mp-1", "ITM Business School", "Mumbai/Pune", "Navi Mumbai", [{"name":"MBA","fees":"₹11,95,000"}], true, 25000),
  college("mp-3", "Universal Business School", "Mumbai/Pune", "Mumbai", [{"name":"PGDM Dual Specialization","fees":"₹9,00,000"},{"name":"PGDM + GMP","fees":"₹11,00,000"}], true, 25000),
  college("mp-4", "Akemi Business School", "Mumbai/Pune", "Pune", [{"name":"MBA","fees":"₹5,90,000"}], false, 0),
  college("mp-6", "Suryadatta Institute of Management", "Mumbai/Pune", "Pune", [{"name":"MBA","fees":"₹5,50,000"},{"name":"PGDM","fees":"₹6,90,000"}], false, 0),
  college("mp-7", "Sai Balaji (IIMS)", "Mumbai/Pune", "Pune", [{"name":"PGDM","fees":"₹9,00,000"}], true, 25000),
  college("mp-9", "DPU Business School", "Mumbai/Pune", "Pune", [{"name":"PGDM","fees":"₹8,46,000"},{"name":"PGDM Global","fees":"₹11,43,000"}], false, 0),
  college("mp-10", "ISMS Pune", "Mumbai/Pune", "Pune", [{"name":"MBA","fees":"₹6,50,000"},{"name":"PGDM","fees":"₹6,90,000"}], false, 0),
  college("mp-11", "Pune Business School", "Mumbai/Pune", "Pune", [{"name":"PGDM","fees":"₹5,50,000"},{"name":"PGDM Global","fees":"₹6,50,000"}], false, 0),
  college("mp-12", "Pune Institute of Business Management (PIBM)", "Mumbai/Pune", "Pune", [{"name":"MBA / PGDM","fees":"₹8,75,000"}], true, 25000),
  college("mp-14", "MIT Pune", "Mumbai/Pune", "Pune", [{"name":"PGDM","fees":"₹9,00,000"}], false, 0),
  college("mp-16", "Atlas SkillTech University", "Mumbai/Pune", "Mumbai", [{"name":"MBA","fees":"₹10,45,000"}], false, 0),
  college("mp-18", "ASM Group (IBMR)", "Mumbai/Pune", "Pune", [{"name":"MBA Premium","fees":"₹6,95,000"},{"name":"PGDM Dual","fees":"₹9,25,000"},{"name":"PGDM Agri-Business","fees":"₹7,75,000"}], false, 0),
  college("bbsr-7", "IIPM Rourkela", "Others", "Rourkela", [{"name":"MBA","fees":"₹2,50,000"}], false, 0),
  college("bbsr-9", "C. V. Raman Global University", "Bhubaneswar", "Bhubaneswar", [{"name":"MBA","fees":"Fee on Request"}], false, 0),
  college("hk-2", "Siva Sivani Institute of Management (SSIM)", "Hyderabad/Kolkata", "Hyderabad", [{"name":"PGDM","fees":"₹6,90,000"}], false, 0),
  college("blr-2", "GIBS Business School", "Bangalore", "Bangalore", [{"name":"PGDM","fees":"₹8,90,000"}], true, 25000),
  college("blr-6", "IFIM College", "Bangalore", "Electronic City, Bangalore", [{"name":"MBA","fees":"₹10,20,000"}], false, 0),
  college("blr-8", "Presidency University", "Bangalore", "Bangalore", [{"name":"MBA","fees":"₹6,00,000"}], false, 0),
  college("blr-10", "Regional College of Management (RCM)", "Bangalore", "Bangalore", [{"name":"MBA","fees":"₹8,40,000"},{"name":"PGDM","fees":"₹8,40,000"}], false, 0),
  college("blr-11", "Alliance University", "Bangalore", "Bangalore", [{"name":"MBA (University Campus)","fees":"₹14,50,000"},{"name":"MBA (Ascent)","fees":"₹9,50,000"}], true, 25000),
  college("blr-12", "IZEE Business School", "Bangalore", "Bangalore", [{"name":"MBA Hybrid","fees":"₹5,95,000"},{"name":"MBA Hybrid International","fees":"₹6,95,000"},{"name":"MBA + PGPM Global","fees":"₹7,95,000"}], false, 0),
  college("blr-14", "St Joseph's Institute of Management", "Bangalore", "Bangalore", [{"name":"MBA","fees":"Fee on Request"}], false, 0),
  college("blr-16", "CMR University", "Bangalore", "Bangalore", [{"name":"MBA","fees":"₹4,50,000"}], false, 0),
  college("blr-18", "ISME (International School of Management Excellence)", "Bangalore", "Bangalore", [{"name":"PGDM","fees":"₹9,00,000"}], true, 25000),
  college("bbsr-1", "SOA University (ITER)", "Bhubaneswar", "Bhubaneswar", [{"name":"MBA","fees":"₹7,00,000"}], true, 25000),
  college("bbsr-3", "DRIEMS University", "Bhubaneswar", "Cuttack", [{"name":"MBA","fees":"Fee on Request"}], false, 0),
  college("blr-4", "ABBS (Acharya Bangalore B-School)", "Bangalore", "Bangalore", [{"name":"MBA","fees":"₹8,90,000"},{"name":"MBA Business Analytics","fees":"₹9,90,000"},{"name":"PGDM","fees":"₹8,90,000"},{"name":"PGDM Global","fees":"₹9,90,000"}], true, 25000),
  college("blr-5", "Karnataka College of Management (KCM)", "Bangalore", "Bangalore", [{"name":"MBA","fees":"₹6,95,000"}], false, 0),
  college("blr-7", "Jagdish Sheth School of Management (JAGSoM)", "Bangalore", "Electronic City, Bangalore", [{"name":"PGDM","fees":"₹15,95,000"}], true, 25000),
  college("blr-9", "MS Ramaiah Institute of Management", "Bangalore", "Bangalore", [{"name":"MBA","fees":"Fee on Request"}], false, 0),
  college("blr-13", "RV University", "Bangalore", "Bangalore", [{"name":"MBA","fees":"₹7,00,000"}], false, 0),
  college("blr-15", "NITTE School of Management", "Bangalore", "Bangalore", [{"name":"PGDM","fees":"Fee on Request"}], false, 0),
  college("blr-17", "Indus Business Academy (IBA)", "Bangalore", "Bangalore", [{"name":"PGDM","fees":"₹9,78,000"}], true, 25000),
  college("blr-19", "Jain University", "Bangalore", "Bangalore", [{"name":"MBA","fees":"₹10,00,000"}], false, 0),
  college("bbsr-2", "Gandhi Group of Institutions (GIET)", "Others", "Gunupur", [{"name":"MBA","fees":"₹70,000"}], false, 0),
  college("bbsr-4", "Trident Academy of Technology", "Bhubaneswar", "Bhubaneswar", [{"name":"MBA","fees":"₹1,20,000"}], false, 0),
  college("bbsr-6", "Birla Global University (BGU)", "Bhubaneswar", "Bhubaneswar", [{"name":"MBA","fees":"₹8,31,000"}], true, 25000),
  college("bbsr-8", "Bharatiya Vidya Bhavan", "Bhubaneswar", "Bhubaneswar", [{"name":"MBA","fees":"Fee on Request"}], false, 0),
  college("hk-1", "Vignana Jyothi Institute of Management (VJIM)", "Hyderabad/Kolkata", "Hyderabad", [{"name":"PGDM","fees":"₹7,60,000"}], true, 25000),
  college("hk-3", "Guru Nanak Institute of Management", "Hyderabad/Kolkata", "Hyderabad", [{"name":"MBA","fees":"₹3,00,000"}], false, 0),
  college("hk-5", "Bengal Institute of Business Studies (BIBS)", "Hyderabad/Kolkata", "Kolkata", [{"name":"MBA","fees":"₹6,48,000"}], false, 0),
  college("hk-7", "Unitedworld School of Business", "Hyderabad/Kolkata", "Kolkata", [{"name":"PGDM","fees":"₹6,80,000"}], false, 0),
  college("hk-9", "Institute of Engineering and Management (IEM)", "Hyderabad/Kolkata", "Kolkata", [{"name":"MBA","fees":"₹6,40,000"}], false, 0),
  college("hk-11", "Praxis Business School", "Hyderabad/Kolkata", "Kolkata", [{"name":"PGDM","fees":"₹9,50,000"}], true, 25000),
  college("hk-13", "MDI Murshidabad", "Hyderabad/Kolkata", "Murshidabad, West Bengal", [{"name":"PGDM","fees":"₹14,50,000"}], true, 25000),
  college("oth-2", "Marwadi University", "Others", "Rajkot, Gujarat", [{"name":"MBA","fees":"₹2,70,000"}], false, 0),
  college("hk-4", "School of Inspired Leadership (SoIM)", "Hyderabad/Kolkata", "Hyderabad", [{"name":"PGDM","fees":"₹11,00,000"}], true, 25000),
  college("hk-6", "Globsyn Business School", "Hyderabad/Kolkata", "Kolkata", [{"name":"MBA","fees":"₹8,35,000"}], true, 25000),
  college("hk-8", "Calcutta Business School (CBS)", "Hyderabad/Kolkata", "Kolkata", [{"name":"PGDM","fees":"Fee on Request"}], false, 0),
  college("hk-10", "Bharatiya Vidya Bhavan Institute of Management (BIMS)", "Hyderabad/Kolkata", "Kolkata", [{"name":"MBA","fees":"₹6,50,000"}], false, 0),
  college("hk-12", "Techno India University", "Hyderabad/Kolkata", "Kolkata", [{"name":"MBA","fees":"₹5,17,000"}], false, 0),
  college("oth-1", "UPES", "Others", "Dehradun, Uttarakhand", [{"name":"MBA","fees":"₹15,26,000"}], true, 25000),
  college("oth-3", "Doon Business School (DBS)", "Others", "Dehradun, Uttarakhand", [{"name":"MBA International Business","fees":"₹8,52,000"},{"name":"PGDM SAP/SAS","fees":"₹5,54,000"},{"name":"MBA Business Analytics","fees":"₹8,11,500"},{"name":"PGDM Global","fees":"₹6,34,000"}], true, 25000),
  college("oth-4", "Quantum University", "Others", "Roorkee, Uttarakhand", [{"name":"MBA","fees":"₹4,25,000"}], false, 0),
  college("oth-5", "MYRA School of Business", "Others", "Mysore, Karnataka", [{"name":"MBA","fees":"₹11,00,000"}], true, 25000),
  college("rvce", "RV College of Engineering", "Bangalore", "Bengaluru", [{"name":"B.E. Computer Science","fees":"₹12,80,000"},{"name":"B.E. AI & Machine Learning","fees":"₹13,60,000"},{"name":"B.E. Electronics & Comm.","fees":"₹11,60,000"},{"name":"B.E. Information Science","fees":"₹12,00,000"},{"name":"B.E. Mechanical","fees":"₹11,20,000"},{"name":"M.Tech Computer Science","fees":"₹4,20,000"}], false, 0),
  college("del-5", "IILM University", "Delhi/NCR", "Gurugram", [{"name":"MBA (Gurugram)","fees":"₹11,70,000"},{"name":"MBA (Greater Noida)","fees":"₹11,00,000"}], true, 25000),
];

export function isMBAOrPGDMProgram(programName: string): boolean {
  return /\bMBA\b|\bPGDM\b/i.test(programName);
}

export function canReceiveOrionScholarship(
  college: Pick<CollegeDirectoryEntry, "isPartnered" | "scholarshipAvailable">,
  programName: string,
): boolean {
  return college.isPartnered && college.scholarshipAvailable && isMBAOrPGDMProgram(programName);
}

export const PARTNER_COLLEGE_COUNT = MBA_PGDM_COLLEGES.filter((college) => college.isPartnered).length;
