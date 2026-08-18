"use client";

import { useEffect, useState } from "react";
import { Building2, Plus, Pencil, Star, MapPin, Trash2, Eye, EyeOff, GraduationCap } from "lucide-react";
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
  partnerCollege: boolean | null;
  isPublished: boolean | null;
  budget: string | null;
  programs: ProgramRow[];
}

const EMPTY_FORM = {
  name: "", shortName: "", city: "", established: 2020, rating: 4.0, type: "Private",
  about: "", tags: "", accreditation: "", ranking: "",
  placementPct: 85, highestPlacement: 1500000, intake: 600,
  facilities: "", sourceWebsite: "", coverImage: "", photos: "",
  videoLinks: "", partnerCollege: false, isPublished: true, budget: 80000,
  admissions: { exam: "", applicationFee: 500, deadline: "", minGPA: "" },
  costs: { hostelMonthly: 10000, livingMonthly: 8000 },
  scholarships: { available: false, details: "" },
  programsList: [] as ProgramRow[],
};

export default function AdminCollegesPage() {
  const [colleges, setColleges] = useState<CollegeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchColleges(); }, []);

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
      admissions: (college.admissions as { exam: string; applicationFee: number; deadline: string; minGPA: string } | null) || { exam: "", applicationFee: 500, deadline: "", minGPA: "" },
      costs: (college.costs as { hostelMonthly: number; livingMonthly: number } | null) || { hostelMonthly: 10000, livingMonthly: 8000 },
      scholarships: (college.scholarships as { available: boolean; details: string } | null) || { available: false, details: "" },
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
    });
  }

  function addProgramRow() {
    setForm((prev) => ({
      ...prev,
      programsList: [...prev.programsList, { name: "", stream: "", durationYears: null, annualFee: null, totalFee: null, avgPlacement: null, eligibility: "", seats: null }],
    }));
  }

  function updateProgramRow(index: number, patch: Partial<ProgramRow>) {
    setForm((prev) => ({
      ...prev,
      programsList: prev.programsList.map((p, i) => i === index ? { ...p, ...patch } : p),
    }));
  }

  function removeProgramRow(index: number) {
    setForm((prev) => ({
      ...prev,
      programsList: prev.programsList.filter((_, i) => i !== index),
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const body = {
        id: editingId || undefined,
        name: form.name,
        shortName: form.shortName || form.name.split(" ")[0],
        city: form.city,
        established: form.established,
        rating: form.rating,
        type: form.type,
        about: form.about,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        accreditation: form.accreditation ? form.accreditation.split(",").map((t) => t.trim()).filter(Boolean) : [],
        ranking: form.ranking,
        admissions: form.admissions,
        costs: form.costs,
        scholarships: form.scholarships,
        placementPct: form.placementPct,
        highestPlacement: form.highestPlacement,
        intake: form.intake,
        facilities: form.facilities ? form.facilities.split(",").map((t) => t.trim()).filter(Boolean) : [],
        sourceWebsite: form.sourceWebsite || null,
        coverImage: form.coverImage || null,
        photos: form.photos ? form.photos.split("\n").map((u) => u.trim()).filter(Boolean) : [],
        videoLinks: form.videoLinks ? form.videoLinks.split("\n").map((u) => u.trim()).filter(Boolean) : [],
        partnerCollege: form.partnerCollege,
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
        setForm(EMPTY_FORM);
        fetchColleges();
      }
    } catch {}
    setSaving(false);
  }

  const filtered = colleges.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.city || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">College Management</h1>
          <p className="text-sm text-slate-500">Create, edit and manage university cards.</p>
        </div>
        <Button variant="gold" onClick={startCreate}><Plus className="h-4 w-4" /> Add College</Button>
      </div>

      <Input placeholder="Search colleges..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm rounded-xl" />

      {/* Edit / Create form */}
      {(editingId !== null || form.name !== "") && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-brand-950">{editingId ? "Edit College" : "Create New College"}</h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1"><Label>Name *</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Short Name</Label><Input value={form.shortName} onChange={(e) => setForm((p) => ({ ...p, shortName: e.target.value }))} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>City</Label><Input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} className="rounded-xl" /></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <div className="space-y-1"><Label>Type</Label>
              <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} className="h-12 w-full rounded-xl border border-slate-200 px-3 text-sm">
                <option>Private</option><option>Government</option>
              </select>
            </div>
            <div className="space-y-1"><Label>Established</Label><Input type="number" value={form.established} onChange={(e) => setForm((p) => ({ ...p, established: Number(e.target.value) }))} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Rating</Label><Input type="number" step="0.1" value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Intake</Label><Input type="number" value={form.intake} onChange={(e) => setForm((p) => ({ ...p, intake: Number(e.target.value) }))} className="rounded-xl" /></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1"><Label>Placement %</Label><Input type="number" value={form.placementPct} onChange={(e) => setForm((p) => ({ ...p, placementPct: Number(e.target.value) }))} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Highest Placement (₹)</Label><Input type="number" value={form.highestPlacement} onChange={(e) => setForm((p) => ({ ...p, highestPlacement: Number(e.target.value) }))} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Budget (₹)</Label><Input type="number" value={form.budget} onChange={(e) => setForm((p) => ({ ...p, budget: Number(e.target.value) }))} className="rounded-xl" /></div>
          </div>

          <div className="space-y-1"><Label>About</Label><textarea value={form.about} onChange={(e) => setForm((p) => ({ ...p, about: e.target.value }))} className="h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1"><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))} placeholder="Engineering, Top Rated" className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Accreditation (comma-separated)</Label><Input value={form.accreditation} onChange={(e) => setForm((p) => ({ ...p, accreditation: e.target.value }))} placeholder="NAAC A+, UGC" className="rounded-xl" /></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1"><Label>Facilities (comma-separated)</Label><Input value={form.facilities} onChange={(e) => setForm((p) => ({ ...p, facilities: e.target.value }))} placeholder="Hostel, Library, Sports" className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Ranking</Label><Input value={form.ranking} onChange={(e) => setForm((p) => ({ ...p, ranking: e.target.value }))} placeholder="NIRF #42" className="rounded-xl" /></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1"><Label>Cover Image URL</Label><Input value={form.coverImage} onChange={(e) => setForm((p) => ({ ...p, coverImage: e.target.value }))} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Official Website</Label><Input value={form.sourceWebsite} onChange={(e) => setForm((p) => ({ ...p, sourceWebsite: e.target.value }))} className="rounded-xl" /></div>
            <div className="space-y-1"><Label>Ranking</Label><Input value={form.ranking} onChange={(e) => setForm((p) => ({ ...p, ranking: e.target.value }))} className="rounded-xl" /></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1"><Label>Photo URLs (one per line)</Label><textarea value={form.photos} onChange={(e) => setForm((p) => ({ ...p, photos: e.target.value }))} className="h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>
            <div className="space-y-1"><Label>Video URLs (one per line)</Label><textarea value={form.videoLinks} onChange={(e) => setForm((p) => ({ ...p, videoLinks: e.target.value }))} className="h-20 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" /></div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.partnerCollege} onChange={(e) => setForm((p) => ({ ...p, partnerCollege: e.target.checked }))} className="h-4 w-4 rounded" /> Partner College</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))} className="h-4 w-4 rounded" /> Published</label>
          </div>

          {/* Programs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-surface-900">Programs ({form.programsList.length})</h3>
              <Button variant="outline" size="sm" onClick={addProgramRow}><Plus className="h-3 w-3" /> Add Program</Button>
            </div>
            {form.programsList.map((prog, i) => (
              <div key={i} className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-6">
                <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={prog.name} onChange={(e) => updateProgramRow(i, { name: e.target.value })} className="h-8 rounded-lg text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Stream</Label><Input value={prog.stream} onChange={(e) => updateProgramRow(i, { stream: e.target.value })} className="h-8 rounded-lg text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Years</Label><Input type="number" value={prog.durationYears ?? ""} onChange={(e) => updateProgramRow(i, { durationYears: e.target.value ? Number(e.target.value) : null })} className="h-8 rounded-lg text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Annual Fee</Label><Input type="number" value={prog.annualFee ?? ""} onChange={(e) => updateProgramRow(i, { annualFee: e.target.value ? Number(e.target.value) : null })} className="h-8 rounded-lg text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Avg Placement</Label><Input type="number" value={prog.avgPlacement ?? ""} onChange={(e) => updateProgramRow(i, { avgPlacement: e.target.value ? Number(e.target.value) : null })} className="h-8 rounded-lg text-xs" /></div>
                <div className="flex items-end"><Button variant="ghost" size="sm" className="h-8 text-red-500" onClick={() => removeProgramRow(i)}><Trash2 className="h-3 w-3" /></Button></div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="gold" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : editingId ? "Update College" : "Create College"}</Button>
            <Button variant="outline" onClick={() => { setEditingId(null); setForm(EMPTY_FORM); }}>Cancel</Button>
          </div>
        </div>
      )}

      {/* College list */}
      {loading ? (
        <p className="text-sm text-slate-500">Loading colleges...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((college) => (
            <div key={college.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-950 text-gold-500">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-950">{college.name}</p>
                    <p className="text-xs text-slate-500">{college.city}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {college.isPublished !== false ? (
                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700"><Eye className="h-3 w-3" /> Live</span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500"><EyeOff className="h-3 w-3" /> Draft</span>
                  )}
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1"><Star className="h-3 w-3 text-gold-500" /> {Number(college.rating).toFixed(1)}</span>
                <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3 text-brand-600" /> {(college.programs || []).length} programs</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-slate-400" /> {college.city}</span>
                {college.partnerCollege && <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-semibold text-gold-700">Partner</span>}
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => startEdit(college)}><Pencil className="h-3 w-3" /> Edit</Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => window.open(`/college/${college.id}`, "_blank")}>Preview</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
