import type { Metadata } from "next";
import { getResearch, getPublications } from "@/lib/kv";
import ResearchFilters from "@/components/public/ResearchFilters";
import PublicationCitation from "@/components/public/PublicationCitation";

export const metadata: Metadata = { title: "Research" };
export const revalidate = 60;

export default async function ResearchPage() {
  const [research, publications] = await Promise.all([
    getResearch(),
    getPublications(),
  ]);

  const allTags = [...new Set(research.flatMap((p) => p.tags))].sort();
  const sortedPubs = [...publications].sort((a, b) => b.year - a.year);

  return (
    <div className="page-column py-12">
      <div className="section-block" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
        <h1 className="text-xl font-bold text-gray-900 mb-8" style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}>
          Research & Publications
        </h1>

        {research.length > 0 && (
          <div className="mb-12">
            <p className="section-label">Projects</p>
            <ResearchFilters projects={research} tags={allTags} showFilters={true} />
          </div>
        )}

        {sortedPubs.length > 0 && (
          <div>
            <p className="section-label">Publications & Presentations</p>
            <div>
              {sortedPubs.map((pub, i) => (
                <PublicationCitation key={pub.id} pub={pub} index={i + 1} />
              ))}
            </div>
          </div>
        )}

        {research.length === 0 && sortedPubs.length === 0 && (
          <p className="text-sm text-gray-400 py-8">No research entries yet.</p>
        )}
      </div>
    </div>
  );
}
