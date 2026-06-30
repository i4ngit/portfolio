"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ResearchProject } from "@/lib/types";
import ResearchCard from "./ResearchCard";
import ProjectModal from "./ProjectModal";

const PROJECT_TYPES = [
  { value: "all", label: "All" },
  { value: "research", label: "Research" },
  { value: "clinical", label: "Clinical" },
  { value: "coursework", label: "Coursework" },
] as const;

type ProjectTypeFilter = typeof PROJECT_TYPES[number]["value"];

interface ResearchFiltersProps {
  projects: ResearchProject[];
  tags: string[];
}

export default function ResearchFilters({ projects, tags }: ResearchFiltersProps) {
  const [typeFilter, setTypeFilter] = useState<ProjectTypeFilter>("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<ResearchProject | null>(null);

  const filtered = projects.filter(p => {
    const typeMatch = typeFilter === "all" || p.projectType === typeFilter;
    const tagMatch = !tagFilter || p.tags.includes(tagFilter) || p.techniques?.includes(tagFilter);
    return typeMatch && tagMatch;
  });

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  const allTechniques = [...new Set(projects.flatMap(p => p.techniques ?? []))].sort();
  const filterTerms = [...new Set([...tags, ...allTechniques])].sort();

  return (
    <>
      {/* Type tabs */}
      <div className="flex gap-1 p-1 bg-surface rounded-xl border border-border w-fit mb-5">
        {PROJECT_TYPES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setTypeFilter(value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              typeFilter === value
                ? "bg-white shadow-sm text-slate-text"
                : "text-muted hover:text-slate-text"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tag / technique filter */}
      {filterTerms.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setTagFilter(null)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              tagFilter === null
                ? "bg-navy text-white border-navy"
                : "border-border text-muted hover:border-navy hover:text-navy"
            }`}
          >
            All topics
          </button>
          {filterTerms.map(term => (
            <button
              key={term}
              onClick={() => setTagFilter(tagFilter === term ? null : term)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                tagFilter === term
                  ? "bg-navy text-white border-navy"
                  : "border-border text-muted hover:border-navy hover:text-navy"
              }`}
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {/* Featured projects */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${typeFilter}-${tagFilter}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {featured.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-navy mb-4">Featured</p>
              <div className="grid md:grid-cols-2 gap-5">
                {featured.map(p => (
                  <ResearchCard key={p.id} project={p} featured onClick={() => setActiveProject(p)} />
                ))}
              </div>
            </div>
          )}

          {rest.length > 0 && (
            <div>
              {featured.length > 0 && (
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">Other Projects</p>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map(p => (
                  <ResearchCard key={p.id} project={p} onClick={() => setActiveProject(p)} />
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <p className="text-muted text-sm py-10 text-center">No projects match this filter.</p>
          )}
        </motion.div>
      </AnimatePresence>

      <ProjectModal
        project={activeProject}
        allProjects={projects}
        onClose={() => setActiveProject(null)}
        onSelect={setActiveProject}
      />
    </>
  );
}
