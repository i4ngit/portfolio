import type { Publication } from "@/lib/types";

interface PublicationCitationProps {
  pub: Publication;
  index?: number;
}

const TYPE_LABEL: Record<Publication["type"], string> = {
  journal: "Journal",
  conference: "Conference",
  poster: "Poster",
  preprint: "Preprint",
};

export default function PublicationCitation({ pub, index }: PublicationCitationProps) {
  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      {index !== undefined && (
        <span className="text-gray-300 text-sm font-mono flex-shrink-0 w-5 text-right mt-0.5">
          {index}.
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 leading-snug font-medium">{pub.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{pub.authors}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          <em>{pub.journal}</em>, {pub.year}
          {pub.doi && <span className="text-gray-400"> · doi:{pub.doi}</span>}
        </p>
        <div className="flex gap-3 mt-1.5 items-center">
          <span className="text-xs text-gray-300 border border-gray-200 px-1.5 py-0.5 rounded">
            {TYPE_LABEL[pub.type]}
          </span>
          {pub.link && (
            <a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
              paper ↗
            </a>
          )}
        </div>
        {pub.abstract && (
          <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-3">{pub.abstract}</p>
        )}
      </div>
    </div>
  );
}
