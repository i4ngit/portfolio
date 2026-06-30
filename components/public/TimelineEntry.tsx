import type { ExperienceEntry } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { MapPin } from "lucide-react";

const TYPE_DOT: Record<ExperienceEntry["type"], string> = {
  research: "bg-navy",
  clinical: "bg-green-accent",
  volunteer: "bg-gray-400",
  academic: "bg-slate-600",
};

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

export default function TimelineEntry({ entry, isLast = false }: TimelineEntryProps) {
  return (
    <div className="relative flex gap-6">
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-3.5 h-3.5 rounded-full ring-2 ring-white z-10 mt-1 ${TYPE_DOT[entry.type]}`} />
        {!isLast && <div className="w-px flex-1 bg-border mt-1" />}
      </div>

      {/* Content */}
      <div className="pb-10 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${TYPE_DOT[entry.type]}`}>
            {TYPE_LABEL[entry.type]}
          </span>
          <span className="text-xs text-muted">
            {formatDate(entry.startDate)} – {formatDate(entry.endDate)}
          </span>
        </div>

        <h3 className="font-semibold text-slate-text text-base">{entry.role}</h3>
        <p className="text-sm text-navy">{entry.organization}</p>

        {entry.location && (
          <p className="flex items-center gap-1 text-xs text-muted mt-0.5">
            <MapPin size={11} />
            {entry.location}
          </p>
        )}

        {entry.bullets.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {entry.bullets.map((bullet, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                <span className="text-navy mt-1 flex-shrink-0">·</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
