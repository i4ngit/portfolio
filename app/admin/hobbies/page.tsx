"use client";

import { useState, useEffect, FormEvent } from "react";
import type { HobbyCategory } from "@/lib/types";
import { generateId } from "@/lib/utils";
import AdminFormField from "@/components/admin/AdminFormField";
import MultiPhotoUpload from "@/components/admin/MultiPhotoUpload";
import SaveBar from "@/components/admin/SaveBar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useSave } from "@/lib/useSave";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const EMPTY_CATEGORY: Omit<HobbyCategory, "id"> = {
  name: "", slug: "", tagline: "", coverImage: "", images: [],
};

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminHobbiesPage() {
  const [categories, setCategories] = useState<HobbyCategory[]>([]);
  const [editing, setEditing] = useState<HobbyCategory | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { save, state } = useSave("hobbies");

  useEffect(() => {
    fetch("/api/content/hobbies").then(r => r.json()).then(setCategories);
  }, []);

  async function persist(updated: HobbyCategory[]) {
    const ok = await save(updated);
    if (ok) setCategories(updated);
    return ok;
  }

  function startAdd() {
    setEditing({ id: generateId(), ...EMPTY_CATEGORY });
    setIsNew(true);
  }

  function startEdit(c: HobbyCategory) {
    setEditing({ ...c });
    setIsNew(false);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const withSlug = { ...editing, slug: editing.slug ? slugify(editing.slug) : slugify(editing.name) };
    const updated = isNew
      ? [...categories, withSlug]
      : categories.map(c => c.id === editing.id ? withSlug : c);
    const ok = await persist(updated);
    if (ok) setEditing(null);
  }

  async function handleDelete(id: string) {
    const ok = await persist(categories.filter(c => c.id !== id));
    if (ok) setDeleting(null);
  }

  function setField(key: keyof HobbyCategory) {
    return (value: string) => setEditing(prev => prev ? { ...prev, [key]: value } : prev);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-serif text-slate-text mb-6">Off the Clock</h1>

      <div className="flex justify-end mb-4">
        {!editing && <button onClick={startAdd} className="btn-primary"><Plus size={16} /> Add Category</button>}
      </div>

      {editing && (
        <form onSubmit={handleSave} className="card mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-text">{isNew ? "New Category" : "Edit Category"}</h2>
            <button type="button" onClick={() => setEditing(null)}><X size={18} className="text-muted" /></button>
          </div>

          <AdminFormField label="Name" name="name" value={editing.name} onChange={setField("name")} placeholder="Photography" required />
          <AdminFormField label="URL Slug" name="slug" value={editing.slug} onChange={setField("slug")} placeholder="photography" hint="Leave blank to auto-generate from the name." />
          <AdminFormField label="Tagline" name="tagline" value={editing.tagline ?? ""} onChange={setField("tagline")} type="textarea" rows={2} placeholder="A short description shown under the heading." />

          <div>
            <label className="admin-label">Gallery Photos</label>
            <MultiPhotoUpload
              images={editing.images}
              onChange={(images) => setEditing(prev => prev ? { ...prev, images } : prev)}
              namePrefix={`hobby-${editing.id}`}
            />
          </div>

          <SaveBar state={state} />
        </form>
      )}

      <div className="space-y-3">
        {categories.map(c => (
          <div key={c.id} className="card flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-text text-sm">{c.name}</p>
              <p className="text-xs text-navy mt-0.5">/off-the-clock/{c.slug}</p>
              <p className="text-xs text-muted mt-0.5">{c.images.length} photo{c.images.length === 1 ? "" : "s"}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(c)} className="p-1.5 text-muted hover:text-navy"><Pencil size={15} /></button>
              <button onClick={() => setDeleting(c.id)} className="p-1.5 text-muted hover:text-red-600"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {categories.length === 0 && !editing && <p className="text-muted text-sm py-6 text-center">No hobby categories yet.</p>}
      </div>

      <ConfirmDialog open={deleting !== null} title="Delete Category"
        description="This will permanently delete this hobby category and its photos."
        onConfirm={() => deleting && handleDelete(deleting)}
        onCancel={() => setDeleting(null)} />
    </div>
  );
}
