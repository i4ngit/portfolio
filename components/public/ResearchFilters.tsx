"use client";

import { useState } from "react";
import type { ResearchProject } from "@/lib/types";
import ResearchCard from "./ResearchCard";
import ProjectModal from "./ProjectModal";

const PROJECT_TYPES = [
  { value: "all", label: "All" },
  { value: "research", label: "Research" },
  { value: "clinical", label: "Clinical" },
  { value: "coursework", label: "Coursework" },
] as const;

type ProjectTypeFilter = (typeof PROJECT_TYPES)[number]["value"];

interface ResearchFiltersProps {
  projects: ResearchProject[];
  tags: string[];
  showFilters?: boolean;
}

export default function ResearchFilters({ projects, tags, showFilters = true }: ResearchFiltersProps) {
  const [typeFilter, setTypeFilter] = useState<ProjectTypeFilter>("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<ResearchProject | null>(null);

  const filtered = projects.filter((p) => {
    const typeMatch = typeFilter === "all" || p.projectType === typeFilter;
    const tagMatch = !tagFilter || p.tags.includes(tagFilter) || p.techniques?.includes(tagFilter);
    return typeMatch && tagMatch;
  });

  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);
  const allItems = [...featured, ...rest];

  const allTechniques = [...new Set(projects.flatMap((p) => p.techniques ?? []))].sort();
  const filterTerms = [...new Set([...tags, ...allTechniques])].sort();

  return (
    <>
      {showFilters && (
        <div className="mb-6 space-y-3">
          {/* Type tabs */}
          <div className="flex flex-wrap gap-2">
            {PROJECT_TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTypeFilter(value)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  typeFilter === value
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tag filter pills */}
          {filterTerms.length > 1 && (
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setTagFilter(null)}
                className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                  tagFilter === null
                    ? "bg-gray-900 text-white border-gray-900"
                    : "border-gray-200 text-gray-400 hover:border-gray-400"
                }`}
              >
                All topics
              </button>
              {filterTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => setTagFilter(tagFilter === term ? null : term)}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    tagFilter === term
                      ? "bg-gray-900 text-white border-gray-900"
                      : "border-gray-200 text-gray-400 hover:border-gray-400"
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        {allItems.map((p) => (
          <ResearchCard key={p.id} project={p} onClick={() => setActiveProject(p)} />
        ))}
        {allItems.length === 0 && (
          <p className="text-sm text-gray-400 py-6">No projects match this filter.</p>
        )}
      </div>

      <ProjectModal
        project={activeProject}
        allProjects={projects}
        onClose={() => setActiveProject(null)}
        onSelect={setActiveProject}
      />
    </>
  );
}
