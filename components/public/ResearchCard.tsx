import type { ResearchProject } from "@/lib/types";
import { ExternalLink, FlaskConical } from "lucide-react";

interface ResearchCardProps {
  project: ResearchProject;
  featured?: boolean;
}

export default function ResearchCard({ project, featured = false }: ResearchCardProps) {
  return (
    <div className={`card flex flex-col gap-4 ${featured ? "border-l-4 border-l-navy" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
            <FlaskConical size={16} className="text-navy" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-text text-base leading-snug">{project.title}</h3>
            <p className="text-sm text-navy mt-0.5">
              {project.lab} · {project.institution}
            </p>
          </div>
        </div>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-muted hover:text-navy transition-colors"
            aria-label="View project"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>

      <p className="text-sm text-muted leading-relaxed">{project.description}</p>

      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <span className="text-xs text-muted">{project.period}</span>
      </div>
    </div>
  );
}
