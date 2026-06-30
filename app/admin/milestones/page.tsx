"use client";

import { useState, useEffect, FormEvent } from "react";
import type { Milestone } from "@/lib/types";
import { generateId } from "@/lib/utils";
import AdminFormField from "@/components/admin/AdminFormField";
import SaveBar from "@/components/admin/SaveBar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useSave } from "@/lib/useSave";
import { Plus, Pencil, Trash2, X, CheckCircle2, Clock, Circle } from "lucide-react";

const EMPTY: Omit<Milestone, "id"> = {
  title: "", date: "", status: "upcoming", category: "academic",
};

const STATUS_OPTS = [
  { value: "completed", label: "Completed" },
  { value: "in-progress", label: "In Progress" },
  { value: "upcoming", label: "Upcoming" },
];

const CAT_OPTS = [
  { value: "academic", label: "Academic" },
  { value: "application", label: "Application" },
  { value: "recognition", label: "Recognition" },
  { value: "research", label: "Research" },
];

const STATUS_ICON = {
  completed: <CheckCircle2 size={14} className="text-gray-500" />,
  "in-progress": <Clock size={14} className="text-gray-400" />,
  upcoming: <Circle size={14} className="text-muted" />,
};

export default function AdminMilestonesPage() {
  const [items, setItems] = useState<Milestone[]>([]);
  const [editing, setEditing] = useState<Milestone | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { save, state } = useSave("milestones");

  useEffect(() => {
    fetch("/api/content/milestones").then(r => r.json()).then(setItems);
  }, []);

  async function persist(updated: Milestone[]) {
    const ok = await save(updated);
    if (ok) setItems(updated);
    return ok;
  }

  function startAdd() { setEditing({ id: generateId(), ...EMPTY }); setIsNew(true); }
  function startEdit(m: Milestone) { setEditing({ ...m }); setIsNew(false); }

  async function handleDelete(id: string) {
    const ok = await persist(items.filter(m => m.id !== id));
    if (ok) setDeleting(null);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const updated = isNew ? [...items, editing] : items.map(m => m.id === editing.id ? editing : m);
    const ok = await persist(updated);
    if (ok) setEditing(null);
  }

  function setField(key: keyof Milestone) {
    return (value: string) => setEditing(prev => prev ? { ...prev, [key]: value } : prev);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display text-gray-900">Milestones</h1>
        {!editing && <button onClick={startAdd} className="btn-primary"><Plus size={16} /> Add Milestone</button>}
      </div>

      {editing && (
        <form onSubmit={handleSave} className="card mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-900">{isNew ? "New Milestone" : "Edit Milestone"}</h2>
            <button type="button" onClick={() => setEditing(null)}><X size={18} className="text-muted" /></button>
          </div>
          <AdminFormField label="Title" name="title" value={editing.title} onChange={setField("title")} required />
          <div className="grid sm:grid-cols-3 gap-4">
            <AdminFormField label="Date" name="date" value={editing.date} onChange={setField("date")} placeholder="2025-06 or Spring 2026" required />
            <AdminFormField label="Status" name="status" value={editing.status} onChange={setField("status")} type="select" options={STATUS_OPTS} />
            <AdminFormField label="Category" name="category" value={editing.category} onChange={setField("category")} type="select" options={CAT_OPTS} />
          </div>
          <AdminFormField label="Detail (optional)" name="detail" value={editing.detail ?? ""} onChange={setField("detail")} placeholder="Score: 5XX, GPA: 3.9, etc." />
          <SaveBar state={state} />
        </form>
      )}

      <div className="space-y-3">
        {items.map(m => (
          <div key={m.id} className="card flex items-center gap-4">
            {STATUS_ICON[m.status]}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">{m.title}</p>
              <p className="text-xs text-muted mt-0.5">{m.date} · {m.category}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(m)} className="p-1.5 text-muted hover:text-gray-900"><Pencil size={15} /></button>
              <button onClick={() => setDeleting(m.id)} className="p-1.5 text-muted hover:text-red-600"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && !editing && <p className="text-muted text-sm py-6 text-center">No milestones yet.</p>}
      </div>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete Milestone"
        description="This will permanently delete this milestone."
        onConfirm={() => deleting && handleDelete(deleting)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
