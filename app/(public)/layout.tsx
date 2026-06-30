import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getHero, getContact } from "@/lib/kv";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hero, contact] = await Promise.all([getHero(), getContact()]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer
        email={contact.email}
        linkedin={contact.linkedin}
        cvUrl={contact.cvUrl}
        name={hero.name}
      />
    </div>
  );
}
