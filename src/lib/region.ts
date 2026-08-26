import type { CollegeDirectoryEntry } from "@/data/college-directory";

type CollegeRegion = CollegeDirectoryEntry["region"];

const REGION_MAP: Record<string, CollegeRegion> = {
  delhi: "Delhi/NCR",
  ncr: "Delhi/NCR",
  noida: "Delhi/NCR",
  gurgaon: "Delhi/NCR",
  gurugram: "Delhi/NCR",
  greater_noida: "Delhi/NCR",
  ghaziabad: "Delhi/NCR",
  faridabad: "Delhi/NCR",
  mumbai: "Mumbai/Pune",
  pune: "Mumbai/Pune",
  navi_mumbai: "Mumbai/Pune",
  bangalore: "Bangalore",
  bengaluru: "Bangalore",
  bhubaneswar: "Bhubaneswar",
  cuttack: "Bhubaneswar",
  hyderabad: "Hyderabad/Kolkata",
  kolkata: "Hyderabad/Kolkata",
  west_bengal: "Hyderabad/Kolkata",
  murshidabad: "Hyderabad/Kolkata",
  dehradun: "Others",
  uttarakhand: "Others",
  rajkot: "Others",
  gujarat: "Others",
  mysore: "Others",
  mysuru: "Others",
};

export function inferRegion(city?: string | null): CollegeRegion {
  if (!city) return "Others";
  const lower = city.toLowerCase();
  for (const [keyword, region] of Object.entries(REGION_MAP)) {
    if (lower.includes(keyword)) return region;
  }
  return "Others";
}