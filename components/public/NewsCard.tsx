"use client";

import { useState } from "react";
import type { NewsPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface NewsCardProps {
  post: NewsPost;
  isLast?: boolean;
}

export default function NewsCard({ post, isLast = false }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <li
      className={`grid grid-cols-[100px_1fr] gap-6 py-4 ${
        isLast ? "" : "border-b border-dashed border-gray-300"
      }`}
    >
      <span className="text-xs text-gray-400 leading-relaxed pt-0.5">
        {formatDate(post.date)}
      </span>

      <div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-left w-full group"
        >
          <span className="text-sm text-gray-800 group-hover:text-gray-600 transition-colors">
            {post.title}
          </span>
        </button>

        {expanded && (
          <div className="mt-2 text-gray-600 text-xs leading-relaxed prose-academic">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </li>
  );
}
