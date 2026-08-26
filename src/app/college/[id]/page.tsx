"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Building2 } from "lucide-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { DirectoryCollegeDetail } from "@/components/college/DirectoryCollegeDetail";
import { MBA_PGDM_COLLEGES, type CollegeDirectoryEntry } from "@/data/college-directory";

interface DbCollegeRaw {
  id: string;
  name: string;
  city?: string | null;
  coverImage?: string | null;
  partnerCollege?: boolean | null;
  isPublished?: boolean | null;
  programs: { name: string; annualFee?: string | null; totalFee?: string | null; stream?: string | null }[];
}

const REGION_MAP: Record<string, CollegeDirectoryEntry["region"]> = {
  delhi: "Delhi/NCR", ncr: "Delhi/NCR", noida: "Delhi/NCR", gurgaon: "Delhi/NCR",
  gurugram: "Delhi/NCR", greater_noida: "Delhi/NCR", ghaziabad: "Delhi/NCR", faridabad: "Delhi/NCR",
  mumbai: "Mumbai/Pune", pune: "Mumbai/Pune", navi_mumbai: "Mumbai/Pune",
  bangalore: "Bangalore", bengaluru: "Bangalore",
  bhubaneswar: "Bhubaneswar", cuttack: "Bhubaneswar",
  hyderabad: "Hyderabad/Kolkata", kolkata: "Hyderabad/Kolkata", west_bengal: "Hyderabad/Kolkata", murshidabad: "Hyderabad/Kolkata",
  dehradun: "Others", uttarakhand: "Others", rajkot: "Others", gujarat: "Others", mysore: "Others", mysuru: "Others",
};

function inferRegion(city?: string | null): CollegeDirectoryEntry["region"] {
  if (!city) return "Others";
  const lower = city.toLowerCase();
  for (const [keyword, region] of Object.entries(REGION_MAP)) {
    if (lower.includes(keyword)) return region;
  }
  return "Others";
}

function dbFeeDisplay(fee?: string | null): string {
  if (!fee) return "Fee on Request";
  const num = Number(fee);
  if (!Number.isFinite(num) || num <= 0) return "Fee on Request";
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

function dbToDirectoryEntry(c: DbCollegeRaw): CollegeDirectoryEntry {
  return {
    id: c.id,
    name: c.name,
    region: inferRegion(c.city),
    location: c.city || "",
    courses: (c.programs || []).map((p) => ({
      name: p.name,
      fees: dbFeeDisplay(p.totalFee || p.annualFee),
    })),
    isPartnered: Boolean(c.partnerCollege),
    scholarshipAvailable: Boolean(c.partnerCollege),
    maxScholarship: c.partnerCollege ? 25000 : 0,
  };
}

export default function CollegeDetailPage() {
  const params = useParams<{ id: string }>();
  const staticCollege = MBA_PGDM_COLLEGES.find((c) => c.id === params.id);
  const [dbFallback, setDbFallback] = React.useState<DbCollegeRaw | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (staticCollege) { setLoading(false); return; }
    fetch(`/api/colleges/${params.id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.college) setDbFallback(d.college); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id, staticCollege]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center p-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-surface-300 border-t-gold-600" />
        </main>
        <Footer />
      </div>
    );
  }

  if (staticCollege) return <DirectoryCollegeDetail college={staticCollege} />;

  if (dbFallback) {
    if (dbFallback.isPublished === false) {
      return (
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex flex-1 items-center justify-center p-8 text-center">
            <div>
              <Building2 className="mx-auto h-12 w-12 text-surface-300" strokeWidth={1.75} />
              <h1 className="mt-4 font-display text-2xl font-bold text-surface-900">College not available</h1>
              <p className="mt-2 text-sm text-surface-500">This college page is not currently published.</p>
              <Link href="/" className="mt-4 inline-block text-sm font-semibold text-gold-700 hover:underline">
                ← Back to all colleges
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      );
    }
    return <DirectoryCollegeDetail college={dbToDirectoryEntry(dbFallback)} />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex flex-1 items-center justify-center p-8 text-center">
        <div>
          <Building2 className="mx-auto h-12 w-12 text-surface-300" strokeWidth={1.75} />
          <h1 className="mt-4 font-display text-2xl font-bold text-surface-900">College not found</h1>
          <Link href="/" className="mt-4 inline-block text-sm font-semibold text-gold-700 hover:underline">
            ← Back to all colleges
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
