"use client";

import { useState, useEffect, FormEvent } from "react";
import type { ResearchProject, Publication } from "@/lib/types";
import { generateId } from "@/lib/utils";
import AdminFormField from "@/components/admin/AdminFormField";
import MultiPhotoUpload from "@/components/admin/MultiPhotoUpload";
import DocumentUpload from "@/components/admin/DocumentUpload";
import SaveBar from "@/components/admin/SaveBar";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useSave } from "@/lib/useSave";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";

const EMPTY_PROJECT: Omit<ResearchProject, "id"> = {
  title: "", lab: "", institution: "", description: "", fullDescription: "",
  findings: "", period: "", tags: [], techniques: [], featured: false,
  projectType: "research", status: "ongoing", coverImage: "", images: [],
  pdfUrl: "", piName: "", piTitle: "", piQuote: "", link: "",
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

const PROJECT_TYPE_OPTS = [
  { value: "research", label: "Research" },
  { value: "clinical", label: "Clinical" },
  { value: "coursework", label: "Coursework" },
];

const STATUS_OPTS = [
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
  { value: "published", label: "Published" },
];

export default function AdminResearchPage() {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [editingProject, setEditingProject] = useState<ResearchProject | null>(null);
  const [editingPub, setEditingPub] = useState<Publication | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [isNewPub, setIsNewPub] = useState(false);
  const [tagsText, setTagsText] = useState("");
  const [techniquesText, setTechniquesText] = useState("");
  const [deletingProject, setDeletingProject] = useState<string | null>(null);
  const [deletingPub, setDeletingPub] = useState<string | null>(null);
  const [tab, setTab] = useState<"projects" | "publications">("projects");
  const { save: saveProjects, state: projectState } = useSave("research");
  const { save: savePubs, state: pubState } = useSave("publications");

  useEffect(() => {
    Promise.all([
      fetch("/api/content/research").then(r => r.json()),
      fetch("/api/content/publications").then(r => r.json()),
    ]).then(([r, p]) => { setProjects(r); setPubs(p); });
  }, []);

  async function persistProjects(updated: ResearchProject[]) {
    const ok = await saveProjects(updated);
    if (ok) setProjects(updated);
    return ok;
  }

  async function persistPubs(updated: Publication[]) {
    const ok = await savePubs(updated);
    if (ok) setPubs(updated);
    return ok;
  }

  function startAddProject() {
    setEditingProject({ id: generateId(), ...EMPTY_PROJECT });
    setTagsText(""); setTechniquesText("");
    setIsNewProject(true);
  }

  function startEditProject(p: ResearchProject) {
    setEditingProject({ ...p });
    setTagsText(p.tags.join(", "));
    setTechniquesText((p.techniques ?? []).join(", "));
    setIsNewProject(false);
  }

  async function handleSaveProject(e: FormEvent) {
    e.preventDefault();
    if (!editingProject) return;
    const withExtras = {
      ...editingProject,
      tags: tagsText.split(",").map(t => t.trim()).filter(Boolean),
      techniques: techniquesText.split(",").map(t => t.trim()).filter(Boolean),
    };
    const updated = isNewProject
      ? [...projects, withExtras]
      : projects.map(p => p.id === editingProject.id ? withExtras : p);
    const ok = await persistProjects(updated);
    if (ok) setEditingProject(null);
  }

  async function handleDeleteProject(id: string) {
    const ok = await persistProjects(projects.filter(p => p.id !== id));
    if (ok) setDeletingProject(null);
  }

  function setProjectField(key: keyof ResearchProject) {
    return (value: string) => setEditingProject(prev => prev ? {
      ...prev,
      [key]: key === "featured" ? value === "true" : value,
    } : prev);
  }

  function startAddPub() { setEditingPub({ id: generateId(), ...EMPTY_PUB }); setIsNewPub(true); }
  function startEditPub(p: Publication) { setEditingPub({ ...p }); setIsNewPub(false); }

  async function handleSavePub(e: FormEvent) {
    e.preventDefault();
    if (!editingPub) return;
    const updated = isNewPub ? [...pubs, editingPub] : pubs.map(p => p.id === editingPub.id ? editingPub : p);
    const ok = await persistPubs(updated);
    if (ok) setEditingPub(null);
  }

  async function handleDeletePub(id: string) {
    const ok = await persistPubs(pubs.filter(p => p.id !== id));
    if (ok) setDeletingPub(null);
  }

  function setPubField(key: keyof Publication) {
    return (value: string) => setEditingPub(prev => prev ? {
      ...prev,
      [key]: key === "year" ? parseInt(value) || 0 : value,
    } : prev);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-gray-900 mb-6">Research</h1>

      <div className="flex gap-1 p-1 bg-surface rounded-lg border border-border mb-6 w-fit">
        {(["projects", "publications"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${tab === t ? "bg-white shadow-sm text-gray-900" : "text-muted hover:text-gray-900"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "projects" && (
        <>
          <div className="flex justify-end mb-4">
            {!editingProject && <button onClick={startAddProject} className="btn-primary"><Plus size={16} /> Add Project</button>}
          </div>

          {editingProject && (
            <form onSubmit={handleSaveProject} className="card mb-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-900">{isNewProject ? "New Project" : "Edit Project"}</h2>
                <button type="button" onClick={() => setEditingProject(null)}><X size={18} className="text-muted" /></button>
              </div>

              <AdminFormField label="Title" name="title" value={editingProject.title} onChange={setProjectField("title")} required />

              <div className="grid sm:grid-cols-2 gap-4">
                <AdminFormField label="Lab / Group" name="lab" value={editingProject.lab} onChange={setProjectField("lab")} required />
                <AdminFormField label="Institution" name="institution" value={editingProject.institution} onChange={setProjectField("institution")} required />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <AdminFormField label="Type" name="projectType" value={editingProject.projectType ?? "research"} onChange={setProjectField("projectType")} type="select" options={PROJECT_TYPE_OPTS} />
                <AdminFormField label="Status" name="status" value={editingProject.status ?? "ongoing"} onChange={setProjectField("status")} type="select" options={STATUS_OPTS} />
                <AdminFormField label="Period" name="period" value={editingProject.period} onChange={setProjectField("period")} placeholder="2024 – Present" required />
              </div>

              <AdminFormField label="Summary (shown on card)" name="description" value={editingProject.description} onChange={setProjectField("description")} type="textarea" rows={3} required />
              <AdminFormField label="Key Finding (1–2 sentences)" name="findings" value={editingProject.findings ?? ""} onChange={setProjectField("findings")} type="textarea" rows={2} hint="Shown as a highlighted teaser on the card and in the modal." />
              <AdminFormField label="Full Methods & Findings (Markdown)" name="fullDescription" value={editingProject.fullDescription ?? ""} onChange={setProjectField("fullDescription")} type="textarea" rows={8} hint="Use ## headings for Background, Methods, Findings sections." />

              <div className="grid sm:grid-cols-2 gap-4">
                <AdminFormField label="Tags (comma-separated)" name="tags" value={tagsText} onChange={setTagsText} placeholder="Neuroscience, TBI, SDOH" />
                <AdminFormField label="Techniques (comma-separated)" name="techniques" value={techniquesText} onChange={setTechniquesText} placeholder="ELISA, Chart Review, R" hint="Used for smart recommendations." />
              </div>

              <div>
                <label className="admin-label">Gallery Photos</label>
                <MultiPhotoUpload
                  images={editingProject.images ?? []}
                  onChange={(images) => setEditingProject(prev => prev ? { ...prev, images } : prev)}
                  namePrefix={`research-${editingProject.id}`}
                />
              </div>

              <DocumentUpload
                currentUrl={editingProject.pdfUrl ?? ""}
                onUploaded={(url) => setEditingProject(prev => prev ? { ...prev, pdfUrl: url } : prev)}
                docName={`research-${editingProject.id}`}
                label="Project PDF (poster, paper, report)"
              />

              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">PI / Mentor</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <AdminFormField label="PI Name" name="piName" value={editingProject.piName ?? ""} onChange={setProjectField("piName")} placeholder="Dr. Jane Smith, MD PhD" />
                  <AdminFormField label="PI Title" name="piTitle" value={editingProject.piTitle ?? ""} onChange={setProjectField("piTitle")} placeholder="Associate Professor of Neurology" />
                </div>
                <AdminFormField label="PI Quote (optional)" name="piQuote" value={editingProject.piQuote ?? ""} onChange={setProjectField("piQuote")} type="textarea" rows={3} hint="A brief endorsement or description of your contributions." />
              </div>

              <AdminFormField label="External Link (optional)" name="link" value={editingProject.link ?? ""} onChange={setProjectField("link")} type="url" />

              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" checked={editingProject.featured}
                  onChange={e => setEditingProject(prev => prev ? { ...prev, featured: e.target.checked } : prev)}
                  className="rounded border-border text-gray-900 focus:ring-gray-900" />
                <label htmlFor="featured" className="text-sm text-gray-900">Featured project (shown prominently at top)</label>
              </div>

              <SaveBar state={projectState} />
            </form>
          )}

          <div className="space-y-3">
            {projects.map(p => (
              <div key={p.id} className="card flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm">{p.title}</p>
                    {p.featured && <Star size={12} className="text-amber-500 fill-amber-500" />}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{p.lab} · {p.institution}</p>
                  <p className="text-xs text-muted mt-0.5">{p.period} · {p.projectType ?? "research"} · {p.status ?? "—"}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEditProject(p)} className="p-1.5 text-muted hover:text-gray-900"><Pencil size={15} /></button>
                  <button onClick={() => setDeletingProject(p.id)} className="p-1.5 text-muted hover:text-red-600"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
            {projects.length === 0 && !editingProject && <p className="text-muted text-sm py-6 text-center">No projects yet.</p>}
          </div>

          <ConfirmDialog open={deletingProject !== null} title="Delete Project"
            description="This will permanently delete this research project."
            onConfirm={() => deletingProject && handleDeleteProject(deletingProject)}
            onCancel={() => setDeletingProject(null)} />
        </>
      )}

      {tab === "publications" && (
        <>
          <div className="flex justify-end mb-4">
            {!editingPub && <button onClick={startAddPub} className="btn-primary"><Plus size={16} /> Add Publication</button>}
          </div>

          {editingPub && (
            <form onSubmit={handleSavePub} className="card mb-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-900">{isNewPub ? "New Publication" : "Edit Publication"}</h2>
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
              <SaveBar state={pubState} />
            </form>
          )}

          <div className="space-y-3">
            {[...pubs].sort((a, b) => b.year - a.year).map(p => (
              <div key={p.id} className="card flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{p.title}</p>
                  <p className="text-xs text-muted mt-0.5">{p.authors}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.journal}, {p.year} · {p.type}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEditPub(p)} className="p-1.5 text-muted hover:text-gray-900"><Pencil size={15} /></button>
                  <button onClick={() => setDeletingPub(p.id)} className="p-1.5 text-muted hover:text-red-600"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
            {pubs.length === 0 && !editingPub && <p className="text-muted text-sm py-6 text-center">No publications yet.</p>}
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
