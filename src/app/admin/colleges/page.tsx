"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Plus,
  Pencil,
  Star,
  MapPin,
  Trash2,
  Eye,
  EyeOff,
  GraduationCap,
  Play,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProgramRow {
  name: string;
  stream: string;
  durationYears: number | null;
  annualFee: number | null;
  totalFee: number | null;
  avgPlacement: number | null;
  eligibility: string;
  seats: number | null;
}

interface CampusVideoRow {
  title: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  category: string;
  duration: string;
  order: number;
}

interface PartnerProfileForm {
  website: string;
  tagline: string;
  overview: string;
  highlights: string;
  specializations: string;
  established: string;
  accreditation: string;
  logoUrls: string;
  heroImageUrl: string;
  links: string;
}

interface CollegeRow {
  id: string;
  name: string;
  shortName: string | null;
  city: string | null;
  established: number | null;
  rating: string | null;
  type: string | null;
  about: string | null;
  tags: string[];
  accreditation: string[];
  ranking: string | null;
  admissions: unknown;
  costs: unknown;
  scholarships: unknown;
  placementPct: string | null;
  highestPlacement: string | null;
  intake: number | null;
  facilities: string[];
  sourceWebsite: string | null;
  coverImage: string | null;
  photos: string[];
  videoLinks: string[];
  campusVideos: CampusVideoRow[];
  partnerCollege: boolean | null;
  partnerProfile: unknown;
  isPublished: boolean | null;
  budget: string | null;
  programs: ProgramRow[];
}

const EMPTY_PARTNER: PartnerProfileForm = {
  website: "",
  tagline: "",
  overview: "",
  highlights: "",
  specializations: "",
  established: "",
  accreditation: "",
  logoUrls: "",
  heroImageUrl: "",
  links: "",
};

const EMPTY_FORM = {
  name: "",
  shortName: "",
  city: "",
  established: 2020,
  rating: 4.0,
  type: "Private",
  about: "",
  tags: "",
  accreditation: "",
  ranking: "",
  placementPct: 85,
  highestPlacement: 1500000,
  intake: 600,
  facilities: "",
  sourceWebsite: "",
  coverImage: "",
  photos: "",
  videoLinks: "",
  partnerCollege: false,
  isPublished: true,
  budget: 80000,
  programsList: [] as ProgramRow[],
  campusVideosList: [] as CampusVideoRow[],
  partner: { ...EMPTY_PARTNER },
};

const PROGRAM_PRESETS: Partial<ProgramRow>[] = [
  { name: "MBA", stream: "Management", durationYears: 2, annualFee: 500000, totalFee: 1000000, avgPlacement: 800000, eligibility: "Graduation", seats: 120 },
  { name: "PGDM", stream: "Management", durationYears: 2, annualFee: 450000, totalFee: 900000, avgPlacement: 700000, eligibility: "Graduation", seats: 120 },
  { name: "BBA", stream: "Management", durationYears: 3, annualFee: 150000, totalFee: 450000, avgPlacement: 400000, eligibility: "12th Pass", seats: 180 },
  { name: "BCA", stream: "Computer Applications", durationYears: 3, annualFee: 120000, totalFee: 360000, avgPlacement: 450000, eligibility: "12th Pass", seats: 180 },
  { name: "MCA", stream: "Computer Applications", durationYears: 2, annualFee: 150000, totalFee: 300000, avgPlacement: 550000, eligibility: "BCA/B.Sc CS", seats: 120 },
  { name: "B.Tech", stream: "Engineering", durationYears: 4, annualFee: 200000, totalFee: 800000, avgPlacement: 600000, eligibility: "12th PCM", seats: 240 },
  { name: "M.Tech", stream: "Engineering", durationYears: 2, annualFee: 180000, totalFee: 360000, avgPlacement: 700000, eligibility: "B.Tech", seats: 60 },
  { name: "B.Com", stream: "Commerce", durationYears: 3, annualFee: 60000, totalFee: 180000, avgPlacement: 350000, eligibility: "12th Pass", seats: 240 },
  { name: "M.Com", stream: "Commerce", durationYears: 2, annualFee: 70000, totalFee: 140000, avgPlacement: 400000, eligibility: "B.Com", seats: 120 },
  { name: "B.Sc", stream: "Science", durationYears: 3, annualFee: 80000, totalFee: 240000, avgPlacement: 350000, eligibility: "12th Science", seats: 180 },
  { name: "M.Sc", stream: "Science", durationYears: 2, annualFee: 90000, totalFee: 180000, avgPlacement: 400000, eligibility: "B.Sc", seats: 60 },
  { name: "BA", stream: "Arts", durationYears: 3, annualFee: 40000, totalFee: 120000, avgPlacement: 300000, eligibility: "12th Pass", seats: 300 },
  { name: "MA", stream: "Arts", durationYears: 2, annualFee: 50000, totalFee: 100000, avgPlacement: 350000, eligibility: "BA", seats: 120 },
  { name: "LLB", stream: "Law", durationYears: 3, annualFee: 120000, totalFee: 360000, avgPlacement: 500000, eligibility: "Graduation", seats: 120 },
  { name: "LLM", stream: "Law", durationYears: 1, annualFee: 150000, totalFee: 150000, avgPlacement: 600000, eligibility: "LLB", seats: 60 },
  { name: "B.Des", stream: "Design", durationYears: 4, annualFee: 250000, totalFee: 1000000, avgPlacement: 500000, eligibility: "12th Pass", seats: 60 },
  { name: "M.Des", stream: "Design", durationYears: 2, annualFee: 280000, totalFee: 560000, avgPlacement: 600000, eligibility: "B.Des", seats: 30 },
  { name: "PhD", stream: "Research", durationYears: 3, annualFee: 100000, totalFee: 300000, avgPlacement: 0, eligibility: "Post-Graduation", seats: 30 },
];

