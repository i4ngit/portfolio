import type { Metadata } from "next";
import { getMilestones } from "@/lib/kv";
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

  return (
    <div className="wide-column py-12">
    <div className="page-column">
      <p className="section-label">Milestones</p>
      <h1 className="section-heading">Path so far</h1>

      {milestones.length > 0 ? (
        <div className="space-y-10">
          {byCategory.map(({ cat, items }) => (
            <div key={cat}>
              <p className="section-label">{CATEGORY_LABELS[cat]}</p>
              <div>
                {items.map((m) => (
                  <MilestoneItem key={m.id} milestone={m} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 py-6">No milestones yet.</p>
      )}
    </div>
    </div>
  );
}
