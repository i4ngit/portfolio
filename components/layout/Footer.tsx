import Link from "next/link";
import { Mail, Linkedin, FileText } from "lucide-react";

interface FooterProps {
  email?: string;
  linkedin?: string;
  cvUrl?: string;
  name?: string;
}

export default function Footer({
  email = "ian.ocampo@university.edu",
  linkedin = "https://www.linkedin.com/in/ian-ocampo",
  cvUrl = "/cv-placeholder.pdf",
  name = "Ian Ocampo",
}: FooterProps) {
  return (
    <footer className="bg-slate-text text-white/70 mt-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-serif text-white text-lg font-bold">{name}</p>
            <p className="text-sm mt-1">Premed Student &amp; Researcher</p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 text-sm hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail size={15} />
              <span className="hidden sm:inline">{email}</span>
            </a>
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={15} />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a
              href={cvUrl}
              download
              className="flex items-center gap-1.5 text-sm hover:text-white transition-colors"
              aria-label="Download CV"
            >
              <FileText size={15} />
              <span className="hidden sm:inline">CV</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <Link href="/admin/login" className="hover:text-white/60 transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
