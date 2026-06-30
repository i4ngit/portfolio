import type { Publication } from "@/lib/types";
import { ExternalLink } from "lucide-react";
import { TYPE_COLORS } from "@/lib/utils";

interface PublicationCitationProps {
  pub: Publication;
}

export default function PublicationCitation({ pub }: PublicationCitationProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-border last:border-0 group">
      <div className="flex-shrink-0 mt-0.5">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${TYPE_COLORS[pub.type] ?? "bg-gray-100 text-gray-700"}`}>
          {pub.type.charAt(0).toUpperCase() + pub.type.slice(1)}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-slate-text leading-snug">{pub.title}</h4>
          {pub.link && (
            <a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 text-muted hover:text-navy transition-colors opacity-0 group-hover:opacity-100"
              aria-label="View publication"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
        <p className="text-xs text-muted mt-0.5">{pub.authors}</p>
        <p className="text-xs text-navy mt-0.5">
          <em>{pub.journal}</em>, {pub.year}
          {pub.doi && (
            <span className="ml-1 not-italic text-muted">· DOI: {pub.doi}</span>
          )}
        </p>
        {pub.abstract && (
          <p className="text-xs text-muted mt-2 leading-relaxed line-clamp-3">{pub.abstract}</p>
        )}
      </div>
    </div>
  );
}
