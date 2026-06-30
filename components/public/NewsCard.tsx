"use client";

import { useState } from "react";
import type { NewsPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";

const CATEGORY_COLORS: Record<NewsPost["category"], string> = {
  award: "bg-amber-50 text-amber-700 border-amber-200",
  research: "bg-blue-50 text-navy border-blue-200",
  clinical: "bg-green-50 text-green-accent border-green-200",
  general: "bg-gray-50 text-muted border-gray-200",
};

const CATEGORY_LABELS: Record<NewsPost["category"], string> = {
  award: "Award",
  research: "Research",
  clinical: "Clinical",
  general: "General",
};

interface NewsCardProps {
  post: NewsPost;
  defaultExpanded?: boolean;
}

export default function NewsCard({ post, defaultExpanded = false }: NewsCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <article className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[post.category]}`}>
              {CATEGORY_LABELS[post.category]}
            </span>
            <time className="text-xs text-muted" dateTime={post.date}>
              {formatDate(post.date)}
            </time>
          </div>
          <h3 className="font-semibold text-slate-text text-base leading-snug">{post.title}</h3>
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-shrink-0 text-muted hover:text-navy transition-colors p-1 rounded"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border prose-academic text-sm">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      )}
    </article>
  );
}
