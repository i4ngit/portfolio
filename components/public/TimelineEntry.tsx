import type { ExperienceEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const TYPE_LABEL: Record<ExperienceEntry["type"], string> = {
  research: "Research",
  clinical: "Clinical",
  volunteer: "Volunteer",
  academic: "Academic",
};

interface TimelineEntryProps {
  entry: ExperienceEntry;
  isLast?: boolean;
}

export default function TimelineEntry({ entry }: TimelineEntryProps) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-semibold text-gray-900">{entry.role}</h3>
            <span className="text-xs text-gray-400">
              {TYPE_LABEL[entry.type]}
            </span>
          </div>
          <p className="text-sm text-gray-600">{entry.organization}</p>
          {entry.location && (
            <p className="text-xs text-gray-400 mt-0.5">{entry.location}</p>
          )}
        </div>
        <span className="text-xs text-gray-400 flex-shrink-0 sm:text-right">
          {formatDate(entry.startDate)} – {formatDate(entry.endDate)}
        </span>
      </div>

      {entry.bullets.length > 0 && (
        <ul className="mt-2.5 space-y-1">
          {entry.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2 text-xs text-gray-500 leading-relaxed">
              <span className="text-gray-300 flex-shrink-0 mt-0.5">·</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
