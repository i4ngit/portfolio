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
      <p className="section-label">News</p>
      <h1 className="section-heading">Recent updates</h1>
      <NewsList posts={sorted} showFilter={true} />
    </div>
    </div>
  );
}
