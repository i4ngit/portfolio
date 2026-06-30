"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminFormField from "@/components/admin/AdminFormField";
import type { HeroContent } from "@/lib/types";

const EMPTY: HeroContent = {
  name: "", headline: "", bio: "", photoUrl: "", cvUrl: "",
  email: "", linkedIn: "", institution: "", year: "",
};

export default function AdminHeroPage() {
  const [data, setData] = useState<HeroContent>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/content/hero").then(r => r.json()).then(setData);
  }, []);

  function set(key: keyof HeroContent) {
    return (value: string) => setData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/content/hero", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-serif text-slate-text mb-6">About / Hero</h1>
      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminFormField label="Full Name" name="name" value={data.name} onChange={set("name")} required />
          <AdminFormField label="Headline" name="headline" value={data.headline} onChange={set("headline")} placeholder="Premed Student & Researcher" required />
        </div>
        <AdminFormField label="Bio" name="bio" value={data.bio} onChange={set("bio")} type="textarea" rows={6} hint="Supports line breaks (press Enter twice for a new paragraph)." required />
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminFormField label="Institution" name="institution" value={data.institution} onChange={set("institution")} />
          <AdminFormField label="Year / Class" name="year" value={data.year} onChange={set("year")} placeholder="Class of 202X" />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminFormField label="Email" name="email" value={data.email} onChange={set("email")} type="email" required />
          <AdminFormField label="LinkedIn URL" name="linkedIn" value={data.linkedIn} onChange={set("linkedIn")} type="url" />
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminFormField label="Photo URL" name="photoUrl" value={data.photoUrl} onChange={set("photoUrl")} hint="Paste a direct image URL or upload to /public and use /your-photo.jpg" />
          <AdminFormField label="CV URL" name="cvUrl" value={data.cvUrl} onChange={set("cvUrl")} hint="Upload CV to /public and use /my-cv.pdf, or paste an external link." />
        </div>
        <div className="flex items-center gap-3 pt-2 border-t border-border">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {saved && <span className="text-sm text-green-accent font-medium">Saved!</span>}
        </div>
      </form>
    </div>
  );
}