const VIDEO_CATEGORIES = [
  "Campus Tour",
  "Hostel Tour",
  "Student Life",
  "Placements",
  "Lectures",
  "Events",
  "Other",
];

function extractYoutubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function AdminCollegesPage() {
  const [colleges, setColleges] = useState<CollegeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  async function fetchColleges() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/colleges");
      if (res.ok) {
        const data = await res.json();
        setColleges(data.colleges || []);
      }
    } catch {}
    setLoading(false);
  }

  function startCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  }

  function startEdit(college: CollegeRow) {
    setEditingId(college.id);
    const pp = (college.partnerProfile as Record<string, unknown> | null) || {};
    setForm({
      name: college.name,
      shortName: college.shortName || "",
      city: college.city || "",
      established: college.established || 2020,
      rating: Number(college.rating) || 4.0,
      type: college.type || "Private",
      about: college.about || "",
      tags: (college.tags || []).join(", "),
      accreditation: (college.accreditation || []).join(", "),
      ranking: college.ranking || "",
      placementPct: Number(college.placementPct) || 85,
      highestPlacement: Number(college.highestPlacement) || 1500000,
      intake: college.intake || 600,
      facilities: (college.facilities || []).join(", "),
      sourceWebsite: college.sourceWebsite || "",
      coverImage: college.coverImage || "",
      photos: (college.photos || []).join("\n"),
      videoLinks: (college.videoLinks || []).join("\n"),
      partnerCollege: college.partnerCollege || false,
      isPublished: college.isPublished !== false,
      budget: Number(college.budget) || 80000,
      programsList: (college.programs || []).map((p) => ({
        name: p.name,
        stream: p.stream || "",
        durationYears: p.durationYears,
        annualFee: p.annualFee ? Number(p.annualFee) : null,
        totalFee: p.totalFee ? Number(p.totalFee) : null,
        avgPlacement: p.avgPlacement ? Number(p.avgPlacement) : null,
        eligibility: p.eligibility || "",
        seats: p.seats,
      })),
      campusVideosList: (college.campusVideos || []).map((v, idx) => ({
        title: v.title || "",
        youtubeUrl: v.youtubeUrl || "",
        thumbnailUrl: v.thumbnailUrl || "",
        category: v.category || "Other",
        duration: v.duration || "",
        order: v.order ?? idx,
      })),
      partner: {
        website: (pp.website as string) || "",
        tagline: (pp.tagline as string) || "",
        overview: (pp.overview as string) || "",
        highlights: Array.isArray(pp.highlights)
          ? (pp.highlights as string[]).join("\n")
          : (pp.highlights as string) || "",
        specializations: Array.isArray(pp.specializations)
          ? (pp.specializations as string[]).join(", ")
          : (pp.specializations as string) || "",
        established: (pp.established as string) || "",
        accreditation: (pp.accreditation as string) || "",
        logoUrls: Array.isArray(pp.logoUrls)
          ? (pp.logoUrls as { url: string }[])
              .map((l) => l.url)
              .join("\n")
          : "",
        heroImageUrl: (pp.heroImageUrl as string) || "",
        links: Array.isArray(pp.links)
          ? (pp.links as { label: string; url: string }[])
              .map((l) => `${l.label} | ${l.url}`)
              .join("\n")
          : "",
      },
    });
  }

  function addProgramRow(preset?: Partial<ProgramRow>) {
    setForm((prev) => ({
      ...prev,
      programsList: [
        ...prev.programsList,
        {
          name: preset?.name || "",
          stream: preset?.stream || "",
          durationYears: preset?.durationYears ?? null,
          annualFee: preset?.annualFee ?? null,
          totalFee: preset?.totalFee ?? null,
          avgPlacement: preset?.avgPlacement ?? null,
          eligibility: preset?.eligibility || "",
          seats: preset?.seats ?? null,
        },
      ],
    }));
  }

  function updateProgramRow(index: number, patch: Partial<ProgramRow>) {
    setForm((prev) => ({
      ...prev,
      programsList: prev.programsList.map((p, i) =>
        i === index ? { ...p, ...patch } : p
      ),
    }));
  }

  function removeProgramRow(index: number) {
    setForm((prev) => ({
      ...prev,
      programsList: prev.programsList.filter((_, i) => i !== index),
    }));
  }

  function addVideoRow() {
    setForm((prev) => ({
      ...prev,
      campusVideosList: [
        ...prev.campusVideosList,
        {
          title: "",
          youtubeUrl: "",
          thumbnailUrl: "",
          category: "Other",
          duration: "",
          order: prev.campusVideosList.length,
        },
      ],
    }));
  }

  function updateVideoRow(index: number, patch: Partial<CampusVideoRow>) {
    setForm((prev) => ({
      ...prev,
      campusVideosList: prev.campusVideosList.map((v, i) =>
        i === index ? { ...v, ...patch } : v
      ),
    }));
  }

  function removeVideoRow(index: number) {
    setForm((prev) => ({
      ...prev,
      campusVideosList: prev.campusVideosList.filter((_, i) => i !== index),
    }));
  }

  function updatePartner(patch: Partial<PartnerProfileForm>) {
    setForm((prev) => ({
      ...prev,
      partner: { ...prev.partner, ...patch },
    }));
  }

  function buildPartnerProfile() {
    const p = form.partner;
    return {
      website: p.website || null,
      tagline: p.tagline || null,
      overview: p.overview || null,
      highlights: p.highlights
        ? p.highlights
            .split("\n")
            .map((h) => h.trim())
            .filter(Boolean)
        : [],
      specializations: p.specializations
        ? p.specializations
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      established: p.established || null,
      accreditation: p.accreditation || null,
      logoUrls: p.logoUrls
        ? p.logoUrls
            .split("\n")
            .map((u) => u.trim())
            .filter(Boolean)
            .map((url) => ({ url, alt: "Logo" }))
        : [],
      heroImageUrl: p.heroImageUrl || null,
      links: p.links
        ? p.links
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean)
            .map((line) => {
              const [label, url] = line.split("|").map((s) => s.trim());
              return { label: label || "", url: url || "" };
            })
        : [],
    };
  }

  async function handleSave() {
    setSaving(true);
    try {
      const campusVideos = form.campusVideosList.map((v, idx) => {
        const youTubeId = extractYoutubeId(v.youtubeUrl);
        return {
          title: v.title,
          youtubeUrl: v.youtubeUrl,
          thumbnailUrl:
            v.thumbnailUrl ||
            (youTubeId
              ? `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`
              : ""),
          category: v.category,
          duration: v.duration,
          order: idx,
        };
      });

      const body = {
        id: editingId || undefined,
        name: form.name,
        shortName: form.shortName || form.name.split(" ")[0],
        city: form.city,
        established: form.established,
        rating: form.rating,
        type: form.type,
        about: form.about,
        tags: form.tags
          ? form.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        accreditation: form.accreditation
          ? form.accreditation
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        ranking: form.ranking,
        placementPct: form.placementPct,
        highestPlacement: form.highestPlacement,
        intake: form.intake,
        facilities: form.facilities
          ? form.facilities
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
        sourceWebsite: form.sourceWebsite || null,
        coverImage: form.coverImage || null,
        photos: form.photos
          ? form.photos
              .split("\n")
              .map((u) => u.trim())
              .filter(Boolean)
          : [],
        videoLinks: form.videoLinks
          ? form.videoLinks
              .split("\n")
              .map((u) => u.trim())
              .filter(Boolean)
          : [],
        campusVideos,
        partnerCollege: form.partnerCollege,
        partnerProfile: form.partnerCollege ? buildPartnerProfile() : null,
        isPublished: form.isPublished,
        budget: form.budget,
        programsList: form.programsList.filter((p) => p.name.trim()),
      };

      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/api/admin/colleges", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setEditingId(null);
        setForm({ ...EMPTY_FORM });
        fetchColleges();
      }
    } catch {}
    setSaving(false);
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/colleges?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchColleges();
      }
    } catch {}
  }

  const filtered = colleges.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.city || "").toLowerCase().includes(search.toLowerCase())
  );

  const showForm = editingId !== null || form.name !== "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">
            College Management
          </h1>
          <p className="text-sm text-slate-500">
            Create, edit and manage university cards.
          </p>
        </div>
        <Button variant="gold" onClick={startCreate}>
          <Plus className="h-4 w-4" /> Add College
        </Button>
      </div>

      <Input
        placeholder="Search colleges..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm rounded-xl"
      />

      {showForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-brand-950">
            {editingId ? "Edit College" : "Create New College"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Short Name</Label>
              <Input
                value={form.shortName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, shortName: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>City</Label>
              <Input
                value={form.city}
                onChange={(e) =>
                  setForm((p) => ({ ...p, city: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-1">
              <Label>Type</Label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((p) => ({ ...p, type: e.target.value }))
                }
                className="h-12 w-full rounded-xl border border-slate-200 px-3 text-sm"
              >
                <option>Private</option>
                <option>Government</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>Established</Label>
              <Input
                type="number"
                value={form.established}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    established: Number(e.target.value),
                  }))
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Rating</Label>
              <Input
                type="number"
                step="0.1"
                value={form.rating}
                onChange={(e) =>
                  setForm((p) => ({ ...p, rating: Number(e.target.value) }))
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Intake</Label>
              <Input
                type="number"
                value={form.intake}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    intake: Number(e.target.value),
                  }))
                }
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label>Placement %</Label>
              <Input
                type="number"
                value={form.placementPct}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    placementPct: Number(e.target.value),
                  }))
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Highest Placement (₹)</Label>
              <Input
                type="number"
                value={form.highestPlacement}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    highestPlacement: Number(e.target.value),
                  }))
                }
                className="rounded-xl"
              />
            </div>
            {form.partnerCollege && (
              <div className="space-y-1">
                <Label>Budget (₹)</Label>
                <Input
                  type="number"
                  value={form.budget}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      budget: Number(e.target.value),
                    }))
                  }
                  className="rounded-xl"
                />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Label>About</Label>
            <textarea
              value={form.about}
              onChange={(e) =>
                setForm((p) => ({ ...p, about: e.target.value }))
              }
              className="h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={form.tags}
                onChange={(e) =>
                  setForm((p) => ({ ...p, tags: e.target.value }))
                }
                placeholder="Engineering, Top Rated"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Accreditation (comma-separated)</Label>
              <Input
                value={form.accreditation}
                onChange={(e) =>
                  setForm((p) => ({ ...p, accreditation: e.target.value }))
                }
                placeholder="NAAC A+, UGC"
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Facilities (comma-separated)</Label>
              <Input
                value={form.facilities}
                onChange={(e) =>
                  setForm((p) => ({ ...p, facilities: e.target.value }))
                }
                placeholder="Hostel, Library, Sports"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Ranking</Label>
              <Input
                value={form.ranking}
                onChange={(e) =>
                  setForm((p) => ({ ...p, ranking: e.target.value }))
                }
                placeholder="NIRF #42"
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Source Website</Label>
              <Input
                value={form.sourceWebsite}
                onChange={(e) =>
                  setForm((p) => ({ ...p, sourceWebsite: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label>Cover Image URL</Label>
              <Input
                value={form.coverImage}
                onChange={(e) =>
                  setForm((p) => ({ ...p, coverImage: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Photos (one URL per line)</Label>
            <textarea
              value={form.photos}
              onChange={(e) =>
                setForm((p) => ({ ...p, photos: e.target.value }))
              }
              className="h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.partnerCollege}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    partnerCollege: e.target.checked,
                    budget: e.target.checked ? p.budget : 0,
                  }))
                }
                className="h-4 w-4 rounded"
              />{" "}
              Partner College
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) =>
                  setForm((p) => ({ ...p, isPublished: e.target.checked }))
                }
                className="h-4 w-4 rounded"
              />{" "}
              Published
            </label>
          </div>

          {form.partnerCollege && (
            <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 space-y-4">
              <h3 className="font-bold text-blue-900">Partner Profile</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Website</Label>
                  <Input
                    value={form.partner.website}
                    onChange={(e) => updatePartner({ website: e.target.value })}
                    className="rounded-xl bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Tagline</Label>
                  <Input
                    value={form.partner.tagline}
                    onChange={(e) => updatePartner({ tagline: e.target.value })}
                    className="rounded-xl bg-white"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Overview</Label>
                <textarea
                  value={form.partner.overview}
                  onChange={(e) => updatePartner({ overview: e.target.value })}
                  className="h-16 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Highlights (one per line)</Label>
                  <textarea
                    value={form.partner.highlights}
                    onChange={(e) => updatePartner({ highlights: e.target.value })}
                    className="h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Specializations (comma-separated)</Label>
                  <textarea
                    value={form.partner.specializations}
                    onChange={(e) =>
                      updatePartner({ specializations: e.target.value })
                    }
                    className="h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label>Established</Label>
                  <Input
                    value={form.partner.established}
                    onChange={(e) =>
                      updatePartner({ established: e.target.value })
                    }
                    className="rounded-xl bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Accreditation</Label>
                  <Input
                    value={form.partner.accreditation}
                    onChange={(e) =>
                      updatePartner({ accreditation: e.target.value })
                    }
                    className="rounded-xl bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Hero Image URL</Label>
                  <Input
                    value={form.partner.heroImageUrl}
                    onChange={(e) =>
                      updatePartner({ heroImageUrl: e.target.value })
                    }
                    className="rounded-xl bg-white"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Logo URLs (one per line)</Label>
                  <textarea
                    value={form.partner.logoUrls}
                    onChange={(e) => updatePartner({ logoUrls: e.target.value })}
                    className="h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label>Links (Label | URL, one per line)</Label>
                  <textarea
                    value={form.partner.links}
                    onChange={(e) => updatePartner({ links: e.target.value })}
                    className="h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-900">
                Campus Videos ({form.campusVideosList.length})
              </h3>
              <Button variant="outline" size="sm" onClick={addVideoRow}>
                <Play className="h-3 w-3" /> Add Video
              </Button>
            </div>
            {form.campusVideosList.map((vid, i) => {
              const thumbId = extractYoutubeId(vid.youtubeUrl);
              return (
                <div
                  key={i}
                  className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-12 items-end"
                >
                  <div className="flex items-center gap-1 text-slate-400">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">Title</Label>
                    <Input
                      value={vid.title}
                      onChange={(e) =>
                        updateVideoRow(i, { title: e.target.value })
                      }
                      className="h-8 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-3">
                    <Label className="text-xs">YouTube URL</Label>
                    <Input
                      value={vid.youtubeUrl}
                      onChange={(e) =>
                        updateVideoRow(i, { youtubeUrl: e.target.value })
                      }
                      className="h-8 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">Category</Label>
                    <select
                      value={vid.category}
                      onChange={(e) =>
                        updateVideoRow(i, { category: e.target.value })
                      }
                      className="h-8 w-full rounded-lg border border-slate-200 px-2 text-xs"
                    >
                      {VIDEO_CATEGORIES.map((cat) => (
                        <option key={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1 sm:col-span-1">
                    <Label className="text-xs">Duration</Label>
                    <Input
                      value={vid.duration}
                      onChange={(e) =>
                        updateVideoRow(i, { duration: e.target.value })
                      }
                      placeholder="5:30"
                      className="h-8 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label className="text-xs">Thumbnail</Label>
                    {thumbId ? (
                      <img
                        src={`https://img.youtube.com/vi/${thumbId}/hqdefault.jpg`}
                        alt="thumb"
                        className="h-8 w-14 rounded object-cover"
                      />
                    ) : (
                      <div className="h-8 w-14 rounded bg-slate-200" />
                    )}
                  </div>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-red-500"
                      onClick={() => removeVideoRow(i)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-900">
                Programs ({form.programsList.length})
              </h3>
              <div className="flex gap-2">
                <select
                  className="h-8 rounded-lg border border-slate-200 px-2 text-xs"
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    if (idx >= 0) addProgramRow(PROGRAM_PRESETS[idx]);
                    e.currentTarget.value = "";
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Quick add preset...
                  </option>
                  {PROGRAM_PRESETS.map((preset, i) => (
                    <option key={i} value={i}>
                      {preset.name}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="sm" onClick={() => addProgramRow()}>
                  <GraduationCap className="h-3 w-3" /> Custom
                </Button>
              </div>
            </div>
            {form.programsList.map((prog, i) => (
              <div
                key={i}
                className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-8"
              >
                <div className="space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={prog.name}
                    onChange={(e) =>
                      updateProgramRow(i, { name: e.target.value })
                    }
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Stream</Label>
                  <Input
                    value={prog.stream}
                    onChange={(e) =>
                      updateProgramRow(i, { stream: e.target.value })
                    }
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Years</Label>
                  <Input
                    type="number"
                    value={prog.durationYears ?? ""}
                    onChange={(e) =>
                      updateProgramRow(i, {
                        durationYears: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Annual Fee</Label>
                  <Input
                    type="number"
                    value={prog.annualFee ?? ""}
                    onChange={(e) =>
                      updateProgramRow(i, {
                        annualFee: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Total Fee</Label>
                  <Input
                    type="number"
                    value={prog.totalFee ?? ""}
                    onChange={(e) =>
                      updateProgramRow(i, {
                        totalFee: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Avg Placement</Label>
                  <Input
                    type="number"
                    value={prog.avgPlacement ?? ""}
                    onChange={(e) =>
                      updateProgramRow(i, {
                        avgPlacement: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Seats</Label>
                  <Input
                    type="number"
                    value={prog.seats ?? ""}
                    onChange={(e) =>
                      updateProgramRow(i, {
                        seats: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Eligibility</Label>
                  <Input
                    value={prog.eligibility}
                    onChange={(e) =>
                      updateProgramRow(i, { eligibility: e.target.value })
                    }
                    className="h-8 rounded-lg text-xs"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-red-500"
                    onClick={() => removeProgramRow(i)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="gold"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : editingId ? "Update College" : "Create College"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingId(null);
                setForm({ ...EMPTY_FORM });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading colleges...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((college) => (
            <div
              key={college.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-950 text-gold-500">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-950">
                      {college.name}
                    </p>
                    <p className="text-xs text-slate-500">{college.city}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {college.isPublished !== false ? (
                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                      <Eye className="h-3 w-3" /> Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                      <EyeOff className="h-3 w-3" /> Draft
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-gold-500" />{" "}
                  {Number(college.rating).toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3 w-3 text-brand-600" />{" "}
                  {(college.programs || []).length} programs
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" />{" "}
                  {college.city}
                </span>
                {college.partnerCollege && (
                  <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-semibold text-gold-700">
                    Partner
                  </span>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => startEdit(college)}
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() =>
                    window.open(`/college/${college.id}`, "_blank")
                  }
                >
                  Preview
                </Button>
                {deleteConfirm === college.id ? (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-red-600"
                      onClick={() => handleDelete(college.id)}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-red-500"
                    onClick={() => setDeleteConfirm(college.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
