"use client";

import { useEffect, useState } from "react";
import { Newspaper, Plus, Pencil, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewsRow {
  id: string;
  title: string;
  excerpt: string | null;
  category: string;
  date: string;
  externalUrl: string | null;
  isPublished: boolean | null;
}

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  category: "Exams",
  date: new Date().toISOString().slice(0, 10),
  externalUrl: "",
  isPublished: true,
};

const CATEGORIES = ["Exams", "Admissions", "Scholarships", "Results", "College", "General"];

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function fetchNews() {
    try {
      const res = await fetch("/api/admin/news");
      const data = await res.json();
      if (res.ok) setItems(data.items || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNews();
  }, []);

  function startCreate() {
    setIsCreating(true);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSaveError(null);
  }

  function startEdit(item: NewsRow) {
    setIsCreating(false);
    setEditingId(item.id);
    setForm({
      title: item.title,
      excerpt: item.excerpt || "",
      category: item.category,
      date: item.date.slice(0, 10),
      externalUrl: item.externalUrl || "",
      isPublished: item.isPublished !== false,
    });
    setSaveError(null);
  }

  function cancelForm() {
    setIsCreating(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSaveError(null);
  }

  async function handleSave() {
    if (!form.title.trim() || !form.date) {
      setSaveError("Title and date are required.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const body = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        category: form.category,
        date: form.date,
        externalUrl: form.externalUrl.trim() || null,
        isPublished: form.isPublished,
      };
      const res = await fetch(
        editingId ? `/api/admin/news` : `/api/admin/news`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingId ? { id: editingId, ...body } : body),
        }
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setSaveError(data?.error || "Failed to save news item.");
        return;
      }
      cancelForm();
      setSearch("");
      fetchNews();
    } catch {
      setSaveError("Network error while saving.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/news?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchNews();
      }
    } catch {}
  }

  const filtered = items.filter(
    (n) =>
      !search ||
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase())
  );

  const showForm = isCreating || editingId !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-950">News &amp; Updates</h1>
          <p className="text-sm text-slate-500">
            Manage announcements shown across the site.
          </p>
        </div>
        <Button variant="gold" onClick={startCreate}>
          <Plus className="h-4 w-4" /> Add News
        </Button>
      </div>

      <Input
        placeholder="Search news..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm rounded-xl"
      />

      {showForm && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="text-lg font-bold text-brand-950">
            {editingId ? "Edit News Item" : "Create News Item"}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="rounded-xl"
                placeholder="e.g. CAT 2027 application window opens"
              />
            </div>
            <div className="space-y-1">
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>Date *</Label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label>External Link (exam portal / notice URL)</Label>
              <Input
                value={form.externalUrl}
                onChange={(e) => setForm((p) => ({ ...p, externalUrl: e.target.value }))}
                className="rounded-xl"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Excerpt</Label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-input bg-white px-3 py-2 text-sm"
                placeholder="One or two lines about this update…"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(e) => setForm((p) => ({ ...p, isPublished: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-brand-600"
              />
              Published
            </label>
          </div>

          {saveError && <p className="text-sm font-medium text-red-600">{saveError}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={cancelForm} disabled={saving}>
              Cancel
            </Button>
            <Button variant="gold" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editingId ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading news...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-slate-500">No news items yet. Click "Add News" to create one.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-950 text-gold-500">
                    <Newspaper className="h-4 w-4" />
                  </div>
                  <span className="rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-semibold text-gold-700">
                    {item.category}
                  </span>
                </div>
                {item.isPublished !== false ? (
                  <span className="flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                    <Eye className="h-3 w-3" /> Live
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                    <EyeOff className="h-3 w-3" /> Draft
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm font-bold text-brand-950">{item.title}</p>
              {item.excerpt && (
                <p className="mt-1 line-clamp-3 text-xs text-slate-500">{item.excerpt}</p>
              )}
              <p className="mt-2 text-[11px] text-slate-400">{item.date}</p>

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => startEdit(item)}>
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
                {item.externalUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => window.open(item.externalUrl!, "_blank", "noopener")}
                  >
                    <ExternalLink className="h-3 w-3" /> Open
                  </Button>
                )}
                {deleteConfirm === item.id ? (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-red-600" onClick={() => handleDelete(item.id)}>
                      Confirm
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setDeleteConfirm(null)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="sm" className="h-8 text-xs text-red-500" onClick={() => setDeleteConfirm(item.id)}>
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