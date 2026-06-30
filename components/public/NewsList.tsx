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
}

export default function NewsList({ posts }: NewsListProps) {
  const [filter, setFilter] = useState<NewsPost["category"] | "all">("all");

  const filtered = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  return (
    <div>
      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {ALL_CATEGORIES.filter(
          ({ value }) =>
            value === "all" || posts.some((p) => p.category === value)
        ).map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              filter === value
                ? "bg-navy text-white border-navy"
                : "border-border text-muted hover:border-navy hover:text-navy"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
        {filtered.length === 0 && (
          <p className="text-muted text-sm py-6 text-center">No posts in this category.</p>
        )}
      </div>
    </div>
  );
}
