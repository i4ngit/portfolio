import type { Metadata } from "next";
import { getNews } from "@/lib/kv";
import SectionHeader from "@/components/public/SectionHeader";
import NewsList from "@/components/public/NewsList";

export const metadata: Metadata = { title: "News & Updates" };
export const revalidate = 60;

export default async function NewsPage() {
  const news = await getNews();

  const sorted = [...news].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="pt-20">
      <div className="section-container">
        <SectionHeader
          eyebrow="News"
          title="News & Updates"
          description="Recent achievements, publications, presentations, and milestones."
        />
        <NewsList posts={sorted} />
      </div>
    </div>
  );
}
