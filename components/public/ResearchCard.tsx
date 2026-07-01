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
      className="w-full text-left py-4 border-b border-gray-100 last:border-0 group cursor-pointer"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
              {project.title}
            </h3>
            {project.status && (
              <span className="text-xs text-gray-300 flex-shrink-0">
                {STATUS_LABEL[project.status] ?? project.status}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{project.lab} · {project.institution}</p>
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0 sm:text-right">{project.period}</span>
      </div>

      {project.findings ? (
        <p className="text-xs text-gray-500 mt-2 leading-relaxed">{project.findings}</p>
      ) : (
        <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{project.description}</p>
      )}

      {project.projectType && (
        <p className="text-xs text-gray-400 mt-2">
          {TYPE_LABEL[project.projectType] ?? project.projectType}
        </p>
      )}
    </button>
  );
}
