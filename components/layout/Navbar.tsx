"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#news", label: "News" },
  { href: "/#research", label: "Research" },
  { href: "/#publications", label: "Publications" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
  { href: "/off-the-clock", label: "Off the Clock" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <nav className="wide-column flex items-center justify-between h-20">
        <Link
          href="/"
          className="font-display font-bold text-lg text-gray-900 hover:text-gray-600 transition-colors tracking-tight"
        >
          Ian Ocampo
        </Link>

        <ul className="hidden md:flex items-center gap-1 rounded-full bg-gray-900/85 backdrop-blur-md px-2 py-1.5 shadow-lg">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="block px-4 py-1.5 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden rounded-full bg-gray-900/85 backdrop-blur-md text-gray-200 hover:text-white transition-colors p-2.5"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden wide-column">
          <div className="rounded-2xl bg-gray-900/95 backdrop-blur-md px-5 py-3 space-y-0.5 shadow-lg">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block py-2 text-sm text-gray-300 hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
