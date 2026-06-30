import { getHero, getResearch, getPublications, getExperience, getMilestones, getNews } from "@/lib/kv";
import Link from "next/link";
import { FlaskConical, Clock, Trophy, Newspaper, Mail, User, ArrowRight } from "lucide-react";

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
    { href: "/admin/hero", icon: User, label: "About / Hero", detail: hero.name, color: "text-navy" },
    { href: "/admin/research", icon: FlaskConical, label: "Research Projects", detail: `${research.length} projects · ${pubs.length} publications`, color: "text-navy" },
    { href: "/admin/experience", icon: Clock, label: "Experience", detail: `${experience.length} entries`, color: "text-green-accent" },
    { href: "/admin/milestones", icon: Trophy, label: "Milestones", detail: `${milestones.filter(m => m.status === 'completed').length}/${milestones.length} completed`, color: "text-amber-600" },
    { href: "/admin/news", icon: Newspaper, label: "News & Updates", detail: `${news.length} posts`, color: "text-navy" },
    { href: "/admin/contact", icon: Mail, label: "Contact Info", detail: hero.email, color: "text-green-accent" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-serif text-slate-text">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Manage your portfolio content.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map(({ href, icon: Icon, label, detail, color }) => (
          <Link key={href} href={href} className="card flex items-center gap-4 hover:border-navy transition-colors group">
            <div className={`w-10 h-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-text text-sm">{label}</p>
              <p className="text-xs text-muted truncate mt-0.5">{detail}</p>
            </div>
            <ArrowRight size={16} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl">
        <p className="text-sm text-navy font-medium">Tip: Changes are saved immediately to Vercel KV and appear on the live site within ~60 seconds.</p>
      </div>
    </div>
  );
}
