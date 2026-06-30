"use client";

import { useState, useEffect, FormEvent } from "react";
import type { ResearchProject, Publication } from "@/lib/types";
import { generateId } from "@/lib/utils";
import AdminFormField from "@/components/admin/AdminFormField";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";

// --- Research Projects ---

const EMPTY_PROJECT: Omit<ResearchProject, "id"> = {
  title: "", lab: "", institution: "", description: "",
  period: "", tags: [], featured: false,
};

const EMPTY_PUB: Omit<Publication, "id"> = {
  title: "", authors: "", journal: "", year: new Date().getFullYear(),
  type: "journal", doi: "", link: "", abstract: "",
};

const PUB_TYPE_OPTS = [
  { value: "journal", label: "Journal Article" },
  { value: "conference", label: "Conference Paper" },
  { value: "poster", label: "Poster" },
  { value: "preprint", label: "Preprint" },
];

export default function AdminResearchPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [editingProject, setEditingProject] = useState<ResearchProject | null>(null);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isNewPub, setIsNewPub] = useState(false);
  const [tagsText, setTagsText] = useState("");
  const [deletingProject, setDeletingProject] = useState<string | null>(null);
  const [deletingPub, setDeletingPub] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"projects" | "publications">("projects");

  useEffect(() => {
    Promise.all([
      fetch("/api/content/research").then(r => r.json()),
      fetch("/api/content/publications").then(r => r.json()),
    ]).then(([r, p]) => { setProjects(r); setPubs(p); });
  }, []);

  async function saveProjects(updated: ResearchProject[]) {
    setSaving(true);
    await fetch("/api/content/research", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    setProjects(updated);
    setSaving(false);
  }

  async function savePubs(updated: Publication[]) {
    setSaving(true);
    await fetch("/api/content/publications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    setPubs(updated);
    setSaving(false);
  }

  // Project handlers
  function startAddProject() { setEditingProject({ id: generateId(), ...EMPTY_PROJECT }); setTagsText(""); setIsNewProject(true); }
  function startEditProject(p: ResearchProject) { setEditingProject({ ...p }); setTagsText(p.tags.join(", ")); setIsNewProject(false); }

  async function handleSaveProject(e: FormEvent) {
    e.preventDefault();
    if (!editingProject) return;
    const withTags = { ...editingProject, tags: tagsText.split(",").map(t => t.trim()).filter(Boolean) };
    const updated = isNewProject ? [...projects, withTags] : projects.map(p => p.id === editingProject.id ? withTags : p);
    await saveProjects(updated);
    setEditingProject(null);
  }

  async function handleDeleteProject(id: string) { await saveProjects(projects.filter(p => p.id !== id)); setDeletingProject(null); }

  function setProjectField(key: keyof ResearchProject) {
    return (value: string) => setEditingProject(prev => prev ? { ...prev, [key]: value } : prev);
  }

  // Publication handlers
  function startAddPub() { setEditingPub({ id: generateId(), ...EMPTY_PUB }); setIsNewPub(true); }
  function startEditPub(p: Publication) { setEditingPub({ ...p }); setIsNewPub(false); }

  async function handleSavePub(e: FormEvent) {
    e.preventDefault();
    if (!editingPub) return;
    const updated = isNewPub ? [...pubs, editingPub] : pubs.map(p => p.id === editingPub.id ? editingPub : p);
    await savePubs(updated);
    setEditingPub(null);
  }

  async function handleDeletePub(id: string) { await savePubs(pubs.filter(p => p.id !== id)); setDeletingPub(null); }

  function setPubField(key: keyof Publication) {
    return (value: string) => setEditingPub(prev => prev ? { ...prev, [key]: key === "year" ? parseInt(value) || 0 : value } : prev);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-serif text-slate-text mb-6">Research</h1>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface rounded-lg border border-border mb-6 w-fit">
        {(["projects", "publications"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${tab === t ? "bg-white shadow-sm text-slate-text" : "text-muted hover:text-slate-text"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Projects tab */}
      {tab === "projects" && (
        <>
          <div className="flex justify-end mb-4">
            {!editingProject && <button onClick={startAddProject} className="btn-primary"><Plus size={16} /> Add Project</button>}
          </div>

          {editingProject && (
            <form onSubmit={handleSaveProject} className="card mb-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-slate-text">{isNewProject ? "New Project" : "Edit Project"}</h2>
                <button type="button" onClick={() => setEditingProject(null)}><X size={18} className="text-muted" /></button>
              </div>
              <AdminFormField label="Title" name="title" value={editingProject.title} onChange={setProjectField("title")} required />
              <div className="grid sm:grid-cols-2 gap-4">
                <AdminFormField label="Lab / Group" name="lab" value={editingProject.lab} onChange={setProjectField("lab")} required />
                <AdminFormField label="Institution" name="institution" value={editingProject.institution} onChange={setProjectField("institution")} required />
              </div>
              <AdminFormField label="Description" name="description" value={editingProject.description} onChange={setProjectField("description")} type="textarea" rows={4} required />
              <div className="grid sm:grid-cols-2 gap-4">
                <AdminFormField label="Period" name="period" value={editingProject.period} onChange={setProjectField("period")} placeholder="2024 – Present" required />
                <AdminFormField label="Tags (comma-separated)" name="tags" value={tagsText} onChange={setTagsText} placeholder="Neuroscience, fMRI, TBI" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={editingProject.featured}
                  onChange={e => setEditingProject(prev => prev ? { ...prev, featured: e.target.checked } : prev)}
                  className="rounded border-border text-navy focus:ring-navy" />
                <label htmlFor="featured" className="text-sm text-slate-text">Featured project (shown prominently)</label>
              </div>
              <div className="flex gap-3 pt-2 border-t border-border">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save"}</button>
                <button type="button" onClick={() => setEditingProject(null)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {projects.map(p => (
              <div key={p.id} className="card flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-slate-text text-sm">{p.title}</p>
                    {p.featured && <Star size={12} className="text-amber-500 fill-amber-500" />}
                  </div>
                  <p className="text-xs text-navy mt-0.5">{p.lab} · {p.institution}</p>
                  <p className="text-xs text-muted mt-0.5">{p.period} · {p.tags.join(", ")}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEditProject(p)} className="p-1.5 text-muted hover:text-navy"><Pencil size={15} /></button>
                  <button onClick={() => setDeletingProject(p.id)} className="p-1.5 text-muted hover:text-red-600"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
            {projects.length === 0 && !editingProject && (
              <p className="text-muted text-sm py-6 text-center">No projects yet.</p>
            )}
          </div>

          <ConfirmDialog open={deletingProject !== null} title="Delete Project"
            description="This will permanently delete this research project."
            onConfirm={() => deletingProject && handleDeleteProject(deletingProject)}
            onCancel={() => setDeletingProject(null)} />
        </>
      )}

      {/* Publications tab */}
      {tab === "publications" && (
        <>
          <div className="flex justify-end mb-4">
            {!editingPub && <button onClick={startAddPub} className="btn-primary"><Plus size={16} /> Add Publication</button>}
          </div>

          {editingPub && (
            <form onSubmit={handleSavePub} className="card mb-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-slate-text">{isNewPub ? "New Publication" : "Edit Publication"}</h2>
                <button type="button" onClick={() => setEditingPub(null)}><X size={18} className="text-muted" /></button>
              </div>
              <AdminFormField label="Title" name="title" value={editingPub.title} onChange={setPubField("title")} required />
              <AdminFormField label="Authors" name="authors" value={editingPub.authors} onChange={setPubField("authors")} placeholder="Ocampo I, Smith J, et al." required />
              <div className="grid sm:grid-cols-3 gap-4">
                <AdminFormField label="Journal / Venue" name="journal" value={editingPub.journal} onChange={setPubField("journal")} required />
                <AdminFormField label="Year" name="year" value={String(editingPub.year)} onChange={setPubField("year")} type="number" required />
                <AdminFormField label="Type" name="type" value={editingPub.type} onChange={setPubField("type")} type="select" options={PUB_TYPE_OPTS} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <AdminFormField label="DOI (optional)" name="doi" value={editingPub.doi ?? ""} onChange={setPubField("doi")} placeholder="10.xxxx/xxxxx" />
                <AdminFormField label="Link (optional)" name="link" value={editingPub.link ?? ""} onChange={setPubField("link")} type="url" />
              </div>
              <AdminFormField label="Abstract (optional)" name="abstract" value={editingPub.abstract ?? ""} onChange={setPubField("abstract")} type="textarea" rows={3} />
              <div className="flex gap-3 pt-2 border-t border-border">
                <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving…" : "Save"}</button>
                <button type="button" onClick={() => setEditingPub(null)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {[...pubs].sort((a, b) => b.year - a.year).map(p => (
              <div key={p.id} className="card flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-text text-sm">{p.title}</p>
                  <p className="text-xs text-muted mt-0.5">{p.authors}</p>
                  <p className="text-xs text-navy mt-0.5">{p.journal}, {p.year} · {p.type}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEditPub(p)} className="p-1.5 text-muted hover:text-navy"><Pencil size={15} /></button>
                  <button onClick={() => setDeletingPub(p.id)} className="p-1.5 text-muted hover:text-red-600"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
            {pubs.length === 0 && !editingPub && (
              <p className="text-muted text-sm py-6 text-center">No publications yet.</p>
            )}
          </div>

          <ConfirmDialog open={deletingPub !== null} title="Delete Publication"
            description="This will permanently delete this publication."
            onConfirm={() => deletingPub && handleDeletePub(deletingPub)}
            onCancel={() => setDeletingPub(null)} />
        </>
      )}
    </div>
  );
}
