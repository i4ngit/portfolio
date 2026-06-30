"use client";

import { useState, useEffect, FormEvent } from "react";
import type { ExperienceEntry } from "@/lib/types";
import { generateId, formatDate } from "@/lib/utils";
import AdminFormField from "@/components/admin/AdminFormField";
import SaveBar from "@/components/admin/SaveBar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useSave } from "@/lib/useSave";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const EMPTY: Omit<ExperienceEntry, "id"> = {
  role: "", organization: "", type: "research",
  startDate: "", endDate: "present", location: "", bullets: [],
};

const TYPE_OPTS = [
  { value: "research", label: "Research" },
  { value: "clinical", label: "Clinical" },
  { value: "volunteer", label: "Volunteer" },
  { value: "academic", label: "Academic" },
];

export default function AdminExperiencePage() {
  const [items, setItems] = useState<ExperienceEntry[]>([]);
  const [editing, setEditing] = useState<ExperienceEntry | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [bulletsText, setBulletsText] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const { save, state } = useSave("experience");

  useEffect(() => {
    fetch("/api/content/experience").then(r => r.json()).then(setItems);
  }, []);

  async function persist(updated: ExperienceEntry[]) {
    const ok = await save(updated);
    if (ok) setItems(updated);
    return ok;
  }

  function startAdd() {
    setEditing({ id: generateId(), ...EMPTY });
    setBulletsText("");
    setIsNew(true);
  }

  function startEdit(e: ExperienceEntry) {
    setEditing({ ...e });
    setBulletsText(e.bullets.join("\n"));
    setIsNew(false);
  }

  async function handleDelete(id: string) {
    const ok = await persist(items.filter(i => i.id !== id));
    if (ok) setDeleting(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const withBullets = {
      ...editing,
      bullets: bulletsText.split("\n").map(b => b.trim()).filter(Boolean),
    };
    const updated = isNew ? [...items, withBullets] : items.map(i => i.id === editing.id ? withBullets : i);
    const ok = await persist(updated);
    if (ok) setEditing(null);
  }

  function setField(key: keyof ExperienceEntry) {
    return (value: string) => setEditing(prev => prev ? { ...prev, [key]: value } : prev);
  }

  const sorted = [...items].sort((a, b) => {
    const aEnd = a.endDate === "present" ? "9999-12" : a.endDate;
    const bEnd = b.endDate === "present" ? "9999-12" : b.endDate;
    return bEnd.localeCompare(aEnd);
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-serif text-slate-text">Experience</h1>
        {!editing && <button onClick={startAdd} className="btn-primary"><Plus size={16} /> Add Entry</button>}
      </div>

      {editing && (
        <form onSubmit={handleSave} className="card mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-slate-text">{isNew ? "New Entry" : "Edit Entry"}</h2>
            <button type="button" onClick={() => setEditing(null)}><X size={18} className="text-muted" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminFormField label="Role / Title" name="role" value={editing.role} onChange={setField("role")} required />
            <AdminFormField label="Organization" name="organization" value={editing.organization} onChange={setField("organization")} required />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <AdminFormField label="Type" name="type" value={editing.type} onChange={setField("type")} type="select" options={TYPE_OPTS} />
            <AdminFormField label="Start Date" name="startDate" value={editing.startDate} onChange={setField("startDate")} placeholder="2023-09" required />
            <AdminFormField label="End Date" name="endDate" value={editing.endDate} onChange={setField("endDate")} placeholder="present or 2024-05" required />
          </div>
          <AdminFormField label="Location" name="location" value={editing.location} onChange={setField("location")} placeholder="City, State" />
          <div>
            <label className="admin-label">Bullet Points</label>
            <textarea
              value={bulletsText}
              onChange={e => setBulletsText(e.target.value)}
              rows={5}
              className="admin-input resize-y"
              placeholder="One bullet point per line"
            />
            <p className="mt-1 text-xs text-muted">Each line becomes a bullet point.</p>
          </div>
          <SaveBar state={state} />
        </form>
      )}

      <div className="space-y-3">
        {sorted.map(entry => (
          <div key={entry.id} className="card flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-text text-sm">{entry.role}</p>
              <p className="text-xs text-navy mt-0.5">{entry.organization}</p>
              <p className="text-xs text-muted mt-0.5">
                {formatDate(entry.startDate)} – {formatDate(entry.endDate)} · {entry.type}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(entry)} className="p-1.5 text-muted hover:text-navy"><Pencil size={15} /></button>
              <button onClick={() => setDeleting(entry.id)} className="p-1.5 text-muted hover:text-red-600"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !editing && <p className="text-muted text-sm py-6 text-center">No experience entries yet.</p>}
      </div>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete Entry"
        description="This will permanently delete this experience entry."
        onConfirm={() => deleting && handleDelete(deleting)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
