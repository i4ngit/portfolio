import type { Metadata } from "next";
import { getExperience } from "@/lib/kv";
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

  return (
    <div className="wide-column py-12">
    <div className="page-column">
      <h1
        className="text-xl font-bold text-gray-900 mb-8"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        Experience
      </h1>

      <p className="section-label">Clinical & Research Experience</p>

      {sorted.length > 0 ? (
        <div>
          {sorted.map((entry) => (
            <TimelineEntry key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 py-6">No experience entries yet.</p>
      )}
    </div>
    </div>
  );
}
