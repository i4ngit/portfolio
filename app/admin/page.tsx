import { getHero, getResearch, getPublications, getExperience, getMilestones, getNews } from "@/lib/kv";
import Link from "next/link";
import { FlaskConical, Clock, Trophy, Newspaper, Mail, User, Camera, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
  const [hero, research, pubs, experience, milestones, news] = await Promise.all([
    getHero(),
    getResearch(),
    getPublications(),
    getExperience(),
    getMilestones(),
    getNews(),
  ]);

  const cards = [
    { href: "/admin/hero", icon: User, label: "About / Hero", detail: hero.name },
    { href: "/admin/research", icon: FlaskConical, label: "Research Projects", detail: `${research.length} projects · ${pubs.length} publications` },
    { href: "/admin/experience", icon: Clock, label: "Experience", detail: `${experience.length} entries` },
    { href: "/admin/milestones", icon: Trophy, label: "Milestones", detail: `${milestones.filter(m => m.status === "completed").length}/${milestones.length} completed` },
    { href: "/admin/news", icon: Newspaper, label: "News & Updates", detail: `${news.length} posts` },
    { href: "/admin/hobbies", icon: Camera, label: "Off the Clock", detail: "Hobby galleries" },
    { href: "/admin/contact", icon: Mail, label: "Contact Info", detail: hero.email },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your portfolio content.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map(({ href, icon: Icon, label, detail }) => (
          <Link key={href} href={href} className="card flex items-center gap-4 hover:border-gray-400 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">{label}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{detail}</p>
            </div>
            <ArrowRight size={16} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-white border border-gray-200 rounded-xl">
        <p className="text-sm text-gray-500">Changes are saved immediately and appear on the live site within ~60 seconds.</p>
      </div>
    </div>
  );
}
