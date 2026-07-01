"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import AdminFormField from "@/components/admin/AdminFormField";
import PhotoUpload from "@/components/admin/PhotoUpload";
import CVUpload from "@/components/admin/CVUpload";
import SaveBar from "@/components/admin/SaveBar";
import { useSave } from "@/lib/useSave";
import type { HeroContent, Affiliation } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { Plus, Trash2, Loader2, Upload } from "lucide-react";

const EMPTY: HeroContent = {
  name: "", headline: "", bio: "", photoUrl: "", cvUrl: "",
  email: "", linkedIn: "", institution: "", year: "", affiliations: [],
};

export default function AdminHeroPage() {
  const [data, setData] = useState<HeroContent>(EMPTY);
  const { save, state } = useSave("hero");

  // New affiliation form state
  const [addingAffiliation, setAddingAffiliation] = useState(false);
  const [newName, setNewName] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/content/hero").then(r => r.json()).then(setData);
  }, []);

  function set(key: keyof HeroContent) {
    return (value: string) => setData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await save(data);
  }

  async function removeAffiliation(id: string) {
    const updated = { ...data, affiliations: (data.affiliations ?? []).filter(a => a.id !== id) };
    setData(updated);
    await save(updated);
  }

  async function handleLogoFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setLogoUploading(true);
    try {
      const resized = await resizeImage(file, 400, 200);
      const name = `affiliation-${generateId().slice(0, 8)}`;
      const res = await fetch("/api/upload/photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: resized, name }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setLogoUploading(false); return; }

      const newAffiliation: Affiliation = {
        id: generateId(),
        name: newName.trim() || "Institution",
        logoUrl: json.url,
      };
      const updated = { ...data, affiliations: [...(data.affiliations ?? []), newAffiliation] };
      setData(updated);
      await save(updated);
      setNewName("");
      setAddingAffiliation(false);
    } finally {
      setLogoUploading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-gray-900 mb-6">About / Hero</h1>
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Photo upload */}
        <div className="card">
          <PhotoUpload
            currentUrl={data.photoUrl}
            onUploaded={async (url) => {
              const updated = { ...data, photoUrl: url };
              setData(updated);
              await save(updated);
            }}
          />
        </div>

        {/* CV upload */}
        <div className="card">
          <CVUpload
            currentUrl={data.cvUrl}
            onUploaded={async (url) => {
              const updated = { ...data, cvUrl: url };
              setData(updated);
              await save(updated);
            }}
          />
        </div>

        <div className="card space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <AdminFormField label="Full Name" name="name" value={data.name} onChange={set("name")} required />
            <AdminFormField label="Headline" name="headline" value={data.headline} onChange={set("headline")} placeholder="Premed Student & Researcher" required />
          </div>

          <AdminFormField
            label="Bio"
            name="bio"
            value={data.bio}
            onChange={set("bio")}
            type="textarea"
            rows={6}
            hint="Supports line breaks (press Enter twice for a new paragraph)."
            required
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <AdminFormField label="Institution" name="institution" value={data.institution} onChange={set("institution")} />
            <AdminFormField label="Year / Class" name="year" value={data.year} onChange={set("year")} placeholder="Class of 202X" />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <AdminFormField label="Email" name="email" value={data.email} onChange={set("email")} type="email" required />
            <AdminFormField label="LinkedIn URL" name="linkedIn" value={data.linkedIn} onChange={set("linkedIn")} type="url" />
          </div>

          <SaveBar state={state} />
        </div>
      </form>

      {/* Affiliations — managed separately, auto-save on change */}
      <div className="card mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 text-sm">Institution Affiliations</p>
            <p className="text-xs text-gray-400 mt-0.5">Logos shown below the hero buttons. Only visible when at least one is added.</p>
          </div>
          {!addingAffiliation && (
            <button
              type="button"
              onClick={() => setAddingAffiliation(true)}
              className="btn-primary text-xs px-3 py-1.5"
            >
              <Plus size={13} /> Add Logo
            </button>
          )}
        </div>

        {/* Existing affiliations */}
        {(data.affiliations ?? []).length > 0 && (
          <div className="space-y-2">
            {(data.affiliations ?? []).map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.logoUrl} alt={a.name} className="h-8 w-auto object-contain" />
                <span className="text-sm text-gray-700 flex-1">{a.name}</span>
                <button
                  type="button"
                  onClick={() => removeAffiliation(a.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new affiliation form */}
        {addingAffiliation && (
          <div className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Institution name (e.g. UCSF, NIH)"
              className="admin-input text-sm"
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                disabled={logoUploading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-50"
              >
                {logoUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {logoUploading ? "Uploading…" : "Upload logo"}
              </button>
              <button
                type="button"
                onClick={() => { setAddingAffiliation(false); setNewName(""); }}
                className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-gray-400">PNG or SVG with transparent background works best.</p>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleLogoFile(file);
                e.target.value = "";
              }}
            />
          </div>
        )}

        {(data.affiliations ?? []).length === 0 && !addingAffiliation && (
          <p className="text-sm text-gray-400 py-2">No affiliations yet — click &ldquo;Add Logo&rdquo; to get started.</p>
        )}
      </div>
    </div>
  );
}

function resizeImage(file: File, maxW: number, maxH: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new window.Image();
      img.onerror = reject;
      img.onload = () => {
        const ratio = Math.min(maxW / img.width, maxH / img.height, 1);
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable"));
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
