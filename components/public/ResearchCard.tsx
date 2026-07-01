import { MousePointer2 } from "lucide-react";
import type { ResearchProject } from "@/lib/types";

const TYPE_LABEL: Record<string, string> = {
  research: "Research",
  clinical: "Clinical",
  coursework: "Coursework",
};

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Ongoing",
  completed: "Completed",
  published: "Published",
};

interface ResearchCardProps {
  project: ResearchProject;
  featured?: boolean;
  onClick?: () => void;
}

export default function ResearchCard({ project, onClick }: ResearchCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left py-4 px-3 -mx-3 border-b border-gray-100 last:border-0 group cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
              {project.title}
            </h3>
            {project.status && (
              <span className="text-xs text-gray-400 flex-shrink-0">
                {STATUS_LABEL[project.status] ?? project.status}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{project.lab} · {project.institution}</p>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0 sm:text-right">{project.period}</span>
      </div>

      <div className="mt-2.5 space-y-1">
        <div className="flex gap-2 text-xs text-gray-500 leading-relaxed">
          <span className="text-gray-300 flex-shrink-0 mt-0.5">·</span>
          <span className="line-clamp-2">
            {project.findings ?? project.description}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 group-hover:text-gray-900 transition-colors">
          <MousePointer2 size={11} />
          View details
        </span>
      </div>
    </button>
  );
}
