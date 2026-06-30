"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/#about", label: "About" },
  { href: "/#news", label: "News" },
  { href: "/#research", label: "Research" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <nav className="max-w-2xl mx-auto px-5 sm:px-8 flex items-center justify-between h-14">
        <Link
          href="/"
          className="text-sm font-medium text-gray-900 hover:text-gray-500 transition-colors"
        >
          Ian Ocampo
        </Link>

        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-gray-400 hover:text-gray-900 transition-colors p-1"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-5 py-3 space-y-0.5">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
