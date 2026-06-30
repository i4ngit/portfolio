"use client";

import { useState, useEffect, FormEvent } from "react";
import type { NewsPost } from "@/lib/types";
import { generateId, formatDate } from "@/lib/utils";
import AdminFormField from "@/components/admin/AdminFormField";
import SaveBar from "@/components/admin/SaveBar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useSave } from "@/lib/useSave";
import { Plus, Pencil, Trash2, X } from "lucide-react";

const EMPTY_POST: Omit<NewsPost, "id"> = {
  title: "", date: new Date().toISOString().slice(0, 10), content: "", category: "general",
};

const CATEGORY_OPTIONS = [
  { value: "award", label: "Award" },
  { value: "research", label: "Research" },
  { value: "clinical", label: "Clinical" },
  { value: "general", label: "General" },
];

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [editing, setEditing] = useState<NewsPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { save, state } = useSave("news");

  useEffect(() => {
    fetch("/api/content/news").then(r => r.json()).then(setPosts);
  }, []);

  async function persist(updated: NewsPost[]) {
    const ok = await save(updated);
    if (ok) setPosts(updated);
    return ok;
  }

  function startAdd() {
    setEditing({ id: generateId(), ...EMPTY_POST } as NewsPost);
    setIsNew(true);
  }

  function startEdit(post: NewsPost) {
    setEditing({ ...post });
    setIsNew(false);
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const updated = isNew
      ? [editing, ...posts]
      : posts.map(p => p.id === editing.id ? editing : p);
    const ok = await persist(updated);
    if (ok) setEditing(null);
  }

  async function handleDelete(id: string) {
    const ok = await persist(posts.filter(p => p.id !== id));
    if (ok) setDeleting(null);
  }

  function setField(key: keyof NewsPost) {
    return (value: string) => setEditing(prev => prev ? { ...prev, [key]: value } : prev);
  }

  const sorted = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display text-gray-900">News & Updates</h1>
        {!editing && (
          <button onClick={startAdd} className="btn-primary">
            <Plus size={16} /> Add Post
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSave} className="card mb-6 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-900">{isNew ? "New Post" : "Edit Post"}</h2>
            <button type="button" onClick={() => setEditing(null)} className="text-muted hover:text-gray-900">
              <X size={18} />
            </button>
          </div>
          <AdminFormField label="Title" name="title" value={editing.title} onChange={setField("title")} required />
          <div className="grid sm:grid-cols-2 gap-4">
            <AdminFormField label="Date" name="date" value={editing.date} onChange={setField("date")} placeholder="YYYY-MM-DD" required />
            <AdminFormField label="Category" name="category" value={editing.category} onChange={setField("category")} type="select" options={CATEGORY_OPTIONS} />
          </div>
          <AdminFormField label="Content" name="content" value={editing.content} onChange={setField("content")} type="textarea" rows={6} hint="Supports Markdown." required />
          <SaveBar state={state} label="Save Post" />
        </form>
      )}

      <div className="space-y-3">
        {sorted.map(post => (
          <div key={post.id} className="card flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">{post.title}</p>
              <p className="text-xs text-muted mt-0.5">{formatDate(post.date)} · {post.category}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(post)} className="p-1.5 text-muted hover:text-gray-900 transition-colors" aria-label="Edit">
                <Pencil size={15} />
              </button>
              <button onClick={() => setDeleting(post.id)} className="p-1.5 text-muted hover:text-red-600 transition-colors" aria-label="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {posts.length === 0 && !editing && (
          <p className="text-muted text-sm py-6 text-center">No posts yet. Click &quot;Add Post&quot; to get started.</p>
        )}
      </div>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete Post"
        description="This will permanently delete this news post. This action cannot be undone."
        onConfirm={() => deleting && handleDelete(deleting)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
