"use client";

import { useState, useEffect, FormEvent } from "react";
import AdminFormField from "@/components/admin/AdminFormField";
import SaveBar from "@/components/admin/SaveBar";
import { useSave } from "@/lib/useSave";
import type { ContactContent } from "@/lib/types";

const EMPTY: ContactContent = {
  email: "", linkedin: "", cvUrl: "", institution: "", department: "", blurb: "",
};

export default function AdminContactPage() {
  const [data, setData] = useState<ContactContent>(EMPTY);
  const { save, state } = useSave("contact");

  useEffect(() => {
    fetch("/api/content/contact").then(r => r.json()).then(setData);
  }, []);

  function set(key: keyof ContactContent) {
    return (value: string) => setData(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await save(data);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-gray-900 mb-6">Contact Info</h1>
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
        <SaveBar state={state} />
      </form>
    </div>
  );
}
