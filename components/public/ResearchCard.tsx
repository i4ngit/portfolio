import type { ResearchProject } from "@/lib/types";
import { ExternalLink, FlaskConical, HeartPulse, BookOpen, ArrowUpRight, CheckCircle2, Clock, Loader2 } from "lucide-react";
import Image from "next/image";

const TYPE_ICON = {
  research: FlaskConical,
  clinical: HeartPulse,
  coursework: BookOpen,
};

const STATUS_CONFIG = {
  ongoing: { label: "Ongoing", icon: Loader2, className: "text-navy bg-blue-50 border-blue-100" },
  completed: { label: "Completed", icon: CheckCircle2, className: "text-green-accent bg-green-50 border-green-100" },
  published: { label: "Published", icon: CheckCircle2, className: "text-amber-700 bg-amber-50 border-amber-100" },
};

interface ResearchCardProps {
  project: ResearchProject;
  featured?: boolean;
  onClick?: () => void;
}

export default function ResearchCard({ project, featured = false, onClick }: ResearchCardProps) {
  const Icon = project.projectType ? TYPE_ICON[project.projectType] : FlaskConical;
  const statusCfg = project.status ? STATUS_CONFIG[project.status] : null;
  const StatusIcon = statusCfg?.icon;

  return (
    <button
      onClick={onClick}
      className={`card w-full text-left flex flex-col gap-4 group cursor-pointer hover:border-navy hover:shadow-md transition-all duration-200 ${featured ? "border-l-4 border-l-navy" : ""}`}
    >
      {/* Cover image */}
      {project.coverImage && (
        <div className="w-full h-36 rounded-lg overflow-hidden bg-surface -mb-1">
          <Image
            src={project.coverImage}
            alt={project.title}
            width={600}
            height={144}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center group-hover:bg-navy/10 transition-colors">
            <Icon size={15} className="text-navy" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-text text-sm leading-snug group-hover:text-navy transition-colors pr-2">
              {project.title}
            </h3>
            <p className="text-xs text-navy mt-0.5 truncate">{project.lab} · {project.institution}</p>
          </div>
        </div>
        <ArrowUpRight
          size={16}
          className="flex-shrink-0 text-muted opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
        />
      </div>

      <p className="text-xs text-muted leading-relaxed line-clamp-3">{project.description}</p>

      {/* Key finding teaser */}
      {project.findings && (
        <p className="text-xs text-slate-text bg-blue-50 rounded-md px-3 py-2 border-l-2 border-navy leading-relaxed line-clamp-2">
          <span className="font-semibold text-navy">Finding: </span>{project.findings}
        </p>
      )}

      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto pt-2 border-t border-border">
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag text-xs">{tag}</span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs text-muted">+{project.tags.length - 3}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {statusCfg && StatusIcon && (
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${statusCfg.className}`}>
              <StatusIcon size={10} />
              {statusCfg.label}
            </span>
          )}
          <span className="text-xs text-muted">{project.period}</span>
        </div>
      </div>

      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-xs text-navy hover:underline"
          aria-label="View project"
        >
          <ExternalLink size={11} /> View
        </a>
      )}
    </button>
  );
}
