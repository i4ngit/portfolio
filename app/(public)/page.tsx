import {
  getHero,
  getNews,
  getResearch,
  getPublications,
  getExperience,
  getMilestones,
  getContact,
} from "@/lib/kv";
import Hero from "@/components/public/Hero";
import ResearchFilters from "@/components/public/ResearchFilters";
import PublicationCitation from "@/components/public/PublicationCitation";
import TimelineEntry from "@/components/public/TimelineEntry";
import MilestoneItem from "@/components/public/MilestoneItem";
import NewsList from "@/components/public/NewsList";
import { Mail, Linkedin, FileText } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  const [hero, news, research, publications, experience, milestones, contact] = await Promise.all([
    getHero(),
    getNews(),
    getResearch(),
    getPublications(),
    getExperience(),
    getMilestones(),
    getContact(),
  ]);

  const sortedNews = [...news].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const sortedPubs = [...publications].sort((a, b) => b.year - a.year);

  const sortedExp = [...experience].sort((a, b) => {
    const aEnd = a.endDate === "present" ? "9999-12" : a.endDate;
    const bEnd = b.endDate === "present" ? "9999-12" : b.endDate;
    return bEnd.localeCompare(aEnd);
  });

  const allTags = [...new Set(research.flatMap((p) => p.tags))].sort();

  const bioParagraphs = hero.bio.split("\n\n").filter(Boolean);
  const remainingBio = bioParagraphs.slice(1);

  const milestonesByCategory = (
    ["academic", "application", "recognition", "research"] as const
  )
    .map((cat) => ({
      cat,
      label: {
        academic: "Academic",
        application: "Application",
        recognition: "Recognition",
        research: "Research",
      }[cat],
      items: milestones.filter((m) => m.category === cat),
    }))
    .filter(({ items }) => items.length > 0);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <div className="wide-column">
        <Hero hero={hero} />

        {/* ── Content sections: narrow column, aligned to hero ── */}
        <div className="page-column pb-24">

        {/* News */}
        {sortedNews.length > 0 && (
          <section className="section-block" id="news">
            <p className="section-label">News</p>
            <h2 className="section-heading">Recent updates</h2>
            <NewsList posts={sortedNews} showFilter={false} />
          </section>
        )}

        {/* About — remaining bio paragraphs */}
        {remainingBio.length > 0 && (
          <section className="section-block" id="about">
            <p className="section-label">About</p>
            <h2 className="section-heading">More about me</h2>
            <div className="space-y-4">
              {remainingBio.map((para, i) => (
                <p key={i} className="text-sm text-gray-600 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </section>
        )}

        {/* Research Projects */}
        {research.length > 0 && (
          <section className="section-block" id="research">
            <p className="section-label">Research</p>
            <h2 className="section-heading">Selected research</h2>
            <ResearchFilters projects={research} tags={allTags} showFilters={false} />
          </section>
        )}

        {/* Publications — separate section */}
        {sortedPubs.length > 0 && (
          <section className="section-block" id="publications">
            <p className="section-label">Publications</p>
            <h2 className="section-heading">Selected work</h2>
            <div>
              {sortedPubs.map((pub, i) => (
                <PublicationCitation key={pub.id} pub={pub} index={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {sortedExp.length > 0 && (
          <section className="section-block" id="experience">
            <p className="section-label">Experience</p>
            <h2 className="section-heading">Where I&apos;ve worked</h2>
            <div>
              {sortedExp.map((entry) => (
                <TimelineEntry key={entry.id} entry={entry} />
              ))}
            </div>
          </section>
        )}

        {/* Milestones */}
        {milestones.length > 0 && (
          <section className="section-block" id="milestones">
            <p className="section-label">Milestones</p>
            <h2 className="section-heading">Path so far</h2>
            <div className="space-y-8">
              {milestonesByCategory.map(({ cat, label, items }) => (
                <div key={cat}>
                  <p className="text-xs text-gray-400 mb-2 font-medium">{label}</p>
                  <div>
                    {items.map((m) => (
                      <MilestoneItem key={m.id} milestone={m} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section className="section-block" id="contact">
          <p className="section-label">Contact</p>
          <h2 className="section-heading">Let&apos;s connect</h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-md mb-5">
            {contact.blurb ??
              "I'm always happy to connect about research opportunities, clinical experiences, or questions about my work. Feel free to reach out."}
          </p>
          <div className="space-y-2">
            {contact.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail size={13} className="text-gray-400" />
                <a
                  href={`mailto:${contact.email}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {contact.email}
                </a>
              </div>
            )}
            {contact.linkedin && (
              <div className="flex items-center gap-2 text-sm">
                <Linkedin size={13} className="text-gray-400" />
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            )}
            {contact.cvUrl && (
              <div className="flex items-center gap-2 text-sm">
                <FileText size={13} className="text-gray-400" />
                <a
                  href={contact.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  View CV
                </a>
              </div>
            )}
            {contact.institution && (
              <p className="text-xs text-gray-400 mt-3">
                {contact.institution}
                {contact.department && `, ${contact.department}`}
              </p>
            )}
          </div>
        </section>

        </div>
      </div>
    </>
  );
}
