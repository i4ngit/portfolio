import Link from "next/link";
import { getHero, getResearch, getNews } from "@/lib/kv";
import Hero from "@/components/public/Hero";
import SectionHeader from "@/components/public/SectionHeader";
import ResearchCard from "@/components/public/ResearchCard";
import NewsCard from "@/components/public/NewsCard";
import { FlaskConical, HeartPulse, Award, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default async function HomePage() {
  const [hero, research, news] = await Promise.all([
    getHero(),
    getResearch(),
    getNews(),
  ]);

  const featured = research.filter((r) => r.featured).slice(0, 2);
  const latestNews = [...news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);

  return (
    <>
      <Hero hero={hero} />

      {/* About bio */}
      <section id="about" className="section-container">
        <SectionHeader eyebrow="About" title="Who I Am" />
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="prose-academic">
            <ReactMarkdown>{hero.bio}</ReactMarkdown>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                icon: FlaskConical,
                color: "bg-blue-50 text-navy",
                title: "Research",
                body: "Investigating neurological biomarkers and health equity through bench-to-bedside approaches.",
                href: "/research",
              },
              {
                icon: HeartPulse,
                color: "bg-green-50 text-green-accent",
                title: "Clinical Experience",
                body: "Hands-on patient contact through volunteer positions and clinical research roles.",
                href: "/experience",
              },
              {
                icon: Award,
                color: "bg-amber-50 text-amber-600",
                title: "Milestones",
                body: "Tracking academic, application, and recognition milestones on the path to medicine.",
                href: "/milestones",
              },
            ].map(({ icon: Icon, color, title, body, href }) => (
              <Link
                key={title}
                href={href}
                className="card flex items-start gap-4 hover:border-navy transition-colors group"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-text text-sm flex items-center gap-1 group-hover:text-navy transition-colors">
                    {title} <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-muted mt-1 leading-relaxed">{body}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured research */}
      {featured.length > 0 && (
        <section className="bg-surface py-16">
          <div className="section-container py-0">
            <div className="flex items-end justify-between mb-8">
              <SectionHeader eyebrow="Research" title="Featured Projects" />
              <Link href="/research" className="text-sm text-navy hover:underline flex items-center gap-1 mb-10">
                All projects <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((p) => (
                <ResearchCard key={p.id} project={p} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest news */}
      {latestNews.length > 0 && (
        <section className="section-container">
          <div className="flex items-end justify-between mb-8">
            <SectionHeader eyebrow="News" title="Latest Updates" />
            <Link href="/news" className="text-sm text-navy hover:underline flex items-center gap-1 mb-10">
              All news <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-4">
            {latestNews.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
