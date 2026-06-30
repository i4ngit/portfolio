import type { Metadata } from "next";
import { getExperience } from "@/lib/kv";
import SectionHeader from "@/components/public/SectionHeader";
import TimelineEntry from "@/components/public/TimelineEntry";

export const metadata: Metadata = { title: "Experience" };
export const revalidate = 60;

export default async function ExperiencePage() {
  const experience = await getExperience();

  const sorted = [...experience].sort((a, b) => {
    const aEnd = a.endDate === "present" ? "9999-12" : a.endDate;
    const bEnd = b.endDate === "present" ? "9999-12" : b.endDate;
    return bEnd.localeCompare(aEnd);
  });

  const legend = [
    { color: "bg-navy", label: "Research" },
    { color: "bg-green-accent", label: "Clinical" },
    { color: "bg-gray-400", label: "Volunteer" },
    { color: "bg-slate-600", label: "Academic" },
  ];

  return (
    <div className="pt-20">
      <div className="section-container">
        <SectionHeader
          eyebrow="Experience"
          title="Clinical & Research Experience"
          description="A chronological record of research, clinical, and community experiences that have shaped my path toward medicine."
        />

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-10">
          {legend.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
              <span className="text-xs text-muted">{label}</span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="ml-2">
          {sorted.map((entry, i) => (
            <TimelineEntry
              key={entry.id}
              entry={entry}
              isLast={i === sorted.length - 1}
            />
          ))}
        </div>

        {sorted.length === 0 && (
          <p className="text-muted text-sm py-8">No experience entries yet.</p>
        )}
      </div>
    </div>
  );
}
