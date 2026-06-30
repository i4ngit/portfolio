import type { Metadata } from "next";
import { getResearch, getPublications } from "@/lib/kv";
import SectionHeader from "@/components/public/SectionHeader";
import ResearchCard from "@/components/public/ResearchCard";
import PublicationCitation from "@/components/public/PublicationCitation";
import ResearchFilters from "@/components/public/ResearchFilters";

export const metadata: Metadata = { title: "Research" };
export const revalidate = 60;

export default async function ResearchPage() {
  const [research, publications] = await Promise.all([
    getResearch(),
    getPublications(),
  ]);

  const allTags = [...new Set(research.flatMap((p) => p.tags))].sort();

  return (
    <div className="pt-20">
      <div className="section-container">
        <SectionHeader
          eyebrow="Research"
          title="Research & Publications"
          description="An overview of my ongoing and completed research projects, along with academic publications and presentations."
        />

        {/* Projects */}
        <div className="mb-16">
          <h2 className="text-xl font-semibold text-slate-text mb-6">Projects</h2>
          <ResearchFilters projects={research} tags={allTags} />
        </div>

        {/* Publications */}
        {publications.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-slate-text mb-2">Publications & Presentations</h2>
            <p className="text-sm text-muted mb-6">
              Peer-reviewed articles, conference papers, posters, and preprints.
            </p>
            <div className="card p-0 divide-y divide-border">
              {publications
                .sort((a, b) => b.year - a.year)
                .map((pub) => (
                  <div key={pub.id} className="px-6">
                    <PublicationCitation pub={pub} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
