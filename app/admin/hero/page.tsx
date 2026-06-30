"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminFormField from "@/components/admin/AdminFormField";
import PhotoUpload from "@/components/admin/PhotoUpload";
import CVUpload from "@/components/admin/CVUpload";
import SaveBar from "@/components/admin/SaveBar";
import { useSave } from "@/lib/useSave";
import type { HeroContent } from "@/lib/types";

const EMPTY: HeroContent = {
  name: "", headline: "", bio: "", photoUrl: "", cvUrl: "",
  email: "", linkedIn: "", institution: "", year: "",
};

export default function AdminHeroPage() {
  const [data, setData] = useState<HeroContent>(EMPTY);
  const { save, state } = useSave("hero");

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
    </div>
  );
}
