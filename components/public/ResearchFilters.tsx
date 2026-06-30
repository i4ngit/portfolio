"use client";

import { useState } from "react";
import type { ResearchProject } from "@/lib/types";
import ResearchCard from "./ResearchCard";

interface ResearchFiltersProps {
  projects: ResearchProject[];
  tags: string[];
}

export default function ResearchFilters({ projects, tags }: ResearchFiltersProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects;

  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <div>
      {/* Tag filter */}
      {tags.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              activeTag === null
                ? "bg-navy text-white border-navy"
                : "border-border text-muted hover:border-navy hover:text-navy"
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                activeTag === tag
                  ? "bg-navy text-white border-navy"
                  : "border-border text-muted hover:border-navy hover:text-navy"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {featured.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-navy mb-3">Featured</p>
          <div className="grid md:grid-cols-2 gap-5">
            {featured.map((p) => <ResearchCard key={p.id} project={p} featured />)}
          </div>
        </div>
      )}

      {rest.length > 0 && (
        <div className={featured.length > 0 ? "mt-6" : ""}>
          {featured.length > 0 && (
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Other Projects</p>
          )}
          <div className="grid md:grid-cols-2 gap-5">
            {rest.map((p) => <ResearchCard key={p.id} project={p} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-muted text-sm py-8 text-center">No projects match this filter.</p>
      )}
    </div>
  );
}
