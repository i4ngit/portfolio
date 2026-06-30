"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminFormField from "@/components/admin/AdminFormField";
import type { ContactContent } from "@/lib/types";

const EMPTY: ContactContent = {
  email: "", linkedin: "", cvUrl: "", institution: "", department: "", blurb: "",
};

export default function AdminContactPage() {
  const [data, setData] = useState<ContactContent>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/content/contact").then(r => r.json()).then(setData);
  }, []);

  function set(key: keyof ContactContent) {
    return (value: string) => setData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/content/contact", {
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
      <h1 className="text-2xl font-bold font-serif text-slate-text mb-6">Contact Info</h1>
      <form onSubmit={handleSubmit} className="card space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminFormField label="Email" name="email" value={data.email ?? ""} onChange={set("email")} type="email" required />
          <AdminFormField label="LinkedIn URL" name="linkedin" value={data.linkedin ?? ""} onChange={set("linkedin")} type="url" />
        </div>
        <AdminFormField label="CV URL" name="cvUrl" value={data.cvUrl ?? ""} onChange={set("cvUrl")} hint="Path to CV file in /public or external link." />
        <div className="grid sm:grid-cols-2 gap-5">
          <AdminFormField label="Institution" name="institution" value={data.institution ?? ""} onChange={set("institution")} />
          <AdminFormField label="Department" name="department" value={data.department ?? ""} onChange={set("department")} />
        </div>
        <AdminFormField label="Contact Page Blurb" name="blurb" value={data.blurb ?? ""} onChange={set("blurb")} type="textarea" rows={3} hint="Short intro shown above contact links." />
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
