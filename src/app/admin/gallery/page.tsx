"use client";

import { useEffect, useState, useRef } from "react";
import {
  ImagePlus,
  Trash2,
  Eye,
  EyeOff,
  Pencil,
  Upload,
  X,
  Images,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  dateLabel: string | null;
  sortOrder: number;
  published: boolean;
  createdAt: string;
}

const CATEGORIES = ["Events", "Campus Visits", "Achievements", "Team", "Seminar", "Other"];

const emptyForm = { title: "", category: "Events", dateLabel: "", sortOrder: 0 };

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      const data = await res.json();
      setPhotos(data.photos || []);
    } catch {
      setError("Failed to load photos");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.category) {
      setError("Title and category are required");
      return;
    }
    if (!editingId && !file) {
      setError("Please select a photo to upload");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (editingId) {
        const body: Record<string, unknown> = { id: editingId, title: form.title, category: form.category, dateLabel: form.dateLabel || null, sortOrder: form.sortOrder };
        const res = await fetch("/api/admin/gallery", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error("Failed to update photo");
      } else {
        const fd = new FormData();
        fd.append("file", file!);
        fd.append("title", form.title);
        fd.append("category", form.category);
        fd.append("dateLabel", form.dateLabel);
        fd.append("sortOrder", String(form.sortOrder));
        const res = await fetch("/api/admin/gallery", { method: "POST", body: fd });
        if (!res.ok) throw new Error("Failed to upload photo");
      }
      resetForm();
      fetchPhotos();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setFile(null);
    setPreview(null);
    setEditingId(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  function startEdit(photo: GalleryPhoto) {
    setEditingId(photo.id);
    setForm({ title: photo.title, category: photo.category, dateLabel: photo.dateLabel || "", sortOrder: photo.sortOrder });
    setFile(null);
    setPreview(null);
  }

  async function togglePublished(photo: GalleryPhoto) {
    await fetch("/api/admin/gallery", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: photo.id, published: !photo.published }) });
    fetchPhotos();
  }

  async function deletePhoto(photo: GalleryPhoto) {
    if (!confirm(`Delete "${photo.title}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/gallery?id=${photo.id}&imageUrl=${encodeURIComponent(photo.imageUrl)}`, { method: "DELETE" });
    if (editingId === photo.id) resetForm();
    fetchPhotos();
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-gold-500"><Images className="h-5 w-5" /></div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand-950">Gallery Management</h1>
            <p className="text-sm text-slate-500">Upload and manage photos for the public gallery page</p>
          </div>
        </div>

        {/* Upload form */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-heading text-lg font-bold text-brand-950">{editingId ? "Edit Photo" : "Add New Photo"}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Campus Visit — Christ University" className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Date label</Label>
                  <Input value={form.dateLabel} onChange={(e) => setForm({ ...form, dateLabel: e.target.value })} placeholder="Jan 2026" className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sort order</Label>
                <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="w-24 rounded-xl" />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Photo</Label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {preview || editingId ? (
                <div className="relative overflow-hidden rounded-xl border border-slate-200">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview} alt="Preview" className="h-48 w-full object-cover" />
                  ) : editingId && photos.find((p) => p.id === editingId) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photos.find((p) => p.id === editingId)?.imageUrl} alt="Current" className="h-48 w-full object-cover" />
                  ) : null}
                  {preview && (
                    <button onClick={() => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }} className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"><X className="h-4 w-4" /></button>
                  )}
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="flex h-48 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-brand-400 hover:bg-brand-50">
                  <Upload className="h-8 w-8 text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">Click to upload</span>
                  <span className="text-xs text-slate-400">JPG, PNG, WebP</span>
                </button>
              )}
              {!editingId && (
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => fileRef.current?.click()}>
                  <ImagePlus className="mr-1.5 h-4 w-4" /> Choose file
                </Button>
              )}
            </div>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-4 flex gap-2">
            <Button className="rounded-xl bg-brand-gradient text-white" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update Photo" : "Upload Photo"}
            </Button>
            {editingId && <Button variant="outline" className="rounded-xl" onClick={resetForm}>Cancel</Button>}
          </div>
        </div>

        {/* Photo grid */}
        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">Loading photos...</div>
        ) : photos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
            <Images className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-600">No photos yet. Upload your first one above.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {photos.map((photo) => (
              <div key={photo.id} className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-float ${!photo.published ? "opacity-60" : ""}`}>
                <div className="relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.imageUrl} alt={photo.title} className="h-44 w-full object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute left-2 top-2 flex gap-1">
                    <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">{photo.category}</span>
                    {!photo.published && <span className="rounded-full bg-red-500/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">Draft</span>}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-sm font-bold text-brand-950 truncate">{photo.title}</h3>
                  {photo.dateLabel && <p className="mt-0.5 text-xs text-slate-500">{photo.dateLabel}</p>}
                  <div className="mt-3 flex gap-1.5">
                    <Button variant="outline" size="sm" className="h-8 rounded-lg px-2" onClick={() => startEdit(photo)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg px-2" onClick={() => togglePublished(photo)}>
                      {photo.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg px-2 text-red-600 hover:bg-red-50" onClick={() => deletePhoto(photo)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
