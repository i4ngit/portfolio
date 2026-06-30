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
    <div className="wide-column py-14 pb-24">
    <div className="page-column">
      {research.length > 0 && (
        <section id="research">
          <p className="section-label">Research</p>
          <h2 className="section-heading">Selected research</h2>
          <ResearchFilters projects={research} tags={allTags} showFilters={true} />
        </section>
      )}

      {sortedPubs.length > 0 && (
        <section className={research.length > 0 ? "section-block" : ""} id="publications">
          <p className="section-label">Publications</p>
          <h2 className="section-heading">Selected work</h2>
          <div>
            {sortedPubs.map((pub, i) => (
              <PublicationCitation key={pub.id} pub={pub} index={i + 1} />
            ))}
          </div>
        </section>
      )}

      {research.length === 0 && sortedPubs.length === 0 && (
        <p className="text-sm text-gray-400 py-8">No research entries yet.</p>
      )}
    </div>
    </div>
  );
}
