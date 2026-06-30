"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Quote, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import type { ResearchProject } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Ongoing",
  completed: "Completed",
  published: "Published",
};

interface ProjectModalProps {
  project: ResearchProject | null;
  allProjects: ResearchProject[];
  onClose: () => void;
  onSelect: (project: ResearchProject) => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxSrc) setLightboxSrc(null);
        else onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose, lightboxSrc]);

  const hasImages = (project?.images?.length ?? 0) > 0;
  const hasPdf = !!project?.pdfUrl;
  const hasSidebar = hasImages || hasPdf;

  return (
    <>
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
              className="relative bg-cream rounded-2xl shadow-2xl w-full max-w-4xl my-4 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* ── Header ───────────────────────────────────────── */}
              <div className="px-8 pt-8 pb-6 border-b border-black/10 relative">
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition-colors p-1 rounded"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <p className="section-label !mb-0">
                    {project.projectType ?? "Research"}
                  </p>
                  {project.status && (
                    <span className="text-xs font-medium text-gray-500 border border-gray-300 px-2 py-0.5 rounded-full">
                      {STATUS_LABEL[project.status] ?? project.status}
                    </span>
                  )}
                </div>

                <h2 className="font-display font-bold text-2xl text-gray-900 leading-snug pr-8">
                  {project.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1.5">
                  {project.lab} · {project.institution}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{project.period}</p>
              </div>

              {/* ── Body ─────────────────────────────────────────── */}
              <div className={`flex flex-col ${hasSidebar ? "lg:flex-row" : ""}`}>

                {/* Main content */}
                <div className="flex-1 px-8 py-6 space-y-6 min-w-0 bg-white">

                  <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>

                  {project.findings && (
                    <div className="border-l-4 border-gray-900 pl-4 py-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Key Finding</p>
                      <p className="text-sm text-gray-800 leading-relaxed">{project.findings}</p>
                    </div>
                  )}

                  {project.fullDescription && (
                    <div>
                      <p className="section-label">Methods &amp; Findings</p>
                      <div className="prose-academic text-sm">
                        <ReactMarkdown>{project.fullDescription}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {project.piQuote && (
                    <div className="bg-cream rounded-xl p-5 border border-black/10">
                      <Quote size={16} className="text-gray-300 mb-2" />
                      <p className="text-sm text-gray-700 italic leading-relaxed">&ldquo;{project.piQuote}&rdquo;</p>
                      <div className="mt-3 pt-3 border-t border-black/10">
                        <p className="text-xs font-semibold text-gray-900">{project.piName}</p>
                        {project.piTitle && <p className="text-xs text-gray-400 mt-0.5">{project.piTitle}</p>}
                      </div>
                    </div>
                  )}

                  {project.link && !project.pdfUrl && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ExternalLink size={14} /> View project / publication
                    </a>
                  )}
                </div>

                {/* Sidebar — only when there are images or a PDF */}
                {hasSidebar && (
                  <div className="lg:w-60 lg:border-l border-t lg:border-t-0 border-black/10 bg-cream px-5 py-6 flex-shrink-0 space-y-6">

                    {hasImages && (
                      <div>
                        <p className="section-label">Gallery</p>
                        <div className="grid grid-cols-2 gap-2">
                          {project.images!.map((src, i) => (
                            <button
                              key={i}
                              onClick={() => setLightboxSrc(src)}
                              className="aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {hasPdf && (
                      <div>
                        <p className="section-label">Document</p>
                        <a
                          href={project.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-900 text-sm text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
                        >
                          <FileText size={14} /> View PDF
                        </a>
                      </div>
                    )}

                    {project.link && (
                      <div>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        >
                          <ExternalLink size={13} /> External link
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setLightboxSrc(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2"
              onClick={() => setLightboxSrc(null)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxSrc}
              alt="Gallery photo"
              className="max-w-4xl max-h-[85vh] w-full h-full object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
