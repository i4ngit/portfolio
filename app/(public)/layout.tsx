import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getHero } from "@/lib/kv";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hero = await getHero();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer name={hero.name} />
    </div>
  );
}
