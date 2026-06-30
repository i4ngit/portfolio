import type { Metadata } from "next";
import { getNews } from "@/lib/kv";
import NewsList from "@/components/public/NewsList";

export const metadata: Metadata = { title: "News & Updates" };
export const revalidate = 60;

export default async function NewsPage() {
  const news = await getNews();

  const sorted = [...news].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="wide-column py-12">
    <div className="page-column">
      <h1
        className="text-xl font-bold text-gray-900 mb-8"
        style={{ fontFamily: "var(--font-merriweather), Georgia, serif" }}
      >
        News & Updates
      </h1>

      <p className="section-label">Recent updates</p>
      <NewsList posts={sorted} showFilter={true} />
    </div>
    </div>
  );
}
