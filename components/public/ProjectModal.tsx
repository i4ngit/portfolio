"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Quote, FlaskConical, HeartPulse, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ResearchProject } from "@/lib/types";
import ImageGallery from "./ImageGallery";
import RelatedProjects from "./RelatedProjects";
import { TYPE_COLORS } from "@/lib/utils";

const PROJECT_TYPE_ICON = {
  research: FlaskConical,
  clinical: HeartPulse,
  coursework: BookOpen,
};

const STATUS_BADGE = {
  ongoing: "bg-blue-50 text-navy border-blue-100",
  completed: "bg-green-50 text-green-accent border-green-100",
  published: "bg-amber-50 text-amber-700 border-amber-100",
};

interface ProjectModalProps {
  project: ResearchProject | null;
  allProjects: ResearchProject[];
  onClose: () => void;
  onSelect: (project: ResearchProject) => void;
}

export default function ProjectModal({ project, allProjects, onClose, onSelect }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  const TypeIcon = project?.projectType ? PROJECT_TYPE_ICON[project.projectType] : FlaskConical;

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 md:p-8"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-slate-text px-8 pt-8 pb-6 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1 rounded"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
                  <TypeIcon size={14} className="text-white" />
                </div>
                <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
                  {project.projectType ?? "Research"}
                </span>
                {project.status && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_BADGE[project.status]}`}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                )}
              </div>

              <h2 className="text-white text-xl font-bold font-serif leading-snug pr-8">{project.title}</h2>
              <p className="text-white/70 text-sm mt-1">{project.lab} · {project.institution}</p>
              <p className="text-white/50 text-xs mt-1">{project.period}</p>

              <div className="flex flex-wrap gap-1.5 mt-4">
                {project.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80">{tag}</span>
                ))}
                {project.techniques?.map(t => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-navy/60 text-white/70">{t}</span>
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="flex flex-col lg:flex-row">
              {/* Main content */}
              <div className="flex-1 px-8 py-6 space-y-6 min-w-0">

                {/* Summary */}
                <div>
                  <p className="text-sm text-muted leading-relaxed">{project.description}</p>
                </div>

                {/* Key finding teaser */}
                {project.findings && (
                  <div className="bg-blue-50 border-l-4 border-navy rounded-r-lg px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-navy mb-1">Key Finding</p>
                    <p className="text-sm text-slate-text leading-relaxed">{project.findings}</p>
                  </div>
                )}

                {/* Image gallery */}
                {project.images && project.images.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Figures</p>
                    <ImageGallery images={project.images} title={project.title} />
                  </div>
                )}

                {/* Full description */}
                {project.fullDescription && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Methods & Findings</p>
                    <div className="prose-academic text-sm">
                      <ReactMarkdown>{project.fullDescription}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {/* PI Quote */}
                {project.piQuote && (
                  <div className="bg-surface rounded-xl p-5 border border-border">
                    <Quote size={18} className="text-navy/30 mb-2" />
                    <p className="text-sm text-slate-text italic leading-relaxed">&ldquo;{project.piQuote}&rdquo;</p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs font-semibold text-slate-text">{project.piName}</p>
                      {project.piTitle && <p className="text-xs text-muted">{project.piTitle}</p>}
                    </div>
                  </div>
                )}

                {/* Link */}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-navy hover:underline"
                  >
                    <ExternalLink size={14} /> View project / publication
                  </a>
                )}

                {/* Publication type badge */}
                {project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    {project.tags.map(tag => (
                      <span key={tag} className={`text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_COLORS["research"] ?? "bg-blue-50 text-navy"}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Related sidebar */}
              <div className="lg:w-64 lg:border-l border-t lg:border-t-0 border-border bg-surface px-5 py-6 flex-shrink-0">
                <RelatedProjects
                  current={project}
                  allProjects={allProjects}
                  onSelect={onSelect}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
