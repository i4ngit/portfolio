"use client";

import { useState } from "react";
import type { NewsPost } from "@/lib/types";
import NewsCard from "./NewsCard";

const ALL_CATEGORIES: Array<{ value: NewsPost["category"] | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "research", label: "Research" },
  { value: "award", label: "Awards" },
  { value: "clinical", label: "Clinical" },
  { value: "general", label: "General" },
];

interface NewsListProps {
  posts: NewsPost[];
  showFilter?: boolean;
}

export default function NewsList({ posts, showFilter = true }: NewsListProps) {
  const [filter, setFilter] = useState<NewsPost["category"] | "all">("all");

  const filtered = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  const visibleCategories = ALL_CATEGORIES.filter(
    ({ value }) => value === "all" || posts.some((p) => p.category === value)
  );

  return (
    <div>
      {showFilter && visibleCategories.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {visibleCategories.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                filter === value
                  ? "bg-gray-900 text-white border-gray-900"
                  : "border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <ul>
        {filtered.map((post, i) => (
          <NewsCard key={post.id} post={post} isLast={i === filtered.length - 1} />
        ))}
        {filtered.length === 0 && (
          <li className="text-sm text-gray-400 py-4">No posts in this category.</li>
        )}
      </ul>
    </div>
  );
}
