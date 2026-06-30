"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/research", label: "Research" },
  { href: "/experience", label: "Experience" },
  { href: "/milestones", label: "Milestones" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isHome && !scrolled
          ? "bg-transparent"
          : "bg-white/95 backdrop-blur-sm border-b border-border shadow-sm"
      )}
    >
      <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "font-serif text-xl font-bold tracking-tight transition-colors duration-300",
            isHome && !scrolled ? "text-white" : "text-slate-text"
          )}
        >
          Ian Ocampo
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                  pathname === href
                    ? "text-navy bg-blue-50"
                    : isHome && !scrolled
                    ? "text-white/90 hover:text-white hover:bg-white/10"
                    : "text-muted hover:text-slate-text hover:bg-surface"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "md:hidden p-2 rounded-md transition-colors",
            isHome && !scrolled
              ? "text-white hover:bg-white/10"
              : "text-slate-text hover:bg-surface"
          )}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden bg-white border-t border-border px-4 py-3 space-y-1 shadow-lg">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                pathname === href
                  ? "text-navy bg-blue-50"
                  : "text-slate-text hover:bg-surface"
              )}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
