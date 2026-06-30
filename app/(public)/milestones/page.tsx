import type { Metadata } from "next";
import { getMilestones } from "@/lib/kv";
import SectionHeader from "@/components/public/SectionHeader";
import MilestoneItem from "@/components/public/MilestoneItem";

export const metadata: Metadata = { title: "Milestones" };
export const revalidate = 60;

const CATEGORIES = ["academic", "application", "recognition", "research"] as const;
const CATEGORY_LABELS: Record<(typeof CATEGORIES)[number], string> = {
  academic: "Academic",
  application: "Application",
  recognition: "Recognition & Awards",
  research: "Research",
};

export default async function MilestonesPage() {
  const milestones = await getMilestones();

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    items: milestones.filter((m) => m.category === cat),
  })).filter(({ items }) => items.length > 0);

  const stats = {
    completed: milestones.filter((m) => m.status === "completed").length,
    inProgress: milestones.filter((m) => m.status === "in-progress").length,
    upcoming: milestones.filter((m) => m.status === "upcoming").length,
  };

  return (
    <div className="pt-20">
      <div className="section-container">
        <SectionHeader
          eyebrow="Milestones"
          title="Academic & Career Roadmap"
          description="Key milestones marking my progress from premed coursework through medical school application and beyond."
        />

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-12 p-5 bg-surface rounded-xl border border-border">
          {[
            { label: "Completed", value: stats.completed, className: "text-green-accent" },
            { label: "In Progress", value: stats.inProgress, className: "text-amber-600" },
            { label: "Upcoming", value: stats.upcoming, className: "text-muted" },
          ].map(({ label, value, className }) => (
            <div key={label} className="text-center">
              <p className={`text-3xl font-bold font-serif ${className}`}>{value}</p>
              <p className="text-xs text-muted mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Grouped milestones */}
        <div className="space-y-12">
          {byCategory.map(({ cat, items }) => (
            <div key={cat}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted mb-4">
                {CATEGORY_LABELS[cat]}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((m) => (
                  <MilestoneItem key={m.id} milestone={m} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {milestones.length === 0 && (
          <p className="text-muted text-sm py-8">No milestones yet.</p>
        )}
      </div>
    </div>
  );
}
