"use client";

import { useState } from "react";
import type { NewsPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface NewsCardProps {
  post: NewsPost;
  defaultExpanded?: boolean;
}

export default function NewsCard({ post, defaultExpanded = false }: NewsCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <li className="py-1.5 text-sm">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="text-left w-full group"
      >
        <span className="text-gray-400 tabular-nums">[{formatDate(post.date)}]</span>
        {" "}
        <span className="text-gray-800 group-hover:text-gray-600 transition-colors">
          {post.title}
        </span>
      </button>

      {expanded && (
        <div className="mt-2 ml-0 text-gray-600 text-xs leading-relaxed prose-academic border-l-2 border-gray-100 pl-3">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      )}
    </li>
  );
}
