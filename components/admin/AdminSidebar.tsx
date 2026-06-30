"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  FlaskConical,
  Clock,
  Trophy,
  Newspaper,
  Mail,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/hero", label: "About / Hero", icon: User },
  { href: "/admin/research", label: "Research", icon: FlaskConical },
  { href: "/admin/experience", label: "Experience", icon: Clock },
  { href: "/admin/milestones", label: "Milestones", icon: Trophy },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/hobbies", label: "Off the Clock", icon: Camera },
  { href: "/admin/contact", label: "Contact", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-56 flex-shrink-0 bg-slate-text min-h-screen flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <p className="font-serif text-white font-bold text-base">Ian Ocampo</p>
        <p className="text-white/40 text-xs mt-0.5">Portfolio Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink size={16} />
          View Site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
