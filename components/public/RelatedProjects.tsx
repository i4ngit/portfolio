import type { ResearchProject } from "@/lib/types";
import { ArrowRight } from "lucide-react";

function scoreOverlap(a: ResearchProject, b: ResearchProject): number {
  const aTags = new Set([...a.tags, ...(a.techniques ?? [])].map(s => s.toLowerCase()));
  const bTags = [...b.tags, ...(b.techniques ?? [])].map(s => s.toLowerCase());
  return bTags.filter(t => aTags.has(t)).length;
}

interface RelatedProjectsProps {
  current: ResearchProject;
  allProjects: ResearchProject[];
  onSelect: (project: ResearchProject) => void;
}

export default function RelatedProjects({ current, allProjects, onSelect }: RelatedProjectsProps) {
  const related = allProjects
    .filter(p => p.id !== current.id)
    .map(p => ({ project: p, score: scoreOverlap(current, p) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ project }) => project);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">Related Projects</p>
      {related.length === 0 ? (
        <p className="text-xs text-muted">No closely related projects found.</p>
      ) : (
        <div className="space-y-3">
          {related.map(p => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="w-full text-left group"
            >
              <div className="p-3 rounded-lg border border-border bg-white hover:border-navy transition-colors">
                <p className="text-xs font-semibold text-slate-text leading-snug group-hover:text-navy transition-colors line-clamp-2 flex items-start gap-1">
                  {p.title}
                  <ArrowRight size={10} className="flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-muted mt-1">{p.period}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {[...p.tags, ...(p.techniques ?? [])].slice(0, 3).map(tag => (
                    <span key={tag} className="text-xs bg-surface text-muted px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
